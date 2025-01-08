import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const { existingImageIds, primaryImageId } = await request.json();

    // Update primary status for all images
    await prisma.productImage.updateMany({
      where: {
        productId: id,
      },
      data: {
        isPrimary: false,
      },
    });

    // Set the new primary image
    if (primaryImageId) {
      await prisma.productImage.update({
        where: {
          id: primaryImageId,
        },
        data: {
          isPrimary: true,
        },
      });
    }

    // Get the updated product with images
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating images:", error);
    return NextResponse.json(
      { error: "Failed to update images" },
      { status: 500 }
    );
  }
}
