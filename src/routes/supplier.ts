import express from "express"
import { 
    createSupplier,
    getSupplierById, 
    getSuppliers,
} from "@/controllers/suppliers"

const supplierRouter = express.Router()

supplierRouter.post("/suppliers", createSupplier)
supplierRouter.get("/suppliers", getSuppliers);
supplierRouter.get("/suppliers/:id", getSupplierById);







export default supplierRouter