import { execFileSync } from "node:child_process";
import { basename } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL("../", import.meta.url));
const failures = [];

function fail(message) {
  failures.push(message);
}

const trackedFiles = execFileSync("git", ["ls-files"], {
  cwd: rootDir,
  encoding: "utf8",
})
  .split("\n")
  .filter(Boolean);

function isTrackedGeneratedOutput(file) {
  return (
    file.startsWith("dist/") ||
    file.startsWith(".astro/") ||
    file.startsWith("node_modules/") ||
    file.startsWith("coverage/") ||
    file.startsWith("build/")
  );
}

function isTrackedEnvFile(file) {
  const name = basename(file);
  return name === ".env" || name.startsWith(".env.");
}

function isTrackedLocalToolFile(file) {
  return file.startsWith(".claude/") || file.startsWith(".codex/") || file.startsWith(".agents/");
}

function isTrackedPlainPrivateNote(file) {
  return (
    file.startsWith(".private/") ||
    /^private\/.+\.(md|txt|log)$/i.test(file) ||
    /^private\/.+\.local\./i.test(file)
  );
}

for (const file of trackedFiles) {
  if (isTrackedGeneratedOutput(file)) {
    fail(`Generated output or dependency directory is tracked: ${file}`);
  }

  if (isTrackedEnvFile(file)) {
    fail(`Environment file is tracked: ${file}`);
  }

  if (isTrackedLocalToolFile(file)) {
    fail(`Local tool file is tracked: ${file}`);
  }

  if (isTrackedPlainPrivateNote(file)) {
    fail(`Plaintext private note is tracked: ${file}`);
  }
}

if (failures.length > 0) {
  console.error("Tracked-file hygiene check failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Tracked-file hygiene check passed.");
