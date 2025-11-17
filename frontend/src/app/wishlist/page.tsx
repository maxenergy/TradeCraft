'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { formatPrice } from '@/lib/utils';

interface WishlistItem {
  id: number;
  product: Product;
  createdAt: string;
}

export default function WishlistPage() {
  const router = useRouter();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<number | null>(null);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      // TODO: Implement API call to fetch wishlist
      // const response = await wishlistApi.getWishlist();
      // setWishlist(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (itemId: number) => {
    setRemovingId(itemId);

    try {
      // TODO: Implement API call to remove from wishlist
      // await wishlistApi.removeFromWishlist(itemId);
      alert('已从收藏中移除');
      fetchWishlist();
    } catch (error: any) {
      console.error('Failed to remove from wishlist:', error);
      alert(error.response?.data?.message || '移除失败，请重试');
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddToCart = async (productId: number) => {
    try {
      // TODO: Implement API call to add to cart
      // await cartApi.addToCart(productId, 1);
      alert('已添加到购物车');
    } catch (error: any) {
      console.error('Failed to add to cart:', error);
      alert(error.response?.data?.message || '添加失败，请重试');
    }
  };

  const handleClearWishlist = async () => {
    if (!confirm('确定要清空收藏夹吗？')) {
      return;
    }

    try {
      // TODO: Implement API call to clear wishlist
      // await wishlistApi.clearWishlist();
      alert('收藏夹已清空');
      fetchWishlist();
    } catch (error: any) {
      console.error('Failed to clear wishlist:', error);
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">我的收藏</h1>
              <p className="text-gray-600 mt-1">{wishlist.length} 件商品</p>
            </div>
            {wishlist.length > 0 && (
              <Button variant="outline" onClick={handleClearWishlist}>
                清空收藏夹
              </Button>
            )}
          </div>
        </div>

        {wishlist.length === 0 ? (
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
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">收藏夹为空</h3>
              <p className="text-gray-600 mb-6">您还没有收藏任何商品</p>
              <Button onClick={() => router.push('/products')}>
                去逛逛
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((item) => (
              <Card key={item.id} className="group relative">
                <CardContent className="p-4">
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveFromWishlist(item.id)}
                    disabled={removingId === item.id}
                    className="absolute top-4 right-4 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    {removingId === item.id ? (
                      <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    )}
                  </button>

                  {/* Product Image */}
                  <Link href={`/products/${item.product.id}`} className="block mb-4">
                    <div className="w-full aspect-square bg-gray-200 rounded-lg overflow-hidden">
                      {item.product.imageUrl ? (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg
                            className="w-16 h-16"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="space-y-2">
                    <Link
                      href={`/products/${item.product.id}`}
                      className="block"
                    >
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-primary-600">
                        {item.product.name}
                      </h3>
                    </Link>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold text-primary-600">
                          {formatPrice(item.product.price, 'CNY')}
                        </p>
                        {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                          <p className="text-xs text-gray-500 line-through">
                            {formatPrice(item.product.originalPrice, 'CNY')}
                          </p>
                        )}
                      </div>

                      {/* Stock Status */}
                      {item.product.stock > 0 ? (
                        <span className="text-xs text-green-600">有货</span>
                      ) : (
                        <span className="text-xs text-red-600">缺货</span>
                      )}
                    </div>

                    {/* Rating */}
                    {item.product.rating && (
                      <div className="flex items-center">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, index) => (
                            <svg
                              key={index}
                              className={`w-3 h-3 ${
                                index < Math.round(item.product.rating || 0)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                              fill={index < Math.round(item.product.rating || 0) ? 'currentColor' : 'none'}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-1 text-xs text-gray-500">
                          ({item.product.reviewCount || 0})
                        </span>
                      </div>
                    )}

                    {/* Add to Cart Button */}
                    <Button
                      onClick={() => handleAddToCart(item.product.id)}
                      disabled={item.product.stock === 0}
                      className="w-full mt-3"
                      size="sm"
                    >
                      {item.product.stock === 0 ? '缺货' : '加入购物车'}
                    </Button>
                  </div>

                  {/* Added Date */}
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    收藏于 {new Date(item.createdAt).toLocaleDateString('zh-CN')}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Continue Shopping */}
        {wishlist.length > 0 && (
          <div className="mt-8 text-center">
            <Button variant="outline" onClick={() => router.push('/products')}>
              继续购物
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
