import { ProductsGrid } from "@/components/products/ProductsGrid";
import { FilterSidebar } from "@/components/products/FilterSidebar";
import { MobileFilters } from "@/components/products/MobileFilters";
import { SearchBar } from "@/components/ui/SearchBar";
import { SortSelect } from "@/components/products/SortSelect";
import prisma from "@/lib/prisma";
import { serializeProducts } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import Image from "next/image";

export default async function ProductsPage({ searchParams }) {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    inStock,
    view = "grid",
    sort = "createdAt.desc",
    page = 1,
  } = await searchParams;

  const ITEMS_PER_PAGE = 9;
  const skip = (Number(page) - 1) * ITEMS_PER_PAGE;

  const [field, order] = sort.split(".");
  const orderBy = { [field]: order };

  let priceFilter = {};
  if (minPrice && maxPrice) {
    priceFilter = {
      basePrice: {
        gte: parseFloat(minPrice),
        lte: parseFloat(maxPrice),
      },
    };
  } else if (minPrice) {
    priceFilter = {
      basePrice: { gte: parseFloat(minPrice) },
    };
  } else if (maxPrice) {
    priceFilter = {
      basePrice: { lte: parseFloat(maxPrice) },
    };
  }

  const where = {
    isActive: true,
    ...priceFilter,
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ],
    }),
    ...(category && { categoryId: category }),
    ...(inStock === "true" && { stockQuantity: { gt: 0 } }),
  };

  const [products, categories, totalProducts] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        images: true,
        priceTiers: true,
      },
      orderBy,
      skip,
      take: ITEMS_PER_PAGE,
    }),
    prisma.category.findMany(),
    prisma.product.count({ where }),
  ]);

  const serializedProducts = serializeProducts(products);
  const maxProductPrice = Math.max(
    ...serializedProducts.map((p) => p.basePrice)
  );

  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

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
              <ProductsGrid
                products={serializedProducts}
                initialView={view}
                currentPage={Number(page)}
                totalPages={totalPages}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
