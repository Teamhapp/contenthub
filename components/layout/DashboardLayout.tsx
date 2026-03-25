"use client";

import Sidebar from "./Sidebar";
import { ReactNode, useState } from "react";
import { IconMenu, IconX } from "@/components/ui/Icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
  links: { href: string; label: string; icon: ReactNode }[];
  title: string;
}

export default function DashboardLayout({ children, links, title }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar links={links} title={title} />

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-soft-2xl animate-fade-in-right overflow-y-auto">
            <div className="p-5">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg hero-gradient flex items-center justify-center">
                    <span className="text-white text-[10px] font-extrabold">C</span>
                  </div>
                  <h2 className="text-sm font-display font-bold text-surface-900">{title}</h2>
                </div>
                <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg hover:bg-surface-100">
                  <IconX className="w-4 h-4 text-surface-500" />
                </button>
              </div>
              <nav className="space-y-0.5">
                {links.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? "bg-brand-600 text-white shadow-glow-brand"
                          : "text-surface-500 hover:bg-surface-50"
                      }`}
                    >
                      <span className={`w-5 h-5 ${isActive ? "text-white" : "text-surface-400"}`}>{link.icon}</span>
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>
        </div>
      )}

      <main className="flex-1 min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-16 z-30 bg-white/80 backdrop-blur-md border-b border-surface-200/50 px-4 py-2.5">
          <button onClick={() => setMobileOpen(true)} className="flex items-center gap-2 text-sm text-surface-600 font-medium">
            <IconMenu className="w-4 h-4" />
            {title}
          </button>
        </div>

        <div className="p-5 sm:p-6 lg:p-8 mesh-gradient min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
