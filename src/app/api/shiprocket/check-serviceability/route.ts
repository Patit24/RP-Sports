import { NextResponse } from "next/server";
import { checkPincodeServiceability } from "@/lib/shiprocketService";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pincode = searchParams.get("pincode") || "700028";
  const weight = parseFloat(searchParams.get("weight") || "1.2");

  if (!pincode || pincode.length !== 6) {
    return NextResponse.json(
      { serviceable: false, message: "Please enter a valid 6-digit pincode." },
      { status: 400 }
    );
  }

  const result = await checkPincodeServiceability(pincode, weight);
  return NextResponse.json(result);
}
