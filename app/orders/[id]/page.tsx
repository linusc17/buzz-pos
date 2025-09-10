"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Order } from "@/types";
import StatusBadge from "@/components/StatusBadge";
import MainNavigation from "@/components/MainNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function OrderDetailsPage() {
  const [, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [updating, setUpdating] = useState(false);
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const fetchOrder = useCallback(async () => {
    if (!orderId) return;

    try {
      const orderDoc = await getDoc(doc(db, "orders", orderId));
      if (orderDoc.exists()) {
        setOrder({ id: orderDoc.id, ...orderDoc.data() } as Order);
      } else {
        router.push("/orders");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      router.push("/orders");
    }
  }, [orderId, router]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchOrder();
      } else {
        router.push("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, orderId, fetchOrder]);

  const handleStatusUpdate = async (newStatus: Order["status"]) => {
    if (!order) return;

    setUpdating(true);
    try {
      const orderRef = doc(db, "orders", order.id);
      await updateDoc(orderRef, { status: newStatus });
      setOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      toast.success(`Order status updated to ${newStatus.replace("-", " ")}`);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Error updating order status. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const getNextStatus = (
    currentStatus: Order["status"]
  ): Order["status"] | null => {
    switch (currentStatus) {
      case "pending":
        return "preparing";
      case "preparing":
        return "ready";
      case "ready":
        return "out-for-delivery";
      case "out-for-delivery":
        return "delivered";
      case "delivered":
        return null;
      default:
        return null;
    }
  };

  const getStatusHistory = () => {
    const allStatuses: Order["status"][] = [
      "pending",
      "preparing",
      "ready",
      "out-for-delivery",
      "delivered",
    ];
    const currentIndex = allStatuses.indexOf(order!.status);

    return allStatuses.map((status, index) => ({
      status,
      completed: index <= currentIndex,
      current: index === currentIndex,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Order not found
      </div>
    );
  }

  const nextStatus = getNextStatus(order.status);
  const statusHistory = getStatusHistory();

  return (
    <div className="min-h-screen bg-background">
      <MainNavigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Order Details</h1>
          <p className="text-muted-foreground mt-2">Order ID: {order.id}</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Name
                  </label>
                  <p className="text-lg font-semibold text-foreground">
                    {order.customerName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Phone
                  </label>
                  <p className="text-lg text-foreground">
                    {order.customerPhone}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Delivery Address
                  </label>
                  <p className="text-lg text-foreground">
                    {order.customerAddress}
                  </p>
                </div>
                {order.notes && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Special Instructions
                    </label>
                    <p className="text-lg bg-muted p-3 rounded-md text-foreground">
                      {order.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-start p-4 border border-border rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">
                          {item.quantity}x {item.productName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ₱{item.unitPrice} each
                        </p>
                        {item.addons.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-foreground">
                              Add-ons:
                            </p>
                            {item.addons.map((addon, addonIndex) => (
                              <p
                                key={addonIndex}
                                className="text-sm text-muted-foreground ml-2"
                              >
                                + {addon.name} (+₱{addon.price})
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-foreground">
                          ₱
                          {(
                            (item.unitPrice +
                              item.addons.reduce(
                                (sum, addon) => sum + addon.price,
                                0
                              )) *
                            item.quantity
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className="border-t border-border pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-foreground">
                        Total Amount:
                      </span>
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        ₱{order.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status Management */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <StatusBadge
                      status={order.status}
                      className="text-lg px-6 py-2"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Created: {order.createdAt.toDate().toLocaleString()}
                    </p>
                  </div>

                  {/* Status Progress */}
                  <div className="space-y-3">
                    {statusHistory.map(({ status, completed, current }) => (
                      <div
                        key={status}
                        className={`flex items-center space-x-3 p-3 rounded-lg ${
                          current
                            ? "bg-blue-50 dark:bg-blue-950 border-2 border-blue-200 dark:border-blue-800"
                            : completed
                            ? "bg-green-50 dark:bg-green-950"
                            : "bg-muted"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full ${
                            completed ? "bg-green-500" : "bg-muted-foreground"
                          }`}
                        />
                        <span
                          className={`capitalize font-medium ${
                            current
                              ? "text-blue-700 dark:text-blue-300"
                              : completed
                              ? "text-green-700 dark:text-green-300"
                              : "text-muted-foreground"
                          }`}
                        >
                          {status.replace("-", " ")}
                        </span>
                        {current && (
                          <span className="text-blue-600 dark:text-blue-400 text-sm">
                            (Current)
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Status Update Button */}
                  {nextStatus && (
                    <Button
                      onClick={() => handleStatusUpdate(nextStatus)}
                      disabled={updating}
                      className="w-full"
                      size="lg"
                    >
                      {updating ? (
                        "Updating..."
                      ) : (
                        <>
                          {nextStatus === "preparing" &&
                            "Start Preparing Order"}
                          {nextStatus === "ready" && "Mark as Ready"}
                          {nextStatus === "out-for-delivery" &&
                            "Send Out for Delivery"}
                          {nextStatus === "delivered" && "Mark as Delivered"}
                        </>
                      )}
                    </Button>
                  )}

                  {order.status === "delivered" && (
                    <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                      <p className="text-green-800 dark:text-green-200 font-medium">
                        ✓ Order Completed
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
