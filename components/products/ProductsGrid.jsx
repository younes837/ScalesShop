"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "./ProductCard";
import { ProductCardList } from "./ProductCardList";

export function ProductsGrid({ products, initialView = "grid" }) {
  const [view, setView] = useState(initialView);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleViewChange = (newView) => {
    setView(newView);

    // Update URL without full page refresh
    const params = new URLSearchParams(searchParams);
    params.set("view", newView);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-muted-foreground">
          {products.length} products found
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
    </>
  );
}
