"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { IconChart, IconUsers, IconArticle, IconTag, IconSettings } from "@/components/ui/Icons";

const adminLinks = [
  { href: "/admin", label: "Overview", icon: <IconChart /> },
  { href: "/admin/users", label: "Users", icon: <IconUsers /> },
  { href: "/admin/content", label: "Content", icon: <IconArticle /> },
  { href: "/admin/categories", label: "Categories", icon: <IconTag /> },
  { href: "/admin/settings", label: "Settings", icon: <IconSettings /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout links={adminLinks} title="Admin Panel">
      {children}
    </DashboardLayout>
  );
}
