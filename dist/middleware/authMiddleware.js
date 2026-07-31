"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const config_1 = __importDefault(require("../config"));
const prisma_1 = require("../lib/prisma");
const jwt_1 = require("../utils/jwt");
const catchAsync_1 = require("../utils/catchAsync");
const auth = (...roles) => (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const token = req.headers.authorization?.startsWith("Bearer")
        ? req.headers.authorization.split(" ")[1]
        : undefined;
    if (!token) {
        throw new Error("Please login first");
    }
    const decoded = (0, jwt_1.verifyToken)(token, config_1.default.jwt_access_token_secret);
    const { id, name, email, role } = decoded;
    if (roles.length && !roles.includes(role)) {
        throw new Error("Forbidden: insufficient permissions");
    }
    const user = await prisma_1.prisma.user.findUnique({ where: { id } });
    if (!user) {
        throw new Error("User not found");
    }
    if (user.status === "SUSPENDED") {
        throw new Error("Your account is suspended");
    }
    req.user = { id, name, email, role };
    next();
});
exports.auth = auth;
