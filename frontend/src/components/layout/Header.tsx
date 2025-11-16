'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';

export const Header: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo和主导航 */}
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">TradeCraft</span>
            </Link>

            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link
                href="/products"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-primary-600 transition-colors"
              >
                产品
              </Link>
              <Link
                href="/categories"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-primary-600 transition-colors"
              >
                分类
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-primary-600 transition-colors"
              >
                关于我们
              </Link>
            </div>
          </div>

          {/* 右侧导航 */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {/* 购物车 */}
            <Link href="/cart" className="p-2 text-gray-600 hover:text-primary-600">
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </Link>

            {isAuthenticated ? (
              <>
                {/* 用户菜单 */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-primary-600">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-sm font-medium">{user?.firstName}</span>
                  </button>

                  {/* 下拉菜单 */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      我的账户
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      我的订单
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        管理后台
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      退出登录
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    登录
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">注册</Button>
                </Link>
              </>
            )}
          </div>

          {/* 移动端菜单按钮 */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* 移动端菜单 */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="pt-2 pb-3 space-y-1">
              <Link
                href="/products"
                className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
              >
                产品
              </Link>
              <Link
                href="/categories"
                className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
              >
                分类
              </Link>
              <Link
                href="/about"
                className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
              >
                关于我们
              </Link>
              <Link
                href="/cart"
                className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
              >
                购物车
              </Link>
            </div>

            {isAuthenticated ? (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-10 w-10 text-gray-400"
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
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{user?.fullName}</div>
                    <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100"
                  >
                    我的账户
                  </Link>
                  <Link
                    href="/orders"
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100"
                  >
                    我的订单
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100"
                    >
                      管理后台
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100"
                  >
                    退出登录
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-4 pb-3 border-t border-gray-200 space-y-1">
                <Link
                  href="/login"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100"
                >
                  登录
                </Link>
                <Link
                  href="/register"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100"
                >
                  注册
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};
