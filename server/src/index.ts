import express from "express";
import pool from "./db";
import authRouter from "./routes/authRoutes";
import { logger } from "./utils/logger";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

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
