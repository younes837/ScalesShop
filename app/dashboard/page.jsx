"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { productApi } from "./utils/api";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatDistanceToNow } from "date-fns";

export default function DashboardPage() {
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: () => productApi.getAll(),
  });

  // Calculate total inventory value
  const totalInventoryValue = products.reduce(
    (sum, product) => sum + product.basePrice * product.stockQuantity,
    0
  );

  // Calculate low stock items (less than 10 units)
  const lowStockItems = products.filter(
    (product) => product.stockQuantity < 10
  ).length;

  // Calculate out of stock items
  const outOfStockItems = products.filter(
    (product) => product.stockQuantity === 0
  ).length;

  // Calculate total products
  const totalProducts = products.length;

  // Prepare data for charts
  const stockLevels = products
    .sort((a, b) => b.stockQuantity - a.stockQuantity)
    .slice(0, 5)
    .map((product) => ({
      name: product.name,
      value: product.stockQuantity,
    }));

  const recentProducts = products
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Total Products</h3>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Active products in inventory
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Inventory Value</h3>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalInventoryValue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total value of current stock
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Low Stock Items</h3>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockItems}</div>
            <p className="text-xs text-muted-foreground">
              Products with less than 10 units
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Out of Stock</h3>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{outOfStockItems}</div>
            <p className="text-xs text-muted-foreground">
              Products with zero inventory
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <h3 className="text-lg font-medium">Stock Levels</h3>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stockLevels}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip />
                <Bar dataKey="value" fill="#adfa1d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        {/* Add more charts as needed */}
      </div>

      {/* Recent Products */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium">Recent Products</h3>
          <p className="text-sm text-muted-foreground">
            Recently added products to your inventory
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {recentProducts.map((product) => (
              <div key={product.id} className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {product.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Added{" "}
                    {formatDistanceToNow(new Date(product.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <div className="ml-auto font-medium">${product.basePrice}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
