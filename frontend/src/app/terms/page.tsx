import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">服务条款</h1>
            <p className="text-xl text-primary-100">
              使用本平台服务前，请仔细阅读本协议
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
              <h2 className="text-2xl font-semibold text-gray-900">协议的接受</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-gray-600">
                欢迎使用 TradeCraft 跨境电商平台（以下简称"本平台"、"我们"或"TradeCraft"）。
                本服务条款（以下简称"本协议"）是您（以下简称"用户"或"您"）
                与 TradeCraft 之间关于使用本平台服务所订立的协议。
              </p>
              <p className="text-gray-600">
                在使用本平台提供的各项服务之前，请您务必仔细阅读并充分理解本协议，
                特别是免除或者限制责任的条款、法律适用和争议解决条款。
                如果您不同意本协议的任何内容，或者无法准确理解我们对条款的解释，
                请不要进行后续操作。
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-900 font-medium">
                  您点击"同意"或"下一步"，或您使用本平台服务，
                  即表示您已阅读、理解并同意受本协议的约束。
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Account Registration */}
          <Card className="mb-8">
            <CardHeader className="border-b">
              <h2 className="text-2xl font-semibold text-gray-900">账号注册与使用</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">1. 注册资格</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>您必须年满18周岁（或您所在地法律规定的成年年龄）</li>
                  <li>未成年人使用本服务需经其监护人同意</li>
                  <li>您必须具有完全民事行为能力</li>
                  <li>您的注册信息必须真实、准确、完整</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">2. 账号安全</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>您应妥善保管账号和密码，对账号下的所有活动负责</li>
                  <li>不得将账号出借、转让或分享给他人使用</li>
                  <li>如发现账号被盗用，应立即通知我们</li>
                  <li>因您保管不善导致的损失由您自行承担</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">3. 账号注销</h3>
                <p className="text-gray-600">
                  您可以随时申请注销账号。注销后，您的个人信息将被删除，
                  但已完成的交易记录将保留用于法律合规和财务管理。
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Service Usage */}
          <Card className="mb-8">
            <CardHeader className="border-b">
              <h2 className="text-2xl font-semibold text-gray-900">服务使用规范</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">允许的使用</h3>
                <p className="text-gray-600 mb-2">
                  您可以使用本平台服务进行以下活动：
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>浏览和购买商品</li>
                  <li>管理订单和地址</li>
                  <li>参与促销活动</li>
                  <li>发布商品评价</li>
                  <li>联系客服获取帮助</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">禁止的行为</h3>
                <p className="text-gray-600 mb-2">
                  您不得利用本平台服务从事以下活动：
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>发布虚假信息、恶意评价或误导性内容</li>
                  <li>侵犯他人知识产权、商业秘密或其他权利</li>
                  <li>传播病毒、恶意代码或其他破坏性程序</li>
                  <li>使用爬虫、机器人等自动化工具抓取数据</li>
                  <li>恶意注册账号或刷单、刷评价</li>
                  <li>干扰或破坏平台正常运营</li>
                  <li>进行任何违法犯罪活动</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">违规处理</h3>
                <p className="text-gray-600">
                  如您违反上述规定，我们有权采取以下措施：
                  警告、限制功能、暂停服务、终止服务、删除违规内容、
                  追究法律责任等。
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Trading Rules */}
          <Card className="mb-8">
            <CardHeader className="border-b">
              <h2 className="text-2xl font-semibold text-gray-900">交易规则</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">1. 商品信息</h3>
                <p className="text-gray-600">
                  商品信息由卖家提供，我们会尽力确保信息的准确性，
                  但不保证商品描述或其他内容的绝对准确。
                  如实际商品与描述不符，您可以申请退换货。
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">2. 订单确认</h3>
                <p className="text-gray-600">
                  您下单并支付后，订单才正式生效。
                  我们有权在发现订单异常（如价格错误、库存不足）时取消订单并退款。
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">3. 价格和支付</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>所有价格均以人民币标注，包含增值税</li>
                  <li>支付时可能产生的手续费由相关方承担</li>
                  <li>我们保留随时调整商品价格的权利</li>
                  <li>促销活动以活动规则为准</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">4. 配送</h3>
                <p className="text-gray-600">
                  我们会按照订单信息安排配送，但配送时间仅供参考，
                  可能因天气、交通等原因延迟。详见《配送政策》。
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">5. 退换货</h3>
                <p className="text-gray-600">
                  符合条件的商品可在7天内申请退换货，具体规则详见《退换货政策》。
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card className="mb-8">
            <CardHeader className="border-b">
              <h2 className="text-2xl font-semibold text-gray-900">知识产权</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">平台内容</h3>
                <p className="text-gray-600">
                  本平台上的所有内容（包括但不限于文字、图片、音频、视频、
                  软件、程序、版面设计等）的知识产权归 TradeCraft 或相关权利人所有。
                  未经授权，您不得复制、传播、修改或用于商业用途。
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">用户内容</h3>
                <p className="text-gray-600">
                  您在平台上发布的内容（如评价、问答等）的知识产权归您所有，
                  但您授予我们免费的、非独占的、全球范围内的使用许可，
                  用于展示、传播和推广。
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card className="mb-8">
            <CardHeader className="border-b">
              <h2 className="text-2xl font-semibold text-gray-900">隐私保护</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-gray-600">
                我们重视您的隐私保护。关于我们如何收集、使用和保护您的个人信息，
                请查阅我们的<Link href="/privacy" className="text-primary-600 hover:text-primary-700 font-medium">《隐私政策》</Link>。
              </p>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Card className="mb-8">
            <CardHeader className="border-b">
              <h2 className="text-2xl font-semibold text-gray-900">免责声明</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-gray-600 mb-2">
                在法律允许的最大范围内，我们不对以下情况承担责任：
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                <li>因不可抗力（如自然灾害、战争、政府行为等）导致的服务中断</li>
                <li>因您的设备、网络等原因导致的问题</li>
                <li>第三方（如物流公司、支付机构）的行为或服务</li>
                <li>您违反本协议导致的任何损失</li>
                <li>由于技术故障或系统维护导致的短暂服务中断</li>
              </ul>
              <p className="text-gray-600 mt-4">
                对于因使用本服务产生的任何间接、附带、特殊或惩罚性损害，
                我们不承担责任。
              </p>
            </CardContent>
          </Card>

          {/* Liability */}
          <Card className="mb-8">
            <CardHeader className="border-b">
              <h2 className="text-2xl font-semibold text-gray-900">责任限制</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-gray-600">
                在任何情况下，我们对您的赔偿责任不超过您在产生责任的事件发生前12个月内
                向我们支付的服务费用总额。
              </p>
            </CardContent>
          </Card>

          {/* Term Modification */}
          <Card className="mb-8">
            <CardHeader className="border-b">
              <h2 className="text-2xl font-semibold text-gray-900">协议修改</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-gray-600">
                我们有权随时修改本协议。修改后的协议将在平台上公布，
                并在公布后立即生效。如果您不同意修改内容，
                应立即停止使用本服务。您继续使用本服务即表示接受修改后的协议。
              </p>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card className="mb-8">
            <CardHeader className="border-b">
              <h2 className="text-2xl font-semibold text-gray-900">服务终止</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">用户终止</h3>
                <p className="text-gray-600">
                  您可以随时停止使用本服务或注销账号。
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">平台终止</h3>
                <p className="text-gray-600 mb-2">
                  在以下情况下，我们有权终止向您提供服务：
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>您违反本协议或法律法规</li>
                  <li>您的行为给我们或其他用户造成损害</li>
                  <li>我们因业务调整需要终止服务</li>
                  <li>其他合理原因</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Law */}
          <Card className="mb-8">
            <CardHeader className="border-b">
              <h2 className="text-2xl font-semibold text-gray-900">法律适用与争议解决</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">适用法律</h3>
                <p className="text-gray-600">
                  本协议的订立、执行和解释及争议的解决均应适用中华人民共和国法律。
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">争议解决</h3>
                <p className="text-gray-600">
                  因本协议产生的任何争议，双方应友好协商解决。
                  协商不成的，任何一方均可向 TradeCraft 所在地有管辖权的人民法院提起诉讼。
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Other */}
          <Card className="mb-8">
            <CardHeader className="border-b">
              <h2 className="text-2xl font-semibold text-gray-900">其他条款</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">可分割性</h3>
                <p className="text-gray-600">
                  如本协议的任何条款被认定为无效或不可执行，
                  该条款应被解释为尽可能使其可执行，其余条款仍然有效。
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">完整协议</h3>
                <p className="text-gray-600">
                  本协议构成您与 TradeCraft 之间关于使用本服务的完整协议，
                  取代此前的任何口头或书面协议。
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">语言</h3>
                <p className="text-gray-600">
                  本协议以中文撰写。如有其他语言版本，以中文版本为准。
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader className="border-b">
              <h2 className="text-2xl font-semibold text-gray-900">联系我们</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-gray-600">
                如果您对本服务条款有任何疑问，请通过以下方式联系我们：
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="space-y-2 text-gray-600">
                  <li>客服电话：400-888-8888</li>
                  <li>客服邮箱：legal@tradecraft.com</li>
                  <li>在线客服：<Link href="/contact" className="text-primary-600 hover:text-primary-700">联系我们</Link></li>
                  <li>公司地址：中国上海市浦东新区世纪大道1000号环球金融中心20楼</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
