"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Review, User } from "@shared/types";
import Avatar from "./ui/Avatar";
import StarRating from "./ui/StarRating";
import EmptyState from "./ui/EmptyState";
import { MessageSquare } from "lucide-react";

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
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="bg-warmgray-50 p-4 rounded-xl animate-pulse">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full shimmer-bg" />
              <div className="h-3 w-24 rounded shimmer-bg" />
            </div>
            <div className="h-3 w-3/4 rounded shimmer-bg" />
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <EmptyState
        icon={<MessageSquare className="w-7 h-7 text-warmgray-400" />}
        title="No reviews yet"
        description="Be the first to leave a review for this provider."
      />
    );
  }

  return (
    <div className="space-y-3">
      {reviews.map((review) => {
        const user = typeof review.userId === "object" ? review.userId : null;
        return (
          <div key={review._id} className="bg-warmgray-50 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <Avatar name={user?.name || "U"} size="sm" />
              <div className="flex-1 min-w-0">
                <span className="font-medium text-warmgray-900 text-sm block truncate">
                  {user?.name || "User"}
                </span>
                <StarRating rating={review.rating} size="sm" />
              </div>
              <span className="text-xs text-warmgray-400 shrink-0">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            {review.comment && (
              <p className="text-sm text-warmgray-600 leading-relaxed">{review.comment}</p>
            )}
            {review.reply && (
              <div className="mt-3 pl-3 border-l-2 border-primary-200 bg-white rounded-r-lg p-3">
                <p className="text-xs text-warmgray-400 font-medium mb-0.5">Provider reply</p>
                <p className="text-sm text-warmgray-600">{review.reply}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
