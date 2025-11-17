'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function GettingStartedPage() {
  const [activeTab, setActiveTab] = useState<string>('account');

  const tabs = [
    { id: 'account', name: '账户设置' },
    { id: 'shopping', name: '购物流程' },
    { id: 'payment', name: '支付方式' },
    { id: 'benefits', name: '会员权益' },
  ];

  const quickLinks = [
    {
      title: '注册新账户',
      description: '快速创建账户，享受新人专属优惠',
      link: '/register',
      icon: (
        <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
    },
    {
      title: '领取新人礼包',
      description: '注册即送优惠券和积分',
      link: '/promotions',
      icon: (
        <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
        </svg>
      ),
    },
    {
      title: '浏览热门商品',
      description: '发现精选好物，开启购物之旅',
      link: '/products',
      icon: (
        <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: '查看购物指南',
      description: '了解详细的购物流程和注意事项',
      link: '/shopping-guide',
      icon: (
        <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
  ];

  const newUserBenefits = [
    { title: '新人专享优惠券', value: '¥100', description: '无门槛优惠券大礼包' },
    { title: '首单立减', value: '20%', description: '首单最高减免20%' },
    { title: '免运费券', value: '5张', description: '全品类免运费' },
    { title: '积分奖励', value: '1000分', description: '注册即送积分' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">新手入门</h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              欢迎来到TradeCraft！让我们帮助您快速开始购物之旅
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, index) => (
              <Link key={index} href={link.link}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-full mb-4">
                      {link.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{link.title}</h3>
                    <p className="text-gray-600 text-sm">{link.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">新人专享福利</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newUserBenefits.map((benefit, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-primary-600 mb-2">{benefit.value}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/register">
              <Button size="lg">立即注册领取</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">入门教程</h2>
          
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors $${'{'}
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ${'}'}`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          <div className="max-w-4xl mx-auto">
            {activeTab === 'account' && (
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">账户设置指南</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">如何注册账户？</h4>
                      <ol className="list-decimal list-inside space-y-2 text-gray-600">
                        <li>点击页面右上角"注册"按钮</li>
                        <li>填写手机号或邮箱地址</li>
                        <li>设置账户密码（至少8位，包含字母和数字）</li>
                        <li>输入验证码完成验证</li>
                        <li>阅读并同意用户协议</li>
                        <li>点击"注册"完成账户创建</li>
                      </ol>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">如何完善个人信息？</h4>
                      <ol className="list-decimal list-inside space-y-2 text-gray-600">
                        <li>登录后点击右上角头像，进入"账户设置"</li>
                        <li>填写昵称、性别、生日等基本信息</li>
                        <li>添加收货地址（可添加多个地址）</li>
                        <li>绑定手机号和邮箱（提升账户安全性）</li>
                        <li>设置支付密码（保护账户资金安全）</li>
                      </ol>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">如何管理收货地址？</h4>
                      <ul className="list-disc list-inside space-y-2 text-gray-600">
                        <li>在"账户设置"中选择"收货地址管理"</li>
                        <li>点击"添加新地址"填写收货信息</li>
                        <li>可以设置默认收货地址</li>
                        <li>支持添加多个地址，方便切换</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'shopping' && (
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">购物流程指南</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">如何搜索商品？</h4>
                      <ul className="list-disc list-inside space-y-2 text-gray-600">
                        <li>使用顶部搜索栏输入商品名称或关键词</li>
                        <li>浏览商品分类目录</li>
                        <li>查看首页推荐和热门商品</li>
                        <li>使用筛选功能按价格、品牌等条件筛选</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">如何下单购买？</h4>
                      <ol className="list-decimal list-inside space-y-2 text-gray-600">
                        <li>浏览商品详情，选择颜色、尺码等规格</li>
                        <li>点击"加入购物车"或"立即购买"</li>
                        <li>在购物车中确认商品和数量</li>
                        <li>点击"去结算"进入结算页面</li>
                        <li>填写收货地址和联系方式</li>
                        <li>选择配送方式和支付方式</li>
                        <li>确认订单信息后完成支付</li>
                      </ol>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">如何跟踪订单？</h4>
                      <ul className="list-disc list-inside space-y-2 text-gray-600">
                        <li>进入"我的订单"查看所有订单</li>
                        <li>点击订单详情查看物流信息</li>
                        <li>订单状态变化会通过短信和邮件通知</li>
                        <li>可以联系客服查询订单进度</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'payment' && (
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">支付方式指南</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">支持哪些支付方式？</h4>
                      <ul className="list-disc list-inside space-y-2 text-gray-600">
                        <li>支付宝（余额、花呗、信用卡）</li>
                        <li>微信支付</li>
                        <li>银行卡支付（借记卡、信用卡）</li>
                        <li>Apple Pay</li>
                        <li>PayPal</li>
                        <li>礼品卡和余额支付</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">如何使用优惠券？</h4>
                      <ol className="list-decimal list-inside space-y-2 text-gray-600">
                        <li>在"我的优惠券"中查看可用优惠券</li>
                        <li>结算时勾选要使用的优惠券</li>
                        <li>系统会自动计算优惠金额</li>
                        <li>确认优惠后完成支付</li>
                      </ol>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">支付安全保障</h4>
                      <ul className="list-disc list-inside space-y-2 text-gray-600">
                        <li>采用银行级加密技术保护支付信息</li>
                        <li>通过PCI DSS安全认证</li>
                        <li>支持支付密码和指纹验证</li>
                        <li>异常交易实时监控和拦截</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'benefits' && (
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">会员权益指南</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">会员等级制度</h4>
                      <ul className="list-disc list-inside space-y-2 text-gray-600">
                        <li>普通会员：注册即享基础权益</li>
                        <li>银卡会员：年消费满5000元</li>
                        <li>金卡会员：年消费满20000元</li>
                        <li>钻石会员：年消费满50000元</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">会员专享权益</h4>
                      <ul className="list-disc list-inside space-y-2 text-gray-600">
                        <li>会员专属折扣和优惠券</li>
                        <li>生日月专属礼品</li>
                        <li>优先参加限时活动</li>
                        <li>专属客服通道</li>
                        <li>免费或优惠的配送服务</li>
                        <li>积分加倍奖励</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">积分规则</h4>
                      <ul className="list-disc list-inside space-y-2 text-gray-600">
                        <li>每消费1元可获得1积分</li>
                        <li>会员等级越高，积分倍率越高</li>
                        <li>积分可兑换优惠券和礼品</li>
                        <li>积分有效期为1年</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">还有疑问？</h2>
              <p className="text-primary-100 mb-6">
                查看完整的帮助文档或联系我们的客服团队
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/help">
                  <Button size="lg" variant="outline" className="bg-white text-primary-600 hover:bg-gray-100">
                    访问帮助中心
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600">
                    联系客服
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
