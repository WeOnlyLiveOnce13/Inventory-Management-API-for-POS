import express from "express"
import { 
    createCustomer,
    getCustomerById, 
    getCustomers,
} from "@/controllers/customers";

const customerRouter = express.Router()

customerRouter.post("/customers", createCustomer)
customerRouter.get("/customers", getCustomers);
customerRouter.get("/customers/:id", getCustomerById);







export default customerRouter