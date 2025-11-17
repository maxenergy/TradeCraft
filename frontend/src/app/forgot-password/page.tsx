'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useNotification } from '@/contexts/NotificationContext';

export default function ForgotPasswordPage() {
  const notification = useNotification();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      notification.warning('请输入邮箱', '邮箱地址不能为空');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      notification.error('邮箱格式错误', '请输入有效的邮箱地址');
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API call
      // await authApi.forgotPassword(email);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsSubmitted(true);
      notification.success('发送成功', '密码重置邮件已发送，请查收');
    } catch (error) {
      console.error('Failed to send reset email:', error);
      notification.error('发送失败', '请稍后重试或联系客服');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                邮件已发送
              </h2>
              <p className="text-gray-600 mb-2">
                我们已向 <strong>{email}</strong> 发送了密码重置邮件。
              </p>
              <p className="text-gray-600 mb-6">
                请查收您的邮箱，点击邮件中的链接来重置密码。
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  温馨提示
                </h3>
                <ul className="text-sm text-blue-800 space-y-1 ml-7">
                  <li>• 邮件可能需要几分钟才能送达</li>
                  <li>• 请检查垃圾邮件文件夹</li>
                  <li>• 重置链接24小时内有效</li>
                  <li>• 如未收到邮件，可重新申请</li>
                </ul>
              </div>

              <div className="space-y-3">
                <Link href="/login" className="block">
                  <Button className="w-full">返回登录</Button>
                </Link>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail('');
                  }}
                  className="w-full text-primary-600 hover:text-primary-700 font-medium"
                >
                  重新发送
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-primary-600">TradeCraft</h1>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            忘记密码？
          </h2>
          <p className="mt-2 text-gray-600">
            输入您的邮箱地址，我们将发送密码重置链接
          </p>
        </div>

        {/* Form */}
        <Card>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  邮箱地址
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    发送中...
                  </span>
                ) : (
                  '发送重置链接'
                )}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">或</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center space-x-4">
                <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                  返回登录
                </Link>
                <span className="text-gray-300">|</span>
                <Link href="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                  注册新账号
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help */}
        <Card className="mt-6">
          <CardContent className="p-6">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-primary-600 mt-0.5 mr-3 flex-shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">需要帮助？</h3>
                <p className="text-sm text-gray-600 mb-3">
                  如果您在重置密码时遇到问题，我们的客服团队随时为您服务。
                </p>
                <Link href="/contact" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  联系客服 →
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
