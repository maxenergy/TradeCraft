'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useNotification } from '@/contexts/NotificationContext';

interface SecurityInfo {
  phone: string;
  email: string;
  twoFactorEnabled: boolean;
  lastPasswordChange: string;
  securityLevel: 'low' | 'medium' | 'high';
}

interface LoginHistory {
  id: string;
  device: string;
  browser: string;
  location: string;
  ip: string;
  time: string;
  status: 'success' | 'failed';
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PhoneForm {
  phone: string;
  verificationCode: string;
}

interface EmailForm {
  email: string;
  verificationCode: string;
}

export default function SecurityPage() {
  const notification = useNotification();
  const [securityInfo, setSecurityInfo] = useState<SecurityInfo | null>(null);
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'password' | 'phone' | 'email' | 'twoFactor' | 'history'>('password');

  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [phoneForm, setPhoneForm] = useState<PhoneForm>({
    phone: '',
    verificationCode: '',
  });

  const [emailForm, setEmailForm] = useState<EmailForm>({
    email: '',
    verificationCode: '',
  });

  const [codeSentPhone, setCodeSentPhone] = useState(false);
  const [codeSentEmail, setCodeSentEmail] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    const loadSecurityInfo = async () => {
      setIsLoading(true);
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/profile/security');
        // const data = await response.json();

        // Mock data
        const mockInfo: SecurityInfo = {
          phone: '138****8888',
          email: 'user@example.com',
          twoFactorEnabled: false,
          lastPasswordChange: '2024-01-10T10:00:00Z',
          securityLevel: 'medium',
        };

        const mockHistory: LoginHistory[] = [
          {
            id: '1',
            device: 'Windows PC',
            browser: 'Chrome 120',
            location: '北京市',
            ip: '192.168.1.100',
            time: '2024-01-18T10:30:00Z',
            status: 'success',
          },
          {
            id: '2',
            device: 'iPhone 15 Pro',
            browser: 'Safari',
            location: '上海市',
            ip: '192.168.1.101',
            time: '2024-01-17T14:20:00Z',
            status: 'success',
          },
          {
            id: '3',
            device: 'Android Phone',
            browser: 'Chrome Mobile',
            location: '广州市',
            ip: '192.168.1.102',
            time: '2024-01-16T09:15:00Z',
            status: 'failed',
          },
          {
            id: '4',
            device: 'Windows PC',
            browser: 'Edge 120',
            location: '深圳市',
            ip: '192.168.1.103',
            time: '2024-01-15T16:45:00Z',
            status: 'success',
          },
        ];

        setSecurityInfo(mockInfo);
        setLoginHistory(mockHistory);
      } catch (error) {
        console.error('Failed to load security info:', error);
        notification.error('加载失败', '无法加载安全信息');
      } finally {
        setIsLoading(false);
      }
    };

    loadSecurityInfo();
  }, [notification]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      notification.warning('请填写完整', '请填写所有密码字段');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      notification.error('密码太短', '新密码至少需要8个字符');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      notification.error('密码不一致', '两次输入的新密码不一致');
      return;
    }

    // Password strength validation
    const hasUpperCase = /[A-Z]/.test(passwordForm.newPassword);
    const hasLowerCase = /[a-z]/.test(passwordForm.newPassword);
    const hasNumber = /[0-9]/.test(passwordForm.newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(passwordForm.newPassword);

    if (!(hasUpperCase && hasLowerCase && hasNumber)) {
      notification.error('密码强度不足', '密码必须包含大小写字母和数字');
      return;
    }

    try {
      // TODO: Replace with actual API call
      // await fetch('/api/profile/security/password', {
      //   method: 'PUT',
      //   body: JSON.stringify({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword }),
      // });

      notification.success('修改成功', '密码已更新');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      if (securityInfo) {
        setSecurityInfo({
          ...securityInfo,
          lastPasswordChange: new Date().toISOString(),
        });
      }
    } catch (error) {
      notification.error('修改失败', '无法更新密码');
    }
  };

  const handleSendPhoneCode = async () => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phoneForm.phone)) {
      notification.error('手机号格式错误', '请输入有效的11位手机号');
      return;
    }

    try {
      // TODO: Replace with actual API call
      // await fetch('/api/verification/phone', {
      //   method: 'POST',
      //   body: JSON.stringify({ phone: phoneForm.phone }),
      // });

      setCodeSentPhone(true);
      setCountdown(60);
      notification.success('发送成功', '验证码已发送到您的手机');
    } catch (error) {
      notification.error('发送失败', '无法发送验证码');
    }
  };

  const handleBindPhone = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneForm.phone || !phoneForm.verificationCode) {
      notification.warning('请填写完整', '请填写手机号和验证码');
      return;
    }

    if (phoneForm.verificationCode.length !== 6) {
      notification.error('验证码错误', '请输入6位验证码');
      return;
    }

    try {
      // TODO: Replace with actual API call
      // await fetch('/api/profile/security/phone', {
      //   method: 'PUT',
      //   body: JSON.stringify({ phone: phoneForm.phone, code: phoneForm.verificationCode }),
      // });

      notification.success('绑定成功', '手机号已更新');

      if (securityInfo) {
        const maskedPhone = phoneForm.phone.slice(0, 3) + '****' + phoneForm.phone.slice(-4);
        setSecurityInfo({
          ...securityInfo,
          phone: maskedPhone,
        });
      }

      setPhoneForm({ phone: '', verificationCode: '' });
      setCodeSentPhone(false);
    } catch (error) {
      notification.error('绑定失败', '无法绑定手机号');
    }
  };

  const handleSendEmailCode = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailForm.email)) {
      notification.error('邮箱格式错误', '请输入有效的邮箱地址');
      return;
    }

    try {
      // TODO: Replace with actual API call
      // await fetch('/api/verification/email', {
      //   method: 'POST',
      //   body: JSON.stringify({ email: emailForm.email }),
      // });

      setCodeSentEmail(true);
      setCountdown(60);
      notification.success('发送成功', '验证码已发送到您的邮箱');
    } catch (error) {
      notification.error('发送失败', '无法发送验证码');
    }
  };

  const handleBindEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailForm.email || !emailForm.verificationCode) {
      notification.warning('请填写完整', '请填写邮箱和验证码');
      return;
    }

    if (emailForm.verificationCode.length !== 6) {
      notification.error('验证码错误', '请输入6位验证码');
      return;
    }

    try {
      // TODO: Replace with actual API call
      // await fetch('/api/profile/security/email', {
      //   method: 'PUT',
      //   body: JSON.stringify({ email: emailForm.email, code: emailForm.verificationCode }),
      // });

      notification.success('绑定成功', '邮箱已更新');

      if (securityInfo) {
        setSecurityInfo({
          ...securityInfo,
          email: emailForm.email,
        });
      }

      setEmailForm({ email: '', verificationCode: '' });
      setCodeSentEmail(false);
    } catch (error) {
      notification.error('绑定失败', '无法绑定邮箱');
    }
  };

  const handleToggleTwoFactor = async () => {
    if (!securityInfo) return;

    try {
      // TODO: Replace with actual API call
      // await fetch('/api/profile/security/two-factor', {
      //   method: 'PUT',
      //   body: JSON.stringify({ enabled: !securityInfo.twoFactorEnabled }),
      // });

      setSecurityInfo({
        ...securityInfo,
        twoFactorEnabled: !securityInfo.twoFactorEnabled,
      });

      notification.success(
        securityInfo.twoFactorEnabled ? '已关闭' : '已开启',
        securityInfo.twoFactorEnabled ? '双因素认证已关闭' : '双因素认证已开启'
      );
    } catch (error) {
      notification.error('操作失败', '无法更改双因素认证设置');
    }
  };

  const getSecurityLevelColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getSecurityLevelLabel = (level: string) => {
    switch (level) {
      case 'high':
        return '高';
      case 'medium':
        return '中';
      case 'low':
        return '低';
      default:
        return '未知';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600">加载安全信息...</p>
        </div>
      </div>
    );
  }

  if (!securityInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">加载数据失败</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">账户安全</h1>
          <p className="text-gray-600">管理您的账户安全设置，保护账户信息</p>
        </div>

        {/* Security Level */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">安全等级</h2>
                <p className="text-gray-600">
                  您的账户安全等级：
                  <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${getSecurityLevelColor(securityInfo.securityLevel)}`}>
                    {getSecurityLevelLabel(securityInfo.securityLevel)}
                  </span>
                </p>
              </div>
              <svg className="w-16 h-16 text-primary-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            {securityInfo.securityLevel !== 'high' && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <span className="font-medium">提示：</span>
                  建议启用双因素认证并定期更改密码以提高账户安全等级
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('password')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'password'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              修改密码
            </button>
            <button
              onClick={() => setActiveTab('phone')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'phone'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              绑定手机
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'email'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              绑定邮箱
            </button>
            <button
              onClick={() => setActiveTab('twoFactor')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'twoFactor'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              双因素认证
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'history'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              登录历史
            </button>
          </div>
        </div>

        {/* Password Change */}
        {activeTab === 'password' && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">修改密码</h2>
              <p className="text-sm text-gray-600 mb-6">
                上次修改时间：{new Date(securityInfo.lastPasswordChange).toLocaleString()}
              </p>

              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    当前密码 <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="请输入当前密码"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    新密码 <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="请输入新密码"
                  />
                  <p className="mt-2 text-xs text-gray-600">
                    密码至少8位，必须包含大小写字母和数字
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    确认新密码 <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="请再次输入新密码"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full md:w-auto">
                  确认修改
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Phone Binding */}
        {activeTab === 'phone' && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">绑定手机</h2>
              <p className="text-sm text-gray-600 mb-6">
                当前绑定手机：{securityInfo.phone}
              </p>

              <form onSubmit={handleBindPhone} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    新手机号 <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phoneForm.phone}
                    onChange={(e) => setPhoneForm({ ...phoneForm, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="请输入11位手机号"
                    maxLength={11}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    验证码 <span className="text-red-600">*</span>
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={phoneForm.verificationCode}
                      onChange={(e) =>
                        setPhoneForm({ ...phoneForm, verificationCode: e.target.value })
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="请输入6位验证码"
                      maxLength={6}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSendPhoneCode}
                      disabled={countdown > 0 || !phoneForm.phone}
                      className="whitespace-nowrap"
                    >
                      {countdown > 0 ? `${countdown}秒后重试` : codeSentPhone ? '重新发送' : '发送验证码'}
                    </Button>
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full md:w-auto">
                  确认绑定
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Email Binding */}
        {activeTab === 'email' && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">绑定邮箱</h2>
              <p className="text-sm text-gray-600 mb-6">
                当前绑定邮箱：{securityInfo.email}
              </p>

              <form onSubmit={handleBindEmail} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    新邮箱地址 <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    value={emailForm.email}
                    onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="请输入邮箱地址"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    验证码 <span className="text-red-600">*</span>
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={emailForm.verificationCode}
                      onChange={(e) =>
                        setEmailForm({ ...emailForm, verificationCode: e.target.value })
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="请输入6位验证码"
                      maxLength={6}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSendEmailCode}
                      disabled={countdown > 0 || !emailForm.email}
                      className="whitespace-nowrap"
                    >
                      {countdown > 0 ? `${countdown}秒后重试` : codeSentEmail ? '重新发送' : '发送验证码'}
                    </Button>
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full md:w-auto">
                  确认绑定
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Two-Factor Authentication */}
        {activeTab === 'twoFactor' && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">双因素认证</h2>
                  <p className="text-sm text-gray-600">
                    启用后，每次登录都需要输入短信验证码，大大提高账户安全性
                  </p>
                </div>
                <button
                  onClick={handleToggleTwoFactor}
                  className={`relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                    securityInfo.twoFactorEnabled ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      securityInfo.twoFactorEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {securityInfo.twoFactorEnabled ? (
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-green-900 mb-1">双因素认证已启用</h3>
                      <p className="text-sm text-green-800">
                        您的账户受到额外保护。登录时将需要输入发送到您手机的验证码。
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-yellow-900 mb-1">双因素认证未启用</h3>
                      <p className="text-sm text-yellow-800">
                        建议启用双因素认证以增强账户安全性
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 space-y-4">
                <h3 className="font-medium text-gray-900">双因素认证优势：</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-primary-600 mr-2 flex-shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    即使密码泄露，他人也无法登录您的账户
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-primary-600 mr-2 flex-shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    防止未经授权的登录尝试
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-primary-600 mr-2 flex-shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    保护您的个人信息和订单数据
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-primary-600 mr-2 flex-shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    异常登录即时通知
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Login History */}
        {activeTab === 'history' && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">登录历史</h2>

              <div className="space-y-4">
                {loginHistory.map((record) => (
                  <div
                    key={record.id}
                    className={`p-4 rounded-lg border ${
                      record.status === 'success'
                        ? 'bg-white border-gray-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className={`flex-shrink-0 ${record.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                          {record.status === 'success' ? (
                            <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          ) : (
                            <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-gray-900">{record.device}</h3>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                record.status === 'success'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {record.status === 'success' ? '成功' : '失败'}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>浏览器：{record.browser}</p>
                            <p>位置：{record.location}</p>
                            <p>IP：{record.ip}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 whitespace-nowrap">
                        {new Date(record.time).toLocaleString()}
                      </div>
                    </div>

                    {record.status === 'failed' && (
                      <div className="mt-3 p-3 bg-red-100 rounded text-sm text-red-800">
                        <span className="font-medium">安全提示：</span>
                        如果这不是您的登录尝试，请立即修改密码并启用双因素认证
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">提示：</span>
                  我们会保留最近30天的登录记录。如发现异常登录活动，请立即联系客服。
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
