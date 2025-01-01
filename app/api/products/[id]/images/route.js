import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { uploadProductImage } from "@/lib/uploadImage";

export async function POST(request, { params }) {
  try {
    const { file, altText, isPrimary } = await request.json();

    // If making this image primary, update other images
    if (isPrimary) {
      await prisma.productImage.updateMany({
        where: {
          productId: params.id,
          isPrimary: true,
        },
        data: {
          isPrimary: false,
        },
      });
    }

    const image = await uploadProductImage(file, params.id, altText, isPrimary);
    return NextResponse.json(image);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    const images = await prisma.productImage.findMany({
      where: {
        productId: params.id,
      },
      orderBy: {
        displayOrder: "asc",
      },
    });

    return NextResponse.json(images);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}
