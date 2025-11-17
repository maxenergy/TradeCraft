'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useNotification } from '@/contexts/NotificationContext';

interface PointsTransaction {
  id: string;
  type: 'earn' | 'redeem' | 'expire';
  points: number;
  description: string;
  date: string;
  relatedOrder?: string;
}

interface PointsReward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  type: 'discount' | 'product' | 'shipping';
  value: number;
  image: string;
  stock: number;
}

interface MembershipTier {
  name: string;
  minPoints: number;
  benefits: string[];
  color: string;
}

export default function PointsPage() {
  const notification = useNotification();
  const [currentPoints, setCurrentPoints] = useState(0);
  const [lifetimePoints, setLifetimePoints] = useState(0);
  const [transactions, setTransactions] = useState<PointsTransaction[]>([]);
  const [rewards, setRewards] = useState<PointsReward[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'history' | 'rewards'>('overview');

  const membershipTiers: MembershipTier[] = [
    {
      name: '青铜会员',
      minPoints: 0,
      benefits: ['购物赚积分', '生日礼券'],
      color: 'from-orange-400 to-orange-600',
    },
    {
      name: '白银会员',
      minPoints: 1000,
      benefits: ['购物赚积分', '生日礼券', '额外5%积分', '优先客服'],
      color: 'from-gray-300 to-gray-500',
    },
    {
      name: '黄金会员',
      minPoints: 5000,
      benefits: ['购物赚积分', '生日礼券', '额外10%积分', '优先客服', '专属优惠'],
      color: 'from-yellow-400 to-yellow-600',
    },
    {
      name: '铂金会员',
      minPoints: 10000,
      benefits: ['购物赚积分', '生日礼券', '额外15%积分', '优先客服', '专属优惠', '免费配送'],
      color: 'from-purple-400 to-purple-600',
    },
  ];

  useEffect(() => {
    const loadPointsData = async () => {
      setIsLoading(true);
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/user/points');
        // const data = await response.json();

        // Mock data
        setCurrentPoints(3250);
        setLifetimePoints(8750);

        const mockTransactions: PointsTransaction[] = [
          {
            id: '1',
            type: 'earn',
            points: 150,
            description: '订单购物奖励',
            date: '2024-01-15T10:30:00Z',
            relatedOrder: 'ORD20240115001',
          },
          {
            id: '2',
            type: 'earn',
            points: 50,
            description: '每日签到奖励',
            date: '2024-01-14T09:00:00Z',
          },
          {
            id: '3',
            type: 'redeem',
            points: -500,
            description: '兑换20元优惠券',
            date: '2024-01-13T16:20:00Z',
          },
          {
            id: '4',
            type: 'earn',
            points: 200,
            description: '订单购物奖励',
            date: '2024-01-12T14:45:00Z',
            relatedOrder: 'ORD20240112002',
          },
          {
            id: '5',
            type: 'earn',
            points: 100,
            description: '完成评价奖励',
            date: '2024-01-11T11:20:00Z',
          },
        ];

        setTransactions(mockTransactions);

        const mockRewards: PointsReward[] = [
          {
            id: '1',
            name: '10元优惠券',
            description: '全场通用，无门槛',
            pointsCost: 200,
            type: 'discount',
            value: 10,
            image: '/placeholder-reward.jpg',
            stock: 100,
          },
          {
            id: '2',
            name: '20元优惠券',
            description: '满100元可用',
            pointsCost: 500,
            type: 'discount',
            value: 20,
            image: '/placeholder-reward.jpg',
            stock: 50,
          },
          {
            id: '3',
            name: '50元优惠券',
            description: '满300元可用',
            pointsCost: 1000,
            type: 'discount',
            value: 50,
            image: '/placeholder-reward.jpg',
            stock: 30,
          },
          {
            id: '4',
            name: '免费配送券',
            description: '全国包邮',
            pointsCost: 300,
            type: 'shipping',
            value: 0,
            image: '/placeholder-reward.jpg',
            stock: 200,
          },
        ];

        setRewards(mockRewards);
      } catch (error) {
        console.error('Failed to load points data:', error);
        notification.error('加载失败', '无法加载积分信息');
      } finally {
        setIsLoading(false);
      }
    };

    loadPointsData();
  }, [notification]);

  const handleRedeemReward = async (reward: PointsReward) => {
    if (currentPoints < reward.pointsCost) {
      notification.warning('积分不足', `需要 ${reward.pointsCost} 积分`);
      return;
    }

    if (reward.stock <= 0) {
      notification.warning('库存不足', '该奖励已兑换完');
      return;
    }

    try {
      // TODO: Replace with actual API call
      setCurrentPoints(currentPoints - reward.pointsCost);
      notification.success('兑换成功', `${reward.name} 已添加到您的账户`);
    } catch (error) {
      notification.error('兑换失败', '无法完成兑换');
    }
  };

  const getCurrentTier = () => {
    for (let i = membershipTiers.length - 1; i >= 0; i--) {
      if (lifetimePoints >= membershipTiers[i].minPoints) {
        return membershipTiers[i];
      }
    }
    return membershipTiers[0];
  };

  const getNextTier = () => {
    const currentTier = getCurrentTier();
    const currentIndex = membershipTiers.findIndex((t) => t.name === currentTier.name);
    return currentIndex < membershipTiers.length - 1
      ? membershipTiers[currentIndex + 1]
      : null;
  };

  const currentTier = getCurrentTier();
  const nextTier = getNextTier();
  const pointsToNextTier = nextTier ? nextTier.minPoints - lifetimePoints : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600">加载积分信息...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">我的积分</h1>
          <p className="text-gray-600">赚取积分，兑换奖励</p>
        </div>

        {/* Points Overview Card */}
        <Card className={`mb-8 bg-gradient-to-br ${currentTier.color} text-white overflow-hidden`}>
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="mb-6 md:mb-0">
                <div className="flex items-center mb-2">
                  <span className="text-lg font-medium opacity-90">当前等级</span>
                  <span className="ml-3 px-3 py-1 bg-white/20 rounded-full text-sm font-semibold">
                    {currentTier.name}
                  </span>
                </div>
                <div className="text-5xl font-bold mb-1">{currentPoints.toLocaleString()}</div>
                <div className="text-sm opacity-90">可用积分</div>
                {nextTier && (
                  <div className="mt-4 text-sm opacity-90">
                    再获得 {pointsToNextTier.toLocaleString()} 积分升级到 {nextTier.name}
                  </div>
                )}
              </div>

              <div className="text-right">
                <div className="text-sm opacity-90 mb-1">累计获得</div>
                <div className="text-3xl font-bold">{lifetimePoints.toLocaleString()}</div>
                <div className="text-sm opacity-90">总积分</div>
              </div>
            </div>

            {nextTier && (
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span>升级进度</span>
                  <span>
                    {((lifetimePoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints) * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className="bg-white rounded-full h-2 transition-all duration-500"
                    style={{
                      width: `${((lifetimePoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setSelectedTab('overview')}
              className={`px-6 py-3 font-medium transition-colors ${
                selectedTab === 'overview'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              会员权益
            </button>
            <button
              onClick={() => setSelectedTab('history')}
              className={`px-6 py-3 font-medium transition-colors ${
                selectedTab === 'history'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              积分明细
            </button>
            <button
              onClick={() => setSelectedTab('rewards')}
              className={`px-6 py-3 font-medium transition-colors ${
                selectedTab === 'rewards'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              积分兑换
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {selectedTab === 'overview' && (
          <div className="space-y-6">
            {/* Earning Ways */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold text-gray-900">如何赚取积分</h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { icon: '🛍️', title: '购物消费', desc: '每消费¥1得1积分' },
                    { icon: '✍️', title: '发表评价', desc: '每条评价得50积分' },
                    { icon: '📅', title: '每日签到', desc: '连续签到得10-50积分' },
                    { icon: '🎂', title: '生日礼包', desc: '生日当月得200积分' },
                  ].map((way, index) => (
                    <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-4xl mb-2">{way.icon}</div>
                      <div className="font-semibold text-gray-900 mb-1">{way.title}</div>
                      <div className="text-sm text-gray-600">{way.desc}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Membership Tiers */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold text-gray-900">会员等级</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {membershipTiers.map((tier, index) => (
                    <div
                      key={index}
                      className={`p-6 rounded-lg border-2 ${
                        tier.name === currentTier.name
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${tier.color} mr-4`}></div>
                          <div>
                            <div className="font-bold text-lg text-gray-900">
                              {tier.name}
                              {tier.name === currentTier.name && (
                                <span className="ml-2 text-sm text-primary-600">(当前等级)</span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600">
                              {tier.minPoints.toLocaleString()} 积分
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {tier.benefits.map((benefit, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white border border-gray-200"
                          >
                            ✓ {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedTab === 'history' && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-bold text-gray-900">积分明细</h2>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="text-center py-12 text-gray-600">暂无积分记录</div>
              ) : (
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 mb-1">
                          {transaction.description}
                        </div>
                        <div className="text-sm text-gray-600">
                          {new Date(transaction.date).toLocaleString()}
                        </div>
                        {transaction.relatedOrder && (
                          <div className="text-xs text-gray-500 mt-1">
                            订单号: {transaction.relatedOrder}
                          </div>
                        )}
                      </div>
                      <div
                        className={`text-xl font-bold ${
                          transaction.type === 'earn'
                            ? 'text-green-600'
                            : transaction.type === 'redeem'
                            ? 'text-red-600'
                            : 'text-gray-600'
                        }`}
                      >
                        {transaction.points > 0 ? '+' : ''}
                        {transaction.points}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {selectedTab === 'rewards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.map((reward) => (
              <Card key={reward.id}>
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl text-white">
                      {reward.type === 'discount' ? '💰' : '📦'}
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{reward.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{reward.description}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary-600 mb-1">
                        {reward.pointsCost}
                      </div>
                      <div className="text-sm text-gray-600">所需积分</div>
                    </div>
                  </div>

                  <div className="text-center text-sm text-gray-600 mb-4">
                    剩余库存: {reward.stock}
                  </div>

                  <Button
                    onClick={() => handleRedeemReward(reward)}
                    disabled={currentPoints < reward.pointsCost || reward.stock <= 0}
                    className="w-full"
                  >
                    {currentPoints < reward.pointsCost
                      ? '积分不足'
                      : reward.stock <= 0
                      ? '已兑完'
                      : '立即兑换'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Info Card */}
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
                <h3 className="font-semibold text-gray-900 mb-2">积分规则</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 积分有效期为获得后1年，过期自动清零</li>
                  <li>• 退货/取消订单后，对应积分将被扣除</li>
                  <li>• 会员等级根据累计积分计算，不会降级</li>
                  <li>• 兑换的奖励将在24小时内发放到您的账户</li>
                  <li>• 积分不可转让或兑换现金</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
