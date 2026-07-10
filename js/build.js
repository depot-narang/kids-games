// 🧩 글자 만들기 — 자음·모음 조각을 제자리에 끌어다 놓아 단어를 완성해요 (소리로 배우기)
GameShell.registerGame({
  id: 'learn-build', section: 'learn', name: '글자 만들기', emoji: '🧩', color: '#d6f0d0', desc: '자음·모음 맞추기',
  init(body, actions) {
    const WORDS = [
      ['오이', '🥒'], ['아이', '🧒'], ['여우', '🦊'], ['오리', '🦆'], ['우유', '🥛'], ['나비', '🦋'], ['아기', '👶'],
      ['나무', '🌳'], ['바다', '🌊'], ['다리', '🦵'], ['머리', '🧑'], ['포도', '🍇'], ['소', '🐮'], ['개', '🐶'],
      ['눈', '👀'], ['곰', '🐻'], ['문', '🚪'], ['별', '⭐'],
    ];
    const CONS = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
    const VOW = ['ㅏ', 'ㅑ', 'ㅓ', 'ㅕ', 'ㅗ', 'ㅛ', 'ㅜ', 'ㅠ', 'ㅡ', 'ㅣ', 'ㅐ', 'ㅔ'];
    const name = Player.current();
    let wIdx = Math.min(Player.progress(name).build || 0, WORDS.length - 1);
    let drag = null, slotEls = [], introTimer = null;

    function setFruits() {
      if (!name) { actions.innerHTML = ''; return; }
      actions.innerHTML = `<div class="pill">🍓 ${Player.totalFruits(name)}</div>`;
    }
    const slotAt = (x, y) => slotEls.find((el) => { const r = el.getBoundingClientRect(); return x >= r.left - 10 && x <= r.right + 10 && y >= r.top - 10 && y <= r.bottom + 10; });

    function render() {
      setFruits();
      const [word, emoji] = WORDS[wIdx];
      const chars = [...word];
      body.innerHTML = `<div class="hangul-center build-wrap">
        <div class="build-emoji">${emoji}</div>
        <div class="build-word">${word}</div>
        <button class="btn listen">🔊 들어보기</button>
        <div class="build-cells"></div>
        <div class="build-pool"></div>
      </div>`;
      const cellsEl = body.querySelector('.build-cells');
      slotEls = [];
      const syllables = chars.map((ch, ci) => {
        const slots = HangulData.jamoSlots(ch) || [];
        const cell = document.createElement('div'); cell.className = 'build-cell';
        slots.forEach((s) => {
          const el = document.createElement('div'); el.className = 'build-slot';
          el.style.left = s.c[0] + '%'; el.style.top = s.c[1] + '%';
          el.textContent = s.jamo; el.dataset.need = s.jamo; el.dataset.ci = ci;
          cell.appendChild(el); slotEls.push(el);
        });
        cellsEl.appendChild(cell);
        return { ch, cell, total: slots.length, filled: 0 };
      });
      // 조각 주머니: 필요한 자모 + 방해 자모 몇 개
      const need = []; chars.forEach((ch) => (HangulData.jamoSlots(ch) || []).forEach((s) => need.push(s.jamo)));
      const distract = [];
      while (distract.length < 4) { const j = randPick(Math.random() < 0.5 ? CONS : VOW); if (!need.includes(j) && !distract.includes(j)) distract.push(j); }
      const pool = [...need, ...distract].sort(() => Math.random() - 0.5);
      const poolEl = body.querySelector('.build-pool');
      pool.forEach((j) => { const t = document.createElement('button'); t.className = 'jamo-tile'; t.textContent = j; t.dataset.jamo = j; addTile(t, syllables); poolEl.appendChild(t); });
      body.querySelector('.listen').addEventListener('click', () => speakKo(word));
      // 그림·글자를 먼저 눈으로 볼 시간을 주고 나서 단어를 읽어줘요
      clearTimeout(introTimer);
      introTimer = setTimeout(() => speakKo(word), 1300);
    }

    function addTile(tile, syllables) {
      const j = tile.dataset.jamo;
      tile.addEventListener('pointerdown', (e) => { e.preventDefault(); drag = { tile, sx: e.clientX, sy: e.clientY, moved: false }; try { tile.setPointerCapture(e.pointerId); } catch (_) {} tile.style.zIndex = 1000; });
      tile.addEventListener('pointermove', (e) => { if (!drag || drag.tile !== tile) return; const dx = e.clientX - drag.sx, dy = e.clientY - drag.sy; if (Math.hypot(dx, dy) > 6) drag.moved = true; tile.style.transform = `translate(${dx}px,${dy}px)`; });
      const end = (e) => {
        if (!drag || drag.tile !== tile) return;
        tile.style.zIndex = ''; tile.style.transform = '';
        const moved = drag.moved; drag = null;
        if (!moved) { speakKo(HangulData.soundOf(j)); return; } // 그냥 누르면 소리만
        const slot = slotAt(e.clientX, e.clientY);
        if (slot && !slot.dataset.filled && slot.dataset.need === j) fill(slot, tile, j, syllables);
        else Sound.buzz();
      };
      tile.addEventListener('pointerup', end);
      tile.addEventListener('pointercancel', () => { if (drag && drag.tile === tile) { tile.style.zIndex = ''; tile.style.transform = ''; drag = null; } });
    }

    function fill(slot, tile, j, syllables) {
      slot.dataset.filled = '1'; slot.classList.add('filled'); Sound.blip(); speakKo(HangulData.soundOf(j)); tile.remove();
      const br = body.getBoundingClientRect(); const r = slot.getBoundingClientRect();
      spawnFx(body, r.left - br.left + r.width / 2, r.top - br.top, '⭐');
      slot.addEventListener('pointerdown', (e) => { e.preventDefault(); speakKo(HangulData.soundOf(j)); });
      const syl = syllables[+slot.dataset.ci]; syl.filled++;
      if (syl.filled >= syl.total) {
        syl.cell.classList.add('done'); syl.cell.innerHTML = `<span class="cell-syl">${syl.ch}</span>`;
        // 자모 소리(방금)와 겹치지 않게 잠깐 쉬었다가 음절 소리
        setTimeout(() => speakKo(syl.ch), 750);
        syl.cell.addEventListener('pointerdown', (e) => { e.preventDefault(); speakKo(syl.ch); });
        // 음절 소리가 끝난 뒤 단어 소리 (충분한 간격)
        if (syllables.every((s) => s.filled >= s.total)) setTimeout(() => wordDone(), 1800);
      }
    }

    function wordDone() {
      const [word, emoji] = WORDS[wIdx];
      Sound.fanfare(); speakKo(word); Reward('🍓', 2, window.innerWidth / 2, window.innerHeight / 2);
      Player.setProgress(name, 'build', Math.max(Player.progress(name).build || 0, Math.min(wIdx + 1, WORDS.length)));
      setFruits();
      const last = wIdx + 1 >= WORDS.length;
      const overlay = document.createElement('div'); overlay.className = 'overlay';
      overlay.innerHTML = `<div class="overlay-card"><h3>🎉 "${word}" 완성!</h3><p style="font-size:44px">${emoji}</p>
        <div class="overlay-buttons">${last ? '' : '<button class="btn big primary nx">다음 →</button>'}<button class="btn big done">📚 목록으로</button></div></div>`;
      body.appendChild(overlay);
      const nx = overlay.querySelector('.nx'); if (nx) nx.addEventListener('click', () => { Sound.ding(); wIdx++; render(); });
      overlay.querySelector('.done').addEventListener('click', () => { Sound.ding(); GameShell.showSection('learn'); });
    }

    render();
    return { destroy() { clearTimeout(introTimer); try { speechSynthesis.cancel(); } catch (e) {} } };
  },
});
