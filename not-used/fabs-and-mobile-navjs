// =================================================================================
// EVENT LISTENERS FOR FABs AND MOBILE NAV
// =================================================================================

function initializeFabsAndMobileNavEventListeners() {
  // FABs
  document.getElementById("fab-chat").onclick = openChatbot;
  document.getElementById("fab-join").onclick = openJoinModal;
  document.getElementById("fab-contact").onclick = openContactModal;

  // Mobile Nav
  document.getElementById("mobile-chatbot-btn").onclick = openChatbot;
  const servicesToggleBtn = document.getElementById("services-toggle");
  const servicesDropdown = document.getElementById("services-dropdown");

  if (servicesToggleBtn) {
    servicesToggleBtn.addEventListener("click", () => {
      const expanded =
        servicesToggleBtn.getAttribute("aria-expanded") === "true";
      servicesToggleBtn.setAttribute("aria-expanded", !expanded);
      servicesDropdown.classList.toggle("active");
    });

    document.addEventListener("click", (e) => {
      if (
        servicesDropdown &&
        !servicesToggleBtn.contains(e.target) &&
        !servicesDropdown.contains(e.target)
      ) {
        servicesDropdown.classList.remove("active");
        servicesToggleBtn.setAttribute("aria-expanded", false);
      }
    });
  }


  document
    .getElementById("mobile-home-btn")
    .addEventListener("click", () => alert("Navigate to Home"));

  // Language and Theme Toggles
  document.getElementById("mobile-lang-toggle").onclick = toggleLanguage;
  document.getElementById("mobile-theme-toggle").onclick = toggleTheme;
}

// It might be better to have a single, shared implementation of these functions.
// For now, to keep the components decoupled, we are duplicating some code.
// We can refactor this later to have a single source of truth for theme and language.

let lang = localStorage.getItem("lang") || "en";
let theme = localStorage.getItem("theme") || "light";

function applyTheme() {
  document.body.classList.toggle("dark", theme === "dark");
  const themeToggleButtons = document.querySelectorAll(
    "#theme-toggle, #mobile-theme-toggle, #chatbot-theme, #contact-theme-toggle"
  );
  themeToggleButtons.forEach(
    (btn) => (btn.textContent = theme === "light" ? "Dark" : "Light")
  );
  localStorage.setItem("theme", theme);
}

function toggleTheme() {
  theme = theme === "light" ? "dark" : "light";
  applyTheme();
}

function applyLanguage() {
  const langToggleButtons = document.querySelectorAll(
    "#lang-toggle, #mobile-lang-toggle"
  );
  langToggleButtons.forEach(
    (btn) => {
        const text = lang === "en" ? "ES" : "EN";
        if (btn.id === 'mobile-lang-toggle') {
            btn.querySelector('span').textContent = text;
        } else {
            btn.textContent = text;
        }
    }
  );

  document.documentElement.lang = lang;
  const titleTag = document.querySelector('title');
  if (titleTag) {
    document.title = titleTag.getAttribute('data-' + lang);
  }

  document.querySelectorAll('[data-en]').forEach(el => {
      const text = el.getAttribute('data-' + lang);
      if (!text) return;
      if (el.tagName.toLowerCase() === 'input') {
        el.placeholder = text;
      } else if (el.tagName.toLowerCase() === 'img') {
        el.alt = text;
      } else {
        el.textContent = text;
      }
    });

  if (typeof renderCards === "function") {
    renderCards();
  }
  const modalRoot = document.getElementById("modal-root");
  if (modalRoot) {
    modalRoot.innerHTML = ""; // Close any open modals
  }
  localStorage.setItem("lang", lang);
}

function toggleLanguage() {
  lang = lang === "en" ? "es" : "en";
  applyLanguage();
}


function openContactModal() {
  showModal("contact");
}
function openJoinModal() {
  showModal("join");
}

function openChatbot() {
  let existing = document.getElementById("chatbot-modal-backdrop");
  if (existing) {
    existing.remove();
    return;
  }
  let c = document.createElement("div");
  c.id = "chatbot-modal-backdrop";
  c.innerHTML = `
    <div id="chatbot-container" tabindex="-1" role="dialog" aria-modal="true">
      <div id="chatbot-header">
        <span id="title" data-en="OPS AI Chatbot" data-es="Chatbot OPS AI">${
          lang === "en" ? "OPS AI Chatbot" : "Chatbot OPS AI"
        }</span>
        <span>
          <span id="chatbot-lang" class="ctrl">${
            lang === "en" ? "ES" : "EN"
          }</span>
          &nbsp;|&nbsp;
          <span id="chatbot-theme" class="ctrl">${
            theme === "light" ? "Dark" : "Light"
          }</span>
          <button id="chatbot-x" aria-label="Close">×</button>
        </span>
      </div>
      <div id="chat-log" aria-live="polite"></div>
      <div id="chatbot-form-container">
        <form id="chatbot-input-row" autocomplete="off">
          <input
            id="chatbot-input"
            type="text"
            placeholder="${
              lang === "en"
                ? "Type your message..."
                : "Escriba su mensaje..."
            }"
            required
            maxlength="256"
          />
          <button id="chatbot-send" type="submit" disabled aria-label="Send">
            <i class="fas fa-paper-plane"></i>
          </button>
        </form>
        <label class="human-check">
          <input type="checkbox" id="human-check" />
          <span
            id="human-label"
            data-en="I am human"
            data-es="Soy humano"
            >${lang === "en" ? "I am human" : "Soy humano"}</span
          >
        </label>
      </div>
    </div>`;
  document.body.appendChild(c);

  let botThemeBtn = c.querySelector("#chatbot-theme");
  let botLangBtn = c.querySelector("#chatbot-lang");
  let chatbotCont = c.querySelector("#chatbot-container");

  c.onclick = (e) => {
    if (e.target === c) c.remove();
  };
  c.querySelector("#chatbot-x").onclick = () => c.remove();
  document.addEventListener(
    "keydown",
    function esc(e) {
      if (e.key === "Escape") {
        c.remove();
        document.removeEventListener("keydown", esc);
      }
    },
    { once: true }
  );

  botThemeBtn.onclick = toggleTheme;
  botLangBtn.onclick = () => {
    lang = lang === "en" ? "es" : "en";
    botLangBtn.textContent = lang === "en" ? "ES" : "EN";
    c.querySelector("#title").textContent =
      lang === "en" ? "OPS AI Chatbot" : "Chatbot OPS AI";
    c.querySelector("#chatbot-input").placeholder =
      lang === "en" ? "Type your message..." : "Escriba su mensaje...";
    c.querySelector("#human-label").textContent =
      lang === "en" ? "I am human" : "Soy humano";
  };
  // Chat logic
  let log = c.querySelector("#chat-log");
  let form = c.querySelector("#chatbot-input-row");
  let input = c.querySelector("#chatbot-input");
  let send = c.querySelector("#chatbot-send");
  let guard = c.querySelector("#human-check");
  guard.onchange = () => (send.disabled = !guard.checked);
  function addMsg(txt, cls) {
    let div = document.createElement("div");
    div.className = "chat-msg " + cls;
    div.textContent = txt;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  }
  form.onsubmit = async (e) => {
    e.preventDefault();
    if (!guard.checked) return;
    let msg = input.value.trim();
    if (!msg) return;
    addMsg(msg, "user");
    input.value = "";
    send.disabled = true;
    addMsg("…", "bot");
    setTimeout(() => {
      log.lastChild.textContent =
        lang === "en" ? "Simulated reply." : "Respuesta simulada.";
      send.disabled = false;
    }, 800);
  };
  makeDraggable(chatbotCont, c.querySelector("#chatbot-header"));
}

function showModal(type) {
  let root = document.getElementById("modal-root");
  root.innerHTML = "";
  let m = document.createElement("div");
  m.className = "modal-backdrop";
  m.innerHTML = type === "contact" ? contactModalHTML() : joinModalHTML();
  root.appendChild(m);
  let modal = m.querySelector(".modal-content");
  function close() {
    root.innerHTML = "";
  }
  m.onclick = (e) => (e.target === m ? close() : 0);
  modal.querySelector(".close-modal").onclick = close;
  let cancelBtn = modal.querySelector(".submit-button.cancel");
  if (cancelBtn) cancelBtn.onclick = close;

  // Add theme toggle listener if it's the contact modal
  if (type === "contact") {
    modal.querySelector("#contact-theme-toggle").onclick = toggleTheme;
  }

  document.addEventListener(
    "keydown",
    function esc(e) {
      if (e.key === "Escape") {
        close();
        document.removeEventListener("keydown", esc);
      }
    },
    { once: true }
  );
  makeDraggable(modal);
}

// --- Join Modal HTML
function joinModalHTML() {
  return `
  <div class="modal-content" tabindex="-1" role="dialog" aria-modal="true">
    <div class="modal-header">
      <h3>${lang === "en" ? "Join Us" : "Únete a Nosotros"}</h3>
      <button class="close-modal" aria-label="Close">&times;</button>
    </div>
    <form id="join-form">
      <div class="form-row">
        <label for="name">${lang === "en" ? "Name" : "Nombre"}</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="${lang === "en" ? "Enter your name" : "Ingresa tu nombre"}"
          required
        />
        <label for="email">${
          lang === "en" ? "Email" : "Correo Electrónico"
        }</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="${
            lang === "en" ? "Enter your email" : "Ingresa tu correo"
          }"
          required
        />
        <label for="phone">${lang === "en" ? "Phone" : "Teléfono"}</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          placeholder="${
            lang === "en" ? "Enter your phone" : "Ingresa tu teléfono"
          }"
          required
        />
      </div>
      <div class="form-row">
        <label for="comment">${
          lang === "en" ? "Tell us about yourself" : "Cuéntanos sobre ti"
        }</label>
        <textarea
          id="comment"
          name="comment"
          rows="4"
          placeholder="${
            lang === "en" ? "Tell us about yourself..." : "Cuéntanos sobre ti..."
          }"
        ></textarea>
      </div>
      <div class="modal-actions" style="margin-top:1.7em;">
        <button type="button" class="submit-button cancel">${
          lang === "en" ? "Cancel" : "Cancelar"
        }</button>
        <button
          type="submit"
          class="submit-button"
          style="background:var(--clr-accent);color:#fff;"
        >
          ${lang === "en" ? "Submit" : "Enviar"}
        </button>
      </div>
    </form>
  </div>
  `;
}

// --- Contact Modal HTML
function contactModalHTML() {
  return `
  <div class="modal-content" tabindex="-1" role="dialog" aria-modal="true">
    <div class="modal-header">
      <h3>${lang === "en" ? "Contact Us" : "Contáctenos"}</h3>
      <button class="close-modal" aria-label="Close">&times;</button>
    </div>
    <form id="contact-form">
      <div class="form-row">
        <label for="contact-name">${
          lang === "en" ? "Name" : "Nombre"
        }</label>
        <input
          type="text"
          id="contact-name"
          placeholder="${
            lang === "en" ? "Enter your name" : "Ingrese su nombre"
          }"
          required
        />
        <label for="contact-email">${
          lang === "en" ? "Email" : "Correo Electrónico"
        }</label>
        <input
          type="email"
          id="contact-email"
          placeholder="${
            lang === "en" ? "Enter your email" : "Ingrese su correo electrónico"
          }"
          required
        />
      </div>
      <div class="form-row">
        <label for="contact-comments">${
          lang === "en" ? "Comments" : "Comentarios"
        }</label>
        <textarea
          id="contact-comments"
          rows="3"
          placeholder="${
            lang === "en"
              ? "What service are you interested in?"
              : "¿En qué servicio está interesado?"
          }"
          required
        ></textarea>
      </div>
      <div class="modal-actions" style="margin-top:1.2em; justify-content: space-between;">
        <div>
          <button type="button" class="toggle-btn" id="contact-theme-toggle">${
            theme === "light" ? "Dark" : "Light"
          }</button>
        </div>
        <div>
          <button type="button" class="submit-button cancel">${
            lang === "en" ? "Cancel" : "Cancelar"
          }</button>
          <button
            type="submit"
            class="submit-button"
            style="background:var(--clr-primary);color:#fff;"
          >
            ${lang === "en" ? "Send" : "Enviar"}
          </button>
        </div>
      </div>
    </form>
  </div>
  `;
}


function makeDraggable(elem, dragHandle) {
  let isDown = false,
    startX = 0,
    startY = 0;
  let header = dragHandle || elem;
  header.style.cursor = "move";

  header.onmousedown = function (e) {
    isDown = true;
    elem.classList.add("dragging");
    startX = e.clientX - (parseInt(elem.style.left) || window.innerWidth / 2);
    startY = e.clientY - (parseInt(elem.style.top) || window.innerHeight / 4);

    document.onmousemove = function (e) {
      if (!isDown) return;
      elem.style.left = `${e.clientX - startX}px`;
      elem.style.top = `${e.clientY - startY}px`;
      elem.style.transform = "none";
    };

    document.onmouseup = function () {
      isDown = false;
      elem.classList.remove("dragging");
      document.onmousemove = null;
      document.onmouseup = null;
    };
    return false;
  };
}
