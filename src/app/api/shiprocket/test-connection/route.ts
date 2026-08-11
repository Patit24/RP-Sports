import { NextResponse } from "next/server";
import { testShiprocketConnection } from "@/lib/shiprocketService";
import { verifyAdmin } from "@/lib/serverAuth";

export async function GET(request: Request) {
  try {
    // Verify admin permission
    const adminUser = await verifyAdmin(request);
    if (!adminUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Administrator credentials required." },
        { status: 401 }
      );
    }

    const result = await testShiprocketConnection();
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { connected: false, apiStatus: "Error", error: err.message || "Failed to execute connection test." },
      { status: 500 }
    );
  }
}
