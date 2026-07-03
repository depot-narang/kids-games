// 🌷 내 정원 — 학습·게임으로 모은 과일로 꾸미는 나만의 공간 (친구별로 저장)
GameShell.registerGame({
  id: 'garden',
  name: '내 정원',
  emoji: '🌷',
  section: 'garden',
  color: '#d4f0c5',

  init(body, actions) {
    const SHOP = [
      { e: '🌷', cost: 3 }, { e: '🌻', cost: 3 }, { e: '🌹', cost: 4 }, { e: '🌸', cost: 3 }, { e: '🌼', cost: 3 },
      { e: '🍄', cost: 4 }, { e: '🌵', cost: 4 }, { e: '🌳', cost: 6 }, { e: '🌲', cost: 6 }, { e: '🎄', cost: 8 },
      { e: '🦋', cost: 3 }, { e: '🐝', cost: 3 }, { e: '🐤', cost: 4 }, { e: '🐇', cost: 5 }, { e: '🐿️', cost: 5 },
      { e: '🦔', cost: 5 }, { e: '🐢', cost: 5 }, { e: '🐞', cost: 3 }, { e: '🐸', cost: 4 },
      { e: '⛲', cost: 12 }, { e: '🏰', cost: 20 }, { e: '🏡', cost: 15 }, { e: '⛺', cost: 10 }, { e: '🪑', cost: 6 },
      { e: '🚲', cost: 7 }, { e: '🎈', cost: 3 }, { e: '🎀', cost: 2 }, { e: '⭐', cost: 2 }, { e: '🌈', cost: 10 }, { e: '☁️', cost: 2 },
    ];

    const name = Player.current();
    let garden = Player.garden(name);
    if (!garden.items) garden = { items: [] };
    let deleteMode = false;

    body.innerHTML = `
      <div class="garden-wrap">
        <div class="garden-scene"><div class="garden-sun"></div></div>
        <div class="garden-shop">
          <div class="shop-title">
            <span class="pill garden-fruit"></span>
            <button class="btn trash-toggle">🗑️ 치우기</button>
          </div>
          <div class="shop-items"></div>
        </div>
      </div>`;
    const scene = body.querySelector('.garden-scene');
    const shopItems = body.querySelector('.shop-items');
    const fruitPill = body.querySelector('.garden-fruit');
    const trashBtn = body.querySelector('.trash-toggle');

    function save() { Player.setGarden(name, garden); }
    function updateFruit() {
      fruitPill.textContent = `🍓 과일 ${Player.totalFruits(name)}개`;
      const hf = actions;
      hf.innerHTML = `<div class="pill">🍓 ${Player.totalFruits(name)}</div>`;
    }

    function makeItemEl(item, idx) {
      const el = document.createElement('div');
      el.className = 'garden-item';
      el.textContent = item.e;
      el.style.left = item.x * 100 + '%';
      el.style.top = item.y * 100 + '%';
      scene.appendChild(el);

      let dragging = false, moved = false;
      el.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        if (deleteMode) {
          const gi = garden.items.indexOf(item);
          if (gi >= 0) garden.items.splice(gi, 1);
          el.remove(); save(); Sound.pop();
          const br = body.getBoundingClientRect();
          spawnFx(body, e.clientX - br.left, e.clientY - br.top, '💨');
          return;
        }
        dragging = true; moved = false;
        el.setPointerCapture(e.pointerId);
        el.style.zIndex = 999;
      });
      el.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        moved = true;
        const r = scene.getBoundingClientRect();
        item.x = Math.max(0.03, Math.min(0.97, (e.clientX - r.left) / r.width));
        item.y = Math.max(0.06, Math.min(0.96, (e.clientY - r.top) / r.height));
        el.style.left = item.x * 100 + '%';
        el.style.top = item.y * 100 + '%';
        el.style.zIndex = Math.round(item.y * 100);
      });
      const end = () => { if (dragging) { dragging = false; el.style.zIndex = Math.round(item.y * 100); if (moved) save(); } };
      el.addEventListener('pointerup', end);
      el.addEventListener('pointercancel', end);
    }

    function renderGarden() {
      scene.querySelectorAll('.garden-item').forEach((n) => n.remove());
      garden.items.forEach((item, i) => makeItemEl(item, i));
      updateEmpty();
    }
    function updateEmpty() {
      let hint = scene.querySelector('.garden-hint');
      if (garden.items.length === 0) {
        if (!hint) {
          hint = document.createElement('div');
          hint.className = 'garden-hint';
          hint.innerHTML = `<p>아래에서 마음에 드는 걸 콕! 눌러<br>정원을 꾸며보세요 🌱</p>`;
          scene.appendChild(hint);
        }
      } else if (hint) hint.remove();
    }

    function buy(item) {
      if (!Player.spend(name, item.cost)) {
        fruitPill.classList.remove('shake'); void fruitPill.offsetWidth; fruitPill.classList.add('shake');
        Sound.buzz();
        return;
      }
      const placed = { e: item.e, x: randBetween(0.25, 0.75), y: randBetween(0.4, 0.85) };
      garden.items.push(placed);
      makeItemEl(placed, garden.items.length - 1);
      updateEmpty(); updateFruit(); save();
      Sound.yay();
      const el = scene.lastChild;
      const r = el.getBoundingClientRect(); const br = body.getBoundingClientRect();
      spawnFx(body, r.left - br.left + r.width / 2, r.top - br.top, '✨');
    }

    SHOP.forEach((item) => {
      const b = document.createElement('button');
      b.className = 'shop-item';
      b.innerHTML = `<span class="shop-emoji">${item.e}</span><span class="shop-cost">🍓${item.cost}</span>`;
      b.addEventListener('click', () => buy(item));
      shopItems.appendChild(b);
    });

    trashBtn.addEventListener('click', () => {
      deleteMode = !deleteMode;
      trashBtn.classList.toggle('on', deleteMode);
      trashBtn.textContent = deleteMode ? '✅ 다 됐어요' : '🗑️ 치우기';
      scene.classList.toggle('delete-mode', deleteMode);
      Sound.blip();
    });

    updateFruit();
    renderGarden();

    return {};
  },
});
