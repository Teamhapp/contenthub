"use client";

import Sidebar from "./Sidebar";
import { ReactNode, useState } from "react";
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
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      <Sidebar links={links} title={title} />

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-[0_20px_60px_rgba(21,27,41,0.15)] overflow-y-auto font-['Plus_Jakarta_Sans']">
            <div className="p-5">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-bold text-[#151b29]">{title}</h2>
                <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg hover:bg-[#f1f3ff]">
                  <span className="material-symbols-outlined text-[#484554] text-lg">close</span>
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
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? "bg-[#451ebb] text-white shadow-[0_4px_14px_0_rgba(69,30,187,0.35)]"
                          : "text-[#484554] hover:bg-[#f1f3ff]"
                      }`}
                    >
                      <span className={`w-5 h-5 flex items-center justify-center ${isActive ? "text-white" : "text-[#797586]"}`}>{link.icon}</span>
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
        <div className="lg:hidden sticky top-14 z-30 bg-[#faf8ff]/90 backdrop-blur-md border-b border-[#e2e8fc]/50 px-4 py-2.5">
          <button onClick={() => setMobileOpen(true)} className="flex items-center gap-2 text-sm text-[#484554] font-medium">
            <span className="material-symbols-outlined text-lg">menu</span>
            {title}
          </button>
        </div>

        <div className="p-5 sm:p-6 lg:p-8 min-h-full bg-[#faf8ff]">
          {children}
        </div>
      </main>
    </div>
  );
}
