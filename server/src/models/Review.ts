import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  bookingId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  providerId: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  reply: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    providerId: { type: Schema.Types.ObjectId, ref: "Provider", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "" },
    reply: { type: String, default: "" },
  },
  { timestamps: true }
);

reviewSchema.index({ providerId: 1, createdAt: -1 });

export const Review = mongoose.model<IReview>("Review", reviewSchema);
