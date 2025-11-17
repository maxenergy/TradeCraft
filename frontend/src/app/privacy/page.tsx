import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">隐私政策</h1>
            <p className="text-xl text-primary-100">
              我们重视并保护您的个人信息
            </p>
            <p className="text-sm text-primary-200 mt-4">
              最后更新时间：2024年1月15日
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Introduction */}
          <Card className="mb-8">
            <CardHeader className="border-b">
              <h2 className="text-2xl font-semibold text-gray-900">引言</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-gray-600">
                欢迎使用 TradeCraft 跨境电商平台（以下简称"本平台"或"我们"）。
                我们深知个人信息对您的重要性，并会尽全力保护您的个人信息安全可靠。
                我们致力于维持您对我们的信任，恪守以下原则，保护您的个人信息：
                权责一致原则、目的明确原则、选择同意原则、最少够用原则、确保安全原则、
                主体参与原则、公开透明原则等。
              </p>
              <p className="text-gray-600">
                本隐私政策适用于您通过任何方式对本平台服务的访问和使用。
                请在使用我们的服务前，仔细阅读并了解本《隐私政策》。
              </p>
            </CardContent>
          </Card>

          {/* Information Collection */}
          <Card className="mb-8">
            <CardHeader className="border-b">
              <h2 className="text-2xl font-semibold text-gray-900">我们如何收集和使用您的个人信息</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">1. 账号注册和登录</h3>
                <p className="text-gray-600 mb-2">
                  当您注册账号时，我们会收集以下信息：
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>必需信息：电子邮箱、手机号码、密码</li>
                  <li>选填信息：昵称、头像、性别、出生日期</li>
                </ul>
                <p className="text-gray-600 mt-2">
                  我们使用这些信息来创建和管理您的账号，为您提供个性化服务。
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">2. 商品浏览和搜索</h3>
                <p className="text-gray-600 mb-2">
                  当您浏览商品时，我们会收集：
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>浏览记录、搜索关键词</li>
                  <li>商品收藏、加购记录</li>
                  <li>设备信息（设备型号、操作系统版本、浏览器类型）</li>
                  <li>网络信息（IP地址、网络类型）</li>
                </ul>
                <p className="text-gray-600 mt-2">
                  这些信息帮助我们为您推荐感兴趣的商品，改善用户体验。
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">3. 订单和交易</h3>
                <p className="text-gray-600 mb-2">
                  当您下单购物时，我们会收集：
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>收货人信息：姓名、电话、收货地址</li>
                  <li>订单信息：商品详情、订单金额、下单时间</li>
                  <li>支付信息：支付方式、交易流水号（不包括银行卡密码）</li>
                  <li>发票信息：发票抬头、税号等</li>
                </ul>
                <p className="text-gray-600 mt-2">
                  这些信息用于完成订单处理、配送、售后服务等。
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">4. 客服和售后</h3>
                <p className="text-gray-600 mb-2">
                  当您联系客服或申请售后时，我们可能收集：
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>沟通记录（聊天记录、通话录音）</li>
                  <li>售后申请信息（退换货原因、商品照片等）</li>
                </ul>
                <p className="text-gray-600 mt-2">
                  这些信息用于处理您的问题和改善服务质量。
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">5. 营销活动</h3>
                <p className="text-gray-600 mb-2">
                  当您参与营销活动时，我们可能收集您提供的信息，用于：
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>验证您的身份和参与资格</li>
                  <li>发放奖品或优惠券</li>
                  <li>开展营销分析</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Information Sharing */}
          <Card className="mb-8">
            <CardHeader className="border-b">
              <h2 className="text-2xl font-semibold text-gray-900">我们如何共享、转让、公开披露您的个人信息</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">共享</h3>
                <p className="text-gray-600 mb-2">
                  我们不会与任何公司、组织和个人共享您的个人信息，但以下情况除外：
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>获得您的明确同意或授权</li>
                  <li>与关联公司共享：仅为实现本政策中声明的目的</li>
                  <li>与授权合作伙伴共享：如物流公司、支付机构等，仅为完成服务</li>
                  <li>根据法律法规规定，或按政府主管部门的强制性要求</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">转让</h3>
                <p className="text-gray-600">
                  我们不会将您的个人信息转让给任何公司、组织和个人，但以下情况除外：
                  获得您的明确同意；在涉及合并、收购或破产清算时，
                  如涉及到个人信息转让，我们会要求新的持有您个人信息的公司、
                  组织继续受本隐私政策的约束。
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">公开披露</h3>
                <p className="text-gray-600 mb-2">
                  我们仅会在以下情况下，公开披露您的个人信息：
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>获得您明确同意</li>
                  <li>基于法律的披露：在法律、法律程序、诉讼或政府主管部门强制性要求的情况下</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Information Storage */}
          <Card className="mb-8">
            <CardHeader className="border-b">
              <h2 className="text-2xl font-semibold text-gray-900">我们如何保存和保护您的个人信息</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">保存期限</h3>
                <p className="text-gray-600">
                  我们仅在为提供服务之目的所必需的期间内保留您的个人信息。
                  超出必要期限后，我们将对您的个人信息进行删除或匿名化处理。
                  但法律法规另有规定的除外。
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">保存地域</h3>
                <p className="text-gray-600">
                  您的个人信息均存储于中华人民共和国境内。
                  如需跨境传输，我们将会单独征得您的授权同意。
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">安全措施</h3>
                <p className="text-gray-600 mb-2">
                  我们采取以下措施保护您的个人信息安全：
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>数据加密：使用SSL/TLS加密技术传输敏感信息</li>
                  <li>访问控制：严格限制访问信息的人员范围</li>
                  <li>安全审计：定期进行安全评估和审计</li>
                  <li>应急预案：制定个人信息安全事件应急预案</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* User Rights */}
          <Card className="mb-8">
            <CardHeader className="border-b">
              <h2 className="text-2xl font-semibold text-gray-900">您的权利</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-gray-600 mb-2">
                按照中国相关的法律法规，您对自己的个人信息享有以下权利：
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                <li>访问权：您有权访问您的个人信息，法律法规规定的例外情况除外</li>
                <li>更正权：您有权要求我们更正或补充您的信息</li>
                <li>删除权：在以下情形中，您可以向我们提出删除个人信息的请求：
                  <ul className="list-circle list-inside ml-6 mt-2">
                    <li>如果我们处理个人信息的行为违反法律法规</li>
                    <li>如果我们收集、使用您的个人信息，却未征得您的同意</li>
                    <li>如果我们处理个人信息的行为违反了与您的约定</li>
                  </ul>
                </li>
                <li>撤回同意：您可以通过删除信息、关闭设备功能等方式改变您授权我们继续收集个人信息的范围或撤回您的授权</li>
                <li>注销账户：您可以在个人中心申请注销账户</li>
              </ul>
            </CardContent>
          </Card>

          {/* Children Privacy */}
          <Card className="mb-8">
            <CardHeader className="border-b">
              <h2 className="text-2xl font-semibold text-gray-900">未成年人保护</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-gray-600">
                我们非常重视对未成年人个人信息的保护。
                若您是18周岁以下的未成年人，在使用我们的服务前，
                应事先取得您家长或法定监护人的书面同意。
                我们根据国家相关法律法规的规定保护未成年人的个人信息。
              </p>
              <p className="text-gray-600">
                对于经监护人同意而收集未成年人个人信息的情况，
                我们只会在受到法律允许、监护人明确同意或者保护未成年人所必要的情况下使用或公开披露此信息。
              </p>
            </CardContent>
          </Card>

          {/* Policy Updates */}
          <Card className="mb-8">
            <CardHeader className="border-b">
              <h2 className="text-2xl font-semibold text-gray-900">隐私政策的更新</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-gray-600">
                我们可能适时修订本政策的条款，该等修订构成本政策的一部分。
                如该等修订造成您在本政策下权利的实质减少，
                我们将在修订生效前通过在主页上显著位置提示或向您发送电子邮件或以其他方式通知您。
                在该种情况下，若您继续使用我们的服务，即表示同意受经修订的本政策的约束。
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader className="border-b">
              <h2 className="text-2xl font-semibold text-gray-900">如何联系我们</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-gray-600">
                如果您对本隐私政策有任何疑问、意见或建议，
                或您在使用我们的服务时遇到任何个人信息相关的问题，
                可以通过以下方式与我们联系：
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="space-y-2 text-gray-600">
                  <li>客服电话：400-888-8888</li>
                  <li>客服邮箱：privacy@tradecraft.com</li>
                  <li>在线客服：<Link href="/contact" className="text-primary-600 hover:text-primary-700">联系我们</Link></li>
                </ul>
              </div>
              <p className="text-gray-600 text-sm">
                一般情况下，我们将在15个工作日内回复。
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
