import Image from "next/image";
import { Shield, Award, BadgeCheck } from "lucide-react";
import { useTranslations } from "next-intl";

const certifications = [
  {
    key: "iso",
    icon: Shield,
  },
  {
    key: "leader",
    icon: Award,
  },
  {
    key: "verified",
    icon: BadgeCheck,
  },
];

const testimonials = ["first", "second"];

const partners = [
  {
    name: "TechCorp",
    logo: "/images/partners/techcorp.png",
  },
  {
    name: "Global Industries",
    logo: "/images/partners/global.png",
  },
  {
    name: "Innovate Inc",
    logo: "/images/partners/innovate.png",
  },
  {
    name: "SecureNet",
    logo: "/images/partners/securenet.png",
  },
];

export default function TrustSection() {
  const t = useTranslations("LandingPage.trust");

  return (
    <section id="trust" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Certifications */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {certifications.map((cert) => (
            <div
              key={cert.key}
              className="flex items-center p-6 bg-gray-50 rounded-lg"
            >
              <cert.icon className="w-12 h-12 text-blue-600 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {t(`certifications.${cert.key}.title`)}
                </h3>
                <p className="text-gray-600">
                  {t(`certifications.${cert.key}.description`)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            {t("testimonials.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((key) => (
              <div key={key} className="bg-gray-50 p-8 rounded-lg">
                <p className="text-gray-600 mb-6 italic">
                  "{t(`testimonials.items.${key}.quote`)}"
                </p>
                <div className="flex items-center">
                  <div className="relative w-12 h-12 mr-4">
                    <Image
                      src="/placeholder.png"
                      alt={t(`testimonials.items.${key}.author`)}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {t(`testimonials.items.${key}.author`)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {t(`testimonials.items.${key}.role`)},{" "}
                      {t(`testimonials.items.${key}.company`)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Partner Logos */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            {t("partners.title")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {partners.map((partner) => (
              <div
                key={partner.name}
                className="relative h-16 grayscale hover:grayscale-0 transition-all"
              >
                <Image
                  src="/placeholder.png"
                  alt={partner.name}
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
