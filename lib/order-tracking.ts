import { doc, getDoc } from "firebase/firestore";
import { getFirebaseDb } from "./firebase-client";
import { Order } from "@/types";

export async function getOrderForTracking(
  orderId: string
): Promise<Order | null> {
  try {
    const db = getFirebaseDb();
    const orderRef = doc(db, "orders", orderId);
    const orderDoc = await getDoc(orderRef);

    if (!orderDoc.exists()) {
      return null;
    }

    return { id: orderDoc.id, ...orderDoc.data() } as Order;
  } catch (error) {
    console.error("Error fetching order for tracking:", error);
    return null;
  }
}

export function getOrderStatusDisplay(status: Order["status"]): string {
  const statusMap: Record<Order["status"], string> = {
    pending: "Order Received",
    preparing: "Preparing Your Order",
    ready: "Ready for Pickup/Delivery",
    "out-for-delivery": "Out for Delivery",
    delivered: "Delivered",
  };
  return statusMap[status];
}

export function getStatusProgress(status: Order["status"]): number {
  const progressMap: Record<Order["status"], number> = {
    pending: 20,
    preparing: 40,
    ready: 60,
    "out-for-delivery": 80,
    delivered: 100,
  };
  return progressMap[status];
}

export function isStatusCompleted(
  status: Order["status"],
  currentStatus: Order["status"]
): boolean {
  const statusOrder: Order["status"][] = [
    "pending",
    "preparing",
    "ready",
    "out-for-delivery",
    "delivered",
  ];
  const statusIndex = statusOrder.indexOf(status);
  const currentIndex = statusOrder.indexOf(currentStatus);
  return statusIndex <= currentIndex;
}

export function formatTrackingUrl(orderId: string): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/track/${orderId}`;
  }
  return `/track/${orderId}`;
}

export function getEstimatedDeliveryMessage(order: Order): string {
  if (order.estimatedDeliveryTime) {
    const eta = order.estimatedDeliveryTime.toDate();
    const now = new Date();
    const diffMs = eta.getTime() - now.getTime();
    const diffMins = Math.ceil(diffMs / (1000 * 60));

    if (diffMins > 0 && diffMins <= 120) {
      return `Estimated delivery in ${diffMins} minutes`;
    } else if (diffMins > 120) {
      return `Estimated delivery at ${eta.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }
  }

  const statusMessages: Record<Order["status"], string> = {
    pending: "We'll start preparing your order soon",
    preparing: "Your order is being prepared",
    ready: "Your order is ready for pickup/delivery",
    "out-for-delivery": "Your order is on the way",
    delivered: "Your order has been delivered",
  };

  return statusMessages[order.status];
}
