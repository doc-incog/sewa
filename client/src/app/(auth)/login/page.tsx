"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import { Home, Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left branded panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800 overflow-hidden">
        {/* SVG pattern overlay */}
        <div className="absolute inset-0 opacity-[0.07]">
          <svg className="w-full h-full" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="login-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="2" fill="white" />
                <path d="M0 20h40M20 0v40" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="400" height="400" fill="url(#login-pattern)" />
          </svg>
        </div>

        {/* Decorative blobs */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-32 -right-16 w-48 h-48 bg-accent-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-primary-300/20 rounded-full blur-2xl" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/" className="flex items-center gap-2.5 w-fit">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">sewa</span>
          </Link>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-white leading-tight tracking-tight">
              Welcome back to<br />Sewa
            </h1>
            <p className="text-lg text-white/80 max-w-md leading-relaxed">
              Access your account and manage your services across Nepal. Trusted by thousands of households and professionals.
            </p>
          </div>

          <div className="flex items-center gap-3 text-sm text-white/60">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <Home className="w-4 h-4" />
            </div>
            <span>Nepal&apos;s trusted service marketplace</span>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-warmgray-50 p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 lg:hidden">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
              <Home className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-xl font-bold text-primary-700 tracking-tight">sewa</span>
          </Link>

          <div>
            <h2 className="text-2xl font-bold text-warmgray-900 tracking-tight">
              Sign in
            </h2>
            <p className="mt-2 text-sm text-warmgray-500">
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-warmgray-700 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-warmgray-400" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-warmgray-50 border border-warmgray-200 rounded-xl text-sm text-warmgray-900 placeholder-warmgray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-warmgray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-warmgray-400" />
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-warmgray-50 border border-warmgray-200 rounded-xl text-sm text-warmgray-900 placeholder-warmgray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                    placeholder="Enter your password"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors shadow-warm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-warmgray-500">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="font-medium text-primary-600 hover:text-primary-700 transition-colors">
                  Create one
                </Link>
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-warmgray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-warmgray-50 px-3 text-warmgray-400 font-medium">or</span>
              </div>
            </div>

            <Link
              href="/provider-login"
              className="w-full py-2.5 bg-warmgray-100 text-warmgray-700 rounded-xl text-sm font-medium hover:bg-warmgray-200 transition-colors border border-warmgray-200 flex items-center justify-center gap-2"
            >
              Sign in as a service provider
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
