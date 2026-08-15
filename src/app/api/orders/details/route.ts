import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/serverAuth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id")?.trim() || "";

  if (!id) {
    return NextResponse.json(
      { success: false, message: "Order ID or tracking number required." },
      { status: 400 }
    );
  }

  try {
    const db = getAdminDb();
    
    // 1. Search by custom Order ID (e.g. ORD-123456)
    let snap = await db.collection("orders").where("id", "==", id).limit(1).get();
    
    // 2. Fallback: Search by awb_code
    if (snap.empty) {
      snap = await db.collection("orders").where("awb_code", "==", id).limit(1).get();
    }
    
    // 3. Fallback: Search by trackingNumber
    if (snap.empty) {
      snap = await db.collection("orders").where("trackingNumber", "==", id).limit(1).get();
    }

    if (snap.empty) {
      return NextResponse.json(
        { success: false, message: "Order not found with the provided identifier." },
        { status: 404 }
      );
    }

    const doc = snap.docs[0];
    const orderData = doc.data();
    
    // Convert Firestore Timestamp to ISO string if exists
    let createdAtIso = new Date().toISOString();
    if (orderData.createdAt) {
      if (typeof orderData.createdAt.toDate === "function") {
        createdAtIso = orderData.createdAt.toDate().toISOString();
      } else if (orderData.createdAt.seconds !== undefined) {
        createdAtIso = new Date(orderData.createdAt.seconds * 1000).toISOString();
      } else {
        createdAtIso = new Date(orderData.createdAt).toISOString();
      }
    }

    // Return sanitized order data to prevent leakage of internal auth fields
    return NextResponse.json({
      success: true,
      order: {
        id: orderData.id,
        status: orderData.status,
        courier_name: orderData.courier_name,
        awb_code: orderData.awb_code,
        trackingNumber: orderData.trackingNumber,
        shippingAddress: orderData.shippingAddress,
        deliveryPartnerInfo: orderData.deliveryPartnerInfo,
        items: orderData.items,
        total: orderData.total,
        createdAt: createdAtIso,
      }
    });

  } catch (err: any) {
    console.error("Order details API lookup failed:", err.message);
    return NextResponse.json(
      { success: false, message: "Failed to retrieve order details securely." },
      { status: 500 }
    );
  }
}
