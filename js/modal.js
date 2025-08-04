// Modal and card-related utilities

export function createServiceCards(services, lang) {
  const container = document.getElementById('cards-section');
  if (!container) return;
  container.innerHTML = '';
  Object.keys(services).forEach(key => {
    const serviceData = services[key];
    const cardData = serviceData[lang];

    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('data-service-key', key);
    card.innerHTML = `
      <div class="title">${cardData.title}</div>
      <div class="icon">${serviceData.icon}</div>
      <div class="content">${cardData.desc}</div>
    `;
    container.appendChild(card);
  });
}

export function createModal(serviceKey, translations, lang) {
  const modalRoot = document.getElementById('modal-root');
  const serviceData = translations.services[serviceKey];
  const modalData = serviceData[lang].modal;
  if (!modalData) return;

  const modalBackdrop = document.createElement('div');
  modalBackdrop.className = 'modal-backdrop';
  const modalContent = document.createElement('div');
  modalContent.className = 'ops-modal';
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

  modalBackdrop.appendChild(modalContent);
  modalRoot.appendChild(modalBackdrop);
  updateModalContent(modalContent, translations, lang);

  const askChattiaBtn = document.getElementById('ask-chattia-btn');
  askChattiaBtn.addEventListener('click', e => {
    e.preventDefault();
    alert('Launching Chatbot...');
    close();
  });

  const joinUsBtn = document.getElementById('join-us-btn');
  joinUsBtn.addEventListener('click', e => {
    e.preventDefault();
    alert('Launching Join Us form...');
    close();
  });

  modalContent.querySelector('.close-modal').addEventListener('click', close);
  modalBackdrop.addEventListener('click', e => {
    if (e.target === modalBackdrop) close();
  });

  function close() {
    modalRoot.innerHTML = '';
  }
}

function updateModalContent(modalElement, translations, lang) {
  const elements = modalElement.querySelectorAll('[data-key]');
  elements.forEach(el => {
    const key = el.getAttribute('data-key');
    const translation = translations[lang][key];
    if (translation) el.textContent = translation;
  });
}

export function openContactModal(lang) {
  showModal('contact', lang);
}

export function openJoinModal(lang) {
  showModal('join', lang);
}

function showModal(type, lang) {
  const root = document.getElementById('modal-root');
  root.innerHTML = '';
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.innerHTML = type === 'contact' ? contactModalHTML(lang) : joinModalHTML(lang);
  root.appendChild(backdrop);
  const modal = backdrop.querySelector('.modal-content');

  function close() {
    root.innerHTML = '';
  }

  backdrop.onclick = e => (e.target === backdrop ? close() : 0);
  modal.querySelector('.close-modal').onclick = close;
  const cancelBtn = modal.querySelector('.submit-button.cancel');
  if (cancelBtn) cancelBtn.onclick = close;

  document.addEventListener(
    'keydown',
    function esc(e) {
      if (e.key === 'Escape') {
        close();
        document.removeEventListener('keydown', esc);
      }
    },
    { once: true }
  );
  makeDraggable(modal);
}

function joinModalHTML(lang) {
  return `
  <div class="modal-content" tabindex="-1" role="dialog" aria-modal="true">
    <div class="modal-header">
      <h3>${lang === 'en' ? 'Join Us' : 'Únete a Nosotros'}</h3>
      <button class="close-modal" aria-label="Close">&times;</button>
    </div>
    <form id="join-form">
      <div class="form-row">
        <label for="name">${lang === 'en' ? 'Name' : 'Nombre'}</label>
        <input type="text" id="name" name="name" placeholder="${lang === 'en' ? 'Enter your name' : 'Ingresa tu nombre'}" required />
        <label for="email">${lang === 'en' ? 'Email' : 'Correo Electrónico'}</label>
        <input type="email" id="email" name="email" placeholder="${lang === 'en' ? 'Enter your email' : 'Ingresa tu correo'}" required />
        <label for="phone">${lang === 'en' ? 'Phone' : 'Teléfono'}</label>
        <input type="tel" id="phone" name="phone" placeholder="${lang === 'en' ? 'Enter your phone' : 'Ingresa tu teléfono'}" required />
      </div>
      <div class="form-row">
        <label for="comment">${lang === 'en' ? 'Tell us about yourself' : 'Cuéntanos sobre ti'}</label>
        <textarea id="comment" name="comment" rows="4" placeholder="${lang === 'en' ? 'Tell us about yourself...' : 'Cuéntanos sobre ti...'}"></textarea>
      </div>
      <div class="modal-actions" style="margin-top:1.7em;">
        <button type="button" class="submit-button cancel">${lang === 'en' ? 'Cancel' : 'Cancelar'}</button>
        <button type="submit" class="submit-button" style="background:var(--clr-accent);color:#fff;">${lang === 'en' ? 'Submit' : 'Enviar'}</button>
      </div>
    </form>
  </div>
  `;
}

function contactModalHTML(lang) {
  return `
  <div class="modal-content" tabindex="-1" role="dialog" aria-modal="true">
    <div class="modal-header">
      <h3>${lang === 'en' ? 'Contact Us' : 'Contáctenos'}</h3>
      <button class="close-modal" aria-label="Close">&times;</button>
    </div>
    <form id="contact-form">
      <div class="form-row">
        <label for="contact-name">${lang === 'en' ? 'Name' : 'Nombre'}</label>
        <input type="text" id="contact-name" placeholder="${lang === 'en' ? 'Enter your name' : 'Ingrese su nombre'}" required />
        <label for="contact-email">${lang === 'en' ? 'Email' : 'Correo Electrónico'}</label>
        <input type="email" id="contact-email" placeholder="${lang === 'en' ? 'Enter your email' : 'Ingrese su correo electrónico'}" required />
      </div>
      <div class="form-row">
        <label for="contact-comments">${lang === 'en' ? 'Comments' : 'Comentarios'}</label>
        <textarea id="contact-comments" rows="3" placeholder="${lang === 'en' ? 'Enter your comments' : 'Ingrese sus comentarios'}"></textarea>
      </div>
      <div class="modal-actions" style="margin-top:1.7em;">
        <button type="button" class="submit-button cancel">${lang === 'en' ? 'Cancel' : 'Cancelar'}</button>
        <button type="submit" class="submit-button" style="background:var(--clr-primary);color:#fff;">${lang === 'en' ? 'Send' : 'Enviar'}</button>
      </div>
    </form>
  </div>
  `;
}

export function makeDraggable(elem, dragHandle) {
  let isDown = false,
    startX = 0,
    startY = 0;
  const header = dragHandle || elem;
  header.style.cursor = 'move';
  header.onmousedown = function (e) {
    isDown = true;
    elem.classList.add('dragging');
    startX = e.clientX - (parseInt(elem.style.left) || window.innerWidth / 2);
    startY = e.clientY - (parseInt(elem.style.top) || window.innerHeight / 4);
    document.onmousemove = function (e) {
      if (!isDown) return;
      elem.style.left = `${e.clientX - startX}px`;
      elem.style.top = `${e.clientY - startY}px`;
      elem.style.transform = 'none';
    };
    document.onmouseup = function () {
      isDown = false;
      elem.classList.remove('dragging');
      document.onmousemove = null;
      document.onmouseup = null;
    };
    return false;
  };
}

