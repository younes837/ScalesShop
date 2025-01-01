import { DollarSign, ShieldCheckIcon, TruckIcon, Users } from "lucide-react";

const features = [
  {
    title: "Dynamic Pricing",
    description:
      "Automatic volume discounts and custom pricing tiers for your business needs",
    icon: DollarSign,
  },
  {
    title: "Business Accounts",
    description:
      "Dedicated account management and specialized support for B2B customers",
    icon: Users,
  },
  {
    title: "Bulk Ordering",
    description:
      "Streamlined ordering process for large quantities with real-time inventory",
    icon: TruckIcon,
  },
  {
    title: "Secure Transactions",
    description: "Enterprise-grade security for all your business transactions",
    icon: ShieldCheckIcon,
  },
];

export default function Features() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose Our Platform
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to streamline your wholesale purchasing
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
