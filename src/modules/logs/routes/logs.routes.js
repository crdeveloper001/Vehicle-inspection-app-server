import { Router } from "express";
import { authMiddleware } from "../../../shared/middleware/auth.middleware.js";
import { getLogs } from "../controller/logs.controller.js";
import { requireLogsAccess } from "../middleware/requireLogsAccess.js";

const router = Router();

router.get("/", authMiddleware, requireLogsAccess, getLogs);

export default router;
