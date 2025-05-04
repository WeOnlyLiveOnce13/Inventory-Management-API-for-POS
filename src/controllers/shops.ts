import { db } from "@/db/db";
import { Request, Response } from "express";


export async function createShop(req: Request, res: Response) { 
    
    const {           
        name,          
        slug ,            
        location,     
        adminId,
        attendantIds 
    } = req.body;

    try {

        // Check if the shop already exists
        const existingShop = await db.shop.findUnique({
            where: { 
                slug: slug 
            },
        });

        if (existingShop) {
            return res.status(409).json({ 
                error: `Shop ${name} already exists` ,
                data: null
            });
        }

        // Create new shop
        const newShop = await db.shop.create({
            data: {
                name,
                slug,
                location,
                adminId,
                attendantIds
            }
        });

        res.status(201).json({
            data: newShop,
            error: null
        });
    } catch (error) {
        console.log("Error creating shop:", error);

        res.status(500).json({ 
            error: "Error creating shop" ,
            data: null
        });
    }
}


// GET all shops
export async function getShops(req: Request, res: Response) {

    try {
        const shops = await db.shop.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });

        res.status(200).json({
            data: shops,
            error: null
        });
    } catch (error) {
        console.log("Error fetching shops:", error);

        res.status(500).json({ 
            error: "Error fetching shops" ,
            data: null
        });
    }
}

// GET Shop attendants by shop ID
export async function getShopAttendants(req: Request, res: Response) {
    const { id } = req.params;

    try {
        const existingShop = await db.shop.findUnique({
            where: { 
                id 
            }
        });

        if (!existingShop) {
            return res.status(404).json({ 
                error: `Shop of ID ${ id } not found` ,
                data: null
            });
        }

        const attendants = await db.user.findMany({
            where: {
                id: {
                    in: existingShop.attendantIds
                }
            },
            select: {
                id: true,
                username: true,
                email: true,
                phone: true,
                image: true,
                Role: true
            },
        });

        res.status(200).json({
            data: attendants,
            error: null
        });
    } catch (error) {
        console.log("Error fetching shop attendants:", error);

        res.status(500).json({ 
            error: "Error fetching shop attendants" ,
            data: null
        });
    }
}

// GET single shop by ID
export async function getSingleShop(req: Request, res: Response) {
    const { id } = req.params;

    try {
        const shop = await db.shop.findUnique({
            where: { 
                id 
            }
        });

        if (!shop) {
            return res.status(404).json({ 
                error: `Shop of ID ${ id } not found` ,
                data: null
            });
        }

        res.status(200).json({
            data: shop,
            error: null
        });
    } catch (error) {
        console.log("Error fetching shop:", error);

        res.status(500).json({ 
            error: "Error fetching shop" ,
            data: null
        });
    }
}