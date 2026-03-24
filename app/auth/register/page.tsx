"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconMail, IconLock, IconUser, IconArrowRight, IconLibrary, IconSparkles } from "@/components/ui/Icons";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "customer" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      // Auto sign in after registration
      const signInRes = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (signInRes?.error) {
        router.push("/auth/login");
      } else {
        router.push(form.role === "creator" ? "/creator" : "/dashboard");
        router.refresh();
      }
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left branding panel - hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 hero-gradient relative overflow-hidden items-center justify-center">
        {/* Floating shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-fade-in" />
          <div className="absolute top-1/4 left-10 w-56 h-56 bg-accent-400/20 rounded-full blur-2xl animate-fade-in" />
          <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-brand-300/20 rounded-full blur-3xl animate-fade-in" />
          <div className="absolute bottom-40 right-16 w-40 h-40 border border-white/20 rounded-2xl -rotate-12 animate-slide-up" />
          <div className="absolute top-1/3 left-20 w-32 h-32 border border-white/10 rounded-full animate-slide-up" />
        </div>

        <div className="relative z-10 text-center px-12 max-w-lg animate-fade-in">
          <div className="w-16 h-16 bg-white/20 glass rounded-2xl flex items-center justify-center mx-auto mb-8">
            <IconSparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="font-display text-4xl font-bold text-white mb-4">
            Start your journey
          </h2>
          <p className="text-brand-100 text-lg leading-relaxed">
            Join thousands of creators and learners. Buy premium content or sell your own and start earning today.
          </p>
          <div className="mt-10 flex items-center justify-center gap-6 text-brand-200 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent-400" />
              <span>Free to join</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent-400" />
              <span>Instant access</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col">
        {/* Mobile gradient accent */}
        <div className="lg:hidden h-2 hero-gradient" />

        <div className="flex-1 flex items-center justify-center px-4 py-12 bg-surface-50">
          <div className="w-full max-w-md animate-fade-in">
            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-8">
              <h2 className="font-display text-2xl font-bold text-gradient">ContentHub</h2>
            </div>

            <div className="card shadow-soft-xl p-8">
              <div className="text-center mb-8">
                <h1 className="font-display text-3xl font-bold text-surface-900 mb-2">
                  Create Account
                </h1>
                <p className="text-surface-500">Join ContentHub today</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2 animate-fade-in">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <IconUser className="w-5 h-5 text-surface-400" />
                    </div>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="input pl-11 w-full transition-all duration-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <IconMail className="w-5 h-5 text-surface-400" />
                    </div>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="input pl-11 w-full transition-all duration-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <IconLock className="w-5 h-5 text-surface-400" />
                    </div>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="input pl-11 w-full transition-all duration-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                      placeholder="Min. 6 characters"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                {/* Role picker */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    I want to...
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, role: "customer" })}
                      className={`relative p-4 rounded-xl text-center transition-all duration-200 border-2 group overflow-hidden ${
                        form.role === "customer"
                          ? "border-brand-500 bg-brand-50 shadow-md"
                          : "border-surface-200 hover:border-surface-300 bg-white"
                      }`}
                    >
                      {form.role === "customer" && (
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-500 to-brand-600" />
                      )}
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 transition-colors duration-200 ${
                          form.role === "customer"
                            ? "bg-brand-100 text-brand-600"
                            : "bg-surface-100 text-surface-500 group-hover:bg-surface-200"
                        }`}
                      >
                        <IconLibrary className="w-5 h-5" />
                      </div>
                      <div
                        className={`font-semibold text-sm transition-colors ${
                          form.role === "customer" ? "text-brand-700" : "text-surface-700"
                        }`}
                      >
                        Buy Content
                      </div>
                      <div className="text-xs text-surface-500 mt-0.5">Browse & purchase</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setForm({ ...form, role: "creator" })}
                      className={`relative p-4 rounded-xl text-center transition-all duration-200 border-2 group overflow-hidden ${
                        form.role === "creator"
                          ? "border-brand-500 bg-brand-50 shadow-md"
                          : "border-surface-200 hover:border-surface-300 bg-white"
                      }`}
                    >
                      {form.role === "creator" && (
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent-400 to-accent-500" />
                      )}
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 transition-colors duration-200 ${
                          form.role === "creator"
                            ? "bg-brand-100 text-brand-600"
                            : "bg-surface-100 text-surface-500 group-hover:bg-surface-200"
                        }`}
                      >
                        <IconSparkles className="w-5 h-5" />
                      </div>
                      <div
                        className={`font-semibold text-sm transition-colors ${
                          form.role === "creator" ? "text-brand-700" : "text-surface-700"
                        }`}
                      >
                        Sell Content
                      </div>
                      <div className="text-xs text-surface-500 mt-0.5">Create & earn</div>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3 flex items-center justify-center gap-2 text-base transition-all duration-200"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <IconArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-surface-500">
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    className="text-brand-600 hover:text-brand-700 font-semibold transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
