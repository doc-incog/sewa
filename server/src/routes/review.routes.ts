import { Router } from "express";
import * as reviewController from "../controllers/review.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authenticate, reviewController.createReview);
router.get("/provider/:providerId", reviewController.getReviewsByProvider);
router.put("/:id/reply", authenticate, reviewController.replyToReview);

export default router;
