"use client";

import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useTranslations } from "next-intl";

export function MobileFilters({ children }) {
  const t = useTranslations("Products");
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="lg:hidden">
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          {t("filters.title")}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:w-[340px] p-6">
        <SheetHeader className="mb-6">
          <SheetTitle>{t("filters.title")}</SheetTitle>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
}
