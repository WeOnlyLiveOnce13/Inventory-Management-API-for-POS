import { db } from "@/db/db";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateAccessToken } from "@/utils/jwt";


// CREATE login, register, logout, refreshToken, forgotPassword, resetPassword, verifyEmail
export async function loginUser(req: Request, res: Response) {
    const { 
        email, 
        username, 
        password
    } = req.body;
    
    try {
        let existingUser = null;

        if (email) {
            existingUser = await db.user.findUnique({
                where: {
                    email: email
                }
            });
        } else if (username) {
            existingUser = await db.user.findUnique({
                where: {
                    username: username
                }
            });
        }

        if (!existingUser) {
            return res.status(403).json({
                error: "Wrong credentials. Please correct and try again.",
                data: null
            });
        }

        // Using Bcrypt to compare the password
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);

        
        if (isPasswordValid) {
            const { password, ...userWithoutPassword } = existingUser; 
            const accessToken = generateAccessToken(userWithoutPassword);

            const result = {
                ...userWithoutPassword,
                accessToken
            };

            return res.json(result);
        
        }  else {

            // 401: didn't provide valid credentials
            // 403: didn't provide valid credentials, but the user is registered
            return res.status(403).json({
                error: "Wrong credentials",
                user: null
            });
        }


        

    } catch (error) {
        console.log("Error creating customer:", error);  
        return res.status(500).json({
            error: "Internal server error",
            data: null
        });
    }

}


// CREATE register
