import { db } from "@/db/db"
import { Request, Response } from "express";

// ALL CUSTOMERS ROUTES

// CREATE CUSTOMER
export async function createCustomer(req: Request, res: Response) {
    const { 
        customerType,
        firstName,
        lastName,
        phone,
        gender,
        maxCreditLimmit,
        maxCreditDays,
        taxPin,
        dob,
        email,
        nationalID,
        country,
        location
    } = req.body;
    
    try {

        // Check if phone, email or nationalID already exists
        const existingCustomerByPhone = await db.customer.findUnique({
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
            const existingCustomerByEmail = await db.customer.findUnique({
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

        // If nationalID is provided, check if it already exists
        if (nationalID) {
            const existingCustomerByNationalID = await db.customer.findUnique({
                where: {    
                    nationalID: nationalID 
                },
            });
            if (existingCustomerByNationalID) {
                return res.status(409).json({ 
                    error: `Customer with national ID ${nationalID} already exists` ,
                    data: null
                });
            }
        }
        
  
        const newCustomer = await db.customer.create({
            data: { 
                customerType,
                firstName,
                lastName,
                phone,
                gender,
                maxCreditLimmit,
                maxCreditDays,
                taxPin,
                dob,
                email,
                nationalID,
                country,
                location
            },
        });

        return res.status(201).json(newCustomer);

    } catch (error) {
        console.log("Error creating customer:", error);
        return res.status(500).json({
            error: "Error creating customer",
            data: null
        });  
    }

}

// GET ALL CUSTOMERS
export async function getCustomers(req: Request, res: Response) {

    try {
        
        const customers = await db.customer.findMany({
            orderBy: {
                createdAt: "desc"
            },
            // select: {
            //     id: true,
            //     name: true,
            //     email: true,
            //     phone: true,
            // },
        });


        if (customers.length === 0) {
            return res.status(404).json({ message: "No customers found" });
        }

        return res.status(200).json(customers);
    } catch (error) {
        console.error("Error fetching customers:", error);
        
        
    }
    
}

// GET CUSTOMER BY ID
export async function getCustomerById(req: Request, res: Response) {
    const { id } = req.params;
    
    try {
        const customer = await db.customer.findUnique({
            where: {
                id      // parseInt(id) // if id is a number
            }
        });

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        return res.status(200).json(customer);
    } catch (error) {
        console.error("Error fetching customer:", error);
        
    }

}
