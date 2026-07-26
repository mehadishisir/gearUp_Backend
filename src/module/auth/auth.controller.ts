import { Request, Response } from "express";
import httpStatus from "http-status";


import { authService } from "./auth.service";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.registerIntoDb(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});
const logInUser=catchAsync(async (req: Request, res: Response)=>{
const payload = req.body
const result = await authService.loginUserIntoDb(payload)
 sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully",
    data: result,
  });
})
const getMe = catchAsync(async(req:Request,res:Response)=>{
    const id = req.user?.id
    const result = await authService.getMe(id as string)
    sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile retrieved successfully",
    data: result,
  });
})

export const authController = { registerUser,logInUser,getMe };