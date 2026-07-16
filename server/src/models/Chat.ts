import mongoose, { Schema, Document } from "mongoose";

export interface IChat extends Document {
  participants: mongoose.Types.ObjectId[];
  bookingId: mongoose.Types.ObjectId;
  lastMessage: string;
  lastMessageAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const chatSchema = new Schema<IChat>(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    lastMessage: { type: String, default: "" },
    lastMessageAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

chatSchema.index({ participants: 1 });
chatSchema.index({ bookingId: 1 });

export const Chat = mongoose.model<IChat>("Chat", chatSchema);
