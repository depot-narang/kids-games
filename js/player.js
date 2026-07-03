// 앱 전역 프로필 + 과일(공용 화폐) + 정원 데이터. 학습/게임/정원이 함께 써요.
const Player = (() => {
  // 예전 한글 쓰기 전용 데이터(hangul.*)를 player.*로 한 번만 옮겨오기
  (function migrate() {
    if (Store.get('player.migrated', false)) return;
    const old = Store.get('hangul.profiles', null);
    if (old && !Store.get('player.profiles', null)) {
      Store.set('player.profiles', old);
      old.forEach((p) => {
        const n = p.name;
        ['fruits', 'progress', 'daily'].forEach((k) => {
          const v = Store.get(`hangul.${n}.${k}`, null);
          if (v) Store.set(`player.${n}.${k}`, v);
        });
      });
      const cur = Store.get('hangul.current', null);
      if (cur) Store.set('player.current', cur);
    }
    Store.set('player.migrated', true);
  })();

  const FRUIT_TYPES = ['🍓', '🍎', '🍇', '🍉', '🍑', '🍊'];

  const api = {
    FRUIT_TYPES,
    list: () => Store.get('player.profiles', []),
    save: (l) => Store.set('player.profiles', l),
    current: () => Store.get('player.current', null),
    setCurrent: (n) => Store.set('player.current', n),
    currentProfile() { const n = api.current(); return api.list().find((p) => p.name === n) || null; },

    fruits: (n) => Store.get(`player.${n}.fruits`, {}),
    addFruit(n, f, c = 1) { if (!n) return; const b = api.fruits(n); b[f] = (b[f] || 0) + c; Store.set(`player.${n}.fruits`, b); },
    totalFruits(n) { return Object.values(api.fruits(n)).reduce((a, b) => a + b, 0); },
    // 정원 구매 등에서 과일을 종류 상관없이 n개 사용 (많은 것부터 차감)
    spend(n, count) {
      const b = api.fruits(n);
      if (Object.values(b).reduce((a, c) => a + c, 0) < count) return false;
      let need = count;
      Object.keys(b).sort((x, y) => b[y] - b[x]).forEach((f) => {
        if (need <= 0) return;
        const take = Math.min(b[f], need); b[f] -= take; need -= take;
        if (b[f] <= 0) delete b[f];
      });
      Store.set(`player.${n}.fruits`, b);
      return true;
    },

    // 학습용
    progress: (n) => Store.get(`player.${n}.progress`, {}),
    setProgress(n, cat, idx) { const p = api.progress(n); p[cat] = idx; Store.set(`player.${n}.progress`, p); },
    daily: (n) => Store.get(`player.${n}.daily`, {}),
    addDaily(n, c = 1) { if (!n) return; const d = api.daily(n); const k = api.todayKey(); d[k] = (d[k] || 0) + c; Store.set(`player.${n}.daily`, d); },
    todayKey() { const t = new Date(); return `${t.getFullYear()}-${t.getMonth() + 1}-${t.getDate()}`; },

    // 정원
    garden: (n) => Store.get(`player.${n}.garden`, { items: [] }),
    setGarden(n, g) { Store.set(`player.${n}.garden`, g); },

    avatarHTML(p) {
      return p && p.avatar && p.avatar.type === 'photo' ? `<img src="${p.avatar.value}" alt="">` : (p && p.avatar ? p.avatar.value : '🙂');
    },

    // ----- 프로필 선택 UI (host 안에 그려요) -----
    showPicker(host, opts) {
      const onPick = opts.onPick || (() => {});
      const profiles = api.list();
      host.innerHTML = `<div class="hangul-center"><h3>누가 할까요?</h3><div class="profile-row"></div></div>`;
      const row = host.querySelector('.profile-row');
      profiles.forEach((p) => {
        const card = document.createElement('button');
        card.className = 'profile-card';
        card.innerHTML = `<div class="avatar">${api.avatarHTML(p)}</div><div class="pname">${p.name}</div>` +
          `<small style="color:#a99;font-size:13px">🍓 ${api.totalFruits(p.name)}</small>`;
        card.addEventListener('click', () => { Sound.ding(); api.setCurrent(p.name); onPick(p.name); });
        row.appendChild(card);
      });
      if (profiles.length < 4) {
        const add = document.createElement('button');
        add.className = 'profile-card add';
        add.innerHTML = `<div class="avatar">＋</div><div class="pname">새 친구</div>`;
        add.addEventListener('click', () => { Sound.blip(); api.showCreate(host, { onDone: onPick, onCancel: () => api.showPicker(host, opts) }); });
        row.appendChild(add);
      }
    },

    showCreate(host, opts) {
      const emojis = ['🐰', '🐻', '🐱', '🦊', '🐼', '🦄', '🐸', '🐥', '🦋', '🐙'];
      let avatar = { type: 'emoji', value: emojis[0] };
      host.innerHTML = `
        <div class="hangul-center">
          <h3>새 친구 만들기</h3>
          <div class="avatar big-preview"></div>
          <input class="name-input" maxlength="6" placeholder="이름" />
          <div style="display:flex;gap:8px;"><button class="btn quick-joy">조이</button><button class="btn quick-chaea">채아</button></div>
          <div class="avatar-options"></div>
          <button class="btn camera-btn">📷 얼굴 사진 찍기</button>
          <div style="display:flex;gap:10px;"><button class="btn cancel-btn">취소</button><button class="btn big primary create-btn">만들기 ✨</button></div>
        </div>`;
      const preview = host.querySelector('.big-preview');
      const nameInput = host.querySelector('.name-input');
      const opt = host.querySelector('.avatar-options');
      const refresh = () => { preview.innerHTML = avatar.type === 'photo' ? `<img src="${avatar.value}">` : avatar.value; };
      refresh();
      emojis.forEach((e, i) => {
        const o = document.createElement('button');
        o.className = 'avatar-opt' + (i === 0 ? ' selected' : '');
        o.textContent = e;
        o.addEventListener('click', () => { avatar = { type: 'emoji', value: e }; opt.querySelectorAll('.avatar-opt').forEach((x) => x.classList.remove('selected')); o.classList.add('selected'); refresh(); Sound.blip(); });
        opt.appendChild(o);
      });
      host.querySelector('.quick-joy').addEventListener('click', () => { nameInput.value = '조이'; Sound.blip(); });
      host.querySelector('.quick-chaea').addEventListener('click', () => { nameInput.value = '채아'; Sound.blip(); });
      host.querySelector('.cancel-btn').addEventListener('click', () => { Sound.pop(); (opts.onCancel || (() => {}))(); });
      host.querySelector('.camera-btn').addEventListener('click', () => api.openCamera(host, (url) => { avatar = { type: 'photo', value: url }; opt.querySelectorAll('.avatar-opt').forEach((x) => x.classList.remove('selected')); refresh(); }));
      host.querySelector('.create-btn').addEventListener('click', () => {
        let name = (nameInput.value || '').trim();
        if (!name) { nameInput.classList.add('shake'); setTimeout(() => nameInput.classList.remove('shake'), 400); Sound.buzz(); return; }
        const list = api.list();
        if (list.some((p) => p.name === name)) name += '2';
        list.push({ name, avatar }); api.save(list); Sound.yay(); api.setCurrent(name); (opts.onDone || (() => {}))(name);
      });
    },

    openCamera(host, onCapture) {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { alert('이 기기에서는 카메라를 쓸 수 없어요. 그림 아바타를 골라주세요!'); return; }
      const overlay = document.createElement('div');
      overlay.className = 'overlay';
      overlay.innerHTML = `<div class="overlay-card"><h3>📷 얼굴을 찍어요</h3><video class="camera-view" autoplay playsinline></video><div class="overlay-buttons"><button class="btn cam-cancel">취소</button><button class="btn big primary cam-shoot">찰칵! 📸</button></div></div>`;
      host.appendChild(overlay);
      const video = overlay.querySelector('video');
      let stream = null;
      const close = () => { if (stream) stream.getTracks().forEach((t) => t.stop()); overlay.remove(); };
      overlay.querySelector('.cam-cancel').addEventListener('click', () => { Sound.pop(); close(); });
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
        .then((s) => { stream = s; video.srcObject = s; })
        .catch(() => { alert('카메라를 켤 수 없어요. 그림 아바타를 골라주세요!'); close(); });
      overlay.querySelector('.cam-shoot').addEventListener('click', () => {
        if (!video.videoWidth) return;
        const size = 160; const c = document.createElement('canvas'); c.width = size; c.height = size;
        const cx = c.getContext('2d'); const s = Math.min(video.videoWidth, video.videoHeight);
        cx.translate(size, 0); cx.scale(-1, 1);
        cx.drawImage(video, (video.videoWidth - s) / 2, (video.videoHeight - s) / 2, s, s, 0, 0, size, size);
        onCapture(c.toDataURL('image/jpeg', 0.7)); Sound.yay(); close();
      });
    },
  };
  return api;
})();

// 게임에서 이겼을 때 현재 친구에게 과일 보상 (+ 살짝 떠오르는 이펙트)
function Reward(fruit, count, x, y) {
  const n = Player.current();
  if (!n) return;
  Player.addFruit(n, fruit, count);
  const app = document.getElementById('app');
  if (app && x != null) for (let i = 0; i < count; i++) setTimeout(() => spawnFx(app, x + randBetween(-20, 20), y, fruit), i * 120);
}
