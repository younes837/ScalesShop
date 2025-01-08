import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(request, { params }) {
  try {
    const { id, imageId } = await params;

    // Delete the image
    await prisma.productImage.delete({
      where: {
        id: imageId,
        productId: id,
      },
    });

    // If there are remaining images, ensure one is primary
    const remainingImages = await prisma.productImage.findMany({
      where: {
        productId: id,
      },
    });

    if (
      remainingImages.length > 0 &&
      !remainingImages.some((img) => img.isPrimary)
    ) {
      // Make the first remaining image primary
      await prisma.productImage.update({
        where: {
          id: remainingImages[0].id,
        },
        data: {
          isPrimary: true,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
