"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/lib/store/wishlist";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { useTranslations } from "next-intl";
export function WishlistPopover() {
  const t = useTranslations("ProductDetails");
  const [mounted, setMounted] = useState(false);
  const wishlistStore = useWishlistStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        aria-label="Wishlist"
      >
        <Heart className="h-5 w-5" />
      </Button>
    );
  }

  const itemsCount = wishlistStore.getItemsCount();
  const items = wishlistStore.items;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Wishlist"
        >
          <Heart className="h-5 w-5" />
          {itemsCount > 0 && (
            <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
              {itemsCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end" sideOffset={8}>
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium leading-none">
              {t("addToWishlist.title")}
            </h4>
            <span className="text-sm text-muted-foreground">
              {itemsCount} {t("addToWishlist.items")}
            </span>
          </div>
          {items.length > 0 ? (
            <>
              <ScrollArea className="h-[300px] pr-4">
                <div className="grid gap-4">
                  {items.map((item) => (
                    <WishlistItem key={item.id} item={item} />
                  ))}
                </div>
              </ScrollArea>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 py-4">
              <span className="text-sm text-muted-foreground">
                {t("addToWishlist.empty")}
              </span>
              <Button asChild variant="link" className="text-sm">
                <Link href="/products">
                  {t("addToWishlist.continueShopping")}
                </Link>
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function WishlistItem({ item }) {
  const { removeItem } = useWishlistStore();

  return (
    <div className="flex gap-4">
      <div className="relative aspect-square h-16 w-16 min-w-fit overflow-hidden rounded">
        <Image
          src={item.images?.[0]?.imageUrl || "/product-placeholder.png"}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <h4 className="font-medium leading-none">{item.name}</h4>
            <p className="text-sm text-muted-foreground">
              {formatPrice(item.basePrice)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-destructive"
            onClick={() => removeItem(item.id)}
          >
            <Heart className="h-4 w-4 fill-current" />
          </Button>
        </div>
      </div>
    </div>
  );
}
