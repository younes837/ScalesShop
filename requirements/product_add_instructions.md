
# Product Add Instructions
when you add a product, you need to add the product to the database and then add the product images to the database.
- the product images are stored in the supabase storage bucket called "images"
- after the base price and the min quantity , i need you to add a button that add another price tier to the product with a min quantity 
- the price tier should be a decimal number and the min quantity should be an integer
- the price tier should be a number that is lower than the base price
- the min quantity should be a number that is greater than 0


# Table 
  Products ||--|{ ProductPriceTiers : has
    Products ||--o{ OrderItems : contains
    Products ||--|{ ProductImages : has
    Products {
        id int PK
        name string
        description text
        sku string
        base_price decimal
        stock_quantity int
        min_order_quantity int
        category_id int FK
        isActive boolean
        created_at timestamp
    }
    
    ProductImages {
        id int PK
        product_id int FK
        image_url string
        alt_text string
        display_order int
        is_primary boolean
        created_at timestamp
    }
    
    ProductPriceTiers {
        id int PK
        product_id int FK
        min_quantity int
        price_per_unit decimal
    }
    
    Categories ||--|{ Products : contains
    Categories {
        id int PK
        name string
        description text
        parent_id int FK
    }

# Documentation
// utils/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// utils/uploadImage.js
import { supabase } from './supabaseClient';

export async function uploadProductImage(file, productId, altText, isPrimary = false) {
  try {
    // 1. Upload image to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${productId}-${Date.now()}.${fileExt}`;
    const filePath = `product-images/${fileName}`;

    // Upload the file to Supabase Storage
    const { data: storageData, error: storageError } = await supabase.storage
      .from('products')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (storageError) {
      console.error('Error uploading file:', storageError);
      throw storageError;
    }

    // 2. Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    const imageUrl = publicUrlData.publicUrl;

    // 3. Get current highest display order
    const { data: orderData, error: orderError } = await supabase
      .from('product_images')
      .select('display_order')
      .eq('product_id', productId)
      .order('display_order', { ascending: false })
      .limit(1);

    if (orderError) {
      console.error('Error getting display order:', orderError);
      throw orderError;
    }

    const nextDisplayOrder = orderData?.[0]?.display_order 
      ? orderData[0].display_order + 1 
      : 0;

    // 4. If primary image, update other images
    if (isPrimary) {
      const { error: updateError } = await supabase
        .from('product_images')
        .update({ is_primary: false })
        .eq('product_id', productId);

      if (updateError) {
        console.error('Error updating primary status:', updateError);
        throw updateError;
      }
    }

    // 5. Insert the image record
    const { data: imageData, error: insertError } = await supabase
      .from('product_images')
      .insert({
        product_id: productId,
        image_url: imageUrl,
        alt_text: altText,
        display_order: nextDisplayOrder,
        is_primary: isPrimary,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting image record:', insertError);
      throw insertError;
    }

    return imageData;

  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
}

// Example usage in a component:
async function handleImageUpload(event) {
  const file = event.target.files[0];
  const productId = 'your-product-id';
  
  try {
    const imageData = await uploadProductImage(file, productId, 'Product image description');
    console.log('Upload successful:', imageData);
    
    // Handle success (e.g., update UI, show success message)
  } catch (error) {
    // Handle error (e.g., show error message to user)
    console.error('Upload failed:', error);
  }
}