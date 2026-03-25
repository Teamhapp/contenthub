"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { formatPrice } from "@/lib/constants";
import { IconPlus, IconTrash, IconCheck, IconTag, IconArrowRight } from "@/components/ui/Icons";

interface ContentItem {
  _id: string;
  title: string;
  type: string;
  price: number;
}

interface BundleItem {
  _id: string;
  creator: { _id: string; name: string };
  title: string;
  description: string;
  contents: ContentItem[];
  price: number;
  originalPrice: number;
  status: "active" | "inactive";
  totalSales: number;
  createdAt: string;
}

export default function BundlesPage() {
  const { data: session } = useSession();
  const [bundles, setBundles] = useState<BundleItem[]>([]);
  const [myContent, setMyContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bundlePrice, setBundlePrice] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/bundles?mine=true").then((r) => r.json()),
      fetch("/api/content/my").then((r) => r.json()),
    ])
      .then(([bundlesData, contentData]) => {
        setBundles(Array.isArray(bundlesData) ? bundlesData : []);
        setMyContent(Array.isArray(contentData) ? contentData : []);
      })
      .finally(() => setLoading(false));
  }, []);

  function toggleContent(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const selectedContent = myContent.filter((c) => selectedIds.has(c._id));
  const originalPrice = selectedContent.reduce((sum, c) => sum + c.price, 0);
  const bundlePriceCents = Math.round(parseFloat(bundlePrice || "0") * 100);
  const savings = originalPrice > 0 ? Math.round(((originalPrice - bundlePriceCents) / originalPrice) * 100) : 0;

  function resetForm() {
    setTitle("");
    setDescription("");
    setSelectedIds(new Set());
    setBundlePrice("");
    setError("");
    setEditingId(null);
  }

  function startEdit(bundle: BundleItem) {
    setEditingId(bundle._id);
    setTitle(bundle.title);
    setDescription(bundle.description);
    setSelectedIds(new Set(bundle.contents.map((c) => c._id)));
    setBundlePrice((bundle.price / 100).toFixed(2));
    setShowForm(true);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selectedIds.size < 2) {
      setError("Select at least 2 content items for a bundle.");
      return;
    }
    if (!bundlePrice || bundlePriceCents <= 0) {
      setError("Enter a valid bundle price.");
      return;
    }
    setSubmitting(true);
    setError("");

    try {
      const payload = {
        title,
        description,
        contentIds: Array.from(selectedIds),
        price: parseFloat(bundlePrice),
      };

      if (editingId) {
        // Update existing bundle
        const res = await fetch(`/api/bundles/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to update bundle");
        }
        const updated = await res.json();
        setBundles((prev) => prev.map((b) => (b._id === editingId ? updated : b)));
      } else {
        // Create new bundle
        const res = await fetch("/api/bundles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to create bundle");
        }
        const newBundle = await res.json();
        setBundles((prev) => [newBundle, ...prev]);
      }

      setShowForm(false);
      resetForm();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggleStatus(bundle: BundleItem) {
    const newStatus = bundle.status === "active" ? "inactive" : "active";
    setTogglingId(bundle._id);
    try {
      const res = await fetch(`/api/bundles/${bundle._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setBundles((prev) => prev.map((b) => (b._id === bundle._id ? updated : b)));
      }
    } catch {}
    setTogglingId(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this bundle?")) return;
    await fetch(`/api/bundles/${id}`, { method: "DELETE" });
    setBundles(bundles.filter((b) => b._id !== id));
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="page-header-with-actions">
        <div>
          <h1 className="section-title text-2xl">Content Bundles</h1>
          <p className="text-surface-500 mt-1">
            Group content together and offer discounted bundles.
          </p>
        </div>
        <button
          onClick={() => {
            if (showForm) {
              setShowForm(false);
              resetForm();
            } else {
              resetForm();
              setShowForm(true);
            }
          }}
          className="btn-primary inline-flex items-center gap-2"
        >
          <IconPlus className="w-4 h-4" />
          Create Bundle
        </button>
      </div>

      {/* Create/Edit Bundle Form */}
      {showForm && (
        <div className="card animate-fade-in">
          <div className="px-6 py-5 border-b border-surface-200">
            <h2 className="section-title text-lg">
              {editingId ? "Edit Bundle" : "New Bundle"}
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Bundle Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input"
                  placeholder="e.g. Complete Web Dev Pack"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Bundle Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={bundlePrice}
                  onChange={(e) => setBundlePrice(e.target.value)}
                  className="input"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input min-h-[80px]"
                placeholder="Describe what's included in this bundle..."
                required
              />
            </div>

            {/* Content Selector */}
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Select Content ({selectedIds.size} selected)
              </label>
              {myContent.length === 0 ? (
                <p className="text-surface-400 text-sm">
                  No content available. Create some content first.
                </p>
              ) : (
                <div className="border border-surface-200 rounded-xl max-h-64 overflow-y-auto divide-y divide-surface-100">
                  {myContent.map((c) => {
                    const isSelected = selectedIds.has(c._id);
                    return (
                      <label
                        key={c._id}
                        className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-surface-50 ${
                          isSelected ? "bg-brand-50/50" : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleContent(c._id)}
                          className="w-4 h-4 rounded border-surface-300 text-brand-600 focus:ring-brand-500"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-surface-900 truncate">
                            {c.title}
                          </p>
                          <p className="text-xs text-surface-400 capitalize">{c.type}</p>
                        </div>
                        <span className="text-sm font-semibold text-surface-700">
                          {formatPrice(c.price)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Price Summary */}
            {selectedIds.size > 0 && (
              <div className="bg-surface-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-surface-500">
                    Original Total ({selectedIds.size} items)
                  </span>
                  <span className="text-surface-700 font-medium">
                    {formatPrice(originalPrice)}
                  </span>
                </div>
                {bundlePriceCents > 0 && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-surface-500">Bundle Price</span>
                      <span className="text-brand-600 font-semibold">
                        {formatPrice(bundlePriceCents)}
                      </span>
                    </div>
                    <div className="divider-gradient" />
                    <div className="flex justify-between text-sm">
                      <span className="text-surface-500">Customer Savings</span>
                      <span className={`font-bold ${savings > 0 ? "text-green-600" : "text-red-500"}`}>
                        {savings > 0 ? `${savings}% off` : "No savings"}
                      </span>
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary inline-flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {editingId ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <IconCheck className="w-4 h-4" />
                    {editingId ? "Update Bundle" : "Create Bundle"}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Bundles Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-6 space-y-4">
              <div className="skeleton h-5 rounded w-3/4" />
              <div className="skeleton h-4 rounded w-full" />
              <div className="skeleton h-4 rounded w-1/2" />
              <div className="skeleton h-10 rounded w-full mt-4" />
            </div>
          ))}
        </div>
      ) : bundles.length === 0 && !showForm ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <IconTag className="w-8 h-8 text-surface-400" />
          </div>
          <p className="text-surface-500 text-lg mb-1 font-medium">No bundles yet</p>
          <p className="text-surface-400 text-sm mb-6">
            Create content bundles to offer discounts and boost sales.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <IconPlus className="w-4 h-4" />
            Create your first bundle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bundles.map((bundle) => {
            const bundleSavings =
              bundle.originalPrice > 0
                ? Math.round(((bundle.originalPrice - bundle.price) / bundle.originalPrice) * 100)
                : 0;

            return (
              <div key={bundle._id} className="card card-hover p-0 overflow-hidden">
                {/* Bundle Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-surface-900 text-lg truncate">
                        {bundle.title}
                      </h3>
                      <p className="text-surface-500 text-sm mt-1 line-clamp-2">
                        {bundle.description}
                      </p>
                    </div>
                    <button
                      onClick={() => handleToggleStatus(bundle)}
                      disabled={togglingId === bundle._id}
                      className={`${
                        bundle.status === "active"
                          ? "badge-glow-green"
                          : "badge-gray"
                      } text-xs flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity`}
                      title={`Click to ${bundle.status === "active" ? "deactivate" : "activate"}`}
                    >
                      {togglingId === bundle._id ? "..." : bundle.status}
                    </button>
                  </div>
                </div>

                <div className="divider-gradient" />

                {/* Bundle Details */}
                <div className="px-6 py-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-surface-500 text-sm">Contents</span>
                    <span className="badge-blue text-xs">
                      {bundle.contents?.length || 0} items
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-display text-brand-600">
                      {formatPrice(bundle.price)}
                    </span>
                    <span className="text-sm text-surface-400 line-through">
                      {formatPrice(bundle.originalPrice)}
                    </span>
                    {bundleSavings > 0 && (
                      <span className="badge-glow-green text-xs ml-auto">
                        {bundleSavings}% off
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-surface-500">Total Sales</span>
                    <span className="font-semibold text-surface-700">
                      {bundle.totalSales}
                    </span>
                  </div>
                </div>

                <div className="divider-gradient" />

                {/* Actions */}
                <div className="px-6 py-3 flex items-center justify-between">
                  <span className="text-xs text-surface-400">
                    {new Date(bundle.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => startEdit(bundle)}
                      className="btn-ghost p-2 rounded-lg"
                      title="Edit bundle"
                    >
                      <svg className="w-4 h-4 text-surface-400 hover:text-brand-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(bundle._id)}
                      className="btn-ghost p-2 rounded-lg"
                      title="Delete bundle"
                    >
                      <IconTrash className="w-4 h-4 text-surface-400 hover:text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
