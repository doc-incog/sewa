import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
  bookingId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  providerId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  method: "card" | "cash" | "wallet";
  status: "pending" | "completed" | "failed" | "refunded";
  transactionId: string;
  stripePaymentIntentId: string;
  cardLast4: string;
  refundReason: string;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    providerId: { type: Schema.Types.ObjectId, ref: "Provider", required: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "NPR" },
    method: { type: String, enum: ["card", "cash", "wallet"], default: "card" },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    transactionId: { type: String, default: "" },
    stripePaymentIntentId: { type: String, default: "" },
    cardLast4: { type: String, default: "" },
    refundReason: { type: String, default: "" },
  },
  { timestamps: true }
);

paymentSchema.index({ bookingId: 1 });
paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.index({ providerId: 1, status: 1 });

export const Payment = mongoose.model<IPayment>("Payment", paymentSchema);
