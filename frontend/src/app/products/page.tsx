'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { productApi } from '@/lib/product-api';
import { Product } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [categoryId, setCategoryId] = useState<number | undefined>();

  useEffect(() => {
    fetchProducts();
  }, [page, categoryId]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = categoryId
        ? await productApi.getProductsByCategory(categoryId, { page, size: 20 })
        : await productApi.getProducts({ page, size: 20 });

      if (response.data.success && response.data.data) {
        setProducts(response.data.data);
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchKeyword.trim()) {
      fetchProducts();
      return;
    }

    try {
      setLoading(true);
      const response = await productApi.searchProducts(searchKeyword, { page: 0, size: 20 });
      if (response.data.success && response.data.data) {
        setProducts(response.data.data);
        setPage(0);
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.totalPages || 0);
        }
      }
    } catch (err: any) {
      setError(err.message || '搜索失败');
    } finally {
      setLoading(false);
    }
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
        {/* 页面标题和搜索 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">产品列表</h1>

          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="搜索产品..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <Button type="submit">搜索</Button>
          </form>
        </div>

        {/* 产品网格 */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">暂无产品</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="p-0">
                      {product.images?.main ? (
                        <img
                          src={product.images.main}
                          alt={product.name}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                          <span className="text-gray-400">暂无图片</span>
                        </div>
                      )}
                    </CardHeader>

                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {product.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary-600">
                          {formatPrice(product.price, product.currency)}
                        </span>
                        {product.isFeatured && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                            特色
                          </span>
                        )}
                      </div>
                    </CardContent>

                    <CardFooter className="p-4 pt-0">
                      {product.inStock ? (
                        <span className="text-sm text-green-600">有货</span>
                      ) : (
                        <span className="text-sm text-red-600">缺货</span>
                      )}
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>

            {/* 分页 */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <Button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  variant="outline"
                >
                  上一页
                </Button>
                <span className="px-4 py-2 text-gray-700">
                  第 {page + 1} / {totalPages} 页
                </span>
                <Button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  variant="outline"
                >
                  下一页
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
