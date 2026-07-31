"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = __importDefault(require("./app.js"));
const index_js_1 = __importDefault(require("./config/index.js"));
const prisma_js_1 = require("./lib/prisma.js");
const port = index_js_1.default.port;
const main = async () => {
    try {
        await prisma_js_1.prisma.$connect();
        console.log("prisma database connected successfully");
        app_js_1.default.listen(port, () => {
            console.log(`server running on port ${port}`);
        });
    }
    catch (error) {
        console.error("Error starting server:", error);
        await prisma_js_1.prisma.$disconnect();
        process.exit(1);
    }
};
main();
