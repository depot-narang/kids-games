// 게임 셸: 화면 전환 + 홈 그리드 + 공용 유틸
const GameShell = (() => {
  const games = [];
  let current = null;

  function registerGame(def) { games.push(def); }

  function boot() {
    const grid = document.getElementById('home-grid');
    games.forEach((def) => {
      const card = document.createElement('button');
      card.className = 'home-card';
      card.style.setProperty('--card-color', def.color);
      card.innerHTML =
        `<span class="card-emoji">${def.emoji}</span>` +
        `<span class="card-name">${def.name}</span>` +
        `<span class="card-desc">${def.desc || ''}</span>`;
      card.addEventListener('click', () => { Sound.ding(); go(def.id); });
      grid.appendChild(card);
    });

    // 새로고침돼도 하던 게임으로 돌아가기
    let last = null;
    try { last = sessionStorage.getItem('kidsgames.screen'); } catch (e) {}
    if (last && last !== 'home' && games.some((g) => g.id === last)) go(last);
  }

  function go(id, params) {
    if (current) {
      try { current.api && current.api.destroy && current.api.destroy(); } catch (e) {}
      current.el.remove();
      current = null;
    }
    try { sessionStorage.setItem('kidsgames.screen', id); } catch (e) {}
    const home = document.getElementById('screen-home');
    home.classList.toggle('active', id === 'home');
    if (id === 'home') return;

    const def = games.find((g) => g.id === id);
    if (!def) return;
    const el = document.createElement('section');
    el.className = 'screen active game-screen';
    el.innerHTML =
      `<header class="game-header" style="--card-color:${def.color}">` +
      `<button class="btn back-btn">🏠</button>` +
      `<h2>${def.emoji} ${def.name}</h2>` +
      `<div class="header-actions"></div>` +
      `</header><div class="game-body"></div>`;
    document.getElementById('app').appendChild(el);
    el.querySelector('.back-btn').addEventListener('click', () => { Sound.pop(); go('home'); });
    const api = def.init(el.querySelector('.game-body'), el.querySelector('.header-actions'), params || {}) || {};
    current = { def, el, api };
  }

  return { registerGame, boot, go };
})();

// localStorage 헬퍼
const Store = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem('kidsgames.' + key);
      return v == null ? fallback : JSON.parse(v);
    } catch (e) { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem('kidsgames.' + key, JSON.stringify(value)); } catch (e) {}
  },
};

// 이모지 이펙트 (하트, 별 등이 위로 떠오르며 사라짐)
function spawnFx(container, x, y, emoji) {
  const fx = document.createElement('div');
  fx.className = 'fx';
  fx.textContent = emoji;
  fx.style.left = x + 'px';
  fx.style.top = y + 'px';
  container.appendChild(fx);
  setTimeout(() => fx.remove(), 1000);
}

function randBetween(a, b) { return a + Math.random() * (b - a); }
function randPick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// 캔버스를 컨테이너 크기에 맞추기 (devicePixelRatio 반영)
function fitCanvas(canvas) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { w: rect.width, h: rect.height, ctx, dpr };
}
