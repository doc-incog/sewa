import { Router } from "express";
import * as paymentController from "../controllers/payment.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/create-intent", authenticate, paymentController.createPaymentIntent);
router.post("/confirm", authenticate, paymentController.confirmPayment);
router.get("/my", authenticate, paymentController.getMyPayments);
router.get("/provider", authenticate, paymentController.getProviderPayments);
router.post("/:id/refund", authenticate, paymentController.refundPayment);

export default router;
