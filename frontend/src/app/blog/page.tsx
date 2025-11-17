'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useNotification } from '@/contexts/NotificationContext';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  tags: string[];
  image: string;
  publishedAt: string;
  readTime: number;
  views: number;
}

export default function BlogPage() {
  const notification = useNotification();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadArticles = async () => {
      setIsLoading(true);
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/blog/articles');
        // const data = await response.json();

        // Mock data for demonstration
        const mockArticles: Article[] = [
          {
            id: '1',
            title: '2024年春季时尚趋势：五大必备单品',
            slug: 'spring-fashion-trends-2024',
            excerpt: '随着春季的到来，让我们一起探索本季最流行的时尚单品和搭配技巧...',
            content: '',
            author: {
              name: '时尚编辑部',
              avatar: '/placeholder-avatar.jpg',
            },
            category: '时尚潮流',
            tags: ['时尚', '春季', '穿搭'],
            image: '/placeholder-blog1.jpg',
            publishedAt: '2024-01-15T10:00:00Z',
            readTime: 5,
            views: 1234,
          },
          {
            id: '2',
            title: '智能家居选购指南：打造舒适智能生活',
            slug: 'smart-home-buying-guide',
            excerpt: '想要升级你的家居生活？本文为您详细介绍如何选择合适的智能家居产品...',
            content: '',
            author: {
              name: '科技编辑',
              avatar: '/placeholder-avatar.jpg',
            },
            category: '科技数码',
            tags: ['智能家居', '科技', '家居'],
            image: '/placeholder-blog2.jpg',
            publishedAt: '2024-01-14T14:30:00Z',
            readTime: 8,
            views: 2156,
          },
          {
            id: '3',
            title: '健康饮食新趋势：2024年必知的营养知识',
            slug: 'healthy-eating-2024',
            excerpt: '健康饮食不仅关乎身材，更关系到整体健康。了解最新的营养科学知识...',
            content: '',
            author: {
              name: '健康专家',
              avatar: '/placeholder-avatar.jpg',
            },
            category: '健康生活',
            tags: ['健康', '饮食', '营养'],
            image: '/placeholder-blog3.jpg',
            publishedAt: '2024-01-13T09:15:00Z',
            readTime: 6,
            views: 987,
          },
          {
            id: '4',
            title: '户外运动装备推荐：春季徒步必备清单',
            slug: 'outdoor-gear-spring-hiking',
            excerpt: '春暖花开，正是徒步的好时节。让我们为您推荐最实用的户外装备...',
            content: '',
            author: {
              name: '户外达人',
              avatar: '/placeholder-avatar.jpg',
            },
            category: '运动户外',
            tags: ['户外', '徒步', '装备'],
            image: '/placeholder-blog4.jpg',
            publishedAt: '2024-01-12T16:45:00Z',
            readTime: 7,
            views: 1543,
          },
          {
            id: '5',
            title: '美妆小白入门：化妆品选购与使用技巧',
            slug: 'beauty-basics-guide',
            excerpt: '刚开始接触美妆？不知道如何选择适合自己的产品？本文为您答疑解惑...',
            content: '',
            author: {
              name: '美妆博主',
              avatar: '/placeholder-avatar.jpg',
            },
            category: '美妆个护',
            tags: ['美妆', '护肤', '入门'],
            image: '/placeholder-blog5.jpg',
            publishedAt: '2024-01-11T11:20:00Z',
            readTime: 10,
            views: 3421,
          },
          {
            id: '6',
            title: '书房装修灵感：打造高效学习工作空间',
            slug: 'study-room-decoration-ideas',
            excerpt: '一个舒适的书房能大大提高工作和学习效率。来看看这些实用的装修建议...',
            content: '',
            author: {
              name: '室内设计师',
              avatar: '/placeholder-avatar.jpg',
            },
            category: '家居生活',
            tags: ['家居', '装修', '书房'],
            image: '/placeholder-blog6.jpg',
            publishedAt: '2024-01-10T13:00:00Z',
            readTime: 9,
            views: 1876,
          },
        ];

        setArticles(mockArticles);
      } catch (error) {
        console.error('Failed to load articles:', error);
        notification.error('加载失败', '无法加载文章列表');
      } finally {
        setIsLoading(false);
      }
    };

    loadArticles();
  }, [notification]);

  const categories = ['all', ...Array.from(new Set(articles.map((article) => article.category)))];

  const filteredArticles = articles.filter((article) => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = articles[0];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600">加载文章...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">TradeCraft 博客</h1>
          <p className="text-lg text-gray-600">
            发现最新资讯、购物指南和生活灵感
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索文章、标签..."
              className="w-full px-5 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Featured Article */}
        {featuredArticle && selectedCategory === 'all' && !searchQuery && (
          <Card className="mb-10 overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 relative h-64 md:h-auto">
                <Image
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  fill
                  className="object-cover"
                />
                <span className="absolute top-4 left-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-600 text-white">
                  精选文章
                </span>
              </div>
              <div className="md:w-1/2 p-8">
                <div className="flex items-center mb-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {featuredArticle.category}
                  </span>
                  <span className="ml-3 text-sm text-gray-600">
                    {new Date(featuredArticle.publishedAt).toLocaleDateString()}
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {featuredArticle.title}
                </h2>
                <p className="text-gray-600 mb-6">
                  {featuredArticle.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <span>{featuredArticle.readTime} 分钟阅读</span>
                    <span className="mx-2">•</span>
                    <span>{featuredArticle.views.toLocaleString()} 次阅读</span>
                  </div>
                  <Link href={`/blog/${featuredArticle.slug}`}>
                    <Button>阅读全文</Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category === 'all' ? '全部' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <svg
                className="w-24 h-24 text-gray-400 mx-auto mb-4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">未找到文章</h3>
              <p className="text-gray-600">请尝试其他搜索词或分类</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="group hover:shadow-xl transition-shadow overflow-hidden">
                <Link href={`/blog/${article.slug}`}>
                  <div className="relative h-48 bg-gray-100">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>
                <CardContent className="p-6">
                  <div className="flex items-center mb-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {article.category}
                    </span>
                    <span className="ml-auto text-xs text-gray-500">
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <Link href={`/blog/${article.slug}`}>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {article.title}
                    </h3>
                  </Link>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center text-xs text-gray-600">
                      <svg className="w-4 h-4 mr-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {article.readTime} 分钟
                    </div>
                    <div className="flex items-center text-xs text-gray-600">
                      <svg className="w-4 h-4 mr-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {article.views.toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Newsletter Subscription */}
        <Card className="mt-12 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-3">订阅我们的博客</h2>
            <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
              获取最新文章、独家优惠和生活灵感，直接发送到您的邮箱
            </p>
            <div className="flex gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="输入您的邮箱"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <Button className="bg-white text-primary-600 hover:bg-primary-50 whitespace-nowrap">
                立即订阅
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
