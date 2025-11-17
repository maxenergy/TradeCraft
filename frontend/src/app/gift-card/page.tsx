'use client';

import React, { useState } from 'react';
import { useNotification } from '@/contexts/NotificationContext';

interface GiftCardTemplate {
  id: string;
  name: string;
  image: string;
  category: 'birthday' | 'holiday' | 'wedding' | 'general' | 'corporate';
}

interface GiftCardAmount {
  value: number;
  popular?: boolean;
}

interface MyGiftCard {
  id: string;
  code: string;
  balance: number;
  originalAmount: number;
  expiryDate: string;
  status: 'active' | 'used' | 'expired';
  template: string;
}

interface Transaction {
  id: string;
  date: string;
  type: 'purchase' | 'redeem' | 'send' | 'receive';
  amount: number;
  description: string;
  status: 'completed' | 'pending';
}

export default function GiftCardPage() {
  const notification = useNotification();
  const [activeTab, setActiveTab] = useState<'buy' | 'redeem' | 'my-cards' | 'history'>('buy');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [personalMessage, setPersonalMessage] = useState('');
  const [sendDate, setSendDate] = useState<string>('');
  const [redeemCode, setRedeemCode] = useState('');

  const templates: GiftCardTemplate[] = [
    {
      id: 'tpl-1',
      name: '生日快乐',
      image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600',
      category: 'birthday',
    },
    {
      id: 'tpl-2',
      name: '节日祝福',
      image: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=600',
      category: 'holiday',
    },
    {
      id: 'tpl-3',
      name: '新婚快乐',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600',
      category: 'wedding',
    },
    {
      id: 'tpl-4',
      name: '感谢有你',
      image: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=600',
      category: 'general',
    },
    {
      id: 'tpl-5',
      name: '企业礼赠',
      image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=600',
      category: 'corporate',
    },
    {
      id: 'tpl-6',
      name: '通用礼品卡',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600',
      category: 'general',
    },
  ];

  const amounts: GiftCardAmount[] = [
    { value: 50 },
    { value: 100, popular: true },
    { value: 200, popular: true },
    { value: 500 },
    { value: 1000 },
    { value: 2000 },
  ];

  const myGiftCards: MyGiftCard[] = [
    {
      id: 'card-1',
      code: 'GIFT-2024-ABCD1234',
      balance: 850,
      originalAmount: 1000,
      expiryDate: '2025-12-31',
      status: 'active',
      template: 'tpl-1',
    },
    {
      id: 'card-2',
      code: 'GIFT-2024-EFGH5678',
      balance: 200,
      originalAmount: 200,
      expiryDate: '2025-06-30',
      status: 'active',
      template: 'tpl-4',
    },
    {
      id: 'card-3',
      code: 'GIFT-2023-IJKL9012',
      balance: 0,
      originalAmount: 500,
      expiryDate: '2024-12-31',
      status: 'used',
      template: 'tpl-2',
    },
  ];

  const transactions: Transaction[] = [
    {
      id: 'txn-1',
      date: '2024-11-15',
      type: 'purchase',
      amount: 1000,
      description: '购买礼品卡',
      status: 'completed',
    },
    {
      id: 'txn-2',
      date: '2024-11-10',
      type: 'redeem',
      amount: 150,
      description: '使用礼品卡支付订单 #12345',
      status: 'completed',
    },
    {
      id: 'txn-3',
      date: '2024-11-05',
      type: 'receive',
      amount: 200,
      description: '收到来自张三的礼品卡',
      status: 'completed',
    },
    {
      id: 'txn-4',
      date: '2024-10-28',
      type: 'send',
      amount: 500,
      description: '赠送礼品卡给李四',
      status: 'completed',
    },
  ];

  const handlePurchaseGiftCard = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTemplate) {
      notification.warning('请选择模板', '请选择一个礼品卡模板');
      return;
    }

    const amount = selectedAmount || parseFloat(customAmount);
    if (!amount || amount < 10 || amount > 10000) {
      notification.error('金额无效', '金额必须在10-10000元之间');
      return;
    }

    if (recipientEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(recipientEmail)) {
        notification.error('邮箱格式错误', '请输入有效的邮箱地址');
        return;
      }
    }

    // TODO: Implement purchase gift card functionality
    notification.success('购买成功', `已购买¥${amount}礼品卡${recipientEmail ? '并发送给' + recipientEmail : ''}`);

    // Reset form
    setSelectedTemplate('');
    setSelectedAmount(0);
    setCustomAmount('');
    setRecipientEmail('');
    setRecipientName('');
    setPersonalMessage('');
    setSendDate('');
  };

  const handleRedeemGiftCard = (e: React.FormEvent) => {
    e.preventDefault();

    if (!redeemCode.trim()) {
      notification.warning('请输入兑换码', '请输入有效的礼品卡兑换码');
      return;
    }

    // TODO: Implement redeem gift card functionality
    notification.success('兑换成功', '礼品卡已成功添加到您的账户');
    setRedeemCode('');
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    notification.success('复制成功', '兑换码已复制到剪贴板');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'used':
        return 'text-gray-600 bg-gray-100';
      case 'expired':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '可用';
      case 'used':
        return '已使用';
      case 'expired':
        return '已过期';
      default:
        return status;
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return '🛒';
      case 'redeem':
        return '💳';
      case 'send':
        return '📤';
      case 'receive':
        return '📥';
      default:
        return '💰';
    }
  };

  const totalBalance = myGiftCards
    .filter(card => card.status === 'active')
    .reduce((sum, card) => sum + card.balance, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                礼品卡中心
              </h1>
              <p className="text-gray-600 mt-1">送礼佳选，心意传递</p>
            </div>
            <div className="bg-gradient-to-r from-pink-100 to-purple-100 px-6 py-3 rounded-lg">
              <p className="text-sm text-pink-700 mb-1">可用余额</p>
              <p className="text-2xl font-bold text-pink-700">¥{totalBalance.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-pink-100">
          <button
            onClick={() => setActiveTab('buy')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'buy'
                ? 'text-pink-600 border-b-2 border-pink-600'
                : 'text-gray-600 hover:text-pink-600'
            }`}
          >
            购买礼品卡
          </button>
          <button
            onClick={() => setActiveTab('redeem')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'redeem'
                ? 'text-pink-600 border-b-2 border-pink-600'
                : 'text-gray-600 hover:text-pink-600'
            }`}
          >
            兑换礼品卡
          </button>
          <button
            onClick={() => setActiveTab('my-cards')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'my-cards'
                ? 'text-pink-600 border-b-2 border-pink-600'
                : 'text-gray-600 hover:text-pink-600'
            }`}
          >
            我的礼品卡
            {myGiftCards.filter(c => c.status === 'active').length > 0 && (
              <span className="ml-2 bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">
                {myGiftCards.filter(c => c.status === 'active').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'history'
                ? 'text-pink-600 border-b-2 border-pink-600'
                : 'text-gray-600 hover:text-pink-600'
            }`}
          >
            交易记录
          </button>
        </div>

        {/* Buy Gift Card Tab */}
        {activeTab === 'buy' && (
          <form onSubmit={handlePurchaseGiftCard}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Configuration */}
              <div className="lg:col-span-2 space-y-6">
                {/* Template Selection */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">选择模板</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        onClick={() => setSelectedTemplate(template.id)}
                        className={`relative cursor-pointer rounded-lg overflow-hidden transition-all ${
                          selectedTemplate === template.id
                            ? 'ring-4 ring-pink-500 shadow-xl'
                            : 'hover:shadow-lg'
                        }`}
                      >
                        <img
                          src={template.image}
                          alt={template.name}
                          className="w-full h-40 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <p className="text-white font-bold">{template.name}</p>
                        </div>
                        {selectedTemplate === template.id && (
                          <div className="absolute top-2 right-2 bg-pink-500 text-white p-1 rounded-full">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amount Selection */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">选择金额</h2>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-4">
                    {amounts.map((amount) => (
                      <button
                        key={amount.value}
                        type="button"
                        onClick={() => {
                          setSelectedAmount(amount.value);
                          setCustomAmount('');
                        }}
                        className={`relative py-4 rounded-lg border-2 font-bold transition-all ${
                          selectedAmount === amount.value
                            ? 'border-pink-500 bg-pink-50 text-pink-700'
                            : 'border-gray-200 hover:border-pink-300'
                        }`}
                      >
                        ¥{amount.value}
                        {amount.popular && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                            热门
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      自定义金额 (¥10 - ¥10,000)
                    </label>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setSelectedAmount(0);
                      }}
                      min="10"
                      max="10000"
                      placeholder="输入金额"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Recipient Info (Optional) */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">赠送信息（可选）</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        收件人姓名
                      </label>
                      <input
                        type="text"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        placeholder="张三"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        收件人邮箱
                      </label>
                      <input
                        type="email"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        placeholder="example@email.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        个人祝福语
                      </label>
                      <textarea
                        value={personalMessage}
                        onChange={(e) => setPersonalMessage(e.target.value)}
                        rows={3}
                        placeholder="写下您的祝福..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        定时发送
                      </label>
                      <input
                        type="datetime-local"
                        value={sendDate}
                        onChange={(e) => setSendDate(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">订单摘要</h3>

                  {selectedTemplate && (
                    <div className="mb-4">
                      <img
                        src={templates.find(t => t.id === selectedTemplate)?.image}
                        alt="Selected template"
                        className="w-full h-32 object-cover rounded-lg mb-2"
                      />
                      <p className="text-sm text-gray-600">
                        模板: {templates.find(t => t.id === selectedTemplate)?.name}
                      </p>
                    </div>
                  )}

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">金额</span>
                      <span className="font-bold">
                        ¥{(selectedAmount || parseFloat(customAmount) || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">手续费</span>
                      <span className="font-bold text-green-600">免费</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between text-lg">
                        <span className="font-bold">总计</span>
                        <span className="font-bold text-pink-600">
                          ¥{(selectedAmount || parseFloat(customAmount) || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {recipientEmail && (
                    <div className="bg-pink-50 rounded-lg p-3 mb-4">
                      <p className="text-sm text-pink-700">
                        📧 将发送至: {recipientEmail}
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all font-bold"
                  >
                    {recipientEmail ? '购买并发送' : '立即购买'}
                  </button>

                  <div className="mt-4 space-y-2 text-xs text-gray-500">
                    <p>• 礼品卡自购买之日起3年内有效</p>
                    <p>• 可在全站使用，不限商品</p>
                    <p>• 不可兑换现金，不找零</p>
                    <p>• 支持多张礼品卡叠加使用</p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* Redeem Gift Card Tab */}
        {activeTab === 'redeem' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🎁</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">兑换礼品卡</h2>
                <p className="text-gray-600">输入您收到的礼品卡兑换码</p>
              </div>

              <form onSubmit={handleRedeemGiftCard}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    兑换码
                  </label>
                  <input
                    type="text"
                    value={redeemCode}
                    onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
                    placeholder="GIFT-2024-XXXXXXXX"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-center text-lg font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all font-bold"
                >
                  兑换
                </button>
              </form>

              <div className="mt-8 bg-pink-50 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 mb-2">温馨提示</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 兑换码格式: GIFT-YYYY-XXXXXXXX</li>
                  <li>• 每个兑换码只能使用一次</li>
                  <li>• 兑换后余额将自动添加到您的账户</li>
                  <li>• 如有问题，请联系客服</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* My Gift Cards Tab */}
        {activeTab === 'my-cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myGiftCards.map((card) => {
              const template = templates.find(t => t.id === card.template);
              return (
                <div
                  key={card.id}
                  className={`bg-white rounded-xl shadow-md overflow-hidden ${
                    card.status === 'active' ? 'hover:shadow-xl transition-all' : 'opacity-60'
                  }`}
                >
                  <div className="relative h-40">
                    <img
                      src={template?.image}
                      alt={template?.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(card.status)}`}>
                        {getStatusText(card.status)}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 mb-2">{template?.name}</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">余额</span>
                        <span className="font-bold text-pink-600">¥{card.balance.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">原始金额</span>
                        <span className="text-gray-900">¥{card.originalAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">有效期至</span>
                        <span className="text-gray-900">{card.expiryDate}</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-xs text-gray-600 mb-1">兑换码</p>
                      <div className="flex items-center justify-between">
                        <code className="text-sm font-mono text-gray-900">{card.code}</code>
                        <button
                          onClick={() => handleCopyCode(card.code)}
                          className="text-pink-600 hover:text-pink-700"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    {card.status === 'active' && (
                      <button className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-2 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all font-medium">
                        使用礼品卡
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Transaction History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">交易记录</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {transactions.map((txn) => (
                <div key={txn.id} className="p-6 hover:bg-gray-50 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{getTransactionIcon(txn.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-bold text-gray-900">{txn.description}</h3>
                        <span className={`text-lg font-bold ${txn.type === 'purchase' || txn.type === 'send' ? 'text-red-600' : 'text-green-600'}`}>
                          {txn.type === 'purchase' || txn.type === 'send' ? '-' : '+'}¥{txn.amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{txn.date}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          txn.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {txn.status === 'completed' ? '已完成' : '处理中'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
