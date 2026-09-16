import express from "express";
import { Router } from "express";
import {
    createDiagnosticAndQuote,
    getAllDiagnosticAndQuotes,
    getDiagnosticAndQuoteById,
    updateDiagnosticAndQuote,
    deleteDiagnosticAndQuote
}
    from "../controllers/diagnostic_And_Quote.controller.js";
import {createDiagnosticAndQuoteReport, downloadDiagnosticAndQuoteReport} from "../controllers/diagnostic_And_Quote_Report.controller.js";

const router = Router();

// Data CRUD routes
router.post('/', createDiagnosticAndQuote);
router.get('/', getAllDiagnosticAndQuotes);
router.get('/:id', getDiagnosticAndQuoteById);
router.put('/:id', updateDiagnosticAndQuote);
router.delete('/:id', deleteDiagnosticAndQuote);
// PDF report routes
router.post('/report', createDiagnosticAndQuoteReport);
router.get('/:id/report', downloadDiagnosticAndQuoteReport);

export default router;
