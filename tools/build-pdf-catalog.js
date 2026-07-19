"use strict";

const fs = require("fs");
const path = require("path");

const pdfFolder = path.join(__dirname, "..", "assets", "pdfs");
const outputFile = path.join(pdfFolder, "catalog.js");

const supportedExtensions = new Set([".pdf"]);

if (!fs.existsSync(pdfFolder)) {
  fs.mkdirSync(pdfFolder, { recursive: true });
}

const pdfFiles = fs
  .readdirSync(pdfFolder, { withFileTypes: true })
  .filter((entry) => entry.isFile())
  .map((entry) => entry.name)
  .filter((fileName) => supportedExtensions.has(path.extname(fileName).toLowerCase()))
  .sort((a, b) => a.localeCompare(b));

const catalogContents = `"use strict";

window.CLASSROOM_PDFS = ${JSON.stringify(pdfFiles, null, 2)};
`;

fs.writeFileSync(outputFile, catalogContents, "utf8");

console.log(`PDF catalog created with ${pdfFiles.length} file(s).`);
console.log(outputFile);
