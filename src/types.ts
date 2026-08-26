export interface Shop {
  id: string;
  name: string; // e.g. "SSG Dimapur Main"
  slug: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  whatsapp: string; // "919876543210" (no + or spaces)
  lat: number;
  lng: number;
  openHours: string; // "9 AM - 8 PM"
  warehouseId: string; // FK - used by backend only, kept on frontend for reference
  isActive: boolean;
}

export type SchoolBoard = 'CBSE' | 'ICSE' | 'SEBA' | 'STATE' | 'NBSE' | 'OTHER';

export interface School {
  id: string;
  name: string; // "Holy Cross Higher Secondary School"
  slug: string;
  logo: string; // URL
  city: string;
  board: SchoolBoard;
  classesOffered: string[]; // ["Nursery", "LKG", "UKG", "Class 1", ..., "Class 12"]
  availableInShops: string[]; // array of shopIds
  address?: string;
}

export interface Category {
  id: string;
  name: string; // "Textbooks"
  slug: string;
  parentId: string | null; // for sub-categories
  icon: string; // icon name or URL
  image: string;
  order: number;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  images: string[];
  price: number; // in Rs, integer
  mrp: number;
  categoryId: string;
  subCategoryId?: string | null;
  schoolId: string | null; // null = generic product; set = school-specific
  classes?: string[]; // ["Class 5"] or ["Class 6", "Class 7"] etc.
  brand?: string | null;
  sku?: string;
  stockByShop?: {
    [shopId: string]: number;
  };
  isActive?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  createdAt?: string; // ISO
  swatches?: string[]; // hex color dots for visual reference (like Sportel)
  specifications?: { label: string; value: string }[];
}

export interface CartItem {
  productId: string;
  quantity: number;
  addedAt: string;
  shopId: string; // pin to shop at time of adding
}

export interface OrderItem {
  productId: string;
  name: string; // snapshot at order time
  price: number; // snapshot
  quantity: number;
  imageUrl?: string;
  classes?: string[];
  schoolName?: string;
}

export interface OrderCustomer {
  name: string;
  phone: string;
  email?: string;
}

export interface OrderDeliveryAddress {
  line1: string;
  line2?: string;
  city: string;
  pincode: string;
  state: string;
  landmark?: string;
}

export type DeliveryMethod = 'DELIVERY' | 'PICKUP';
export type PaymentMethod = 'COD' | 'UPI' | 'UPI_QR' | 'RAZORPAY';
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface Order {
  id: string;
  shopId: string;
  customer: OrderCustomer;
  deliveryAddress: OrderDeliveryAddress;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
  source: 'ONLINE';
  estimatedDelivery?: string;
}

export interface OrderPayload {
  shopId: string;
  customer: OrderCustomer;
  deliveryAddress: OrderDeliveryAddress;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  notes?: string;
}

export interface ProductFilters {
  shopId: string;
  schoolId?: string;
  categoryId?: string;
  subCategoryId?: string;
  classes?: string[];
  priceMin?: number;
  priceMax?: number;
  inStockOnly?: boolean;
  search?: string;
  sort?: 'featured' | 'price_asc' | 'price_desc' | 'newest';
  page?: number;
  limit?: number;
}
