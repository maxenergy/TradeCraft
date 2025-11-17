import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">退换货政策</h1>
            <p className="text-xl text-primary-100">
              我们致力于为您提供无忧的退换货服务
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Return Policy Overview */}
          <Card className="mb-8">
            <CardHeader className="border-b">
              <h2 className="text-2xl font-semibold text-gray-900">退换货政策概览</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-green-600 mt-0.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="ml-3">
                    <h3 className="font-semibold text-green-900">7天无理由退货</h3>
                    <p className="text-green-800 mt-1">
                      自收货之日起7天内，商品未使用且不影响二次销售的情况下，可申请无理由退货
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-gray-600">
                我们承诺为您提供便捷的退换货服务。为了保障您的权益，请在申请退换货前仔细阅读以下条款。
              </p>
            </CardContent>
          </Card>

          {/* Return Conditions */}
          <Card className="mb-8">
            <CardHeader className="border-b">
              <h2 className="text-2xl font-semibold text-gray-900">退货条件</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">可以退货的情况</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>商品存在质量问题</li>
                  <li>收到的商品与描述不符</li>
                  <li>商品在运输过程中损坏</li>
                  <li>发错商品</li>
                  <li>商品在7天内且符合退货要求（无理由退货）</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">退货商品要求</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>商品保持原包装完整，未拆封或未使用</li>
                  <li>商品标签、吊牌等配件齐全</li>
                  <li>商品无人为损坏、污渍或异味</li>
                  <li>商品不影响二次销售</li>
                  <li>保留购买凭证</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">不支持退货的商品</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>定制商品、个性化商品</li>
                  <li>已激活的数字产品和软件</li>
                  <li>食品、保健品（除质量问题外）</li>
                  <li>贴身衣物、内衣等个人卫生用品</li>
                  <li>影音制品（已拆封）</li>
                  <li>特价商品、清仓商品（商品详情页有特别说明的）</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Return Process */}
          <Card className="mb-8">
            <CardHeader className="border-b">
              <h2 className="text-2xl font-semibold text-gray-900">退货流程</h2>
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
                    <h3 className="font-semibold text-gray-900 mb-2">提交退货申请</h3>
                    <p className="text-gray-600">
                      登录账号，进入"我的订单"，选择需要退货的订单，点击"申请售后"，
                      填写退货原因并上传相关图片（如有质量问题）。
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
                    <h3 className="font-semibold text-gray-900 mb-2">等待审核</h3>
                    <p className="text-gray-600">
                      我们会在1-2个工作日内审核您的退货申请。审核通过后，系统会生成退货单并提供退货地址。
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
                    <h3 className="font-semibold text-gray-900 mb-2">寄回商品</h3>
                    <p className="text-gray-600">
                      请将商品按原包装寄回指定地址。建议使用可追踪的快递服务，并保留快递单据。
                      如是质量问题，我们承担运费；个人原因退货需自付运费。
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
                    <h3 className="font-semibold text-gray-900 mb-2">验收商品</h3>
                    <p className="text-gray-600">
                      我们收到商品后，会在2-3个工作日内完成验收。验收合格后将进入退款流程。
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
                    <h3 className="font-semibold text-gray-900 mb-2">退款到账</h3>
                    <p className="text-gray-600">
                      退款将原路返回到您的支付账户。不同支付方式到账时间不同：
                      支付宝/微信1-3个工作日，银行卡3-7个工作日。
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exchange Policy */}
          <Card className="mb-8">
            <CardHeader className="border-b">
              <h2 className="text-2xl font-semibold text-gray-900">换货政策</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">换货条件</h3>
                <p className="text-gray-600 mb-2">
                  以下情况可以申请换货：
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>商品存在质量问题</li>
                  <li>收到的商品规格、颜色等与订单不符</li>
                  <li>商品在运输过程中损坏</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">换货流程</h3>
                <p className="text-gray-600">
                  换货流程与退货流程基本相同。申请时选择"换货"并说明需要更换的商品规格。
                  我们会优先为您安排换货，如无库存则为您办理退款。
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-yellow-600 mt-0.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div className="ml-3">
                    <h3 className="font-semibold text-yellow-900">注意事项</h3>
                    <p className="text-yellow-800 mt-1">
                      个人原因换货（如尺寸不合适、不喜欢等）需自付双程运费
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Costs */}
          <Card className="mb-8">
            <CardHeader className="border-b">
              <h2 className="text-2xl font-semibold text-gray-900">运费承担</h2>
            </CardHeader>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">退换货原因</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">运费承担方</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 text-gray-900">商品质量问题</td>
                      <td className="px-6 py-4 text-gray-600">商家承担</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-gray-900">发错商品</td>
                      <td className="px-6 py-4 text-gray-600">商家承担</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-gray-900">运输损坏</td>
                      <td className="px-6 py-4 text-gray-600">商家承担</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-gray-900">个人原因退货</td>
                      <td className="px-6 py-4 text-gray-600">买家承担</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-gray-900">个人原因换货</td>
                      <td className="px-6 py-4 text-gray-600">买家承担（双程）</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Refund Policy */}
          <Card className="mb-8">
            <CardHeader className="border-b">
              <h2 className="text-2xl font-semibold text-gray-900">退款说明</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">退款方式</h3>
                <p className="text-gray-600">
                  退款将原路返回到您的支付账户。我们不支持退款到其他账户。
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">退款时间</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>支付宝：1-3个工作日</li>
                  <li>微信支付：1-3个工作日</li>
                  <li>银行卡支付：3-7个工作日</li>
                  <li>信用卡支付：7-15个工作日</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">退款金额</h3>
                <p className="text-gray-600 mb-2">
                  退款金额 = 商品金额 - 运费（如需买家承担）
                </p>
                <p className="text-sm text-gray-500">
                  * 如订单使用了优惠券或积分，退款时会按比例扣除相应优惠金额
                </p>
              </div>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card className="mb-8">
            <CardHeader className="border-b">
              <h2 className="text-2xl font-semibold text-gray-900">常见问题</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Q: 7天是从什么时候开始计算？</h3>
                <p className="text-gray-600">
                  A: 从您签收商品的次日开始计算，第7天24:00截止。例如1月1日签收，可在1月8日24:00前申请退货。
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Q: 退货后什么时候能收到退款？</h3>
                <p className="text-gray-600">
                  A: 我们收到退货商品并验收合格后，会在3-5个工作日内处理退款。
                  退款到账时间因支付方式不同而异，最快1-3个工作日到账。
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Q: 可以部分退货吗？</h3>
                <p className="text-gray-600">
                  A: 可以。如果一个订单中有多件商品，您可以选择部分商品申请退货。
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Q: 退货申请被拒绝了怎么办？</h3>
                <p className="text-gray-600">
                  A: 如果退货申请被拒绝，系统会说明原因。您可以根据说明修改后重新提交，或联系客服协助处理。
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">需要帮助？</h3>
              <p className="text-gray-600 mb-4">
                如有任何退换货相关问题，请随时联系我们的客服团队
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
