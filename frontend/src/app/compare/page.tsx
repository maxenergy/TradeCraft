'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useNotification } from '@/contexts/NotificationContext';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  brand: string;
  inStock: boolean;
  features: {
    [key: string]: string | number | boolean;
  };
  description: string;
}

export default function ProductComparePage() {
  const notification = useNotification();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        // Get product IDs from URL params
        const productIds = searchParams.get('ids')?.split(',') || [];

        // TODO: Replace with actual API call
        // const response = await fetch(`/api/products/compare?ids=${productIds.join(',')}`);
        // const data = await response.json();

        // Mock data for demonstration
        const mockProducts: Product[] = productIds.slice(0, 4).map((id, index) => ({
          id,
          name: `产品 ${index + 1} - 高端智能设备`,
          price: 2999 + index * 500,
          originalPrice: 3999 + index * 500,
          rating: 4.5 - index * 0.2,
          reviews: 1250 - index * 200,
          image: '/placeholder-product.jpg',
          category: '电子产品',
          brand: `品牌${String.fromCharCode(65 + index)}`,
          inStock: index % 2 === 0,
          features: {
            '屏幕尺寸': `${6.1 + index * 0.2}英寸`,
            '处理器': `${8 - index}核心`,
            '内存': `${8 + index * 2}GB`,
            '存储': `${256 + index * 128}GB`,
            '电池': `${4000 + index * 500}mAh`,
            '相机': `${48 + index * 12}MP`,
            '5G支持': index < 2,
            '防水等级': `IP${68 - index}`,
            '重量': `${180 + index * 10}g`,
            '保修': `${1 + index}年`,
          },
          description: '这是一款高端智能设备，配备先进的技术和优质的用户体验。',
        }));

        setProducts(mockProducts);
        setSelectedProducts(productIds);
      } catch (error) {
        console.error('Failed to load products:', error);
        notification.error('加载失败', '无法加载产品对比信息');
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [searchParams, notification]);

  const handleRemoveProduct = (productId: string) => {
    const updatedProducts = products.filter((p) => p.id !== productId);
    setProducts(updatedProducts);

    const updatedIds = selectedProducts.filter((id) => id !== productId);
    setSelectedProducts(updatedIds);

    // Update URL
    const newUrl = updatedIds.length > 0
      ? `/compare?ids=${updatedIds.join(',')}`
      : '/compare';
    window.history.pushState({}, '', newUrl);

    notification.success('已移除', '产品已从对比列表中移除');
  };

  const handleAddToCart = (productId: string, productName: string) => {
    // TODO: Implement add to cart functionality
    notification.success('已加入购物车', `${productName} 已加入购物车`);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} fill-current`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating.toFixed(1)})</span>
      </div>
    );
  };

  const renderFeatureValue = (value: string | number | boolean) => {
    if (typeof value === 'boolean') {
      return value ? (
        <span className="text-green-600 font-medium">✓ 支持</span>
      ) : (
        <span className="text-red-600 font-medium">✗ 不支持</span>
      );
    }
    return <span className="font-medium">{value}</span>;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600">加载对比信息...</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-200 rounded-full mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">暂无对比产品</h2>
            <p className="text-gray-600 mb-8">
              您还没有添加任何产品进行对比。浏览产品页面并添加产品到对比列表。
            </p>
            <Link href="/products">
              <Button size="lg">浏览产品</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get all unique feature keys
  const allFeatureKeys = Array.from(
    new Set(products.flatMap((p) => Object.keys(p.features)))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">产品对比</h1>
              <p className="text-gray-600 mt-1">对比 {products.length} 个产品</p>
            </div>
            <Link href="/products">
              <Button variant="outline">继续浏览</Button>
            </Link>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 bg-gray-50 font-semibold text-gray-900 w-48">
                    产品信息
                  </th>
                  {products.map((product) => (
                    <th key={product.id} className="p-4 text-center min-w-[250px]">
                      <div className="relative">
                        <button
                          onClick={() => handleRemoveProduct(product.id)}
                          className="absolute top-0 right-0 text-gray-400 hover:text-red-600 transition-colors"
                          title="移除"
                        >
                          <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <div className="relative w-40 h-40 mx-auto mb-4 bg-gray-100 rounded-lg">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                        {renderStars(product.rating)}
                        <p className="text-xs text-gray-500 mt-1">{product.reviews} 条评价</p>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Price */}
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900 bg-gray-50">价格</td>
                  {products.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-2xl font-bold text-primary-600">
                          ¥{product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ¥{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Stock Status */}
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900 bg-gray-50">库存状态</td>
                  {products.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      {product.inStock ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          有货
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                          缺货
                        </span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Features */}
                {allFeatureKeys.map((featureKey) => (
                  <tr key={featureKey} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900 bg-gray-50">{featureKey}</td>
                    {products.map((product) => (
                      <td key={product.id} className="p-4 text-center">
                        {product.features[featureKey] !== undefined ? (
                          renderFeatureValue(product.features[featureKey])
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Actions */}
                <tr className="bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">操作</td>
                  {products.map((product) => (
                    <td key={product.id} className="p-4">
                      <div className="flex flex-col gap-2">
                        <Link href={`/products/${product.id}`}>
                          <Button variant="outline" className="w-full">
                            查看详情
                          </Button>
                        </Link>
                        <Button
                          onClick={() => handleAddToCart(product.id, product.name)}
                          disabled={!product.inStock}
                          className="w-full"
                        >
                          {product.inStock ? '加入购物车' : '缺货'}
                        </Button>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Tips */}
        <Card className="mt-6">
          <CardContent className="p-6">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-primary-600 mt-0.5 mr-3 flex-shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">对比小贴士</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 您最多可以同时对比 4 个产品</li>
                  <li>• 点击产品图片右上角的 ✕ 可以移除该产品</li>
                  <li>• 查看详情了解更多产品信息和用户评价</li>
                  <li>• 绿色 ✓ 表示支持该功能，红色 ✗ 表示不支持</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
