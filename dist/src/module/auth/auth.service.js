"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const prisma_1 = require("../../lib/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../config"));
const jwt_1 = require("../../utils/jwt");
const registerIntoDb = async (payload) => {
    const { name, email, password, role, phone } = payload;
    const isUserExist = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (isUserExist) {
        const error = new Error("User already exists");
        error.statusCode = 409;
        throw error;
    }
    const hashPassword = await bcrypt_1.default.hash(password, Number(config_1.default.bycrypt_salt_rounds));
    const createUser = await prisma_1.prisma.user.create({
        data: { name, email, password: hashPassword, role, phone },
        omit: { password: true },
    });
    return createUser;
};
const loginUserIntoDb = async (payload) => {
    const { email, password } = payload;
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }
    const isPassword = await bcrypt_1.default.compare(password, user.password);
    if (!isPassword) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }
    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
    const accessToken = (0, jwt_1.createToken)(jwtPayload, config_1.default.jwt_access_token_secret, config_1.default.jwt_access_token_expiration_time);
    const refreshToken = (0, jwt_1.createToken)(jwtPayload, config_1.default.jwt_refresh_token_secret, config_1.default.jwt_refresh_token_expiration_time);
    return { accessToken, refreshToken };
};
const getMe = async (userId) => {
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
        omit: { password: true },
    });
    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }
    return user;
};
exports.authService = {
    registerIntoDb,
    loginUserIntoDb,
    getMe,
};
