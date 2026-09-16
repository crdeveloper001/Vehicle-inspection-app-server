import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Handlebars from "handlebars";

import DiagnosticAndQuote from "../Schemas/diagnostics/DiagnosticAndQuote.js";
import generatePDF from "../utils/pdf/pdf.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templatePath = path.resolve(
	__dirname,
	"../utils/HTML_Templates/DiagnosticReport.html"
);

const stylesPath = path.resolve(
	__dirname,
	"../utils/HTML_Templates/DiagnosticReportStyles.css"
);

Handlebars.registerHelper("formatDate", (date) => {
	if (!date) return "";

	return new Date(date).toLocaleDateString();
});
const renderDiagnosticReport = async (report) => {
	// Read HTML and CSS
	const [templateSource, stylesSource] = await Promise.all([
		fs.readFile(templatePath, "utf8"),
		fs.readFile(stylesPath, "utf8"),
	]);

	// Compile Handlebars template
	const template = Handlebars.compile(templateSource);

	// Prepare report data
	const html = template({
		reportId: report._id?.toString() || "",

		ClientDetails: report.ClientDetails || [],

		VehicleDetails: report.VehicleDetails || [],

		DiagnosticName: report.DiagnosticName || [],

		DiagnosticTechinician:
			report.DiagnosticTechinician || "",

		DiagnosticComments:
			report.DiagnosticComments || [],

		DiagnosticSpares:
			report.DiagnosticSpares || [],

		DiagnosticTotal:
			report.DiagnosticTotal ?? 0,

		DiagnosticCreationDate:
			report.DiagnosticCreationDate,

		inspectionTime: report.createdAt
			? new Date(report.createdAt).toLocaleTimeString()
			: "",

		DiagnosticValid:
			report.DiagnosticValid,
	});
	const styledHtml = html.replace(
		"</head>",
		`
<style>
${stylesSource}
</style>
</head>`
	);

	return styledHtml;
};
const sendDiagnosticPDF = async (report, res) => {
	try {
		const html = await renderDiagnosticReport(report);

		const pdfBuffer = await generatePDF(html);

		res.set({
			"Content-Type": "application/pdf",

			"Content-Disposition":
				`attachment; filename=diagnostic-report-${report._id}.pdf`,
		});

		return res.send(pdfBuffer);

	} catch (error) {
		console.error("Error generating diagnostic PDF:", error);

		return res.status(500).json({
			error: error.message,
		});
	}
};

const createDiagnosticAndQuoteReport = async (req, res) => {
	try {
		const report = await DiagnosticAndQuote.create(req.body);

		return sendDiagnosticPDF(report, res);

	} catch (error) {
		console.error(error);

		return res.status(400).json({
			error: error.message,
		});
	}
};

const downloadDiagnosticAndQuoteReport = async (req, res) => {
	try {
		const report = await DiagnosticAndQuote.findById(
			req.params.id
		);

		if (!report) {
			return res.status(404).json({
				message: "Reporte no encontrado",
			});
		}

		return sendDiagnosticPDF(report, res);

	} catch (error) {
		console.error(error);

		return res.status(500).json({
			error: error.message,
		});
	}
};
export {
	createDiagnosticAndQuoteReport,
	downloadDiagnosticAndQuoteReport,
};