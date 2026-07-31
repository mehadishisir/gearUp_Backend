"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllRentalsFromDb = exports.getAllGearFromDb = exports.updateUserStatusInDb = exports.getAllUsersFromDb = void 0;
const prisma_1 = require("../../lib/prisma");
const getAllUsersFromDb = async () => {
    const result = await prisma_1.prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            status: true,
            createdAt: true,
        },
        orderBy: { createdAt: "desc" },
    });
    return result;
};
exports.getAllUsersFromDb = getAllUsersFromDb;
const updateUserStatusInDb = async (userId, status) => {
    const user = await prisma_1.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }
    const result = await prisma_1.prisma.user.update({
        where: { id: userId },
        data: { status },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
        },
    });
    return result;
};
exports.updateUserStatusInDb = updateUserStatusInDb;
const getAllGearFromDb = async () => {
    const result = await prisma_1.prisma.gearItem.findMany({
        include: { category: true },
        orderBy: { createdAt: "desc" },
    });
    return result;
};
exports.getAllGearFromDb = getAllGearFromDb;
const getAllRentalsFromDb = async () => {
    const result = await prisma_1.prisma.rentalOrder.findMany({
        include: {
            customer: { select: { id: true, name: true, email: true } },
            items: { include: { gearItem: true } },
            payment: true,
        },
        orderBy: { createdAt: "desc" },
    });
    return result;
};
exports.getAllRentalsFromDb = getAllRentalsFromDb;
