// This file contains the main logic for page-specific dynamic content and modals.

// Grab the translation data from langtheme.js (which is loaded first)
// The `translations` object contains all service card and modal data.
// We assume `translations` and `currentLanguage` are globally available after langtheme.js loads.

function createServiceCards(services, lang) {
  const container = document.getElementById('cards-section');
  if (!container) return; // Only run this on the index page
  // Clear any existing content
  container.innerHTML = '';
  Object.keys(services).forEach(key => {
    const serviceData = services[key];
    const cardData = serviceData[lang];

    // Create a new card element
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('data-service-key', key);

    // Build the inner HTML for the card
    card.innerHTML = `
      <div class="title">${cardData.title}</div>
      <div class="icon">${serviceData.icon}</div>
      <div class="content">${cardData.desc}</div>
    `;

    // Add the card to the container
    container.appendChild(card);
  });
}
function createModal(serviceKey, lang) {
  const modalRoot = document.getElementById('modal-root');
  const serviceData = translations.services[serviceKey];
  const modalData = serviceData[lang].modal;
  if (!modalData) return;

  // Create modal backdrop and content
  const modalBackdrop = document.createElement('div');
  modalBackdrop.className = 'modal-backdrop';
  const modalContent = document.createElement('div');
  modalContent.className = 'ops-modal';
  // Build the modal HTML with new buttons in the footer
  modalContent.innerHTML = `
    <button class="close-modal" aria-label="Close modal">×</button>
    <div class="modal-header">
      <img src="${serviceData.img}" alt="${modalData.imgAlt}" class="modal-img">
      <h3 class="modal-title">${modalData.title}</h3>
    </div>
    <div class="modal-content-body">
      <p>${modalData.content}</p>
      <ul class="modal-features">
        ${modalData.features.map(feature => `<li>${feature}</li>`).join('')}
      </ul>
    </div>
    <div class="modal-actions">
      <a href="${serviceData.learn}" class="modal-btn" data-key="modal-learn-more"></a>
      <a href="#" id="ask-chattia-btn" class="modal-btn" data-key="modal-ask-chattia"></a>
      <a href="#" id="join-us-btn" class="modal-btn" data-key="modal-join-us"></a>
      <a href="contact-center.html#form" class="modal-btn" data-key="modal-contact-us"></a>
    </div>
  `;
  // Append modal to the DOM
  modalBackdrop.appendChild(modalContent);
  modalRoot.appendChild(modalBackdrop);
  // Update button text with translations
  updateModalContent(modalContent, lang);
  // Add event listeners for new buttons
  // Note: These are placeholders. You will need to replace the `console.log` calls
  // with actual calls to your Cloudflare Workers or other services.
  const askChattiaBtn = document.getElementById('ask-chattia-btn');
  askChattiaBtn.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Redirecting to Chatbot via Cloudflare Worker...');
    alert('Launching Chatbot...');
    closeModal();
  });
  const joinUsBtn = document.getElementById('join-us-btn');
  joinUsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Redirecting to Join Us form via Cloudflare Worker...');
    alert('Launching Join Us form...');
    closeModal();
  });
    // Add event listener to close button
  modalContent.querySelector('.close-modal').addEventListener('click', closeModal);
  // Close modal when clicking outside of it
  modalBackdrop.addEventListener('click', (event) => {
    if (event.target === modalBackdrop) {
      closeModal();
    }
  });
  function closeModal() {
    modalRoot.innerHTML = '';
  }
}
// Helper function to update content inside the modal after creation
function updateModalContent(modalElement, lang) {
  const elements = modalElement.querySelectorAll('[data-key]');
  elements.forEach(el => {
    const key = el.getAttribute('data-key');
    const translation = translations[lang][key];
    if (translation) {
      el.textContent = translation;
    }
  });
}
// Function to handle form submission (prevents default behavior)
function handleFormSubmit(event) {
  event.preventDefault();
  // In a real application, you would send this data to a server
  console.log('Form submitted:', new FormData(event.target));
  alert('Thank you for your submission!');
  event.target.reset(); // Clear the form
}

document.addEventListener('DOMContentLoaded', () => {
  // --- Main Page Logic ---
  // Generate service cards on the main page dynamically
  createServiceCards(translations.services, currentLanguage);

  // Event listener for dynamically created cards
  const cardsContainer = document.getElementById('cards-section');
  if (cardsContainer) {
    cardsContainer.addEventListener('click', (event) => {
      const card = event.target.closest('.card');
      if (card) {
        const serviceKey = card.getAttribute('data-service-key');
        createModal(serviceKey, currentLanguage);
      }
    });
  }

<<<<<<< HEAD:js/app.js
function toggleLanguage() {
  lang = lang === "en" ? "es" : "en";
  applyLanguage();
}

// =================================================================================
// INITIALIZE PAGE
// =================================================================================

async function loadHTML(url, containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const text = await response.text();
        container.innerHTML = text;
      } else {
        console.error(`Failed to load HTML from ${url}: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error fetching HTML from ${url}:`, error);
    }
  }
}
document.addEventListener("DOMContentLoaded", async () => {
  await Promise.all([
    loadHTML('_nav.html', 'nav-container'),
    loadHTML('_fabs.html', 'fabs-container')
  ]);

  applyTheme();
  applyLanguage();
  initializeEventListeners();
});
// =================================================================================
// DYNAMIC CONTENT RENDERING
// =================================================================================

function renderCards() {
  Object.entries({ ops: "ops", cc: "cc", it: "it", pro: "pro" }).forEach(
    ([id, key]) => {
      const cardElement = document.getElementById("card-" + id);
      if (cardElement) {
        let c = svc[key][lang];
        cardElement.innerHTML = `
          <div class="title">${c.title}</div>
          <div class="icon">${c.icon}</div>
          <div class="content"><p>${c.desc}</p></div>
        `;
      }
    }
  );
}

// =================================================================================
// MODAL MANAGEMENT
// =================================================================================

function openModal(key) {
  let data = svc[key][lang].modal;
  let m = document.createElement("div");
  m.className = "modal-backdrop";
  m.innerHTML = `
    <div class="ops-modal" tabindex="-1" role="dialog" aria-modal="true" id="draggable-modal">
      <button class="modal-x" aria-label="CERRAR" id="modal-x">X</button>
      <div class="modal-header">
        <img class="modal-img" src="${data.img}" alt="${data.imgAlt}" />
        <div><div class="modal-title">${data.title}</div></div>
      </div>
      <div class="modal-content-body">${data.content}</div>
      <div class="modal-video">${data.video}</div>
      <ul style="margin-bottom:1.2em; margin-left:1.3em;">
        ${data.features.map((i) => `<li>${i}</li>`).join("")}
      </ul>
      <div class="modal-actions">
        <a class="modal-btn" href="${data.learn}" target="_blank">${
    lang === "en" ? "Learn More" : "Más Información"
  }</a>
        <button class="modal-btn" onclick="alert('Integrate with chatbot')">${
          lang === "en" ? "Ask Chattia" : "Preguntar Chattia"
        }</button>
        <button class="modal-btn cta" id="modal-contact-btn">${
          lang === "en" ? "Contact Us" : "Contáctanos"
        }</button>
        <button class="modal-btn" id="cancel-btn">${
          lang === "en" ? "Cancel" : "Cancelar"
        }</button>
      </div>
    </div>`;
  let root = document.getElementById("modal-root");
  root.innerHTML = "";
  root.appendChild(m);
  let modal = m.querySelector(".ops-modal");

  function close() {
    root.innerHTML = "";
  }
  m.onclick = (e) => (e.target === m ? close() : 0);
  modal.querySelector(".modal-x").onclick = close;
  modal.querySelector("#cancel-btn").onclick = close;
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
  modal.querySelector("#modal-contact-btn").onclick = () => {
    openContactModal();
    close();
  };
  makeDraggable(modal);
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

// =================================================================================
// EVENT LISTENERS
// =================================================================================

function initializeEventListeners() {
  // Card Modals
  Object.entries({ ops: "ops", cc: "cc", it: "it", pro: "pro" }).forEach(
    ([id, key]) => {
      const cardElement = document.getElementById("card-" + id);
      if (cardElement) {
        cardElement.onclick = () => openModal(key);
        cardElement.onkeydown = (e) => {
          if (e.key === "Enter" || e.key === " ") openModal(key);
        };
      }
    }
  );

  // Desktop Language and Theme Toggles
  const langToggle = document.getElementById("lang-toggle");
  if (langToggle) langToggle.onclick = toggleLanguage;

  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) themeToggle.onclick = toggleTheme;

  // FABs and Mobile Nav
  initializeFabsAndMobileNavEventListeners();
}

function initializeFabsAndMobileNavEventListeners() {
  // This function will be called on pages that have the FABs and mobile nav
  // It's safe to call on any page because it checks for the existence of elements

  // FABs
  const fabChat = document.getElementById("fab-chat");
  if (fabChat) fabChat.onclick = openChatbot;
  const fabJoin = document.getElementById("fab-join");
  if (fabJoin) fabJoin.onclick = openJoinModal;
  const fabContact = document.getElementById("fab-contact");
  if (fabContact) fabContact.onclick = openContactModal;

  // Mobile Nav
  const mobileChatbotBtn = document.getElementById("mobile-chatbot-btn");
  if (mobileChatbotBtn) mobileChatbotBtn.onclick = openChatbot;
  const servicesToggleBtn = document.getElementById("services-toggle");
  const servicesDropdown = document.getElementById("services-dropdown");
  if (servicesToggleBtn && servicesDropdown) {
    servicesToggleBtn.addEventListener("click", () => {
      const expanded =
        servicesToggleBtn.getAttribute("aria-expanded") === "true";
      servicesToggleBtn.setAttribute("aria-expanded", !expanded);
      servicesDropdown.classList.toggle("active");
    });

    document.addEventListener("click", (e) => {
      if (
        !servicesToggleBtn.contains(e.target) &&
        !servicesDropdown.contains(e.target)
      ) {
        servicesDropdown.classList.remove("active");
        servicesToggleBtn.setAttribute("aria-expanded", false);
      }
    });
  }

  // const mobileHomeBtn = document.getElementById("mobile-home-btn");
  // if (mobileHomeBtn) {
  //   mobileHomeBtn.addEventListener("click", () => alert("Navigate to Home"));
  // }

  const mobileLangToggle = document.getElementById("mobile-lang-toggle");
  if (mobileLangToggle) mobileLangToggle.onclick = toggleLanguage;

  const mobileThemeToggle = document.getElementById("mobile-theme-toggle");
  if (mobileThemeToggle) mobileThemeToggle.onclick = toggleTheme;
}

// =================================================================================
// UTILITIES
// =================================================================================

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
