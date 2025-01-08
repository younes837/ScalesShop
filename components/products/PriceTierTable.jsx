import { calculateSavingsPercentage } from "@/lib/pricing";

export function PriceTierTable({ product }) {
  if (!product) return null;

  const { basePrice, minOrderQuantity = 1, priceTiers = [] } = product;

  // Create the first tier starting from minOrderQuantity
  const baseTier = {
    minQuantity: minOrderQuantity,
    maxQuantity: priceTiers[0]?.minQuantity - 1 || null,
    pricePerUnit: basePrice,
    savings: 0,
  };

  // Filter and transform price tiers
  const tiers = priceTiers
    .filter((tier) => tier.minQuantity >= minOrderQuantity)
    .sort((a, b) => a.minQuantity - b.minQuantity)
    .map((tier, index, array) => ({
      minQuantity: tier.minQuantity,
      maxQuantity: array[index + 1]?.minQuantity - 1 || null,
      pricePerUnit: tier.pricePerUnit,
      savings: calculateSavingsPercentage(basePrice, tier.pricePerUnit),
    }));

  // Combine base tier with other tiers
  const allTiers = [baseTier, ...tiers];

  return (
    <div className="mt-6">
      <div className="overflow-hidden border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price per Unit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Savings
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {allTiers.map((tier, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {tier.maxQuantity
                    ? `${tier.minQuantity}-${tier.maxQuantity}`
                    : `${tier.minQuantity}+`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${tier.pricePerUnit.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                  {tier.savings > 0 ? `${tier.savings}% off` : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
