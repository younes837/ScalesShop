import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import Image from "next/image";

export function ProductSearch() {
  const t = useTranslations("Products.search");
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  // Function to fetch products
  const searchProducts = React.useCallback(async (query) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/products?search=${query}`);
      const data = await response.json();
      console.log("Search Results:", data); // Debug log

      if (!Array.isArray(data)) {
        console.error("Expected array of products, got:", typeof data);
        setSearchResults([]);
        return;
      }

      setSearchResults(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load initial products when opened
  React.useEffect(() => {
    if (open) {
      searchProducts("");
    }
  }, [open, searchProducts]);

  // Handle search input changes with timeout
  React.useEffect(() => {
    if (!open) return;

    const timeoutId = setTimeout(() => {
      searchProducts(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, open, searchProducts]);

  // Keyboard shortcut
  React.useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const handleSelect = (product) => {
    setOpen(false);
    router.push(`/products/${product.id}`);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative w-full max-w-[600px] flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm text-muted-foreground shadow-sm transition-colors hover:border-gray-300 focus:outline-none"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="inline-flex">{t("button")}</span>
        <kbd className="pointer-events-none absolute right-3 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">{t("shortcut")}</span>
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={handleOpenChange}>
        <CommandInput
          placeholder={t("placeholder")}
          value={searchQuery}
          onValueChange={setSearchQuery}
          className="border-none focus:ring-0"
        />
        <CommandList className="max-h-[300px] overflow-y-auto py-2">
          <CommandEmpty className="py-6 text-center text-sm">
            {t("dialog.noResults")}
          </CommandEmpty>
          {isLoading ? (
            <CommandGroup>
              <CommandItem className="justify-center text-sm text-muted-foreground gap-2 py-3">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                {t("dialog.loading")}
              </CommandItem>
            </CommandGroup>
          ) : (
            searchResults?.length > 0 && (
              <CommandGroup heading={t("dialog.groupTitle")} className="px-2">
                {searchResults.map((product) => (
                  <CommandItem
                    key={product.id}
                    value={product.name}
                    onSelect={() => handleSelect(product)}
                    className="flex items-center justify-between rounded-md p-2 hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      {product.images?.[0] && (
                        <div className="relative h-8 w-8 overflow-hidden rounded-md border">
                          <Image
                            src={product.images[0].imageUrl}
                            alt={product.name}
                            className="object-cover"
                            fill
                            sizes="32px"
                          />
                        </div>
                      )}
                      <span className="font-medium">{product.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ${product.basePrice}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
