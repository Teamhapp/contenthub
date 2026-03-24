"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditContentPage({ params }: { params: { contentId: string } }) {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
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

    fetch(`/api/content/${params.contentId}/access`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) {
          setForm({
            title: data.title || "",
            description: data.description || "",
            type: data.type || "article",
            body: data.body || "",
            price: ((data.price || 0) / 100).toFixed(2),
            category: data.category?._id || data.category || "",
            tags: (data.tags || []).join(", "),
            previewContent: data.previewContent || "",
            fileUrl: data.fileUrl || "",
            thumbnailUrl: data.thumbnailUrl || "",
          });
        }
      })
      .finally(() => setFetching(false));
  }, [params.contentId]);

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title: form.title,
      description: form.description,
      body: form.type === "article" ? form.body : undefined,
      fileUrl: form.type !== "article" ? form.fileUrl : undefined,
      thumbnailUrl: form.thumbnailUrl || undefined,
      previewContent: form.previewContent || undefined,
      price: Math.round(parseFloat(form.price) * 100),
      category: form.category || undefined,
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    };

    try {
      const res = await fetch(`/api/content/${params.contentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) router.push("/creator/content");
    } catch {}
    setLoading(false);
  }

  if (fetching) {
    return <div className="animate-pulse"><div className="h-8 bg-gray-200 rounded w-1/3 mb-6" /><div className="h-64 bg-gray-200 rounded" /></div>;
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Edit Content</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            rows={2}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
          <input type="text" value={form.type} disabled className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-500 capitalize" />
        </div>

        {form.type === "article" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Article Content</label>
            <textarea
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm"
              rows={12}
            />
          </div>
        )}

        {form.type !== "article" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Replace File</label>
            <input
              type="file"
              onChange={(e) => handleFileUpload(e, "fileUrl")}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700"
            />
            {form.fileUrl && <p className="text-xs text-green-600 mt-1">Current file: {form.fileUrl}</p>}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail</label>
          <input
            type="file"
            onChange={(e) => handleFileUpload(e, "thumbnailUrl")}
            accept="image/*"
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Preview / Teaser</label>
          <textarea
            value={form.previewContent}
            onChange={(e) => setForm({ ...form, previewContent: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            rows={3}
          />
        </div>

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
              required
            />
          </div>
        </div>

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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
          <input
            type="text"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || uploading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
