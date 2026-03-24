"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { IconCart, IconMenu, IconX, IconChevronDown, IconUser, IconSettings } from "@/components/ui/Icons";

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
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? "glass shadow-soft-sm"
        : "bg-white/60 backdrop-blur-md"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl hero-gradient flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-lg font-bold font-display text-surface-900">ContentHub</span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              <Link href="/browse" className="btn-ghost text-surface-600">
                Browse
              </Link>
              {role === "creator" && (
                <Link href="/creator" className="btn-ghost text-surface-600">
                  Creator Studio
                </Link>
              )}
              {role === "admin" && (
                <Link href="/admin" className="btn-ghost text-surface-600">
                  Admin
                </Link>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <>
                <Link href="/checkout" className="relative btn-ghost p-2">
                  <IconCart className="w-5 h-5" />
                </Link>
                <Link href="/dashboard" className="btn-ghost text-surface-600">
                  Library
                </Link>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 btn-ghost"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {session.user.name?.[0]?.toUpperCase() || "U"}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-surface-700 max-w-[100px] truncate">
                      {session.user.name}
                    </span>
                    <IconChevronDown className={`w-4 h-4 text-surface-400 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-56 card shadow-soft-lg py-1 animate-slide-down">
                      <div className="px-4 py-3 border-b border-surface-100">
                        <p className="text-sm font-semibold text-surface-900">{session.user.name}</p>
                        <p className="text-xs text-surface-400">{session.user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/dashboard/settings"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-600 hover:bg-surface-50 transition-colors"
                          onClick={() => setProfileOpen(false)}
                        >
                          <IconSettings className="w-4 h-4" />
                          Settings
                        </Link>
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-600 hover:bg-surface-50 transition-colors"
                          onClick={() => setProfileOpen(false)}
                        >
                          <IconUser className="w-4 h-4" />
                          Dashboard
                        </Link>
                      </div>
                      <div className="border-t border-surface-100 py-1">
                        <button
                          onClick={() => signOut({ callbackUrl: "/" })}
                          className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="btn-ghost text-surface-600">
                  Sign In
                </Link>
                <Link href="/auth/register" className="btn-primary">
                  Get Started
                </Link>
              </>
            )}
          </div>

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
                <Link href="/dashboard" className="block btn-ghost w-full text-left" onClick={() => setMenuOpen(false)}>My Library</Link>
                <Link href="/checkout" className="block btn-ghost w-full text-left" onClick={() => setMenuOpen(false)}>Cart</Link>
                {role === "creator" && <Link href="/creator" className="block btn-ghost w-full text-left" onClick={() => setMenuOpen(false)}>Creator Studio</Link>}
                {role === "admin" && <Link href="/admin" className="block btn-ghost w-full text-left" onClick={() => setMenuOpen(false)}>Admin</Link>}
                <div className="pt-2 border-t border-surface-100">
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
