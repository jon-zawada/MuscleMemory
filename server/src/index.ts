import express from "express";
import dotenv from "dotenv";
import path from "path";
import type { Request, Response } from "express";
import { logger } from "./utils/logger";
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World from Express!");
});

app.listen(PORT, () => {
  logger.log(`[SERVER] listening on port ${PORT}`);
});
