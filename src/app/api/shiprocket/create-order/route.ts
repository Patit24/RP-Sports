import { NextResponse } from "next/server";
import { createShiprocketOrder } from "@/lib/shiprocketService";
import { getOrderDocumentId, updateOrderInDB } from "@/lib/firestoreService";
import type { Order } from "@/lib/store";

export async function POST(request: Request) {
  try {
    const order: Order = await request.json();
    if (!order || !order.id || !order.shippingAddress) {
      return NextResponse.json(
        { success: false, message: "Invalid order data payload." },
        { status: 400 }
      );
    }

    const res = await createShiprocketOrder(order);
    
    // Synchronize to Firestore database
    const docId = await getOrderDocumentId(order.id);
    if (docId) {
      if (res.success && res.orderId) {
        await updateOrderInDB(docId, {
          shiprocket_order_id: res.orderId,
          shiprocket_shipment_id: res.shipmentId,
          awb_code: res.awbCode,
          courier_name: res.courierName,
          shipping_status: res.status || "NEW",
          pickup_status: res.awbCode ? "Scheduled" : "Not Scheduled",
          shiprocket_status: res.status || "NEW",
        });
      } else {
        await updateOrderInDB(docId, {
          shipping_status: "Failed",
          shiprocket_status: res.message || "Shiprocket registration failed",
        });
      }
    }

    return NextResponse.json(res);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to create Shiprocket order." },
      { status: 500 }
    );
  }
}
