"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Review, User } from "../../shared/types";

interface ReviewListProps {
  providerId: string;
}

export default function ReviewList({ providerId }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [providerId]);

  const fetchReviews = async () => {
    try {
      const { data } = await api.get(`/reviews/provider/${providerId}`);
      setReviews(data.data.reviews);
    } catch (error) {
      console.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-gray-50 p-4 rounded-lg animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No reviews yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => {
        const user = typeof review.userId === "object" ? review.userId : null;
        return (
          <div key={review._id} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold">
                {user?.name?.charAt(0) || "U"}
              </div>
              <span className="font-medium text-gray-900 text-sm">{user?.name || "User"}</span>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={`text-sm ${star <= review.rating ? "text-yellow-400" : "text-gray-200"}`}>
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xs text-gray-400 ml-auto">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            {review.comment && (
              <p className="text-sm text-gray-600">{review.comment}</p>
            )}
            {review.reply && (
              <div className="mt-3 pl-4 border-l-2 border-primary-200">
                <p className="text-xs text-gray-500 font-medium mb-1">Provider reply:</p>
                <p className="text-sm text-gray-600">{review.reply}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
