import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL("../", import.meta.url));
const css = readFileSync(join(rootDir, "src", "styles", "global.css"), "utf8");
const failures = [];

function fail(message) {
  failures.push(message);
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
