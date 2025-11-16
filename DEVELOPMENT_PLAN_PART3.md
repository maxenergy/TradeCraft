# 跨境电商AI自动化平台 - 详细开发计划（第3部分）

**这是DEVELOPMENT_PLAN.md的续篇，涵盖Week 5-12**

---

## 四、独立站前台基础（Week 5-6，Day 21-30）

### Day 21-22: 首页开发

#### 21.1 首页布局（app/[locale]/page.tsx）

```typescript
'use client';

import { useTranslations } from 'next-intl';
import { HeroBanner } from '@/components/home/HeroBanner';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { CategoryShowcase } from '@/components/home/CategoryShowcase';
import { Container } from '@/components/layout/Container';
import { NewsletterSubscribe } from '@/components/home/NewsletterSubscribe';

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <div className="min-h-screen">
      {/* Hero轮播Banner */}
      <HeroBanner />

      {/* 热销商品 */}
      <section className="py-16 bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('featured.title')}</h2>
            <p className="text-gray-600">{t('featured.subtitle')}</p>
          </div>
          <FeaturedProducts />
        </Container>
      </section>

      {/* 商品分类 */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('categories.title')}</h2>
            <p className="text-gray-600">{t('categories.subtitle')}</p>
          </div>
          <CategoryShowcase />
        </Container>
      </section>

      {/* 邮件订阅（P1功能，可选） */}
      {/* <section className="py-16 bg-blue-600 text-white">
        <Container>
          <NewsletterSubscribe />
        </Container>
      </section> */}
    </div>
  );
}
```

#### 21.2 轮播Banner组件

**components/home/HeroBanner.tsx**:
```typescript
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BannerSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

const slides: BannerSlide[] = [
  {
    id: 1,
    image: '/banners/slide1.jpg',
    title: 'Summer Sale',
    subtitle: 'Up to 50% off on selected items',
    ctaText: 'Shop Now',
    ctaLink: '/products?sale=true',
  },
  {
    id: 2,
    image: '/banners/slide2.jpg',
    title: 'New Arrivals',
    subtitle: 'Check out our latest products',
    ctaText: 'Explore',
    ctaLink: '/products?sort=newest',
  },
  {
    id: 3,
    image: '/banners/slide3.jpg',
    title: 'Free Shipping',
    subtitle: 'On orders over $50',
    ctaText: 'Learn More',
    ctaLink: '/shipping-policy',
  },
];

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // 自动播放
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // 5秒切换

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <div className="relative w-full h-[600px] lg:h-[700px] overflow-hidden bg-gray-900">
      {/* 轮播图片 */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />

          {/* 遮罩 */}
          <div className="absolute inset-0 bg-black/40" />

          {/* 内容 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-4 max-w-3xl">
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 animate-fade-in-up">
                {slide.title}
              </h1>
              <p className="text-xl lg:text-2xl mb-8 animate-fade-in-up animation-delay-200">
                {slide.subtitle}
              </p>
              <Link href={slide.ctaLink}>
                <Button
                  size="lg"
                  className="bg-white text-gray-900 hover:bg-gray-100 animate-fade-in-up animation-delay-400"
                >
                  {slide.ctaText}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* 左右箭头 */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 rounded-full p-3 transition-all z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 rounded-full p-3 transition-all z-10"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* 指示器 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 rounded-full transition-all ${
              index === currentSlide
                ? 'bg-white w-8'
                : 'bg-white/50 w-3 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
```

#### 21.3 热销商品组件

**components/home/FeaturedProducts.tsx**:
```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/lib/api/product.api';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductGrid } from '@/components/product/ProductGrid';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function FeaturedProducts() {
  const { data, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productApi.getFeaturedProducts(12),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const products = data?.data || [];

  return (
    <div>
      <ProductGrid>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ProductGrid>

      {/* 查看更多 */}
      <div className="text-center mt-12">
        <Link href="/products">
          <Button variant="outline" size="lg">
            View All Products
          </Button>
        </Link>
      </div>
    </div>
  );
}
```

#### 21.4 商品卡片组件

**components/product/ProductCard.tsx**:
```typescript
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { useCartStore } from '@/store/useCartStore';
import { ProductResponse } from '@/types/product';
import { formatCurrency } from '@/lib/utils/currency';

interface ProductCardProps {
  product: ProductResponse;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const addToCart = useCartStore((state) => state.addItem);

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // 阻止Link跳转
    setIsAddingToCart(true);

    try {
      await addToCart({
        productId: product.id,
        skuId: null,
        quantity: 1,
      });

      toast({
        title: 'Success',
        description: 'Product added to cart',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add to cart',
        variant: 'destructive',
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <Card
      className="group relative overflow-hidden transition-shadow hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.id}`}>
        {/* 图片区域 */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {/* 主图 */}
          <Image
            src={product.images.main || '/placeholder-product.png'}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* 第二张图片（悬停时显示） */}
          {product.images.gallery?.[0] && (
            <Image
              src={product.images.gallery[0]}
              alt={product.name}
              fill
              className={`object-cover transition-opacity duration-300 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}

          {/* 折扣标签 */}
          {discountPercentage > 0 && (
            <Badge className="absolute top-3 left-3 bg-red-500">
              -{discountPercentage}%
            </Badge>
          )}

          {/* 库存状态 */}
          {product.stock === 0 && (
            <Badge className="absolute top-3 right-3 bg-gray-900">
              Out of Stock
            </Badge>
          )}

          {/* 快速操作按钮（悬停时显示） */}
          <div
            className={`absolute inset-x-4 bottom-4 flex gap-2 transition-all duration-300 ${
              isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
            }`}
          >
            <Button
              size="sm"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAddingToCart}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {isAddingToCart ? 'Adding...' : 'Add to Cart'}
            </Button>
            <Button size="sm" variant="outline">
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 商品信息 */}
        <CardContent className="p-4">
          {/* 商品名称 */}
          <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>

          {/* 价格 */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-bold">
              {formatCurrency(product.price, product.currency)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatCurrency(product.originalPrice, product.currency)}
              </span>
            )}
          </div>

          {/* 评分和销量 */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <span>⭐</span>
              <span>4.5</span>
            </div>
            <span>•</span>
            <span>{product.salesCount} sold</span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
```

#### 21.5 分类展示组件

**components/home/CategoryShowcase.tsx**:
```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { categoryApi } from '@/lib/api/category.api';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export function CategoryShowcase() {
  const { data, isLoading } = useQuery({
    queryKey: ['categories-showcase'],
    queryFn: () => categoryApi.getTopCategories(6),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const categories = data?.data || [];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
      {categories.map((category) => (
        <Link key={category.id} href={`/categories/${category.slug}`}>
          <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg">
            <div className="relative aspect-square overflow-hidden bg-gray-100">
              <Image
                src={category.imageUrl || '/placeholder-category.png'}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <CardContent className="p-4 text-center">
              <h3 className="font-semibold mb-1 group-hover:text-blue-600 transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-gray-500">
                {category.productCount} products
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
```

---

### Day 23-25: 商品列表页

#### 23.1 商品列表页面

**app/[locale]/products/page.tsx**:
```typescript
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductFilter } from '@/components/product/ProductFilter';
import { ProductSort } from '@/components/product/ProductSort';
import { Pagination } from '@/components/common/Pagination';
import { Button } from '@/components/ui/button';
import { Filter, LayoutGrid, List } from 'lucide-react';
import { productApi } from '@/lib/api/product.api';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductListItem } from '@/components/product/ProductListItem';

type ViewMode = 'grid' | 'list';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [page, setPage] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // 从URL参数获取筛选条件
  const filters = {
    category: searchParams.get('category') || undefined,
    minPrice: searchParams.get('minPrice') || undefined,
    maxPrice: searchParams.get('maxPrice') || undefined,
    sort: searchParams.get('sort') || 'default',
  };

  const { data, isLoading } = useQuery({
    queryKey: ['products', page, filters],
    queryFn: () => productApi.getProducts({
      ...filters,
      page,
      size: 20,
    }),
  });

  const products = data?.data.items || [];
  const pagination = data?.data.pagination;

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-8">
        {/* 面包屑 */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'All Products', href: '/products' },
          ]}
        />

        <div className="flex flex-col lg:flex-row gap-8 mt-6">
          {/* 筛选侧边栏（桌面端） */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <ProductFilter filters={filters} onFiltersChange={() => setPage(0)} />
          </aside>

          {/* 主内容区 */}
          <div className="flex-1">
            {/* 工具栏 */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="flex items-center justify-between gap-4">
                {/* 结果统计 */}
                <div className="text-sm text-gray-600">
                  Showing {pagination?.page * pagination?.pageSize + 1}-
                  {Math.min(
                    (pagination?.page + 1) * pagination?.pageSize,
                    pagination?.totalItems
                  )}{' '}
                  of {pagination?.totalItems} products
                </div>

                <div className="flex items-center gap-4">
                  {/* 筛选按钮（移动端） */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>

                  {/* 排序 */}
                  <ProductSort value={filters.sort} />

                  {/* 视图切换 */}
                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* 筛选面板（移动端） */}
            {showFilters && (
              <div className="lg:hidden bg-white rounded-lg shadow p-4 mb-6">
                <ProductFilter
                  filters={filters}
                  onFiltersChange={() => {
                    setPage(0);
                    setShowFilters(false);
                  }}
                />
              </div>
            )}

            {/* 商品列表 */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-gray-500 text-lg">No products found</p>
                <p className="text-gray-400 text-sm mt-2">
                  Try adjusting your filters
                </p>
              </div>
            ) : viewMode === 'grid' ? (
              <ProductGrid>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </ProductGrid>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <ProductListItem key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* 分页 */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
```

#### 23.2 商品筛选组件

**components/product/ProductFilter.tsx**:
```typescript
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { categoryApi } from '@/lib/api/category.api';
import { formatCurrency } from '@/lib/utils/currency';

interface ProductFilterProps {
  filters: Record<string, any>;
  onFiltersChange: () => void;
}

export function ProductFilter({ filters, onFiltersChange }: ProductFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [priceRange, setPriceRange] = useState([
    parseInt(filters.minPrice || '0'),
    parseInt(filters.maxPrice || '1000'),
  ]);

  // 获取分类列表
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getAllCategories(),
  });

  const categories = categoriesData?.data || [];

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const params = new URLSearchParams(searchParams);

    if (checked) {
      params.set('category', categoryId);
    } else {
      params.delete('category');
    }

    router.push(`/products?${params.toString()}`);
    onFiltersChange();
  };

  const handlePriceChange = () => {
    const params = new URLSearchParams(searchParams);
    params.set('minPrice', priceRange[0].toString());
    params.set('maxPrice', priceRange[1].toString());
    router.push(`/products?${params.toString()}`);
    onFiltersChange();
  };

  const handleClearFilters = () => {
    router.push('/products');
    setPriceRange([0, 1000]);
    onFiltersChange();
  };

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Filters</h3>
        <Button variant="ghost" size="sm" onClick={handleClearFilters}>
          Clear All
        </Button>
      </div>

      {/* 分类筛选 */}
      <div>
        <Label className="text-base font-semibold mb-4 block">Categories</Label>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center gap-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={filters.category === category.id.toString()}
                onCheckedChange={(checked) =>
                  handleCategoryChange(category.id.toString(), checked as boolean)
                }
              />
              <label
                htmlFor={`category-${category.id}`}
                className="text-sm cursor-pointer flex-1"
              >
                {category.name}
              </label>
              <span className="text-xs text-gray-500">
                ({category.productCount})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 价格范围 */}
      <div>
        <Label className="text-base font-semibold mb-4 block">Price Range</Label>
        <div className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            min={0}
            max={1000}
            step={10}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm">
            <span>{formatCurrency(priceRange[0], 'USD')}</span>
            <span>{formatCurrency(priceRange[1], 'USD')}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePriceChange}
            className="w-full"
          >
            Apply
          </Button>
        </div>
      </div>

      {/* 库存状态 */}
      <div>
        <Label className="text-base font-semibold mb-4 block">Availability</Label>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Checkbox id="in-stock" defaultChecked />
            <label htmlFor="in-stock" className="text-sm cursor-pointer">
              In Stock
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="out-of-stock" />
            <label htmlFor="out-of-stock" className="text-sm cursor-pointer">
              Out of Stock
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
```

#### 23.3 商品排序组件

**components/product/ProductSort.tsx**:
```typescript
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProductSortProps {
  value: string;
}

export function ProductSort({ value }: ProductSortProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', newSort);
    router.push(`/products?${params.toString()}`);
  };

  return (
    <Select value={value} onValueChange={handleSortChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="default">Default</SelectItem>
        <SelectItem value="price_asc">Price: Low to High</SelectItem>
        <SelectItem value="price_desc">Price: High to Low</SelectItem>
        <SelectItem value="newest">Newest First</SelectItem>
        <SelectItem value="popular">Most Popular</SelectItem>
      </SelectContent>
    </Select>
  );
}
```

---

### Day 26-28: 商品详情页

#### 26.1 商品详情页面

**app/[locale]/products/[id]/page.tsx**:
```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { ProductGallery } from '@/components/product/ProductGallery';
import { VariantSelector } from '@/components/product/VariantSelector';
import { QuantitySelector } from '@/components/product/QuantitySelector';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Heart, Share2, Truck, Shield, RefreshCw } from 'lucide-react';
import { productApi } from '@/lib/api/product.api';
import { useCartStore } from '@/store/useCartStore';
import { toast } from '@/components/ui/use-toast';
import { formatCurrency } from '@/lib/utils/currency';
import { RelatedProducts } from '@/components/product/RelatedProducts';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = parseInt(params.id as string);

  const [selectedSku, setSelectedSku] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const addToCart = useCartStore((state) => state.addItem);

  // 获取商品详情
  const { data, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productApi.getProductById(productId),
  });

  const product = data?.data;

  const handleAddToCart = async () => {
    if (!product) return;

    // 如果有多规格，必须选择SKU
    if (product.skus && product.skus.length > 0 && !selectedSku) {
      toast({
        title: 'Please select variant',
        description: 'Please select size, color or other options',
        variant: 'destructive',
      });
      return;
    }

    setIsAddingToCart(true);
    try {
      await addToCart({
        productId: product.id,
        skuId: selectedSku,
        quantity,
      });

      toast({
        title: 'Success',
        description: `Added ${quantity} item(s) to cart`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add to cart',
        variant: 'destructive',
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    // 跳转到结账页
    window.location.href = '/checkout';
  };

  if (isLoading) {
    return (
      <Container className="py-12">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
        </div>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
        </div>
      </Container>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Container className="py-8">
        {/* 面包屑 */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Products', href: '/products' },
            { label: product.categoryName, href: `/categories/${product.categoryId}` },
            { label: product.name },
          ]}
        />

        {/* 商品主体 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">
          {/* 左侧：图片 */}
          <div>
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* 右侧：商品信息 */}
          <div className="space-y-6">
            {/* 商品名称 */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <span>⭐</span>
                  <span className="font-semibold">4.5</span>
                  <span className="text-gray-500">(128 reviews)</span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="text-gray-600">{product.salesCount} sold</span>
              </div>
            </div>

            {/* 价格 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-red-600">
                  {formatCurrency(product.price, product.currency)}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      {formatCurrency(product.originalPrice, product.currency)}
                    </span>
                    <Badge variant="destructive">
                      -
                      {Math.round(
                        ((product.originalPrice - product.price) / product.originalPrice) * 100
                      )}
                      %
                    </Badge>
                  </>
                )}
              </div>
            </div>

            {/* 规格选择 */}
            {product.skus && product.skus.length > 0 && (
              <div>
                <VariantSelector
                  skus={product.skus}
                  selectedSku={selectedSku}
                  onSkuChange={setSelectedSku}
                />
              </div>
            )}

            {/* 数量选择 */}
            <div>
              <label className="text-sm font-semibold mb-2 block">Quantity</label>
              <QuantitySelector
                value={quantity}
                onChange={setQuantity}
                max={product.stock}
              />
              <p className="text-sm text-gray-500 mt-2">
                {product.stock > 10
                  ? 'In Stock'
                  : product.stock > 0
                  ? `Only ${product.stock} left!`
                  : 'Out of Stock'}
              </p>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-4">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAddingToCart}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {isAddingToCart ? 'Adding...' : 'Add to Cart'}
              </Button>
              <Button
                size="lg"
                variant="destructive"
                className="flex-1"
                onClick={handleBuyNow}
                disabled={product.stock === 0}
              >
                Buy Now
              </Button>
            </div>

            {/* 次要操作 */}
            <div className="flex gap-4">
              <Button variant="outline" className="flex-1">
                <Heart className="h-5 w-5 mr-2" />
                Add to Wishlist
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* 服务承诺 */}
            <div className="border-t pt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Truck className="h-5 w-5 text-blue-600" />
                <span>Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="h-5 w-5 text-green-600" />
                <span>Secure payment & buyer protection</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <RefreshCw className="h-5 w-5 text-orange-600" />
                <span>30-day return policy</span>
              </div>
            </div>
          </div>
        </div>

        {/* 商品详情标签页 */}
        <div className="mt-16">
          <Tabs defaultValue="description">
            <TabsList>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
              <TabsTrigger value="reviews">Reviews (128)</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
              {product.features && product.features.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-lg mb-4">Key Features</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex py-3 border-b">
                  <span className="font-semibold w-40">SKU:</span>
                  <span>{product.sku}</span>
                </div>
                <div className="flex py-3 border-b">
                  <span className="font-semibold w-40">Weight:</span>
                  <span>{product.weightGrams}g</span>
                </div>
                {product.dimensions && (
                  <div className="flex py-3 border-b">
                    <span className="font-semibold w-40">Dimensions:</span>
                    <span>
                      {product.dimensions.length} × {product.dimensions.width} ×{' '}
                      {product.dimensions.height} cm
                    </span>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="shipping" className="mt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Shipping Information</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Free standard shipping on orders over $50</li>
                    <li>• Express shipping available for $9.99</li>
                    <li>• Estimated delivery: 7-14 business days</li>
                    <li>• International shipping available</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3">Return Policy</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• 30-day return policy</li>
                    <li>• Items must be unused and in original packaging</li>
                    <li>• Free return shipping on defective items</li>
                    <li>• Refunds processed within 5-7 business days</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <p className="text-gray-600">Reviews feature coming soon...</p>
            </TabsContent>
          </Tabs>
        </div>

        {/* 相关推荐商品 */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
          <RelatedProducts productId={product.id} />
        </div>
      </Container>
    </div>
  );
}
```

#### 26.2 商品图片画廊

**components/product/ProductGallery.tsx**:
```typescript
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';

interface ProductGalleryProps {
  images: {
    main: string;
    gallery?: string[];
  };
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const allImages = [images.main, ...(images.gallery || [])];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  };

  return (
    <>
      <div className="space-y-4">
        {/* 主图 */}
        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
          <Image
            src={allImages[currentIndex]}
            alt={`${productName} - Image ${currentIndex + 1}`}
            fill
            className="object-cover"
            priority
          />

          {/* 放大按钮 */}
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => setIsZoomed(true)}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>

          {/* 左右箭头 */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {/* 缩略图 */}
        {allImages.length > 1 && (
          <div className="grid grid-cols-5 gap-2">
            {allImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex
                    ? 'border-blue-600 ring-2 ring-blue-600 ring-opacity-50'
                    : 'border-transparent hover:border-gray-300'
                }`}
              >
                <Image
                  src={image}
                  alt={`${productName} - Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 放大查看对话框 */}
      <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
        <DialogContent className="max-w-4xl">
          <div className="relative aspect-square">
            <Image
              src={allImages[currentIndex]}
              alt={`${productName} - Zoomed`}
              fill
              className="object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
```

#### 26.3 规格选择器

**components/product/VariantSelector.tsx**:
```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductSkuResponse } from '@/types/product';

interface VariantSelectorProps {
  skus: ProductSkuResponse[];
  selectedSku: number | null;
  onSkuChange: (skuId: number | null) => void;
}

export function VariantSelector({ skus, selectedSku, onSkuChange }: VariantSelectorProps) {
  // 提取所有规格属性
  const attributes: Record<string, string[]> = {};

  skus.forEach((sku) => {
    Object.entries(sku.attributes).forEach(([key, value]) => {
      if (!attributes[key]) {
        attributes[key] = [];
      }
      if (!attributes[key].includes(value as string)) {
        attributes[key].push(value as string);
      }
    });
  });

  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});

  // 当选择属性时，更新SKU
  const handleAttributeChange = (attributeName: string, attributeValue: string) => {
    const newAttributes = {
      ...selectedAttributes,
      [attributeName]: attributeValue,
    };
    setSelectedAttributes(newAttributes);

    // 查找匹配的SKU
    const matchingSku = skus.find((sku) =>
      Object.entries(newAttributes).every(
        ([key, value]) => sku.attributes[key] === value
      )
    );

    onSkuChange(matchingSku?.id || null);
  };

  // 检查某个属性值是否可选（是否有库存）
  const isAttributeAvailable = (attributeName: string, attributeValue: string) => {
    const testAttributes = {
      ...selectedAttributes,
      [attributeName]: attributeValue,
    };

    return skus.some(
      (sku) =>
        Object.entries(testAttributes).every(
          ([key, value]) => !testAttributes[key] || sku.attributes[key] === value
        ) && sku.stock > 0
    );
  };

  // 获取选中SKU的信息
  const selectedSkuInfo = skus.find((sku) => sku.id === selectedSku);

  return (
    <div className="space-y-6">
      {Object.entries(attributes).map(([attributeName, attributeValues]) => (
        <div key={attributeName}>
          <label className="text-sm font-semibold mb-3 block capitalize">
            {attributeName}:{' '}
            {selectedAttributes[attributeName] && (
              <span className="text-blue-600">{selectedAttributes[attributeName]}</span>
            )}
          </label>
          <div className="flex flex-wrap gap-2">
            {attributeValues.map((attributeValue) => {
              const isSelected = selectedAttributes[attributeName] === attributeValue;
              const isAvailable = isAttributeAvailable(attributeName, attributeValue);

              return (
                <Button
                  key={attributeValue}
                  variant={isSelected ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleAttributeChange(attributeName, attributeValue)}
                  disabled={!isAvailable}
                  className={`min-w-[80px] ${
                    !isAvailable ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {attributeValue}
                  {!isAvailable && (
                    <span className="ml-1 text-xs line-through">✕</span>
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      ))}

      {/* SKU信息 */}
      {selectedSkuInfo && (
        <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
          <div className="text-sm">
            <span className="font-semibold">Selected: </span>
            {Object.entries(selectedSkuInfo.attributes).map(([key, value], index) => (
              <span key={key}>
                {index > 0 && ', '}
                {value as string}
              </span>
            ))}
          </div>
          <Badge variant={selectedSkuInfo.stock > 0 ? 'default' : 'destructive'}>
            {selectedSkuInfo.stock > 0
              ? `${selectedSkuInfo.stock} in stock`
              : 'Out of stock'}
          </Badge>
        </div>
      )}
    </div>
  );
}
```

由于篇幅限制，让我继续创建剩余Week 7-12的内容...
