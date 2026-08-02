import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { Role } from "../../prisma/generated/prisma/enums";
import config from "../config";
import { prisma } from "../lib/prisma";

import { verifyToken } from "../utils/jwt";
import { catchAsync } from "../utils/catchAsync";

declare global {
  namespace Express {
    interface Request {
      user?: { email: string; id: string; name: string; role: Role };
    }
  }
}

export const auth = (...roles: Role[]) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const headerToken = req.headers.authorization?.startsWith("Bearer")
      ? req.headers.authorization.split(" ")[1]
      : undefined;

    const token = headerToken ?? req.cookies?.accessToken;

    if (!token) {
      const error: any = new Error("Please login first");
      error.statusCode = 401;
      throw error;
    }

    let decoded: any;
    try {
      decoded = verifyToken(token, config.jwt_access_token_secret);
    } catch {
      const error: any = new Error("Invalid or expired token");
      error.statusCode = 401;
      throw error;
    }

    const { id, name, email, role } = decoded;

    if (roles.length && !roles.includes(role)) {
      const error: any = new Error("Forbidden: insufficient permissions");
      error.statusCode = 403;
      throw error;
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      const error: any = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    if (user.status === "SUSPENDED") {
      const error: any = new Error("Your account is suspended");
      error.statusCode = 403;
      throw error;
    }

    req.user = { id, name, email, role };
    next();
  });