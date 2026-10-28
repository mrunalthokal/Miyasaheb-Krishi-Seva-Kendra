/* Krishi Mitra floating chat widget.
   -----------------------------------------------------------------------
   Drop this into any page of the main site, AFTER linking
   chatbot-widget.css:

     <link rel="stylesheet" href="/widget/chatbot-widget.css">
     <script src="/widget/chatbot-widget.js" data-api-base="http://localhost:5050"></script>

   `data-api-base` should point at wherever the chatbot server (this folder)
   is deployed. If omitted, it defaults to the same origin as the page the
   widget is embedded on (useful once the chatbot is proxied behind the
   same domain as the main site).
   ----------------------------------------------------------------------- */
(function () {
  const scriptTag = document.currentScript;
  const API_BASE = (scriptTag && scriptTag.dataset.apiBase) || "";

  let history = [];
  let opened = false;

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function build() {
    const launcher = document.createElement("button");
    launcher.className = "km-launcher";
    launcher.type = "button";
    launcher.setAttribute("aria-label", "Chat with Krishi Mitra");
    launcher.innerHTML = "🌾";

    const panel = document.createElement("div");
    panel.className = "km-panel";
    panel.innerHTML = `
      <div class="km-head">
        <div>
          <strong>Krishi Mitra</strong>
          <span>Ask about farming, schemes &amp; crops</span>
        </div>
        <button class="km-close" type="button" aria-label="Close chat">✕</button>
      </div>
      <div class="km-body" id="kmBody"></div>
      <form class="km-input-row" id="kmForm">
        <input type="text" id="kmInput" placeholder="Ask a farming question…" autocomplete="off" required>
        <button type="submit" aria-label="Send">➤</button>
      </form>`;

    document.body.appendChild(launcher);
    document.body.appendChild(panel);

    const body = panel.querySelector("#kmBody");
    const form = panel.querySelector("#kmForm");
    const input = panel.querySelector("#kmInput");
    const closeBtn = panel.querySelector(".km-close");

    function addMsg(text, cls) {
      const el = document.createElement("div");
      el.className = "km-msg " + cls;
      el.innerHTML = escapeHtml(text).replace(/\n/g, "<br>");
      body.appendChild(el);
      body.scrollTop = body.scrollHeight;
    }

    function toggle(open) {
      opened = open !== undefined ? open : !opened;
      panel.classList.toggle("km-open", opened);
      if (opened && !body.dataset.greeted) {
        addMsg("Namaskar! I'm Krishi Mitra — ask me about crops, seeds, schemes, pests, weather or our products.", "km-msg-bot");
        body.dataset.greeted = "1";
      }
    }

    launcher.addEventListener("click", () => toggle());
    closeBtn.addEventListener("click", () => toggle(false));

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      addMsg(text, "km-msg-user");
      history.push({ role: "user", content: text });
      input.value = "";
      input.disabled = true;

      try {
        const res = await fetch(API_BASE + "/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, history }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Something went wrong.");
        addMsg(data.reply, "km-msg-bot");
        history.push({ role: "assistant", content: data.reply });
      } catch (err) {
        addMsg(err.message || "Could not reach the chatbot.", "km-msg-error");
      } finally {
        input.disabled = false;
        input.focus();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
