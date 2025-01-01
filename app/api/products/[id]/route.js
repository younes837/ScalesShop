import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: params.id,
      },
      include: {
        category: true,
        images: true,
        priceTiers: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const data = await request.json();
    const product = await prisma.product.update({
      where: {
        id: params.id,
      },
      data: {
        name: data.name,
        description: data.description,
        sku: data.sku,
        basePrice: data.basePrice,
        stockQuantity: data.stockQuantity,
        minOrderQuantity: data.minOrderQuantity,
        categoryId: data.categoryId,
        isActive: data.isActive,
      },
      include: {
        category: true,
        images: true,
        priceTiers: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}
