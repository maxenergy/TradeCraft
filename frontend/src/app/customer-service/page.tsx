'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useNotification } from '@/contexts/NotificationContext';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface SupportTicket {
  id: string;
  subject: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  lastUpdated: string;
}

export default function CustomerServicePage() {
  const notification = useNotification();
  const [activeTab, setActiveTab] = useState<'contact' | 'faq' | 'tickets'>('contact');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'general',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const faqItems: FAQItem[] = [
    {
      id: '1',
      question: '如何修改订单信息？',
      answer: '订单提交后30分钟内可以修改，请进入"我的订单"页面，找到相应订单点击"修改订单"。超过30分钟的订单如需修改，请联系客服。',
      category: '订单问题',
    },
    {
      id: '2',
      question: '支持哪些支付方式？',
      answer: '我们支持支付宝、微信支付、银行卡支付（借记卡/信用卡）、货到付款等多种支付方式。部分商品可能不支持货到付款。',
      category: '支付问题',
    },
    {
      id: '3',
      question: '如何申请退款？',
      answer: '收到商品后7天内，如商品存在质量问题或不符合描述，可申请退款。请进入订单详情页面，点击"申请退款"按钮，填写退款原因并上传凭证。',
      category: '退换货',
    },
    {
      id: '4',
      question: '配送需要多长时间？',
      answer: '标准配送：3-5个工作日；加急配送：1-2个工作日；偏远地区可能需要额外1-2天。具体时间以实际物流情况为准。',
      category: '配送问题',
    },
    {
      id: '5',
      question: '如何使用优惠券？',
      answer: '在结算页面，点击"使用优惠券"，选择可用的优惠券即可自动抵扣。请注意优惠券的使用条件和有效期。',
      category: '优惠活动',
    },
  ];

  const mockTickets: SupportTicket[] = [
    {
      id: 'TICKET-001',
      subject: '订单发货问题',
      status: 'in_progress',
      priority: 'high',
      createdAt: '2024-01-15T10:00:00Z',
      lastUpdated: '2024-01-16T14:30:00Z',
    },
    {
      id: 'TICKET-002',
      subject: '退款申请咨询',
      status: 'resolved',
      priority: 'medium',
      createdAt: '2024-01-10T09:00:00Z',
      lastUpdated: '2024-01-12T16:00:00Z',
    },
  ];

  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contactForm.name || !contactForm.email || !contactForm.subject || !contactForm.message) {
      notification.warning('请填写完整', '请填写所有必填字段');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactForm.email)) {
      notification.error('邮箱格式错误', '请输入有效的邮箱地址');
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      notification.success('提交成功', '我们将在24小时内回复您');
      setContactForm({
        name: '',
        email: '',
        phone: '',
        category: 'general',
        subject: '',
        message: '',
      });
    } catch (error) {
      notification.error('提交失败', '无法提交请求，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: SupportTicket['status']) => {
    const statusConfig = {
      open: { label: '待处理', color: 'bg-yellow-100 text-yellow-800' },
      in_progress: { label: '处理中', color: 'bg-blue-100 text-blue-800' },
      resolved: { label: '已解决', color: 'bg-green-100 text-green-800' },
      closed: { label: '已关闭', color: 'bg-gray-100 text-gray-800' },
    };
    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority: SupportTicket['priority']) => {
    const priorityConfig = {
      low: { label: '低', color: 'text-gray-600' },
      medium: { label: '中', color: 'text-orange-600' },
      high: { label: '高', color: 'text-red-600' },
    };
    const config = priorityConfig[priority];
    return <span className={`font-medium ${config.color}`}>{config.label}</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">客服支持</h1>
          <p className="text-lg text-gray-600">我们随时为您提供帮助</p>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">电话客服</h3>
              <p className="text-gray-600 mb-3">周一至周日 9:00-21:00</p>
              <div className="text-2xl font-bold text-primary-600">400-123-4567</div>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">在线客服</h3>
              <p className="text-gray-600 mb-3">实时响应，即时解答</p>
              <Button className="w-full" variant="outline">
                开始聊天
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">邮件支持</h3>
              <p className="text-gray-600 mb-3">24小时内回复</p>
              <div className="text-sm font-medium text-blue-600">support@tradecraft.com</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('contact')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'contact'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              联系我们
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'faq'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              常见问题
            </button>
            <button
              onClick={() => setActiveTab('tickets')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'tickets'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              我的工单
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'contact' && (
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900">提交支持请求</h2>
              <p className="text-sm text-gray-600 mt-1">填写以下表单，我们的客服团队将尽快与您联系</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitContact} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      姓名 <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="请输入您的姓名"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      邮箱 <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="your@email.com"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      联系电话
                    </label>
                    <input
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="138****8888"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      问题类型 <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={contactForm.category}
                      onChange={(e) => setContactForm({ ...contactForm, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      disabled={isSubmitting}
                    >
                      <option value="general">一般咨询</option>
                      <option value="order">订单问题</option>
                      <option value="payment">支付问题</option>
                      <option value="shipping">配送问题</option>
                      <option value="return">退换货</option>
                      <option value="technical">技术支持</option>
                      <option value="complaint">投诉建议</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    主题 <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="简短描述您的问题"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    详细描述 <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="请详细描述您遇到的问题..."
                    disabled={isSubmitting}
                  />
                </div>

                <Button type="submit" disabled={isSubmitting} size="lg" className="w-full md:w-auto">
                  {isSubmitting ? '提交中...' : '提交请求'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {activeTab === 'faq' && (
          <div className="space-y-4">
            {faqItems.map((faq) => (
              <Card key={faq.id}>
                <CardContent className="p-0">
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                    className="w-full text-left p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 mr-3">
                          {faq.category}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                    </div>
                    <svg
                      className={`w-6 h-6 text-gray-400 transition-transform ${
                        expandedFAQ === faq.id ? 'transform rotate-180' : ''
                      }`}
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedFAQ === faq.id && (
                    <div className="px-6 pb-6 text-gray-600">
                      {faq.answer}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'tickets' && (
          <div className="space-y-4">
            {mockTickets.length === 0 ? (
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
                  <h3 className="text-lg font-medium text-gray-900 mb-2">暂无工单</h3>
                  <p className="text-gray-600">您目前没有提交任何支持工单</p>
                </CardContent>
              </Card>
            ) : (
              mockTickets.map((ticket) => (
                <Card key={ticket.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-3">
                          <h3 className="font-semibold text-lg text-gray-900 mr-3">
                            {ticket.subject}
                          </h3>
                          {getStatusBadge(ticket.status)}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">工单号:</span>
                            <div className="font-medium">{ticket.id}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">优先级:</span>
                            <div>{getPriorityBadge(ticket.priority)}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">创建时间:</span>
                            <div className="font-medium">
                              {new Date(ticket.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">最后更新:</span>
                            <div className="font-medium">
                              {new Date(ticket.lastUpdated).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="ml-4">
                        查看详情
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Help Resources */}
        <Card className="mt-8">
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900">更多帮助资源</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a href="/help" className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <svg className="w-6 h-6 text-primary-600 mt-0.5 mr-3 flex-shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">帮助中心</h3>
                  <p className="text-sm text-gray-600">查看详细的使用指南和教程</p>
                </div>
              </a>

              <a href="/blog" className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <svg className="w-6 h-6 text-primary-600 mt-0.5 mr-3 flex-shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">博客文章</h3>
                  <p className="text-sm text-gray-600">阅读购物指南和使用技巧</p>
                </div>
              </a>

              <a href="/contact" className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <svg className="w-6 h-6 text-primary-600 mt-0.5 mr-3 flex-shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">联系方式</h3>
                  <p className="text-sm text-gray-600">查看所有联系方式和营业时间</p>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
