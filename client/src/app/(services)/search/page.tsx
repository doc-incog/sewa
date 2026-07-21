"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import { Provider, Service } from "@shared/types";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import StarRating from "@/components/ui/StarRating";
import EmptyState from "@/components/ui/EmptyState";
import { CardSkeleton } from "@/components/ui/Skeleton";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Star,
  BadgeCheck,
  ArrowRight,
  X,
} from "lucide-react";

export default function SearchPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    service: "",
    minRating: "",
    maxPrice: "",
    location: "",
    available: "",
    page: 1,
  });

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    fetchProviders();
  }, [filters]);

  const fetchServices = async () => {
    try {
      const { data } = await api.get("/services");
      setServices(data.data.services);
    } catch (error) {
      console.error("Failed to load services");
    }
  };

  const fetchProviders = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {};
      if (filters.service) params.service = filters.service;
      if (filters.minRating) params.minRating = filters.minRating;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.location) params.location = filters.location;
      if (filters.available) params.available = filters.available;
      params.page = filters.page;

      const { data } = await api.get("/search", { params });
      setProviders(data.data.providers);
    } catch (error) {
      console.error("Search failed");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      service: "",
      minRating: "",
      maxPrice: "",
      location: "",
      available: "",
      page: 1,
    });
  };

  const hasActiveFilters =
    filters.service ||
    filters.minRating ||
    filters.maxPrice ||
    filters.location ||
    filters.available;

  return (
    <div className="min-h-screen bg-warmgray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-warmgray-900">
              Find Providers
            </h1>
            <p className="text-warmgray-500 mt-1">
              Search and filter service providers
            </p>
          </div>
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              filtersOpen || hasActiveFilters
                ? "bg-primary-600 text-white shadow-warm"
                : "bg-white text-warmgray-700 border border-warmgray-200 hover:bg-warmgray-50"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="w-5 h-5 bg-white/20 rounded-full text-xs flex items-center justify-center">
                {[filters.service, filters.minRating, filters.maxPrice, filters.location, filters.available].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>

        {filtersOpen && (
          <div className="bg-white rounded-2xl shadow-card border border-warmgray-100 p-6 mb-6 animate-slide-down">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-warmgray-900">
                Refine search
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Clear all
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-warmgray-700 mb-1.5">
                  Service
                </label>
                <select
                  value={filters.service}
                  onChange={(e) => updateFilter("service", e.target.value)}
                  className="w-full px-3 py-2.5 bg-warmgray-50 border border-warmgray-200 rounded-xl text-sm text-warmgray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:outline-none"
                >
                  <option value="">All Services</option>
                  {services.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-warmgray-700 mb-1.5">
                  Minimum Rating
                </label>
                <div className="flex gap-2">
                  {[
                    { label: "Any", value: "" },
                    { label: "3+", value: "3" },
                    { label: "4+", value: "4" },
                    { label: "4.5+", value: "4.5" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateFilter("minRating", opt.value)}
                      className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                        filters.minRating === opt.value
                          ? "bg-primary-600 text-white"
                          : "bg-warmgray-100 text-warmgray-600 hover:bg-warmgray-200"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-warmgray-700 mb-1.5">
                  Availability
                </label>
                <div className="flex gap-2">
                  {[
                    { label: "Any", value: "" },
                    { label: "Available", value: "true" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateFilter("available", opt.value)}
                      className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                        filters.available === opt.value
                          ? "bg-primary-600 text-white"
                          : "bg-warmgray-100 text-warmgray-600 hover:bg-warmgray-200"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-warmgray-700 mb-1.5">
                  Max Price (Rs.)
                </label>
                <input
                  type="number"
                  placeholder="No limit"
                  value={filters.maxPrice}
                  onChange={(e) => updateFilter("maxPrice", e.target.value)}
                  className="w-full px-3 py-2.5 bg-warmgray-50 border border-warmgray-200 rounded-xl text-sm text-warmgray-900 placeholder:text-warmgray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-warmgray-700 mb-1.5">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warmgray-400" />
                  <input
                    type="text"
                    placeholder="City or area"
                    value={filters.location}
                    onChange={(e) => updateFilter("location", e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-warmgray-50 border border-warmgray-200 rounded-xl text-sm text-warmgray-900 placeholder:text-warmgray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-6">
            {filters.service && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-xs font-medium">
                {services.find((s) => s._id === filters.service)?.name || "Service"}
                <button onClick={() => updateFilter("service", "")}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.minRating && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-xs font-medium">
                {filters.minRating}+ stars
                <button onClick={() => updateFilter("minRating", "")}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.maxPrice && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary-50 text-secondary-700 rounded-full text-xs font-medium">
                Max Rs. {filters.maxPrice}
                <button onClick={() => updateFilter("maxPrice", "")}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.location && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-warmgray-100 text-warmgray-700 rounded-full text-xs font-medium">
                {filters.location}
                <button onClick={() => updateFilter("location", "")}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.available && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
                Available now
                <button onClick={() => updateFilter("available", "")}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }, (_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : providers.length === 0 ? (
          <EmptyState
            icon={<Search className="w-7 h-7 text-warmgray-400" />}
            title="No providers found"
            description="Try adjusting your filters or search criteria to find providers."
            action={
              hasActiveFilters
                ? { label: "Clear filters", href: "/search" }
                : undefined
            }
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
                    <Avatar
                      name={user?.name || "Provider"}
                      size="lg"
                    />
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
                    {provider.description || "Professional service provider"}
                  </p>

                  <div className="flex items-center gap-3 mb-4">
                    {provider.avgRating > 0 ? (
                      <div className="flex items-center gap-1.5">
                        <StarRating
                          rating={provider.avgRating}
                          size="sm"
                        />
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
                      <span className="text-sm text-warmgray-400">New provider</span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {provider.services.slice(0, 3).map((svc) => {
                      const service =
                        typeof svc === "object" ? svc : null;
                      return service ? (
                        <span
                          key={service._id}
                          className="px-2.5 py-1 bg-warmgray-100 text-warmgray-600 text-xs rounded-lg font-medium"
                        >
                          {service.name}
                        </span>
                      ) : null;
                    })}
                    {provider.services.length > 3 && (
                      <span className="px-2.5 py-1 bg-warmgray-50 text-warmgray-400 text-xs rounded-lg">
                        +{provider.services.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="mt-auto pt-4 border-t border-warmgray-100 flex items-center justify-between">
                    <div className="text-sm text-warmgray-500">
                      {provider.totalJobs} jobs completed
                    </div>
                    <Link
                      href={`/providers?id=${provider._id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors shadow-warm"
                    >
                      View
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
