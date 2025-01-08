import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { ProductDetails } from "@/components/products/ProductDetails";
import { ProductImages } from "@/components/products/ProductImages";
import { PriceTierTable } from "@/components/products/PriceTierTable";
import { serializeProduct } from "@/lib/utils";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Navbar } from "@/components/layout/Navbar";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
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
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50/50">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumb items={breadcrumbItems} className="mb-6" />

          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProductImages
                  images={serializedProduct.images.map((img) => ({
                    ...img,
                    url: img.imageUrl || "/placeholder.png",
                  }))}
                />

                <ProductDetails product={serializedProduct} />
                <div className="pt-2">
                  <Accordion type="single" collapsible>
                    <AccordionItem value="pricing">
                      <AccordionTrigger className="text-sm py-3">
                        Volume Pricing
                      </AccordionTrigger>
                      <AccordionContent>
                        {serializedProduct?.priceTiers?.length > 0 && (
                          <div className="mt-8">
                            <div className="max-w-2xl">
                              <PriceTierTable product={serializedProduct} />
                            </div>
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="shipping">
                      <AccordionTrigger className="text-sm py-3">
                        Shipping & Returns
                      </AccordionTrigger>
                      <AccordionContent className="text-xs">
                        <ul className="space-y-2 text-muted-foreground">
                          <li>Free standard shipping on all orders</li>
                          <li>30-day return policy</li>
                          <li>Estimated delivery: 3-5 business days</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="specs">
                      <AccordionTrigger className="text-sm py-3">
                        Specifications
                      </AccordionTrigger>
                      <AccordionContent className="text-xs">
                        <div className="space-y-2 text-muted-foreground">
                          <p>SKU: {product.sku}</p>
                          <p>Category: {product.category.name}</p>
                          <p>{product.description}</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
