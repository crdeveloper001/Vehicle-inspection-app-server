import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { authRoutes, profileRoutes } from "./src/modules/users/index.js";
import clientsRoutes from "./src/modules/clients/index.js";
import inspectionsRoutes from "./src/modules/inspections/index.js";
import diagnosticsRoutes from "./src/modules/diagnostics/index.js";
import { logApiRequest, logsRoutes } from "./src/modules/logs/index.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/api", logApiRequest);

// DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch((err) => console.error(err));

// Routes use api/featureName
app.use("/api/auth", authRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/inspections", inspectionsRoutes);
app.use("/api/clients", clientsRoutes);
app.use("/api/diagnostics", diagnosticsRoutes);
app.use("/api/logs", logsRoutes);


app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});