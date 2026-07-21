"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Provider } from "@shared/types";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import StarRating from "@/components/ui/StarRating";
import EmptyState from "@/components/ui/EmptyState";
import { TableSkeleton } from "@/components/ui/Skeleton";
import toast from "react-hot-toast";
import { ShieldCheck, ShieldOff, ChevronLeft, ChevronRight } from "lucide-react";

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProviders();
  }, [verified, page]);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 20 };
      if (verified) params.verified = verified;
      const { data } = await api.get("/admin/providers", { params });
      setProviders(data.data.providers);
      setTotalPages(data.data.totalPages);
    } catch {
      toast.error("Failed to load providers");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (providerId: string, newState: boolean) => {
    try {
      await api.put(`/admin/providers/${providerId}/verify`, { verified: newState });
      toast.success(newState ? "Provider verified" : "Verification removed");
      fetchProviders();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-warmgray-900">Providers</h1>
        <p className="text-sm text-warmgray-500 mt-1">Manage service providers</p>
      </div>

      <div className="flex gap-3">
        <select
          value={verified}
          onChange={(e) => { setVerified(e.target.value); setPage(1); }}
          className="px-4 py-2.5 bg-warmgray-50 border border-warmgray-200 rounded-xl text-sm text-warmgray-700 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
        >
          <option value="">All Providers</option>
          <option value="true">Verified</option>
          <option value="false">Unverified</option>
        </select>
      </div>

      {loading ? (
        <TableSkeleton rows={6} />
      ) : providers.length === 0 ? (
        <EmptyState title="No providers found" description="No providers match your current filters." />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-warmgray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-warmgray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium text-warmgray-500 uppercase">Business</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-warmgray-500 uppercase">Owner</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-warmgray-500 uppercase">Rating</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-warmgray-500 uppercase">Jobs</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-warmgray-500 uppercase">Status</th>
                  <th className="px-5 py-3 text-right text-xs font-medium text-warmgray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warmgray-100">
                {providers.map((provider) => {
                  const user = typeof provider.userId === "object" ? provider.userId : null;
                  return (
                    <tr key={provider._id} className="hover:bg-warmgray-50/50 transition-colors">
                      <td className="px-5 py-3.5 text-sm font-medium text-warmgray-900">{provider.businessName}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          {user && <Avatar name={user.name} size="sm" />}
                          <span className="text-sm text-warmgray-600">{user?.name || "N/A"}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        {provider.avgRating > 0 ? (
                          <div className="flex items-center gap-1.5">
                            <StarRating rating={provider.avgRating} size="sm" />
                            <span className="text-xs text-warmgray-500">{provider.avgRating.toFixed(1)}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-warmgray-400">No ratings</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-warmgray-600">{provider.totalJobs}</td>
                      <td className="px-5 py-3.5">
                        <Badge status={provider.verified ? "verified" : "unverified"} />
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => handleVerify(provider._id, !provider.verified)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                            provider.verified
                              ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                              : "bg-primary-600 text-white border-primary-600 hover:bg-primary-700"
                          }`}
                        >
                          {provider.verified ? (
                            <>
                              <ShieldOff className="w-3.5 h-3.5" />
                              Unverify
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Verify
                            </>
                          )}
                        </button>
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
