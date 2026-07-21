"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  Home,
  LayoutDashboard,
  Users,
  Wrench,
  Briefcase,
  CalendarCheck,
  ArrowLeft,
} from "lucide-react";

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/providers", label: "Providers", icon: Wrench },
  { href: "/admin/services", label: "Services", icon: Briefcase },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth(true, "admin");
  const pathname = usePathname();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warmgray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-warmgray-200 border-t-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warmgray-50 flex">
      <aside className="w-64 bg-white border-r border-warmgray-100 flex flex-col shrink-0">
        <div className="p-5 border-b border-warmgray-100">
          <Link href="/admin" className="flex items-center gap-2.5 text-lg font-bold text-primary-700">
            <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span>sewa admin</span>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {sidebarLinks.map((link) => {
            const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href) && pathname !== "/admin";
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary-50 text-primary-700"
                    : "text-warmgray-600 hover:bg-warmgray-50"
                }`}
              >
                <Icon className="w-[18px] h-[18px]" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-warmgray-100">
          <Link
            href="/"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium text-warmgray-500 hover:bg-warmgray-50 transition-colors"
          >
            <ArrowLeft className="w-[18px] h-[18px]" />
            Back to site
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
