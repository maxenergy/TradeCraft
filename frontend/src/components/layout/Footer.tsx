import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 公司信息 */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">TradeCraft</h3>
            <p className="text-sm mb-4">
              专业的跨境电商平台，为全球用户提供优质商品和服务。
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.68c.223-.198-.054-.308-.346-.11l-6.4 4.03-2.76-.918c-.6-.187-.612-.6.125-.89l10.782-4.156c.5-.18.943.11.78.89z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* 快速链接 */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">
              快速链接
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  产品列表
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-white transition-colors">
                  产品分类
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  关于我们
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  联系我们
                </Link>
              </li>
            </ul>
          </div>

          {/* 客户服务 */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">
              客户服务
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="hover:text-white transition-colors">
                  帮助中心
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-white transition-colors">
                  配送信息
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-white transition-colors">
                  退换货政策
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  常见问题
                </Link>
              </li>
            </ul>
          </div>

          {/* 法律信息 */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">
              法律信息
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  服务条款
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  隐私政策
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-white transition-colors">
                  Cookie政策
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 底部版权信息 */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-sm text-center">
          <p>© {currentYear} TradeCraft. 保留所有权利。</p>
        </div>
      </div>
    </footer>
  );
};
