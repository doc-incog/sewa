"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Booking } from "../../../../shared/types";
import toast from "react-hot-toast";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchBookings();
  }, [status, page]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 20 };
      if (status) params.status = status;
      const { data } = await api.get("/admin/bookings", { params });
      setBookings(data.data.bookings);
      setTotalPages(data.data.totalPages);
    } catch (error) {
      console.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId: string) => {
    if (!confirm("Cancel this booking?")) return;
    try {
      await api.put(`/bookings/${bookingId}/cancel`);
      toast.success("Booking cancelled");
      fetchBookings();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to cancel");
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
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Booking Management</h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        {["", "pending", "confirmed", "in_progress", "completed", "cancelled"].map((s) => (
          <button
            key={s}
            onClick={() => { setStatus(s); setPage(1); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              status === s
                ? "bg-primary-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {s || "All"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-white rounded-xl p-8 animate-pulse">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map((booking) => {
                const user = typeof booking.userId === "object" ? booking.userId : null;
                const provider = typeof booking.providerId === "object" ? booking.providerId : null;
                const service = typeof booking.serviceId === "object" ? booking.serviceId : null;

                return (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{user?.name || "N/A"}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{provider?.businessName || "N/A"}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{service?.name || "N/A"}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(booking.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Rs. {booking.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[booking.status]}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {booking.status !== "cancelled" && booking.status !== "completed" && (
                        <button
                          onClick={() => handleCancel(booking._id)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 p-4 border-t border-gray-100">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
              >
                Prev
              </button>
              <span className="px-3 py-1 text-sm text-gray-500">Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
