"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { IconHome, IconLibrary, IconReceipt, IconSettings } from "@/components/ui/Icons";

const dashboardLinks = [
  { href: "/dashboard", label: "Overview", icon: <IconHome /> },
  { href: "/dashboard/library", label: "My Library", icon: <IconLibrary /> },
  { href: "/dashboard/purchases", label: "Purchases", icon: <IconReceipt /> },
  { href: "/dashboard/settings", label: "Settings", icon: <IconSettings /> },
];

export default function DashboardLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout links={dashboardLinks} title="Dashboard">
      {children}
    </DashboardLayout>
  );
}
