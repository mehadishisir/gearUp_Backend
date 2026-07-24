import express,{ Application, Request, Response } from "express";
import cors from "cors";
import  httpStatus  from "http-status";
import { prisma } from "./lib/prisma";
import bcrypt from "bcrypt"
import config from "./config";
import { authRoutes } from "./module/auth/auth.route";
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
export default app