"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/utils";

export function PriceRangeFilter({ maxPrice }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPrice = searchParams.get("maxPrice") || maxPrice;

  const handleChange = (value) => {
    const params = new URLSearchParams(searchParams);
    params.set("maxPrice", value[0]);
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      <Slider
        defaultValue={[currentPrice]}
        max={maxPrice}
        step={1}
        onValueChange={handleChange}
      />
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>$0</span>
        <span>{formatPrice(currentPrice)}</span>
      </div>
    </div>
  );
}
