'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useNotification } from '@/contexts/NotificationContext';

interface GiftCard {
  id: string;
  code: string;
  balance: number;
  originalAmount: number;
  expiryDate: string;
  isActive: boolean;
  createdAt: string;
  usageHistory: {
    orderId: string;
    amount: number;
    date: string;
  }[];
}

export default function GiftCardsPage() {
  const notification = useNotification();
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showRedeemForm, setShowRedeemForm] = useState(false);
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [redeemCode, setRedeemCode] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [purchaseForm, setPurchaseForm] = useState({
    amount: '100',
    recipientEmail: '',
    recipientName: '',
    message: '',
    sendDate: '',
  });

  useEffect(() => {
    const loadGiftCards = async () => {
      setIsLoading(true);
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/user/gift-cards');
        // const data = await response.json();

        // Mock data
        const mockGiftCards: GiftCard[] = [
          {
            id: '1',
            code: 'GIFT-ABC123-XYZ',
            balance: 850,
            originalAmount: 1000,
            expiryDate: '2025-12-31',
            isActive: true,
            createdAt: '2024-01-01',
            usageHistory: [
              {
                orderId: 'ORD20240115001',
                amount: 150,
                date: '2024-01-15',
              },
            ],
          },
          {
            id: '2',
            code: 'GIFT-DEF456-UVW',
            balance: 500,
            originalAmount: 500,
            expiryDate: '2024-06-30',
            isActive: true,
            createdAt: '2023-12-25',
            usageHistory: [],
          },
        ];

        setGiftCards(mockGiftCards);
      } catch (error) {
        console.error('Failed to load gift cards:', error);
        notification.error('加载失败', '无法加载礼品卡列表');
      } finally {
        setIsLoading(false);
      }
    };

    loadGiftCards();
  }, [notification]);

  const handleRedeemCard = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!redeemCode.trim()) {
      notification.warning('请输入兑换码', '礼品卡兑换码不能为空');
      return;
    }

    setIsRedeeming(true);
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newCard: GiftCard = {
        id: Date.now().toString(),
        code: redeemCode.toUpperCase(),
        balance: 200,
        originalAmount: 200,
        expiryDate: '2025-12-31',
        isActive: true,
        createdAt: new Date().toISOString(),
        usageHistory: [],
      };

      setGiftCards([newCard, ...giftCards]);
      notification.success('兑换成功', `礼品卡已添加，余额 ¥${newCard.balance}`);
      setShowRedeemForm(false);
      setRedeemCode('');
    } catch (error) {
      notification.error('兑换失败', '无效的礼品卡代码');
    } finally {
      setIsRedeeming(false);
    }
  };

  const handlePurchaseCard = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!purchaseForm.recipientEmail || !purchaseForm.recipientName) {
      notification.warning('请填写完整', '请填写收件人信息');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(purchaseForm.recipientEmail)) {
      notification.error('邮箱格式错误', '请输入有效的邮箱地址');
      return;
    }

    try {
      // TODO: Replace with actual API call
      notification.success('购买成功', '礼品卡将发送至收件人邮箱');
      setShowPurchaseForm(false);
      setPurchaseForm({
        amount: '100',
        recipientEmail: '',
        recipientName: '',
        message: '',
        sendDate: '',
      });
    } catch (error) {
      notification.error('购买失败', '无法完成购买');
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    notification.success('已复制', `礼品卡代码已复制到剪贴板`);
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const totalBalance = giftCards.reduce((sum, card) => sum + card.balance, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600">加载礼品卡...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">礼品卡</h1>
          <p className="text-gray-600">管理您的礼品卡，购买或赠送给朋友</p>
        </div>

        {/* Balance Summary */}
        <Card className="mb-8 bg-gradient-to-br from-purple-600 to-pink-600 text-white">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-purple-100 mb-1">礼品卡总余额</div>
                <div className="text-4xl font-bold">¥{totalBalance.toLocaleString()}</div>
                <div className="text-sm text-purple-100 mt-2">
                  {giftCards.filter((c) => c.isActive).length} 张可用礼品卡
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => setShowPurchaseForm(!showPurchaseForm)}
                  className="bg-white text-purple-600 hover:bg-purple-50"
                >
                  购买礼品卡
                </Button>
                <Button
                  onClick={() => setShowRedeemForm(!showRedeemForm)}
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  兑换礼品卡
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Redeem Form */}
        {showRedeemForm && (
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-xl font-bold text-gray-900">兑换礼品卡</h2>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRedeemCard} className="flex gap-4">
                <input
                  type="text"
                  value={redeemCode}
                  onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
                  placeholder="输入礼品卡代码"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
                  disabled={isRedeeming}
                />
                <Button type="submit" disabled={isRedeeming}>
                  {isRedeeming ? '兑换中...' : '兑换'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Purchase Form */}
        {showPurchaseForm && (
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-xl font-bold text-gray-900">购买礼品卡</h2>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePurchaseCard} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    礼品卡金额
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {['100', '200', '500', '1000'].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => setPurchaseForm({ ...purchaseForm, amount })}
                        className={`p-4 border-2 rounded-lg text-center font-semibold transition-colors ${
                          purchaseForm.amount === amount
                            ? 'border-primary-600 bg-primary-50 text-primary-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        ¥{amount}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      收件人姓名 <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={purchaseForm.recipientName}
                      onChange={(e) =>
                        setPurchaseForm({ ...purchaseForm, recipientName: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="收件人姓名"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      收件人邮箱 <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      value={purchaseForm.recipientEmail}
                      onChange={(e) =>
                        setPurchaseForm({ ...purchaseForm, recipientEmail: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="recipient@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    祝福语（可选）
                  </label>
                  <textarea
                    value={purchaseForm.message}
                    onChange={(e) =>
                      setPurchaseForm({ ...purchaseForm, message: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="写下您的祝福..."
                    maxLength={200}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {purchaseForm.message.length}/200
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    发送日期（可选）
                  </label>
                  <input
                    type="date"
                    value={purchaseForm.sendDate}
                    onChange={(e) =>
                      setPurchaseForm({ ...purchaseForm, sendDate: e.target.value })
                    }
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    留空则立即发送
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" className="flex-1">
                    购买礼品卡 ¥{purchaseForm.amount}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowPurchaseForm(false)}
                    className="flex-1"
                  >
                    取消
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Gift Cards List */}
        {giftCards.length === 0 ? (
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
                <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无礼品卡</h3>
              <p className="text-gray-600 mb-6">购买礼品卡或兑换礼品卡代码</p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => setShowPurchaseForm(true)}>购买礼品卡</Button>
                <Button variant="outline" onClick={() => setShowRedeemForm(true)}>
                  兑换礼品卡
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {giftCards.map((card) => {
              const daysUntilExpiry = getDaysUntilExpiry(card.expiryDate);
              const isExpiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry > 0;
              const isExpired = daysUntilExpiry <= 0;

              return (
                <Card
                  key={card.id}
                  className={`overflow-hidden ${
                    isExpired ? 'opacity-60' : ''
                  }`}
                >
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 text-white">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="text-sm text-purple-100 mb-1">礼品卡余额</div>
                        <div className="text-3xl font-bold">
                          ¥{card.balance.toLocaleString()}
                        </div>
                      </div>
                      {isExpired ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-600 text-white">
                          已过期
                        </span>
                      ) : isExpiringSoon ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-500 text-white">
                          即将过期
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
                          有效
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/20">
                      <div className="font-mono text-sm">{card.code}</div>
                      <button
                        onClick={() => handleCopyCode(card.code)}
                        className="text-white hover:text-purple-100 text-sm font-medium"
                      >
                        复制
                      </button>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">原始金额：</span>
                        <span className="font-medium">¥{card.originalAmount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">已使用：</span>
                        <span className="font-medium">
                          ¥{card.originalAmount - card.balance}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">有效期至：</span>
                        <span
                          className={`font-medium ${
                            isExpired
                              ? 'text-red-600'
                              : isExpiringSoon
                              ? 'text-orange-600'
                              : ''
                          }`}
                        >
                          {new Date(card.expiryDate).toLocaleDateString()}
                        </span>
                      </div>
                      {!isExpired && daysUntilExpiry <= 90 && (
                        <div className="text-xs text-orange-600">
                          还剩 {daysUntilExpiry} 天有效期
                        </div>
                      )}
                    </div>

                    {card.usageHistory.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="text-sm font-medium text-gray-900 mb-2">
                          使用记录
                        </div>
                        <div className="space-y-2">
                          {card.usageHistory.map((usage, index) => (
                            <div
                              key={index}
                              className="flex justify-between text-xs text-gray-600"
                            >
                              <span>订单 {usage.orderId}</span>
                              <span>-¥{usage.amount}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Info */}
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
                <h3 className="font-semibold text-gray-900 mb-2">礼品卡使用说明</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 礼品卡可在结账时抵扣订单金额</li>
                  <li>• 一个订单可使用多张礼品卡</li>
                  <li>• 礼品卡不可兑换现金，不找零</li>
                  <li>• 礼品卡有效期通常为1-3年，请及时使用</li>
                  <li>• 购买的礼品卡将发送至收件人邮箱</li>
                  <li>• 礼品卡代码请妥善保管，遗失不补</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
