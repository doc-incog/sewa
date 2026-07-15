import mongoose, { Schema, Document } from "mongoose";

export interface IService extends Document {
  name: string;
  category: string;
  description: string;
  basePrice: number;
  duration: number;
  icon: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    basePrice: { type: Number, required: true, min: 0 },
    duration: { type: Number, required: true, min: 15 },
    icon: { type: String, default: "" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Service = mongoose.model<IService>("Service", serviceSchema);
