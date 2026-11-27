import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pages } from "../src/meta.mjs";
const root = fileURLToPath(new URL("../dist/", import.meta.url));
const entries = await readdir(root, { recursive: true, withFileTypes: true });
const files = entries
  .filter((e) => e.isFile())
  .map((e) => path.join(e.parentPath, e.name));
const html = files.filter((f) => f.endsWith(".html"));
assert.equal(html.length, Object.keys(pages).length * 2);
for (const file of files) {
  const relative = path.relative(root, file);
  assert(
    !/(^|[/\\])(private|\.qa|\.git|node_modules)([/\\]|$)|\.(csv|tsv|xlsx?|docx|pptx|pdf|zip)$/i.test(
      relative,
    ),
    relative,
  );
  if (!file.endsWith(".html")) continue;
  const content = await readFile(file, "utf8");
  assert.equal((content.match(/<h1[ >]/g) || []).length, 1, relative);
  assert(!content.includes('data-preview="true"'), relative);
  const ids = new Set(
    [...content.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]),
  );
  for (const [, ref] of content.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    if (/^[a-z]+:|^\/\//i.test(ref)) continue;
    const [part, hash] = ref.split("#");
    if (!part) {
      if (hash) assert(ids.has(hash), relative + " #" + hash);
      continue;
    }
    const dest = path.resolve(path.dirname(file), decodeURIComponent(part));
    let info = await stat(dest);
    if (info.isDirectory()) info = await stat(path.join(dest, "index.html"));
    assert(info.isFile(), relative + " " + ref);
  }
}
console.log(
  "Verified both languages, public-only artifacts, internal links, anchors and assets.",
);
