/** @type {import('next').NextConfig} */
const nextConfig = {
  // React严格模式
  reactStrictMode: true,

  // 输出模式（standalone用于Docker部署）
  output: 'standalone',

  // 图片配置
  images: {
    domains: [
      'localhost',
      'example.com',
      // 添加您的OSS域名
      process.env.NEXT_PUBLIC_OSS_DOMAIN || '',
    ].filter(Boolean),
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // 国际化配置
  i18n: {
    locales: ['zh-CN', 'en', 'id'],
    defaultLocale: 'zh-CN',
    localeDetection: false,
  },

  // 环境变量
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },

  // 编译配置
  compiler: {
    // 移除console.log（仅生产环境）
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // 重定向
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: true,
      },
    ];
  },

  // 重写
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },

  // 响应头
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Webpack配置
  webpack: (config, { isServer }) => {
    // 自定义webpack配置
    if (!isServer) {
      // 客户端配置
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },

  // 实验性功能
  experimental: {
    // Server Actions 在 Next.js 14 中默认启用
  },

  // 性能配置
  compress: true,
  poweredByHeader: false,

  // TypeScript配置
  typescript: {
    // 生产构建时忽略类型错误（不推荐）
    // ignoreBuildErrors: false,
  },

  // ESLint配置
  eslint: {
    // 生产构建时忽略ESLint错误（不推荐）
    // ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;
