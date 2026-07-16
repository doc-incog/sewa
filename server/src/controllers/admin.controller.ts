import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import { Provider } from "../models/Provider";
import { Booking } from "../models/Booking";
import { Service } from "../models/Service";
import { Payment } from "../models/Payment";
import { AuthRequest } from "../middleware/auth.middleware";

export const getDashboardStats = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [totalUsers, totalProviders, totalBookings, totalServices, totalPayments] = await Promise.all([
      User.countDocuments({ role: "user" }),
      Provider.countDocuments(),
      Booking.countDocuments(),
      Service.countDocuments({ active: true }),
      Payment.countDocuments({ status: "completed" }),
    ]);

    const revenue = await Payment.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const bookingsByStatus = await Booking.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const recentBookings = await Booking.find()
      .populate("userId", "name email")
      .populate("providerId")
      .populate("serviceId")
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalProviders,
          totalBookings,
          totalServices,
          totalPayments,
          totalRevenue: revenue[0]?.total || 0,
        },
        bookingsByStatus: bookingsByStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {} as Record<string, number>),
        recentBookings,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page = "1", limit = "20", search, role } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const filter: any = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (role) filter.role = role;

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      User.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: { users, total, page: pageNum, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllProviders = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page = "1", limit = "20", search, verified } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const filter: any = {};
    if (verified !== undefined) filter.verified = verified === "true";

    const providers = await Provider.find(filter)
      .populate("userId", "-password")
      .populate("services")
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    const total = await Provider.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: { providers, total, page: pageNum, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyProvider = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const provider = await Provider.findByIdAndUpdate(
      req.params.id,
      { verified: req.body.verified },
      { new: true }
    ).populate("userId", "-password");

    if (!provider) {
      res.status(404).json({ success: false, message: "Provider not found" });
      return;
    }

    res.status(200).json({ success: true, data: { provider } });
  } catch (error) {
    next(error);
  }
};

export const banUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    if (user.role === "admin") {
      res.status(400).json({ success: false, message: "Cannot ban admin users" });
      return;
    }

    await User.findByIdAndDelete(req.params.id);

    if (user.role === "provider") {
      await Provider.findOneAndDelete({ userId: user._id });
    }

    res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    next(error);
  }
};

export const getAllBookings = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page = "1", limit = "20", status } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const filter: any = {};
    if (status) filter.status = status;

    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate("userId", "name email")
        .populate("providerId")
        .populate("serviceId")
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Booking.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: { bookings, total, page: pageNum, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (error) {
    next(error);
  }
};

export const createService = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ success: true, data: { service } });
  } catch (error) {
    next(error);
  }
};

export const updateService = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) {
      res.status(404).json({ success: false, message: "Service not found" });
      return;
    }
    res.status(200).json({ success: true, data: { service } });
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Service deleted" });
  } catch (error) {
    next(error);
  }
};

export const getAllServices = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const services = await Service.find().sort({ category: 1, name: 1 });
    res.status(200).json({ success: true, data: { services } });
  } catch (error) {
    next(error);
  }
};
