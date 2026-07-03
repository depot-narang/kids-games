// 🎨 색깔 짝 찾기 — 나온 색깔 이름에 맞는 색을 재빨리 눌러요 (색·순발력)
GameShell.registerGame({
  id: 'colormatch', name: '색깔 짝 찾기', emoji: '🎨', desc: '색 이름 맞추기', color: '#ffe0c2', section: 'game',
  init(body) {
    const COLORS = [
      { n: '빨강', c: '#ff5a5a' }, { n: '노랑', c: '#ffd23f' }, { n: '파랑', c: '#4a90e2' },
      { n: '초록', c: '#5ac85a' }, { n: '보라', c: '#a06cd5' }, { n: '분홍', c: '#ff8fb0' },
      { n: '주황', c: '#ff9f43' }, { n: '갈색', c: '#b07a4a' },
    ];
    body.innerHTML = `
      <div class="hud"><div class="pill s">⭐ 0</div><div class="pill l">❤️❤️❤️</div></div>
      <div style="height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px;padding:16px">
        <div class="target-name" style="font-size:clamp(40px,9vw,72px);font-weight:bold"></div>
        <div class="time-bar" style="width:70%;max-width:360px;height:14px;background:#eee;border-radius:999px;overflow:hidden"><div class="time-fill" style="height:100%;width:100%;background:#7cc95a"></div></div>
        <div class="color-grid" style="display:grid;grid-template-columns:repeat(2,1fr);gap:16px"></div>
      </div>`;
    const sEl = body.querySelector('.s'), lEl = body.querySelector('.l');
    const nameEl = body.querySelector('.target-name'), fill = body.querySelector('.time-fill');
    const grid = body.querySelector('.color-grid');
    let score = 0, lives = 3, running = true, target = null, timer = null, raf = null, tStart = 0, tLimit = 0;
    const timers = [];

    function updateHud() { sEl.textContent = `⭐ ${score}`; lEl.textContent = '❤️'.repeat(lives) + '🤍'.repeat(3 - lives); }
    function round() {
      if (!running) return;
      const pool = [...COLORS].sort(() => Math.random() - 0.5);
      const opts = pool.slice(0, 4);
      target = opts[Math.floor(Math.random() * opts.length)];
      nameEl.textContent = target.n; nameEl.style.color = target.c;
      grid.innerHTML = '';
      opts.forEach((o) => {
        const b = document.createElement('button');
        b.style.cssText = `width:clamp(96px,22vw,140px);height:clamp(96px,22vw,140px);border:none;border-radius:24px;background:${o.c};cursor:pointer;box-shadow:0 5px 0 rgba(0,0,0,.18)`;
        b.addEventListener('pointerdown', (e) => { e.preventDefault(); pick(o); });
        grid.appendChild(b);
      });
      tLimit = Math.max(1100, 3200 - score * 90); tStart = performance.now();
      cancelAnimationFrame(raf); raf = requestAnimationFrame(tick);
    }
    function tick(now) {
      if (!running) return;
      const left = 1 - (now - tStart) / tLimit;
      fill.style.width = Math.max(0, left * 100) + '%';
      fill.style.background = left > 0.4 ? '#7cc95a' : '#ff6f91';
      if (left <= 0) { wrong(); return; }
      raf = requestAnimationFrame(tick);
    }
    function pick(o) {
      if (!running) return;
      if (o.n === target.n) { score++; updateHud(); Sound.ding(); cancelAnimationFrame(raf); round(); }
      else wrong();
    }
    function wrong() {
      cancelAnimationFrame(raf);
      lives--; updateHud(); Sound.buzz();
      body.classList.add('shake'); const t = setTimeout(() => body.classList.remove('shake'), 300); timers.push(t);
      if (lives <= 0) gameOver(); else round();
    }
    function gameOver() {
      running = false;
      const res = GameScore.finish('colormatch', score, { reward: Math.floor(score / 4) + 1 });
      GameScore.showResult(body, { emoji: '🎨', title: `${score}점!`, statLines: res.lines, reward: res.reward, again: () => { score = 0; lives = 3; updateHud(); round(); } });
    }
    updateHud(); round();
    return { destroy() { running = false; cancelAnimationFrame(raf); timers.forEach(clearTimeout); } };
  },
});
