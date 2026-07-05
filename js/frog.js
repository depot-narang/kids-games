// 🐸 개구리 점프 — 빛나는 연잎을 톡 누르면 개구리가 폴짝! (반응 속도)
GameShell.registerGame({
  id: 'frog', name: '개구리 점프', emoji: '🐸', desc: '연잎 톡톡 점프', color: '#bfe8c8', section: 'game',
  init(body) {
    const LILY = `<svg viewBox="0 0 100 100"><circle cx="50" cy="52" r="42" fill="#7cc95a" stroke="#4f8a3a" stroke-width="4"/><path d="M50,52 L92,46 L86,64 Z" fill="#5aa54a"/></svg>`;
    const FROG = `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="64" rx="32" ry="24" fill="#6bbd56" stroke="#3f7a30" stroke-width="4"/><circle cx="34" cy="36" r="13" fill="#7cc95a" stroke="#3f7a30" stroke-width="4"/><circle cx="66" cy="36" r="13" fill="#7cc95a" stroke="#3f7a30" stroke-width="4"/><circle cx="34" cy="37" r="4.5" fill="#333"/><circle cx="66" cy="37" r="4.5" fill="#333"/><path d="M38,66 Q50,76 62,66" fill="none" stroke="#3a6a2a" stroke-width="4" stroke-linecap="round"/></svg>`;
    body.innerHTML = `<div class="hud"><div class="pill s">⭐ 0</div><div class="pill l">❤️❤️❤️</div></div>
      <div class="frog-pond" style="position:absolute;inset:0;background:linear-gradient(#8fd0ef,#5aa9e0);overflow:hidden"></div>`;
    const pond = body.querySelector('.frog-pond');
    const sEl = body.querySelector('.s'), lEl = body.querySelector('.l');
    let score = 0, lives = 3, running = true, timer = null, curPad = null, frog = null, nextPad = null;
    const timers = [];
    function later(fn, ms) { const t = setTimeout(fn, ms); timers.push(t); return t; }

    function pad(x, y, glow) {
      const el = document.createElement('div');
      el.style.cssText = `position:absolute;width:88px;height:88px;left:${x}%;top:${y}%;transform:translate(-50%,-50%);cursor:pointer`;
      el.innerHTML = LILY;
      if (glow) el.style.filter = 'drop-shadow(0 0 10px #fff)';
      pond.appendChild(el);
      return el;
    }
    function rndPos() { return [randBetween(16, 84), randBetween(24, 82)]; }

    function start() {
      pond.innerHTML = ''; score = 0; lives = 3; running = true; updateHud();
      const [x, y] = [50, 78];
      curPad = pad(x, y, false);
      frog = document.createElement('div');
      frog.style.cssText = `position:absolute;width:70px;height:70px;left:${x}%;top:${y}%;transform:translate(-50%,-62%);transition:left .18s,top .18s;pointer-events:none;z-index:5`;
      frog.innerHTML = FROG;
      pond.appendChild(frog);
      spawnNext();
    }
    function updateHud() { sEl.textContent = `⭐ ${score}`; lEl.textContent = '❤️'.repeat(lives) + '🤍'.repeat(3 - lives); }

    function spawnNext() {
      if (!running) return;
      const [x, y] = rndPos();
      const el = pad(x, y, true);
      nextPad = el;
      const hasFly = score >= 5 && Math.random() < 0.25;
      if (hasFly) { const f = document.createElement('div'); f.textContent = '🪰'; f.style.cssText = 'position:absolute;top:-6px;right:-4px;font-size:22px'; el.appendChild(f); }
      const limit = Math.max(650, 1700 - score * 45);
      timer = later(() => miss(), limit);
      el.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        if (!running || nextPad !== el) return; // 이미 눌린 연잎/중복 터치 무시
        clearTimeout(timer);
        Sound.blip();
        score += hasFly ? 2 : 1; updateHud();
        frog.style.left = x + '%'; frog.style.top = y + '%';
        const br = body.getBoundingClientRect(); const r = el.getBoundingClientRect();
        spawnFx(body, r.left - br.left + r.width / 2, r.top - br.top, hasFly ? '⭐' : '💦');
        if (curPad) curPad.remove();
        curPad = el; el.style.filter = ''; nextPad = null;
        later(spawnNext, 120);
      });
    }
    function miss() {
      if (!running) return;
      lives--; updateHud(); Sound.buzz();
      body.classList.add('shake'); later(() => body.classList.remove('shake'), 300);
      if (nextPad) { nextPad.remove(); nextPad = null; }
      if (lives <= 0) gameOver(); else later(spawnNext, 300);
    }
    function gameOver() {
      running = false;
      const res = GameScore.finish('frog', score, { reward: Math.floor(score / 4) + 1 });
      GameScore.showResult(body, { emoji: '🐸', title: `${score}점!`, statLines: res.lines, reward: res.reward, again: start });
    }
    start();
    return { destroy() { running = false; timers.forEach(clearTimeout); } };
  },
});
