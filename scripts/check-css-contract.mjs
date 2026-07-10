import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL("../", import.meta.url));
const css = readFileSync(join(rootDir, "src", "styles", "global.css"), "utf8");
const layout = readFileSync(join(rootDir, "src", "layouts", "BaseLayout.astro"), "utf8");
const failures = [];

const forbiddenFontOrigins = ["fonts.googleapis.com", "fonts.gstatic.com"];
const approvedFontStack =
  'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

function fail(message) {
  failures.push(message);
}

for (const origin of forbiddenFontOrigins) {
  if (css.includes(origin) || layout.includes(origin)) {
    fail(`Active CSS and layout source must not reference ${origin}.`);
  }
}

for (const variable of ["--font-heading", "--font-body"]) {
  const declaration = `${variable}: ${approvedFontStack};`;
  if (!css.includes(declaration)) {
    fail(`global.css must declare ${declaration}`);
  }
}

if (!css.includes(":focus-visible")) {
  fail("global.css must keep a :focus-visible rule.");
}

if (!/outline\s*:\s*2px\s+solid\s+var\(--accent\)\s*;/.test(css)) {
  fail("global.css must keep a visible focus outline using the accent token.");
}

if (!/outline-offset\s*:\s*2px\s*;/.test(css)) {
  fail("global.css must keep focus outline offset.");
}

if (!/@media\s*\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)/.test(css)) {
  fail("global.css must keep a prefers-reduced-motion: reduce block.");
}

if (!/animation\s*:\s*none\s*!important\s*;/.test(css)) {
  fail("global.css must disable animation for reduced motion.");
}

if (!/transition\s*:\s*none\s*!important\s*;/.test(css)) {
  fail("global.css must disable transition for reduced motion.");
}

if (failures.length > 0) {
  console.error("CSS contract check failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("CSS contract check passed.");
