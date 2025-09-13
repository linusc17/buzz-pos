"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getOrderForTracking } from "@/lib/order-tracking";
import { Order } from "@/types";
import OrderTracker from "@/components/OrderTracker";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Search } from "lucide-react";

export default function TrackOrderPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError("Invalid order ID");
        setLoading(false);
        return;
      }

      try {
        const orderData = await getOrderForTracking(orderId);
        if (orderData) {
          setOrder(orderData);
        } else {
          setError(
            "Order not found. Please check your order ID and try again."
          );
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        setError("Unable to load order information. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 text-center">
            <Skeleton className="h-8 w-48 mx-auto mb-2" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <Skeleton className="h-64 w-full" />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md mx-auto px-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="flex justify-center mb-4">
                <AlertCircle className="h-12 w-12 text-red-500" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Order Not Found
              </h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Search className="h-4 w-4" />
                <span>Order ID: {orderId}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md mx-auto px-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="flex justify-center mb-4">
                <AlertCircle className="h-12 w-12 text-yellow-500" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Unable to Load Order
              </h2>
              <p className="text-muted-foreground">
                We couldn&apos;t load your order information. Please try again
                later.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-heading font-bold text-buzz-brown dark:text-buzz-cream">
            Track Your Order
          </h1>
          <p className="text-muted-foreground mt-2">
            Real-time updates on your coffee order
          </p>
        </div>

        <OrderTracker order={order} />
      </div>
    </div>
  );
}
