(function() {
  const btnLang = document.getElementById('btn-lang');
  const btnTheme = document.getElementById('btn-theme');
  const html = document.documentElement;
  const body = document.body;

  // Load saved language and theme from localStorage, with defaults
  let currentLang = localStorage.getItem('lang') || 'en';
  let isDark = localStorage.getItem('theme') === 'true';

  function setLanguage(lang) {
    currentLang = lang;
    html.lang = lang;
    localStorage.setItem('lang', lang);

    // Update title
    const titleTag = document.querySelector('title');
    if (titleTag && titleTag.getAttribute('data-' + lang)) {
      document.title = titleTag.getAttribute('data-' + lang);
    }

    // Update all translatable elements
    document.querySelectorAll('[data-en]').forEach(el => {
      const text = el.getAttribute('data-' + lang);
      if (text === null) return;

      const tagName = el.tagName.toLowerCase();
      if (tagName === 'input' || tagName === 'textarea') {
        el.placeholder = text;
      } else if (tagName === 'img') {
        el.alt = text;
      } else {
        el.textContent = text;
      }
    });

    // Update toggle language button label
    if (btnLang) {
      btnLang.textContent = lang.toUpperCase();
      btnLang.setAttribute('aria-pressed', lang === 'es');
    }
  }

  function toggleLanguage() {
    const newLang = currentLang === 'en' ? 'es' : 'en';
    setLanguage(newLang);
  }

  function setTheme(darkMode) {
    isDark = darkMode;
    localStorage.setItem('theme', darkMode);
    if (darkMode) {
      body.classList.add('dark'); // Assuming 'dark' class enables dark mode
      body.classList.remove('light');
      if (btnTheme) {
        btnTheme.textContent = 'Light Mode';
        btnTheme.setAttribute('aria-pressed', 'true');
      }
    } else {
      body.classList.remove('dark');
      body.classList.add('light'); // Assuming 'light' class or no class for light mode
      if (btnTheme) {
        btnTheme.textContent = 'Dark Mode';
        btnTheme.setAttribute('aria-pressed', 'false');
      }
    }
  }

  function toggleTheme() {
    setTheme(!isDark);
  }

  // Event Listeners
  if (btnLang) {
    btnLang.addEventListener('click', toggleLanguage);
  }
  if (btnTheme) {
    btnTheme.addEventListener('click', toggleTheme);
  }

  // Initialize on page load
  document.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLang);
    setTheme(isDark);
  });

})();
