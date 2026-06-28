import { execFileSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { basename, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL("../", import.meta.url));
const publicOutputDirs = ["public", "dist"];
const failures = [];

function fail(message) {
  failures.push(message);
}

function gitLsFiles() {
  return execFileSync("git", ["ls-files"], {
    cwd: rootDir,
    encoding: "utf8",
  })
    .split("\n")
    .filter(Boolean);
}

function listFiles(dir) {
  const absDir = join(rootDir, dir);
  if (!existsSync(absDir)) return [];

  return readdirSync(absDir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(absDir, entry.name);
    return entry.isDirectory() ? listFiles(relative(rootDir, path)) : [relative(rootDir, path).replaceAll("\\", "/")];
  });
}

function isEnvFile(file) {
  const name = basename(file);
  return name === ".env" || name.startsWith(".env.");
}

function isPlainPrivateNote(file) {
  return (
    file.startsWith(".private/") ||
    /^private\/.+\.(md|txt|log)$/i.test(file) ||
    /^private\/.+\.local\./i.test(file)
  );
}

function isResumePdf(file) {
  const name = basename(file).toLowerCase();
  return name.endsWith(".pdf") && /(^|[-_ ])(cv|resume|curriculum[-_ ]?vitae)([-_ .]|$)/i.test(name);
}

function isLegacyPublicAsset(file) {
  const normalized = file.replaceAll("\\", "/");
  const name = basename(normalized);
  return (
    normalized.includes("/legacy-public/") ||
    normalized.endsWith("/legacy-public") ||
    name.includes("jeremy-dawson-social") ||
    name === "enhancements.js"
  );
}

for (const file of gitLsFiles()) {
  if (isEnvFile(file)) {
    fail(`Tracked env file is not allowed: ${file}`);
  }

  if (isPlainPrivateNote(file)) {
    fail(`Tracked plaintext private note is not allowed: ${file}`);
  }

  if ((file.startsWith("public/") || file.startsWith("dist/")) && isResumePdf(file)) {
    fail(`Downloadable CV/resume PDF is not allowed in public output: ${file}`);
  }

  if ((file.startsWith("public/") || file.startsWith("dist/")) && isLegacyPublicAsset(file)) {
    fail(`Legacy asset is not allowed in public output: ${file}`);
  }
}

for (const dir of publicOutputDirs) {
  for (const file of listFiles(dir)) {
    if (isEnvFile(file)) {
      fail(`Env file is not allowed in ${dir}: ${file}`);
    }

    if (isPlainPrivateNote(file)) {
      fail(`Plaintext private note is not allowed in ${dir}: ${file}`);
    }

    if (isResumePdf(file)) {
      fail(`Downloadable CV/resume PDF is not allowed in ${dir}: ${file}`);
    }

    if (isLegacyPublicAsset(file)) {
      fail(`Legacy asset is not allowed in ${dir}: ${file}`);
    }
  }
}

if (failures.length > 0) {
  console.error("Public-boundary check failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Public-boundary check passed.");
