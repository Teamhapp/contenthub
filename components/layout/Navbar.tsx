"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { IconCart, IconMenu, IconX, IconChevronDown, IconUser, IconSettings, IconSearch } from "@/components/ui/Icons";
import NotificationBell from "@/components/ui/NotificationBell";

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const role = session?.user?.role;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 ${
      scrolled
        ? "glass shadow-soft-sm"
        : "bg-white/50 backdrop-blur-md"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl hero-gradient flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-shadow duration-300">
                <span className="text-white font-extrabold text-sm">C</span>
              </div>
              <span className="text-lg font-extrabold font-display text-surface-900">
                Content<span className="text-brand-600">Hub</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              <Link href="/browse" className="btn-ghost text-surface-600 text-sm">
                Browse
              </Link>
              {role === "creator" && (
                <Link href="/creator" className="btn-ghost text-surface-600 text-sm">
                  Creator Studio
                </Link>
              )}
              {role === "admin" && (
                <Link href="/admin" className="btn-ghost text-surface-600 text-sm">
                  Admin
                </Link>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="hidden md:flex items-center gap-2">
            {session ? (
              <>
                {/* Search shortcut */}
                <Link href="/browse" className="btn-ghost p-2 text-surface-400 hover:text-surface-700">
                  <IconSearch className="w-4.5 h-4.5" />
                </Link>

                {/* Cart */}
                <Link href="/checkout" className="relative btn-ghost p-2 text-surface-500 hover:text-surface-700">
                  <IconCart className="w-5 h-5" />
                </Link>

                {/* Notifications */}
                <NotificationBell />

                {/* Divider */}
                <div className="w-px h-6 bg-surface-200 mx-1" />

                {/* Profile */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2.5 btn-ghost py-1.5 pl-1.5 pr-3"
                  >
                    <div className="avatar avatar-sm">
                      <span className="text-white text-xs font-bold">
                        {session.user.name?.[0]?.toUpperCase() || "U"}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-surface-700 max-w-[100px] truncate hidden lg:block">
                      {session.user.name}
                    </span>
                    <IconChevronDown className={`w-3.5 h-3.5 text-surface-400 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-60 card shadow-soft-xl py-1 animate-scale-in origin-top-right">
                      <div className="px-4 py-3 border-b border-surface-100">
                        <p className="text-sm font-semibold text-surface-900">{session.user.name}</p>
                        <p className="text-xs text-surface-400 truncate">{session.user.email}</p>
                        <span className="badge-purple text-[10px] mt-1.5">{role}</span>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-600 hover:bg-surface-50 transition-colors"
                          onClick={() => setProfileOpen(false)}
                        >
                          <IconUser className="w-4 h-4" />
                          Dashboard
                        </Link>
                        <Link
                          href="/dashboard/library"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-600 hover:bg-surface-50 transition-colors"
                          onClick={() => setProfileOpen(false)}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
                          My Library
                        </Link>
                        <Link
                          href="/dashboard/settings"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-600 hover:bg-surface-50 transition-colors"
                          onClick={() => setProfileOpen(false)}
                        >
                          <IconSettings className="w-4 h-4" />
                          Settings
                        </Link>
                      </div>
                      <div className="border-t border-surface-100 py-1">
                        <button
                          onClick={() => signOut({ callbackUrl: "/" })}
                          className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="btn-ghost text-surface-600 text-sm">
                  Sign In
                </Link>
                <Link href="/auth/register" className="btn-primary text-sm">
                  Get Started
                  <IconArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-surface-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <IconX className="w-5 h-5" /> : <IconMenu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-surface-200/50 bg-white/95 backdrop-blur-xl animate-slide-down">
          <div className="px-4 py-4 space-y-1">
            <Link href="/browse" className="block btn-ghost w-full text-left" onClick={() => setMenuOpen(false)}>Browse</Link>
            {session ? (
              <>
                <Link href="/dashboard" className="block btn-ghost w-full text-left" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <Link href="/dashboard/library" className="block btn-ghost w-full text-left" onClick={() => setMenuOpen(false)}>My Library</Link>
                <Link href="/checkout" className="block btn-ghost w-full text-left" onClick={() => setMenuOpen(false)}>Cart</Link>
                {role === "creator" && <Link href="/creator" className="block btn-ghost w-full text-left" onClick={() => setMenuOpen(false)}>Creator Studio</Link>}
                {role === "admin" && <Link href="/admin" className="block btn-ghost w-full text-left" onClick={() => setMenuOpen(false)}>Admin</Link>}
                <div className="pt-2 border-t border-surface-100 mt-2">
                  <button onClick={() => signOut({ callbackUrl: "/" })} className="block btn-danger w-full text-left">Sign Out</button>
                </div>
              </>
            ) : (
              <div className="pt-2 flex flex-col gap-2">
                <Link href="/auth/login" className="btn-ghost text-center" onClick={() => setMenuOpen(false)}>Sign In</Link>
                <Link href="/auth/register" className="btn-primary text-center" onClick={() => setMenuOpen(false)}>Get Started</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

function IconArrowRight({ className = "w-5 h-5" }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>;
}
