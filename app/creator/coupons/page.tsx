"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { formatPrice } from "@/lib/constants";
import { IconPlus, IconTrash, IconCheck, IconTag, IconArrowRight } from "@/components/ui/Icons";

interface CouponItem {
  _id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  usageLimit: number;
  usedCount: number;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
}

export default function CouponsPage() {
  const { data: session } = useSession();
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [code, setCode] = useState("");
  const [type, setType] = useState<"percentage" | "fixed">("percentage");
  const [value, setValue] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  useEffect(() => {
    fetch("/api/coupons/my")
      .then((r) => r.json())
      .then((data) => setCoupons(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  function resetForm() {
    setCode("");
    setType("percentage");
    setValue("");
    setUsageLimit("");
    setExpiresAt("");
    setError("");
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) {
      setError("Enter a coupon code.");
      return;
    }
    if (!value || parseFloat(value) <= 0) {
      setError("Enter a valid value.");
      return;
    }
    if (type === "percentage" && parseFloat(value) > 100) {
      setError("Percentage cannot exceed 100%.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.toUpperCase().trim(),
          type,
          value: parseFloat(value),
          usageLimit: parseInt(usageLimit) || 0,
          expiresAt: expiresAt || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create coupon");
      }
      const newCoupon = await res.json();
      setCoupons((prev) => [newCoupon, ...prev]);
      setShowForm(false);
      resetForm();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    await fetch(`/api/coupons/${id}`, { method: "DELETE" });
    setCoupons(coupons.filter((c) => c._id !== id));
  }

  async function handleToggle(id: string, currentlyActive: boolean) {
    const res = await fetch(`/api/coupons/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !currentlyActive }),
    });
    if (res.ok) {
      setCoupons(
        coupons.map((c) =>
          c._id === id ? { ...c, isActive: !currentlyActive } : c
        )
      );
    }
  }

  function formatCouponValue(coupon: CouponItem) {
    if (coupon.type === "percentage") return `${coupon.value}%`;
    return formatPrice(coupon.value);
  }

  function isExpired(coupon: CouponItem) {
    if (!coupon.expiresAt) return false;
    return new Date(coupon.expiresAt) < new Date();
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="page-header-with-actions">
        <div>
          <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-2xl">Coupon Codes</h1>
          <p className="text-[#797586] mt-1">
            Create discount codes for your customers.
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) resetForm();
          }}
          className="btn-primary inline-flex items-center gap-2"
        >
          <IconPlus className="w-4 h-4" />
          Create Coupon
        </button>
      </div>

      {/* Create Coupon Form */}
      {showForm && (
        <div className="card animate-fade-in">
          <div className="px-6 py-5 border-b border-[#e2e8fc]">
            <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-lg">New Coupon</h2>
          </div>
          <form onSubmit={handleCreate} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#484554] mb-2">
                  Coupon Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="input font-mono uppercase tracking-wider"
                  placeholder="SUMMER2025"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#484554] mb-2">
                  Discount Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as "percentage" | "fixed")}
                  className="input"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount ($)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#484554] mb-2">
                  Value {type === "percentage" ? "(%)" : "($)"}
                </label>
                <input
                  type="number"
                  step={type === "percentage" ? "1" : "0.01"}
                  min="0.01"
                  max={type === "percentage" ? "100" : undefined}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="input"
                  placeholder={type === "percentage" ? "25" : "5.00"}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#484554] mb-2">
                  Usage Limit
                </label>
                <input
                  type="number"
                  min="0"
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(e.target.value)}
                  className="input"
                  placeholder="0 = Unlimited"
                />
                <p className="text-xs text-[#797586] mt-1">0 or empty for unlimited</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#484554] mb-2">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="input"
                />
                <p className="text-xs text-[#797586] mt-1">Leave empty for no expiry</p>
              </div>
            </div>

            {/* Preview */}
            {(code || value) && (
              <div className="bg-[#faf8ff] rounded-xl p-4">
                <p className="text-xs text-[#797586] mb-2 font-medium uppercase tracking-wider">
                  Preview
                </p>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-lg font-bold text-[#451ebb] bg-[#e6deff] px-3 py-1 rounded-lg">
                    {code || "CODE"}
                  </span>
                  <IconArrowRight className="w-4 h-4 text-[#c9c4d7]" />
                  <span className="text-[#484554] font-medium">
                    {type === "percentage"
                      ? `${value || 0}% off`
                      : `$${parseFloat(value || "0").toFixed(2)} off`}
                  </span>
                </div>
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
                    Creating...
                  </>
                ) : (
                  <>
                    <IconCheck className="w-4 h-4" />
                    Create Coupon
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

      {/* Coupons Table */}
      {loading ? (
        <div className="card p-0 overflow-hidden">
          <div className="p-6 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton h-14 rounded" />
            ))}
          </div>
        </div>
      ) : coupons.length === 0 && !showForm ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <IconTag className="w-8 h-8 text-[#797586]" />
          </div>
          <p className="text-[#797586] text-lg mb-1 font-medium">No coupons yet</p>
          <p className="text-[#797586] text-sm mb-6">
            Create coupon codes to offer discounts and attract more customers.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <IconPlus className="w-4 h-4" />
            Create your first coupon
          </button>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="table-premium">
            <thead>
              <tr>
                <th>Code</th>
                <th>Type</th>
                <th>Value</th>
                <th>Usage</th>
                <th>Expires</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => {
                const expired = isExpired(coupon);

                return (
                  <tr key={coupon._id}>
                    <td>
                      <span className="font-mono font-bold text-sm text-[#151b29] tracking-wider">
                        {coupon.code}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`${
                          coupon.type === "percentage"
                            ? "badge-purple"
                            : "badge-blue"
                        } text-xs capitalize`}
                      >
                        {coupon.type}
                      </span>
                    </td>
                    <td className="font-semibold text-[#151b29]">
                      {formatCouponValue(coupon)}
                    </td>
                    <td className="text-[#484554]">
                      <span className="font-medium">{coupon.usedCount}</span>
                      <span className="text-[#797586]">
                        /{coupon.usageLimit > 0 ? coupon.usageLimit : <span title="Unlimited">&infin;</span>}
                      </span>
                    </td>
                    <td className="text-[#797586] text-sm">
                      {coupon.expiresAt ? (
                        <span className={expired ? "text-red-500" : ""}>
                          {new Date(coupon.expiresAt).toLocaleDateString()}
                          {expired && (
                            <span className="block text-xs text-red-400">Expired</span>
                          )}
                        </span>
                      ) : (
                        <span className="text-[#797586]">Never</span>
                      )}
                    </td>
                    <td>
                      {coupon.isActive && !expired ? (
                        <span className="badge-glow-green text-xs">Active</span>
                      ) : (
                        <span className="badge-gray text-xs">Inactive</span>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggle(coupon._id, coupon.isActive)}
                          className="btn-ghost p-2 rounded-lg"
                          title={coupon.isActive ? "Deactivate" : "Activate"}
                        >
                          <IconCheck
                            className={`w-4 h-4 ${
                              coupon.isActive
                                ? "text-green-600"
                                : "text-[#797586]"
                            }`}
                          />
                        </button>
                        <button
                          onClick={() => handleDelete(coupon._id)}
                          className="btn-ghost p-2 rounded-lg"
                          title="Delete"
                        >
                          <IconTrash className="w-4 h-4 text-[#797586] hover:text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
