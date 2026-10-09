export const ORDER_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export interface Product {
  price: number;
  sale_price: number | null;
  discount_active: boolean;
  in_stock: boolean;
}

export interface PlannerImage {
  id: string;
  url: string;
  position: number;
}

export interface Video {
  id: string;
  title: string | null;
  subtitle: string | null;
  url: string;
  position: number;
}

export interface Order {
  id: number;
  code: string;
  name: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  notes: string | null;
  quantity: number;
  unit_price: number;
  discount: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  created_at: string;
}
