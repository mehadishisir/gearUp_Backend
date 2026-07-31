"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const payment_service_1 = require("./payment.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const createPaymentSession = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { rentalOrderId } = req.body;
    const result = await payment_service_1.paymentService.createPaymentSession(rentalOrderId, req.user.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Payment session created successfully",
        data: result,
    });
});
const confirmPayment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { sessionId } = req.body;
    const result = await payment_service_1.paymentService.confirmPayment(sessionId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Payment confirmed successfully",
        data: result,
    });
});
const getMyPayments = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await payment_service_1.paymentService.getMyPaymentsFromDb(req.user.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Payments retrieved successfully",
        data: result,
    });
});
const getPaymentById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const result = await payment_service_1.paymentService.getPaymentByIdFromDb(id, req.user.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Payment retrieved successfully",
        data: result,
    });
});
exports.paymentController = {
    createPaymentSession,
    confirmPayment,
    getMyPayments,
    getPaymentById,
};
