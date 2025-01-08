import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function uploadProductImage(file, productId, altText, isPrimary) {
  if (!file || !productId) {
    throw new Error("Missing required parameters for upload");
  }

  try {
    // Create a unique file name (matching the create product format)
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "")}`;
    const filePath = `products/products/${productId}/${fileName}`;

    console.log("Uploading file:", { fileName, filePath, fileType: file.type });

    // Read the file as a blob
    const fileData = await file.arrayBuffer();

    // Upload the file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("products")
      .upload(filePath, fileData, {
        contentType: file.type || "image/jpeg",
        upsert: true,
      });

    console.log("Upload response:", { uploadData, uploadError });

    if (uploadError) {
      throw uploadError;
    }

    // Get the public URL using the uploaded path
    const { data: urlData } = supabase.storage
      .from("products")
      .getPublicUrl(filePath);

    console.log("URL generation:", { urlData });

    if (!urlData?.publicUrl) {
      throw new Error("No public URL in response");
    }

    const result = {
      url: urlData.publicUrl,
      altText: altText || "",
      isPrimary: Boolean(isPrimary),
    };

    console.log("Final result:", result);
    return result;
  } catch (error) {
    // Log the full error for debugging
    console.error("Upload failed:", {
      error: {
        message: error?.message,
        name: error?.name,
        code: error?.code,
        details: error?.details,
      },
      file: {
        name: file?.name,
        type: file?.type,
        size: file?.size,
      },
      productId,
    });
    throw error;
  }
}
