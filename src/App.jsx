import { useEffect, useRef, useState } from "react";

const BUCKETS = [
  { key: "news", label: "News", blurb: "tech · startups · markets · finance" },
  { key: "tutorial", label: "Tutorials", blurb: "what Claude can do" },
  { key: "explainer", label: "Explainers", blurb: "technical → non-technical" },
  { key: "longform", label: "Long-form", blurb: "YouTube · ~10 minutes" },
];

// Most fields are a single line, but "How you set it up" and "Where else this
// applies" arrive as a block of lines and have to stay a list to be readable.
function Field({ label, value }) {
  const lines = String(value)
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return (
      <p className="idea-field">
        <span>{label}</span> {value}
      </p>
    );
  }

  const numbered = /^\d+[.)]\s/.test(lines[0]);
  const List = numbered ? "ol" : "ul";
  return (
    <div className="idea-field">
      <span>{label}</span>
      <List className="idea-field-list">
        {lines.map((l, i) => (
          <li key={i}>{l.replace(/^(?:[-*]|\d+[.)])\s*/, "")}</li>
        ))}
      </List>
    </div>
  );
}

function Sources({ sources }) {
  if (!sources?.length) return null;
  return (
    <div className="idea-sources">
      {sources.map((s) => (
        <a key={s.url} href={s.url} target="_blank" rel="noreferrer">
          {s.name}
        </a>
      ))}
    </div>
  );
}

// The opening line in six to ten versions, ordered — the first is the one the
// script is written to open with, the rest are swaps. Each row copies itself,
// because picking a hook always ends with pasting it somewhere else.
function Hooks({ hooks }) {
  const [copied, setCopied] = useState(null);
  if (!hooks?.length) return null;

  return (
    <ol className="idea-hooks">
      {hooks.map((h, i) => (
        <li key={i} className={i === 0 ? "is-lead" : ""}>
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(h.text);
                setCopied(i);
              } catch {
                setCopied(`blocked:${i}`); // say so — the text is still selectable
              }
              setTimeout(() => setCopied(null), 1400);
            }}
          >
            {h.type && <span className="hook-type">{h.type}</span>}
            <span className="hook-text">{h.text}</span>
            <span className="hook-copy">
              {copied === i ? "copied" : copied === `blocked:${i}` ? "blocked" : i === 0 ? "in script" : ""}
            </span>
          </button>
        </li>
      ))}
    </ol>
  );
}

// The contents of the upload box. Chips to read, one button to copy the whole
// line — tags are only ever wanted at the moment of posting, on another screen.
function Tags({ tags }) {
  const [copied, setCopied] = useState(null);
  if (!tags?.length) return null;
  const line = tags.map((t) => `#${t}`).join(" ");

  return (
    <div className="idea-tags">
      {tags.map((t) => (
        <span key={t}>#{t}</span>
      ))}
      <button
        type="button"
        className={copied === true ? "is-copied" : ""}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(line);
            setCopied(true);
          } catch {
            setCopied(false); // blocked clipboard — the chips are still selectable
          }
          setTimeout(() => setCopied(null), 1400);
        }}
      >
        {copied === true ? "Copied" : copied === false ? "Blocked" : "Copy"}
      </button>
    </div>
  );
}

// A signed-off script. The whole point of this tab is reading it aloud, so the
// prose is set wide and quiet and the one control copies the lot — the next
// thing that happens to a script here is that it gets recorded.
function ApprovedScript({ script }) {
  const [copied, setCopied] = useState(null);
  const plain = script.paragraphs.join("\n\n");

  return (
    <article className="script">
      <header className="script-head">
        <h3>{script.title}</h3>
        <div className="script-controls">
          <span className="script-meta">
            {script.words} words{script.from ? ` · ${script.from}` : ""}
          </span>
          <button
            type="button"
            className={copied === true ? "is-copied" : ""}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(plain);
                setCopied(true);
              } catch {
                setCopied(false); // blocked clipboard — the text is still selectable
              }
              setTimeout(() => setCopied(null), 1400);
            }}
          >
            {copied === true ? "Copied" : copied === false ? "Blocked" : "Copy script"}
          </button>
        </div>
      </header>
      {script.paragraphs.map((t, i) => (
        <p key={i}>{t}</p>
      ))}
    </article>
  );
}

// A thrown-out idea, from either of the two ways an idea gets thrown out: the
// Kill button, which deletes the entry and leaves a line in briefs/KILLED.md,
// and a plain `-` rating, which leaves the entry in its brief but takes it off
// every shelf. Both are rejections and both carry a reason, so the tab shows
// them together and marks which is which rather than showing half the record.
function Killed({ item }) {
  return (
    <li className="killed">
      <span className="killed-title">{item.title}</span>
      {item.reason ? (
        <span className="killed-why">{item.reason}</span>
      ) : (
        <span className="killed-why killed-noreason">no reason given</span>
      )}
      <span className="killed-meta">
        {item.date} · {item.id}
        {item.deleted && <em className="killed-tag">deleted</em>}
      </span>
    </li>
  );
}

// The one-line summary and the paragraph under it, from whatever the brief has.
// Cloud-era briefs carry **Hook** and **Why it's good**; script-era briefs carry
// the hook menu and the script, whose first sentence is hook one by design — so
// it gets stripped off the paragraph rather than said twice.
const summaryOf = (idea) =>
  idea.hooks?.[0]?.text || idea.hook || (idea.script || "").split(/(?<=[.?!])\s/)[0] || "";

function infoOf(idea) {
  if (idea.why) return idea.why.split(/\n\s*\n/)[0];
  const para = (idea.script || "").split(/\n\s*\n/)[0] || "";
  const summary = summaryOf(idea);
  return para.startsWith(summary) ? para.slice(summary.length).trim() : para;
}

// "More to read": the sources the idea was built from, plus a news search for
// the subject, which is the thing she actually wants at the moment of keeping —
// the brief's own sources are already read, the search is what is new since.
const newsSearch = (idea) =>
  `https://news.google.com/search?q=${encodeURIComponent(idea.title)}`;

function Idea({ idea, slug, onRated, onKilled, onStatus }) {
  const [rating, setRating] = useState(idea.rating);
  const [reason, setReason] = useState(idea.ratingReason || "");
  const [saved, setSaved] = useState(false); // flashes "saved" after the reason lands
  const [saving, setSaving] = useState(false);
  const [killed, setKilled] = useState(null); // the removed markdown, held for undo
  const [open, setOpen] = useState(false);
  const [matOpen, setMatOpen] = useState(false);
  const [deep, setDeep] = useState(false);

  const committed = useRef(idea.ratingReason || "");

  useEffect(() => {
    setRating(idea.rating);
    setReason(idea.ratingReason || "");
    committed.current = idea.ratingReason || "";
  }, [idea.id, idea.rating, idea.ratingReason]);

  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 1800);
    return () => clearTimeout(t);
  }, [saved]);

  async function post(url, body) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  }

  async function save(next, nextReason = reason) {
    setSaving(true);
    setRating(next);
    try {
      await post("/api/rate", { slug, id: idea.id, rating: next, reason: nextReason });
      committed.current = nextReason;
      onRated?.();
      return true;
    } catch (err) {
      setRating(idea.rating);
      alert(`Could not save rating: ${err.message}`);
      return false;
    } finally {
      setSaving(false);
    }
  }

  // The reason is worth keeping before a keep/kill decision as well — a note on
  // an untriaged idea is still a note, and the brief stores it on the same
  // `rate:` line with no symbol. Enter commits it; blur catches the rest.
  async function commitReason() {
    if (reason === committed.current) return;
    if (await save(rating, reason)) setSaved(true);
  }

  // Kill removes the entry from the brief markdown. The reason is written to
  // briefs/KILLED.md first — a brief that keeps only its winners is half a
  // record, and the reasons are the half worth having.
  async function kill() {
    setSaving(true);
    try {
      const { removed, index } = await post("/api/kill", { slug, id: idea.id, reason });
      setKilled({ removed, index });
      onKilled?.();
    } catch (err) {
      alert(`Could not delete: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  // Done is a fact about the video, not a judgment about the idea, so it is
  // stored separately and does not disturb the rating.
  async function mark(status) {
    setSaving(true);
    try {
      await post("/api/status", { slug, id: idea.id, status });
      onStatus?.();
    } catch (err) {
      alert(`Could not update: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function undo() {
    setSaving(true);
    try {
      await post("/api/restore", { slug, markdown: killed.removed, index: killed.index });
      setKilled(null);
      onKilled?.();
    } catch (err) {
      alert(`Could not undo: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  if (killed) {
    return (
      <article className="idea is-killed">
        <span className="idea-id">{idea.id}</span>
        <span className="killed-title">{idea.title}</span>
        <span className="killed-note">deleted{reason ? ` — ${reason}` : ""}</span>
        <button type="button" disabled={saving} onClick={undo}>
          Undo
        </button>
      </article>
    );
  }

  const info = infoOf(idea);

  return (
    <article className={`idea ${rating ? `is-${rating}` : ""}`}>
      <header className="idea-head">
        <span className="idea-id">{idea.id}</span>
        <h3>{idea.title}</h3>
      </header>

      <p className="idea-summary">{summaryOf(idea)}</p>
      {info && <p className="idea-info">{info}</p>}

      {/* Kept ideas are the ones about to be made, so this is where reading
          material belongs — before the script, not buried under it. */}
      {rating === "up" && (
        <div className="idea-research">
          <span>Research more</span>
          <div className="idea-research-links">
            <a href={newsSearch(idea)} target="_blank" rel="noreferrer">
              Latest news
            </a>
            {(idea.sources ?? []).map((s) => (
              <a key={s.url} href={s.url} target="_blank" rel="noreferrer">
                {s.name}
              </a>
            ))}
          </div>
        </div>
      )}

      {(idea.script || idea.hooks?.length > 0 || idea.material?.length > 0) && (
        <button className="beats-toggle" type="button" onClick={() => setDeep(!deep)}>
          {deep ? "Hide the detail" : "Open it"}
        </button>
      )}

      {deep && (
        <>
          <Hooks hooks={idea.hooks} />

          {idea.why &&
            idea.why.split(/\n\s*\n/).slice(1).map((para, i) => (
              <p className="idea-why" key={i}>
                {para.replace(/\s*\n\s*/g, " ")}
              </p>
            ))}

          {idea.script && (
            <div className="idea-script">
              {idea.script.split(/\n\s*\n/).map((para, i) => (
                <p key={i}>{para.replace(/\s*\n\s*/g, " ")}</p>
              ))}
            </div>
          )}

          {Object.entries(idea.extra || {}).map(([label, value]) => (
            <Field key={label} label={label} value={value} />
          ))}

          {idea.titleOptions?.length > 0 && (
            <ul className="idea-titles">
              {idea.titleOptions.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          )}

          {idea.material?.length > 0 && (
            <>
              <button className="beats-toggle" type="button" onClick={() => setMatOpen(!matOpen)}>
                {matOpen ? "Hide material" : `Show material (${idea.material.length} facts)`}
              </button>
              {matOpen && (
                <ul className="idea-material">
                  {idea.material.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              )}
            </>
          )}

          {idea.beats?.length > 0 && (
            <>
              <button className="beats-toggle" type="button" onClick={() => setOpen(!open)}>
                {open ? "Hide " : "Show "}
                {idea.bucket === "longform" ? "chapters" : "beats"}
              </button>
              {open && (
                <ol className="idea-beats">
                  {idea.beats.map((b) => (
                    <li key={b.t}>
                      <span>{b.t}</span> {b.text}
                    </li>
                  ))}
                </ol>
              )}
            </>
          )}

          {rating !== "up" && <Sources sources={idea.sources} />}

          <Tags tags={idea.tags} />
        </>
      )}

      {idea.note && <p className="idea-note">{idea.note}</p>}

      <footer className="idea-foot">
        {!READ_ONLY && (
        <div className="rate-buttons">
          <button
            type="button"
            className={rating === "up" ? "active-up" : ""}
            disabled={saving}
            onClick={() => save(rating === "up" ? null : "up")}
          >
            Keep
          </button>
          <button type="button" className="kill" disabled={saving} onClick={kill}>
            Kill
          </button>
          {idea.status === "done" ? (
            <button type="button" className="done-on" disabled={saving} onClick={() => mark("")}>
              Done ✓
            </button>
          ) : (
            rating === "up" && (
              <button type="button" disabled={saving} onClick={() => mark("done")}>
                Mark done
              </button>
            )
          )}
        </div>
        )}
        {!READ_ONLY && (
          <input
            className={`rate-reason${saved ? " is-saved" : ""}`}
            placeholder={saved ? "saved" : "why? (this is what actually trains it) — enter to save"}
            value={reason}
            disabled={saving}
            onChange={(e) => {
              setReason(e.target.value);
              setSaved(false);
            }}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              e.preventDefault();
              commitReason();
            }}
            onBlur={commitReason}
          />
        )}
        <span className="idea-meta">
          {[idea.date, idea.freshness, idea.saturation].filter(Boolean).join(" · ")}
        </span>
      </footer>
    </article>
  );
}

const VIEWS = [
  { key: "kept", label: "Kept", blurb: "worth making" },
  { key: "unread", label: "Unread", blurb: "not triaged yet" },
  { key: "done", label: "Done", blurb: "posted" },
  { key: "approved", label: "Approved scripts", blurb: "signed off, ready to record" },
  { key: "killed", label: "Killed", blurb: "thrown out, and why" },
];

// Which shelf an idea sits on. A `down` rating belongs to no shelf — it is a
// rejection, and it shows up under Killed alongside the ideas the Kill button
// deleted outright, rather than reappearing here as unread work.
const shelfOf = (i) =>
  i.status === "done" ? "done" : i.rating === "up" ? "kept" : i.rating ? null : "unread";

// The deployed build is a viewer. Its API is three files baked in at build
// time, and there is nothing to write to — triage happens in `npm run dev`,
// where the briefs live and a rating can go back into the markdown.
const READ_ONLY = import.meta.env.PROD;
const api = (name) => (READ_ONLY ? `/api/${name}.json` : `/api/${name}`);

export default function App() {
  const [view, setView] = useState("kept");
  const [ideas, setIdeas] = useState(null);
  const [killed, setKilled] = useState(null);
  const [approved, setApproved] = useState(null);
  const [error, setError] = useState(null);

  const loadIdeas = () =>
    fetch(api("ideas"))
      .then((r) => r.json())
      .then(setIdeas)
      .catch((e) => setError(String(e)));

  useEffect(() => {
    loadIdeas();
    fetch(api("killed"))
      .then((r) => r.json())
      .then(setKilled)
      .catch(() => {});
    fetch(api("approved"))
      .then((r) => r.json())
      .then(setApproved)
      .catch(() => {});
  }, []);

  const PAGES = ["killed", "approved"];
  const isShelf = !PAGES.includes(view);

  const counts = { kept: 0, unread: 0, done: 0 };
  for (const i of ideas ?? []) {
    const shelf = shelfOf(i);
    if (shelf) counts[shelf] += 1;
  }

  // Within a shelf the split is by bucket, not by date — a shelf is worked
  // through by what kind of video it is, and the date belongs on the card.
  const shown = (ideas ?? []).filter((i) => shelfOf(i) === view);
  const byBucket = BUCKETS.map((b) => ({ ...b, ideas: shown.filter((i) => i.bucket === b.key) }))
    .filter((b) => b.ideas.length > 0);

  // Everything thrown out, newest first. The two sources never overlap: a
  // deleted idea is gone from the brief that the `-` ratings are read from.
  const rejected = [
    ...(killed?.killed ?? []).map((k) => ({ ...k, deleted: true })),
    ...(ideas ?? [])
      .filter((i) => i.rating === "down")
      .map((i) => ({
        slug: i.slug,
        date: i.date,
        id: i.id,
        bucket: i.bucket,
        title: i.title,
        reason: i.ratingReason,
        deleted: false,
      })),
  ].sort((a, b) => (a.date === b.date ? a.id.localeCompare(b.id) : b.date.localeCompare(a.date)));

  const empty = {
    kept: "Nothing kept yet — go to Unread and keep what is worth making.",
    unread: "Nothing left to triage. The next scan fills this back up.",
    done: "Nothing marked done yet. Hit Mark done on a kept idea once the video is posted.",
  };

  return (
    <main className="reader">
      <header className="reader-head">
        <div>
          <h1>Basis Point</h1>
          <p className="reader-sub">{VIEWS.find((v) => v.key === view)?.blurb}</p>
        </div>
        <div className="reader-controls">
          {isShelf && ideas && <span className="reader-count">{counts[view]}</span>}
          {view === "killed" && killed && ideas && (
            <span className="reader-count">{rejected.length} thrown out</span>
          )}
          {view === "approved" && approved?.scripts && (
            <span className="reader-count">{approved.scripts.length} ready</span>
          )}
        </div>
      </header>

      <nav className="reader-tabs">
        {VIEWS.map((v) => (
          <button
            key={v.key}
            type="button"
            className={view === v.key ? "is-on" : ""}
            onClick={() => setView(v.key)}
          >
            {v.label}
            {counts[v.key] !== undefined && ideas && (
              <span className="tab-count">{counts[v.key]}</span>
            )}
          </button>
        ))}
      </nav>

      {error && (
        <p className="reader-empty">
          Could not reach the API — is <code>npm run dev</code> running? ({error})
        </p>
      )}

      {!error && isShelf && shown.length === 0 && ideas && (
        <p className="reader-empty">{empty[view]}</p>
      )}

      {isShelf &&
        byBucket.map((bucket) => (
          <section className="bucket" key={bucket.key}>
            <h2>
              {bucket.label} <span>{bucket.blurb}</span>
              <em>{bucket.ideas.length}</em>
            </h2>
            {bucket.ideas.map((idea) => (
              <Idea
                key={idea.slug + idea.id}
                idea={idea}
                slug={idea.slug}
                onRated={loadIdeas}
                onKilled={loadIdeas}
                onStatus={loadIdeas}
              />
            ))}
          </section>
        ))}

      {view === "killed" && killed && ideas && (
        <section className="bucket">
          <h2>
            Thrown out <span>rated down or deleted, newest first</span>
            <em>{rejected.length}</em>
          </h2>
          {rejected.length === 0 ? (
            <p className="reader-empty">Nothing thrown out yet.</p>
          ) : (
            <ul className="killed-list">
              {rejected.map((k) => (
                <Killed key={k.slug + k.id} item={k} />
              ))}
            </ul>
          )}
        </section>
      )}

      {view === "approved" && approved && (
        <section className="bucket">
          <h2>
            Approved <span>signed off, ready to record</span>
            <em>{approved.scripts?.length ?? 0}</em>
          </h2>
          {!approved.scripts?.length ? (
            <p className="reader-empty">
              Nothing approved yet. A script lands here once the words are signed off.
            </p>
          ) : (
            approved.scripts.map((sc) => <ApprovedScript key={sc.title} script={sc} />)
          )}
        </section>
      )}

      {view === "approved" && (
        <footer className="reader-foot">
          From <code>briefs/APPROVED.md</code>. Ask for a script on an idea you kept, and
          it lands here once you have signed off on the words — then{" "}
          <code>node scripts/brief-to-json.mjs --approved</code> to refresh.
        </footer>
      )}

      {view === "killed" && (
        <footer className="reader-foot">
          Every rejection: the <strong>deleted</strong> ones from{" "}
          <code>briefs/KILLED.md</code>, the rest still sitting in their briefs on a{" "}
          <code>rate: -</code> line. The reasons are the half of the record that
          teaches most — a brief that keeps only its winners teaches nothing.
        </footer>
      )}

      {view === "unread" && shown.length > 0 && (
        <footer className="reader-foot">
          Keep or kill everything here. The reason in the box is the part worth
          writing — killed ideas keep theirs in{" "}
          <code>briefs/KILLED.md</code>.
        </footer>
      )}
    </main>
  );
}
