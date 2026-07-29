import express,{ Application, Request, Response } from "express";
import cors from "cors";
import  httpStatus  from "http-status";
import { prisma } from "./lib/prisma";

import { authRoutes } from "./module/auth/auth.route";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { notFound } from "./middleware/notFound";
import { categoryRoutes } from "./module/category/category.routes";
import { gearItemRoutes } from "./module/gearItem/gearItem.route";
import { providerRoutes } from "./module/gearItem/provider.route";
import { rentalOrderRoutes } from "./module/rentalOrder/rentalOrder.route";
import { paymentRoutes } from "./module/payment/payment.route";
import { reviewRoutes } from "./module/review/review.route";
import { adminRoutes } from "./module/admin/admin.route";
const app:Application = express()
app.use(cors())
app.use(express.json())
app.get('/',async (req:Request,res:Response) => {
    const user = await prisma.user.findMany();
    // console.log("user:",user)

    return res.status(httpStatus.OK).json({
          success: true,
          message:"GearUp server is running",

    })
})


app.use("/api/auth",authRoutes)
app.use("/api/categories",categoryRoutes)
app.use("/api/gear", gearItemRoutes);
app.use("/api/provider", providerRoutes);
app.use("/api/rentals", rentalOrderRoutes);
app.use("/api/payments",paymentRoutes)
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin",adminRoutes)

app.use(notFound)
app.use(globalErrorHandler)
export default app