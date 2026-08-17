import { NextResponse } from "next/server";
import { verifyAdmin, getAdminDb } from "@/lib/serverAuth";
import { FieldValue } from "firebase-admin/firestore";

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
    if (!body || !body.orderId || !body.status) {
      return NextResponse.json(
        { success: false, message: "orderId and status are required." },
        { status: 400 }
      );
    }

    const { orderId, status } = body;
    const db = getAdminDb();

    // 1. Try to find order by document ID or by order.id (e.g. ORD-...)
    let orderDocRef = db.collection("orders").doc(orderId);
    let orderDoc = await orderDocRef.get();

    if (!orderDoc.exists && orderId.startsWith("ORD-")) {
      const querySnap = await db.collection("orders").where("id", "==", orderId).limit(1).get();
      if (!querySnap.empty) {
        orderDocRef = querySnap.docs[0].ref;
        orderDoc = querySnap.docs[0];
      }
    }

    if (!orderDoc.exists) {
      return NextResponse.json(
        { success: false, message: `Order '${orderId}' not found.` },
        { status: 404 }
      );
    }

    await orderDocRef.update({
      status,
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: adminUser.email || adminUser.uid,
    });

    return NextResponse.json({
      success: true,
      message: `Order '${orderId}' status updated to '${status}'.`,
      orderId,
      status,
    });
  } catch (err: any) {
    console.error("Error in /api/admin/orders/update-status:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to update order status." },
      { status: 500 }
    );
  }
}
