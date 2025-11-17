'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import { WishlistButton } from '@/components/product/WishlistButton';

interface Product {
  id: number;
  name: string;
  price: number;
  currency: string;
  image?: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  category: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'relevance' | 'price_asc' | 'price_desc' | 'rating'>('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    if (query) {
      searchProducts(query);
    } else {
      setLoading(false);
    }
  }, [query, sortBy]);

  const searchProducts = async (searchQuery: string) => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await productApi.search({ query: searchQuery, sortBy });

      await new Promise((resolve) => setTimeout(resolve, 800));

      // Mock search results
      const mockProducts: Product[] = [
        {
          id: 1,
          name: 'iPhone 15 Pro Max 256GB',
          price: 9999.00,
          currency: 'CNY',
          image: 'https://via.placeholder.com/300',
          rating: 4.8,
          reviewCount: 2341,
          inStock: true,
          category: '电子产品',
        },
        {
          id: 2,
          name: 'MacBook Pro 16" M3 Max',
          price: 25999.00,
          currency: 'CNY',
          image: 'https://via.placeholder.com/300',
          rating: 4.9,
          reviewCount: 1567,
          inStock: true,
          category: '电子产品',
        },
        {
          id: 3,
          name: 'AirPods Pro 第二代',
          price: 1899.00,
          currency: 'CNY',
          image: 'https://via.placeholder.com/300',
          rating: 4.7,
          reviewCount: 3456,
          inStock: true,
          category: '电子产品',
        },
        {
          id: 4,
          name: 'iPad Air 第五代',
          price: 4599.00,
          currency: 'CNY',
          image: 'https://via.placeholder.com/300',
          rating: 4.6,
          reviewCount: 987,
          inStock: false,
          category: '电子产品',
        },
      ];

      // Sort products
      let sortedProducts = [...mockProducts];
      switch (sortBy) {
        case 'price_asc':
          sortedProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          sortedProducts.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          sortedProducts.sort((a, b) => b.rating - a.rating);
          break;
      }

      setProducts(sortedProducts);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  if (!query) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-24 h-24 mx-auto" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-medium text-gray-900 mb-2">请输入搜索关键词</h3>
              <p className="text-gray-600 mb-6">在顶部搜索框输入您想查找的商品</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">搜索中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                搜索结果：<span className="text-primary-600">"{query}"</span>
              </h1>
              <p className="text-gray-600 mt-1">
                找到 {products.length} 件商品
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-4">
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 ${
                    viewMode === 'grid'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 border-l ${
                    viewMode === 'list'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="relevance">相关度</option>
                <option value="price_asc">价格从低到高</option>
                <option value="price_desc">价格从高到低</option>
                <option value="rating">评分最高</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {products.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-24 h-24 mx-auto" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-medium text-gray-900 mb-2">没有找到相关商品</h3>
              <p className="text-gray-600 mb-6">
                尝试使用其他关键词或浏览分类
              </p>
              <div className="flex justify-center gap-4">
                <Link href="/products">
                  <Button>浏览所有商品</Button>
                </Link>
                <Link href="/categories">
                  <Button variant="outline">查看分类</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="group hover:shadow-xl transition-shadow">
                <CardContent className="p-0">
                  <Link href={`/products/${product.id}`}>
                    <div className="relative overflow-hidden rounded-t-lg">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400">暂无图片</span>
                        </div>
                      )}
                      {!product.inStock && (
                        <div className="absolute top-2 left-2">
                          <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                            缺货
                          </span>
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <WishlistButton productId={product.id} size="md" />
                      </div>
                    </div>
                  </Link>

                  <div className="p-4">
                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-center mb-2">
                      {renderStars(product.rating)}
                      <span className="text-sm text-gray-600 ml-2">
                        ({product.reviewCount})
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary-600">
                        {formatPrice(product.price, product.currency)}
                      </span>
                    </div>

                    <div className="mt-3">
                      <span className="text-xs text-gray-500">{product.category}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <Link href={`/products/${product.id}`} className="flex-shrink-0">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-40 h-40 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-40 h-40 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400 text-sm">暂无图片</span>
                        </div>
                      )}
                    </Link>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <div className="flex-1">
                          <Link href={`/products/${product.id}`}>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-primary-600">
                              {product.name}
                            </h3>
                          </Link>

                          <div className="flex items-center mb-3">
                            {renderStars(product.rating)}
                            <span className="text-sm text-gray-600 ml-2">
                              {product.rating} ({product.reviewCount} 评价)
                            </span>
                          </div>

                          <div className="flex items-center gap-4 mb-3">
                            <span className="text-sm text-gray-500">
                              分类：{product.category}
                            </span>
                            {!product.inStock && (
                              <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold">
                                缺货
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col items-end justify-between ml-4">
                          <WishlistButton productId={product.id} size="md" />
                          <div className="text-right">
                            <div className="text-3xl font-bold text-primary-600 mb-2">
                              {formatPrice(product.price, product.currency)}
                            </div>
                            <Link href={`/products/${product.id}`}>
                              <Button size="sm">查看详情</Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Related Searches */}
      {products.length > 0 && (
        <div className="bg-white border-t mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">相关搜索</h2>
            <div className="flex flex-wrap gap-2">
              {['手机', '笔记本电脑', '耳机', '平板电脑', '智能手表'].map((term) => (
                <Link
                  key={term}
                  href={`/search?q=${encodeURIComponent(term)}`}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-primary-100 hover:text-primary-700 transition-colors"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
