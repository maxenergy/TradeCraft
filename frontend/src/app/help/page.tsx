'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function HelpPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: '全部问题' },
    { id: 'order', name: '订单相关' },
    { id: 'payment', name: '支付问题' },
    { id: 'shipping', name: '配送问题' },
    { id: 'return', name: '退换货' },
    { id: 'account', name: '账户管理' },
    { id: 'product', name: '商品问题' },
  ];

  const faqs: FAQ[] = [
    {
      id: 'order-1',
      category: 'order',
      question: '如何查询订单状态？',
      answer: '登录您的账户后，进入"我的订单"页面即可查看所有订单状态。您也可以在订单详情页查看物流信息和配送进度。我们会通过短信和邮件及时通知您订单状态的变化。'
    },
    {
      id: 'order-2',
      category: 'order',
      question: '如何取消订单？',
      answer: '在订单发货前，您可以在"我的订单"页面点击"取消订单"按钮。如果订单已发货，您需要等待收货后申请退货。取消订单后，款项会在3-5个工作日内原路退回。'
    },
    {
      id: 'order-3',
      category: 'order',
      question: '订单可以修改收货地址吗？',
      answer: '如果订单还未发货，您可以联系客服修改收货地址。订单发货后将无法修改地址，建议您在下单时仔细核对收货信息。'
    },
    {
      id: 'order-4',
      category: 'order',
      question: '为什么订单显示已完成但我还没收到货？',
      answer: '如果订单状态显示异常，请第一时间联系客服。可能是系统延迟或物流信息更新不及时。我们会立即为您核实订单情况并妥善处理。'
    },
    {
      id: 'payment-1',
      category: 'payment',
      question: '支持哪些支付方式？',
      answer: '我们支持支付宝、微信支付、银行卡、Apple Pay、PayPal等多种支付方式。所有支付均采用银行级加密技术，确保交易安全。具体支付方式请查看支付页面。'
    },
    {
      id: 'payment-2',
      category: 'payment',
      question: '支付失败怎么办？',
      answer: '支付失败可能是由于网络问题、余额不足或银行限额等原因。建议您检查网络连接和账户余额后重试。如果问题持续存在，请联系客服或更换其他支付方式。'
    },
    {
      id: 'payment-3',
      category: 'payment',
      question: '可以使用优惠券和积分一起支付吗？',
      answer: '可以。在结算页面，您可以同时使用优惠券、积分和礼品卡进行支付。系统会自动计算优惠后的实际支付金额。'
    },
    {
      id: 'payment-4',
      category: 'payment',
      question: '支付成功但订单未生成怎么办？',
      answer: '这种情况很少见，可能是系统延迟导致。请保存支付凭证并联系客服，我们会在核实后为您处理订单或安排退款。'
    },
    {
      id: 'shipping-1',
      category: 'shipping',
      question: '配送需要多长时间？',
      answer: '标准配送一般3-5个工作日送达，次日达服务在指定区域下单后次日送达。具体配送时效取决于您的收货地址和选择的配送方式。偏远地区可能需要额外1-3天。'
    },
    {
      id: 'shipping-2',
      category: 'shipping',
      question: '可以指定送货时间吗？',
      answer: '我们提供预约配送服务，您可以在下单时选择方便的收货时段。配送员会在约定时间段内送货上门，并提前与您电话联系。'
    },
    {
      id: 'shipping-3',
      category: 'shipping',
      question: '快递费用是多少？',
      answer: '订单满¥99免标准配送运费，订单满¥199免次日达运费。未满免运费金额的订单，标准配送收取¥10运费，次日达收取¥20运费。部分偏远地区可能产生额外运费。'
    },
    {
      id: 'shipping-4',
      category: 'shipping',
      question: '物流信息多久更新一次？',
      answer: '物流信息通常每4-6小时更新一次。您可以在订单详情页查看实时物流动态。如遇节假日或特殊情况，物流信息可能延迟更新。'
    },
    {
      id: 'return-1',
      category: 'return',
      question: '退换货政策是什么？',
      answer: '我们支持7天无理由退货（商品需保持原包装和吊牌完好）。质量问题商品支持30天内免费退换货。部分特殊商品（如食品、贴身衣物等）不支持无理由退货。'
    },
    {
      id: 'return-2',
      category: 'return',
      question: '如何申请退货？',
      answer: '在"我的订单"中找到需要退货的订单，点击"申请退货"并填写退货原因。审核通过后，请将商品寄回指定地址。我们收到商品并验收合格后会尽快退款。'
    },
    {
      id: 'return-3',
      category: 'return',
      question: '退款多久到账？',
      answer: '退款会在我们收到退货商品并验收合格后的3-5个工作日内原路退回。具体到账时间取决于您的支付方式和银行处理速度。'
    },
    {
      id: 'return-4',
      category: 'return',
      question: '退货运费谁承担？',
      answer: '如因商品质量问题退货，运费由我们承担。如因个人原因退货（7天无理由退货），运费由买家承担。我们会提供退货运费补贴券供您使用。'
    },
    {
      id: 'account-1',
      category: 'account',
      question: '如何注册账户？',
      answer: '点击页面右上角的"注册"按钮，填写手机号或邮箱并设置密码即可完成注册。您也可以使用微信、支付宝等第三方账号快速登录。'
    },
    {
      id: 'account-2',
      category: 'account',
      question: '忘记密码怎么办？',
      answer: '在登录页面点击"忘记密码"，输入您的手机号或邮箱，系统会发送验证码帮助您重置密码。如遇问题请联系客服协助处理。'
    },
    {
      id: 'account-3',
      category: 'account',
      question: '如何修改个人信息？',
      answer: '登录后进入"账户设置"页面，您可以修改昵称、头像、收货地址、联系方式等个人信息。部分敏感信息修改可能需要验证身份。'
    },
    {
      id: 'account-4',
      category: 'account',
      question: '如何注销账户？',
      answer: '如需注销账户，请联系客服提交申请。注销前请确保没有未完成的订单和未使用的余额。账户注销后所有数据将被永久删除且无法恢复。'
    },
    {
      id: 'product-1',
      category: 'product',
      question: '如何确认商品是正品？',
      answer: '平台所有商品均来自官方授权渠道，100%正品保证。每件商品都有防伪标识和质检报告。我们承诺假一赔十，让您放心购物。'
    },
    {
      id: 'product-2',
      category: 'product',
      question: '商品缺货还会补货吗？',
      answer: '缺货商品通常会在1-2周内补货。您可以点击"到货通知"按钮，商品补货后我们会第一时间通知您。部分限量商品可能不再补货。'
    },
    {
      id: 'product-3',
      category: 'product',
      question: '如何选择合适的尺码？',
      answer: '每个商品页面都有详细的尺码表和测量方法。建议您根据自己的实际尺寸对照尺码表选择。如有疑问，可以咨询在线客服获取专业建议。'
    },
    {
      id: 'product-4',
      category: 'product',
      question: '商品评价是真实的吗？',
      answer: '我们严格审核所有评价，禁止虚假评价和刷单行为。所有评价均来自真实购买用户。您也可以在收货后发表您的使用体验。'
    },
  ];

  const filteredFAQs = faqs.filter((faq) => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">帮助中心</h1>
            <p className="text-xl text-primary-100 mb-8">寻找答案，解决问题</p>
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索您想了解的问题..."
                  className="w-full px-6 py-4 pl-12 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                />
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/contact">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-full mb-3">
                    <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900">在线客服</h3>
                  <p className="text-sm text-gray-600 mt-1">实时咨询</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/returns">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-full mb-3">
                    <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900">退换货</h3>
                  <p className="text-sm text-gray-600 mt-1">申请退换货</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/shipping">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-full mb-3">
                    <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900">配送查询</h3>
                  <p className="text-sm text-gray-600 mt-1">查看物流</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/payment-methods">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-full mb-3">
                    <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900">支付方式</h3>
                  <p className="text-sm text-gray-600 mt-1">支付帮助</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full font-medium transition-colors $${'{'}
                  selectedCategory === category.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ${'}'}`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredFAQs.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">未找到相关问题</h3>
                <p className="text-gray-600 mb-4">请尝试其他关键词或联系客服获取帮助</p>
                <Link href="/contact"><Button>联系客服</Button></Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredFAQs.map((faq) => (
                <Card key={faq.id} className="overflow-hidden">
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full text-left p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                      <svg
                        className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform $${'{'}
                          expandedFAQ === faq.id ? 'transform rotate-180' : ''
                        ${'}'}`}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  {expandedFAQ === faq.id && (
                    <div className="px-6 pb-6 pt-0">
                      <div className="border-t pt-4">
                        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">还有其他问题？</h2>
                <p className="text-gray-600 mb-6">如果以上内容无法解决您的问题，请随时联系我们的客服团队</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/contact">
                    <Button size="lg">
                      <svg className="w-5 h-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      联系客服
                    </Button>
                  </Link>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>客服热线：400-888-8888</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-4">服务时间：周一至周日 9:00-21:00</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
