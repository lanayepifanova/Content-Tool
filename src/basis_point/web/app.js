const homePage = document.getElementById("homePage");
const stationPage = document.getElementById("stationPage");
const chatIntro = document.getElementById("chatIntro");
const chatThread = document.getElementById("chatThread");
const promptInput = document.getElementById("promptInput");
const menuButton = document.getElementById("menuButton");
const choiceDrawer = document.getElementById("choiceDrawer");
const closeDrawerButton = document.getElementById("closeDrawerButton");
const drawerScrim = document.getElementById("drawerScrim");
const backHomeButton = document.getElementById("backHomeButton");
const stationTitle = document.getElementById("stationTitle");
const stationSubtitle = document.getElementById("stationSubtitle");
const ideaForm = document.getElementById("ideaForm");
const ideaInput = document.getElementById("ideaInput");
const ideaList = document.getElementById("ideaList");
const ideaCount = document.getElementById("ideaCount");
const draftForm = document.getElementById("draftForm");
const draftTitleInput = document.getElementById("draftTitleInput");
const draftBodyInput = document.getElementById("draftBodyInput");
const draftList = document.getElementById("draftList");
const draftCount = document.getElementById("draftCount");
const uilgContextBlock = document.getElementById("uilgContextBlock");
const uilgForm = document.getElementById("uilgForm");
const uilgLabel = document.getElementById("uilgLabel");
const uilgContext = document.getElementById("uilgContext");
const uilgStatus = document.getElementById("uilgStatus");

const stations = {
  "instagram-tiktok": {
    title: "Instagram & Tiktok",
    subtitle: "Scratch short-form hooks, story angles, post ideas, and drafts.",
    prompt: "Find today's strongest news angle for a high-performing Instagram or Tiktok video.",
  },
  youtube: {
    title: "Youtube Channel",
    subtitle: "Build longer-form video ideas, outlines, titles, and draft scripts.",
    prompt: "Find today's strongest news angle for a Youtube channel video.",
  },
  "uilg-format": {
    title: "UILG Format Videos",
    subtitle: "Turn your performance rules and context database into repeatable video formats.",
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

let activeTopic = topics[0];
let activeStationKey = "instagram-tiktok";
let stationState = {};
let uilgLibrary = [];

function emptyStation() {
  return { ideas: [], drafts: [] };
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function formatSavedTime(value) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function loadStationState() {
  try {
    stationState = JSON.parse(localStorage.getItem("basisPointStations") || "{}");
  } catch {
    stationState = {};
  }
  Object.keys(stations).forEach((key) => {
    if (!stationState[key]) {
      stationState[key] = emptyStation();
    }
  });
}

function saveStationState() {
  localStorage.setItem("basisPointStations", JSON.stringify(stationState));
}

function loadUilgLibrary() {
  try {
    uilgLibrary = JSON.parse(localStorage.getItem("basisPointUilg") || "[]");
  } catch {
    uilgLibrary = [];
  }
  updateUilgStatus();
}

function saveUilgLibrary() {
  localStorage.setItem("basisPointUilg", JSON.stringify(uilgLibrary));
  updateUilgStatus();
}

function setDrawerOpen(isOpen) {
  choiceDrawer.classList.toggle("is-open", isOpen);
  drawerScrim.classList.toggle("is-visible", isOpen);
  choiceDrawer.setAttribute("aria-hidden", String(!isOpen));
  menuButton.setAttribute("aria-expanded", String(isOpen));
}

function showHome() {
  stationPage.classList.add("is-hidden");
  homePage.classList.remove("is-hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
  promptInput.focus({ preventScroll: true });
}

function showStation(key) {
  const station = stations[key];
  if (!station) {
    return;
  }
  activeStationKey = key;
  homePage.classList.add("is-hidden");
  stationPage.classList.remove("is-hidden");
  stationTitle.textContent = station.title;
  stationSubtitle.textContent = station.subtitle;
  promptInput.value = station.prompt;
  uilgContextBlock.classList.toggle("is-hidden", key !== "uilg-format");
  renderStation();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showConversation() {
  chatIntro.classList.add("is-compact");
  chatThread.classList.add("has-messages");
}

function addMessage(role, content) {
  showConversation();
  const message = document.createElement("article");
  message.className = `message ${role}`;
  const bubble = document.createElement("div");
  bubble.className = "message-bubble";
  bubble.textContent = content;
  message.appendChild(bubble);
  chatThread.appendChild(message);
  message.scrollIntoView({ behavior: "smooth", block: "end" });
}

function pickTopicFromPrompt(prompt) {
  const normalized = prompt.toLowerCase();
  return topics.find((topic) => topic.aliases.some((alias) => normalized.includes(alias))) || activeTopic;
}

function buildReelResponse(prompt, topic) {
  const uilgLine = uilgLibrary.length
    ? `UILG context: ${uilgLibrary.length} saved training ${uilgLibrary.length === 1 ? "set" : "sets"} available.`
    : "UILG context: none saved yet.";

  return [
    `Topic for today: ${topic.label}`,
    "",
    `Request: ${prompt}`,
    uilgLine,
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

function submitPrompt() {
  const prompt = promptInput.value.trim() || "Find my topic for today and generate a content angle.";
  const topic = pickTopicFromPrompt(prompt);
  activeTopic = topic;
  promptInput.value = "";
  addMessage("user", prompt);
  addMessage("assistant", buildReelResponse(prompt, topic));
  promptInput.focus();
}

function renderStation() {
  const current = stationState[activeStationKey] || emptyStation();
  clearElement(ideaList);
  clearElement(draftList);
  ideaCount.textContent = `${current.ideas.length} saved`;
  draftCount.textContent = `${current.drafts.length} saved`;

  if (current.ideas.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-note";
    empty.textContent = "No ideas yet.";
    ideaList.appendChild(empty);
  }

  current.ideas.forEach((idea) => {
    const item = document.createElement("article");
    item.className = "note-item";
    const text = document.createElement("p");
    text.textContent = idea.text;
    const meta = document.createElement("span");
    meta.textContent = formatSavedTime(idea.createdAt);
    item.append(text, meta);
    ideaList.appendChild(item);
  });

  if (current.drafts.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-note";
    empty.textContent = "No drafts yet.";
    draftList.appendChild(empty);
  }

  current.drafts.forEach((draft) => {
    const item = document.createElement("article");
    item.className = "note-item";
    const title = document.createElement("strong");
    title.textContent = draft.title;
    const body = document.createElement("p");
    body.textContent = draft.body;
    const meta = document.createElement("span");
    meta.textContent = formatSavedTime(draft.createdAt);
    item.append(title, body, meta);
    draftList.appendChild(item);
  });
}

function updateUilgStatus() {
  if (uilgLibrary.length === 0) {
    uilgStatus.textContent = "No context saved yet.";
    return;
  }
  const latest = uilgLibrary[uilgLibrary.length - 1];
  uilgStatus.textContent = `${uilgLibrary.length} saved / latest: ${latest.label}`;
}

promptInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    submitPrompt();
  }
});

menuButton.addEventListener("click", () => {
  setDrawerOpen(!choiceDrawer.classList.contains("is-open"));
});

closeDrawerButton.addEventListener("click", () => setDrawerOpen(false));
drawerScrim.addEventListener("click", () => setDrawerOpen(false));
backHomeButton.addEventListener("click", showHome);

document.querySelectorAll(".drawer-choice").forEach((button) => {
  button.addEventListener("click", () => {
    setDrawerOpen(false);
    showStation(button.dataset.choice);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setDrawerOpen(false);
  }
});

ideaForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = ideaInput.value.trim();
  if (!text) {
    return;
  }
  stationState[activeStationKey].ideas.unshift({ text, createdAt: new Date().toISOString() });
  ideaInput.value = "";
  saveStationState();
  renderStation();
});

draftForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const body = draftBodyInput.value.trim();
  if (!body) {
    return;
  }
  stationState[activeStationKey].drafts.unshift({
    title: draftTitleInput.value.trim() || "Untitled draft",
    body,
    createdAt: new Date().toISOString(),
  });
  draftTitleInput.value = "";
  draftBodyInput.value = "";
  saveStationState();
  renderStation();
});

uilgForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const context = uilgContext.value.trim();
  if (!context) {
    uilgStatus.textContent = "Paste context before saving.";
    return;
  }
  uilgLibrary.push({
    label: uilgLabel.value.trim() || "Untitled context set",
    context,
    savedAt: new Date().toISOString(),
  });
  uilgLabel.value = "";
  uilgContext.value = "";
  saveUilgLibrary();
});

loadStationState();
loadUilgLibrary();
