// 🎵 소리 따라하기 — 불빛과 소리 순서를 기억해 똑같이 눌러요 (기억력)
GameShell.registerGame({
  id: 'simon', name: '소리 따라하기', emoji: '🎵', desc: '순서 기억하기', color: '#ffd6e0', section: 'game',
  init(body) {
    const PADS = [
      { c: '#ff6b6b', on: '#ffb3b3', note: 'C4' }, { c: '#4a90e2', on: '#a9cdf5', note: 'E4' },
      { c: '#5ac85a', on: '#b3ecb3', note: 'G4' }, { c: '#ffd23f', on: '#fff0b0', note: 'C5' },
    ];
    body.innerHTML = `
      <div class="hud"><div class="pill s">단계 0</div></div>
      <div style="height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px">
        <div class="simon-msg" style="font-size:22px;height:28px;color:#7a6a85">잘 보세요!</div>
        <div class="simon-grid" style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px;width:min(78vw,360px);aspect-ratio:1"></div>
      </div>`;
    const sEl = body.querySelector('.s'), msg = body.querySelector('.simon-msg');
    const grid = body.querySelector('.simon-grid');
    let seq = [], input = [], round = 0, running = true, accepting = false;
    const timers = [];
    const later = (fn, ms) => { const t = setTimeout(fn, ms); timers.push(t); return t; };

    const els = PADS.map((p, i) => {
      const el = document.createElement('button');
      el.style.cssText = `border:none;border-radius:20px;background:${p.c};cursor:pointer;box-shadow:0 6px 0 rgba(0,0,0,.16);transition:background .1s,transform .06s`;
      el.addEventListener('pointerdown', (e) => { e.preventDefault(); tap(i); });
      grid.appendChild(el); return el;
    });
    function flash(i, ms = 380) {
      els[i].style.background = PADS[i].on; els[i].style.transform = 'scale(.96)';
      Sound.note(PADS[i].note, ms / 1000);
      later(() => { els[i].style.background = PADS[i].c; els[i].style.transform = 'scale(1)'; }, ms - 60);
    }
    function nextRound() {
      if (!running) return;
      round++; sEl.textContent = `단계 ${round}`; input = [];
      seq.push(Math.floor(Math.random() * 4));
      accepting = false; msg.textContent = '잘 보세요! 👀';
      let d = 500;
      seq.forEach((i, k) => { later(() => flash(i), d + k * 620); });
      later(() => { accepting = true; msg.textContent = '이제 따라해요! 👆'; }, d + seq.length * 620);
    }
    function tap(i) {
      if (!running || !accepting) return;
      flash(i, 260);
      input.push(i);
      const k = input.length - 1;
      if (input[k] !== seq[k]) { gameOver(); return; }
      if (input.length === seq.length) { accepting = false; msg.textContent = '좋아요! 🎉'; Sound.yay(); later(nextRound, 900); }
    }
    function gameOver() {
      running = false; accepting = false; Sound.buzz();
      const score = round - 1;
      const res = GameScore.finish('simon', score, { reward: Math.floor(score / 2) + 1 });
      GameScore.showResult(body, { emoji: '🎵', title: `${score}단계까지!`, statLines: res.lines, reward: res.reward, again: () => { seq = []; round = 0; nextRound(); } });
    }
    later(nextRound, 600);
    return { destroy() { running = false; timers.forEach(clearTimeout); } };
  },
});
