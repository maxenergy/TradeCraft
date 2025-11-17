'use client';

import React, { useState, useEffect } from 'react';
import { useNotification } from '@/contexts/NotificationContext';

interface LiveStream {
  id: string;
  title: string;
  host: string;
  hostAvatar: string;
  thumbnail: string;
  viewers: number;
  status: 'live' | 'scheduled' | 'ended';
  startTime: string;
  category: string;
  tags: string[];
}

interface LiveProduct {
  id: string;
  name: string;
  image: string;
  originalPrice: number;
  livePrice: number;
  stock: number;
  sold: number;
  flashTime?: string;
}

interface Comment {
  id: string;
  user: string;
  avatar: string;
  message: string;
  timestamp: string;
}

export default function LiveStreamPage() {
  const notification = useNotification();
  const [activeTab, setActiveTab] = useState<'live' | 'scheduled' | 'replay'>('live');
  const [selectedStream, setSelectedStream] = useState<LiveStream | null>(null);
  const [showChat, setShowChat] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [followedHosts, setFollowedHosts] = useState<string[]>(['host-1', 'host-2']);

  // Mock data
  const liveStreams: LiveStream[] = [
    {
      id: 'stream-1',
      title: '秋冬新品发布会 - 时尚穿搭专场',
      host: '时尚达人小美',
      hostAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=xiaomei',
      thumbnail: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800',
      viewers: 12845,
      status: 'live',
      startTime: new Date().toISOString(),
      category: '服装',
      tags: ['新品', '限时优惠', '满减'],
    },
    {
      id: 'stream-2',
      title: '数码3C专场 - iPhone 15 Pro开箱评测',
      host: '科技老王',
      hostAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=laowang',
      thumbnail: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
      viewers: 8653,
      status: 'live',
      startTime: new Date().toISOString(),
      category: '数码',
      tags: ['新品', '评测'],
    },
    {
      id: 'stream-3',
      title: '美妆护肤专场 - 秋季护肤指南',
      host: '美妆博主Lisa',
      hostAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa',
      thumbnail: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800',
      viewers: 15234,
      status: 'live',
      startTime: new Date().toISOString(),
      category: '美妆',
      tags: ['护肤', '限时秒杀'],
    },
    {
      id: 'stream-4',
      title: '家居好物推荐 - 提升生活品质',
      host: '家居生活馆',
      hostAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=home',
      thumbnail: 'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800',
      viewers: 0,
      status: 'scheduled',
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      category: '家居',
      tags: ['预告'],
    },
    {
      id: 'stream-5',
      title: '零食吃货专场 - 进口零食大放送',
      host: '吃货小张',
      hostAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhang',
      thumbnail: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=800',
      viewers: 0,
      status: 'scheduled',
      startTime: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
      category: '食品',
      tags: ['预告', '限时优惠'],
    },
  ];

  const liveProducts: LiveProduct[] = [
    {
      id: 'prod-1',
      name: '秋冬羊毛大衣',
      image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400',
      originalPrice: 899,
      livePrice: 499,
      stock: 100,
      sold: 67,
    },
    {
      id: 'prod-2',
      name: '针织毛衣套装',
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400',
      originalPrice: 299,
      livePrice: 159,
      stock: 50,
      sold: 43,
      flashTime: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    },
    {
      id: 'prod-3',
      name: '羊绒围巾',
      image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400',
      originalPrice: 199,
      livePrice: 99,
      stock: 200,
      sold: 156,
    },
  ];

  const comments: Comment[] = [
    {
      id: 'c-1',
      user: '买买买',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
      message: '主播讲解好专业！',
      timestamp: '2分钟前',
    },
    {
      id: 'c-2',
      user: '时尚icon',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2',
      message: '这件大衣好好看，已下单',
      timestamp: '3分钟前',
    },
    {
      id: 'c-3',
      user: '购物狂',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3',
      message: '还有优惠券吗？',
      timestamp: '5分钟前',
    },
  ];

  const handleFollowHost = (hostId: string) => {
    if (followedHosts.includes(hostId)) {
      setFollowedHosts(followedHosts.filter(id => id !== hostId));
      notification.info('已取消关注', '您已取消关注该主播');
    } else {
      setFollowedHosts([...followedHosts, hostId]);
      notification.success('关注成功', '开播时会第一时间通知您');
    }
  };

  const handleJoinStream = (stream: LiveStream) => {
    setSelectedStream(stream);
    if (stream.status === 'live') {
      notification.success('进入直播间', `欢迎来到${stream.host}的直播间`);
    }
  };

  const handleAddToCart = (product: LiveProduct) => {
    // TODO: Implement add to cart functionality
    notification.success('已加入购物车', `${product.name}已添加到购物车`);
  };

  const handleBuyNow = (product: LiveProduct) => {
    // TODO: Implement buy now functionality
    notification.success('立即购买', `正在跳转到结算页面...`);
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      notification.warning('请输入内容', '评论内容不能为空');
      return;
    }
    // TODO: Implement send comment functionality
    notification.success('发送成功', '您的评论已发送');
    setNewComment('');
  };

  const handleSetReminder = (stream: LiveStream) => {
    // TODO: Implement reminder functionality
    notification.success('预约成功', `已设置${stream.title}的开播提醒`);
  };

  const filteredStreams = liveStreams.filter(stream => {
    if (activeTab === 'live') return stream.status === 'live';
    if (activeTab === 'scheduled') return stream.status === 'scheduled';
    if (activeTab === 'replay') return stream.status === 'ended';
    return true;
  });

  const formatViewers = (count: number) => {
    if (count >= 10000) return `${(count / 10000).toFixed(1)}万`;
    return count.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                直播购物
              </h1>
              <p className="text-gray-600 mt-1">边看边买，好物不等待</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-lg">
                <p className="text-sm text-purple-700">
                  <span className="font-bold">{filteredStreams.filter(s => s.status === 'live').length}</span> 场直播进行中
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-purple-100">
          <button
            onClick={() => setActiveTab('live')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'live'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            正在直播
            {liveStreams.filter(s => s.status === 'live').length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {liveStreams.filter(s => s.status === 'live').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('scheduled')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'scheduled'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            预告
          </button>
          <button
            onClick={() => setActiveTab('replay')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'replay'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            回放
          </button>
        </div>

        {/* Stream List */}
        {!selectedStream ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStreams.map((stream) => (
              <div
                key={stream.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1"
                onClick={() => handleJoinStream(stream)}
              >
                <div className="relative">
                  <img
                    src={stream.thumbnail}
                    alt={stream.title}
                    className="w-full h-48 object-cover"
                  />
                  {stream.status === 'live' && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full flex items-center gap-1 animate-pulse">
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                      <span className="text-sm font-bold">直播中</span>
                    </div>
                  )}
                  {stream.status === 'scheduled' && (
                    <div className="absolute top-3 left-3 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      预告
                    </div>
                  )}
                  {stream.status === 'live' && (
                    <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded text-sm">
                      {formatViewers(stream.viewers)} 人在看
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={stream.hostAvatar}
                        alt={stream.host}
                        className="w-10 h-10 rounded-full border-2 border-white"
                      />
                      <div className="flex-1">
                        <p className="text-white font-medium">{stream.host}</p>
                        <p className="text-white/80 text-sm">{stream.category}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{stream.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {stream.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {stream.status === 'scheduled' && (
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">
                        {new Date(stream.startTime).toLocaleString('zh-CN', {
                          month: 'numeric',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetReminder(stream);
                        }}
                        className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                      >
                        预约提醒
                      </button>
                    </div>
                  )}
                  {stream.status === 'live' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJoinStream(stream);
                      }}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium"
                    >
                      进入直播间
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Live Stream View */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Stream Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Video Player */}
              <div className="bg-black rounded-xl overflow-hidden shadow-xl">
                <div className="relative aspect-video">
                  <img
                    src={selectedStream.thumbnail}
                    alt={selectedStream.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full flex items-center gap-2 animate-pulse">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    <span className="font-bold">LIVE</span>
                  </div>
                  <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full">
                    {formatViewers(selectedStream.viewers)} 观看
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedStream.hostAvatar}
                        alt={selectedStream.host}
                        className="w-12 h-12 rounded-full border-2 border-white"
                      />
                      <div>
                        <p className="text-white font-bold">{selectedStream.host}</p>
                        <p className="text-white/80 text-sm">{selectedStream.category}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleFollowHost(selectedStream.id)}
                      className={`px-4 py-2 rounded-full font-medium transition-all ${
                        followedHosts.includes(selectedStream.id)
                          ? 'bg-gray-300 text-gray-700'
                          : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                      }`}
                    >
                      {followedHosts.includes(selectedStream.id) ? '已关注' : '+ 关注'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Stream Info */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedStream.title}</h2>
                <div className="flex flex-wrap gap-2">
                  {selectedStream.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Products */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">直播商品</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {liveProducts.map((product) => (
                    <div
                      key={product.id}
                      className="border border-purple-100 rounded-lg p-4 hover:shadow-lg transition-all"
                    >
                      <div className="flex gap-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 mb-2">{product.name}</h4>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl font-bold text-red-600">
                              ¥{product.livePrice}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ¥{product.originalPrice}
                            </span>
                          </div>
                          <div className="mb-2">
                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                              <span>已售 {product.sold}</span>
                              <span>库存 {product.stock}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-gradient-to-r from-purple-600 to-pink-600 h-1.5 rounded-full"
                                style={{ width: `${(product.sold / (product.sold + product.stock)) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          {product.flashTime && (
                            <p className="text-xs text-red-600 mb-2">
                              🔥 即将秒杀，限时抢购
                            </p>
                          )}
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="flex-1 bg-purple-100 text-purple-700 py-1.5 rounded hover:bg-purple-200 transition-all text-sm font-medium"
                            >
                              加购物车
                            </button>
                            <button
                              onClick={() => handleBuyNow(product)}
                              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-1.5 rounded hover:from-purple-700 hover:to-pink-700 transition-all text-sm font-medium"
                            >
                              立即购买
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setSelectedStream(null)}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-all font-medium"
              >
                返回直播列表
              </button>
            </div>

            {/* Chat Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-6">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4">
                  <h3 className="text-white font-bold">直播互动</h3>
                </div>
                <div className="h-96 overflow-y-auto p-4 space-y-3">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <img
                        src={comment.avatar}
                        alt={comment.user}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-900">{comment.user}</span>
                          <span className="text-xs text-gray-500">{comment.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-700">{comment.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSendComment} className="border-t border-gray-200 p-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="说点什么..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium"
                    >
                      发送
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredStreams.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📺</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">暂无直播</h3>
            <p className="text-gray-600">敬请期待更多精彩直播</p>
          </div>
        )}
      </div>
    </div>
  );
}
