import { 
    createUser,
    getUserById,
    getUsers,
    updateUserById,
    deleteUserById,
    updateUserPasswordById,
    getUserAttendantsByRole, 
 } from "@/controllers/users"
import express from "express"

const userRouter = express.Router()

userRouter.post("/users", createUser)
userRouter.get("/users", getUsers);
userRouter.get("/users/:id", getUserById);
userRouter.put("/users/:id", updateUserById);
userRouter.delete("/users/:id", deleteUserById);
userRouter.put("/users/:id/password", updateUserPasswordById);
userRouter.get("/attendants", getUserAttendantsByRole); // Assuming this is the correct endpoint for getting attendants







export default userRouter