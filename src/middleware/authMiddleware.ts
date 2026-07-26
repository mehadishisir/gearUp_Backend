import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { Role } from "../../prisma/generated/prisma/enums"; // তোমার actual generated path
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
    const token = req.headers.authorization?.startsWith("Bearer")
      ? req.headers.authorization.split(" ")[1]
      : undefined;

    if (!token) {
      throw new Error("Please login first");
    }

    const decoded: any = verifyToken(token, config.jwt_access_token_secret);
    const { id, name, email, role } = decoded;

    if (roles.length && !roles.includes(role)) {
      throw new Error("Forbidden: insufficient permissions");
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new Error("User not found");
    }

    if (user.status === "SUSPENDED") {
      throw new Error("Your account is suspended");
    }

    req.user = { id, name, email, role };
    next();
  });