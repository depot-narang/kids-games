// 🔢 몇 개일까? — 화면에 나온 개수를 세어 숫자를 골라요 (수 세기 학습)
GameShell.registerGame({
  id: 'counting', name: '몇 개일까?', emoji: '🔢', desc: '개수 세기', color: '#cdeafe', section: 'game',
  init(body) {
    const ITEMS = ['star', 'balloon', 'cake', 'gift', 'mushroom', 'fish', 'bunny', 'duck'];
    body.innerHTML = `
      <div class="hud"><div class="pill s">⭐ 0</div><div class="pill l">❤️❤️❤️</div></div>
      <div style="height:100%;display:flex;flex-direction:column">
        <div class="count-stage" style="flex:1;position:relative;margin:10px;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,.12)"></div>
        <div class="count-q" style="text-align:center;font-size:22px;margin:2px">몇 개일까요?</div>
        <div class="count-opts" style="display:flex;gap:14px;justify-content:center;padding:10px 10px 16px"></div>
      </div>`;
    const sEl = body.querySelector('.s'), lEl = body.querySelector('.l');
    const stage = body.querySelector('.count-stage'), opts = body.querySelector('.count-opts');
    let score = 0, lives = 3, running = true;
    const timers = [];
    function updateHud() { sEl.textContent = `⭐ ${score}`; lEl.textContent = '❤️'.repeat(lives) + '🤍'.repeat(3 - lives); }

    function round() {
      if (!running) return;
      const maxN = Math.min(12, 3 + Math.floor(score / 2));
      const n = 1 + Math.floor(Math.random() * maxN);
      const item = randPick(ITEMS);
      stage.innerHTML = '';
      const rect = stage.getBoundingClientRect();
      const placed = [];
      for (let i = 0; i < n; i++) {
        let x, y, tries = 0;
        do { x = randBetween(10, 82); y = randBetween(10, 82); tries++; }
        while (tries < 20 && placed.some((p) => Math.abs(p.x - x) < 14 && Math.abs(p.y - y) < 16));
        placed.push({ x, y });
        const el = document.createElement('div');
        el.style.cssText = `position:absolute;left:${x}%;top:${y}%;width:clamp(38px,9vw,64px)`;
        el.innerHTML = Cartoon.item(item);
        stage.appendChild(el);
      }
      // 보기: 정답 + 근처 숫자 2개
      const set = new Set([n]);
      while (set.size < 3) { const d = n + (Math.floor(Math.random() * 5) - 2); if (d >= 1 && d <= 15) set.add(d); }
      const choices = [...set].sort(() => Math.random() - 0.5);
      opts.innerHTML = '';
      choices.forEach((c) => {
        const b = document.createElement('button');
        b.className = 'btn big'; b.textContent = c;
        b.style.cssText += 'width:76px;height:76px;font-size:34px';
        b.addEventListener('click', () => pick(c, n));
        opts.appendChild(b);
      });
    }
    function pick(c, n) {
      if (!running) return;
      if (c === n) { score++; updateHud(); Sound.ding(); round(); }
      else { lives--; updateHud(); Sound.buzz(); body.classList.add('shake'); const t = setTimeout(() => body.classList.remove('shake'), 300); timers.push(t); if (lives <= 0) gameOver(); }
    }
    function gameOver() {
      running = false;
      const res = GameScore.finish('counting', score, { reward: Math.floor(score / 3) + 1 });
      GameScore.showResult(body, { emoji: '🔢', title: `${score}점!`, statLines: res.lines, reward: res.reward, again: () => { score = 0; lives = 3; updateHud(); round(); } });
    }
    updateHud(); setTimeout(round, 50);
    return { destroy() { running = false; timers.forEach(clearTimeout); } };
  },
});
