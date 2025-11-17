import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function PartnersPage() {
  const partnerCategories = [
    {
      title: '战略合作伙伴',
      description: '与我们建立长期战略合作关系的企业',
      partners: [
        { name: '阿里云', logo: '/images/partners/aliyun.png', description: '云计算服务提供商' },
        { name: '腾讯云', logo: '/images/partners/tencent-cloud.png', description: '云服务和技术支持' },
        { name: '华为云', logo: '/images/partners/huawei-cloud.png', description: '企业级云服务' },
        { name: '京东物流', logo: '/images/partners/jd-logistics.png', description: '物流配送服务' },
      ],
    },
    {
      title: '品牌合作伙伴',
      description: '入驻平台的优质品牌商',
      partners: [
        { name: '耐克', logo: '/images/partners/nike.png', description: '运动品牌' },
        { name: '阿迪达斯', logo: '/images/partners/adidas.png', description: '运动品牌' },
        { name: '苹果', logo: '/images/partners/apple.png', description: '科技品牌' },
        { name: '小米', logo: '/images/partners/xiaomi.png', description: '智能科技品牌' },
        { name: '华为', logo: '/images/partners/huawei.png', description: '科技品牌' },
        { name: 'OPPO', logo: '/images/partners/oppo.png', description: '智能手机品牌' },
      ],
    },
    {
      title: '支付合作伙伴',
      description: '为用户提供安全便捷的支付服务',
      partners: [
        { name: '支付宝', logo: '/images/partners/alipay.png', description: '第三方支付平台' },
        { name: '微信支付', logo: '/images/partners/wechat-pay.png', description: '移动支付服务' },
        { name: 'PayPal', logo: '/images/partners/paypal.png', description: '国际支付平台' },
        { name: '银联', logo: '/images/partners/unionpay.png', description: '银行卡支付服务' },
      ],
    },
    {
      title: '物流合作伙伴',
      description: '提供快速可靠的配送服务',
      partners: [
        { name: '顺丰速运', logo: '/images/partners/sf-express.png', description: '高端快递服务' },
        { name: '圆通速递', logo: '/images/partners/yto.png', description: '快递配送服务' },
        { name: '中通快递', logo: '/images/partners/zto.png', description: '快递物流服务' },
        { name: '韵达快递', logo: '/images/partners/yunda.png', description: '快递配送服务' },
      ],
    },
    {
      title: '技术合作伙伴',
      description: '提供技术支持和解决方案',
      partners: [
        { name: '微软', logo: '/images/partners/microsoft.png', description: '企业软件和云服务' },
        { name: 'AWS', logo: '/images/partners/aws.png', description: '云计算服务' },
        { name: 'MongoDB', logo: '/images/partners/mongodb.png', description: '数据库服务' },
        { name: 'Redis', logo: '/images/partners/redis.png', description: '缓存数据库' },
      ],
    },
  ];

  const cooperationTypes = [
    {
      title: '品牌入驻',
      description: '欢迎优质品牌入驻平台，共享用户资源',
      icon: (
        <svg className="w-8 h-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      link: '/merchant',
    },
    {
      title: '技术合作',
      description: '寻求技术合作伙伴，共同提升平台能力',
      icon: (
        <svg className="w-8 h-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      link: '/contact',
    },
    {
      title: '投资合作',
      description: '欢迎投资机构和战略投资者洽谈合作',
      icon: (
        <svg className="w-8 h-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      link: '/contact',
    },
    {
      title: '媒体合作',
      description: '欢迎媒体朋友进行报道和宣传合作',
      icon: (
        <svg className="w-8 h-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      link: '/contact',
    },
  ];

  const benefits = [
    {
      title: '流量支持',
      description: '平台流量倾斜，助力合作伙伴快速成长',
    },
    {
      title: '品牌曝光',
      description: '多渠道品牌推广，提升知名度和影响力',
    },
    {
      title: '技术赋能',
      description: '提供技术支持和解决方案，降低运营成本',
    },
    {
      title: '数据分析',
      description: '共享用户数据洞察，优化运营策略',
    },
    {
      title: '营销资源',
      description: '参与平台营销活动，获取更多曝光机会',
    },
    {
      title: '专属服务',
      description: '配备专属客户经理，提供一对一支持',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">合作伙伴</h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              携手共进，共创未来。感谢所有合作伙伴的信任与支持
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">合作方式</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cooperationTypes.map((type, index) => (
              <Link key={index} href={type.link}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                      {type.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{type.title}</h3>
                    <p className="text-gray-600">{type.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {partnerCategories.map((category, categoryIndex) => (
        <section key={categoryIndex} className={`py-16 ${categoryIndex % 2 === 0 ? '' : 'bg-white'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{category.title}</h2>
              <p className="text-gray-600">{category.description}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {category.partners.map((partner, partnerIndex) => (
                <Card key={partnerIndex} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="bg-gray-100 h-32 rounded-lg flex items-center justify-center mb-4">
                      <div className="text-center text-gray-500">
                        <svg className="w-16 h-16 mx-auto mb-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-xs">Logo</p>
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-center mb-1">{partner.name}</h3>
                    <p className="text-sm text-gray-600 text-center">{partner.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">合作伙伴权益</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.description}</p>
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
          <Card className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">期待与您合作</h2>
              <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
                如果您有意向与我们建立合作关系，欢迎联系我们的商务团队
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/merchant">
                  <Button size="lg" variant="outline" className="bg-white text-primary-600 hover:bg-gray-100">
                    品牌入驻
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600">
                    联系我们
                  </Button>
                </Link>
              </div>
              <div className="mt-6 text-primary-100">
                <p>商务合作邮箱：business@tradecraft.com</p>
                <p>商务合作热线：400-888-8888</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
