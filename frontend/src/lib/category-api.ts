import { api } from './api-client';
import { Category, ApiResponse } from '@/types';

/**
 * 分类API
 */
export const categoryApi = {
  /**
   * 获取所有分类
   */
  getAllCategories: async (): Promise<ApiResponse<Category[]>> => {
    return await api.get<Category[]>('/api/v1/categories');
  },

  /**
   * 获取根分类（顶级分类）
   */
  getRootCategories: async (): Promise<ApiResponse<Category[]>> => {
    return await api.get<Category[]>('/api/v1/categories/root');
  },

  /**
   * 获取活跃分类
   */
  getActiveCategories: async (): Promise<ApiResponse<Category[]>> => {
    return await api.get<Category[]>('/api/v1/categories/active');
  },

  /**
   * 根据ID获取分类详情
   */
  getCategoryById: async (id: number): Promise<ApiResponse<Category>> => {
    return await api.get<Category>(`/api/v1/categories/${id}`);
  },

  /**
   * 获取子分类
   */
  getChildCategories: async (parentId: number): Promise<ApiResponse<Category[]>> => {
    return await api.get<Category[]>(`/api/v1/categories/${parentId}/children`);
  },

  /**
   * 创建分类（管理员）
   */
  createCategory: async (category: Partial<Category>): Promise<ApiResponse<Category>> => {
    return await api.post<Category>('/api/v1/categories', category);
  },

  /**
   * 更新分类（管理员）
   */
  updateCategory: async (id: number, category: Partial<Category>): Promise<ApiResponse<Category>> => {
    return await api.put<Category>(`/api/v1/categories/${id}`, category);
  },

  /**
   * 删除分类（管理员）
   */
  deleteCategory: async (id: number): Promise<ApiResponse<void>> => {
    return await api.delete<void>(`/api/v1/categories/${id}`);
  },
};
