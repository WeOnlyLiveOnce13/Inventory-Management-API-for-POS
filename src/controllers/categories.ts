import { db } from "@/db/db";
import { Request, Response } from "express";


// CREATE a new Category
export async function createCategory(req: Request, res: Response) { 
    
    const {           
        name,            
        slug          
    } = req.body;

    try {
        

        // Check if the Category already exists
        const existingCategory = await db.category.findUnique({
            where: {
                slug
            }
        });

        if (existingCategory) {
            return res.status(409).json({ 
                error: `Category ${name} already exists` ,
                data: null
            });
        }

        // Create new shop
        const newCategory = await db.category.create({
            data: {
                name,            
                slug
            }
        });

        res.status(201).json({
            data: newCategory,
            error: null
        });
    } catch (error) {
        console.log("Error creating Category:", error);

        res.status(500).json({ 
            error: "Error creating Category" ,
            data: null
        });
    }
}


// GET all Categories
export async function getCategories(req: Request, res: Response) {

    try {
        const Categorys = await db.category.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });

        res.status(200).json({
            data: Categorys,
            error: null
        });
    } catch (error) {
        console.log("Error fetching Categorys:", error);

        res.status(500).json({ 
            error: "Error fetching Categorys" ,
            data: null
        });
    }
}

// GET a single Category by ID
export async function getSingleCategory(req: Request, res: Response) {

    const { id } = req.params;

    try {
        const Category = await db.category.findUnique({
            where: { 
                id 
            }
        });

        if (!Category) {
            return res.status(404).json({ 
                error: `Category of ID ${ id } not found` ,
                data: null
            });
        }

        res.status(200).json({
            data: Category,
            error: null
        });
    } catch (error) {
        console.log("Error fetching Category:", error);

        res.status(500).json({ 
            error: "Error fetching Category" ,
            data: null
        });
    }
}

// UPDATE a Category by ID
export async function updateCategoryById(req: Request, res: Response) {

    try {

        const { id } = req.params;

        const { 
            name,              
            slug
    
        } = req.body;
        
        if (!id) {
            return res.status(400).json({ 
                error: "Category ID is required" ,
                data: null
            });
        }
    
        const existingCategory = await db.category.findUnique({
            where: {
                id
            }
        });
        if (!existingCategory) {    
            return res.status(404).json({ 
                data: null,
                error: "Category not found" 
            });
        }

        if (slug !== existingCategory.slug) {
            // Check if the new slug is already taken by another Category
            const existingCategoryBySlug = await db.category.findUnique({
                where: {
                    slug
                },
            });
            if (existingCategoryBySlug) {
                return res.status(409).json({ 
                    error: `Category with Slug: ${slug} and name ${name} already exists`,
                    data: null
                });
            }
        }

        // Update Category
        const updatedCategory = await db.category.update({
            where: {
                id
            },
            data: {
                name,               
                slug
            }
        });

        return res.status(200).json({
            data: updatedCategory,
            error: null
        });

        
    } catch (error) {
        console.log("Error updating Category:", error);
        return res.status(500).json({
            error: "Internal server error",
            data: null
        });
    }

    
}

// DELETE a Category by ID
export async function deleteCategoryById(req: Request, res: Response) {
    const { id } = req.params;
    
    try {
        const Category = await db.category.findUnique({
            where: {
                id
            }
        });
        if (!Category) {    
            return res.status(404).json({ 
                data: null,
                error: "Category not found" 
            });
        }

        await db.category.delete({
            where: {
                id
            }
        });

        return res.status(200).json({
            data: null,
            error: null
        });

        
    } catch (error) {
        console.log("Error deleting Category:", error);
        return res.status(500).json({
            error: "Internal server error",
            data: null
        });
    }

    
}