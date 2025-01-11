import { useTranslations } from "next-intl";
import ProductGrid from "@/components/ProductGrid";
// ... other imports

export default function ProductsPage() {
  const t = useTranslations("products");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>

      <div className="flex justify-between items-center mb-6">
        <div className="space-x-4">
          <button className="btn">{t("filters.all")}</button>
          <button className="btn">{t("filters.price")}</button>
          <button className="btn">{t("filters.category")}</button>
        </div>

        <div className="flex items-center gap-2">
          <span>{t("sort.label")}:</span>
          <select className="select">
            <option>{t("sort.newest")}</option>
            <option>{t("sort.price_low")}</option>
            <option>{t("sort.price_high")}</option>
          </select>
        </div>
      </div>

      <ProductGrid products={products} />
    </div>
  );
}
