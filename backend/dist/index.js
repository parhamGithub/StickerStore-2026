import express from "express";
import cors from "cors";
import productsRouter from "./routes/products";
import categoriesRouter from "./routes/categories";
import ordersRouter from "./routes/orders";
import authRouter from "./routes/auth";
import { getDb } from "./db";
const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;
app.use(cors());
app.use(express.json());
// Seed on first startup
getDb();
app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/auth", authRouter);
app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
});
