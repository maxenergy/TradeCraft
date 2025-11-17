'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [errors, setErrors] = useState<Partial<ProfileFormData>>({});

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      // TODO: Implement API call to fetch user profile
      // const response = await userApi.getProfile();
      // setUser(response.data.data);
      // setFormData({
      //   firstName: response.data.data.firstName,
      //   lastName: response.data.data.lastName,
      //   email: response.data.data.email,
      //   phone: response.data.data.phone || '',
      // });
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name as keyof ProfileFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ProfileFormData> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = '请输入名字';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = '请输入姓氏';
    }

    if (!formData.email.trim()) {
      newErrors.email = '请输入邮箱';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }

    if (formData.phone && !/^[+]?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = '请输入有效的电话号码';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      // TODO: Implement API call to update profile
      // await userApi.updateProfile(formData);
      alert('个人资料已更新');
      setEditing(false);
      fetchUserProfile();
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      alert(error.response?.data?.message || '更新失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || '',
      });
    }
    setErrors({});
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">个人中心</h1>
          <p className="text-gray-600 mt-1">管理您的个人信息和账户设置</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <nav className="space-y-1">
                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-3 text-sm font-medium bg-primary-50 text-primary-700 rounded-md"
                  >
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    个人资料
                  </Link>

                  <Link
                    href="/profile/addresses"
                    className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    收货地址
                  </Link>

                  <Link
                    href="/profile/password"
                    className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    修改密码
                  </Link>

                  <Link
                    href="/orders"
                    className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    我的订单
                  </Link>

                  <Link
                    href="/wishlist"
                    className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    我的收藏
                  </Link>
                </nav>

                <div className="mt-6 pt-6 border-t">
                  <button
                    onClick={() => {
                      // TODO: Implement logout
                      router.push('/login');
                    }}
                    className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    退出登录
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">个人资料</h2>
                  {!editing && (
                    <Button onClick={() => setEditing(true)} variant="outline" size="sm">
                      编辑资料
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {editing ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* First Name */}
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        名字 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          errors.firstName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                      )}
                    </div>

                    {/* Last Name */}
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        姓氏 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          errors.lastName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        邮箱地址 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        电话号码
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="+62 812 3456 7890"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                      )}
                    </div>

                    {/* Form Actions */}
                    <div className="flex space-x-3 pt-4 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        className="flex-1"
                        disabled={submitting}
                      >
                        取消
                      </Button>
                      <Button type="submit" className="flex-1" disabled={submitting}>
                        {submitting ? '保存中...' : '保存更改'}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-6">
                      <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                        <svg
                          className="w-12 h-12 text-gray-400"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {user?.firstName} {user?.lastName}
                        </h3>
                        <p className="text-sm text-gray-500">会员自 {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('zh-CN') : '-'}</p>
                      </div>
                    </div>

                    <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">邮箱地址</p>
                        <p className="text-sm font-medium text-gray-900">{user?.email || '-'}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 mb-1">电话号码</p>
                        <p className="text-sm font-medium text-gray-900">{user?.phone || '未设置'}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 mb-1">账户状态</p>
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {user?.isActive ? '活跃' : '未激活'}
                        </span>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 mb-1">用户角色</p>
                        <p className="text-sm font-medium text-gray-900">
                          {user?.roles?.includes('ADMIN') ? '管理员' : '普通用户'}
                        </p>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-4">账户统计</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                          <p className="text-2xl font-bold text-primary-600">0</p>
                          <p className="text-xs text-gray-600 mt-1">总订单数</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                          <p className="text-2xl font-bold text-green-600">¥0</p>
                          <p className="text-xs text-gray-600 mt-1">累计消费</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                          <p className="text-2xl font-bold text-purple-600">0</p>
                          <p className="text-xs text-gray-600 mt-1">收藏商品</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                          <p className="text-2xl font-bold text-blue-600">0</p>
                          <p className="text-xs text-gray-600 mt-1">评价数</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
