import app from "./app.js";
import config from "./config/index.js";
import { prisma } from "./lib/prisma.js";
const port = config.port
const main = async()=>{
    try {
        await prisma.$connect();
        console.log("prisma database connected successfully")
        app.listen(port,()=>{
            console.log(`server running on port ${port}`)
        })
    } catch (error) {
        console.error("Error starting server:", error);
        await prisma.$disconnect()
        process.exit(1);
    }
}
main()