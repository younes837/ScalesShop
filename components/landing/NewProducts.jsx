"use client";

import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { ChevronLeft, ChevronRight, Heart, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";

function NewProducts() {
  const t = useTranslations("LandingPage.newProducts");
  const [products, setProducts] = useState([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    skipSnaps: false,
    watchDrag: true,
    containScroll: "keepSnaps",
  });

  const { addItem } = useCartStore();
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    isInWishlist,
  } = useWishlistStore();
  const [isAdding, setIsAdding] = useState(false);

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  const handleAddToCart = (product) => {
    try {
      const cartItem = {
        id: product.id,
        name: product.name,
        basePrice: product.basePrice,
        minOrderQuantity: product.minOrderQuantity || 1,
        images: product.images || [],
        priceTiers: Array.isArray(product.priceTiers) ? product.priceTiers : [],
      };

      addItem(cartItem, product.minOrderQuantity);
      toast.success("Added to cart");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAddToWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist");
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products/latest");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            {t("title")}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-8">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex-[0_0_240px] min-w-0 sm:flex-[0_0_280px] md:flex-[0_0_320px]"
                >
                  <div className="group bg-white overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300">
                    <div className="relative">
                      <Link href={`/products/${product.id}`}>
                        <div className="relative h-44 sm:h-52">
                          <Image
                            src={
                              product.images[0]?.imageUrl ||
                              "/images/placeholder.jpg"
                            }
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 768px) 280px, (max-width: 1200px) 320px, 380px"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </Link>
                      <button
                        className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 backdrop-blur shadow-md hover:bg-white hover:scale-110 transition-all duration-300"
                        aria-label="Add to favorites"
                        onClick={() => handleAddToWishlist(product)}
                      >
                        <Heart
                          className={cn(
                            "w-4 h-4 transition-colors",
                            isInWishlist(product.id)
                              ? "text-red-500 fill-current"
                              : "text-gray-600 hover:text-red-500"
                          )}
                        />
                      </button>
                    </div>

                    <div className="p-4">
                      <Link href={`/products/${product.id}`}>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1.5 group-hover:text-blue-600 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-1 mb-3">
                          {product.description}
                        </p>
                      </Link>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-primary">
                            ${product.basePrice}
                          </span>
                          <span className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-full">
                            {t("newArrival")}
                          </span>
                        </div>

                        <Button
                          className={cn(
                            "w-full py-2.5 px-4 text-white rounded-xl flex items-center justify-center gap-2 font-medium transition-all duration-300",
                            isAdding && "scale-95"
                          )}
                          onClick={() => handleAddToCart(product)}
                          disabled={isAdding}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          {isAdding ? t("adding") : t("addToCart")}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={scrollPrev}
            className={`absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur shadow-lg flex items-center justify-center transition-all ${
              canScrollPrev
                ? "opacity-100 hover:bg-white hover:scale-110"
                : "opacity-50 cursor-not-allowed"
            }`}
            disabled={!canScrollPrev}
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>

          <button
            onClick={scrollNext}
            className={`absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur shadow-lg flex items-center justify-center transition-all ${
              canScrollNext
                ? "opacity-100 hover:bg-white hover:scale-110"
                : "opacity-50 cursor-not-allowed"
            }`}
            disabled={!canScrollNext}
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default NewProducts;
