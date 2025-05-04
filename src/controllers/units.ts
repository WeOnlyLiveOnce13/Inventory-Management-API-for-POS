import { db } from "@/db/db";
import { Request, Response } from "express";


// CREATE a new unit
export async function createUnit(req: Request, res: Response) { 
    
    const {           
        name,               
        abbreviation,       
        slug          
    } = req.body;

    try {
        

        // Check if the unit already exists
        const existingUnit = await db.unit.findUnique({
            where: {
                slug
            }
        });

        if (existingUnit) {
            return res.status(409).json({ 
                error: `Unit ${name} already exists` ,
                data: null
            });
        }

        // Create new shop
        const newUnit = await db.unit.create({
            data: {
                name,               
                abbreviation,       
                slug
            }
        });

        res.status(201).json({
            data: newUnit,
            error: null
        });
    } catch (error) {
        console.log("Error creating unit:", error);

        res.status(500).json({ 
            error: "Error creating unit" ,
            data: null
        });
    }
}


// GET all units
export async function getUnits(req: Request, res: Response) {

    try {
        const units = await db.unit.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });

        res.status(200).json({
            data: units,
            error: null
        });
    } catch (error) {
        console.log("Error fetching units:", error);

        res.status(500).json({ 
            error: "Error fetching units" ,
            data: null
        });
    }
}

// GET a single unit by ID
export async function getSingleUnit(req: Request, res: Response) {

    const { id } = req.params;

    try {
        const unit = await db.unit.findUnique({
            where: { 
                id 
            }
        });

        if (!unit) {
            return res.status(404).json({ 
                error: `Unit of ID ${ id } not found` ,
                data: null
            });
        }

        res.status(200).json({
            data: unit,
            error: null
        });
    } catch (error) {
        console.log("Error fetching unit:", error);

        res.status(500).json({ 
            error: "Error fetching unit" ,
            data: null
        });
    }
}

// UPDATE a unit by ID
export async function updateUnitById(req: Request, res: Response) {

    try {

        const { id } = req.params;

        const { 
            name,               
            abbreviation,       
            slug
    
        } = req.body;
        
    
        const existingUnit = await db.unit.findUnique({
            where: {
                id
            }
        });
        if (!existingUnit) {    
            return res.status(404).json({ 
                data: null,
                error: "Unit not found" 
            });
        }

        if (slug !== existingUnit.slug) {
            // Check if the new slug is already taken by another unit
            const existingUnitBySlug = await db.unit.findUnique({
                where: {
                    slug
                },
            });
            if (existingUnitBySlug) {
                return res.status(409).json({ 
                    error: `Unit with Slug: ${slug} and name ${name} already exists`,
                    data: null
                });
            }
        }

        // Update unit
        const updatedUnit = await db.unit.update({
            where: {
                id
            },
            data: {
                name,               
                abbreviation,       
                slug
            }
        });

        return res.status(200).json({
            data: updatedUnit,
            error: null
        });

        
    } catch (error) {
        console.log("Error updating unit:", error);
        return res.status(500).json({
            error: "Internal server error",
            data: null
        });
    }

    
}

// DELETE a unit by ID
export async function deleteUnitById(req: Request, res: Response) {
    const { id } = req.params;
    
    try {
        const unit = await db.unit.findUnique({
            where: {
                id
            }
        });
        if (!unit) {    
            return res.status(404).json({ 
                data: null,
                error: "Unit not found" 
            });
        }

        await db.unit.delete({
            where: {
                id
            }
        });

        return res.status(200).json({
            data: null,
            error: null
        });

        
    } catch (error) {
        console.log("Error deleting unit:", error);
        return res.status(500).json({
            error: "Internal server error",
            data: null
        });
    }

    
}