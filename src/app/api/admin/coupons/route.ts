import { NextResponse } from "next/server";
import { verifyAdmin, getAdminDb } from "@/lib/serverAuth";
import { FieldValue } from "firebase-admin/firestore";

export interface CouponData {
  id?: string;
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  appliesTo: "all" | "specific";
  productIds?: string[];
  minimumOrderValue?: number;
  maximumDiscount?: number;
  startDate?: string;
  expiryDate?: string;
  usageLimit?: number;
  usageCount?: number;
  usagePerCustomer?: number;
  active: boolean;
  createdAt?: any;
  updatedAt?: any;
  createdBy?: string;
}

// Default fallback coupons for initial seed
const DEFAULT_COUPONS: Omit<CouponData, "id">[] = [
  {
    code: "KOLKATA10",
    description: "10% OFF on all sports gear across entire store",
    discountType: "percentage",
    discountValue: 10,
    appliesTo: "all",
    minimumOrderValue: 0,
    active: true,
    usageLimit: 1000,
    usageCount: 0,
    usagePerCustomer: 1,
  },
  {
    code: "RPBAT20",
    description: "20% OFF on Kashmir & English Willow Cricket Bats",
    discountType: "percentage",
    discountValue: 20,
    appliesTo: "specific",
    productIds: ["rp-001", "rp-002", "rp-7070", "rp-premium-bat", "rp-kashmir-350", "rp-english-pro"],
    minimumOrderValue: 1500,
    maximumDiscount: 2000,
    active: true,
    usageLimit: 500,
    usageCount: 0,
    usagePerCustomer: 1,
  },
  {
    code: "WELCOME500",
    description: "₹500 Flat OFF for new club registrations",
    discountType: "fixed",
    discountValue: 500,
    appliesTo: "all",
    minimumOrderValue: 2000,
    active: true,
    usageLimit: 200,
    usageCount: 0,
    usagePerCustomer: 1,
  },
];

// Helper to normalize ISO date from Firestore Timestamp
function normalizeDate(val: any): string | undefined {
  if (!val) return undefined;
  if (typeof val.toDate === "function") return val.toDate().toISOString();
  if (val.seconds !== undefined) return new Date(val.seconds * 1000).toISOString();
  if (val instanceof Date) return val.toISOString();
  return String(val);
}

// GET: Fetch all coupons
export async function GET(request: Request) {
  try {
    const adminUser = await verifyAdmin(request);
    if (!adminUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Administrator credentials required." },
        { status: 401 }
      );
    }

    const db = getAdminDb();
    const couponsRef = db.collection("coupons");
    const snapshot = await couponsRef.get();

    // If coupons collection is empty, auto-seed default coupons
    if (snapshot.empty) {
      const seeded: CouponData[] = [];
      for (const def of DEFAULT_COUPONS) {
        const docRef = couponsRef.doc(def.code);
        const data = {
          ...def,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
          createdBy: "system_init",
        };
        await docRef.set(data);
        seeded.push({ ...def, id: def.code, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
      }
      return NextResponse.json({ success: true, coupons: seeded });
    }

    const coupons: CouponData[] = snapshot.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id,
        code: d.code || doc.id,
        description: d.description || "",
        discountType: d.discountType || "percentage",
        discountValue: Number(d.discountValue) || 0,
        appliesTo: d.appliesTo || "all",
        productIds: Array.isArray(d.productIds) ? d.productIds : [],
        minimumOrderValue: Number(d.minimumOrderValue) || 0,
        maximumDiscount: d.maximumDiscount ? Number(d.maximumDiscount) : undefined,
        startDate: d.startDate || undefined,
        expiryDate: d.expiryDate || undefined,
        usageLimit: d.usageLimit ? Number(d.usageLimit) : undefined,
        usageCount: Number(d.usageCount) || 0,
        usagePerCustomer: Number(d.usagePerCustomer) || 1,
        active: d.active !== false,
        createdAt: normalizeDate(d.createdAt),
        updatedAt: normalizeDate(d.updatedAt),
        createdBy: d.createdBy,
      };
    });

    return NextResponse.json({ success: true, coupons });
  } catch (err: any) {
    console.error("Error in GET /api/admin/coupons:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to fetch coupons." },
      { status: 500 }
    );
  }
}

// POST: Create or Update a Coupon
export async function POST(request: Request) {
  try {
    const adminUser = await verifyAdmin(request);
    if (!adminUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Administrator credentials required." },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || !body.code) {
      return NextResponse.json(
        { success: false, message: "Coupon code is required." },
        { status: 400 }
      );
    }

    const rawCode = String(body.code).trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
    if (!rawCode || rawCode.length < 2 || rawCode.length > 25) {
      return NextResponse.json(
        { success: false, message: "Coupon code must be 2 to 25 alphanumeric characters." },
        { status: 400 }
      );
    }

    const discountType: "percentage" | "fixed" = body.discountType === "fixed" ? "fixed" : "percentage";
    const discountValue = Number(body.discountValue);

    if (isNaN(discountValue) || discountValue <= 0) {
      return NextResponse.json(
        { success: false, message: "Discount value must be greater than 0." },
        { status: 400 }
      );
    }

    if (discountType === "percentage" && discountValue > 100) {
      return NextResponse.json(
        { success: false, message: "Percentage discount cannot exceed 100%." },
        { status: 400 }
      );
    }

    const appliesTo: "all" | "specific" = body.appliesTo === "specific" ? "specific" : "all";
    const productIds: string[] = appliesTo === "specific" && Array.isArray(body.productIds) ? body.productIds : [];

    if (appliesTo === "specific" && productIds.length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one product must be selected for specific product coupons." },
        { status: 400 }
      );
    }

    const minimumOrderValue = body.minimumOrderValue ? Math.max(0, Number(body.minimumOrderValue)) : 0;
    const maximumDiscount = body.maximumDiscount ? Math.max(0, Number(body.maximumDiscount)) : undefined;
    const usageLimit = body.usageLimit ? Math.max(1, Number(body.usageLimit)) : undefined;
    const usagePerCustomer = body.usagePerCustomer ? Math.max(1, Number(body.usagePerCustomer)) : 1;
    const active = body.active !== false;
    const description = body.description?.trim() || `${discountValue}${discountType === "percentage" ? "%" : " ₹"} OFF on ${appliesTo === "all" ? "store catalog" : `${productIds.length} select items`}`;

    const db = getAdminDb();
    const docId = body.id || rawCode;
    const couponRef = db.collection("coupons").doc(docId);
    const existingDoc = await couponRef.get();

    // Check duplicate code if creating a new coupon with a different ID
    if (!existingDoc.exists && docId !== rawCode) {
      const codeCheck = await db.collection("coupons").where("code", "==", rawCode).get();
      if (!codeCheck.empty) {
        return NextResponse.json(
          { success: false, message: `A coupon with code '${rawCode}' already exists.` },
          { status: 400 }
        );
      }
    }

    const couponPayload: any = {
      code: rawCode,
      description,
      discountType,
      discountValue,
      appliesTo,
      productIds,
      minimumOrderValue,
      maximumDiscount: maximumDiscount || null,
      startDate: body.startDate || null,
      expiryDate: body.expiryDate || null,
      usageLimit: usageLimit || null,
      usageCount: existingDoc.exists ? existingDoc.data()?.usageCount || 0 : 0,
      usagePerCustomer,
      active,
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: adminUser.email || adminUser.uid,
    };

    if (!existingDoc.exists) {
      couponPayload.createdAt = FieldValue.serverTimestamp();
      couponPayload.createdBy = adminUser.email || adminUser.uid;
    }

    await couponRef.set(couponPayload, { merge: true });

    return NextResponse.json({
      success: true,
      message: existingDoc.exists ? `Coupon '${rawCode}' updated successfully.` : `Coupon '${rawCode}' created successfully.`,
      coupon: {
        ...couponPayload,
        id: docId,
      },
    });
  } catch (err: any) {
    console.error("Error in POST /api/admin/coupons:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to save coupon." },
      { status: 500 }
    );
  }
}

// DELETE: Archive or delete a coupon
export async function DELETE(request: Request) {
  try {
    const adminUser = await verifyAdmin(request);
    if (!adminUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Administrator credentials required." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Coupon ID is required." },
        { status: 400 }
      );
    }

    const db = getAdminDb();
    const couponRef = db.collection("coupons").doc(id);
    const docSnap = await couponRef.get();

    if (!docSnap.exists) {
      return NextResponse.json(
        { success: false, message: "Coupon not found." },
        { status: 404 }
      );
    }

    // Delete coupon from Firestore
    await couponRef.delete();

    return NextResponse.json({
      success: true,
      message: `Coupon '${docSnap.data()?.code || id}' deleted successfully.`,
    });
  } catch (err: any) {
    console.error("Error in DELETE /api/admin/coupons:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to delete coupon." },
      { status: 500 }
    );
  }
}
