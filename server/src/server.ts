console.log("Server starting...");

import "./app";

process.on("unhandledRejection", (err: any) => {
  console.error("Unhandled Rejection:", err?.message || err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message);
  process.exit(1);
});
