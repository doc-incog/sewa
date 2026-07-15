"use client";

import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function DashboardPage() {
  const { user, isLoading } = useAuth(true);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}</h1>
          <p className="text-gray-500 mt-1">
            {user?.role === "provider" ? "Manage your services and bookings" : "Find and book home services"}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">My Bookings</h3>
            <p className="text-gray-500 text-sm">View and manage your bookings</p>
            <div className="mt-4 text-2xl font-bold text-primary-600">0</div>
          </div>

          {user?.role === "provider" && (
            <>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-2">Pending Requests</h3>
                <p className="text-gray-500 text-sm">New booking requests</p>
                <div className="mt-4 text-2xl font-bold text-orange-500">0</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-2">Earnings</h3>
                <p className="text-gray-500 text-sm">Total earnings this month</p>
                <div className="mt-4 text-2xl font-bold text-green-600">Rs. 0</div>
              </div>
            </>
          )}
        </div>

        <div className="mt-8">
          <Link
            href="/"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            &larr; Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
