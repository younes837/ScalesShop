export async function GET() {
  // Get revenue data from your database
  const revenue = [
    { month: "Jan", revenue: 1000 },
    { month: "Feb", revenue: 1500 },
    { month: "Mar", revenue: 1200 },
    // ... more months
  ];

  return Response.json(revenue);
}
