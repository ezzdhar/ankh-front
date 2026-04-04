import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";

const GUEST_ID_STORAGE_KEY = "ankh_guest_id";

function getOrderSessionScope() {
  if (typeof window === "undefined") {
    return "server";
  }

  const token = localStorage.getItem("token");
  if (token) {
    return `auth:${token.slice(0, 12)}`;
  }

  const guestId = localStorage.getItem(GUEST_ID_STORAGE_KEY);
  return guestId ? `guest:${guestId}` : "guest:anonymous";
}

export interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price: string;
  total: string;
}

export interface Order {
  id: number;
  user_id: number;
  cart_id: number;
  address_id: number;
  coupon_id: number | null;
  payment_method: string;
  payment_status: string;
  order_status: string;
  total: string;
  sub_total: string;
  tax_amount: string;
  discount_amount: string;
  shipping_cost: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  address?: {
    id: number;
    user_id: number;
    city_id: number;
    address_details: string;
    postal_code: string;
  };
  user?: {
    id: number;
    username: string;
    name: string;
    email: string;
  };
}

export interface OrdersPaginatedData {
  current_page: number;
  data: Order[];
  last_page: number;
  per_page: number;
  total: number;
}

export function useOrders(
  page = 1,
  per_page = 10,
  filters?: { search?: string; status?: string; payment_status?: string },
) {
  const sessionScope = getOrderSessionScope();

  return useQuery<ApiResponse<OrdersPaginatedData>>({
    queryKey: ["orders", sessionScope, page, per_page, filters],
    queryFn: async () => {
      const response = await api.get<ApiResponse<OrdersPaginatedData>>(
        "/api/v1/orders",
        {
          params: {
            per_page,
            page,
            search: filters?.search || undefined,
            order_status:
              filters?.status === "all" ? undefined : filters?.status,
            payment_status:
              filters?.payment_status === "all"
                ? undefined
                : filters?.payment_status,
          },
        },
      );
      return response.data;
    },
  });
}
