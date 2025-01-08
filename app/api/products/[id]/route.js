import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    console.log("API route handling ID:", id);

    const product = await prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
        images: true,
        priceTiers: true,
      },
    });

    console.log("Found product:", product);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const data = await request.json();

    // Log the received data safely
    console.log("Received update data:", JSON.stringify(data, null, 2));

    // Validate required fields
    if (!data.name || !data.sku || !data.basePrice || !data.categoryId) {
      return NextResponse.json(
        { error: "Missing required fields (including categoryId)" },
        { status: 400 }
      );
    }

    // Ensure numeric values are valid
    const basePrice = parseFloat(data.basePrice);
    const stockQuantity = parseInt(data.stockQuantity);
    const minOrderQuantity = parseInt(data.minOrderQuantity);

    if (isNaN(basePrice) || isNaN(stockQuantity) || isNaN(minOrderQuantity)) {
      return NextResponse.json(
        { error: "Invalid numeric values" },
        { status: 400 }
      );
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description || "",
        sku: data.sku,
        basePrice,
        stockQuantity,
        minOrderQuantity,
        categoryId: data.categoryId,
        isActive: Boolean(data.isActive),
      },
      include: {
        category: true,
        images: true,
        priceTiers: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    // Safe error logging
    console.error("Update error:", error?.message || "Unknown error");

    // Handle Prisma errors
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}
