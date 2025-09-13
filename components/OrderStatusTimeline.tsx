"use client";

import { Order } from "@/types";
import {
  getOrderStatusDisplay,
  getStatusProgress,
  isStatusCompleted,
} from "@/lib/order-tracking";
import { CheckCircle, Clock, Truck, Package, Coffee } from "lucide-react";

interface OrderStatusTimelineProps {
  order: Order;
}

export default function OrderStatusTimeline({
  order,
}: OrderStatusTimelineProps) {
  const statuses: Order["status"][] = [
    "pending",
    "preparing",
    "ready",
    "out-for-delivery",
    "delivered",
  ];

  const getStatusIcon = (
    status: Order["status"],
    isActive: boolean,
    isCompleted: boolean
  ) => {
    const iconClass = `h-6 w-6 ${
      isCompleted
        ? "text-green-600"
        : isActive
        ? "text-buzz-orange"
        : "text-gray-400"
    }`;

    const iconMap = {
      pending: <Coffee className={iconClass} />,
      preparing: <Package className={iconClass} />,
      ready: <CheckCircle className={iconClass} />,
      "out-for-delivery": <Truck className={iconClass} />,
      delivered: <CheckCircle className={iconClass} />,
    };

    return iconMap[status];
  };

  const getStatusTime = (status: Order["status"]) => {
    if (order.statusHistory) {
      const statusChange = order.statusHistory.find((s) => s.status === status);
      if (statusChange) {
        return statusChange.timestamp.toDate().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      }
    }

    if (status === "pending" && order.createdAt) {
      return order.createdAt.toDate().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Order Progress</h3>
        <div className="text-sm text-muted-foreground">
          {getStatusProgress(order.status)}% Complete
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-buzz-orange h-2 rounded-full transition-all duration-500"
          style={{ width: `${getStatusProgress(order.status)}%` }}
        />
      </div>

      <div className="space-y-4">
        {statuses.map((status) => {
          const isCompleted = isStatusCompleted(status, order.status);
          const isActive = status === order.status;
          const statusTime = getStatusTime(status);

          return (
            <div key={status} className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {getStatusIcon(status, isActive, isCompleted)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p
                    className={`text-sm font-medium ${
                      isCompleted
                        ? "text-green-600"
                        : isActive
                        ? "text-buzz-orange"
                        : "text-gray-500"
                    }`}
                  >
                    {getOrderStatusDisplay(status)}
                  </p>
                  {statusTime && (
                    <span className="text-xs text-muted-foreground">
                      {statusTime}
                    </span>
                  )}
                </div>

                {isActive && order.trackingNotes && (
                  <p className="text-xs text-buzz-orange mt-1">
                    {order.trackingNotes}
                  </p>
                )}

                {!isCompleted && !isActive && (
                  <div className="flex items-center mt-1">
                    <Clock className="h-3 w-3 text-gray-400 mr-1" />
                    <span className="text-xs text-gray-500">Pending</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
