"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/constants";
import { ContentTypeIcon, IconReceipt } from "@/components/ui/Icons";

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/purchases")
      .then((r) => r.json())
      .then((data) => setPurchases(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="section-title text-2xl">Purchase History</h1>
        <p className="text-surface-500 mt-1">A record of all your transactions.</p>
      </div>

      {loading ? (
        <div className="card p-0 overflow-hidden">
          <div className="p-6 space-y-3">
            <div className="skeleton h-6 rounded w-1/4 mb-4" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton h-14 rounded" />
            ))}
          </div>
        </div>
      ) : purchases.length === 0 ? (
        <div className="card text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-4">
            <IconReceipt className="w-8 h-8 text-surface-400" />
          </div>
          <p className="text-surface-500 font-medium">No purchases yet.</p>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="table-premium">
            <thead>
              <tr>
                <th>Content</th>
                <th>Type</th>
                <th>Price</th>
                <th>Date</th>
                <th>Transaction</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-surface-100 flex items-center justify-center flex-shrink-0">
                        <ContentTypeIcon type={p.content?.type} className="w-4 h-4 text-surface-500" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-surface-900">{p.content?.title || "Deleted content"}</p>
                        {p.content?.creator && (
                          <p className="text-xs text-surface-400">by {p.content.creator.name}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge-blue capitalize text-xs">{p.content?.type || "-"}</span>
                  </td>
                  <td className="font-semibold text-surface-900">{formatPrice(p.price)}</td>
                  <td className="text-surface-500">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <span className="text-xs text-surface-400 font-mono bg-surface-50 px-2 py-1 rounded">
                      {p.transaction?.mockPaymentId || "-"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
