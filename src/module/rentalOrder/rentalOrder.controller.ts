import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { rentalOrderService } from "./rentalOrder.service";

const createRentalOrder = catchAsync(async (req: Request, res: Response) => {
  const customerId = req.user!.id;
  const result = await rentalOrderService.createRentalOrderIntoDb(req.body, customerId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Rental order created successfully",
    data: result,
  });
});

const getMyOrders = catchAsync(async (req: Request, res: Response) => {
  const customerId = req.user!.id;
  const result = await rentalOrderService.getMyOrdersFromDb(customerId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Rental orders retrieved successfully",
    data: result,
  });
});

const getOrderById = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const result = await rentalOrderService.getOrderByIdFromDb(req.params.id, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Rental order retrieved successfully",
    data: result,
  });
});

export const rentalOrderController = {
  createRentalOrder,
  getMyOrders,
  getOrderById,
};