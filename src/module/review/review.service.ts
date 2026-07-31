import { OrderStatus } from "../../../prisma/generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreateReview } from "./review.interface";

const createReviewDb = async (customerId: string, payload: ICreateReview) => {
  const { gearItemId, rentalOrderId, rating, comment } = payload;

  if (!rating || rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5!");
  }

  const order = await prisma.rentalOrder.findUniqueOrThrow({
    where: { id: rentalOrderId },
    include: { items: true },
  });

  if (order.customerId !== customerId) {
    throw new Error("This is not your rental order!");
  }

  if (order.status !== OrderStatus.RETURNED) {
    throw new Error("You can review only after returning the gear!");
  }

  const isItemInOrder = order.items.some(
    (orderItem) => orderItem.gearItemId === gearItemId,
  );
  if (!isItemInOrder) {
    throw new Error("This gear is not in your rental order!");
  }

  const result = await prisma.$transaction(async (tx) => {
    const review = await tx.review.create({
      data: { customerId, gearItemId, rentalOrderId, rating, comment },
    });

    // recalculate gear average rating
    const avg = await tx.review.aggregate({
      where: { gearItemId },
      _avg: { rating: true },
    });

    await tx.gearItem.update({
      where: { id: gearItemId },
      data: { avgRating: avg._avg.rating ?? 0 },
    });

    return review;
  });

  return result;
};

const getReviewsByGearItemDb = async (gearItemId: string) => {
  const result = await prisma.review.findMany({
    where: { gearItemId },
    include: { customer: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return result;
};

export { createReviewDb, getReviewsByGearItemDb };