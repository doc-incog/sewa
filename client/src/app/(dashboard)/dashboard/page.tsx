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
          <Link href="/bookings" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-200 transition-all">
            <h3 className="font-semibold text-gray-900 mb-2">My Bookings</h3>
            <p className="text-gray-500 text-sm">View and manage your bookings</p>
            <span className="inline-block mt-4 text-primary-600 text-sm font-medium">View all &rarr;</span>
          </Link>

          <Link href="/services" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-200 transition-all">
            <h3 className="font-semibold text-gray-900 mb-2">Browse Services</h3>
            <p className="text-gray-500 text-sm">Find electricians, plumbers, and more</p>
            <span className="inline-block mt-4 text-primary-600 text-sm font-medium">Explore &rarr;</span>
          </Link>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">Account</h3>
            <p className="text-gray-500 text-sm">Manage your profile settings</p>
            <div className="mt-4">
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium capitalize">{user?.role}</span>
            </div>
          </div>
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
