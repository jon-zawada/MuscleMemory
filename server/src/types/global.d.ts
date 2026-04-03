declare global {
  namespace Express {
    interface Request {
      user?: import("jsonwebtoken").JwtPayload & import("../types/user").User;
    }
  }
}

export {};
