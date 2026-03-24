import Sidebar from "./Sidebar";
import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  links: { href: string; label: string; icon: ReactNode }[];
  title: string;
}

export default function DashboardLayout({ children, links, title }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar links={links} title={title} />
      <main className="flex-1 p-6 lg:p-8 mesh-gradient">{children}</main>
    </div>
  );
}
