'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useNotification } from '@/contexts/NotificationContext';

interface UserStats {
  points: number;
  membershipTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  totalOrders: number;
  pendingOrders: number;
  coupons: number;
  wishlist: number;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  items: number;
  thumbnail: string;
}

interface Notification {
  id: string;
  type: 'order' | 'promotion' | 'system' | 'points';
  title: string;
  message: string;
  date: string;
  read: boolean;
}

interface RecommendedProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  discount?: number;
}

export default function ProfileDashboardPage() {
  const notification = useNotification();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<RecommendedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        // TODO: Replace with actual API calls
        // const [statsRes, ordersRes, notificationsRes, productsRes] = await Promise.all([
        //   fetch('/api/profile/stats'),
        //   fetch('/api/orders/recent'),
        //   fetch('/api/notifications'),
        //   fetch('/api/products/recommended')
        // ]);

        // Mock data
        const mockStats: UserStats = {
          points: 2850,
          membershipTier: 'gold',
          totalOrders: 47,
          pendingOrders: 2,
          coupons: 8,
          wishlist: 15,
        };

        const mockOrders: RecentOrder[] = [
          {
            id: '1',
            orderNumber: 'ORD-20240118-001',
            date: '2024-01-18T10:30:00Z',
            total: 599.99,
            status: 'shipped',
            items: 3,
            thumbnail: '/placeholder-product.jpg',
          },
          {
            id: '2',
            orderNumber: 'ORD-20240115-002',
            date: '2024-01-15T14:20:00Z',
            total: 299.50,
            status: 'delivered',
            items: 2,
            thumbnail: '/placeholder-product.jpg',
          },
          {
            id: '3',
            orderNumber: 'ORD-20240112-003',
            date: '2024-01-12T09:15:00Z',
            total: 1299.00,
            status: 'processing',
            items: 1,
            thumbnail: '/placeholder-product.jpg',
          },
        ];

        const mockNotifications: Notification[] = [
          {
            id: '1',
            type: 'order',
            title: '订单已发货',
            message: '您的订单 ORD-20240118-001 已发货，预计3天内送达',
            date: '2024-01-18T15:30:00Z',
            read: false,
          },
          {
            id: '2',
            type: 'promotion',
            title: '限时优惠',
            message: '您关注的商品正在打折，最高可省500元',
            date: '2024-01-17T10:00:00Z',
            read: false,
          },
          {
            id: '3',
            type: 'points',
            title: '积分到账',
            message: '恭喜您获得200积分奖励',
            date: '2024-01-16T12:00:00Z',
            read: true,
          },
          {
            id: '4',
            type: 'system',
            title: '会员升级',
            message: '恭喜您升级为金卡会员，享受更多专属权益',
            date: '2024-01-15T08:00:00Z',
            read: true,
          },
        ];

        const mockProducts: RecommendedProduct[] = [
          {
            id: '1',
            name: '无线蓝牙耳机 Pro',
            image: '/placeholder-product.jpg',
            price: 399,
            originalPrice: 599,
            discount: 33,
          },
          {
            id: '2',
            name: '智能手表运动版',
            image: '/placeholder-product.jpg',
            price: 1299,
            originalPrice: 1699,
            discount: 24,
          },
          {
            id: '3',
            name: '便携充电宝 20000mAh',
            image: '/placeholder-product.jpg',
            price: 159,
          },
          {
            id: '4',
            name: '机械键盘 RGB版',
            image: '/placeholder-product.jpg',
            price: 599,
            originalPrice: 899,
            discount: 33,
          },
        ];

        setUserStats(mockStats);
        setRecentOrders(mockOrders);
        setNotifications(mockNotifications);
        setRecommendedProducts(mockProducts);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        notification.error('加载失败', '无法加载个人中心数据');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [notification]);

  const getMembershipLabel = (tier: string) => {
    const labels = {
      bronze: '铜卡会员',
      silver: '银卡会员',
      gold: '金卡会员',
      platinum: '铂金会员',
    };
    return labels[tier as keyof typeof labels] || '普通会员';
  };

  const getMembershipColor = (tier: string) => {
    const colors = {
      bronze: 'from-amber-600 to-amber-800',
      silver: 'from-gray-400 to-gray-600',
      gold: 'from-yellow-400 to-yellow-600',
      platinum: 'from-purple-400 to-purple-600',
    };
    return colors[tier as keyof typeof colors] || 'from-gray-400 to-gray-600';
  };

  const getOrderStatusLabel = (status: string) => {
    const labels = {
      pending: '待支付',
      processing: '处理中',
      shipped: '已发货',
      delivered: '已送达',
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getOrderStatusColor = (status: string) => {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-100',
      processing: 'text-blue-600 bg-blue-100',
      shipped: 'text-purple-600 bg-purple-100',
      delivered: 'text-green-600 bg-green-100',
    };
    return colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return (
          <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        );
      case 'promotion':
        return (
          <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        );
      case 'points':
        return (
          <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const handleMarkNotificationRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (!userStats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">加载数据失败</p>
        </div>
      </div>
    );
  }

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Membership Card */}
        <Card className={`mb-8 bg-gradient-to-r ${getMembershipColor(userStats.membershipTier)} text-white overflow-hidden`}>
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">欢迎回来！</h1>
                <p className="text-white/90 text-lg mb-4">
                  {getMembershipLabel(userStats.membershipTier)}
                </p>
                <div className="flex items-center gap-6 text-white/90">
                  <div>
                    <span className="text-2xl font-bold">{userStats.points}</span>
                    <span className="text-sm ml-2">积分</span>
                  </div>
                  <div className="h-8 w-px bg-white/30"></div>
                  <div>
                    <span className="text-2xl font-bold">{userStats.coupons}</span>
                    <span className="text-sm ml-2">优惠券</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Link href="/profile/points">
                  <Button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-white/30">
                    查看会员权益
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/profile/orders">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-primary-600 mb-2">
                      {userStats.totalOrders}
                    </div>
                    <div className="text-sm text-gray-600">全部订单</div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/profile/orders?status=pending">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-yellow-600 mb-2">
                      {userStats.pendingOrders}
                    </div>
                    <div className="text-sm text-gray-600">待处理</div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/profile/coupons">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {userStats.coupons}
                    </div>
                    <div className="text-sm text-gray-600">优惠券</div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/profile/wishlist">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-red-600 mb-2">
                      {userStats.wishlist}
                    </div>
                    <div className="text-sm text-gray-600">收藏夹</div>
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">快捷操作</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link href="/profile/orders">
                    <button className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                      <svg className="w-8 h-8 text-primary-600 mb-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <span className="text-sm text-gray-700">我的订单</span>
                    </button>
                  </Link>

                  <Link href="/track-order">
                    <button className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                      <svg className="w-8 h-8 text-primary-600 mb-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm text-gray-700">物流追踪</span>
                    </button>
                  </Link>

                  <Link href="/after-sales">
                    <button className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                      <svg className="w-8 h-8 text-primary-600 mb-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span className="text-sm text-gray-700">售后服务</span>
                    </button>
                  </Link>

                  <Link href="/customer-service">
                    <button className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                      <svg className="w-8 h-8 text-primary-600 mb-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span className="text-sm text-gray-700">在线客服</span>
                    </button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">最近订单</h2>
                  <Link href="/profile/orders">
                    <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      查看全部 →
                    </button>
                  </Link>
                </div>

                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
                    >
                      <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={order.thumbnail}
                          alt="订单商品"
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-gray-900">
                            {order.orderNumber}
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(
                              order.status
                            )}`}
                          >
                            {getOrderStatusLabel(order.status)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-1">
                          共 {order.items} 件商品
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            {new Date(order.date).toLocaleDateString()}
                          </div>
                          <div className="text-lg font-bold text-primary-600">
                            ¥{order.total.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <Link href={`/profile/orders/${order.id}`}>
                        <Button size="sm" variant="outline">
                          查看详情
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommended Products */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">为您推荐</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {recommendedProducts.map((product) => (
                    <Link key={product.id} href={`/products/${product.id}`}>
                      <div className="group cursor-pointer">
                        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                          {product.discount && (
                            <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                              -{product.discount}%
                            </div>
                          )}
                        </div>
                        <h3 className="text-sm text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600">
                          {product.name}
                        </h3>
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-red-600">
                            ¥{product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              ¥{product.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Notifications */}
          <div className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-gray-900">消息通知</h2>
                    {unreadNotifications > 0 && (
                      <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                        {unreadNotifications}
                      </span>
                    )}
                  </div>
                  <Link href="/profile/notifications">
                    <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      查看全部
                    </button>
                  </Link>
                </div>

                <div className="space-y-3">
                  {notifications.slice(0, 5).map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                        notif.read
                          ? 'bg-white border-gray-200'
                          : 'bg-primary-50 border-primary-200'
                      }`}
                      onClick={() => handleMarkNotificationRead(notif.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex-shrink-0 ${
                            notif.type === 'order'
                              ? 'text-blue-600'
                              : notif.type === 'promotion'
                              ? 'text-red-600'
                              : notif.type === 'points'
                              ? 'text-yellow-600'
                              : 'text-gray-600'
                          }`}
                        >
                          {getNotificationIcon(notif.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-gray-900 text-sm">
                              {notif.title}
                            </h3>
                            {!notif.read && (
                              <div className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mb-2">
                            {notif.message}
                          </p>
                          <span className="text-xs text-gray-500">
                            {new Date(notif.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Account Security */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">账户安全</h2>
                <div className="space-y-3">
                  <Link href="/profile/security">
                    <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-gray-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span className="text-sm text-gray-700">修改密码</span>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </Link>

                  <Link href="/profile/security">
                    <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-gray-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm text-gray-700">绑定手机</span>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </Link>

                  <Link href="/profile/security">
                    <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-gray-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm text-gray-700">绑定邮箱</span>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
