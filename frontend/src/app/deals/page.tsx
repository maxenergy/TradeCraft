'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useNotification } from '@/contexts/NotificationContext';

interface Deal {
  id: string;
  title: string;
  description: string;
  discount: number;
  code?: string;
  startDate: string;
  endDate: string;
  image: string;
  type: 'flash' | 'seasonal' | 'clearance' | 'bundle' | 'new';
  products: {
    id: string;
    name: string;
    price: number;
    originalPrice: number;
    image: string;
    rating: number;
    reviews: number;
    inStock: boolean;
  }[];
}

export default function DealsPage() {
  const notification = useNotification();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const loadDeals = async () => {
      setIsLoading(true);
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/deals');
        // const data = await response.json();

        // Mock data for demonstration
        const mockDeals: Deal[] = [
          {
            id: '1',
            title: '限时闪购',
            description: '精选商品5折起，数量有限，先到先得！',
            discount: 50,
            code: 'FLASH50',
            startDate: '2024-01-15',
            endDate: '2024-01-20',
            image: '/placeholder-deal.jpg',
            type: 'flash',
            products: [
              {
                id: '101',
                name: '智能手机 Pro Max',
                price: 2999,
                originalPrice: 5999,
                image: '/placeholder-product.jpg',
                rating: 4.8,
                reviews: 1234,
                inStock: true,
              },
              {
                id: '102',
                name: '无线蓝牙耳机',
                price: 299,
                originalPrice: 599,
                image: '/placeholder-product.jpg',
                rating: 4.6,
                reviews: 856,
                inStock: true,
              },
            ],
          },
          {
            id: '2',
            title: '新春特惠',
            description: '迎新春，享优惠，全场满减活动进行中',
            discount: 30,
            code: 'SPRING30',
            startDate: '2024-01-10',
            endDate: '2024-02-10',
            image: '/placeholder-deal.jpg',
            type: 'seasonal',
            products: [
              {
                id: '201',
                name: '智能手表旗舰版',
                price: 1399,
                originalPrice: 1999,
                image: '/placeholder-product.jpg',
                rating: 4.7,
                reviews: 654,
                inStock: true,
              },
            ],
          },
          {
            id: '3',
            title: '清仓大促销',
            description: '库存清理，低至3折，机不可失！',
            discount: 70,
            startDate: '2024-01-01',
            endDate: '2024-01-31',
            image: '/placeholder-deal.jpg',
            type: 'clearance',
            products: [
              {
                id: '301',
                name: '平板电脑 2023款',
                price: 899,
                originalPrice: 2999,
                image: '/placeholder-product.jpg',
                rating: 4.5,
                reviews: 432,
                inStock: true,
              },
              {
                id: '302',
                name: '机械键盘',
                price: 199,
                originalPrice: 499,
                image: '/placeholder-product.jpg',
                rating: 4.4,
                reviews: 321,
                inStock: false,
              },
            ],
          },
          {
            id: '4',
            title: '组合套装优惠',
            description: '购买套装更划算，立省1000元',
            discount: 25,
            startDate: '2024-01-05',
            endDate: '2024-02-05',
            image: '/placeholder-deal.jpg',
            type: 'bundle',
            products: [
              {
                id: '401',
                name: '笔记本电脑 + 鼠标套装',
                price: 5999,
                originalPrice: 7999,
                image: '/placeholder-product.jpg',
                rating: 4.9,
                reviews: 987,
                inStock: true,
              },
            ],
          },
          {
            id: '5',
            title: '新品首发',
            description: '最新款产品首发，享早鸟优惠',
            discount: 15,
            code: 'NEW15',
            startDate: '2024-01-18',
            endDate: '2024-01-25',
            image: '/placeholder-deal.jpg',
            type: 'new',
            products: [
              {
                id: '501',
                name: '智能音箱 2024',
                price: 849,
                originalPrice: 999,
                image: '/placeholder-product.jpg',
                rating: 4.8,
                reviews: 156,
                inStock: true,
              },
            ],
          },
        ];

        setDeals(mockDeals);
      } catch (error) {
        console.error('Failed to load deals:', error);
        notification.error('加载失败', '无法加载促销信息');
      } finally {
        setIsLoading(false);
      }
    };

    loadDeals();
  }, [notification]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    notification.success('已复制', `优惠码 ${code} 已复制到剪贴板`);

    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  const getTypeLabel = (type: Deal['type']) => {
    const labels = {
      flash: '限时闪购',
      seasonal: '季节特惠',
      clearance: '清仓促销',
      bundle: '组合优惠',
      new: '新品首发',
    };
    return labels[type];
  };

  const getTypeColor = (type: Deal['type']) => {
    const colors = {
      flash: 'bg-red-100 text-red-800 border-red-200',
      seasonal: 'bg-orange-100 text-orange-800 border-orange-200',
      clearance: 'bg-purple-100 text-purple-800 border-purple-200',
      bundle: 'bg-blue-100 text-blue-800 border-blue-200',
      new: 'bg-green-100 text-green-800 border-green-200',
    };
    return colors[type];
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} fill-current`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const filteredDeals = selectedType === 'all'
    ? deals
    : deals.filter((deal) => deal.type === selectedType);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600">加载促销信息...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">优惠促销</h1>
          <p className="text-gray-600">发现最新的优惠活动和特价商品</p>
        </div>

        {/* Banner */}
        <Card className="mb-8 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h2 className="text-2xl font-bold mb-2">🎉 新春大促销</h2>
                <p className="text-primary-100 mb-4">
                  全场满500减50，满1000减150，满2000减400
                </p>
                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <span className="text-sm">优惠码：</span>
                    <span className="font-bold">NEWYEAR2024</span>
                  </div>
                  <Button
                    variant="outline"
                    className="bg-white text-primary-600 hover:bg-primary-50"
                    onClick={() => handleCopyCode('NEWYEAR2024')}
                  >
                    复制优惠码
                  </Button>
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">30</div>
                <div className="text-sm text-primary-100">天后结束</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedType === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              全部优惠
            </button>
            <button
              onClick={() => setSelectedType('flash')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedType === 'flash'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              限时闪购
            </button>
            <button
              onClick={() => setSelectedType('seasonal')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedType === 'seasonal'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              季节特惠
            </button>
            <button
              onClick={() => setSelectedType('clearance')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedType === 'clearance'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              清仓促销
            </button>
            <button
              onClick={() => setSelectedType('bundle')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedType === 'bundle'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              组合优惠
            </button>
            <button
              onClick={() => setSelectedType('new')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedType === 'new'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              新品首发
            </button>
          </div>
        </div>

        {/* Deals Grid */}
        <div className="space-y-6">
          {filteredDeals.map((deal) => (
            <Card key={deal.id} className="overflow-hidden">
              <div className="md:flex">
                {/* Deal Info */}
                <div className="md:w-1/3 bg-gradient-to-br from-gray-50 to-gray-100 p-6">
                  <div className="mb-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(deal.type)}`}>
                      {getTypeLabel(deal.type)}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{deal.title}</h3>
                  <p className="text-gray-600 mb-4">{deal.description}</p>

                  <div className="mb-4">
                    <div className="flex items-baseline mb-2">
                      <span className="text-4xl font-bold text-red-600">{deal.discount}%</span>
                      <span className="ml-2 text-gray-600">折扣</span>
                    </div>
                  </div>

                  {deal.code && (
                    <div className="mb-4">
                      <label className="text-sm text-gray-600 mb-1 block">优惠码</label>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 font-mono font-semibold">
                          {deal.code}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopyCode(deal.code!)}
                        >
                          {copiedCode === deal.code ? '已复制' : '复制'}
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">活动时间</span>
                      <span className="font-medium text-gray-900">
                        {getDaysRemaining(deal.endDate)} 天后结束
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(deal.startDate).toLocaleDateString()} - {new Date(deal.endDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Products */}
                <div className="md:w-2/3 p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">优惠商品</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {deal.products.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        className="group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
                      >
                        <div className="relative w-full h-40 mb-3 bg-gray-100 rounded-lg overflow-hidden">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                          {!product.inStock && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                已售罄
                              </span>
                            </div>
                          )}
                        </div>

                        <h5 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600">
                          {product.name}
                        </h5>

                        <div className="flex items-center mb-2">
                          {renderStars(product.rating)}
                          <span className="ml-2 text-xs text-gray-500">({product.reviews})</span>
                        </div>

                        <div className="flex items-baseline space-x-2">
                          <span className="text-xl font-bold text-red-600">
                            ¥{product.price.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            ¥{product.originalPrice.toLocaleString()}
                          </span>
                        </div>

                        <div className="mt-2">
                          <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
                            省 ¥{(product.originalPrice - product.price).toLocaleString()}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {deal.products.length > 2 && (
                    <div className="mt-4 text-center">
                      <Button variant="outline" size="sm">
                        查看全部 {deal.products.length} 个商品
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredDeals.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">暂无此类优惠</h3>
            <p className="text-gray-600">请选择其他类型或查看全部优惠</p>
          </div>
        )}

        {/* Tips */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-primary-600 mt-0.5 mr-3 flex-shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">使用提示</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 每个优惠码都有使用期限，请在有效期内使用</li>
                  <li>• 部分活动不可与其他优惠同时使用</li>
                  <li>• 优惠码不区分大小写</li>
                  <li>• 关注我们的社交媒体获取独家优惠码</li>
                  <li>• 订阅邮件通知，第一时间收到新优惠信息</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
