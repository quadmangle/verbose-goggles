(function() {
  const btnLang = document.getElementById('btn-lang');
  const btnTheme = document.getElementById('btn-theme');
  const html = document.documentElement;
  const body = document.body;

  // Default language and theme
  let currentLang = 'en';
  let isDark = true;

  function setLanguage(lang) {
    currentLang = lang;
    html.lang = lang;
    // Update title
    const titleTag = document.querySelector('title');
    document.title = titleTag.getAttribute('data-' + lang);
    // Update all translatable elements
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
    // Update nav links specifically (for better accessibility)
    document.querySelectorAll('nav a').forEach(a => {
      const text = a.getAttribute('data-' + lang);
      if (text) a.textContent = text;
    });
    // Update toggle language button label
    btnLang.textContent = lang.toUpperCase();
    btnLang.setAttribute('aria-pressed', lang === 'es');
  }

  function toggleLanguage() {
    const newLang = currentLang === 'en' ? 'es' : 'en';
    setLanguage(newLang);
  }

  function setTheme(darkMode) {
    isDark = darkMode;
    if (darkMode) {
      body.classList.remove('light');
      btnTheme.textContent = 'Dark Mode';
      btnTheme.setAttribute('aria-pressed', 'false');
    } else {
      body.classList.add('light');
      btnTheme.textContent = 'Light Mode';
      btnTheme.setAttribute('aria-pressed', 'true');
    }
  }

  function toggleTheme() {
    setTheme(!isDark);
  }

  btnLang.addEventListener('click', toggleLanguage);
  btnTheme.addEventListener('click', toggleTheme);

  // Initialize defaults
  setLanguage(currentLang);
  setTheme(isDark);
})();
