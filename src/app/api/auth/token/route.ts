import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("firebase_custom_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Token not found or expired" }, { status: 400 });
    }

    const response = NextResponse.json({ token });
    // Securely delete the token cookie immediately after consumption
    response.cookies.delete("firebase_custom_token");
    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
