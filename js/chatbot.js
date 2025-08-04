import { makeDraggable } from './modal.js';

export function openChatbot(lang, theme, toggleThemeFn) {
  let existing = document.getElementById('chatbot-modal-backdrop');
  if (existing) {
    existing.remove();
    return;
  }
  let c = document.createElement('div');
  c.id = 'chatbot-modal-backdrop';
  c.innerHTML = `
    <div id="chatbot-container" tabindex="-1" role="dialog" aria-modal="true">
      <div id="chatbot-header">
        <span id="title">${lang === 'en' ? 'OPS AI Chatbot' : 'Chatbot OPS AI'}</span>
        <span>
          <span id="chatbot-lang" class="ctrl">${lang === 'en' ? 'ES' : 'EN'}</span>
          &nbsp;|&nbsp;
          <span id="chatbot-theme" class="ctrl">${theme === 'light' ? 'Dark' : 'Light'}</span>
          <button id="chatbot-x" aria-label="Close">×</button>
        </span>
      </div>
      <div id="chat-log" aria-live="polite"></div>
      <div id="chatbot-form-container">
        <form id="chatbot-input-row" autocomplete="off">
          <input id="chatbot-input" type="text" placeholder="${lang === 'en' ? 'Type your message...' : 'Escriba su mensaje...'}" required maxlength="256" />
          <button id="chatbot-send" type="submit" disabled aria-label="Send">
            <i class="fas fa-paper-plane"></i>
          </button>
        </form>
        <label class="human-check">
          <input type="checkbox" id="human-check" />
          <span id="human-label">${lang === 'en' ? 'I am human' : 'Soy humano'}</span>
        </label>
      </div>
    </div>`;
  document.body.appendChild(c);
  let botThemeBtn = c.querySelector('#chatbot-theme');
  let botLangBtn = c.querySelector('#chatbot-lang');
  let chatbotCont = c.querySelector('#chatbot-container');
  c.onclick = e => {
    if (e.target === c) c.remove();
  };
  c.querySelector('#chatbot-x').onclick = () => c.remove();
  document.addEventListener(
    'keydown',
    function esc(e) {
      if (e.key === 'Escape') {
        c.remove();
        document.removeEventListener('keydown', esc);
      }
    },
    { once: true }
  );

  botThemeBtn.onclick = () => {
    toggleThemeFn();
    theme = theme === 'light' ? 'dark' : 'light';
    botThemeBtn.textContent = theme === 'light' ? 'Dark' : 'Light';
  };
  botLangBtn.onclick = () => {
    lang = lang === 'en' ? 'es' : 'en';
    botLangBtn.textContent = lang === 'en' ? 'ES' : 'EN';
    c.querySelector('#title').textContent =
      lang === 'en' ? 'OPS AI Chatbot' : 'Chatbot OPS AI';
    c.querySelector('#chatbot-input').placeholder =
      lang === 'en' ? 'Type your message...' : 'Escriba su mensaje...';
    c.querySelector('#human-label').textContent =
      lang === 'en' ? 'I am human' : 'Soy humano';
  };

  let log = c.querySelector('#chat-log');
  let form = c.querySelector('#chatbot-input-row');
  let input = c.querySelector('#chatbot-input');
  let send = c.querySelector('#chatbot-send');
  let guard = c.querySelector('#human-check');
  guard.onchange = () => (send.disabled = !guard.checked);
  function addMsg(txt, cls) {
    let div = document.createElement('div');
    div.className = 'chat-msg ' + cls;
    div.textContent = txt;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  }
  form.onsubmit = e => {
    e.preventDefault();
    if (!guard.checked) return;
    let msg = input.value.trim();
    if (!msg) return;
    addMsg(msg, 'user');
    input.value = '';
    send.disabled = true;
    addMsg('…', 'bot');
    setTimeout(() => {
      log.lastChild.textContent = lang === 'en' ? 'Simulated reply.' : 'Respuesta simulada.';
      send.disabled = false;
    }, 800);
  };
  makeDraggable(chatbotCont, c.querySelector('#chatbot-header'));
}

