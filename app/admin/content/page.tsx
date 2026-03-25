"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/constants";
import Link from "next/link";
import { IconCheck, IconX, ContentTypeIcon, IconArticle } from "@/components/ui/Icons";

const statusBadge: Record<string, string> = {
  draft: "badge-gray",
  pending: "badge-yellow",
  published: "badge-green",
  rejected: "badge-red",
};

const filterLabels: Record<string, string> = {
  pending: "Pending",
  published: "Published",
  rejected: "Rejected",
  draft: "Draft",
  "": "All",
};

export default function AdminContentPage() {
  const [contents, setContents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ limit: "50" });
    if (filter) params.set("status", filter);

    fetch(`/api/content?${params}&admin=true`)
      .then((r) => r.json())
      .then((data) => setContents(data.contents || []))
      .catch(() => {
        fetch("/api/content?limit=50")
          .then((r) => r.json())
          .then((data) => setContents(data.contents || []));
      })
      .finally(() => setLoading(false));
  }, [filter]);

  async function handleModerate(contentId: string, status: "published" | "rejected", reason?: string) {
    await fetch(`/api/admin/content/${contentId}/moderate`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, rejectionReason: reason }),
    });
    setContents(contents.map((c) => (c._id === contentId ? { ...c, status, rejectionReason: reason } : c)));
    setRejectingId(null);
    setRejectReason("");
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-2xl">Content Moderation</h1>
        <p className="text-[#797586] mt-1">Review and manage submitted content.</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["pending", "published", "rejected", "draft", ""].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === s
                ? "bg-[#451ebb] text-white shadow-soft-md"
                : "bg-white border border-[#e2e8fc] text-[#484554] hover:bg-[#faf8ff] hover:border-surface-300"
            }`}
          >
            {filterLabels[s]}
          </button>
        ))}
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-14 rounded" />)}
          </div>
        ) : contents.length === 0 ? (
          <div className="text-center py-16">
            <IconArticle className="w-8 h-8 text-[#c9c4d7] mx-auto mb-2" />
            <p className="text-[#797586]">No content found.</p>
          </div>
        ) : (
          <table className="table-premium">
            <thead>
              <tr>
                <th>Content</th>
                <th>Creator</th>
                <th>Type</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contents.map((c) => (
                <tr key={c._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#f1f3ff] flex items-center justify-center flex-shrink-0">
                        <ContentTypeIcon type={c.type} className="w-4 h-4 text-[#797586]" />
                      </div>
                      <div>
                        <Link href={`/browse/${c._id}`} className="font-medium text-sm text-[#451ebb] hover:text-[#451ebb]">
                          {c.title}
                        </Link>
                        <p className="text-xs text-[#797586] mt-0.5 line-clamp-1 max-w-[250px]">{c.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-[#484554]">{c.creator?.name || "Unknown"}</td>
                  <td>
                    <span className="badge-blue capitalize text-xs">{c.type}</span>
                  </td>
                  <td className="font-semibold text-[#151b29]">{formatPrice(c.price)}</td>
                  <td>
                    <span className={`${statusBadge[c.status]} capitalize text-xs`}>
                      {c.status}
                    </span>
                  </td>
                  <td>
                    {c.status === "pending" && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleModerate(c._id, "published")}
                          className="btn-ghost p-2 rounded-lg group"
                          title="Approve"
                        >
                          <IconCheck className="w-4 h-4 text-green-600 group-hover:scale-110 transition-transform" />
                        </button>
                        <button
                          onClick={() => setRejectingId(c._id)}
                          className="btn-ghost p-2 rounded-lg group"
                          title="Reject"
                        >
                          <IconX className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    )}
                    {c.status === "published" && (
                      <button
                        onClick={() => handleModerate(c._id, "rejected", "Removed by admin")}
                        className="btn-danger text-xs px-3 py-1.5"
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Rejection modal */}
      {rejectingId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="card max-w-md w-full mx-4 shadow-soft-2xl">
            <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-lg mb-4">Reject Content</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection (optional)..."
              className="input w-full"
              rows={3}
            />
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => { setRejectingId(null); setRejectReason(""); }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => handleModerate(rejectingId, "rejected", rejectReason)}
                className="btn-danger"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
