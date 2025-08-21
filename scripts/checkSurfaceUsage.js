import { globby } from "globby";
import fs from "node:fs/promises";

const files = await globby([
  "src/components/layout/**/*.{ts,tsx}",
  "src/components/**/panels/*.{ts,tsx}",
  "src/components/*Panel.tsx",
  "src/components/*Drawer.tsx",
  "src/components/*Sheet.tsx"
]);

const BG_SURFACE = /\bbg-surface\b/;

const offenders = [];
for (const f of files) {
  const src = await fs.readFile(f, "utf8");
  if (BG_SURFACE.test(src)) {
    offenders.push(f);
  }
}

if (offenders.length) {
  console.error("Surface usage violation in major container files:\n" + offenders.join("\n"));
  process.exit(1);
} else {
  console.log("✅ No bg-surface detected in major containers.");
}