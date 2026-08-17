import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/serverAuth";

export interface BulkJerseyEnquiry {
  id: string;
  enquiryId: string;
  productId: string;
  productName: string;
  productSku?: string;
  quantity: number;
  printingOption: string;
  customPrintingNotes?: string;
  sizeBreakdown: Record<string, number>;
  noSizeBreakdownYet: boolean;
  customerName: string;
  phone: string;
  email?: string;
  teamName?: string;
  deliveryCity: string;
  deliveryAddress?: string;
  additionalNotes?: string;
  status: "New" | "Contacted" | "Quotation Sent" | "Confirmed" | "In Production" | "Completed" | "Cancelled";
  createdAt: string;
}

// In-memory fallback if Firestore is unreachable
let inMemoryEnquiries: BulkJerseyEnquiry[] = [
  {
    id: "bq-demo-101",
    enquiryId: "BQ-1024",
    productId: "rp-jsy-india",
    productName: "Team India Match Edition Pro Cricket Jersey 2026",
    productSku: "RP-JSY-IND26",
    quantity: 45,
    printingOption: "Player Name + Number + Team Logo",
    customPrintingNotes: "",
    sizeBreakdown: { S: 5, M: 15, L: 15, XL: 10 },
    noSizeBreakdownYet: false,
    customerName: "Patit Roy",
    phone: "+91 98300 12345",
    email: "patit@kolkatasports.org",
    teamName: "Kolkata Titans Cricket Club",
    deliveryCity: "Kolkata",
    deliveryAddress: "Dumdum Park, Kolkata 700055",
    additionalNotes: "Need club crest on chest and tournament date 28th September.",
    status: "New",
    createdAt: new Date().toISOString(),
  }
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      productId,
      productName,
      productSku,
      quantity,
      printingOption,
      customPrintingNotes,
      sizeBreakdown,
      noSizeBreakdownYet,
      customerName,
      phone,
      email,
      teamName,
      deliveryCity,
      deliveryAddress,
      additionalNotes,
    } = body;

    // Strict Validations
    if (!customerName || typeof customerName !== "string" || !customerName.trim()) {
      return NextResponse.json({ error: "Customer name is required." }, { status: 400 });
    }

    if (!phone || typeof phone !== "string" || !phone.trim()) {
      return NextResponse.json({ error: "Valid WhatsApp phone number is required." }, { status: 400 });
    }

    const parsedQty = Number(quantity);
    if (isNaN(parsedQty) || parsedQty < 10 || parsedQty > 10000) {
      return NextResponse.json({ error: "Bulk orders require a minimum quantity of 10 jerseys." }, { status: 400 });
    }

    if (!deliveryCity || typeof deliveryCity !== "string" || !deliveryCity.trim()) {
      return NextResponse.json({ error: "Delivery city is required." }, { status: 400 });
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const enquiryId = `BQ-${randomSuffix}`;
    const id = `enq_${Date.now()}_${randomSuffix}`;

    const newEnquiry: BulkJerseyEnquiry = {
      id,
      enquiryId,
      productId: String(productId || "jersey-general"),
      productName: String(productName || "Custom Match Jersey"),
      productSku: productSku ? String(productSku) : undefined,
      quantity: parsedQty,
      printingOption: String(printingOption || "Player Name + Number"),
      customPrintingNotes: customPrintingNotes ? String(customPrintingNotes).slice(0, 500) : "",
      sizeBreakdown: sizeBreakdown && typeof sizeBreakdown === "object" ? sizeBreakdown : {},
      noSizeBreakdownYet: Boolean(noSizeBreakdownYet),
      customerName: customerName.trim().slice(0, 100),
      phone: phone.trim().slice(0, 20),
      email: email ? email.trim().slice(0, 100) : undefined,
      teamName: teamName ? teamName.trim().slice(0, 100) : undefined,
      deliveryCity: deliveryCity.trim().slice(0, 100),
      deliveryAddress: deliveryAddress ? deliveryAddress.trim().slice(0, 250) : undefined,
      additionalNotes: additionalNotes ? additionalNotes.trim().slice(0, 1000) : undefined,
      status: "New",
      createdAt: new Date().toISOString(),
    };

    const db = getAdminDb();
    if (db) {
      try {
        await db.collection("bulk_enquiries").doc(id).set(newEnquiry);
      } catch (dbErr) {
        console.warn("Firestore bulk enquiry set failed, using in-memory:", dbErr);
        inMemoryEnquiries.unshift(newEnquiry);
      }
    } else {
      inMemoryEnquiries.unshift(newEnquiry);
    }

    return NextResponse.json({
      success: true,
      enquiryId,
      id,
      message: "Bulk enquiry registered successfully.",
    });
  } catch (error: any) {
    console.error("Bulk enquiry submission error:", error);
    return NextResponse.json({ error: error.message || "Failed to submit bulk enquiry." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const db = getAdminDb();
    if (db) {
      try {
        const snap = await db
          .collection("bulk_enquiries")
          .orderBy("createdAt", "desc")
          .limit(100)
          .get();

        if (!snap.empty) {
          const list = snap.docs.map((doc) => doc.data() as BulkJerseyEnquiry);
          return NextResponse.json({ success: true, enquiries: list });
        }
      } catch (dbErr) {
        console.warn("Firestore fetch bulk enquiries error, falling back:", dbErr);
      }
    }

    return NextResponse.json({ success: true, enquiries: inMemoryEnquiries });
  } catch (error: any) {
    return NextResponse.json({ success: true, enquiries: inMemoryEnquiries });
  }
}
