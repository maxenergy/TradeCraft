'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { formatPrice } from '@/lib/utils';

interface AnalyticsData {
  overview: {
    totalRevenue: number;
    totalOrders: number;
    totalUsers: number;
    totalProducts: number;
    revenueGrowth: number;
    ordersGrowth: number;
    usersGrowth: number;
    productsGrowth: number;
  };
  revenueByMonth: Array<{ month: string; revenue: number; orders: number }>;
  topProducts: Array<{
    id: number;
    name: string;
    sales: number;
    revenue: number;
    image?: string;
  }>;
  recentOrders: Array<{
    id: number;
    orderNumber: string;
    customerName: string;
    total: number;
    status: string;
    createdAt: string;
  }>;
  userGrowth: Array<{ month: string; users: number }>;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await analyticsApi.getAnalytics(timeRange);

      // Mock data for development
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockData: AnalyticsData = {
        overview: {
          totalRevenue: 125489.50,
          totalOrders: 1284,
          totalUsers: 3567,
          totalProducts: 234,
          revenueGrowth: 12.5,
          ordersGrowth: 8.3,
          usersGrowth: 15.7,
          productsGrowth: 5.2,
        },
        revenueByMonth: [
          { month: '1月', revenue: 45000, orders: 450 },
          { month: '2月', revenue: 52000, orders: 520 },
          { month: '3月', revenue: 48000, orders: 480 },
          { month: '4月', revenue: 61000, orders: 610 },
          { month: '5月', revenue: 58000, orders: 580 },
          { month: '6月', revenue: 72000, orders: 720 },
        ],
        topProducts: [
          { id: 1, name: 'iPhone 15 Pro Max', sales: 234, revenue: 234000 },
          { id: 2, name: 'MacBook Pro 16"', sales: 156, revenue: 312000 },
          { id: 3, name: 'AirPods Pro 2', sales: 567, revenue: 113400 },
          { id: 4, name: 'iPad Air', sales: 345, revenue: 172500 },
          { id: 5, name: 'Apple Watch Ultra', sales: 289, revenue: 173400 },
        ],
        recentOrders: [
          { id: 1, orderNumber: 'ORD-2024-001234', customerName: '张三', total: 1299.00, status: 'completed', createdAt: '2024-01-15T10:30:00Z' },
          { id: 2, orderNumber: 'ORD-2024-001235', customerName: '李四', total: 2499.00, status: 'processing', createdAt: '2024-01-15T09:45:00Z' },
          { id: 3, orderNumber: 'ORD-2024-001236', customerName: '王五', total: 899.00, status: 'shipped', createdAt: '2024-01-15T08:20:00Z' },
          { id: 4, orderNumber: 'ORD-2024-001237', customerName: '赵六', total: 3299.00, status: 'completed', createdAt: '2024-01-14T16:30:00Z' },
          { id: 5, orderNumber: 'ORD-2024-001238', customerName: '孙七', total: 599.00, status: 'pending', createdAt: '2024-01-14T15:10:00Z' },
        ],
        userGrowth: [
          { month: '1月', users: 500 },
          { month: '2月', users: 650 },
          { month: '3月', users: 720 },
          { month: '4月', users: 890 },
          { month: '5月', users: 1020 },
          { month: '6月', users: 1200 },
        ],
      };

      setData(mockData);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '已完成';
      case 'processing':
        return '处理中';
      case 'shipped':
        return '已发货';
      case 'pending':
        return '待处理';
      case 'cancelled':
        return '已取消';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载数据中...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">加载数据失败</p>
        </div>
      </div>
    );
  }

  const maxRevenue = Math.max(...data.revenueByMonth.map(d => d.revenue));
  const maxUsers = Math.max(...data.userGrowth.map(d => d.users));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">数据分析</h1>
          <p className="text-gray-600">实时监控业务运营数据和关键指标</p>
        </div>

        {/* Time Range Filter */}
        <div className="mb-6 flex justify-end">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
                timeRange === '7d'
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              7天
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-4 py-2 text-sm font-medium border-t border-b ${
                timeRange === '30d'
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              30天
            </button>
            <button
              onClick={() => setTimeRange('90d')}
              className={`px-4 py-2 text-sm font-medium border ${
                timeRange === '90d'
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              90天
            </button>
            <button
              onClick={() => setTimeRange('1y')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg border ${
                timeRange === '1y'
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              1年
            </button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Revenue */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">总收入</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPrice(data.overview.totalRevenue, 'CNY')}
                  </p>
                  <p className={`text-sm mt-2 flex items-center ${
                    data.overview.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d={data.overview.revenueGrowth >= 0
                          ? "M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                          : "M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                        }
                        clipRule="evenodd"
                      />
                    </svg>
                    {Math.abs(data.overview.revenueGrowth)}% 较上期
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <svg className="w-8 h-8 text-green-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Orders */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">总订单</p>
                  <p className="text-2xl font-bold text-gray-900">{data.overview.totalOrders.toLocaleString()}</p>
                  <p className={`text-sm mt-2 flex items-center ${
                    data.overview.ordersGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d={data.overview.ordersGrowth >= 0
                          ? "M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                          : "M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                        }
                        clipRule="evenodd"
                      />
                    </svg>
                    {Math.abs(data.overview.ordersGrowth)}% 较上期
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <svg className="w-8 h-8 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Users */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">总用户</p>
                  <p className="text-2xl font-bold text-gray-900">{data.overview.totalUsers.toLocaleString()}</p>
                  <p className={`text-sm mt-2 flex items-center ${
                    data.overview.usersGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d={data.overview.usersGrowth >= 0
                          ? "M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                          : "M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                        }
                        clipRule="evenodd"
                      />
                    </svg>
                    {Math.abs(data.overview.usersGrowth)}% 较上期
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <svg className="w-8 h-8 text-purple-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Products */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">总商品</p>
                  <p className="text-2xl font-bold text-gray-900">{data.overview.totalProducts.toLocaleString()}</p>
                  <p className={`text-sm mt-2 flex items-center ${
                    data.overview.productsGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d={data.overview.productsGrowth >= 0
                          ? "M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                          : "M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                        }
                        clipRule="evenodd"
                      />
                    </svg>
                    {Math.abs(data.overview.productsGrowth)}% 较上期
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <svg className="w-8 h-8 text-orange-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <Card>
            <CardHeader className="border-b">
              <h2 className="text-lg font-semibold text-gray-900">收入趋势</h2>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {data.revenueByMonth.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{item.month}</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {formatPrice(item.revenue, 'CNY')}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all"
                        style={{ width: `${(item.revenue / maxRevenue) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{item.orders} 订单</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* User Growth Chart */}
          <Card>
            <CardHeader className="border-b">
              <h2 className="text-lg font-semibold text-gray-900">用户增长</h2>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {data.userGrowth.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{item.month}</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {item.users.toLocaleString()} 用户
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${(item.users / maxUsers) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Products */}
          <Card>
            <CardHeader className="border-b">
              <h2 className="text-lg font-semibold text-gray-900">热销商品</h2>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {data.topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary-600">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.sales} 销量</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatPrice(product.revenue, 'CNY')}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader className="border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">最近订单</h2>
              <Link href="/admin/orders" className="text-sm text-primary-600 hover:text-primary-700">
                查看全部
              </Link>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {data.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.orderNumber}</p>
                      <p className="text-xs text-gray-500">{order.customerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {formatPrice(order.total, 'CNY')}
                      </p>
                      <span className={`inline-block px-2 py-1 text-xs rounded ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
