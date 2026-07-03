// 🌷 내 정원 — 넓은 마당 + 집 안(방)을 과일로 꾸며요. 좌우로 스크롤해서 자유롭게 배치!
GameShell.registerGame({
  id: 'garden',
  name: '내 정원',
  emoji: '🌷',
  section: 'garden',
  color: '#d4f0c5',

  init(body, actions) {
    const SHOPS = {
      outdoor: [
        { e: '🌷', cost: 3 }, { e: '🌻', cost: 3 }, { e: '🌹', cost: 4 }, { e: '🌸', cost: 3 }, { e: '🌼', cost: 3 },
        { e: '🌵', cost: 4 }, { e: '🍄', cost: 4 }, { e: '🌳', cost: 6 }, { e: '🌲', cost: 6 }, { e: '🎄', cost: 8 }, { e: '🌴', cost: 7 },
        { e: '🦋', cost: 3 }, { e: '🐝', cost: 3 }, { e: '🐞', cost: 3 }, { e: '🐤', cost: 4 }, { e: '🐇', cost: 5 }, { e: '🐿️', cost: 5 },
        { e: '🦔', cost: 5 }, { e: '🐢', cost: 5 }, { e: '🐸', cost: 4 }, { e: '🦆', cost: 5 }, { e: '🐱', cost: 6 }, { e: '🐶', cost: 6 },
        { e: '⛲', cost: 12 }, { e: '🏰', cost: 20 }, { e: '🏡', cost: 15 }, { e: '⛺', cost: 10 }, { e: '🎠', cost: 16 }, { e: '🪧', cost: 4 },
        { e: '🚲', cost: 7 }, { e: '🎈', cost: 3 }, { e: '🎀', cost: 2 }, { e: '⭐', cost: 2 }, { e: '🌈', cost: 10 }, { e: '☁️', cost: 2 },
      ],
      indoor: [
        { e: '🛋️', cost: 12 }, { e: '🪑', cost: 5 }, { e: '🛏️', cost: 12 }, { e: '🍽️', cost: 6 }, { e: '🪆', cost: 4 },
        { e: '📺', cost: 10 }, { e: '🖼️', cost: 5 }, { e: '🪴', cost: 5 }, { e: '🕯️', cost: 3 }, { e: '💡', cost: 4 }, { e: '🛁', cost: 10 },
        { e: '🧸', cost: 5 }, { e: '📚', cost: 6 }, { e: '🧺', cost: 4 }, { e: '⏰', cost: 4 }, { e: '🪞', cost: 6 }, { e: '🚪', cost: 5 },
        { e: '🪟', cost: 5 }, { e: '🕰️', cost: 7 }, { e: '🎹', cost: 14 }, { e: '🎸', cost: 10 }, { e: '🧊', cost: 12 }, { e: '☕', cost: 3 },
        { e: '🎂', cost: 6 }, { e: '🧁', cost: 3 }, { e: '🎈', cost: 3 }, { e: '🎀', cost: 2 }, { e: '🪅', cost: 6 }, { e: '🐱', cost: 6 },
        { e: '🐶', cost: 6 }, { e: '🐟', cost: 5 }, { e: '🎮', cost: 8 }, { e: '🚀', cost: 6 }, { e: '⭐', cost: 2 }, { e: '🌈', cost: 8 },
      ],
    };

    const name = Player.current();
    // 저장 데이터 (예전 {items:[]} → outdoor 로 옮김)
    let garden = Player.garden(name) || {};
    if (garden.items && !garden.outdoor) garden = { outdoor: garden.items, indoor: [] };
    if (!garden.outdoor) garden.outdoor = [];
    if (!garden.indoor) garden.indoor = [];

    let area = 'outdoor';
    let deleteMode = false;
    const canvasW = Math.max(1500, Math.round(window.innerWidth * 2.3));

    body.innerHTML = `
      <div class="garden-wrap">
        <div class="garden-tabs">
          <button class="tab-btn on" data-area="outdoor">🌳 마당</button>
          <button class="tab-btn" data-area="indoor">🏠 방</button>
        </div>
        <div class="garden-viewport"><div class="garden-canvas outdoor" style="width:${canvasW}px"></div></div>
        <div class="garden-shop">
          <div class="shop-title"><span class="pill garden-fruit"></span><button class="btn trash-toggle">🗑️ 치우기</button></div>
          <div class="shop-items"></div>
        </div>
      </div>`;

    const viewport = body.querySelector('.garden-viewport');
    const canvas = body.querySelector('.garden-canvas');
    const shopItems = body.querySelector('.shop-items');
    const fruitPill = body.querySelector('.garden-fruit');
    const trashBtn = body.querySelector('.trash-toggle');

    function save() { Player.setGarden(name, garden); }
    function updateFruit() {
      fruitPill.textContent = `🍓 과일 ${Player.totalFruits(name)}개`;
      actions.innerHTML = `<div class="pill">🍓 ${Player.totalFruits(name)}</div>`;
    }

    function makeItemEl(item) {
      const el = document.createElement('div');
      el.className = 'garden-item';
      el.textContent = item.e;
      el.style.left = item.x * 100 + '%';
      el.style.top = item.y * 100 + '%';
      el.style.zIndex = Math.round(item.y * 100);
      canvas.appendChild(el);
      let dragging = false, moved = false;
      el.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        if (deleteMode) {
          const arr = garden[area]; const gi = arr.indexOf(item);
          if (gi >= 0) arr.splice(gi, 1);
          el.remove(); save();
          Sound.pop();
          const br = body.getBoundingClientRect();
          spawnFx(body, e.clientX - br.left, e.clientY - br.top, '💨');
          return;
        }
        dragging = true; moved = false; el.setPointerCapture(e.pointerId); el.style.zIndex = 9999;
      });
      el.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        moved = true;
        const r = canvas.getBoundingClientRect();
        item.x = Math.max(0.01, Math.min(0.99, (e.clientX - r.left) / r.width));
        item.y = Math.max(0.06, Math.min(0.96, (e.clientY - r.top) / r.height));
        el.style.left = item.x * 100 + '%'; el.style.top = item.y * 100 + '%';
      });
      const end = () => { if (dragging) { dragging = false; el.style.zIndex = Math.round(item.y * 100); if (moved) save(); } };
      el.addEventListener('pointerup', end);
      el.addEventListener('pointercancel', end);
    }

    function showHint(text) {
      const old = canvas.querySelector('.garden-hint'); if (old) old.remove();
      const h = document.createElement('div');
      h.className = 'garden-hint'; h.textContent = text;
      h.style.left = (viewport.scrollLeft + viewport.clientWidth / 2) + 'px';
      canvas.appendChild(h);
      setTimeout(() => { h.style.opacity = '0'; setTimeout(() => h.remove(), 700); }, 3200);
    }

    function renderArea() {
      canvas.className = 'garden-canvas ' + area + (deleteMode ? ' delete-mode' : '');
      canvas.innerHTML = area === 'outdoor' ? '<div class="garden-sun"></div>' : '';
      garden[area].forEach((item) => makeItemEl(item));
      if (garden[area].length === 0) showHint('← 밀어서 넓게, 콕 눌러 꾸며요 →');
      // 상점 교체
      shopItems.innerHTML = '';
      SHOPS[area].forEach((item) => {
        const b = document.createElement('button');
        b.className = 'shop-item';
        b.innerHTML = `<span class="shop-emoji">${item.e}</span><span class="shop-cost">🍓${item.cost}</span>`;
        b.addEventListener('click', () => buy(item));
        shopItems.appendChild(b);
      });
    }

    function buy(item) {
      if (!Player.spend(name, item.cost)) {
        fruitPill.classList.remove('shake'); void fruitPill.offsetWidth; fruitPill.classList.add('shake');
        Sound.buzz();
        return;
      }
      // 지금 보고 있는 화면 가운데에 놓기
      const cx = (viewport.scrollLeft + viewport.clientWidth / 2) / canvasW;
      const placed = { e: item.e, x: Math.max(0.03, Math.min(0.97, cx + randBetween(-0.12, 0.12))), y: randBetween(area === 'indoor' ? 0.62 : 0.55, 0.9) };
      garden[area].push(placed);
      makeItemEl(placed);
      const hint = canvas.querySelector('.garden-hint'); if (hint) hint.remove();
      updateFruit(); save(); Sound.yay();
      spawnFx(body, viewport.clientWidth / 2 + viewport.getBoundingClientRect().left, body.getBoundingClientRect().height * 0.4, '✨');
    }

    body.querySelectorAll('.tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn.dataset.area === area) return;
        area = btn.dataset.area;
        body.querySelectorAll('.tab-btn').forEach((b) => b.classList.toggle('on', b.dataset.area === area));
        viewport.scrollLeft = 0;
        renderArea();
        Sound.ding();
      });
    });

    trashBtn.addEventListener('click', () => {
      deleteMode = !deleteMode;
      trashBtn.classList.toggle('on', deleteMode);
      trashBtn.textContent = deleteMode ? '✅ 다 됐어요' : '🗑️ 치우기';
      canvas.classList.toggle('delete-mode', deleteMode);
      Sound.blip();
    });

    updateFruit();
    renderArea();
    return {};
  },
});
