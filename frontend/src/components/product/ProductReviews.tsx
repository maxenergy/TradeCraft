'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

interface Review {
  id: number;
  userId: number;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  helpful: number;
  verified: boolean;
}

interface ReviewFormData {
  rating: number;
  title: string;
  comment: string;
}

interface ProductReviewsProps {
  productId: number;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<ReviewFormData>({
    rating: 5,
    title: '',
    comment: '',
  });

  const [errors, setErrors] = useState<Partial<ReviewFormData>>({});
  const [filter, setFilter] = useState<'all' | 'verified' | number>('all');

  useEffect(() => {
    fetchReviews();
  }, [productId, filter]);

  const fetchReviews = async () => {
    try {
      // TODO: Implement API call to fetch reviews
      // const response = await reviewApi.getProductReviews(productId, { filter });
      // setReviews(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name as keyof ReviewFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleRatingChange = (rating: number) => {
    setFormData((prev) => ({
      ...prev,
      rating,
    }));
    if (errors.rating) {
      setErrors((prev) => ({ ...prev, rating: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ReviewFormData> = {};

    if (formData.rating === 0) {
      newErrors.rating = '请选择评分';
    }

    if (!formData.title.trim()) {
      newErrors.title = '请输入评价标题';
    } else if (formData.title.length > 100) {
      newErrors.title = '标题最多100个字符';
    }

    if (!formData.comment.trim()) {
      newErrors.comment = '请输入评价内容';
    } else if (formData.comment.length < 10) {
      newErrors.comment = '评价内容至少10个字符';
    } else if (formData.comment.length > 1000) {
      newErrors.comment = '评价内容最多1000个字符';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      // TODO: Implement API call to submit review
      // await reviewApi.createReview(productId, formData);
      alert('感谢您的评价！');
      setFormData({ rating: 5, title: '', comment: '' });
      setShowForm(false);
      fetchReviews();
    } catch (error: any) {
      console.error('Failed to submit review:', error);
      alert(error.response?.data?.message || '提交失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkHelpful = async (reviewId: number) => {
    try {
      // TODO: Implement API call to mark review as helpful
      // await reviewApi.markHelpful(reviewId);
      fetchReviews();
    } catch (error) {
      console.error('Failed to mark helpful:', error);
    }
  };

  const getAverageRating = (): number => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  const getRatingDistribution = (): Record<number, number> => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const renderStars = (rating: number, interactive: boolean = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRate && onRate(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            disabled={!interactive}
          >
            <svg
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
          </button>
        ))}
      </div>
    );
  };

  const averageRating = getAverageRating();
  const distribution = getRatingDistribution();

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card>
        <CardHeader className="border-b">
          <h2 className="text-lg font-semibold text-gray-900">客户评价</h2>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Average Rating */}
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900 mb-2">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center mb-2">
                {renderStars(Math.round(averageRating))}
              </div>
              <p className="text-sm text-gray-600">基于 {reviews.length} 条评价</p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = distribution[rating as keyof typeof distribution];
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={rating} className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-700 w-8">{rating}星</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Write Review Button */}
          <div className="mt-6 pt-6 border-t text-center">
            <Button onClick={() => setShowForm(!showForm)} variant={showForm ? 'outline' : 'default'}>
              {showForm ? '取消评价' : '写评价'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Review Form */}
      {showForm && (
        <Card>
          <CardHeader className="border-b">
            <h3 className="text-lg font-semibold text-gray-900">写评价</h3>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  评分 <span className="text-red-500">*</span>
                </label>
                {renderStars(formData.rating, true, handleRatingChange)}
                {errors.rating && <p className="mt-1 text-sm text-red-500">{errors.rating}</p>}
              </div>

              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  评价标题 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="概括您的评价"
                  maxLength={100}
                />
                {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
              </div>

              {/* Comment */}
              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                  评价内容 <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  value={formData.comment}
                  onChange={handleInputChange}
                  rows={5}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.comment ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="分享您的使用体验..."
                  maxLength={1000}
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.comment ? (
                    <p className="text-sm text-red-500">{errors.comment}</p>
                  ) : (
                    <div></div>
                  )}
                  <p className="text-xs text-gray-500">{formData.comment.length}/1000</p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="flex-1"
                  disabled={submitting}
                >
                  取消
                </Button>
                <Button type="submit" className="flex-1" disabled={submitting}>
                  {submitting ? '提交中...' : '提交评价'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filter */}
      <div className="flex space-x-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          全部
        </Button>
        <Button
          variant={filter === 'verified' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('verified')}
        >
          已验证购买
        </Button>
        {[5, 4, 3, 2, 1].map((rating) => (
          <Button
            key={rating}
            variant={filter === rating ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(rating)}
          >
            {rating}星
          </Button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">加载评价中...</p>
          </div>
        ) : reviews.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500">暂无评价</p>
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {review.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900">{review.userName}</p>
                        {review.verified && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            已验证购买
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString('zh-CN')}
                      </p>
                    </div>
                  </div>
                  {renderStars(review.rating)}
                </div>

                <h4 className="text-base font-semibold text-gray-900 mb-2">{review.title}</h4>
                <p className="text-sm text-gray-700 mb-4">{review.comment}</p>

                <div className="flex items-center justify-between pt-4 border-t">
                  <button
                    onClick={() => handleMarkHelpful(review.id)}
                    className="flex items-center text-sm text-gray-600 hover:text-primary-600"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    有帮助 ({review.helpful})
                  </button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
