import { Request, Response, NextFunction } from "express";
import { Payment } from "../models/Payment";
import { Booking } from "../models/Booking";
import { AuthRequest } from "../middleware/auth.middleware";
import * as paymentService from "../services/payment.service";

export const createPaymentIntent = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findOne({ _id: bookingId, userId: req.user!.userId });
    if (!booking) {
      res.status(404).json({ success: false, message: "Booking not found" });
      return;
    }

    if (booking.paymentId) {
      res.status(400).json({ success: false, message: "Payment already exists for this booking" });
      return;
    }

    const existingPayment = await Payment.findOne({ bookingId });
    if (existingPayment && existingPayment.status === "completed") {
      res.status(400).json({ success: false, message: "Payment already completed" });
      return;
    }

    const intent = await paymentService.createPaymentIntent(booking.amount);

    let payment;
    if (existingPayment) {
      existingPayment.stripePaymentIntentId = intent.id;
      await existingPayment.save();
      payment = existingPayment;
    } else {
      payment = await Payment.create({
        bookingId,
        userId: req.user!.userId,
        providerId: booking.providerId,
        amount: booking.amount,
        stripePaymentIntentId: intent.id,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        paymentId: payment._id,
        clientSecret: intent.clientSecret,
        amount: booking.amount,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const confirmPayment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { paymentId, cardNumber, method } = req.body;

    const payment = await Payment.findOne({ _id: paymentId, userId: req.user!.userId });
    if (!payment) {
      res.status(404).json({ success: false, message: "Payment not found" });
      return;
    }

    if (payment.status === "completed") {
      res.status(400).json({ success: false, message: "Payment already completed" });
      return;
    }

    if (method === "cash") {
      payment.method = "cash";
      payment.status = "completed";
      payment.transactionId = `cash_${Date.now()}`;
      await payment.save();

      await Booking.findByIdAndUpdate(payment.bookingId, {
        paymentId: payment._id.toString(),
        status: "confirmed",
      });

      res.status(200).json({
        success: true,
        message: "Cash payment recorded",
        data: { payment },
      });
      return;
    }

    const result = await paymentService.confirmPayment(payment.stripePaymentIntentId, cardNumber);

    if (result.status === "failed") {
      payment.status = "failed";
      await payment.save();
      res.status(400).json({ success: false, message: "Payment failed. Please check card details." });
      return;
    }

    payment.transactionId = result.transactionId;
    payment.cardLast4 = result.cardLast4;
    payment.status = "completed";
    payment.method = "card";
    await payment.save();

    await Booking.findByIdAndUpdate(payment.bookingId, {
      paymentId: payment._id.toString(),
      status: "confirmed",
    });

    res.status(200).json({
      success: true,
      message: "Payment successful",
      data: { payment },
    });
  } catch (error) {
    next(error);
  }
};

export const getMyPayments = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const payments = await Payment.find({ userId: req.user!.userId })
      .populate("bookingId")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: { payments } });
  } catch (error) {
    next(error);
  }
};

export const getProviderPayments = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const payments = await Payment.find({ providerId: req.user!.userId, status: "completed" })
      .populate("bookingId")
      .sort({ createdAt: -1 });

    const totalEarnings = payments.reduce((sum, p) => sum + p.amount, 0);

    res.status(200).json({ success: true, data: { payments, totalEarnings } });
  } catch (error) {
    next(error);
  }
};

export const refundPayment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { reason } = req.body;
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      res.status(404).json({ success: false, message: "Payment not found" });
      return;
    }

    if (payment.status !== "completed") {
      res.status(400).json({ success: false, message: "Can only refund completed payments" });
      return;
    }

    const result = await paymentService.refundPayment(payment.transactionId, reason);

    if (result.success) {
      payment.status = "refunded";
      payment.refundReason = reason || "Customer requested refund";
      await payment.save();

      await Booking.findByIdAndUpdate(payment.bookingId, { status: "cancelled" });

      res.status(200).json({ success: true, message: "Refund processed", data: { payment } });
    } else {
      res.status(400).json({ success: false, message: "Refund failed" });
    }
  } catch (error) {
    next(error);
  }
};
