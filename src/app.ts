console.log("APP LOADED");

import express, { Application, Request, Response } from "express";
import cors from "cors";


import { authRoutes } from "./module/auth/auth.route.js";
import { categoryRoutes } from "./module/category/category.routes.js";
import { gearItemRoutes } from "./module/gearItem/gearItem.route.js";
import { providerRoutes } from "./module/gearItem/provider.route.js";
import { rentalOrderRoutes } from "./module/rentalOrder/rentalOrder.route.js";
import { paymentRoutes } from "./module/payment/payment.route.js";
import { reviewRoutes } from "./module/review/review.route.js";
import { adminRoutes } from "./module/admin/admin.route.js";

import { globalErrorHandler } from "./middleware/globalErrorHandler.js";
import { notFound } from "./middleware/notFound.js";
import cookieParser from "cookie-parser";

const app: Application = express();

app.use(cors({
  origin: true,
  credentials: true,
}) as any);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "GearUp server is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/gear", gearItemRoutes);
app.use("/api/provider", providerRoutes);
app.use("/api/rentals", rentalOrderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(globalErrorHandler);

export default app;