import dotenv from "dotenv";
import path from "path";
dotenv.config({path: path.join(process.cwd(),".env")});

export default {
    port : process.env.PORT,
    database_Url : process.env.DATABASE_URL,
    app_url : process.env.APP_URL,
    bycrypt_salt_rounds : process.env.BYCRYPT_SALT_ROUNDS, 
    jwt_access_token_secret : process.env.JWT_ACCESS_TOKEN_SECRET!,
    jwt_refresh_token_secret : process.env.JWT_REFRESH_TOKEN_SECRET!,
    jwt_access_token_expiration_time : process.env.JWT_ACCESS_TOKEN_EXPIRATION,
    jwt_refresh_token_expiration_time : process.env.JWT_REFRESH_TOKEN_EXPIRATION,
}