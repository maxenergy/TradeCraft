/**
 * TradeCraft 类型定义
 */

// ==========================================
// User Types
// ==========================================

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone?: string;
  role: 'USER' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

// ==========================================
// Product Types
// ==========================================

export interface Product {
  id: number;
  categoryId: number;
  categoryName: string;
  sku: string;
  name: string;
  description?: string;
  features?: string[];
  price: number;
  currency: string;
  prices?: Record<string, number>;
  stockQuantity: number;
  weightGrams?: number;
  status: 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK';
  isFeatured: boolean;
  inStock: boolean;
  images?: {
    main?: string;
    gallery?: string[];
  };
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  categoryId: number;
  sku: string;
  nameZhCn: string;
  nameEn: string;
  nameId: string;
  descriptionZhCn?: string;
  descriptionEn?: string;
  descriptionId?: string;
  priceCny: number;
  priceUsd: number;
  priceIdr: number;
  priceMyr: number;
  stockQuantity: number;
  weightGrams?: number;
  isFeatured?: boolean;
  tags?: string[];
}

// ==========================================
// Category Types
// ==========================================

export interface Category {
  id: number;
  name: string;
  description?: string;
  parentId?: number;
  children?: Category[];
  sortOrder: number;
  isActive: boolean;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// Cart Types
// ==========================================

export interface CartItem {
  id: number;
  productId: number;
  product: Product;
  quantity: number;
  price: number;
  total: number;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  subtotal: number;
  total: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

// ==========================================
// Order Types
// ==========================================

export interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentMethod: 'STRIPE' | 'PAYPAL' | 'COD';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  currency: string;
  subtotal: number;
  shippingFee: number;
  tax: number;
  total: number;
  shippingAddress: Address;
  billingAddress?: Address;
  items: OrderItem[];
  trackingNumber?: string;
  carrier?: string;
  customerNotes?: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  productSku: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Address {
  firstName: string;
  lastName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  country: string;
  postalCode: string;
}

export interface CreateOrderRequest {
  paymentMethod: 'STRIPE' | 'PAYPAL' | 'COD';
  shippingAddress: Address;
  billingAddress?: Address;
  customerNotes?: string;
}

// ==========================================
// API Response Types
// ==========================================

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: ErrorDetails;
  pagination?: PaginationMeta;
}

export interface ErrorDetails {
  code: string;
  message: string;
  fieldErrors?: FieldError[];
}

export interface FieldError {
  field: string;
  message: string;
  rejectedValue?: any;
}

export interface PaginationMeta {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface PageRequest {
  page?: number;
  size?: number;
  sort?: string;
}

// ==========================================
// Filter Types
// ==========================================

export interface ProductFilters {
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isFeatured?: boolean;
  keyword?: string;
}

// ==========================================
// UI Types
// ==========================================

export type Currency = 'CNY' | 'USD' | 'IDR' | 'MYR';
export type Language = 'zh-CN' | 'en' | 'id';

export interface ToastOptions {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}
