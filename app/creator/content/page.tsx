"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/constants";
import { IconPlus, IconEdit, IconTrash, IconCheck, IconSparkles, ContentTypeIcon } from "@/components/ui/Icons";

const statusBadge: Record<string, string> = {
  draft: "badge-gray",
  pending: "badge-yellow",
  published: "badge-green",
  rejected: "badge-red",
};

export default function CreatorContentPage() {
  const [contents, setContents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content/my")
      .then((r) => r.json())
      .then((data) => setContents(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this content?")) return;
    await fetch(`/api/content/${id}`, { method: "DELETE" });
    setContents(contents.filter((c) => c._id !== id));
  }

  async function handleSubmit(id: string) {
    await fetch(`/api/content/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "pending" }),
    });
    setContents(
      contents.map((c) => (c._id === id ? { ...c, status: "pending" } : c))
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-2xl">My Content</h1>
          <p className="text-[#797586] mt-1">Manage and track your content.</p>
        </div>
        <Link href="/creator/content/new" className="btn-primary inline-flex items-center gap-2">
          <IconPlus className="w-4 h-4" />
          New Content
        </Link>
      </div>

      {loading ? (
        <div className="card p-0 overflow-hidden">
          <div className="p-6 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton h-14 rounded" />
            ))}
          </div>
        </div>
      ) : contents.length === 0 ? (
        <div className="card text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-[#f1f3ff] flex items-center justify-center mx-auto mb-4">
            <IconSparkles className="w-8 h-8 text-[#797586]" />
          </div>
          <p className="text-[#797586] text-lg mb-1 font-medium">No content yet</p>
          <p className="text-[#797586] text-sm mb-6">Start creating and selling your content.</p>
          <Link href="/creator/content/new" className="btn-primary inline-flex items-center gap-2">
            <IconPlus className="w-4 h-4" />
            Create your first piece
          </Link>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="table-premium">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Price</th>
                <th>Status</th>
                <th>Sales</th>
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
                        <p className="font-medium text-sm text-[#151b29]">{c.title}</p>
                        <p className="text-xs text-[#797586] mt-0.5">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge-blue capitalize text-xs">{c.type}</span>
                  </td>
                  <td className="font-semibold text-[#151b29]">{formatPrice(c.price)}</td>
                  <td>
                    <span className={`${statusBadge[c.status]} capitalize text-xs`}>
                      {c.status}
                    </span>
                    {c.status === "rejected" && c.rejectionReason && (
                      <p className="text-xs text-red-500 mt-1 max-w-[200px]">{c.rejectionReason}</p>
                    )}
                  </td>
                  <td className="font-medium text-[#484554]">{c.totalSales}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/creator/content/${c._id}/edit`}
                        className="btn-ghost p-2 rounded-lg"
                        title="Edit"
                      >
                        <IconEdit className="w-4 h-4 text-[#797586] hover:text-[#451ebb]" />
                      </Link>
                      {c.status === "draft" && (
                        <button
                          onClick={() => handleSubmit(c._id)}
                          className="btn-ghost p-2 rounded-lg"
                          title="Submit for review"
                        >
                          <IconCheck className="w-4 h-4 text-green-600" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(c._id)}
                        className="btn-ghost p-2 rounded-lg"
                        title="Delete"
                      >
                        <IconTrash className="w-4 h-4 text-[#797586] hover:text-red-600" />
                      </button>
                    </div>
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
