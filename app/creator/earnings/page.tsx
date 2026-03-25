"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/constants";
import { IconDollar, IconChart, IconTrending } from "@/components/ui/Icons";

export default function EarningsPage() {
  const [data, setData] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/creator/analytics").then((r) => r.json()),
      fetch("/api/users/me").then((r) => r.json()),
    ])
      .then(([analytics, me]) => {
        setData(analytics);
        setUser(me);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-2xl">Earnings</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
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
      <div>
        <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-2xl">Earnings</h1>
        <p className="text-[#797586] mt-1">Track your revenue and sales performance.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#797586]">Available Balance</p>
              <p className="text-3xl font-bold font-['Plus_Jakarta_Sans'] mt-1 text-green-600">{formatPrice(user?.balance || 0)}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-soft-md">
              <IconDollar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#797586]">Total Earned</p>
              <p className="text-3xl font-bold font-['Plus_Jakarta_Sans'] mt-1">{formatPrice(stats.totalRevenue || 0)}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-soft-md">
              <IconTrending className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#797586]">Total Sales</p>
              <p className="text-3xl font-bold font-['Plus_Jakarta_Sans'] mt-1">{stats.totalSales || 0}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-soft-md">
              <IconChart className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="px-6 py-5 border-b border-[#e2e8fc]">
          <div className="flex items-center gap-2">
            <IconDollar className="w-5 h-5 text-green-600" />
            <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-lg">Recent Sales</h2>
          </div>
        </div>
        {data?.recentSales?.length > 0 ? (
          <table className="table-premium">
            <thead>
              <tr>
                <th>Content</th>
                <th>Sale Price</th>
                <th>Your Share</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.recentSales.map((sale: any, i: number) => (
                <tr key={i}>
                  <td className="font-medium text-[#151b29]">{sale.contentTitle}</td>
                  <td className="text-[#484554]">{formatPrice(sale.price)}</td>
                  <td>
                    <span className="badge-green text-xs font-semibold">{formatPrice(sale.creatorShare)}</span>
                  </td>
                  <td className="text-[#797586]">{new Date(sale.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-12">
            <IconDollar className="w-8 h-8 text-[#c9c4d7] mx-auto mb-2" />
            <p className="text-[#797586] text-sm">No sales yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
