'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useNotification } from '@/contexts/NotificationContext';

interface Notification {
  id: number;
  type: 'order' | 'promotion' | 'system' | 'message';
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export default function NotificationsPage() {
  const notification = useNotification();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | Notification['type']>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await notificationApi.getNotifications();

      await new Promise((resolve) => setTimeout(resolve, 800));

      const mockNotifications: Notification[] = [
        {
          id: 1,
          type: 'order',
          title: '订单已发货',
          content: '您的订单 ORD-2024-001234 已发货，预计3天内送达。',
          isRead: false,
          createdAt: '2024-01-15T10:30:00Z',
          link: '/profile/orders',
        },
        {
          id: 2,
          type: 'promotion',
          title: '限时优惠',
          content: '全场电子产品8折优惠，仅限今天！立即抢购。',
          isRead: false,
          createdAt: '2024-01-15T09:00:00Z',
          link: '/products?category=1',
        },
        {
          id: 3,
          type: 'order',
          title: '订单已签收',
          content: '您的订单 ORD-2024-001233 已签收，感谢您的购买！',
          isRead: true,
          createdAt: '2024-01-14T16:45:00Z',
          link: '/profile/orders',
        },
        {
          id: 4,
          type: 'system',
          title: '系统维护通知',
          content: '系统将于今晚23:00-02:00进行维护，期间可能无法访问，请您谅解。',
          isRead: true,
          createdAt: '2024-01-14T14:20:00Z',
        },
        {
          id: 5,
          type: 'message',
          title: '客服回复',
          content: '您的售后申请已处理，客服已回复您的问题。',
          isRead: false,
          createdAt: '2024-01-14T11:10:00Z',
          link: '/contact',
        },
        {
          id: 6,
          type: 'promotion',
          title: '积分到账提醒',
          content: '您成功完成订单评价，获得100积分奖励。',
          isRead: true,
          createdAt: '2024-01-13T18:30:00Z',
        },
      ];

      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      // TODO: Replace with actual API call
      // await notificationApi.markAsRead(notificationId);

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // TODO: Replace with actual API call
      // await notificationApi.markAllAsRead();

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
      notification.success('全部标记已读');
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      notification.error('操作失败', '请稍后重试');
    }
  };

  const deleteNotification = async (notificationId: number) => {
    if (!confirm('确定要删除这条通知吗？')) return;

    try {
      // TODO: Replace with actual API call
      // await notificationApi.delete(notificationId);

      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      notification.success('删除成功');
    } catch (error) {
      console.error('Failed to delete notification:', error);
      notification.error('删除失败', '请稍后重试');
    }
  };

  const clearAll = async () => {
    if (!confirm('确定要清空所有通知吗？此操作不可恢复。')) return;

    try {
      // TODO: Replace with actual API call
      // await notificationApi.clearAll();

      setNotifications([]);
      notification.success('清空成功');
    } catch (error) {
      console.error('Failed to clear notifications:', error);
      notification.error('清空失败', '请稍后重试');
    }
  };

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order':
        return (
          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        );
      case 'promotion':
        return (
          <div className="flex-shrink-0 w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
          </div>
        );
      case 'system':
        return (
          <div className="flex-shrink-0 w-10 h-10 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'message':
        return (
          <div className="flex-shrink-0 w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
        );
    }
  };

  const getTypeText = (type: Notification['type']) => {
    switch (type) {
      case 'order':
        return '订单';
      case 'promotion':
        return '促销';
      case 'system':
        return '系统';
      case 'message':
        return '消息';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.isRead;
    return n.type === filter;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">通知中心</h1>
          <p className="text-gray-600">
            {unreadCount > 0 ? `您有 ${unreadCount} 条未读通知` : '暂无未读通知'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="border-b">
                <h2 className="font-semibold text-gray-900">筛选</h2>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  <button
                    onClick={() => setFilter('all')}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                      filter === 'all'
                        ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600'
                        : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
                    }`}
                  >
                    <span>全部通知</span>
                    <span className="text-sm text-gray-500">{notifications.length}</span>
                  </button>
                  <button
                    onClick={() => setFilter('unread')}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                      filter === 'unread'
                        ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600'
                        : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
                    }`}
                  >
                    <span>未读</span>
                    {unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setFilter('order')}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                      filter === 'order'
                        ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600'
                        : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
                    }`}
                  >
                    <span>订单通知</span>
                    <span className="text-sm text-gray-500">
                      {notifications.filter((n) => n.type === 'order').length}
                    </span>
                  </button>
                  <button
                    onClick={() => setFilter('promotion')}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                      filter === 'promotion'
                        ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600'
                        : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
                    }`}
                  >
                    <span>促销活动</span>
                    <span className="text-sm text-gray-500">
                      {notifications.filter((n) => n.type === 'promotion').length}
                    </span>
                  </button>
                  <button
                    onClick={() => setFilter('message')}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                      filter === 'message'
                        ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600'
                        : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
                    }`}
                  >
                    <span>客服消息</span>
                    <span className="text-sm text-gray-500">
                      {notifications.filter((n) => n.type === 'message').length}
                    </span>
                  </button>
                  <button
                    onClick={() => setFilter('system')}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                      filter === 'system'
                        ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600'
                        : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
                    }`}
                  >
                    <span>系统通知</span>
                    <span className="text-sm text-gray-500">
                      {notifications.filter((n) => n.type === 'system').length}
                    </span>
                  </button>
                </nav>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardContent className="p-4 space-y-2">
                <Button
                  onClick={markAllAsRead}
                  variant="outline"
                  className="w-full"
                  size="sm"
                  disabled={unreadCount === 0}
                >
                  全部标记已读
                </Button>
                <Button
                  onClick={clearAll}
                  variant="outline"
                  className="w-full text-red-600 border-red-600 hover:bg-red-50"
                  size="sm"
                  disabled={notifications.length === 0}
                >
                  清空所有通知
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Notifications List */}
          <div className="lg:col-span-3">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">暂无通知</h3>
                  <p className="text-gray-600">当前没有符合条件的通知</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredNotifications.map((notif) => (
                  <Card
                    key={notif.id}
                    className={`hover:shadow-lg transition-shadow ${
                      !notif.isRead ? 'border-l-4 border-primary-600 bg-primary-50/30' : ''
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        {getTypeIcon(notif.type)}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-gray-900">
                                  {notif.title}
                                </h3>
                                {!notif.isRead && (
                                  <span className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full"></span>
                                )}
                              </div>
                              <span className="text-xs text-gray-500">
                                {getTypeText(notif.type)} · {formatTime(notif.createdAt)}
                              </span>
                            </div>

                            <button
                              onClick={() => deleteNotification(notif.id)}
                              className="text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>

                          <p className="text-gray-600 mb-3">{notif.content}</p>

                          <div className="flex gap-3">
                            {notif.link && (
                              <a
                                href={notif.link}
                                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                              >
                                查看详情 →
                              </a>
                            )}
                            {!notif.isRead && (
                              <button
                                onClick={() => markAsRead(notif.id)}
                                className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                              >
                                标记已读
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
