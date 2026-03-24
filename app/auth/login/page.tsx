"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { IconMail, IconLock, IconArrowRight } from "@/components/ui/Icons";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const callbackUrl = searchParams.get("callbackUrl") || "/";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left branding panel - hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 hero-gradient relative overflow-hidden items-center justify-center">
        {/* Floating shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-fade-in" />
          <div className="absolute top-1/3 right-10 w-56 h-56 bg-accent-400/20 rounded-full blur-2xl animate-fade-in" />
          <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-brand-300/20 rounded-full blur-3xl animate-fade-in" />
          <div className="absolute top-20 right-1/3 w-40 h-40 border border-white/20 rounded-2xl rotate-12 animate-slide-up" />
          <div className="absolute bottom-1/3 left-16 w-32 h-32 border border-white/10 rounded-full animate-slide-up" />
        </div>

        <div className="relative z-10 text-center px-12 max-w-lg animate-fade-in">
          <div className="w-16 h-16 bg-white/20 glass rounded-2xl flex items-center justify-center mx-auto mb-8">
            <IconArrowRight className="w-8 h-8 text-white" />
          </div>
          <h2 className="font-display text-4xl font-bold text-white mb-4">
            Welcome back to ContentHub
          </h2>
          <p className="text-brand-100 text-lg leading-relaxed">
            Access your library, discover new content, and connect with creators from around the world.
          </p>
          <div className="mt-10 flex items-center justify-center gap-6 text-brand-200 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent-400" />
              <span>10k+ Creators</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent-400" />
              <span>50k+ Products</span>
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
                  Welcome Back
                </h1>
                <p className="text-surface-500">Sign in to your account</p>
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
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <IconMail className="w-5 h-5 text-surface-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input pl-11 w-full transition-all duration-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                      placeholder="Enter your password"
                      required
                    />
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
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <IconArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-surface-500">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/auth/register"
                    className="text-brand-600 hover:text-brand-700 font-semibold transition-colors"
                  >
                    Create one
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
