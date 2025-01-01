import { formatPrice } from "@/lib/utils";

export function PriceTierTable({ product }) {
  if (!product.priceTiers?.length) return null;

  return (
    <div className="border rounded-lg">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2 text-left">Quantity</th>
            <th className="px-4 py-2 text-left">Price per Unit</th>
            <th className="px-4 py-2 text-left">Savings</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="px-4 py-2">
              1-{product.priceTiers[0].minQuantity - 1}
            </td>
            <td className="px-4 py-2">{formatPrice(product.basePrice)}</td>
            <td className="px-4 py-2">-</td>
          </tr>
          {product.priceTiers.map((tier, index) => (
            <tr key={tier.id} className="border-b last:border-0">
              <td className="px-4 py-2">
                {tier.minQuantity}
                {index === product.priceTiers.length - 1
                  ? "+"
                  : `-${product.priceTiers[index + 1]?.minQuantity - 1}`}
              </td>
              <td className="px-4 py-2">{formatPrice(tier.pricePerUnit)}</td>
              <td className="px-4 py-2 text-green-600">
                {(
                  ((product.basePrice - tier.pricePerUnit) /
                    product.basePrice) *
                  100
                ).toFixed(0)}
                % off
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
