"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";
import { Booking, Service } from "../../../../shared/types";

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash">("card");
  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const { data } = await api.get("/bookings/my");
      const found = data.data.bookings.find((b: Booking) => b._id === bookingId);
      if (found) {
        setBooking(found);
      } else {
        toast.error("Booking not found");
        router.push("/bookings");
      }
    } catch (error) {
      toast.error("Failed to load booking");
      router.push("/bookings");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const intentRes = await api.post("/payments/create-intent", { bookingId });
      const { paymentId } = intentRes.data.data;

      await api.post("/payments/confirm", {
        paymentId,
        cardNumber: cardData.number,
        method: paymentMethod,
      });

      toast.success("Payment successful!");
      router.push("/bookings");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-48 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-500">Booking not found</p>
        </div>
      </div>
    );
  }

  const service = typeof booking.serviceId === "object" ? booking.serviceId : null;
  const provider = typeof booking.providerId === "object" ? booking.providerId : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Payment</h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Service</span>
              <span className="font-medium text-gray-900">{service?.name || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Provider</span>
              <span className="font-medium text-gray-900">{provider?.businessName || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Date</span>
              <span className="font-medium text-gray-900">{new Date(booking.date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Time</span>
              <span className="font-medium text-gray-900">{booking.timeSlot}</span>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between">
              <span className="text-gray-900 font-semibold">Total</span>
              <span className="text-2xl font-bold text-primary-600">Rs. {booking.amount}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>

          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setPaymentMethod("card")}
              className={`flex-1 p-4 rounded-lg border-2 text-center transition-colors ${
                paymentMethod === "card"
                  ? "border-primary-500 bg-primary-50 text-primary-700"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="text-2xl mb-1">💳</div>
              <div className="text-sm font-medium">Card</div>
            </button>
            <button
              onClick={() => setPaymentMethod("cash")}
              className={`flex-1 p-4 rounded-lg border-2 text-center transition-colors ${
                paymentMethod === "cash"
                  ? "border-primary-500 bg-primary-50 text-primary-700"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="text-2xl mb-1">💵</div>
              <div className="text-sm font-medium">Cash</div>
            </button>
          </div>

          {paymentMethod === "card" && (
            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                <input
                  type="text"
                  required
                  maxLength={19}
                  value={cardData.number}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
                    setCardData({ ...cardData, number: v });
                  }}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="4242 4242 4242 4242"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    value={cardData.expiry}
                    onChange={(e) => {
                      let v = e.target.value.replace(/\D/g, "");
                      if (v.length >= 2) v = v.slice(0, 2) + "/" + v.slice(2);
                      setCardData({ ...cardData, expiry: v });
                    }}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={cardData.cvv}
                    onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, "") })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="123"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                <input
                  type="text"
                  required
                  value={cardData.name}
                  onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {processing ? "Processing..." : `Pay Rs. ${booking.amount}`}
              </button>

              <p className="text-xs text-gray-400 text-center">
                Demo mode — use test card 4242 4242 4242 4242
              </p>
            </form>
          )}

          {paymentMethod === "cash" && (
            <div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-800">
                  You&apos;ll pay Rs. <strong>{booking.amount}</strong> in cash when the service is completed.
                </p>
              </div>
              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full py-3 bg-secondary-600 text-white font-semibold rounded-lg hover:bg-secondary-700 transition-colors disabled:opacity-50"
              >
                {processing ? "Confirming..." : "Confirm Cash Payment"}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
