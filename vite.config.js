import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";

// Dev-only API. Markdown in briefs/ stays the source of truth; the UI reads the
// derived JSON and writes ratings back into the markdown.
function briefServer() {
  const listBriefs = () =>
    existsSync("briefs")
      ? readdirSync("briefs").filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, "")).sort().reverse()
      : [];

  const json = (res, code, body) => {
    res.statusCode = code;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(body));
  };

  return {
    name: "basis-point-brief-server",
    configureServer(server) {
      server.middlewares.use("/api/briefs", (req, res) => json(res, 200, listBriefs()));

      server.middlewares.use("/api/brief", (req, res) => {
        const slug = (req.url || "").replace(/^\//, "").split("?")[0];
        const path = `briefs/${slug}.json`;
        if (!/^[\w.-]+$/.test(slug) || !existsSync(path)) return json(res, 404, { error: "no such brief" });
        json(res, 200, JSON.parse(readFileSync(path, "utf8")));
      });

      server.middlewares.use("/api/rate", (req, res) => {
        if (req.method !== "POST") return json(res, 405, { error: "POST only" });
        let raw = "";
        req.on("data", (c) => (raw += c));
        req.on("end", () => {
          try {
            const { slug, id, rating, reason = "" } = JSON.parse(raw);
            if (!/^[\w.-]+$/.test(slug) || !/^[ABCD]\d+$/.test(id)) return json(res, 400, { error: "bad request" });

            const mdPath = `briefs/${slug}.md`;
            const md = readFileSync(mdPath, "utf8");
            const symbol = rating === "up" ? "+" : rating === "down" ? "-" : "";

            // Replace the `rate:` line belonging to this idea's section only.
            const section = new RegExp(`(^## ${id} ·[\\s\\S]*?)\`rate:[^\`]*\``, "m");
            if (!section.test(md)) return json(res, 404, { error: `no rate line for ${id}` });
            const updated = md.replace(section, (_, head) => `${head}\`rate: ${symbol}${reason ? " " + reason : ""}\``);

            writeFileSync(mdPath, updated);
            execFileSync("node", ["scripts/brief-to-json.mjs", mdPath]);
            json(res, 200, { ok: true, id, rating });
          } catch (err) {
            json(res, 500, { error: String(err.message || err) });
          }
        });
      });
    },
  };
}

export default defineConfig({ plugins: [react(), briefServer()] });
