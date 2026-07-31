"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rentalOrderController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const rentalOrder_service_1 = require("./rentalOrder.service");
const createRentalOrder = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const customerId = req.user.id;
    const result = await rentalOrder_service_1.rentalOrderService.createRentalOrderIntoDb(req.body, customerId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Rental order created successfully",
        data: result,
    });
});
const getMyOrders = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const customerId = req.user.id;
    const result = await rentalOrder_service_1.rentalOrderService.getMyOrdersFromDb(customerId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Rental orders retrieved successfully",
        data: result,
    });
});
const getOrderById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user.id;
    const result = await rentalOrder_service_1.rentalOrderService.getOrderByIdFromDb(req.params.id, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Rental order retrieved successfully",
        data: result,
    });
});
exports.rentalOrderController = {
    createRentalOrder,
    getMyOrders,
    getOrderById,
};
