"use client";

import { useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface ReviewFormProps {
  bookingId: string;
  onReviewSubmitted: () => void;
}

export default function ReviewForm({ bookingId, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

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
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-100">
      <h3 className="font-semibold text-gray-900 mb-4">Leave a Review</h3>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(star)}
              className={`text-3xl transition-colors ${
                star <= (hoveredRating || rating) ? "text-yellow-400" : "text-gray-200"
              }`}
            >
              ★
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-500 self-center">{rating}/5</span>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
        <textarea
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="How was your experience?"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
