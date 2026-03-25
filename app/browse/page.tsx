"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ContentCard from "@/components/content/ContentCard";
import { IconSearch, IconArrowRight } from "@/components/ui/Icons";

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
    fetch("/api/categories").then((r) => r.json()).then((data) => setCategories(Array.isArray(data) ? data : data.categories || [])).catch(() => {});
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

  const typeFilters = [
    { value: "", label: "All" },
    { value: "article", label: "Articles" },
    { value: "video", label: "Videos" },
    { value: "file", label: "Files" },
  ];

  // Build visible page numbers for pagination
  function getPageNumbers(): (number | "ellipsis")[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "ellipsis")[] = [1];
    if (page > 3) pages.push("ellipsis");
    for (let p = Math.max(2, page - 1); p <= Math.min(totalPages - 1, page + 1); p++) {
      pages.push(p);
    }
    if (page < totalPages - 2) pages.push("ellipsis");
    pages.push(totalPages);
    return pages;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="page-header mb-10 animate-fade-in">
        <h1 className="section-title">Browse Content</h1>
        <p className="section-subtitle">
          Discover premium articles, videos, and digital files
        </p>
        <div className="divider-gradient mt-4" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="lg:w-64 flex-shrink-0 space-y-6 animate-fade-in">
          {/* Search */}
          <div className="relative">
            <IconSearch className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
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
          <div className="card card-hover p-4">
            <h3 className="font-display font-semibold text-sm text-surface-700 mb-3 uppercase tracking-wider">
              Category
            </h3>
            <div className="space-y-0.5">
              <button
                onClick={() => updateParams({ category: "" })}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                  !category
                    ? "bg-brand-50 text-brand-700 font-medium shadow-sm"
                    : "text-surface-500 hover:bg-surface-50 hover:text-surface-700"
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => updateParams({ category: cat._id })}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                    category === cat._id
                      ? "bg-brand-50 text-brand-700 font-medium shadow-sm"
                      : "text-surface-500 hover:bg-surface-50 hover:text-surface-700"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Type filter */}
          <div className="card card-hover p-4">
            <h3 className="font-display font-semibold text-sm text-surface-700 mb-3 uppercase tracking-wider">
              Type
            </h3>
            <div className="flex flex-wrap gap-2">
              {typeFilters.map((t) => (
                <button
                  key={t.value}
                  onClick={() => updateParams({ type: t.value })}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                    type === t.value
                      ? "bg-brand-600 text-white shadow-glow-brand"
                      : "bg-surface-100 text-surface-600 hover:bg-surface-200 hover:text-surface-700"
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
          {/* Toolbar: result count + sort */}
          <div className="flex items-center justify-between mb-6 animate-fade-in">
            <p className="text-sm text-surface-500 font-medium">
              <span className="text-surface-800 font-semibold">{total}</span>{" "}
              {total === 1 ? "result" : "results"} found
            </p>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => updateParams({ sort: e.target.value })}
                className="input w-auto pr-10 py-2 text-sm appearance-none cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-surface-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Loading Skeleton */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="card overflow-hidden animate-stagger-fade"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="aspect-[16/10] skeleton" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 skeleton w-3/4 rounded" />
                    <div className="h-4 skeleton w-full rounded" />
                    <div className="h-4 skeleton w-1/3 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : contents.length === 0 ? (
            /* Empty State */
            <div className="empty-state animate-fade-in">
              <div className="empty-state-icon">
                <IconSearch className="w-7 h-7 text-surface-400" />
              </div>
              <p className="text-lg font-display font-semibold text-surface-700 mt-4">
                No content found
              </p>
              <p className="text-sm text-surface-400 mt-1 max-w-xs mx-auto">
                Try adjusting your search or filters to discover something new
              </p>
              <button
                onClick={() => router.push("/browse")}
                className="btn-secondary mt-6 inline-flex items-center gap-2"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              {/* Content Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {contents.map((c: any, i: number) => (
                  <div
                    key={c._id}
                    className="animate-stagger-fade"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <ContentCard content={c} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1.5 mt-10 animate-fade-in">
                  {/* Previous */}
                  <button
                    onClick={() => updateParams({ page: String(Math.max(1, page - 1)) })}
                    disabled={page === 1}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      page === 1
                        ? "text-surface-300 cursor-not-allowed"
                        : "text-surface-600 hover:bg-surface-100 hover:text-surface-800"
                    }`}
                    aria-label="Previous page"
                  >
                    <IconArrowRight className="w-4 h-4 rotate-180" />
                  </button>

                  {/* Page Numbers */}
                  {getPageNumbers().map((p, i) =>
                    p === "ellipsis" ? (
                      <span
                        key={`ellipsis-${i}`}
                        className="w-10 h-10 flex items-center justify-center text-sm text-surface-400"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => updateParams({ page: String(p) })}
                        className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                          p === page
                            ? "bg-brand-600 text-white shadow-glow-brand"
                            : "bg-white border border-surface-200 text-surface-600 hover:bg-surface-50 hover:border-surface-300"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}

                  {/* Next */}
                  <button
                    onClick={() => updateParams({ page: String(Math.min(totalPages, page + 1)) })}
                    disabled={page === totalPages}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      page === totalPages
                        ? "text-surface-300 cursor-not-allowed"
                        : "text-surface-600 hover:bg-surface-100 hover:text-surface-800"
                    }`}
                    aria-label="Next page"
                  >
                    <IconArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
