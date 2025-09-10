"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase-client";
import { Order, DashboardStats } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import MainNavigation from "@/components/MainNavigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function DashboardContent() {
  const {} = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    todayOrders: 0,
    totalSales: 0,
    pendingDeliveries: 0,
    completedOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const db = getFirebaseDb();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const ordersQuery = query(
        collection(db, "orders"),
        where("createdAt", ">=", Timestamp.fromDate(today)),
        where("createdAt", "<", Timestamp.fromDate(tomorrow))
      );

      const querySnapshot = await getDocs(ordersQuery);
      const orders: Order[] = [];

      querySnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() } as Order);
      });

      // Calculate stats
      const todayOrders = orders.length;
      const totalSales = orders.reduce(
        (sum, order) => sum + order.totalAmount,
        0
      );
      const pendingDeliveries = orders.filter((order) =>
        ["pending", "preparing", "ready", "out-for-delivery"].includes(
          order.status
        )
      ).length;
      const completedOrders = orders.filter(
        (order) => order.status === "delivered"
      ).length;

      setStats({ todayOrders, totalSales, pendingDeliveries, completedOrders });

      // Get recent orders (last 5)
      const sortedOrders = orders
        .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis())
        .slice(0, 5);
      setRecentOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "preparing":
        return "bg-blue-500";
      case "ready":
        return "bg-green-500";
      case "out-for-delivery":
        return "bg-purple-500";
      case "delivered":
        return "bg-slate-500";
      default:
        return "bg-slate-500";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-card shadow-sm border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="h-8 bg-muted rounded w-48 animate-pulse"></div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <div className="h-5 bg-muted rounded w-3/4 animate-pulse"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-muted rounded w-1/2 animate-pulse"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Overview of your coffee shop operations
          </p>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Today&apos;s Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.todayOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ₱{stats.totalSales.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Pending Deliveries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {stats.pendingDeliveries}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Completed Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {stats.completedOrders}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest orders from today</CardDescription>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No orders today yet
              </p>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg bg-card/50 hover:bg-card/70 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium text-foreground">
                            {order.customerName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {order.customerPhone}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {order.customerAddress}
                          </p>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.replace("-", " ")}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">
                        ₱{order.totalAmount}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.createdAt.toDate().toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
