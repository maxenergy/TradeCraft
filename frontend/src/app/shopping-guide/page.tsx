import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function ShoppingGuidePage() {
  const steps = [
    {
      number: '01',
      title: '注册账户',
      description: '创建您的TradeCraft账户，享受专属优惠和服务',
      details: [
        '点击页面右上角"注册"按钮',
        '填写手机号或邮箱，设置密码',
        '验证手机号或邮箱',
        '完善个人信息，获取新人礼包',
      ],
      icon: (
        <svg className="w-8 h-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
    },
    {
      number: '02',
      title: '浏览商品',
      description: '通过分类、搜索或推荐发现心仪商品',
      details: [
        '使用搜索栏输入商品名称或关键词',
        '浏览商品分类，发现更多选择',
        '查看AI智能推荐，找到适合您的商品',
        '使用筛选功能，按价格、品牌等条件筛选',
      ],
      icon: (
        <svg className="w-8 h-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      number: '03',
      title: '查看详情',
      description: '了解商品详细信息，做出明智选择',
      details: [
        '查看商品图片、视频和详细描述',
        '阅读其他用户的真实评价',
        '了解商品规格、参数和使用说明',
        '查看配送信息和售后服务',
      ],
      icon: (
        <svg className="w-8 h-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
    },
    {
      number: '04',
      title: '加入购物车',
      description: '选择商品规格，添加到购物车',
      details: [
        '选择商品颜色、尺码等规格',
        '选择购买数量',
        '点击"加入购物车"或"立即购买"',
        '继续购物或前往结算',
      ],
      icon: (
        <svg className="w-8 h-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      number: '05',
      title: '结算支付',
      description: '填写收货信息，选择支付方式',
      details: [
        '确认购物车商品和数量',
        '填写或选择收货地址',
        '选择配送方式（标准/次日达/预约）',
        '使用优惠券、积分或礼品卡',
        '选择支付方式并完成支付',
      ],
      icon: (
        <svg className="w-8 h-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
    },
    {
      number: '06',
      title: '等待收货',
      description: '跟踪物流，准备收货',
      details: [
        '在"我的订单"中查看订单状态',
        '跟踪物流信息，了解配送进度',
        '配送员会提前联系您',
        '验货后签收',
      ],
      icon: (
        <svg className="w-8 h-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
    },
  ];

  const tips = [
    {
      title: '如何选择合适的商品？',
      content: '查看商品详情页的尺码表、规格参数和用户评价。如有疑问，可咨询在线客服获取专业建议。',
    },
    {
      title: '如何获取优惠？',
      content: '关注平台活动页面，领取优惠券。首次注册、生日当月、会员等级提升都可获得专属优惠。',
    },
    {
      title: '如何查询订单？',
      content: '登录账户后，进入"我的订单"即可查看所有订单状态、物流信息和订单详情。',
    },
    {
      title: '如何申请退换货？',
      content: '在订单详情页点击"申请退货"，填写退货原因。我们支持7天无理由退货（商品需保持完好）。',
    },
    {
      title: '配送需要多长时间？',
      content: '标准配送3-5个工作日，次日达服务在指定区域可次日送达。偏远地区可能需要额外1-3天。',
    },
    {
      title: '支付安全吗？',
      content: '我们采用银行级加密技术，支持支付宝、微信支付等多种安全支付方式。您的支付信息完全保密。',
    },
  ];

  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: '正品保证',
      description: '100%正品保证，假一赔十',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
      ),
      title: '7天无理由退货',
      description: '不满意即可退货，无忧购物',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: '满99免运费',
      description: '订单满99元即可免费配送',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      title: '24/7客服支持',
      description: '全天候在线客服，随时为您服务',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">购物指南</h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              新手入门指南，让您的购物体验更轻松愉快
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">购物流程</h2>
          <div className="space-y-8">
            {steps.map((step, index) => (
              <Card key={index}>
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-2xl font-bold">
                        {step.number}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                          <p className="text-gray-600">{step.description}</p>
                        </div>
                        <div className="text-primary-600 ml-4">
                          {step.icon}
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {step.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start text-gray-600">
                            <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">购物优势</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-full mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">常见问题</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {tips.map((tip, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{tip.title}</h3>
                  <p className="text-gray-600">{tip.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">需要更多帮助？</h2>
              <p className="text-primary-100 mb-6">
                访问帮助中心或联系客服，我们随时为您服务
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
