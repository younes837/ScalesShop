export async function GET() {
  // Get recent sales from your database
  const recentSales = [
    {
      id: 1,
      productName: "Product A",
      customerEmail: "customer@example.com",
      amount: 125.99,
      date: new Date(),
    },
    // ... more sales
  ];

  return Response.json(recentSales);
}
