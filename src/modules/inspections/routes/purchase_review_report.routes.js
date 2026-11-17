import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import * as controller from "../controllers/purchase_review_report.controller.js";

const router = Router();

router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Ruta protegida 🔐",
    user: req.user,
  });
});

// 🔥 crear + guardar + generar PDF
router.post("/", controller.createInspectionAndPDF);
// descargar PDF por ID
router.get("/:id/pdf", controller.downloadInspectionPDF);
//obtener todas las inspecciones del usuario
router.get("/", controller.getAllInspections);
//actualizar el campo selected de una inspección
router.put("/:id", controller.updateInspectionSelected);
router.delete("/:id", controller.deleteInspectionById);
export default router;