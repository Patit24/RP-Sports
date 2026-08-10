import { NextResponse } from "next/server";
import { testShiprocketConnection } from "@/lib/shiprocketService";

export async function GET() {
  try {
    const result = await testShiprocketConnection();
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { connected: false, apiStatus: "Error", error: err.message || "Failed to execute connection test." },
      { status: 500 }
    );
  }
}
