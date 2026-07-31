"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const category_service_1 = require("./category.service");
const createCategory = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await category_service_1.categoryService.createCategoryIntoDb(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Category created successfully",
        data: result,
    });
});
const getAllCategories = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await category_service_1.categoryService.getAllCategoriesFromDb();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Categories retrieved successfully",
        data: result,
    });
});
const updateCategory = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const result = await category_service_1.categoryService.updateCategoryIntoDb(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Category updated successfully",
        data: result,
    });
});
const deleteCategory = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    await category_service_1.categoryService.deleteCategoryFromDb(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Category deleted successfully",
        data: null,
    });
});
exports.categoryController = {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory
};
