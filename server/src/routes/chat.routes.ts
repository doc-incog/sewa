import { Router } from "express";
import * as chatController from "../controllers/chat.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authenticate, chatController.getMyChats);
router.get("/unread", authenticate, chatController.getUnreadCount);
router.post("/create", authenticate, chatController.createChat);
router.get("/:chatId/messages", authenticate, chatController.getChatMessages);
router.post("/message", authenticate, chatController.sendMessage);

export default router;
