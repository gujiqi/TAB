import http from "node:http";
import { stat, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../", import.meta.url));
const out = path.join(root, "dist");
const local = process.argv.includes("--local-glossary");
const port = Number(process.env.PORT || 4173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".json": "application/json",
  ".js": "text/javascript",
  ".css": "text/css",
  ".xml": "application/xml",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};
const prefix = "/TAB/";
http
  .createServer(async (req, res) => {
    try {
      if (
        req.headers.host !== "127.0.0.1:" + port &&
        req.headers.host !== "localhost:" + port
      ) {
        res.writeHead(403).end();
        return;
      }
      if (!["GET", "HEAD"].includes(req.method)) {
        res.writeHead(405).end();
        return;
      }
      const url = new URL(req.url, "http://localhost");
      if (url.pathname === "/" || url.pathname === "/TAB") {
        res.writeHead(302, { Location: prefix }).end();
        return;
      }
      if (!url.pathname.startsWith(prefix)) {
        res.writeHead(404).end();
        return;
      }
      const relative = decodeURIComponent(url.pathname.slice(prefix.length));
      let filename = path.resolve(out, relative);
      if (!filename.startsWith(out + path.sep) && filename !== out) {
        res.writeHead(404).end();
        return;
      }
      if (local && relative === "private/glossary.json")
        filename = path.join(root, "private", "glossary.json");
      else if ((await stat(filename)).isDirectory()) {
        if (!url.pathname.endsWith("/")) {
          res
            .writeHead(301, { Location: url.pathname + "/" + url.search })
            .end();
          return;
        }
        filename = path.join(filename, "index.html");
      }
      const ext = path.extname(filename);
      let data = await readFile(filename);
      if (local && ext === ".html")
        data = data
          .toString()
          .replace('data-preview="false"', 'data-preview="true"');
      res.writeHead(200, {
        "Content-Type": types[ext] || "application/octet-stream",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      });
      res.end(req.method === "HEAD" ? undefined : data);
    } catch {
      res.writeHead(404).end("Not found");
    }
  })
  .listen(port, "127.0.0.1", () =>
    console.log(
      "TAB preview: http://127.0.0.1:" +
        port +
        prefix +
        (local ? " (local glossary)" : ""),
    ),
  );
