import { Router } from "express";
import {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
} from "../controllers/clients.controller.js";

const router = Router();

// Create a new client
router.post("/", createClient);

// Get all clients
router.get("/", getAllClients);

// Get client by ID
router.get("/:id", getClientById);

// Update client by ID
router.put("/:id", updateClient);

// Delete client by ID
router.delete("/:id", deleteClient);

export default router;
