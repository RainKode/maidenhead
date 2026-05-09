import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PDFParse } from "pdf-parse";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const menuDir = path.join(root, "public", "menu");
const outputPath = path.join(root, "docs", "research", "menu-raw.txt");

const files = (await readdir(menuDir))
  .filter((file) => file.toLowerCase().endsWith(".pdf"))
  .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));

if (files.length === 0) {
  throw new Error(`No PDF files found in ${menuDir}`);
}

const sections = [];

for (const file of files) {
  const source = path.join(menuDir, file);
  const parser = new PDFParse({ url: source });

  try {
    const result = await parser.getText();
    sections.push([
      `===== ${file} =====`,
      result.text.trim(),
      "",
    ].join("\n"));
  } finally {
    await parser.destroy();
  }
}

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${sections.join("\n\n")}\n`, "utf8");

console.log(`Extracted ${files.length} menu PDFs to ${path.relative(root, outputPath)}`);