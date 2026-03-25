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
    <aside className="w-64 bg-[#faf8ff]/80 backdrop-blur-sm border-r border-[#e2e8fc]/40 min-h-[calc(100vh-3.5rem)] hidden lg:flex flex-col font-['Plus_Jakarta_Sans']">
      <div className="p-6 flex-1">
        <div className="mb-6">
          <h2 className="text-base font-bold text-[#151b29] tracking-tight">{title}</h2>
          <p className="text-[10px] text-[#797586] mt-0.5 uppercase tracking-[0.1em] font-bold">Platform Controller</p>
        </div>

        <nav className="space-y-0.5">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                  isActive
                    ? "bg-[#451ebb] text-white shadow-[0_4px_14px_0_rgba(69,30,187,0.35)]"
                    : "text-[#484554] hover:bg-[#f1f3ff] hover:text-[#151b29]"
                }`}
              >
                <span className={`w-5 h-5 flex-shrink-0 transition-colors flex items-center justify-center ${isActive ? "text-white" : "text-[#797586] group-hover:text-[#484554]"}`}>
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

      <div className="p-6 pt-0">
        <div className="h-px bg-gradient-to-r from-transparent via-[#c9c4d7]/30 to-transparent mb-4" />
        <div className="px-3 py-2">
          <p className="text-[10px] font-bold text-[#797586] uppercase tracking-[0.1em]">The Digital Atelier</p>
          <p className="text-[10px] text-[#c9c4d7] mt-0.5">v1.0</p>
        </div>
      </div>
    </aside>
  );
}
