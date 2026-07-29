import { Request, Response } from "express";
import { createReviewDb, getReviewsByGearItemDb } from "./review.service";
import sendResponse from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const result = await createReviewDb(req.user!.id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Review submitted successfully",
    data: result,
  });
});

const getReviewsByGearItem = catchAsync(async (req: Request, res: Response) => {
  const result = await getReviewsByGearItemDb(req.params.gearItemId as string);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Reviews retrieved successfully",
    data: result,
  });
});

export { createReview, getReviewsByGearItem };