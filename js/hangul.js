// 📚 학습 — 한글 쓰기 (단어/문장/이름/기록). 획순을 따라 쓰고 과일을 모아요.
(function () {
  const CATEGORIES = [
    { id: 'fruit', name: '과일', emoji: '🍓', words: [
      ['사과', '🍎'], ['포도', '🍇'], ['딸기', '🍓'], ['수박', '🍉'], ['바나나', '🍌'], ['참외', '🍈'], ['감', '🟠'], ['귤', '🍊'], ['복숭아', '🍑'], ['체리', '🍒'], ['키위', '🥝'], ['멜론', '🍈'] ] },
    { id: 'animal', name: '동물', emoji: '🐰', words: [
      ['토끼', '🐰'], ['곰', '🐻'], ['오리', '🦆'], ['사자', '🦁'], ['여우', '🦊'], ['고양이', '🐱'], ['강아지', '🐶'], ['나비', '🦋'], ['호랑이', '🐯'], ['코끼리', '🐘'], ['원숭이', '🐵'], ['기린', '🦒'], ['펭귄', '🐧'], ['돼지', '🐷'] ] },
    { id: 'family', name: '가족', emoji: '👨‍👩‍👧', words: [
      ['엄마', '🤱'], ['아빠', '👨'], ['누나', '👧'], ['형', '👦'], ['동생', '🧒'], ['아기', '👶'], ['할머니', '👵'], ['할아버지', '👴'], ['이모', '👩'], ['삼촌', '🧔'] ] },
    { id: 'nature', name: '자연', emoji: '🌳', words: [
      ['하늘', '☁️'], ['바다', '🌊'], ['나무', '🌳'], ['꽃', '🌸'], ['별', '⭐'], ['해', '☀️'], ['달', '🌙'], ['비', '🌧️'], ['구름', '☁️'], ['산', '⛰️'], ['강', '🏞️'], ['눈', '❄️'], ['무지개', '🌈'], ['바람', '🍃'] ] },
    { id: 'vehicle', name: '탈것', emoji: '🚗', words: [
      ['자동차', '🚗'], ['버스', '🚌'], ['기차', '🚂'], ['배', '⛵'], ['비행기', '✈️'], ['자전거', '🚲'], ['택시', '🚕'], ['트럭', '🚚'], ['헬기', '🚁'], ['로켓', '🚀'], ['오토바이', '🏍️'], ['소방차', '🚒'] ] },
    { id: 'food', name: '음식', emoji: '🍚', words: [
      ['밥', '🍚'], ['국', '🍲'], ['빵', '🍞'], ['김밥', '🍙'], ['라면', '🍜'], ['피자', '🍕'], ['우유', '🥛'], ['사탕', '🍬'], ['과자', '🍪'], ['계란', '🥚'], ['김치', '🥬'], ['치즈', '🧀'], ['아이스크림', '🍦'] ] },
    { id: 'body', name: '몸', emoji: '🧍', words: [
      ['눈', '👁️'], ['코', '👃'], ['입', '👄'], ['귀', '👂'], ['손', '✋'], ['발', '🦶'], ['팔', '💪'], ['다리', '🦵'], ['이', '🦷'], ['머리', '🧠'], ['배', '🫃'], ['무릎', '🦵'] ] },
    { id: 'color', name: '색깔', emoji: '🎨', words: [
      ['빨강', '🔴'], ['노랑', '🟡'], ['파랑', '🔵'], ['초록', '🟢'], ['보라', '🟣'], ['분홍', '🩷'], ['검정', '⚫'], ['하양', '⚪'], ['주황', '🟠'], ['갈색', '🟤'] ] },
    { id: 'school', name: '유치원', emoji: '🎒', words: [
      ['책', '📕'], ['연필', '✏️'], ['가방', '🎒'], ['의자', '🪑'], ['크레용', '🖍️'], ['색종이', '🎨'], ['풀', '🧴'], ['가위', '✂️'], ['지우개', '🧽'], ['공책', '📓'], ['선생님', '🧑‍🏫'] ] },
    { id: 'clothes', name: '옷', emoji: '👕', words: [
      ['모자', '🧢'], ['신발', '👟'], ['양말', '🧦'], ['바지', '👖'], ['치마', '👗'], ['장갑', '🧤'], ['티셔츠', '👕'], ['외투', '🧥'], ['목도리', '🧣'], ['안경', '👓'] ] },
    { id: 'home', name: '집', emoji: '🏠', words: [
      ['문', '🚪'], ['창문', '🪟'], ['침대', '🛏️'], ['식탁', '🍽️'], ['거울', '🪞'], ['시계', '⏰'], ['이불', '🛌'], ['베개', '💤'], ['소파', '🛋️'], ['냉장고', '🧊'], ['전등', '💡'] ] },
    { id: 'bug', name: '곤충', emoji: '🐛', words: [
      ['개미', '🐜'], ['벌', '🐝'], ['나비', '🦋'], ['거미', '🕷️'], ['잠자리', '🪰'], ['메뚜기', '🦗'], ['매미', '🐛'], ['무당벌레', '🐞'], ['달팽이', '🐌'] ] },
    { id: 'sea', name: '바다', emoji: '🐬', words: [
      ['물고기', '🐟'], ['고래', '🐋'], ['문어', '🐙'], ['게', '🦀'], ['새우', '🦐'], ['조개', '🐚'], ['상어', '🦈'], ['거북', '🐢'], ['불가사리', '⭐'], ['돌고래', '🐬'] ] },
  ];
  const SENTENCES = [
    { id: 'easy', name: '쉬운 문장', emoji: '🌟', items: [
      { t: '나비가 날아요', e: '🦋' }, { t: '사과가 맛있어요', e: '🍎' }, { t: '해가 반짝여요', e: '☀️' },
      { t: '꽃이 활짝 폈어요', e: '🌸' }, { t: '{name}{가} 활짝 웃어요', e: '😊' }, { t: '{name}{는} 최고야', e: '🏆' },
      { t: '오리가 헤엄쳐요', e: '🦆' }, { t: '강아지가 뛰어요', e: '🐶' }, { t: '새가 노래해요', e: '🐦' },
      { t: '물고기가 헤엄쳐요', e: '🐟' }, { t: '토끼가 깡충 뛰어요', e: '🐰' }, { t: '별이 반짝반짝', e: '⭐' },
      { t: '바람이 살랑살랑', e: '🍃' }, { t: '눈이 펑펑 와요', e: '❄️' } ] },
    { id: 'greet', name: '인사말', emoji: '🙌', items: [
      { t: '안녕하세요', e: '👋' }, { t: '고맙습니다', e: '🙏' }, { t: '사랑해요', e: '❤️' }, { t: '미안해요', e: '🥺' },
      { t: '잘 자요', e: '😴' }, { t: '반가워요', e: '😊' }, { t: '잘 먹겠습니다', e: '🍚' }, { t: '안녕히 계세요', e: '👋' } ] },
    { id: 'myday', name: '나의 하루', emoji: '🌞', items: [
      { t: '아침에 일어나요', e: '🌅' }, { t: '이를 닦아요', e: '🪥' }, { t: '밥을 먹어요', e: '🍚' },
      { t: '유치원에 가요', e: '🎒' }, { t: '친구와 놀아요', e: '🧸' }, { t: '손을 씻어요', e: '🧼' },
      { t: '{name}{는} 책을 읽어요', e: '📚' }, { t: '잠을 자요', e: '🛏️' } ] },
    { id: 'season', name: '자연과 계절', emoji: '🍃', items: [
      { t: '봄에 꽃이 펴요', e: '🌷' }, { t: '여름에 수영해요', e: '🏊' }, { t: '가을에 낙엽이 져요', e: '🍂' },
      { t: '겨울에 눈이 와요', e: '⛄' }, { t: '비가 내려요', e: '🌧️' }, { t: '무지개가 떴어요', e: '🌈' }, { t: '바다가 파래요', e: '🌊' } ] },
    { id: 'tale', name: '전래·명작 동화', emoji: '📖', items: [
      { t: '흥부가 제비를 도와줘요', e: '🐦' }, { t: '놀부는 심술쟁이', e: '😤' }, { t: '콩쥐가 예뻐요', e: '👧' },
      { t: '토끼와 거북이가 달려요', e: '🐢' }, { t: '신데렐라가 춤을 춰요', e: '👗' }, { t: '백설공주가 잠들어요', e: '🍎' },
      { t: '해님 달님 이야기', e: '🌙' }, { t: '인어공주가 노래해요', e: '🧜' }, { t: '아기 돼지 삼형제', e: '🐷' },
      { t: '빨간 모자가 걸어가요', e: '🧕' }, { t: '피노키오 코가 길어져요', e: '👃' } ] },
  ];
  const FRUITS = ['🍓', '🍎', '🍇', '🍉', '🍑', '🍊'];

  // 한 글자씩 (6세용) — 가나다라마바사아자차카타파하
  const BASIC_SYL = ['가', '나', '다', '라', '마', '바', '사', '아', '자', '차', '카', '타', '파', '하'];
  const BASIC_EMOJI = ['🎒', '🦋', '🍬', '🎵', '🍡', '🍌', '🍎', '👶', '🚗', '🍵', '📷', '🥁', '🧅', '😄'];
  const BASIC_CAT = { id: 'basic', name: '가나다', words: BASIC_SYL.map((s, i) => [s, BASIC_EMOJI[i]]) };

  function josa(name, type) {
    const d = HangulData.decompose(name[name.length - 1]);
    const has = d && d.f !== '';
    return ({ '가': has ? '이' : '가', '는': has ? '은' : '는', '를': has ? '을' : '를', '야': has ? '아' : '야' })[type];
  }
  function applyName(text, name) {
    return text.replace(/\{name\}/g, name).replace(/\{(가|는|를|야)\}/g, (_, t) => josa(name, t));
  }

  function run(body, actions, mode) {
    let raf = null, resizeCleanup = null, readTimer = null;
    let stream = null;

    // 📣 가나다 따라 읽기 — 한 글자씩 자동으로 넘어가며 소리내어 읽어줘요
    function showReadAlong() {
      setHeaderFruits();
      const SYL = BASIC_SYL;
      let idx = 0, playing = true;
      body.innerHTML = `<div class="hangul-center readalong">
        <div class="read-card"></div>
        <div class="read-controls"><button class="btn rp">⬅️</button><button class="btn pp">⏸️</button><button class="btn rn">➡️</button></div>
        <div class="read-progress"></div></div>`;
      const card = body.querySelector('.read-card'), prog = body.querySelector('.read-progress'), pp = body.querySelector('.pp');
      function paint(speak) {
        card.textContent = SYL[idx];
        card.classList.remove('pulse'); void card.offsetWidth; card.classList.add('pulse');
        prog.innerHTML = SYL.map((s, i) => `<span class="${i === idx ? 'cur' : ''}">${s}</span>`).join('');
        if (speak) speakKo(SYL[idx], 0.9);
      }
      function schedule() { clearTimeout(readTimer); if (!playing) return; readTimer = setTimeout(() => { idx = (idx + 1) % SYL.length; paint(true); schedule(); }, 1500); }
      function step(d) { idx = (idx + d + SYL.length) % SYL.length; paint(true); schedule(); }
      body.querySelector('.rp').addEventListener('click', () => { Sound.blip(); step(-1); });
      body.querySelector('.rn').addEventListener('click', () => { Sound.blip(); step(1); });
      pp.addEventListener('click', () => { playing = !playing; pp.textContent = playing ? '⏸️' : '▶️'; if (playing) { paint(true); schedule(); } else clearTimeout(readTimer); });
      paint(true); schedule();
    }

    function speak(text) {
      try { const u = new SpeechSynthesisUtterance(text); u.lang = 'ko-KR'; u.rate = 0.8; speechSynthesis.cancel(); speechSynthesis.speak(u); }
      catch (e) { Sound.ding(); }
    }
    function setHeaderFruits() {
      const name = Player.current();
      if (!name) { actions.innerHTML = ''; return; }
      const b = Player.fruits(name);
      const top = Object.entries(b).sort((a, c) => c[1] - a[1]).slice(0, 3).map(([f, n]) => `${f}${n}`).join(' ') || '🍓0';
      actions.innerHTML = `<div class="pill fruit-basket"><span>${top}</span></div>`;
    }

    // ---- 단어 메뉴 ----
    function showWordMenu() {
      setHeaderFruits();
      const name = Player.current();
      body.innerHTML = `<div class="hangul-center"><h3>어떤 단어를 써볼까?</h3><div class="template-grid cat-grid"></div></div>`;
      const grid = body.querySelector('.cat-grid');
      CATEGORIES.forEach((cat) => {
        const prog = Math.min(Player.progress(name)[cat.id] || 0, cat.words.length);
        const card = document.createElement('button');
        card.className = 'template-card';
        card.innerHTML = `<div style="font-size:44px">${cat.emoji}</div><span>${cat.name}</span><small style="color:#a99;font-size:13px">${prog}/${cat.words.length}</small>`;
        card.addEventListener('click', () => { Sound.ding(); startWordSet(cat, Math.min(prog, cat.words.length - 1), showWordMenu); });
        grid.appendChild(card);
      });
    }

    // ---- 문장 메뉴 ----
    function showSentenceMenu() {
      setHeaderFruits();
      const name = Player.current();
      body.innerHTML = `<div class="hangul-center"><h3>어떤 문장을 써볼까?</h3><div class="overlay-buttons sentence-row"></div></div>`;
      const srow = body.querySelector('.sentence-row');
      SENTENCES.forEach((set) => {
        const prog = Math.min(Player.progress(name)[set.id] || 0, set.items.length);
        const b = document.createElement('button');
        b.className = 'btn big primary';
        b.innerHTML = `${set.emoji} ${set.name} <small style="opacity:.8">${prog}/${set.items.length}</small>`;
        b.addEventListener('click', () => { Sound.ding(); startSentenceSet(set, Math.min(prog, set.items.length - 1), showSentenceMenu); });
        srow.appendChild(b);
      });
    }

    // ---- 기록 달력 ----
    function showRecord() {
      setHeaderFruits();
      const name = Player.current();
      const daily = Player.daily(name);
      const now = new Date(); const year = now.getFullYear(), month = now.getMonth();
      const first = new Date(year, month, 1).getDay(); const days = new Date(year, month + 1, 0).getDate();
      let cells = '', total = 0;
      ['일', '월', '화', '수', '목', '금', '토'].forEach((d) => { cells += `<div class="cal-head">${d}</div>`; });
      for (let i = 0; i < first; i++) cells += `<div></div>`;
      for (let d = 1; d <= days; d++) {
        const cnt = daily[`${year}-${month + 1}-${d}`] || 0; if (cnt) total += cnt;
        cells += `<div class="cal-cell ${cnt ? 'has' : ''}"><div>${d}</div>${cnt ? `<div class="cal-stamp">✏️</div><div>${cnt}자</div>` : ''}</div>`;
      }
      body.innerHTML = `<div class="hangul-center"><h3>📅 ${name}의 ${month + 1}월 기록</h3>
        <div class="pill">이번 달에 <b>${total}</b>글자나 썼어요! 🎉</div><div class="calendar">${cells}</div>
        <button class="btn big primary back-learn">돌아가기</button></div>`;
      body.querySelector('.back-learn').addEventListener('click', () => { Sound.pop(); GameShell.showSection('learn'); });
    }

    // ---- 진입점 ----
    function startWordSet(cat, wIdx, onList) {
      const name = Player.current();
      const [word, emoji] = cat.words[wIdx];
      writeScreen({
        emoji, chunks: [[...word]], speakText: word, onList,
        onComplete: () => {
          const cnt = [...word].length >= 3 ? 2 : 1;
          const bonus = randPick(FRUITS.slice(1));
          Player.addFruit(name, bonus, cnt);
          const nextIdx = wIdx + 1;
          Player.setProgress(name, cat.id, Math.max(Player.progress(name)[cat.id] || 0, Math.min(nextIdx, cat.words.length)));
          showLessonDone({ title: `"${word}" 완성!`, emoji, bonus, bonusCount: cnt,
            allDoneMsg: nextIdx >= cat.words.length ? '이 주제를 다 썼어요! 🏆' : '',
            onNext: nextIdx < cat.words.length ? () => startWordSet(cat, nextIdx, onList) : null, onList });
        },
      });
    }
    function startSentenceSet(set, sIdx, onList) {
      const name = Player.current();
      const raw = set.items[sIdx];
      const text = applyName(raw.t, name);
      const eojeols = text.split(' ').filter(Boolean).map((w) => [...w]);
      writeScreen({
        emoji: raw.e, chunks: eojeols, speakText: text, onList,
        onComplete: () => {
          Player.addFruit(name, '🍉', 2);
          const nextIdx = sIdx + 1;
          Player.setProgress(name, set.id, Math.max(Player.progress(name)[set.id] || 0, Math.min(nextIdx, set.items.length)));
          showLessonDone({ title: `"${text}" 완성!`, emoji: raw.e, bonus: '🍉', bonusCount: 2,
            allDoneMsg: nextIdx >= set.items.length ? '이 이야기를 다 썼어요! 📚' : '',
            onNext: nextIdx < set.items.length ? () => startSentenceSet(set, nextIdx, onList) : null, onList });
        },
      });
    }

    function showLessonDone({ title, emoji, bonus, bonusCount, allDoneMsg, onNext, onList }) {
      Sound.fanfare(); setHeaderFruits();
      const overlay = document.createElement('div');
      overlay.className = 'overlay';
      overlay.innerHTML = `<div class="overlay-card"><h3>🎉 ${title}</h3>
        <p style="font-size:34px">${emoji} ${bonus.repeat(bonusCount)} 획득!</p><p>${allDoneMsg}</p>
        <div class="overlay-buttons">${onNext ? '<button class="btn big primary next-w">다음 →</button>' : ''}
        <button class="btn big list-w">📚 목록으로</button></div></div>`;
      body.appendChild(overlay);
      const nb = overlay.querySelector('.next-w');
      if (nb) nb.addEventListener('click', () => { Sound.ding(); onNext(); });
      overlay.querySelector('.list-w').addEventListener('click', () => { Sound.ding(); onList(); });
    }

    // ---- 쓰기 화면 (여러 글자를 한 번에 보여주고 한 글자씩) ----
    function writeScreen(cfg) {
      if (raf) cancelAnimationFrame(raf);
      if (resizeCleanup) { resizeCleanup(); resizeCleanup = null; }
      const name = Player.current();
      setHeaderFruits();
      let chunkIdx = 0, cellIdx = 0, strokeIdx = 0;
      let drawnPath = [], fails = 0, demo = null;

      body.innerHTML = `
        <div class="write-wrap">
          <div class="write-prompt"><div class="write-emoji">${cfg.emoji}</div><div class="write-word"></div>
            <button class="btn listen-btn" style="font-size:15px;padding:6px 14px">🔊 들어보기</button></div>
          <div class="write-canvas-holder"><canvas class="guide-layer"></canvas><canvas class="ink-layer"></canvas></div>
          <div class="write-tools"><button class="btn demo-btn">👀 어떻게 써요?</button><button class="btn erase-btn">🧽 지우기</button><button class="btn skip-btn">건너뛰기 →</button></div>
        </div>`;
      const wordEl = body.querySelector('.write-word');
      const holder = body.querySelector('.write-canvas-holder');
      const guide = body.querySelector('.guide-layer');
      const ink = body.querySelector('.ink-layer');
      let box, gctx, ictx, cellSize, cellStrokesAll = [];

      function paintHeader() {
        let html = '';
        cfg.chunks.forEach((chunk, ci) => {
          if (ci > 0) html += `<span class="wspace"></span>`;
          chunk.forEach((ch, si) => {
            const cls = ci < chunkIdx || (ci === chunkIdx && si < cellIdx) ? 'done' : (ci === chunkIdx && si === cellIdx) ? 'current' : '';
            html += `<span class="wchar ${cls}">${ch}</span>`;
          });
        });
        wordEl.innerHTML = html;
      }
      function layoutHolder() {
        const N = cfg.chunks[chunkIdx].length;
        const cell = Math.min(window.innerWidth * 0.94 / N, window.innerHeight * 0.42, 240);
        holder.style.width = cell * N + 'px'; holder.style.height = cell + 'px';
        holder.querySelectorAll('.cell-sep').forEach((s) => s.remove());
        for (let i = 1; i < N; i++) { const sep = document.createElement('div'); sep.className = 'cell-sep'; sep.style.left = (cell * i) + 'px'; holder.appendChild(sep); }
        const g = fitCanvas(guide); box = { w: g.w, h: g.h }; gctx = g.ctx;
        const k = fitCanvas(ink); ictx = k.ctx; cellSize = box.h; computeStrokes();
      }
      function computeStrokes() {
        cellStrokesAll = cfg.chunks[chunkIdx].map((ch, ci) => {
          const cell = HangulData.getSyllableStrokes(ch); if (!cell) return [];
          const ox = ci * cellSize;
          return cell.map((s) => s.c
            ? { c: [ox + s.c[0] / 100 * cellSize, s.c[1] / 100 * cellSize, s.c[2] / 100 * cellSize] }
            : { p: s.p.map((pt) => [ox + pt[0] / 100 * cellSize, pt[1] / 100 * cellSize]) });
        });
      }
      function strokePts(s, n = 26) {
        if (s.c) { const [cx, cy, r] = s.c; const a = []; for (let i = 0; i <= n; i++) { const g = -Math.PI / 2 + (i / n) * Math.PI * 2; a.push([cx + Math.cos(g) * r, cy + Math.sin(g) * r]); } return a; }
        const out = [];
        for (let i = 0; i < s.p.length - 1; i++) { const [a, b] = [s.p[i], s.p[i + 1]]; for (let t = 0; t < 1; t += 0.12) out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); }
        out.push(s.p[s.p.length - 1]); return out;
      }
      function tracePath(ctx, s) {
        ctx.beginPath();
        if (s.c) ctx.arc(s.c[0], s.c[1], s.c[2], -Math.PI / 2, Math.PI * 1.5);
        else s.p.forEach((pt, i) => i ? ctx.lineTo(pt[0], pt[1]) : ctx.moveTo(pt[0], pt[1]));
        ctx.stroke();
      }
      const lineW = () => Math.max(12, cellSize * 0.075);
      function drawGuide() {
        if (!gctx) return;
        gctx.clearRect(0, 0, box.w, box.h); gctx.lineCap = 'round'; gctx.lineJoin = 'round';
        const lw = lineW();
        cellStrokesAll.forEach((strokes, ci) => {
          if (ci < cellIdx) return;
          strokes.forEach((s, i) => {
            if (ci === cellIdx && i < strokeIdx) return;
            gctx.strokeStyle = (ci === cellIdx && i === strokeIdx) ? '#cfe6ff' : (ci === cellIdx ? '#eee7ef' : '#f3eef6');
            gctx.lineWidth = lw; tracePath(gctx, s);
          });
        });
        const cur = cellStrokesAll[cellIdx] && cellStrokesAll[cellIdx][strokeIdx];
        if (cur) {
          const pts = strokePts(cur); const start = pts[0], end = pts[pts.length - 1];
          if (demo) { const gp = pts[Math.min(pts.length - 1, Math.floor(demo.t * (pts.length - 1)))]; gctx.fillStyle = '#ff6f91'; gctx.beginPath(); gctx.arc(gp[0], gp[1], lw * 0.5, 0, Math.PI * 2); gctx.fill(); }
          gctx.fillStyle = '#3ba0ff'; gctx.beginPath(); gctx.arc(start[0], start[1], lw * 0.42, 0, Math.PI * 2); gctx.fill();
          gctx.fillStyle = '#fff'; gctx.font = `bold ${lw * 0.6}px Jua, sans-serif`; gctx.textAlign = 'center'; gctx.textBaseline = 'middle'; gctx.fillText(String(strokeIdx + 1), start[0], start[1]);
          const b = pts[pts.length - 2] || start; const ang = Math.atan2(end[1] - b[1], end[0] - b[0]);
          gctx.save(); gctx.translate(end[0], end[1]); gctx.rotate(ang); gctx.fillStyle = '#ff6f91';
          const a = lw * 0.7; gctx.beginPath(); gctx.moveTo(0, 0); gctx.lineTo(-a, -a * 0.6); gctx.lineTo(-a, a * 0.6); gctx.closePath(); gctx.fill(); gctx.restore();
        }
      }
      function drawInk() {
        if (!ictx) return;
        ictx.clearRect(0, 0, box.w, box.h); ictx.lineCap = 'round'; ictx.lineJoin = 'round'; ictx.strokeStyle = '#ff8fab'; ictx.lineWidth = lineW();
        cellStrokesAll.forEach((strokes, ci) => {
          if (ci < cellIdx) strokes.forEach((s) => tracePath(ictx, s));
          else if (ci === cellIdx) for (let i = 0; i < strokeIdx; i++) tracePath(ictx, strokes[i]);
        });
      }
      function startDemo() { demo = { t: 0 }; }
      function loop() {
        if (demo) { demo.t += 0.02; if (demo.t >= 1.15) demo = null; drawGuide(); }
        if (drawnPath.length > 1) {
          drawInk(); ictx.strokeStyle = '#ffb3c6'; ictx.lineWidth = lineW(); ictx.lineCap = 'round'; ictx.lineJoin = 'round';
          ictx.beginPath(); drawnPath.forEach((p, i) => i ? ictx.lineTo(p[0], p[1]) : ictx.moveTo(p[0], p[1])); ictx.stroke();
        }
        raf = requestAnimationFrame(loop);
      }
      const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
      const pathLen = (pts) => { let l = 0; for (let i = 1; i < pts.length; i++) l += dist(pts[i - 1], pts[i]); return l; };
      function judge() {
        const cur = cellStrokesAll[cellIdx] && cellStrokesAll[cellIdx][strokeIdx];
        if (!cur || drawnPath.length < 2) return false;
        const target = strokePts(cur); const R = cellSize * 0.32;
        const dS = drawnPath[0], dE = drawnPath[drawnPath.length - 1], tS = target[0], tE = target[target.length - 1];
        if (!((dist(dS, tS) < R && dist(dE, tE) < R) || (dist(dS, tE) < R && dist(dE, tS) < R))) return false;
        if (pathLen(drawnPath) < pathLen(target) * 0.5) return false;
        const R2 = cellSize * 0.36;
        for (const sp of [target[0], target[Math.floor(target.length / 2)], target[target.length - 1]]) if (!drawnPath.some((dp) => dist(dp, sp) < R2)) return false;
        return true;
      }
      function onStrokeDone() {
        strokeIdx++; drawnPath = []; Sound.blip(); drawInk(); drawGuide();
        if (strokeIdx >= cellStrokesAll[cellIdx].length) setTimeout(cellComplete, 130); else startDemo();
      }
      function cellComplete() {
        Sound.heart();
        const r = holder.getBoundingClientRect(); const br = body.getBoundingClientRect();
        spawnFx(body, r.left - br.left + (cellIdx + 0.5) * (r.width / cfg.chunks[chunkIdx].length), r.top - br.top + r.height / 2, '⭐');
        Player.addFruit(name, '🍓'); Player.addDaily(name); setHeaderFruits();
        cellIdx++; strokeIdx = 0; paintHeader();
        if (cellIdx >= cfg.chunks[chunkIdx].length) setTimeout(chunkComplete, 200);
        else { drawInk(); startDemo(); drawGuide(); }
      }
      function chunkComplete() {
        chunkIdx++; cellIdx = 0; strokeIdx = 0;
        if (chunkIdx >= cfg.chunks.length) { cfg.onComplete(); return; }
        paintHeader(); layoutHolder(); startDemo(); drawInk(); drawGuide();
      }
      const pos = (e) => { const r = ink.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
      ink.addEventListener('pointerdown', (e) => { e.preventDefault(); demo = null; drawnPath = [pos(e)]; });
      ink.addEventListener('pointermove', (e) => { if (drawnPath.length) drawnPath.push(pos(e)); });
      const endDraw = () => { if (!drawnPath.length) return; if (judge()) onStrokeDone(); else { fails++; drawnPath = []; drawInk(); Sound.buzz(); if (fails >= 2) startDemo(); } };
      ink.addEventListener('pointerup', endDraw); ink.addEventListener('pointercancel', endDraw); ink.addEventListener('pointerleave', endDraw);
      body.querySelector('.listen-btn').addEventListener('click', () => speak(cfg.speakText));
      body.querySelector('.demo-btn').addEventListener('click', () => { Sound.blip(); startDemo(); });
      body.querySelector('.erase-btn').addEventListener('click', () => { Sound.pop(); drawnPath = []; drawInk(); });
      body.querySelector('.skip-btn').addEventListener('click', () => { Sound.pop(); cellComplete(); });
      const onResize = () => { layoutHolder(); drawInk(); drawGuide(); };
      window.addEventListener('resize', onResize);
      resizeCleanup = () => window.removeEventListener('resize', onResize);
      paintHeader(); layoutHolder(); startDemo(); drawInk(); drawGuide(); loop(); speak(cfg.speakText);
    }

    // 진입: 현재 친구 확인 후 모드별 화면
    function route() {
      const name = Player.current();
      if (mode === 'word') showWordMenu();
      else if (mode === 'sentence') showSentenceMenu();
      else if (mode === 'record') showRecord();
      else if (mode === 'read') showReadAlong();
      else if (mode === 'basic') startWordSet(BASIC_CAT, Math.min(Player.progress(name).basic || 0, BASIC_SYL.length - 1), () => GameShell.showSection('learn'));
      else if (mode === 'name') startWordSet({ id: 'myname_' + name, name: '내 이름', words: [[name, '😊']] }, 0, () => GameShell.showSection('learn'));
    }
    if (!Player.current()) Player.showPicker(body, { onPick: () => route() });
    else route();

    return {
      destroy() {
        if (raf) cancelAnimationFrame(raf);
        if (resizeCleanup) resizeCleanup();
        if (readTimer) clearTimeout(readTimer);
        try { speechSynthesis.cancel(); } catch (e) {}
      },
    };
  }

  GameShell.registerGame({ id: 'learn-basic', section: 'learn', name: '가나다 쓰기', emoji: '🐣', color: '#fff0b8', desc: '한 글자씩 (처음)', init: (b, a) => run(b, a, 'basic') });
  GameShell.registerGame({ id: 'learn-read', section: 'learn', name: '가나다 읽기', emoji: '📣', color: '#ffe0c2', desc: '따라 읽어요', init: (b, a) => run(b, a, 'read') });
  GameShell.registerGame({ id: 'learn-word', section: 'learn', name: '단어 쓰기', emoji: '📝', color: '#ffe1a8', desc: '또박또박 단어', init: (b, a) => run(b, a, 'word') });
  GameShell.registerGame({ id: 'learn-sentence', section: 'learn', name: '문장 쓰기', emoji: '📖', color: '#e5d4ff', desc: '문장 따라쓰기', init: (b, a) => run(b, a, 'sentence') });
  GameShell.registerGame({ id: 'learn-name', section: 'learn', name: '내 이름 쓰기', emoji: '🔤', color: '#ffe0c2', desc: '내 이름 연습', init: (b, a) => run(b, a, 'name') });
  GameShell.registerGame({ id: 'learn-record', section: 'learn', name: '오늘까지 기록', emoji: '📅', color: '#cdeafe', desc: '달력으로 확인', init: (b, a) => run(b, a, 'record') });
})();
