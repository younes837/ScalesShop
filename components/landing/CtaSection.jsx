import Link from "next/link";
import { ArrowRight, PhoneCall, Mail } from "lucide-react";
import { useTranslations } from "next-intl";

export default function CtaSection() {
  const t = useTranslations("LandingPage.cta");

  return (
    <section id="cta" className="py-20 bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Main CTA Content */}
          <div className="text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t("title")}
            </h2>
            <p className="text-xl text-blue-100 mb-8">{t("subtitle")}</p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/register"
                className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                {t("buttons.createAccount")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/catalog"
                className="inline-flex items-center px-6 py-3 bg-transparent text-white border-2 border-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                {t("buttons.browseCatalog")}
              </Link>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white p-8 rounded-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {t("contact.title")}
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {t("contact.salesTeam.title")}
                </h4>
                <div className="flex items-center text-gray-600">
                  <PhoneCall className="h-5 w-5 mr-2" />
                  <a
                    href={`tel:${t("contact.salesTeam.phone")}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {t("contact.salesTeam.phone")}
                  </a>
                </div>
                <div className="flex items-center text-gray-600 mt-2">
                  <Mail className="h-5 w-5 mr-2" />
                  <a
                    href={`mailto:${t("contact.salesTeam.email")}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {t("contact.salesTeam.email")}
                  </a>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {t("contact.hours.title")}
                </h4>
                <p className="text-gray-600">{t("contact.hours.weekdays")}</p>
                <p className="text-gray-600">{t("contact.hours.saturday")}</p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {t("contact.demo.title")}
                </h4>
                <p className="text-gray-600 mb-3">
                  {t("contact.demo.description")}
                </p>
                <Link
                  href="/request-demo"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  {t("buttons.scheduleDemo")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
