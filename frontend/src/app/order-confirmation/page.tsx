'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';

interface OrderDetails {
  orderNumber: string;
  total: number;
  currency: string;
  items: Array<{
    id: number;
    productName: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
  };
  estimatedDelivery: string;
  paymentMethod: string;
}

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId);
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const fetchOrderDetails = async (id: string) => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await orderApi.getOrderDetails(id);

      // Mock data for development
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockOrder: OrderDetails = {
        orderNumber: `ORD-2024-${id}`,
        total: 13797.00,
        currency: 'CNY',
        items: [
          {
            id: 1,
            productName: 'iPhone 15 Pro Max 256GB',
            quantity: 1,
            price: 9999.00,
          },
          {
            id: 2,
            productName: 'AirPods Pro 第二代',
            quantity: 2,
            price: 1899.00,
          },
        ],
        shippingAddress: {
          name: '张三',
          phone: '138****8888',
          address: '北京市朝阳区某某街道123号',
        },
        estimatedDelivery: '2024-01-18',
        paymentMethod: '支付宝',
      };

      setOrderDetails(mockOrder);
    } catch (error) {
      console.error('Failed to fetch order details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载订单信息中...</p>
        </div>
      </div>
    );
  }

  if (!orderId || !orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md">
          <CardContent className="p-12 text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">订单未找到</h3>
            <p className="text-gray-600 mb-6">无法找到该订单信息</p>
            <Link href="/products">
              <Button>继续购物</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        <Card className="mb-8">
          <CardContent className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">订单提交成功！</h1>
            <p className="text-lg text-gray-600 mb-4">
              感谢您的购买，我们会尽快为您处理订单
            </p>
            <div className="inline-flex items-center bg-gray-100 px-6 py-3 rounded-lg">
              <span className="text-sm text-gray-600 mr-2">订单号：</span>
              <span className="text-lg font-semibold text-gray-900">{orderDetails.orderNumber}</span>
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="border-b">
                <h2 className="text-xl font-semibold text-gray-900">订单详情</h2>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {orderDetails.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-3 border-b last:border-0">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.productName}</p>
                        <p className="text-sm text-gray-600">数量: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {formatPrice(item.price * item.quantity, orderDetails.currency)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardHeader className="border-b">
                <h2 className="text-lg font-semibold text-gray-900">订单摘要</h2>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>商品小计</span>
                    <span>{formatPrice(orderDetails.total, orderDetails.currency)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>运费</span>
                    <span className="text-green-600">免运费</span>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">订单总计</span>
                    <span className="text-2xl font-bold text-primary-600">
                      {formatPrice(orderDetails.total, orderDetails.currency)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b">
                <h2 className="text-lg font-semibold text-gray-900">配送信息</h2>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-600 mb-1">收货人</p>
                    <p className="text-gray-900 font-medium">{orderDetails.shippingAddress.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">联系电话</p>
                    <p className="text-gray-900 font-medium">{orderDetails.shippingAddress.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">配送地址</p>
                    <p className="text-gray-900">{orderDetails.shippingAddress.address}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">预计送达</p>
                    <p className="text-gray-900 font-medium">
                      {new Date(orderDetails.estimatedDelivery).toLocaleDateString('zh-CN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">支付方式</p>
                    <p className="text-gray-900 font-medium">{orderDetails.paymentMethod}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Next Steps */}
        <Card className="mb-8">
          <CardHeader className="border-b">
            <h2 className="text-xl font-semibold text-gray-900">接下来做什么？</h2>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-full mb-3">
                  <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">查看订单</h3>
                <p className="text-sm text-gray-600 mb-3">
                  在"我的订单"中查看订单详情和物流信息
                </p>
                <Link href="/profile/orders">
                  <Button variant="outline" size="sm">前往订单</Button>
                </Link>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-full mb-3">
                  <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">继续购物</h3>
                <p className="text-sm text-gray-600 mb-3">
                  浏览更多优质商品
                </p>
                <Link href="/products">
                  <Button variant="outline" size="sm">浏览商品</Button>
                </Link>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-full mb-3">
                  <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">联系客服</h3>
                <p className="text-sm text-gray-600 mb-3">
                  如有任何问题，随时联系我们
                </p>
                <Link href="/contact">
                  <Button variant="outline" size="sm">在线客服</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Card>
          <CardHeader className="border-b">
            <h2 className="text-xl font-semibold text-gray-900">重要提示</h2>
          </CardHeader>
          <CardContent className="p-6">
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>我们已向您的邮箱发送订单确认邮件，请注意查收</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>订单发货后，我们会通过短信和邮件通知您物流信息</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>您可以在"个人中心-我的订单"中随时查看订单状态和物流跟踪</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>如需退换货，请在收货后7天内联系客服办理</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
