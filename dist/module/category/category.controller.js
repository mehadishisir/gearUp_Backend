import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { categoryService } from "./category.service";
const createCategory = catchAsync(async (req, res) => {
    const result = await categoryService.createCategoryIntoDb(req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Category created successfully",
        data: result,
    });
});
const getAllCategories = catchAsync(async (req, res) => {
    const result = await categoryService.getAllCategoriesFromDb();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Categories retrieved successfully",
        data: result,
    });
});
const updateCategory = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await categoryService.updateCategoryIntoDb(id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Category updated successfully",
        data: result,
    });
});
const deleteCategory = catchAsync(async (req, res) => {
    const { id } = req.params;
    await categoryService.deleteCategoryFromDb(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Category deleted successfully",
        data: null,
    });
});
export const categoryController = {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory
};
