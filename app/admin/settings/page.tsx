"use client";

import { useEffect, useState } from "react";
import { IconSettings, IconCheck } from "@/components/ui/Icons";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({ commissionRate: 15, minContentPrice: 100, maxContentPrice: 100000 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) setSettings(data);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (loading) {
    return (
      <div className="max-w-2xl animate-fade-in">
        <div className="skeleton h-8 rounded w-1/3 mb-6" />
        <div className="card space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i}>
              <div className="skeleton h-4 rounded w-1/4 mb-2" />
              <div className="skeleton h-10 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-8 animate-fade-in">
      <div>
        <h1 className="section-title text-2xl">Platform Settings</h1>
        <p className="text-surface-500 mt-1">Configure platform-wide settings.</p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-8">
        <div className="flex items-center gap-2 mb-2">
          <IconSettings className="w-5 h-5 text-brand-600" />
          <h2 className="section-title text-lg">General Configuration</h2>
        </div>

        <div>
          <label className="block text-sm font-semibold text-surface-800 mb-1">
            Commission Rate (%)
          </label>
          <p className="text-xs text-surface-400 mb-2">
            Percentage of each sale that goes to the platform.
          </p>
          <input
            type="number"
            min="0"
            max="100"
            value={settings.commissionRate}
            onChange={(e) => setSettings({ ...settings, commissionRate: parseInt(e.target.value) || 0 })}
            className="input w-full max-w-xs"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-surface-800 mb-1">
            Minimum Content Price (cents)
          </label>
          <p className="text-xs text-surface-400 mb-2">
            Lowest price a creator can set. Currently: ${(settings.minContentPrice / 100).toFixed(2)}
          </p>
          <input
            type="number"
            min="0"
            value={settings.minContentPrice}
            onChange={(e) => setSettings({ ...settings, minContentPrice: parseInt(e.target.value) || 0 })}
            className="input w-full max-w-xs"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-surface-800 mb-1">
            Maximum Content Price (cents)
          </label>
          <p className="text-xs text-surface-400 mb-2">
            Highest price a creator can set. Currently: ${(settings.maxContentPrice / 100).toFixed(2)}
          </p>
          <input
            type="number"
            min="0"
            value={settings.maxContentPrice}
            onChange={(e) => setSettings({ ...settings, maxContentPrice: parseInt(e.target.value) || 0 })}
            className="input w-full max-w-xs"
          />
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-surface-200">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary inline-flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              "Save Settings"
            )}
          </button>
          {saved && (
            <span className="text-sm text-green-600 font-medium inline-flex items-center gap-1 animate-fade-in">
              <IconCheck className="w-4 h-4" />
              Settings saved!
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
