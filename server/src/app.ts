import express from "express";
import cors from "cors";
import { config } from "./config/env";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);

app.use(errorHandler);

const startServer = async () => {
  await connectDB();
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
  });
};

startServer();

export default app;
