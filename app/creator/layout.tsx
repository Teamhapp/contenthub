"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { IconChart, IconArticle, IconPlus, IconDollar, IconUser } from "@/components/ui/Icons";

const creatorLinks = [
  { href: "/creator", label: "Overview", icon: <IconChart /> },
  { href: "/creator/content", label: "My Content", icon: <IconArticle /> },
  { href: "/creator/content/new", label: "Create New", icon: <IconPlus /> },
  { href: "/creator/earnings", label: "Earnings", icon: <IconDollar /> },
  { href: "/creator/profile", label: "Profile", icon: <IconUser /> },
];

export default function CreatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout links={creatorLinks} title="Creator Studio">
      {children}
    </DashboardLayout>
  );
}
