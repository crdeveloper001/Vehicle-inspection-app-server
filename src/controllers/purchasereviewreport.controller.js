import Inspection from "../Schemas/Inspections/PurchaseReviewReport.js";
import generateReportForInspection from "../utils/templates/template.js";
import generatePDF from "../utils/pdf/pdf.js";

const createInspectionAndPDF = async (req, res) => {
  try {
    const dataFromFrontend = req.body;

    // ✅ Validación básica
    if (!dataFromFrontend.plate || !dataFromFrontend.make) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    // 💾 1. Guardar en Mongo
    const inspection = new Inspection({
      ...dataFromFrontend,
      createdBy: req.createdByUserId || null, // Asignar el ID del usuario autenticado si está disponible
    });

    await inspection.save();

    // 🧠 2. Preparar datos para template
    const data = {
      _id: null,
      fecha: new Date().toLocaleDateString(),
      clientName: inspection.clientName,
      clientLastname: inspection.clientLastname,
      clientPhone: inspection.clientPhone,
      make: inspection.make,
      model: inspection.model,
      year: inspection.year,
      plate: inspection.plate,
      vin: inspection.vin,
      mileage: inspection.mileage,

      componentes: [
        {
          nombre: "Motor",
          estado: inspection.engineCondition,
          estadoClass:
            inspection.engineCondition === "Bueno" ? "status-ok" : "status-bad",
          obs: inspection.engineNotes,
        },
        {
          nombre: "Frenos",
          estado: inspection.brakeCondition,
          estadoClass:
            inspection.brakeCondition === "Bueno" ? "status-ok" : "status-bad",
          obs: inspection.brakeNotes,
        },
        {
          nombre: "Suspensión",
          estado: inspection.suspensionCondition,
          estadoClass:
            inspection.suspensionCondition === "Bueno" ? "status-ok" : "status-bad",
          obs: inspection.suspensionNotes,
        },
      ],

      body: inspection.body,
      interior: inspection.interior,
      tires: inspection.tires,
      conclusion: inspection.conclusion,
    };

    // 🧾 3. HTML
    const html = generateReportForInspection(data);

    // 📄 4. PDF
    const pdfBuffer = await generatePDF(html);

    // 📤 5. Respuesta
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=reporte-${inspection._id}.pdf`,
    });

    res.send(pdfBuffer);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
const downloadInspectionPDF = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔍 Buscar en DB
    const inspection = await Inspection.findById(id);

    if (!inspection) {
      return res.status(404).json({
        message: "Inspección no encontrada"
      });
    }

    // 🧠 Mapear datos para el template
    const data = {
      fecha: new Date(inspection.createdAt).toLocaleDateString(),

      clientName: inspection.clientName,
      clientLastname: inspection.clientLastname,
      clientPhone: inspection.clientPhone,
      make: inspection.make,
      model: inspection.model,
      year: inspection.year,
      plate: inspection.plate,
      vin: inspection.vin,
      mileage: inspection.mileage,

      componentes: [
        {
          nombre: "Motor",
          estado: inspection.engineCondition,
          estadoClass:
            inspection.engineCondition === "Bueno" ? "status-ok" : "status-bad",
          obs: inspection.engineNotes,
        },
        {
          nombre: "Frenos",
          estado: inspection.brakeCondition,
          estadoClass:
            inspection.brakeCondition === "Bueno" ? "status-ok" : "status-bad",
          obs: inspection.brakeNotes,
        },
        {
          nombre: "Suspensión",
          estado: inspection.suspensionCondition,
          estadoClass:
            inspection.suspensionCondition === "Bueno" ? "status-ok" : "status-bad",
          obs: inspection.suspensionNotes,
        },
      ],

      body: inspection.body,
      interior: inspection.interior,
      tires: inspection.tires,
      conclusion: inspection.conclusion,
    };

    // 🧾 Generar HTML
    const html = generateReportForInspection(data);

    // 📄 Generar PDF
    const pdfBuffer = await generatePDF(html);

    // 📤 Enviar archivo
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=reporte-${id}.pdf`,
    });

    res.send(pdfBuffer);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message
    });
  }
};

const getAllInspections = async (req, res) => {
  try {
    const inspections = await Inspection.find().sort({ createdAt: -1 });

    if (!inspections.length) {
      return res.status(404).json({ message: "No se encontraron inspecciones" });
    } else {
      res.json(inspections);
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
const updateInspectionSelected = async (req, res) => {
  try {
   
    const { id } = req.params;
    const update = req.body;


    const inspection = await Inspection.findById(id);
    

    if (!inspection) {
      return res.status(404).json({ message: "Inspección no encontrada" });
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
      "selected"
    ];

    allowedFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(update, field)) {
        inspection[field] = update[field];
      }
    });

    await inspection.save();

    res.json({ message: "Inspección actualizada", inspection });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

export {
  createInspectionAndPDF,
  downloadInspectionPDF,
  getAllInspections,
  updateInspectionSelected
};