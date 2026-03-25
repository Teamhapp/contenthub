"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ContentCard from "@/components/content/ContentCard";

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
    { value: "article", label: "Article" },
    { value: "video", label: "Video" },
    { value: "file", label: "File" },
  ];

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
    <div className="max-w-[1440px] mx-auto px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* ── Sidebar Filters ── */}
        <div className="lg:w-56 flex-shrink-0 space-y-6">
          {/* Category */}
          <div>
            <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-xs uppercase tracking-[0.1em] text-[#151b29] mb-3">
              Category
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => updateParams({ category: "" })}
                className={`flex items-center gap-2 w-full text-left text-sm py-1.5 transition-colors ${
                  !category ? "text-[#451ebb] font-semibold" : "text-[#484554] hover:text-[#151b29]"
                }`}
              >
                {!category && <span className="w-4 h-4 rounded bg-[#451ebb] flex items-center justify-center"><span className="material-symbols-outlined text-white text-xs">check</span></span>}
                {category && <span className="w-4 h-4 rounded border border-[#c9c4d7]" />}
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => updateParams({ category: cat._id })}
                  className={`flex items-center gap-2 w-full text-left text-sm py-1.5 transition-colors ${
                    category === cat._id ? "text-[#451ebb] font-semibold" : "text-[#484554] hover:text-[#151b29]"
                  }`}
                >
                  {category === cat._id
                    ? <span className="w-4 h-4 rounded bg-[#451ebb] flex items-center justify-center"><span className="material-symbols-outlined text-white text-xs">check</span></span>
                    : <span className="w-4 h-4 rounded border border-[#c9c4d7]" />
                  }
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Content Type */}
          <div>
            <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-xs uppercase tracking-[0.1em] text-[#151b29] mb-3">
              Content Type
            </h3>
            <div className="flex flex-wrap gap-2">
              {typeFilters.map((t) => (
                <button
                  key={t.value}
                  onClick={() => updateParams({ type: t.value })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                    type === t.value
                      ? "bg-[#451ebb] text-white border-[#451ebb]"
                      : "bg-white text-[#484554] border-[#c9c4d7]/40 hover:border-[#451ebb]/30"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range placeholder */}
          <div>
            <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-xs uppercase tracking-[0.1em] text-[#151b29] mb-3">
              Price Range
            </h3>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-[10px] text-[#797586] uppercase tracking-wider">Min</label>
                <input className="w-full mt-1 px-3 py-2 bg-white border border-[#c9c4d7]/30 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#451ebb]" placeholder="$0" />
              </div>
              <span className="self-end pb-2.5 text-[#c9c4d7]">—</span>
              <div className="flex-1">
                <label className="text-[10px] text-[#797586] uppercase tracking-wider">Max</label>
                <input className="w-full mt-1 px-3 py-2 bg-white border border-[#c9c4d7]/30 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#451ebb]" placeholder="$500" />
              </div>
            </div>
            <div className="mt-3 h-1 bg-[#e2e8fc] rounded-full">
              <div className="h-full bg-[#451ebb] rounded-full w-full" />
            </div>
          </div>

          {/* Rating */}
          <div>
            <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-xs uppercase tracking-[0.1em] text-[#151b29] mb-3">
              Rating
            </h3>
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(s => (
                <span key={s} className="text-amber-400 text-sm">&#9733;</span>
              ))}
              <span className="text-sm text-[#484554] ml-1">& Up</span>
            </div>
          </div>
        </div>

        {/* ── Main Content ── */}
        <div className="flex-1 min-w-0">
          {/* Header + Sort */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <p className="text-[10px] font-bold text-[#451ebb] uppercase tracking-[0.12em] mb-1">Discovery</p>
              <h1 className="font-['Plus_Jakarta_Sans'] text-4xl font-extrabold text-[#151b29] tracking-tight">
                Creator Marketplace
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => updateParams({ sort: e.target.value })}
                  className="appearance-none bg-white border border-[#c9c4d7]/30 rounded-lg pl-4 pr-10 py-2.5 text-sm font-medium text-[#151b29] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#451ebb]"
                >
                  <option value="newest">Most Recent</option>
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price_low">Price: Low → High</option>
                  <option value="price_high">Price: High → Low</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#797586] text-sm pointer-events-none">expand_more</span>
              </div>
              {/* Grid/List toggle */}
              <div className="flex border border-[#c9c4d7]/30 rounded-lg overflow-hidden">
                <button className="p-2 bg-[#451ebb] text-white">
                  <span className="material-symbols-outlined text-base">grid_view</span>
                </button>
                <button className="p-2 text-[#797586] hover:bg-[#f1f3ff]">
                  <span className="material-symbols-outlined text-base">view_list</span>
                </button>
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative mb-6">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#797586] text-lg">search</span>
            <input
              type="text"
              placeholder="Search marketplace..."
              defaultValue={q}
              onKeyDown={(e) => {
                if (e.key === "Enter") updateParams({ q: (e.target as HTMLInputElement).value });
              }}
              className="w-full pl-11 pr-4 py-3 bg-white border border-[#c9c4d7]/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#451ebb]/20 focus:border-[#451ebb] placeholder-[#797586]"
            />
          </div>

          {/* Loading */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden border border-[#e2e8fc]/30">
                  <div className="aspect-[16/10] bg-[#f1f3ff] animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-[#f1f3ff] rounded w-3/4 animate-pulse" />
                    <div className="h-3 bg-[#f1f3ff] rounded w-full animate-pulse" />
                    <div className="h-5 bg-[#f1f3ff] rounded w-1/3 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : contents.length === 0 ? (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-5xl text-[#c9c4d7] mb-4">search_off</span>
              <p className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#151b29]">No content found</p>
              <p className="text-sm text-[#797586] mt-1">Try adjusting your search or filters</p>
              <button
                onClick={() => router.push("/browse")}
                className="mt-6 px-6 py-2.5 border border-[#c9c4d7]/30 rounded-lg text-sm font-medium text-[#484554] hover:bg-[#f1f3ff] transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {contents.map((c: any) => (
                  <ContentCard key={c._id} content={c} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => updateParams({ page: String(Math.max(1, page - 1)) })}
                    disabled={page === 1}
                    className="w-10 h-10 rounded-lg border border-[#c9c4d7]/30 flex items-center justify-center text-[#484554] hover:bg-[#f1f3ff] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">chevron_left</span>
                  </button>

                  {getPageNumbers().map((p, i) =>
                    p === "ellipsis" ? (
                      <span key={`e-${i}`} className="w-10 h-10 flex items-center justify-center text-sm text-[#797586]">...</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => updateParams({ page: String(p) })}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                          p === page
                            ? "bg-[#451ebb] text-white shadow-[0_4px_14px_0_rgba(69,30,187,0.35)]"
                            : "border border-[#c9c4d7]/30 text-[#484554] hover:bg-[#f1f3ff]"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => updateParams({ page: String(Math.min(totalPages, page + 1)) })}
                    disabled={page === totalPages}
                    className="w-10 h-10 rounded-lg border border-[#c9c4d7]/30 flex items-center justify-center text-[#484554] hover:bg-[#f1f3ff] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">chevron_right</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 pt-8 border-t border-[#e2e8fc] flex flex-col md:flex-row justify-between items-center text-xs uppercase tracking-[0.1em] text-[#797586]">
        <span className="font-bold text-[#151b29]">The Digital Atelier</span>
        <div className="flex gap-6 mt-3 md:mt-0">
          <span>Terms</span>
          <span>Privacy</span>
          <span>Cookies</span>
          <span>Contact</span>
          <span>API</span>
        </div>
      </div>
    </div>
  );
}
