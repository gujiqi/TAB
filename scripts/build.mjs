import {
  mkdir,
  readFile,
  writeFile,
  copyFile,
  readdir,
  lstat,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pages, locale } from "../src/meta.mjs";
import { home } from "../src/home.mjs";
import { shell } from "../src/shell.mjs";
import { sciencePage } from "../src/science.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const out = path.join(root, "dist");
const origin = new URL(
  process.env.TAB_SITE_URL || "https://gujiqi.github.io/TAB/",
);
if (!origin.pathname.endsWith("/")) origin.pathname += "/";
const route = (page, lang) =>
  (lang === "zh" ? "zh/" : "") + (page === "home" ? "" : page + "/");
const files = new Set();
const media = [
  "hero.webp",
  "moss.webp",
  "hornwort.webp",
  "liverwort.webp",
  "cells.webp",
  "habitat.webp",
  "globe.webp",
  "logo.webp",
  "brand.webp",
  "favicon.png",
  "share.jpg",
  "credits.json",
];
const fonts = [
  "dm-sans.woff2",
  "instrument.woff2",
  "instrument-italic.woff2",
  "DM-Sans-OFL.txt",
  "Instrument-OFL.txt",
];
async function emit(name, body, source) {
  const dest = path.join(out, name);
  await mkdir(path.dirname(dest), { recursive: true });
  if (source) await copyFile(path.join(root, source), dest);
  else await writeFile(dest, body);
  files.add(name);
}
for (const name of media)
  await emit("assets/media/" + name, null, "assets/media/" + name);
for (const name of fonts)
  await emit("assets/fonts/" + name, null, "assets/fonts/" + name);
for (const name of [
  "site.css",
  "site.js",
  "explorer.js",
  "explorer.css",
  "science.css",
])
  await emit("assets/" + name, null, "src/" + name);
const credits = JSON.parse(
  await readFile(path.join(root, "assets/media/credits.json"), "utf8"),
);
// This optional file is a deliberately prepared public subset. Local data is never a build input.
const reviewedPath = path.join(root, "release", "glossary.json");
let reviewedCount = 0;
const reviewedStat = await lstat(reviewedPath).catch((e) => {
  if (e.code !== "ENOENT") throw e;
});
if (reviewedStat) {
  if (!reviewedStat.isFile())
    throw Error("Reviewed glossary must be a regular file.");
  const input = JSON.parse(await readFile(reviewedPath, "utf8"));
  const keys = [
    "id",
    "name",
    "definition",
    "category",
    "domain",
    "dataType",
    "selected",
  ];
  const seen = new Set();
  if (input.format !== "tab-glossary-v1" || !Array.isArray(input.records))
    throw Error("Unrecognized release format");
  const records = input.records.map((row) => {
    if (
      !keys.every((k) => typeof row[k] === "string") ||
      !row.id ||
      seen.has(row.id) ||
      !["Yes", "No"].includes(row.selected)
    )
      throw Error("Invalid release record");
    seen.add(row.id);
    return Object.fromEntries(keys.map((k) => [k, row[k]]));
  });
  if (records.length) {
    await emit(
      "assets/data/glossary.json",
      JSON.stringify({ format: input.format, records }),
    );
    reviewedCount = records.length;
  }
}
function creditPage(lang, ctx) {
  const t = locale(lang);
  const safe = (value) =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll('"', "&quot;");
  return (
    '<div class="credits-list">' +
    credits
      .map(
        (c) =>
          `<article class="credit"><img src="${ctx.asset("media/" + c.file)}" loading="lazy" alt=""><div><h2>${safe(t(c.title, c.titleZh))}</h2><p>${safe(c.author)} · ${c.licenseUrl ? `<a href="${safe(c.licenseUrl)}">${safe(c.license)}</a>` : t("Project artwork", "项目提供的品牌素材")}${c.source ? ` · <a href="${safe(c.source)}">${t("Original image", "原图来源")}</a>` : ""}</p><small>${safe(t(c.changes, c.changesZh))}</small></div></article>`,
      )
      .join("") +
    `</div><section class="font-credits"><h2>${t("Typography", "字体")}</h2><p>DM Sans · <a href="${ctx.asset("fonts/DM-Sans-OFL.txt")}">SIL Open Font License</a><br>Instrument Serif · <a href="${ctx.asset("fonts/Instrument-OFL.txt")}">SIL Open Font License</a></p></section>`
  );
}
const urls = [];
for (const lang of ["en", "zh"])
  for (const page of Object.keys(pages)) {
    const dir = route(page, lang);
    const prefix = "../".repeat(dir.split("/").filter(Boolean).length) || "./";
    const ctx = {
      asset: (name) => prefix + "assets/" + name,
      link: (slug, language = lang) => prefix + route(slug, language),
      canonical: (slug, language) =>
        new URL(route(slug, language), origin).href,
    };
    const explorer =
      '<div id="explorer" data-preview="false"' +
      (reviewedCount
        ? ' data-dictionary-url="' + ctx.asset("data/glossary.json") + '"'
        : "") +
      "></div>";
    const contents =
      page === "home"
        ? home(lang, ctx)
        : page === "credits"
          ? creditPage(lang, ctx)
          : page === "traits"
            ? explorer
            : sciencePage(page, lang, ctx);
    await emit(dir + "index.html", shell(page, lang, ctx, contents));
    urls.push(ctx.canonical(page, lang));
  }
await emit(
  "sitemap.xml",
  '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    urls.map((u) => "<url><loc>" + u + "</loc></url>").join("") +
    "</urlset>",
);
await emit(".nojekyll", "");
const entries = await readdir(out, { recursive: true, withFileTypes: true });
for (const item of entries) {
  if (item.isDirectory()) continue;
  const name = path
    .relative(out, path.join(item.parentPath, item.name))
    .split(path.sep)
    .join("/");
  if (!files.has(name) || !item.isFile())
    throw Error("Unexpected deployment file: " + name);
}
console.log(
  `Built ${urls.length} pages and verified ${files.size} release files. Public dictionary rows: ${reviewedCount}.`,
);
