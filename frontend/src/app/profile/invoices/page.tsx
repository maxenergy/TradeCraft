'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useNotification } from '@/contexts/NotificationContext';

interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  type: 'personal' | 'company';
  amount: number;
  taxAmount: number;
  issueDate: string;
  status: 'issued' | 'pending' | 'cancelled';
  downloadUrl?: string;
  billingInfo: {
    name: string;
    taxId?: string;
    address?: string;
    phone?: string;
    bankName?: string;
    bankAccount?: string;
  };
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
}

export default function InvoicesPage() {
  const notification = useNotification();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestForm, setRequestForm] = useState({
    orderId: '',
    type: 'personal' as 'personal' | 'company',
    personalName: '',
    companyName: '',
    taxId: '',
    address: '',
    phone: '',
    bankName: '',
    bankAccount: '',
  });

  useEffect(() => {
    const loadInvoices = async () => {
      setIsLoading(true);
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/user/invoices');
        // const data = await response.json();

        // Mock data
        const mockInvoices: Invoice[] = [
          {
            id: '1',
            invoiceNumber: 'INV-2024-001234',
            orderId: 'ORD20240115001',
            type: 'personal',
            amount: 1580,
            taxAmount: 158,
            issueDate: '2024-01-16',
            status: 'issued',
            downloadUrl: '/invoices/INV-2024-001234.pdf',
            billingInfo: {
              name: '张三',
              phone: '138****8000',
            },
            items: [
              { name: '智能手机 Pro Max', quantity: 1, price: 1299 },
              { name: '手机保护壳', quantity: 1, price: 99 },
              { name: '钢化膜', quantity: 2, price: 49 },
            ],
          },
          {
            id: '2',
            invoiceNumber: 'INV-2024-001156',
            orderId: 'ORD20240112002',
            type: 'company',
            amount: 5680,
            taxAmount: 568,
            issueDate: '2024-01-13',
            status: 'issued',
            downloadUrl: '/invoices/INV-2024-001156.pdf',
            billingInfo: {
              name: '某某科技有限公司',
              taxId: '91110000MA01234567',
              address: '北京市朝阳区建国路88号',
              phone: '010-12345678',
              bankName: '中国工商银行朝阳支行',
              bankAccount: '6222 **** **** 1234',
            },
            items: [
              { name: '办公笔记本电脑', quantity: 2, price: 2499 },
              { name: '无线鼠标', quantity: 5, price: 99 },
            ],
          },
          {
            id: '3',
            invoiceNumber: 'INV-2024-001089',
            orderId: 'ORD20240110003',
            type: 'personal',
            amount: 899,
            taxAmount: 89.9,
            issueDate: '2024-01-11',
            status: 'issued',
            downloadUrl: '/invoices/INV-2024-001089.pdf',
            billingInfo: {
              name: '张三',
              phone: '138****8000',
            },
            items: [
              { name: '智能手表旗舰版', quantity: 1, price: 899 },
            ],
          },
        ];

        setInvoices(mockInvoices);
      } catch (error) {
        console.error('Failed to load invoices:', error);
        notification.error('加载失败', '无法加载发票列表');
      } finally {
        setIsLoading(false);
      }
    };

    loadInvoices();
  }, [notification]);

  const handleDownloadInvoice = async (invoice: Invoice) => {
    try {
      // TODO: Replace with actual download logic
      notification.success('下载成功', `发票 ${invoice.invoiceNumber} 已下载`);
    } catch (error) {
      notification.error('下载失败', '无法下载发票');
    }
  };

  const handleRequestInvoice = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!requestForm.orderId) {
      notification.warning('请输入订单号', '订单号不能为空');
      return;
    }

    if (requestForm.type === 'personal' && !requestForm.personalName) {
      notification.warning('请填写姓名', '个人发票需要填写姓名');
      return;
    }

    if (requestForm.type === 'company') {
      if (!requestForm.companyName || !requestForm.taxId) {
        notification.warning('请填写完整', '企业发票需要填写公司名称和税号');
        return;
      }
    }

    try {
      // TODO: Replace with actual API call
      notification.success('申请成功', '发票申请已提交，预计3个工作日内开具');
      setShowRequestForm(false);
      setRequestForm({
        orderId: '',
        type: 'personal',
        personalName: '',
        companyName: '',
        taxId: '',
        address: '',
        phone: '',
        bankName: '',
        bankAccount: '',
      });
    } catch (error) {
      notification.error('申请失败', '无法提交发票申请');
    }
  };

  const handleViewDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600">加载发票...</p>
        </div>
      </div>
    );
  }

  if (selectedInvoice) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <button
              onClick={() => setSelectedInvoice(null)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <svg className="w-5 h-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M15 19l-7-7 7-7" />
              </svg>
              返回列表
            </button>
          </div>

          <Card>
            <CardHeader className="border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">发票详情</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    发票号: {selectedInvoice.invoiceNumber}
                  </p>
                </div>
                <Button onClick={() => handleDownloadInvoice(selectedInvoice)}>
                  <svg className="w-5 h-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  下载 PDF
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-8">
              {/* Invoice Header */}
              <div className="mb-8">
                <div className="text-center mb-6">
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">TradeCraft</h3>
                  <p className="text-gray-600">增值税{selectedInvoice.type === 'company' ? '专用' : '普通'}发票</p>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">发票号码</div>
                    <div className="font-semibold">{selectedInvoice.invoiceNumber}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">开票日期</div>
                    <div className="font-semibold">
                      {new Date(selectedInvoice.issueDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">订单号</div>
                    <div className="font-semibold">{selectedInvoice.orderId}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">发票类型</div>
                    <div className="font-semibold">
                      {selectedInvoice.type === 'company' ? '企业' : '个人'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Billing Info */}
              <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-4">开票信息</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">名称: </span>
                    <span className="font-medium">{selectedInvoice.billingInfo.name}</span>
                  </div>
                  {selectedInvoice.billingInfo.taxId && (
                    <div>
                      <span className="text-gray-600">税号: </span>
                      <span className="font-medium">{selectedInvoice.billingInfo.taxId}</span>
                    </div>
                  )}
                  {selectedInvoice.billingInfo.address && (
                    <div className="col-span-2">
                      <span className="text-gray-600">地址: </span>
                      <span className="font-medium">{selectedInvoice.billingInfo.address}</span>
                    </div>
                  )}
                  {selectedInvoice.billingInfo.phone && (
                    <div>
                      <span className="text-gray-600">电话: </span>
                      <span className="font-medium">{selectedInvoice.billingInfo.phone}</span>
                    </div>
                  )}
                  {selectedInvoice.billingInfo.bankName && (
                    <div>
                      <span className="text-gray-600">开户行: </span>
                      <span className="font-medium">{selectedInvoice.billingInfo.bankName}</span>
                    </div>
                  )}
                  {selectedInvoice.billingInfo.bankAccount && (
                    <div className="col-span-2">
                      <span className="text-gray-600">账号: </span>
                      <span className="font-medium">{selectedInvoice.billingInfo.bankAccount}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-4">商品明细</h4>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 text-sm font-semibold text-gray-700">商品名称</th>
                      <th className="text-center py-3 text-sm font-semibold text-gray-700">数量</th>
                      <th className="text-right py-3 text-sm font-semibold text-gray-700">单价</th>
                      <th className="text-right py-3 text-sm font-semibold text-gray-700">金额</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.items.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 text-sm">{item.name}</td>
                        <td className="py-3 text-sm text-center">{item.quantity}</td>
                        <td className="py-3 text-sm text-right">¥{item.price.toFixed(2)}</td>
                        <td className="py-3 text-sm text-right font-medium">
                          ¥{(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total */}
              <div className="border-t-2 border-gray-300 pt-4">
                <div className="flex justify-end space-y-2">
                  <div className="w-64">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">小计:</span>
                      <span className="font-medium">¥{selectedInvoice.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">税额:</span>
                      <span className="font-medium">¥{selectedInvoice.taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                      <span>合计:</span>
                      <span className="text-primary-600">
                        ¥{(selectedInvoice.amount + selectedInvoice.taxAmount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (showRequestForm) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <button
              onClick={() => setShowRequestForm(false)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <svg className="w-5 h-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M15 19l-7-7 7-7" />
              </svg>
              返回列表
            </button>
          </div>

          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900">申请开具发票</h2>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRequestInvoice} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    订单号 <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={requestForm.orderId}
                    onChange={(e) => setRequestForm({ ...requestForm, orderId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="ORD20240115001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    发票类型 <span className="text-red-600">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setRequestForm({ ...requestForm, type: 'personal' })}
                      className={`p-4 border-2 rounded-lg text-center transition-colors ${
                        requestForm.type === 'personal'
                          ? 'border-primary-600 bg-primary-50 text-primary-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="font-medium">个人发票</div>
                      <div className="text-xs text-gray-600 mt-1">增值税普通发票</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRequestForm({ ...requestForm, type: 'company' })}
                      className={`p-4 border-2 rounded-lg text-center transition-colors ${
                        requestForm.type === 'company'
                          ? 'border-primary-600 bg-primary-50 text-primary-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="font-medium">企业发票</div>
                      <div className="text-xs text-gray-600 mt-1">增值税专用发票</div>
                    </button>
                  </div>
                </div>

                {requestForm.type === 'personal' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      姓名 <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={requestForm.personalName}
                      onChange={(e) => setRequestForm({ ...requestForm, personalName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="请输入姓名"
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        公司名称 <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={requestForm.companyName}
                        onChange={(e) => setRequestForm({ ...requestForm, companyName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="请输入公司名称"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        纳税人识别号 <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={requestForm.taxId}
                        onChange={(e) => setRequestForm({ ...requestForm, taxId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="91110000MA01234567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        注册地址
                      </label>
                      <input
                        type="text"
                        value={requestForm.address}
                        onChange={(e) => setRequestForm({ ...requestForm, address: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="请输入注册地址"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        注册电话
                      </label>
                      <input
                        type="tel"
                        value={requestForm.phone}
                        onChange={(e) => setRequestForm({ ...requestForm, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="010-12345678"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          开户银行
                        </label>
                        <input
                          type="text"
                          value={requestForm.bankName}
                          onChange={(e) => setRequestForm({ ...requestForm, bankName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="中国工商银行"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          银行账号
                        </label>
                        <input
                          type="text"
                          value={requestForm.bankAccount}
                          onChange={(e) => setRequestForm({ ...requestForm, bankAccount: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="6222020012345678"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="flex gap-4 pt-4">
                  <Button type="submit" className="flex-1">
                    提交申请
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowRequestForm(false)}
                    className="flex-1"
                  >
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">我的发票</h1>
            <p className="text-gray-600">管理您的发票记录</p>
          </div>
          <Button onClick={() => setShowRequestForm(true)}>
            <svg className="w-5 h-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 4v16m8-8H4" />
            </svg>
            申请开票
          </Button>
        </div>

        {/* Invoices List */}
        {invoices.length === 0 ? (
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
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无发票</h3>
              <p className="text-gray-600 mb-6">您还没有任何发票记录</p>
              <Button onClick={() => setShowRequestForm(true)}>申请开票</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <Card key={invoice.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 mr-3">
                          {invoice.invoiceNumber}
                        </h3>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            invoice.status === 'issued'
                              ? 'bg-green-100 text-green-800'
                              : invoice.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {invoice.status === 'issued'
                            ? '已开具'
                            : invoice.status === 'pending'
                            ? '处理中'
                            : '已取消'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-gray-600">订单号:</span>
                          <div className="font-medium">{invoice.orderId}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">发票类型:</span>
                          <div className="font-medium">
                            {invoice.type === 'company' ? '企业' : '个人'}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">开票日期:</span>
                          <div className="font-medium">
                            {new Date(invoice.issueDate).toLocaleDateString()}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">金额:</span>
                          <div className="font-medium text-primary-600">
                            ¥{(invoice.amount + invoice.taxAmount).toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600">
                        开票抬头: {invoice.billingInfo.name}
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(invoice)}
                      >
                        查看详情
                      </Button>
                      {invoice.status === 'issued' && (
                        <Button
                          size="sm"
                          onClick={() => handleDownloadInvoice(invoice)}
                        >
                          下载
                        </Button>
                      )}
                    </div>
                  </div>
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
                <h3 className="font-semibold text-gray-900 mb-2">开票说明</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 订单完成后即可申请开具发票</li>
                  <li>• 企业发票需提供完整的企业信息和税号</li>
                  <li>• 发票申请提交后，我们将在3个工作日内完成开具</li>
                  <li>• 电子发票与纸质发票具有同等法律效力</li>
                  <li>• 发票一经开具，不支持修改，请仔细核对信息</li>
                  <li>• 如需纸质发票，请联系客服 400-123-4567</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
