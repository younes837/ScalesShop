import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request, { params }) {
  try {
    const data = await request.json();
    const priceTier = await prisma.productPriceTier.create({
      data: {
        productId: params.id,
        minQuantity: data.minQuantity,
        pricePerUnit: data.pricePerUnit,
      },
    });

    return NextResponse.json(priceTier);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create price tier" },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    const priceTiers = await prisma.productPriceTier.findMany({
      where: {
        productId: params.id,
      },
      orderBy: {
        minQuantity: "asc",
      },
    });

    return NextResponse.json(priceTiers);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch price tiers" },
      { status: 500 }
    );
  }
}
