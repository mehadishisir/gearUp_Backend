"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_status_1 = __importDefault(require("http-status"));
const prisma_js_1 = require("./lib/prisma.js");
const auth_route_js_1 = require("./module/auth/auth.route.js");
const category_routes_js_1 = require("./module/category/category.routes.js");
const gearItem_route_js_1 = require("./module/gearItem/gearItem.route.js");
const provider_route_js_1 = require("./module/gearItem/provider.route.js");
const rentalOrder_route_js_1 = require("./module/rentalOrder/rentalOrder.route.js");
const payment_route_js_1 = require("./module/payment/payment.route.js");
const review_route_js_1 = require("./module/review/review.route.js");
const admin_route_js_1 = require("./module/admin/admin.route.js");
const globalErrorHandler_js_1 = require("./middleware/globalErrorHandler.js");
const notFound_js_1 = require("./middleware/notFound.js");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", async (req, res) => {
    await prisma_js_1.prisma.user.findMany();
    return res.status(http_status_1.default.OK).json({
        success: true,
        message: "GearUp server is running",
    });
});
app.use("/api/auth", auth_route_js_1.authRoutes);
app.use("/api/categories", category_routes_js_1.categoryRoutes);
app.use("/api/gear", gearItem_route_js_1.gearItemRoutes);
app.use("/api/provider", provider_route_js_1.providerRoutes);
app.use("/api/rentals", rentalOrder_route_js_1.rentalOrderRoutes);
app.use("/api/payments", payment_route_js_1.paymentRoutes);
app.use("/api/reviews", review_route_js_1.reviewRoutes);
app.use("/api/admin", admin_route_js_1.adminRoutes);
app.use(notFound_js_1.notFound);
app.use(globalErrorHandler_js_1.globalErrorHandler);
exports.default = app;
