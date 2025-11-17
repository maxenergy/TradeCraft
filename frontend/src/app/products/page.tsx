'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { productApi } from '@/lib/product-api';
import { Product } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import { ProductFilter, FilterOptions } from '@/components/product/ProductFilter';
import { WishlistButton } from '@/components/product/WishlistButton';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState<FilterOptions>({});

  useEffect(() => {
    fetchProducts();
  }, [page, filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      // TODO: Implement filtered API call
      // For now, use basic product fetch
      const response = await productApi.getProducts({ page, size: 20 });

      if (response.data.success && response.data.data) {
        let filteredProducts = response.data.data;

        // Client-side filtering (should be done server-side in production)
        if (filters.searchQuery) {
          filteredProducts = filteredProducts.filter(p =>
            p.name.toLowerCase().includes(filters.searchQuery!.toLowerCase())
          );
        }

        if (filters.categories && filters.categories.length > 0) {
          filteredProducts = filteredProducts.filter(p =>
            filters.categories!.includes(p.categoryId)
          );
        }

        if (filters.priceRange) {
          filteredProducts = filteredProducts.filter(p =>
            p.price >= filters.priceRange!.min && p.price <= filters.priceRange!.max
          );
        }

        if (filters.rating) {
          filteredProducts = filteredProducts.filter(p =>
            (p.rating || 0) >= filters.rating!
          );
        }

        if (filters.inStock) {
          filteredProducts = filteredProducts.filter(p => p.inStock);
        }

        // Sorting
        if (filters.sortBy) {
          filteredProducts = [...filteredProducts].sort((a, b) => {
            switch (filters.sortBy) {
              case 'price_asc':
                return a.price - b.price;
              case 'price_desc':
                return b.price - a.price;
              case 'rating':
                return (b.rating || 0) - (a.rating || 0);
              case 'popular':
                return (b.reviewCount || 0) - (a.reviewCount || 0);
              case 'newest':
              default:
                return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
            }
          });
        }

        setProducts(filteredProducts);

        if (response.data.pagination) {
          setTotalPages(response.data.pagination.totalPages || 0);
        }
      }
    } catch (err: any) {
      setError(err.message || '加载产品失败');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setPage(0); // Reset to first page when filters change
  };

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchProducts}>重试</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">商品列表</h1>
          <p className="text-gray-600">
            找到 <span className="font-semibold text-gray-900">{products.length}</span> 件商品
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ProductFilter
              onFilterChange={handleFilterChange}
              categories={[
                { id: 1, name: '电子产品', count: 25 },
                { id: 2, name: '时尚服饰', count: 18 },
                { id: 3, name: '家居生活', count: 32 },
                { id: 4, name: '美妆护肤', count: 15 },
                { id: 5, name: '运动户外', count: 22 },
              ]}
            />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {products.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg
                      className="w-16 h-16 mx-auto"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">未找到匹配的商品</h3>
                  <p className="text-gray-600 mb-4">请尝试调整筛选条件</p>
                  <Button variant="outline" onClick={() => setFilters({})}>
                    清除筛选
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <Card key={product.id} className="h-full hover:shadow-lg transition-shadow group relative">
                      {/* Wishlist Button */}
                      <div className="absolute top-4 right-4 z-10">
                        <WishlistButton productId={product.id} size="md" className="shadow-md" />
                      </div>

                      <Link href={`/products/${product.id}`}>
                        <CardHeader className="p-0 relative">
                          {product.images?.main ? (
                            <img
                              src={product.images.main}
                              alt={product.name}
                              className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                              <span className="text-gray-400">暂无图片</span>
                            </div>
                          )}

                          {/* Badges */}
                          <div className="absolute top-4 left-4 flex flex-col gap-2">
                            {product.isFeatured && (
                              <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-semibold rounded">
                                特色
                              </span>
                            )}
                            {!product.inStock && (
                              <span className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded">
                                缺货
                              </span>
                            )}
                          </div>
                        </CardHeader>

                        <CardContent className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
                            {product.name}
                          </h3>

                          {/* Rating */}
                          {product.rating && (
                            <div className="flex items-center mb-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < Math.round(product.rating || 0)
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                    fill={i < Math.round(product.rating || 0) ? 'currentColor' : 'none'}
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="ml-1 text-xs text-gray-600">
                                ({product.reviewCount || 0})
                              </span>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-primary-600">
                              {formatPrice(product.price, product.currency)}
                            </span>
                          </div>
                        </CardContent>

                        <CardFooter className="p-4 pt-0">
                          {product.inStock ? (
                            <span className="text-sm text-green-600 flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              有货
                            </span>
                          ) : (
                            <span className="text-sm text-red-600">缺货</span>
                          )}
                        </CardFooter>
                      </Link>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-between border-t pt-6">
                    <div className="text-sm text-gray-600">
                      第 {page + 1} 页，共 {totalPages} 页
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                        disabled={page === 0}
                        variant="outline"
                        size="sm"
                      >
                        上一页
                      </Button>
                      <Button
                        onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                        disabled={page >= totalPages - 1}
                        variant="outline"
                        size="sm"
                      >
                        下一页
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
