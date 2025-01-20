import { DollarSign, ShieldCheckIcon, TruckIcon, Users } from "lucide-react";
import { useTranslations } from "next-intl";

const features = [
  {
    key: "dynamicPricing",
    icon: DollarSign,
  },
  {
    key: "businessAccounts",
    icon: Users,
  },
  {
    key: "bulkOrdering",
    icon: TruckIcon,
  },
  {
    key: "secureTransactions",
    icon: ShieldCheckIcon,
  },
];

export default function Features() {
  const t = useTranslations("LandingPage.features");

  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t("title")}
          </h2>
          <p className="text-xl text-gray-600">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.key}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t(`items.${feature.key}.title`)}
              </h3>
              <p className="text-gray-600">
                {t(`items.${feature.key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
