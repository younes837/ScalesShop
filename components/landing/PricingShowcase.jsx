import { Check } from "lucide-react";

const tiers = [
  {
    name: "Standard",
    minQuantity: "1-99 units",
    pricePerUnit: "$10",
    savings: "0%",
    features: [
      "Standard shipping rates",
      "Basic account support",
      "Online ordering system",
      "Order tracking",
    ],
  },
  {
    name: "Wholesale",
    minQuantity: "100-999 units",
    pricePerUnit: "$8",
    savings: "20%",
    features: [
      "Discounted shipping",
      "Priority support",
      "Bulk ordering tools",
      "Order history analytics",
      "Custom invoicing",
    ],
  },
  {
    name: "Enterprise",
    minQuantity: "1000+ units",
    pricePerUnit: "$6",
    savings: "40%",
    features: [
      "Free shipping",
      "Dedicated account manager",
      "API access",
      "Custom pricing",
      "Volume discounts",
      "Early access to new products",
    ],
  },
];

export default function PricingShowcase() {
  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Volume-Based Pricing
          </h2>
          <p className="text-xl text-gray-600">
            The more you buy, the more you save
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {tier.name}
              </h3>
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Min. Quantity:</p>
                <p className="text-lg font-semibold">{tier.minQuantity}</p>
              </div>
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Price per unit:</p>
                <p className="text-4xl font-bold text-blue-600">
                  {tier.pricePerUnit}
                </p>
                {tier.savings !== "0%" && (
                  <p className="text-green-600 font-semibold mt-2">
                    Save {tier.savings}
                  </p>
                )}
              </div>
              <ul className="space-y-4">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
