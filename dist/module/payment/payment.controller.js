import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { paymentService } from "./payment.service";
import sendResponse from "../../utils/sendResponse";
const createPaymentSession = catchAsync(async (req, res) => {
    const { rentalOrderId } = req.body;
    const result = await paymentService.createPaymentSession(rentalOrderId, req.user.id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Payment session created successfully",
        data: result,
    });
});
const confirmPayment = catchAsync(async (req, res) => {
    const { sessionId } = req.body;
    const result = await paymentService.confirmPayment(sessionId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Payment confirmed successfully",
        data: result,
    });
});
const getMyPayments = catchAsync(async (req, res) => {
    const result = await paymentService.getMyPaymentsFromDb(req.user.id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Payments retrieved successfully",
        data: result,
    });
});
const getPaymentById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await paymentService.getPaymentByIdFromDb(id, req.user.id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Payment retrieved successfully",
        data: result,
    });
});
export const paymentController = {
    createPaymentSession,
    confirmPayment,
    getMyPayments,
    getPaymentById,
};
