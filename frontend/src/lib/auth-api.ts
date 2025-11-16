/**
 * 认证API
 */
import { api } from './api-client';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
} from '@/types';

export const authApi = {
  /**
   * 登录
   */
  login: async (credentials: LoginRequest) => {
    return api.post<AuthResponse>('/api/v1/auth/login', credentials);
  },

  /**
   * 注册
   */
  register: async (data: RegisterRequest) => {
    return api.post<AuthResponse>('/api/v1/auth/register', data);
  },

  /**
   * 刷新token
   */
  refreshToken: async (refreshToken: string) => {
    return api.post<AuthResponse>('/api/v1/auth/refresh', { refreshToken });
  },

  /**
   * 登出
   */
  logout: async () => {
    return api.post('/api/v1/auth/logout');
  },

  /**
   * 获取当前用户信息
   */
  getCurrentUser: async () => {
    return api.get<User>('/api/v1/auth/me');
  },

  /**
   * 修改密码
   */
  changePassword: async (oldPassword: string, newPassword: string) => {
    return api.post('/api/v1/auth/change-password', {
      oldPassword,
      newPassword,
    });
  },

  /**
   * 请求密码重置
   */
  requestPasswordReset: async (email: string) => {
    return api.post('/api/v1/auth/forgot-password', { email });
  },

  /**
   * 重置密码
   */
  resetPassword: async (token: string, newPassword: string) => {
    return api.post('/api/v1/auth/reset-password', {
      token,
      newPassword,
    });
  },

  /**
   * 验证邮箱
   */
  verifyEmail: async (token: string) => {
    return api.post('/api/v1/auth/verify-email', { token });
  },
};
