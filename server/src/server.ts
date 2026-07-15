import app from "./app";

process.on("unhandledRejection", (err: Error) => {
  console.error("Unhandled Rejection:", err.message);
  process.exit(1);
});
