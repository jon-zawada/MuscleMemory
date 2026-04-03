import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError, JwtPayload, TokenExpiredError } from "jsonwebtoken";
import { config } from "../config";
import { User, UserRole } from "../types/user";

export const jwtMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    res.status(401).json({ error: "No Authorization header found" });
    return;
  }
  // Expected format: "Bearer <token>"
  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    res.status(401).json({ error: "Invalid Authorization format" });
    return;
  }
  try {
    const decodedToken = jwt.verify(token, config.jwtSecret);
    req.user = decodedToken as JwtPayload & User;
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(401).json({ error: "Token expired" });
      return;
    } else if (error instanceof JsonWebTokenError) {
      res.status(401).json({ error: "Invalid token" });
      return;
    } else {
      res.status(500).json({ error: "Internal Server error" });
      return;
    }
  }
};

export const requireRoleMiddleware = (role: UserRole) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (role !== req.user.role) {
      res.status(403).json({ error: "Insufficient permissions" });
      return;
    }
    next();
  };
};
