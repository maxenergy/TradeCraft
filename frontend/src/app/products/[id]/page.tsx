'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { formatPrice } from '@/lib/utils';
import { WishlistButton } from '@/components/product/WishlistButton';
import { ProductReviews } from '@/components/product/ProductReviews';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = parseInt(params.id as string);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      // TODO: Implement API call to fetch product
      // const response = await productApi.getProduct(productId);
      // setProduct(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch product:', error);
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    setAddingToCart(true);

    try {
      // TODO: Implement API call to add to cart
      // await cartApi.addToCart(product.id, quantity);
      alert('已添加到购物车');
      setQuantity(1);
    } catch (error: any) {
      console.error('Failed to add to cart:', error);
      alert(error.response?.data?.message || '添加失败，请重试');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;

    try {
      // Add to cart first
      // await cartApi.addToCart(product.id, quantity);
      // Redirect to checkout
      router.push('/checkout');
    } catch (error: any) {
      console.error('Failed to buy now:', error);
      alert(error.response?.data?.message || '操作失败，请重试');
    }
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 0)) {
      setQuantity(newQuantity);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
            fill={star <= rating ? 'currentColor' : 'none'}
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
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载商品信息...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">商品未找到</h1>
          <p className="text-gray-600 mb-6">该商品不存在或已下架</p>
          <Button onClick={() => router.push('/products')}>返回商品列表</Button>
        </div>
      </div>
    );
  }

  // Mock images for demonstration
  const images = product.imageUrl
    ? [product.imageUrl, product.imageUrl, product.imageUrl]
    : [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center text-sm text-gray-600">
          <Link href="/" className="hover:text-primary-600">
            首页
          </Link>
          <svg
            className="w-4 h-4 mx-2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
          <Link href="/products" className="hover:text-primary-600">
            商品列表
          </Link>
          <svg
            className="w-4 h-4 mx-2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div>
            <Card className="mb-4">
              <CardContent className="p-4">
                {/* Main Image */}
                <div className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden mb-4">
                  {images.length > 0 ? (
                    <img
                      src={images[selectedImage]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg
                        className="w-24 h-24"
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

                  {/* Wishlist Button */}
                  <div className="absolute top-4 right-4">
                    <WishlistButton productId={product.id} size="lg" className="shadow-lg" />
                  </div>

                  {/* Discount Badge */}
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-500 text-white">
                        -
                        {Math.round(
                          ((product.originalPrice - product.price) / product.originalPrice) * 100
                        )}
                        %
                      </span>
                    </div>
                  )}
                </div>

                {/* Thumbnail Images */}
                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square bg-gray-200 rounded-md overflow-hidden border-2 ${
                          selectedImage === index
                            ? 'border-primary-600'
                            : 'border-transparent hover:border-gray-300'
                        }`}
                      >
                        <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Product Info */}
          <div>
            <Card>
              <CardContent className="p-6">
                {/* Product Name */}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>

                {/* Rating and Reviews */}
                <div className="flex items-center mb-4">
                  {renderStars(Math.round(product.rating || 0))}
                  <span className="ml-2 text-sm text-gray-600">
                    {product.rating?.toFixed(1)} ({product.reviewCount || 0} 评价)
                  </span>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl font-bold text-primary-600">
                      {formatPrice(product.price, 'CNY')}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-lg text-gray-500 line-through">
                        {formatPrice(product.originalPrice, 'CNY')}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">含税价格</p>
                </div>

                {/* Stock Status */}
                <div className="mb-6 pb-6 border-b">
                  {product.stock > 0 ? (
                    <div className="flex items-center text-green-600">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-medium">
                        有货 ({product.stock} 件可售)
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="font-medium">暂时缺货</span>
                    </div>
                  )}
                </div>

                {/* Quantity Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">数量</label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="w-10 h-10 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M20 12H4" />
                      </svg>
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value >= 1 && value <= product.stock) {
                          setQuantity(value);
                        }
                      }}
                      className="w-20 text-center px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock}
                      className="w-10 h-10 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0 || addingToCart}
                    className="w-full"
                    size="lg"
                  >
                    {addingToCart ? '添加中...' : '加入购物车'}
                  </Button>
                  <Button
                    onClick={handleBuyNow}
                    disabled={product.stock === 0}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    立即购买
                  </Button>
                </div>

                {/* Product Features */}
                {product.features && product.features.length > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">产品特点</h3>
                    <ul className="space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <svg
                            className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Card className="mb-12">
          <div className="border-b">
            <div className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('description')}
                className={`py-4 border-b-2 font-medium text-sm ${
                  activeTab === 'description'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                商品描述
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`py-4 border-b-2 font-medium text-sm ${
                  activeTab === 'specs'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                规格参数
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-4 border-b-2 font-medium text-sm ${
                  activeTab === 'reviews'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                用户评价 ({product.reviewCount || 0})
              </button>
            </div>
          </div>

          <CardContent className="p-6">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {product.description || '暂无商品描述'}
                </p>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex py-3 border-b">
                  <span className="text-gray-600 w-32">商品编号</span>
                  <span className="text-gray-900 font-medium">{product.sku || '-'}</span>
                </div>
                <div className="flex py-3 border-b">
                  <span className="text-gray-600 w-32">品牌</span>
                  <span className="text-gray-900 font-medium">{product.brand || '-'}</span>
                </div>
                <div className="flex py-3 border-b">
                  <span className="text-gray-600 w-32">重量</span>
                  <span className="text-gray-900 font-medium">
                    {product.weight ? `${product.weight} kg` : '-'}
                  </span>
                </div>
                <div className="flex py-3 border-b">
                  <span className="text-gray-600 w-32">上架时间</span>
                  <span className="text-gray-900 font-medium">
                    {product.createdAt
                      ? new Date(product.createdAt).toLocaleDateString('zh-CN')
                      : '-'}
                  </span>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && <ProductReviews productId={product.id} />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
