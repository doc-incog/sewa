import { Request, Response, NextFunction } from "express";
import { Review } from "../models/Review";
import { Booking } from "../models/Booking";
import { Provider } from "../models/Provider";
import { AuthRequest } from "../middleware/auth.middleware";

export const createReview = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { bookingId, rating, comment } = req.body;

    const booking = await Booking.findOne({ _id: bookingId, userId: req.user!.userId });
    if (!booking) {
      res.status(404).json({ success: false, message: "Booking not found" });
      return;
    }

    if (booking.status !== "completed") {
      res.status(400).json({ success: false, message: "Can only review completed bookings" });
      return;
    }

    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
      res.status(400).json({ success: false, message: "Already reviewed this booking" });
      return;
    }

    const review = await Review.create({
      bookingId,
      userId: req.user!.userId,
      providerId: booking.providerId,
      rating,
      comment,
    });

    const providerReviews = await Review.find({ providerId: booking.providerId });
    const totalRating = providerReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = totalRating / providerReviews.length;

    await Provider.findByIdAndUpdate(booking.providerId, {
      avgRating: Math.round(avgRating * 10) / 10,
      totalReviews: providerReviews.length,
    });

    res.status(201).json({ success: true, message: "Review submitted", data: { review } });
  } catch (error) {
    next(error);
  }
};

export const getReviewsByProvider = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const reviews = await Review.find({ providerId: req.params.providerId })
      .populate("userId", "name avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: { reviews } });
  } catch (error) {
    next(error);
  }
};

export const replyToReview = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const provider = await Provider.findOne({ userId: req.user!.userId });
    if (!provider) {
      res.status(404).json({ success: false, message: "Provider not found" });
      return;
    }

    const review = await Review.findOne({ _id: req.params.id, providerId: provider._id });
    if (!review) {
      res.status(404).json({ success: false, message: "Review not found" });
      return;
    }

    review.reply = req.body.reply;
    await review.save();

    res.status(200).json({ success: true, data: { review } });
  } catch (error) {
    next(error);
  }
};
