// 🐠 아기 물고기 — 터치하면 먹이가 떨어지고, 먹이를 주면 물고기 가족이 늘어나요
GameShell.registerGame({
  id: 'aquarium',
  name: '아기 물고기',
  emoji: '🐠',
  desc: '내 어항 물고기 키우기',
  color: '#bfe9ff',

  init(body) {
    const FISH_TYPES = ['🐠', '🐟', '🐡', '🦐', '🐙', '🦈'];
    const FEEDS_PER_NEW_FISH = 8;
    const MAX_FISH = 12;

    body.innerHTML = `
      <canvas class="fill"></canvas>
      <div class="hud">
        <div class="pill fish-pill"></div>
        <div class="pill feed-pill"></div>
      </div>`;
    const canvas = body.querySelector('canvas');
    const fishPill = body.querySelector('.fish-pill');
    const feedPill = body.querySelector('.feed-pill');

    let { w, h, ctx } = fitCanvas(canvas);
    const onResize = () => { ({ w, h, ctx } = fitCanvas(canvas)); };
    window.addEventListener('resize', onResize);

    // 저장된 어항 불러오기
    const saved = Store.get('aquarium', null) || {
      fish: [{ type: '🐠', size: 1 }, { type: '🐟', size: 1 }, { type: '🐡', size: 1 }],
      feedCount: 0,
    };

    const fish = saved.fish.map((f) => ({
      type: f.type,
      size: f.size,
      x: randBetween(60, 400), y: randBetween(80, 300),
      vx: 0, vy: 0,
      tx: 0, ty: 0,
      pauseUntil: 0,
    }));
    let feedCount = saved.feedCount;
    let foods = [];
    let bubbles = [];
    let raf = null;
    let running = true;

    function save() {
      Store.set('aquarium', { fish: fish.map((f) => ({ type: f.type, size: f.size })), feedCount });
    }

    function updateHud() {
      fishPill.textContent = `🐠 물고기 ${fish.length}마리`;
      const left = FEEDS_PER_NEW_FISH - (feedCount % FEEDS_PER_NEW_FISH);
      feedPill.textContent = fish.length >= MAX_FISH ? '어항이 가득해요! 💕' : `🍒 먹이 ${left}번 주면 새 친구!`;
    }
    updateHud();

    function newTarget(f) {
      f.tx = randBetween(50, w - 50);
      f.ty = randBetween(60, h - 60);
    }
    fish.forEach((f) => { f.x = randBetween(50, Math.max(60, w - 50)); f.y = randBetween(60, Math.max(70, h - 60)); newTarget(f); });

    canvas.addEventListener('pointerdown', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // 먹이 3알 떨어뜨리기
      for (let i = 0; i < 3; i++) {
        foods.push({ x: x + randBetween(-16, 16), y: Math.min(y, 40) + randBetween(-8, 8), vy: randBetween(0.5, 1), landed: false, born: Date.now() });
      }
      Sound.blip();
    });

    function eatFood(f, food, fi) {
      foods.splice(fi, 1);
      feedCount++;
      f.size = Math.min(1.6, f.size + 0.015);
      Sound.pop();
      spawnFx(body, food.x, food.y, '💕');
      if (feedCount % FEEDS_PER_NEW_FISH === 0 && fish.length < MAX_FISH) {
        const nf = {
          type: randPick(FISH_TYPES), size: 0.8,
          x: w / 2, y: -30, vx: 0, vy: 0, tx: 0, ty: 0, pauseUntil: 0,
        };
        newTarget(nf);
        fish.push(nf);
        Sound.fanfare();
        spawnFx(body, w / 2, 80, '🎉');
        spawnFx(body, w / 2 - 50, 100, '🎊');
        spawnFx(body, w / 2 + 50, 100, '🎊');
      }
      updateHud();
      save();
    }

    function frame(now) {
      if (!running) return;

      // 배경 물
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#7ecdf5');
      grad.addColorStop(1, '#2a7fc9');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // 모래 + 수초
      ctx.fillStyle = '#e8cf94';
      ctx.beginPath();
      ctx.ellipse(w / 2, h + 18, w * 0.75, 55, 0, Math.PI, 0);
      ctx.fill();
      ctx.font = '38px serif';
      ctx.textAlign = 'center';
      const sway = Math.sin(now / 900) * 4;
      ctx.fillText('🌿', w * 0.12 + sway, h - 18);
      ctx.fillText('🪸', w * 0.5 - sway, h - 14);
      ctx.fillText('🌿', w * 0.86 + sway, h - 18);

      // 공기방울
      if (Math.random() < 0.05) bubbles.push({ x: randBetween(20, w - 20), y: h, r: randBetween(3, 9), v: randBetween(0.5, 1.4) });
      ctx.strokeStyle = 'rgba(255,255,255,.55)';
      ctx.lineWidth = 1.5;
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        b.y -= b.v;
        b.x += Math.sin(now / 400 + b.r) * 0.4;
        if (b.y < -12) { bubbles.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 먹이
      const nowMs = Date.now();
      for (let i = foods.length - 1; i >= 0; i--) {
        const fd = foods[i];
        if (!fd.landed) {
          fd.y += fd.vy;
          fd.x += Math.sin(now / 300 + i) * 0.3;
          if (fd.y > h - 30) { fd.y = h - 30; fd.landed = true; }
        }
        if (nowMs - fd.born > 20000) { foods.splice(i, 1); continue; }
        ctx.fillStyle = '#8d5524';
        ctx.beginPath();
        ctx.arc(fd.x, fd.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#c68642';
        ctx.beginPath();
        ctx.arc(fd.x - 1.5, fd.y - 1.5, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // 물고기
      for (const f of fish) {
        // 가장 가까운 먹이 찾기
        let targetX = f.tx, targetY = f.ty, chasing = false;
        let bestD = Infinity, bestIdx = -1;
        for (let i = 0; i < foods.length; i++) {
          const d = (foods[i].x - f.x) ** 2 + (foods[i].y - f.y) ** 2;
          if (d < bestD) { bestD = d; bestIdx = i; }
        }
        if (bestIdx >= 0) {
          targetX = foods[bestIdx].x; targetY = foods[bestIdx].y; chasing = true;
        }

        if (now > f.pauseUntil) {
          const dx = targetX - f.x, dy = targetY - f.y;
          const dist = Math.hypot(dx, dy) || 1;
          const speed = chasing ? 2.2 : 0.7;
          f.vx += (dx / dist) * 0.08 * (chasing ? 2.5 : 1);
          f.vy += (dy / dist) * 0.08 * (chasing ? 2.5 : 1);
          const v = Math.hypot(f.vx, f.vy);
          if (v > speed) { f.vx = (f.vx / v) * speed; f.vy = (f.vy / v) * speed; }
          f.x += f.vx; f.y += f.vy;

          if (!chasing && dist < 24) {
            f.pauseUntil = now + randBetween(600, 2200);
            newTarget(f);
          }
          if (chasing && dist < 20) eatFood(f, foods[bestIdx], bestIdx);
        }
        f.x = Math.max(30, Math.min(w - 30, f.x));
        f.y = Math.max(40, Math.min(h - 36, f.y));

        // 그리기 (이모지 물고기는 왼쪽을 봐서, 오른쪽으로 갈 땐 뒤집기)
        ctx.save();
        ctx.translate(f.x, f.y + Math.sin(now / 600 + f.tx) * 3);
        const fontSize = 40 * f.size;
        if (f.vx > 0.1) ctx.scale(-1, 1);
        ctx.font = `${fontSize}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(f.type, 0, 0);
        ctx.restore();
      }

      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return {
      destroy() {
        running = false;
        if (raf) cancelAnimationFrame(raf);
        window.removeEventListener('resize', onResize);
        save();
      },
    };
  },
});
