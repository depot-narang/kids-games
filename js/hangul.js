// ✏️ 한글 쓰기 — 획순을 따라 글자를 쓰고 과일을 모아요 (프로필/이어하기/매일 기록)
GameShell.registerGame({
  id: 'hangul',
  name: '한글 쓰기',
  emoji: '✏️',
  desc: '글자 따라 쓰기',
  color: '#ffe1a8',

  init(body, actions) {
    // ---------- 단어 데이터 ----------
    const CATEGORIES = [
      { id: 'fruit', name: '과일', emoji: '🍓', words: [
        ['사과', '🍎'], ['포도', '🍇'], ['딸기', '🍓'], ['수박', '🍉'], ['바나나', '🍌'], ['참외', '🍈'], ['감', '🟠'] ] },
      { id: 'animal', name: '동물', emoji: '🐰', words: [
        ['토끼', '🐰'], ['곰', '🐻'], ['오리', '🦆'], ['사자', '🦁'], ['여우', '🦊'], ['고양이', '🐱'], ['강아지', '🐶'], ['나비', '🦋'] ] },
      { id: 'family', name: '가족', emoji: '👨‍👩‍👧', words: [
        ['엄마', '🤱'], ['아빠', '👨'], ['누나', '👧'], ['형', '👦'], ['동생', '🧒'], ['아기', '👶'] ] },
      { id: 'nature', name: '자연', emoji: '🌳', words: [
        ['하늘', '☁️'], ['바다', '🌊'], ['나무', '🌳'], ['꽃', '🌸'], ['별', '⭐'], ['해', '☀️'], ['달', '🌙'], ['비', '🌧️'] ] },
      { id: 'vehicle', name: '탈것', emoji: '🚗', words: [
        ['자동차', '🚗'], ['버스', '🚌'], ['기차', '🚂'], ['배', '⛵'], ['비행기', '✈️'], ['자전거', '🚲'] ] },
    ];
    const FRUITS = ['🍓', '🍎', '🍇', '🍉', '🍑', '🍊'];

    // ---------- 저장소 ----------
    const P = {
      list: () => Store.get('hangul.profiles', []),
      save: (l) => Store.set('hangul.profiles', l),
      current: () => Store.get('hangul.current', null),
      setCurrent: (n) => Store.set('hangul.current', n),
      fruits: (n) => Store.get(`hangul.${n}.fruits`, {}),
      addFruit: (n, f, c = 1) => { const b = P.fruits(n); b[f] = (b[f] || 0) + c; Store.set(`hangul.${n}.fruits`, b); },
      progress: (n) => Store.get(`hangul.${n}.progress`, {}),
      setProgress: (n, cat, idx) => { const p = P.progress(n); p[cat] = idx; Store.set(`hangul.${n}.progress`, p); },
      daily: (n) => Store.get(`hangul.${n}.daily`, {}),
      addDaily: (n, c = 1) => {
        const d = P.daily(n); const k = todayKey();
        d[k] = (d[k] || 0) + c; Store.set(`hangul.${n}.daily`, d);
      },
    };
    function todayKey() { const t = new Date(); return `${t.getFullYear()}-${t.getMonth() + 1}-${t.getDate()}`; }

    let mediaStream = null;
    function stopCamera() { if (mediaStream) { mediaStream.getTracks().forEach((t) => t.stop()); mediaStream = null; } }

    function speak(text) {
      try {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'ko-KR'; u.rate = 0.8;
        speechSynthesis.cancel(); speechSynthesis.speak(u);
      } catch (e) { Sound.ding(); }
    }

    function setHeaderFruits(name) {
      if (!name) { actions.innerHTML = ''; return; }
      const b = P.fruits(name);
      const top = Object.entries(b).sort((a, c) => c[1] - a[1]).slice(0, 3)
        .map(([f, n]) => `${f}${n}`).join(' ') || '🍓0';
      actions.innerHTML = `<div class="pill fruit-basket"><span>${top}</span></div>`;
    }

    // ---------- 화면: 프로필 선택 ----------
    function showProfiles() {
      stopCamera();
      setHeaderFruits(null);
      const profiles = P.list();
      body.innerHTML = `
        <div class="hangul-center">
          <h3>누가 연습할까요?</h3>
          <div class="profile-row"></div>
        </div>`;
      const row = body.querySelector('.profile-row');
      profiles.forEach((p) => {
        const card = document.createElement('button');
        card.className = 'profile-card';
        card.innerHTML = `<div class="avatar">${avatarHTML(p)}</div><div class="pname">${p.name}</div>`;
        card.addEventListener('click', () => { Sound.ding(); P.setCurrent(p.name); showCategories(); });
        row.appendChild(card);
      });
      if (profiles.length < 4) {
        const add = document.createElement('button');
        add.className = 'profile-card add';
        add.innerHTML = `<div class="avatar">＋</div><div class="pname">새 친구</div>`;
        add.addEventListener('click', () => { Sound.blip(); showCreateProfile(); });
        row.appendChild(add);
      }
    }

    function avatarHTML(p) {
      return p.avatar && p.avatar.type === 'photo'
        ? `<img src="${p.avatar.value}" alt="${p.name}">`
        : (p.avatar ? p.avatar.value : '🙂');
    }

    // ---------- 화면: 프로필 만들기 (이름 + 아바타/카메라) ----------
    function showCreateProfile() {
      stopCamera();
      const emojis = ['🐰', '🐻', '🐱', '🦊', '🐼', '🦄', '🐸', '🐥', '🦋', '🐙'];
      let avatar = { type: 'emoji', value: emojis[0] };
      body.innerHTML = `
        <div class="hangul-center">
          <h3>새 친구 만들기</h3>
          <div class="avatar big-preview"></div>
          <input class="name-input" maxlength="6" placeholder="이름" />
          <div style="display:flex;gap:8px;">
            <button class="btn quick-joy">조이</button>
            <button class="btn quick-chaea">채아</button>
          </div>
          <div class="avatar-options"></div>
          <button class="btn camera-btn">📷 얼굴 사진 찍기</button>
          <div style="display:flex;gap:10px;">
            <button class="btn cancel-btn">취소</button>
            <button class="btn big primary create-btn">만들기 ✨</button>
          </div>
        </div>`;
      const preview = body.querySelector('.big-preview');
      const nameInput = body.querySelector('.name-input');
      const opts = body.querySelector('.avatar-options');

      function refreshPreview() {
        preview.innerHTML = avatar.type === 'photo' ? `<img src="${avatar.value}">` : avatar.value;
      }
      refreshPreview();

      emojis.forEach((e, i) => {
        const o = document.createElement('button');
        o.className = 'avatar-opt' + (i === 0 ? ' selected' : '');
        o.textContent = e;
        o.addEventListener('click', () => {
          avatar = { type: 'emoji', value: e };
          opts.querySelectorAll('.avatar-opt').forEach((x) => x.classList.remove('selected'));
          o.classList.add('selected');
          refreshPreview(); Sound.blip();
        });
        opts.appendChild(o);
      });

      body.querySelector('.quick-joy').addEventListener('click', () => { nameInput.value = '조이'; Sound.blip(); });
      body.querySelector('.quick-chaea').addEventListener('click', () => { nameInput.value = '채아'; Sound.blip(); });
      body.querySelector('.cancel-btn').addEventListener('click', () => { Sound.pop(); showProfiles(); });
      body.querySelector('.camera-btn').addEventListener('click', () => openCamera((dataUrl) => {
        avatar = { type: 'photo', value: dataUrl };
        opts.querySelectorAll('.avatar-opt').forEach((x) => x.classList.remove('selected'));
        refreshPreview();
      }));

      body.querySelector('.create-btn').addEventListener('click', () => {
        const name = (nameInput.value || '').trim();
        if (!name) { nameInput.classList.add('shake'); setTimeout(() => nameInput.classList.remove('shake'), 400); Sound.buzz(); return; }
        const list = P.list();
        if (list.some((p) => p.name === name)) { nameInput.value = name + '2'; return; }
        list.push({ name, avatar });
        P.save(list);
        Sound.yay();
        P.setCurrent(name);
        showCategories();
      });
    }

    function openCamera(onCapture) {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('이 기기에서는 카메라를 쓸 수 없어요. 그림 아바타를 골라주세요!');
        return;
      }
      const overlay = document.createElement('div');
      overlay.className = 'overlay';
      overlay.innerHTML = `
        <div class="overlay-card">
          <h3>📷 얼굴을 찍어요</h3>
          <video class="camera-view" autoplay playsinline></video>
          <div class="overlay-buttons">
            <button class="btn cam-cancel">취소</button>
            <button class="btn big primary cam-shoot">찰칵! 📸</button>
          </div>
        </div>`;
      body.appendChild(overlay);
      const video = overlay.querySelector('video');
      const close = () => { stopCamera(); overlay.remove(); };
      overlay.querySelector('.cam-cancel').addEventListener('click', () => { Sound.pop(); close(); });

      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
        .then((stream) => { mediaStream = stream; video.srcObject = stream; })
        .catch(() => { alert('카메라를 켤 수 없어요. 그림 아바타를 골라주세요!'); close(); });

      overlay.querySelector('.cam-shoot').addEventListener('click', () => {
        if (!video.videoWidth) return;
        const size = 160;
        const c = document.createElement('canvas');
        c.width = size; c.height = size;
        const cx = c.getContext('2d');
        // 정사각으로 가운데 잘라서 저장 (거울 반전 유지)
        const s = Math.min(video.videoWidth, video.videoHeight);
        cx.translate(size, 0); cx.scale(-1, 1);
        cx.drawImage(video, (video.videoWidth - s) / 2, (video.videoHeight - s) / 2, s, s, 0, 0, size, size);
        onCapture(c.toDataURL('image/jpeg', 0.7));
        Sound.yay();
        close();
      });
    }

    // ---------- 화면: 카테고리(주제) 선택 ----------
    function showCategories() {
      stopCamera();
      const name = P.current();
      setHeaderFruits(name);
      const prof = P.list().find((p) => p.name === name);
      body.innerHTML = `
        <div class="hangul-center">
          <div style="display:flex;align-items:center;gap:10px;">
            <div class="avatar small">${avatarHTML(prof)}</div>
            <h3>${name}야, 무엇을 써볼까?</h3>
          </div>
          <div class="template-grid cat-grid"></div>
          <div style="display:flex;gap:10px;">
            <button class="btn myname-btn">🔤 내 이름 쓰기</button>
            <button class="btn record-btn">📅 오늘까지 기록</button>
            <button class="btn switch-btn">👭 친구 바꾸기</button>
          </div>
        </div>`;
      const grid = body.querySelector('.cat-grid');
      CATEGORIES.forEach((cat) => {
        const prog = P.progress(name)[cat.id] || 0;
        const card = document.createElement('button');
        card.className = 'template-card';
        card.innerHTML = `<div style="font-size:44px">${cat.emoji}</div><span>${cat.name}</span>` +
          `<small style="color:#a99;font-size:13px">${Math.min(prog, cat.words.length)}/${cat.words.length}</small>`;
        card.addEventListener('click', () => { Sound.ding(); startCategory(cat); });
        grid.appendChild(card);
      });
      body.querySelector('.myname-btn').addEventListener('click', () => {
        Sound.ding();
        startCategory({ id: 'myname_' + name, name: '내 이름', emoji: '🔤', words: [[name, '😊']] });
      });
      body.querySelector('.record-btn').addEventListener('click', () => { Sound.ding(); showRecord(); });
      body.querySelector('.switch-btn').addEventListener('click', () => { Sound.pop(); showProfiles(); });
    }

    // ---------- 화면: 매일 기록 달력 ----------
    function showRecord() {
      const name = P.current();
      const daily = P.daily(name);
      const now = new Date();
      const year = now.getFullYear(), month = now.getMonth();
      const first = new Date(year, month, 1).getDay();
      const days = new Date(year, month + 1, 0).getDate();
      let cells = '';
      ['일', '월', '화', '수', '목', '금', '토'].forEach((d) => { cells += `<div class="cal-head">${d}</div>`; });
      for (let i = 0; i < first; i++) cells += `<div></div>`;
      let total = 0;
      for (let d = 1; d <= days; d++) {
        const cnt = daily[`${year}-${month + 1}-${d}`] || 0;
        if (cnt) total += cnt;
        cells += `<div class="cal-cell ${cnt ? 'has' : ''}">
          <div>${d}</div>${cnt ? `<div class="cal-stamp">✏️</div><div>${cnt}자</div>` : ''}</div>`;
      }
      body.innerHTML = `
        <div class="hangul-center">
          <h3>📅 ${name}의 ${month + 1}월 기록</h3>
          <div class="pill">이번 달에 <b>${total}</b>글자나 썼어요! 🎉</div>
          <div class="calendar">${cells}</div>
          <button class="btn big primary back-cat">돌아가기</button>
        </div>`;
      body.querySelector('.back-cat').addEventListener('click', () => { Sound.pop(); showCategories(); });
    }

    // ---------- 화면: 쓰기 ----------
    let raf = null;
    let resizeCleanup = null;
    function startCategory(cat) {
      const name = P.current();
      let wIdx = Math.min(P.progress(name)[cat.id] || 0, cat.words.length - 1);
      renderWord(cat, wIdx, name);
    }

    function renderWord(cat, wIdx, name) {
      if (raf) cancelAnimationFrame(raf);
      if (resizeCleanup) { resizeCleanup(); resizeCleanup = null; }
      setHeaderFruits(name);
      const [word, emoji] = cat.words[wIdx];
      const chars = [...word];
      let charIdx = 0;

      body.innerHTML = `
        <div class="write-wrap">
          <div class="write-prompt">
            <div class="write-emoji">${emoji}</div>
            <div class="write-word"></div>
            <button class="btn" style="font-size:15px;padding:6px 14px">🔊 들어보기</button>
          </div>
          <div class="write-canvas-holder">
            <canvas class="guide-layer"></canvas>
            <canvas class="ink-layer"></canvas>
          </div>
          <div class="write-tools">
            <button class="btn demo-btn">👀 어떻게 써요?</button>
            <button class="btn erase-btn">🧽 지우기</button>
            <button class="btn skip-btn">건너뛰기 →</button>
          </div>
        </div>`;

      const wordEl = body.querySelector('.write-word');
      function paintWordProgress() {
        wordEl.innerHTML = chars.map((c, i) =>
          `<span class="wchar ${i < charIdx ? 'done' : i === charIdx ? 'current' : ''}">${c}</span>`).join('');
      }
      paintWordProgress();

      body.querySelector('.write-prompt button').addEventListener('click', () => speak(word));
      speak(word);

      const guide = body.querySelector('.guide-layer');
      const ink = body.querySelector('.ink-layer');
      const holder = body.querySelector('.write-canvas-holder');

      let box, gctx, ictx;
      function fit() {
        const g = fitCanvas(guide); box = { w: g.w, h: g.h }; gctx = g.ctx;
        const k = fitCanvas(ink); ictx = k.ctx;
        drawGuide();
      }

      let strokes = [];         // 현재 글자의 획들 (픽셀 좌표)
      let strokeIdx = 0;        // 지금 써야 할 획
      let drawnPath = [];       // 사용자가 긋는 중인 경로
      let fails = 0;
      let demo = null;          // {t}

      function loadChar() {
        drawnPath = []; strokeIdx = 0; fails = 0;
        const ch = chars[charIdx];
        const cell = HangulData.getSyllableStrokes(ch);
        const size = box.w;
        const toPx = (s) => s.c
          ? { c: [s.c[0] / 100 * size, s.c[1] / 100 * size, s.c[2] / 100 * size] }
          : { p: s.p.map((pt) => [pt[0] / 100 * size, pt[1] / 100 * size]) };
        strokes = cell ? cell.map(toPx) : [];
        clearInk();
        startDemo();
        drawGuide();
      }

      function clearInk() { if (ictx) ictx.clearRect(0, 0, box.w, box.h); }

      // ------- 그리기 유틸 -------
      function strokePts(s, n = 26) {
        if (s.c) {
          const [cx, cy, r] = s.c; const arr = [];
          for (let i = 0; i <= n; i++) { const a = -Math.PI / 2 + (i / n) * Math.PI * 2; arr.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
          return arr;
        }
        // 폴리라인을 균등 샘플
        const pts = s.p; const out = [];
        for (let i = 0; i < pts.length - 1; i++) {
          const [a, b] = [pts[i], pts[i + 1]];
          for (let t = 0; t < 1; t += 0.12) out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
        }
        out.push(pts[pts.length - 1]);
        return out;
      }
      function drawStrokePath(ctx, s) {
        ctx.beginPath();
        if (s.c) { ctx.arc(s.c[0], s.c[1], s.c[2], -Math.PI / 2, Math.PI * 1.5); }
        else { s.p.forEach((pt, i) => i ? ctx.lineTo(pt[0], pt[1]) : ctx.moveTo(pt[0], pt[1])); }
        ctx.stroke();
      }

      function drawGuide() {
        if (!gctx) return;
        const size = box.w;
        gctx.clearRect(0, 0, box.w, box.h);
        // 십자 안내선
        gctx.strokeStyle = '#f0eef5'; gctx.lineWidth = 2; gctx.setLineDash([8, 8]);
        gctx.beginPath(); gctx.moveTo(size / 2, 0); gctx.lineTo(size / 2, size);
        gctx.moveTo(0, size / 2); gctx.lineTo(size, size / 2); gctx.stroke();
        gctx.setLineDash([]);
        const lw = Math.max(14, size * 0.075);
        gctx.lineCap = 'round'; gctx.lineJoin = 'round';
        // 모든 획: 아직 안 쓴 건 연하게, 쓴 건 진하게
        strokes.forEach((s, i) => {
          if (i < strokeIdx) return; // 완료 획은 ink 레이어에서
          gctx.strokeStyle = i === strokeIdx ? '#cfe6ff' : '#eee7ef';
          gctx.lineWidth = lw;
          drawStrokePath(gctx, s);
        });
        // 현재 획: 시작점·방향화살표·번호
        const cur = strokes[strokeIdx];
        if (cur) {
          const pts = strokePts(cur);
          const start = pts[0], end = pts[pts.length - 1];
          // 데모 점
          if (demo) {
            const gi = Math.min(pts.length - 1, Math.floor(demo.t * (pts.length - 1)));
            const gp = pts[gi];
            gctx.fillStyle = '#ff6f91';
            gctx.beginPath(); gctx.arc(gp[0], gp[1], lw * 0.5, 0, Math.PI * 2); gctx.fill();
          }
          // 시작점
          gctx.fillStyle = '#3ba0ff';
          gctx.beginPath(); gctx.arc(start[0], start[1], lw * 0.42, 0, Math.PI * 2); gctx.fill();
          // 번호
          gctx.fillStyle = '#fff'; gctx.font = `bold ${lw * 0.6}px Jua, sans-serif`;
          gctx.textAlign = 'center'; gctx.textBaseline = 'middle';
          gctx.fillText(String(strokeIdx + 1), start[0], start[1]);
          // 방향 화살표
          const b = pts[pts.length - 2] || start;
          const ang = Math.atan2(end[1] - b[1], end[0] - b[0]);
          gctx.save(); gctx.translate(end[0], end[1]); gctx.rotate(ang);
          gctx.fillStyle = '#ff6f91';
          const a = lw * 0.7;
          gctx.beginPath(); gctx.moveTo(0, 0); gctx.lineTo(-a, -a * 0.6); gctx.lineTo(-a, a * 0.6); gctx.closePath(); gctx.fill();
          gctx.restore();
        }
      }

      function drawCompletedInk() {
        clearInk();
        const lw = Math.max(14, box.w * 0.075);
        ictx.lineCap = 'round'; ictx.lineJoin = 'round';
        ictx.strokeStyle = '#ff8fab';
        ictx.lineWidth = lw;
        for (let i = 0; i < strokeIdx; i++) drawStrokePath(ictx, strokes[i]);
      }

      // ------- 데모 애니메이션 -------
      function startDemo() { demo = { t: 0 }; }
      function loop() {
        if (demo) {
          demo.t += 0.02;
          if (demo.t >= 1.15) demo = null;
          drawGuide();
        }
        // 사용자가 긋는 잉크
        if (drawnPath.length > 1) {
          drawCompletedInk();
          const lw = Math.max(14, box.w * 0.075);
          ictx.strokeStyle = '#ffb3c6'; ictx.lineWidth = lw; ictx.lineCap = 'round'; ictx.lineJoin = 'round';
          ictx.beginPath();
          drawnPath.forEach((p, i) => i ? ictx.lineTo(p[0], p[1]) : ictx.moveTo(p[0], p[1]));
          ictx.stroke();
        }
        raf = requestAnimationFrame(loop);
      }

      // ------- 판정 -------
      function dist(a, b) { return Math.hypot(a[0] - b[0], a[1] - b[1]); }
      function pathLen(pts) { let l = 0; for (let i = 1; i < pts.length; i++) l += dist(pts[i - 1], pts[i]); return l; }
      function judge() {
        const cur = strokes[strokeIdx];
        if (!cur || drawnPath.length < 2) return false;
        const target = strokePts(cur);
        const R = box.w * 0.3;
        const dStart = drawnPath[0], dEnd = drawnPath[drawnPath.length - 1];
        const tStart = target[0], tEnd = target[target.length - 1];
        // 방향 무관하게 시작/끝이 양 끝에 닿았는지
        const okFwd = dist(dStart, tStart) < R && dist(dEnd, tEnd) < R;
        const okRev = dist(dStart, tEnd) < R && dist(dEnd, tStart) < R;
        if (!okFwd && !okRev) return false;
        // 길이가 충분한지 (대충 문지르기 방지)
        if (pathLen(drawnPath) < pathLen(target) * 0.5) return false;
        // 획을 대체로 따라갔는지 (샘플 커버리지)
        const R2 = box.w * 0.34;
        const samples = [target[0], target[Math.floor(target.length / 2)], target[target.length - 1]];
        for (const sp of samples) {
          if (!drawnPath.some((dp) => dist(dp, sp) < R2)) return false;
        }
        return true;
      }

      function onStrokeDone() {
        strokeIdx++;
        drawnPath = [];
        Sound.blip();
        drawCompletedInk();
        drawGuide();
        if (strokeIdx >= strokes.length) setTimeout(charComplete, 150);
        else startDemo();
      }

      function charComplete() {
        Sound.heart();
        const r = holder.getBoundingClientRect(); const br = body.getBoundingClientRect();
        spawnFx(body, r.left - br.left + r.width / 2, r.top - br.top + r.height / 2, '⭐');
        P.addFruit(name, '🍓');
        P.addDaily(name);
        setHeaderFruits(name);
        charIdx++;
        paintWordProgress();
        if (charIdx >= chars.length) setTimeout(wordComplete, 300);
        else setTimeout(loadChar, 400);
      }

      function wordComplete() {
        Sound.fanfare();
        const bonus = randPick(FRUITS.slice(1));
        P.addFruit(name, bonus, chars.length >= 3 ? 2 : 1);
        setHeaderFruits(name);
        const nextIdx = wIdx + 1;
        P.setProgress(name, cat.id, Math.max(P.progress(name)[cat.id] || 0, Math.min(nextIdx, cat.words.length)));
        const done = nextIdx >= cat.words.length;
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.innerHTML = `
          <div class="overlay-card">
            <h3>🎉 "${word}" 완성!</h3>
            <p style="font-size:34px">${emoji} ${bonus}${chars.length >= 3 ? bonus : ''} 획득!</p>
            <p>${done ? '이 주제를 다 썼어요! 대단해요! 🏆' : ''}</p>
            <div class="overlay-buttons">
              ${done ? '' : '<button class="btn big primary next-w">다음 단어 →</button>'}
              <button class="btn big list-w">📚 주제 고르기</button>
            </div>
          </div>`;
        body.appendChild(overlay);
        const nb = overlay.querySelector('.next-w');
        if (nb) nb.addEventListener('click', () => { Sound.ding(); renderWord(cat, nextIdx, name); });
        overlay.querySelector('.list-w').addEventListener('click', () => { Sound.ding(); showCategories(); });
      }

      // ------- 입력 -------
      function pos(e) { const r = ink.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
      ink.addEventListener('pointerdown', (e) => { e.preventDefault(); demo = null; drawnPath = [pos(e)]; });
      ink.addEventListener('pointermove', (e) => { if (drawnPath.length) drawnPath.push(pos(e)); });
      const endDraw = () => {
        if (!drawnPath.length) return;
        if (judge()) onStrokeDone();
        else {
          fails++;
          drawnPath = [];
          drawCompletedInk();
          Sound.buzz();
          if (fails >= 2) startDemo(); // 두 번 틀리면 다시 보여주기
        }
      };
      ink.addEventListener('pointerup', endDraw);
      ink.addEventListener('pointercancel', endDraw);
      ink.addEventListener('pointerleave', endDraw);

      body.querySelector('.demo-btn').addEventListener('click', () => { Sound.blip(); startDemo(); });
      body.querySelector('.erase-btn').addEventListener('click', () => { Sound.pop(); drawnPath = []; drawCompletedInk(); });
      body.querySelector('.skip-btn').addEventListener('click', () => {
        Sound.pop();
        if (strokeIdx < strokes.length - 0 && charIdx < chars.length) {
          // 글자 건너뛰기
          charIdx++; paintWordProgress();
          if (charIdx >= chars.length) wordComplete(); else loadChar();
        }
      });

      const onResize = () => { fit(); loadChar(); };
      window.addEventListener('resize', onResize);
      resizeCleanup = () => window.removeEventListener('resize', onResize);

      fit();
      loadChar();
      loop();
    }

    // 첫 화면
    if (P.list().length === 0) showCreateProfile();
    else showProfiles();

    return {
      destroy() {
        if (raf) cancelAnimationFrame(raf);
        stopCamera();
        if (resizeCleanup) resizeCleanup();
        try { speechSynthesis.cancel(); } catch (e) {}
      },
    };
  },
});
