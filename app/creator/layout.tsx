"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { IconChart, IconArticle, IconPlus, IconDollar, IconUser, IconTag } from "@/components/ui/Icons";

const BundleIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
  </svg>
);

const creatorLinks = [
  { href: "/creator", label: "Overview", icon: <IconChart /> },
  { href: "/creator/content", label: "My Content", icon: <IconArticle /> },
  { href: "/creator/content/new", label: "Create New", icon: <IconPlus /> },
  { href: "/creator/bundles", label: "Bundles", icon: <BundleIcon /> },
  { href: "/creator/coupons", label: "Coupons", icon: <IconTag /> },
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
