"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IconCheck, IconSparkles } from "@/components/ui/Icons";

const typeConfig: Record<string, { color: string; bg: string; icon: JSX.Element }> = {
  new_sale: {
    color: "text-green-600",
    bg: "bg-green-100",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  new_follower: {
    color: "text-brand-600",
    bg: "bg-brand-100",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  content_approved: {
    color: "text-emerald-600",
    bg: "bg-emerald-100",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  content_rejected: {
    color: "text-red-600",
    bg: "bg-red-100",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  new_review: {
    color: "text-amber-600",
    bg: "bg-amber-100",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" />
      </svg>
    ),
  },
};

const defaultConfig = {
  color: "text-surface-500",
  bg: "bg-surface-100",
  icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    </svg>
  ),
};

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/notifications?limit=50")
      .then((r) => r.json())
      .then((data) => {
        setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
        setUnreadCount(data.unreadCount ?? 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function markAllRead() {
    setMarkingAll(true);
    try {
      const res = await fetch("/api/notifications/read", { method: "PATCH" });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    } catch {}
    setMarkingAll(false);
  }

  async function handleClick(notification: Notification) {
    if (!notification.read) {
      try {
        const res = await fetch(`/api/notifications/${notification._id}/read`, { method: "PATCH" });
        if (res.ok) {
          setNotifications((prev) =>
            prev.map((n) => (n._id === notification._id ? { ...n, read: true } : n))
          );
          setUnreadCount((c) => Math.max(0, c - 1));
        }
      } catch {}
    }
    if (notification.link) {
      router.push(notification.link);
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="section-title text-2xl">Notifications</h1>
            {!loading && unreadCount > 0 && (
              <span className="badge-brand px-2.5 py-0.5 text-xs font-bold rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="text-surface-500 mt-1">Stay updated on your activity and content</p>
        </div>

        {!loading && unreadCount > 0 && (
          <button
            onClick={markAllRead}
            disabled={markingAll}
            className="btn-ghost inline-flex items-center gap-1.5 text-sm flex-shrink-0"
          >
            <IconCheck className="w-4 h-4" />
            {markingAll ? "Marking..." : "Mark all as read"}
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card animate-stagger-fade" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="flex items-start gap-4">
                <div className="skeleton w-10 h-10 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 rounded w-1/3" />
                  <div className="skeleton h-3 rounded w-2/3" />
                  <div className="skeleton h-3 rounded w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="card text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-surface-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
          </div>
          <p className="text-surface-500 text-lg mb-1 font-medium">No notifications yet</p>
          <p className="text-surface-400 text-sm mb-6">
            When you get sales, followers, reviews, or content updates, they&apos;ll show up here.
          </p>
          <button onClick={() => router.push("/dashboard")} className="btn-secondary inline-flex items-center gap-2">
            <IconSparkles className="w-4 h-4" />
            Go to Dashboard
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification, i) => {
            const config = typeConfig[notification.type] || defaultConfig;
            const isUnread = !notification.read;

            return (
              <button
                key={notification._id}
                onClick={() => handleClick(notification)}
                className={`w-full text-left card transition-all duration-200 hover:shadow-soft-md hover:-translate-y-0.5 group animate-stagger-fade ${
                  isUnread
                    ? "bg-brand-50/30 border-brand-100 hover:bg-brand-50/50"
                    : "hover:bg-surface-50"
                }`}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0 ${config.color}`}>
                    {config.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-semibold text-sm text-surface-900 group-hover:text-brand-600 transition-colors truncate">
                        {notification.title}
                      </h3>
                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-surface-500 mt-0.5 line-clamp-2 leading-relaxed">
                      {notification.message}
                    </p>
                    <span className="text-xs text-surface-400 mt-1.5 block">
                      {timeAgo(notification.createdAt)}
                    </span>
                  </div>

                  {/* Arrow */}
                  {notification.link && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-surface-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
