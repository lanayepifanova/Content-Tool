const topicTree = document.getElementById("topicTree");
const sourceList = document.getElementById("sourceList");
const contentList = document.getElementById("contentList");
const filterList = document.getElementById("filterList");
const outputBox = document.getElementById("outputBox");
const statusText = document.getElementById("statusText");
const topicTitle = document.getElementById("topicTitle");
const topicDescription = document.getElementById("topicDescription");
const statRefreshed = document.getElementById("statRefreshed");
const statVolume = document.getElementById("statVolume");
const statHealth = document.getElementById("statHealth");
const platformSelect = document.getElementById("platformSelect");
const toneSelect = document.getElementById("toneSelect");
const angleSelect = document.getElementById("angleSelect");
const refreshFeedButton = document.getElementById("refreshFeedButton");
const talkingPointsButton = document.getElementById("talkingPointsButton");
const createNarrativeButton = document.getElementById("createNarrativeButton");
const selectionToolbar = document.getElementById("selectionToolbar");
const selectionStatus = document.getElementById("selectionStatus");
const researchMemory = document.getElementById("researchMemory");
const commandPalette = document.getElementById("commandPalette");
const toggleControlsButton = document.getElementById("toggleControlsButton");
const secondaryControls = document.getElementById("secondaryControls");
const workspaceSetup = document.getElementById("workspaceSetup");

const TOPIC_DECORATORS = {
  "startups-vc-tech": {
    icon: "◫",
    subtopics: ["AI", "Robotics", "SaaS"],
    filters: ["Seed", "Series A", "Launches"],
  },
  "markets-finance": {
    icon: "◪",
    subtopics: ["Macro", "Commodities"],
    filters: ["Rates", "Equities", "Credit"],
  },
  "infrastructure-policy": {
    icon: "◩",
    subtopics: ["Industrial Policy", "Logistics", "Energy"],
    filters: ["State Capacity", "Supply Chain", "Permitting"],
  },
  ai: {
    icon: "◬",
    subtopics: ["Models", "Agents", "Labs"],
    filters: ["Inference", "Funding", "Tooling"],
  },
  robotics: {
    icon: "◭",
    subtopics: ["Humanoids", "Automation", "Hardware"],
    filters: ["Manufacturing", "Warehousing", "Mobility"],
  },
  "real-estate": {
    icon: "◨",
    subtopics: ["Office", "Multifamily", "CRE Debt"],
    filters: ["Refinancing", "Occupancy", "Development"],
  },
};

let topics = [];
let activeTopic = null;
let discoveredArticles = [];
let selectedArticleUrls = new Set();
let lastRefreshedText = "Not yet";
let activeView = "trending";
let controlsExpanded = false;
let expandedTopics = new Set();

function formatNow() {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date());
}

function computeHealth(topic, articleCount) {
  if (!topic) {
    return "Idle";
  }
  if (articleCount >= Math.max(3, Math.ceil(topic.sources.length / 3))) {
    return "Strong";
  }
  if (articleCount > 0) {
    return "Mixed";
  }
  return "Thin";
}

function updateHeaderStats() {
  statRefreshed.textContent = lastRefreshedText;
  statVolume.textContent = `${discoveredArticles.length} ${discoveredArticles.length === 1 ? "story" : "stories"}`;
  statHealth.textContent = computeHealth(activeTopic, discoveredArticles.length);
}

function updateSelectionToolbar() {
  const count = selectedArticleUrls.size;
  selectionStatus.textContent = `${count} selected`;
  selectionToolbar.classList.toggle("is-hidden", count === 0);
}

function insertTemplateBlock(label) {
  const block = `${label}\n${"-".repeat(label.length)}\n`;
  const spacer = outputBox.textContent.trim() ? "\n\n" : "";
  outputBox.textContent += `${spacer}${block}`;
}

function selectedArticles() {
  return discoveredArticles.filter((article) => selectedArticleUrls.has(article.url));
}

function hydrateResearchMemory() {
  researchMemory.innerHTML = "";
  if (selectedArticleUrls.size === 0) {
    return;
  }
  selectedArticles().forEach((article) => {
    const item = document.createElement("div");
    item.className = "memory-item";
    item.textContent = `${article.source}: ${article.title}`;
    researchMemory.appendChild(item);
  });
}

function setActiveTopic(topic) {
  activeTopic = topic;
  discoveredArticles = [];
  selectedArticleUrls = new Set();
  topicTitle.textContent = topic.label;
  topicDescription.textContent = topic.description;
  statusText.textContent = `Tracking ${topic.label}. Refresh the feed or start building a narrative.`;
  outputBox.textContent = "";
  lastRefreshedText = "Not yet";
  renderSources(topic);
  renderFilters(topic);
  renderDiscoveredContent();
  updateHeaderStats();
  updateSelectionToolbar();
  hydrateResearchMemory();
  setActiveTopicRow();
}

function renderFilters(topic) {
  filterList.innerHTML = "";
  const decorators = TOPIC_DECORATORS[topic.slug] || { filters: [] };
  decorators.filters.forEach((filter) => {
    const chip = document.createElement("span");
    chip.className = "filter-chip";
    chip.textContent = filter;
    filterList.appendChild(chip);
  });
}

function renderSources(topic) {
  sourceList.innerHTML = "";
  topic.sources.forEach((source) => {
    const row = document.createElement("article");
    row.className = "source-row";
    row.innerHTML = `
      <span class="source-row-name">${source.name}</span>
      <span class="source-row-type">${source.type === "feed" ? "Feed" : "Web"}</span>
      <a class="source-row-link" href="${source.url}" target="_blank" rel="noreferrer">Open</a>
    `;
    sourceList.appendChild(row);
  });
}

function scoreForView(article) {
  const title = article.title.toLowerCase();
  if (activeView === "controversial") {
    return article.score + (title.includes("battle") || title.includes("fight") ? 4 : 0);
  }
  if (activeView === "engagement") {
    return article.score + (title.includes("why") || title.includes("how") ? 3 : 0);
  }
  if (activeView === "macro") {
    return article.score + (title.includes("market") || title.includes("policy") ? 3 : 0);
  }
  if (activeView === "short") {
    return article.score + (title.length < 70 ? 2 : 0);
  }
  if (activeView === "youtube") {
    return article.score + (title.length > 55 ? 2 : 0);
  }
  if (activeView === "cited") {
    return article.score + 1;
  }
  return article.score;
}

function renderDiscoveredContent() {
  contentList.innerHTML = "";
  if (discoveredArticles.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-row";
    empty.textContent = "No live articles loaded yet.";
    contentList.appendChild(empty);
    return;
  }

  const sorted = [...discoveredArticles].sort((left, right) => scoreForView(right) - scoreForView(left));
  sorted.forEach((article) => {
    const row = document.createElement("article");
    row.className = "article-row";
    row.dataset.url = article.url;
    row.draggable = true;
    row.innerHTML = `
      <label class="article-check">
        <input type="checkbox" ${selectedArticleUrls.has(article.url) ? "checked" : ""}>
        <span></span>
      </label>
      <div class="article-copy">
        <strong>${article.title}</strong>
        <p>${article.source} • score ${article.score.toFixed(1)}</p>
      </div>
      <button class="article-inline" data-action="reference" type="button">Reference</button>
      <a class="article-link" href="${article.url}" target="_blank" rel="noreferrer">Open</a>
    `;

    row.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/article-url", article.url);
      event.dataTransfer.setData("text/article-title", article.title);
    });

    row.querySelector("input").addEventListener("change", (event) => {
      if (event.target.checked) {
        selectedArticleUrls.add(article.url);
      } else {
        selectedArticleUrls.delete(article.url);
      }
      updateSelectionToolbar();
      hydrateResearchMemory();
      renderDiscoveredContent();
    });

    row.querySelector('[data-action="reference"]').addEventListener("click", () => {
      const spacer = outputBox.textContent.trim() ? "\n\n" : "";
      outputBox.textContent += `${spacer}[Reference] ${article.title} — ${article.source}`;
    });

    if (selectedArticleUrls.has(article.url)) {
      row.classList.add("is-selected");
    }
    contentList.appendChild(row);
  });
}

function setActiveTopicRow() {
  document.querySelectorAll(".topic-row").forEach((row) => {
    row.classList.toggle("is-active", activeTopic && row.dataset.slug === activeTopic.slug);
  });
}

async function findContent() {
  if (!activeTopic) {
    return;
  }
  statusText.textContent = `Refreshing feed for ${activeTopic.label}...`;
  const response = await fetch("/api/discover", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic: activeTopic.slug }),
  });

  const payload = await response.json();
  if (!response.ok) {
    statusText.textContent = "Content discovery failed.";
    outputBox.textContent = payload.error || "Unknown error";
    return;
  }

  discoveredArticles = payload.ranked_articles || [];
  selectedArticleUrls = new Set();
  lastRefreshedText = formatNow();
  statusText.textContent = `Loaded ${discoveredArticles.length} stories for ${activeTopic.label}.`;
  renderDiscoveredContent();
  updateHeaderStats();
  updateSelectionToolbar();
  hydrateResearchMemory();
}

async function generateScript(mode = "platform") {
  if (!activeTopic) {
    return;
  }
  const targetScriptType = mode === "platform" ? platformSelect.value : platformSelect.value;
  statusText.textContent = `Generating ${targetScriptType} script for ${activeTopic.label}...`;
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      topic: activeTopic.slug,
      script_type: targetScriptType,
    }),
  });

  const payload = await response.json();
  if (!response.ok) {
    statusText.textContent = "Generation failed.";
    outputBox.textContent = payload.error || "Unknown error";
    return;
  }

  discoveredArticles = payload.ranked_articles || discoveredArticles;
  lastRefreshedText = formatNow();
  outputBox.textContent = payload.output;
  statusText.textContent = `Draft ready for ${platformSelect.value} in a ${toneSelect.value} tone.`;
  renderDiscoveredContent();
  updateHeaderStats();
}

function createNarrative() {
  const selected = selectedArticles();
  if (selected.length === 0) {
    return;
  }
  const lines = [
    `Narrative thread: ${activeTopic.label}`,
    "",
    `Angle: ${angleSelect.value}`,
    `Tone: ${toneSelect.value}`,
    `Target platform: ${platformSelect.value}`,
    "",
    ...selected.map((article, index) => `${index + 1}. ${article.title} (${article.source})`),
  ];
  outputBox.textContent = lines.join("\n");
}

function generateTalkingPoints() {
  const selected = selectedArticles();
  if (selected.length === 0) {
    return;
  }
  const lines = [
    "Hook",
    "Why this matters right now.",
    "",
    "Key insight",
    ...selected.map((article) => `- ${article.title}`),
    "",
    "Market implication",
    "What shifts if this trend continues.",
    "",
    "Contrarian angle",
    "What most people are probably missing.",
    "",
    "CTA",
    "Tell people what to watch next.",
  ];
  outputBox.textContent = lines.join("\n");
}

function renderTopics() {
  topicTree.innerHTML = "";
  topics.forEach((topic) => {
    const decorators = TOPIC_DECORATORS[topic.slug] || { icon: "◻", subtopics: [] };
    const wrapper = document.createElement("div");
    wrapper.className = "topic-group";

    const row = document.createElement("button");
    row.type = "button";
    row.className = "topic-row";
    row.dataset.slug = topic.slug;
    row.setAttribute("aria-expanded", expandedTopics.has(topic.slug) ? "true" : "false");
    row.innerHTML = `
      <span class="row-chevron">›</span>
      <span class="row-icon">${decorators.icon}</span>
      <span class="row-label">${topic.label}</span>
      <span class="row-count">${topic.sources.length}</span>
    `;
    row.addEventListener("click", () => {
      const wasExpanded = expandedTopics.has(topic.slug);
      if (wasExpanded) {
        expandedTopics.delete(topic.slug);
      } else {
        expandedTopics.add(topic.slug);
      }
      if (!wasExpanded || !activeTopic || activeTopic.slug !== topic.slug) {
        setActiveTopic(topic);
      }
      renderTopics();
    });
    wrapper.appendChild(row);

    const subtopicList = document.createElement("div");
    subtopicList.className = "subtopic-list";
    subtopicList.classList.toggle("is-collapsed", !expandedTopics.has(topic.slug));
    decorators.subtopics.forEach((subtopic) => {
      const subtopicRow = document.createElement("div");
      subtopicRow.className = "subtopic-row";
      subtopicRow.textContent = subtopic;
      subtopicList.appendChild(subtopicRow);
    });
    wrapper.appendChild(subtopicList);
    topicTree.appendChild(wrapper);
  });
  setActiveTopicRow();
}

function toggleCommandPalette(force) {
  const shouldShow = typeof force === "boolean" ? force : commandPalette.classList.contains("is-hidden");
  commandPalette.classList.toggle("is-hidden", !shouldShow);
}

function syncDisclosure() {
  secondaryControls.classList.toggle("is-hidden", !controlsExpanded);
  toggleControlsButton.textContent = controlsExpanded ? "Hide context" : "Show context";
  workspaceSetup.classList.add("is-hidden");
}

function runCommand(command) {
  if (command === "refresh") {
    findContent();
  }
  if (command === "generate-draft") {
    generateScript();
  }
  if (command === "talking-points") {
    generateTalkingPoints();
  }
  if (command === "narrative") {
    createNarrative();
  }
  if (command === "template-hook") {
    insertTemplateBlock("Hook");
  }
  if (command === "template-cta") {
    insertTemplateBlock("CTA");
  }
  if (command === "continue") {
    outputBox.textContent += `${outputBox.textContent.trim() ? "\n\n" : ""}[AI continue]\nTake the current thread one step further with a sharper implication.`;
  }
  toggleCommandPalette(false);
}

async function boot() {
  const response = await fetch("/api/topics");
  const payload = await response.json();
  topics = payload.topics || [];
  renderTopics();
  if (topics.length > 0) {
    expandedTopics.add(topics[0].slug);
    setActiveTopic(topics[0]);
  }
}

document.querySelectorAll(".view-chip").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".view-chip").forEach((chip) => chip.classList.remove("is-active"));
    button.classList.add("is-active");
    activeView = button.dataset.view;
    renderDiscoveredContent();
  });
});

document.querySelectorAll(".template-chip").forEach((button) => {
  button.addEventListener("click", () => insertTemplateBlock(button.dataset.template));
});

document.querySelectorAll(".command-item").forEach((button) => {
  button.addEventListener("click", () => runCommand(button.dataset.command));
});

refreshFeedButton.addEventListener("click", findContent);
talkingPointsButton.addEventListener("click", generateTalkingPoints);
createNarrativeButton.addEventListener("click", createNarrative);
toggleControlsButton.addEventListener("click", () => {
  controlsExpanded = !controlsExpanded;
  syncDisclosure();
});

platformSelect.addEventListener("change", () => {
  statusText.textContent = `Target platform set to ${platformSelect.value}.`;
});

document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    toggleCommandPalette();
  }
  if (event.key === "Escape") {
    toggleCommandPalette(false);
  }
  if (event.key === "/" && document.activeElement === outputBox) {
    statusText.textContent = "Use templates, references, or AI continue inline.";
  }
});

outputBox.addEventListener("drop", (event) => {
  const articleUrl = event.dataTransfer.getData("text/article-url");
  const articleTitle = event.dataTransfer.getData("text/article-title");
  if (!articleUrl || !articleTitle) {
    return;
  }
  event.preventDefault();
  const spacer = outputBox.textContent.trim() ? "\n\n" : "";
  outputBox.textContent += `${spacer}[Reference] ${articleTitle}\n${articleUrl}`;
});

boot();
