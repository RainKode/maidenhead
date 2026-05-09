#!/usr/bin/env node
/**
 * Lightweight link audit. Walks src/app and src/components, flags any
 * href="#" or empty href="" placeholders so they are obvious before
 * shipping. Run with `node scripts/check-links.mjs`.
 */
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(process.cwd(), "src");
const EXTS = new Set([".ts", ".tsx", ".jsx", ".js"]);
const PATTERNS = [
  { name: "empty href", regex: /href=["']\s*["']/g },
  { name: "hash placeholder", regex: /href=["']#["']/g },
];

let total = 0;

async function walk(dir) {
  const entries = await readdir(dir);
  for (const entry of entries) {
    const full = path.join(dir, entry);
    const s = await stat(full);
    if (s.isDirectory()) {
      if (entry === "node_modules" || entry.startsWith(".")) continue;
      await walk(full);
    } else if (EXTS.has(path.extname(entry))) {
      const text = await readFile(full, "utf8");
      for (const { name, regex } of PATTERNS) {
        const matches = text.match(regex);
        if (matches) {
          total += matches.length;
          console.log(
            `  [${name}] ${path.relative(process.cwd(), full)} — ${matches.length} match${
              matches.length > 1 ? "es" : ""
            }`
          );
        }
      }
    }
  }
}

console.log("Scanning for placeholder links…");
await walk(ROOT);
if (total === 0) {
  console.log("✓ No placeholder hrefs found.");
  process.exit(0);
} else {
  console.log(`\n${total} placeholder link(s) found. Replace before shipping.`);
  process.exit(1);
}
