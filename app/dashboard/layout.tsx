"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { IconHome, IconLibrary, IconReceipt, IconSettings, IconTrending, IconUser } from "@/components/ui/Icons";

const HeartIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

const BellIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
  </svg>
);

const dashboardLinks = [
  { href: "/dashboard", label: "Overview", icon: <IconHome /> },
  { href: "/dashboard/feed", label: "Feed", icon: <IconTrending /> },
  { href: "/dashboard/library", label: "My Library", icon: <IconLibrary /> },
  { href: "/dashboard/wishlist", label: "Wishlist", icon: <HeartIcon /> },
  { href: "/dashboard/purchases", label: "Purchases", icon: <IconReceipt /> },
  { href: "/dashboard/notifications", label: "Notifications", icon: <BellIcon /> },
  { href: "/dashboard/settings", label: "Settings", icon: <IconSettings /> },
];

export default function DashboardLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout links={dashboardLinks} title="Dashboard">
      {children}
    </DashboardLayout>
  );
}
