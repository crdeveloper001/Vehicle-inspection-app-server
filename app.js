import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./src/routes/auth.routes.js";
import testRoutes from "./src/routes/test.routes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/api/test", testRoutes);

// DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch((err) => console.error(err));

// Routes
app.use("/api/auth", authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});