"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function NotificationBell() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!session) return;
    fetch("/api/notifications?limit=5")
      .then((r) => r.json())
      .then((data) => {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      })
      .catch(() => {});

    const interval = setInterval(() => {
      fetch("/api/notifications?limit=5")
        .then((r) => r.json())
        .then((data) => setUnreadCount(data.unreadCount || 0))
        .catch(() => {});
    }, 30000);

    return () => clearInterval(interval);
  }, [session]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function markAllRead() {
    await fetch("/api/notifications/read", { method: "PATCH" });
    setUnreadCount(0);
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  }

  async function handleNotificationClick(id: string) {
    await fetch(`/api/notifications/${id}/read`, { method: "PATCH" });
    setNotifications(notifications.map((n) => (n._id === id ? { ...n, read: true } : n)));
    setUnreadCount(Math.max(0, unreadCount - 1));
    setOpen(false);
  }

  if (!session) return null;

  const typeIcon: Record<string, string> = {
    new_sale: "text-green-500",
    new_follower: "text-brand-500",
    content_approved: "text-emerald-500",
    content_rejected: "text-red-500",
    new_review: "text-amber-500",
  };

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="btn-ghost p-2 relative">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center min-w-[18px] h-[18px] shadow-soft-sm">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 card shadow-soft-xl animate-slide-down max-h-[400px] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-surface-100">
            <h3 className="font-display font-bold text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs text-brand-600 hover:text-brand-700 font-medium">
                Mark all read
              </button>
            )}
          </div>
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <p className="text-center text-surface-400 text-sm py-8">No notifications</p>
            ) : (
              notifications.map((n) => (
                <Link
                  key={n._id}
                  href={n.link || "/dashboard/notifications"}
                  onClick={() => handleNotificationClick(n._id)}
                  className={`block px-4 py-3 border-b border-surface-50 hover:bg-surface-50 transition-colors ${!n.read ? "bg-brand-50/30" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.read ? "bg-brand-500" : "bg-transparent"}`} />
                    <div className="min-w-0">
                      <p className={`text-sm font-medium ${!n.read ? "text-surface-900" : "text-surface-600"}`}>{n.title}</p>
                      <p className="text-xs text-surface-400 mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-[10px] text-surface-300 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
          <Link
            href="/dashboard/notifications"
            className="block text-center py-2.5 text-xs font-medium text-brand-600 hover:bg-surface-50 border-t border-surface-100"
            onClick={() => setOpen(false)}
          >
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
}
