"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ContentCard from "@/components/content/ContentCard";
import { IconSearch } from "@/components/ui/Icons";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function BrowsePage() {
  return (
    <Suspense>
      <BrowseContent />
    </Suspense>
  );
}

function BrowseContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [contents, setContents] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const type = searchParams.get("type") || "";
  const sort = searchParams.get("sort") || "newest";
  const page = parseInt(searchParams.get("page") || "1");

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    if (updates.page === undefined) params.set("page", "1");
    router.push(`/browse?${params.toString()}`);
  }

  useEffect(() => {
    fetch("/api/categories").then((r) => r.json()).then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "12" });
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    if (type) params.set("type", type);
    if (sort) params.set("sort", sort);

    fetch(`/api/content?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setContents(data.contents || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [q, category, type, sort, page]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="section-title">Browse Content</h1>
        <p className="section-subtitle">Discover premium articles, videos, and digital files</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="lg:w-64 flex-shrink-0 space-y-6">
          {/* Search */}
          <div className="relative">
            <IconSearch className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
            <input
              type="text"
              placeholder="Search content..."
              defaultValue={q}
              onKeyDown={(e) => {
                if (e.key === "Enter") updateParams({ q: (e.target as HTMLInputElement).value });
              }}
              className="input-with-icon"
            />
          </div>

          {/* Category filter */}
          <div className="card p-4">
            <h3 className="font-display font-semibold text-sm text-surface-700 mb-3">Category</h3>
            <div className="space-y-0.5">
              <button
                onClick={() => updateParams({ category: "" })}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${!category ? "bg-brand-50 text-brand-700 font-medium" : "text-surface-500 hover:bg-surface-50 hover:text-surface-700"}`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => updateParams({ category: cat._id })}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${category === cat._id ? "bg-brand-50 text-brand-700 font-medium" : "text-surface-500 hover:bg-surface-50 hover:text-surface-700"}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Type filter */}
          <div className="card p-4">
            <h3 className="font-display font-semibold text-sm text-surface-700 mb-3">Type</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "", label: "All" },
                { value: "article", label: "Articles" },
                { value: "video", label: "Videos" },
                { value: "file", label: "Files" },
              ].map((t) => (
                <button
                  key={t.value}
                  onClick={() => updateParams({ type: t.value })}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    type === t.value
                      ? "bg-brand-600 text-white shadow-soft-sm"
                      : "bg-surface-100 text-surface-600 hover:bg-surface-200"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-surface-500 font-medium">{total} results</p>
            <select
              value={sort}
              onChange={(e) => updateParams({ sort: e.target.value })}
              className="input w-auto pr-8 py-2 text-sm"
            >
              <option value="newest">Newest</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card overflow-hidden">
                  <div className="aspect-[16/10] skeleton" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 skeleton w-3/4" />
                    <div className="h-4 skeleton w-full" />
                    <div className="h-4 skeleton w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : contents.length === 0 ? (
            <div className="text-center py-20 card">
              <div className="w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-4">
                <IconSearch className="w-7 h-7 text-surface-400" />
              </div>
              <p className="text-lg font-display font-semibold text-surface-700">No content found</p>
              <p className="text-sm text-surface-400 mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {contents.map((c: any) => (
                  <ContentCard key={c._id} content={c} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => updateParams({ page: String(p) })}
                      className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                        p === page
                          ? "bg-brand-600 text-white shadow-soft-sm"
                          : "bg-white border border-surface-200 text-surface-600 hover:bg-surface-50"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
