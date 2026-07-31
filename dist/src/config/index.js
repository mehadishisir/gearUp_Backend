"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), ".env") });
exports.default = {
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    app_url: process.env.APP_URL,
    bycrypt_salt_rounds: process.env.BYCRYPT_SALT_ROUNDS,
    jwt_access_token_secret: process.env.JWT_ACCESS_TOKEN_SECRET,
    jwt_refresh_token_secret: process.env.JWT_REFRESH_TOKEN_SECRET,
    jwt_access_token_expiration_time: process.env.JWT_ACCESS_TOKEN_EXPIRATION,
    jwt_refresh_token_expiration_time: process.env.JWT_REFRESH_TOKEN_EXPIRATION,
    stripe_secret_key: process.env.STRIPE_SECRET_KEY,
};
