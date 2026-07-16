"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import BookingModal from "@/components/BookingModal";
import ReviewList from "@/components/ReviewList";
import { Provider, Service, User } from "@shared/types";

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
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-gray-200 rounded-xl"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-500">Provider not found</p>
          <Link href="/services" className="text-primary-600 hover:underline mt-4 block">Browse services</Link>
        </div>
      </div>
    );
  }

  const user = typeof provider.userId === "object" ? provider.userId : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/services" className="text-primary-600 hover:text-primary-700 text-sm mb-6 inline-block">
          &larr; Back to Services
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-2xl flex-shrink-0">
              {user?.name?.charAt(0) || "P"}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">{provider.businessName}</h1>
                {provider.verified && (
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">Verified</span>
                )}
              </div>
              <p className="text-gray-500 mt-1">{user?.name} &bull; {user?.email}</p>
              {user?.phone && <p className="text-gray-500 text-sm">{user.phone}</p>}
            </div>
          </div>

          {provider.description && (
            <p className="text-gray-600 mt-6 leading-relaxed">{provider.description}</p>
          )}

          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {provider.avgRating > 0 ? provider.avgRating.toFixed(1) : "N/A"}
              </div>
              <div className="text-sm text-gray-500">
                Rating {provider.totalReviews > 0 && `(${provider.totalReviews} reviews)`}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{provider.totalJobs}</div>
              <div className="text-sm text-gray-500">Jobs Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{provider.services.length}</div>
              <div className="text-sm text-gray-500">Services Offered</div>
            </div>
          </div>
        </div>

        {provider.availability && provider.availability.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Availability</h2>
            <div className="grid grid-cols-7 gap-2">
              {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((day) => {
                const avail = provider.availability.find((a) => a.day === day);
                const isAvailable = avail?.isAvailable !== false;
                return (
                  <div
                    key={day}
                    className={`text-center p-3 rounded-lg text-sm font-medium ${
                      isAvailable
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-50 text-gray-400"
                    }`}
                  >
                    <div className="uppercase">{day}</div>
                    {isAvailable && avail && (
                      <div className="text-xs mt-1">{avail.startTime}-{avail.endTime}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Reviews</h2>
          <ReviewList providerId={provider._id} />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Services Offered</h2>
          {provider.services.length === 0 ? (
            <p className="text-gray-500">No services listed yet</p>
          ) : (
            <div className="space-y-3">
              {provider.services.map((svc) => {
                const service = typeof svc === "object" ? svc : null;
                if (!service) return null;
                return (
                  <div
                    key={service._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{service.icon}</span>
                      <div>
                        <h3 className="font-medium text-gray-900">{service.name}</h3>
                        <p className="text-sm text-gray-500">{service.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-primary-600">Rs. {service.basePrice}</span>
                      <button
                        onClick={() => {
                          setSelectedService(service);
                          setShowBooking(true);
                        }}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 transition-colors"
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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
      }
    >
      <ProviderDetailContent />
    </Suspense>
  );
}
