"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LayoutGrid, List, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "./ProductCard";
import { ProductCardList } from "./ProductCardList";
import { useTranslations } from "next-intl";

export function ProductsGrid({
  products,
  initialView = "grid",
  currentPage,
  totalPages,
}) {
  const t = useTranslations("Products");
  const [view, setView] = useState(initialView);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleViewChange = (newView) => {
    setView(newView);
    const params = new URLSearchParams(searchParams);
    params.set("view", newView);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`, { scroll: true });
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-muted-foreground">
          {products.length} {t("filters.productsFound")}
        </div>
        <div className="flex gap-1">
          <Button
            variant={view === "grid" ? "secondary" : "ghost"}
            size="icon-sm"
            onClick={() => handleViewChange("grid")}
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button
            variant={view === "list" ? "secondary" : "ghost"}
            size="icon-sm"
            onClick={() => handleViewChange("list")}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 xlg:grid-cols-2 gap-4">
          {products.map((product) => (
            <ProductCardList key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-8 flex justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
          {t("pagination.prev")}
        </Button>

        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "secondary" : "outline"}
              size="sm"
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          {t("pagination.next")}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
}
