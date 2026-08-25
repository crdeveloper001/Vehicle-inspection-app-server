import express from "express";
import { Router } from "express";

const router = Router();
import {
    createDiagnosticAndQuote,
    getAllDiagnosticAndQuotes,
    getDiagnosticAndQuoteById,
    updateDiagnosticAndQuote,
    deleteDiagnosticAndQuote
}
    from "../controllers/diagnosticAndQuote.controller.js";



router.post('/', createDiagnosticAndQuote);
router.get('/', getAllDiagnosticAndQuotes);
router.get('/:id', getDiagnosticAndQuoteById);
router.put('/:id', updateDiagnosticAndQuote);
router.delete('/:id', deleteDiagnosticAndQuote);

export default router;
