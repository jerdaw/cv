import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL("../", import.meta.url));
const distDir = join(rootDir, "dist");

const expectedBasePath = normalizeBasePath(
  process.env.EXPECTED_BASE_PATH ?? process.env.BASE_PATH ?? inferredAstroBasePath(),
);
const expectedSiteUrl = process.env.EXPECTED_SITE_URL ?? process.env.SITE_URL ?? "https://jerdaw.github.io";

const failures = [];

function fail(message) {
  failures.push(message);
}

function normalizeBasePath(value) {
  const trimmed = value.trim();
  if (!trimmed || trimmed === "/") return "/";
  return `/${trimmed.replace(/^\/+|\/+$/g, "")}/`;
}

function inferredAstroBasePath() {
  if (process.env.GITHUB_ACTIONS !== "true") return "/";

  const repository = process.env.GITHUB_REPOSITORY ?? "";
  const [repositoryOwner, repositoryName] = repository.split("/");
  const repoName = process.env.REPO_NAME ?? repositoryName ?? "";
  const isUserSiteRepo =
    Boolean(repositoryOwner) &&
    repoName.toLowerCase() === `${repositoryOwner.toLowerCase()}.github.io`;

  return isUserSiteRepo || !repoName ? "/" : `/${repoName}`;
}

function siteUrl(pathname) {
  return new URL(pathname, expectedSiteUrl).toString();
}

function readRequiredFile(path) {
  if (!existsSync(path)) {
    fail(`Missing required file: ${relative(rootDir, path)}`);
    return "";
  }

  if (statSync(path).size === 0) {
    fail(`Required file is empty: ${relative(rootDir, path)}`);
  }

  return readFileSync(path, "utf8");
}

function assertIncludes(content, expected, label) {
  if (!content.includes(expected)) {
    fail(`${label} is missing expected content: ${expected}`);
  }
}

function assertNotIncludes(content, forbidden, label) {
  if (content.includes(forbidden)) {
    fail(`${label} includes forbidden content: ${forbidden}`);
  }
}

function listFiles(dir) {
  if (!existsSync(dir)) return [];

  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? listFiles(path) : [path];
  });
}

const expectedFiles = [
  "index.html",
  "404.html",
  "favicon.svg",
  "favicon.ico",
];

for (const file of expectedFiles) {
  const path = join(distDir, file);
  if (!existsSync(path)) {
    fail(`Missing expected build artifact: dist/${file}`);
  }
}

const indexHtml = readRequiredFile(join(distDir, "index.html"));
const notFoundHtml = readRequiredFile(join(distDir, "404.html"));

for (const origin of ["fonts.googleapis.com", "fonts.gstatic.com"]) {
  assertNotIncludes(indexHtml, origin, "Homepage");
  assertNotIncludes(notFoundHtml, origin, "404 page");
}

const expectedIconPath = `${expectedBasePath}favicon.svg`;
const expectedIndexUrl = siteUrl(expectedBasePath);
const expectedNotFoundUrl = siteUrl(`${expectedBasePath}404/`);

assertIncludes(indexHtml, "<title>Jeremy Dawson | Rewriting</title>", "Homepage title");
assertIncludes(
  indexHtml,
  '<meta name="description" content="Jeremy Dawson\'s public site is being rewritten.">',
  "Homepage description",
);
assertIncludes(indexHtml, `<link rel="canonical" href="${expectedIndexUrl}">`, "Homepage canonical URL");
assertIncludes(indexHtml, `<meta property="og:url" content="${expectedIndexUrl}">`, "Homepage Open Graph URL");
assertIncludes(indexHtml, '<meta property="og:site_name" content="Jeremy Dawson">', "Homepage site name");
assertIncludes(indexHtml, `<link rel="icon" type="image/svg+xml" href="${expectedIconPath}">`, "Homepage favicon link");
assertIncludes(indexHtml, '<p class="coming-soon__eyebrow">Rewriting</p>', "Homepage eyebrow");
assertIncludes(indexHtml, '<h1 id="coming-soon-title">Jeremy Dawson</h1>', "Homepage heading");
assertIncludes(
  indexHtml,
  '<p class="coming-soon__message">This public site is being rewritten.</p>',
  "Homepage message",
);
assertIncludes(indexHtml, '<p class="coming-soon__note">Updated when the rewrite is ready.</p>', "Homepage note");

assertIncludes(notFoundHtml, "<title>Page not found | Jeremy Dawson | Rewriting</title>", "404 title");
assertIncludes(notFoundHtml, '<meta name="robots" content="noindex">', "404 robots metadata");
assertIncludes(notFoundHtml, `<link rel="canonical" href="${expectedNotFoundUrl}">`, "404 canonical URL");
assertIncludes(notFoundHtml, `<meta property="og:url" content="${expectedNotFoundUrl}">`, "404 Open Graph URL");
assertIncludes(notFoundHtml, `<link rel="icon" type="image/svg+xml" href="${expectedIconPath}">`, "404 favicon link");
assertIncludes(notFoundHtml, '<p class="coming-soon__eyebrow">404</p>', "404 eyebrow");
assertIncludes(notFoundHtml, '<h1 id="not-found-title">Page not found.</h1>', "404 heading");
assertIncludes(notFoundHtml, '<p class="coming-soon__message">The requested page is not available.</p>', "404 message");
assertIncludes(
  notFoundHtml,
  `<a href="${expectedBasePath}">Return to the temporary homepage.</a>`,
  "404 homepage link",
);

const emittedFiles = listFiles(distDir).map((path) => relative(distDir, path).replaceAll("\\", "/"));
const legacyFiles = emittedFiles.filter((file) => (
  file.startsWith("legacy-public/") ||
  file.includes("jeremy-dawson-social") ||
  file.endsWith("enhancements.js")
));

if (legacyFiles.length > 0) {
  fail(`Legacy assets should not be emitted in dist: ${legacyFiles.join(", ")}`);
}

if (failures.length > 0) {
  console.error("Generated-site smoke check failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Generated-site smoke check passed.");
