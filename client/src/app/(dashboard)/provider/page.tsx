"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { Booking } from "@shared/types";

export default function ProviderDashboard() {
  const { user } = useAuth(true);
  const [stats, setStats] = useState({
    pending: 0,
    confirmed: 0,
    completed: 0,
    totalEarnings: 0,
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
      const { data } = await api.get("/bookings/provider");
      const bookings: Booking[] = data.data.bookings;

      const pending = bookings.filter((b) => b.status === "pending").length;
      const confirmed = bookings.filter((b) => b.status === "confirmed" || b.status === "in_progress").length;
      const completed = bookings.filter((b) => b.status === "completed").length;
      const totalEarnings = bookings
        .filter((b) => b.status === "completed")
        .reduce((sum, b) => sum + b.amount, 0);

      setStats({ pending, confirmed, completed, totalEarnings });
      setRecentBookings(bookings.slice(0, 5));
    } catch (error) {
      console.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Provider Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your services and bookings</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-3xl font-bold text-yellow-500 mt-1">{stats.pending}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Active</p>
            <p className="text-3xl font-bold text-blue-500 mt-1">{stats.confirmed}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-3xl font-bold text-green-500 mt-1">{stats.completed}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Earnings</p>
            <p className="text-3xl font-bold text-primary-600 mt-1">Rs. {stats.totalEarnings}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Requests</h2>
            <Link href="/bookings" className="text-primary-600 text-sm hover:text-primary-700">View all &rarr;</Link>
          </div>

          {recentBookings.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No bookings yet</p>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((booking) => {
                const bookedUser = typeof booking.userId === "object" ? booking.userId : null;
                const service = typeof booking.serviceId === "object" ? booking.serviceId : null;

                return (
                  <div key={booking._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{service?.name || "Service"}</p>
                      <p className="text-sm text-gray-500">
                        {bookedUser?.name} &bull; {new Date(booking.date).toLocaleDateString()} at {booking.timeSlot}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-primary-600">Rs. {booking.amount}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        booking.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                        booking.status === "confirmed" ? "bg-blue-100 text-blue-700" :
                        "bg-green-100 text-green-700"
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
