import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Pool } from "pg";
import { StringValue } from "ms";
import { config } from "../config";
import { UserRepo } from "../repositories/UserRepo";
import { isPostgresError } from "../utils/db";
import { logger } from "../utils/logger";
import { isValidEmail, isValidPassword } from "../utils/validation/validate";

class AuthController {
  private userRepo: UserRepo;
  constructor(pool: Pool) {
    this.userRepo = new UserRepo(pool);
  }

  signUp = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, password, email, role } = req.body;
      if (!isValidEmail(email)) {
        res.status(400).json({ error: "Invalid email address" });
        return;
      }

      if (!isValidPassword(password)) {
        res.status(400).json({ error: "Invalid password" });
        return;
      }
      const passwordHash = await bcrypt.hash(password, 10);
      await this.userRepo.createUser(email, username, passwordHash, role);
      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      if (isPostgresError(error) && error.code === "23505") {
        res
          .status(409)
          .json({ error: "A user with that email or username already exists try again" });
        return;
      }
      logger.error("[SERVER]" + error);
      res.status(500).json({ error: "Internal Server error" });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const potentialUser = await this.userRepo.getUserByEmailForLogin(email);
      if (!potentialUser) {
        res.status(401).json({ error: "Either email or password is incorrect" });
        return;
      }
      const isUser = await bcrypt.compare(password, potentialUser.passwordHash);
      if (!isUser) {
        res.status(401).json({ error: "Either email or password is incorrect" });
        return;
      }
      const { passwordHash: _, ...safeUser } = potentialUser;
      const token = jwt.sign(safeUser, config.jwtSecret, {
        algorithm: "HS256",
        expiresIn: config.jwtExpiresIn as StringValue,
      });

      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      logger.error("[SERVER]" + error);
      res.status(500).json({ error: "Internal Server error" });
    }
  };
}

export default AuthController;
