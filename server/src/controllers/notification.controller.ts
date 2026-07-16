import { Request, Response, NextFunction } from "express";
import { Notification } from "../models/Notification";
import { AuthRequest } from "../middleware/auth.middleware";

export const getMyNotifications = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const notifications = await Notification.find({ userId: req.user!.userId })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      userId: req.user!.userId,
      read: false,
    });

    res.status(200).json({ success: true, data: { notifications, unreadCount } });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.status(200).json({ success: true, message: "Marked as read" });
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await Notification.updateMany(
      { userId: req.user!.userId, read: false },
      { read: true }
    );
    res.status(200).json({ success: true, message: "All marked as read" });
  } catch (error) {
    next(error);
  }
};

export const deleteNotification = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Deleted" });
  } catch (error) {
    next(error);
  }
};

export const createNotification = async (
  userId: string,
  type: "booking" | "payment" | "review" | "system" | "chat",
  title: string,
  message: string,
  link: string = ""
): Promise<void> => {
  await Notification.create({ userId, type, title, message, link });
};
