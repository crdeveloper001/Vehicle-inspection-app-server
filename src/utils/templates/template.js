import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function generateReportForInspection(data) {
  const filePath = path.join(__dirname, "../HTML_Templates/RevisionParaCompra.html");
  const source = fs.readFileSync(filePath, "utf8");

  const template = handlebars.compile(source);

  return template(data);
}

const generateHTMLForDiagnosticAndQuote = (data) => {
  const filePath = path.join(__dirname, "../HTML_Templates/DiagnosticAndQuote.html");
  const source = fs.readFileSync(filePath, "utf8");

  const template = handlebars.compile(source);

  return template(data);
}


export default {
  generateReportForInspection,
  generateHTMLForDiagnosticAndQuote
};