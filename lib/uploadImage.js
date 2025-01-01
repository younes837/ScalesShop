import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function uploadProductImage(
  file,
  productId,
  altText,
  isPrimary = false
) {
  try {
    // Convert base64 to buffer if needed
    let buffer = file;
    if (typeof file === "string" && file.includes("base64")) {
      buffer = Buffer.from(file.split(",")[1], "base64");
    }

    // Generate unique filename
    const fileName = `${productId}-${Date.now()}.${
      file.type?.split("/")[1] || "jpg"
    }`;
    const filePath = `product-images/${fileName}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("products")
      .upload(filePath, buffer, {
        contentType: file.type || "image/jpeg",
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("products")
      .getPublicUrl(filePath);

    // Create image record in database
    const image = await prisma.productImage.create({
      data: {
        productId,
        imageUrl: urlData.publicUrl,
        altText,
        isPrimary,
        displayOrder: 0, // You might want to calculate this based on existing images
      },
    });

    return image;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
}
