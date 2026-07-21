"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Home,
  Search,
  LayoutDashboard,
  CalendarCheck,
  CreditCard,
  MessageCircle,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import NotificationBell from "./NotificationBell";
import Avatar from "./ui/Avatar";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
    setMobileOpen(false);
  };

  const navLinks = [
    { href: "/services", label: "Services", icon: Home },
    { href: "/search", label: "Find Providers", icon: Search },
  ];

  const authLinks = [
    { href: user?.role === "provider" ? "/provider" : "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/bookings", label: "Bookings", icon: CalendarCheck },
    { href: "/payments", label: "Payments", icon: CreditCard },
    { href: "/chat", label: "Messages", icon: MessageCircle },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-warmgray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shadow-warm group-hover:shadow-warm-lg transition-shadow">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-warmgray-900 tracking-tight">
              sewa
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-warmgray-600 hover:text-warmgray-900 hover:bg-warmgray-100 rounded-lg transition-colors"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                {authLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-warmgray-600 hover:text-warmgray-900 hover:bg-warmgray-100 rounded-lg transition-colors"
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                ))}

                <div className="w-px h-6 bg-warmgray-200 mx-1" />

                <NotificationBell />

                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-warmgray-100 transition-colors"
                  >
                    <Avatar name={user?.name || "U"} size="sm" />
                    <span className="text-sm font-medium text-warmgray-700 max-w-[100px] truncate hidden lg:block">
                      {user?.name}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-warmgray-400" />
                  </button>

                  {profileOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-warm-lg border border-warmgray-100 py-1.5 z-50 animate-slide-down">
                        <div className="px-3 py-2 border-b border-warmgray-100 mb-1">
                          <p className="text-sm font-medium text-warmgray-900 truncate">{user?.name}</p>
                          <p className="text-xs text-warmgray-500 truncate">{user?.email}</p>
                        </div>
                        <Link
                          href={user?.role === "provider" ? "/provider" : "/dashboard"}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-warmgray-700 hover:bg-warmgray-50 transition-colors"
                          onClick={() => setProfileOpen(false)}
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 ml-1">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-warmgray-700 hover:text-warmgray-900 hover:bg-warmgray-100 rounded-lg transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-colors shadow-warm"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-warmgray-600 hover:bg-warmgray-100 rounded-lg transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-warmgray-100 bg-white animate-slide-down">
          <div className="px-4 py-3 space-y-1">
            {[...navLinks, ...(isAuthenticated ? authLinks : [])].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-warmgray-600 hover:text-warmgray-900 hover:bg-warmgray-50 rounded-lg transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}

            <div className="border-t border-warmgray-100 pt-2 mt-2">
              {isAuthenticated ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 px-3 py-2">
                    <Avatar name={user?.name || "U"} size="sm" />
                    <div>
                      <p className="text-sm font-medium text-warmgray-900">{user?.name}</p>
                      <p className="text-xs text-warmgray-500">{user?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link
                    href="/login"
                    className="flex-1 text-center px-4 py-2.5 text-sm font-medium text-warmgray-700 bg-warmgray-100 rounded-xl hover:bg-warmgray-200 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/signup"
                    className="flex-1 text-center px-4 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
