'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useNotification } from '@/contexts/NotificationContext';

interface ReferralStats {
  totalReferrals: number;
  successfulReferrals: number;
  totalEarned: number;
  pendingRewards: number;
}

interface Referral {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'completed' | 'rewarded';
  signupDate: string;
  purchaseDate?: string;
  rewardAmount: number;
}

export default function ReferralPage() {
  const notification = useNotification();
  const [stats, setStats] = useState<ReferralStats>({
    totalReferrals: 0,
    successfulReferrals: 0,
    totalEarned: 0,
    pendingRewards: 0,
  });
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [referralCode, setReferralCode] = useState('');
  const [shareEmail, setShareEmail] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const loadReferralData = async () => {
      setIsLoading(true);
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/user/referrals');
        // const data = await response.json();

        // Mock data
        setReferralCode('ZHANG2024');

        setStats({
          totalReferrals: 8,
          successfulReferrals: 5,
          totalEarned: 500,
          pendingRewards: 150,
        });

        const mockReferrals: Referral[] = [
          {
            id: '1',
            name: '李**',
            email: 'li***@example.com',
            status: 'rewarded',
            signupDate: '2024-01-10',
            purchaseDate: '2024-01-12',
            rewardAmount: 100,
          },
          {
            id: '2',
            name: '王**',
            email: 'wang***@example.com',
            status: 'rewarded',
            signupDate: '2024-01-08',
            purchaseDate: '2024-01-09',
            rewardAmount: 100,
          },
          {
            id: '3',
            name: '陈**',
            email: 'chen***@example.com',
            status: 'completed',
            signupDate: '2024-01-15',
            purchaseDate: '2024-01-16',
            rewardAmount: 100,
          },
          {
            id: '4',
            name: '赵**',
            email: 'zhao***@example.com',
            status: 'pending',
            signupDate: '2024-01-17',
            rewardAmount: 50,
          },
          {
            id: '5',
            name: '刘**',
            email: 'liu***@example.com',
            status: 'pending',
            signupDate: '2024-01-16',
            rewardAmount: 50,
          },
        ];

        setReferrals(mockReferrals);
      } catch (error) {
        console.error('Failed to load referral data:', error);
        notification.error('加载失败', '无法加载推荐数据');
      } finally {
        setIsLoading(false);
      }
    };

    loadReferralData();
  }, [notification]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    notification.success('已复制', '推荐码已复制到剪贴板');
  };

  const handleCopyLink = () => {
    const link = `https://tradecraft.com/register?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    notification.success('已复制', '推荐链接已复制到剪贴板');
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!shareEmail.trim()) {
      notification.warning('请输入邮箱', '邮箱地址不能为空');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shareEmail)) {
      notification.error('邮箱格式错误', '请输入有效的邮箱地址');
      return;
    }

    setIsSending(true);
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      notification.success('发送成功', '推荐邮件已发送');
      setShareEmail('');
    } catch (error) {
      notification.error('发送失败', '无法发送邮件');
    } finally {
      setIsSending(false);
    }
  };

  const getStatusBadge = (status: Referral['status']) => {
    switch (status) {
      case 'rewarded':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            已获奖励
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            已完成购买
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            待完成
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600">加载推荐数据...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">推荐好友计划</h1>
          <p className="text-lg text-gray-600">
            分享给好友，双方都能获得奖励
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">
                {stats.totalReferrals}
              </div>
              <div className="text-sm text-gray-600">总推荐人数</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {stats.successfulReferrals}
              </div>
              <div className="text-sm text-gray-600">成功推荐</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                ¥{stats.totalEarned}
              </div>
              <div className="text-sm text-gray-600">累计获得</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">
                ¥{stats.pendingRewards}
              </div>
              <div className="text-sm text-gray-600">待发放奖励</div>
            </CardContent>
          </Card>
        </div>

        {/* Referral Code Section */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-900">您的专属推荐码</h2>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-lg p-8 mb-6">
              <div className="text-center mb-6">
                <div className="text-sm text-gray-600 mb-2">您的推荐码</div>
                <div className="text-5xl font-bold text-primary-600 tracking-wider mb-4">
                  {referralCode}
                </div>
                <Button onClick={handleCopyCode} size="lg">
                  <svg className="w-5 h-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  复制推荐码
                </Button>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="text-sm text-gray-600 mb-3">推荐链接</div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={`https://tradecraft.com/register?ref=${referralCode}`}
                    readOnly
                    className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                  />
                  <Button onClick={handleCopyLink} variant="outline">
                    复制链接
                  </Button>
                </div>
              </div>
            </div>

            {/* Share via Email */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">通过邮件分享</h3>
              <form onSubmit={handleSendEmail} className="flex gap-3">
                <input
                  type="email"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  placeholder="输入朋友的邮箱地址"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  disabled={isSending}
                />
                <Button type="submit" disabled={isSending}>
                  {isSending ? '发送中...' : '发送邀请'}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-900">如何获得奖励</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">1️⃣</span>
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">分享推荐码</h3>
                <p className="text-sm text-gray-600">
                  将您的专属推荐码或链接分享给朋友
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">2️⃣</span>
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">朋友注册</h3>
                <p className="text-sm text-gray-600">
                  朋友使用您的推荐码注册并完成首次购物
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">3️⃣</span>
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">获得奖励</h3>
                <p className="text-sm text-gray-600">
                  您和朋友都将获得 ¥100 购物券
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Referral List */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-900">推荐记录</h2>
          </CardHeader>
          <CardContent>
            {referrals.length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                还没有推荐记录，快去邀请朋友吧！
              </div>
            ) : (
              <div className="space-y-4">
                {referrals.map((referral) => (
                  <div
                    key={referral.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className="font-medium text-gray-900 mr-3">
                          {referral.name}
                        </div>
                        {getStatusBadge(referral.status)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {referral.email}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        注册时间: {new Date(referral.signupDate).toLocaleDateString()}
                        {referral.purchaseDate && (
                          <span className="ml-3">
                            购买时间: {new Date(referral.purchaseDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary-600">
                        ¥{referral.rewardAmount}
                      </div>
                      <div className="text-xs text-gray-600">
                        {referral.status === 'rewarded'
                          ? '已发放'
                          : referral.status === 'completed'
                          ? '待发放'
                          : '待完成'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Terms */}
        <Card className="mt-8">
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
                <h3 className="font-semibold text-gray-900 mb-2">活动规则</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 新用户通过推荐码注册并完成首次购物（满¥200）后，双方各获得¥100优惠券</li>
                  <li>• 优惠券有效期为30天，可用于下次购物抵扣</li>
                  <li>• 推荐人数不设上限，每成功推荐一位好友即可获得奖励</li>
                  <li>• 奖励将在好友完成首次购物后3个工作日内发放</li>
                  <li>• 严禁作弊行为，一经发现将取消资格并收回奖励</li>
                  <li>• 本活动最终解释权归TradeCraft所有</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
