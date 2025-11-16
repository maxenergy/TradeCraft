/**
 * 产品API
 */
import { api } from './api-client';
import type {
  Product,
  CreateProductRequest,
  PageRequest,
  ProductFilters,
} from '@/types';

export const productApi = {
  /**
   * 获取产品列表
   */
  getProducts: async (params?: PageRequest & ProductFilters) => {
    return api.get<Product[]>('/api/v1/products', { params });
  },

  /**
   * 获取产品详情
   */
  getProduct: async (id: number) => {
    return api.get<Product>(`/api/v1/products/${id}`);
  },

  /**
   * 根据SKU获取产品
   */
  getProductBySku: async (sku: string) => {
    return api.get<Product>(`/api/v1/products/sku/${sku}`);
  },

  /**
   * 搜索产品
   */
  searchProducts: async (keyword: string, params?: PageRequest) => {
    return api.get<Product[]>('/api/v1/products/search', {
      params: { keyword, ...params },
    });
  },

  /**
   * 获取精选产品
   */
  getFeaturedProducts: async (params?: PageRequest) => {
    return api.get<Product[]>('/api/v1/products/featured', { params });
  },

  /**
   * 获取分类下的产品
   */
  getProductsByCategory: async (categoryId: number, params?: PageRequest) => {
    return api.get<Product[]>(`/api/v1/products/category/${categoryId}`, {
      params,
    });
  },

  /**
   * 创建产品（管理员）
   */
  createProduct: async (data: CreateProductRequest) => {
    return api.post<Product>('/api/v1/products', data);
  },

  /**
   * 更新产品（管理员）
   */
  updateProduct: async (id: number, data: Partial<CreateProductRequest>) => {
    return api.put<Product>(`/api/v1/products/${id}`, data);
  },

  /**
   * 删除产品（管理员）
   */
  deleteProduct: async (id: number) => {
    return api.delete(`/api/v1/products/${id}`);
  },

  /**
   * 上传产品图片
   */
  uploadImage: async (productId: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    return api.post(`/api/v1/products/${productId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
