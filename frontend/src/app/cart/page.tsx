'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cartApi } from '@/lib/cart-api';
import { CartItem } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartApi.getCart();
      if (response.data.success && response.data.data) {
        setCartItems(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      setUpdating(itemId);
      await cartApi.updateCartItem(itemId, newQuantity);
      await fetchCart();
    } catch (error: any) {
      alert(error.response?.data?.message || '更新失败');
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (itemId: number) => {
    if (!confirm('确定要删除这个商品吗？')) return;

    try {
      await cartApi.removeFromCart(itemId);
      await fetchCart();
    } catch (error: any) {
      alert(error.response?.data?.message || '删除失败');
    }
  };

  const clearCart = async () => {
    if (!confirm('确定要清空购物车吗？')) return;

    try {
      await cartApi.clearCart();
      setCartItems([]);
    } catch (error: any) {
      alert(error.response?.data?.message || '清空失败');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    router.push('/checkout');
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

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card>
            <CardContent className="p-12 text-center">
              <svg
                className="mx-auto h-24 w-24 text-gray-400 mb-4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">购物车是空的</h2>
              <p className="text-gray-600 mb-6">快去选购一些心仪的商品吧！</p>
              <Link href="/products">
                <Button>浏览产品</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">购物车</h1>
          <Button variant="outline" onClick={clearCart}>
            清空购物车
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 购物车商品列表 */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* 商品图片 */}
                    <div className="flex-shrink-0">
                      {item.productImage ? (
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-24 h-24 object-cover rounded"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-400 text-sm">暂无图片</span>
                        </div>
                      )}
                    </div>

                    {/* 商品信息 */}
                    <div className="flex-1">
                      <Link
                        href={`/products/${item.productId}`}
                        className="text-lg font-semibold text-gray-900 hover:text-primary-600"
                      >
                        {item.productName}
                      </Link>
                      <p className="text-sm text-gray-500">SKU: {item.productSku}</p>
                      <p className="text-lg font-bold text-primary-600 mt-1">
                        {formatPrice(item.price, item.currency)}
                      </p>
                      {!item.inStock && (
                        <p className="text-sm text-red-600 mt-1">暂无库存</p>
                      )}
                    </div>

                    {/* 数量控制 */}
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={updating === item.id || item.quantity <= 1}
                      >
                        -
                      </Button>
                      <span className="text-lg font-medium w-12 text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={updating === item.id || !item.inStock}
                      >
                        +
                      </Button>
                    </div>

                    {/* 小计 */}
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {formatPrice(item.subtotal, item.currency)}
                      </p>
                    </div>

                    {/* 删除按钮 */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 订单摘要 */}
          <div>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">订单摘要</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>商品数量</span>
                    <span>{cartItems.length} 件</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>小计</span>
                    <span>{formatPrice(calculateTotal(), 'CNY')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>运费</span>
                    <span>待计算</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-xl font-bold text-gray-900">
                    <span>总计</span>
                    <span className="text-primary-600">{formatPrice(calculateTotal(), 'CNY')}</span>
                  </div>
                </div>

                <Button
                  className="w-full mb-3"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={cartItems.some(item => !item.inStock)}
                >
                  去结算
                </Button>

                <Link href="/products">
                  <Button variant="outline" className="w-full" size="lg">
                    继续购物
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
