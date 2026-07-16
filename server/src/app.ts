import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { config } from "./config/env";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth.routes";
import serviceRoutes from "./routes/service.routes";
import providerRoutes from "./routes/provider.routes";
import bookingRoutes from "./routes/booking.routes";
import reviewRoutes from "./routes/review.routes";
import searchRoutes from "./routes/search.routes";
import paymentRoutes from "./routes/payment.routes";
import notificationRoutes from "./routes/notification.routes";
import chatRoutes from "./routes/chat.routes";
import adminRoutes from "./routes/admin.routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();
const httpServer = createServer(app);

const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:3000";

const io = new Server(httpServer, {
  cors: {
    origin: corsOrigin,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorHandler);

const onlineUsers = new Map<string, string>();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("user:online", (userId: string) => {
    onlineUsers.set(userId, socket.id);
    io.emit("users:online", Array.from(onlineUsers.keys()));
  });

  socket.on("chat:join", (chatId: string) => {
    socket.join(chatId);
  });

  socket.on("chat:message", (data: { chatId: string; message: any }) => {
    io.to(data.chatId).emit("chat:message", data.message);
  });

  socket.on("chat:typing", (data: { chatId: string; userId: string }) => {
    socket.to(data.chatId).emit("chat:typing", data);
  });

  socket.on("chat:stop-typing", (data: { chatId: string; userId: string }) => {
    socket.to(data.chatId).emit("chat:stop-typing", data);
  });

  socket.on("notification:new", (data: { userId: string; notification: any }) => {
    const targetSocketId = onlineUsers.get(data.userId);
    if (targetSocketId) {
      io.to(targetSocketId).emit("notification:new", data.notification);
    }
  });

  socket.on("disconnect", () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    io.emit("users:online", Array.from(onlineUsers.keys()));
    console.log("User disconnected:", socket.id);
  });
});

const startServer = async () => {
  connectDB().catch((err) => {
    console.error("DB connection failed, continuing without DB:", err.message);
  });
  httpServer.listen(config.port, () => {
    console.log(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
  });
};

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

export { app, io };
