"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

export function CategoryFilter({ categories }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getCurrentValue = () => {
    const category = searchParams.get("category");
    return category || "all";
  };

  const [value, setValue] = useState("all");

  // Update value when URL changes
  useEffect(() => {
    setValue(getCurrentValue());
  }, [searchParams]);

  const handleChange = (value) => {
    // Optimistic update
    setValue(value);

    const params = new URLSearchParams(searchParams);
    if (value === "all") {
      params.delete("category");
    } else {
      params.set("category", value);
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
      <div className="flex items-center space-x-3">
        <RadioGroupItem value="all" id="all-categories" />
        <Label
          htmlFor="all-categories"
          className="text-sm text-muted-foreground cursor-pointer"
        >
          All Categories
        </Label>
      </div>
      {categories.map((category) => (
        <div key={category.id} className="flex items-center space-x-3">
          <RadioGroupItem value={category.id} id={category.id} />
          <Label
            htmlFor={category.id}
            className="text-sm text-muted-foreground cursor-pointer"
          >
            {category.name}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}
