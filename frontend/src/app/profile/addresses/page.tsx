'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

interface Address {
  id: number;
  name: string;
  phone: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  isDefault: boolean;
}

interface AddressFormData {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
}

const initialFormData: AddressFormData = {
  name: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  country: 'Indonesia',
  postalCode: '',
  isDefault: false,
};

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<AddressFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<AddressFormData>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      // TODO: Implement API call to fetch addresses
      // const response = await addressApi.getAddresses();
      // setAddresses(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error for this field
    if (errors[name as keyof AddressFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<AddressFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = '请输入收货人姓名';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '请输入联系电话';
    } else if (!/^[+]?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = '请输入有效的电话号码';
    }

    if (!formData.address.trim()) {
      newErrors.address = '请输入详细地址';
    }

    if (!formData.city.trim()) {
      newErrors.city = '请输入城市';
    }

    if (!formData.country.trim()) {
      newErrors.country = '请选择国家';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenCreateModal = () => {
    setEditingAddress(null);
    setFormData(initialFormData);
    setErrors({});
    setShowModal(true);
  };

  const handleOpenEditModal = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      name: address.name,
      phone: address.phone,
      address: address.address,
      city: address.city,
      state: address.state || '',
      country: address.country,
      postalCode: address.postalCode || '',
      isDefault: address.isDefault,
    });
    setErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAddress(null);
    setFormData(initialFormData);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      if (editingAddress) {
        // TODO: Implement API call to update address
        // await addressApi.updateAddress(editingAddress.id, formData);
        alert('地址已更新');
      } else {
        // TODO: Implement API call to create address
        // await addressApi.createAddress(formData);
        alert('地址已添加');
      }

      handleCloseModal();
      fetchAddresses();
    } catch (error: any) {
      console.error('Failed to save address:', error);
      alert(error.response?.data?.message || '操作失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (address: Address) => {
    if (!confirm(`确定要删除地址 "${address.name}" 吗？`)) {
      return;
    }

    try {
      // TODO: Implement API call to delete address
      // await addressApi.deleteAddress(address.id);
      alert('地址已删除');
      fetchAddresses();
    } catch (error: any) {
      console.error('Failed to delete address:', error);
      alert(error.response?.data?.message || '删除失败，请重试');
    }
  };

  const handleSetDefault = async (address: Address) => {
    try {
      // TODO: Implement API call to set default address
      // await addressApi.setDefaultAddress(address.id);
      alert('已设为默认地址');
      fetchAddresses();
    } catch (error: any) {
      console.error('Failed to set default:', error);
      alert(error.response?.data?.message || '操作失败，请重试');
    }
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
          <h1 className="text-3xl font-bold text-gray-900">收货地址管理</h1>
          <p className="text-gray-600 mt-1">管理您的收货地址信息</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <nav className="space-y-1">
                  <Link
                    href="/profile"
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
                      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    个人资料
                  </Link>

                  <Link
                    href="/profile/addresses"
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
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">我的收货地址</h2>
              <Button onClick={handleOpenCreateModal}>
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M12 4v16m8-8H4" />
                </svg>
                新增地址
              </Button>
            </div>

            {addresses.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <svg
                    className="w-16 h-16 text-gray-400 mx-auto mb-4"
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
                  <p className="text-gray-500 mb-4">您还没有保存任何收货地址</p>
                  <Button onClick={handleOpenCreateModal} variant="outline">
                    添加第一个地址
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {addresses.map((address) => (
                  <Card key={address.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h3 className="text-base font-semibold text-gray-900">
                              {address.name}
                            </h3>
                            {address.isDefault && (
                              <span className="ml-3 inline-flex px-2 py-1 text-xs font-semibold rounded bg-primary-100 text-primary-800">
                                默认地址
                              </span>
                            )}
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p>电话：{address.phone}</p>
                            <p>
                              地址：{address.address}, {address.city}
                              {address.state && `, ${address.state}`}
                              {address.postalCode && `, ${address.postalCode}`}
                            </p>
                            <p>国家：{address.country}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => handleOpenEditModal(address)}
                            className="text-primary-600 hover:text-primary-900 text-sm font-medium"
                          >
                            编辑
                          </button>
                          {!address.isDefault && (
                            <>
                              <span className="text-gray-300">|</span>
                              <button
                                onClick={() => handleSetDefault(address)}
                                className="text-green-600 hover:text-green-900 text-sm font-medium"
                              >
                                设为默认
                              </button>
                            </>
                          )}
                          <span className="text-gray-300">|</span>
                          <button
                            onClick={() => handleDelete(address)}
                            className="text-red-600 hover:text-red-900 text-sm font-medium"
                          >
                            删除
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingAddress ? '编辑地址' : '新增地址'}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={submitting}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    收货人姓名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="请输入收货人姓名"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    联系电话 <span className="text-red-500">*</span>
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
                  {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                </div>

                {/* Address */}
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    详细地址 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="街道、门牌号、楼层等详细地址"
                  />
                  {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
                </div>

                {/* City and State */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      城市 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Jakarta"
                    />
                    {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      省/州
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="DKI Jakarta"
                    />
                  </div>
                </div>

                {/* Country and Postal Code */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                      国家 <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.country ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="Indonesia">Indonesia</option>
                      <option value="Malaysia">Malaysia</option>
                      <option value="Singapore">Singapore</option>
                      <option value="China">China</option>
                    </select>
                    {errors.country && <p className="mt-1 text-sm text-red-500">{errors.country}</p>}
                  </div>

                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                      邮政编码
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="12345"
                    />
                  </div>
                </div>

                {/* Default Address Checkbox */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isDefault"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
                    设为默认收货地址
                  </label>
                </div>

                {/* Form Actions */}
                <div className="flex space-x-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseModal}
                    className="flex-1"
                    disabled={submitting}
                  >
                    取消
                  </Button>
                  <Button type="submit" className="flex-1" disabled={submitting}>
                    {submitting ? '保存中...' : editingAddress ? '更新地址' : '添加地址'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
