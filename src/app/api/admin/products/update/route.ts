import { NextResponse } from "next/server";
import { verifyAdmin, getAdminDb } from "@/lib/serverAuth";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request: Request) {
  try {
    const adminUser = await verifyAdmin(request);
    if (!adminUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Administrator credentials required." },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || !body.id) {
      return NextResponse.json(
        { success: false, message: "Product ID is required." },
        { status: 400 }
      );
    }

    const {
      id,
      name,
      brand,
      category,
      subcategory,
      sportsType,
      price,
      originalPrice,
      stock,
      deliveryDays,
      image,
      images,
      shortDescription,
      description,
      highlights,
      willowType,
      willowGrade,
      handleSize,
      playerLevel,
      weight,
      dimensions,
      countryOfOrigin,
      manufacturerDetails,
      badge,
      featured,
      customizable,
      colors,
      sizes,
      specifications,
      sku,
    } = body;

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Product name is required." },
        { status: 400 }
      );
    }

    const parsedPrice = Number(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return NextResponse.json(
        { success: false, message: "A valid selling price (>= 0) is required." },
        { status: 400 }
      );
    }

    const parsedStock = Number(stock ?? 0);
    if (isNaN(parsedStock) || parsedStock < 0) {
      return NextResponse.json(
        { success: false, message: "Stock quantity must be a non-negative number." },
        { status: 400 }
      );
    }

    const db = getAdminDb();
    let productRef = db.collection("products").doc(id);
    let productSnap = await productRef.get();

    if (!productSnap.exists) {
      // Check if product was keyed by id field
      const querySnap = await db.collection("products").where("id", "==", id).limit(1).get();
      if (!querySnap.empty) {
        productRef = querySnap.docs[0].ref;
        productSnap = querySnap.docs[0];
      }
    }

    const updatedData: Record<string, any> = {
      id,
      name: name.trim(),
      brand: (brand || "RP Sports").trim(),
      category: (category || "cricket").trim(),
      subcategory: (subcategory || "").trim(),
      sportsType: (sportsType || "").trim(),
      price: parsedPrice,
      originalPrice: originalPrice !== undefined && originalPrice !== "" ? Number(originalPrice) : parsedPrice,
      stock: parsedStock,
      inStock: parsedStock > 0,
      deliveryDays: Number(deliveryDays) || 3,
      image: image || (Array.isArray(images) && images[0]) || "/cricket_bat_studio.jpg",
      images: Array.isArray(images) && images.length > 0 ? images : [image || "/cricket_bat_studio.jpg"],
      shortDescription: shortDescription || "",
      description: description || "",
      highlights: Array.isArray(highlights) ? highlights : [],
      willowType: willowType || "",
      willowGrade: willowGrade || "",
      handleSize: handleSize || "",
      playerLevel: playerLevel || "",
      weight: weight || "",
      dimensions: dimensions || "",
      countryOfOrigin: countryOfOrigin || "India",
      manufacturerDetails: manufacturerDetails || "RP Sports Works, Dumdum, Kolkata – 700028",
      badge: badge && badge !== "None" ? badge : "",
      featured: Boolean(featured),
      customizable: Boolean(customizable),
      colors: Array.isArray(colors) ? colors : typeof colors === "string" && colors ? colors.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
      sizes: Array.isArray(sizes) ? sizes : typeof sizes === "string" && sizes ? sizes.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
      specifications: specifications || {},
      sku: sku || id,
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: adminUser.email || adminUser.uid,
    };

    if (productSnap.exists) {
      await productRef.update(updatedData);
    } else {
      updatedData.createdAt = FieldValue.serverTimestamp();
      await productRef.set(updatedData);
    }

    return NextResponse.json({
      success: true,
      message: `Product '${name}' updated successfully.`,
      product: {
        ...updatedData,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    console.error("Error in /api/admin/products/update:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to update product." },
      { status: 500 }
    );
  }
}
