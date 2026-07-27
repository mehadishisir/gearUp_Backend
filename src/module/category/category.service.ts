import { prisma } from "../../lib/prisma";
import { ICreateCategory } from "./category.interface";

const createCategoryIntoDb = async (payload: ICreateCategory) => {
  const isExist = await prisma.category.findUnique({
    where: { name: payload.name },
  });

  if (isExist) {
    const error: any = new Error("Category already exists");
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

export const categoryService = {
  createCategoryIntoDb,
  getAllCategoriesFromDb,
};