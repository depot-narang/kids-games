// 🐹 두더지 잡기 — 혼자 하기 / 둘이 대결 (30초)
GameShell.registerGame({
  id: 'mole',
  name: '두더지 잡기',
  emoji: '🐹',
  desc: '뿅! 나오면 콩!',
  color: '#c8f0b8',

  init(body) {
    const GAME_SECONDS = 30;
    // stay: 두더지가 나와있는 시간, gap: 다음 두더지까지 간격 (ms)
    const SPEEDS = [
      { id: 'slow', label: '🐢 느긋느긋', stayMin: 1500, stayMax: 2200, gapMin: 700, gapMax: 1200 },
      { id: 'normal', label: '🐰 보통', stayMin: 1000, stayMax: 1500, gapMin: 500, gapMax: 900 },
      { id: 'fast', label: '🚀 빠름!', stayMin: 600, stayMax: 950, gapMin: 320, gapMax: 620 },
    ];
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
      body.querySelector('.one-btn').addEventListener('click', () => { Sound.ding(); showSpeedSelect(1); });
      body.querySelector('.two-btn').addEventListener('click', () => { Sound.ding(); showSpeedSelect(2); });
    }

    function showSpeedSelect(players) {
      body.innerHTML = `
        <div class="song-select">
          <h3>두더지가 얼마나 빠르게 나올까요?</h3>
          <div class="overlay-buttons speed-buttons"></div>
        </div>`;
      const holder = body.querySelector('.speed-buttons');
      SPEEDS.forEach((sp) => {
        const btn = document.createElement('button');
        btn.className = 'btn big primary';
        btn.textContent = sp.label;
        btn.addEventListener('click', () => { Sound.ding(); startGame(players, sp); });
        holder.appendChild(btn);
      });
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

    function popLoop(board, endTime, speed) {
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
        later(() => {
          if (h.up) { h.up = false; h.mole.classList.remove('up'); }
        }, randBetween(speed.stayMin, speed.stayMax));
      }
      later(() => popLoop(board, endTime, speed), randBetween(speed.gapMin, speed.gapMax));
    }

    function startGame(players, speed) {
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
      boards.forEach((b) => later(() => popLoop(b, endTime, speed), randBetween(300, 800)));

      interval = setInterval(() => {
        const left = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
        timePill.textContent = `⏰ ${left}`;
        if (left <= 0) {
          clearInterval(interval); interval = null;
          finish(players, boards, speed);
        }
      }, 250);
    }

    function finish(players, boards, speed) {
      running = false;
      Sound.fanfare();
      const totalScore = boards.reduce((a, b) => a + b.score, 0);
      Reward('🍓', Math.max(1, Math.floor(totalScore / 4)), window.innerWidth / 2, window.innerHeight / 2);
      let title, msg;
      if (players === 1) {
        const score = boards[0].score;
        const rec = GameScore.record('mole_' + speed.id, score);
        const rk = GameScore.rank('mole_' + speed.id);
        title = `🎉 ${score}점!`;
        msg = `${rec.isNew ? '🏆 새 최고 기록!' : `최고 기록: ${rec.best}점`}` +
          (Player.current() ? `<br>우리 집 ${rk.total > 1 ? GameScore.medal(rk.rank) + ` (${rk.total}명 중)` : '🥇'}` : '');
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
      overlay.querySelector('.again-btn').addEventListener('click', () => { Sound.ding(); startGame(players, speed); });
      overlay.querySelector('.mode-btn').addEventListener('click', () => { Sound.ding(); showModeSelect(); });
    }

    showModeSelect();

    return { destroy: stopAll };
  },
});
