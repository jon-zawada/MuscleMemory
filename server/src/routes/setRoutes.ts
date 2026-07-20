import { Router } from "express";
import SetController from "../controllers/SetController";
import pool from "../db";
import { jwtMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createSetSchema, updateSetSchema } from "../schemas/set.schema";

const setController = new SetController(pool);
const router = Router();

const createMiddlewares = [jwtMiddleware, validate(createSetSchema)];
const updateMiddlewares = [jwtMiddleware, validate(updateSetSchema)];

router.get("/", jwtMiddleware, setController.getSets);
router.post("/", createMiddlewares, setController.createSet);
router.patch("/:id", updateMiddlewares, setController.updateSet);
router.delete("/:id", jwtMiddleware, setController.deleteSet);

export default router;
