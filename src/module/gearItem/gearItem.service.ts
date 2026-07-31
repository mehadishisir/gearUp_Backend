import { Prisma } from "../../../prisma/generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import { ICreateGearItem, IGearFilters } from "./gearItem.interface.js";

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
  const {
    category,
    minPrice,
    maxPrice,
    brand,
    available,
    search,
    page = "1",
    limit = "10",
    sortBy = "createdAt",
    sortOrder = "desc",
  } = filters;

  const currentPage = Number(page);
  const perPage = Number(limit);
  const skip = (currentPage - 1) * perPage;

  const where: Prisma.GearItemWhereInput = {
    ...(category && {
      category: {
        name: {
          equals: category,
          mode: "insensitive",
        },
      },
    }),

    ...(brand && {
      brand: {
        contains: brand,
        mode: "insensitive",
      },
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
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    }),
  };

  const [data, total] = await prisma.$transaction([
    prisma.gearItem.findMany({
      where,
      include: {
        category: {
          select: {
            name: true,
          },
        },
        provider: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      skip,
      take: perPage,
      orderBy: {
        [sortBy]: sortOrder,
      },
    }),

    prisma.gearItem.count({
      where,
    }),
  ]);

  return {
    meta: {
      page: currentPage,
      limit: perPage,
      total,
      totalPage: Math.ceil(total / perPage),
    },
    data,
  };
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



const getProviderOrdersFromDb = async (providerId: string) => {
  const result = await prisma.rentalOrder.findMany({
    where: {
      items: { some: { gearItem: { providerId } } },
    },
    include: {
      customer: { select: { id: true, name: true, email: true, phone: true } },
      items: {
        where: { gearItem: { providerId } },
        include: { gearItem: { select: { name: true, brand: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return result;
};

const updateOrderStatusIntoDb = async (providerId: string, orderId: string, status: string) => {
  const order = await prisma.rentalOrder.findUnique({
    where: { id: orderId },
    include: { items: { include: { gearItem: true } } },
  });

  if (!order) {
    const error: any = new Error("Rental order not found");
    error.statusCode = 404;
    throw error;
  }

  const isProviderOrder = order.items.some((item:any) => item.gearItem.providerId === providerId);
  if (!isProviderOrder) {
    const error: any = new Error("This order does not contain your gear");
    error.statusCode = 403;
    throw error;
  }

  const validTransitions: Record<string, string[]> = {
    PLACED: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["CANCELLED"],
    PAID: ["PICKED_UP"],
    PICKED_UP: ["RETURNED"],
  };

  const allowedNext = validTransitions[order.status] || [];
  if (!allowedNext.includes(status)) {
    const error: any = new Error(`Cannot change status from ${order.status} to ${status}`);
    error.statusCode = 400;
    throw error;
  }

  const result = await prisma.$transaction(async (tx:any) => {
    if (status === "RETURNED") {
      for (const item of order.items) {
        await tx.gearItem.update({
          where: { id: item.gearItemId },
          data: { stock: { increment: item.quantity } },
        });
      }
    }

    return await tx.rentalOrder.update({
      where: { id: orderId },
      data: { status: status as any },
    });
  });

  return result;
};

export const gearItemService = {
  createGearItemIntoDb,
  getAllGearFromDb,
  getGearByIdFromDb,
  updateGearItemIntoDb,
  deleteGearItemFromDb,
   getProviderOrdersFromDb,
  updateOrderStatusIntoDb,
};