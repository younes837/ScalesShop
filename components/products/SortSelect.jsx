"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const sortOptions = [
  { label: "Newest", value: "createdAt.desc" },
  { label: "Price: Low to High", value: "basePrice.asc" },
  { label: "Price: High to Low", value: "basePrice.desc" },
  { label: "Name: A to Z", value: "name.asc" },
  { label: "Name: Z to A", value: "name.desc" },
];

export function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "createdAt.desc";

  const handleChange = (value) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", value);
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  return (
    <Select defaultValue={currentSort} onValueChange={handleChange}>
      <SelectTrigger className="w-full sm:w-[180px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
