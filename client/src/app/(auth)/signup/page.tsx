"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import { Home, Mail, Lock, User, Phone, ArrowRight } from "lucide-react";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const { signup } = useAuthStore();
  const router = useRouter();

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(formData);
      toast.success("Account created successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left branded panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary-400 via-primary-600 to-warmgray-900 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]">
          <svg className="w-full h-full" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="signup-pattern" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                <rect x="4" y="4" width="8" height="8" rx="2" fill="white" opacity="0.5" />
                <rect x="20" y="20" width="6" height="6" rx="1" fill="white" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="400" height="400" fill="url(#signup-pattern)" />
          </svg>
        </div>

        <div className="absolute -top-16 -left-16 w-56 h-56 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-24 -right-12 w-40 h-40 bg-accent-400/15 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/" className="flex items-center gap-2.5 w-fit">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">sewa</span>
          </Link>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-white leading-tight tracking-tight">
              Join the<br />Sewa community
            </h1>
            <p className="text-lg text-white/80 max-w-md leading-relaxed">
              Create your account to find trusted home services, track bookings, and connect with verified professionals in Nepal.
            </p>
          </div>

          <div className="space-y-3">
            {["Trusted by 10,000+ households", "Verified service providers", "Secure & easy payments"].map(
              (item) => (
                <div key={item} className="flex items-center gap-2.5 text-sm text-white/70">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-400" />
                  {item}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-warmgray-50 p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <Link href="/" className="flex items-center gap-2 lg:hidden">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
              <Home className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-xl font-bold text-primary-700 tracking-tight">sewa</span>
          </Link>

          <div>
            <h2 className="text-2xl font-bold text-warmgray-900 tracking-tight">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-warmgray-500">
              Get started with Sewa in just a few steps
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-warmgray-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-warmgray-400" />
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-warmgray-50 border border-warmgray-200 rounded-xl text-sm text-warmgray-900 placeholder-warmgray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                    placeholder="Ram Sharma"
                  />
                </div>
              </div>
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
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-warmgray-50 border border-warmgray-200 rounded-xl text-sm text-warmgray-900 placeholder-warmgray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-warmgray-700 mb-1.5">
                  Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-warmgray-400" />
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-warmgray-50 border border-warmgray-200 rounded-xl text-sm text-warmgray-900 placeholder-warmgray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                    placeholder="+977 9800000000"
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
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-warmgray-50 border border-warmgray-200 rounded-xl text-sm text-warmgray-900 placeholder-warmgray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                    placeholder="Create a strong password"
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
                  Create account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-warmgray-500">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-primary-600 hover:text-primary-700 transition-colors">
                  Sign in
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
              href="/provider-signup"
              className="w-full py-2.5 bg-warmgray-100 text-warmgray-700 rounded-xl text-sm font-medium hover:bg-warmgray-200 transition-colors border border-warmgray-200 flex items-center justify-center gap-2"
            >
              Register as a service provider
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
