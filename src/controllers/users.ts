import { db } from "@/db/db";
import { Request, Response } from "express";
import bcrypt from "bcrypt";


// CREATE USER
export async function createUser(req: Request, res: Response) {
    const { 
        email, 
        username, 
        password,
        firstName,
        lastName,
        phone,
        dob,
        gender,
        image,
        Role,
        // shops[]

    } = req.body;
    
    try {
        const existingUserByEmail = await db.user.findUnique({
            where: {
                email
            },
        });

        const existingUserByPhone = await db.user.findUnique({
            where: {
                phone
            },
        });

        const existingUserByUsername = await db.user.findUnique({
            where: {
                username
            },
        });

        if (existingUserByEmail) {
            return res.status(409).json({ 
                error: `Email ${email} already exists`,
                data: null
            });
        }

        if (existingUserByPhone) {
            return res.status(409).json({ 
                error: `Phone ${phone} already exists`,
                data: null
            });
        }

        if (existingUserByUsername) {
            return res.status(409).json({ 
                error: `Username ${email} already exists`,
                data: null 
            });
        }

        // Hash password
        const hashedPassword: string = await bcrypt.hash(password, 10);
        const newUser = await db.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
                firstName,
                lastName,
                phone,
                dob,
                Role,
                gender,
                image: image ? image : "https://tyl6h7aevo.ufs.sh/f/vntTK41Y2gFOvHh7UX1Y2gFOc0Let1BdUmi8k7xpDlEyPrQ9",
            }
        });
        
        // Remove password from response
        const { password: savedPassword,...others } = newUser;

        // Response 
        return res.status(201).json({
            data: others,
            error: null
        });

    } catch (error) {
        console.log("Error creating customer:", error);  
        return res.status(500).json({
            error: "Internal server error",
            data: null
        });
    }

}

// GET ALL USERS
export async function getUsers(req: Request, res: Response) {
    try {
        
        const users = await db.user.findMany({
            orderBy: {
                createdAt: "desc"
            },
            select: {
                id: true,
                email: true,
                username: true,
                password: false,
                firstName: true,
                lastName: true,
                phone: true,
                dob: true,
                gender: true,
                image: true,
                Role: true,
                createdAt: true,
                updatedAt: true,
            }
        });


        if (users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }

        // const filteredUsers = users.map((user) => {
        //     const { password, ...others } = user;
        //     return others;
        // });

        // data: filteredUsers,
        
        return res.status(200).json({
            data: users,
            error: null
        });

    } catch (error) {
        console.log("Error fetching users:", error);
        return res.status(500).json({
            error: "Internal server error", 
            data: null
        });
        
    }
}


// GET USER BY ID
export async function getUserById(req: Request, res: Response) {
    const { id } = req.params;
    
    try {
        const user = await db.user.findUnique({
            where: {
                id      
            }
        });

        if (!user) {
            return res.status(404).json({ 
                data: null,
                error: "User not found" 
            });
        }

        // Remove password from response
        const { password, ...others } = user;   
        return res.status(200).json({
            data: others,
            error: null
        });
    } catch (error) {
        console.log("Error fetching user:", error);
        return res.status(500).json({
            error: "Internal server error",
            data: null
        });
    }
}

// UPDATE USER BY ID
export async function updateUserById(req: Request, res: Response) {

    try {

        const { id } = req.params;

        const { 
            email, 
            username, 
            password,
            firstName,
            lastName,
            phone,
            dob,
            gender,
            image,
            Role,
            // shops[]
    
        } = req.body;
        
    
        const existingUser = await db.user.findUnique({
            where: {
                id
            }
        });
        if (!existingUser) {    
            return res.status(404).json({ 
                data: null,
                error: "User not found" 
            });
        }

        // If an email is provided and it's different from the existing user's email -> check if it already exists
        if (email && email !== existingUser.email) {
            // Check if email already exists for another user
            const existingUserByEmail = await db.user.findUnique({
                where: {
                    email
                },
            });

            // If email already exists, return error
            if (existingUserByEmail) {
                return res.status(409).json({ 
                    error: `Email ${email} already exists`,
                    data: null
                });
            }
        }

        // If a username is provided and it's different from the existing user's username -> check if it already exists
        if (phone && phone !== existingUser.phone) {
            // Check if phone already exists for another user
            const existingUserByPhone = await db.user.findUnique({
                where: {
                    phone
                },
            });
            if (existingUserByPhone) {
                return res.status(409).json({ 
                    error: `Phone ${phone} already exists`,
                    data: null
                });
            }
        }

        if (username && username !== existingUser.username) {
            // Check if username already exists for another user
            const existingUserByUsername = await db.user.findUnique({
                where: {
                    username
                },
            });
            if (existingUserByUsername) {
                return res.status(409).json({ 
                    error: `Username ${username} already exists`,
                    data: null
                });
            }
        }

 

        // // Hash password
        // const hashedPassword: string = await bcrypt.hash(password, 10);
        let hashedPassword = existingUser.password

        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }
        // Update user
        const updatedUser = await db.user.update({
            where: {
                id
            },
            data: {
                email,
                username,
                password: hashedPassword,
                firstName,
                lastName,
                phone,
                dob,
                gender,
                image,
                Role,
            }
        });

        // Remove password from response
        const { password: UpdatedUserPassword, ...others } = updatedUser;

        return res.status(200).json({
            data: others,
            error: null
        });

        
    } catch (error) {
        console.log("Error updating user:", error);
        return res.status(500).json({
            error: "Internal server error",
            data: null
        });
    }

    
}

// UPDATE USER PASSWORD BY ID
export async function updateUserPasswordById(req: Request, res: Response) {
    const { id } = req.params;
    const { newPassword } = req.body;
    // for forgotten password reset
    // const { password, confirmPassword } = req.body;
    // if (password !== confirmPassword) {
    //     return res.status(400).json({ error: "Passwords do not match" });
    // }
    // if (password.length < 6) {
    //     return res.status(400).json({ error: "Password must be at least 6 characters" });
    // }

    // if (!password.match(/[a-z]/) || !password.match(/[A-Z]/) || !password.match(/[0-9]/)) {
    //     return res.status(400).json({ error: "Password must contain at least one uppercase letter, one lowercase letter, and one number" });
    // }
    // if (!password.match(/[^a-zA-Z0-9]/)) {
    //     return res.status(400).json({ error: "Password must contain at least one special character" });
    // }



    try {
        const user = await db.user.findUnique({
            where: {
                id
            }
        });
        if (!user) {    
            return res.status(404).json({ 
                data: null,
                error: "User not found" 
            });
        }

        // Hash new password
        const hashedNewPassword: string = await bcrypt.hash(newPassword, 10);

        const updatedUser = await db.user.update({
            where: {
                id
            },
            data: {
                password: hashedNewPassword,
            }
        });

        // Remove password from response
        const { password: newSavedPassword, ...others } = updatedUser;

        return res.status(200).json({
            data: others,
            error: null
        });

        
    } catch (error) {
        console.log("Error updating user:", error);
        return res.status(500).json({
            error: "Internal server error",
            data: null
        });
    }

    
}

// DELETE USER BY ID
export async function deleteUserById(req: Request, res: Response) {
    const { id } = req.params;
    
    try {
        const user = await db.user.findUnique({
            where: {
                id
            }
        });
        if (!user) {    
            return res.status(404).json({ 
                data: null,
                error: "User not found" 
            });
        }

        await db.user.delete({
            where: {
                id
            }
        });

        return res.status(200).json({
            data: null,
            error: null
        });

        
    } catch (error) {
        console.log("Error deleting user:", error);
        return res.status(500).json({
            error: "Internal server error",
            data: null
        });
    }

    
}


// GET USER ATTENDANTS BY Role
export async function getUserAttendantsByRole(req: Request, res: Response) {
    
    
    try {
        const users = await db.user.findMany({
            where: {
                Role: "ATTENDANT"
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        if (users.length === 0) {
            return res.status(404).json({ message: "No attendants found" });
        }


        // Remove password from response
        const filteredAttendants = users.map((user) => {
            const { password, ...others } = user;
            return others;
        });
        
        return res.status(200).json({
            data: filteredAttendants,
            error: null
        });
    } catch (error) {
        console.log("Error fetching user attendants:", error);
        return res.status(500).json({
            error: "Internal server error",
            data: null
        });
    }   
}
