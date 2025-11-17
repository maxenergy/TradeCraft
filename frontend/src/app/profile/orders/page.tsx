'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';

interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImage?: string;
  quantity: number;
  price: number;
  currency: string;
}

interface Order {
  id: number;
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  currency: string;
  itemCount: number;
  items: OrderItem[];
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | Order['status']>('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await orderApi.getUserOrders();

      // Mock data for development
      await new Promise((resolve) => setTimeout(resolve, 800));

      const mockOrders: Order[] = [
        {
          id: 1,
          orderNumber: 'ORD-2024-001234',
          status: 'delivered',
          total: 13797.00,
          currency: 'CNY',
          itemCount: 3,
          items: [
            {
              id: 1,
              productId: 1,
              productName: 'iPhone 15 Pro Max 256GB',
              productImage: 'https://via.placeholder.com/100',
              quantity: 1,
              price: 9999.00,
              currency: 'CNY',
            },
            {
              id: 2,
              productId: 2,
              productName: 'AirPods Pro 第二代',
              productImage: 'https://via.placeholder.com/100',
              quantity: 2,
              price: 1899.00,
              currency: 'CNY',
            },
          ],
          shippingAddress: '北京市朝阳区某某街道123号',
          createdAt: '2024-01-10T10:30:00Z',
          updatedAt: '2024-01-15T14:20:00Z',
          trackingNumber: 'SF1234567890',
        },
        {
          id: 2,
          orderNumber: 'ORD-2024-001235',
          status: 'shipped',
          total: 2499.00,
          currency: 'CNY',
          itemCount: 1,
          items: [
            {
              id: 3,
              productId: 3,
              productName: 'iPad Air 第五代',
              productImage: 'https://via.placeholder.com/100',
              quantity: 1,
              price: 2499.00,
              currency: 'CNY',
            },
          ],
          shippingAddress: '上海市浦东新区某某路456号',
          createdAt: '2024-01-12T15:45:00Z',
          updatedAt: '2024-01-14T09:30:00Z',
          trackingNumber: 'YT9876543210',
        },
        {
          id: 3,
          orderNumber: 'ORD-2024-001236',
          status: 'processing',
          total: 8999.00,
          currency: 'CNY',
          itemCount: 2,
          items: [
            {
              id: 4,
              productId: 4,
              productName: 'MacBook Air M2',
              productImage: 'https://via.placeholder.com/100',
              quantity: 1,
              price: 8999.00,
              currency: 'CNY',
            },
          ],
          shippingAddress: '广州市天河区某某大道789号',
          createdAt: '2024-01-14T12:00:00Z',
          updatedAt: '2024-01-14T12:00:00Z',
        },
        {
          id: 4,
          orderNumber: 'ORD-2024-001237',
          status: 'pending',
          total: 599.00,
          currency: 'CNY',
          itemCount: 1,
          items: [
            {
              id: 5,
              productId: 5,
              productName: 'Apple Pencil 第二代',
              productImage: 'https://via.placeholder.com/100',
              quantity: 1,
              price: 599.00,
              currency: 'CNY',
            },
          ],
          shippingAddress: '深圳市南山区某某路321号',
          createdAt: '2024-01-15T16:20:00Z',
          updatedAt: '2024-01-15T16:20:00Z',
        },
      ];

      setOrders(mockOrders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return '待处理';
      case 'processing':
        return '处理中';
      case 'shipped':
        return '已发货';
      case 'delivered':
        return '已送达';
      case 'cancelled':
        return '已取消';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(order => order.status === filter);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">我的订单</h1>
          <p className="text-gray-600">查看和管理您的订单</p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            全部订单 ({orders.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            待处理 ({orders.filter(o => o.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('processing')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'processing'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            处理中 ({orders.filter(o => o.status === 'processing').length})
          </button>
          <button
            onClick={() => setFilter('shipped')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'shipped'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            已发货 ({orders.filter(o => o.status === 'shipped').length})
          </button>
          <button
            onClick={() => setFilter('delivered')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'delivered'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            已送达 ({orders.filter(o => o.status === 'delivered').length})
          </button>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无订单</h3>
              <p className="text-gray-600 mb-4">您还没有任何订单</p>
              <Link href="/products">
                <Button>去购物</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <Card key={order.id}>
                <CardHeader className="border-b bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div>
                        <p className="text-sm text-gray-600">订单号</p>
                        <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">下单时间</p>
                        <p className="text-sm text-gray-900">{formatDate(order.createdAt)}</p>
                      </div>
                      <div>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">订单金额</p>
                      <p className="text-xl font-bold text-primary-600">
                        {formatPrice(order.total, order.currency)}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  {/* Order Items */}
                  <div className="space-y-4 mb-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <Link href={`/products/${item.productId}`} className="flex-shrink-0">
                          {item.productImage ? (
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              className="w-16 h-16 object-cover rounded"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                              <span className="text-gray-400 text-xs">暂无图片</span>
                            </div>
                          )}
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${item.productId}`}
                            className="text-gray-900 font-medium hover:text-primary-600"
                          >
                            {item.productName}
                          </Link>
                          <p className="text-sm text-gray-500">数量: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatPrice(item.price * item.quantity, item.currency)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Info */}
                  <div className="border-t pt-4 mb-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 mb-1">配送地址</p>
                        <p className="text-gray-900">{order.shippingAddress}</p>
                      </div>
                      {order.trackingNumber && (
                        <div>
                          <p className="text-gray-600 mb-1">物流单号</p>
                          <p className="text-gray-900 font-mono">{order.trackingNumber}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    <Link href={`/profile/orders/${order.id}`}>
                      <Button variant="outline" size="sm">
                        查看详情
                      </Button>
                    </Link>
                    {order.status === 'shipped' && (
                      <Button variant="outline" size="sm">
                        物流跟踪
                      </Button>
                    )}
                    {order.status === 'delivered' && (
                      <Link href={`/products/${order.items[0]?.productId}`}>
                        <Button variant="outline" size="sm">
                          再次购买
                        </Button>
                      </Link>
                    )}
                    {order.status === 'delivered' && (
                      <Button variant="outline" size="sm">
                        申请售后
                      </Button>
                    )}
                    {order.status === 'pending' && (
                      <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
                        取消订单
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
