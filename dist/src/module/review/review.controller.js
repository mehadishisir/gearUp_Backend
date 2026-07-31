"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReviewsByGearItem = exports.createReview = void 0;
const review_service_1 = require("./review.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const catchAsync_1 = require("../../utils/catchAsync");
const createReview = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await (0, review_service_1.createReviewDb)(req.user.id, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 201,
        message: "Review submitted successfully",
        data: result,
    });
});
exports.createReview = createReview;
const getReviewsByGearItem = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await (0, review_service_1.getReviewsByGearItemDb)(req.params.gearItemId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Reviews retrieved successfully",
        data: result,
    });
});
exports.getReviewsByGearItem = getReviewsByGearItem;
