import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import config from "../../config";
const createPaymentSession = async (rentalOrderId, customerId) => {
    const order = await prisma.rentalOrder.findUnique({
        where: { id: rentalOrderId },
        include: { items: { include: { gearItem: true } } },
    });
    if (!order) {
        const error = new Error("Rental order not found");
        error.statusCode = 404;
        throw error;
    }
    if (order.customerId !== customerId) {
        const error = new Error("You are not authorized to pay for this order");
        error.statusCode = 403;
        throw error;
    }
    if (order.status !== "CONFIRMED") {
        const error = new Error("Order must be confirmed before payment");
        error.statusCode = 400;
        throw error;
    }
    const existingPayment = await prisma.payment.findUnique({ where: { rentalOrderId } });
    if (existingPayment) {
        const error = new Error("Payment already exists for this order");
        error.statusCode = 409;
        throw error;
    }
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: order.items.map((item) => ({
            price_data: {
                currency: "usd",
                product_data: { name: item.gearItem.name },
                unit_amount: Math.round(Number(item.priceAtBooking) * 100),
            },
            quantity: item.quantity,
        })),
        mode: "payment",
        success_url: `${config.app_url}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${config.app_url}/payment-cancel`,
    });
    const payment = await prisma.payment.create({
        data: {
            transactionId: session.id,
            rentalOrderId,
            amount: order.totalAmount,
            provider: "STRIPE",
            status: "PENDING",
        },
    });
    return { paymentUrl: session.url, payment };
};
const confirmPayment = async (sessionId) => {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
        const error = new Error("Payment not completed yet");
        error.statusCode = 400;
        throw error;
    }
    const payment = await prisma.payment.findUnique({ where: { transactionId: sessionId } });
    if (!payment) {
        const error = new Error("Payment record not found");
        error.statusCode = 404;
        throw error;
    }
    const result = await prisma.$transaction(async (tx) => {
        const updatedPayment = await tx.payment.update({
            where: { id: payment.id },
            data: { status: "COMPLETED", paidAt: new Date() },
        });
        await tx.rentalOrder.update({
            where: { id: payment.rentalOrderId },
            data: { status: "PAID" },
        });
        return updatedPayment;
    });
    return result;
};
const getMyPaymentsFromDb = async (customerId) => {
    const result = await prisma.payment.findMany({
        where: { rentalOrder: { customerId } },
        include: { rentalOrder: true },
        orderBy: { createdAt: "desc" },
    });
    return result;
};
const getPaymentByIdFromDb = async (id, customerId) => {
    const payment = await prisma.payment.findUnique({
        where: { id },
        include: { rentalOrder: true },
    });
    if (!payment) {
        const error = new Error("Payment not found");
        error.statusCode = 404;
        throw error;
    }
    if (payment.rentalOrder.customerId !== customerId) {
        const error = new Error("You are not authorized to view this payment");
        error.statusCode = 403;
        throw error;
    }
    return payment;
};
export const paymentService = {
    createPaymentSession,
    confirmPayment,
    getMyPaymentsFromDb,
    getPaymentByIdFromDb,
};
