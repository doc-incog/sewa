"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import { Home, Mail, Lock, User, Phone, Building2, ArrowRight, FileText, Wrench } from "lucide-react";

export default function ProviderSignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    businessName: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const { providerSignup } = useAuthStore();
  const router = useRouter();

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: any = {
        name: formData.name,
        phone: formData.phone,
        password: formData.password,
        businessName: formData.businessName,
      };
      if (formData.email) payload.email = formData.email;
      if (formData.description) payload.description = formData.description;
      await providerSignup(payload);
      toast.success("Provider account created!");
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Provider signup error:", error);
      toast.error(error.response?.data?.message || error.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left branded panel — secondary (green) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-secondary-400 via-secondary-600 to-secondary-900 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]">
          <svg className="w-full h-full" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="prov-signup-pattern" x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse">
                <path d="M18 2 L22 14 L34 14 L24 22 L28 34 L18 26 L8 34 L12 22 L2 14 L14 14 Z" fill="white" opacity="0.25" />
                <circle cx="18" cy="18" r="1.5" fill="white" opacity="0.4" />
              </pattern>
            </defs>
            <rect width="400" height="400" fill="url(#prov-signup-pattern)" />
          </svg>
        </div>

        <div className="absolute -top-16 left-1/4 w-52 h-52 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-10 w-36 h-36 bg-accent-300/15 rounded-full blur-3xl" />

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
              List your<br />services
            </h1>
            <p className="text-lg text-white/80 max-w-md leading-relaxed">
              Join Nepal&apos;s growing network of verified service providers. Reach thousands of customers looking for your expertise.
            </p>
          </div>

          <div className="space-y-3">
            {["Free to register", "Access local customers", "Build your reputation"].map(
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
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-warmgray-50 p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md space-y-8 animate-fade-in py-8">
          <Link href="/" className="flex items-center gap-2 lg:hidden">
            <div className="w-9 h-9 bg-secondary-600 rounded-xl flex items-center justify-center">
              <Home className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-xl font-bold text-secondary-700 tracking-tight">sewa</span>
          </Link>

          <div>
            <h2 className="text-2xl font-bold text-warmgray-900 tracking-tight">
              Register as a provider
            </h2>
            <p className="mt-2 text-sm text-warmgray-500">
              Fill in your details to start offering services
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-warmgray-700 mb-1.5">
                  Your Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-warmgray-400" />
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-warmgray-50 border border-warmgray-200 rounded-xl text-sm text-warmgray-900 placeholder-warmgray-400 focus:outline-none focus:ring-2 focus:ring-secondary-500/20 focus:border-secondary-500 transition-colors"
                    placeholder="Ram Sharma"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-warmgray-700 mb-1.5">
                  Phone number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-warmgray-400" />
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-warmgray-50 border border-warmgray-200 rounded-xl text-sm text-warmgray-900 placeholder-warmgray-400 focus:outline-none focus:ring-2 focus:ring-secondary-500/20 focus:border-secondary-500 transition-colors"
                    placeholder="+977 9800000000"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-warmgray-700 mb-1.5">
                  Email <span className="text-warmgray-400 text-xs font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-warmgray-400" />
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-warmgray-50 border border-warmgray-200 rounded-xl text-sm text-warmgray-900 placeholder-warmgray-400 focus:outline-none focus:ring-2 focus:ring-secondary-500/20 focus:border-secondary-500 transition-colors"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-warmgray-700 mb-1.5">
                  Business Name
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-warmgray-400" />
                  <input
                    id="businessName"
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => handleChange("businessName", e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-warmgray-50 border border-warmgray-200 rounded-xl text-sm text-warmgray-900 placeholder-warmgray-400 focus:outline-none focus:ring-2 focus:ring-secondary-500/20 focus:border-secondary-500 transition-colors"
                    placeholder="Sharma Electricals"
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
                    className="w-full pl-10 pr-4 py-2.5 bg-warmgray-50 border border-warmgray-200 rounded-xl text-sm text-warmgray-900 placeholder-warmgray-400 focus:outline-none focus:ring-2 focus:ring-secondary-500/20 focus:border-secondary-500 transition-colors"
                    placeholder="Create a strong password"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-warmgray-700 mb-1.5">
                  About Your Business
                </label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3 w-4 h-4 text-warmgray-400" />
                  <textarea
                    id="description"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-warmgray-50 border border-warmgray-200 rounded-xl text-sm text-warmgray-900 placeholder-warmgray-400 focus:outline-none focus:ring-2 focus:ring-secondary-500/20 focus:border-secondary-500 transition-colors resize-none"
                    placeholder="Describe your services and experience..."
                  />
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
                  Register as provider
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-warmgray-500">
                Already a provider?{" "}
                <Link href="/provider-login" className="font-medium text-secondary-600 hover:text-secondary-700 transition-colors">
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
              href="/signup"
              className="w-full py-2.5 bg-warmgray-100 text-warmgray-700 rounded-xl text-sm font-medium hover:bg-warmgray-200 transition-colors border border-warmgray-200 flex items-center justify-center gap-2"
            >
              Sign up as a customer instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
