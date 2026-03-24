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
    <aside className="w-64 bg-white border-r border-surface-200/60 min-h-[calc(100vh-4rem)] hidden lg:block">
      <div className="p-6">
        <h2 className="text-sm font-display font-bold text-surface-900 uppercase tracking-wider">{title}</h2>
        <nav className="mt-6 space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                  isActive
                    ? "bg-brand-50 text-brand-700 shadow-soft-xs"
                    : "text-surface-500 hover:bg-surface-50 hover:text-surface-800"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-brand-600 rounded-r-full" />
                )}
                <span className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-brand-600" : ""}`}>
                  {link.icon}
                </span>
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
