import express from "express";
import couponRoutes from "./routes/couponRoutes";
import { errorHandler } from "./utils/apiUtils";

const app = express();

app.use(express.json());

app.use("/", couponRoutes);

// Global Error Handler Middleware
app.use(errorHandler);

export default app;