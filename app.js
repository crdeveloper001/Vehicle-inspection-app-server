import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import auth_Routes from "./src/routes/auth.routes.js";
import purchase_review_reporte_routes from "./src/routes/purchase_review_report.routes.js";
import profile_Routes from "./src/routes/profile.routes.js";
import clients_Routes from "./src/routes/clients.route.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch((err) => console.error(err));

// Routes use api/featureName
app.use("/api/auth", auth_Routes);
app.use("/api/profiles", profile_Routes);
app.use("/api/inspections", purchase_review_reporte_routes);
app.use("/api/clients", clients_Routes);

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});