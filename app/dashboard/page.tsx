"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/constants";
import { IconLibrary, IconDollar, IconArrowRight, IconSparkles, ContentTypeIcon } from "@/components/ui/Icons";

export default function DashboardPage() {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/purchases")
      .then((r) => r.json())
      .then((data) => setPurchases(Array.isArray(data) ? data.slice(0, 6) : []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="section-title text-2xl">Dashboard</h1>
        <p className="text-surface-500 mt-1">Welcome back! Here is your overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-surface-500">Items in Library</p>
              <p className="text-3xl font-bold font-display mt-1">{purchases.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-soft-md">
              <IconLibrary className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-surface-500">Total Spent</p>
              <p className="text-3xl font-bold font-display mt-1">
                {formatPrice(purchases.reduce((sum, p) => sum + p.price, 0))}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-400 to-accent-500 flex items-center justify-center shadow-soft-md">
              <IconDollar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="stat-card flex items-center justify-center">
          <Link href="/browse" className="btn-primary inline-flex items-center gap-2">
            <IconSparkles className="w-4 h-4" />
            Browse More Content
            <IconArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title text-lg">Recent Purchases</h2>
          <Link href="/dashboard/library" className="text-sm text-brand-600 hover:text-brand-700 font-medium inline-flex items-center gap-1">
            View all
            <IconArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-xl border border-surface-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="skeleton w-12 h-12 rounded-lg" />
                  <div className="flex-1">
                    <div className="skeleton h-4 rounded w-3/4 mb-2" />
                    <div className="skeleton h-3 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : purchases.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-4">
              <IconLibrary className="w-8 h-8 text-surface-400" />
            </div>
            <p className="text-surface-500 mb-4 font-medium">No purchases yet</p>
            <Link href="/browse" className="btn-primary inline-flex items-center gap-2">
              <IconSparkles className="w-4 h-4" />
              Start browsing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {purchases.map((p) => (
              <Link
                key={p._id}
                href={`/browse/${p.content?._id}`}
                className="card-hover group flex items-center gap-3 p-4 rounded-xl border border-surface-200"
              >
                <div className="w-12 h-12 bg-surface-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-brand-50 transition-colors">
                  {p.content?.thumbnailUrl ? (
                    <img src={p.content.thumbnailUrl} alt="" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <ContentTypeIcon type={p.content?.type} className="w-6 h-6 text-surface-400 group-hover:text-brand-500 transition-colors" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate text-surface-900">{p.content?.title}</p>
                  <p className="text-xs text-surface-400 mt-0.5">{formatPrice(p.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
