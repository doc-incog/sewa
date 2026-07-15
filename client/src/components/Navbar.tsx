"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            Sewa
          </Link>

          <div className="flex items-center space-x-4">
            <Link href="/services" className="text-gray-600 hover:text-primary-600 text-sm font-medium">
              Services
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  href={user?.role === "provider" ? "/provider" : "/dashboard"}
                  className="text-gray-600 hover:text-primary-600 text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/bookings"
                  className="text-gray-600 hover:text-primary-600 text-sm font-medium"
                >
                  Bookings
                </Link>
                <span className="text-sm text-gray-500">{user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
