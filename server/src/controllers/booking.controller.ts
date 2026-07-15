import { Request, Response, NextFunction } from "express";
import { Booking } from "../models/Booking";
import { Provider } from "../models/Provider";
import { AuthRequest } from "../middleware/auth.middleware";

export const createBooking = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { providerId, serviceId, date, timeSlot, amount, address, notes } = req.body;

    const provider = await Provider.findById(providerId);
    if (!provider) {
      res.status(404).json({ success: false, message: "Provider not found" });
      return;
    }

    const booking = await Booking.create({
      userId: req.user!.userId,
      providerId,
      serviceId,
      date,
      timeSlot,
      amount,
      address,
      notes,
    });

    res.status(201).json({ success: true, message: "Booking created", data: { booking } });
  } catch (error) {
    next(error);
  }
};

export const getMyBookings = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const bookings = await Booking.find({ userId: req.user!.userId })
      .populate("providerId")
      .populate("serviceId")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: { bookings } });
  } catch (error) {
    next(error);
  }
};

export const getProviderBookings = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const provider = await Provider.findOne({ userId: req.user!.userId });
    if (!provider) {
      res.status(404).json({ success: false, message: "Provider profile not found" });
      return;
    }

    const { status } = req.query;
    const filter: any = { providerId: provider._id };
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .populate("userId", "-password -__v")
      .populate("serviceId")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: { bookings } });
  } catch (error) {
    next(error);
  }
};

export const acceptBooking = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const provider = await Provider.findOne({ userId: req.user!.userId });
    if (!provider) {
      res.status(404).json({ success: false, message: "Provider profile not found" });
      return;
    }

    const booking = await Booking.findOne({ _id: req.params.id, providerId: provider._id });
    if (!booking) {
      res.status(404).json({ success: false, message: "Booking not found" });
      return;
    }

    if (booking.status !== "pending") {
      res.status(400).json({ success: false, message: "Booking cannot be accepted" });
      return;
    }

    booking.status = "confirmed";
    await booking.save();

    res.status(200).json({ success: true, message: "Booking accepted", data: { booking } });
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      $or: [
        { userId: req.user!.userId },
        { providerId: { $exists: true } },
      ],
    }).populate("providerId");

    if (!booking) {
      res.status(404).json({ success: false, message: "Booking not found" });
      return;
    }

    if (booking.status === "completed" || booking.status === "cancelled") {
      res.status(400).json({ success: false, message: "Booking cannot be cancelled" });
      return;
    }

    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({ success: true, message: "Booking cancelled", data: { booking } });
  } catch (error) {
    next(error);
  }
};

export const completeBooking = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const provider = await Provider.findOne({ userId: req.user!.userId });
    if (!provider) {
      res.status(404).json({ success: false, message: "Provider profile not found" });
      return;
    }

    const booking = await Booking.findOne({ _id: req.params.id, providerId: provider._id });
    if (!booking) {
      res.status(404).json({ success: false, message: "Booking not found" });
      return;
    }

    if (booking.status !== "confirmed" && booking.status !== "in_progress") {
      res.status(400).json({ success: false, message: "Booking cannot be completed" });
      return;
    }

    booking.status = "completed";
    await booking.save();

    await Provider.findByIdAndUpdate(provider._id, { $inc: { totalJobs: 1 } });

    res.status(200).json({ success: true, message: "Booking completed", data: { booking } });
  } catch (error) {
    next(error);
  }
};
