import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PDFParse } from "pdf-parse";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const menuDir = path.join(root, "public", "menu");
const outputDir = path.join(root, "docs", "research", "menu-pages");

const files = (await readdir(menuDir))
  .filter((file) => file.toLowerCase().endsWith(".pdf"))
  .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));

await mkdir(outputDir, { recursive: true });

for (const [index, file] of files.entries()) {
  const parser = new PDFParse({ url: path.join(menuDir, file) });

  try {
    const result = await parser.getScreenshot({
      desiredWidth: 1800,
      imageBuffer: true,
      imageDataUrl: false,
    });
    const [page] = result.pages;
    if (!page) throw new Error(`No page rendered for ${file}`);
    const outputPath = path.join(outputDir, `page-${index + 1}.png`);
    await writeFile(outputPath, page.data);
    console.log(`Rendered ${file} to ${path.relative(root, outputPath)}`);
  } finally {
    await parser.destroy();
  }
}