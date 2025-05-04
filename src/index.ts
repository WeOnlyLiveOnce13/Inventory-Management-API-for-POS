import express from "express";
import customerRouter from "./routes/customer";
import userRouter from "./routes/user";
import shopRouter from "./routes/shop";
import supplierRouter from "./routes/supplier";
import authRouter from "./routes/auth";
import unitRouter from "./routes/unit";
import productRouter from "./routes/product";
import BrandRouter from "./routes/brand";
import categoryRouter from "./routes/category";

require("dotenv").config();
const cors = require("cors");
const app = express();

app.use(cors());

const PORT = process.env.PORT || 8000;

app.use(express.json());

// Routes
app.use("/api/v1", authRouter)
app.use("/api/v1", customerRouter)
app.use("/api/v1", categoryRouter)
app.use("/api/v1", BrandRouter)
app.use("/api/v1", userRouter)
app.use("/api/v1", shopRouter)
app.use("/api/v1", unitRouter)
app.use("/api/v1", supplierRouter)
app.use("/api/v1", productRouter)

// Example protected route
        // app.get("/protected", verifyToken, (req, res) => {
        //   // If JWT is valid, return the protected content
        //   res
        //     .status(200)
        //     .json({ message: "Welcome to the protected page!", user: req.user });
        // });



app.listen(PORT, () => {
  
  console.log(`Server is running on http://localhost:${PORT}`); 
});


