import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { uploadProductImage } from "@/utils/uploadImage";

export async function GET(request) {
  // GET requests are public
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
    // Log headers to check if the token is being passed
    console.log("Request Headers:", Object.fromEntries(request.headers));

    const { userId } = auth();
    const user = await currentUser();

    console.log("Auth check:", {
      hasUserId: !!userId,
      hasUser: !!user,
      userId: user?.id,
      userEmail: user?.emailAddresses?.[0]?.emailAddress,
    });

    // Check if the user is authenticated
    if (!user?.id) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    // Log the form data for debugging
    console.log("Form Data:", {
      name: formData.get("name"),
      sku: formData.get("sku"),
      basePrice: formData.get("basePrice"),
      stockQuantity: formData.get("stockQuantity"),
      minOrderQuantity: formData.get("minOrderQuantity"),
      categoryId: formData.get("categoryId"),
      isActive: formData.get("isActive"),
      priceTiers: formData.get("priceTiers"),
      images: formData.getAll("images")?.map((img) => img.name),
    });

    // Extract product data
    const productData = {
      name: formData.get("name"),
      description: formData.get("description") || "",
      sku: formData.get("sku"),
      basePrice: parseFloat(formData.get("basePrice")),
      stockQuantity: parseInt(formData.get("stockQuantity")),
      minOrderQuantity: parseInt(formData.get("minOrderQuantity")),
      categoryId: formData.get("categoryId"),
      isActive: formData.get("isActive") === "true",
    };

    // Log the processed data
    console.log("Product Data:", productData);

    // Validate required fields
    const requiredFields = [
      "name",
      "sku",
      "basePrice",
      "stockQuantity",
      "minOrderQuantity",
      "categoryId",
    ];

    for (const field of requiredFields) {
      if (!productData[field]) {
        console.log(`Validation failed: Missing ${field}`);
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Parse price tiers if they exist
    let priceTiers = [];
    const priceTiersJson = formData.get("priceTiers");
    if (priceTiersJson) {
      try {
        priceTiers = JSON.parse(priceTiersJson);
        console.log("Parsed price tiers:", priceTiers);
      } catch (error) {
        console.error("Error parsing price tiers:", error);
      }
    }

    // Create the product first
    const product = await prisma.product.create({
      data: {
        ...productData,
      },
    });

    // Handle price tiers
    if (priceTiers.length > 0) {
      await prisma.productPriceTier.createMany({
        data: priceTiers.map((tier) => ({
          productId: product.id,
          minQuantity: parseInt(tier.quantity),
          pricePerUnit: parseFloat(tier.price),
        })),
      });
    }

    // Handle image uploads
    const images = formData.getAll("images");
    if (images.length > 0) {
      const imagePromises = images.map(async (image, index) => {
        try {
          // Upload image to Supabase and get the public URL
          const imageUrl = await uploadProductImage(image, product.id);

          // Create the product image record in the database
          return prisma.productImage.create({
            data: {
              productId: product.id,
              imageUrl: imageUrl,
              altText: formData.get(`imageAltTexts[${index}]`) || image.name,
              displayOrder: index,
              isPrimary:
                index === parseInt(formData.get("primaryImageIndex") || "0"),
            },
          });
        } catch (error) {
          console.error(`Error processing image ${index}:`, error);
          throw error;
        }
      });

      await Promise.all(imagePromises);
    }

    // Fetch and return the complete product
    const completeProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        category: true,
        images: true,
        priceTiers: true,
      },
    });

    return NextResponse.json(completeProduct);
  } catch (error) {
    console.error("Error in POST /api/products:", error);
    return NextResponse.json(
      {
        error: "Failed to create product",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
