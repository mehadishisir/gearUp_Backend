import { Request, Response } from "express"
import { authService } from "./auth.service"
import httpStatus from "http-status"
const registerUser = async (req:Request,res:Response) => {
    const payload=req.body
    const result = await authService.registerIntoDb(payload)
     return res.status(httpStatus.CREATED).json({
        success:true,
        message:"User registerd Successfully",
        data:result
    })
}

export const authController = {
    registerUser
}