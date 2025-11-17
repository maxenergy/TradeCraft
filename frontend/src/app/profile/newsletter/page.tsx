'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useNotification } from '@/contexts/NotificationContext';

interface NewsletterPreferences {
  email: string;
  subscriptions: {
    promotional: boolean;
    newProducts: boolean;
    weeklyDeals: boolean;
    newsletter: boolean;
    orderUpdates: boolean;
    priceDrops: boolean;
    backInStock: boolean;
    recommendations: boolean;
  };
  frequency: 'daily' | 'weekly' | 'monthly';
  categories: string[];
}

export default function NewsletterPage() {
  const notification = useNotification();
  const [preferences, setPreferences] = useState<NewsletterPreferences>({
    email: '',
    subscriptions: {
      promotional: true,
      newProducts: true,
      weeklyDeals: true,
      newsletter: true,
      orderUpdates: true,
      priceDrops: false,
      backInStock: false,
      recommendations: false,
    },
    frequency: 'weekly',
    categories: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const availableCategories = [
    '电子产品',
    '服装配饰',
    '家居生活',
    '运动户外',
    '美妆个护',
    '食品饮料',
    '母婴玩具',
    '图书文娱',
  ];

  useEffect(() => {
    const loadPreferences = async () => {
      setIsLoading(true);
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/user/newsletter-preferences');
        // const data = await response.json();

        // Mock data for demonstration
        const mockPreferences: NewsletterPreferences = {
          email: 'user@example.com',
          subscriptions: {
            promotional: true,
            newProducts: true,
            weeklyDeals: true,
            newsletter: true,
            orderUpdates: true,
            priceDrops: false,
            backInStock: false,
            recommendations: false,
          },
          frequency: 'weekly',
          categories: ['电子产品', '家居生活'],
        };

        setPreferences(mockPreferences);
      } catch (error) {
        console.error('Failed to load newsletter preferences:', error);
        notification.error('加载失败', '无法加载邮件订阅偏好');
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, [notification]);

  const handleToggleSubscription = (key: keyof typeof preferences.subscriptions) => {
    setPreferences({
      ...preferences,
      subscriptions: {
        ...preferences.subscriptions,
        [key]: !preferences.subscriptions[key],
      },
    });
    setHasChanges(true);
  };

  const handleFrequencyChange = (frequency: 'daily' | 'weekly' | 'monthly') => {
    setPreferences({
      ...preferences,
      frequency,
    });
    setHasChanges(true);
  };

  const handleToggleCategory = (category: string) => {
    const updatedCategories = preferences.categories.includes(category)
      ? preferences.categories.filter((c) => c !== category)
      : [...preferences.categories, category];

    setPreferences({
      ...preferences,
      categories: updatedCategories,
    });
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Replace with actual API call
      // await fetch('/api/user/newsletter-preferences', {
      //   method: 'PUT',
      //   body: JSON.stringify(preferences),
      // });

      notification.success('保存成功', '邮件订阅偏好已更新');
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to save preferences:', error);
      notification.error('保存失败', '无法保存邮件订阅偏好');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUnsubscribeAll = async () => {
    if (!confirm('确定要取消所有邮件订阅吗？您将不再收到任何营销邮件。')) {
      return;
    }

    setIsSaving(true);
    try {
      // TODO: Replace with actual API call
      // await fetch('/api/user/newsletter-preferences/unsubscribe-all', {
      //   method: 'POST',
      // });

      setPreferences({
        ...preferences,
        subscriptions: {
          promotional: false,
          newProducts: false,
          weeklyDeals: false,
          newsletter: false,
          orderUpdates: true, // Keep order updates enabled
          priceDrops: false,
          backInStock: false,
          recommendations: false,
        },
      });

      notification.success('已取消订阅', '所有营销邮件订阅已取消（订单通知除外）');
      setHasChanges(true);
    } catch (error) {
      console.error('Failed to unsubscribe all:', error);
      notification.error('操作失败', '无法取消订阅');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600">加载邮件订阅偏好...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">邮件订阅管理</h1>
          <p className="text-gray-600">管理您的邮件通知偏好设置</p>
        </div>

        {/* Email Address */}
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">邮箱地址</h2>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-gray-900 font-medium">{preferences.email}</span>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Types */}
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">邮件类型</h2>
            <p className="text-sm text-gray-600 mt-1">选择您希望接收的邮件类型</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="orderUpdates"
                    type="checkbox"
                    checked={preferences.subscriptions.orderUpdates}
                    onChange={() => handleToggleSubscription('orderUpdates')}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="orderUpdates" className="font-medium text-gray-900 cursor-pointer">
                    订单更新通知
                  </label>
                  <p className="text-sm text-gray-600">
                    订单状态变更、发货通知、物流更新等重要信息（推荐保持开启）
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="promotional"
                    type="checkbox"
                    checked={preferences.subscriptions.promotional}
                    onChange={() => handleToggleSubscription('promotional')}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="promotional" className="font-medium text-gray-900 cursor-pointer">
                    促销活动邮件
                  </label>
                  <p className="text-sm text-gray-600">
                    限时优惠、折扣活动、节日促销等信息
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="newProducts"
                    type="checkbox"
                    checked={preferences.subscriptions.newProducts}
                    onChange={() => handleToggleSubscription('newProducts')}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="newProducts" className="font-medium text-gray-900 cursor-pointer">
                    新品上市通知
                  </label>
                  <p className="text-sm text-gray-600">
                    第一时间了解新品发布和独家首发
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="weeklyDeals"
                    type="checkbox"
                    checked={preferences.subscriptions.weeklyDeals}
                    onChange={() => handleToggleSubscription('weeklyDeals')}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="weeklyDeals" className="font-medium text-gray-900 cursor-pointer">
                    每周精选优惠
                  </label>
                  <p className="text-sm text-gray-600">
                    每周精心挑选的优惠商品推荐
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="newsletter"
                    type="checkbox"
                    checked={preferences.subscriptions.newsletter}
                    onChange={() => handleToggleSubscription('newsletter')}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="newsletter" className="font-medium text-gray-900 cursor-pointer">
                    电子简报
                  </label>
                  <p className="text-sm text-gray-600">
                    行业资讯、购物指南、使用技巧等内容
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="priceDrops"
                    type="checkbox"
                    checked={preferences.subscriptions.priceDrops}
                    onChange={() => handleToggleSubscription('priceDrops')}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="priceDrops" className="font-medium text-gray-900 cursor-pointer">
                    降价提醒
                  </label>
                  <p className="text-sm text-gray-600">
                    心愿单中的商品降价时通知您
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="backInStock"
                    type="checkbox"
                    checked={preferences.subscriptions.backInStock}
                    onChange={() => handleToggleSubscription('backInStock')}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="backInStock" className="font-medium text-gray-900 cursor-pointer">
                    补货通知
                  </label>
                  <p className="text-sm text-gray-600">
                    缺货商品重新上架时通知您
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="recommendations"
                    type="checkbox"
                    checked={preferences.subscriptions.recommendations}
                    onChange={() => handleToggleSubscription('recommendations')}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="recommendations" className="font-medium text-gray-900 cursor-pointer">
                    个性化推荐
                  </label>
                  <p className="text-sm text-gray-600">
                    根据您的浏览和购买历史推荐商品
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Frequency */}
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">邮件频率</h2>
            <p className="text-sm text-gray-600 mt-1">控制营销邮件的发送频率</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  id="daily"
                  type="radio"
                  checked={preferences.frequency === 'daily'}
                  onChange={() => handleFrequencyChange('daily')}
                  className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <label htmlFor="daily" className="ml-3 cursor-pointer">
                  <span className="font-medium text-gray-900">每日</span>
                  <span className="text-sm text-gray-600 ml-2">每天接收最新优惠</span>
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="weekly"
                  type="radio"
                  checked={preferences.frequency === 'weekly'}
                  onChange={() => handleFrequencyChange('weekly')}
                  className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <label htmlFor="weekly" className="ml-3 cursor-pointer">
                  <span className="font-medium text-gray-900">每周</span>
                  <span className="text-sm text-gray-600 ml-2">每周汇总一次（推荐）</span>
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="monthly"
                  type="radio"
                  checked={preferences.frequency === 'monthly'}
                  onChange={() => handleFrequencyChange('monthly')}
                  className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <label htmlFor="monthly" className="ml-3 cursor-pointer">
                  <span className="font-medium text-gray-900">每月</span>
                  <span className="text-sm text-gray-600 ml-2">每月汇总一次</span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Interests */}
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">感兴趣的分类</h2>
            <p className="text-sm text-gray-600 mt-1">选择您感兴趣的商品分类，我们会优先推送相关内容</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {availableCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleToggleCategory(category)}
                  className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                    preferences.categories.includes(category)
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="flex-1"
          >
            {isSaving ? '保存中...' : '保存偏好设置'}
          </Button>
          <Button
            variant="outline"
            onClick={handleUnsubscribeAll}
            disabled={isSaving}
            className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            取消所有订阅
          </Button>
        </div>

        {/* Info Box */}
        <Card className="mt-6">
          <CardContent className="p-6">
            <div className="flex items-start">
              <svg
                className="w-6 h-6 text-primary-600 mt-0.5 mr-3 flex-shrink-0"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">关于邮件订阅</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 您可以随时更改邮件订阅偏好</li>
                  <li>• 订单更新通知建议保持开启，以便及时了解订单状态</li>
                  <li>• 我们尊重您的隐私，不会向第三方分享您的邮箱地址</li>
                  <li>• 每封邮件底部都有取消订阅链接</li>
                  <li>• 如有任何问题，请联系客服 support@tradecraft.com</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
