import { Router } from "express";
import * as notificationController from "../controllers/notification.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authenticate, notificationController.getMyNotifications);
router.put("/read-all", authenticate, notificationController.markAllAsRead);
router.put("/:id/read", authenticate, notificationController.markAsRead);
router.delete("/:id", authenticate, notificationController.deleteNotification);

export default router;
