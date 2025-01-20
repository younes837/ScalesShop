"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export function ProductCard({ product }) {
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
      console.log("Adding to cart:", product); // Debug log
      // Ensure product has required properties
      const cartItem = {
        id: product.id,
        name: product.name,
        basePrice: product.basePrice,
        minOrderQuantity: product.minOrderQuantity || 1,
        images: product.images || [],
        priceTiers: Array.isArray(product.priceTiers) ? product.priceTiers : [],
      };

      console.log("Cart item:", cartItem); // Debug log
      addItem(cartItem, cartItem.minOrderQuantity);
      toast.success("Added to cart");
    } catch (error) {
      console.error("Add to cart error:", error); // Debug log
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
      className="block group bg-white rounded-lg border hover:shadow-md transition-shadow p-6 relative"
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

      <div className="aspect-square relative rounded-md bg-gray-50 mb-3">
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
      <div className="flex items-start justify-between gap-4 mb-2">
        <h3 className="font-medium text-base truncate">{product.name}</h3>
      </div>
      <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
        {product.description}
      </p>
      <div className="flex items-center gap-2 mb-2">
        <div className="flex">
          {[1, 2, 3, 4].map((star) => (
            <Star key={star} className="w-3 h-3 fill-primary text-primary" />
          ))}
          <Star className="w-3 h-3 text-muted-foreground" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="text-lg font-bold">
          {formatPrice(product.basePrice)}
        </div>
        <div className="text-xs text-muted-foreground">
          {t("addToCart.minOrder")}: {product.minOrderQuantity} units
        </div>
        <div className="pt-2 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddToWishlist}
            className={cn(
              "flex-none",
              isWishlisted && "text-destructive hover:text-destructive"
            )}
          >
            <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
          </Button>
          <Button
            className="flex-1"
            size="sm"
            onClick={(e) => {
              console.log("Add to cart clicked"); // Debug log
              handleAddToCart(e);
            }}
            disabled={product.stockQuantity === 0}
          >
            <ShoppingCart className="w-4 h-4 mr-1" />
            {t("addToCart.button")}
          </Button>
        </div>
      </div>
    </Link>
  );
}
