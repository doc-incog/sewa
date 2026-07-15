import { Router } from "express";
import * as bookingController from "../controllers/booking.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authenticate, bookingController.createBooking);
router.get("/my", authenticate, bookingController.getMyBookings);
router.get("/provider", authenticate, bookingController.getProviderBookings);
router.put("/:id/accept", authenticate, bookingController.acceptBooking);
router.put("/:id/complete", authenticate, bookingController.completeBooking);
router.put("/:id/cancel", authenticate, bookingController.cancelBooking);

export default router;
