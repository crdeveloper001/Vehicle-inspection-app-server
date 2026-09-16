import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const generateReportForInspection = (data) => {
  // ==========================================
  // File paths
  // ==========================================

  const htmlFilePath = path.join(
    __dirname,
    "../HTML_Templates/RevisionParaCompra.html"
  );
  const cssFilePath = path.join(
    __dirname,
    "../HTML_Templates/RevisionParaCompra.css"
  );

  const htmlSource = fs.readFileSync(
    htmlFilePath,
    "utf8"
  );

  const cssSource = fs.readFileSync(
    cssFilePath,
    "utf8"
  );
  const template = handlebars.compile(htmlSource);
  const html = template(data);

  // ==========================================
  // Inject CSS into <head>
  // ==========================================

  const styledHtml = html.replace(
    /<\/head>/i,
    `
<style>
${cssSource}
</style>
</head>
`
  );

  return styledHtml; 
};

const generateHTMLForDiagnosticAndQuote = (data) => {
  // ==========================================
  // File paths
  // ==========================================

  const htmlFilePath = path.join(
    __dirname,
    "../HTML_Templates/DiagnosticAndQuote.html"
  );

  const cssFilePath = path.join(
    __dirname,
    "../HTML_Templates/DiagnosticReport.css"
  );


  const htmlSource = fs.readFileSync(
    htmlFilePath,
    "utf8"
  );

  const cssSource = fs.readFileSync(
    cssFilePath,
    "utf8"
  );

  // ==========================================
  // Compile Handlebars
  // ==========================================

  const template = handlebars.compile(htmlSource);

  const html = template(data);

  // ==========================================
  // Inject CSS into <head>
  // ==========================================

  const styledHtml = html.replace(
    /<\/head>/i,
    `
<style>
${cssSource}
</style>
</head>
`
  );

  return styledHtml;
};

export default {
  generateReportForInspection,
  generateHTMLForDiagnosticAndQuote
};