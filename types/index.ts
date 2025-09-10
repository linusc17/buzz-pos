import { Timestamp } from "firebase/firestore";

export interface Product {
  id: string;
  name: string;
  basePrice: number;
  category: "espresso-based" | "no-caffeine";
  available: boolean;
  description: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Addon {
  id: string;
  name: string;
  price: number;
  type: "shot" | "syrup";
  available: boolean;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  addons: {
    name: string;
    price: number;
  }[];
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  totalAmount: number;
  status: "pending" | "preparing" | "ready" | "out-for-delivery" | "delivered";
  createdAt: Timestamp;
  notes?: string;
  items: OrderItem[];
}

export interface DashboardStats {
  todayOrders: number;
  totalSales: number;
  pendingDeliveries: number;
  completedOrders: number;
}
