"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import ReviewForm from "@/components/ReviewForm";
import { useAuth } from "@/hooks/useAuth";
import { Booking } from "@shared/types";
import toast from "react-hot-toast";

export default function BookingsPage() {
  const { user } = useAuth(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("");
  const [reviewedBookings, setReviewedBookings] = useState<Set<string>>(new Set());
  const [showReviewFor, setShowReviewFor] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (filter) params.status = filter;
      const endpoint = user?.role === "provider" ? "/bookings/provider" : "/bookings/my";
      const { data } = await api.get(endpoint, { params });
      const bookingsList = data.data.bookings;
      setBookings(bookingsList);

      if (user?.role === "user") {
        const completed = bookingsList.filter((b: Booking) => b.status === "completed");
        const reviewed = new Set<string>();
        for (const booking of completed) {
          try {
            const { data } = await api.get(`/reviews/provider/${
              typeof booking.providerId === "object" ? booking.providerId._id : booking.providerId
            }`);
            const reviews = data.data.reviews;
            if (reviews.some((r: any) =>
              typeof r.bookingId === "string" ? r.bookingId === booking._id : r.bookingId?._id === booking._id
            )) {
              reviewed.add(booking._id);
            }
          } catch {}
        }
        setReviewedBookings(reviewed);
      }
    } catch (error) {
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

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    in_progress: "bg-purple-100 text-purple-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {user?.role === "provider" ? "Service Requests" : "My Bookings"}
        </h1>

        <div className="flex gap-2 mb-6 flex-wrap">
          {["", "pending", "confirmed", "in_progress", "completed", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? "bg-primary-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {status || "All"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-xl animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
            <p className="text-gray-500 text-lg">No bookings found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const provider = typeof booking.providerId === "object" ? booking.providerId : null;
              const service = typeof booking.serviceId === "object" ? booking.serviceId : null;
              const bookedUser = typeof booking.userId === "object" ? booking.userId : null;

              return (
                <div key={booking._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {service?.name || "Service"}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[booking.status]}`}>
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {user?.role === "provider"
                          ? `Client: ${bookedUser?.name || "N/A"}`
                          : `Provider: ${provider?.businessName || "N/A"}`
                        }
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        {new Date(booking.date).toLocaleDateString()} at {booking.timeSlot}
                      </p>
                      {booking.address && (
                        <p className="text-sm text-gray-400 mt-1">
                          {booking.address.street}, {booking.address.city}
                        </p>
                      )}
                      {booking.notes && (
                        <p className="text-sm text-gray-400 mt-1 italic">&quot;{booking.notes}&quot;</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary-600">Rs. {booking.amount}</p>
                      <div className="flex gap-2 mt-2">
                        {user?.role === "provider" && booking.status === "pending" && (
                          <button
                            onClick={() => handleAccept(booking._id)}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                          >
                            Accept
                          </button>
                        )}
                        {user?.role === "provider" && (booking.status === "confirmed" || booking.status === "in_progress") && (
                          <button
                            onClick={() => handleComplete(booking._id)}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                          >
                            Complete
                          </button>
                        )}
                        {(booking.status === "pending" || booking.status === "confirmed") && (
                          <button
                            onClick={() => handleCancel(booking._id)}
                            className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                          >
                            Cancel
                          </button>
                        )}
                        {user?.role === "user" && booking.status === "completed" && !reviewedBookings.has(booking._id) && (
                          <button
                            onClick={() => setShowReviewFor(showReviewFor === booking._id ? null : booking._id)}
                            className="px-3 py-1 bg-yellow-500 text-white text-sm rounded-lg hover:bg-yellow-600"
                          >
                            {showReviewFor === booking._id ? "Cancel" : "Review"}
                          </button>
                        )}
                        {user?.role === "user" && booking.status === "completed" && reviewedBookings.has(booking._id) && (
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-lg">
                            Reviewed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {showReviewFor === booking._id && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <ReviewForm
                        bookingId={booking._id}
                        onReviewSubmitted={() => {
                          setReviewedBookings(new Set([...Array.from(reviewedBookings), booking._id]));
                          setShowReviewFor(null);
                          toast.success("Review submitted!");
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
