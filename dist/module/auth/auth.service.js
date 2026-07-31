import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import config from "../../config";
import { createToken } from "../../utils/jwt";
const registerIntoDb = async (payload) => {
    const { name, email, password, role, phone } = payload;
    const isUserExist = await prisma.user.findUnique({ where: { email } });
    if (isUserExist) {
        const error = new Error("User already exists");
        error.statusCode = 409;
        throw error;
    }
    const hashPassword = await bcrypt.hash(password, Number(config.bycrypt_salt_rounds));
    const createUser = await prisma.user.create({
        data: { name, email, password: hashPassword, role, phone },
        omit: { password: true },
    });
    return createUser;
};
const loginUserIntoDb = async (payload) => {
    const { email, password } = payload;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }
    const isPassword = await bcrypt.compare(password, user.password);
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
    const accessToken = createToken(jwtPayload, config.jwt_access_token_secret, config.jwt_access_token_expiration_time);
    const refreshToken = createToken(jwtPayload, config.jwt_refresh_token_secret, config.jwt_refresh_token_expiration_time);
    return { accessToken, refreshToken };
};
const getMe = async (userId) => {
    const user = await prisma.user.findUnique({
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
export const authService = {
    registerIntoDb,
    loginUserIntoDb,
    getMe,
};
