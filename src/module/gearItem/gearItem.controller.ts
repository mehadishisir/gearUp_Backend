import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { gearItemService } from "./gearItem.service";

import { IGearFilters } from "./gearItem.interface";

const createGearItem = catchAsync(async (req: Request, res: Response) => {
  const providerId = req.user!.id;
  const result = await gearItemService.createGearItemIntoDb(req.body, providerId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Gear item created successfully",
    data: result,
  });
});

const getAllGear = catchAsync(async (req: Request, res: Response) => {
  const result = await gearItemService.getAllGearFromDb(req.query as IGearFilters);

sendResponse(res,{
    success:true,
    statusCode:httpStatus.OK,
    message:"Gear items retrieved successfully",
    meta: result.meta,
    data: result.data
})
});

const getGearById = catchAsync(async (req: Request, res: Response) => {
  const result = await gearItemService.getGearByIdFromDb(req.params.id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Gear item retrieved successfully",
    data: result,
  });
});

const updateGearItem = catchAsync(async (req: Request, res: Response) => {
  const providerId = req.user!.id;
  const result = await gearItemService.updateGearItemIntoDb(req.params.id as string, req.body, providerId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Gear item updated successfully",
    data: result,
  });
});

const deleteGearItem = catchAsync(async (req: Request, res: Response) => {
  const providerId = req.user!.id;
  await gearItemService.deleteGearItemFromDb(req.params.id as string, providerId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Gear item deleted successfully",
    data: null,
  });
});


const getProviderOrders = catchAsync(async (req: Request, res: Response) => {
  const providerId = req.user!.id;
  const result = await gearItemService.getProviderOrdersFromDb(providerId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Provider orders retrieved successfully",
    data: result,
  });
});

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const providerId = req.user!.id;
  const { status } = req.body;
  const result = await gearItemService.updateOrderStatusIntoDb(providerId, req.params.id as string, status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order status updated successfully",
    data: result,
  });
});

export const gearItemController = {
  createGearItem,
  getAllGear,
  getGearById,
  updateGearItem,
  deleteGearItem,
  getProviderOrders,
  updateOrderStatus,
}