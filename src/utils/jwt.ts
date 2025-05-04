import express, { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

const DEFAULT_SIGN_OPTIONS: SignOptions = {
    expiresIn: '1h', // Default expiration time for the toke
    algorithm: 'HS256' // Default algorithm for signing the token
}

// Function to generate a JWT access token
export function generateAccessToken(
    payload: JwtPayload,
    options: SignOptions = DEFAULT_SIGN_OPTIONS
) {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT secret is not defined in the environment variables.");
    }
    
    const token = jwt.sign(payload, secret!, options);
    return token;
}

// Function to verify a JWT token
interface AuthenticatedRequest extends Request {
    user?: string | JwtPayload;
}

const secretKey = process.env.JWT_SECRET 
  
  
// Middleware to verify JWT
export function verifyToken(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Response | void {
    // Check if the token is provided in the request headers
    const token = req.headers["authorization"];

    if (!token) {
        return res.status(403).json({ message: "No token provided" });
    }

    // Remove "Bearer " if the token is provided in "Bearer <token>" format
    const tokenWithoutBearer = token.replace("Bearer ", "");

    // Verify the token using the secret key
    if (!secretKey) {
        return res.status(500).json({ message: "Internal server error" });
    }
    
    jwt.verify(tokenWithoutBearer, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Failed to authenticate token" });
        }
        // If the token is valid, save the decoded information to request for use in other routes
        req.user = decoded;
        next();
    });
}