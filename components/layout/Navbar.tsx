"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
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
    <nav className={`fixed top-0 w-full z-50 font-['Plus_Jakarta_Sans'] transition-all duration-300 ${
      scrolled
        ? "bg-[#faf8ff]/90 backdrop-blur-[20px] shadow-sm"
        : "bg-[#faf8ff]/70 backdrop-blur-[20px]"
    }`}>
      <div className="flex justify-between items-center px-6 lg:px-8 py-3.5 max-w-[1920px] mx-auto">
        {/* Left: Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight text-[#151b29]">
          The Atelier
        </Link>

        {/* Center: Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/browse" className="text-[#484554] hover:text-[#151b29] transition-all duration-300 text-sm font-medium">
            Explore
          </Link>
          <Link href="/browse" className="text-[#484554] hover:text-[#151b29] transition-all duration-300 text-sm font-medium">
            Creators
          </Link>
          <Link href="/browse" className="text-[#451ebb] font-semibold border-b-2 border-[#451ebb] pb-0.5 transition-all duration-300 text-sm">
            Marketplace
          </Link>
          {role === "creator" && (
            <Link href="/creator" className="text-[#484554] hover:text-[#151b29] transition-all duration-300 text-sm font-medium">
              Studio
            </Link>
          )}
          {role === "admin" && (
            <Link href="/admin" className="text-[#484554] hover:text-[#151b29] transition-all duration-300 text-sm font-medium">
              Admin
            </Link>
          )}
        </div>

        {/* Right: Actions */}
        <div className="hidden md:flex items-center gap-4">
          {/* Search */}
          <div className="hidden lg:flex items-center bg-[#f1f3ff] px-4 py-2 rounded-lg gap-2">
            <span className="material-symbols-outlined text-[#797586] text-sm">search</span>
            <input className="bg-transparent border-none focus:ring-0 focus:outline-none text-sm w-40 text-[#151b29] placeholder-[#797586]" placeholder="Search assets..." type="text" />
          </div>

          {session ? (
            <>
              {/* Cart */}
              <Link href="/checkout" className="material-symbols-outlined text-[#484554] hover:bg-[#e2e8fc]/50 p-2 rounded-full transition-all">
                shopping_cart
              </Link>

              {/* Notifications */}
              <NotificationBell />

              {/* Profile */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 hover:bg-[#f1f3ff] py-1.5 pl-1.5 pr-3 rounded-lg transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#451ebb] to-[#5d3fd3] flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {session.user.name?.[0]?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-[#151b29] max-w-[100px] truncate hidden lg:block">
                    {session.user.name}
                  </span>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-[0_20px_40px_rgba(21,27,41,0.12)] py-1 border border-[#c9c4d7]/15">
                    <div className="px-4 py-3 border-b border-[#e2e8fc]">
                      <p className="text-sm font-semibold text-[#151b29]">{session.user.name}</p>
                      <p className="text-xs text-[#797586] truncate">{session.user.email}</p>
                      <span className="inline-block mt-1.5 px-2 py-0.5 bg-[#e6deff] text-[#451ebb] text-[10px] font-bold rounded-full uppercase tracking-wider">{role}</span>
                    </div>
                    <div className="py-1">
                      <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#484554] hover:bg-[#f1f3ff] transition-colors" onClick={() => setProfileOpen(false)}>
                        <span className="material-symbols-outlined text-lg">dashboard</span>
                        Dashboard
                      </Link>
                      <Link href="/dashboard/library" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#484554] hover:bg-[#f1f3ff] transition-colors" onClick={() => setProfileOpen(false)}>
                        <span className="material-symbols-outlined text-lg">folder_open</span>
                        My Library
                      </Link>
                      <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#484554] hover:bg-[#f1f3ff] transition-colors" onClick={() => setProfileOpen(false)}>
                        <span className="material-symbols-outlined text-lg">settings</span>
                        Settings
                      </Link>
                    </div>
                    <div className="border-t border-[#e2e8fc] py-1">
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-[#ba1a1a] hover:bg-red-50 transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">logout</span>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-[#484554] font-medium px-4 py-2 hover:bg-[#e2e8fc]/50 rounded-lg transition-all text-sm">
                Sign In
              </Link>
              <Link href="/auth/register" className="bg-gradient-to-r from-[#451ebb] to-[#5d3fd3] text-white font-semibold px-6 py-2 rounded-lg shadow-sm hover:opacity-90 transition-all text-sm">
                Open Shop
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-[#f1f3ff] transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="material-symbols-outlined text-[#151b29]">
            {menuOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#c9c4d7]/15 bg-[#faf8ff]/95 backdrop-blur-xl">
          <div className="px-6 py-4 space-y-1">
            <Link href="/browse" className="block px-4 py-3 text-sm font-medium text-[#484554] hover:bg-[#f1f3ff] rounded-lg transition-colors" onClick={() => setMenuOpen(false)}>Explore</Link>
            <Link href="/browse" className="block px-4 py-3 text-sm font-medium text-[#484554] hover:bg-[#f1f3ff] rounded-lg transition-colors" onClick={() => setMenuOpen(false)}>Marketplace</Link>
            {session ? (
              <>
                <Link href="/dashboard" className="block px-4 py-3 text-sm font-medium text-[#484554] hover:bg-[#f1f3ff] rounded-lg transition-colors" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <Link href="/dashboard/library" className="block px-4 py-3 text-sm font-medium text-[#484554] hover:bg-[#f1f3ff] rounded-lg transition-colors" onClick={() => setMenuOpen(false)}>My Library</Link>
                <Link href="/checkout" className="block px-4 py-3 text-sm font-medium text-[#484554] hover:bg-[#f1f3ff] rounded-lg transition-colors" onClick={() => setMenuOpen(false)}>Cart</Link>
                {role === "creator" && <Link href="/creator" className="block px-4 py-3 text-sm font-medium text-[#484554] hover:bg-[#f1f3ff] rounded-lg transition-colors" onClick={() => setMenuOpen(false)}>Creator Studio</Link>}
                {role === "admin" && <Link href="/admin" className="block px-4 py-3 text-sm font-medium text-[#484554] hover:bg-[#f1f3ff] rounded-lg transition-colors" onClick={() => setMenuOpen(false)}>Admin</Link>}
                <div className="pt-2 border-t border-[#e2e8fc] mt-2">
                  <button onClick={() => signOut({ callbackUrl: "/" })} className="block w-full text-left px-4 py-3 text-sm font-medium text-[#ba1a1a] hover:bg-red-50 rounded-lg transition-colors">Sign Out</button>
                </div>
              </>
            ) : (
              <div className="pt-2 flex flex-col gap-2">
                <Link href="/auth/login" className="block text-center px-4 py-3 text-sm font-medium text-[#484554] hover:bg-[#f1f3ff] rounded-lg transition-colors" onClick={() => setMenuOpen(false)}>Sign In</Link>
                <Link href="/auth/register" className="block text-center bg-gradient-to-r from-[#451ebb] to-[#5d3fd3] text-white font-semibold px-4 py-3 rounded-lg text-sm" onClick={() => setMenuOpen(false)}>Open Shop</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
