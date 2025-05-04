import { 
    createBrand,
    getBrands,
    getSingleBrand,
    updateBrandById,
    deleteBrandById
 } from "@/controllers/brands"
import express from "express"

const BrandRouter = express.Router()

BrandRouter.post("/Brands", createBrand)
BrandRouter.get("/Brands", getBrands);
BrandRouter.get("/Brands/:id", getSingleBrand);
BrandRouter.put("/Brands/:id", updateBrandById);
BrandRouter.delete("/Brands/:id", deleteBrandById);







export default BrandRouter