import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        images: true,
        priceTiers: {
          orderBy: {
            minQuantity: "asc",
          },
          take: 1,
        },
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch latest products" },
      { status: 500 }
    );
  }
}
