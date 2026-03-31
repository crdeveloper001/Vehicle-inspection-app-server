import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import * as controller from "../controllers/purchasereviewreport.controller.js";

const router = Router();

router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Ruta protegida 🔐",
    user: req.user,
  });
});

// 🔥 crear + guardar + generar PDF
router.post("/inspections", authMiddleware, controller.createInspectionAndPDF);
// descargar PDF por ID
router.get("/inspections/:id/pdf", controller.downloadInspectionPDF);
//obtener todas las inspecciones del usuario
router.get("/inspections", controller.getAllInspections);
//actualizar el campo selected de una inspección
router.put("/inspections/:id/selected", authMiddleware, controller.updateInspectionSelected);

export default router;