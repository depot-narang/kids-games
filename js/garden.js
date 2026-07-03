// 🌷 내 정원 — 여러 공간(정원/방)을 카툰 테마로 만들고 과일로 꾸며요
GameShell.registerGame({
  id: 'garden',
  name: '내 정원',
  emoji: '🌷',
  section: 'garden',
  color: '#d4f0c5',

  init(body, actions) {
    const name = Player.current();

    // 저장 구조: places = [{id, theme, items:[{id,x,y,cost}]}]
    let data = Player.garden(name) || {};
    if (!data.places) {
      data.places = [];
      // 예전 데이터(outdoor/indoor 또는 items) → 기본 공간으로 이전
      const legacyOut = (data.outdoor || data.items || []);
      const legacyIn = (data.indoor || []);
      const conv = (arr) => arr.map((it) => ({ id: null, e: it.e, x: it.x, y: it.y, cost: it.cost }));
      data.places.push({ id: 'p' + Date.now(), theme: 'spring', items: conv(legacyOut) });
      if (legacyIn.length) data.places.push({ id: 'p' + (Date.now() + 1), theme: 'cozy', items: conv(legacyIn) });
    }
    let placeIdx = 0;
    let deleteMode = false;
    let manageMode = false;
    const canvasW = Math.max(1200, Math.round(window.innerWidth * 1.7));

    function save() { Player.setGarden(name, data); }
    function updateFruit() { actions.innerHTML = `<div class="pill">🍓 ${Player.totalFruits(name)}</div>`; }
    const refundOf = (item) => (item.cost != null ? item.cost : (Cartoon.COST[item.id] || 0));

    // 아이템 그림 (신규는 id, 예전 이모지 데이터는 e)
    function itemHTML(item) { return item.id ? Cartoon.item(item.id) : `<span class="emoji-fallback">${item.e || '⭐'}</span>`; }

    // ---------- 공간 목록 화면 ----------
    function showPlaces() {
      deleteMode = false;
      updateFruit();
      body.innerHTML = `<div class="hangul-center places-screen">
        <div class="places-head"><h3>${name}의 공간</h3>
          <button class="btn manage-toggle">${manageMode ? '✅ 다 됐어요' : '🗑️ 공간 정리'}</button></div>
        <div class="places-grid"></div></div>`;
      const grid = body.querySelector('.places-grid');
      data.places.forEach((place, i) => {
        const th = Cartoon.theme(place.theme) || Cartoon.THEMES[0];
        const card = document.createElement('div');
        card.className = 'place-card';
        card.innerHTML = `<div class="place-thumb" style="background:${th.css}"></div>` +
          `<span>${th.emoji} ${th.name}</span><small>${place.items.length}개 꾸밈</small>` +
          (manageMode ? `<button class="place-del">✕</button>` : '');
        card.addEventListener('click', (e) => {
          if (e.target.closest('.place-del')) { confirmDelete(i); return; }
          Sound.ding(); placeIdx = i; showEditor();
        });
        grid.appendChild(card);
      });
      if (data.places.length < 8 && !manageMode) {
        const add = document.createElement('button');
        add.className = 'place-card add';
        add.innerHTML = `<div class="place-thumb addthumb">＋</div><span>새 공간 만들기</span>`;
        add.addEventListener('click', () => { Sound.blip(); showThemePicker(); });
        grid.appendChild(add);
      }
      body.querySelector('.manage-toggle').addEventListener('click', () => { manageMode = !manageMode; Sound.blip(); showPlaces(); });
    }

    function confirmDelete(i) {
      const place = data.places[i];
      const th = Cartoon.theme(place.theme) || Cartoon.THEMES[0];
      const refund = place.items.reduce((s, it) => s + refundOf(it), 0);
      Sound.buzz();
      const overlay = document.createElement('div');
      overlay.className = 'overlay';
      overlay.innerHTML = `<div class="overlay-card"><h3>이 공간을 지울까요?</h3>
        <p>${th.emoji} ${th.name}${refund > 0 ? `<br>담긴 과일 🍓${refund}개를 돌려줘요` : ''}</p>
        <div class="overlay-buttons"><button class="btn big keep-b">아니요</button><button class="btn big primary del-b">네, 지울래요</button></div></div>`;
      body.appendChild(overlay);
      overlay.querySelector('.keep-b').addEventListener('click', () => { Sound.pop(); overlay.remove(); });
      overlay.querySelector('.del-b').addEventListener('click', () => {
        if (refund > 0) Player.addFruit(name, '🍓', refund);
        data.places.splice(i, 1); save();
        if (data.places.length === 0) manageMode = false;
        Sound.yay(); overlay.remove(); showPlaces();
      });
    }

    // ---------- 테마 고르기 ----------
    function showThemePicker() {
      body.innerHTML = `<div class="hangul-center places-screen"><h3>어떤 곳을 꾸밀까요?</h3><div class="places-grid theme-grid"></div>
        <button class="btn back-places">← 돌아가기</button></div>`;
      const grid = body.querySelector('.theme-grid');
      Cartoon.THEMES.forEach((th) => {
        const card = document.createElement('button');
        card.className = 'place-card';
        card.innerHTML = `<div class="place-thumb" style="background:${th.css}"></div><span>${th.emoji} ${th.name}</span>`;
        card.addEventListener('click', () => {
          Sound.ding();
          const place = { id: 'p' + Date.now(), theme: th.id, items: [] };
          data.places.push(place); save();
          placeIdx = data.places.length - 1; showEditor();
        });
        grid.appendChild(card);
      });
      body.querySelector('.back-places').addEventListener('click', () => { Sound.pop(); showPlaces(); });
    }

    // ---------- 꾸미기 화면 ----------
    function showEditor() {
      deleteMode = false;
      updateFruit();
      const place = data.places[placeIdx];
      const th = Cartoon.theme(place.theme) || Cartoon.THEMES[0];
      body.innerHTML = `
        <div class="garden-wrap">
          <div class="garden-topbar">
            <button class="btn to-places">🗂️ 공간</button>
            <span class="pill">${th.emoji} ${th.name}</span>
            <button class="btn trash-toggle">🗑️ 치우기</button>
          </div>
          <div class="garden-viewport"><div class="garden-canvas" style="width:${canvasW}px;background:${th.css}"></div></div>
          <div class="garden-shop"><div class="shop-items"></div></div>
        </div>`;
      const viewport = body.querySelector('.garden-viewport');
      const canvas = body.querySelector('.garden-canvas');
      const shopItems = body.querySelector('.shop-items');
      const trashBtn = body.querySelector('.trash-toggle');

      // 배경(테마 고정물 + 반복물) — 만질 수 없는 장식
      function renderBackground() {
        (th.fixtures || []).forEach((f) => addBg(Cartoon.motif(f.m), f.x * canvasW, f.y, f.w));
        if (th.repeat) {
          let k = 0;
          for (let x = canvasW * 0.08; x < canvasW - 80; x += th.repeat.step) {
            const m = th.repeat.list[k % th.repeat.list.length];
            addBg(Cartoon.motif(m), x, th.repeat.y, th.repeat.w);
            k++;
          }
        }
      }
      function addBg(html, xpx, yFrac, w) {
        const el = document.createElement('div');
        el.className = 'garden-bg';
        el.style.left = xpx + 'px';
        el.style.top = yFrac * 100 + '%';
        el.style.width = w + 'px';
        el.innerHTML = html;
        el.style.zIndex = 0;
        canvas.appendChild(el);
      }

      function makeItemEl(item) {
        const el = document.createElement('div');
        el.className = 'garden-item';
        el.style.left = item.x * 100 + '%';
        el.style.top = item.y * 100 + '%';
        el.style.zIndex = Math.round(item.y * 100) + 1;
        el.innerHTML = itemHTML(item);
        canvas.appendChild(el);
        let dragging = false, moved = false;
        el.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          if (deleteMode) {
            const gi = place.items.indexOf(item);
            if (gi >= 0) place.items.splice(gi, 1);
            el.remove();
            const refund = refundOf(item);
            if (refund > 0) Player.addFruit(name, '🍓', refund);
            updateFruit(); save(); Sound.pop();
            const br = body.getBoundingClientRect();
            spawnFx(body, e.clientX - br.left, e.clientY - br.top, '💨');
            if (refund > 0) spawnFx(body, e.clientX - br.left, e.clientY - br.top - 30, `🍓+${refund}`);
            return;
          }
          dragging = true; moved = false; el.setPointerCapture(e.pointerId); el.style.zIndex = 9999;
        });
        el.addEventListener('pointermove', (e) => {
          if (!dragging) return;
          moved = true;
          const r = canvas.getBoundingClientRect();
          item.x = Math.max(0.01, Math.min(0.99, (e.clientX - r.left) / r.width));
          item.y = Math.max(0.06, Math.min(0.97, (e.clientY - r.top) / r.height));
          el.style.left = item.x * 100 + '%'; el.style.top = item.y * 100 + '%';
        });
        const end = () => { if (dragging) { dragging = false; el.style.zIndex = Math.round(item.y * 100) + 1; if (moved) save(); } };
        el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
      }

      function buy(s) {
        if (!Player.spend(name, s.cost)) {
          trashBtn.classList.remove('shake'); void trashBtn.offsetWidth;
          const p = body.querySelector('.garden-topbar .pill'); p.classList.remove('shake'); void p.offsetWidth; p.classList.add('shake');
          Sound.buzz();
          return;
        }
        const cx = (viewport.scrollLeft + viewport.clientWidth / 2) / canvasW;
        const item = { id: s.id, cost: s.cost, x: Math.max(0.03, Math.min(0.97, cx + randBetween(-0.12, 0.12))), y: randBetween(0.55, 0.9) };
        place.items.push(item); makeItemEl(item);
        const hint = canvas.querySelector('.garden-hint'); if (hint) hint.remove();
        updateFruit(); save(); Sound.yay();
        spawnFx(body, viewport.getBoundingClientRect().left + viewport.clientWidth / 2, body.getBoundingClientRect().height * 0.42, '✨');
      }

      renderBackground();
      place.items.forEach(makeItemEl);
      if (place.items.length === 0) {
        const h = document.createElement('div');
        h.className = 'garden-hint';
        h.textContent = '← 밀어서 넓게, 아래에서 콕 눌러 꾸며요 →';
        h.style.left = (viewport.clientWidth / 2) + 'px';
        canvas.appendChild(h);
        setTimeout(() => { h.style.opacity = '0'; }, 3400);
      }

      Cartoon.shopFor(th.type).forEach((s) => {
        const b = document.createElement('button');
        b.className = 'shop-item';
        b.innerHTML = `<span class="shop-art">${Cartoon.item(s.id)}</span><span class="shop-cost">🍓${s.cost}</span>`;
        b.addEventListener('click', () => buy(s));
        shopItems.appendChild(b);
      });

      body.querySelector('.to-places').addEventListener('click', () => { Sound.pop(); showPlaces(); });
      trashBtn.addEventListener('click', () => {
        deleteMode = !deleteMode;
        trashBtn.classList.toggle('on', deleteMode);
        trashBtn.textContent = deleteMode ? '✅ 다 됐어요' : '🗑️ 치우기';
        canvas.classList.toggle('delete-mode', deleteMode);
        Sound.blip();
      });
    }

    showPlaces();
    return {};
  },
});
