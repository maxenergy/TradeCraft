'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

export interface FilterOptions {
  categories?: number[];
  priceRange?: { min: number; max: number };
  rating?: number;
  inStock?: boolean;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'popular';
  searchQuery?: string;
}

interface Category {
  id: number;
  name: string;
  count: number;
}

interface ProductFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
  categories?: Category[];
  className?: string;
}

export function ProductFilter({ onFilterChange, categories = [], className = '' }: ProductFilterProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    priceRange: { min: 0, max: 10000 },
    rating: 0,
    inStock: false,
    sortBy: 'newest',
    searchQuery: '',
  });

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [priceMin, setPriceMin] = useState('0');
  const [priceMax, setPriceMax] = useState('10000');

  const handleCategoryToggle = (categoryId: number) => {
    const newCategories = filters.categories?.includes(categoryId)
      ? filters.categories.filter((id) => id !== categoryId)
      : [...(filters.categories || []), categoryId];

    const newFilters = { ...filters, categories: newCategories };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = () => {
    const min = parseFloat(priceMin) || 0;
    const max = parseFloat(priceMax) || 10000;

    const newFilters = {
      ...filters,
      priceRange: { min, max },
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleRatingChange = (rating: number) => {
    const newFilters = {
      ...filters,
      rating: filters.rating === rating ? 0 : rating,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleStockToggle = () => {
    const newFilters = {
      ...filters,
      inStock: !filters.inStock,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (sortBy: FilterOptions['sortBy']) => {
    const newFilters = { ...filters, sortBy };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSearchChange = (searchQuery: string) => {
    const newFilters = { ...filters, searchQuery };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    const defaultFilters: FilterOptions = {
      categories: [],
      priceRange: { min: 0, max: 10000 },
      rating: 0,
      inStock: false,
      sortBy: 'newest',
      searchQuery: '',
    };
    setFilters(defaultFilters);
    setPriceMin('0');
    setPriceMax('10000');
    onFilterChange(defaultFilters);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
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
        <span className="ml-2 text-sm text-gray-600">及以上</span>
      </div>
    );
  };

  const filterContent = (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">搜索商品</label>
        <input
          type="text"
          value={filters.searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="输入商品名称或关键词"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">排序方式</label>
        <select
          value={filters.sortBy}
          onChange={(e) => handleSortChange(e.target.value as FilterOptions['sortBy'])}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="newest">最新上架</option>
          <option value="popular">最受欢迎</option>
          <option value="price_asc">价格从低到高</option>
          <option value="price_desc">价格从高到低</option>
          <option value="rating">评分最高</option>
        </select>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">商品分类</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <label key={category.id} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.categories?.includes(category.id)}
                  onChange={() => handleCategoryToggle(category.id)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-3 text-sm text-gray-700">
                  {category.name}
                  <span className="text-gray-500 ml-1">({category.count})</span>
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">价格区间</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">最低价</label>
              <input
                type="number"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">最高价</label>
              <input
                type="number"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                placeholder="10000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
            </div>
          </div>
          <Button onClick={handlePriceChange} size="sm" className="w-full">
            应用价格筛选
          </Button>
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">评分</h3>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => handleRatingChange(rating)}
              className={`w-full text-left p-2 rounded-md transition-colors ${
                filters.rating === rating
                  ? 'bg-primary-50 border-primary-300'
                  : 'hover:bg-gray-50'
              }`}
            >
              {renderStars(rating)}
            </button>
          ))}
        </div>
      </div>

      {/* Stock Status */}
      <div>
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={handleStockToggle}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <span className="ml-3 text-sm text-gray-700">仅显示有货商品</span>
        </label>
      </div>

      {/* Clear Filters */}
      <div className="pt-4 border-t">
        <Button variant="outline" onClick={handleClearFilters} className="w-full">
          清除所有筛选
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <Button onClick={() => setShowMobileFilters(!showMobileFilters)} className="w-full">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          筛选和排序
        </Button>
      </div>

      {/* Desktop Filters */}
      <div className={`hidden lg:block ${className}`}>
        <Card>
          <CardHeader className="border-b">
            <h2 className="text-lg font-semibold text-gray-900">筛选</h2>
          </CardHeader>
          <CardContent className="p-6">{filterContent}</CardContent>
        </Card>
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl">
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="px-6 py-4 border-b flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">筛选和排序</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-4">{filterContent}</div>

              {/* Footer */}
              <div className="px-6 py-4 border-t">
                <Button onClick={() => setShowMobileFilters(false)} className="w-full">
                  查看结果
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
