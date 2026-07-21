"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import { Service } from "@shared/types";
import { CardSkeleton } from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import {
  Search,
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
  ArrowRight,
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

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/services");
      setServices(data.data.services);
    } catch (error) {
      console.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return services;
    const q = search.toLowerCase();
    return services.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
    );
  }, [services, search]);

  return (
    <div className="min-h-screen bg-warmgray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-warmgray-900">Our Services</h1>
          <p className="text-warmgray-500 mt-1">
            Find the right professional for your home
          </p>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warmgray-400" />
          <input
            type="text"
            placeholder="Search services by name, category, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-warmgray-200 rounded-xl text-warmgray-900 placeholder:text-warmgray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:outline-none shadow-sm text-sm"
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }, (_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Search className="w-7 h-7 text-warmgray-400" />}
            title="No services found"
            description={
              search
                ? `No services match "${search}". Try a different search term.`
                : "No services are available at the moment."
            }
            action={
              search
                ? { label: "Clear search", href: "/services" }
                : undefined
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((service) => {
              const Icon = getCategoryIcon(service.category);
              return (
                <Link
                  key={service._id}
                  href={`/service-detail?id=${service._id}`}
                  className="bg-white rounded-2xl shadow-card border border-warmgray-100 p-6 hover:shadow-card-hover transition-all duration-200 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-warmgray-900 group-hover:text-primary-700 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-sm text-warmgray-500 mt-0.5">
                    {service.category}
                  </p>
                  <p className="text-sm text-warmgray-400 mt-2 line-clamp-2">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-warmgray-100">
                    <span className="text-primary-600 font-semibold">
                      Rs. {service.basePrice}
                    </span>
                    <span className="flex items-center gap-1 text-warmgray-400 text-sm">
                      <Clock className="w-3.5 h-3.5" />
                      {service.duration} min
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-primary-600 font-medium mt-3 group-hover:gap-2 transition-all">
                    View details
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
