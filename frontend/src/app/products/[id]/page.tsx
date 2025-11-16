'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { productApi } from '@/lib/product-api';
import { Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { formatPrice } from '@/lib/utils';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productApi.getProduct(Number(productId));
      if (response.data.success && response.data.data) {
        const productData = response.data.data;
        setProduct(productData);
        setSelectedImage(productData.images?.main || null);
      }
    } catch (err: any) {
      setError(err.message || '加载产品详情失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    // TODO: 实现添加到购物车功能
    alert(`已添加 ${quantity} 件商品到购物车`);
  };

  const handleBuyNow = () => {
    // TODO: 实现立即购买功能
    alert('即将跳转到结算页面');
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

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || '产品不存在'}</p>
          <Button onClick={() => router.push('/products')}>返回产品列表</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 面包屑导航 */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <a href="/" className="hover:text-primary-600">首页</a>
            </li>
            <li>/</li>
            <li>
              <a href="/products" className="hover:text-primary-600">产品</a>
            </li>
            <li>/</li>
            <li className="text-gray-900">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：产品图片 */}
          <div>
            <Card>
              <CardContent className="p-4">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt={product.name}
                    className="w-full h-96 object-contain rounded-lg mb-4"
                  />
                ) : (
                  <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-gray-400">暂无图片</span>
                  </div>
                )}

                {/* 图片缩略图 */}
                {product.images?.gallery && product.images.gallery.length > 0 && (
                  <div className="grid grid-cols-5 gap-2">
                    {product.images.gallery.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`${product.name} - ${index + 1}`}
                        className={`w-full h-20 object-cover rounded cursor-pointer border-2 ${
                          selectedImage === img ? 'border-primary-600' : 'border-gray-200'
                        }`}
                        onClick={() => setSelectedImage(img)}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 右侧：产品信息 */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

            {/* 价格 */}
            <div className="mb-6">
              <span className="text-4xl font-bold text-primary-600">
                {formatPrice(product.price, product.currency)}
              </span>
            </div>

            {/* 库存状态 */}
            <div className="mb-6">
              {product.inStock ? (
                <div className="flex items-center text-green-600">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">有货</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">缺货</span>
                </div>
              )}
            </div>

            {/* 描述 */}
            {product.description && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">产品描述</h2>
                <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
              </div>
            )}

            {/* 产品特性 */}
            {product.features && product.features.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">产品特性</h2>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* 数量选择 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                数量
              </label>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={!product.inStock}
                >
                  -
                </Button>
                <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity((q) => q + 1)}
                  disabled={!product.inStock}
                >
                  +
                </Button>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="space-y-3">
              <Button
                className="w-full"
                size="lg"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                加入购物车
              </Button>
              <Button
                className="w-full"
                size="lg"
                variant="outline"
                onClick={handleBuyNow}
                disabled={!product.inStock}
              >
                立即购买
              </Button>
            </div>

            {/* SKU和标签 */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600 space-y-2">
                <div>
                  <span className="font-medium">SKU:</span> {product.sku}
                </div>
                {product.tags && product.tags.length > 0 && (
                  <div>
                    <span className="font-medium">标签:</span>{' '}
                    {product.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs mr-2 mt-1"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
