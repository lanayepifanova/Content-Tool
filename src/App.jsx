import { useEffect, useState } from "react";

const BUCKETS = [
  { key: "news", label: "News", blurb: "tech · startups · markets · finance" },
  { key: "tutorial", label: "Tutorials", blurb: "AI workflows & tools" },
  { key: "explainer", label: "Explainers", blurb: "technical → non-technical" },
  { key: "longform", label: "Long-form", blurb: "YouTube · ~10 minutes" },
];

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

function Idea({ idea, slug, onRated }) {
  const [rating, setRating] = useState(idea.rating);
  const [reason, setReason] = useState(idea.ratingReason || "");
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setRating(idea.rating);
    setReason(idea.ratingReason || "");
  }, [idea.id, idea.rating, idea.ratingReason]);

  async function save(next, nextReason = reason) {
    setSaving(true);
    setRating(next);
    try {
      const res = await fetch("/api/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, id: idea.id, rating: next, reason: nextReason }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      onRated?.();
    } catch (err) {
      setRating(idea.rating);
      alert(`Could not save rating: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <article className={`idea ${rating ? `is-${rating}` : ""}`}>
      <header className="idea-head">
        <span className="idea-id">{idea.id}</span>
        <h3>{idea.title}</h3>
      </header>

      {idea.hook && <p className="idea-hook">{idea.hook}</p>}
      {idea.why && <p className="idea-why">{idea.why}</p>}

      {Object.entries(idea.extra || {}).map(([label, value]) => (
        <p className="idea-field" key={label}>
          <span>{label}</span> {value}
        </p>
      ))}

      {idea.titleOptions?.length > 0 && (
        <ul className="idea-titles">
          {idea.titleOptions.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      )}

      {idea.note && <p className="idea-note">{idea.note}</p>}

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

      <Sources sources={idea.sources} />

      <footer className="idea-foot">
        <div className="rate-buttons">
          <button
            type="button"
            className={rating === "up" ? "active-up" : ""}
            disabled={saving}
            onClick={() => save(rating === "up" ? null : "up")}
          >
            Keep
          </button>
          <button
            type="button"
            className={rating === "down" ? "active-down" : ""}
            disabled={saving}
            onClick={() => save(rating === "down" ? null : "down")}
          >
            Kill
          </button>
        </div>
        <input
          className="rate-reason"
          placeholder="why? (this is what actually trains it)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          onBlur={() => rating && reason !== (idea.ratingReason || "") && save(rating, reason)}
        />
        <span className="idea-meta">
          {idea.freshness} · {idea.saturation}
        </span>
      </footer>
    </article>
  );
}

export default function App() {
  const [slugs, setSlugs] = useState([]);
  const [slug, setSlug] = useState(null);
  const [brief, setBrief] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/briefs")
      .then((r) => r.json())
      .then((list) => {
        setSlugs(list);
        setSlug((cur) => cur ?? list[0] ?? null);
      })
      .catch((e) => setError(String(e)));
  }, []);

  const load = () => {
    if (!slug) return;
    fetch(`/api/brief/${slug}`)
      .then((r) => r.json())
      .then(setBrief)
      .catch((e) => setError(String(e)));
  };
  useEffect(load, [slug]);

  const rated = brief?.ideas.filter((i) => i.rating).length ?? 0;

  return (
    <main className="reader">
      <header className="reader-head">
        <div>
          <h1>Basis Point</h1>
          {brief && <p className="reader-sub">{brief.title.replace(/^Basis Point — /, "")}</p>}
        </div>
        <div className="reader-controls">
          {slugs.length > 1 && (
            <select value={slug ?? ""} onChange={(e) => setSlug(e.target.value)}>
              {slugs.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          )}
          {brief && (
            <span className="reader-count">
              {rated}/{brief.ideas.length} rated
            </span>
          )}
        </div>
      </header>

      {error && <p className="reader-empty">Could not reach the brief API — is `npm run dev` running? ({error})</p>}
      {!error && !brief && <p className="reader-empty">No briefs yet. Run the scan to generate one.</p>}

      {brief &&
        BUCKETS.map(({ key, label, blurb }) => {
          const ideas = brief.ideas.filter((i) => i.bucket === key);
          if (!ideas.length) return null;
          return (
            <section className="bucket" key={key}>
              <h2>
                {label} <span>{blurb}</span>
              </h2>
              {ideas.map((idea) => (
                <Idea key={idea.id} idea={idea} slug={slug} onRated={load} />
              ))}
            </section>
          );
        })}

      {brief && (
        <footer className="reader-foot">
          Rate ruthlessly, then run <code>/basis-point-learn</code> to fold it into the rubric.
        </footer>
      )}
    </main>
  );
}
