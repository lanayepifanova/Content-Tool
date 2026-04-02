import { useEffect, useState } from "react";

const stations = {
  "instagram-tiktok": {
    title: "Instagram & Tiktok",
    prompt: "Find today's strongest news angle for a high-performing Instagram or Tiktok video.",
  },
  youtube: {
    title: "Youtube Channel",
    prompt: "Find today's strongest news angle for a Youtube channel video.",
  },
  "uilg-format": {
    title: "UILG Format Videos",
    prompt: "Build a UILG-backed format video using my saved performance context.",
  },
};

const topics = [
  {
    label: "AI",
    aliases: ["ai", "artificial intelligence", "models", "agents"],
    stories: [
      "The AI infrastructure story that matters is shifting from model launches to who controls distribution.",
      "Enterprise AI budgets are moving toward workflow tools instead of broad chat products.",
      "The next debate is not whether agents work, but where reliability becomes good enough to replace manual work.",
    ],
  },
  {
    label: "Markets",
    aliases: ["markets", "market", "finance", "macro", "rates"],
    stories: [
      "The market story to watch is how rate expectations are changing risk appetite.",
      "Credit conditions are becoming the cleaner signal than equity index moves.",
      "Investors are repricing growth stories around cash flow instead of pure expansion.",
    ],
  },
  {
    label: "Startups",
    aliases: ["startup", "startups", "vc", "venture", "founder"],
    stories: [
      "The startup signal is that founders are selling efficiency before growth again.",
      "VC attention is concentrating around companies that turn AI into measurable labor savings.",
      "The strongest angle is how distribution is becoming more valuable than model access.",
    ],
  },
];

function emptyStation() {
  return { scratchpad: "" };
}

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function buildInitialStations() {
  const saved = readJson("basisPointStations", {});
  Object.keys(stations).forEach((key) => {
    if (!saved[key]) {
      saved[key] = emptyStation();
    } else if (typeof saved[key].scratchpad !== "string") {
      const oldIdeas = Array.isArray(saved[key].ideas) ? saved[key].ideas.map((idea) => idea.text).join("\n\n") : "";
      saved[key] = { scratchpad: oldIdeas };
    }
  });
  return saved;
}

function pickTopicFromPrompt(prompt, activeTopic) {
  const normalized = prompt.toLowerCase();
  return topics.find((topic) => topic.aliases.some((alias) => normalized.includes(alias))) || activeTopic;
}

function buildResponse(prompt, topic) {
  return [
    `Topic for today: ${topic.label}`,
    "",
    `Request: ${prompt}`,
    "",
    "News to cover:",
    ...topic.stories.map((story, index) => `${index + 1}. ${story}`),
    "",
    "Structure:",
    "0-3s: Open with the tension, not the headline.",
    "3-15s: Explain what happened in plain language.",
    "15-35s: Connect the story to money, power, timing, or behavior.",
    "35-60s: Give the audience one thing to watch next.",
  ].join("\n");
}

function Drawer({ isOpen, onClose, onChoose }) {
  return (
    <>
      <aside className={`choice-drawer ${isOpen ? "is-open" : ""}`} aria-label="Navigation choices" aria-hidden={!isOpen}>
        <div className="drawer-head">
          <span>Choices</span>
          <button type="button" aria-label="Close menu" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="drawer-list">
          {Object.entries(stations).map(([key, station]) => (
            <button className="drawer-choice" type="button" key={key} onClick={() => onChoose(key)}>
              {station.title}
            </button>
          ))}
        </div>
      </aside>
      <div className={`drawer-scrim ${isOpen ? "is-visible" : ""}`} onClick={onClose} />
    </>
  );
}

function HomePage({ messages, prompt, setPrompt, onSubmit }) {
  return (
    <section className="hero page-view">
      <div className={`intro-copy ${messages.length ? "is-compact" : ""}`}>
        <h1>Find today's Reel topic</h1>
      </div>

      <div className={`chat-thread ${messages.length ? "has-messages" : ""}`} aria-live="polite">
        {messages.map((message) => (
          <article className={`message ${message.role}`} key={message.id}>
            <div className="message-bubble">{message.content}</div>
          </article>
        ))}
      </div>

      <section className="prompt-card" aria-label="Prompt composer">
        <textarea
          rows="2"
          placeholder="Ask Basis Point to find a Reel topic about AI, markets, startups..."
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              onSubmit();
            }
          }}
        />
      </section>
    </section>
  );
}

function WorkstationPage({ activeKey, stationData, onUpdateScratchpad }) {
  const station = stations[activeKey];

  return (
    <section className="page-view workstation-page" aria-label="Content workstation">
      <header className="workstation-header">
        <h1>{station.title}</h1>
      </header>

      <section className="scratch-section">
        <div className="section-line">
          <h2>Potential ideas</h2>
        </div>
        <textarea
          className="scratchpad"
          rows="20"
          placeholder="Drop raw hooks, angles, references, thumbnails, or content ideas..."
          value={stationData.scratchpad}
          onChange={(event) => onUpdateScratchpad(event.target.value)}
        />
      </section>
    </section>
  );
}

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [view, setView] = useState("home");
  const [activeStationKey, setActiveStationKey] = useState("instagram-tiktok");
  const [stationState, setStationState] = useState(buildInitialStations);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [activeTopic, setActiveTopic] = useState(topics[0]);
  const activeStationData = stationState[activeStationKey] || emptyStation();

  useEffect(() => {
    localStorage.setItem("basisPointStations", JSON.stringify(stationState));
  }, [stationState]);

  useEffect(() => {
    const closeDrawer = (event) => {
      if (event.key === "Escape") {
        setDrawerOpen(false);
      }
    };
    document.addEventListener("keydown", closeDrawer);
    return () => document.removeEventListener("keydown", closeDrawer);
  }, []);

  function openStation(key) {
    setActiveStationKey(key);
    setPrompt(stations[key].prompt);
    setView("station");
    setDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function submitPrompt() {
    const request = prompt.trim() || "Find my topic for today and generate a content angle.";
    const topic = pickTopicFromPrompt(request, activeTopic);
    setActiveTopic(topic);
    setPrompt("");
    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: "user", content: request },
      { id: crypto.randomUUID(), role: "assistant", content: buildResponse(request, topic) },
    ]);
  }

  function updateScratchpad(value) {
    setStationState((current) => ({
      ...current,
      [activeStationKey]: {
        ...current[activeStationKey],
        scratchpad: value,
      },
    }));
  }

  return (
    <main className="home-shell">
      <nav className="top-nav" aria-label="Primary">
        <a
          className="brand"
          href="/"
          onClick={(event) => {
            event.preventDefault();
            setView("home");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <span>Basis Point</span>
        </a>
        <button className="menu-button" type="button" aria-label="Open menu" aria-expanded={drawerOpen} onClick={() => setDrawerOpen((open) => !open)}>
          <span />
          <span />
        </button>
      </nav>

      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} onChoose={openStation} />

      {view === "home" ? (
        <HomePage messages={messages} prompt={prompt} setPrompt={setPrompt} onSubmit={submitPrompt} />
      ) : (
        <WorkstationPage
          activeKey={activeStationKey}
          stationData={activeStationData}
          onUpdateScratchpad={updateScratchpad}
        />
      )}
    </main>
  );
}
