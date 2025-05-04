import { 
    loginUser
 } from "@/controllers/auth"
import express from "express"

const authRouter = express.Router()

authRouter.post('/auth/login', loginUser)

export default authRouter