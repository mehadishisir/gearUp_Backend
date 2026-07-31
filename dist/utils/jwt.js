import jwt from "jsonwebtoken";
const createToken = (payload, secret, exp) => {
    const token = jwt.sign(payload, secret, {
        expiresIn: exp,
    });
    return token;
};
const verifyToken = (token, secret) => {
    try {
        const verify = jwt.verify(token, secret);
        return verify;
    }
    catch (error) {
        throw new Error("invalid Token");
    }
};
export { createToken, verifyToken };
