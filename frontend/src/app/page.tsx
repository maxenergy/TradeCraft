'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { productApi } from '@/lib/product-api';
import { Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card';
import { formatPrice } from '@/lib/utils';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await productApi.getFeaturedProducts({ page: 0, size: 8 });
      if (response.data.success && response.data.data) {
        setFeaturedProducts(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              欢迎来到 TradeCraft
            </h1>
            <p className="text-xl mb-8 text-primary-100">
              跨境电商平台 - 为全球用户提供优质商品和服务
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/products">
                <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                  浏览产品
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600">
                  立即注册
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                <svg className="w-8 h-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">多币种支持</h3>
              <p className="text-gray-600">
                支持CNY、USD、IDR、MYR等多种货币，满足全球用户需求
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                <svg className="w-8 h-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">多语言平台</h3>
              <p className="text-gray-600">
                支持中文、英文、印尼语等多种语言，打破语言障碍
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                <svg className="w-8 h-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">安全可靠</h3>
              <p className="text-gray-600">
                采用先进的安全技术，保障您的交易安全和隐私
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">特色产品</h2>
            <p className="text-gray-600">精选优质商品，为您推荐</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              暂无特色产品
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
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
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary-600">
                          {formatPrice(product.price, product.currency)}
                        </span>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                          特色
                        </span>
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
          )}

          <div className="text-center mt-12">
            <Link href="/products">
              <Button size="lg">查看所有产品</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">准备好开始了吗？</h2>
          <p className="text-xl mb-8 text-primary-100">
            立即注册，开启您的跨境购物之旅
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
              免费注册
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
