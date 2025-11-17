'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useNotification } from '@/contexts/NotificationContext';

interface FlashSaleProduct {
  id: string;
  name: string;
  image: string;
  originalPrice: number;
  flashPrice: number;
  discount: number;
  stock: number;
  sold: number;
  totalStock: number;
  startTime: string;
  endTime: string;
}

interface TimeSlot {
  id: string;
  time: string;
  status: 'upcoming' | 'active' | 'ended';
  products: FlashSaleProduct[];
}

export default function FlashSalePage() {
  const notification = useNotification();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [activeSlot, setActiveSlot] = useState<string>('');
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFlashSales = async () => {
      setIsLoading(true);
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/flash-sales');
        // const data = await response.json();

        // Mock data
        const mockSlots: TimeSlot[] = [
          {
            id: '1',
            time: '10:00',
            status: 'ended',
            products: [],
          },
          {
            id: '2',
            time: '14:00',
            status: 'active',
            products: [
              {
                id: '101',
                name: '智能手机 Pro Max 旗舰版',
                image: '/placeholder-product.jpg',
                originalPrice: 5999,
                flashPrice: 3999,
                discount: 33,
                stock: 15,
                sold: 85,
                totalStock: 100,
                startTime: '2024-01-18T06:00:00Z',
                endTime: '2024-01-18T08:00:00Z',
              },
              {
                id: '102',
                name: '无线降噪耳机 旗舰款',
                image: '/placeholder-product.jpg',
                originalPrice: 1599,
                flashPrice: 999,
                discount: 38,
                stock: 32,
                sold: 68,
                totalStock: 100,
                startTime: '2024-01-18T06:00:00Z',
                endTime: '2024-01-18T08:00:00Z',
              },
              {
                id: '103',
                name: '智能手表运动版',
                image: '/placeholder-product.jpg',
                originalPrice: 2199,
                flashPrice: 1499,
                discount: 32,
                stock: 5,
                sold: 95,
                totalStock: 100,
                startTime: '2024-01-18T06:00:00Z',
                endTime: '2024-01-18T08:00:00Z',
              },
            ],
          },
          {
            id: '3',
            time: '18:00',
            status: 'upcoming',
            products: [],
          },
          {
            id: '4',
            time: '22:00',
            status: 'upcoming',
            products: [],
          },
        ];

        setTimeSlots(mockSlots);
        setActiveSlot('2');
      } catch (error) {
        console.error('Failed to load flash sales:', error);
        notification.error('加载失败', '无法加载抢购信息');
      } finally {
        setIsLoading(false);
      }
    };

    loadFlashSales();
  }, [notification]);

  useEffect(() => {
    const timer = setInterval(() => {
      // Mock countdown - in real app, calculate from actual end time
      const now = new Date();
      const endTime = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now
      const diff = endTime.getTime() - now.getTime();

      if (diff > 0) {
        setCountdown({
          hours: Math.floor(diff / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleQuickBuy = async (product: FlashSaleProduct) => {
    if (product.stock <= 0) {
      notification.warning('已抢光', '商品已售罄');
      return;
    }

    try {
      // TODO: Replace with actual API call
      notification.success('加入成功', `${product.name} 已加入购物车`);
    } catch (error) {
      notification.error('加入失败', '无法加入购物车');
    }
  };

  const getStockPercentage = (product: FlashSaleProduct) => {
    return Math.round((product.sold / product.totalStock) * 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600">加载抢购信息...</p>
        </div>
      </div>
    );
  }

  const currentSlot = timeSlots.find((slot) => slot.id === activeSlot);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Banner */}
        <div className="mb-8 bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl p-8 text-white text-center shadow-2xl">
          <h1 className="text-5xl font-bold mb-3">⚡ 限时抢购</h1>
          <p className="text-xl text-red-100 mb-6">每天四场，整点开抢，先到先得</p>

          {/* Countdown */}
          {currentSlot && currentSlot.status === 'active' && (
            <div className="inline-block bg-white/20 backdrop-blur-sm rounded-xl px-8 py-4">
              <div className="text-sm text-red-100 mb-2">距离本场结束还剩</div>
              <div className="flex items-center justify-center gap-3">
                <div className="bg-white text-red-600 rounded-lg px-4 py-3 min-w-[70px]">
                  <div className="text-3xl font-bold">{String(countdown.hours).padStart(2, '0')}</div>
                  <div className="text-xs">时</div>
                </div>
                <div className="text-2xl font-bold">:</div>
                <div className="bg-white text-red-600 rounded-lg px-4 py-3 min-w-[70px]">
                  <div className="text-3xl font-bold">{String(countdown.minutes).padStart(2, '0')}</div>
                  <div className="text-xs">分</div>
                </div>
                <div className="text-2xl font-bold">:</div>
                <div className="bg-white text-red-600 rounded-lg px-4 py-3 min-w-[70px]">
                  <div className="text-3xl font-bold">{String(countdown.seconds).padStart(2, '0')}</div>
                  <div className="text-xs">秒</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Time Slots */}
        <div className="mb-8">
          <div className="grid grid-cols-4 gap-4">
            {timeSlots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => setActiveSlot(slot.id)}
                className={`p-6 rounded-xl text-center transition-all ${
                  slot.id === activeSlot
                    ? 'bg-gradient-to-br from-red-500 to-pink-500 text-white shadow-lg scale-105'
                    : slot.status === 'ended'
                    ? 'bg-gray-200 text-gray-500'
                    : 'bg-white text-gray-900 hover:shadow-md'
                }`}
                disabled={slot.status === 'ended'}
              >
                <div className="text-3xl font-bold mb-2">{slot.time}</div>
                <div className="text-sm">
                  {slot.status === 'active' && '抢购中'}
                  {slot.status === 'upcoming' && '即将开始'}
                  {slot.status === 'ended' && '已结束'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {currentSlot && currentSlot.products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentSlot.products.map((product) => {
              const stockPercentage = getStockPercentage(product);
              const isLowStock = product.stock < 10;
              const isSoldOut = product.stock <= 0;

              return (
                <Card key={product.id} className="overflow-hidden hover:shadow-2xl transition-shadow">
                  <div className="relative">
                    {/* Discount Badge */}
                    <div className="absolute top-3 left-3 z-10 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      -{product.discount}%
                    </div>

                    {/* Stock Badge */}
                    {isLowStock && !isSoldOut && (
                      <div className="absolute top-3 right-3 z-10 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                        仅剩 {product.stock} 件
                      </div>
                    )}

                    {isSoldOut && (
                      <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center">
                        <div className="bg-red-600 text-white px-6 py-3 rounded-full text-xl font-bold">
                          已抢光
                        </div>
                      </div>
                    )}

                    {/* Product Image */}
                    <div className="relative h-64 bg-gray-100">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 hover:text-primary-600">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Price */}
                    <div className="mb-4">
                      <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-bold text-red-600">
                          ¥{product.flashPrice}
                        </span>
                        <span className="text-lg text-gray-500 line-through">
                          ¥{product.originalPrice}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        立省 ¥{product.originalPrice - product.flashPrice}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">已抢购</span>
                        <span className="font-medium text-red-600">{stockPercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-red-500 to-pink-500 h-full rounded-full transition-all"
                          style={{ width: `${stockPercentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        已售 {product.sold} / 总量 {product.totalStock}
                      </div>
                    </div>

                    {/* Buy Button */}
                    <Button
                      onClick={() => handleQuickBuy(product)}
                      disabled={isSoldOut}
                      className="w-full"
                      size="lg"
                    >
                      {isSoldOut ? '已抢光' : '立即抢购'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
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
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {currentSlot?.status === 'upcoming' ? '敬请期待' : '暂无商品'}
              </h3>
              <p className="text-gray-600">
                {currentSlot?.status === 'upcoming'
                  ? `${currentSlot.time} 场次即将开始，请稍候`
                  : '本场抢购暂无商品'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Rules */}
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
                <h3 className="font-semibold text-gray-900 mb-2">抢购规则</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 每天四场：10:00、14:00、18:00、22:00</li>
                  <li>• 每场持续2小时，抢完即止</li>
                  <li>• 每个用户每场限购1件同款商品</li>
                  <li>• 抢购商品不支持使用优惠券</li>
                  <li>• 抢购成功后请在30分钟内完成支付</li>
                  <li>• 未付款订单将自动取消，库存回归</li>
                  <li>• 抢购商品支持7天无理由退货</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
