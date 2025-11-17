'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { productApi } from '@/lib/product-api';
import { Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card';
import { formatPrice } from '@/lib/utils';
import { WishlistButton } from '@/components/product/WishlistButton';

interface Category {
  id: number;
  name: string;
  icon: string;
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const [featuredResponse, newResponse] = await Promise.all([
        productApi.getFeaturedProducts({ page: 0, size: 8 }),
        productApi.getProducts({ page: 0, size: 4 })
      ]);

      if (featuredResponse.data.success && featuredResponse.data.data) {
        setFeaturedProducts(featuredResponse.data.data);
      }

      if (newResponse.data.success && newResponse.data.data) {
        setNewProducts(newResponse.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSubscribing(true);
    try {
      // TODO: Implement newsletter API
      alert('感谢订阅！我们会将最新优惠发送到您的邮箱。');
      setEmail('');
    } catch (error) {
      console.error('Failed to subscribe:', error);
      alert('订阅失败，请重试');
    } finally {
      setSubscribing(false);
    }
  };

  const categories: Category[] = [
    { id: 1, name: '电子产品', icon: '📱' },
    { id: 2, name: '时尚服饰', icon: '👔' },
    { id: 3, name: '家居生活', icon: '🏠' },
    { id: 4, name: '美妆护肤', icon: '💄' },
    { id: 5, name: '运动户外', icon: '⚽' },
    { id: 6, name: '图书文具', icon: '📚' },
    { id: 7, name: '食品饮料', icon: '🍔' },
    { id: 8, name: '母婴玩具', icon: '🧸' },
  ];

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

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">热门分类</h2>
            <p className="text-gray-600">浏览各类精选商品</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.id}`}
                className="flex flex-col items-center p-6 bg-gray-50 rounded-lg hover:bg-primary-50 hover:shadow-md transition-all group"
              >
                <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {category.icon}
                </span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-primary-600 text-center">
                  {category.name}
                </span>
              </Link>
            ))}
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
                <Card key={product.id} className="h-full hover:shadow-lg transition-shadow group relative">
                  <div className="absolute top-4 right-4 z-10">
                    <WishlistButton productId={product.id} size="md" className="shadow-md" />
                  </div>

                  <Link href={`/products/${product.id}`}>
                    <CardHeader className="p-0">
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
                      {product.isFeatured && (
                        <span className="absolute top-4 left-4 px-2 py-1 bg-yellow-500 text-white text-xs font-semibold rounded">
                          特色
                        </span>
                      )}
                    </CardHeader>

                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary-600">
                          {formatPrice(product.price, product.currency)}
                        </span>
                        {product.rating && (
                          <div className="flex items-center">
                            <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            <span className="ml-1 text-sm text-gray-600">{product.rating.toFixed(1)}</span>
                          </div>
                        )}
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
          )}

          <div className="text-center mt-12">
            <Link href="/products">
              <Button size="lg">查看所有产品</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* New Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">最新上架</h2>
            <p className="text-gray-600">抢先体验最新商品</p>
          </div>

          {newProducts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {newProducts.map((product) => (
                <Card key={product.id} className="h-full hover:shadow-lg transition-shadow">
                  <Link href={`/products/${product.id}`}>
                    <CardHeader className="p-0 relative">
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
                      <span className="absolute top-4 left-4 px-2 py-1 bg-blue-500 text-white text-xs font-semibold rounded">
                        NEW
                      </span>
                    </CardHeader>

                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <span className="text-lg font-bold text-primary-600">
                        {formatPrice(product.price, product.currency)}
                      </span>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-primary-500 to-primary-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white mb-8">
            <h2 className="text-3xl font-bold mb-4">订阅我们的新闻通讯</h2>
            <p className="text-primary-100 text-lg">
              第一时间获取最新优惠、新品上架和独家折扣信息
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="请输入您的邮箱地址"
                required
                className="flex-1 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
              />
              <Button
                type="submit"
                disabled={subscribing}
                className="bg-white text-primary-600 hover:bg-gray-100 whitespace-nowrap px-8"
              >
                {subscribing ? '订阅中...' : '立即订阅'}
              </Button>
            </div>
            <p className="text-primary-100 text-sm mt-3 text-center">
              我们重视您的隐私，绝不会向第三方分享您的邮箱
            </p>
          </form>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">准备好开始了吗？</h2>
          <p className="text-xl mb-8 text-gray-300">
            立即注册，开启您的跨境购物之旅
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="bg-primary-600 hover:bg-primary-700">
                免费注册
              </Button>
            </Link>
            <Link href="/products">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                浏览商品
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
