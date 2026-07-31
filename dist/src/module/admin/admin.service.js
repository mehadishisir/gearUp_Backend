import { prisma } from "../../lib/prisma";
const getAllUsersFromDb = async () => {
    const result = await prisma.user.findMany({
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
const updateUserStatusInDb = async (userId, status) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }
    const result = await prisma.user.update({
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
const getAllGearFromDb = async () => {
    const result = await prisma.gearItem.findMany({
        include: { category: true },
        orderBy: { createdAt: "desc" },
    });
    return result;
};
const getAllRentalsFromDb = async () => {
    const result = await prisma.rentalOrder.findMany({
        include: {
            customer: { select: { id: true, name: true, email: true } },
            items: { include: { gearItem: true } },
            payment: true,
        },
        orderBy: { createdAt: "desc" },
    });
    return result;
};
export { getAllUsersFromDb, updateUserStatusInDb, getAllGearFromDb, getAllRentalsFromDb, };
