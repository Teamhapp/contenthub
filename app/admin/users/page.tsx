"use client";

import { useEffect, useState } from "react";
import { IconSearch, IconCheck, IconX, IconUsers } from "@/components/ui/Icons";

const roleBadge: Record<string, string> = {
  customer: "badge-blue",
  creator: "badge-purple",
  admin: "badge-red",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  function fetchUsers() {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (search) params.set("search", search);

    fetch(`/api/users?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setUsers(data.users || []);
        setTotalPages(data.totalPages || 1);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchUsers(); }, [page, search]);

  async function updateUser(userId: string, updates: any) {
    await fetch(`/api/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    fetchUsers();
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-2xl">User Management</h1>
        <p className="text-[#797586] mt-1">Manage user accounts and permissions.</p>
      </div>

      <div className="relative max-w-md">
        <IconSearch className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#797586]" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="input pl-10 w-full"
        />
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-14 rounded" />)}
          </div>
        ) : (
          <table className="table-premium">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold">
                        {user.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-[#151b29]">{user.name}</p>
                        <p className="text-xs text-[#797586]">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <select
                      value={user.role}
                      onChange={(e) => updateUser(user._id, { role: e.target.value })}
                      className={`${roleBadge[user.role]} text-xs font-medium px-2.5 py-1 rounded-full border-0 cursor-pointer`}
                    >
                      <option value="customer">Customer</option>
                      <option value="creator">Creator</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    {user.isBanned ? (
                      <span className="badge-red text-xs inline-flex items-center gap-1">
                        <IconX className="w-3 h-3" />
                        Banned
                      </span>
                    ) : (
                      <span className="badge-green text-xs inline-flex items-center gap-1">
                        <IconCheck className="w-3 h-3" />
                        Active
                      </span>
                    )}
                  </td>
                  <td className="text-[#797586]">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <button
                      onClick={() => updateUser(user._id, { isBanned: !user.isBanned })}
                      className={user.isBanned ? "btn-secondary text-xs px-3 py-1.5" : "btn-danger text-xs px-3 py-1.5"}
                    >
                      {user.isBanned ? "Unban" : "Ban"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                p === page
                  ? "bg-[#451ebb] text-white shadow-soft-md"
                  : "bg-white border border-[#e2e8fc] text-[#484554] hover:bg-[#faf8ff] hover:border-surface-300"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
