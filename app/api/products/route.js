import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const inStock = searchParams.get("inStock");
    const ids = searchParams.get("ids")?.split(",");

    // Build where clause
    const where = {
      isActive: true,
      ...(ids && { id: { in: ids } }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { sku: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(category && { categoryId: category }),
      ...(minPrice && { basePrice: { gte: parseFloat(minPrice) } }),
      ...(maxPrice && { basePrice: { lte: parseFloat(maxPrice) } }),
      ...(inStock === "true" && { stockQuantity: { gt: 0 } }),
    };

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        images: true,
        priceTiers: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        sku: data.sku,
        basePrice: data.basePrice,
        stockQuantity: data.stockQuantity,
        minOrderQuantity: data.minOrderQuantity,
        categoryId: data.categoryId,
        priceTiers: {
          create: data.priceTiers,
        },
      },
      include: {
        category: true,
        priceTiers: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
