"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import { Home, Mail, Lock, ArrowRight, Wrench, Eye, EyeOff, Phone } from "lucide-react";

export default function ProviderLoginPage() {
  const [loginMode, setLoginMode] = useState<"email" | "phone">("email");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { providerLogin } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await providerLogin(identifier, password);
      toast.success("Welcome back, provider!");
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Provider login error:", error);
      toast.error(error.response?.data?.message || error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left branded panel — secondary (green) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-secondary-500 via-secondary-600 to-secondary-900 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07]">
          <svg className="w-full h-full" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="prov-login-pattern" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M24 4 L28 16 L40 16 L30 24 L34 36 L24 28 L14 36 L18 24 L8 16 L20 16 Z" fill="white" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="400" height="400" fill="url(#prov-login-pattern)" />
          </svg>
        </div>

        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-28 -left-14 w-44 h-44 bg-accent-300/15 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/" className="flex items-center gap-2.5 w-fit">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">sewa</span>
          </Link>

          <div className="space-y-4">
            <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-2">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white leading-tight tracking-tight">
              Provider<br />Portal
            </h1>
            <p className="text-lg text-white/80 max-w-md leading-relaxed">
              Manage your services, track bookings, and grow your business through Nepal&apos;s leading service platform.
            </p>
          </div>

          <div className="space-y-3">
            {["Grow your client base", "Flexible scheduling tools", "Secure payment processing"].map(
              (item) => (
                <div key={item} className="flex items-center gap-2.5 text-sm text-white/70">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-300" />
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
            <div className="w-9 h-9 bg-secondary-600 rounded-xl flex items-center justify-center">
              <Home className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-xl font-bold text-secondary-700 tracking-tight">sewa</span>
          </Link>

          <div>
            <h2 className="text-2xl font-bold text-warmgray-900 tracking-tight">
              Provider sign in
            </h2>
            <p className="mt-2 text-sm text-warmgray-500">
              Access your provider dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              {/* Email / Phone toggle */}
              <div>
                <div className="flex bg-warmgray-100 rounded-xl p-1 mb-4">
                  <button
                    type="button"
                    onClick={() => { setLoginMode("email"); setIdentifier(""); }}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                      loginMode === "email"
                        ? "bg-white text-warmgray-900 shadow-sm"
                        : "text-warmgray-500 hover:text-warmgray-700"
                    }`}
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => { setLoginMode("phone"); setIdentifier(""); }}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                      loginMode === "phone"
                        ? "bg-white text-warmgray-900 shadow-sm"
                        : "text-warmgray-500 hover:text-warmgray-700"
                    }`}
                  >
                    <Phone className="w-4 h-4" />
                    Phone
                  </button>
                </div>

                <label htmlFor="identifier" className="block text-sm font-medium text-warmgray-700 mb-1.5">
                  {loginMode === "email" ? "Email" : "Phone number"}
                </label>
                <div className="relative">
                  {loginMode === "email" ? (
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-warmgray-400" />
                  ) : (
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-warmgray-400" />
                  )}
                  <input
                    id="identifier"
                    type={loginMode === "email" ? "email" : "tel"}
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-warmgray-50 border border-warmgray-200 rounded-xl text-sm text-warmgray-900 placeholder-warmgray-400 focus:outline-none focus:ring-2 focus:ring-secondary-500/20 focus:border-secondary-500 transition-colors"
                    placeholder={loginMode === "email" ? "you@example.com" : "+977 9800000000"}
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
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-warmgray-50 border border-warmgray-200 rounded-xl text-sm text-warmgray-900 placeholder-warmgray-400 focus:outline-none focus:ring-2 focus:ring-secondary-500/20 focus:border-secondary-500 transition-colors"
                    placeholder="Enter your password"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-warmgray-400 hover:text-warmgray-600 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-secondary-600 text-white rounded-xl text-sm font-medium hover:bg-secondary-700 transition-colors shadow-warm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign in as provider
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-warmgray-500">
                Not registered yet?{" "}
                <Link href="/provider-signup" className="font-medium text-secondary-600 hover:text-secondary-700 transition-colors">
                  Create a provider account
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
              href="/login"
              className="w-full py-2.5 bg-warmgray-100 text-warmgray-700 rounded-xl text-sm font-medium hover:bg-warmgray-200 transition-colors border border-warmgray-200 flex items-center justify-center gap-2"
            >
              Sign in as a customer instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
