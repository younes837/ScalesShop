# Project review
Use the following instructions to build a web application  a modern e-commerce application 
- the application is for a busniss wholesaler(scales)
# Tech Stack
- Next.js (javaScript)
- Shadcn
- Lucid
- Supabase
- Tailwind CSS
- Framer Motion
- Prisma

# Tables
   erDiagram
    Users ||--o{ Orders : places
    Users {
        id int PK
        email string
        password_hash string
        business_name string
        contact_name string
        phone string
        address text
        created_at timestamp
    }
    
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
    
    Orders ||--|{ OrderItems : contains
    Orders {
        id int PK
        user_id int FK
        status string
        total_amount decimal
        shipping_address text
        created_at timestamp
        updated_at timestamp
    }
    
    OrderItems {
        id int PK
        order_id int FK
        product_id int FK
        quantity int
        price_per_unit decimal
        subtotal decimal
    }

# Requirements
1. Database must be created using Prisma
2. Database must be seeded with data
3. Database must be connected to the application
    - seed some dumy data

4. Product Management
- CRUD operations for products
- Product categorization
- Product images upload and management
- Stock level tracking
- Price tier management
- Product search and filtering


5. Category Management
- Hierarchical category structure
- Category CRUD operations
- Category-product associations
- Category filtering and search


6. Order Management
- Shopping cart functionality
- Order creation and processing
- Order status tracking
- Order history
- Invoice generation
- Minimum order quantity validation
- Price tier calculations
- Stock level checks

7. Price Management
- Tiered pricing system
- Bulk pricing rules
- Price updates and history
- Special pricing for specific customers
- Discount management

8. API Endpoints Required
- Get all products
- Get a single product
- Create a product
- Update a product
- disable a product
- enable a product
- get all categories
- get a single category
- create a category
- update a category
- disable a category
- enable a category
- get all orders
- get a single order
- create an order
- update an order
- delete an order

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
# Current file structure
.
├── app
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── components
│   └── ui
│       └── button.jsx
├── lib
├── node_modules
├── public
├── requirements
├── .gitignore
├── components.json
├── jsconfig.json
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
└── tailwind.config.mjs

# Rules
- All new components should be added to the components folder and named like example-component.jsx unless otherwise specified
- All new pages should be added to the app folder

