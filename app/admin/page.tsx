"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/constants";
import { IconUsers, IconArticle, IconDollar, IconStar, IconTrending } from "@/components/ui/Icons";

export default function AdminOverview() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <h1 className="section-title text-2xl">Admin Dashboard</h1>
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

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="section-title text-2xl">Admin Dashboard</h1>
        <p className="text-surface-500 mt-1">Platform overview and key metrics.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-surface-500">Total Users</p>
              <p className="text-3xl font-bold font-display mt-1">{data?.users?.total || 0}</p>
              <p className="text-xs text-surface-400 mt-1">
                {data?.users?.creators || 0} creators &middot; {data?.users?.customers || 0} customers
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-soft-md">
              <IconUsers className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-surface-500">Total Content</p>
              <p className="text-3xl font-bold font-display mt-1">{data?.content?.total || 0}</p>
              <p className="text-xs text-surface-400 mt-1">
                {data?.content?.published || 0} published &middot; {data?.content?.pending || 0} pending
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-soft-md">
              <IconArticle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-surface-500">Total Revenue</p>
              <p className="text-3xl font-bold font-display mt-1 text-green-600">
                {formatPrice(data?.revenue?.totalRevenue || 0)}
              </p>
              <p className="text-xs text-surface-400 mt-1">
                {data?.revenue?.totalTransactions || 0} transactions
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-soft-md">
              <IconDollar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-surface-500">Platform Earnings</p>
              <p className="text-3xl font-bold font-display mt-1 text-brand-600">
                {formatPrice(data?.revenue?.totalPlatformFee || 0)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-soft-md">
              <IconStar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="px-6 py-5 border-b border-surface-200">
          <div className="flex items-center gap-2">
            <IconTrending className="w-5 h-5 text-brand-600" />
            <h2 className="section-title text-lg">Top Creators</h2>
          </div>
        </div>
        {data?.topCreators?.length > 0 ? (
          <table className="table-premium">
            <thead>
              <tr>
                <th>Creator</th>
                <th>Content</th>
                <th>Sales</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {data.topCreators.map((c: any) => (
                <tr key={c._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold">
                        {c.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-surface-900">{c.name}</p>
                        <p className="text-xs text-surface-400">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-surface-700">{c.contentCount}</td>
                  <td className="text-surface-700">{c.totalSales}</td>
                  <td>
                    <span className="font-semibold text-green-600">{formatPrice(c.totalRevenue)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-12">
            <IconUsers className="w-8 h-8 text-surface-300 mx-auto mb-2" />
            <p className="text-surface-500 text-sm">No creators yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
