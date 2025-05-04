import { 
    createProduct,
    getProducts,
    getProductById,
    updateProductById,
    deleteProductById
 } from "@/controllers/products"
import express from "express"

const productRouter = express.Router()

productRouter.post("/products", createProduct)
productRouter.get("/products", getProducts);
productRouter.get("/products/:id", getProductById);
productRouter.put("/products/:id", updateProductById);
productRouter.delete("/products/:id", deleteProductById);







export default productRouter