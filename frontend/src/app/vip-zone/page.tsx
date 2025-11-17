'use client';

import React, { useState } from 'react';
import { useNotification } from '@/contexts/NotificationContext';

interface VIPLevel {
  level: number;
  name: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  minSpending: number;
  maxSpending?: number;
  discount: number;
  pointsMultiplier: number;
  benefits: string[];
}

interface VIPProduct {
  id: string;
  name: string;
  image: string;
  brand: string;
  price: number;
  vipPrice: number;
  originalPrice: number;
  minVipLevel: number;
  stock: number;
  sold: number;
  badge?: string;
  isLimited: boolean;
}

interface VIPPrivilege {
  id: string;
  title: string;
  description: string;
  icon: string;
  minLevel: number;
}

export default function VIPZonePage() {
  const notification = useNotification();
  const [currentVipLevel, setCurrentVipLevel] = useState<number>(3);
  const [currentSpending, setCurrentSpending] = useState<number>(8500);
  const [selectedTab, setSelectedTab] = useState<'products' | 'privileges' | 'upgrade'>('products');
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');

  const vipLevels: VIPLevel[] = [
    {
      level: 1,
      name: '铜牌会员',
      color: '#CD7F32',
      gradientFrom: 'from-amber-700',
      gradientTo: 'to-amber-500',
      minSpending: 0,
      maxSpending: 999,
      discount: 0.98,
      pointsMultiplier: 1,
      benefits: ['积分累积', '生日礼券', '专属客服'],
    },
    {
      level: 2,
      name: '银牌会员',
      color: '#C0C0C0',
      gradientFrom: 'from-gray-400',
      gradientTo: 'to-gray-200',
      minSpending: 1000,
      maxSpending: 4999,
      discount: 0.95,
      pointsMultiplier: 1.2,
      benefits: ['9.5折优惠', '1.2倍积分', '优先客服', '包邮特权', '专属优惠券'],
    },
    {
      level: 3,
      name: '金牌会员',
      color: '#FFD700',
      gradientFrom: 'from-yellow-500',
      gradientTo: 'to-yellow-300',
      minSpending: 5000,
      maxSpending: 19999,
      discount: 0.90,
      pointsMultiplier: 1.5,
      benefits: ['9折优惠', '1.5倍积分', 'VIP专属客服', '全场包邮', '每月专属优惠券', '新品优先购买'],
    },
    {
      level: 4,
      name: '白金会员',
      color: '#E5E4E2',
      gradientFrom: 'from-slate-300',
      gradientTo: 'to-slate-100',
      minSpending: 20000,
      maxSpending: 49999,
      discount: 0.85,
      pointsMultiplier: 2,
      benefits: ['8.5折优惠', '2倍积分', '一对一专属客服', '全场包邮', '每周专属优惠券', '新品优先购买', '专属礼品', 'VIP活动邀请'],
    },
    {
      level: 5,
      name: '钻石会员',
      color: '#B9F2FF',
      gradientFrom: 'from-cyan-400',
      gradientTo: 'to-blue-300',
      minSpending: 50000,
      discount: 0.80,
      pointsMultiplier: 3,
      benefits: ['8折优惠', '3倍积分', '专属客服团队', '全场包邮', '每日专属优惠券', '新品优先购买', '奢华礼品', 'VIP活动邀请', '私人定制服务', '机场贵宾室'],
    },
  ];

  const categories = ['全部', '奢侈品', '高端数码', '美妆护肤', '服装配饰', '家居生活', '母婴用品'];

  const vipProducts: VIPProduct[] = [
    {
      id: 'vip-1',
      name: 'Gucci 经典款手提包',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400',
      brand: 'Gucci',
      price: 15999,
      vipPrice: 13599,
      originalPrice: 18999,
      minVipLevel: 3,
      stock: 20,
      sold: 45,
      badge: 'VIP专享',
      isLimited: true,
    },
    {
      id: 'vip-2',
      name: 'iPhone 15 Pro Max 1TB',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
      brand: 'Apple',
      price: 11999,
      vipPrice: 10199,
      originalPrice: 12999,
      minVipLevel: 2,
      stock: 50,
      sold: 128,
      badge: '热销',
      isLimited: false,
    },
    {
      id: 'vip-3',
      name: 'La Mer 精华面霜套装',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400',
      brand: 'La Mer',
      price: 5999,
      vipPrice: 4799,
      originalPrice: 6999,
      minVipLevel: 3,
      stock: 30,
      sold: 89,
      badge: '限量',
      isLimited: true,
    },
    {
      id: 'vip-4',
      name: 'Prada 真皮钱包',
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400',
      brand: 'Prada',
      price: 3999,
      vipPrice: 3199,
      originalPrice: 4999,
      minVipLevel: 2,
      stock: 40,
      sold: 67,
      isLimited: false,
    },
    {
      id: 'vip-5',
      name: 'Dyson Supersonic 吹风机',
      image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400',
      brand: 'Dyson',
      price: 2999,
      vipPrice: 2399,
      originalPrice: 3299,
      minVipLevel: 1,
      stock: 80,
      sold: 234,
      badge: '热销',
      isLimited: false,
    },
    {
      id: 'vip-6',
      name: 'Hermès 丝巾',
      image: 'https://images.unsplash.com/photo-1601924287225-c9ab463bcea4?w=400',
      brand: 'Hermès',
      price: 4599,
      vipPrice: 3679,
      originalPrice: 5999,
      minVipLevel: 4,
      stock: 15,
      sold: 23,
      badge: 'VIP专享',
      isLimited: true,
    },
  ];

  const privileges: VIPPrivilege[] = [
    {
      id: 'p-1',
      title: '专属折扣',
      description: '享受全场商品专属折扣，等级越高优惠越多',
      icon: '💰',
      minLevel: 1,
    },
    {
      id: 'p-2',
      title: '积分翻倍',
      description: '购物积分倍数增长，最高可达3倍',
      icon: '⭐',
      minLevel: 1,
    },
    {
      id: 'p-3',
      title: '全场包邮',
      description: '所有订单免运费，无门槛限制',
      icon: '🚚',
      minLevel: 2,
    },
    {
      id: 'p-4',
      title: '优先客服',
      description: 'VIP专属客服通道，优先响应您的需求',
      icon: '💬',
      minLevel: 2,
    },
    {
      id: 'p-5',
      title: '专属优惠券',
      description: '定期发放VIP专属优惠券，叠加使用',
      icon: '🎟️',
      minLevel: 2,
    },
    {
      id: 'p-6',
      title: '新品优先购',
      description: '新品上架优先购买权，抢先体验',
      icon: '🆕',
      minLevel: 3,
    },
    {
      id: 'p-7',
      title: '生日特权',
      description: '生日当月享受额外优惠和专属礼品',
      icon: '🎂',
      minLevel: 1,
    },
    {
      id: 'p-8',
      title: 'VIP活动',
      description: '受邀参加专属VIP活动和新品发布会',
      icon: '🎉',
      minLevel: 4,
    },
    {
      id: 'p-9',
      title: '私人定制',
      description: '享受专属定制服务和个性化推荐',
      icon: '👔',
      minLevel: 5,
    },
    {
      id: 'p-10',
      title: '机场贵宾室',
      description: '免费使用全球机场贵宾室服务',
      icon: '✈️',
      minLevel: 5,
    },
  ];

  const currentLevel = vipLevels.find(l => l.level === currentVipLevel);
  const nextLevel = vipLevels.find(l => l.level === currentVipLevel + 1);
  const progressToNextLevel = nextLevel
    ? ((currentSpending - currentLevel!.minSpending) / (nextLevel.minSpending - currentLevel!.minSpending)) * 100
    : 100;

  const handlePurchase = (product: VIPProduct) => {
    if (currentVipLevel < product.minVipLevel) {
      notification.warning('VIP等级不足', `该商品需要${vipLevels[product.minVipLevel - 1].name}及以上等级`);
      return;
    }
    // TODO: Implement purchase functionality
    notification.success('购买成功', `${product.name}已成功购买`);
  };

  const filteredProducts = vipProducts.filter(product => {
    if (selectedCategory === '全部') return true;
    // TODO: Add proper category filtering based on product categories
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-600 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">VIP专区</h1>
              <p className="text-white/90">尊享特权，品质生活</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl">
              <p className="text-sm text-white/80 mb-1">当前等级</p>
              <p className="text-2xl font-bold">{currentLevel?.name}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* VIP Card */}
        <div className={`bg-gradient-to-r ${currentLevel?.gradientFrom} ${currentLevel?.gradientTo} rounded-2xl shadow-2xl p-8 mb-8 text-white`}>
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold">{currentLevel?.name}</h2>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">LV.{currentVipLevel}</span>
              </div>
              <p className="text-white/90">累计消费: ¥{currentSpending.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/80 mb-1">专属折扣</p>
              <p className="text-3xl font-bold">{((1 - currentLevel!.discount) * 100).toFixed(0)}% OFF</p>
            </div>
          </div>

          {nextLevel && (
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>距离 {nextLevel.name}</span>
                <span>还需消费 ¥{(nextLevel.minSpending - currentSpending).toLocaleString()}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div
                  className="bg-white h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(progressToNextLevel, 100)}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {currentLevel?.benefits.slice(0, 4).map((benefit, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                <p className="text-sm text-white/90">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-purple-200">
          <button
            onClick={() => setSelectedTab('products')}
            className={`px-6 py-3 font-medium transition-all ${
              selectedTab === 'products'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            VIP商品
          </button>
          <button
            onClick={() => setSelectedTab('privileges')}
            className={`px-6 py-3 font-medium transition-all ${
              selectedTab === 'privileges'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            专属特权
          </button>
          <button
            onClick={() => setSelectedTab('upgrade')}
            className={`px-6 py-3 font-medium transition-all ${
              selectedTab === 'upgrade'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            等级说明
          </button>
        </div>

        {/* VIP Products Tab */}
        {selectedTab === 'products' && (
          <>
            {/* Category Filter */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-6">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const canPurchase = currentVipLevel >= product.minVipLevel;
                return (
                  <div
                    key={product.id}
                    className={`bg-white rounded-xl shadow-md overflow-hidden transition-all ${
                      canPurchase ? 'hover:shadow-xl' : 'opacity-75'
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-64 object-cover"
                      />
                      {product.badge && (
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                          {product.badge}
                        </div>
                      )}
                      {product.isLimited && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          限量
                        </div>
                      )}
                      {!canPurchase && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="bg-white/90 px-4 py-2 rounded-lg text-center">
                            <p className="font-bold text-gray-900">需要{vipLevels[product.minVipLevel - 1].name}</p>
                            <p className="text-sm text-gray-600">及以上等级</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
                      <h3 className="font-bold text-gray-900 mb-3 line-clamp-2">{product.name}</h3>

                      <div className="mb-3">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-sm text-purple-600 font-medium">VIP价</span>
                          <span className="text-2xl font-bold text-purple-600">¥{product.vipPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">会员价</span>
                          <span className="text-lg text-gray-700">¥{product.price.toLocaleString()}</span>
                          <span className="text-sm text-gray-400 line-through">¥{product.originalPrice.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>已售 {product.sold}</span>
                          <span>剩余 {product.stock}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-gradient-to-r from-purple-600 to-pink-600 h-1.5 rounded-full"
                            style={{ width: `${(product.sold / (product.sold + product.stock)) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <button
                        onClick={() => handlePurchase(product)}
                        disabled={!canPurchase}
                        className={`w-full py-3 rounded-lg font-medium transition-all ${
                          canPurchase
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {canPurchase ? '立即购买' : '等级不足'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Privileges Tab */}
        {selectedTab === 'privileges' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {privileges.map((privilege) => {
              const hasAccess = currentVipLevel >= privilege.minLevel;
              return (
                <div
                  key={privilege.id}
                  className={`bg-white rounded-xl shadow-md p-6 transition-all ${
                    hasAccess ? 'border-2 border-purple-200' : 'opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{privilege.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-gray-900">{privilege.title}</h3>
                        {hasAccess ? (
                          <span className="text-green-600 text-sm">✓ 已解锁</span>
                        ) : (
                          <span className="text-gray-400 text-sm">未解锁</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{privilege.description}</p>
                      <p className="text-xs text-purple-600">
                        需要 {vipLevels[privilege.minLevel - 1].name}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Upgrade Info Tab */}
        {selectedTab === 'upgrade' && (
          <div className="space-y-6">
            {vipLevels.map((level) => (
              <div
                key={level.level}
                className={`bg-white rounded-xl shadow-md overflow-hidden transition-all ${
                  level.level === currentVipLevel ? 'ring-2 ring-purple-600' : ''
                }`}
              >
                <div className={`bg-gradient-to-r ${level.gradientFrom} ${level.gradientTo} p-6 text-white`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold">{level.name}</h3>
                        {level.level === currentVipLevel && (
                          <span className="bg-white/20 px-3 py-1 rounded-full text-sm">当前等级</span>
                        )}
                      </div>
                      <p className="text-white/90">
                        {level.maxSpending
                          ? `累计消费 ¥${level.minSpending.toLocaleString()} - ¥${level.maxSpending.toLocaleString()}`
                          : `累计消费 ¥${level.minSpending.toLocaleString()} 以上`
                        }
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-white/80">折扣</p>
                      <p className="text-3xl font-bold">{((1 - level.discount) * 10).toFixed(0)}折</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-bold text-gray-900 mb-3">会员权益</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {level.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-purple-600">✓</span>
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
