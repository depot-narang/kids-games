// 🃏 카드 짝맞추기 — 같은 그림 카드 찾기 (난이도 3단계)
GameShell.registerGame({
  id: 'memory',
  name: '카드 짝맞추기',
  emoji: '🃏',
  desc: '같은 그림을 찾아요',
  color: '#cdeafe',

  init(body) {
    const EMOJIS = ['🐶', '🐱', '🦊', '🐼', '🐸', '🦁', '🐷', '🐵', '🦄', '🐙', '🐢', '🦋'];
    const LEVELS = [
      { label: '쉬워요 (동생)', pairs: 4, cols: 4 },
      { label: '보통이에요', pairs: 6, cols: 4 },
      { label: '어려워요 (언니)', pairs: 8, cols: 4 },
    ];

    let first = null;
    let lock = false;
    let matched = 0;
    let level = null;
    let timeouts = [];

    function later(fn, ms) { timeouts.push(setTimeout(fn, ms)); }

    function showLevelSelect() {
      body.innerHTML = `
        <div class="song-select">
          <h3>몇 장으로 할까요?</h3>
          <div class="overlay-buttons level-buttons"></div>
        </div>`;
      const holder = body.querySelector('.level-buttons');
      LEVELS.forEach((lv) => {
        const btn = document.createElement('button');
        btn.className = 'btn big primary';
        btn.textContent = lv.label;
        btn.addEventListener('click', () => { Sound.ding(); startGame(lv); });
        holder.appendChild(btn);
      });
    }

    function startGame(lv) {
      level = lv;
      first = null; lock = false; matched = 0;
      const picks = [...EMOJIS].sort(() => Math.random() - 0.5).slice(0, lv.pairs);
      const deck = [...picks, ...picks].sort(() => Math.random() - 0.5);
      const rows = Math.ceil(deck.length / lv.cols);

      body.innerHTML = `
        <div class="memory-wrap">
          <div class="pill try-pill">🐾 뒤집은 횟수: 0</div>
          <div class="memory-grid" style="grid-template-columns:repeat(${lv.cols},1fr);grid-template-rows:repeat(${rows},1fr)"></div>
        </div>`;
      const grid = body.querySelector('.memory-grid');
      const tryPill = body.querySelector('.try-pill');
      let tries = 0;

      deck.forEach((emoji) => {
        const card = document.createElement('button');
        card.className = 'mcard';
        card.innerHTML = `<div class="mcard-inner">
            <div class="mcard-face mcard-back">❓</div>
            <div class="mcard-face mcard-front">${emoji}</div>
          </div>`;
        card.addEventListener('click', () => {
          if (lock || card.classList.contains('flipped')) return;
          Sound.blip();
          card.classList.add('flipped');
          if (!first) { first = card; return; }

          tries++;
          tryPill.textContent = `🐾 뒤집은 횟수: ${tries}`;
          const a = first; first = null;

          if (a.querySelector('.mcard-front').textContent === emoji) {
            a.classList.add('matched');
            card.classList.add('matched');
            matched++;
            Sound.heart();
            const r = card.getBoundingClientRect();
            const br = body.getBoundingClientRect();
            spawnFx(body, r.left - br.left + r.width / 2, r.top - br.top, '✨');
            if (matched === level.pairs) later(() => finish(tries), 700);
          } else {
            lock = true;
            later(() => {
              a.classList.remove('flipped');
              card.classList.remove('flipped');
              lock = false;
            }, 900);
          }
        });
        grid.appendChild(card);
      });
    }

    function finish(tries) {
      Sound.fanfare();
      const overlay = document.createElement('div');
      overlay.className = 'overlay';
      overlay.innerHTML = `
        <div class="overlay-card">
          <h3>🎉 참 잘했어요!</h3>
          <p>${tries}번 만에 다 찾았어요!</p>
          <div class="overlay-buttons">
            <button class="btn big primary again-btn">🔁 또 하기</button>
            <button class="btn big level-btn">📚 난이도 바꾸기</button>
          </div>
        </div>`;
      body.appendChild(overlay);
      overlay.querySelector('.again-btn').addEventListener('click', () => { Sound.ding(); startGame(level); });
      overlay.querySelector('.level-btn').addEventListener('click', () => { Sound.ding(); showLevelSelect(); });
    }

    showLevelSelect();

    return {
      destroy() { timeouts.forEach(clearTimeout); },
    };
  },
});
