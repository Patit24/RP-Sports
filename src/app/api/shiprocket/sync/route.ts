import { NextResponse } from "next/server";
import { getAllOrders, updateOrderInDB } from "@/lib/firestoreService";
import { trackShiprocketOrder } from "@/lib/shiprocketService";
import { verifyAdmin } from "@/lib/serverAuth";
import type { Order } from "@/lib/store";

export async function POST(request: Request) {
  try {
    // Verify admin permission
    const adminUser = await verifyAdmin(request);
    if (!adminUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Administrator credentials required." },
        { status: 401 }
      );
    }

    const orders = await getAllOrders();
    let syncedCount = 0;

    for (const order of orders) {
      // Only sync orders that have been pushed to Shiprocket and are not in terminal states
      if (
        (order.awb_code || order.shiprocket_order_id) && 
        order.status !== "Delivered" && 
        order.status !== "Cancelled"
      ) {
        const trackingKey = order.awb_code || String(order.shiprocket_order_id);
        const trackRes = await trackShiprocketOrder(trackingKey);

        if (trackRes.success && trackRes.trackingData) {
          const tData = trackRes.trackingData;
          const updatePayload: Partial<Order> = {
            awb_code: tData.awb_code || order.awb_code,
            courier_name: tData.courier_name || order.courier_name,
            shipping_status: tData.current_status || order.shipping_status,
            pickup_status: tData.pickup_date ? "Scheduled" : "Not Scheduled",
            pickup_scheduled_at: tData.pickup_date || order.pickup_scheduled_at,
            delivered_at: tData.delivered_date || order.delivered_at,
          };

          // Map Shiprocket status to local order status
          const currentStatus = (tData.current_status || "").toLowerCase();
          if (currentStatus.includes("deliver")) {
            updatePayload.status = "Delivered";
          } else if (currentStatus.includes("out for delivery")) {
            updatePayload.status = "Out for Delivery";
          } else if (
            currentStatus.includes("transit") || 
            currentStatus.includes("shipped") || 
            currentStatus.includes("picked up") ||
            currentStatus.includes("pick")
          ) {
            updatePayload.status = "Shipped";
          } else if (
            currentStatus.includes("ready") || 
            currentStatus.includes("schedule") || 
            currentStatus.includes("packed")
          ) {
            updatePayload.status = "Packed";
          }

          // Sync back to database
          if (order.firestoreId) {
            await updateOrderInDB(order.firestoreId, updatePayload);
            syncedCount++;
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      syncedCount,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to sync orders status." },
      { status: 500 }
    );
  }
}
