import { Request, Response, NextFunction } from "express";
import { Chat } from "../models/Chat";
import { Message } from "../models/Message";
import { AuthRequest } from "../middleware/auth.middleware";

export const getMyChats = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const chats = await Chat.find({ participants: req.user!.userId })
      .populate("participants", "name avatar")
      .populate("bookingId")
      .sort({ lastMessageAt: -1 });

    res.status(200).json({ success: true, data: { chats } });
  } catch (error) {
    next(error);
  }
};

export const getChatMessages = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const chat = await Chat.findById(req.params.chatId);
    if (!chat) {
      res.status(404).json({ success: false, message: "Chat not found" });
      return;
    }

    if (!chat.participants.includes(req.user!.userId as any)) {
      res.status(403).json({ success: false, message: "Not authorized" });
      return;
    }

    const messages = await Message.find({ chatId: req.params.chatId })
      .populate("senderId", "name avatar")
      .sort({ createdAt: 1 });

    await Message.updateMany(
      { chatId: req.params.chatId, senderId: { $ne: req.user!.userId }, read: false },
      { read: true }
    );

    res.status(200).json({ success: true, data: { messages } });
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { chatId, text } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      res.status(404).json({ success: false, message: "Chat not found" });
      return;
    }

    if (!chat.participants.includes(req.user!.userId as any)) {
      res.status(403).json({ success: false, message: "Not authorized" });
      return;
    }

    const message = await Message.create({
      chatId,
      senderId: req.user!.userId,
      text,
    });

    chat.lastMessage = text;
    chat.lastMessageAt = new Date();
    await chat.save();

    const populatedMessage = await Message.findById(message._id)
      .populate("senderId", "name avatar");

    res.status(201).json({ success: true, data: { message: populatedMessage } });
  } catch (error) {
    next(error);
  }
};

export const createChat = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { participantId, bookingId } = req.body;

    let chat = await Chat.findOne({
      participants: { $all: [req.user!.userId, participantId] },
      bookingId,
    });

    if (!chat) {
      chat = await Chat.create({
        participants: [req.user!.userId, participantId],
        bookingId,
      });
    }

    const populatedChat = await Chat.findById(chat._id)
      .populate("participants", "name avatar")
      .populate("bookingId");

    res.status(201).json({ success: true, data: { chat: populatedChat } });
  } catch (error) {
    next(error);
  }
};

export const getUnreadCount = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const chats = await Chat.find({ participants: req.user!.userId });
    const chatIds = chats.map((c) => c._id);

    const unreadCount = await Message.countDocuments({
      chatId: { $in: chatIds },
      senderId: { $ne: req.user!.userId },
      read: false,
    });

    res.status(200).json({ success: true, data: { unreadCount } });
  } catch (error) {
    next(error);
  }
};
