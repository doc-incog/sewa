"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

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

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data } = await api.get("/admin/dashboard");
      setData(data.data);
    } catch (error) {
      console.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="grid grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white p-6 rounded-xl animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const statCards = [
    { label: "Total Users", value: data.stats.totalUsers, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Providers", value: data.stats.totalProviders, color: "text-green-600", bg: "bg-green-50" },
    { label: "Total Bookings", value: data.stats.totalBookings, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Active Services", value: data.stats.totalServices, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Payments", value: data.stats.totalPayments, color: "text-teal-600", bg: "bg-teal-50" },
    { label: "Revenue", value: `Rs. ${data.stats.totalRevenue.toLocaleString()}`, color: "text-primary-600", bg: "bg-primary-50" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className={`p-6 rounded-xl ${card.bg} border border-gray-100`}>
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className={`text-3xl font-bold mt-1 ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Bookings by Status</h2>
        <div className="grid grid-cols-5 gap-4">
          {["pending", "confirmed", "in_progress", "completed", "cancelled"].map((status) => (
            <div key={status} className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{data.bookingsByStatus[status] || 0}</p>
              <p className="text-sm text-gray-500 capitalize">{status.replace("_", " ")}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h2>
        {data.recentBookings.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No bookings yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.recentBookings.map((booking) => {
                  const user = typeof booking.userId === "object" ? booking.userId : null;
                  const service = typeof booking.serviceId === "object" ? booking.serviceId : null;
                  return (
                    <tr key={booking._id}>
                      <td className="px-4 py-3 text-sm text-gray-900">{user?.name || "N/A"}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{service?.name || "N/A"}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{new Date(booking.date).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">Rs. {booking.amount}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          booking.status === "completed" ? "bg-green-100 text-green-700" :
                          booking.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                          booking.status === "cancelled" ? "bg-red-100 text-red-700" :
                          "bg-blue-100 text-blue-700"
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
