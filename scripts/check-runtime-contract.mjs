import { readdirSync, readFileSync } from "node:fs";
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

const nodeVersion = readText(".node-version").trim();
if (nodeVersion !== "24") {
  fail(`.node-version must be 24; found ${nodeVersion || "<empty>"}.`);
}

const packageJson = JSON.parse(readText("package.json"));
if (packageJson.engines?.node !== ">=22.12.0") {
  fail(`package.json engines.node must remain >=22.12.0; found ${packageJson.engines?.node ?? "<missing>"}.`);
}

const nodeTypes = packageJson.devDependencies?.["@types/node"];
if (!/^[~^]?24\./.test(nodeTypes ?? "")) {
  fail(`@types/node must stay on the Node 24 line; found ${nodeTypes ?? "<missing>"}.`);
}

const workflowsDir = join(rootDir, ".github", "workflows");
for (const workflowFile of readdirSync(workflowsDir).filter((file) => file.endsWith(".yml"))) {
  const workflow = readFileSync(join(workflowsDir, workflowFile), "utf8");
  if (!/^\s*node-version:\s*24\s*$/m.test(workflow)) {
    fail(`${workflowFile} must use node-version: 24.`);
  }
}

const readme = readText("README.md");
if (!readme.includes("Node 24 is recommended") || !readme.includes("GitHub Actions use Node 24")) {
  fail("README.md must document the Node 24 local and GitHub Actions runtime.");
}

const agentInstructions = readText("AGENTS.md");
if (!agentInstructions.includes("Node 24 is recommended") || !agentInstructions.includes("Node 24")) {
  fail("AGENTS.md must document the Node 24 runtime expectation.");
}

const dependabot = readText(".github/dependabot.yml");
if (!dependabot.includes('dependency-name: "@types/node"') || !dependabot.includes('"version-update:semver-major"')) {
  fail("Dependabot must keep ignoring @types/node semver-major updates while runtime remains Node 24.");
}

if (failures.length > 0) {
  console.error("Runtime-contract check failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Runtime-contract check passed.");
