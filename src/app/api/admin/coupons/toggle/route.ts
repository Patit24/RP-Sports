import { NextResponse } from "next/server";
import { verifyAdmin, getAdminDb } from "@/lib/serverAuth";
import { FieldValue } from "firebase-admin/firestore";

export async function PATCH(request: Request) {
  try {
    const adminUser = await verifyAdmin(request);
    if (!adminUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Administrator credentials required." },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || !body.id) {
      return NextResponse.json(
        { success: false, message: "Coupon ID is required." },
        { status: 400 }
      );
    }

    const { id, active } = body;
    const newStatus = typeof active === "boolean" ? active : true;

    const db = getAdminDb();
    const couponRef = db.collection("coupons").doc(id);
    const snap = await couponRef.get();

    if (!snap.exists) {
      return NextResponse.json(
        { success: false, message: "Coupon not found." },
        { status: 404 }
      );
    }

    await couponRef.update({
      active: newStatus,
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: adminUser.email || adminUser.uid,
    });

    return NextResponse.json({
      success: true,
      message: `Coupon '${snap.data()?.code || id}' ${newStatus ? "enabled" : "disabled"}.`,
      id,
      active: newStatus,
    });
  } catch (err: any) {
    console.error("Error in PATCH /api/admin/coupons/toggle:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to toggle coupon status." },
      { status: 500 }
    );
  }
}
