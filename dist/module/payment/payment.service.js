"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentService = void 0;
const prisma_1 = require("../../lib/prisma");
const stripe_1 = require("../../lib/stripe");
const config_1 = __importDefault(require("../../config"));
const createPaymentSession = async (rentalOrderId, customerId) => {
    const order = await prisma_1.prisma.rentalOrder.findUnique({
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
    const existingPayment = await prisma_1.prisma.payment.findUnique({ where: { rentalOrderId } });
    if (existingPayment) {
        const error = new Error("Payment already exists for this order");
        error.statusCode = 409;
        throw error;
    }
    const session = await stripe_1.stripe.checkout.sessions.create({
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
        success_url: `${config_1.default.app_url}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${config_1.default.app_url}/payment-cancel`,
    });
    const payment = await prisma_1.prisma.payment.create({
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
    const session = await stripe_1.stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
        const error = new Error("Payment not completed yet");
        error.statusCode = 400;
        throw error;
    }
    const payment = await prisma_1.prisma.payment.findUnique({ where: { transactionId: sessionId } });
    if (!payment) {
        const error = new Error("Payment record not found");
        error.statusCode = 404;
        throw error;
    }
    const result = await prisma_1.prisma.$transaction(async (tx) => {
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
    const result = await prisma_1.prisma.payment.findMany({
        where: { rentalOrder: { customerId } },
        include: { rentalOrder: true },
        orderBy: { createdAt: "desc" },
    });
    return result;
};
const getPaymentByIdFromDb = async (id, customerId) => {
    const payment = await prisma_1.prisma.payment.findUnique({
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
exports.paymentService = {
    createPaymentSession,
    confirmPayment,
    getMyPaymentsFromDb,
    getPaymentByIdFromDb,
};
