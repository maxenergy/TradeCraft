import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">配送信息</h1>
            <p className="text-xl text-primary-100">
              了解我们的配送政策、时效和相关费用
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Shipping Methods */}
          <Card className="mb-8">
            <CardHeader className="border-b">
              <h2 className="text-2xl font-semibold text-gray-900">配送方式</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">标准配送</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>适用于大部分商品</li>
                  <li>配送时效：2-5个工作日</li>
                  <li>订单满99元免运费</li>
                  <li>不满99元收取运费10元</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">快速配送</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>适用于指定商品和地区</li>
                  <li>配送时效：次日达或当日达</li>
                  <li>额外收取快递费用15-20元</li>
                  <li>在商品详情页会显示是否支持快速配送</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">自提服务</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>部分城市支持门店自提</li>
                  <li>下单时选择自提点</li>
                  <li>到货后会收到短信通知</li>
                  <li>凭订单号和本人身份证件提货</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Time */}
          <Card className="mb-8">
            <CardHeader className="border-b">
              <h2 className="text-2xl font-semibold text-gray-900">配送时效</h2>
            </CardHeader>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">地区</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">标准配送</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">快速配送</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 text-gray-900">北京、上海、广州、深圳</td>
                      <td className="px-6 py-4 text-gray-600">1-2个工作日</td>
                      <td className="px-6 py-4 text-gray-600">当日达/次日达</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-gray-900">省会城市及沿海主要城市</td>
                      <td className="px-6 py-4 text-gray-600">2-3个工作日</td>
                      <td className="px-6 py-4 text-gray-600">次日达</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-gray-900">其他城市</td>
                      <td className="px-6 py-4 text-gray-600">3-5个工作日</td>
                      <td className="px-6 py-4 text-gray-600">部分支持</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-gray-900">偏远地区</td>
                      <td className="px-6 py-4 text-gray-600">5-7个工作日</td>
                      <td className="px-6 py-4 text-gray-600">不支持</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                * 以上时效为正常情况下的预计时间，具体以实际配送为准。节假日和特殊时期可能会有延迟。
              </p>
            </CardContent>
          </Card>

          {/* Shipping Fees */}
          <Card className="mb-8">
            <CardHeader className="border-b">
              <h2 className="text-2xl font-semibold text-gray-900">运费说明</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-primary-600 mt-0.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="ml-3">
                    <h3 className="font-semibold text-primary-900">免运费政策</h3>
                    <p className="text-primary-800 mt-1">订单金额满99元即可享受免运费服务（偏远地区除外）</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">运费计算规则</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>首重1kg，续重按0.5kg计算</li>
                  <li>大件商品（超过10kg）会额外收取费用</li>
                  <li>偏远地区可能收取额外运费</li>
                  <li>具体运费在结算时自动计算并显示</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Tracking */}
          <Card className="mb-8">
            <CardHeader className="border-b">
              <h2 className="text-2xl font-semibold text-gray-900">物流跟踪</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">如何查询物流信息</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-600 ml-4">
                  <li>登录您的账号</li>
                  <li>进入"个人中心" - "我的订单"</li>
                  <li>点击订单查看详情</li>
                  <li>查看物流跟踪信息</li>
                </ol>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">发货通知</h3>
                <p className="text-gray-600">
                  订单发货后，我们会通过短信和邮件通知您，并提供物流单号。您可以随时查询包裹的最新位置和预计送达时间。
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Signature */}
          <Card className="mb-8">
            <CardHeader className="border-b">
              <h2 className="text-2xl font-semibold text-gray-900">签收说明</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">签收要求</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>请在收到商品时当面验货</li>
                  <li>确认包装完好、商品无损后再签收</li>
                  <li>如发现包装破损或商品缺失，请拒收并联系客服</li>
                  <li>签收后如发现问题，请在24小时内联系客服</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">代收说明</h3>
                <p className="text-gray-600">
                  如本人无法签收，可由家人、朋友或门卫代收。代收人签收即视为本人签收，请确保代收人会及时转交并验货。
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Special Cases */}
          <Card className="mb-8">
            <CardHeader className="border-b">
              <h2 className="text-2xl font-semibold text-gray-900">特殊情况处理</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">配送延迟</h3>
                <p className="text-gray-600 mb-2">
                  如遇以下情况可能导致配送延迟：
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>自然灾害、恶劣天气等不可抗力因素</li>
                  <li>法定节假日</li>
                  <li>收货地址信息不准确或联系不上收件人</li>
                  <li>配送区域交通管制</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">无法配送</h3>
                <p className="text-gray-600">
                  部分特殊地区（如军事禁区、海岛等）可能无法配送。下单前请确认您的地址在配送范围内。
                  如订单无法配送，我们会及时联系您协商解决方案。
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">还有疑问？</h3>
              <p className="text-gray-600 mb-4">
                如有其他配送相关问题，请随时联系我们的客服团队
              </p>
              <div className="flex justify-center gap-4">
                <Link
                  href="/help"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  查看帮助中心
                </Link>
                <span className="text-gray-300">|</span>
                <Link
                  href="/contact"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  联系客服
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
