import { ProductsGrid } from "@/components/products/ProductsGrid";
import { FilterSidebar } from "@/components/products/FilterSidebar";
import { MobileFilters } from "@/components/products/MobileFilters";
import { SearchBar } from "@/components/ui/SearchBar";
import { SortSelect } from "@/components/products/SortSelect";
import prisma from "@/lib/prisma";
import { serializeProducts } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";

export default async function ProductsPage({ searchParams }) {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    inStock,
    view = "grid",
    sort = "createdAt.desc",
  } = searchParams;

  const [field, order] = sort.split(".");
  const orderBy = { [field]: order };

  const where = {
    isActive: true,
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
        { category: { name: { contains: search, mode: "insensitive" } } },
      ],
    }),
    ...(category && { categoryId: category }),
    ...((minPrice || maxPrice) && {
      basePrice: {
        ...(minPrice && { gte: Number(minPrice) }),
        ...(maxPrice && { lte: Number(maxPrice) }),
      },
    }),
    ...(inStock === "true" && { stockQuantity: { gt: 0 } }),
  };

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        images: true,
        priceTiers: true,
      },
      orderBy,
    }),
    prisma.category.findMany(),
  ]);

  const serializedProducts = serializeProducts(products);
  console.log("Serialized products:", serializedProducts);
  const maxProductPrice = Math.max(
    ...serializedProducts.map((p) => p.basePrice)
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50/50">
        <div className="container mx-auto px-4 py-8">
          <div className="lg:grid lg:grid-cols-4 gap-6">
            <aside className="hidden lg:block space-y-6">
              <div className="bg-white rounded-lg border p-6">
                <FilterSidebar
                  categories={categories}
                  maxPrice={maxProductPrice}
                />
              </div>
            </aside>
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg border p-4 mb-6">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <MobileFilters>
                    <FilterSidebar
                      categories={categories}
                      maxPrice={maxProductPrice}
                    />
                  </MobileFilters>
                  <div className="flex-1">
                    <SearchBar />
                  </div>
                  <SortSelect />
                </div>
              </div>
              <ProductsGrid products={serializedProducts} initialView={view} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
