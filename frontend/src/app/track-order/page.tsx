'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useNotification } from '@/contexts/NotificationContext';

interface TrackingEvent {
  timestamp: string;
  status: string;
  location: string;
  description: string;
}

interface OrderTracking {
  orderId: string;
  trackingNumber: string;
  carrier: string;
  status: 'pending' | 'processing' | 'shipped' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'cancelled';
  estimatedDelivery: string;
  currentLocation: string;
  recipient: {
    name: string;
    address: string;
    phone: string;
  };
  events: TrackingEvent[];
}

export default function TrackOrderPage() {
  const notification = useNotification();
  const [trackingInput, setTrackingInput] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [trackingData, setTrackingData] = useState<OrderTracking | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!trackingInput.trim()) {
      notification.warning('请输入信息', '请输入订单号或运单号');
      return;
    }

    setIsTracking(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/orders/track?query=${trackingInput}`);
      // const data = await response.json();

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock tracking data
      const mockTracking: OrderTracking = {
        orderId: 'ORD20240115001',
        trackingNumber: 'SF1234567890',
        carrier: '顺丰速运',
        status: 'in_transit',
        estimatedDelivery: '2024-01-18',
        currentLocation: '北京市朝阳区分拨中心',
        recipient: {
          name: '张三',
          address: '北京市朝阳区建国路88号SOHO现代城A座2001室',
          phone: '138****8000',
        },
        events: [
          {
            timestamp: '2024-01-17T14:30:00Z',
            status: '运输中',
            location: '北京市朝阳区分拨中心',
            description: '快件已到达北京市朝阳区分拨中心',
          },
          {
            timestamp: '2024-01-17T10:15:00Z',
            status: '运输中',
            location: '北京市顺义区中转站',
            description: '快件已离开北京市顺义区中转站，发往北京市朝阳区分拨中心',
          },
          {
            timestamp: '2024-01-16T18:20:00Z',
            status: '运输中',
            location: '天津市武清区分拨中心',
            description: '快件已到达天津市武清区分拨中心',
          },
          {
            timestamp: '2024-01-16T09:00:00Z',
            status: '已揽收',
            location: '上海市浦东新区',
            description: '快递员已揽收，等待发往下一站',
          },
          {
            timestamp: '2024-01-15T16:45:00Z',
            status: '已下单',
            location: '商家',
            description: '您的订单已提交，商家正在处理',
          },
        ],
      };

      setTrackingData(mockTracking);
    } catch (error) {
      console.error('Failed to track order:', error);
      notification.error('查询失败', '未找到相关订单信息');
    } finally {
      setIsTracking(false);
    }
  };

  const getStatusColor = (status: OrderTracking['status']) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'out_for_delivery':
        return 'text-blue-600 bg-blue-100';
      case 'in_transit':
      case 'shipped':
        return 'text-orange-600 bg-orange-100';
      case 'processing':
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: OrderTracking['status']) => {
    const statusMap = {
      pending: '待处理',
      processing: '处理中',
      shipped: '已发货',
      in_transit: '运输中',
      out_for_delivery: '派送中',
      delivered: '已送达',
      cancelled: '已取消',
    };
    return statusMap[status] || status;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">订单追踪</h1>
          <p className="text-gray-600">输入订单号或运单号查询物流信息</p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleTrack}>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  placeholder="请输入订单号或运单号"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-lg"
                  disabled={isTracking}
                />
                <Button type="submit" disabled={isTracking} size="lg" className="px-8">
                  {isTracking ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      查询中...
                    </>
                  ) : (
                    '查询'
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-4 flex items-center justify-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              已登录用户可在
              <Link href="/profile/orders" className="text-primary-600 hover:text-primary-700 mx-1">
                我的订单
              </Link>
              中直接查看物流信息
            </div>
          </CardContent>
        </Card>

        {/* Tracking Results */}
        {trackingData && (
          <div className="space-y-6">
            {/* Status Overview */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      {getStatusText(trackingData.status)}
                    </h2>
                    <p className="text-gray-600">
                      运单号：{trackingData.trackingNumber}
                    </p>
                    <p className="text-gray-600">
                      承运商：{trackingData.carrier}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trackingData.status)}`}>
                    {getStatusText(trackingData.status)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">当前位置</div>
                    <div className="font-medium text-gray-900">
                      {trackingData.currentLocation}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">预计送达</div>
                    <div className="font-medium text-gray-900">
                      {new Date(trackingData.estimatedDelivery).toLocaleDateString('zh-CN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recipient Info */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">收货信息</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex">
                    <span className="text-gray-600 w-20">收件人：</span>
                    <span className="text-gray-900">{trackingData.recipient.name}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-600 w-20">联系电话：</span>
                    <span className="text-gray-900">{trackingData.recipient.phone}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-600 w-20">收货地址：</span>
                    <span className="text-gray-900">{trackingData.recipient.address}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tracking Timeline */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">物流跟踪</h3>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* Timeline Line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>

                  {/* Timeline Events */}
                  <div className="space-y-6">
                    {trackingData.events.map((event, index) => (
                      <div key={index} className="relative flex items-start">
                        {/* Timeline Dot */}
                        <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          index === 0
                            ? 'bg-primary-600 text-white'
                            : 'bg-white border-2 border-gray-300'
                        }`}>
                          {index === 0 ? (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                          )}
                        </div>

                        {/* Event Content */}
                        <div className="ml-12 flex-1">
                          <div className="flex items-start justify-between mb-1">
                            <div className={`font-medium ${index === 0 ? 'text-primary-600' : 'text-gray-900'}`}>
                              {event.status}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(event.timestamp).toLocaleString('zh-CN', {
                                month: 'numeric',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </div>
                          <div className="text-sm text-gray-600 mb-1">
                            {event.location}
                          </div>
                          <div className="text-sm text-gray-500">
                            {event.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setTrackingData(null);
                  setTrackingInput('');
                }}
                className="flex-1"
              >
                查询其他订单
              </Button>
              <Link href="/profile/orders" className="flex-1">
                <Button className="w-full">查看所有订单</Button>
              </Link>
            </div>
          </div>
        )}

        {/* Help Section */}
        {!trackingData && (
          <Card>
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
                  <h3 className="font-semibold text-gray-900 mb-2">使用帮助</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 订单号可在订单详情页或确认邮件中找到</li>
                    <li>• 运单号通常在发货后24小时内生效</li>
                    <li>• 物流信息可能存在1-2小时延迟</li>
                    <li>• 如有疑问，请联系客服：400-123-4567</li>
                    <li>• 支持多家快递公司：顺丰、圆通、中通、韵达等</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
