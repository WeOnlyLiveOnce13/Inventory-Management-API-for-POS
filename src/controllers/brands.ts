import { db } from "@/db/db";
import { Request, Response } from "express";


// CREATE a new brand
export async function createBrand(req: Request, res: Response) { 
    
    const {           
        name,            
        slug          
    } = req.body;

    try {
        

        // Check if the brand already exists
        const existingbrand = await db.brand.findUnique({
            where: {
                slug
            }
        });

        if (existingbrand) {
            return res.status(409).json({ 
                error: `brand ${name} already exists` ,
                data: null
            });
        }

        // Create new shop
        const newbrand = await db.brand.create({
            data: {
                name,            
                slug
            }
        });

        res.status(201).json({
            data: newbrand,
            error: null
        });
    } catch (error) {
        console.log("Error creating brand:", error);

        res.status(500).json({ 
            error: "Error creating brand" ,
            data: null
        });
    }
}


// GET all brands
export async function getBrands(req: Request, res: Response) {

    try {
        const brands = await db.brand.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });

        res.status(200).json({
            data: brands,
            error: null
        });
    } catch (error) {
        console.log("Error fetching brands:", error);

        res.status(500).json({ 
            error: "Error fetching brands" ,
            data: null
        });
    }
}

// GET a single brand by ID
export async function getSingleBrand(req: Request, res: Response) {

    const { id } = req.params;

    try {
        const brand = await db.brand.findUnique({
            where: { 
                id 
            }
        });

        if (!brand) {
            return res.status(404).json({ 
                error: `brand of ID ${ id } not found` ,
                data: null
            });
        }

        res.status(200).json({
            data: brand,
            error: null
        });
    } catch (error) {
        console.log("Error fetching brand:", error);

        res.status(500).json({ 
            error: "Error fetching brand" ,
            data: null
        });
    }
}

// UPDATE a brand by ID
export async function updateBrandById(req: Request, res: Response) {

    try {

        const { id } = req.params;

        const { 
            name,              
            slug
    
        } = req.body;
        
    
        const existingbrand = await db.brand.findUnique({
            where: {
                id
            }
        });
        if (!existingbrand) {    
            return res.status(404).json({ 
                data: null,
                error: "brand not found" 
            });
        }

        if (slug !== existingbrand.slug) {
            // Check if the new slug is already taken by another brand
            const existingbrandBySlug = await db.brand.findUnique({
                where: {
                    slug
                },
            });
            if (existingbrandBySlug) {
                return res.status(409).json({ 
                    error: `brand with Slug: ${slug} and name ${name} already exists`,
                    data: null
                });
            }
        }

        // Update brand
        const updatedbrand = await db.brand.update({
            where: {
                id
            },
            data: {
                name,               
                slug
            }
        });

        return res.status(200).json({
            data: updatedbrand,
            error: null
        });

        
    } catch (error) {
        console.log("Error updating brand:", error);
        return res.status(500).json({
            error: "Internal server error",
            data: null
        });
    }

    
}

// DELETE a brand by ID
export async function deleteBrandById(req: Request, res: Response) {
    const { id } = req.params;
    
    try {
        const brand = await db.brand.findUnique({
            where: {
                id
            }
        });
        if (!brand) {    
            return res.status(404).json({ 
                data: null,
                error: "brand not found" 
            });
        }

        await db.brand.delete({
            where: {
                id
            }
        });

        return res.status(200).json({
            data: null,
            error: null
        });

        
    } catch (error) {
        console.log("Error deleting brand:", error);
        return res.status(500).json({
            error: "Internal server error",
            data: null
        });
    }

    
}