'use client';

import React, { useState, useEffect } from 'react';

interface WishlistButtonProps {
  productId: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function WishlistButton({ productId, size = 'md', className = '' }: WishlistButtonProps) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkWishlistStatus();
  }, [productId]);

  const checkWishlistStatus = async () => {
    try {
      // TODO: Implement API call to check if product is in wishlist
      // const response = await wishlistApi.isInWishlist(productId);
      // setIsInWishlist(response.data.data);
    } catch (error) {
      console.error('Failed to check wishlist status:', error);
    }
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);

    try {
      if (isInWishlist) {
        // TODO: Implement API call to remove from wishlist
        // await wishlistApi.removeFromWishlist(productId);
        setIsInWishlist(false);
      } else {
        // TODO: Implement API call to add to wishlist
        // await wishlistApi.addToWishlist(productId);
        setIsInWishlist(true);
      }
    } catch (error: any) {
      console.error('Failed to toggle wishlist:', error);
      alert(error.response?.data?.message || '操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <button
      onClick={handleToggleWishlist}
      disabled={loading}
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center transition-all ${
        isInWishlist
          ? 'bg-red-100 text-red-600 hover:bg-red-200'
          : 'bg-white text-gray-600 hover:bg-gray-100'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      title={isInWishlist ? '从收藏中移除' : '添加到收藏'}
    >
      {loading ? (
        <div className={`${iconSizeClasses[size]} border-2 border-current border-t-transparent rounded-full animate-spin`}></div>
      ) : (
        <svg
          className={iconSizeClasses[size]}
          fill={isInWishlist ? 'currentColor' : 'none'}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )}
    </button>
  );
}
