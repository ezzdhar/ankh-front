export interface Product {
  id: number;
  name: string;
  title?: string; // Fallback for name
  slug: string;
  link?: string; // Fallback for slug link
  description?: string;
  price: number;
  old_price?: number; // Representing discount if present
  currency: string;
  image: string; // The main image
  main_image?: string;
  images?: {
    url: string;
  }[]; // Array of additional images
  sku?: string;
  in_stock: boolean;
  rating?: number;
  price_after_discount?: number;
  original_price?: number | string;
  has_discount?: boolean;
  reviews_count?: number;
}

export interface ProductSearchParams {
  search?: string;
  sort_by?: string;
  per_page?: string | number;
  page?: string | number;
  category_id?: number;
  sub_category_id?: number;
  brand_id?: number;
  min_price?: number;
  max_price?: number;
  in_stock_only?: boolean;
  has_discount_only?: boolean;
}

export interface ProductsResponse {
  data: Product[];
  paginate: {
    current_page: number;
    last_page: number;
    per_page: number;
  };
}
