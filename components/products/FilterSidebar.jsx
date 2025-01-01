"use client";

import { CategoryFilter } from "./filters/CategoryFilter";
import { PriceBracketFilter } from "./filters/PriceBracketFilter";
import { StockFilter } from "./filters/StockFilter";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

export function FilterSidebar({ categories, maxPrice }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const hasFilters = searchParams.toString().length > 0;

  const handleClearFilters = () => {
    router.push("/products");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm ">Filters</span>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-muted-foreground"
            onClick={handleClearFilters}
          >
            <X className="w-4 h-4 mr-2" />
            Clear all
          </Button>
        )}
      </div>

      <div>
        <h3 className="font-medium text-sm mb-3">Categories</h3>
        <CategoryFilter categories={categories} />
      </div>
      <div>
        <h3 className="font-medium text-sm mb-3">Price Range</h3>
        <PriceBracketFilter maxPrice={maxPrice} />
      </div>
      {/* <div>
        <h3 className="font-medium text-sm mb-3">Availability</h3>
        <StockFilter />
      </div> */}
    </div>
  );
}
