import { api } from './api-client';
import { Product, ApiResponse, PaginationMeta, ProductFilters } from '@/types';

interface PaginationParams {
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: 'ASC' | 'DESC';
}

interface ProductListResponse extends ApiResponse<Product[]> {
  pagination?: PaginationMeta;
}

/**
 * 产品API
 */
export const productApi = {
  /**
   * 获取产品列表（分页）
   */
  getProducts: async (params: PaginationParams = {}): Promise<ProductListResponse> => {
    const { page = 0, size = 20, sortBy = 'id', direction = 'DESC' } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      direction,
    });

    return await api.get<Product[]>(`/api/v1/products?${queryParams}`);
  },

  /**
   * 获取特色产品
   */
  getFeaturedProducts: async (params: PaginationParams = {}): Promise<ProductListResponse> => {
    const { page = 0, size = 20 } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    return await api.get<Product[]>(`/api/v1/products/featured?${queryParams}`);
  },

  /**
   * 根据ID获取产品详情
   */
  getProductById: async (id: string | number): Promise<ApiResponse<Product>> => {
    return await api.get<Product>(`/api/v1/products/${id}`);
  },

  /**
   * 根据SKU获取产品
   */
  getProductBySku: async (sku: string): Promise<ApiResponse<Product>> => {
    return await api.get<Product>(`/api/v1/products/sku/${sku}`);
  },

  /**
   * 根据分类获取产品
   */
  getProductsByCategory: async (
    categoryId: number,
    params: PaginationParams = {}
  ): Promise<ProductListResponse> => {
    const { page = 0, size = 20 } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    return await api.get<Product[]>(`/api/v1/products/category/${categoryId}?${queryParams}`);
  },

  /**
   * 搜索产品
   */
  searchProducts: async (
    keyword: string,
    params: PaginationParams = {}
  ): Promise<ProductListResponse> => {
    const { page = 0, size = 20 } = params;
    const queryParams = new URLSearchParams({
      keyword,
      page: page.toString(),
      size: size.toString(),
    });

    return await api.get<Product[]>(`/api/v1/products/search?${queryParams}`);
  },

  /**
   * 根据价格范围获取产品
   */
  getProductsByPriceRange: async (
    minPrice: number,
    maxPrice: number,
    params: PaginationParams = {}
  ): Promise<ProductListResponse> => {
    const { page = 0, size = 20 } = params;
    const queryParams = new URLSearchParams({
      minPrice: minPrice.toString(),
      maxPrice: maxPrice.toString(),
      page: page.toString(),
      size: size.toString(),
    });

    return await api.get<Product[]>(`/api/v1/products/price-range?${queryParams}`);
  },

  /**
   * 创建产品（管理员）
   */
  createProduct: async (product: Partial<Product>): Promise<ApiResponse<Product>> => {
    return await api.post<Product>('/api/v1/products', product);
  },

  /**
   * 更新产品（管理员）
   */
  updateProduct: async (id: number, product: Partial<Product>): Promise<ApiResponse<Product>> => {
    return await api.put<Product>(`/api/v1/products/${id}`, product);
  },

  /**
   * 删除产品（管理员）
   */
  deleteProduct: async (id: number): Promise<ApiResponse<void>> => {
    return await api.delete<void>(`/api/v1/products/${id}`);
  },

  /**
   * 获取低库存产品（管理员）
   */
  getLowStockProducts: async (threshold: number = 10): Promise<ApiResponse<Product[]>> => {
    const queryParams = new URLSearchParams({
      threshold: threshold.toString(),
    });

    return await api.get<Product[]>(`/api/v1/products/low-stock?${queryParams}`);
  },

  /**
   * 更新产品状态（管理员）
   */
  updateProductStatus: async (
    id: number,
    status: 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK'
  ): Promise<ApiResponse<void>> => {
    const queryParams = new URLSearchParams({
      status,
    });

    return await api.patch<void>(`/api/v1/products/${id}/status?${queryParams}`);
  },
};
