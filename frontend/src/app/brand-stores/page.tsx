'use client';

import React, { useState } from 'react';
import { useNotification } from '@/contexts/NotificationContext';

interface Brand {
  id: string;
  name: string;
  nameEn: string;
  logo: string;
  banner: string;
  description: string;
  category: string;
  country: string;
  followers: number;
  products: number;
  isOfficial: boolean;
  isFollowed: boolean;
  tags: string[];
  discount?: string;
}

interface BrandProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  sales: number;
  rating: number;
  reviews: number;
  badge?: string;
}

export default function BrandStoresPage() {
  const notification = useNotification();
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [selectedCountry, setSelectedCountry] = useState<string>('全部');
  const [sortBy, setSortBy] = useState<'popular' | 'followers' | 'newest'>('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [followedBrands, setFollowedBrands] = useState<string[]>(['brand-1', 'brand-3']);

  const categories = ['全部', '服装', '数码', '美妆', '家居', '食品', '运动', '母婴'];
  const countries = ['全部', '中国', '日本', '美国', '韩国', '欧洲'];

  // Mock data
  const brands: Brand[] = [
    {
      id: 'brand-1',
      name: '优衣库',
      nameEn: 'UNIQLO',
      logo: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200',
      banner: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200',
      description: '服适人生，源自日本的快时尚品牌',
      category: '服装',
      country: '日本',
      followers: 1250000,
      products: 3580,
      isOfficial: true,
      isFollowed: true,
      tags: ['快时尚', '基础款', '高性价比'],
      discount: '全场5折起',
    },
    {
      id: 'brand-2',
      name: '苹果',
      nameEn: 'Apple',
      logo: 'https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=200',
      banner: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=1200',
      description: '创新科技，改变世界',
      category: '数码',
      country: '美国',
      followers: 3500000,
      products: 156,
      isOfficial: true,
      isFollowed: false,
      tags: ['科技', '创新', '高端'],
      discount: '教育优惠',
    },
    {
      id: 'brand-3',
      name: '雅诗兰黛',
      nameEn: 'Estée Lauder',
      logo: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200',
      banner: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200',
      description: '高端美妆护肤品牌',
      category: '美妆',
      country: '美国',
      followers: 2100000,
      products: 892,
      isOfficial: true,
      isFollowed: true,
      tags: ['高端', '护肤', '抗衰老'],
      discount: '满额赠礼',
    },
    {
      id: 'brand-4',
      name: '无印良品',
      nameEn: 'MUJI',
      logo: 'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=200',
      banner: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200',
      description: '简约生活美学',
      category: '家居',
      country: '日本',
      followers: 980000,
      products: 2456,
      isOfficial: true,
      isFollowed: false,
      tags: ['简约', '性冷淡', '生活方式'],
    },
    {
      id: 'brand-5',
      name: '耐克',
      nameEn: 'Nike',
      logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200',
      banner: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1200',
      description: 'Just Do It - 运动精神',
      category: '运动',
      country: '美国',
      followers: 4200000,
      products: 5680,
      isOfficial: true,
      isFollowed: false,
      tags: ['运动', '时尚', '专业'],
      discount: '新品上市',
    },
    {
      id: 'brand-6',
      name: '三只松鼠',
      nameEn: 'Three Squirrels',
      logo: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=200',
      banner: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=1200',
      description: '互联网坚果品牌',
      category: '食品',
      country: '中国',
      followers: 1580000,
      products: 456,
      isOfficial: true,
      isFollowed: false,
      tags: ['零食', '坚果', '健康'],
      discount: '买2送1',
    },
    {
      id: 'brand-7',
      name: '戴森',
      nameEn: 'Dyson',
      logo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200',
      banner: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
      description: '重新定义家电科技',
      category: '家居',
      country: '欧洲',
      followers: 1850000,
      products: 89,
      isOfficial: true,
      isFollowed: false,
      tags: ['高端', '科技', '创新'],
    },
    {
      id: 'brand-8',
      name: '后',
      nameEn: 'WHOO',
      logo: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200',
      banner: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200',
      description: '宫廷御用美妆品牌',
      category: '美妆',
      country: '韩国',
      followers: 1320000,
      products: 234,
      isOfficial: true,
      isFollowed: false,
      tags: ['韩妆', '高端', '宫廷秘方'],
      discount: '满减活动',
    },
  ];

  const brandProducts: BrandProduct[] = [
    {
      id: 'prod-1',
      name: 'LifeWear 羊毛混纺大衣',
      image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400',
      price: 599,
      originalPrice: 1199,
      sales: 5680,
      rating: 4.8,
      reviews: 2340,
      badge: '热销',
    },
    {
      id: 'prod-2',
      name: 'AIRism 防晒衣',
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400',
      price: 199,
      originalPrice: 399,
      sales: 12340,
      rating: 4.9,
      reviews: 5680,
      badge: '爆款',
    },
    {
      id: 'prod-3',
      name: 'Heattech 保暖内衣',
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400',
      price: 79,
      originalPrice: 159,
      sales: 23450,
      rating: 4.7,
      reviews: 8920,
      badge: '新品',
    },
    {
      id: 'prod-4',
      name: '羊绒围巾',
      image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400',
      price: 299,
      originalPrice: 599,
      sales: 3450,
      rating: 4.8,
      reviews: 1560,
    },
  ];

  const handleFollowBrand = (brandId: string) => {
    if (followedBrands.includes(brandId)) {
      setFollowedBrands(followedBrands.filter(id => id !== brandId));
      notification.info('已取消关注', '您已取消关注该品牌');
    } else {
      setFollowedBrands([...followedBrands, brandId]);
      notification.success('关注成功', '新品上架、优惠活动会第一时间通知您');
    }
  };

  const handleEnterStore = (brand: Brand) => {
    setSelectedBrand(brand);
    notification.success('欢迎光临', `欢迎来到${brand.name}官方旗舰店`);
  };

  const handleAddToCart = (product: BrandProduct) => {
    // TODO: Implement add to cart functionality
    notification.success('已加入购物车', `${product.name}已添加到购物车`);
  };

  const filteredBrands = brands.filter(brand => {
    const matchesCategory = selectedCategory === '全部' || brand.category === selectedCategory;
    const matchesCountry = selectedCountry === '全部' || brand.country === selectedCountry;
    const matchesSearch = brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         brand.nameEn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesCountry && matchesSearch;
  });

  const sortedBrands = [...filteredBrands].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.products - a.products;
      case 'followers':
        return b.followers - a.followers;
      case 'newest':
        return a.id.localeCompare(b.id);
      default:
        return 0;
    }
  });

  const formatFollowers = (count: number) => {
    if (count >= 10000) return `${(count / 10000).toFixed(1)}万`;
    return count.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                品牌馆
              </h1>
              <p className="text-gray-600 mt-1">官方正品，品质保证</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-lg">
                <p className="text-sm text-blue-700">
                  <span className="font-bold">{brands.filter(b => b.isOfficial).length}</span> 个官方品牌
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedBrand ? (
          <>
            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索品牌..."
                  className="col-span-1 md:col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="popular">最受欢迎</option>
                  <option value="followers">粉丝最多</option>
                  <option value="newest">最新入驻</option>
                </select>
              </div>

              {/* Category Filter */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">品牌分类</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedCategory === category
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Country Filter */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">品牌国家</p>
                <div className="flex flex-wrap gap-2">
                  {countries.map((country) => (
                    <button
                      key={country}
                      onClick={() => setSelectedCountry(country)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedCountry === country
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {country}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Brand Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedBrands.map((brand) => (
                <div
                  key={brand.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1"
                >
                  {/* Brand Banner */}
                  <div className="relative h-32 overflow-hidden">
                    <img
                      src={brand.banner}
                      alt={brand.name}
                      className="w-full h-full object-cover"
                    />
                    {brand.discount && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        {brand.discount}
                      </div>
                    )}
                  </div>

                  {/* Brand Info */}
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="w-16 h-16 rounded-lg object-cover border-2 border-gray-100"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900">{brand.name}</h3>
                          {brand.isOfficial && (
                            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded">
                              官方
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{brand.nameEn}</p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{brand.description}</p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {brand.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">粉丝</p>
                        <p className="font-bold text-gray-900">{formatFollowers(brand.followers)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">商品</p>
                        <p className="font-bold text-gray-900">{brand.products}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">国家</p>
                        <p className="font-bold text-gray-900">{brand.country}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleFollowBrand(brand.id)}
                        className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                          followedBrands.includes(brand.id)
                            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        }`}
                      >
                        {followedBrands.includes(brand.id) ? '已关注' : '+ 关注'}
                      </button>
                      <button
                        onClick={() => handleEnterStore(brand)}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
                      >
                        进入店铺
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {sortedBrands.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏪</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">未找到相关品牌</h3>
                <p className="text-gray-600">请尝试其他搜索条件</p>
              </div>
            )}
          </>
        ) : (
          /* Brand Store View */
          <div>
            {/* Store Header */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
              <div className="relative h-64">
                <img
                  src={selectedBrand.banner}
                  alt={selectedBrand.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="flex items-end gap-6">
                    <img
                      src={selectedBrand.logo}
                      alt={selectedBrand.name}
                      className="w-24 h-24 rounded-lg border-4 border-white shadow-lg"
                    />
                    <div className="flex-1 text-white">
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold">{selectedBrand.name}</h1>
                        {selectedBrand.isOfficial && (
                          <span className="bg-blue-500 text-white px-3 py-1 rounded text-sm">
                            官方旗舰店
                          </span>
                        )}
                      </div>
                      <p className="text-white/90 mb-3">{selectedBrand.nameEn}</p>
                      <p className="text-white/80 text-sm max-w-2xl mb-4">{selectedBrand.description}</p>
                      <div className="flex items-center gap-6">
                        <div>
                          <span className="text-2xl font-bold">{formatFollowers(selectedBrand.followers)}</span>
                          <span className="text-white/80 ml-2">粉丝</span>
                        </div>
                        <div>
                          <span className="text-2xl font-bold">{selectedBrand.products}</span>
                          <span className="text-white/80 ml-2">商品</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleFollowBrand(selectedBrand.id)}
                      className={`px-8 py-3 rounded-lg font-medium transition-all ${
                        followedBrands.includes(selectedBrand.id)
                          ? 'bg-white/20 text-white hover:bg-white/30'
                          : 'bg-white text-blue-600 hover:bg-gray-100'
                      }`}
                    >
                      {followedBrands.includes(selectedBrand.id) ? '已关注' : '+ 关注品牌'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Store Navigation */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-6">
              <div className="flex gap-6">
                <button className="text-blue-600 font-medium border-b-2 border-blue-600 pb-2">
                  全部商品
                </button>
                <button className="text-gray-600 hover:text-blue-600 pb-2">
                  新品上架
                </button>
                <button className="text-gray-600 hover:text-blue-600 pb-2">
                  热销榜单
                </button>
                <button className="text-gray-600 hover:text-blue-600 pb-2">
                  限时优惠
                </button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
              {brandProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all"
                >
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover"
                    />
                    {product.badge && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                        {product.badge}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${
                              i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">({product.reviews})</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl font-bold text-red-600">¥{product.price}</span>
                      <span className="text-sm text-gray-500 line-through">¥{product.originalPrice}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">已售 {product.sales}</p>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
                    >
                      加入购物车
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedBrand(null)}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-all font-medium"
            >
              返回品牌列表
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
