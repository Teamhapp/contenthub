"use client";

import { useEffect, useState } from "react";
import { IconPlus, IconTrash, IconTag } from "@/components/ui/Icons";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [creating, setCreating] = useState(false);

  function fetchCategories() {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories)
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchCategories(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, description: newDesc }),
    });
    setNewName("");
    setNewDesc("");
    setCreating(false);
    fetchCategories();
  }

  async function handleDelete(id: string) {
    if (!confirm("Deactivate this category?")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    fetchCategories();
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-2xl">Category Management</h1>
        <p className="text-[#797586] mt-1">Organize content with categories.</p>
      </div>

      <form onSubmit={handleCreate} className="card">
        <div className="flex items-center gap-2 mb-6">
          <IconTag className="w-5 h-5 text-[#451ebb]" />
          <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-lg">Add New Category</h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Category name"
            className="input flex-1"
            required
          />
          <input
            type="text"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="Description (optional)"
            className="input flex-1"
          />
          <button
            type="submit"
            disabled={creating}
            className="btn-primary inline-flex items-center gap-2 whitespace-nowrap"
          >
            <IconPlus className="w-4 h-4" />
            {creating ? "Adding..." : "Add Category"}
          </button>
        </div>
      </form>

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-14 rounded" />)}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16">
            <IconTag className="w-8 h-8 text-[#c9c4d7] mx-auto mb-2" />
            <p className="text-[#797586]">No categories yet.</p>
          </div>
        ) : (
          <table className="table-premium">
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Description</th>
                <th>Content</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id}>
                  <td className="font-medium text-[#151b29]">{cat.name}</td>
                  <td>
                    <span className="text-xs text-[#797586] font-mono bg-[#faf8ff] px-2 py-1 rounded">{cat.slug}</span>
                  </td>
                  <td className="text-[#797586]">{cat.description || "-"}</td>
                  <td>
                    <span className="badge-blue text-xs">{cat.contentCount}</span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="btn-ghost p-2 rounded-lg group"
                      title="Deactivate"
                    >
                      <IconTrash className="w-4 h-4 text-[#797586] group-hover:text-red-600 transition-colors" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
