const chatIntro = document.getElementById("chatIntro");
const chatThread = document.getElementById("chatThread");
const promptInput = document.getElementById("promptInput");
const topicChips = document.getElementById("topicChips");

const topics = [
  {
    label: "AI",
    aliases: ["ai", "artificial intelligence", "models", "agents"],
    prompt: "Find the AI story with the biggest practical implication.",
    stories: [
      "The AI infrastructure story that matters is shifting from model launches to who controls distribution.",
      "Enterprise AI budgets are moving toward workflow tools instead of broad chat products.",
      "The next debate is not whether agents work, but where reliability becomes good enough to replace manual work.",
    ],
  },
  {
    label: "Markets",
    aliases: ["markets", "market", "finance", "macro", "rates"],
    prompt: "Find the market story with the clearest second-order consequence.",
    stories: [
      "The market story to watch is how rate expectations are changing risk appetite.",
      "Credit conditions are becoming the cleaner signal than equity index moves.",
      "Investors are repricing growth stories around cash flow instead of pure expansion.",
    ],
  },
  {
    label: "Startups",
    aliases: ["startup", "startups", "vc", "venture", "founder"],
    prompt: "Find the startup or venture story people will still be talking about tonight.",
    stories: [
      "The startup signal is that founders are selling efficiency before growth again.",
      "VC attention is concentrating around companies that turn AI into measurable labor savings.",
      "The strongest angle is how distribution is becoming more valuable than model access.",
    ],
  },
  {
    label: "Policy",
    aliases: ["policy", "infrastructure", "government", "industrial"],
    prompt: "Find the policy or infrastructure story that changes the operating environment.",
    stories: [
      "The policy story is about implementation capacity, not the announcement itself.",
      "Industrial policy is becoming a competition over permitting, power, and supply chains.",
      "The overlooked angle is how public decisions create private market winners.",
    ],
  },
  {
    label: "Robotics",
    aliases: ["robotics", "robot", "automation", "hardware"],
    prompt: "Find the robotics story that shows automation moving from demo to deployment.",
    stories: [
      "The robotics story is moving from impressive demos to boring deployment constraints.",
      "Warehouses and factories are where automation economics are becoming easiest to prove.",
      "The key question is whether hardware reliability can keep up with software ambition.",
    ],
  },
  {
    label: "Real estate",
    aliases: ["real estate", "housing", "office", "cre", "property"],
    prompt: "Find the real estate story that reveals pressure in the capital stack.",
    stories: [
      "The real estate story is not just prices, it is refinancing pressure.",
      "Office stress is becoming a lender story as much as a landlord story.",
      "The best angle is how capital costs change which projects can survive.",
    ],
  },
];

let activeTopic = topics[0];

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
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

function renderTopicChips() {
  clearElement(topicChips);
  topics.forEach((topic) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "topic-chip";
    button.textContent = topic.label;
    button.addEventListener("click", () => {
      activeTopic = topic;
      promptInput.value = topic.prompt;
      promptInput.focus();
    });
    topicChips.appendChild(button);
  });
}

function pickTopicFromPrompt(prompt) {
  const normalized = prompt.toLowerCase();
  return (
    topics.find((topic) => topic.aliases.some((alias) => normalized.includes(alias))) ||
    activeTopic ||
    topics[0]
  );
}

function buildReelResponse(prompt, topic) {
  return [
    `Topic for today: ${topic.label}`,
    "",
    `Request: ${prompt}`,
    "",
    "News to cover:",
    ...topic.stories.map((story, index) => `${index + 1}. ${story}`),
    "",
    "Instagram Reel structure:",
    "0-3s: Open with the tension, not the headline.",
    "3-15s: Explain what happened in plain language.",
    "15-35s: Connect the story to money, power, timing, or behavior.",
    "35-60s: Give the audience one thing to watch next.",
    "",
    "Caption:",
    "The headline is only the surface. The real story is what changes next.",
  ].join("\n");
}

function submitPrompt() {
  const prompt = promptInput.value.trim() || "Find my topic for today and generate an Instagram Reel.";
  const topic = pickTopicFromPrompt(prompt);
  activeTopic = topic;
  promptInput.value = "";
  addMessage("user", prompt);
  addMessage("assistant", buildReelResponse(prompt, topic));
  promptInput.focus();
}

promptInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    submitPrompt();
  }
});

renderTopicChips();
