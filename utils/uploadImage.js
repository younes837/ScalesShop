import { supabase } from "./supabaseClient";

export async function uploadProductImage(file, productId) {
  try {
    // Create a unique file name using a timestamp
    const fileExt = file.name.split(".").pop();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileName = `${productId}/${uniqueSuffix}.${fileExt}`;
    const filePath = `products/${fileName}`;

    // Upload the file to Supabase storage with public access
    const { data, error } = await supabase.storage
      .from("products")
      .upload(filePath, file, {
        upsert: false, // Set to false to prevent overwriting
        cacheControl: "3600",
        contentType: file.type, // Add content type
      });

    if (error) {
      console.error("Upload error:", error);
      throw error;
    }

    // Get the public URL for the uploaded file
    const {
      data: { publicUrl },
    } = supabase.storage.from("products").getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}
