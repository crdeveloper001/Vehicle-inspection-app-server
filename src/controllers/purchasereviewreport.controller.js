import Inspection from "../models/PurchaseReviewReport.js";
import generateHTML from "../utils/templates/template.js";
import generatePDF from "../utils/pdf/pdf.js";

const createInspectionAndPDF = async (req, res) => {
  try {
    const dataFromFrontend = req.body;

    // ✅ Validación básica
    if (!dataFromFrontend.placa || !dataFromFrontend.marca) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    // 💾 1. Guardar en Mongo
    const inspection = new Inspection({
      ...dataFromFrontend,
      createdBy: req.user.id
    });

    await inspection.save();

    // 🧠 2. Preparar datos para template
    const data = {
      fecha: new Date().toLocaleDateString(),

      marca: inspection.marca,
      modelo: inspection.modelo,
      anio: inspection.anio,
      placa: inspection.placa,
      vin: inspection.vin,
      kilometraje: inspection.kilometraje,

      componentes: [
        {
          nombre: "Motor",
          estado: inspection.motor_estado,
          estadoClass:
            inspection.motor_estado === "Bueno" ? "status-ok" : "status-bad",
          obs: inspection.motor_obs,
        },
        {
          nombre: "Frenos",
          estado: inspection.frenos_estado,
          estadoClass:
            inspection.frenos_estado === "Bueno" ? "status-ok" : "status-bad",
          obs: inspection.frenos_obs,
        },
        {
          nombre: "Suspensión",
          estado: inspection.suspension_estado,
          estadoClass:
            inspection.suspension_estado === "Bueno" ? "status-ok" : "status-bad",
          obs: inspection.suspension_obs,
        },
      ],

      carroceria: inspection.carroceria,
      interior: inspection.interior,
      llantas: inspection.llantas,
      conclusion: inspection.conclusion,
    };

    // 🧾 3. HTML
    const html = generateHTML(data);

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

      marca: inspection.marca,
      modelo: inspection.modelo,
      anio: inspection.anio,
      placa: inspection.placa,
      vin: inspection.vin,
      kilometraje: inspection.kilometraje,

      componentes: [
        {
          nombre: "Motor",
          estado: inspection.motor_estado,
          estadoClass:
            inspection.motor_estado === "Bueno" ? "status-ok" : "status-bad",
          obs: inspection.motor_obs,
        },
        {
          nombre: "Frenos",
          estado: inspection.frenos_estado,
          estadoClass:
            inspection.frenos_estado === "Bueno" ? "status-ok" : "status-bad",
          obs: inspection.frenos_obs,
        },
        {
          nombre: "Suspensión",
          estado: inspection.suspension_estado,
          estadoClass:
            inspection.suspension_estado === "Bueno" ? "status-ok" : "status-bad",
          obs: inspection.suspension_obs,
        },
      ],

      carroceria: inspection.carroceria,
      interior: inspection.interior,
      llantas: inspection.llantas,
      conclusion: inspection.conclusion,
    };

    // 🧾 Generar HTML
    const html = generateHTML(data);

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

export {
  createInspectionAndPDF, 
  downloadInspectionPDF
};