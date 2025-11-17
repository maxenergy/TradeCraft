'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useNotification } from '@/contexts/NotificationContext';

interface AfterSalesRequest {
  id: string;
  orderId: string;
  productName: string;
  type: 'return' | 'exchange' | 'repair';
  status: 'pending' | 'approved' | 'processing' | 'completed' | 'rejected';
  reason: string;
  createdAt: string;
  updatedAt: string;
}

export default function AfterSalesPage() {
  const notification = useNotification();
  const [activeTab, setActiveTab] = useState<'apply' | 'history'>('apply');
  const [requests, setRequests] = useState<AfterSalesRequest[]>([]);
  const [applyForm, setApplyForm] = useState({
    orderId: '',
    productId: '',
    type: 'return' as 'return' | 'exchange' | 'repair',
    reason: '',
    description: '',
    images: [] as string[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mockRequests: AfterSalesRequest[] = [
    {
      id: 'AS-001',
      orderId: 'ORD20240115001',
      productName: '智能手机 Pro Max',
      type: 'return',
      status: 'approved',
      reason: '商品质量问题',
      createdAt: '2024-01-16T10:00:00Z',
      updatedAt: '2024-01-17T14:30:00Z',
    },
    {
      id: 'AS-002',
      orderId: 'ORD20240110002',
      productName: '无线耳机',
      type: 'exchange',
      status: 'completed',
      reason: '收到错误商品',
      createdAt: '2024-01-12T09:00:00Z',
      updatedAt: '2024-01-15T16:00:00Z',
    },
  ];

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!applyForm.orderId || !applyForm.reason || !applyForm.description) {
      notification.warning('请填写完整', '请填写所有必填字段');
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      notification.success('提交成功', '我们将在1-2个工作日内审核您的申请');
      setApplyForm({
        orderId: '',
        productId: '',
        type: 'return',
        reason: '',
        description: '',
        images: [],
      });
      setActiveTab('history');
    } catch (error) {
      notification.error('提交失败', '无法提交售后申请');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      return: '退货退款',
      exchange: '换货',
      repair: '维修',
    };
    return labels[type as keyof typeof labels];
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: '待审核', color: 'bg-yellow-100 text-yellow-800' },
      approved: { label: '已通过', color: 'bg-green-100 text-green-800' },
      processing: { label: '处理中', color: 'bg-blue-100 text-blue-800' },
      completed: { label: '已完成', color: 'bg-gray-100 text-gray-800' },
      rejected: { label: '已拒绝', color: 'bg-red-100 text-red-800' },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">售后服务</h1>
          <p className="text-gray-600">7天无理由退货，让您购物无忧</p>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">退货退款</h3>
              <p className="text-sm text-gray-600 mb-4">7天无理由退货<br/>质量问题15天退货</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">换货服务</h3>
              <p className="text-sm text-gray-600 mb-4">15天换货保障<br/>同款换新或换其他款式</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">维修服务</h3>
              <p className="text-sm text-gray-600 mb-4">品牌官方维修<br/>原厂配件保障</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('apply')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'apply'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              申请售后
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'history'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              售后记录
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'apply' && (
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900">申请售后服务</h2>
              <p className="text-sm text-gray-600 mt-1">请填写以下信息，我们将尽快处理您的申请</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitRequest} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    订单号 <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={applyForm.orderId}
                    onChange={(e) => setApplyForm({ ...applyForm, orderId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="请输入订单号，如：ORD20240115001"
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    可在"我的订单"中查看订单号
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    服务类型 <span className="text-red-600">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {['return', 'exchange', 'repair'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setApplyForm({ ...applyForm, type: type as any })}
                        className={`p-4 border-2 rounded-lg text-center transition-colors ${
                          applyForm.type === type
                            ? 'border-primary-600 bg-primary-50 text-primary-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        disabled={isSubmitting}
                      >
                        <div className="font-medium">{getTypeLabel(type)}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    申请原因 <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={applyForm.reason}
                    onChange={(e) => setApplyForm({ ...applyForm, reason: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    disabled={isSubmitting}
                  >
                    <option value="">请选择原因</option>
                    <option value="quality">商品质量问题</option>
                    <option value="wrong">收到错误商品</option>
                    <option value="damaged">商品破损</option>
                    <option value="description">与描述不符</option>
                    <option value="notlike">不喜欢/不想要</option>
                    <option value="other">其他原因</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    问题描述 <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    value={applyForm.description}
                    onChange={(e) => setApplyForm({ ...applyForm, description: e.target.value })}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="请详细描述您遇到的问题..."
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    上传图片（可选）
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-600 mb-2">点击上传或拖拽图片到此处</p>
                    <p className="text-xs text-gray-500">支持 JPG、PNG 格式，最多5张</p>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium mb-1">温馨提示</p>
                      <ul className="space-y-1 text-xs">
                        <li>• 商品需保持原包装完整，配件齐全</li>
                        <li>• 退货时请提供订单号和有效凭证</li>
                        <li>• 退款将在收到退货后3-5个工作日内处理</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button type="submit" disabled={isSubmitting} size="lg" className="w-full">
                  {isSubmitting ? '提交中...' : '提交申请'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            {mockRequests.length === 0 ? (
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
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">暂无售后记录</h3>
                  <p className="text-gray-600">您还没有提交任何售后申请</p>
                </CardContent>
              </Card>
            ) : (
              mockRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="font-semibold text-lg text-gray-900 mr-3">
                            {request.productName}
                          </h3>
                          {getStatusBadge(request.status)}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">申请单号:</span>
                            <div className="font-medium">{request.id}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">订单号:</span>
                            <div className="font-medium">{request.orderId}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">服务类型:</span>
                            <div className="font-medium">{getTypeLabel(request.type)}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">申请时间:</span>
                            <div className="font-medium">
                              {new Date(request.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          原因: {request.reason}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            查看详情
                          </Button>
                          {request.status === 'pending' && (
                            <Button variant="outline" size="sm" className="text-red-600">
                              取消申请
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Policy Info */}
        <Card className="mt-8">
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900">售后政策</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">退货政策</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 7天无理由退货：商品签收后7天内，在不影响二次销售的前提下可申请退货</li>
                  <li>• 15天质量问题退货：商品存在质量问题，可在15天内申请退货</li>
                  <li>• 特殊商品（如食品、内衣等）不支持7天无理由退货</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">换货政策</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 15天内可申请换货，需保证商品完好及包装完整</li>
                  <li>• 同款换新或换其他款式（需补差价）</li>
                  <li>• 运费承担：质量问题由平台承担，个人原因由客户承担</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">维修服务</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 品牌官方维修，原厂配件保障</li>
                  <li>• 保修期内免费维修（人为损坏除外）</li>
                  <li>• 保修期外提供优惠维修服务</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="mt-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">需要帮助？</h3>
                <p className="text-sm text-gray-600">
                  如有任何售后问题，请联系我们的客服团队
                </p>
              </div>
              <Link href="/customer-service">
                <Button>联系客服</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
