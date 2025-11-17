'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function FAQPage() {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const toggleItem = (itemId: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const faqItems: FAQItem[] = [
    // Ordering
    {
      id: 'order-1',
      category: '下单购买',
      question: '如何下单购买商品？',
      answer: '浏览商品页面，选择您喜欢的商品，点击"加入购物车"。在购物车中确认商品和数量后，点击"去结算"，填写收货地址和支付信息即可完成下单。',
    },
    {
      id: 'order-2',
      category: '下单购买',
      question: '可以修改或取消订单吗？',
      answer: '订单在"待支付"状态下可以直接取消。订单已支付但未发货时，可以联系客服申请取消。订单已发货后无法取消，但可以在收货后申请退货。',
    },
    {
      id: 'order-3',
      category: '下单购买',
      question: '支持哪些支付方式？',
      answer: '我们支持支付宝、微信支付、银联卡支付、信用卡支付等多种支付方式。您可以在结算时选择最方便的支付方式。',
    },

    // Shipping
    {
      id: 'ship-1',
      category: '配送物流',
      question: '配送需要多长时间？',
      answer: '大部分地区支持次日达或2-3天送达。偏远地区可能需要3-7天。具体配送时间以商品详情页说明为准。',
    },
    {
      id: 'ship-2',
      category: '配送物流',
      question: '如何查询物流信息？',
      answer: '订单发货后，您会收到短信和邮件通知。登录"个人中心"-"我的订单"，点击订单详情即可查看物流跟踪信息。',
    },
    {
      id: 'ship-3',
      category: '配送物流',
      question: '运费如何计算？',
      answer: '订单满99元免运费。不满99元的订单根据重量和距离收取运费，具体金额在结算时显示。',
    },

    // Returns
    {
      id: 'return-1',
      category: '退换货',
      question: '支持7天无理由退货吗？',
      answer: '支持。大部分商品自收货之日起7天内，在不影响二次销售的情况下可以申请退货。部分特殊商品（如定制商品、食品等）除外。',
    },
    {
      id: 'return-2',
      category: '退换货',
      question: '如何申请退换货？',
      answer: '登录"个人中心"-"我的订单"，找到需要退换货的订单，点击"申请售后"，填写退换货原因和上传相关图片即可。',
    },
    {
      id: 'return-3',
      category: '退换货',
      question: '退款多久到账？',
      answer: '我们收到退货后3-5个工作日内完成审核并退款。退款将原路返回到您的支付账户，到账时间根据不同支付方式有所不同，一般1-7个工作日。',
    },

    // Account
    {
      id: 'account-1',
      category: '账号相关',
      question: '如何注册账号？',
      answer: '点击页面右上角的"注册"按钮，填写邮箱、设置密码即可完成注册。我们会发送验证邮件到您的邮箱，点击邮件中的链接即可激活账号。',
    },
    {
      id: 'account-2',
      category: '账号相关',
      question: '忘记密码怎么办？',
      answer: '在登录页面点击"忘记密码"，输入您的注册邮箱，我们会发送密码重置链接到您的邮箱。通过邮件中的链接即可重置密码。',
    },
    {
      id: 'account-3',
      category: '账号相关',
      question: '可以注销账号吗？',
      answer: '可以。您可以在个人中心的账号设置中申请注销账号。注销后，您的个人信息将被删除，但已完成的交易记录将保留用于法律合规和财务管理。',
    },

    // Product
    {
      id: 'product-1',
      category: '商品相关',
      question: '商品是正品吗？',
      answer: '我们所有商品均来自官方授权渠道，100%正品保证。每件商品都可提供正规发票和质保服务。如发现假货，假一赔十。',
    },
    {
      id: 'product-2',
      category: '商品相关',
      question: '商品有质保吗？',
      answer: '有。不同商品的质保期不同，具体以商品详情页说明为准。质保期内出现质量问题可以免费维修或更换。',
    },
    {
      id: 'product-3',
      category: '商品相关',
      question: '缺货商品何时补货？',
      answer: '缺货商品的补货时间不确定。您可以点击商品详情页的"到货通知"，商品补货后我们会第一时间通知您。',
    },

    // Payment
    {
      id: 'payment-1',
      category: '支付相关',
      question: '支付安全吗？',
      answer: '我们采用银行级SSL加密技术保护您的支付信息。所有支付都通过第三方支付平台处理，我们不会保存您的银行卡信息。',
    },
    {
      id: 'payment-2',
      category: '支付相关',
      question: '可以开发票吗？',
      answer: '可以。下单时勾选"需要发票"选项，填写发票信息即可。我们支持电子发票和纸质发票，电子发票会在发货后发送到您的邮箱。',
    },
    {
      id: 'payment-3',
      category: '支付相关',
      question: '支付失败怎么办？',
      answer: '如果支付失败，请检查您的账户余额是否充足，网络是否正常。如果问题仍然存在，请联系您的银行或支付平台客服。',
    },
  ];

  const categories = Array.from(new Set(faqItems.map((item) => item.category)));

  const filteredItems = faqItems.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">常见问题</h1>
            <p className="text-xl text-primary-100 mb-8">
              快速找到您关心问题的答案
            </p>

            {/* Search Box */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索问题..."
                  className="w-full px-6 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <svg
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Categories */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                全部
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Items */}
          {filteredItems.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到相关问题</h3>
                <p className="text-gray-600 mb-4">尝试使用其他关键词搜索</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1 pr-4">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-semibold text-primary-600 bg-primary-100 px-2 py-1 rounded">
                          {item.category}
                        </span>
                      </div>
                      <h3 className="font-medium text-gray-900 text-lg">
                        {item.question}
                      </h3>
                    </div>
                    <svg
                      className={`w-6 h-6 text-gray-500 transition-transform flex-shrink-0 ${
                        expandedItems.has(item.id) ? 'transform rotate-180' : ''
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
                  {expandedItems.has(item.id) && (
                    <div className="px-6 pb-6 pt-2 border-t bg-gray-50">
                      <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}

          {/* Contact CTA */}
          <Card className="mt-12">
            <CardContent className="p-8 text-center">
              <div className="mb-4">
                <svg className="w-12 h-12 mx-auto text-primary-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                没有找到您想要的答案？
              </h3>
              <p className="text-gray-600 mb-6">
                我们的客服团队随时为您提供帮助
              </p>
              <div className="flex justify-center gap-4">
                <Link href="/contact">
                  <Button>联系客服</Button>
                </Link>
                <Link href="/help">
                  <Button variant="outline">帮助中心</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">相关帮助</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Link href="/shipping" className="group">
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="text-primary-600 mb-4">
                    <svg className="w-12 h-12 mx-auto" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary-600">配送政策</h3>
                </CardContent>
              </Card>
            </Link>

            <Link href="/returns" className="group">
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="text-primary-600 mb-4">
                    <svg className="w-12 h-12 mx-auto" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary-600">退换货政策</h3>
                </CardContent>
              </Card>
            </Link>

            <Link href="/privacy" className="group">
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="text-primary-600 mb-4">
                    <svg className="w-12 h-12 mx-auto" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary-600">隐私政策</h3>
                </CardContent>
              </Card>
            </Link>

            <Link href="/terms" className="group">
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="text-primary-600 mb-4">
                    <svg className="w-12 h-12 mx-auto" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary-600">服务条款</h3>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
