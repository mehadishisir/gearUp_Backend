import { prisma } from "../../lib/prisma"
import { IRegisterUser } from "./auth.interface"

import bcrypt from "bcrypt"
import config from "../../config"


const registerIntoDb=async(payload:IRegisterUser)=>{
     const {name,email,password,role,phone} = payload
    const isUserExist = await prisma.user.findUnique({
        where:{
            email
        }
    })
   if(isUserExist){
    throw new Error("User Already Exists");
    
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
    return createUser
   
}

export const authService = {
    registerIntoDb
}