'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface NewsArticle {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
}

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: '全部' },
    { id: 'company', name: '公司动态' },
    { id: 'industry', name: '行业资讯' },
    { id: 'product', name: '产品更新' },
    { id: 'events', name: '活动资讯' },
  ];

  const articles: NewsArticle[] = [
    {
      id: '1',
      title: 'TradeCraft完成B轮融资，加速全球化布局',
      category: 'company',
      excerpt: '近日，TradeCraft宣布完成B轮融资，本轮融资由知名投资机构领投，融资金额将主要用于技术研发、市场拓展和团队建设。',
      image: '/images/news/funding.jpg',
      author: '市场部',
      date: '2024-01-15',
      readTime: '5分钟',
      tags: ['融资', '发展', '全球化'],
    },
    {
      id: '2',
      title: '跨境电商行业2024年度趋势报告发布',
      category: 'industry',
      excerpt: '最新发布的行业报告显示，跨境电商市场规模持续增长，预计2024年将突破2万亿元。移动端购物、社交电商成为新的增长点。',
      image: '/images/news/report.jpg',
      author: '研究院',
      date: '2024-01-10',
      readTime: '8分钟',
      tags: ['行业报告', '趋势', '数据'],
    },
    {
      id: '3',
      title: '平台推出AI智能推荐功能，提升购物体验',
      category: 'product',
      excerpt: '基于先进的机器学习算法，新版AI推荐系统可以更精准地理解用户需求，为用户推荐更符合喜好的商品。',
      image: '/images/news/ai.jpg',
      author: '产品部',
      date: '2024-01-08',
      readTime: '6分钟',
      tags: ['AI', '产品更新', '用户体验'],
    },
    {
      id: '4',
      title: 'TradeCraft参加国际电商峰会，分享创新经验',
      category: 'events',
      excerpt: '在近日举办的国际电商峰会上，TradeCraft CEO分享了公司在跨境电商领域的创新实践和发展经验。',
      image: '/images/news/summit.jpg',
      author: '公关部',
      date: '2024-01-05',
      readTime: '4分钟',
      tags: ['峰会', '分享', '行业交流'],
    },
    {
      id: '5',
      title: '新增30个服务国家，覆盖更多全球市场',
      category: 'company',
      excerpt: '经过半年的准备，TradeCraft正式进入30个新市场，服务范围扩展至全球60多个国家和地区。',
      image: '/images/news/expansion.jpg',
      author: '国际业务部',
      date: '2024-01-03',
      readTime: '5分钟',
      tags: ['扩张', '国际化', '市场'],
    },
    {
      id: '6',
      title: '移动支付安全升级，保障用户资金安全',
      category: 'product',
      excerpt: '平台升级了支付安全系统，采用最新的加密技术和风控模型，为用户提供更安全的支付环境。',
      image: '/images/news/security.jpg',
      author: '技术部',
      date: '2023-12-28',
      readTime: '7分钟',
      tags: ['安全', '支付', '技术升级'],
    },
    {
      id: '7',
      title: '双十二大促圆满结束，销售额创历史新高',
      category: 'events',
      excerpt: '2023双十二购物节圆满落幕，平台总销售额同比增长150%，用户参与度和满意度均创新高。',
      image: '/images/news/1212.jpg',
      author: '运营部',
      date: '2023-12-13',
      readTime: '5分钟',
      tags: ['双十二', '促销', '销售'],
    },
    {
      id: '8',
      title: '绿色物流计划启动，推动可持续发展',
      category: 'company',
      excerpt: 'TradeCraft正式启动绿色物流计划，通过优化配送路线、使用环保包装等措施，减少碳排放。',
      image: '/images/news/green.jpg',
      author: '物流部',
      date: '2023-12-10',
      readTime: '6分钟',
      tags: ['环保', '物流', 'CSR'],
    },
    {
      id: '9',
      title: '电商直播带货新趋势：从娱乐到专业化',
      category: 'industry',
      excerpt: '行业观察显示，直播带货正从娱乐化向专业化转变，专业知识和服务质量成为主播竞争力的关键。',
      image: '/images/news/livestream.jpg',
      author: '研究院',
      date: '2023-12-05',
      readTime: '8分钟',
      tags: ['直播', '带货', '趋势'],
    },
  ];

  const filteredArticles = articles.filter((article) => {
    return selectedCategory === 'all' || article.category === selectedCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">新闻动态</h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              了解最新的公司动态、行业资讯和产品更新
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full font-medium transition-colors $${'{'}
                  selectedCategory === category.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ${'}'}`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredArticles.length > 0 && (
            <Card className="mb-12 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="bg-gray-200 h-96 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <svg className="w-24 h-24 mx-auto mb-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>头条新闻图片</p>
                  </div>
                </div>
                <CardContent className="p-8 flex flex-col justify-center">
                  <div className="inline-block px-3 py-1 bg-primary-100 text-primary-600 text-sm font-medium rounded-full mb-4 w-fit">
                    头条推荐
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {filteredArticles[0].title}
                  </h2>
                  <p className="text-gray-600 mb-6 text-lg">
                    {filteredArticles[0].excerpt}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 mb-6">
                    <span>{filteredArticles[0].author}</span>
                    <span className="mx-2">•</span>
                    <span>{filteredArticles[0].date}</span>
                    <span className="mx-2">•</span>
                    <span>{filteredArticles[0].readTime}阅读</span>
                  </div>
                  <Link href={`/news/$${'{'}filteredArticles[0].id${'}'}`}>
                    <Button size="lg">阅读全文</Button>
                  </Link>
                </CardContent>
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.slice(1).map((article) => (
              <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-gray-200 h-48 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {article.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{article.author}</span>
                    <span>{article.date}</span>
                  </div>
                  <Link href={`/news/$${'{'}article.id${'}'}`}>
                    <Button variant="outline" className="w-full">
                      阅读更多
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">暂无相关资讯</h3>
                <p className="text-gray-600">请选择其他分类或稍后再来</p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">订阅新闻</h2>
              <p className="text-primary-100 mb-6">
                订阅我们的新闻通讯，获取最新资讯和优惠信息
              </p>
              <div className="max-w-md mx-auto flex gap-4">
                <input
                  type="email"
                  placeholder="输入您的邮箱地址"
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <Button size="lg" variant="outline" className="bg-white text-primary-600 hover:bg-gray-100">
                  订阅
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
