
import jwt, { JwtPayload, Secret } from "jsonwebtoken";

const verifyToken = (
    token: string,
    secret: Secret
): { success: boolean; data?: JwtPayload; error?: string } => {
    try {
        // ✅ Debug Logs
        console.log("🔍 JWT Verify - Secret exists:", !!secret);
        console.log("🔍 JWT Verify - Token length:", token?.length);
        
        const data = jwt.verify(token, secret) as JwtPayload;
        console.log("✅ JWT Verified Successfully");
        
        return { success: true, data };
    } catch (error) {
        console.error("❌ JWT Verify Failed:", error instanceof Error ? error.message : "Unknown error");
        return {
            success: false,
            error: error instanceof Error ? error.message : "Invalid token"
        };
    }
};

const decodeToken = (token: string): JwtPayload | null => {
    try {
        return jwt.decode(token) as JwtPayload | null;
    } catch (error) {
        console.error("❌ JWT Decode Failed:", error);
        return null;
    }
};

export const jwtUtils = {
    verifyToken,
    decodeToken
};