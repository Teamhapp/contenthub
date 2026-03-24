"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/constants";
import Link from "next/link";
import { IconArticle, IconChart, IconDollar, IconEye, IconPlus, IconTrending, IconSparkles } from "@/components/ui/Icons";

export default function CreatorOverview() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/creator/analytics")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <h1 className="section-title text-2xl">Creator Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="stat-card">
              <div className="skeleton h-4 rounded w-1/2 mb-3" />
              <div className="skeleton h-8 rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const stats = data?.stats || {};

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title text-2xl">Creator Dashboard</h1>
          <p className="text-surface-500 mt-1">Track your content performance.</p>
        </div>
        <Link href="/creator/content/new" className="btn-primary inline-flex items-center gap-2">
          <IconPlus className="w-4 h-4" />
          New Content
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-surface-500">Total Content</p>
              <p className="text-3xl font-bold font-display mt-1">{stats.totalContent || 0}</p>
              <p className="text-xs text-surface-400 mt-1">{stats.publishedContent || 0} published</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-soft-md">
              <IconArticle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-surface-500">Total Sales</p>
              <p className="text-3xl font-bold font-display mt-1">{stats.totalSales || 0}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-soft-md">
              <IconChart className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-surface-500">Total Revenue</p>
              <p className="text-3xl font-bold font-display mt-1 text-green-600">{formatPrice(stats.totalRevenue || 0)}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-soft-md">
              <IconDollar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-surface-500">Total Views</p>
              <p className="text-3xl font-bold font-display mt-1">{stats.totalViews || 0}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-400 to-accent-500 flex items-center justify-center shadow-soft-md">
              <IconEye className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center gap-2 mb-6">
            <IconTrending className="w-5 h-5 text-brand-600" />
            <h2 className="section-title text-lg">Top Performing Content</h2>
          </div>
          {data?.topContent?.length > 0 ? (
            <div className="space-y-1">
              {data.topContent.map((c: any, idx: number) => (
                <div key={c._id} className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-surface-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-surface-100 flex items-center justify-center text-xs font-bold text-surface-500">{idx + 1}</span>
                    <div>
                      <p className="font-medium text-sm text-surface-900">{c.title}</p>
                      <p className="text-xs text-surface-400 capitalize">{c.type} &middot; {c.totalSales} sales</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-green-600">{formatPrice(c.totalRevenue)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <IconSparkles className="w-8 h-8 text-surface-300 mx-auto mb-2" />
              <p className="text-surface-500 text-sm">No content yet. Create your first piece!</p>
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-6">
            <IconDollar className="w-5 h-5 text-green-600" />
            <h2 className="section-title text-lg">Recent Sales</h2>
          </div>
          {data?.recentSales?.length > 0 ? (
            <div className="space-y-1">
              {data.recentSales.map((sale: any, i: number) => (
                <div key={i} className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-surface-50 transition-colors">
                  <div>
                    <p className="font-medium text-sm text-surface-900">{sale.contentTitle}</p>
                    <p className="text-xs text-surface-400">
                      {new Date(sale.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="badge-green text-xs font-semibold">
                    +{formatPrice(sale.creatorShare)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <IconDollar className="w-8 h-8 text-surface-300 mx-auto mb-2" />
              <p className="text-surface-500 text-sm">No sales yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
