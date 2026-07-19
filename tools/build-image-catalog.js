"use strict";

const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const imagesFolder = path.join(projectRoot, "images");
const outputFile = path.join(imagesFolder, "image-catalog.js");

function buildImageCatalog() {
  if (!fs.existsSync(imagesFolder)) {
    throw new Error(`Images folder not found: ${imagesFolder}`);
  }

  const imageFiles = fs
    .readdirSync(imagesFolder, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((fileName) => /\.jpg$/i.test(fileName))
    .sort((a, b) => a.localeCompare(b));

  const imagePaths = imageFiles.map((fileName) => `images/${fileName}`);

  const catalogContents = `"use strict";

window.CLASSROOM_IMAGES = ${JSON.stringify(imagePaths, null, 2)};
`;

  fs.writeFileSync(outputFile, catalogContents, "utf8");

  console.log(
    `Created ${path.relative(projectRoot, outputFile)} with ${imagePaths.length} image(s).`,
  );
}

try {
  buildImageCatalog();
} catch (error) {
  console.error("Image catalog could not be created.");
  console.error(error.message);
  process.exitCode = 1;
}
