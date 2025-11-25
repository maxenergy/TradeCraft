'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { orderApi } from '@/lib/order-api';
import { Order } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { formatPrice } from '@/lib/utils';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderApi.getMyOrders({ page, size: 10 });

      if (response.success && response.data) {
        setOrders(response.data);
        if (response.pagination) {
          setTotalPages(response.pagination.totalPages || 0);
        }
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      PENDING: '待支付',
      PROCESSING: '处理中',
      SHIPPED: '已发货',
      DELIVERED: '已送达',
      CANCELLED: '已取消',
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      PENDING: 'text-yellow-600 bg-yellow-100',
      PROCESSING: 'text-blue-600 bg-blue-100',
      SHIPPED: 'text-purple-600 bg-purple-100',
      DELIVERED: 'text-green-600 bg-green-100',
      CANCELLED: 'text-red-600 bg-red-100',
    };
    return colorMap[status] || 'text-gray-600 bg-gray-100';
  };

  if (loading && orders.length === 0) {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">我的订单</h1>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <svg
                className="mx-auto h-24 w-24 text-gray-400 mb-4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">暂无订单</h2>
              <p className="text-gray-600 mb-6">您还没有任何订单</p>
              <Link href="/products">
                <Button>开始购物</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader className="bg-gray-50 px-6 py-4 border-b">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">
                          订单号: <span className="font-medium text-gray-900">{order.orderNumber}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          下单时间: {new Date(order.createdAt).toLocaleString('zh-CN')}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">
                          共 {order.items?.length || 0} 件商品
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatPrice(order.total, order.currency)}
                        </p>
                        {order.trackingNumber && (
                          <p className="text-sm text-gray-600 mt-2">
                            物流单号: {order.trackingNumber}
                          </p>
                        )}
                      </div>

                      <div className="space-x-3">
                        <Link href={`/orders/${order.orderNumber}`}>
                          <Button variant="outline">查看详情</Button>
                        </Link>
                        {order.status === 'PENDING' && (
                          <Button>支付订单</Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 分页 */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <Button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  variant="outline"
                >
                  上一页
                </Button>
                <span className="px-4 py-2 text-gray-700">
                  第 {page + 1} / {totalPages} 页
                </span>
                <Button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  variant="outline"
                >
                  下一页
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
