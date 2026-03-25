"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ContentCard from "@/components/content/ContentCard";
import { IconSparkles, IconArrowRight } from "@/components/ui/Icons";

interface WishlistContent {
  _id: string;
  title: string;
  description: string;
  type: string;
  price: number;
  thumbnailUrl?: string;
  averageRating: number;
  totalSales: number;
  viewCount?: number;
  creator?: { name: string; image?: string };
  category?: { name: string };
}

interface WishlistItem {
  _id: string;
  content: WishlistContent;
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/wishlist")
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data.items ?? [];
        setItems(list.filter((item: WishlistItem) => item.content !== null && item.content !== undefined));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-2xl">My Wishlist</h1>
        <p className="text-[#797586] mt-1">Content you&apos;ve saved for later</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card p-0 overflow-hidden animate-stagger-fade" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="skeleton aspect-[16/10]" />
              <div className="p-4 space-y-3">
                <div className="skeleton h-5 rounded w-3/4" />
                <div className="skeleton h-3 rounded w-full" />
                <div className="skeleton h-3 rounded w-1/2" />
                <div className="divider-gradient" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="skeleton w-6 h-6 rounded-md" />
                    <div className="skeleton h-3 rounded w-20" />
                  </div>
                  <div className="skeleton h-3 rounded w-12" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="card text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-[#f1f3ff] flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#797586]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </div>
          <p className="text-[#797586] text-lg mb-1 font-medium">Your wishlist is empty</p>
          <p className="text-[#797586] text-sm mb-6">
            Save content you love and come back to it anytime.
          </p>
          <Link href="/browse" className="btn-primary inline-flex items-center gap-2">
            <IconSparkles className="w-4 h-4" />
            Browse Content
            <IconArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item: WishlistItem, i: number) => (
            <div key={item._id || item.content._id} className="animate-stagger-fade" style={{ animationDelay: `${i * 60}ms` }}>
              <ContentCard content={item.content} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
