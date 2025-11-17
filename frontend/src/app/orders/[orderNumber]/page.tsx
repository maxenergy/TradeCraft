'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { orderApi } from '@/lib/api/order-api';
import { Order } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { formatPrice } from '@/lib/utils';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderNumber = params.orderNumber as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (orderNumber) {
      fetchOrder();
    }
  }, [orderNumber]);

  const fetchOrder = async () => {
    try {
      const response = await orderApi.getOrder(orderNumber);
      if (response.data.success && response.data.data) {
        setOrder(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;

    if (!confirm('确定要取消此订单吗？')) {
      return;
    }

    setCancelling(true);

    try {
      await orderApi.cancelOrder(order.id);
      alert('订单已取消');
      fetchOrder(); // Refresh order data
    } catch (error: any) {
      console.error('Failed to cancel order:', error);
      alert(error.response?.data?.message || '取消订单失败，请重试');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      PENDING: 'text-yellow-600 bg-yellow-100 border-yellow-200',
      PROCESSING: 'text-blue-600 bg-blue-100 border-blue-200',
      SHIPPED: 'text-purple-600 bg-purple-100 border-purple-200',
      DELIVERED: 'text-green-600 bg-green-100 border-green-200',
      CANCELLED: 'text-red-600 bg-red-100 border-red-200',
      REFUNDING: 'text-orange-600 bg-orange-100 border-orange-200',
      REFUNDED: 'text-gray-600 bg-gray-100 border-gray-200',
    };
    return colorMap[status] || 'text-gray-600 bg-gray-100 border-gray-200';
  };

  const getStatusText = (status: string) => {
    const textMap: Record<string, string> = {
      PENDING: '待支付',
      PROCESSING: '处理中',
      SHIPPED: '已发货',
      DELIVERED: '已送达',
      CANCELLED: '已取消',
      REFUNDING: '退款中',
      REFUNDED: '已退款',
    };
    return textMap[status] || status;
  };

  const getPaymentStatusText = (status: string) => {
    const textMap: Record<string, string> = {
      PENDING: '待支付',
      PAID: '已支付',
      FAILED: '支付失败',
      REFUNDED: '已退款',
    };
    return textMap[status] || status;
  };

  const getPaymentStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      PENDING: 'text-yellow-600',
      PAID: 'text-green-600',
      FAILED: 'text-red-600',
      REFUNDED: 'text-gray-600',
    };
    return colorMap[status] || 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载订单信息...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">订单未找到</h1>
          <p className="text-gray-600 mb-6">该订单不存在或您没有访问权限</p>
          <Button onClick={() => router.push('/orders')}>返回订单列表</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">订单详情</h1>
              <p className="text-gray-600 mt-1">订单号: {order.orderNumber}</p>
            </div>
            <div className="flex space-x-3">
              {(order.status === 'PENDING' || order.status === 'PROCESSING') && (
                <Button
                  variant="outline"
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                >
                  {cancelling ? '取消中...' : '取消订单'}
                </Button>
              )}
              <Button variant="outline" onClick={() => router.push('/orders')}>
                返回列表
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader className="border-b">
                <h2 className="text-lg font-semibold text-gray-900">订单状态</h2>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span
                      className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">支付状态</p>
                    <p className={`text-lg font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {getPaymentStatusText(order.paymentStatus)}
                    </p>
                  </div>
                </div>

                {/* Order Timeline */}
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">订单已创建</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleString('zh-CN')}
                      </p>
                    </div>
                  </div>

                  {order.paidAt && (
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">支付完成</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.paidAt).toLocaleString('zh-CN')}
                        </p>
                      </div>
                    </div>
                  )}

                  {order.shippedAt && (
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">已发货</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.shippedAt).toLocaleString('zh-CN')}
                        </p>
                        {order.trackingNumber && (
                          <p className="text-sm text-gray-500">
                            物流单号: <span className="font-mono">{order.trackingNumber}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {order.deliveredAt && (
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">已送达</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.deliveredAt).toLocaleString('zh-CN')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader className="border-b">
                <h2 className="text-lg font-semibold text-gray-900">订单商品</h2>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 pb-4 border-b last:border-b-0 last:pb-0">
                      <div className="w-20 h-20 bg-gray-200 rounded flex-shrink-0">
                        {item.product?.imageUrl ? (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900">{item.product?.name}</h3>
                        {item.product?.sku && (
                          <p className="text-sm text-gray-500">SKU: {item.product.sku}</p>
                        )}
                        <p className="text-sm text-gray-500">数量: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">单价</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatPrice(item.price, order.currency)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">小计</p>
                        <p className="text-base font-semibold text-gray-900">
                          {formatPrice(item.price * item.quantity, order.currency)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader className="border-b">
                <h2 className="text-lg font-semibold text-gray-900">配送信息</h2>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">收货人</p>
                    <p className="text-sm font-medium text-gray-900">{order.shippingAddress.firstName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">联系电话</p>
                    <p className="text-sm font-medium text-gray-900">{order.shippingAddress.phone}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600 mb-1">配送地址</p>
                    <p className="text-sm font-medium text-gray-900">
                      {order.shippingAddress.address}, {order.shippingAddress.city}
                      {order.shippingAddress.state && `, ${order.shippingAddress.state}`}
                      {order.shippingAddress.postalCode && `, ${order.shippingAddress.postalCode}`}
                      <br />
                      {order.shippingAddress.country}
                    </p>
                  </div>
                </div>

                {order.notes && (
                  <div className="mt-6 pt-6 border-t">
                    <p className="text-sm text-gray-600 mb-1">订单备注</p>
                    <p className="text-sm text-gray-900">{order.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader className="border-b">
                <h2 className="text-lg font-semibold text-gray-900">订单摘要</h2>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">商品小计</span>
                    <span className="text-gray-900">
                      {formatPrice(
                        order.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
                        order.currency
                      )}
                    </span>
                  </div>

                  {order.shippingFee !== undefined && order.shippingFee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">运费</span>
                      <span className="text-gray-900">{formatPrice(order.shippingFee, order.currency)}</span>
                    </div>
                  )}

                  {order.taxAmount !== undefined && order.taxAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">税费</span>
                      <span className="text-gray-900">{formatPrice(order.taxAmount, order.currency)}</span>
                    </div>
                  )}

                  <div className="border-t pt-4 flex justify-between">
                    <span className="text-base font-semibold text-gray-900">订单总计</span>
                    <span className="text-xl font-bold text-primary-600">
                      {formatPrice(order.total, order.currency)}
                    </span>
                  </div>

                  {/* Payment Information */}
                  {order.paymentMethod && (
                    <div className="border-t pt-4">
                      <p className="text-sm text-gray-600 mb-2">支付方式</p>
                      <p className="text-sm font-medium text-gray-900">{order.paymentMethod}</p>
                    </div>
                  )}

                  {order.paymentTransactionId && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">交易号</p>
                      <p className="text-xs font-mono text-gray-900 break-all">
                        {order.paymentTransactionId}
                      </p>
                    </div>
                  )}

                  {/* Contact Support */}
                  <div className="border-t pt-4">
                    <Button variant="outline" className="w-full" size="sm">
                      联系客服
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
