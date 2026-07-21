"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { Booking } from "@shared/types";
import Avatar from "@/components/ui/Avatar";
import { CardSkeleton } from "@/components/ui/Skeleton";
import {
  CreditCard,
  Banknote,
  Calendar,
  Clock,
  MapPin,
  Shield,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import Link from "next/link";

function PaymentContent() {
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
    } else {
      setLoading(false);
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
    } catch {
      toast.error("Failed to load booking");
      router.push("/bookings");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;
    setProcessing(true);

    try {
      const intentRes = await api.post("/payments/create-intent", {
        bookingId: booking._id,
      });
      const { paymentId } = intentRes.data.data;

      await api.post("/payments/confirm", {
        paymentId,
        cardNumber: paymentMethod === "card" ? cardData.number : undefined,
        method: paymentMethod,
      });

      toast.success("Payment successful!");
      router.push("/payments");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-warmgray-50">
        <main className="max-w-2xl mx-auto px-4 py-8">
          <div className="space-y-4">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </main>
      </div>
    );
  }

  if (!booking || !bookingId) {
    return (
      <div className="min-h-screen bg-warmgray-50">
        <main className="max-w-2xl mx-auto px-4 py-8 text-center">
          <p className="text-warmgray-500">Booking not found</p>
        </main>
      </div>
    );
  }

  const service =
    typeof booking.serviceId === "object" ? booking.serviceId : null;
  const provider =
    typeof booking.providerId === "object" ? booking.providerId : null;
  const providerName =
    provider?.businessName || (typeof provider?.userId === "object" ? (provider.userId as any)?.name : undefined) || "Provider";

  return (
    <div className="min-h-screen bg-warmgray-50">
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/bookings"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-warmgray-500 hover:text-warmgray-700 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Bookings
        </Link>

        <h1 className="text-3xl font-bold text-warmgray-900 mb-8">Payment</h1>

        <div className="bg-white rounded-2xl shadow-card border border-warmgray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-warmgray-900 mb-4">
            Booking Summary
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Avatar name={providerName} size="sm" />
              <div>
                <p className="text-sm font-medium text-warmgray-900">
                  {service?.name || "Service"}
                </p>
                <p className="text-xs text-warmgray-500">{providerName}</p>
              </div>
            </div>
            <div className="border-t border-warmgray-100 pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-warmgray-500 inline-flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Date
                </span>
                <span className="font-medium text-warmgray-900">
                  {new Date(booking.date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-warmgray-500 inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Time
                </span>
                <span className="font-medium text-warmgray-900">
                  {booking.timeSlot}
                </span>
              </div>
              {booking.address && (
                <div className="flex justify-between text-sm">
                  <span className="text-warmgray-500 inline-flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    Location
                  </span>
                  <span className="font-medium text-warmgray-900">
                    {booking.address.city}
                  </span>
                </div>
              )}
            </div>
            <div className="border-t border-warmgray-100 pt-3 flex justify-between">
              <span className="font-semibold text-warmgray-900">Total</span>
              <span className="text-2xl font-bold text-primary-600 flex items-center gap-0.5">
                Rs. {booking.amount}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-warmgray-100 p-6">
          <h2 className="text-lg font-semibold text-warmgray-900 mb-4">
            Payment Method
          </h2>

          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setPaymentMethod("card")}
              className={`flex-1 p-4 rounded-xl border-2 text-center transition-colors ${
                paymentMethod === "card"
                  ? "border-primary-500 bg-primary-50 text-primary-700"
                  : "border-warmgray-200 text-warmgray-500 hover:bg-warmgray-50"
              }`}
            >
              <CreditCard className="w-6 h-6 mx-auto mb-1.5" />
              <div className="text-sm font-medium">Card</div>
            </button>
            <button
              onClick={() => setPaymentMethod("cash")}
              className={`flex-1 p-4 rounded-xl border-2 text-center transition-colors ${
                paymentMethod === "cash"
                  ? "border-secondary-500 bg-secondary-50 text-secondary-700"
                  : "border-warmgray-200 text-warmgray-500 hover:bg-warmgray-50"
              }`}
            >
              <Banknote className="w-6 h-6 mx-auto mb-1.5" />
              <div className="text-sm font-medium">Cash</div>
            </button>
          </div>

          {paymentMethod === "card" && (
            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-warmgray-700 mb-1.5">
                  Card Number
                </label>
                <input
                  type="text"
                  required
                  maxLength={19}
                  value={cardData.number}
                  onChange={(e) => {
                    const v = e.target.value
                      .replace(/\D/g, "")
                      .replace(/(.{4})/g, "$1 ")
                      .trim();
                    setCardData({ ...cardData, number: v });
                  }}
                  className="w-full px-4 py-2.5 border border-warmgray-200 rounded-xl text-warmgray-900 placeholder:text-warmgray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow"
                  placeholder="4242 4242 4242 4242"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-warmgray-700 mb-1.5">
                    Expiry
                  </label>
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
                    className="w-full px-4 py-2.5 border border-warmgray-200 rounded-xl text-warmgray-900 placeholder:text-warmgray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-warmgray-700 mb-1.5">
                    CVV
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={cardData.cvv}
                    onChange={(e) =>
                      setCardData({
                        ...cardData,
                        cvv: e.target.value.replace(/\D/g, ""),
                      })
                    }
                    className="w-full px-4 py-2.5 border border-warmgray-200 rounded-xl text-warmgray-900 placeholder:text-warmgray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow"
                    placeholder="123"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-warmgray-700 mb-1.5">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  required
                  value={cardData.name}
                  onChange={(e) =>
                    setCardData({ ...cardData, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-warmgray-200 rounded-xl text-warmgray-900 placeholder:text-warmgray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow"
                  placeholder="John Doe"
                />
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-warm"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay Rs. ${booking.amount}`
                )}
              </button>

              <p className="text-xs text-warmgray-400 text-center flex items-center justify-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                Demo mode -- use test card 4242 4242 4242 4242
              </p>
            </form>
          )}

          {paymentMethod === "cash" && (
            <div>
              <div className="bg-secondary-50 border border-secondary-200 rounded-xl p-4 mb-4">
                <p className="text-sm text-secondary-800">
                  You&apos;ll pay Rs. <strong>{booking.amount}</strong> in cash
                  when the service is completed.
                </p>
              </div>
              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full py-3 bg-secondary-600 text-white font-semibold rounded-xl hover:bg-secondary-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-warm"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Confirming...
                  </>
                ) : (
                  "Confirm Cash Payment"
                )}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function PaymentPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-warmgray-50 flex items-center justify-center">
          <div className="flex items-center gap-2 text-warmgray-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-medium">Loading payment...</span>
          </div>
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}
