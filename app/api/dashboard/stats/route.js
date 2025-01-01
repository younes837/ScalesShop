export async function GET() {
  // Connect to your database and get stats
  const stats = {
    totalRevenue: 15423.89,
    revenueIncrease: 12,
    newProducts: 8,
    activeCategories: 12,
    activeSales: 89,
    salesIncrease: 23,
  };

  return Response.json(stats);
}
