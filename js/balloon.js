// 🎈 풍선 팡팡 — 레벨이 오를수록 빨라지고, ❌풍선은 터뜨리면 안 돼요! (기록·등수)
GameShell.registerGame({
  id: 'balloon',
  name: '풍선 팡팡',
  emoji: '🎈',
  desc: '레벨 올리며 팡팡',
  color: '#ffd6e0',
  section: 'game',

  init(body) {
    body.innerHTML = `
      <canvas class="fill"></canvas>
      <div class="hud">
        <div class="pill score-pill">⭐ 0</div>
        <div class="pill level-pill">레벨 1</div>
        <div class="pill lives-pill">❤️❤️❤️</div>
      </div>`;
    const canvas = body.querySelector('canvas');
    const scorePill = body.querySelector('.score-pill');
    const levelPill = body.querySelector('.level-pill');
    const livesPill = body.querySelector('.lives-pill');

    let { w, h, ctx } = fitCanvas(canvas);
    const onResize = () => { ({ w, h, ctx } = fitCanvas(canvas)); };
    window.addEventListener('resize', onResize);

    let balloons, particles, score, level, lives, lastSpawn, flash, running, raf;

    function reset() {
      balloons = []; particles = []; score = 0; level = 1; lives = 3;
      lastSpawn = 0; flash = null; running = true;
      updateHud();
    }
    function updateHud() {
      scorePill.textContent = `⭐ ${score}`;
      levelPill.textContent = `레벨 ${level}`;
      livesPill.textContent = '❤️'.repeat(lives) + '🤍'.repeat(3 - lives);
    }

    function spawn(now) {
      const r = randBetween(30, 50);
      const xProb = level < 3 ? 0 : Math.min(0.34, (level - 2) * 0.06);
      const isX = Math.random() < xProb;
      balloons.push({
        x: randBetween(r + 10, w - r - 10), y: h + r + 20, r,
        hue: isX ? 0 : Math.floor(randBetween(0, 360)),
        isX,
        vy: randBetween(52, 96) / 60 * (1 + (level - 1) * 0.12),
        phase: randBetween(0, Math.PI * 2),
        shakeUntil: 0, born: now,
      });
    }

    function pop(b, i) {
      balloons.splice(i, 1);
      score++;
      const newLevel = Math.floor(score / 10) + 1;
      if (newLevel > level) { level = newLevel; flash = { txt: `레벨 ${level}! 🎉`, until: performance.now() + 1200 }; Sound.yay(); }
      updateHud();
      Sound.pop();
      for (let k = 0; k < 14; k++) particles.push({ x: b.x, y: b.y, vx: randBetween(-4, 4), vy: randBetween(-5, 2), r: randBetween(3, 7), hue: b.hue, life: 1 });
    }

    function hitX(b, i) {
      balloons.splice(i, 1);
      lives--; updateHud(); Sound.buzz();
      body.classList.add('shake'); setTimeout(() => body.classList.remove('shake'), 300);
      for (let k = 0; k < 10; k++) particles.push({ x: b.x, y: b.y, vx: randBetween(-4, 4), vy: randBetween(-4, 2), r: randBetween(3, 6), hue: 0, life: 1 });
      if (lives <= 0) gameOver();
    }

    canvas.addEventListener('pointerdown', (e) => {
      if (!running) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      for (let i = balloons.length - 1; i >= 0; i--) {
        const b = balloons[i];
        const dx = x - b.x, dy = y - b.y;
        if (dx * dx + dy * dy < (b.r + 14) * (b.r + 14)) {
          if (b.isX) hitX(b, i); else pop(b, i);
          return;
        }
      }
    });

    function gameOver() {
      running = false;
      const res = GameScore.finish('balloon', score, { reward: Math.floor(score / 5) + (score > 0 ? 1 : 0) });
      GameScore.showResult(body, {
        emoji: '🎈', title: `끝! ${score}점`,
        statLines: [`레벨 ${level}까지 갔어요`, ...res.lines],
        reward: res.reward,
        again: () => { reset(); },
        list: () => GameShell.showSection('game'),
      });
    }

    function drawBalloon(b, now) {
      const wob = Math.sin(now / 500 + b.phase) * 14;
      const shake = now < b.shakeUntil ? Math.sin(now / 20) * 6 : 0;
      const bx = b.x + wob + shake;
      ctx.strokeStyle = 'rgba(90,90,90,.5)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(bx, b.y + b.r * 1.15); ctx.quadraticCurveTo(bx + 8, b.y + b.r * 1.15 + 25, bx, b.y + b.r * 1.15 + 50); ctx.stroke();
      ctx.fillStyle = b.isX ? '#8a8a92' : `hsl(${b.hue} 85% 65%)`;
      ctx.beginPath(); ctx.ellipse(bx, b.y, b.r, b.r * 1.15, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(bx - 7, b.y + b.r * 1.15); ctx.lineTo(bx + 7, b.y + b.r * 1.15); ctx.lineTo(bx, b.y + b.r * 1.15 + 10); ctx.closePath(); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.45)';
      ctx.beginPath(); ctx.ellipse(bx - b.r * 0.35, b.y - b.r * 0.4, b.r * 0.22, b.r * 0.3, -0.5, 0, Math.PI * 2); ctx.fill();
      if (b.isX) {
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 6; ctx.lineCap = 'round';
        const s = b.r * 0.5;
        ctx.beginPath(); ctx.moveTo(bx - s, b.y - s); ctx.lineTo(bx + s, b.y + s); ctx.moveTo(bx + s, b.y - s); ctx.lineTo(bx - s, b.y + s); ctx.stroke();
      }
    }

    function step(now) {
      if (!running) return;
      const interval = Math.max(300, 640 - level * 34);
      const maxB = 8 + Math.round(level * 1.6);
      if (now - lastSpawn > interval && balloons.length < maxB) { spawn(now); lastSpawn = now; }
      ctx.clearRect(0, 0, w, h);
      for (let i = balloons.length - 1; i >= 0; i--) {
        const b = balloons[i];
        b.y -= b.vy * 1.6;
        if (b.y < -b.r - 40) { balloons.splice(i, 1); continue; }
        drawBalloon(b, now);
      }
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.life -= 0.03;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        ctx.globalAlpha = p.life; ctx.fillStyle = `hsl(${p.hue} 85% 60%)`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
      }
      if (flash && now < flash.until) {
        ctx.fillStyle = '#ff6f91'; ctx.font = `bold ${Math.min(w * 0.11, 56)}px Jua, sans-serif`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.globalAlpha = Math.min(1, (flash.until - now) / 600);
        ctx.fillText(flash.txt, w / 2, h * 0.3); ctx.globalAlpha = 1;
      }
    }
    function frame(now) { try { step(now); } catch (e) {} raf = requestAnimationFrame(frame); }

    reset();
    raf = requestAnimationFrame(frame);

    return {
      destroy() { running = false; if (raf) cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); },
    };
  },
});
