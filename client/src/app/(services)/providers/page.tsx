"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import BookingModal from "@/components/BookingModal";
import Avatar from "@/components/ui/Avatar";
import StarRating from "@/components/ui/StarRating";
import { StatsSkeleton } from "@/components/ui/Skeleton";
import {
  ArrowLeft,
  BadgeCheck,
  Briefcase,
  Star,
  MessageSquare,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Provider, Service } from "@shared/types";

function ProviderDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const serviceId = searchParams.get("serviceId");

  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    if (id) {
      fetchProvider(id);
    } else {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (provider && serviceId) {
      const svc = provider.services.find(
        (s) => (typeof s === "object" ? s._id : s) === serviceId
      );
      if (svc && typeof svc === "object") {
        setSelectedService(svc);
        setShowBooking(true);
      }
    }
  }, [provider, serviceId]);

  const fetchProvider = async (providerId: string) => {
    try {
      const { data } = await api.get(`/providers/${providerId}`);
      setProvider(data.data.provider);
    } catch (error) {
      console.error("Failed to load provider");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-warmgray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-6 bg-warmgray-200 rounded w-32" />
            <div className="bg-white rounded-2xl p-8 shadow-card">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 rounded-full shimmer-bg" />
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-warmgray-200 rounded w-1/3" />
                  <div className="h-4 bg-warmgray-200 rounded w-1/4" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-warmgray-100">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="text-center">
                    <div className="h-8 bg-warmgray-200 rounded w-16 mx-auto mb-2" />
                    <div className="h-3 bg-warmgray-200 rounded w-20 mx-auto" />
                  </div>
                ))}
              </div>
            </div>
            <StatsSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-warmgray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-warmgray-100 flex items-center justify-center mx-auto mb-5">
            <Briefcase className="w-7 h-7 text-warmgray-400" />
          </div>
          <h2 className="text-lg font-semibold text-warmgray-900 mb-1.5">
            Provider not found
          </h2>
          <p className="text-sm text-warmgray-500 mb-6">
            The provider you are looking for does not exist or has been removed.
          </p>
          <Link
            href="/services"
            className="inline-flex items-center px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors shadow-warm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Browse services
          </Link>
        </div>
      </div>
    );
  }

  const user = typeof provider.userId === "object" ? provider.userId : null;

  return (
    <div className="min-h-screen bg-warmgray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 text-sm text-warmgray-500 hover:text-primary-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Services
        </Link>

        <div className="bg-white rounded-2xl shadow-card border border-warmgray-100 p-8 mb-6">
          <div className="flex items-start gap-6">
            <Avatar name={user?.name || "Provider"} size="xl" />
            <div className="flex-1">
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-bold text-warmgray-900">
                  {provider.businessName}
                </h1>
                {provider.verified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium ring-1 ring-emerald-200">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    Verified
                  </span>
                )}
              </div>
              <p className="text-warmgray-500 mt-1">{user?.name}</p>
              {user?.phone && (
                <p className="text-sm text-warmgray-400 mt-0.5">
                  {user.phone}
                </p>
              )}
            </div>
          </div>

          {provider.description && (
            <p className="text-warmgray-600 mt-6 leading-relaxed">
              {provider.description}
            </p>
          )}

          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-warmgray-100">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-2xl font-bold text-warmgray-900">
                  {provider.avgRating > 0
                    ? provider.avgRating.toFixed(1)
                    : "N/A"}
                </span>
              </div>
              <div className="text-sm text-warmgray-500">
                Rating
                {provider.totalReviews > 0 &&
                  ` (${provider.totalReviews} reviews)`}
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Briefcase className="w-4 h-4 text-primary-500" />
                <span className="text-2xl font-bold text-warmgray-900">
                  {provider.totalJobs}
                </span>
              </div>
              <div className="text-sm text-warmgray-500">
                Jobs Completed
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <MessageSquare className="w-4 h-4 text-secondary-500" />
                <span className="text-2xl font-bold text-warmgray-900">
                  {provider.services.length}
                </span>
              </div>
              <div className="text-sm text-warmgray-500">
                Services Offered
              </div>
            </div>
          </div>
        </div>

        {provider.availability && provider.availability.length > 0 && (
          <div className="bg-white rounded-2xl shadow-card border border-warmgray-100 p-6 mb-6">
            <div className="flex items-center gap-2 mb-5">
              <Calendar className="w-5 h-5 text-primary-500" />
              <h2 className="text-lg font-semibold text-warmgray-900">
                Availability
              </h2>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map(
                (day) => {
                  const avail = provider.availability.find(
                    (a) => a.day === day
                  );
                  const isAvailable = avail?.isAvailable !== false;
                  return (
                    <div
                      key={day}
                      className={`text-center p-3 rounded-xl text-sm font-medium transition-colors ${
                        isAvailable
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                          : "bg-warmgray-50 text-warmgray-400 ring-1 ring-warmgray-100"
                      }`}
                    >
                      <div className="flex items-center justify-center mb-1">
                        {isAvailable ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-warmgray-300" />
                        )}
                      </div>
                      <div className="uppercase text-xs tracking-wide">
                        {day}
                      </div>
                      {isAvailable && avail && (
                        <div className="text-xs mt-1 text-warmgray-500">
                          {avail.startTime}-{avail.endTime}
                        </div>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-card border border-warmgray-100 p-6">
          <div className="flex items-center gap-2 mb-5">
            <Briefcase className="w-5 h-5 text-primary-500" />
            <h2 className="text-lg font-semibold text-warmgray-900">
              Services Offered
            </h2>
          </div>
          {provider.services.length === 0 ? (
            <p className="text-warmgray-500 text-sm py-4 text-center">
              No services listed yet
            </p>
          ) : (
            <div className="space-y-3">
              {provider.services.map((svc) => {
                const service = typeof svc === "object" ? svc : null;
                if (!service) return null;
                return (
                  <div
                    key={service._id}
                    className="flex items-center justify-between p-4 bg-warmgray-50 rounded-xl hover:bg-warmgray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-warmgray-900">
                          {service.name}
                        </h3>
                        <p className="text-sm text-warmgray-500">
                          {service.category} &middot; ~{service.duration} min
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-primary-600">
                        Rs. {service.basePrice}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedService(service);
                          setShowBooking(true);
                        }}
                        className="px-4 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors shadow-warm"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {showBooking && selectedService && (
        <BookingModal
          provider={provider}
          service={selectedService}
          onClose={() => {
            setShowBooking(false);
            setSelectedService(null);
          }}
        />
      )}
    </div>
  );
}

export default function ProviderDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-warmgray-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            <span className="text-sm text-warmgray-500">Loading provider...</span>
          </div>
        </div>
      }
    >
      <ProviderDetailContent />
    </Suspense>
  );
}
