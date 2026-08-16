import { NextResponse } from "next/server";
import { verifyAdmin, getAdminDb } from "@/lib/serverAuth";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request: Request) {
  try {
    // 1. Authenticate administrator
    const adminUser = await verifyAdmin(request);
    if (!adminUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Administrator credentials required." },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || !body.productId) {
      return NextResponse.json(
        { success: false, message: "Product ID is required." },
        { status: 400 }
      );
    }

    const { productId, stock, adjustment, reason } = body;

    // 2. Validate stock value
    let targetStock: number;

    if (typeof stock === "number") {
      targetStock = stock;
    } else if (typeof stock === "string" && stock.trim() !== "" && !isNaN(Number(stock))) {
      targetStock = Number(stock);
    } else {
      return NextResponse.json(
        { success: false, message: "A valid numeric stock value is required." },
        { status: 400 }
      );
    }

    if (!Number.isInteger(targetStock)) {
      return NextResponse.json(
        { success: false, message: "Stock quantity must be a whole integer." },
        { status: 400 }
      );
    }

    if (targetStock < 0) {
      return NextResponse.json(
        { success: false, message: "Stock quantity cannot be negative." },
        { status: 400 }
      );
    }

    if (targetStock > 100000) {
      return NextResponse.json(
        { success: false, message: "Stock quantity cannot exceed 100,000 units." },
        { status: 400 }
      );
    }

    // 3. Update stock in Firestore with audit metadata
    const db = getAdminDb();
    const productRef = db.collection("products").doc(productId);
    const productDoc = await productRef.get();

    if (!productDoc.exists) {
      return NextResponse.json(
        { success: false, message: `Product with ID '${productId}' was not found in the database.` },
        { status: 404 }
      );
    }

    const currentData = productDoc.data()!;
    const previousStock = currentData.stock ?? 0;

    await productRef.update({
      stock: targetStock,
      updatedAt: FieldValue.serverTimestamp(),
      lastStockUpdate: {
        previousStock,
        newStock: targetStock,
        updatedBy: adminUser.email || adminUser.uid,
        reason: reason?.trim() || (adjustment ? `Adjusted by ${adjustment > 0 ? `+${adjustment}` : adjustment}` : "Manual stock update"),
        timestamp: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Stock for '${currentData.name}' updated from ${previousStock} to ${targetStock}.`,
      productId,
      stock: targetStock,
      previousStock,
    });
  } catch (err: any) {
    console.error("Error in /api/admin/products/update-stock:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to update product stock." },
      { status: 500 }
    );
  }
}
