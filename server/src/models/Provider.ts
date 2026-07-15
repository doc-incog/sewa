import mongoose, { Schema, Document } from "mongoose";

export interface IProvider extends Document {
  userId: mongoose.Types.ObjectId;
  businessName: string;
  description: string;
  services: mongoose.Types.ObjectId[];
  avgRating: number;
  totalReviews: number;
  totalJobs: number;
  serviceArea: {
    type: string;
    coordinates: number[];
    radius: number;
  };
  availability: {
    day: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  }[];
  verified: boolean;
  documents: string[];
  createdAt: Date;
  updatedAt: Date;
}

const providerSchema = new Schema<IProvider>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    businessName: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    services: [{ type: Schema.Types.ObjectId, ref: "Service" }],
    avgRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    totalJobs: { type: Number, default: 0 },
    serviceArea: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
      radius: { type: Number, default: 10 },
    },
    availability: [
      {
        day: { type: String, enum: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] },
        startTime: { type: String, default: "09:00" },
        endTime: { type: String, default: "18:00" },
        isAvailable: { type: Boolean, default: true },
      },
    ],
    verified: { type: Boolean, default: false },
    documents: [{ type: String }],
  },
  { timestamps: true }
);

providerSchema.index({ serviceArea: "2dsphere" });

export const Provider = mongoose.model<IProvider>("Provider", providerSchema);
