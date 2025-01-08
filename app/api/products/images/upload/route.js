import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { uploadProductImage } from "@/utils/uploadImage";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const productId = formData.get("productId");
    const primaryImageIndex = parseInt(formData.get("primaryImageIndex"));
    const images = formData.getAll("images");
    const altTexts = formData.getAll("imageAltTexts");

    if (!productId || !images.length) {
      return NextResponse.json(
        { error: "Missing required data" },
        { status: 400 }
      );
    }
    console.log("FormData:", formData);
    console.log("ProductId:", productId);
    console.log("PrimaryImageIndex:", primaryImageIndex);
    console.log("Images:", images);
    console.log("AltTexts:", altTexts);

    const results = [];
    const errors = [];

    // Handle each image upload
    for (let index = 0; index < images.length; index++) {
      try {
        const image = images[index];
        const altText = altTexts[index] || "";
        const isPrimary = index === primaryImageIndex;

        // First upload the image
        const uploadedImage = await uploadProductImage(
          image,
          productId,
          altText,
          isPrimary
        );

        // Verify we have all required fields
        // if (!uploadedImage?.url) {
        //   throw new Error("Upload failed - missing URL");
        // }
        console.log(uploadedImage);

        // Then create the database record with guaranteed values
        const imageRecord = await prisma.productImage.create({
          data: {
            productId,
            imageUrl: uploadedImage,
            altText: altText,
            isPrimary:
              index === parseInt(formData.get("primaryImageIndex") || "0"),
            displayOrder: index,
          },
        });

        results.push(imageRecord);
      } catch (err) {
        const error = {
          index,
          message: err?.message || "Unknown error",
          type: err?.name || "Unknown type",
        };
        errors.push(error);
        console.error("Image processing error:", error);
      }
    }

    if (results.length === 0) {
      return NextResponse.json(
        {
          error: "Failed to upload images",
          details: errors,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      images: results,
      warnings: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    const error = {
      message: err?.message || "Unknown error",
      type: err?.name || "Unknown type",
    };
    console.error("Upload route error:", error);
    return NextResponse.json(
      { error: "Failed to process image upload", details: error },
      { status: 500 }
    );
  }
}
