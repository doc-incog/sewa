"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Provider } from "@shared/types";
import toast from "react-hot-toast";

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
    } catch (error) {
      console.error("Failed to load providers");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (providerId: string, verified: boolean) => {
    try {
      await api.put(`/admin/providers/${providerId}/verify`, { verified });
      toast.success(verified ? "Provider verified" : "Verification removed");
      fetchProviders();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Provider Management</h1>

      <div className="flex gap-4 mb-6">
        <select
          value={verified}
          onChange={(e) => { setVerified(e.target.value); setPage(1); }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Providers</option>
          <option value="true">Verified</option>
          <option value="false">Unverified</option>
        </select>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jobs</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {providers.map((provider) => {
                const user = typeof provider.userId === "object" ? provider.userId : null;
                return (
                  <tr key={provider._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{provider.businessName}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{user?.name || "N/A"}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      ★ {provider.avgRating > 0 ? provider.avgRating.toFixed(1) : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{provider.totalJobs}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        provider.verified
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {provider.verified ? "Verified" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleVerify(provider._id, !provider.verified)}
                        className={`text-sm font-medium ${
                          provider.verified
                            ? "text-red-600 hover:text-red-700"
                            : "text-green-600 hover:text-green-700"
                        }`}
                      >
                        {provider.verified ? "Unverify" : "Verify"}
                      </button>
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
