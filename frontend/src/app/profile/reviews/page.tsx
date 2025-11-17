'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useNotification } from '@/contexts/NotificationContext';

interface Review {
  id: string;
  product: {
    id: string;
    name: string;
    image: string;
  };
  rating: number;
  title: string;
  content: string;
  images?: string[];
  helpful: number;
  notHelpful: number;
  verified: boolean;
  createdAt: string;
  updatedAt?: string;
  adminReply?: {
    content: string;
    repliedAt: string;
  };
}

export default function ReviewsPage() {
  const notification = useNotification();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    rating: 0,
    title: '',
    content: '',
  });

  useEffect(() => {
    const loadReviews = async () => {
      setIsLoading(true);
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/user/reviews');
        // const data = await response.json();

        // Mock data for demonstration
        const mockReviews: Review[] = [
          {
            id: '1',
            product: {
              id: '101',
              name: '智能手机 Pro Max 128GB',
              image: '/placeholder-product.jpg',
            },
            rating: 5,
            title: '非常满意的一次购物',
            content: '手机收到了，包装完好，外观精美。性能非常强劲，拍照效果也很棒。电池续航能力不错，一天重度使用没问题。屏幕显示效果出色，色彩鲜艳。总体来说非常满意，值得推荐！',
            images: ['/placeholder-review1.jpg', '/placeholder-review2.jpg'],
            helpful: 25,
            notHelpful: 2,
            verified: true,
            createdAt: '2024-01-10T14:30:00Z',
            adminReply: {
              content: '感谢您的好评！我们很高兴您对产品满意。如有任何问题，欢迎随时联系我们的客服团队。',
              repliedAt: '2024-01-11T09:00:00Z',
            },
          },
          {
            id: '2',
            product: {
              id: '102',
              name: '无线蓝牙降噪耳机',
              image: '/placeholder-product.jpg',
            },
            rating: 4,
            title: '音质不错，降噪效果好',
            content: '耳机的降噪效果确实很好，适合在地铁或飞机上使用。音质清晰，低音效果不错。佩戴舒适度还可以，长时间佩戴也不会太累。续航能力符合官方宣传。唯一的缺点是价格稍高。',
            helpful: 18,
            notHelpful: 1,
            verified: true,
            createdAt: '2024-01-08T11:20:00Z',
          },
          {
            id: '3',
            product: {
              id: '103',
              name: '智能手表旗舰版',
              image: '/placeholder-product.jpg',
            },
            rating: 5,
            title: '功能强大，值得购买',
            content: '这款智能手表功能非常全面，健康监测准确，运动追踪精准。续航时间比预期的好，充一次电能用两天。外观时尚大气，表带材质舒适。APP功能丰富，数据同步快速。强烈推荐！',
            images: ['/placeholder-review3.jpg'],
            helpful: 32,
            notHelpful: 0,
            verified: true,
            createdAt: '2024-01-05T16:45:00Z',
            updatedAt: '2024-01-06T10:00:00Z',
          },
        ];

        setReviews(mockReviews);
      } catch (error) {
        console.error('Failed to load reviews:', error);
        notification.error('加载失败', '无法加载评价列表');
      } finally {
        setIsLoading(false);
      }
    };

    loadReviews();
  }, [notification]);

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('确定要删除这条评价吗？删除后无法恢复。')) {
      return;
    }

    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/reviews/${reviewId}`, { method: 'DELETE' });

      setReviews(reviews.filter((review) => review.id !== reviewId));
      notification.success('删除成功', '评价已删除');
    } catch (error) {
      console.error('Failed to delete review:', error);
      notification.error('删除失败', '无法删除评价');
    }
  };

  const handleStartEdit = (review: Review) => {
    setEditingReview(review.id);
    setEditForm({
      rating: review.rating,
      title: review.title,
      content: review.content,
    });
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setEditForm({
      rating: 0,
      title: '',
      content: '',
    });
  };

  const handleSaveEdit = async (reviewId: string) => {
    if (!editForm.title.trim() || !editForm.content.trim()) {
      notification.warning('请填写完整', '标题和内容不能为空');
      return;
    }

    if (editForm.rating === 0) {
      notification.warning('请选择评分', '请选择1-5星评分');
      return;
    }

    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/reviews/${reviewId}`, {
      //   method: 'PUT',
      //   body: JSON.stringify(editForm),
      // });

      setReviews(
        reviews.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                ...editForm,
                updatedAt: new Date().toISOString(),
              }
            : review
        )
      );

      notification.success('更新成功', '评价已更新');
      setEditingReview(null);
    } catch (error) {
      console.error('Failed to update review:', error);
      notification.error('更新失败', '无法更新评价');
    }
  };

  const renderStars = (rating: number, interactive: boolean = false) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && setEditForm({ ...editForm, rating: star })}
            className={`${interactive ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <svg
              className={`w-5 h-5 ${
                star <= rating ? 'text-yellow-400' : 'text-gray-300'
              } fill-current ${interactive ? 'hover:text-yellow-500' : ''}`}
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600">加载评价...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">我的评价</h1>
          <p className="text-gray-600">您已发表 {reviews.length} 条评价</p>
        </div>

        {reviews.length === 0 ? (
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
                <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无评价</h3>
              <p className="text-gray-600 mb-6">您还没有发表任何评价</p>
              <Link href="/profile/orders">
                <Button>查看订单</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  {/* Product Info */}
                  <div className="flex items-center mb-4 pb-4 border-b border-gray-200">
                    <Link
                      href={`/products/${review.product.id}`}
                      className="flex items-center flex-1 hover:opacity-75 transition-opacity"
                    >
                      <div className="relative w-16 h-16 bg-gray-100 rounded-lg mr-4 flex-shrink-0">
                        <Image
                          src={review.product.image}
                          alt={review.product.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{review.product.name}</h3>
                        {review.verified && (
                          <span className="inline-flex items-center mt-1 text-xs text-green-600">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            已验证购买
                          </span>
                        )}
                      </div>
                    </Link>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStartEdit(review)}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        删除
                      </button>
                    </div>
                  </div>

                  {editingReview === review.id ? (
                    /* Edit Form */
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          评分
                        </label>
                        {renderStars(editForm.rating, true)}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          评价标题
                        </label>
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="简短总结您的评价"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          详细评价
                        </label>
                        <textarea
                          value={editForm.content}
                          onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                          rows={5}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="分享您的使用体验..."
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={() => handleSaveEdit(review.id)}>保存</Button>
                        <Button variant="outline" onClick={handleCancelEdit}>
                          取消
                        </Button>
                      </div>
                    </div>
                  ) : (
                    /* Review Display */
                    <>
                      <div className="mb-3">
                        {renderStars(review.rating)}
                      </div>

                      <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
                      <p className="text-gray-700 mb-4 whitespace-pre-wrap">{review.content}</p>

                      {review.images && review.images.length > 0 && (
                        <div className="flex gap-2 mb-4">
                          {review.images.map((image, index) => (
                            <div
                              key={index}
                              className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition-opacity"
                            >
                              <Image src={image} alt={`评价图片 ${index + 1}`} fill className="object-cover" />
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <span>发表于 {new Date(review.createdAt).toLocaleDateString()}</span>
                        {review.updatedAt && review.updatedAt !== review.createdAt && (
                          <span className="ml-3">
                            (编辑于 {new Date(review.updatedAt).toLocaleDateString()})
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-600">
                          {review.helpful} 人觉得有帮助
                        </span>
                        <span className="text-gray-300">|</span>
                        <span className="text-gray-600">
                          {review.notHelpful} 人觉得没帮助
                        </span>
                      </div>

                      {/* Admin Reply */}
                      {review.adminReply && (
                        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-start">
                            <svg
                              className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-blue-900">商家回复</span>
                                <span className="text-xs text-blue-600">
                                  {new Date(review.adminReply.repliedAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm text-blue-800">{review.adminReply.content}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Tips */}
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
                <h3 className="font-semibold text-gray-900 mb-2">评价小贴士</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 您可以随时编辑或删除自己的评价</li>
                  <li>• 真实的评价能帮助其他买家做出更好的购买决策</li>
                  <li>• 上传产品实拍图片可以让评价更有说服力</li>
                  <li>• 收到订单后15天内发表评价可获得积分奖励</li>
                  <li>• 优质评价有机会被精选展示</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
