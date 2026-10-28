const API_BASE = ""; // same origin as this test page

const chatBody = document.getElementById("chatBody");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const statusDot = document.getElementById("statusDot");
const statusText = document.getElementById("statusText");
const metaPanel = document.getElementById("metaPanel");

let history = [];

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function addMessage(text, sender, meta) {
  const el = document.createElement("div");
  el.className = "msg " + (sender === "user" ? "msg-user" : sender === "error" ? "msg-error" : "msg-bot");
  el.innerHTML = escapeHtml(text).replace(/\n/g, "<br>");
  chatBody.appendChild(el);

  if (meta) {
    const metaEl = document.createElement("div");
    metaEl.className = "msg-meta";
    metaEl.textContent = meta;
    chatBody.appendChild(metaEl);
  }
  chatBody.scrollTop = chatBody.scrollHeight;
}

function showTyping() {
  const el = document.createElement("div");
  el.className = "typing";
  el.id = "typingIndicator";
  el.innerHTML = "<span></span><span></span><span></span>";
  chatBody.appendChild(el);
  chatBody.scrollTop = chatBody.scrollHeight;
}
function hideTyping() {
  const el = document.getElementById("typingIndicator");
  if (el) el.remove();
}

async function sendMessage(text) {
  addMessage(text, "user");
  history.push({ role: "user", content: text });
  chatInput.value = "";
  showTyping();

  try {
    const res = await fetch(API_BASE + "/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, history }),
    });
    const data = await res.json();
    hideTyping();

    if (!res.ok) {
      addMessage(data.message || "Something went wrong.", "error");
      return;
    }
    addMessage(data.reply, "bot", `intent: ${data.intent} · source: ${data.source}`);
    history.push({ role: "assistant", content: data.reply });
  } catch (err) {
    hideTyping();
    addMessage("Could not reach the chatbot server. Is it running?", "error");
  }
}

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;
  sendMessage(text);
});

document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => sendMessage(chip.dataset.q));
});

async function checkHealth() {
  try {
    const res = await fetch(API_BASE + "/api/health");
    const data = await res.json();
    statusDot.style.background = "#58d68d";
    statusText.textContent = "Online";
    metaPanel.innerHTML = `
      <strong>Service status</strong><br>
      Database lookups: <code>${data.dbConnected ? "connected" : "not connected (knowledge-base-only)"}</code><br>
      LLM enhancement: <code>${data.llmConfigured ? "enabled" : "disabled (rule-based + knowledge base only)"}</code>`;
  } catch (err) {
    statusDot.style.background = "#c0392b";
    statusText.textContent = "Offline";
    metaPanel.innerHTML = "Could not reach <code>/api/health</code>. Make sure the chatbot server is running (<code>npm start</code>).";
  }
}

checkHealth();
addMessage("Namaskar! I'm Krishi Mitra. Ask me anything about farming, or try one of the suggestions above.", "bot");
