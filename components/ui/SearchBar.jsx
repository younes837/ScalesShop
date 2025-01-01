"use client";

import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("search") || "");
  const [isSearching, setIsSearching] = useState(false);
  const debouncedValue = useDebounce(value, 300);

  useEffect(() => {
    setIsSearching(true);
    const params = new URLSearchParams(searchParams);
    if (debouncedValue) {
      params.set("search", debouncedValue);
    } else {
      params.delete("search");
    }
    router.push(`/products?${params.toString()}`, { scroll: false });

    // Add a small delay to show loading state
    const timer = setTimeout(() => {
      setIsSearching(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [debouncedValue, router, searchParams]);

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
        <Search
          className={`w-4 h-4 text-muted-foreground absolute transition-opacity duration-200 ${
            isSearching ? "opacity-0" : "opacity-100"
          }`}
        />
        <Loader2
          className={`w-4 h-4 text-muted-foreground absolute transition-opacity duration-200 animate-spin ${
            isSearching ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-9"
        placeholder="Search products..."
      />
    </div>
  );
}
