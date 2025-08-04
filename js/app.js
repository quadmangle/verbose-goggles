import {
  translations,
  currentLanguage,
  currentTheme,
  updateContent,
  toggleLanguage,
  updateTheme,
  toggleTheme
} from './translations.js';
import {
  createServiceCards,
  createModal,
  openContactModal,
  openJoinModal
} from './modal.js';
import { openChatbot } from './chatbot.js';

async function loadHTML(url, containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const text = await response.text();
        container.innerHTML = text;
      }
    } catch (err) {
      console.error(`Error fetching HTML from ${url}:`, err);
    }
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await Promise.all([
    loadHTML('_nav.html', 'nav-container'),
    loadHTML('_fabs.html', 'fabs-container')
  ]);

  updateContent();
  updateTheme();

  const renderCards = () =>
    createServiceCards(translations.services, currentLanguage);

  document.getElementById('lang-toggle')?.addEventListener('click', () => {
    toggleLanguage();
    renderCards();
  });
  document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);

  document.getElementById('mobile-lang-toggle')?.addEventListener('click', () => {
    toggleLanguage();
    renderCards();
  });
  document.getElementById('mobile-theme-toggle')?.addEventListener('click', toggleTheme);

  renderCards();

  const cardsContainer = document.getElementById('cards-section');
  if (cardsContainer) {
    cardsContainer.addEventListener('click', event => {
      const card = event.target.closest('.card');
      if (card) {
        const serviceKey = card.getAttribute('data-service-key');
        createModal(serviceKey, translations, currentLanguage);
      }
    });
  }

  const fabChat = document.getElementById('fab-chat');
  if (fabChat) fabChat.onclick = () => openChatbot(currentLanguage, currentTheme, toggleTheme);
  const fabJoin = document.getElementById('fab-join');
  if (fabJoin) fabJoin.onclick = () => openJoinModal(currentLanguage);
  const fabContact = document.getElementById('fab-contact');
  if (fabContact) fabContact.onclick = () => openContactModal(currentLanguage);

  const mobileChatbotBtn = document.getElementById('mobile-chatbot-btn');
  if (mobileChatbotBtn) mobileChatbotBtn.onclick = () => openChatbot(currentLanguage, currentTheme, toggleTheme);

  const servicesToggleBtn = document.getElementById('services-toggle');
  const servicesDropdown = document.getElementById('services-dropdown');
  if (servicesToggleBtn && servicesDropdown) {
    servicesToggleBtn.addEventListener('click', () => {
      const expanded = servicesToggleBtn.getAttribute('aria-expanded') === 'true';
      servicesToggleBtn.setAttribute('aria-expanded', !expanded);
      servicesDropdown.classList.toggle('active');
    });
    document.addEventListener('click', e => {
      if (!servicesToggleBtn.contains(e.target) && !servicesDropdown.contains(e.target)) {
        servicesDropdown.classList.remove('active');
        servicesToggleBtn.setAttribute('aria-expanded', false);
      }
    });
  }
});

