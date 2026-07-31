import { prisma } from "../../lib/prisma";
const createGearItemIntoDb = async (payload, providerId) => {
    const category = await prisma.category.findUnique({
        where: { id: payload.categoryId },
    });
    if (!category) {
        const error = new Error("Category not found");
        error.statusCode = 404;
        throw error;
    }
    const result = await prisma.gearItem.create({
        data: { ...payload, providerId },
        include: { category: { select: { name: true } } },
    });
    return result;
};
const getAllGearFromDb = async (filters) => {
    const { category, minPrice, maxPrice, brand, available, search, page = "1", limit = "10", sortBy = "createdAt", sortOrder = "desc", } = filters;
    const currentPage = Number(page);
    const perPage = Number(limit);
    const skip = (currentPage - 1) * perPage;
    const where = {
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
const getGearByIdFromDb = async (id) => {
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
        const error = new Error("Gear item not found");
        error.statusCode = 404;
        throw error;
    }
    return result;
};
const updateGearItemIntoDb = async (id, payload, providerId) => {
    const gear = await prisma.gearItem.findUnique({ where: { id } });
    if (!gear) {
        const error = new Error("Gear item not found");
        error.statusCode = 404;
        throw error;
    }
    if (gear.providerId !== providerId) {
        const error = new Error("This gear is not yours");
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
const deleteGearItemFromDb = async (id, providerId) => {
    const gear = await prisma.gearItem.findUnique({ where: { id } });
    if (!gear) {
        const error = new Error("Gear item not found");
        error.statusCode = 404;
        throw error;
    }
    if (gear.providerId !== providerId) {
        const error = new Error("This gear is not yours");
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
const getProviderOrdersFromDb = async (providerId) => {
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
const updateOrderStatusIntoDb = async (providerId, orderId, status) => {
    const order = await prisma.rentalOrder.findUnique({
        where: { id: orderId },
        include: { items: { include: { gearItem: true } } },
    });
    if (!order) {
        const error = new Error("Rental order not found");
        error.statusCode = 404;
        throw error;
    }
    const isProviderOrder = order.items.some((item) => item.gearItem.providerId === providerId);
    if (!isProviderOrder) {
        const error = new Error("This order does not contain your gear");
        error.statusCode = 403;
        throw error;
    }
    const validTransitions = {
        PLACED: ["CONFIRMED", "CANCELLED"],
        CONFIRMED: ["CANCELLED"],
        PAID: ["PICKED_UP"],
        PICKED_UP: ["RETURNED"],
    };
    const allowedNext = validTransitions[order.status] || [];
    if (!allowedNext.includes(status)) {
        const error = new Error(`Cannot change status from ${order.status} to ${status}`);
        error.statusCode = 400;
        throw error;
    }
    const result = await prisma.$transaction(async (tx) => {
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
            data: { status: status },
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
