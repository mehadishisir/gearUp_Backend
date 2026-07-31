import { catchAsync } from "../../utils/catchAsync";
import { getAllUsersFromDb, updateUserStatusInDb, getAllGearFromDb, getAllRentalsFromDb, } from "./admin.service";
import sendResponse from "../../utils/sendResponse";
const getAllUsers = catchAsync(async (req, res) => {
    const result = await getAllUsersFromDb();
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Users retrieved successfully",
        data: result,
    });
});
const updateUserStatus = catchAsync(async (req, res) => {
    const result = await updateUserStatusInDb(req.params.id, req.body.status);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "User status updated successfully",
        data: result,
    });
});
const getAllGear = catchAsync(async (req, res) => {
    const result = await getAllGearFromDb();
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Gear items retrieved successfully",
        data: result,
    });
});
const getAllRentals = catchAsync(async (req, res) => {
    const result = await getAllRentalsFromDb();
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Rentals retrieved successfully",
        data: result,
    });
});
export { getAllUsers, updateUserStatus, getAllGear, getAllRentals };
