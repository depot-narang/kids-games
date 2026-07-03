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
    const drawings = Store.get('freedrawings', []);
    let raf = null;
    let running = true;
    let sceneW = scene.clientWidth || 800;
    let sceneH = scene.clientHeight || 500;
    const onResize = () => { sceneW = scene.clientWidth; sceneH = scene.clientHeight; };
    window.addEventListener('resize', onResize);

    // 빈 마을 안내
    if (data.length === 0 && drawings.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'habitat-empty';
      empty.innerHTML = `
        <p>아직 마을에 친구가 없어요!</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center">
          <button class="btn big primary color-go">🖍️ 색칠해서 만들기</button>
          <button class="btn big draw-go">🎨 그려서 만들기</button>
        </div>`;
      empty.querySelector('.color-go').addEventListener('click', () => { Sound.ding(); GameShell.go('coloring'); });
      empty.querySelector('.draw-go').addEventListener('click', () => { Sound.ding(); GameShell.go('paint'); });
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

    // 만지면 폴짝 + 하트
    function makeTappable(el, cr) {
      el.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        cr.jumpUntil = performance.now() + 600;
        Sound.heart();
        const br = body.getBoundingClientRect();
        spawnFx(body, e.clientX - br.left, e.clientY - br.top, randPick(['💖', '💕', '⭐', '🎵']));
      });
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

      makeTappable(el, cr);
      return cr;
    }).filter(Boolean);

    // 그림 그리기에서 완성한 자유 그림들도 마을을 걸어다녀요
    drawings.forEach((url, i) => {
      const el = document.createElement('div');
      el.className = 'creature drawing';
      const size = 96;
      el.style.width = size + 'px';
      el.style.height = size + 'px';
      el.innerHTML = `<img src="${url}" alt="내 그림">`;
      scene.appendChild(el);
      const cr = {
        el, size, behavior: 'walk',
        x: (0.2 + (i * 0.21) % 0.7) * sceneW, y: 0,
        dir: Math.random() < 0.5 ? -1 : 1,
        speed: randBetween(0.3, 0.6),
        phase: randBetween(0, Math.PI * 2), jumpUntil: 0,
      };
      makeTappable(el, cr);
      creatures.push(cr);
    });

    // 방금 새 친구를 만들고 왔다면 축하 이펙트
    if (params.justAdded && creatures.length) {
      Sound.yay();
      setTimeout(() => {
        const br = body.getBoundingClientRect();
        for (let i = 0; i < 8; i++) {
          setTimeout(() => spawnFx(body,
            br.width * randBetween(0.25, 0.75),
            br.height * randBetween(0.2, 0.5),
            randPick(['✨', '🌟', '🎉', '💖', '🎊'])), i * 120);
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
          // 연못은 밟지 않고 오른쪽 풀밭에서만 걸어요
          const minX = pond.offsetLeft + pond.offsetWidth + 6;
          cr.x += cr.dir * cr.speed;
          if (cr.x < minX) { cr.x = minX; cr.dir = 1; }
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
