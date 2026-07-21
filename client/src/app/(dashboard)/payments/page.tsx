"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Payment } from "@shared/types";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { CardSkeleton } from "@/components/ui/Skeleton";
import {
  CreditCard,
  Wallet,
  TrendingUp,
  IndianRupee,
  Calendar,
  Hash,
} from "lucide-react";

export default function PaymentsPage() {
  const { user } = useAuth(true);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, [user]);

  const fetchPayments = async () => {
    if (!user) return;
    try {
      const endpoint = user.role === "provider" ? "/payments/provider" : "/payments/my";
      const { data } = await api.get(endpoint);
      setPayments(data.data.payments || []);
      if (user.role === "provider") {
        setTotalEarnings(data.data.totalEarnings || 0);
      }
    } catch {
      console.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warmgray-50">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-warmgray-900">
            {user?.role === "provider" ? "Earnings" : "Payment History"}
          </h1>
          <p className="text-warmgray-500 mt-1">
            {user?.role === "provider"
              ? "Track your earnings and payment records"
              : "View all your past payments and transactions"}
          </p>
        </div>

        {user?.role === "provider" && !loading && (
          <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl shadow-warm-lg p-6 mb-8 text-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-white/80">Total Earnings</p>
                <p className="text-3xl font-bold flex items-center gap-0.5">
                  <IndianRupee className="w-6 h-6" />
                  {totalEarnings.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : payments.length === 0 ? (
          <EmptyState
            icon={<CreditCard className="w-7 h-7 text-warmgray-400" />}
            title="No payments yet"
            description={
              user?.role === "provider"
                ? "Payments from completed bookings will appear here."
                : "Your payment history will appear here after your first booking."
            }
          />
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => {
              const booking =
                typeof payment.bookingId === "object" ? payment.bookingId : null;
              const service =
                booking && typeof (booking as any).serviceId === "object"
                  ? (booking as any).serviceId
                  : null;

              return (
                <div
                  key={payment._id}
                  className="bg-white rounded-2xl shadow-card border border-warmgray-100 p-5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-warmgray-100 flex items-center justify-center shrink-0">
                        {payment.method === "card" ? (
                          <CreditCard className="w-5 h-5 text-warmgray-600" />
                        ) : (
                          <Wallet className="w-5 h-5 text-warmgray-600" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-warmgray-900 truncate">
                          {service?.name || "Service Payment"}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-warmgray-400 flex-wrap">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(payment.createdAt).toLocaleDateString()}
                          </span>
                          {payment.transactionId && (
                            <span className="inline-flex items-center gap-1">
                              <Hash className="w-3.5 h-3.5" />
                              {payment.transactionId}
                            </span>
                          )}
                          <span className="capitalize">{payment.method}</span>
                          {payment.cardLast4 && (
                            <span className="text-warmgray-400">
                              ending in {payment.cardLast4}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-lg font-bold text-warmgray-900 flex items-center justify-end gap-0.5">
                        <IndianRupee className="w-4 h-4" />
                        {payment.amount}
                      </p>
                      <div className="mt-1">
                        <Badge status={payment.status} />
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
