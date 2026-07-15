"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import { Provider, Service } from "../../../../shared/types";

export default function SearchPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchType, setSearchType] = useState<"providers" | "services">("providers");

  const [filters, setFilters] = useState({
    q: "",
    service: "",
    minRating: "",
    verified: "",
    sort: "rating",
  });

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (searchType === "providers") {
      fetchProviders();
    } else {
      fetchSearchServices();
    }
  }, [filters, searchType]);

  const fetchServices = async () => {
    try {
      const { data } = await api.get("/services");
      setServices(data.data.services);
    } catch (error) {
      console.error("Failed to load services");
    }
  };

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (filters.q) params.q = filters.q;
      if (filters.service) params.service = filters.service;
      if (filters.minRating) params.minRating = filters.minRating;
      if (filters.verified) params.verified = filters.verified;
      if (filters.sort) params.sort = filters.sort;

      const { data } = await api.get("/search/providers", { params });
      setProviders(data.data.providers);
    } catch (error) {
      console.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const fetchSearchServices = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (filters.q) params.q = filters.q;

      const { data } = await api.get("/search/services", { params });
      setServices(data.data.services);
    } catch (error) {
      console.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Search</h1>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setSearchType("providers")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              searchType === "providers"
                ? "bg-primary-600 text-white"
                : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            Service Providers
          </button>
          <button
            onClick={() => setSearchType("services")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              searchType === "services"
                ? "bg-primary-600 text-white"
                : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            Services
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search..."
              value={filters.q}
              onChange={(e) => setFilters({ ...filters, q: e.target.value })}
              className="md:col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />

            {searchType === "providers" ? (
              <>
                <select
                  value={filters.service}
                  onChange={(e) => setFilters({ ...filters, service: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Services</option>
                  {services.map((s) => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>

                <select
                  value={filters.minRating}
                  onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Any Rating</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                </select>
              </>
            ) : (
              <div className="md:col-span-2"></div>
            )}
          </div>

          {searchType === "providers" && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <select
                value={filters.verified}
                onChange={(e) => setFilters({ ...filters, verified: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Providers</option>
                <option value="true">Verified Only</option>
              </select>

              <select
                value={filters.sort}
                onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="rating">Highest Rated</option>
                <option value="jobs">Most Jobs</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-xl animate-pulse">
                <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : searchType === "providers" ? (
          providers.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
              <p className="text-gray-500 text-lg">No providers found matching your criteria</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {providers.map((provider) => {
                const user = typeof provider.userId === "object" ? provider.userId : null;
                return (
                  <div key={provider._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold">
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

                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                      {provider.description || "Professional service provider"}
                    </p>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="font-semibold text-gray-900">
                          {provider.avgRating > 0 ? provider.avgRating.toFixed(1) : "New"}
                        </span>
                        {provider.totalReviews > 0 && (
                          <span className="text-gray-400 text-sm">({provider.totalReviews})</span>
                        )}
                      </div>
                      <span className="text-gray-400 text-sm">{provider.totalJobs} jobs</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {provider.services.slice(0, 3).map((svc) => {
                        const service = typeof svc === "object" ? svc : null;
                        return service ? (
                          <span key={service._id} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {service.icon} {service.name}
                          </span>
                        ) : null;
                      })}
                    </div>

                    <Link
                      href={`/providers/${provider._id}`}
                      className="block w-full text-center py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      View Profile
                    </Link>
                  </div>
                );
              })}
            </div>
          )
        ) : services.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
            <p className="text-gray-500 text-lg">No services found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Link
                key={service._id}
                href={`/services/${service._id}`}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-200 transition-all"
              >
                <span className="text-4xl block mb-3">{service.icon}</span>
                <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{service.category}</p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <span className="text-primary-600 font-semibold">Rs. {service.basePrice}</span>
                  <span className="text-gray-400 text-sm">{service.duration} min</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
