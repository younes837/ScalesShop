"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
export function ProductCardList({ product }) {
  const t = useTranslations("ProductDetails");
  const { addItem } = useCartStore();
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    isInWishlist,
  } = useWishlistStore();
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigation
    try {
      // Ensure product has required properties
      const cartItem = {
        id: product.id,
        name: product.name,
        basePrice: product.basePrice,
        minOrderQuantity: product.minOrderQuantity || 1,
        images: product.images || [],
      };

      addItem(cartItem, cartItem.minOrderQuantity);
      toast.success("Added to cart");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault(); // Prevent navigation
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist");
    }
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className="flex gap-6 p-6 bg-white rounded-lg border hover:shadow-md transition-shadow relative group"
    >
      <div className="absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        {product.stockQuantity > 0 ? (
          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
            {t("inStock")}
          </span>
        ) : (
          <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
            {t("outOfStock")}
          </span>
        )}
      </div>

      <div className="relative w-60 aspect-square rounded-md bg-gray-50 flex-shrink-0">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0].imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300 rounded-sm"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <Image
            src={"/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300 rounded-sm"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-medium text-lg mb-1">{product.name}</h3>
            <span className="text-xs text-muted-foreground">
              {t("sku")}: {product.sku}
            </span>
          </div>
          {/* <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
            Min order: {product.minOrderQuantity} units
          </div> */}
        </div>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex">
            {[1, 2, 3, 4].map((star) => (
              <Star
                key={star}
                className="w-3.5 h-3.5 fill-primary text-primary"
              />
            ))}
            <Star className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <span className="text-xs text-muted-foreground">
            657
            {t("reviews")}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-1 mb-4">
          {product.description}
        </p>
        <div className="space-y-3">
          <div className="space-y-3">
            <div className="text-lg font-bold">
              {formatPrice(product.basePrice)}
            </div>
            <div className="text-xs text-muted-foreground">
              {t("addToCart.minOrder")}: {product.minOrderQuantity} units
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddToWishlist}
                className={cn(
                  "flex-none",
                  isWishlisted && "text-destructive hover:text-destructive"
                )}
              >
                <Heart
                  className={cn("w-4 h-4", isWishlisted && "fill-current")}
                />
              </Button>
              <Button
                className="flex-1 "
                size="md"
                onClick={(e) => {
                  e.preventDefault();
                  handleAddToCart(e);
                }}
                disabled={product.stockQuantity === 0}
              >
                <ShoppingCart className="w-4 h-4 mr-1" />
                {t("addToCart.button")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
