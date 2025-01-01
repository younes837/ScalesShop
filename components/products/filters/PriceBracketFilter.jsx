"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/utils";
import { useState, useEffect } from "react";

const PRICE_BRACKETS = [
  { id: "all", label: "All Prices" },
  { id: "0-50", label: "Under $50", min: 0, max: 50 },
  { id: "50-100", label: "$50 - $100", min: 50, max: 100 },
  { id: "100-200", label: "$100 - $200", min: 100, max: 200 },
  { id: "200-500", label: "$200 - $500", min: 200, max: 500 },
  { id: "500-up", label: "$500 & Above", min: 500 },
];

export function PriceBracketFilter({ maxPrice }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState("all");

  const getCurrentValue = () => {
    const min = searchParams.get("minPrice");
    const max = searchParams.get("maxPrice");

    if (!min) return "all";

    const bracket = PRICE_BRACKETS.find(
      (b) => b.min === Number(min) && (!b.max || b.max === Number(max))
    );

    return bracket?.id || "all";
  };

  // Update value when URL changes
  useEffect(() => {
    setValue(getCurrentValue());
  }, [searchParams]);

  const handleChange = (value) => {
    // Optimistic update
    setValue(value);

    const params = new URLSearchParams(searchParams);
    const bracket = PRICE_BRACKETS.find((b) => b.id === value);

    // Clear existing price parameters
    params.delete("minPrice");
    params.delete("maxPrice");

    if (bracket && bracket.id !== "all") {
      params.set("minPrice", bracket.min);
      if (bracket.max) {
        params.set("maxPrice", bracket.max);
      }
    }

    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  return (
    <RadioGroup
      defaultValue="all"
      value={value}
      onValueChange={handleChange}
      className="space-y-2"
    >
      {PRICE_BRACKETS.map((bracket) => (
        <div key={bracket.id} className="flex items-center space-x-3">
          <RadioGroupItem value={bracket.id} id={bracket.id} />
          <Label
            htmlFor={bracket.id}
            className="text-sm text-muted-foreground cursor-pointer"
          >
            {bracket.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}
