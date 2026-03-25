"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface SidebarLink {
  href: string;
  label: string;
  icon: ReactNode;
}

export default function Sidebar({ links, title }: { links: SidebarLink[]; title: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white/80 backdrop-blur-sm border-r border-surface-200/40 min-h-[calc(100vh-4rem)] hidden lg:flex flex-col">
      <div className="p-6 flex-1">
        <div className="flex items-center gap-2.5 mb-7">
          <div className="w-7 h-7 rounded-lg hero-gradient flex items-center justify-center">
            <span className="text-white text-[10px] font-extrabold">C</span>
          </div>
          <h2 className="text-sm font-display font-bold text-surface-900 tracking-tight">{title}</h2>
        </div>

        <nav className="space-y-0.5">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                  isActive
                    ? "bg-brand-600 text-white shadow-glow-brand"
                    : "text-surface-500 hover:bg-surface-50 hover:text-surface-800"
                }`}
              >
                <span className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? "text-white" : "text-surface-400 group-hover:text-surface-600"}`}>
                  {link.icon}
                </span>
                {link.label}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom section */}
      <div className="p-6 pt-0">
        <div className="divider-gradient mb-4" />
        <div className="px-3 py-2">
          <p className="text-[10px] font-medium text-surface-400 uppercase tracking-widest">ContentHub</p>
          <p className="text-[10px] text-surface-300 mt-0.5">v1.0 Beta</p>
        </div>
      </div>
    </aside>
  );
}
