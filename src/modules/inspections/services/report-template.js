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
    "../templates/RevisionParaCompra.html"
  );
  const cssFilePath = path.join(
    __dirname,
    "../templates/RevisionParaCompra.css"
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

export default { generateReportForInspection };