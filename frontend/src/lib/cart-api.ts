import { apiClient } from './api-client';
import { ApiResponse, CartItem } from '@/types';

export const cartApi = {
  /**
   * 获取购物车
   */
  getCart: async () => {
    return apiClient.get<ApiResponse<CartItem[]>>('/api/v1/cart');
  },

  /**
   * 添加商品到购物车
   */
  addToCart: async (productId: number, quantity: number = 1) => {
    return apiClient.post<ApiResponse<CartItem>>('/api/v1/cart/items', null, {
      params: { productId, quantity },
    });
  },

  /**
   * 更新购物车项数量
   */
  updateCartItem: async (itemId: number, quantity: number) => {
    return apiClient.put<ApiResponse<CartItem>>(`/api/v1/cart/items/${itemId}`, null, {
      params: { quantity },
    });
  },

  /**
   * 从购物车删除商品
   */
  removeFromCart: async (itemId: number) => {
    return apiClient.delete<ApiResponse<void>>(`/api/v1/cart/items/${itemId}`);
  },

  /**
   * 清空购物车
   */
  clearCart: async () => {
    return apiClient.delete<ApiResponse<void>>('/api/v1/cart');
  },

  /**
   * 获取购物车商品数量
   */
  getCartCount: async () => {
    return apiClient.get<ApiResponse<number>>('/api/v1/cart/count');
  },
};
