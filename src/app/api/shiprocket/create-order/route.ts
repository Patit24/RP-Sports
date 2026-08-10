import { NextResponse } from "next/server";
import { createShiprocketOrder } from "@/lib/shiprocketService";
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
    return NextResponse.json(res);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to create Shiprocket order." },
      { status: 500 }
    );
  }
}
