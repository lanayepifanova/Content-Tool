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

  // The three read-only documents the reader opens with. Hoisted out of the
  // middlewares because the production build emits them as static files too —
  // the deployed reader has no server, so the same data has to be baked in.
  const allIdeas = () =>
    listBriefs().flatMap((slug) => {
      let doc;
      try { doc = JSON.parse(readFileSync(`briefs/${slug}.json`, "utf8")); } catch { return []; }
      return (doc.ideas ?? []).map((i) => ({
        ...i,
        slug,
        date: (slug.match(/^\d{4}-\d{2}-\d{2}/) ?? [slug])[0],
      }));
    });

  const performanceDoc = () =>
    existsSync("agent/performance.json")
      ? JSON.parse(readFileSync("agent/performance.json", "utf8"))
      : { patterns: [], videos: [], missing: true };

  const friendsDoc = () =>
    existsSync("agent/friends.json")
      ? JSON.parse(readFileSync("agent/friends.json", "utf8"))
      : { devices: [], channels: [], missing: true };

  const guidelinesDoc = () =>
    existsSync("agent/guidelines.json")
      ? JSON.parse(readFileSync("agent/guidelines.json", "utf8"))
      : { sections: [], missing: true };

  const approvedDoc = () =>
    existsSync("briefs/approved.json")
      ? JSON.parse(readFileSync("briefs/approved.json", "utf8"))
      : { scripts: [], missing: true };

  // The kill log, newest first. Killed ideas are gone from their brief, so this
  // one line is all that is left of them — and it is the half of the training
  // signal that teaches the most, which is a poor reason to keep it out of the
  // reader. Parsed here rather than derived, because the file is one line per
  // idea and the writing endpoint below already owns its shape.
  const killedDoc = () => {
    if (!existsSync("briefs/KILLED.md")) return { killed: [] };
    const killed = readFileSync("briefs/KILLED.md", "utf8")
      .split("\n")
      .filter((l) => l.startsWith("- "))
      .map((l) => {
        const m = l.slice(2).match(/^(\S+)\s+([ABCD]\d+)\s*·\s*([^—]*?)(?:\s+—\s+(.*))?$/);
        if (!m) return null;
        return {
          slug: m[1],
          date: (m[1].match(/^\d{4}-\d{2}-\d{2}/) ?? [m[1]])[0],
          id: m[2],
          bucket: { A: "news", B: "tutorial", C: "explainer", D: "longform" }[m[2][0]],
          title: m[3].trim(),
          reason: m[4]?.trim() || null,
        };
      })
      .filter(Boolean)
      .reverse();
    return { killed };
  };

  const json = (res, code, body) => {
    res.statusCode = code;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(body));
  };

  return {
    name: "basis-point-brief-server",
    configureServer(server) {
      server.middlewares.use("/api/briefs", (req, res) => json(res, 200, listBriefs()));

      // Every idea from every brief, newest first. The reader works in shelves —
      // unread, kept, done — rather than one brief at a time, and which shelf an
      // idea is on is a function of its rating and status, so the split is the
      // client's to make and this stays one request.
      server.middlewares.use("/api/ideas", (req, res) => json(res, 200, allIdeas()));

      // Marking a video done. Written as its own `**Status**` line above the
      // rate line, so the brief markdown stays the source of truth for this too.
      server.middlewares.use("/api/status", (req, res) =>
        body(req, res, ({ slug, id, status }) => {
          if (!/^[\w.-]+$/.test(slug) || !/^[ABCD]\d+$/.test(id)) return json(res, 400, { error: "bad request" });
          if (status && !/^[\w -]{1,24}$/.test(status)) return json(res, 400, { error: "bad status" });
          const mdPath = `briefs/${slug}.md`;
          const doc = sections(readFileSync(mdPath, "utf8"));
          const index = doc.entries.findIndex((e) => new RegExp(`^${id}\\s*·`).test(e));
          if (index === -1) return json(res, 404, { error: `no ${id} in ${slug}` });

          let entry = doc.entries[index].replace(/^\*\*Status\*\*[^\n]*\n\n?/m, "");
          if (status) {
            // Above the rate line, which is always the last field in an entry.
            entry = entry.replace(/(`rate:)/, `**Status** ${status}\n\n$1`);
          }
          doc.entries[index] = entry;
          writeFileSync(mdPath, rejoin(doc));
          execFileSync("node", ["scripts/brief-to-json.mjs", mdPath]);
          json(res, 200, { ok: true, id, status: status || null });
        })
      );

      // The published-video log. Derived from agent/performance.md by
      // `node scripts/brief-to-json.mjs --performance`, same as briefs.
      server.middlewares.use("/api/performance", (req, res) => json(res, 200, performanceDoc()));

      // Channels worth learning from. Derived from agent/friends.md by
      // `node scripts/brief-to-json.mjs --friends`.
      server.middlewares.use("/api/friends", (req, res) => json(res, 200, friendsDoc()));

      // The rubric the scan actually reads, rendered as a tab. Derived from
      // agent/taste.md by `node scripts/brief-to-json.mjs --guidelines`.
      server.middlewares.use("/api/guidelines", (req, res) => json(res, 200, guidelinesDoc()));

      server.middlewares.use("/api/killed", (req, res) => json(res, 200, killedDoc()));

      // The signed-off scripts, from briefs/APPROVED.md by
      // `node scripts/brief-to-json.mjs --approved`. Read-only on purpose:
      // these are the words she says on camera, and nothing edits one silently.
      server.middlewares.use("/api/approved", (req, res) => json(res, 200, approvedDoc()));

      server.middlewares.use("/api/brief", (req, res) => {
        const slug = (req.url || "").replace(/^\//, "").split("?")[0];
        const path = `briefs/${slug}.json`;
        if (!/^[\w.-]+$/.test(slug) || !existsSync(path)) return json(res, 404, { error: "no such brief" });
        json(res, 200, JSON.parse(readFileSync(path, "utf8")));
      });

      // Read a POST body as JSON, or fail the request. Every writing endpoint
      // below wants exactly this.
      const body = (req, res, run) => {
        if (req.method !== "POST") return json(res, 405, { error: "POST only" });
        let raw = "";
        req.on("data", (c) => (raw += c));
        req.on("end", () => {
          try { run(JSON.parse(raw)); }
          catch (err) { json(res, 500, { error: String(err.message || err) }); }
        });
      };

      // Split a brief into its preamble and one string per `## ` entry, so an
      // entry can be lifted out or put back whole. The `---` rule between ideas
      // sits at the end of each chunk and travels with it.
      const sections = (md) => {
        const parts = md.split(/^## /m);
        return { head: parts[0], entries: parts.slice(1) };
      };
      const rejoin = ({ head, entries }) => head + entries.map((e) => `## ${e}`).join("");

      // Killing an idea deletes it from the brief. The one-line record goes to
      // briefs/KILLED.md first: the `-` ratings are what /basis-point-learn
      // learns from, and a brief that only keeps its winners teaches nothing.
      server.middlewares.use("/api/kill", (req, res) =>
        body(req, res, ({ slug, id, reason = "" }) => {
          if (!/^[\w.-]+$/.test(slug) || !/^[ABCD]\d+$/.test(id)) return json(res, 400, { error: "bad request" });
          const mdPath = `briefs/${slug}.md`;
          const doc = sections(readFileSync(mdPath, "utf8"));
          const index = doc.entries.findIndex((e) => new RegExp(`^${id}\\s*·`).test(e));
          if (index === -1) return json(res, 404, { error: `no ${id} in ${slug}` });

          const [removed] = doc.entries.splice(index, 1);
          const title = (removed.split("\n")[0].split("·").pop() ?? "").trim();
          const line = `- ${slug} ${id} · ${title}${reason ? ` — ${reason}` : ""}\n`;
          const log = "briefs/KILLED.md";
          const header =
            "# Killed ideas\n\nOne line per idea deleted from a brief, newest last. This is the negative\n" +
            "half of the training signal — `/basis-point-learn` reads it alongside the\n" +
            "`rate:` lines that survive in the briefs.\n\n";
          writeFileSync(log, (existsSync(log) ? readFileSync(log, "utf8") : header) + line);

          // Keep the "N ideas" count in the brief's subtitle honest.
          doc.head = doc.head.replace(/^_(\d+) ideas/m, () => `_${doc.entries.length} ideas`);
          writeFileSync(mdPath, rejoin(doc));
          execFileSync("node", ["scripts/brief-to-json.mjs", mdPath]);
          json(res, 200, { ok: true, id, removed: `## ${removed}`, index });
        })
      );

      // Undo, while the tab is still open — the markdown came back with the
      // kill response, so putting it back is a splice at the same position.
      server.middlewares.use("/api/restore", (req, res) =>
        body(req, res, ({ slug, markdown, index }) => {
          if (!/^[\w.-]+$/.test(slug) || typeof markdown !== "string") return json(res, 400, { error: "bad request" });
          const mdPath = `briefs/${slug}.md`;
          const doc = sections(readFileSync(mdPath, "utf8"));
          doc.entries.splice(Math.min(index ?? doc.entries.length, doc.entries.length), 0, markdown.replace(/^## /, ""));
          doc.head = doc.head.replace(/^_(\d+) ideas/m, () => `_${doc.entries.length} ideas`);
          writeFileSync(mdPath, rejoin(doc));
          execFileSync("node", ["scripts/brief-to-json.mjs", mdPath]);
          json(res, 200, { ok: true });
        })
      );

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

    // The deployed reader is a static viewer: there is no server to answer
    // /api/*, so the three read paths are frozen into files at build time and
    // fetched as /api/<name>.json. The writing endpoints have no counterpart
    // here on purpose — briefs/*.md is the source of truth and it lives on the
    // machine the scan runs on, not on the host.
    generateBundle() {
      const emit = (name, doc) =>
        this.emitFile({ type: "asset", fileName: `api/${name}.json`, source: JSON.stringify(doc) });
      emit("ideas", allIdeas());
      emit("performance", performanceDoc());
      emit("friends", friendsDoc());
      emit("guidelines", guidelinesDoc());
      emit("killed", killedDoc());
      emit("approved", approvedDoc());
    },
  };
}

export default defineConfig({ plugins: [react(), briefServer()] });
