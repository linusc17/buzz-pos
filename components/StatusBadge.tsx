"use client";

import { Badge } from "@/components/ui/badge";
import { Order } from "@/types";

interface StatusBadgeProps {
  status: Order["status"];
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusConfig = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return {
          color: "bg-yellow-500 hover:bg-yellow-600",
          text: "Pending",
          description: "Order received, waiting to be prepared",
        };
      case "preparing":
        return {
          color: "bg-blue-500 hover:bg-blue-600",
          text: "Preparing",
          description: "Order is being prepared",
        };
      case "ready":
        return {
          color: "bg-green-500 hover:bg-green-600",
          text: "Ready",
          description: "Order is ready for pickup/delivery",
        };
      case "out-for-delivery":
        return {
          color: "bg-purple-500 hover:bg-purple-600",
          text: "Out for Delivery",
          description: "Order is out for delivery",
        };
      case "delivered":
        return {
          color:
            "bg-slate-500 hover:bg-slate-600 dark:bg-slate-400 dark:hover:bg-slate-500",
          text: "Delivered",
          description: "Order has been delivered",
        };
      default:
        return {
          color:
            "bg-slate-500 hover:bg-slate-600 dark:bg-slate-400 dark:hover:bg-slate-500",
          text: "Unknown",
          description: "Unknown status",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge
      className={`${config.color} text-white ${className || ""}`}
      title={config.description}
    >
      {config.text}
    </Badge>
  );
}
