// 🐠 아기 물고기 — 먹이 주고 키우는 내 어항. 물고기를 만지면 재롱을 부려요!
GameShell.registerGame({
  id: 'aquarium',
  name: '아기 물고기',
  emoji: '🐠',
  desc: '내 어항 물고기 키우기',
  color: '#bfe9ff',

  init(body) {
    const FISH_TYPES = ['🐠', '🐟', '🐡', '🦐', '🐙', '🦈', '🐢', '🦀', '🪼', '🐬'];
    const MAX_FISH = 30;
    const TRICKS = ['spin', 'loop', 'wiggle', 'hearts'];
    // 물고기가 늘어날수록 새 친구 조건이 조금씩 어려워져요
    const neededFor = (count) => 6 + Math.max(0, count - 3) * 4;

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

    // 저장된 어항 불러오기 (예전 저장분과 호환)
    const saved = Store.get('aquarium', null) || {
      fish: [{ type: '🐠', size: 1 }, { type: '🐟', size: 1 }, { type: '🐡', size: 1 }],
      feedCount: 0,
    };
    let feedCount = saved.feedCount || 0;
    let toNext = saved.toNext != null ? saved.toNext : 0;

    const fish = saved.fish.map((f) => ({
      type: f.type,
      size: f.size,
      x: randBetween(60, 400), y: randBetween(80, 300),
      vx: 0, vy: 0, tx: 0, ty: 0,
      pauseUntil: 0,
      trick: null,
      nextTrickAt: performance.now() + randBetween(4000, 15000),
    }));
    let foods = [];
    let bubbles = [];
    let emotes = []; // 떠오르는 하트/음표 이펙트
    let raf = null;
    let running = true;

    function save() {
      Store.set('aquarium', { fish: fish.map((f) => ({ type: f.type, size: f.size })), feedCount, toNext });
    }

    function updateHud() {
      fishPill.textContent = `🐠 물고기 ${fish.length}마리`;
      feedPill.textContent = fish.length >= MAX_FISH
        ? '와! 바다처럼 가득해요 🌊'
        : `🍒 새 친구까지 먹이 ${neededFor(fish.length) - toNext}번!`;
    }
    updateHud();

    function newTarget(f) {
      f.tx = randBetween(50, Math.max(60, w - 50));
      f.ty = randBetween(60, Math.max(70, h - 60));
    }
    fish.forEach((f) => { f.x = randBetween(50, Math.max(60, w - 50)); f.y = randBetween(60, Math.max(70, h - 60)); newTarget(f); });

    function emote(x, y, char) {
      emotes.push({ x, y, vy: randBetween(-1.2, -0.7), life: 1, char });
    }

    function startTrick(f, now, type) {
      f.trick = {
        type: type || randPick(TRICKS),
        start: now,
        dur: { spin: 1200, loop: 1600, wiggle: 900, hearts: 1000 }[type] || 1200,
        lastHeart: 0,
      };
      if (!f.trick.dur) f.trick.dur = 1200;
      f.nextTrickAt = now + randBetween(9000, 22000);
    }

    canvas.addEventListener('pointerdown', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // 물고기를 만졌으면 재롱 부리기
      for (const f of fish) {
        if (Math.hypot(f.x - x, f.y - y) < 36 * f.size) {
          startTrick(f, performance.now(), randPick(TRICKS));
          Sound.heart();
          emote(f.x, f.y - 24, '💗');
          return;
        }
      }
      // 아니면 먹이 3알 떨어뜨리기
      for (let i = 0; i < 3; i++) {
        foods.push({ x: x + randBetween(-16, 16), y: Math.min(y, 40) + randBetween(-8, 8), vy: randBetween(0.5, 1), landed: false, born: Date.now() });
      }
      Sound.blip();
    });

    function eatFood(f, food, fi) {
      foods.splice(fi, 1);
      feedCount++;
      toNext++;
      f.size = Math.min(1.6, f.size + 0.015);
      Sound.pop();
      emote(food.x, food.y, '💕');

      if (toNext >= neededFor(fish.length) && fish.length < MAX_FISH) {
        toNext = 0;
        const nf = {
          type: randPick(FISH_TYPES), size: 0.8,
          x: w / 2, y: -30, vx: 0, vy: 0, tx: 0, ty: 0, pauseUntil: 0,
          trick: null, nextTrickAt: performance.now() + randBetween(4000, 12000),
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

    let kissCooldown = 0;

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

        // 한가할 때 가끔 스스로 재롱 부리기
        if (!f.trick && !chasing && now > f.nextTrickAt) startTrick(f, now);

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

        // 재롱 상태 계산
        let rot = 0, ox = 0, oy = 0;
        if (f.trick) {
          const p = (now - f.trick.start) / f.trick.dur;
          if (p >= 1) {
            f.trick = null;
          } else if (f.trick.type === 'spin') {
            rot = p * Math.PI * 4; // 두 바퀴 빙글빙글
          } else if (f.trick.type === 'loop') {
            const th = p * Math.PI * 2; // 공중제비 한 바퀴
            ox = Math.sin(th) * 30;
            oy = -(1 - Math.cos(th)) * 30;
            rot = Math.sin(th) * 0.5;
          } else if (f.trick.type === 'wiggle') {
            rot = Math.sin(p * Math.PI * 8) * 0.4; // 신나는 몸흔들기
          } else if (f.trick.type === 'hearts') {
            if (now - f.trick.lastHeart > 220) {
              f.trick.lastHeart = now;
              emote(f.x + randBetween(-10, 10), f.y - 26, randPick(['💗', '🎵', '✨']));
            }
          }
        }

        // 그리기 (이모지 물고기는 왼쪽을 봐서, 오른쪽으로 갈 땐 뒤집기)
        ctx.save();
        ctx.translate(f.x + ox, f.y + oy + Math.sin(now / 600 + f.tx) * 3);
        if (rot) ctx.rotate(rot);
        const fontSize = 40 * f.size;
        if (f.vx > 0.1) ctx.scale(-1, 1);
        ctx.font = `${fontSize}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(f.type, 0, 0);
        ctx.restore();
      }

      // 가까이 지나가는 물고기끼리 뽀뽀 💕
      if (now > kissCooldown && fish.length >= 2 && Math.random() < 0.02) {
        const a = randPick(fish), b = randPick(fish);
        if (a !== b && Math.hypot(a.x - b.x, a.y - b.y) < 55) {
          emote((a.x + b.x) / 2, (a.y + b.y) / 2 - 14, '💕');
          kissCooldown = now + 2500;
        }
      }

      // 이펙트 (하트, 음표)
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let i = emotes.length - 1; i >= 0; i--) {
        const m = emotes[i];
        m.y += m.vy;
        m.life -= 0.016;
        if (m.life <= 0) { emotes.splice(i, 1); continue; }
        ctx.globalAlpha = Math.min(1, m.life * 1.5);
        ctx.font = '22px serif';
        ctx.fillText(m.char, m.x, m.y);
        ctx.globalAlpha = 1;
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
