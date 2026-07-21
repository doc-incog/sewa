"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Booking } from "@shared/types";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { TableSkeleton } from "@/components/ui/Skeleton";
import toast from "react-hot-toast";
import { XCircle, ChevronLeft, ChevronRight } from "lucide-react";

const statusTabs = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

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
    } catch {
      toast.error("Failed to load bookings");
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
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to cancel");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-warmgray-900">Bookings</h1>
        <p className="text-sm text-warmgray-500 mt-1">Manage all platform bookings</p>
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => { setStatus(tab.value); setPage(1); }}
            className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
              status === tab.value
                ? "bg-primary-600 text-white"
                : "bg-white text-warmgray-600 border border-warmgray-200 hover:bg-warmgray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <TableSkeleton rows={6} />
      ) : bookings.length === 0 ? (
        <EmptyState title="No bookings" description="No bookings match the selected filter." />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-warmgray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-warmgray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium text-warmgray-500 uppercase">User</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-warmgray-500 uppercase">Provider</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-warmgray-500 uppercase">Service</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-warmgray-500 uppercase">Date</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-warmgray-500 uppercase">Amount</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-warmgray-500 uppercase">Status</th>
                  <th className="px-5 py-3 text-right text-xs font-medium text-warmgray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warmgray-100">
                {bookings.map((booking) => {
                  const user = typeof booking.userId === "object" ? booking.userId : null;
                  const provider = typeof booking.providerId === "object" ? booking.providerId : null;
                  const service = typeof booking.serviceId === "object" ? booking.serviceId : null;

                  return (
                    <tr key={booking._id} className="hover:bg-warmgray-50/50 transition-colors">
                      <td className="px-5 py-3.5 text-sm text-warmgray-900">{user?.name || "N/A"}</td>
                      <td className="px-5 py-3.5 text-sm text-warmgray-600">{provider?.businessName || "N/A"}</td>
                      <td className="px-5 py-3.5 text-sm text-warmgray-600">{service?.name || "N/A"}</td>
                      <td className="px-5 py-3.5 text-sm text-warmgray-500">
                        {new Date(booking.date).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3.5 text-sm font-medium text-warmgray-900">Rs. {booking.amount}</td>
                      <td className="px-5 py-3.5">
                        <Badge status={booking.status} />
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {booking.status !== "cancelled" && booking.status !== "completed" && (
                          <button
                            onClick={() => handleCancel(booking._id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-medium hover:bg-red-100 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-1.5 p-4 border-t border-warmgray-100">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="w-8 h-8 rounded-lg text-sm flex items-center justify-center text-warmgray-600 hover:bg-warmgray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce<(number | string)[]>((acc, p, i, arr) => {
                  if (i > 0 && typeof arr[i - 1] === "number" && p - (arr[i - 1] as number) > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  typeof p === "string" ? (
                    <span key={`dots-${i}`} className="w-8 h-8 flex items-center justify-center text-warmgray-400 text-sm">...</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                        page === p
                          ? "bg-primary-600 text-white"
                          : "text-warmgray-600 hover:bg-warmgray-100"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 rounded-lg text-sm flex items-center justify-center text-warmgray-600 hover:bg-warmgray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
