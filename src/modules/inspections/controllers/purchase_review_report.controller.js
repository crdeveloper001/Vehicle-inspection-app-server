import Inspection from "../Schemas/Inspections/PurchaseReviewReport.js";
import templateUtils from "../utils/templates/template.js";
import generatePDF from "../utils/pdf/pdf.js";

// ============================================================
// MAP INSPECTION DATA FOR TEMPLATE
// ============================================================

const mapInspectionToTemplate = (inspection) => {
  return {
    _id: inspection._id?.toString() || "",

    fecha: inspection.createdAt
      ? new Date(inspection.createdAt).toLocaleDateString()
      : new Date().toLocaleDateString(),

    clientName: inspection.clientName || "",
    clientLastname: inspection.clientLastname || "",
    clientPhone: inspection.clientPhone || "",

    make: inspection.make || "",
    model: inspection.model || "",
    year: inspection.year || "",
    plate: inspection.plate || "",
    vin: inspection.vin || "",
    mileage: inspection.mileage || "",

    componentes: [
      {
        nombre: "Motor",
        estado: inspection.engineCondition || "",
        estadoClass:
          inspection.engineCondition === "Bueno"
            ? "status-ok"
            : "status-bad",
        obs: inspection.engineNotes || "",
      },
      {
        nombre: "Frenos",
        estado: inspection.brakeCondition || "",
        estadoClass:
          inspection.brakeCondition === "Bueno"
            ? "status-ok"
            : "status-bad",
        obs: inspection.brakeNotes || "",
      },
      {
        nombre: "Suspensión",
        estado: inspection.suspensionCondition || "",
        estadoClass:
          inspection.suspensionCondition === "Bueno"
            ? "status-ok"
            : "status-bad",
        obs: inspection.suspensionNotes || "",
      },
    ],

    body: inspection.body || "",
    interior: inspection.interior || "",
    tires: inspection.tires || "",
    conclusion: inspection.conclusion || "",
  };
};

// ============================================================
// GENERATE + SEND PDF
// ============================================================

const sendInspectionPDF = async (inspection, res) => {
  try {
    const data = mapInspectionToTemplate(inspection);

    // HTML template
    const html = await templateUtils.generateReportForInspection(data);

    // PDF
    const pdfBuffer = await generatePDF(html);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition":
        `attachment; filename=reporte-${inspection._id}.pdf`,
    });

    return res.send(pdfBuffer);

  } catch (error) {
    console.error("Error generating inspection PDF:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
};

// ============================================================
// CREATE INSPECTION + PDF
// ============================================================

const createInspectionAndPDF = async (req, res) => {
  try {
    const dataFromFrontend = req.body;

    // Basic validation
    if (!dataFromFrontend.plate || !dataFromFrontend.make) {
      return res.status(400).json({
        message: "Datos incompletos",
      });
    }

    // Save to MongoDB
    const inspection = new Inspection({
      ...dataFromFrontend,
      createdBy: req.createdByUserId || null,
    });

    await inspection.save();

    // Generate + send PDF
    return sendInspectionPDF(inspection, res);

  } catch (error) {
    console.error("Error creating inspection:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
};

// ============================================================
// DOWNLOAD EXISTING INSPECTION PDF
// ============================================================

const downloadInspectionPDF = async (req, res) => {
  try {
    const { id } = req.params;

    const inspection = await Inspection.findById(id);

    if (!inspection) {
      return res.status(404).json({
        message: "Inspección no encontrada",
      });
    }

    return sendInspectionPDF(inspection, res);

  } catch (error) {
    console.error("Error downloading inspection PDF:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
};

// ============================================================
// GET ALL INSPECTIONS
// ============================================================

const getAllInspections = async (req, res) => {
  try {
    const inspections = await Inspection.find().sort({
      createdAt: -1,
    });

    if (!inspections.length) {
      return res.status(404).json({
        message: "No se encontraron inspecciones",
      });
    }

    return res.json(inspections);

  } catch (error) {
    console.error("Error getting inspections:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
};

// ============================================================
// UPDATE INSPECTION
// ============================================================

const updateInspectionSelected = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;

    const inspection = await Inspection.findById(id);

    if (!inspection) {
      return res.status(404).json({
        message: "Inspección no encontrada",
      });
    }

    const allowedFields = [
      "clientName",
      "clientLastname",
      "clientPhone",
      "make",
      "model",
      "year",
      "plate",
      "vin",
      "mileage",
      "engineCondition",
      "engineNotes",
      "brakeCondition",
      "brakeNotes",
      "suspensionCondition",
      "suspensionNotes",
      "body",
      "interior",
      "tires",
      "conclusion",
      "selected",
    ];

    allowedFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(update, field)) {
        inspection[field] = update[field];
      }
    });

    await inspection.save();

    return res.json({
      message: "Inspección actualizada",
      inspection,
    });

  } catch (error) {
    console.error("Error updating inspection:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
};

// ============================================================
// DELETE INSPECTION
// ============================================================

const deleteInspectionById = async (req, res) => {
  try {
    const { id } = req.params;

    const inspection = await Inspection.findByIdAndDelete(id);

    if (!inspection) {
      return res.status(404).json({
        message: "Inspección no encontrada",
      });
    }

    return res.json({
      message: "Inspección eliminada",
      inspection,
    });

  } catch (error) {
    console.error("Error deleting inspection:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
};

export {
  createInspectionAndPDF,
  downloadInspectionPDF,
  getAllInspections,
  updateInspectionSelected,
  deleteInspectionById,
};