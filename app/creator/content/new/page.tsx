"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewContentPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "article",
    body: "",
    price: "",
    category: "",
    tags: "",
    previewContent: "",
    fileUrl: "",
    thumbnailUrl: "",
  });

  useEffect(() => {
    fetch("/api/categories").then((r) => r.json()).then(setCategories).catch(() => {});
  }, []);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, field: "fileUrl" | "thumbnailUrl") {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("subfolder", "content");
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) setForm({ ...form, [field]: data.url });
    } catch {}
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent, status: "draft" | "pending") {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title: form.title,
      description: form.description,
      type: form.type,
      body: form.type === "article" ? form.body : undefined,
      fileUrl: form.type !== "article" ? form.fileUrl : undefined,
      thumbnailUrl: form.thumbnailUrl || undefined,
      previewContent: form.previewContent || undefined,
      price: Math.round(parseFloat(form.price) * 100),
      category: form.category || undefined,
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      status,
    };

    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/creator/content");
      }
    } catch {}
    setLoading(false);
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Create New Content</h1>

      <form className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            rows={2}
            maxLength={500}
            required
          />
        </div>

        {/* Content Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
          <div className="grid grid-cols-3 gap-3">
            {["article", "video", "file"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setForm({ ...form, type: t })}
                className={`p-3 border-2 rounded-lg text-center capitalize text-sm font-medium transition-colors ${
                  form.type === t
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {t === "article" ? "\u{1F4DD}" : t === "video" ? "\u{1F3AC}" : "\u{1F4C1}"} {t}
              </button>
            ))}
          </div>
        </div>

        {/* Article Body */}
        {form.type === "article" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Article Content (Markdown)</label>
            <textarea
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm"
              rows={12}
              placeholder="Write your article content here... Markdown is supported."
            />
          </div>
        )}

        {/* File Upload for video/file */}
        {form.type !== "article" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload {form.type === "video" ? "Video" : "File"}
            </label>
            <input
              type="file"
              onChange={(e) => handleFileUpload(e, "fileUrl")}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              accept={form.type === "video" ? "video/*" : "*"}
            />
            {form.fileUrl && (
              <p className="text-xs text-green-600 mt-1">File uploaded: {form.fileUrl}</p>
            )}
          </div>
        )}

        {/* Thumbnail */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail Image (optional)</label>
          <input
            type="file"
            onChange={(e) => handleFileUpload(e, "thumbnailUrl")}
            accept="image/*"
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          {form.thumbnailUrl && (
            <p className="text-xs text-green-600 mt-1">Thumbnail uploaded</p>
          )}
        </div>

        {/* Preview Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Preview / Teaser (shown before purchase)</label>
          <textarea
            value={form.previewContent}
            onChange={(e) => setForm({ ...form, previewContent: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            rows={3}
            placeholder="A short preview or excerpt that users see before purchasing..."
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price (USD)</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-500">$</span>
            <input
              type="number"
              step="0.01"
              min="0.50"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="9.99"
              required
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="">Select category...</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
          <input
            type="text"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="javascript, tutorial, beginner"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, "draft")}
            disabled={loading || uploading}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, "pending")}
            disabled={loading || uploading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit for Review"}
          </button>
        </div>
      </form>
    </div>
  );
}
