import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL("../", import.meta.url));
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const basePath = "/preview/";
const siteUrl = "https://example.invalid";

function run(command, args, env) {
  const result = spawnSync(command, args, {
    cwd: rootDir,
    env: {
      ...process.env,
      ...env,
    },
    stdio: "inherit",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }

  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }
}

run(npmCommand, ["run", "build"], {
  BASE_PATH: basePath,
  SITE_URL: siteUrl,
});

run(process.execPath, ["scripts/check-dist.mjs"], {
  BASE_PATH: basePath,
  SITE_URL: siteUrl,
  EXPECTED_BASE_PATH: basePath,
  EXPECTED_SITE_URL: siteUrl,
});

console.log("Base-path build check passed.");
