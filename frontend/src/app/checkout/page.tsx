'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cartApi } from '@/lib/api/cart-api';
import { orderApi } from '@/lib/api/order-api';
import { CartItem, CreateOrderRequest } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { formatPrice } from '@/lib/utils';

interface ShippingFormData {
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingCountry: string;
  shippingPostalCode: string;
  notes?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<ShippingFormData>>({});

  const [formData, setFormData] = useState<ShippingFormData>({
    shippingName: '',
    shippingPhone: '',
    shippingAddress: '',
    shippingCity: '',
    shippingState: '',
    shippingCountry: 'Indonesia',
    shippingPostalCode: '',
    notes: '',
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await cartApi.getCart();
      if (response.data.success && response.data.data) {
        setCartItems(response.data.data);

        // Redirect to cart if empty
        if (response.data.data.length === 0) {
          router.push('/cart');
        }
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name as keyof ShippingFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ShippingFormData> = {};

    if (!formData.shippingName.trim()) {
      newErrors.shippingName = '请输入收货人姓名';
    }

    if (!formData.shippingPhone.trim()) {
      newErrors.shippingPhone = '请输入联系电话';
    } else if (!/^[+]?[\d\s-()]+$/.test(formData.shippingPhone)) {
      newErrors.shippingPhone = '请输入有效的电话号码';
    }

    if (!formData.shippingAddress.trim()) {
      newErrors.shippingAddress = '请输入详细地址';
    }

    if (!formData.shippingCity.trim()) {
      newErrors.shippingCity = '请输入城市';
    }

    if (!formData.shippingCountry.trim()) {
      newErrors.shippingCountry = '请选择国家';
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
      const orderRequest: CreateOrderRequest = {
        shippingName: formData.shippingName,
        shippingPhone: formData.shippingPhone,
        shippingAddress: formData.shippingAddress,
        shippingCity: formData.shippingCity,
        shippingState: formData.shippingState,
        shippingCountry: formData.shippingCountry,
        shippingPostalCode: formData.shippingPostalCode,
        notes: formData.notes,
      };

      const response = await orderApi.createOrder(orderRequest);

      if (response.data.success && response.data.data) {
        // Redirect to order confirmation page
        router.push(`/orders/${response.data.data.orderNumber}`);
      }
    } catch (error: any) {
      console.error('Failed to create order:', error);
      alert(error.response?.data?.message || '创建订单失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const shippingFee = 0; // TODO: Calculate based on location
  const taxAmount = 0; // TODO: Calculate based on location
  const total = calculateSubtotal() + shippingFee + taxAmount;

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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">结算</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="border-b">
                <h2 className="text-lg font-semibold text-gray-900">配送信息</h2>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="shippingName" className="block text-sm font-medium text-gray-700 mb-1">
                      收货人姓名 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="shippingName"
                      name="shippingName"
                      value={formData.shippingName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.shippingName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="请输入收货人姓名"
                    />
                    {errors.shippingName && (
                      <p className="mt-1 text-sm text-red-500">{errors.shippingName}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="shippingPhone" className="block text-sm font-medium text-gray-700 mb-1">
                      联系电话 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="shippingPhone"
                      name="shippingPhone"
                      value={formData.shippingPhone}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.shippingPhone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="+62 812 3456 7890"
                    />
                    {errors.shippingPhone && (
                      <p className="mt-1 text-sm text-red-500">{errors.shippingPhone}</p>
                    )}
                  </div>

                  {/* Address */}
                  <div>
                    <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-700 mb-1">
                      详细地址 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="shippingAddress"
                      name="shippingAddress"
                      value={formData.shippingAddress}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.shippingAddress ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="街道、门牌号、楼层等详细地址"
                    />
                    {errors.shippingAddress && (
                      <p className="mt-1 text-sm text-red-500">{errors.shippingAddress}</p>
                    )}
                  </div>

                  {/* City and State */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="shippingCity" className="block text-sm font-medium text-gray-700 mb-1">
                        城市 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="shippingCity"
                        name="shippingCity"
                        value={formData.shippingCity}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          errors.shippingCity ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Jakarta"
                      />
                      {errors.shippingCity && (
                        <p className="mt-1 text-sm text-red-500">{errors.shippingCity}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="shippingState" className="block text-sm font-medium text-gray-700 mb-1">
                        省/州
                      </label>
                      <input
                        type="text"
                        id="shippingState"
                        name="shippingState"
                        value={formData.shippingState}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="DKI Jakarta"
                      />
                    </div>
                  </div>

                  {/* Country and Postal Code */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="shippingCountry" className="block text-sm font-medium text-gray-700 mb-1">
                        国家 <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="shippingCountry"
                        name="shippingCountry"
                        value={formData.shippingCountry}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          errors.shippingCountry ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="Indonesia">Indonesia</option>
                        <option value="Malaysia">Malaysia</option>
                        <option value="Singapore">Singapore</option>
                        <option value="China">China</option>
                      </select>
                      {errors.shippingCountry && (
                        <p className="mt-1 text-sm text-red-500">{errors.shippingCountry}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="shippingPostalCode" className="block text-sm font-medium text-gray-700 mb-1">
                        邮政编码
                      </label>
                      <input
                        type="text"
                        id="shippingPostalCode"
                        name="shippingPostalCode"
                        value={formData.shippingPostalCode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="12345"
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                      订单备注
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="如有特殊需求请在此处填写..."
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push('/cart')}
                      className="flex-1"
                    >
                      返回购物车
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="flex-1"
                    >
                      {submitting ? '提交中...' : '提交订单'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="border-b">
                <h2 className="text-lg font-semibold text-gray-900">订单摘要</h2>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Cart Items */}
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <div className="w-16 h-16 bg-gray-200 rounded flex-shrink-0">
                          {item.product.imageUrl ? (
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.product.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatPrice(item.price, 'CNY')} × {item.quantity}
                          </p>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatPrice(item.price * item.quantity, 'CNY')}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    {/* Subtotal */}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">小计</span>
                      <span className="text-gray-900">{formatPrice(calculateSubtotal(), 'CNY')}</span>
                    </div>

                    {/* Shipping */}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">运费</span>
                      <span className="text-gray-900">
                        {shippingFee === 0 ? '免运费' : formatPrice(shippingFee, 'CNY')}
                      </span>
                    </div>

                    {/* Tax */}
                    {taxAmount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">税费</span>
                        <span className="text-gray-900">{formatPrice(taxAmount, 'CNY')}</span>
                      </div>
                    )}

                    {/* Total */}
                    <div className="border-t pt-2 flex justify-between">
                      <span className="text-base font-semibold text-gray-900">总计</span>
                      <span className="text-lg font-bold text-primary-600">
                        {formatPrice(total, 'CNY')}
                      </span>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="bg-green-50 p-3 rounded-md">
                    <div className="flex items-start">
                      <svg
                        className="w-5 h-5 text-green-600 mt-0.5 mr-2 flex-shrink-0"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <div className="text-xs text-green-800">
                        <p className="font-medium">安全支付</p>
                        <p className="mt-1">您的支付信息通过SSL加密传输</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
