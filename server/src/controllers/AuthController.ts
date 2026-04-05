import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Pool } from "pg";
import { StringValue } from "ms";
import { config } from "../config";
import { REFRESH_TOKEN } from "../constants/cookies";
import { UNIQUE_VIOLATION } from "../constants/pgErrorCodes";
import { RefreshTokenRepo } from "../repositories/RefreshTokenRepo";
import { UserRepo } from "../repositories/UserRepo";
import { isPostgresError } from "../utils/db";
import { logger } from "../utils/logger";
import { isValidEmail, isValidPassword } from "../utils/validation/validate";

class AuthController {
  private userRepo: UserRepo;
  private refreshTokenRepo: RefreshTokenRepo;
  constructor(pool: Pool) {
    this.userRepo = new UserRepo(pool);
    this.refreshTokenRepo = new RefreshTokenRepo(pool);
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
      if (isPostgresError(error) && error.code === UNIQUE_VIOLATION) {
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
      await this.refreshTokenRepo.deleteTokensByUserId(safeUser.id);
      const refreshToken = await this.refreshTokenRepo.createToken(safeUser.id);
      res.cookie(REFRESH_TOKEN, refreshToken, {
        httpOnly: true,
        secure: config.nodeEnv === "production",
        sameSite: "strict",
      });

      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      logger.error("[SERVER]" + error);
      res.status(500).json({ error: "Internal Server error" });
    }
  };

  refresh = async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies[REFRESH_TOKEN];
    if (!refreshToken) {
      res.status(401).json({ error: "No refresh token provided" });
      return;
    }

    try {
      const storedRefToken = await this.refreshTokenRepo.findByToken(refreshToken);
      if (!storedRefToken) {
        res.status(401).json({ error: "No token found" });
        return;
      }
      const { expiresAt, userId } = storedRefToken;
      if (expiresAt < new Date()) {
        await this.refreshTokenRepo.deleteToken(refreshToken);
        res.status(403).json({ error: "Expired Token" });
        return;
      }
      const user = await this.userRepo.getUserById(userId);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      const token = jwt.sign(user, config.jwtSecret, {
        algorithm: "HS256",
        expiresIn: config.jwtExpiresIn as StringValue,
      });
      await this.refreshTokenRepo.deleteToken(refreshToken);
      const newRefreshToken = await this.refreshTokenRepo.createToken(user.id);
      res.cookie(REFRESH_TOKEN, newRefreshToken, {
        httpOnly: true,
        secure: config.nodeEnv === "production",
        sameSite: "strict",
      });
      res.status(200).json({ message: "Token refreshed", token });
    } catch (error) {
      logger.error("[SERVER]" + error);
      res.status(500).json({ error: "Internal Server error" });
    }
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      const refreshToken = req.cookies[REFRESH_TOKEN];
      if (!refreshToken) {
        res.status(401).json({ error: "No refresh token provided" });
        return;
      }
      const storedToken = await this.refreshTokenRepo.findByToken(refreshToken);
      if (!storedToken) {
        res.status(401).json({ error: "Invalid refresh token" });
        return;
      }
      await this.refreshTokenRepo.deleteToken(refreshToken);
      res.clearCookie(REFRESH_TOKEN);
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      logger.error("[SERVER]" + error);
      res.status(500).json({ error: "Internal Server error" });
    }
  };
}

export default AuthController;
