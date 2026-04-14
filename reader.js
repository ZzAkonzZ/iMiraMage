
// ── THEME ──
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  document.querySelector('.theme-toggle').textContent = next === 'dark' ? '☀️' : '🌙';
}

// Применяем тему сразу при загрузке (до рендера)
(function() {
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
})();

// ── PROGRESS (для страницы главы) ──
function updateProgress(currentNum) {
  const total = parseInt(localStorage.getItem('totalChapters') || '0');
  if (!total) return;
  const el = document.getElementById('progressInfo');
  if (el) el.textContent = `Глава ${currentNum} / ${total}`;
}

// ── INDEX ──
function initIndex() {
  // Кнопка темы
  const theme = localStorage.getItem('theme') || 'light';
  document.querySelector('.theme-toggle').textContent = theme === 'dark' ? '☀️' : '🌙';

  // Общее кол-во глав в localStorage для прогресса
  const items = document.querySelectorAll('.chapter-item');
  localStorage.setItem('totalChapters', items.length);

  // Последняя прочитанная
  const lastNum = localStorage.getItem('lastChapter');
  const lastTitle = localStorage.getItem('lastChapterTitle');
  if (lastNum && lastTitle) {
    const continueBlock = document.getElementById('continueReading');
    const continueLink  = document.getElementById('continueLink');
    continueBlock.style.display = 'flex';
    continueLink.href = `site_chapters/chapter_${lastNum}.html`;
    continueLink.textContent = `Глава ${lastNum}: ${lastTitle}`;

    // Подсвечиваем в списке
    const lastItem = document.querySelector(`.chapter-item[data-num="${lastNum}"]`);
    if (lastItem) lastItem.classList.add('last-read');
  }

  // Дата обновления
  const el = document.getElementById('lastUpdate');
  const saved = localStorage.getItem('chaptersUpdated');
  if (el && saved) el.textContent = saved;
}

// ── SEARCH ──
function filterChapters() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  document.querySelectorAll('.chapter-item').forEach(item => {
    const text = item.textContent.toLowerCase();
    item.classList.toggle('hidden', !text.includes(query));
  });
}

// ── ОБНОВИТЬ ОГЛАВЛЕНИЕ (читает chapters.json) ──
function refreshChapters() {
  fetch('chapters.json?t=' + Date.now())
    .then(r => r.json())
    .then(data => {
      localStorage.setItem('chaptersUpdated', new Date().toLocaleString('ru-RU'));
      alert(`Оглавление обновлено! Глав: ${data.length}`);
      location.reload();
    })
    .catch(() => alert('Не удалось загрузить chapters.json. Запусти скрипт заново.'));
}
