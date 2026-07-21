"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Booking } from "@shared/types";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import EmptyState from "@/components/ui/EmptyState";
import { CardSkeleton } from "@/components/ui/Skeleton";
import toast from "react-hot-toast";
import {
  CalendarCheck,
  MapPin,
  Clock,
  IndianRupee,
  XCircle,
  CheckCircle,
  PlayCircle,
} from "lucide-react";

const statusFilters = [
  { key: "", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "in_progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

export default function BookingsPage() {
  const { user } = useAuth(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchBookings();
  }, [filter, user]);

  const fetchBookings = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const params: any = {};
      if (filter) params.status = filter;
      const endpoint = user.role === "provider" ? "/bookings/provider" : "/bookings/my";
      const { data } = await api.get(endpoint, { params });
      setBookings(data.data.bookings || []);
    } catch {
      console.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await api.put(`/bookings/${bookingId}/cancel`);
      toast.success("Booking cancelled");
      fetchBookings();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to cancel");
    }
  };

  const handleAccept = async (bookingId: string) => {
    try {
      await api.put(`/bookings/${bookingId}/accept`);
      toast.success("Booking accepted");
      fetchBookings();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to accept");
    }
  };

  const handleComplete = async (bookingId: string) => {
    try {
      await api.put(`/bookings/${bookingId}/complete`);
      toast.success("Booking marked as completed");
      fetchBookings();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to complete");
    }
  };

  return (
    <div className="min-h-screen bg-warmgray-50">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-warmgray-900">
            {user?.role === "provider" ? "Service Requests" : "My Bookings"}
          </h1>
          <p className="text-warmgray-500 mt-1">
            {user?.role === "provider"
              ? "View and manage incoming booking requests"
              : "Track and manage your service bookings"}
          </p>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {statusFilters.map((sf) => (
            <button
              key={sf.key}
              onClick={() => setFilter(sf.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === sf.key
                  ? "bg-primary-600 text-white shadow-warm"
                  : "bg-warmgray-100 text-warmgray-600 hover:bg-warmgray-200"
              }`}
            >
              {sf.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <EmptyState
            icon={<CalendarCheck className="w-7 h-7 text-warmgray-400" />}
            title="No bookings found"
            description={
              filter
                ? `No ${filter.replace(/_/g, " ")} bookings to display. Try a different filter.`
                : user?.role === "provider"
                  ? "No service requests yet. They will appear here once clients book your services."
                  : "You haven't made any bookings yet. Browse services to get started."
            }
            action={
              !filter
                ? { label: "Browse Services", href: "/services" }
                : undefined
            }
          />
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const provider =
                typeof booking.providerId === "object" ? booking.providerId : null;
              const service =
                typeof booking.serviceId === "object" ? booking.serviceId : null;
              const bookedUser =
                typeof booking.userId === "object" ? booking.userId : null;

              const providerUser =
                provider && typeof provider.userId === "object" ? provider.userId : null;

              const displayName =
                user?.role === "provider"
                  ? bookedUser?.name || "Unknown Client"
                  : provider?.businessName || (providerUser as any)?.name || "Unknown Provider";

              return (
                <div
                  key={booking._id}
                  className="bg-white rounded-2xl shadow-card border border-warmgray-100 p-6 hover:shadow-card-hover transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 min-w-0">
                      <Avatar name={displayName} size="md" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-warmgray-900 truncate">
                            {service?.name || "Service"}
                          </h3>
                          <Badge status={booking.status} />
                        </div>
                        <p className="text-sm text-warmgray-500 mt-0.5 truncate">
                          {user?.role === "provider"
                            ? `Client: ${bookedUser?.name || "N/A"}`
                            : `Provider: ${displayName}`}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-warmgray-400 flex-wrap">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(booking.date).toLocaleDateString()} at {booking.timeSlot}
                          </span>
                          {booking.address && (
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {booking.address.city}
                            </span>
                          )}
                        </div>
                        {booking.notes && (
                          <p className="text-sm text-warmgray-400 mt-2 italic">
                            &quot;{booking.notes}&quot;
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-lg font-bold text-primary-600 flex items-center justify-end gap-0.5">
                        <IndianRupee className="w-4 h-4" />
                        {booking.amount}
                      </p>
                      <div className="flex gap-2 mt-3 justify-end flex-wrap">
                        {user?.role === "provider" && booking.status === "pending" && (
                          <button
                            onClick={() => handleAccept(booking._id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-secondary-600 text-white text-xs font-medium rounded-lg hover:bg-secondary-700 transition-colors"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Accept
                          </button>
                        )}
                        {user?.role === "provider" &&
                          (booking.status === "confirmed" || booking.status === "in_progress") && (
                            <button
                              onClick={() => handleComplete(booking._id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-600 text-white text-xs font-medium rounded-lg hover:bg-primary-700 transition-colors"
                            >
                              <PlayCircle className="w-3.5 h-3.5" />
                              Complete
                            </button>
                          )}
                        {(booking.status === "pending" || booking.status === "confirmed") && (
                          <button
                            onClick={() => handleCancel(booking._id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-warmgray-100 text-warmgray-600 text-xs font-medium rounded-lg hover:bg-warmgray-200 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
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
