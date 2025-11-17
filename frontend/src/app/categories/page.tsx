'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';

interface Category {
  id: number;
  name: string;
  icon: string;
  productCount: number;
  description: string;
  image?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await categoryApi.getCategories();

      // Mock data for development
      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockCategories: Category[] = [
        {
          id: 1,
          name: '电子产品',
          icon: '📱',
          productCount: 1234,
          description: '智能手机、平板电脑、笔记本电脑等',
          image: 'https://via.placeholder.com/400x300',
        },
        {
          id: 2,
          name: '时尚服饰',
          icon: '👔',
          productCount: 2345,
          description: '男装、女装、童装、配饰等',
          image: 'https://via.placeholder.com/400x300',
        },
        {
          id: 3,
          name: '家居生活',
          icon: '🏠',
          productCount: 1567,
          description: '家具、家纺、厨具、装饰品等',
          image: 'https://via.placeholder.com/400x300',
        },
        {
          id: 4,
          name: '美妆护肤',
          icon: '💄',
          productCount: 1890,
          description: '护肤品、彩妆、香水、个护等',
          image: 'https://via.placeholder.com/400x300',
        },
        {
          id: 5,
          name: '运动户外',
          icon: '⚽',
          productCount: 987,
          description: '运动装备、户外用品、健身器材等',
          image: 'https://via.placeholder.com/400x300',
        },
        {
          id: 6,
          name: '母婴玩具',
          icon: '🍼',
          productCount: 1234,
          description: '奶粉、纸尿裤、玩具、童车等',
          image: 'https://via.placeholder.com/400x300',
        },
        {
          id: 7,
          name: '食品饮料',
          icon: '🍕',
          productCount: 2456,
          description: '零食、饮料、酒水、保健品等',
          image: 'https://via.placeholder.com/400x300',
        },
        {
          id: 8,
          name: '图书文娱',
          icon: '📚',
          productCount: 3456,
          description: '图书、音像、文具、乐器等',
          image: 'https://via.placeholder.com/400x300',
        },
        {
          id: 9,
          name: '汽车用品',
          icon: '🚗',
          productCount: 789,
          description: '汽车配件、美容养护、车载电器等',
          image: 'https://via.placeholder.com/400x300',
        },
        {
          id: 10,
          name: '宠物用品',
          icon: '🐾',
          productCount: 654,
          description: '宠物食品、玩具、用品、护理等',
          image: 'https://via.placeholder.com/400x300',
        },
        {
          id: 11,
          name: '珠宝首饰',
          icon: '💎',
          productCount: 567,
          description: '项链、手镯、戒指、耳环等',
          image: 'https://via.placeholder.com/400x300',
        },
        {
          id: 12,
          name: '办公用品',
          icon: '🖊️',
          productCount: 890,
          description: '办公文具、办公设备、耗材等',
          image: 'https://via.placeholder.com/400x300',
        },
      ];

      setCategories(mockCategories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">商品分类</h1>
            <p className="text-xl text-primary-100">
              浏览所有商品分类，找到您需要的商品
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">全部分类</h2>
                <p className="text-gray-600 mt-1">
                  共 {categories.length} 个分类，
                  {categories.reduce((sum, cat) => sum + cat.productCount, 0).toLocaleString()} 件商品
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/products?category=${category.id}`}>
                <Card className="h-full group hover:shadow-xl transition-all duration-300 cursor-pointer">
                  <CardContent className="p-0">
                    {/* Category Image */}
                    {category.image && (
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        <div className="absolute bottom-4 left-4">
                          <div className="flex items-center">
                            <span className="text-4xl mr-2">{category.icon}</span>
                            <h3 className="text-2xl font-bold text-white">
                              {category.name}
                            </h3>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Category Info */}
                    <div className="p-6">
                      {!category.image && (
                        <div className="flex items-center mb-3">
                          <span className="text-4xl mr-3">{category.icon}</span>
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                            {category.name}
                          </h3>
                        </div>
                      )}

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {category.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {category.productCount.toLocaleString()} 件商品
                        </span>
                        <span className="text-primary-600 group-hover:translate-x-1 transition-transform inline-flex items-center text-sm font-medium">
                          浏览
                          <svg className="w-4 h-4 ml-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Products Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">热门商品</h2>
            <p className="text-gray-600">
              精选各分类热销商品
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.slice(0, 4).map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.id}&sort=popular`}
                className="group"
              >
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="text-5xl mb-3">{category.icon}</div>
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {category.name}热销
                    </h3>
                    <p className="text-sm text-gray-600">
                      查看热门商品
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            没找到您需要的分类？
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            使用搜索功能快速找到您需要的商品
          </p>
          <Link href="/products">
            <button className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              浏览所有商品
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
