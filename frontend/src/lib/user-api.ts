import { api } from './api-client';
import { User, ApiResponse } from '@/types';

/**
 * 更新用户信息请求
 */
export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  phone?: string;
}

/**
 * 修改密码请求
 */
export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

/**
 * 用户API
 */
export const userApi = {
  /**
   * 获取当前用户信息
   */
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    return await api.get<User>('/api/v1/users/me');
  },

  /**
   * 更新当前用户信息
   */
  updateCurrentUser: async (data: UpdateUserRequest): Promise<ApiResponse<User>> => {
    return await api.put<User>('/api/v1/users/me', data);
  },

  /**
   * 修改密码
   */
  changePassword: async (data: ChangePasswordRequest): Promise<ApiResponse<void>> => {
    return await api.post<void>('/api/v1/users/me/change-password', data);
  },

  /**
   * 根据ID获取用户信息（管理员）
   */
  getUserById: async (id: number): Promise<ApiResponse<User>> => {
    return await api.get<User>(`/api/v1/users/${id}`);
  },
};
