import { apiClient } from './api-client';
import { ApiResponse, Order, CreateOrderRequest, PageRequest } from '@/types';

export const orderApi = {
  /**
   * 创建订单
   */
  createOrder: async (data: CreateOrderRequest) => {
    return apiClient.post<ApiResponse<Order>>('/api/v1/orders', data);
  },

  /**
   * 获取我的订单
   */
  getMyOrders: async (params?: PageRequest) => {
    return apiClient.get<ApiResponse<Order[]>>('/api/v1/orders', { params });
  },

  /**
   * 根据订单号获取订单
   */
  getOrder: async (orderNumber: string) => {
    return apiClient.get<ApiResponse<Order>>(`/api/v1/orders/${orderNumber}`);
  },

  /**
   * 取消订单
   */
  cancelOrder: async (orderId: number) => {
    return apiClient.post<ApiResponse<void>>(`/api/v1/orders/${orderId}/cancel`);
  },
};
