"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Booking } from "@shared/types";
import Navbar from "@/components/Navbar";
import Badge from "@/components/ui/Badge";
import { StatsSkeleton } from "@/components/ui/Skeleton";
import {
  CalendarCheck,
  Star,
  MessageSquare,
  Banknote,
  ArrowRight,
  Check,
  X,
} from "lucide-react";

interface ProviderStats {
  pending: number;
  confirmed: number;
  completed: number;
  totalEarnings: number;
  avgRating: number;
  totalReviews: number;
}

export default function ProviderDashboard() {
  const { user, isLoading: authLoading } = useAuth(true);
  const [stats, setStats] = useState<ProviderStats>({
    pending: 0,
    confirmed: 0,
    completed: 0,
    totalEarnings: 0,
    avgRating: 0,
    totalReviews: 0,
  });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === "provider") {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const { data } = await api.get("/providers/me");
      const providerData = data.data;
      const bookings: Booking[] = providerData.recentBookings || [];

      setStats({
        pending: providerData.pendingBookings || 0,
        confirmed: providerData.activeBookings || 0,
        completed: providerData.completedBookings || 0,
        totalEarnings: providerData.totalEarnings || 0,
        avgRating: providerData.avgRating || 0,
        totalReviews: providerData.totalReviews || 0,
      });
      setRecentBookings(bookings.slice(0, 5));
    } catch {
      try {
        const { data } = await api.get("/bookings/provider");
        const bookings: Booking[] = data.data.bookings;
        const pending = bookings.filter((b) => b.status === "pending").length;
        const confirmed = bookings.filter((b) => b.status === "confirmed" || b.status === "in_progress").length;
        const completed = bookings.filter((b) => b.status === "completed").length;
        const totalEarnings = bookings.filter((b) => b.status === "completed").reduce((s, b) => s + b.amount, 0);
        setStats({ pending, confirmed, completed, totalEarnings, avgRating: 0, totalReviews: 0 });
        setRecentBookings(bookings.slice(0, 5));
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (bookingId: string) => {
    try {
      await api.put(`/bookings/${bookingId}/accept`);
      fetchDashboardData();
    } catch {
      // silently fail
    }
  };

  const handleDecline = async (bookingId: string) => {
    try {
      await api.put(`/bookings/${bookingId}/cancel`);
      fetchDashboardData();
    } catch {
      // silently fail
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-warmgray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <StatsSkeleton />
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "Pending Jobs", value: stats.pending, icon: CalendarCheck, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Rating", value: stats.avgRating > 0 ? stats.avgRating.toFixed(1) : "N/A", icon: Star, color: "text-accent-600", bg: "bg-amber-50" },
    { label: "Reviews", value: stats.totalReviews, icon: MessageSquare, color: "text-secondary-600", bg: "bg-secondary-50" },
    { label: "Earnings", value: `Rs. ${stats.totalEarnings.toLocaleString()}`, icon: Banknote, color: "text-primary-700", bg: "bg-primary-50" },
  ];

  return (
    <div className="min-h-screen bg-warmgray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-warmgray-900">Provider Dashboard</h1>
          <p className="text-sm text-warmgray-500 mt-1">Manage your services and bookings</p>
        </div>

        {loading ? (
          <StatsSkeleton />
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {statCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.label} className="bg-white rounded-2xl p-5 shadow-sm border border-warmgray-100 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${card.color}`} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-warmgray-500 uppercase">{card.label}</p>
                      <p className="text-2xl font-bold text-warmgray-900 mt-0.5">{card.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-warmgray-100 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-warmgray-100">
                <h2 className="text-sm font-semibold text-warmgray-900 uppercase tracking-wide">Recent Requests</h2>
                <Link href="/bookings" className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors">
                  View all
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {recentBookings.length === 0 ? (
                <p className="text-warmgray-400 text-center py-10 text-sm">No bookings yet</p>
              ) : (
                <div className="divide-y divide-warmgray-100">
                  {recentBookings.map((booking) => {
                    const bookedUser = typeof booking.userId === "object" ? booking.userId : null;
                    const service = typeof booking.serviceId === "object" ? booking.serviceId : null;

                    return (
                      <div key={booking._id} className="flex items-center justify-between px-5 py-4 hover:bg-warmgray-50/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                            <CalendarCheck className="w-5 h-5 text-primary-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-warmgray-900">{service?.name || "Service"}</p>
                            <p className="text-xs text-warmgray-500 mt-0.5">
                              {bookedUser?.name} &bull; {new Date(booking.date).toLocaleDateString()} at {booking.timeSlot}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-warmgray-900">Rs. {booking.amount}</span>
                          <Badge status={booking.status} />
                          {booking.status === "pending" && (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleAccept(booking._id)}
                                className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                                title="Accept"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDecline(booking._id)}
                                className="p-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors"
                                title="Decline"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
