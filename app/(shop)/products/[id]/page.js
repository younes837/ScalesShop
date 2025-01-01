import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { ProductDetails } from "@/components/products/ProductDetails";
import { ProductImages } from "@/components/products/ProductImages";
import { PriceTierTable } from "@/components/products/PriceTierTable";
import { serializeProduct, serializeProducts } from "@/lib/utils";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default async function ProductPage({ params }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      images: true,
      priceTiers: {
        orderBy: { minQuantity: "asc" },
      },
    },
  });

  if (!product) {
    notFound();
  }

  const serializedProduct = serializeProduct(product);

  const breadcrumbItems = [
    { href: "/products", label: "Products" },
    { label: serializedProduct.name },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto px-4 py-6">
        <Breadcrumb items={breadcrumbItems} className="mb-6" />

        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProductImages
                images={serializedProduct.images.map((img) => ({
                  ...img,
                  url: "/kitchen_scale.png" || "/placeholder.png",
                }))}
              />
              <ProductDetails product={serializedProduct} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
