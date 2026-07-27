import { prisma } from "../../lib/prisma";
import { ICreateCategory } from "./category.interface";

import httpStatus from "http-status";

const getAllCategoriesFromDb = async () => {
  const result = await prisma.category.findMany({
    include: { _count: { select: { gearItem: true } } }, // ✅ ঠিক field name
    orderBy: { name: "asc" },
  });
  return result;
};

const createCategoryIntoDb = async (payload: ICreateCategory) => {
  const isExist = await prisma.category.findUnique({ where: { name: payload.name } });
  if (isExist) {
    throw new AppError("Category already exists", httpStatus.CONFLICT);
  }

  const result = await prisma.category.create({ data: payload });
  return result;
};

const updateCategoryIntoDb = async (id: string, payload: Partial<ICreateCategory>) => {
  const isExist = await prisma.category.findUnique({ where: { id } });
  if (!isExist) {
    throw new AppError("Category not found", httpStatus.NOT_FOUND);
  }

  const result = await prisma.category.update({ where: { id }, data: payload });
  return result;
};

const deleteCategoryFromDb = async (id: string) => {
  const itemCount = await prisma.gearItem.count({ where: { categoryId: id } }); // ✅ ঠিক model name
  if (itemCount > 0) {
    throw new AppError("Category has gear items, cannot delete", httpStatus.BAD_REQUEST); // ✅ AppError
  }

  const result = await prisma.category.delete({ where: { id } });
  return result;
};

export const categoryService = {
  createCategoryIntoDb,
  getAllCategoriesFromDb,
  updateCategoryIntoDb,
  deleteCategoryFromDb,
};