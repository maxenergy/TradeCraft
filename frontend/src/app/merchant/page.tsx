'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useNotification } from '@/contexts/NotificationContext';

export default function MerchantPage() {
  const notification = useNotification();
  const [formData, setFormData] = useState({
    // Company Information
    companyName: '',
    companyType: '',
    registrationNumber: '',
    taxId: '',
    establishmentDate: '',
    
    // Contact Information
    contactName: '',
    contactPosition: '',
    contactPhone: '',
    contactEmail: '',
    
    // Business Information
    businessCategory: '',
    productCategories: [] as string[],
    annualRevenue: '',
    employeeCount: '',
    
    // Address Information
    province: '',
    city: '',
    district: '',
    detailedAddress: '',
    
    // Additional Information
    website: '',
    socialMedia: '',
    description: '',
    
    // Documents (in real implementation would be file uploads)
    businessLicense: '',
    taxRegistration: '',
    bankAccount: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (category: string) => {
    setFormData(prev => ({
      ...prev,
      productCategories: prev.productCategories.includes(category)
        ? prev.productCategories.filter(c => c !== category)
        : [...prev.productCategories, category]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.companyName || !formData.contactName || !formData.contactEmail || !formData.contactPhone) {
      notification.warning('请填写必填项', '公司名称、联系人信息为必填项');
      return;
    }

    if (formData.productCategories.length === 0) {
      notification.warning('请选择经营类目', '至少选择一个经营类目');
      return;
    }

    setSubmitting(true);
    try {
      // TODO: Replace with actual API call
      // await merchantApi.submitApplication(formData);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      notification.success('申请提交成功', '我们会在3-5个工作日内审核您的申请');
      
      // Reset form
      setFormData({
        companyName: '',
        companyType: '',
        registrationNumber: '',
        taxId: '',
        establishmentDate: '',
        contactName: '',
        contactPosition: '',
        contactPhone: '',
        contactEmail: '',
        businessCategory: '',
        productCategories: [],
        annualRevenue: '',
        employeeCount: '',
        province: '',
        city: '',
        district: '',
        detailedAddress: '',
        website: '',
        socialMedia: '',
        description: '',
        businessLicense: '',
        taxRegistration: '',
        bankAccount: '',
      });
    } catch (error) {
      console.error('Failed to submit application:', error);
      notification.error('提交失败', '请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  const categories = [
    '服装鞋包', '美妆个护', '食品饮料', '家居家纺',
    '数码电器', '运动户外', '母婴用品', '图书文娱',
    '珠宝配饰', '汽车用品', '医药保健', '其他'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">商家入驻</h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              加入 TradeCraft，开启您的全球化销售之旅
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">为什么选择我们</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                  <svg className="w-8 h-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">海量用户</h3>
                <p className="text-gray-600">5万+活跃用户，覆盖30+国家和地区</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                  <svg className="w-8 h-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">低成本运营</h3>
                <p className="text-gray-600">零入驻费，灵活的佣金政策</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                  <svg className="w-8 h-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">专业支持</h3>
                <p className="text-gray-600">一对一客户经理，全程协助运营</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                  <svg className="w-8 h-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">营销推广</h3>
                <p className="text-gray-600">多样化营销工具，助力销量增长</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">入驻流程</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: '提交申请', desc: '填写入驻申请表，上传相关资质文件' },
              { step: '02', title: '资质审核', desc: '3-5个工作日完成资质审核' },
              { step: '03', title: '签订协议', desc: '审核通过后签订入驻协议' },
              { step: '04', title: '开店运营', desc: '完成店铺装修，开始销售' },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 text-white rounded-full text-2xl font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-primary-200" style={{ width: 'calc(100% - 4rem)', marginLeft: '2rem' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">入驻要求</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader className="border-b">
                <h3 className="text-xl font-semibold text-gray-900">企业资质要求</h3>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-primary-600 mr-3 mt-0.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    <span>持有有效的营业执照（企业法人或个体工商户）</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-primary-600 mr-3 mt-0.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    <span>提供税务登记证或统一社会信用代码证书</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-primary-600 mr-3 mt-0.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    <span>提供对公银行账户信息</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-primary-600 mr-3 mt-0.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    <span>企业成立时间不少于1年（特殊品类要求可能更高）</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b">
                <h3 className="text-xl font-semibold text-gray-900">产品资质要求</h3>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-primary-600 mr-3 mt-0.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    <span>商品需符合国家相关法律法规要求</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-primary-600 mr-3 mt-0.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    <span>特殊类目（食品、医药等）需提供相关经营许可证</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-primary-600 mr-3 mt-0.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    <span>品牌商需提供商标注册证或授权书</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-primary-600 mr-3 mt-0.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    <span>禁止销售假冒伪劣、侵权、违禁商品</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader className="border-b">
              <h2 className="text-2xl font-semibold text-gray-900">入驻申请表</h2>
              <p className="text-gray-600 mt-1">请如实填写以下信息，我们将在3-5个工作日内完成审核</p>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Company Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">企业信息</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                        公司名称 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="请输入公司全称"
                      />
                    </div>

                    <div>
                      <label htmlFor="companyType" className="block text-sm font-medium text-gray-700 mb-2">
                        公司类型
                      </label>
                      <select
                        id="companyType"
                        name="companyType"
                        value={formData.companyType}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">请选择</option>
                        <option value="limited">有限责任公司</option>
                        <option value="joint-stock">股份有限公司</option>
                        <option value="individual">个体工商户</option>
                        <option value="partnership">合伙企业</option>
                        <option value="other">其他</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700 mb-2">
                        统一社会信用代码
                      </label>
                      <input
                        type="text"
                        id="registrationNumber"
                        name="registrationNumber"
                        value={formData.registrationNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="请输入18位统一社会信用代码"
                      />
                    </div>

                    <div>
                      <label htmlFor="establishmentDate" className="block text-sm font-medium text-gray-700 mb-2">
                        成立日期
                      </label>
                      <input
                        type="date"
                        id="establishmentDate"
                        name="establishmentDate"
                        value={formData.establishmentDate}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">联系人信息</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-2">
                        联系人姓名 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="contactName"
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="请输入联系人姓名"
                      />
                    </div>

                    <div>
                      <label htmlFor="contactPosition" className="block text-sm font-medium text-gray-700 mb-2">
                        职位
                      </label>
                      <input
                        type="text"
                        id="contactPosition"
                        name="contactPosition"
                        value={formData.contactPosition}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="请输入职位"
                      />
                    </div>

                    <div>
                      <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-2">
                        联系电话 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="contactPhone"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="请输入手机号码"
                      />
                    </div>

                    <div>
                      <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
                        联系邮箱 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="contactEmail"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Business Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">经营信息</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        经营类目 <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {categories.map((category) => (
                          <label key={category} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.productCategories.includes(category)}
                              onChange={() => handleCategoryChange(category)}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-sm text-gray-700">{category}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="annualRevenue" className="block text-sm font-medium text-gray-700 mb-2">
                          年营业额
                        </label>
                        <select
                          id="annualRevenue"
                          name="annualRevenue"
                          value={formData.annualRevenue}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="">请选择</option>
                          <option value="under-1m">100万以下</option>
                          <option value="1m-5m">100万-500万</option>
                          <option value="5m-10m">500万-1000万</option>
                          <option value="10m-50m">1000万-5000万</option>
                          <option value="over-50m">5000万以上</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="employeeCount" className="block text-sm font-medium text-gray-700 mb-2">
                          员工人数
                        </label>
                        <select
                          id="employeeCount"
                          name="employeeCount"
                          value={formData.employeeCount}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="">请选择</option>
                          <option value="under-10">10人以下</option>
                          <option value="10-50">10-50人</option>
                          <option value="50-100">50-100人</option>
                          <option value="100-500">100-500人</option>
                          <option value="over-500">500人以上</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">公司地址</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-2">
                        省份
                      </label>
                      <input
                        type="text"
                        id="province"
                        name="province"
                        value={formData.province}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="请输入省份"
                      />
                    </div>

                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                        城市
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="请输入城市"
                      />
                    </div>

                    <div>
                      <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-2">
                        区/县
                      </label>
                      <input
                        type="text"
                        id="district"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="请输入区/县"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label htmlFor="detailedAddress" className="block text-sm font-medium text-gray-700 mb-2">
                      详细地址
                    </label>
                    <input
                      type="text"
                      id="detailedAddress"
                      name="detailedAddress"
                      value={formData.detailedAddress}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="请输入详细地址"
                    />
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">其他信息</h3>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                        公司网站
                      </label>
                      <input
                        type="url"
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="https://www.example.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="socialMedia" className="block text-sm font-medium text-gray-700 mb-2">
                        社交媒体
                      </label>
                      <input
                        type="text"
                        id="socialMedia"
                        name="socialMedia"
                        value={formData.socialMedia}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="微信公众号、微博等"
                      />
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        公司简介
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="简要介绍公司业务、产品特色等..."
                      />
                    </div>
                  </div>
                </div>

                {/* Document Upload Notice */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">需要上传的资质文件</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="text-primary-600 mr-2">•</span>
                      <span>营业执照副本（加盖公章）</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-600 mr-2">•</span>
                      <span>法人身份证正反面</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-600 mr-2">•</span>
                      <span>银行开户许可证或基本账户信息</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-600 mr-2">•</span>
                      <span>特殊类目相关资质（如食品经营许可证、医疗器械经营许可证等）</span>
                    </li>
                  </ul>
                  <p className="text-sm text-gray-500 mt-4">
                    提示：提交申请后，我们的工作人员会与您联系，指导您上传所需文件
                  </p>
                </div>

                {/* Terms Agreement */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="agreement"
                    required
                    className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="agreement" className="ml-2 text-sm text-gray-600">
                    我已阅读并同意
                    <a href="/terms" className="text-primary-600 hover:text-primary-700 mx-1">《商家入驻协议》</a>
                    和
                    <a href="/privacy" className="text-primary-600 hover:text-primary-700 mx-1">《隐私政策》</a>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-between pt-6 border-t">
                  <p className="text-sm text-gray-500">
                    <span className="text-red-500">*</span> 为必填项
                  </p>
                  <Button
                    type="submit"
                    disabled={submitting}
                    size="lg"
                  >
                    {submitting ? '提交中...' : '提交申请'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">常见问题</h2>
          <div className="space-y-4">
            {[
              {
                q: '入驻需要缴纳费用吗？',
                a: '平台不收取入驻费用，但根据不同类目会收取一定比例的销售佣金。具体佣金比例请咨询客户经理。'
              },
              {
                q: '审核需要多长时间？',
                a: '一般情况下，我们会在收到完整资料后的3-5个工作日内完成审核。如需补充资料，我们会及时与您联系。'
              },
              {
                q: '可以经营多个类目吗？',
                a: '可以。您可以在申请时选择多个经营类目，但需要提供相应的资质证明。'
              },
              {
                q: '如何收取货款？',
                a: '订单完成后，货款会在扣除佣金和其他费用后，定期结算到您提供的对公账户。具体结算周期和规则请参考《商家入驻协议》。'
              },
              {
                q: '是否提供营销支持？',
                a: '是的。平台会定期举办各类营销活动，并提供多种营销工具帮助商家提升销量。优质商家还可享受流量扶持政策。'
              },
            ].map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">需要帮助？</h2>
          <p className="text-xl mb-8 text-primary-100">
            如有任何疑问，请联系我们的商家服务团队
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-lg">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>400-888-8888</span>
            </div>
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>merchant@tradecraft.com</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
