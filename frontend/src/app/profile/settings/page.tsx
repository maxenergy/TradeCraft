'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useNotification } from '@/contexts/NotificationContext';

export default function SettingsPage() {
  const notification = useNotification();

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    newsletter: true,
    productRecommendations: false,
  });

  const [smsNotifications, setSmsNotifications] = useState({
    orderUpdates: true,
    deliveryReminders: true,
    promotions: false,
  });

  // Privacy Settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisible: true,
    showPurchaseHistory: false,
    showWishlist: true,
    allowDataCollection: true,
  });

  // Language & Currency
  const [preferences, setPreferences] = useState({
    language: 'zh-CN',
    currency: 'CNY',
    timezone: 'Asia/Shanghai',
  });

  const handleSaveNotifications = async () => {
    try {
      // TODO: Replace with actual API call
      // await settingsApi.updateNotifications({ email: emailNotifications, sms: smsNotifications });

      await new Promise((resolve) => setTimeout(resolve, 500));
      notification.success('保存成功', '通知设置已更新');
    } catch (error) {
      notification.error('保存失败', '请稍后重试');
    }
  };

  const handleSavePrivacy = async () => {
    try {
      // TODO: Replace with actual API call
      // await settingsApi.updatePrivacy(privacySettings);

      await new Promise((resolve) => setTimeout(resolve, 500));
      notification.success('保存成功', '隐私设置已更新');
    } catch (error) {
      notification.error('保存失败', '请稍后重试');
    }
  };

  const handleSavePreferences = async () => {
    try {
      // TODO: Replace with actual API call
      // await settingsApi.updatePreferences(preferences);

      await new Promise((resolve) => setTimeout(resolve, 500));
      notification.success('保存成功', '偏好设置已更新');
    } catch (error) {
      notification.error('保存失败', '请稍后重试');
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('确定要删除账号吗？此操作不可恢复，您的所有数据将被永久删除。')) {
      return;
    }

    const confirmText = prompt('请输入"删除我的账号"以确认：');
    if (confirmText !== '删除我的账号') {
      notification.warning('取消删除', '确认文本不匹配');
      return;
    }

    try {
      // TODO: Replace with actual API call
      // await accountApi.delete();

      notification.success('账号已删除', '感谢您使用我们的服务');
      // Redirect to homepage or logout
      // router.push('/');
    } catch (error) {
      notification.error('删除失败', '请联系客服');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">账号设置</h1>
          <p className="text-gray-600">管理您的账号、隐私和通知偏好</p>
        </div>

        {/* Email Notifications */}
        <Card className="mb-6">
          <CardHeader className="border-b">
            <h2 className="text-xl font-semibold text-gray-900">邮件通知</h2>
            <p className="text-sm text-gray-600 mt-1">选择您希望接收的邮件通知类型</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">订单更新</p>
                  <p className="text-sm text-gray-600">接收订单状态变更通知</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailNotifications.orderUpdates}
                    onChange={(e) =>
                      setEmailNotifications({ ...emailNotifications, orderUpdates: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">促销活动</p>
                  <p className="text-sm text-gray-600">接收最新优惠和促销信息</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailNotifications.promotions}
                    onChange={(e) =>
                      setEmailNotifications({ ...emailNotifications, promotions: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">新闻资讯</p>
                  <p className="text-sm text-gray-600">接收平台新闻和资讯</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailNotifications.newsletter}
                    onChange={(e) =>
                      setEmailNotifications({ ...emailNotifications, newsletter: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">商品推荐</p>
                  <p className="text-sm text-gray-600">接收个性化商品推荐</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailNotifications.productRecommendations}
                    onChange={(e) =>
                      setEmailNotifications({ ...emailNotifications, productRecommendations: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={handleSaveNotifications}>保存邮件设置</Button>
            </div>
          </CardContent>
        </Card>

        {/* SMS Notifications */}
        <Card className="mb-6">
          <CardHeader className="border-b">
            <h2 className="text-xl font-semibold text-gray-900">短信通知</h2>
            <p className="text-sm text-gray-600 mt-1">选择您希望接收的短信通知类型</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">订单更新</p>
                  <p className="text-sm text-gray-600">接收订单状态变更短信</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={smsNotifications.orderUpdates}
                    onChange={(e) =>
                      setSmsNotifications({ ...smsNotifications, orderUpdates: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">配送提醒</p>
                  <p className="text-sm text-gray-600">接收配送到达提醒</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={smsNotifications.deliveryReminders}
                    onChange={(e) =>
                      setSmsNotifications({ ...smsNotifications, deliveryReminders: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">促销活动</p>
                  <p className="text-sm text-gray-600">接收促销活动短信</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={smsNotifications.promotions}
                    onChange={(e) =>
                      setSmsNotifications({ ...smsNotifications, promotions: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={handleSaveNotifications}>保存短信设置</Button>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card className="mb-6">
          <CardHeader className="border-b">
            <h2 className="text-xl font-semibold text-gray-900">隐私设置</h2>
            <p className="text-sm text-gray-600 mt-1">管理您的隐私和数据使用偏好</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">公开个人资料</p>
                  <p className="text-sm text-gray-600">允许其他用户查看您的基本信息</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacySettings.profileVisible}
                    onChange={(e) =>
                      setPrivacySettings({ ...privacySettings, profileVisible: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">显示购买记录</p>
                  <p className="text-sm text-gray-600">允许其他用户看到您购买的商品</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacySettings.showPurchaseHistory}
                    onChange={(e) =>
                      setPrivacySettings({ ...privacySettings, showPurchaseHistory: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">显示心愿单</p>
                  <p className="text-sm text-gray-600">允许其他用户查看您的心愿单</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacySettings.showWishlist}
                    onChange={(e) =>
                      setPrivacySettings({ ...privacySettings, showWishlist: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">允许数据收集</p>
                  <p className="text-sm text-gray-600">允许我们收集您的使用数据以改善服务</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacySettings.allowDataCollection}
                    onChange={(e) =>
                      setPrivacySettings({ ...privacySettings, allowDataCollection: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={handleSavePrivacy}>保存隐私设置</Button>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="mb-6">
          <CardHeader className="border-b">
            <h2 className="text-xl font-semibold text-gray-900">偏好设置</h2>
            <p className="text-sm text-gray-600 mt-1">自定义您的使用体验</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">语言</label>
                <select
                  value={preferences.language}
                  onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="zh-CN">简体中文</option>
                  <option value="zh-TW">繁体中文</option>
                  <option value="en-US">English (US)</option>
                  <option value="ja-JP">日本語</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">货币</label>
                <select
                  value={preferences.currency}
                  onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="CNY">人民币 (¥)</option>
                  <option value="USD">美元 ($)</option>
                  <option value="EUR">欧元 (€)</option>
                  <option value="JPY">日元 (¥)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">时区</label>
                <select
                  value={preferences.timezone}
                  onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="Asia/Shanghai">北京时间 (UTC+8)</option>
                  <option value="Asia/Tokyo">东京时间 (UTC+9)</option>
                  <option value="America/New_York">纽约时间 (UTC-5)</option>
                  <option value="Europe/London">伦敦时间 (UTC+0)</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={handleSavePreferences}>保存偏好设置</Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader className="border-b border-red-200 bg-red-50">
            <h2 className="text-xl font-semibold text-red-900">危险操作</h2>
            <p className="text-sm text-red-700 mt-1">这些操作不可逆，请谨慎</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-900">删除账号</p>
                  <p className="text-sm text-gray-600 mt-1">
                    永久删除您的账号和所有相关数据。此操作不可恢复。
                  </p>
                </div>
                <Button
                  onClick={handleDeleteAccount}
                  variant="outline"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  删除账号
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
