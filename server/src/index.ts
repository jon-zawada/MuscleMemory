import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import pool from "./db";
import authRouter from "./routes/authRoutes";
import { logger } from "./utils/logger";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // need later for httpOnly refresh token cookie
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);

const start = async (): Promise<void> => {
  await pool.query("SELECT 1");
  logger.info("[SERVER] Connected to PSQL");
  app.listen(PORT, () => {
    logger.log(`[SERVER] Muscle Memory serving on port ${PORT}`);
  });
};

start().catch((err) => {
  logger.error(`[SERVER] Failed to connect to PSQL: ${err}`);
  process.exit(1);
});
