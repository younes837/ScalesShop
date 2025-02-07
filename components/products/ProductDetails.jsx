"use client";

import { useState } from "react";
import { Heart, ShoppingCart, Star, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, formatPrice, serializeProduct } from "@/lib/utils";
import { calculateTierPrice } from "@/lib/pricing";
import { calculateSavingsPercentage } from "@/lib/pricing";
import { addToCart } from "@/lib/cart";
import { toast } from "sonner";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import { PriceTierTable } from "./PriceTierTable";
import { useTranslations } from "next-intl";
const PRESET_QUANTITIES = [5, 10, 20, 30, 50, 100];

export function ProductDetails({ product }) {
  const t = useTranslations("ProductDetails");
  const { addItem } = useCartStore();
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    isInWishlist,
  } = useWishlistStore();
  const isWishlisted = isInWishlist(product.id);
  const [quantity, setQuantity] = useState(product.minOrderQuantity);
  const [inputValue, setInputValue] = useState(
    product.minOrderQuantity.toString()
  );
  const currentPrice = calculateTierPrice(product, quantity);
  const [isAdding, setIsAdding] = useState(false);

  const handleQuantitySelect = (value) => {
    const newQuantity = Math.min(value, product.stockQuantity);
    setQuantity(newQuantity);
    setInputValue(newQuantity.toString());
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    const parsed = parseInt(value);
    if (!isNaN(parsed)) {
      const newQuantity = Math.min(
        Math.max(parsed, product.minOrderQuantity),
        product.stockQuantity
      );
      setQuantity(newQuantity);
    }
  };

  const handleInputBlur = () => {
    if (!inputValue || isNaN(parseInt(inputValue))) {
      setInputValue(quantity.toString());
    }
  };

  const handleAddToCart = () => {
    try {
      setIsAdding(true);
      const cartItem = {
        id: product.id,
        name: product.name,
        basePrice: product.basePrice,
        minOrderQuantity: product.minOrderQuantity || 1,
        images: product.images || [],
        priceTiers: Array.isArray(product.priceTiers) ? product.priceTiers : [],
      };

      addItem(cartItem, quantity);
      toast.success("Added to cart");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setTimeout(() => {
        setIsAdding(false);
      }, 200);
    }
  };

  const handleAddToWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist");
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-xl font-bold mb-1">{product.name}</h1>
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
            669 {t("reviews")}
          </span>
        </div>
      </div>

      {/* Price */}
      <div>
        <span className="text-xl font-bold">{formatPrice(currentPrice)}</span>
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground leading-relaxed">
        {product.description}
      </p>

      {/* Shipping Info */}
      <div className="flex items-center gap-2 text-xs">
        <Truck className="w-3.5 h-3.5" />
        <span>{t("accordion.shipping.freeShipping")}</span>
      </div>

      {/* Availability */}
      <div className="py-1">
        <div className="text-xs font-medium">availability</div>
        <div className="text-xs text-green-600">
          {product.stockQuantity} {t("unit")} {t("inStock")}
        </div>
      </div>

      {/* Quantity Selection */}
      <div>
        <label className="text-xs font-medium mb-2 block">
          {t("addToCart.quantity")}
        </label>
        <div className="space-y-1.5">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-1.5">
            {PRESET_QUANTITIES.map((preset) => (
              <button
                key={preset}
                onClick={() => handleQuantitySelect(preset)}
                className={cn(
                  "h-8 rounded-md border text-xs font-medium transition-colors",
                  quantity === preset
                    ? "bg-primary text-primary-foreground"
                    : "hover:border-primary"
                )}
                disabled={preset > product.stockQuantity}
              >
                {preset}
              </button>
            ))}
          </div>
          <Input
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            min={product.minOrderQuantity}
            max={product.stockQuantity}
            className="h-8 text-xs"
            placeholder={t("addToCart.customQuantity")}
          />
        </div>
      </div>

      {/* Add to Cart */}
      <div className="flex gap-2 pt-3">
        <Button
          variant="outline"
          size="lg"
          onClick={handleAddToWishlist}
          className={cn(
            "flex-none",
            isWishlisted && "text-destructive hover:text-destructive"
          )}
        >
          <Heart className={cn("w-5 h-5", isWishlisted && "fill-current")} />
        </Button>
        <Button
          size="lg"
          onClick={handleAddToCart}
          disabled={product.stockQuantity === 0}
          className={cn("flex-1 transition-transform", isAdding && "scale-95")}
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          {t("addToCart.button")}
        </Button>
      </div>
      <div className="text-xs text-muted-foreground">
        {t("addToCart.minOrder")}: {product.minOrderQuantity} {t("unit")}
      </div>

      {/* Additional Info */}
    </div>
  );
}
