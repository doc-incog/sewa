"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import { Service, Provider } from "../../../../shared/types";

export default function ServiceDetailPage() {
  const params = useParams();
  const [service, setService] = useState<Service | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchData(params.id as string);
    }
  }, [params.id]);

  const fetchData = async (serviceId: string) => {
    try {
      const [serviceRes, providersRes] = await Promise.all([
        api.get(`/services/${serviceId}`),
        api.get(`/providers/service/${serviceId}`),
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
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-500">Service not found</p>
          <Link href="/services" className="text-primary-600 hover:underline mt-4 block">
            Back to services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/services" className="text-primary-600 hover:text-primary-700 text-sm mb-4 inline-block">
          &larr; Back to Services
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex items-start gap-4">
            <span className="text-5xl">{service.icon}</span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{service.name}</h1>
              <p className="text-gray-500 mt-1">{service.category}</p>
              <p className="text-gray-600 mt-4 max-w-2xl">{service.description}</p>
              <div className="flex items-center gap-6 mt-6">
                <div>
                  <span className="text-2xl font-bold text-primary-600">Rs. {service.basePrice}</span>
                  <span className="text-gray-400 text-sm ml-1">base price</span>
                </div>
                <div className="text-gray-500">
                  ~{service.duration} minutes
                </div>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Available Providers ({providers.length})
        </h2>

        {providers.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
            <p className="text-gray-500">No providers available for this service yet</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((provider) => {
              const user = typeof provider.userId === "object" ? provider.userId : null;
              return (
                <div
                  key={provider._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-lg">
                      {user?.name?.charAt(0) || "P"}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{provider.businessName}</h3>
                      <p className="text-sm text-gray-500">{user?.name}</p>
                    </div>
                    {provider.verified && (
                      <span className="ml-auto bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Verified</span>
                    )}
                  </div>

                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">{provider.description || "Professional service provider"}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="font-semibold text-gray-900">
                        {provider.avgRating > 0 ? provider.avgRating.toFixed(1) : "New"}
                      </span>
                      {provider.totalReviews > 0 && (
                        <span className="text-gray-400 text-sm">({provider.totalReviews})</span>
                      )}
                    </div>
                    <span className="text-gray-400 text-sm">{provider.totalJobs} jobs done</span>
                  </div>

                  <Link
                    href={`/providers/${provider._id}?serviceId=${service._id}`}
                    className="block w-full text-center py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    View & Book
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
