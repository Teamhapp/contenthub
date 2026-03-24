"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ContentTypeIcon, IconArrowRight, IconLibrary, IconSparkles, IconDownload } from "@/components/ui/Icons";

export default function LibraryPage() {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewContent, setViewContent] = useState<any>(null);

  useEffect(() => {
    fetch("/api/purchases")
      .then((r) => r.json())
      .then((data) => setPurchases(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  async function openContent(contentId: string) {
    try {
      const res = await fetch(`/api/content/${contentId}/access`);
      if (res.ok) {
        const data = await res.json();
        setViewContent(data);
      }
    } catch {}
  }

  if (viewContent) {
    return (
      <div className="space-y-6 animate-fade-in">
        <button
          onClick={() => setViewContent(null)}
          className="btn-ghost inline-flex items-center gap-1.5 text-sm"
        >
          <IconArrowRight className="w-4 h-4 rotate-180" />
          Back to Library
        </button>

        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center">
              <ContentTypeIcon type={viewContent.type} className="w-5 h-5 text-brand-600" />
            </div>
            <h1 className="section-title text-2xl">{viewContent.title}</h1>
          </div>

          {viewContent.type === "article" && viewContent.body && (
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: viewContent.body.replace(/\n/g, "<br/>") }} />
            </div>
          )}

          {viewContent.type === "video" && viewContent.fileUrl && (
            <div className="bg-black rounded-xl overflow-hidden shadow-soft-xl">
              <video controls className="w-full max-h-[70vh]" src={viewContent.fileUrl}>
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {viewContent.type === "file" && viewContent.fileUrl && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
                <IconDownload className="w-8 h-8 text-brand-600" />
              </div>
              <p className="text-lg font-medium text-surface-700 mb-4">Your file is ready to download</p>
              <a
                href={viewContent.fileUrl}
                download
                className="btn-primary inline-flex items-center gap-2"
              >
                <IconDownload className="w-4 h-4" />
                Download File
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="section-title text-2xl">My Library</h1>
        <p className="text-surface-500 mt-1">All your purchased content in one place.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-0 overflow-hidden">
              <div className="skeleton aspect-video" />
              <div className="p-4">
                <div className="skeleton h-5 rounded w-3/4 mb-2" />
                <div className="skeleton h-3 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : purchases.length === 0 ? (
        <div className="card text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-4">
            <IconLibrary className="w-8 h-8 text-surface-400" />
          </div>
          <p className="text-surface-500 text-lg mb-1 font-medium">Your library is empty</p>
          <p className="text-surface-400 text-sm mb-6">Purchase content to see it here.</p>
          <Link href="/browse" className="btn-primary inline-flex items-center gap-2">
            <IconSparkles className="w-4 h-4" />
            Browse Content
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {purchases.map((p) => (
            <button
              key={p._id}
              onClick={() => openContent(p.content?._id)}
              className="card-hover text-left overflow-hidden rounded-xl border border-surface-200 group"
            >
              <div className="aspect-video bg-surface-100 flex items-center justify-center relative overflow-hidden">
                {p.content?.thumbnailUrl ? (
                  <img src={p.content.thumbnailUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <ContentTypeIcon type={p.content?.type} className="w-12 h-12 text-surface-300 group-hover:text-brand-400 transition-colors" />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-medium text-sm text-surface-900 group-hover:text-brand-600 transition-colors">{p.content?.title}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="badge-blue text-xs capitalize">{p.content?.type}</span>
                  <span className="text-xs text-surface-400">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
