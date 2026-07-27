import { Prisma } from "../../../prisma/generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { ICreateGearItem, IGearFilters } from "./gearItem.interface";

const createGearItemIntoDb = async (payload: ICreateGearItem, providerId: string) => {
  const category = await prisma.category.findUnique({
    where: { id: payload.categoryId },
  });

  if (!category) {
    const error: any = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  const result = await prisma.gearItem.create({
    data: { ...payload, providerId },
    include: { category: { select: { name: true } } },
  });

  return result;
};

const getAllGearFromDb = async (filters: IGearFilters) => {
  const { category, minPrice, maxPrice, brand, available, search } = filters;

  const where:Prisma.GearItemWhereInput = {
    ...(category && {
      category: { name: { equals: category, mode: "insensitive" } },
    }),
    ...(brand && {
      brand: { contains: brand, mode: "insensitive" },
    }),
    ...(available !== undefined && {
      available: available === "true",
    }),
    ...((minPrice || maxPrice) && {
      price: {
        ...(minPrice && { gte: Number(minPrice) }),
        ...(maxPrice && { lte: Number(maxPrice) }),
      },
    }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const result = await prisma.gearItem.findMany({
    where,
    include: {
      category: { select: { name: true } },
      provider: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return result;
};

const getGearByIdFromDb = async (id: string) => {
  const result = await prisma.gearItem.findUnique({
    where: { id },
    include: {
      category: { select: { name: true } },
      provider: { select: { id: true, name: true, email: true } },
      reviews: {
        select: {
          rating: true,
          comment: true,
          createdAt: true,
          customer: { select: { name: true } },
        },
      },
    },
  });

  if (!result) {
    const error: any = new Error("Gear item not found");
    error.statusCode = 404;
    throw error;
  }

  return result;
};

const updateGearItemIntoDb = async (
  id: string,
  payload: Partial<ICreateGearItem>,
  providerId: string
) => {
  const gear = await prisma.gearItem.findUnique({ where: { id } });

  if (!gear) {
    const error: any = new Error("Gear item not found");
    error.statusCode = 404;
    throw error;
  }

  if (gear.providerId !== providerId) {
    const error: any = new Error("This gear is not yours");
    error.statusCode = 403;
    throw error;
  }

  const result = await prisma.gearItem.update({
    where: { id },
    data: payload,
    include: { category: { select: { name: true } } },
  });

  return result;
};

const deleteGearItemFromDb = async (id: string, providerId: string) => {
  const gear = await prisma.gearItem.findUnique({ where: { id } });

  if (!gear) {
    const error: any = new Error("Gear item not found");
    error.statusCode = 404;
    throw error;
  }

  if (gear.providerId !== providerId) {
    const error: any = new Error("This gear is not yours");
    error.statusCode = 403;
    throw error;
  }

  const orderCount = await prisma.rentalOrderItem.count({ where: { gearItemId: id } });

  if (orderCount > 0) {
    const result = await prisma.gearItem.update({
      where: { id },
      data: { available: false, stock: 0 },
    });
    return result;
  }

  const result = await prisma.gearItem.delete({ where: { id } });
  return result;
};

export const gearItemService = {
  createGearItemIntoDb,
  getAllGearFromDb,
  getGearByIdFromDb,
  updateGearItemIntoDb,
  deleteGearItemFromDb,
};