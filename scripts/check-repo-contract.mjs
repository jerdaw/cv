import { lstatSync, readFileSync, readlinkSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL("../", import.meta.url));
const failures = [];

function fail(message) {
  failures.push(message);
}

function readText(file) {
  return readFileSync(join(rootDir, file), "utf8");
}

function assertRelativeSymlink(file, target) {
  const path = join(rootDir, file);
  const stats = lstatSync(path);

  if (!stats.isSymbolicLink()) {
    fail(`${file} must remain a symlink to ${target}.`);
    return;
  }

  const actualTarget = readlinkSync(path);
  if (actualTarget !== target) {
    fail(`${file} must point to ${target}; found ${actualTarget}.`);
  }
}

assertRelativeSymlink("CLAUDE.md", "AGENTS.md");
assertRelativeSymlink("GEMINI.md", "AGENTS.md");

const nodeVersion = readText(".node-version").trim();
if (nodeVersion !== "24") {
  fail(`.node-version must remain 24; found ${nodeVersion || "<empty>"}.`);
}

const tsconfig = JSON.parse(readText("tsconfig.json"));
const tsconfigExcludes = tsconfig.exclude ?? [];
if (!Array.isArray(tsconfigExcludes) || !tsconfigExcludes.includes("src/legacy-public")) {
  fail("tsconfig.json must exclude src/legacy-public.");
}

if (!Array.isArray(tsconfigExcludes) || !tsconfigExcludes.includes("dist")) {
  fail("tsconfig.json must exclude dist.");
}

const deployWorkflow = readText(".github/workflows/deploy.yml");
if (!/^\s*workflow_dispatch:\s*$/m.test(deployWorkflow)) {
  fail("Deploy workflow must remain manually dispatchable with workflow_dispatch.");
}

for (const eventName of ["push", "pull_request", "schedule"]) {
  if (new RegExp(`^\\s{2}${eventName}:\\s*$`, "m").test(deployWorkflow)) {
    fail(`Deploy workflow must remain manual-only; found ${eventName} trigger.`);
  }
}

if (!/^\s*pages:\s*write\s*$/m.test(deployWorkflow) || !/^\s*id-token:\s*write\s*$/m.test(deployWorkflow)) {
  fail("Deploy workflow must keep GitHub Pages permissions explicit.");
}

if (failures.length > 0) {
  console.error("Repo-contract check failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Repo-contract check passed.");
