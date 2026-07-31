import { prisma } from "../../lib/prisma";
const createCategoryIntoDb = async (payload) => {
    const isExist = await prisma.category.findUnique({
        where: { name: payload.name },
    });
    if (isExist) {
        const error = new Error("Category already exists");
        error.statusCode = 409;
        throw error;
    }
    const result = await prisma.category.create({ data: payload });
    return result;
};
const getAllCategoriesFromDb = async () => {
    const result = await prisma.category.findMany();
    return result;
};
const updateCategoryIntoDb = async (id, payload) => {
    const { name, description } = payload;
    const result = await prisma.category.update({
        where: { id },
        data: {
            ...(name && { name }),
            ...(description && { description }),
        },
    });
    return result;
};
const deleteCategoryFromDb = async (id) => {
    const gearCount = await prisma.gearItem.count({ where: { categoryId: id } });
    if (gearCount > 0) {
        const error = new Error("Category has gear items, cannot delete");
        error.statusCode = 400;
        throw error;
    }
    const result = await prisma.category.delete({ where: { id } });
    return result;
};
export const categoryService = {
    createCategoryIntoDb,
    getAllCategoriesFromDb,
    updateCategoryIntoDb,
    deleteCategoryFromDb
};
