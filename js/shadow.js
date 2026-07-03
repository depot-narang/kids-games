// 🕵️ 그림자 맞추기 — 검은 그림자를 보고 같은 동물을 골라요 (관찰력)
GameShell.registerGame({
  id: 'shadow', name: '그림자 맞추기', emoji: '🕵️', desc: '그림자 보고 찾기', color: '#e5d4ff', section: 'game',
  init(body) {
    const ANIMALS = ['bunny', 'cat', 'dog', 'bird', 'duck', 'turtle', 'fish', 'bee', 'butterfly'];
    body.innerHTML = `
      <div class="hud"><div class="pill s">⭐ 0</div><div class="pill l">❤️❤️❤️</div></div>
      <div style="height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px;padding:16px">
        <div class="shadow-q" style="font-size:20px;color:#7a6a85">누구의 그림자일까요?</div>
        <div class="shadow-box" style="width:clamp(120px,32vw,200px);height:clamp(120px,32vw,200px)"></div>
        <div class="shadow-opts" style="display:flex;gap:14px;flex-wrap:wrap;justify-content:center"></div>
      </div>`;
    const sEl = body.querySelector('.s'), lEl = body.querySelector('.l');
    const box = body.querySelector('.shadow-box'), opts = body.querySelector('.shadow-opts');
    let score = 0, lives = 3, running = true;
    const timers = [];
    function updateHud() { sEl.textContent = `⭐ ${score}`; lEl.textContent = '❤️'.repeat(lives) + '🤍'.repeat(3 - lives); }

    function round() {
      if (!running) return;
      const pool = [...ANIMALS].sort(() => Math.random() - 0.5);
      const nOpt = score >= 6 ? 4 : 3;
      const choices = pool.slice(0, nOpt);
      const answer = randPick(choices);
      box.innerHTML = `<div style="width:100%;height:100%;filter:brightness(0) opacity(.8)">${Cartoon.item(answer)}</div>`;
      opts.innerHTML = '';
      choices.forEach((a) => {
        const b = document.createElement('button');
        b.style.cssText = 'width:clamp(80px,20vw,120px);height:clamp(80px,20vw,120px);border:none;border-radius:20px;background:#fff;cursor:pointer;box-shadow:0 4px 0 rgba(0,0,0,.14);padding:8px';
        b.innerHTML = Cartoon.item(a);
        b.addEventListener('click', () => pick(a, answer));
        opts.appendChild(b);
      });
    }
    function pick(a, answer) {
      if (!running) return;
      if (a === answer) { score++; updateHud(); Sound.ding(); const r = box.getBoundingClientRect(); const br = body.getBoundingClientRect(); spawnFx(body, r.left - br.left + r.width / 2, r.top - br.top + r.height / 2, '⭐'); round(); }
      else { lives--; updateHud(); Sound.buzz(); body.classList.add('shake'); const t = setTimeout(() => body.classList.remove('shake'), 300); timers.push(t); if (lives <= 0) gameOver(); }
    }
    function gameOver() {
      running = false;
      const res = GameScore.finish('shadow', score, { reward: Math.floor(score / 3) + 1 });
      GameScore.showResult(body, { emoji: '🕵️', title: `${score}점!`, statLines: res.lines, reward: res.reward, again: () => { score = 0; lives = 3; updateHud(); round(); } });
    }
    updateHud(); round();
    return { destroy() { running = false; timers.forEach(clearTimeout); } };
  },
});
