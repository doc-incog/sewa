"use client";

import { useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import StarRating from "./ui/StarRating";
import { Send, Loader2 } from "lucide-react";

interface ReviewFormProps {
  bookingId: string;
  onReviewSubmitted: () => void;
}

export default function ReviewForm({ bookingId, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/reviews", { bookingId, rating, comment });
      toast.success("Review submitted!");
      onReviewSubmitted();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-warmgray-100 shadow-card p-6">
      <h3 className="font-semibold text-warmgray-900 mb-4">Leave a Review</h3>

      <div className="mb-4">
        <label className="block text-xs font-medium text-warmgray-600 mb-2">Rating</label>
        <div className="flex items-center gap-3">
          <StarRating rating={rating} size="lg" interactive onChange={setRating} />
          <span className="text-sm text-warmgray-400">{rating}/5</span>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-medium text-warmgray-600 mb-1.5">Comment</label>
        <textarea
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-4 py-2.5 bg-warmgray-50 border border-warmgray-200 rounded-xl text-sm text-warmgray-900 placeholder-warmgray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
          placeholder="How was your experience?"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors shadow-warm disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
