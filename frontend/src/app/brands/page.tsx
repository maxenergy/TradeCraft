'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useNotification } from '@/contexts/NotificationContext';

interface Brand {
  id: string;
  name: string;
  logo: string;
  description: string;
  productCount: number;
  category: string;
  featured: boolean;
  website?: string;
  country: string;
}

export default function BrandsPage() {
  const notification = useNotification();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const loadBrands = async () => {
      setIsLoading(true);
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/brands');
        // const data = await response.json();

        // Mock data for demonstration
        const mockBrands: Brand[] = [
          {
            id: '1',
            name: 'TechVision',
            logo: '/placeholder-brand-logo.jpg',
            description: '领先的智能设备制造商，专注于创新科技产品',
            productCount: 156,
            category: '电子产品',
            featured: true,
            website: 'https://techvision.example.com',
            country: '美国',
          },
          {
            id: '2',
            name: 'AudioPro',
            logo: '/placeholder-brand-logo.jpg',
            description: '专业音频设备品牌，提供高品质音响产品',
            productCount: 89,
            category: '电子产品',
            featured: true,
            website: 'https://audiopro.example.com',
            country: '德国',
          },
          {
            id: '3',
            name: 'SportWear',
            logo: '/placeholder-brand-logo.jpg',
            description: '运动服饰与装备专家，为运动爱好者提供专业产品',
            productCount: 234,
            category: '运动户外',
            featured: true,
            website: 'https://sportwear.example.com',
            country: '美国',
          },
          {
            id: '4',
            name: 'HomeStyle',
            logo: '/placeholder-brand-logo.jpg',
            description: '现代家居生活品牌，打造舒适温馨的家',
            productCount: 178,
            category: '家居生活',
            featured: false,
            country: '瑞典',
          },
          {
            id: '5',
            name: 'BeautyPlus',
            logo: '/placeholder-brand-logo.jpg',
            description: '天然护肤品牌，呵护您的肌肤健康',
            productCount: 92,
            category: '美妆个护',
            featured: true,
            website: 'https://beautyplus.example.com',
            country: '法国',
          },
          {
            id: '6',
            name: 'FreshFood',
            logo: '/placeholder-brand-logo.jpg',
            description: '优质食品供应商，新鲜健康每一天',
            productCount: 321,
            category: '食品饮料',
            featured: false,
            country: '中国',
          },
          {
            id: '7',
            name: 'KidsStar',
            logo: '/placeholder-brand-logo.jpg',
            description: '儿童用品专家，陪伴孩子快乐成长',
            productCount: 145,
            category: '母婴玩具',
            featured: false,
            country: '日本',
          },
          {
            id: '8',
            name: 'BookWise',
            logo: '/placeholder-brand-logo.jpg',
            description: '知识传播者，优质图书出版商',
            productCount: 567,
            category: '图书文娱',
            featured: false,
            country: '英国',
          },
          {
            id: '9',
            name: 'PetCare',
            logo: '/placeholder-brand-logo.jpg',
            description: '宠物用品品牌，关爱您的毛孩子',
            productCount: 112,
            category: '宠物用品',
            featured: false,
            country: '美国',
          },
          {
            id: '10',
            name: 'GreenLife',
            logo: '/placeholder-brand-logo.jpg',
            description: '环保生活倡导者，可持续发展理念',
            productCount: 78,
            category: '家居生活',
            featured: true,
            country: '荷兰',
          },
        ];

        setBrands(mockBrands);
      } catch (error) {
        console.error('Failed to load brands:', error);
        notification.error('加载失败', '无法加载品牌列表');
      } finally {
        setIsLoading(false);
      }
    };

    loadBrands();
  }, [notification]);

  const categories = Array.from(new Set(brands.map((brand) => brand.category)));

  const filteredBrands = brands.filter((brand) => {
    const matchesCategory = selectedCategory === 'all' || brand.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredBrands = brands.filter((brand) => brand.featured);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600">加载品牌...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">品牌大全</h1>
          <p className="text-gray-600">发现 {brands.length} 个优质品牌</p>
        </div>

        {/* Featured Brands Banner */}
        {featuredBrands.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">精选品牌</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {featuredBrands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/brands/${brand.id}`}
                  className="group bg-white rounded-lg p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="relative w-full aspect-square mb-3 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h3 className="text-center font-medium text-gray-900 group-hover:text-primary-600">
                    {brand.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索品牌名称或描述..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${
                  viewMode === 'grid'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                title="网格视图"
              >
                <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${
                  viewMode === 'list'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                title="列表视图"
              >
                <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              全部分类
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Brands List */}
        {filteredBrands.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <svg
                className="w-24 h-24 text-gray-400 mx-auto mb-4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">未找到品牌</h3>
              <p className="text-gray-600">请尝试其他搜索关键词或筛选条件</p>
            </CardContent>
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBrands.map((brand) => (
              <Card key={brand.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Link href={`/brands/${brand.id}`}>
                    <div className="relative w-full aspect-square mb-4 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={brand.logo}
                        alt={brand.name}
                        fill
                        className="object-contain p-8 group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600">
                      {brand.name}
                    </h3>
                  </Link>

                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <svg className="w-4 h-4 mr-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {brand.category}
                  </div>

                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <svg className="w-4 h-4 mr-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {brand.country}
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{brand.description}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {brand.productCount} 个商品
                    </span>
                    {brand.featured && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        精选
                      </span>
                    )}
                  </div>

                  <Link href={`/brands/${brand.id}`}>
                    <Button className="w-full mt-4" variant="outline">
                      查看品牌
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBrands.map((brand) => (
              <Card key={brand.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    <Link href={`/brands/${brand.id}`} className="flex-shrink-0">
                      <div className="relative w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={brand.logo}
                          alt={brand.name}
                          fill
                          className="object-contain p-4 group-hover:scale-105 transition-transform"
                        />
                      </div>
                    </Link>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <Link href={`/brands/${brand.id}`}>
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600">
                            {brand.name}
                          </h3>
                        </Link>
                        {brand.featured && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            精选
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          {brand.category}
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {brand.country}
                        </div>
                        <div>
                          {brand.productCount} 个商品
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4">{brand.description}</p>

                      <div className="flex gap-2">
                        <Link href={`/brands/${brand.id}`}>
                          <Button>查看品牌</Button>
                        </Link>
                        {brand.website && (
                          <a
                            href={brand.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center"
                          >
                            <Button variant="outline">
                              官方网站
                              <svg className="w-4 h-4 ml-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Tips */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="flex items-start">
              <svg
                className="w-6 h-6 text-primary-600 mt-0.5 mr-3 flex-shrink-0"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">品牌小贴士</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 精选品牌经过平台严格审核，品质有保证</li>
                  <li>• 点击品牌名称查看该品牌的所有商品</li>
                  <li>• 使用搜索功能快速找到您喜欢的品牌</li>
                  <li>• 关注品牌获取最新产品和优惠信息</li>
                  <li>• 官方网站链接可直接访问品牌官网</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
