'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useNotification } from '@/contexts/NotificationContext';

interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  discount: {
    type: 'percentage' | 'fixed' | 'free_shipping';
    value: number;
  };
  minPurchase?: number;
  maxDiscount?: number;
  validFrom: string;
  validUntil: string;
  isUsed: boolean;
  usedAt?: string;
  status: 'active' | 'expired' | 'used';
  category?: string;
}

export default function CouponsPage() {
  const notification = useNotification();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'expired' | 'used'>('active');
  const [showRedeemForm, setShowRedeemForm] = useState(false);
  const [redeemCode, setRedeemCode] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);

  useEffect(() => {
    const loadCoupons = async () => {
      setIsLoading(true);
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/user/coupons');
        // const data = await response.json();

        // Mock data for demonstration
        const mockCoupons: Coupon[] = [
          {
            id: '1',
            code: 'WELCOME100',
            title: '新用户专享优惠券',
            description: '首次购物立减100元',
            discount: {
              type: 'fixed',
              value: 100,
            },
            minPurchase: 500,
            validFrom: '2024-01-01T00:00:00Z',
            validUntil: '2024-12-31T23:59:59Z',
            isUsed: false,
            status: 'active',
            category: '全场通用',
          },
          {
            id: '2',
            code: 'SAVE20',
            title: '限时八折优惠',
            description: '全场商品享受8折优惠',
            discount: {
              type: 'percentage',
              value: 20,
            },
            minPurchase: 200,
            maxDiscount: 500,
            validFrom: '2024-01-15T00:00:00Z',
            validUntil: '2024-01-25T23:59:59Z',
            isUsed: false,
            status: 'active',
            category: '全场通用',
          },
          {
            id: '3',
            code: 'FREESHIP',
            title: '包邮优惠券',
            description: '全国包邮，免运费',
            discount: {
              type: 'free_shipping',
              value: 0,
            },
            validFrom: '2024-01-01T00:00:00Z',
            validUntil: '2024-02-28T23:59:59Z',
            isUsed: false,
            status: 'active',
            category: '运费减免',
          },
          {
            id: '4',
            code: 'SUMMER50',
            title: '夏季促销',
            description: '夏季服装满300减50',
            discount: {
              type: 'fixed',
              value: 50,
            },
            minPurchase: 300,
            validFrom: '2023-06-01T00:00:00Z',
            validUntil: '2023-08-31T23:59:59Z',
            isUsed: false,
            status: 'expired',
            category: '服装配饰',
          },
          {
            id: '5',
            code: 'DOUBLE11',
            title: '双11狂欢优惠',
            description: '全场满1000减200',
            discount: {
              type: 'fixed',
              value: 200,
            },
            minPurchase: 1000,
            validFrom: '2023-11-01T00:00:00Z',
            validUntil: '2023-11-15T23:59:59Z',
            isUsed: true,
            usedAt: '2023-11-11T10:30:00Z',
            status: 'used',
            category: '全场通用',
          },
        ];

        setCoupons(mockCoupons);
      } catch (error) {
        console.error('Failed to load coupons:', error);
        notification.error('加载失败', '无法加载优惠券列表');
      } finally {
        setIsLoading(false);
      }
    };

    loadCoupons();
  }, [notification]);

  const handleRedeemCoupon = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!redeemCode.trim()) {
      notification.warning('请输入优惠码', '优惠码不能为空');
      return;
    }

    setIsRedeeming(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/user/coupons/redeem', {
      //   method: 'POST',
      //   body: JSON.stringify({ code: redeemCode }),
      // });

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock successful redemption
      const newCoupon: Coupon = {
        id: Date.now().toString(),
        code: redeemCode.toUpperCase(),
        title: '兑换成功',
        description: '恭喜您成功兑换优惠券',
        discount: {
          type: 'percentage',
          value: 10,
        },
        minPurchase: 100,
        validFrom: new Date().toISOString(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        isUsed: false,
        status: 'active',
        category: '全场通用',
      };

      setCoupons([newCoupon, ...coupons]);
      notification.success('兑换成功', '优惠券已添加到您的账户');
      setShowRedeemForm(false);
      setRedeemCode('');
    } catch (error) {
      console.error('Failed to redeem coupon:', error);
      notification.error('兑换失败', '优惠码无效或已过期');
    } finally {
      setIsRedeeming(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    notification.success('已复制', `优惠码 ${code} 已复制到剪贴板`);
  };

  const getDaysRemaining = (validUntil: string) => {
    const end = new Date(validUntil);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getDiscountText = (discount: Coupon['discount']) => {
    switch (discount.type) {
      case 'percentage':
        return `${discount.value}% 折扣`;
      case 'fixed':
        return `¥${discount.value} 减免`;
      case 'free_shipping':
        return '免运费';
      default:
        return '优惠';
    }
  };

  const filteredCoupons = coupons.filter((coupon) => {
    if (filter === 'all') return true;
    return coupon.status === filter;
  });

  const counters = {
    all: coupons.length,
    active: coupons.filter((c) => c.status === 'active').length,
    expired: coupons.filter((c) => c.status === 'expired').length,
    used: coupons.filter((c) => c.status === 'used').length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600">加载优惠券...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">我的优惠券</h1>
            <p className="text-gray-600">管理和使用您的优惠券</p>
          </div>
          <Button onClick={() => setShowRedeemForm(!showRedeemForm)}>
            <svg className="w-5 h-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 4v16m8-8H4" />
            </svg>
            兑换优惠券
          </Button>
        </div>

        {/* Redeem Form */}
        {showRedeemForm && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <form onSubmit={handleRedeemCoupon} className="flex gap-4">
                <input
                  type="text"
                  value={redeemCode}
                  onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
                  placeholder="输入优惠码"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  disabled={isRedeeming}
                />
                <Button type="submit" disabled={isRedeeming}>
                  {isRedeeming ? '兑换中...' : '兑换'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 font-medium transition-colors ${
                filter === 'all'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              全部 ({counters.all})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-6 py-3 font-medium transition-colors ${
                filter === 'active'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              可用 ({counters.active})
            </button>
            <button
              onClick={() => setFilter('used')}
              className={`px-6 py-3 font-medium transition-colors ${
                filter === 'used'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              已使用 ({counters.used})
            </button>
            <button
              onClick={() => setFilter('expired')}
              className={`px-6 py-3 font-medium transition-colors ${
                filter === 'expired'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              已过期 ({counters.expired})
            </button>
          </div>
        </div>

        {/* Coupons List */}
        {filteredCoupons.length === 0 ? (
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
                <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无优惠券</h3>
              <p className="text-gray-600 mb-6">快去商城领取优惠券吧</p>
              <Button onClick={() => setShowRedeemForm(true)}>兑换优惠券</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCoupons.map((coupon) => (
              <Card
                key={coupon.id}
                className={`overflow-hidden ${
                  coupon.status === 'active'
                    ? 'border-primary-200'
                    : 'opacity-60'
                }`}
              >
                <CardContent className="p-0">
                  <div className="flex">
                    {/* Left Side - Discount */}
                    <div className={`w-32 flex flex-col items-center justify-center p-4 ${
                      coupon.status === 'active'
                        ? 'bg-gradient-to-br from-primary-500 to-primary-700 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      <div className="text-center">
                        {coupon.discount.type === 'percentage' ? (
                          <>
                            <div className="text-3xl font-bold">{coupon.discount.value}%</div>
                            <div className="text-xs mt-1">OFF</div>
                          </>
                        ) : coupon.discount.type === 'fixed' ? (
                          <>
                            <div className="text-2xl font-bold">¥{coupon.discount.value}</div>
                            <div className="text-xs mt-1">减免</div>
                          </>
                        ) : (
                          <>
                            <svg className="w-10 h-10 mx-auto mb-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                            </svg>
                            <div className="text-xs">包邮</div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Right Side - Details */}
                    <div className="flex-1 p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{coupon.title}</h3>
                        {coupon.status === 'active' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            可用
                          </span>
                        )}
                        {coupon.status === 'used' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            已使用
                          </span>
                        )}
                        {coupon.status === 'expired' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                            已过期
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 mb-3">{coupon.description}</p>

                      <div className="space-y-1 text-xs text-gray-500 mb-3">
                        {coupon.minPurchase && (
                          <p>• 最低消费：¥{coupon.minPurchase}</p>
                        )}
                        {coupon.maxDiscount && (
                          <p>• 最高优惠：¥{coupon.maxDiscount}</p>
                        )}
                        {coupon.category && (
                          <p>• 适用范围：{coupon.category}</p>
                        )}
                        {coupon.status === 'active' && (
                          <p className="text-orange-600">
                            • 剩余 {getDaysRemaining(coupon.validUntil)} 天
                          </p>
                        )}
                        {coupon.status === 'used' && coupon.usedAt && (
                          <p>• 使用时间：{new Date(coupon.usedAt).toLocaleDateString()}</p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <div className="font-mono text-sm font-semibold text-gray-900">
                          {coupon.code}
                        </div>
                        {coupon.status === 'active' && (
                          <button
                            onClick={() => handleCopyCode(coupon.code)}
                            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                          >
                            复制
                          </button>
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
                <h3 className="font-semibold text-gray-900 mb-2">优惠券使用说明</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 结算时系统会自动选择最优惠券</li>
                  <li>• 部分优惠券不可叠加使用</li>
                  <li>• 注意查看优惠券的使用条件和有效期</li>
                  <li>• 已使用和已过期的优惠券无法再次使用</li>
                  <li>• 关注商城活动页面获取更多优惠券</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
