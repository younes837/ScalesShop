"use client";

import Link from "next/link";
import { CartPopover } from "@/components/cart/CartPopover";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { WishlistPopover } from "../wishlist/WishlistPopover";
import {
  ArrowDown,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Menu,
  MoveRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import LanguageSwitcher from "../LanguageSwitcher";
import { useTranslations } from "next-intl";
import { ProductSearch } from "../ProductSearch";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { categoryApi } from "@/app/dashboard/utils/api";
import { data } from "autoprefixer";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Separator } from "../ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

const navLinks = [
  { href: "/", label: "home" },
  { href: "/products", label: "products" },
  { href: "#", label: "Categories" },
  { href: "/checkout", label: "checkout" },
  { href: "/contact", label: "contact" },
];

export function Navbar() {
  const queryClient = useQueryClient();

  const t = useTranslations("Navigation");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryApi.getAll,
  });
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500",
        scrolled
          ? "bg-background/75 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      )}
    >
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4 sm:gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span
              className={cn(
                "font-semibold text-lg transition-colors duration-300 hover:text-primary",
                scrolled ? "text-foreground" : "text-foreground/90"
              )}
            >
              {t("brand")}
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) =>
            link.label === "Categories" ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-sm font-medium transition-colors duration-300 hover:text-primary relative group cursor-pointer inline-flex items-center gap-1",
                      "text-foreground"
                    )}
                  >
                    <span>{t(`links.${link.label}`)}</span>
                    <ChevronDown size={16} />
                    <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                  </Link>
                </PopoverTrigger>
                <PopoverContent className="w-full">
                  <div className="flex flex-nowrap gap-4 overflow-x-auto">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/products?category=${category.id}`}
                        className="whitespace-nowrap px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-50 inline-flex items-center gap-2"
                      >
                        {category.name}
                        <ChevronRight
                          size={16}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </Link>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors duration-300 hover:text-primary relative group cursor-pointer",
                  scrolled ? "text-foreground" : "text-foreground/90"
                )}
              >
                {t(`links.${link.label}`)}
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </Link>
            )
          )}
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:block w-[200px] lg:w-[300px]">
            <ProductSearch />
          </div>
          <WishlistPopover />
          <CartPopover />
          <LanguageSwitcher />

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>
                  <span className="font-semibold text-lg transition-colors duration-300 hover:text-primary">
                    {t("brand")}
                  </span>
                </SheetTitle>
              </SheetHeader>

              {/* Mobile Search */}
              <div className="mt-6">
                <ProductSearch />
              </div>

              <div className="flex flex-col mt-6">
                {navLinks.map((link) =>
                  link.label === "Categories" ? (
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="categories">
                        <AccordionTrigger className="text-sm font-medium hover:text-primary group">
                          {t(`links.${link.label}`)}
                        </AccordionTrigger>
                        {categories.map((category) => (
                          <AccordionContent key={category.id} className="ml-3">
                            <Link
                              href={`/products?category=${category.id}`}
                              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                            >
                              {category.name}
                              <ChevronRight
                                size={16}
                                className="transition-transform group-hover:translate-x-1"
                              />
                            </Link>
                          </AccordionContent>
                        ))}
                      </AccordionItem>
                    </Accordion>
                  ) : (
                    <Link
                      href={link.href}
                      key={link.href}
                      className="text-sm font-medium transition-colors hover:text-primary text-left py-3 border-b"
                      onClick={() => setOpen(false)}
                    >
                      {t(`links.${link.label}`)}
                    </Link>
                  )
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
