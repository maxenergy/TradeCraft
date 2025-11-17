import React from 'react';
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
              了解我们的配送方式、时间和费用
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
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="border-b pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">标准配送</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">配送时效</p>
                      <p className="font-medium text-gray-900">3-5个工作日</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">运费</p>
                      <p className="font-medium text-gray-900">订单满¥99免运费，不满¥99收取¥10运费</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    适用于大部分地区，由我们的合作快递公司配送。
                  </p>
                </div>

                <div className="border-b pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">次日达</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">配送时效</p>
                      <p className="font-medium text-gray-900">次日送达</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">运费</p>
                      <p className="font-medium text-gray-900">订单满¥199免运费，不满¥199收取¥15运费</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    仅限指定城市，当日下午16:00前下单，次日送达。
                  </p>
                </div>

                <div className="border-b pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">定时配送</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">配送时效</p>
                      <p className="font-medium text-gray-900">按您选择的时间配送</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">运费</p>
                      <p className="font-medium text-gray-900">额外收取¥5服务费</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    可选择指定时间段配送，需提前预约。仅限部分城市。
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">门店自提</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">取货时效</p>
                      <p className="font-medium text-gray-900">下单后2小时可取</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">运费</p>
                      <p className="font-medium text-green-600">免运费</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    选择离您最近的门店，下单后到店取货。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Coverage */}
          <Card className="mb-8">
            <CardHeader className="border-b">
              <h2 className="text-2xl font-semibold text-gray-900">配送范围</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">国内配送</h3>
                <p className="text-gray-600">
                  覆盖全国31个省市自治区，包括偏远地区。部分偏远地区配送时间可能延长1-2天。
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">不配送地区</h3>
                <p className="text-gray-600">
                  暂不支持港澳台地区配送。海外配送服务即将开通，敬请期待。
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-blue-600 mt-0.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="ml-3">
                    <h3 className="font-semibold text-blue-900">温馨提示</h3>
                    <p className="text-blue-800 mt-1">
                      节假日期间配送时间可能会有延迟，具体以实际配送时间为准。
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Fees */}
          <Card className="mb-8">
            <CardHeader className="border-b">
              <h2 className="text-2xl font-semibold text-gray-900">运费说明</h2>
            </CardHeader>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">订单金额</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">标准配送</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">次日达</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 text-gray-900">¥99以上</td>
                      <td className="px-6 py-4 text-green-600 font-medium">免运费</td>
                      <td className="px-6 py-4 text-gray-600">订单满¥199免运费</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-gray-900">¥99以下</td>
                      <td className="px-6 py-4 text-gray-600">¥10</td>
                      <td className="px-6 py-4 text-gray-600">¥15</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 space-y-3 text-sm text-gray-600">
                <p>• 大件商品（如家具、家电）可能需要额外收取运费，详见商品页面说明</p>
                <p>• 偏远地区可能收取额外运费，下单时系统会自动计算</p>
                <p>• VIP会员享受更多免运费优惠，详见会员权益</p>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Process */}
          <Card className="mb-8">
            <CardHeader className="border-b">
              <h2 className="text-2xl font-semibold text-gray-900">配送流程</h2>
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
                    <h3 className="font-semibold text-gray-900 mb-2">订单确认</h3>
                    <p className="text-gray-600">
                      您下单并完成支付后，我们会立即确认订单并开始处理。
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
                    <h3 className="font-semibold text-gray-900 mb-2">商品出库</h3>
                    <p className="text-gray-600">
                      仓库工作人员会尽快拣货、包装并发出商品。
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
                    <h3 className="font-semibold text-gray-900 mb-2">物流配送</h3>
                    <p className="text-gray-600">
                      商品交由快递公司配送，您可以通过运单号实时跟踪物流信息。
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
                    <h3 className="font-semibold text-gray-900 mb-2">签收商品</h3>
                    <p className="text-gray-600">
                      快递送达后，请您当面验货并签收。如有问题，请及时联系我们。
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tracking */}
          <Card className="mb-8">
            <CardHeader className="border-b">
              <h2 className="text-2xl font-semibold text-gray-900">物流跟踪</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-gray-600">
                订单发货后，我们会通过短信和邮件通知您运单号。您可以通过以下方式查询物流信息：
              </p>

              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                <li>登录"我的订单"查看物流详情</li>
                <li>使用订单号或运单号在"订单追踪"页面查询</li>
                <li>直接访问快递公司官网查询</li>
                <li>联系在线客服查询</li>
              </ul>

              <div className="bg-gray-100 rounded-lg p-4 mt-4">
                <p className="text-sm text-gray-700">
                  <strong>注意：</strong>物流信息可能存在1-2小时延迟，请耐心等待更新。
                </p>
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
                <h3 className="font-semibold text-gray-900 mb-2">Q: 什么时候发货？</h3>
                <p className="text-gray-600">
                  A: 大部分商品会在支付成功后24小时内发货。部分预售商品或定制商品需要更长时间，具体以商品详情页说明为准。
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Q: 可以指定配送时间吗？</h3>
                <p className="text-gray-600">
                  A: 部分地区支持定时配送服务。下单时选择"定时配送"并选择您方便的时间段即可。
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Q: 配送过程中商品损坏怎么办？</h3>
                <p className="text-gray-600">
                  A: 如果商品在配送过程中损坏，请拒收并联系我们的客服。我们会为您重新发货或退款。
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Q: 可以修改配送地址吗？</h3>
                <p className="text-gray-600">
                  A: 订单未发货前可以修改配送地址。订单已发货后，请联系客服尝试修改，但无法保证一定能修改成功。
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
