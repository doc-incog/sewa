"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Provider, Service } from "@shared/types";
import toast from "react-hot-toast";
import { X, Calendar, Clock, MapPin, FileText, Loader2 } from "lucide-react";

interface BookingModalProps {
  provider: Provider;
  service: Service;
  onClose: () => void;
}

export default function BookingModal({ provider, service, onClose }: BookingModalProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    date: "",
    timeSlot: "09:00",
    street: "",
    city: "",
    state: "",
    zip: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  const timeSlots = [
    "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/bookings", {
        providerId: provider._id,
        serviceId: service._id,
        date: formData.date,
        timeSlot: formData.timeSlot,
        amount: service.basePrice,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
        },
        notes: formData.notes,
      });
      toast.success("Booking created! Proceeding to payment...");
      onClose();
      router.push(`/payment?bookingId=${data.data.booking._id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 bg-warmgray-50 border border-warmgray-200 rounded-xl text-sm text-warmgray-900 placeholder-warmgray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-warm-lg animate-slide-up">
        <div className="p-5 border-b border-warmgray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-warmgray-900">Book Service</h2>
              <p className="text-sm text-warmgray-500 mt-0.5">{provider.businessName}</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-warmgray-400 hover:text-warmgray-600 hover:bg-warmgray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-3 p-3 bg-warmgray-50 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-warmgray-900">{service.name}</p>
              <p className="text-xs text-warmgray-500">{service.category}</p>
            </div>
            <p className="text-lg font-bold text-primary-600">Rs. {service.basePrice}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-warmgray-600 mb-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Date
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-warmgray-600 mb-1.5">
                <Clock className="w-3.5 h-3.5" />
                Time
              </label>
              <select
                value={formData.timeSlot}
                onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                className={inputClass}
              >
                {timeSlots.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-warmgray-600 mb-1.5">
              <MapPin className="w-3.5 h-3.5" />
              Street Address
            </label>
            <input
              type="text"
              required
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              className={inputClass}
              placeholder="123 Main Street"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-warmgray-600 mb-1.5 block">City</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className={inputClass}
                placeholder="Kathmandu"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-warmgray-600 mb-1.5 block">State</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className={inputClass}
                placeholder="Bagmati"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-warmgray-600 mb-1.5 block">ZIP</label>
              <input
                type="text"
                value={formData.zip}
                onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                className={inputClass}
                placeholder="44600"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-warmgray-600 mb-1.5">
              <FileText className="w-3.5 h-3.5" />
              Notes (optional)
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className={inputClass}
              placeholder="Any special instructions..."
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-warmgray-200 text-warmgray-600 rounded-xl text-sm font-medium hover:bg-warmgray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors shadow-warm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Booking...
                </>
              ) : (
                "Confirm Booking"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
