import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/serverAuth";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || !body.code) {
      return NextResponse.json(
        { valid: false, message: "Please enter a coupon code." },
        { status: 400 }
      );
    }

    const rawCode = String(body.code).trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
    if (!rawCode) {
      return NextResponse.json(
        { valid: false, message: "Invalid coupon code format." },
        { status: 400 }
      );
    }

    const items = Array.isArray(body.items) ? body.items : [];
    if (items.length === 0) {
      return NextResponse.json(
        { valid: false, message: "Cart is empty. Add products to apply coupon." },
        { status: 400 }
      );
    }

    const userEmail = body.userEmail ? String(body.userEmail).trim().toLowerCase() : undefined;

    const db = getAdminDb();
    let couponData: any = null;

    // 1. Fetch coupon from Firestore
    try {
      const couponDoc = await db.collection("coupons").doc(rawCode).get();
      if (couponDoc.exists) {
        couponData = couponDoc.data();
      } else {
        const querySnap = await db.collection("coupons").where("code", "==", rawCode).limit(1).get();
        if (!querySnap.empty) {
          couponData = querySnap.docs[0].data();
        }
      }
    } catch (err: any) {
      console.warn("Firestore coupon fetch warning:", err.message);
    }

    // 2. Fallback to hardcoded seed definitions if not in DB
    if (!couponData) {
      const HARDCODED_SEEDS: Record<string, any> = {
        KOLKATA10: {
          code: "KOLKATA10",
          description: "10% OFF on all sports gear",
          discountType: "percentage",
          discountValue: 10,
          appliesTo: "all",
          active: true,
          minimumOrderValue: 0,
        },
        RPBAT20: {
          code: "RPBAT20",
          description: "20% OFF on Kashmir & English Willow Cricket Bats",
          discountType: "percentage",
          discountValue: 20,
          appliesTo: "specific",
          productIds: ["rp-001", "rp-002", "rp-7070", "rp-premium-bat", "rp-kashmir-350", "rp-english-pro"],
          minimumOrderValue: 1500,
          maximumDiscount: 2000,
          active: true,
        },
        WELCOME500: {
          code: "WELCOME500",
          description: "₹500 Flat OFF on club gear",
          discountType: "fixed",
          discountValue: 500,
          appliesTo: "all",
          active: true,
          minimumOrderValue: 2000,
        },
      };
      couponData = HARDCODED_SEEDS[rawCode];
    }

    if (!couponData) {
      return NextResponse.json(
        { valid: false, message: `Coupon code '${rawCode}' is invalid.` },
        { status: 404 }
      );
    }

    // 3. Validation: Active status
    if (couponData.active === false) {
      return NextResponse.json(
        { valid: false, message: `Coupon '${rawCode}' is currently disabled.` },
        { status: 400 }
      );
    }

    const now = new Date();

    // 4. Validation: Start Date
    if (couponData.startDate) {
      const startDate = new Date(couponData.startDate);
      if (now < startDate) {
        return NextResponse.json(
          { valid: false, message: `Coupon '${rawCode}' is not active yet.` },
          { status: 400 }
        );
      }
    }

    // 5. Validation: Expiry Date
    if (couponData.expiryDate) {
      const expiryDate = new Date(couponData.expiryDate);
      if (now > expiryDate) {
        return NextResponse.json(
          { valid: false, message: `Coupon '${rawCode}' has expired.` },
          { status: 400 }
        );
      }
    }

    // 6. Validation: Total Usage Limit
    if (couponData.usageLimit && typeof couponData.usageLimit === "number") {
      const currentUsage = couponData.usageCount || 0;
      if (currentUsage >= couponData.usageLimit) {
        return NextResponse.json(
          { valid: false, message: `Coupon '${rawCode}' usage limit has been reached.` },
          { status: 400 }
        );
      }
    }

    // 7. Validation: Per-Customer Usage Limit
    if (userEmail && couponData.usagePerCustomer) {
      try {
        const userOrdersSnap = await db
          .collection("orders")
          .where("userEmail", "==", userEmail)
          .where("couponCode", "==", rawCode)
          .get();

        if (userOrdersSnap.size >= couponData.usagePerCustomer) {
          return NextResponse.json(
            {
              valid: false,
              message: `You have already used coupon '${rawCode}' the maximum allowed times (${couponData.usagePerCustomer}).`,
            },
            { status: 400 }
          );
        }
      } catch (err: any) {
        console.warn("User order count check warning:", err.message);
      }
    }

    // 8. Fetch live product prices from DB to prevent client price tampering
    let eligibleSubtotal = 0;
    let totalCartSubtotal = 0;
    const applicableProductIds: string[] = couponData.appliesTo === "specific" && Array.isArray(couponData.productIds)
      ? couponData.productIds
      : [];

    for (const item of items) {
      const prodId = item.product?.id;
      const qty = Number(item.quantity) || 1;
      if (!prodId) continue;

      let itemPrice = Number(item.product?.price) || 0;
      try {
        const prodSnap = await db.collection("products").doc(prodId).get();
        if (prodSnap.exists) {
          itemPrice = Number(prodSnap.data()?.price) || itemPrice;
        }
      } catch {}

      const itemTotal = itemPrice * qty;
      totalCartSubtotal += itemTotal;

      if (couponData.appliesTo === "all" || applicableProductIds.includes(prodId)) {
        eligibleSubtotal += itemTotal;
      }
    }

    // 9. Validation: Applicability
    if (couponData.appliesTo === "specific" && eligibleSubtotal === 0) {
      return NextResponse.json(
        {
          valid: false,
          message: `Coupon '${rawCode}' is not applicable to any products in your cart.`,
        },
        { status: 400 }
      );
    }

    // 10. Validation: Minimum Order Value
    const minOrderVal = Number(couponData.minimumOrderValue) || 0;
    if (minOrderVal > 0 && totalCartSubtotal < minOrderVal) {
      return NextResponse.json(
        {
          valid: false,
          message: `Minimum cart value of ₹${minOrderVal.toLocaleString("en-IN")} required for coupon '${rawCode}'. (Current: ₹${totalCartSubtotal.toLocaleString("en-IN")})`,
        },
        { status: 400 }
      );
    }

    // 11. Calculate Authoritative Discount
    let discountAmount = 0;
    const discountVal = Number(couponData.discountValue) || 0;

    if (couponData.discountType === "fixed") {
      discountAmount = Math.min(discountVal, eligibleSubtotal);
    } else {
      // Percentage discount
      discountAmount = Math.round((eligibleSubtotal * discountVal) / 100);
      if (couponData.maximumDiscount && typeof couponData.maximumDiscount === "number" && couponData.maximumDiscount > 0) {
        discountAmount = Math.min(discountAmount, couponData.maximumDiscount);
      }
    }

    discountAmount = Math.max(0, Math.min(discountAmount, eligibleSubtotal));

    return NextResponse.json({
      valid: true,
      message: `Coupon '${rawCode}' applied successfully! Saved ₹${discountAmount.toLocaleString("en-IN")}.`,
      coupon: {
        code: rawCode,
        description: couponData.description || `${discountVal}${couponData.discountType === "fixed" ? "₹" : "%"} OFF`,
        discountType: couponData.discountType || "percentage",
        discountValue: discountVal,
        appliesTo: couponData.appliesTo || "all",
        productIds: applicableProductIds,
        maximumDiscount: couponData.maximumDiscount,
        minimumOrderValue: minOrderVal,
      },
      discountAmount,
      eligibleSubtotal,
      totalCartSubtotal,
    });
  } catch (err: any) {
    console.error("Error in POST /api/coupons/validate:", err);
    return NextResponse.json(
      { valid: false, message: err.message || "Failed to validate coupon." },
      { status: 500 }
    );
  }
}
