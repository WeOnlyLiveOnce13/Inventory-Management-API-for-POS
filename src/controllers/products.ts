import { db } from "@/db/db";
import { Request, Response } from "express";
import bcrypt from "bcrypt";


// CREATE Product
export async function createProduct(req: Request, res: Response) {
    const { 
        name,
        description,
        batchNumber,
        barCode,
        image,
        tax,
        alertQty,
        stockQty,
        price,
        buyingPrice,
        sku,
        productCode,
        slug,
        supplierId,
        unitId,
        brandId,
        categoryId,
        expiryDate,

    } = req.body;
    
    try {

        // barCode is optional field
        if (barCode) {
            const existingProductByBarCode = await db.product.findUnique({
                where: {
                    barCode
                },
            });

            if (existingProductByBarCode) {
                return res.status(409).json({ 
                    error: `Product with barCode: ${barCode} already exists`,
                    data: null
                });
            }
        }
        

        const existingProductBySlug = await db.product.findUnique({
            where: {
                slug
            },
        });

        const existingProductBySku= await db.product.findUnique({
            where: {
                sku
            },
        });

        const existingProductByProductCode= await db.product.findUnique({
            where: {
                productCode
            },
        });


        if (existingProductBySlug) {
            return res.status(409).json({ 
                error: `Product with slug: ${slug} already exists`,
                data: null
            });
        }

        if (existingProductBySku) {
            return res.status(409).json({ 
                error: `Product with sku: ${sku} already exists`,
                data: null
            });
        }

        if (existingProductByProductCode) {
            return res.status(409).json({ 
                error: `Product with product code: ${productCode} already exists`,
                data: null
            });
        }

        

        const newProduct = await db.product.create({
            data: {
                name,
                description,
                batchNumber,
                barCode,
                image,
                tax,
                alertQty,
                stockQty,
                price,
                buyingPrice,
                sku,
                productCode,
                slug,
                supplierId,
                unitId,
                brandId,
                categoryId,
                expiryDate,
            }
        });
        

        // Response 
        return res.status(201).json({
            data: newProduct,
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

// GET ALL ProductS
export async function getProducts(req: Request, res: Response) {
    try {
        
        const products = await db.product.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });


        if (products.length === 0) {
            return res.status(404).json({ message: "No Products found" });
        }

        // const filteredProducts = Products.map((Product) => {
        //     const { password, ...others } = Product;
        //     return others;
        // });

        // data: filteredProducts,
        
        return res.status(200).json({
            data: products,
            error: null
        });

    } catch (error) {
        console.log("Error fetching Products:", error);
        return res.status(500).json({
            error: "Internal server error", 
            data: null
        });
        
    }
}


// GET Product BY ID
export async function getProductById(req: Request, res: Response) {
    const { id } = req.params;
    
    try {
        const product = await db.product.findUnique({
            where: {
                id      
            }
        });

        if (!product) {
            return res.status(404).json({ 
                data: null,
                error: "Product not found" 
            });
        }
  
        return res.status(200).json({
            data: product,
            error: null
        });
    } catch (error) {
        console.log("Error fetching Product:", error);
        return res.status(500).json({
            error: "Internal server error",
            data: null
        });
    }
}

// UPDATE Product BY ID
export async function updateProductById(req: Request, res: Response) {

    try {

        const { id } = req.params;

        const { 
            name,
            description,
            batchNumber,
            barCode,
            image,
            tax,
            alertQty,
            stockQty,
            price,
            buyingPrice,
            sku,
            productCode,
            slug,
            supplierId,
            unitId,
            brandId,
            categoryId,
            expiryDate,
    
        } = req.body;
        
    
        const existingProduct = await db.product.findUnique({
            where: {
                id
            }
        });
        if (!existingProduct) {    
            return res.status(404).json({ 
                data: null,
                error: "Product not found" 
            });
        }

        // If an barCode is provided and it's different from the existing Product's barCode -> check if it already exists
        if (barCode && barCode !== existingProduct.barCode) {
            // Check if barCode already exists for another Product
            const existingProductBybarCode = await db.product.findUnique({
                where: {
                    barCode
                },
            });

            // If barCode already exists, return error
            if (existingProductBybarCode) {
                return res.status(409).json({ 
                    error: `barCode ${barCode} already exists`,
                    data: null
                });
            }
        }

        // If a productCode is provided and it's different from the existing Product's productCode -> check if it already exists
        if (productCode && productCode !== existingProduct.productCode) {
            // Check if productCode already exists for another Product
            const existingProductByproductCode = await db.product.findUnique({
                where: {
                    productCode
                },
            });
            if (existingProductByproductCode) {
                return res.status(409).json({ 
                    error: `productCode ${productCode} already exists`,
                    data: null
                });
            }
        }

        // If a sku is provided and it's different from the existing Product's sku -> check if it already exists
        if (slug && slug !== existingProduct.slug) {
            // Check if slug already exists for another Product
            const existingProductByslug = await db.product.findUnique({
                where: {
                    slug
                },
            });
            if (existingProductByslug) {
                return res.status(409).json({ 
                    error: `slug ${slug} already exists`,
                    data: null
                });
            }
        }

        if (sku && sku !== existingProduct.sku) {
            // Check if sku already exists for another Product
            const existingProductBysku = await db.product.findUnique({
                where: {
                    sku
                },
            });
            if (existingProductBysku) {
                return res.status(409).json({ 
                    error: `sku ${sku} already exists`,
                    data: null
                });
            }
        }

 
        // Update Product
        const updatedProduct = await db.product.update({
            where: {
                id
            },
            data: {
                name,
                description,
                batchNumber,
                barCode,
                image,
                tax,
                alertQty,
                stockQty,
                price,
                buyingPrice,
                sku,
                productCode,
                slug,
                supplierId,
                unitId,
                brandId,
                categoryId,
                expiryDate,
            }
        });


        return res.status(200).json({
            data: updatedProduct,
            error: null
        });

        
    } catch (error) {
        console.log("Error updating Product:", error);
        return res.status(500).json({
            error: "Internal server error",
            data: null
        });
    }

    
}


// DELETE Product BY ID
export async function deleteProductById(req: Request, res: Response) {
    const { id } = req.params;
    
    try {
        const Product = await db.product.findUnique({
            where: {
                id
            }
        });
        if (!Product) {    
            return res.status(404).json({ 
                data: null,
                error: "Product not found" 
            });
        }

        await db.product.delete({
            where: {
                id
            }
        });

        return res.status(200).json({
            data: null,
            error: null
        });

        
    } catch (error) {
        console.log("Error deleting Product:", error);
        return res.status(500).json({
            error: "Internal server error",
            data: null
        });
    }

    
}

