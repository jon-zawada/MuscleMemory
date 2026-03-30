import express from "express";
import dotenv from "dotenv";
import path from "path";
import type { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World from Express!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
