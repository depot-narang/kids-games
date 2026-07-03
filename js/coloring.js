// 🖍️ 색칠 놀이 — 도안을 고르고 색칠한 뒤 "완성!"을 누르면 동물 마을에서 살아 움직여요
GameShell.registerGame({
  id: 'coloring',
  name: '색칠 놀이',
  emoji: '🖍️',
  desc: '칠하면 살아 움직여요',
  color: '#ffe0c2',

  init(body) {
    const MAX_CREATURES = 12;

    function showTemplateSelect() {
      body.innerHTML = `
        <div class="template-select">
          <h3 style="font-size:clamp(22px,3.4vw,32px)">무엇을 색칠할까요?</h3>
          <div class="template-grid"></div>
        </div>`;
      const grid = body.querySelector('.template-grid');
      Object.entries(ColoringTemplates.templates).forEach(([id, tpl]) => {
        const card = document.createElement('button');
        card.className = 'template-card';
        card.innerHTML = ColoringTemplates.buildSVG(id, null) + `<span>${tpl.emoji} ${tpl.name}</span>`;
        card.addEventListener('click', () => { Sound.ding(); showColoring(id); });
        grid.appendChild(card);
      });
    }

    function showColoring(tplId) {
      const tpl = ColoringTemplates.templates[tplId];
      const colors = {}; // regionId -> color
      let selected = ColoringTemplates.PALETTE[0];

      body.innerHTML = `
        <div class="coloring-wrap">
          <div class="coloring-main">
            <div class="coloring-svg-holder">${ColoringTemplates.buildSVG(tplId, null)}</div>
            <div class="coloring-side">
              <div class="coloring-palette"></div>
              <button class="btn reset-btn">🔄 처음부터</button>
              <button class="btn big primary done-btn">✨ 완성!</button>
            </div>
          </div>
        </div>`;

      const svg = body.querySelector('svg');
      const palette = body.querySelector('.coloring-palette');

      ColoringTemplates.PALETTE.forEach((c, i) => {
        const dot = document.createElement('button');
        dot.className = 'color-dot' + (i === 0 ? ' selected' : '');
        dot.style.background = c;
        if (c === '#ffffff') dot.title = '지우기';
        dot.addEventListener('click', () => {
          selected = c;
          palette.querySelectorAll('.color-dot').forEach((d) => d.classList.remove('selected'));
          dot.classList.add('selected');
          Sound.blip();
        });
        palette.appendChild(dot);
      });

      svg.querySelectorAll('[data-region]').forEach((el) => {
        el.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          const id = el.getAttribute('data-region');
          el.setAttribute('fill', selected);
          if (selected === '#ffffff') delete colors[id];
          else colors[id] = selected;
          Sound.pop();
        });
      });

      body.querySelector('.reset-btn').addEventListener('click', () => {
        svg.querySelectorAll('[data-region]').forEach((el) => el.setAttribute('fill', '#ffffff'));
        Object.keys(colors).forEach((k) => delete colors[k]);
        Sound.buzz();
      });

      body.querySelector('.done-btn').addEventListener('click', (e) => {
        if (Object.keys(colors).length === 0) {
          // 아직 아무것도 안 칠했으면 살짝 흔들어서 알려주기
          const holder = body.querySelector('.coloring-svg-holder');
          holder.classList.remove('shake');
          void holder.offsetWidth;
          holder.classList.add('shake');
          Sound.buzz();
          return;
        }
        Sound.fanfare();
        const creatures = Store.get('creatures', []);
        creatures.push({ template: tplId, colors: { ...colors }, ts: Date.now() });
        while (creatures.length > MAX_CREATURES) creatures.shift();
        Store.set('creatures', creatures);
        GameShell.go('habitat', { justAdded: true });
      });
    }

    showTemplateSelect();
    return {};
  },
});
