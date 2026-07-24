import { PrismaPg } from "@prisma/adapter-pg";
import config from "../config";
import { PrismaClient } from "../../prisma/generated/prisma/client";


const adapter = new PrismaPg({
    connectionString:config.database_Url
});
export const prisma = new PrismaClient({adapter})