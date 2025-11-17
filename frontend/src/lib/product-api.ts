import axios from 'axios';
import { Product } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface PaginationParams {
  page: number;
  size: number;
}

export const productApi = {
  getProducts: async (params: PaginationParams) => {
    // TODO: Replace with actual API call when backend is ready
    return {
      data: {
        success: true,
        data: [] as Product[],
      },
    };
  },

  getFeaturedProducts: async (params: PaginationParams) => {
    // TODO: Replace with actual API call when backend is ready
    return {
      data: {
        success: true,
        data: [] as Product[],
      },
    };
  },

  getProductById: async (id: string) => {
    // TODO: Replace with actual API call when backend is ready
    return {
      data: {
        success: true,
        data: null as Product | null,
      },
    };
  },
};
