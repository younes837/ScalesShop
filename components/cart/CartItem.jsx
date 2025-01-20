"use client";

import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTranslations } from "next-intl";
export function CartItem({ item }) {
  const t = useTranslations("ProductDetails");
  const { updateQuantity, removeItem } = useCartStore();

  const handleIncrement = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > item.minOrderQuantity) {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

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
            <div className="text-sm text-muted-foreground space-y-0.5">
              <div>
                {formatPrice(item.price)} {t("addToCart.perUnit")}
                {item.price !== item.basePrice && (
                  <span className="ml-1 text-xs text-green-600">
                    {t("addToCart.volumeDiscount")}
                  </span>
                )}
              </div>
              <div className="font-medium">
                {t("addToCart.total")}:{" "}
                {formatPrice(item.price * item.quantity)}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => removeItem(item.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6"
            onClick={handleDecrement}
            disabled={item.quantity <= (item.minOrderQuantity || 1)}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="text-sm">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6"
            onClick={handleIncrement}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
