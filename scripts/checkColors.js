import { globby } from "globby";
import fs from "node:fs/promises";

const files = await globby([
  "src/**/*.{ts,tsx,css}",
  "styles/**/*.{css,ts}",
  "components/**/*.{ts,tsx,css}",
]);

const HEX = /#[0-9a-fA-F]{3,8}\b/;
const RGB = /\brgba?\s*\(/i;
const HSL = /\bhsl[a]?\s*\(/i;
const TW_ARBITRARY = /\b(?:bg|text|border|from|via|to)-\[[^\]]+\]/;

const offenders = [];
for (const f of files) {
  const src = await fs.readFile(f, "utf8");
  if (HEX.test(src) || RGB.test(src) || HSL.test(src) || TW_ARBITRARY.test(src)) {
    offenders.push(f);
  }
}

if (offenders.length) {
  console.error("Color token violation in files:\n" + offenders.join("\n"));
  process.exit(1);
} else {
  console.log("✅ No raw colors detected.");
}