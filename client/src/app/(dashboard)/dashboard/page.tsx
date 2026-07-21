"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { StatsSkeleton } from "@/components/ui/Skeleton";
import {
  LayoutDashboard,
  CalendarCheck,
  CreditCard,
  ArrowUpRight,
  Search,
  Clock,
  CheckCircle2,
  TrendingUp,
  Wallet,
} from "lucide-react";

interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  totalSpent: number;
  totalEarnings?: number;
}

export default function DashboardPage() {
  const { user, isLoading } = useAuth(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      try {
        const endpoint = user.role === "provider" ? "/bookings/provider" : "/bookings/my";
        const { data } = await api.get(endpoint);
        const bookings = data.data.bookings || [];
        const s: DashboardStats = {
          totalBookings: bookings.length,
          pendingBookings: bookings.filter((b: any) => b.status === "pending").length,
          completedBookings: bookings.filter((b: any) => b.status === "completed").length,
          totalSpent: bookings
            .filter((b: any) => b.status === "completed")
            .reduce((sum: number, b: any) => sum + (b.amount || 0), 0),
        };
        if (user.role === "provider") {
          const { data: pData } = await api.get("/payments/provider");
          s.totalEarnings = pData.data.totalEarnings || 0;
        }
        setStats(s);
      } catch {
        console.error("Failed to load dashboard stats");
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-warmgray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })();

  const statCards = user?.role === "provider"
    ? [
        {
          label: "Total Bookings",
          value: stats?.totalBookings ?? 0,
          icon: CalendarCheck,
          bg: "bg-primary-50",
          iconColor: "text-primary-600",
          href: "/bookings",
        },
        {
          label: "Pending",
          value: stats?.pendingBookings ?? 0,
          icon: Clock,
          bg: "bg-accent-50",
          iconColor: "text-accent-600",
          href: "/bookings",
        },
        {
          label: "Completed",
          value: stats?.completedBookings ?? 0,
          icon: CheckCircle2,
          bg: "bg-secondary-50",
          iconColor: "text-secondary-600",
          href: "/bookings",
        },
        {
          label: "Total Earnings",
          value: `Rs. ${stats?.totalEarnings ?? 0}`,
          icon: Wallet,
          bg: "bg-primary-50",
          iconColor: "text-primary-600",
          href: "/payments",
        },
      ]
    : [
        {
          label: "My Bookings",
          value: stats?.totalBookings ?? 0,
          icon: CalendarCheck,
          bg: "bg-primary-50",
          iconColor: "text-primary-600",
          href: "/bookings",
        },
        {
          label: "Pending",
          value: stats?.pendingBookings ?? 0,
          icon: Clock,
          bg: "bg-accent-50",
          iconColor: "text-accent-600",
          href: "/bookings",
        },
        {
          label: "Completed",
          value: stats?.completedBookings ?? 0,
          icon: CheckCircle2,
          bg: "bg-secondary-50",
          iconColor: "text-secondary-600",
          href: "/bookings",
        },
        {
          label: "Total Spent",
          value: `Rs. ${stats?.totalSpent ?? 0}`,
          icon: CreditCard,
          bg: "bg-warmgray-100",
          iconColor: "text-warmgray-700",
          href: "/payments",
        },
      ];

  const quickActions = user?.role === "provider"
    ? [
        { label: "Browse Services", href: "/services", icon: Search, description: "Explore available services" },
        { label: "View Earnings", href: "/payments", icon: TrendingUp, description: "Track your income" },
      ]
    : [
        { label: "Browse Services", href: "/services", icon: Search, description: "Find home services" },
        { label: "Payment History", href: "/payments", icon: CreditCard, description: "View past payments" },
      ];

  return (
    <div className="min-h-screen bg-warmgray-50">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <p className="text-warmgray-500 text-sm font-medium mb-1">{greeting}</p>
          <h1 className="text-3xl font-bold text-warmgray-900">
            Welcome back, {user?.name?.split(" ")[0]}
          </h1>
          <p className="text-warmgray-500 mt-1">
            {user?.role === "provider"
              ? "Manage your services and track your earnings"
              : "Find and book trusted home services"}
          </p>
        </div>

        {statsLoading ? (
          <StatsSkeleton />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {statCards.map((card) => (
              <Link
                key={card.label}
                href={card.href}
                className="bg-white rounded-2xl shadow-card border border-warmgray-100 p-5 hover:shadow-card-hover transition-shadow group"
              >
                <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
                  <card.icon className={`w-5 h-5 ${card.iconColor}`} />
                </div>
                <p className="text-xs font-medium text-warmgray-500 uppercase tracking-wide">{card.label}</p>
                <p className="text-2xl font-bold text-warmgray-900 mt-1">{card.value}</p>
                <span className="inline-flex items-center text-xs font-medium text-primary-600 mt-2 group-hover:gap-1 transition-all">
                  View <ArrowUpRight className="w-3 h-3 ml-0.5" />
                </span>
              </Link>
            ))}
          </div>
        )}

        <div>
          <h2 className="text-lg font-semibold text-warmgray-900 mb-4">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="bg-white rounded-2xl shadow-card border border-warmgray-100 p-5 flex items-center gap-4 hover:shadow-card-hover transition-shadow group"
              >
                <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center shrink-0 group-hover:bg-primary-100 transition-colors">
                  <action.icon className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-warmgray-900">{action.label}</p>
                  <p className="text-sm text-warmgray-500">{action.description}</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-warmgray-400 group-hover:text-primary-600 transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
