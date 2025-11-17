'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function AboutPage() {
  const milestones = [
    { year: '2019', title: '公司成立', description: 'TradeCraft在上海成立，开始跨境电商业务探索' },
    { year: '2020', title: '平台上线', description: '电商平台正式上线，服务首批1000+用户' },
    { year: '2021', title: '业务拓展', description: '业务拓展至东南亚、欧美等30+国家和地区' },
    { year: '2022', title: '技术升级', description: '完成平台技术架构升级，提升用户体验' },
    { year: '2023', title: '战略融资', description: '完成B轮融资，加速全球化布局' },
    { year: '2024', title: '持续创新', description: '用户突破50万，成为领先的跨境电商平台' },
  ];

  const values = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      title: '用户至上',
      description: '始终将用户需求放在首位，提供优质的产品和服务',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: '创新驱动',
      description: '持续探索新技术，不断优化产品和服务',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: '全球视野',
      description: '打造连接全球的电商平台，服务世界各地的用户',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: '诚信经营',
      description: '坚持诚信为本，打造值得信赖的电商品牌',
    },
  ];

  const team = [
    {
      name: '张伟',
      position: '创始人 & CEO',
      bio: '10年电商行业经验，曾任职于知名互联网公司',
      image: '/images/team/ceo.jpg',
    },
    {
      name: '李娜',
      position: 'CTO',
      bio: '技术专家，专注于电商平台架构和性能优化',
      image: '/images/team/cto.jpg',
    },
    {
      name: '王强',
      position: 'COO',
      bio: '运营专家，丰富的跨境电商运营经验',
      image: '/images/team/coo.jpg',
    },
    {
      name: '刘芳',
      position: 'CMO',
      bio: '市场营销专家，擅长品牌建设和用户增长',
      image: '/images/team/cmo.jpg',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">关于我们</h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              致力于打造全球领先的跨境电商平台，连接世界各地的优质商品与用户
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">我们的故事</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  TradeCraft成立于2019年，是一家专注于跨境电商的创新型科技公司。我们的使命是通过技术创新，
                  让全球优质商品触手可及，为用户提供便捷、安全、高品质的购物体验。
                </p>
                <p>
                  从最初的几个人的小团队，到如今拥有200+员工的专业团队；从服务首批1000名用户，
                  到现在为全球30+国家和地区的50万+用户提供服务。我们始终坚持用户至上，持续创新，
                  不断优化产品和服务。
                </p>
                <p>
                  我们相信，科技能够打破地域界限，让世界变得更加紧密。通过不断的技术创新和服务优化，
                  我们致力于成为用户最信赖的跨境电商平台。
                </p>
              </div>
            </div>
            <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <svg className="w-24 h-24 mx-auto mb-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p>公司形象图片</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">核心数据</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">50万+</div>
                <div className="text-gray-600">注册用户</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">30+</div>
                <div className="text-gray-600">服务国家</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">10万+</div>
                <div className="text-gray-600">商品品类</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">98%</div>
                <div className="text-gray-600">用户满意度</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">核心价值观</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">发展历程</h2>
          <div className="relative">
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary-200"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative grid grid-cols-1 md:grid-cols-2 gap-8 ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                  <div className={`${index % 2 === 0 ? 'md:text-right' : 'md:col-start-2'}`}>
                    <Card>
                      <CardContent className="p-6">
                        <div className="text-2xl font-bold text-primary-600 mb-2">{milestone.year}</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                        <p className="text-gray-600">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="hidden md:flex items-center justify-center">
                    <div className="w-4 h-4 bg-primary-600 rounded-full border-4 border-white shadow-lg"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">核心团队</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-primary-600 text-sm mb-3">{member.position}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">加入我们，共创未来</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            我们正在寻找充满激情、勇于创新的人才加入团队
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/careers">
              <Button size="lg" variant="outline" className="bg-white text-primary-600 hover:bg-gray-100">
                查看职位
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600">
                联系我们
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
