// 🐠 아기 물고기 — 카툰 물고기를 키워요! 많이 먹으면 쑥쑥 커지고 장난스러운 표정을 지어요
GameShell.registerGame({
  id: 'aquarium', name: '아기 물고기', emoji: '🐠', desc: '내 어항 물고기 키우기', color: '#bfe9ff', section: 'game',
  init(body) {
    const KINDS = [
      { color: '#ff8f6a', belly: '#ffd0b0', shape: 'normal' }, { color: '#5ac8e0', belly: '#c6eef7', shape: 'round' },
      { color: '#ffce5a', belly: '#fff0c0', shape: 'normal' }, { color: '#a888e0', belly: '#e2d2f2', shape: 'long' },
      { color: '#ff8fb0', belly: '#ffdae6', shape: 'round' }, { color: '#6bc96a', belly: '#cceecc', shape: 'normal' },
      { color: '#5a9fe2', belly: '#c6dcf7', shape: 'long' },
    ];
    const FACES = ['tongue', 'wideeyes', 'wink', 'o'];
    const MAX_FISH = 24;
    const neededFor = (count) => 6 + Math.max(0, count - 3) * 4;

    body.innerHTML = `<canvas class="fill"></canvas>
      <div class="hud"><div class="pill fish-pill"></div><div class="pill feed-pill"></div></div>`;
    const canvas = body.querySelector('canvas');
    const fishPill = body.querySelector('.fish-pill'), feedPill = body.querySelector('.feed-pill');
    let { w, h, ctx } = fitCanvas(canvas);
    const onResize = () => { ({ w, h, ctx } = fitCanvas(canvas)); };
    window.addEventListener('resize', onResize);

    const saved = Store.get('aquarium', null) || { fish: [{ k: 0, size: 1 }, { k: 1, size: 1 }, { k: 2, size: 1 }], feedCount: 0 };
    let feedCount = saved.feedCount || 0, toNext = saved.toNext != null ? saved.toNext : 0;
    const fish = (saved.fish || []).map((f) => ({
      kind: KINDS[f.k != null ? f.k : Math.floor(Math.random() * KINDS.length)],
      k: f.k != null ? f.k : 0, size: f.size || 1,
      x: randBetween(60, 400), y: randBetween(80, 300), vx: 0, vy: 0, tx: 0, ty: 0,
      pauseUntil: 0, trick: null, growUntil: 0, face: 'tongue', seed: randBetween(0, 9),
      nextTrickAt: performance.now() + randBetween(4000, 15000),
    }));
    let foods = [], bubbles = [], emotes = [], raf = null, running = true, kissCd = 0;

    function save() { Store.set('aquarium', { fish: fish.map((f) => ({ k: f.k, size: f.size })), feedCount, toNext }); }
    function updateHud() {
      fishPill.textContent = `🐠 물고기 ${fish.length}마리`;
      feedPill.textContent = fish.length >= MAX_FISH ? '어항이 가득해요! 🌊' : `🍒 새 친구까지 먹이 ${neededFor(fish.length) - toNext}번!`;
    }
    updateHud();
    function newTarget(f) { f.tx = randBetween(50, Math.max(60, w - 50)); f.ty = randBetween(60, Math.max(70, h - 60)); }
    fish.forEach((f) => { f.x = randBetween(50, Math.max(60, w - 50)); f.y = randBetween(60, Math.max(70, h - 60)); newTarget(f); });
    function emote(x, y, ch) { emotes.push({ x, y, vy: randBetween(-1.2, -0.7), life: 1, ch }); }
    function startTrick(f, now, type) { f.trick = { type: type || randPick(['spin', 'loop', 'wiggle', 'hearts']), start: now, dur: 1300, lastHeart: 0 }; f.nextTrickAt = now + randBetween(9000, 22000); }

    canvas.addEventListener('pointerdown', (e) => {
      const rect = canvas.getBoundingClientRect(); const x = e.clientX - rect.left, y = e.clientY - rect.top;
      for (const f of fish) if (Math.hypot(f.x - x, f.y - y) < 32 * f.size) { startTrick(f, performance.now(), randPick(['spin', 'loop', 'wiggle', 'hearts'])); Sound.heart(); emote(f.x, f.y - 24, '💗'); return; }
      for (let i = 0; i < 3; i++) foods.push({ x: x + randBetween(-16, 16), y: Math.min(y, 40) + randBetween(-8, 8), vy: randBetween(0.5, 1), landed: false, born: Date.now() });
      Sound.blip();
    });

    function eatFood(f, fi) {
      foods.splice(fi, 1); feedCount++; toNext++;
      const prevStep = Math.floor(f.size * 4);
      f.size = Math.min(2.4, f.size + 0.04);
      Sound.pop(); emote(f.x, f.y - 20 * f.size, '💕');
      if (Math.floor(f.size * 4) > prevStep) { // 한 단계 컸어요 → 장난 표정 + 커지는 뿅
        f.growUntil = performance.now() + 1300; f.face = randPick(FACES);
        emote(f.x + randBetween(-8, 8), f.y - 26 * f.size, randPick(['✨', '😝', '🎉']));
      }
      if (toNext >= neededFor(fish.length) && fish.length < MAX_FISH) {
        toNext = 0; const ki = Math.floor(Math.random() * KINDS.length);
        const nf = { kind: KINDS[ki], k: ki, size: 0.7, x: w / 2, y: -30, vx: 0, vy: 0, tx: 0, ty: 0, pauseUntil: 0, trick: null, growUntil: 0, face: 'tongue', seed: randBetween(0, 9), nextTrickAt: performance.now() + randBetween(4000, 12000) };
        newTarget(nf); fish.push(nf); Sound.fanfare();
        spawnFx(body, w / 2, 80, '🎉'); spawnFx(body, w / 2 - 50, 100, '🎊'); spawnFx(body, w / 2 + 50, 100, '🎊');
      }
      updateHud(); save();
    }

    function drawFishShape(f, now, grow) {
      const size = 24 * f.size, kind = f.kind;
      const hh = size * (kind.shape === 'long' ? 0.5 : kind.shape === 'round' ? 0.92 : 0.7);
      ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      ctx.strokeStyle = '#3a3550'; ctx.lineWidth = size * 0.12;
      // 꼬리
      ctx.fillStyle = kind.color;
      ctx.beginPath(); ctx.moveTo(size * 0.62, 0); ctx.lineTo(size * 1.08, -hh * 0.8); ctx.lineTo(size * 0.96, 0); ctx.lineTo(size * 1.08, hh * 0.8); ctx.closePath(); ctx.fill(); ctx.stroke();
      // 지느러미
      ctx.beginPath(); ctx.moveTo(0, -hh * 0.7); ctx.lineTo(size * 0.22, -hh * 1.2); ctx.lineTo(size * 0.4, -hh * 0.55); ctx.closePath(); ctx.fill(); ctx.stroke();
      // 몸통
      ctx.beginPath(); ctx.ellipse(0, 0, size, hh, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      // 배
      ctx.fillStyle = kind.belly; ctx.beginPath(); ctx.ellipse(-size * 0.12, hh * 0.28, size * 0.55, hh * 0.5, 0, 0, Math.PI * 2); ctx.fill();
      // 눈
      const ex = -size * 0.5, ey = -hh * 0.18, er = size * 0.24;
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ex, ey, er, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#3a3550'; ctx.lineWidth = size * 0.05; ctx.stroke();
      // 표정
      const face = grow ? f.face : 'normal';
      const mx = -size * 0.72, my = size * 0.16;
      ctx.fillStyle = '#3a3550';
      if (face === 'wink') { ctx.strokeStyle = '#3a3550'; ctx.lineWidth = size * 0.07; ctx.beginPath(); ctx.moveTo(ex - er * 0.7, ey); ctx.lineTo(ex + er * 0.7, ey); ctx.stroke(); }
      else { const pr = face === 'wideeyes' ? er * 0.7 : er * 0.5; const py = (face === 'tongue' || face === 'wideeyes') ? ey - er * 0.3 : ey; ctx.beginPath(); ctx.arc(ex, py, pr, 0, Math.PI * 2); ctx.fill(); }
      ctx.strokeStyle = '#3a3550'; ctx.lineWidth = size * 0.06;
      if (face === 'tongue') { ctx.fillStyle = '#ff7a90'; ctx.beginPath(); ctx.ellipse(mx - size * 0.04, my + size * 0.12, size * 0.13, size * 0.17, 0, 0, Math.PI * 2); ctx.fill(); }
      ctx.beginPath();
      if (face === 'o') { ctx.arc(mx, my, size * 0.13, 0, Math.PI * 2); ctx.stroke(); }
      else { ctx.moveTo(mx - size * 0.14, my); ctx.quadraticCurveTo(mx, my + size * 0.14, mx + size * 0.16, my); ctx.stroke(); }
    }

    function frame(now) {
      if (!running) return;
      const grad = ctx.createLinearGradient(0, 0, 0, h); grad.addColorStop(0, '#7ecdf5'); grad.addColorStop(1, '#2a7fc9');
      ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#e8cf94'; ctx.beginPath(); ctx.ellipse(w / 2, h + 18, w * 0.75, 55, 0, Math.PI, 0); ctx.fill();
      ctx.font = '38px serif'; ctx.textAlign = 'center'; const sway = Math.sin(now / 900) * 4;
      ctx.fillText('🌿', w * 0.12 + sway, h - 18); ctx.fillText('🪸', w * 0.5 - sway, h - 14); ctx.fillText('🌿', w * 0.86 + sway, h - 18);
      if (Math.random() < 0.05) bubbles.push({ x: randBetween(20, w - 20), y: h, r: randBetween(3, 9), v: randBetween(0.5, 1.4) });
      ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 1.5;
      for (let i = bubbles.length - 1; i >= 0; i--) { const b = bubbles[i]; b.y -= b.v; b.x += Math.sin(now / 400 + b.r) * 0.4; if (b.y < -12) { bubbles.splice(i, 1); continue; } ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.stroke(); }
      const nowMs = Date.now();
      for (let i = foods.length - 1; i >= 0; i--) { const fd = foods[i]; if (!fd.landed) { fd.y += fd.vy; fd.x += Math.sin(now / 300 + i) * 0.3; if (fd.y > h - 30) { fd.y = h - 30; fd.landed = true; } } if (nowMs - fd.born > 20000) { foods.splice(i, 1); continue; } ctx.fillStyle = '#8d5524'; ctx.beginPath(); ctx.arc(fd.x, fd.y, 5, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#c68642'; ctx.beginPath(); ctx.arc(fd.x - 1.5, fd.y - 1.5, 2, 0, Math.PI * 2); ctx.fill(); }

      for (const f of fish) {
        let targetX = f.tx, targetY = f.ty, chasing = false, bestD = Infinity, bestIdx = -1;
        for (let i = 0; i < foods.length; i++) { const d = (foods[i].x - f.x) ** 2 + (foods[i].y - f.y) ** 2; if (d < bestD) { bestD = d; bestIdx = i; } }
        if (bestIdx >= 0) { targetX = foods[bestIdx].x; targetY = foods[bestIdx].y; chasing = true; }
        if (!f.trick && !chasing && now > f.nextTrickAt) startTrick(f, now);
        if (now > f.pauseUntil) {
          const dx = targetX - f.x, dy = targetY - f.y, dist = Math.hypot(dx, dy) || 1, speed = chasing ? 2.2 : 0.7;
          f.vx += (dx / dist) * 0.08 * (chasing ? 2.5 : 1); f.vy += (dy / dist) * 0.08 * (chasing ? 2.5 : 1);
          const v = Math.hypot(f.vx, f.vy); if (v > speed) { f.vx = (f.vx / v) * speed; f.vy = (f.vy / v) * speed; }
          f.x += f.vx; f.y += f.vy;
          if (!chasing && dist < 24) { f.pauseUntil = now + randBetween(600, 2200); newTarget(f); }
          if (chasing && dist < 22 * f.size) eatFood(f, bestIdx);
        }
        f.x = Math.max(30, Math.min(w - 30, f.x)); f.y = Math.max(40, Math.min(h - 36, f.y));
        let rot = 0, ox = 0, oy = 0; const grow = now < f.growUntil;
        if (f.trick) { const p = (now - f.trick.start) / f.trick.dur; if (p >= 1) f.trick = null;
          else if (f.trick.type === 'spin') rot = p * Math.PI * 4;
          else if (f.trick.type === 'loop') { const th = p * Math.PI * 2; ox = Math.sin(th) * 30; oy = -(1 - Math.cos(th)) * 30; rot = Math.sin(th) * 0.5; }
          else if (f.trick.type === 'wiggle') rot = Math.sin(p * Math.PI * 8) * 0.4;
          else if (f.trick.type === 'hearts' && now - f.trick.lastHeart > 220) { f.trick.lastHeart = now; emote(f.x + randBetween(-10, 10), f.y - 26, randPick(['💗', '🎵', '✨'])); }
        }
        const pop = grow ? 1 + Math.sin((f.growUntil - now) / 1300 * Math.PI * 4) * 0.07 : 1;
        ctx.save(); ctx.translate(f.x + ox, f.y + oy + Math.sin(now / 600 + f.seed) * 3);
        if (rot) ctx.rotate(rot); if (pop !== 1) ctx.scale(pop, pop); if (f.vx > 0.1) ctx.scale(-1, 1);
        drawFishShape(f, now, grow); ctx.restore();
      }

      if (now > kissCd && fish.length >= 2 && Math.random() < 0.02) { const a = randPick(fish), b = randPick(fish); if (a !== b && Math.hypot(a.x - b.x, a.y - b.y) < 55) { emote((a.x + b.x) / 2, (a.y + b.y) / 2 - 14, '💕'); kissCd = now + 2500; } }
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      for (let i = emotes.length - 1; i >= 0; i--) { const m = emotes[i]; m.y += m.vy; m.life -= 0.016; if (m.life <= 0) { emotes.splice(i, 1); continue; } ctx.globalAlpha = Math.min(1, m.life * 1.5); ctx.font = '22px serif'; ctx.fillText(m.ch, m.x, m.y); ctx.globalAlpha = 1; }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return { destroy() { running = false; if (raf) cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); save(); } };
  },
});
