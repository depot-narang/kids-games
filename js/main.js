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
      <div class="player-bar">${playerChip()}<button class="voice-btn" aria-label="목소리">🔊</button></div>
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
    home.querySelector('.voice-btn').addEventListener('click', () => { Sound.blip(); showVoiceSettings(); });
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
  chosen() { const n = Store.get('voice.name', null); const list = this.all(); return list.find((v) => v.name === n) || list[0] || null; },
  pitch() { return Store.get('voice.pitch', 1.25); },
  rate() { return Store.get('voice.rate', 0.9); },
};

// 한국어 소리 내어 읽기 (자모/음절/단어)
function speakKo(text, rate) {
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ko-KR';
    const v = VoicePref.chosen(); if (v) u.voice = v;
    u.rate = rate || VoicePref.rate();
    u.pitch = VoicePref.pitch();
    speechSynthesis.cancel(); speechSynthesis.speak(u);
  } catch (e) { try { Sound.ding(); } catch (_) {} }
}

// 목소리 고르기 화면
function showVoiceSettings() {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  function build() {
    const voices = VoicePref.all();
    const curName = (VoicePref.chosen() || {}).name;
    const curPitch = VoicePref.pitch();
    overlay.innerHTML = `<div class="overlay-card"><h3>🔊 목소리 고르기</h3>
      ${voices.length ? '<p style="font-size:16px;color:#8a7d95">목소리를 눌러 들어보세요</p>' : '<p>이 기기에서 한국어 목소리를 못 찾았어요.<br>태블릿 설정 → 손쉬운 사용/음성에서<br>한국어 음성을 켜주세요.</p>'}
      <div class="voice-list"></div>
      <p style="margin-top:8px;font-size:16px;color:#8a7d95">목소리 높낮이</p>
      <div class="overlay-buttons pitch-row">
        <button class="btn ${curPitch >= 1.4 ? 'primary' : ''}" data-p="1.5">🐿️ 아주 귀엽게</button>
        <button class="btn ${curPitch >= 1.1 && curPitch < 1.4 ? 'primary' : ''}" data-p="1.25">🙂 귀엽게</button>
        <button class="btn ${curPitch < 1.1 ? 'primary' : ''}" data-p="1.0">🧑 보통</button>
      </div>
      <div class="overlay-buttons">
        <button class="btn big test">🎤 들어보기</button>
        <button class="btn big primary close">다 됐어요</button>
      </div></div>`;
    const vl = overlay.querySelector('.voice-list');
    voices.forEach((v) => {
      const b = document.createElement('button');
      b.className = 'btn' + (v.name === curName ? ' primary' : '');
      b.textContent = v.name.split('(')[0].replace(/Microsoft|Google|Apple/g, '').trim() || v.name;
      b.addEventListener('click', () => { Store.set('voice.name', v.name); speakKo('안녕! 나는 여우야'); build(); });
      vl.appendChild(b);
    });
    overlay.querySelectorAll('.pitch-row .btn').forEach((b) => b.addEventListener('click', () => { Store.set('voice.pitch', parseFloat(b.dataset.p)); speakKo('가 나 다 라'); build(); }));
    overlay.querySelector('.test').addEventListener('click', () => speakKo('안녕! 오늘도 재미있게 놀자'));
    overlay.querySelector('.close').addEventListener('click', () => { Sound.pop(); try { speechSynthesis.onvoiceschanged = null; } catch (e) {} try { speechSynthesis.cancel(); } catch (e) {} overlay.remove(); });
  }
  build();
  document.getElementById('app').appendChild(overlay);
  try { speechSynthesis.onvoiceschanged = () => build(); } catch (e) {}
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
