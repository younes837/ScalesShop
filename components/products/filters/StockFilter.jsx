"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function StockFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [checked, setChecked] = useState(
    searchParams.get("inStock") === "true"
  );

  const handleChange = (checked) => {
    // Optimistic update
    setChecked(checked);

    const params = new URLSearchParams(searchParams);
    if (checked) {
      params.set("inStock", "true");
    } else {
      params.delete("inStock");
    }
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center space-x-3">
      <Checkbox id="inStock" checked={checked} onCheckedChange={handleChange} />
      <Label htmlFor="inStock" className="text-sm text-muted-foreground">
        In Stock Only
      </Label>
    </div>
  );
}
