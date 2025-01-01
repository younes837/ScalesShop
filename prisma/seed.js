import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Create categories
  const electronicsCategory = await prisma.category.create({
    data: {
      name: "Electronics",
      description: "Electronic devices and components",
    },
  });

  const computersCategory = await prisma.category.create({
    data: {
      name: "Computers",
      description: "Desktop and laptop computers",
      parentId: electronicsCategory.id,
    },
  });

  // Create a product
  const laptop = await prisma.product.create({
    data: {
      name: "Business Laptop Pro",
      description: "High-performance laptop for business use",
      sku: "LAP-PRO-001",
      basePrice: 999.99,
      stockQuantity: 100,
      minOrderQuantity: 5,
      categoryId: computersCategory.id,
      priceTiers: {
        create: [
          { minQuantity: 5, pricePerUnit: 949.99 },
          { minQuantity: 10, pricePerUnit: 899.99 },
          { minQuantity: 20, pricePerUnit: 849.99 },
        ],
      },
      images: {
        create: [
          {
            imageUrl: "https://example.com/laptop-1.jpg",
            altText: "Business Laptop Pro - Main View",
            displayOrder: 0,
            isPrimary: true,
          },
        ],
      },
    },
  });

  // Create a test user
  const user = await prisma.user.create({
    data: {
      email: "test@business.com",
      passwordHash: "hashed_password_here",
      businessName: "Test Business Inc",
      contactName: "John Doe",
      phone: "123-456-7890",
      address: "123 Business St, City, Country",
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
