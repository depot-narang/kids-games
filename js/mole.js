// 🐹 두더지 잡기 — 혼자 하기 / 둘이 대결 (30초)
GameShell.registerGame({
  id: 'mole',
  name: '두더지 잡기',
  emoji: '🐹',
  desc: '뿅! 나오면 콩!',
  color: '#c8f0b8',

  init(body) {
    const GAME_SECONDS = 30;
    let timeouts = [];
    let interval = null;
    let running = false;

    function later(fn, ms) { const t = setTimeout(fn, ms); timeouts.push(t); return t; }
    function stopAll() {
      timeouts.forEach(clearTimeout); timeouts = [];
      if (interval) { clearInterval(interval); interval = null; }
      running = false;
    }

    function showModeSelect() {
      stopAll();
      body.innerHTML = `
        <div class="song-select">
          <h3>어떻게 놀까요?</h3>
          <div class="overlay-buttons">
            <button class="btn big primary one-btn">🐹 혼자 하기</button>
            <button class="btn big primary two-btn">🍓 vs 🍇 둘이 대결!</button>
          </div>
        </div>`;
      body.querySelector('.one-btn').addEventListener('click', () => { Sound.ding(); startGame(1); });
      body.querySelector('.two-btn').addEventListener('click', () => { Sound.ding(); startGame(2); });
    }

    function makeBoard(rows, cols, label) {
      const board = { score: 0, holes: [], label };
      const wrap = document.createElement('div');
      wrap.style.display = 'flex';
      wrap.style.flexDirection = 'column';
      wrap.style.flex = '1';
      wrap.style.maxWidth = '520px';
      wrap.style.gap = '6px';
      wrap.innerHTML = `<div class="mole-board-label pill">${label} : <b class="board-score">0</b>점</div>`;
      const grid = document.createElement('div');
      grid.className = 'mole-board';
      grid.style.gridTemplateColumns = `repeat(${cols},1fr)`;
      grid.style.gridTemplateRows = `repeat(${rows},1fr)`;
      grid.style.flex = '1';
      for (let i = 0; i < rows * cols; i++) {
        const hole = document.createElement('div');
        hole.className = 'hole';
        const mole = document.createElement('div');
        mole.className = 'mole';
        mole.textContent = '🐹';
        hole.appendChild(mole);
        grid.appendChild(hole);
        const h = { mole, up: false, golden: false };
        board.holes.push(h);
        mole.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          if (!running || !h.up) return;
          h.up = false;
          board.score += h.golden ? 3 : 1;
          wrap.querySelector('.board-score').textContent = board.score;
          Sound.bonk();
          mole.classList.add('bonked');
          const r = mole.getBoundingClientRect();
          const br = body.getBoundingClientRect();
          spawnFx(body, r.left - br.left + r.width / 2, r.top - br.top, h.golden ? '🌟' : '💥');
          later(() => { mole.classList.remove('bonked'); mole.classList.remove('up'); }, 110);
        });
      }
      wrap.appendChild(grid);
      board.el = wrap;
      return board;
    }

    function popLoop(board, endTime) {
      if (!running) return;
      const now = Date.now();
      if (now >= endTime) return;
      const idle = board.holes.filter((h) => !h.up);
      if (idle.length) {
        const h = randPick(idle);
        h.up = true;
        h.golden = Math.random() < 0.12;
        h.mole.textContent = h.golden ? '👑🐹' : '🐹';
        h.mole.classList.add('up');
        Sound.blip();
        const stayMs = randBetween(650, 1100) * Math.max(0.55, (endTime - now) / (GAME_SECONDS * 1000) * 0.6 + 0.4);
        later(() => {
          if (h.up) { h.up = false; h.mole.classList.remove('up'); }
        }, stayMs);
      }
      later(() => popLoop(board, endTime), randBetween(380, 750));
    }

    function startGame(players) {
      stopAll();
      running = true;
      body.innerHTML = `
        <div class="mole-wrap">
          <div class="pill time-pill">⏰ ${GAME_SECONDS}</div>
          <div class="mole-boards"></div>
        </div>`;
      const boardsHolder = body.querySelector('.mole-boards');
      const timePill = body.querySelector('.time-pill');

      const boards = players === 1
        ? [makeBoard(3, 3, '내 점수')]
        : [makeBoard(3, 2, '🍓 딸기팀'), makeBoard(3, 2, '🍇 포도팀')];
      boards.forEach((b) => boardsHolder.appendChild(b.el));

      const endTime = Date.now() + GAME_SECONDS * 1000;
      boards.forEach((b) => later(() => popLoop(b, endTime), randBetween(300, 800)));

      interval = setInterval(() => {
        const left = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
        timePill.textContent = `⏰ ${left}`;
        if (left <= 0) {
          clearInterval(interval); interval = null;
          finish(players, boards);
        }
      }, 250);
    }

    function finish(players, boards) {
      running = false;
      Sound.fanfare();
      let title, msg;
      if (players === 1) {
        const best = Store.get('mole.best', 0);
        const score = boards[0].score;
        if (score > best) Store.set('mole.best', score);
        title = '🎉 끝!';
        msg = `${score}점! ${score > best ? '최고 기록이에요! 🏆' : `최고 기록: ${Math.max(best, score)}점`}`;
      } else {
        const [a, b] = boards;
        title = a.score === b.score ? '🤝 비겼어요!' : (a.score > b.score ? '🍓 딸기팀 승리!' : '🍇 포도팀 승리!');
        msg = `🍓 ${a.score}점  vs  🍇 ${b.score}점`;
      }
      const overlay = document.createElement('div');
      overlay.className = 'overlay';
      overlay.innerHTML = `
        <div class="overlay-card">
          <h3>${title}</h3>
          <p>${msg}</p>
          <div class="overlay-buttons">
            <button class="btn big primary again-btn">🔁 또 하기</button>
            <button class="btn big mode-btn">👭 방법 바꾸기</button>
          </div>
        </div>`;
      body.appendChild(overlay);
      overlay.querySelector('.again-btn').addEventListener('click', () => { Sound.ding(); startGame(players); });
      overlay.querySelector('.mode-btn').addEventListener('click', () => { Sound.ding(); showModeSelect(); });
    }

    showModeSelect();

    return { destroy: stopAll };
  },
});
