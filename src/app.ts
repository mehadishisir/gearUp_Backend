import express,{ Application, Request, Response } from "express";
import cors from "cors";
import  httpStatus  from "http-status";
import { prisma } from "./lib/prisma";
import bcrypt from "bcrypt"
import config from "./config";
const app:Application = express()
app.use(cors())
app.use(express.json())
app.get('/',async (req:Request,res:Response) => {
    const user = await prisma.user.findMany();
    // console.log("user:",user)

    return res.status(httpStatus.OK).json({
          success: true,
          message:"GearUp server is running",

    })
})


app.post("/api/auth/register",async (req:Request,res:Response) => {
    const {name,email,password,role,phone} = req.body
    const isUserExist = await prisma.user.findUnique({
        where:{
            email
        }
    })
    if(isUserExist){
        return res.status(httpStatus.CONFLICT).json({
            success:false,
            message:"User with this email already exists"

        })
    }

    const hashPassword = await bcrypt.hash(password,Number(config.bycrypt_salt_rounds))

  

    const createUser = await prisma.user.create({
        data:{
             name,
            email,
            password:hashPassword,
            role,
            phone

        },
    omit:{
        password:true
    }
    })
    return res.status(httpStatus.CREATED).json({
        success:true,
        message:"User registerd Successfully",
        data:createUser
    })
})
export default app