'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface JobPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
}

export default function CareersPage() {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  const departments = [
    { id: 'all', name: '全部职位' },
    { id: 'tech', name: '技术研发' },
    { id: 'product', name: '产品设计' },
    { id: 'operations', name: '运营' },
    { id: 'marketing', name: '市场营销' },
    { id: 'sales', name: '销售' },
    { id: 'support', name: '客户服务' },
  ];

  const positions: JobPosition[] = [
    {
      id: 'fe-1',
      title: '前端开发工程师',
      department: 'tech',
      location: '上海',
      type: '全职',
      experience: '3-5年',
      description: '负责公司电商平台前端开发，构建高性能、高可用的用户界面。',
      responsibilities: [
        '负责电商平台Web端和移动端的前端开发',
        '与产品、设计团队协作，实现产品功能和交互',
        '优化前端性能，提升用户体验',
        '参与前端技术选型和架构设计',
        '编写高质量、可维护的代码',
      ],
      requirements: [
        '本科及以上学历，计算机相关专业优先',
        '3年以上前端开发经验',
        '精通React/Vue等主流前端框架',
        '熟悉TypeScript、ES6+等现代JavaScript技术',
        '了解前端工程化、性能优化',
        '良好的团队协作和沟通能力',
      ],
    },
    {
      id: 'be-1',
      title: '后端开发工程师',
      department: 'tech',
      location: '上海',
      type: '全职',
      experience: '3-5年',
      description: '负责电商平台后端系统开发，设计和实现高性能、可扩展的服务架构。',
      responsibilities: [
        '负责电商平台后端服务的开发和维护',
        '设计和优化数据库结构',
        '开发RESTful API和微服务',
        '参与系统架构设计和技术选型',
        '解决系统性能瓶颈，提升系统稳定性',
      ],
      requirements: [
        '本科及以上学历，计算机相关专业',
        '3年以上后端开发经验',
        '精通Java/Python/Go等编程语言',
        '熟悉Spring Boot、Django等主流框架',
        '熟悉MySQL、Redis、MongoDB等数据库',
        '了解微服务架构和分布式系统',
      ],
    },
    {
      id: 'pm-1',
      title: '产品经理',
      department: 'product',
      location: '上海',
      type: '全职',
      experience: '3-5年',
      description: '负责电商平台产品规划和设计，推动产品迭代和优化。',
      responsibilities: [
        '负责电商平台产品功能规划和设计',
        '收集和分析用户需求，制定产品方案',
        '协调技术、设计、运营等团队，推动产品落地',
        '跟踪产品数据，持续优化产品体验',
        '研究行业动态和竞品，提出产品改进建议',
      ],
      requirements: [
        '本科及以上学历，3年以上产品经验',
        '有电商或互联网产品经验优先',
        '优秀的需求分析和产品设计能力',
        '熟练使用Axure、Figma等产品设计工具',
        '良好的沟通协调和项目管理能力',
        '数据驱动思维，关注用户体验',
      ],
    },
    {
      id: 'ui-1',
      title: 'UI/UX设计师',
      department: 'product',
      location: '上海',
      type: '全职',
      experience: '2-4年',
      description: '负责电商平台界面和交互设计，打造优质的用户体验。',
      responsibilities: [
        '负责电商平台Web端和移动端的UI设计',
        '进行用户研究，优化产品交互流程',
        '制作设计规范和组件库',
        '与产品、开发团队协作，跟进设计实现',
        '关注设计趋势，提升平台视觉体验',
      ],
      requirements: [
        '本科及以上学历，设计相关专业',
        '2年以上UI/UX设计经验',
        '精通Figma、Sketch等设计工具',
        '有电商或移动端设计经验优先',
        '良好的视觉设计和交互设计能力',
        '优秀的审美能力和创新思维',
      ],
    },
    {
      id: 'ops-1',
      title: '运营专员',
      department: 'operations',
      location: '上海',
      type: '全职',
      experience: '1-3年',
      description: '负责电商平台日常运营，提升用户活跃度和转化率。',
      responsibilities: [
        '负责电商平台的日常运营工作',
        '策划和执行营销活动，提升用户活跃度',
        '管理商品上架、促销、库存等',
        '分析运营数据，优化运营策略',
        '收集用户反馈，协助产品优化',
      ],
      requirements: [
        '本科及以上学历',
        '1年以上电商运营经验',
        '熟悉电商运营流程和常用工具',
        '数据分析能力强，善于发现问题',
        '执行力强，能承受一定工作压力',
        '良好的沟通和协调能力',
      ],
    },
    {
      id: 'mkt-1',
      title: '市场推广经理',
      department: 'marketing',
      location: '上海',
      type: '全职',
      experience: '3-5年',
      description: '负责品牌推广和用户增长，提升平台知名度和影响力。',
      responsibilities: [
        '制定和执行市场推广策略',
        '管理线上线下营销渠道',
        '策划品牌活动和公关传播',
        '分析市场趋势，制定推广方案',
        '管理推广预算，评估营销效果',
      ],
      requirements: [
        '本科及以上学历，市场营销相关专业',
        '3年以上市场推广经验',
        '有电商或互联网推广经验优先',
        '熟悉各类营销渠道和工具',
        '优秀的策划和文案能力',
        '数据分析能力强，结果导向',
      ],
    },
    {
      id: 'cs-1',
      title: '客服专员',
      department: 'support',
      location: '上海',
      type: '全职',
      experience: '1年以上',
      description: '为用户提供优质的客户服务，解决用户问题。',
      responsibilities: [
        '通过在线聊天、电话等方式为用户提供咨询服务',
        '处理用户投诉和售后问题',
        '记录和反馈用户意见',
        '协助完善客服流程和知识库',
        '维护良好的客户关系',
      ],
      requirements: [
        '大专及以上学历',
        '1年以上客服经验',
        '良好的沟通和服务意识',
        '耐心细致，抗压能力强',
        '熟练使用办公软件',
        '有电商客服经验优先',
      ],
    },
  ];

  const filteredPositions = positions.filter((pos) => {
    return selectedDepartment === 'all' || pos.department === selectedDepartment;
  });

  const toggleJob = (id: string) => {
    setExpandedJob(expandedJob === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">加入我们</h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              与优秀的人一起，打造全球领先的跨境电商平台
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">我们的文化</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                  <svg className="w-8 h-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">创新驱动</h3>
                <p className="text-gray-600">鼓励创新思维，勇于尝试新技术和新方法</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                  <svg className="w-8 h-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">团队协作</h3>
                <p className="text-gray-600">扁平化管理，开放透明的沟通氛围</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                  <svg className="w-8 h-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">持续学习</h3>
                <p className="text-gray-600">提供培训和成长机会，支持员工发展</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                  <svg className="w-8 h-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">工作生活平衡</h3>
                <p className="text-gray-600">弹性工作制，关注员工身心健康</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">福利待遇</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '💰', title: '有竞争力的薪酬', desc: '行业领先的薪资水平，年度调薪和绩效奖金' },
              { icon: '🏥', title: '完善的保障', desc: '五险一金，补充商业保险，年度体检' },
              { icon: '🏖️', title: '带薪假期', desc: '年假、病假、婚假等，鼓励工作生活平衡' },
              { icon: '🎓', title: '学习发展', desc: '内外部培训，技术大会，图书补贴' },
              { icon: '🍱', title: '餐饮福利', desc: '免费午餐和下午茶，零食饮料供应' },
              { icon: '🏋️', title: '健身娱乐', desc: '健身房补贴，团建活动，员工俱乐部' },
            ].map((benefit, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="text-4xl mb-3">{benefit.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 bg-white border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {departments.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setSelectedDepartment(dept.id)}
                className={`px-6 py-2 rounded-full font-medium transition-colors $${'{'}
                  selectedDepartment === dept.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ${'}'}`}
              >
                {dept.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            招聘职位 <span className="text-primary-600">({filteredPositions.length})</span>
          </h2>
          <div className="max-w-4xl mx-auto space-y-4">
            {filteredPositions.map((job) => (
              <Card key={job.id} className="overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {job.type}
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {job.location}
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {job.experience}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-3">{job.description}</p>
                    </div>
                    <button
                      onClick={() => toggleJob(job.id)}
                      className="ml-4 text-primary-600 hover:text-primary-700 font-medium"
                    >
                      {expandedJob === job.id ? '收起' : '详情'}
                    </button>
                  </div>

                  {expandedJob === job.id && (
                    <div className="mt-6 pt-6 border-t">
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">工作职责</h4>
                        <ul className="space-y-2 text-gray-600">
                          {job.responsibilities.map((resp, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-primary-600 mr-2">•</span>
                              <span>{resp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">任职要求</h4>
                        <ul className="space-y-2 text-gray-600">
                          {job.requirements.map((req, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-primary-600 mr-2">•</span>
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex gap-4">
                        <Link href={`/careers/apply?position=$${'{'}job.id${'}'}`}>
                          <Button>立即申请</Button>
                        </Link>
                        <Button variant="outline">分享职位</Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">没有找到合适的职位？</h2>
                <p className="text-gray-600 mb-6">
                  欢迎发送简历到我们的招聘邮箱，我们会在有合适机会时与您联系
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a href="mailto:hr@tradecraft.com" className="flex items-center text-primary-600 hover:text-primary-700">
                    <svg className="w-5 h-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    hr@tradecraft.com
                  </a>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-600">工作时间：周一至周五 9:00-18:00</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
