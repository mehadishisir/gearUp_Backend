import { prisma } from "../../lib/prisma";
const createRentalOrderIntoDb = async (payload, customerId) => {
    const { startDate, endDate, items } = payload;
    if (!items || items.length === 0) {
        const error = new Error("At least one gear item is required");
        error.statusCode = 400;
        throw error;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
        const error = new Error("End date must be after start date");
        error.statusCode = 400;
        throw error;
    }
    const rentalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const gearItems = await Promise.all(items.map(async (item) => {
        const gear = await prisma.gearItem.findUnique({ where: { id: item.gearItemId } });
        if (!gear) {
            const error = new Error(`Gear item not found: ${item.gearItemId}`);
            error.statusCode = 404;
            throw error;
        }
        if (!gear.available || gear.stock < item.quantity) {
            const error = new Error(`Insufficient stock for ${gear.name}`);
            error.statusCode = 400;
            throw error;
        }
        return { gear, quantity: item.quantity };
    }));
    let totalAmount = 0;
    gearItems.forEach(({ gear, quantity }) => {
        totalAmount += Number(gear.price) * quantity * rentalDays;
    });
    const result = await prisma.$transaction(async (tx) => {
        const order = await tx.rentalOrder.create({
            data: {
                customerId,
                startDate: start,
                endDate: end,
                totalAmount,
                status: "PLACED",
            },
        });
        for (const { gear, quantity } of gearItems) {
            await tx.rentalOrderItem.create({
                data: {
                    rentalOrderId: order.id,
                    gearItemId: gear.id,
                    quantity,
                    priceAtBooking: gear.price,
                },
            });
            await tx.gearItem.update({
                where: { id: gear.id },
                data: { stock: { decrement: quantity } },
            });
        }
        return order;
    });
    return result;
};
const getMyOrdersFromDb = async (customerId) => {
    const result = await prisma.rentalOrder.findMany({
        where: { customerId },
        include: {
            items: { include: { gearItem: { select: { name: true, images: true } } } },
            payment: true,
        },
        orderBy: { createdAt: "desc" },
    });
    return result;
};
const getOrderByIdFromDb = async (id, userId) => {
    const order = await prisma.rentalOrder.findUnique({
        where: { id },
        include: {
            items: { include: { gearItem: true } },
            payment: true,
            customer: { select: { id: true, name: true, email: true } },
        },
    });
    if (!order) {
        const error = new Error("Rental order not found");
        error.statusCode = 404;
        throw error;
    }
    if (order.customerId !== userId) {
        const error = new Error("You are not authorized to view this order");
        error.statusCode = 403;
        throw error;
    }
    return order;
};
export const rentalOrderService = {
    createRentalOrderIntoDb,
    getMyOrdersFromDb,
    getOrderByIdFromDb,
};
