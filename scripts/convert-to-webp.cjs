// convert-to-webp.js
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const inputDir = path.join(__dirname, "public");
const supportedExtensions = [".jpg", ".jpeg", ".png"];

function convertImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!supportedExtensions.includes(ext)) return;

  const webpPath = filePath.replace(ext, ".webp");

  sharp(filePath)
    .toFormat("webp")
    .toFile(webpPath)
    .then(() => {
      console.log(
        `✅ Convertido: ${path.basename(filePath)} → ${path.basename(webpPath)}`
      );
    })
    .catch((err) => {
      console.error(`❌ Erro ao converter ${filePath}:`, err);
    });
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath); // recursivo para subpastas
    } else {
      convertImage(fullPath);
    }
  });
}

console.log("🔄 Iniciando conversão para .webp...");
walkDir(inputDir);
