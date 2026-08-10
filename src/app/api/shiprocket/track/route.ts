import { NextResponse } from "next/server";
import { trackShiprocketOrder } from "@/lib/shiprocketService";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const awbOrOrderId = searchParams.get("awb") || searchParams.get("orderId") || "";

  if (!awbOrOrderId) {
    return NextResponse.json(
      { success: false, message: "Tracking AWB or Order ID required." },
      { status: 400 }
    );
  }

  const result = await trackShiprocketOrder(awbOrOrderId);
  return NextResponse.json(result);
}
