"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gearItemController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const gearItem_service_1 = require("./gearItem.service");
const createGearItem = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const providerId = req.user.id;
    const result = await gearItem_service_1.gearItemService.createGearItemIntoDb(req.body, providerId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Gear item created successfully",
        data: result,
    });
});
const getAllGear = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await gearItem_service_1.gearItemService.getAllGearFromDb(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Gear items retrieved successfully",
        meta: result.meta,
        data: result.data
    });
});
const getGearById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await gearItem_service_1.gearItemService.getGearByIdFromDb(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Gear item retrieved successfully",
        data: result,
    });
});
const updateGearItem = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const providerId = req.user.id;
    const result = await gearItem_service_1.gearItemService.updateGearItemIntoDb(req.params.id, req.body, providerId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Gear item updated successfully",
        data: result,
    });
});
const deleteGearItem = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const providerId = req.user.id;
    await gearItem_service_1.gearItemService.deleteGearItemFromDb(req.params.id, providerId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Gear item deleted successfully",
        data: null,
    });
});
const getProviderOrders = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const providerId = req.user.id;
    const result = await gearItem_service_1.gearItemService.getProviderOrdersFromDb(providerId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Provider orders retrieved successfully",
        data: result,
    });
});
const updateOrderStatus = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const providerId = req.user.id;
    const { status } = req.body;
    const result = await gearItem_service_1.gearItemService.updateOrderStatusIntoDb(providerId, req.params.id, status);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Order status updated successfully",
        data: result,
    });
});
exports.gearItemController = {
    createGearItem,
    getAllGear,
    getGearById,
    updateGearItem,
    deleteGearItem,
    getProviderOrders,
    updateOrderStatus,
};
