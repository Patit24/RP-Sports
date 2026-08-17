import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, getAdminDb } from "@/lib/serverAuth";

export async function POST(req: NextRequest) {
  try {
    const adminUser = await verifyAdmin(req);
    if (!adminUser) {
      return NextResponse.json(
        { error: "Unauthorized. Administrator credentials required." },
        { status: 401 }
      );
    }

    const { id, status } = await req.json().catch(() => ({}));

    if (!id || !status) {
      return NextResponse.json({ error: "Missing enquiry id or status." }, { status: 400 });
    }

    const VALID_STATUSES = ["New", "Contacted", "Quotation Sent", "Confirmed", "In Production", "Completed", "Cancelled"];
    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status value." }, { status: 400 });
    }

    const db = getAdminDb();
    if (db) {
      try {
        await db.collection("bulk_enquiries").doc(id).update({
          status,
          updatedAt: new Date().toISOString(),
          updatedBy: adminUser.email || adminUser.uid,
        });
      } catch (err) {
        console.warn("Firestore update enquiry status error:", err);
      }
    }

    return NextResponse.json({ success: true, message: `Status updated to ${status}` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update status." }, { status: 500 });
  }
}
