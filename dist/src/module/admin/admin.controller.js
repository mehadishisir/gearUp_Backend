"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllRentals = exports.getAllGear = exports.updateUserStatus = exports.getAllUsers = void 0;
const catchAsync_js_1 = require("../../utils/catchAsync.js");
const admin_service_js_1 = require("./admin.service.js");
const sendResponse_js_1 = __importDefault(require("../../utils/sendResponse.js"));
const getAllUsers = (0, catchAsync_js_1.catchAsync)(async (req, res) => {
    const result = await (0, admin_service_js_1.getAllUsersFromDb)();
    (0, sendResponse_js_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Users retrieved successfully",
        data: result,
    });
});
exports.getAllUsers = getAllUsers;
const updateUserStatus = (0, catchAsync_js_1.catchAsync)(async (req, res) => {
    const result = await (0, admin_service_js_1.updateUserStatusInDb)(req.params.id, req.body.status);
    (0, sendResponse_js_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "User status updated successfully",
        data: result,
    });
});
exports.updateUserStatus = updateUserStatus;
const getAllGear = (0, catchAsync_js_1.catchAsync)(async (req, res) => {
    const result = await (0, admin_service_js_1.getAllGearFromDb)();
    (0, sendResponse_js_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Gear items retrieved successfully",
        data: result,
    });
});
exports.getAllGear = getAllGear;
const getAllRentals = (0, catchAsync_js_1.catchAsync)(async (req, res) => {
    const result = await (0, admin_service_js_1.getAllRentalsFromDb)();
    (0, sendResponse_js_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Rentals retrieved successfully",
        data: result,
    });
});
exports.getAllRentals = getAllRentals;
