// 🥁 리듬 놀이 — 나타나는 음표 원을 두드리면 동요가 한 음씩 이어져요
GameShell.registerGame({
  id: 'rhythm',
  name: '리듬 놀이',
  emoji: '🥁',
  desc: '두드리면 노래가 돼요',
  color: '#e5d4ff',

  init(body) {
    const SONGS = [
      {
        name: '반짝반짝 작은 별', emoji: '⭐',
        notes: ['C4','C4','G4','G4','A4','A4','G4','F4','F4','E4','E4','D4','D4','C4',
                'G4','G4','F4','F4','E4','E4','D4','G4','G4','F4','F4','E4','E4','D4',
                'C4','C4','G4','G4','A4','A4','G4','F4','F4','E4','E4','D4','D4','C4'],
      },
      {
        name: '나비야', emoji: '🦋',
        notes: ['G4','E4','E4','F4','D4','D4','C4','D4','E4','F4','G4','G4','G4',
                'G4','E4','E4','E4','F4','D4','D4','C4','E4','G4','G4','E4','E4','E4'],
      },
    ];
    const NOTE_COLORS = { C4:'#ff5252', D4:'#ff9800', E4:'#ffd600', F4:'#8bc34a', G4:'#00bcd4', A4:'#7c4dff', B4:'#f06292' };
    let raf = null;
    let timeouts = [];
    let hardMode = false;

    function later(fn, ms) { timeouts.push(setTimeout(fn, ms)); }
    function stopAll() { timeouts.forEach(clearTimeout); timeouts = []; if (raf) cancelAnimationFrame(raf); raf = null; }

    function showSongSelect() {
      stopAll();
      body.innerHTML = `
        <div class="song-select">
          <h3>어떤 노래로 놀까요?</h3>
          <div class="overlay-buttons songs"></div>
          <button class="btn hard-btn">${hardMode ? '💨 움직이는 음표: 켜짐' : '🐢 움직이는 음표: 꺼짐'}</button>
        </div>`;
      const holder = body.querySelector('.songs');
      SONGS.forEach((song) => {
        const btn = document.createElement('button');
        btn.className = 'btn big primary';
        btn.textContent = `${song.emoji} ${song.name}`;
        btn.addEventListener('click', () => { Sound.ding(); startSong(song); });
        holder.appendChild(btn);
      });
      body.querySelector('.hard-btn').addEventListener('click', (e) => {
        hardMode = !hardMode;
        e.target.textContent = hardMode ? '💨 움직이는 음표: 켜짐' : '🐢 움직이는 음표: 꺼짐';
        Sound.blip();
      });
    }

    function startSong(song) {
      stopAll();
      body.innerHTML = `
        <div class="rhythm-wrap">
          <div class="hud"><div class="pill progress-pill">🎵 ${song.name} · 0 / ${song.notes.length}</div></div>
        </div>`;
      const wrap = body.querySelector('.rhythm-wrap');
      const progressPill = body.querySelector('.progress-pill');
      let idx = 0;
      let noteEl = null;
      let drift = null;

      function placeNote() {
        if (idx >= song.notes.length) { finish(song); return; }
        const noteName = song.notes[idx];
        noteEl = document.createElement('div');
        noteEl.className = 'rhythm-note';
        noteEl.textContent = '♪';
        noteEl.style.background = NOTE_COLORS[noteName] || '#ff6f91';
        const rect = wrap.getBoundingClientRect();
        const size = 130;
        let x = randBetween(10, Math.max(11, rect.width - size - 10));
        let y = randBetween(70, Math.max(71, rect.height - size - 20));
        noteEl.style.left = x + 'px';
        noteEl.style.top = y + 'px';
        wrap.appendChild(noteEl);

        if (hardMode) {
          // 목표 지점을 향해 천천히 떠다니기
          let tx = randBetween(10, rect.width - size - 10);
          let ty = randBetween(70, rect.height - size - 20);
          const move = () => {
            if (!noteEl) return;
            const dx = tx - x, dy = ty - y;
            if (Math.abs(dx) + Math.abs(dy) < 6) {
              tx = randBetween(10, rect.width - size - 10);
              ty = randBetween(70, rect.height - size - 20);
            }
            x += dx * 0.012; y += dy * 0.012;
            noteEl.style.left = x + 'px';
            noteEl.style.top = y + 'px';
            drift = requestAnimationFrame(move);
          };
          drift = requestAnimationFrame(move);
        }

        noteEl.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          Sound.note(noteName, 0.45);
          const br = body.getBoundingClientRect();
          spawnFx(body, e.clientX - br.left, e.clientY - br.top, randPick(['⭐', '✨', '🌟', '💖']));
          if (drift) { cancelAnimationFrame(drift); drift = null; }
          noteEl.remove();
          noteEl = null;
          idx++;
          progressPill.textContent = `🎵 ${song.name} · ${idx} / ${song.notes.length}`;
          later(placeNote, 160);
        }, { once: true });
      }

      placeNote();
    }

    function finish(song) {
      Sound.fanfare();
      Reward('🍓', 2, window.innerWidth / 2, window.innerHeight / 2);
      const overlay = document.createElement('div');
      overlay.className = 'overlay';
      overlay.innerHTML = `
        <div class="overlay-card">
          <h3>🎶 노래 완성!</h3>
          <p>${song.emoji} "${song.name}"을 끝까지 연주했어요!</p>
          <div class="overlay-buttons">
            <button class="btn big primary again-btn">🔁 또 하기</button>
            <button class="btn big list-btn">🎵 다른 노래</button>
          </div>
        </div>`;
      body.appendChild(overlay);
      overlay.querySelector('.again-btn').addEventListener('click', () => { Sound.ding(); startSong(song); });
      overlay.querySelector('.list-btn').addEventListener('click', () => { Sound.ding(); showSongSelect(); });
    }

    showSongSelect();

    return { destroy: stopAll };
  },
});
