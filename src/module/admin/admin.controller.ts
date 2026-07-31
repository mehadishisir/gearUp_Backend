import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import {
  getAllUsersFromDb,
  updateUserStatusInDb,
  getAllGearFromDb,
  getAllRentalsFromDb,
} from "./admin.service.js";
import sendResponse from "../../utils/sendResponse.js";


const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await getAllUsersFromDb();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Users retrieved successfully",
    data: result,
  });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await updateUserStatusInDb(req.params.id as string, req.body.status);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User status updated successfully",
    data: result,
  });
});

const getAllGear = catchAsync(async (req: Request, res: Response) => {
  const result = await getAllGearFromDb();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Gear items retrieved successfully",
    data: result,
  });
});

const getAllRentals = catchAsync(async (req: Request, res: Response) => {
  const result = await getAllRentalsFromDb();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Rentals retrieved successfully",
    data: result,
  });
});

export { getAllUsers, updateUserStatus, getAllGear, getAllRentals };