'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Order } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { formatPrice } from '@/lib/utils';

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Modal states
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      // TODO: Implement API call to fetch order by ID
      // const response = await orderApi.getOrderById(orderId);
      // setOrder(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch order:', error);
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedStatus || !order) return;

    setUpdating(true);

    try {
      // TODO: Implement API call to update order status
      // await orderApi.updateOrderStatus(order.id, selectedStatus);
      alert('订单状态已更新');
      setShowStatusModal(false);
      fetchOrder();
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('更新失败，请重试');
    } finally {
      setUpdating(false);
    }
  };

  const handleMarkAsShipped = async () => {
    if (!trackingNumber.trim() || !order) return;

    setUpdating(true);

    try {
      // TODO: Implement API call to mark as shipped
      // await orderApi.markAsShipped(order.id, trackingNumber);
      alert('订单已标记为已发货');
      setShowShippingModal(false);
      setTrackingNumber('');
      fetchOrder();
    } catch (error) {
      console.error('Failed to mark as shipped:', error);
      alert('操作失败，请重试');
    } finally {
      setUpdating(false);
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
          <p className="text-gray-600 mb-6">该订单不存在</p>
          <Button onClick={() => router.push('/admin/orders')}>返回订单列表</Button>
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
              <h1 className="text-3xl font-bold text-gray-900">订单详情（管理）</h1>
              <p className="text-gray-600 mt-1">订单号: {order.orderNumber}</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setShowStatusModal(true)}>
                更新状态
              </Button>
              {order.status === 'PROCESSING' && (
                <Button onClick={() => setShowShippingModal(true)}>标记发货</Button>
              )}
              <Button variant="outline" onClick={() => router.push('/admin/orders')}>
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
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">订单状态</p>
                    <span
                      className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">支付状态</p>
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

            {/* Customer Information */}
            <Card>
              <CardHeader className="border-b">
                <h2 className="text-lg font-semibold text-gray-900">客户信息</h2>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">客户姓名</p>
                    <p className="text-sm font-medium text-gray-900">
                      {order.user?.firstName} {order.user?.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">客户邮箱</p>
                    <p className="text-sm font-medium text-gray-900">{order.user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">客户ID</p>
                    <p className="text-sm font-mono text-gray-900">{order.user?.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">注册时间</p>
                    <p className="text-sm text-gray-900">
                      {order.user?.createdAt
                        ? new Date(order.user.createdAt).toLocaleDateString('zh-CN')
                        : '-'}
                    </p>
                  </div>
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
                    <div
                      key={item.id}
                      className="flex items-center space-x-4 pb-4 border-b last:border-b-0 last:pb-0"
                    >
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
                        <p className="text-sm text-gray-500">产品ID: {item.product?.id}</p>
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

                  {/* Admin Actions */}
                  <div className="border-t pt-4 space-y-2">
                    <Button variant="outline" className="w-full" size="sm">
                      打印订单
                    </Button>
                    <Button variant="outline" className="w-full" size="sm">
                      导出订单
                    </Button>
                    {order.status !== 'CANCELLED' && order.status !== 'REFUNDED' && (
                      <Button variant="outline" className="w-full text-red-600 border-red-300" size="sm">
                        取消订单
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Update Status Modal */}
        {showStatusModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">更新订单状态</h3>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 mb-4"
              >
                <option value="">请选择状态</option>
                <option value="PENDING">待支付</option>
                <option value="PROCESSING">处理中</option>
                <option value="SHIPPED">已发货</option>
                <option value="DELIVERED">已送达</option>
                <option value="CANCELLED">已取消</option>
                <option value="REFUNDING">退款中</option>
                <option value="REFUNDED">已退款</option>
              </select>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowStatusModal(false)}
                  className="flex-1"
                  disabled={updating}
                >
                  取消
                </Button>
                <Button onClick={handleUpdateStatus} className="flex-1" disabled={updating || !selectedStatus}>
                  {updating ? '更新中...' : '确认'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Mark as Shipped Modal */}
        {showShippingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">标记为已发货</h3>
              <label htmlFor="trackingNumber" className="block text-sm font-medium text-gray-700 mb-2">
                物流单号
              </label>
              <input
                type="text"
                id="trackingNumber"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 mb-4"
                placeholder="请输入物流单号"
              />
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowShippingModal(false);
                    setTrackingNumber('');
                  }}
                  className="flex-1"
                  disabled={updating}
                >
                  取消
                </Button>
                <Button
                  onClick={handleMarkAsShipped}
                  className="flex-1"
                  disabled={updating || !trackingNumber.trim()}
                >
                  {updating ? '提交中...' : '确认'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
