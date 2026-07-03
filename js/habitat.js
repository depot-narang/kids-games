// 🏡 동물 마을 — 색칠 놀이에서 완성한 친구들이 여기서 살아 움직여요
GameShell.registerGame({
  id: 'habitat',
  name: '동물 마을',
  emoji: '🏡',
  desc: '내가 만든 친구들',
  color: '#d4f0c5',

  init(body, actions, params) {
    body.innerHTML = `
      <div class="habitat-scene">
        <div class="habitat-sun"></div>
        <div class="habitat-pond"></div>
      </div>`;
    const scene = body.querySelector('.habitat-scene');
    const pond = body.querySelector('.habitat-pond');

    // 떠다니는 구름
    for (let i = 0; i < 3; i++) {
      const cloud = document.createElement('div');
      cloud.className = 'habitat-cloud';
      const cw = randBetween(80, 140);
      cloud.style.width = cw + 'px';
      cloud.style.height = cw * 0.4 + 'px';
      cloud.style.top = randBetween(4, 22) + '%';
      cloud.style.animationDuration = randBetween(40, 80) + 's';
      cloud.style.animationDelay = -randBetween(0, 40) + 's';
      scene.appendChild(cloud);
    }

    const data = Store.get('creatures', []);
    let raf = null;
    let running = true;
    let sceneW = scene.clientWidth || 800;
    let sceneH = scene.clientHeight || 500;
    const onResize = () => { sceneW = scene.clientWidth; sceneH = scene.clientHeight; };
    window.addEventListener('resize', onResize);

    // 빈 마을 안내
    if (data.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'habitat-empty';
      empty.innerHTML = `
        <p>아직 마을에 친구가 없어요!</p>
        <button class="btn big primary">🖍️ 색칠해서 친구 만들기</button>`;
      empty.querySelector('button').addEventListener('click', () => { Sound.ding(); GameShell.go('coloring'); });
      scene.appendChild(empty);
    } else {
      // 새 친구 만들러 가기 버튼
      const makeBtn = document.createElement('button');
      makeBtn.className = 'btn';
      makeBtn.textContent = '🖍️ 새 친구 만들기';
      makeBtn.style.cssText = 'position:absolute;right:14px;bottom:14px;z-index:10;';
      makeBtn.addEventListener('click', () => { Sound.ding(); GameShell.go('coloring'); });
      scene.appendChild(makeBtn);
    }

    // 생물 만들기
    const creatures = data.map((c, i) => {
      const tpl = ColoringTemplates.templates[c.template];
      if (!tpl) return null;
      const el = document.createElement('div');
      el.className = 'creature';
      const size = tpl.habitat === 'pond' ? 84 : tpl.habitat === 'fly' ? 88 : 104;
      el.style.width = size + 'px';
      el.style.height = size + 'px';
      el.innerHTML = ColoringTemplates.buildSVG(c.template, c.colors);
      scene.appendChild(el);

      const cr = {
        el, size,
        behavior: tpl.habitat,
        x: (0.15 + (i * 0.17) % 0.7) * sceneW,
        y: 0,
        dir: Math.random() < 0.5 ? -1 : 1,
        speed: randBetween(0.35, 0.7),
        phase: randBetween(0, Math.PI * 2),
        baseY: 0,
        jumpUntil: 0,
      };
      if (cr.behavior === 'fly') cr.y = randBetween(0.12, 0.45) * sceneH;
      if (cr.behavior === 'plant') cr.dir = 0;

      // 만지면 폴짝!
      el.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        cr.jumpUntil = performance.now() + 600;
        Sound.heart();
        const br = body.getBoundingClientRect();
        spawnFx(body, e.clientX - br.left, e.clientY - br.top, randPick(['💖', '💕', '⭐', '🎵']));
      });

      return cr;
    }).filter(Boolean);

    // 방금 색칠을 마치고 왔다면 축하 이펙트
    if (params.justAdded && creatures.length) {
      Sound.yay();
      setTimeout(() => {
        const last = creatures[creatures.length - 1];
        const r = last.el.getBoundingClientRect();
        const br = body.getBoundingClientRect();
        for (let i = 0; i < 5; i++) {
          setTimeout(() => spawnFx(body,
            r.left - br.left + randBetween(0, r.width),
            r.top - br.top + randBetween(0, r.height),
            randPick(['✨', '🌟', '🎉', '💖'])), i * 150);
        }
      }, 400);
    }

    function pondBounds() {
      return {
        left: pond.offsetLeft + 20,
        right: pond.offsetLeft + pond.offsetWidth - 20,
        top: pond.offsetTop + pond.offsetHeight * 0.25,
        bottom: pond.offsetTop + pond.offsetHeight * 0.7,
      };
    }

    function frame(now) {
      if (!running) return;
      const groundY = sceneH * 0.86;

      for (const cr of creatures) {
        const t = now / 1000;
        const jumping = now < cr.jumpUntil;
        const jumpY = jumping ? -Math.abs(Math.sin((cr.jumpUntil - now) / 600 * Math.PI * 2)) * 34 : 0;
        let x = cr.x, y, flip = false, rot = 0;

        if (cr.behavior === 'walk') {
          cr.x += cr.dir * cr.speed;
          if (cr.x < 20) { cr.x = 20; cr.dir = 1; }
          if (cr.x > sceneW - cr.size - 20) { cr.x = sceneW - cr.size - 20; cr.dir = -1; }
          // 가끔 방향 바꾸기
          if (Math.random() < 0.002) cr.dir *= -1;
          x = cr.x;
          y = groundY - cr.size + Math.abs(Math.sin(t * 5 + cr.phase)) * -5 + jumpY;
          flip = cr.dir > 0;
        } else if (cr.behavior === 'fly') {
          cr.x += cr.dir * cr.speed * 1.2;
          if (cr.x < 10) { cr.x = 10; cr.dir = 1; }
          if (cr.x > sceneW - cr.size - 10) { cr.x = sceneW - cr.size - 10; cr.dir = -1; }
          if (Math.random() < 0.003) cr.dir *= -1;
          x = cr.x;
          y = cr.y + Math.sin(t * 1.6 + cr.phase) * 26 + jumpY;
          rot = Math.sin(t * 2 + cr.phase) * 8;
        } else if (cr.behavior === 'pond') {
          const b = pondBounds();
          cr.x += cr.dir * cr.speed * 0.8;
          if (cr.x < b.left) { cr.x = b.left; cr.dir = 1; }
          if (cr.x > b.right - cr.size) { cr.x = b.right - cr.size; cr.dir = -1; }
          if (Math.random() < 0.003) cr.dir *= -1;
          x = cr.x;
          y = b.top + Math.sin(t * 1.4 + cr.phase) * 10 + jumpY * 0.5;
          flip = cr.dir > 0;
        } else { // plant (꽃)
          x = cr.x;
          y = groundY - cr.size + jumpY;
          rot = Math.sin(t * 1.2 + cr.phase) * 5;
        }

        cr.el.style.transform =
          `translate(${x}px, ${y}px) rotate(${rot}deg) ${flip ? 'scaleX(-1)' : ''}`;
        cr.el.style.zIndex = Math.round(y);
      }
      raf = requestAnimationFrame(frame);
    }

    // 물고기 초기 위치를 연못 안으로
    requestAnimationFrame(() => {
      onResize();
      const b = pondBounds();
      creatures.forEach((cr) => {
        if (cr.behavior === 'pond') cr.x = randBetween(b.left, Math.max(b.left + 1, b.right - cr.size));
        if (cr.behavior === 'plant') cr.x = randBetween(sceneW * 0.45, sceneW - cr.size - 20);
      });
      raf = requestAnimationFrame(frame);
    });

    return {
      destroy() {
        running = false;
        if (raf) cancelAnimationFrame(raf);
        window.removeEventListener('resize', onResize);
      },
    };
  },
});
