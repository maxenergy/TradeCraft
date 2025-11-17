import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center">
            <svg
              className="w-64 h-64 text-primary-600"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          页面未找到
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          抱歉，您访问的页面不存在或已被移除。
          请检查网址是否正确，或返回首页继续浏览。
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/">
            <Button size="lg" className="w-full sm:w-auto">
              返回首页
            </Button>
          </Link>
          <Link href="/products">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              浏览商品
            </Button>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            您可能在寻找：
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <Link
              href="/categories"
              className="flex flex-col items-center p-4 bg-white rounded-lg hover:shadow-lg transition-shadow"
            >
              <svg
                className="w-8 h-8 text-primary-600 mb-2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span className="text-sm font-medium text-gray-900">商品分类</span>
            </Link>

            <Link
              href="/cart"
              className="flex flex-col items-center p-4 bg-white rounded-lg hover:shadow-lg transition-shadow"
            >
              <svg
                className="w-8 h-8 text-primary-600 mb-2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-sm font-medium text-gray-900">购物车</span>
            </Link>

            <Link
              href="/profile/orders"
              className="flex flex-col items-center p-4 bg-white rounded-lg hover:shadow-lg transition-shadow"
            >
              <svg
                className="w-8 h-8 text-primary-600 mb-2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm font-medium text-gray-900">我的订单</span>
            </Link>

            <Link
              href="/help"
              className="flex flex-col items-center p-4 bg-white rounded-lg hover:shadow-lg transition-shadow"
            >
              <svg
                className="w-8 h-8 text-primary-600 mb-2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-gray-900">帮助中心</span>
            </Link>
          </div>
        </div>

        {/* Search Suggestion */}
        <div className="mt-12">
          <p className="text-sm text-gray-600 mb-4">或者搜索您需要的商品：</p>
          <div className="max-w-md mx-auto">
            <form action="/search" method="get" className="flex gap-2">
              <input
                type="text"
                name="q"
                placeholder="搜索商品..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <Button type="submit" size="lg">
                搜索
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
