// 🎈 풍선 팡팡 — 떠오르는 풍선을 터치해서 터뜨리기 (자유 모드 / 숫자 모드)
GameShell.registerGame({
  id: 'balloon',
  name: '풍선 팡팡',
  emoji: '🎈',
  desc: '풍선을 팡팡 터뜨려요',
  color: '#ffd6e0',

  init(body, actions) {
    body.innerHTML = `
      <canvas class="fill"></canvas>
      <div class="hud">
        <div class="pill score-pill">⭐ 0</div>
        <div class="pill target-pill" style="display:none"></div>
        <button class="btn mode-btn">🔢 숫자 놀이</button>
      </div>`;

    const canvas = body.querySelector('canvas');
    const scorePill = body.querySelector('.score-pill');
    const targetPill = body.querySelector('.target-pill');
    const modeBtn = body.querySelector('.mode-btn');

    let { w, h, ctx } = fitCanvas(canvas);
    const onResize = () => { ({ w, h, ctx } = fitCanvas(canvas)); };
    window.addEventListener('resize', onResize);

    let balloons = [];
    let particles = [];
    let score = 0;
    let mode = 'free'; // free | number
    let target = 1;
    let lastSpawn = 0;
    let raf = null;
    let running = true;

    function newTarget() {
      target = 1 + Math.floor(Math.random() * 9);
      targetPill.textContent = `숫자 ${target} 을 찾아 팡!`;
    }

    modeBtn.addEventListener('click', () => {
      mode = mode === 'free' ? 'number' : 'free';
      modeBtn.textContent = mode === 'free' ? '🔢 숫자 놀이' : '🎈 자유 놀이';
      targetPill.style.display = mode === 'number' ? '' : 'none';
      balloons = [];
      if (mode === 'number') newTarget();
      Sound.ding();
    });

    function spawn(now) {
      const r = randBetween(30, 52);
      balloons.push({
        x: randBetween(r + 10, w - r - 10),
        y: h + r + 20,
        r,
        hue: Math.floor(randBetween(0, 360)),
        vy: randBetween(55, 110) / 60,
        phase: randBetween(0, Math.PI * 2),
        num: 1 + Math.floor(Math.random() * 9),
        shakeUntil: 0,
        born: now,
      });
    }

    function popBalloon(b, i) {
      balloons.splice(i, 1);
      score++;
      scorePill.textContent = `⭐ ${score}`;
      Sound.pop();
      for (let k = 0; k < 14; k++) {
        particles.push({
          x: b.x, y: b.y,
          vx: randBetween(-4, 4), vy: randBetween(-5, 2),
          r: randBetween(3, 7), hue: b.hue, life: 1,
        });
      }
    }

    canvas.addEventListener('pointerdown', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      for (let i = balloons.length - 1; i >= 0; i--) {
        const b = balloons[i];
        const dx = x - b.x, dy = y - b.y;
        if (dx * dx + dy * dy < (b.r + 14) * (b.r + 14)) {
          if (mode === 'number' && b.num !== target) {
            b.shakeUntil = performance.now() + 350;
            Sound.buzz();
          } else {
            popBalloon(b, i);
            if (mode === 'number') newTarget();
          }
          return;
        }
      }
    });

    function frame(now) {
      if (!running) return;
      const interval = mode === 'number' ? 900 : 620;
      if (now - lastSpawn > interval && balloons.length < 14) {
        spawn(now);
        lastSpawn = now;
      }

      ctx.clearRect(0, 0, w, h);

      // 풍선
      for (let i = balloons.length - 1; i >= 0; i--) {
        const b = balloons[i];
        b.y -= b.vy * 1.6;
        const wob = Math.sin(now / 500 + b.phase) * 14;
        if (b.y < -b.r - 40) { balloons.splice(i, 1); continue; }
        const shake = now < b.shakeUntil ? Math.sin(now / 20) * 6 : 0;
        const bx = b.x + wob + shake;

        // 줄
        ctx.strokeStyle = 'rgba(90,90,90,.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(bx, b.y + b.r * 1.15);
        ctx.quadraticCurveTo(bx + 8, b.y + b.r * 1.15 + 25, bx, b.y + b.r * 1.15 + 50);
        ctx.stroke();

        // 풍선 몸통
        ctx.fillStyle = `hsl(${b.hue} 85% 65%)`;
        ctx.beginPath();
        ctx.ellipse(bx, b.y, b.r, b.r * 1.15, 0, 0, Math.PI * 2);
        ctx.fill();
        // 매듭
        ctx.beginPath();
        ctx.moveTo(bx - 7, b.y + b.r * 1.15);
        ctx.lineTo(bx + 7, b.y + b.r * 1.15);
        ctx.lineTo(bx, b.y + b.r * 1.15 + 10);
        ctx.closePath();
        ctx.fill();
        // 하이라이트
        ctx.fillStyle = 'rgba(255,255,255,.45)';
        ctx.beginPath();
        ctx.ellipse(bx - b.r * 0.35, b.y - b.r * 0.4, b.r * 0.22, b.r * 0.3, -0.5, 0, Math.PI * 2);
        ctx.fill();

        if (mode === 'number') {
          ctx.fillStyle = '#fff';
          ctx.font = `bold ${Math.round(b.r * 0.9)}px Jua, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(b.num, bx, b.y + 2);
        }
      }

      // 팡 터진 조각
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.life -= 0.03;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        ctx.globalAlpha = p.life;
        ctx.fillStyle = `hsl(${p.hue} 85% 60%)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
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
      },
    };
  },
});
