"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import { Service, Provider } from "@shared/types";
import Avatar from "@/components/ui/Avatar";
import StarRating from "@/components/ui/StarRating";
import EmptyState from "@/components/ui/EmptyState";
import { CardSkeleton } from "@/components/ui/Skeleton";
import {
  ArrowLeft,
  Zap,
  Wrench,
  Hammer,
  Paintbrush,
  Snowflake,
  SprayCan,
  Bug,
  TreePine,
  Home,
  Lock,
  BrickWall,
  Lamp,
  Clock,
  BadgeCheck,
  ArrowRight,
  IndianRupee,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const categoryIconMap: Record<string, LucideIcon> = {
  Electrical: Zap,
  Plumbing: Wrench,
  Woodwork: Hammer,
  Painting: Paintbrush,
  Appliance: Snowflake,
  Cleaning: SprayCan,
  "Pest Control": Bug,
  Garden: TreePine,
  Roofing: Home,
  Security: Lock,
  Construction: BrickWall,
  Design: Lamp,
};

function getCategoryIcon(category: string): LucideIcon {
  return categoryIconMap[category] || Wrench;
}

function ServiceDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [service, setService] = useState<Service | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchData(id);
    } else {
      setLoading(false);
    }
  }, [id]);

  const fetchData = async (serviceId: string) => {
    try {
      const [serviceRes, providersRes] = await Promise.all([
        api.get(`/services/${serviceId}`),
        api.get(`/providers?service=${serviceId}`),
      ]);
      setService(serviceRes.data.data.service);
      setProviders(providersRes.data.data.providers);
    } catch (error) {
      console.error("Failed to load service details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-warmgray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-6 bg-warmgray-200 rounded w-32" />
            <div className="bg-white rounded-2xl p-8 shadow-card">
              <div className="flex items-start gap-5">
                <div className="w-16 h-16 rounded-2xl shimmer-bg" />
                <div className="flex-1 space-y-3">
                  <div className="h-7 bg-warmgray-200 rounded w-1/3" />
                  <div className="h-4 bg-warmgray-200 rounded w-1/4" />
                  <div className="h-4 bg-warmgray-200 rounded w-2/3" />
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }, (_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-warmgray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <EmptyState
            title="Service not found"
            description="The service you are looking for does not exist or has been removed."
            action={{ label: "Browse services", href: "/services" }}
          />
        </div>
      </div>
    );
  }

  const Icon = getCategoryIcon(service.category);

  return (
    <div className="min-h-screen bg-warmgray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 text-sm text-warmgray-500 hover:text-primary-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Services
        </Link>

        <div className="bg-white rounded-2xl shadow-card border border-warmgray-100 p-8 mb-8">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center shrink-0">
              <Icon className="w-8 h-8 text-primary-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-warmgray-900">
                {service.name}
              </h1>
              <p className="text-warmgray-500 mt-1">{service.category}</p>
              <p className="text-warmgray-600 mt-4 max-w-2xl leading-relaxed">
                {service.description}
              </p>
              <div className="flex items-center gap-6 mt-6">
                <div className="flex items-center gap-1.5">
                  <IndianRupee className="w-5 h-5 text-primary-500" />
                  <span className="text-2xl font-bold text-primary-600">
                    {service.basePrice}
                  </span>
                  <span className="text-sm text-warmgray-400 ml-0.5">
                    base price
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-warmgray-500">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">
                    ~{service.duration} minutes
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-2xl font-bold text-warmgray-900">
            Available Providers
          </h2>
          <span className="px-2.5 py-1 bg-warmgray-100 text-warmgray-600 rounded-lg text-sm font-medium">
            {providers.length}
          </span>
        </div>

        {providers.length === 0 ? (
          <EmptyState
            title="No providers available"
            description="No providers are currently offering this service. Check back later."
            action={{ label: "Browse all services", href: "/services" }}
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((provider) => {
              const user =
                typeof provider.userId === "object" ? provider.userId : null;
              return (
                <div
                  key={provider._id}
                  className="bg-white rounded-2xl shadow-card border border-warmgray-100 p-6 hover:shadow-card-hover transition-all duration-200 flex flex-col"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <Avatar name={user?.name || "Provider"} size="lg" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-semibold text-warmgray-900 truncate">
                          {provider.businessName}
                        </h3>
                        {provider.verified && (
                          <BadgeCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-warmgray-500 truncate">
                        {user?.name}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-warmgray-500 mb-4 line-clamp-2">
                    {provider.description ||
                      "Professional service provider"}
                  </p>

                  <div className="flex items-center gap-3 mb-4">
                    {provider.avgRating > 0 ? (
                      <div className="flex items-center gap-1.5">
                        <StarRating rating={provider.avgRating} size="sm" />
                        <span className="text-sm font-semibold text-warmgray-900">
                          {provider.avgRating.toFixed(1)}
                        </span>
                        {provider.totalReviews > 0 && (
                          <span className="text-xs text-warmgray-400">
                            ({provider.totalReviews})
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-warmgray-400">
                        New provider
                      </span>
                    )}
                    <span className="text-xs text-warmgray-400">
                      {provider.totalJobs} jobs
                    </span>
                  </div>

                  <div className="mt-auto pt-4 border-t border-warmgray-100">
                    <Link
                      href={`/providers?id=${provider._id}&serviceId=${service._id}`}
                      className="flex items-center justify-center gap-1.5 w-full px-4 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors shadow-warm"
                    >
                      View & Book
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default function ServiceDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-warmgray-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            <span className="text-sm text-warmgray-500">Loading service...</span>
          </div>
        </div>
      }
    >
      <ServiceDetailContent />
    </Suspense>
  );
}
