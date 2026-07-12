// 게임 셸: 학습 / 게임 / 내 정원 3구역 + 화면 전환
const GameShell = (() => {
  const games = [];
  let current = null;

  const SECTIONS = [
    { id: 'learn', name: '학습', emoji: '📚', color: '#cdeafe', desc: '글자와 문장 쓰기', needsPlayer: true },
    { id: 'game', name: '게임', emoji: '🎮', color: '#ffd6e0', desc: '재미있는 놀이들', needsPlayer: true },
    { id: 'garden', name: '내 정원', emoji: '🌷', color: '#d4f0c5', desc: '과일로 꾸며요', needsPlayer: true },
  ];

  function registerGame(def) { def.section = def.section || 'game'; games.push(def); }

  function boot() {
    showHome();
    let last = null;
    try { last = sessionStorage.getItem('kidsgames.screen'); } catch (e) {}
    const def = games.find((g) => g.id === last);
    if (def && def.section === 'game') go(last);
  }

  function clearCurrent() {
    if (current) {
      try { current.api && current.api.destroy && current.api.destroy(); } catch (e) {}
      current.el.remove();
      current = null;
    }
  }

  function playerChip() {
    const p = Player.currentProfile();
    if (!p) return `<button class="player-chip empty">🙂 친구를 골라요 ›</button>`;
    return `<button class="player-chip"><span class="avatar small">${Player.avatarHTML(p)}</span>` +
      `<span>${p.name}</span><span class="chip-fruit">🍓 ${Player.totalFruits(p.name)}</span></button>`;
  }

  function showHome() {
    clearCurrent();
    try { sessionStorage.setItem('kidsgames.screen', 'home'); } catch (e) {}
    const home = document.getElementById('screen-home');
    home.classList.add('active');
    home.innerHTML = `
      <h1 class="home-title">🎠 우리들의 게임나라</h1>
      <div class="player-bar">${playerChip()}</div>
      <div id="section-grid"></div>`;
    const grid = home.querySelector('#section-grid');
    SECTIONS.forEach((s) => {
      const card = document.createElement('button');
      card.className = 'home-card section-card';
      card.style.setProperty('--card-color', s.color);
      card.innerHTML = `<span class="card-emoji">${s.emoji}</span><span class="card-name">${s.name}</span><span class="card-desc">${s.desc}</span>`;
      card.addEventListener('click', () => {
        Sound.ding();
        if (s.id === 'garden') requirePlayer(() => go('garden'));
        else if (s.needsPlayer) requirePlayer(() => showSection(s.id));
        else showSection(s.id);
      });
      grid.appendChild(card);
    });
    home.querySelector('.player-chip').addEventListener('click', () => { Sound.blip(); showPlayers(); });
  }

  function makeScreen(title, color, onBack) {
    clearCurrent();
    document.getElementById('screen-home').classList.remove('active');
    const el = document.createElement('section');
    el.className = 'screen active game-screen';
    el.innerHTML =
      `<header class="game-header" style="--card-color:${color}"><button class="btn back-btn">🏠</button>` +
      `<h2>${title}</h2><div class="header-actions"></div></header><div class="game-body"></div>`;
    document.getElementById('app').appendChild(el);
    el.querySelector('.back-btn').addEventListener('click', () => { Sound.pop(); onBack(); });
    current = { el, api: null };
    return el;
  }

  function requirePlayer(cb) { if (Player.current()) cb(); else showPlayers(cb); }

  function showPlayers(afterCb) {
    const el = makeScreen('👭 친구 고르기', '#ffe1a8', showHome);
    Player.showPicker(el.querySelector('.game-body'), {
      onPick: () => { if (afterCb) afterCb(); else showHome(); },
    });
  }

  function showSection(section) {
    const s = SECTIONS.find((x) => x.id === section);
    const el = makeScreen(`${s.emoji} ${s.name}`, s.color, showHome);
    const body = el.querySelector('.game-body');
    body.classList.add('section-list');
    const grid = document.createElement('div');
    grid.id = 'home-grid';
    body.appendChild(grid);
    games.filter((g) => g.section === section).forEach((def) => {
      const card = document.createElement('button');
      card.className = 'home-card';
      card.style.setProperty('--card-color', def.color);
      card.innerHTML = `<span class="card-emoji">${def.emoji}</span><span class="card-name">${def.name}</span><span class="card-desc">${def.desc || ''}</span>`;
      card.addEventListener('click', () => { Sound.ding(); go(def.id); });
      grid.appendChild(card);
    });
  }

  function go(id, params) {
    const def = games.find((g) => g.id === id);
    if (!def) { showHome(); return; }
    const backTo = (def.section === 'learn' || def.section === 'game') ? () => showSection(def.section) : showHome;
    const el = makeScreen(`${def.emoji} ${def.name}`, def.color, backTo);
    try { sessionStorage.setItem('kidsgames.screen', id); } catch (e) {}
    const api = def.init(el.querySelector('.game-body'), el.querySelector('.header-actions'), params || {}) || {};
    current.def = def; current.api = api;
  }

  return { registerGame, boot, go, showHome, showSection };
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

// 음성(목소리) 설정 — 기기에 설치된 한국어 목소리 + 높낮이/빠르기
const VoicePref = {
  all() { try { return (speechSynthesis.getVoices() || []).filter((v) => (v.lang || '').toLowerCase().replace('_', '-').startsWith('ko')); } catch (e) { return []; } },
  // 재생 잘 되는 한국어 목소리 자동 선택 (오프라인 음성 우선, 유나 우선)
  best() {
    const list = this.all(); if (!list.length) return null;
    const local = list.filter((v) => v.localService);
    const pool = local.length ? local : list;
    return pool.find((v) => /유나|yuna/i.test(v.name)) || pool[0];
  },
  chosen() { const n = Store.get('voice.name', null); return (n && this.all().find((v) => v.name === n)) || this.best(); },
};

// 첫 터치에서 음성엔진 깨우기 (사파리는 사용자 터치 안에서 한 번 speak해야 이후 재생이 풀려요)
let _ttsUnlocked = false;
document.addEventListener('pointerdown', () => {
  try {
    speechSynthesis.getVoices(); speechSynthesis.resume();
    if (!_ttsUnlocked) {
      _ttsUnlocked = true;
      const u = new SpeechSynthesisUtterance('.');
      u.volume = 0; u.rate = 5;
      speechSynthesis.speak(u);
    }
  } catch (e) {}
}, { capture: true });

// 한국어 소리 내어 읽기 — 미리 녹음된 파일(유나 목소리)을 먼저 쓰고, 없으면 브라우저 TTS로 폴백
// on: { start(), fail(reason) } — 재생 성공/실패를 알고 싶을 때 사용
function audioFileOf(text) { return [...text].map((c) => c.codePointAt(0).toString(16)).join('-') + '.m4a'; }
let _audioEl = null;
function speakKo(text, rate, on) {
  const f = audioFileOf(text);
  if (typeof AudioManifest !== 'undefined' && AudioManifest.has(f)) {
    try {
      if (_audioEl) { try { _audioEl.pause(); } catch (e) {} }
      const a = new Audio('sound/yuna/' + f);
      _audioEl = a;
      if (on && on.start) a.addEventListener('playing', () => on.start(), { once: true });
      a.addEventListener('error', () => speakTts(text, rate, on), { once: true });
      a.play().catch(() => speakTts(text, rate, on));
      return;
    } catch (e) {}
  }
  speakTts(text, rate, on);
}

let _ttsCurrent = null; // 재생 중 GC로 끊기는 크롬 버그 방지용 참조
let _ttsTimer = null;
function speakTts(text, rate, on) {
  try {
    const synth = window.speechSynthesis;
    if (!synth) { if (on && on.fail) on.fail('api-none'); return; }
    clearTimeout(_ttsTimer);
    if (synth.speaking || synth.pending) synth.cancel();
    // 크롬 버그 회피: cancel 직후 바로 speak하면 무음으로 굳음 → 다음 틱에 실행
    _ttsTimer = setTimeout(() => {
      const u = new SpeechSynthesisUtterance(text);
      _ttsCurrent = u;
      u.lang = 'ko-KR'; u.volume = 1;
      const v = VoicePref.chosen(); if (v) u.voice = v;
      u.rate = rate || 0.9;
      u.pitch = 1;
      let started = false;
      u.onstart = () => { started = true; if (on && on.start) on.start(); };
      u.onend = () => { if (_ttsCurrent === u) _ttsCurrent = null; };
      u.onerror = (e) => { if (_ttsCurrent === u) _ttsCurrent = null; if (on && on.fail) on.fail(e.error || 'error'); };
      synth.speak(u);
      setTimeout(() => { try { synth.resume(); } catch (e) {} }, 60);
      if (on && on.fail) setTimeout(() => { if (!started) on.fail('timeout'); }, 2000);
    }, 90);
  } catch (e) { if (on && on.fail) on.fail(e.message); }
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
