
import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";



const verifyToken = (
    token: string,
    secret: Secret
): { success: boolean; data?: JwtPayload; error?: string } => {
    try {
        const data = jwt.verify(token, secret) as JwtPayload;
        return { success: true, data };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Invalid token"
        };
    }
};

const decodeToken = (token: string): JwtPayload | null => {
    return jwt.decode(token) as JwtPayload | null;
};

export const jwtUtils = {
   
    verifyToken,
    decodeToken
};