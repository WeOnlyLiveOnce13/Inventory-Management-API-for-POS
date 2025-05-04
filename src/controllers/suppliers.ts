import { db } from "@/db/db"
import { Request, Response } from "express";

// ALL SUPPLIERS ROUTES

// CREATE SUPPLIERS
export async function createSupplier(req: Request, res: Response) {
    const { 
        supplierType,
        name,
        contactPerson,
        phone,
        email,
        location,
        country,
        website,
        taxPin,
        registrationNumber,
        bankAccountNumber,
        bankName,
        paymentTerms,
        logo,
        rating,
        notes,
    } = req.body;
    
    try {

        // Check if phone, email or registrationNumber already exists
        const existingCustomerByPhone = await db.supplier.findUnique({
            where: {    
                phone: phone 
            },
        });

        if (existingCustomerByPhone) {
            return res.status(409).json({ 
                error: `Customer with phone number ${phone} already exists` ,
                data: null
            });
        }


        // If email is provided, check if it
        if (email) {
            const existingCustomerByEmail = await db.supplier.findUnique({
                where: {    
                    email: email 
                },
            });

            if (existingCustomerByEmail) {
                return res.status(409).json({ 
                    error: `Customer with email ${email} already exists` ,
                    data: null
                });
            }
        }

        // If registrationNumber is provided, check if it already exists
        if (registrationNumber) {
            const existingCustomerByRegistrationNumber = await db.supplier.findUnique({
                where: {    
                    registrationNumber: registrationNumber 
                },
            });
            if (existingCustomerByRegistrationNumber) {
                return res.status(409).json({ 
                    error: `Customer with national ID ${registrationNumber} already exists` ,
                    data: null
                });
            }
        }
        
  
        const newSupplier = await db.supplier.create({
            data: { 
                supplierType,
                name,
                contactPerson,
                phone,
                email,
                location,
                country,
                website,
                taxPin,
                registrationNumber,
                bankAccountNumber,
                bankName,
                paymentTerms,
                logo,
                rating,
                notes,
            },
        });

        return res.status(201).json(newSupplier);

    } catch (error) {
        console.log("Error creating supplier:", error);
        return res.status(500).json({
            error: "Error creating supplier",
            data: null
        });  
    }

}

// GET ALL CUSTOMERS
export async function getSuppliers(req: Request, res: Response) {

    try {
        
        const suppliers = await db.supplier.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });


        if (suppliers.length === 0) {
            return res.status(404).json({ message: "No suppliers found" });
        }

        return res.status(200).json(suppliers);
    } catch (error) {
        console.log("Error fetching suppliers:", error);
        return res.status(500).json({ 
            error: "Error fetching suppliers" ,
            data: null
        });
        
        
    }
    
}

// GET CUSTOMER BY ID
export async function getSupplierById(req: Request, res: Response) {
    const { id } = req.params;
    
    try {
        const supplier = await db.supplier.findUnique({
            where: {
                id      // parseInt(id) // if id is a number
            }
        });

        if (!supplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }

        return res.status(200).json(supplier);
    } catch (error) {
        console.log("Error fetching supplier:", error);
        return res.status(500).json({ 
            error: "Error fetching supplier" ,
            data: null
        });
        
    }

}