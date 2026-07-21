"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Badge from "@/components/ui/Badge";
import { StatsSkeleton, TableSkeleton } from "@/components/ui/Skeleton";
import {
  Users,
  Wrench,
  CalendarCheck,
  Briefcase,
  CreditCard,
  TrendingUp,
} from "lucide-react";

interface DashboardStats {
  stats: {
    totalUsers: number;
    totalProviders: number;
    totalBookings: number;
    totalServices: number;
    totalPayments: number;
    totalRevenue: number;
  };
  bookingsByStatus: Record<string, number>;
  recentBookings: any[];
}

const statCardConfig = [
  { key: "totalUsers", label: "Users", icon: Users, color: "text-secondary-600", bg: "bg-secondary-50" },
  { key: "totalProviders", label: "Providers", icon: Wrench, color: "text-primary-600", bg: "bg-primary-50" },
  { key: "totalBookings", label: "Bookings", icon: CalendarCheck, color: "text-accent-600", bg: "bg-amber-50" },
  { key: "totalServices", label: "Services", icon: Briefcase, color: "text-secondary-700", bg: "bg-emerald-50" },
  { key: "totalPayments", label: "Payments", icon: CreditCard, color: "text-sky-600", bg: "bg-sky-50" },
  { key: "totalRevenue", label: "Revenue", icon: TrendingUp, color: "text-primary-700", bg: "bg-primary-50" },
];

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/dashboard")
      .then((res) => setData(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-warmgray-900">Dashboard</h1>
        <p className="text-sm text-warmgray-500 mt-1">Platform overview at a glance</p>
      </div>

      {loading ? (
        <StatsSkeleton />
      ) : data ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {statCardConfig.map((card) => {
              const Icon = card.icon;
              const raw = (data.stats as any)[card.key];
              const value = card.key === "totalRevenue" ? `Rs. ${Number(raw).toLocaleString()}` : raw;
              return (
                <div key={card.key} className="bg-white rounded-2xl p-5 shadow-sm border border-warmgray-100 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${card.color}`} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-warmgray-500 uppercase">{card.label}</p>
                    <p className="text-2xl font-bold text-warmgray-900 mt-0.5">{value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-warmgray-100 p-5">
            <h2 className="text-sm font-semibold text-warmgray-900 mb-4 uppercase tracking-wide">Bookings by Status</h2>
            <div className="grid grid-cols-5 gap-3">
              {["pending", "confirmed", "in_progress", "completed", "cancelled"].map((status) => (
                <div key={status} className="text-center p-3 bg-warmgray-50 rounded-xl">
                  <p className="text-xl font-bold text-warmgray-900">{data.bookingsByStatus[status] || 0}</p>
                  <p className="text-xs text-warmgray-500 capitalize mt-0.5">{status.replace("_", " ")}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-warmgray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-warmgray-100">
              <h2 className="text-sm font-semibold text-warmgray-900 uppercase tracking-wide">Recent Bookings</h2>
            </div>
            {data.recentBookings.length === 0 ? (
              <p className="text-warmgray-400 text-center py-10 text-sm">No bookings yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-warmgray-50">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-medium text-warmgray-500 uppercase">User</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-warmgray-500 uppercase">Service</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-warmgray-500 uppercase">Date</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-warmgray-500 uppercase">Amount</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-warmgray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-warmgray-100">
                    {data.recentBookings.map((booking: any) => {
                      const user = typeof booking.userId === "object" ? booking.userId : null;
                      const service = typeof booking.serviceId === "object" ? booking.serviceId : null;
                      return (
                        <tr key={booking._id} className="hover:bg-warmgray-50/50 transition-colors">
                          <td className="px-5 py-3.5 text-sm text-warmgray-900">{user?.name || "N/A"}</td>
                          <td className="px-5 py-3.5 text-sm text-warmgray-600">{service?.name || "N/A"}</td>
                          <td className="px-5 py-3.5 text-sm text-warmgray-500">{new Date(booking.date).toLocaleDateString()}</td>
                          <td className="px-5 py-3.5 text-sm font-medium text-warmgray-900">Rs. {booking.amount}</td>
                          <td className="px-5 py-3.5"><Badge status={booking.status} /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
