import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

export default function PaymentMethodsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">支付方式</h1>
            <p className="text-xl text-primary-100">
              多种支付方式，安全便捷
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Supported Payment Methods */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">支持的支付方式</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Alipay */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-10 h-10 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 3h18v18H3V3zm16 16V5H5v14h14zM7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h6v2H7v-2z"/>
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-900 text-lg">支付宝</h3>
                      <p className="text-sm text-gray-600">即时到账</p>
                    </div>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• 支持余额、花呗、信用卡支付</li>
                    <li>• 支持扫码支付</li>
                    <li>• 支付成功立即到账</li>
                  </ul>
                </CardContent>
              </Card>

              {/* WeChat Pay */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-10 h-10 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-900 text-lg">微信支付</h3>
                      <p className="text-sm text-gray-600">即时到账</p>
                    </div>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• 支持零钱、银行卡支付</li>
                    <li>• 支持扫码支付</li>
                    <li>• 支付成功立即到账</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Bank Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-10 h-10 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-900 text-lg">银行卡</h3>
                      <p className="text-sm text-gray-600">即时到账</p>
                    </div>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• 支持借记卡、信用卡</li>
                    <li>• 支持所有主流银行</li>
                    <li>• 安全加密保护</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Apple Pay */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <svg className="w-10 h-10 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-900 text-lg">Apple Pay</h3>
                      <p className="text-sm text-gray-600">即时到账</p>
                    </div>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• 仅限iOS设备使用</li>
                    <li>• 指纹或面容识别</li>
                    <li>• 快速便捷支付</li>
                  </ul>
                </CardContent>
              </Card>

              {/* PayPal */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <svg className="w-10 h-10 text-indigo-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.76-4.852a.932.932 0 0 1 .922-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.72-4.689z"/>
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-900 text-lg">PayPal</h3>
                      <p className="text-sm text-gray-600">国际支付</p>
                    </div>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• 支持海外用户</li>
                    <li>• 多币种支付</li>
                    <li>• 买家保护计划</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Gift Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-pink-100 rounded-lg flex items-center justify-center">
                      <svg className="w-10 h-10 text-pink-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/>
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-900 text-lg">礼品卡</h3>
                      <p className="text-sm text-gray-600">余额抵扣</p>
                    </div>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• 支持礼品卡余额支付</li>
                    <li>• 可与其他方式组合使用</li>
                    <li>• 有效期内随时使用</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Payment Security */}
          <Card className="mb-8">
            <CardHeader className="border-b">
              <h2 className="text-2xl font-semibold text-gray-900">支付安全</h2>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">SSL加密</h3>
                  <p className="text-sm text-gray-600">
                    采用银行级SSL加密技术，保护您的支付信息安全
                  </p>
                </div>

                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">PCI DSS认证</h3>
                  <p className="text-sm text-gray-600">
                    符合支付卡行业数据安全标准，确保交易安全
                  </p>
                </div>

                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                    <svg className="w-8 h-8 text-purple-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">实时监控</h3>
                  <p className="text-sm text-gray-600">
                    24/7实时监控异常交易，及时拦截风险支付
                  </p>
                </div>
              </div>

              <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-green-600 mt-0.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="ml-3">
                    <h3 className="font-semibold text-green-900">安全承诺</h3>
                    <p className="text-green-800 mt-1">
                      我们承诺不会保存您的完整银行卡信息，所有支付都通过第三方支付平台处理
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Process */}
          <Card className="mb-8">
            <CardHeader className="border-b">
              <h2 className="text-2xl font-semibold text-gray-900">支付流程</h2>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-500 text-white font-semibold">
                      1
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900 mb-2">选择商品</h3>
                    <p className="text-gray-600">
                      浏览商品，将喜欢的商品加入购物车
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-500 text-white font-semibold">
                      2
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900 mb-2">提交订单</h3>
                    <p className="text-gray-600">
                      确认购物车商品，填写收货地址等信息，提交订单
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-500 text-white font-semibold">
                      3
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900 mb-2">选择支付方式</h3>
                    <p className="text-gray-600">
                      选择您喜欢的支付方式（支付宝、微信、银行卡等）
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-500 text-white font-semibold">
                      4
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900 mb-2">完成支付</h3>
                    <p className="text-gray-600">
                      按照提示完成支付，支付成功后订单自动确认
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-500 text-white font-semibold">
                      5
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900 mb-2">等待发货</h3>
                    <p className="text-gray-600">
                      支付成功后，我们会尽快为您安排发货
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card>
            <CardHeader className="border-b">
              <h2 className="text-2xl font-semibold text-gray-900">常见问题</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Q: 支付安全吗？</h3>
                <p className="text-gray-600">
                  A: 我们采用银行级加密技术保护您的支付信息，所有支付都通过第三方支付平台处理，绝对安全可靠。
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Q: 可以使用多种支付方式组合支付吗？</h3>
                <p className="text-gray-600">
                  A: 可以。您可以使用礼品卡余额+其他支付方式组合支付。例如：礼品卡余额100元+支付宝支付剩余金额。
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Q: 支付失败怎么办？</h3>
                <p className="text-gray-600">
                  A: 如果支付失败，请检查您的账户余额、银行卡状态等。如仍无法支付，请尝试更换支付方式或联系客服。
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Q: 支付后多久能发货？</h3>
                <p className="text-gray-600">
                  A: 支付成功后，我们会在24小时内发货。部分商品可能需要更长时间，具体以商品详情页说明为准。
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Q: 可以开发票吗？</h3>
                <p className="text-gray-600">
                  A: 可以。提交订单时勾选"需要发票"并填写发票信息即可。我们支持电子发票和纸质发票。
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
