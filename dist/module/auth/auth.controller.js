"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const auth_service_1 = require("./auth.service");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const registerUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await auth_service_1.authService.registerIntoDb(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "User registered successfully",
        data: result,
    });
});
const logInUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const payload = req.body;
    const result = await auth_service_1.authService.loginUserIntoDb(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User logged in successfully",
        data: result,
    });
});
const getMe = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = req.user?.id;
    const result = await auth_service_1.authService.getMe(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User profile retrieved successfully",
        data: result,
    });
});
exports.authController = { registerUser, logInUser, getMe };
