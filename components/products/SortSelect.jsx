"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
const sortOptions = [
  { id: "newest", label: "Newest", value: "createdAt.desc" },
  { id: "priceAsc", label: "Price: Low to High", value: "basePrice.asc" },
  { id: "priceDesc", label: "Price: High to Low", value: "basePrice.desc" },
  { id: "nameAsc", label: "Name: A to Z", value: "name.asc" },
  { id: "nameDesc", label: "Name: Z to A", value: "name.desc" },
];

export function SortSelect() {
  const t = useTranslations("Products");
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
            {t(`sort.options.${option.id}`)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
