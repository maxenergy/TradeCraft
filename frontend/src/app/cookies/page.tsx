import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Cookie 政策</h1>
            <p className="text-xl text-primary-100">
              了解我们如何使用 Cookie 及类似技术
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
          {/* What are Cookies */}
          <Card className="mb-8">
            <CardHeader className="border-b">
              <h2 className="text-2xl font-semibold text-gray-900">什么是 Cookie？</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-gray-600">
                Cookie 是一种小型文本文件，当您访问网站时会被存储在您的设备（电脑、手机或平板）上。
                Cookie 被广泛用于让网站正常运行，或者更高效地运行，以及向网站所有者提供信息。
              </p>
              <p className="text-gray-600">
                Cookie 通常包含网站名称、Cookie 的"生命周期"（即 Cookie 在您设备上保留的时间），
                以及一个随机生成的唯一编号或类似标识符。
              </p>
            </CardContent>
          </Card>

          {/* Why We Use Cookies */}
          <Card className="mb-8">
            <CardHeader className="border-b">
              <h2 className="text-2xl font-semibold text-gray-900">我们为什么使用 Cookie？</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-gray-600 mb-2">
                我们使用 Cookie 来改善您的购物体验，包括：
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                <li>记住您的登录状态，无需每次访问都重新登录</li>
                <li>保存您的购物车内容</li>
                <li>记住您的偏好设置（如语言、货币）</li>
                <li>了解您如何使用我们的服务，以便改进</li>
                <li>为您提供个性化的商品推荐</li>
                <li>分析网站流量和用户行为</li>
                <li>投放相关的广告</li>
              </ul>
            </CardContent>
          </Card>

          {/* Types of Cookies */}
          <Card className="mb-8">
            <CardHeader className="border-b">
              <h2 className="text-2xl font-semibold text-gray-900">我们使用的 Cookie 类型</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">1. 必需 Cookie</h3>
                <p className="text-gray-600 mb-2">
                  这些 Cookie 对于网站的基本功能是必需的，例如：
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>使您能够登录安全区域</li>
                  <li>记住您添加到购物车的商品</li>
                  <li>在结账过程中记住您的信息</li>
                </ul>
                <p className="text-gray-600 mt-2 text-sm italic">
                  这些 Cookie 无法被禁用，否则网站将无法正常工作。
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">2. 功能性 Cookie</h3>
                <p className="text-gray-600 mb-2">
                  这些 Cookie 用于提供增强的功能和个性化，例如：
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>记住您的偏好设置（语言、地区、货币）</li>
                  <li>记住您的用户名</li>
                  <li>提供聊天服务</li>
                </ul>
                <p className="text-gray-600 mt-2 text-sm italic">
                  如果您不允许这些 Cookie，某些功能可能无法正常使用。
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">3. 分析和性能 Cookie</h3>
                <p className="text-gray-600 mb-2">
                  这些 Cookie 帮助我们了解访问者如何使用网站，例如：
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>哪些页面最受欢迎</li>
                  <li>用户在网站上花费的时间</li>
                  <li>用户访问路径</li>
                  <li>是否有错误消息</li>
                </ul>
                <p className="text-gray-600 mt-2 text-sm">
                  我们使用以下工具：
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4 text-sm">
                  <li>Google Analytics</li>
                  <li>百度统计</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">4. 广告和营销 Cookie</h3>
                <p className="text-gray-600 mb-2">
                  这些 Cookie 用于：
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>限制广告显示次数</li>
                  <li>衡量广告活动的效果</li>
                  <li>根据您的兴趣提供相关广告</li>
                  <li>在其他网站上显示我们的广告（重定向）</li>
                </ul>
                <p className="text-gray-600 mt-2 text-sm italic">
                  这些 Cookie 可能由我们的广告合作伙伴设置。
                </p>
              </div>
            </CardContent>
          </Card>

          {/* First-Party vs Third-Party */}
          <Card className="mb-8">
            <CardHeader className="border-b">
              <h2 className="text-2xl font-semibold text-gray-900">第一方和第三方 Cookie</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">第一方 Cookie</h3>
                <p className="text-gray-600">
                  这些 Cookie 由 TradeCraft 直接设置，用于网站的基本功能和改进服务质量。
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">第三方 Cookie</h3>
                <p className="text-gray-600 mb-2">
                  这些 Cookie 由我们的合作伙伴设置，包括：
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>分析服务提供商（如 Google Analytics）</li>
                  <li>广告网络</li>
                  <li>社交媒体平台</li>
                  <li>支付服务提供商</li>
                </ul>
                <p className="text-gray-600 mt-2">
                  这些第三方可能将 Cookie 信息用于其自身目的。
                  我们建议您查阅这些第三方的隐私政策了解详情。
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Cookie Duration */}
          <Card className="mb-8">
            <CardHeader className="border-b">
              <h2 className="text-2xl font-semibold text-gray-900">Cookie 的有效期</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">会话 Cookie</h3>
                <p className="text-gray-600">
                  临时 Cookie，在您关闭浏览器时自动删除。主要用于记住您在浏览期间的操作。
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">持久性 Cookie</h3>
                <p className="text-gray-600">
                  在设定的时间后过期（从几天到几年不等），或者在您手动删除时失效。
                  用于记住登录状态、偏好设置等。
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Managing Cookies */}
          <Card className="mb-8">
            <CardHeader className="border-b">
              <h2 className="text-2xl font-semibold text-gray-900">如何管理 Cookie？</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">浏览器设置</h3>
                <p className="text-gray-600 mb-2">
                  大多数浏览器允许您通过设置来管理 Cookie：
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>查看已设置的 Cookie</li>
                  <li>删除所有或特定 Cookie</li>
                  <li>阻止第三方 Cookie</li>
                  <li>完全禁用 Cookie</li>
                  <li>在关闭浏览器时删除 Cookie</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">常见浏览器的 Cookie 设置</h3>
                <div className="space-y-2 text-gray-600">
                  <p><strong>Chrome：</strong>设置 → 隐私和安全 → Cookie 及其他网站数据</p>
                  <p><strong>Firefox：</strong>选项 → 隐私与安全 → Cookie 和网站数据</p>
                  <p><strong>Safari：</strong>偏好设置 → 隐私 → Cookie 和网站数据</p>
                  <p><strong>Edge：</strong>设置 → Cookie 和站点权限 → Cookie 和站点数据</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">禁用 Cookie 的影响</h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-900">
                    <strong>请注意：</strong>如果您禁用或删除 Cookie，
                    可能会影响网站的某些功能，例如无法登录、购物车为空、
                    偏好设置丢失等。我们建议您仅禁用非必需的 Cookie。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Other Technologies */}
          <Card className="mb-8">
            <CardHeader className="border-b">
              <h2 className="text-2xl font-semibold text-gray-900">其他类似技术</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-gray-600 mb-2">
                除了 Cookie，我们还可能使用以下类似技术：
              </p>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Web Beacons（网络信标）</h3>
                <p className="text-gray-600">
                  微小的图形图像，用于跟踪用户行为和收集分析数据。
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Local Storage（本地存储）</h3>
                <p className="text-gray-600">
                  HTML5 技术，可在您的设备上存储少量数据，用于改善性能和用户体验。
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Session Storage（会话存储）</h3>
                <p className="text-gray-600">
                  类似于 Local Storage，但在浏览器关闭时自动清除。
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Updates */}
          <Card className="mb-8">
            <CardHeader className="border-b">
              <h2 className="text-2xl font-semibold text-gray-900">政策更新</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-gray-600">
                我们可能会不时更新本 Cookie 政策，以反映我们使用 Cookie 的变化。
                我们建议您定期查看本页面以了解最新信息。
                重大变更将通过网站公告或电子邮件通知您。
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader className="border-b">
              <h2 className="text-2xl font-semibold text-gray-900">联系我们</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-gray-600">
                如果您对本 Cookie 政策有任何疑问，请通过以下方式联系我们：
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="space-y-2 text-gray-600">
                  <li>客服电话：400-888-8888</li>
                  <li>客服邮箱：privacy@tradecraft.com</li>
                  <li>在线客服：<Link href="/contact" className="text-primary-600 hover:text-primary-700">联系我们</Link></li>
                </ul>
              </div>
              <p className="text-gray-600 mt-4">
                相关政策：
                <Link href="/privacy" className="text-primary-600 hover:text-primary-700 mx-2">隐私政策</Link>
                |
                <Link href="/terms" className="text-primary-600 hover:text-primary-700 mx-2">服务条款</Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
