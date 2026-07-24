import express,{ Application, Request, Response } from "express";
import cors from "cors";
import  httpStatus  from "http-status";
import { prisma } from "./lib/prisma";
const app:Application = express()
app.use(cors())
app.get('/',async (req:Request,res:Response) => {
    const user = await prisma.user.findMany();
    console.log("user:",user)

    return res.status(httpStatus.OK).json({
          success: true,
    data: user,
    })
})

export default app