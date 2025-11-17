'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useNotification } from '@/contexts/NotificationContext';

interface PaymentMethod {
  id: string;
  type: 'credit' | 'debit' | 'alipay' | 'wechat';
  cardNumber: string;
  cardHolder: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
  cardBrand?: 'visa' | 'mastercard' | 'amex' | 'unionpay';
}

export default function PaymentMethodsPage() {
  const notification = useNotification();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'credit' as 'credit' | 'debit' | 'alipay' | 'wechat',
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    isDefault: false,
  });

  useEffect(() => {
    const loadPaymentMethods = async () => {
      setIsLoading(true);
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/user/payment-methods');
        // const data = await response.json();

        // Mock data for demonstration
        const mockMethods: PaymentMethod[] = [
          {
            id: '1',
            type: 'credit',
            cardNumber: '**** **** **** 1234',
            cardHolder: '张三',
            expiryMonth: '12',
            expiryYear: '2025',
            isDefault: true,
            cardBrand: 'visa',
          },
          {
            id: '2',
            type: 'credit',
            cardNumber: '**** **** **** 5678',
            cardHolder: '张三',
            expiryMonth: '06',
            expiryYear: '2026',
            isDefault: false,
            cardBrand: 'mastercard',
          },
        ];

        setPaymentMethods(mockMethods);
      } catch (error) {
        console.error('Failed to load payment methods:', error);
        notification.error('加载失败', '无法加载支付方式');
      } finally {
        setIsLoading(false);
      }
    };

    loadPaymentMethods();
  }, [notification]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.cardNumber || !formData.cardHolder || !formData.expiryMonth || !formData.expiryYear || !formData.cvv) {
      notification.warning('请填写完整', '请填写所有必填字段');
      return;
    }

    // Card number validation (remove spaces and check length)
    const cleanCardNumber = formData.cardNumber.replace(/\s/g, '');
    if (cleanCardNumber.length < 15 || cleanCardNumber.length > 19) {
      notification.error('卡号格式错误', '请输入有效的银行卡号');
      return;
    }

    // CVV validation
    if (formData.cvv.length < 3 || formData.cvv.length > 4) {
      notification.error('CVV格式错误', '请输入3-4位CVV安全码');
      return;
    }

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/user/payment-methods', {
      //   method: 'POST',
      //   body: JSON.stringify(formData),
      // });

      // Mask card number for display
      const maskedNumber = '**** **** **** ' + cleanCardNumber.slice(-4);

      // Detect card brand
      const firstDigit = cleanCardNumber[0];
      let cardBrand: PaymentMethod['cardBrand'];
      if (firstDigit === '4') cardBrand = 'visa';
      else if (firstDigit === '5') cardBrand = 'mastercard';
      else if (firstDigit === '3') cardBrand = 'amex';
      else if (firstDigit === '6') cardBrand = 'unionpay';

      const newMethod: PaymentMethod = {
        id: Date.now().toString(),
        type: formData.type,
        cardNumber: maskedNumber,
        cardHolder: formData.cardHolder,
        expiryMonth: formData.expiryMonth,
        expiryYear: formData.expiryYear,
        isDefault: formData.isDefault,
        cardBrand,
      };

      setPaymentMethods(
        formData.isDefault
          ? [...paymentMethods.map((m) => ({ ...m, isDefault: false })), newMethod]
          : [...paymentMethods, newMethod]
      );

      notification.success('添加成功', '支付方式已添加');
      setShowForm(false);
      setFormData({
        type: 'credit',
        cardNumber: '',
        cardHolder: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        isDefault: false,
      });
    } catch (error) {
      console.error('Failed to add payment method:', error);
      notification.error('添加失败', '无法添加支付方式');
    }
  };

  const handleDelete = async (methodId: string) => {
    const method = paymentMethods.find((m) => m.id === methodId);
    if (method?.isDefault) {
      notification.warning('无法删除', '默认支付方式不能删除，请先设置其他支付方式为默认');
      return;
    }

    if (!confirm('确定要删除这个支付方式吗？')) {
      return;
    }

    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/user/payment-methods/${methodId}`, { method: 'DELETE' });

      setPaymentMethods(paymentMethods.filter((m) => m.id !== methodId));
      notification.success('删除成功', '支付方式已删除');
    } catch (error) {
      console.error('Failed to delete payment method:', error);
      notification.error('删除失败', '无法删除支付方式');
    }
  };

  const handleSetDefault = async (methodId: string) => {
    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/user/payment-methods/${methodId}/set-default`, { method: 'POST' });

      setPaymentMethods(
        paymentMethods.map((m) => ({
          ...m,
          isDefault: m.id === methodId,
        }))
      );
      notification.success('设置成功', '默认支付方式已更新');
    } catch (error) {
      console.error('Failed to set default payment method:', error);
      notification.error('设置失败', '无法设置默认支付方式');
    }
  };

  const getCardBrandIcon = (brand?: string) => {
    switch (brand) {
      case 'visa':
        return (
          <div className="text-blue-600 font-bold text-lg">VISA</div>
        );
      case 'mastercard':
        return (
          <div className="text-red-600 font-bold text-lg">Mastercard</div>
        );
      case 'amex':
        return (
          <div className="text-blue-500 font-bold text-lg">AMEX</div>
        );
      case 'unionpay':
        return (
          <div className="text-red-700 font-bold text-lg">银联</div>
        );
      default:
        return (
          <div className="text-gray-600 font-bold text-lg">CARD</div>
        );
    }
  };

  const formatCardInput = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600">加载支付方式...</p>
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <button
              onClick={() => setShowForm(false)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <svg className="w-5 h-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M15 19l-7-7 7-7" />
              </svg>
              返回支付方式列表
            </button>
          </div>

          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900">添加支付方式</h2>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    支付类型 <span className="text-red-600">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'credit' })}
                      className={`p-4 border-2 rounded-lg text-center transition-colors ${
                        formData.type === 'credit'
                          ? 'border-primary-600 bg-primary-50 text-primary-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <svg className="w-8 h-8 mx-auto mb-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <div className="font-medium">信用卡</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'debit' })}
                      className={`p-4 border-2 rounded-lg text-center transition-colors ${
                        formData.type === 'debit'
                          ? 'border-primary-600 bg-primary-50 text-primary-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <svg className="w-8 h-8 mx-auto mb-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <div className="font-medium">借记卡</div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    卡号 <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.cardNumber}
                    onChange={(e) => {
                      const formatted = formatCardInput(e.target.value);
                      if (formatted.replace(/\s/g, '').length <= 19) {
                        setFormData({ ...formData, cardNumber: formatted });
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
                    placeholder="1234 5678 9012 3456"
                    maxLength={23}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    持卡人姓名 <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.cardHolder}
                    onChange={(e) => setFormData({ ...formData, cardHolder: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="ZHANG SAN"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      有效期月 <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={formData.expiryMonth}
                      onChange={(e) => setFormData({ ...formData, expiryMonth: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">月</option>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                        <option key={month} value={month.toString().padStart(2, '0')}>
                          {month.toString().padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      有效期年 <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={formData.expiryYear}
                      onChange={(e) => setFormData({ ...formData, expiryYear: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">年</option>
                      {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="password"
                      value={formData.cvv}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 4) {
                          setFormData({ ...formData, cvv: value });
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
                      placeholder="123"
                      maxLength={4}
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700 cursor-pointer">
                    设为默认支付方式
                  </label>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium mb-1">安全提示</p>
                      <p>我们使用先进的加密技术保护您的支付信息。您的卡号和CVV将被安全加密存储，我们不会在服务器上保存完整的CVV信息。</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" className="flex-1">
                    添加支付方式
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                    取消
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">支付方式</h1>
            <p className="text-gray-600">管理您的支付方式</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <svg className="w-5 h-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 4v16m8-8H4" />
            </svg>
            添加支付方式
          </Button>
        </div>

        {paymentMethods.length === 0 ? (
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
                <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无支付方式</h3>
              <p className="text-gray-600 mb-6">添加支付方式以便快速结账</p>
              <Button onClick={() => setShowForm(true)}>添加支付方式</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <Card key={method.id} className={method.isDefault ? 'border-2 border-primary-600' : ''}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        {getCardBrandIcon(method.cardBrand)}
                        {method.isDefault && (
                          <span className="ml-3 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                            默认
                          </span>
                        )}
                        <span className="ml-auto text-sm text-gray-600">
                          {method.type === 'credit' ? '信用卡' : '借记卡'}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <p className="text-lg font-mono font-semibold text-gray-900">
                          {method.cardNumber}
                        </p>
                        <div className="flex items-center text-sm text-gray-600">
                          <span>{method.cardHolder}</span>
                          <span className="mx-3">•</span>
                          <span>
                            有效期 {method.expiryMonth}/{method.expiryYear}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      {!method.isDefault && (
                        <>
                          <button
                            onClick={() => handleSetDefault(method.id)}
                            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                          >
                            设为默认
                          </button>
                          <button
                            onClick={() => handleDelete(method.id)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            删除
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Security Info */}
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
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">安全保障</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 所有支付信息使用 SSL/TLS 加密传输</li>
                  <li>• 符合 PCI DSS 支付卡行业数据安全标准</li>
                  <li>• 我们不会保存您的 CVV 安全码</li>
                  <li>• 默认支付方式不能直接删除，请先设置其他支付方式为默认</li>
                  <li>• 每次交易都需要验证密码或短信验证码</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
