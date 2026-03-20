import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Ruta protegida 🔐",
    user: req.user,
  });
});

export default router;