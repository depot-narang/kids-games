// 🎨 그림 그리기 — 자유롭게 그리는 물감 캔버스 (붓/무지개/뿌리기/지우개, 저장)
GameShell.registerGame({
  id: 'paint',
  name: '그림 그리기',
  emoji: '🎨',
  desc: '마음껏 물감 놀이',
  color: '#fff2b8',

  init(body, actions) {
    const COLORS = ColoringTemplates.PALETTE.filter((c) => c !== '#ffffff');
    body.innerHTML = `
      <div class="paint-wrap">
        <div class="paint-canvas-holder"><canvas class="fill"></canvas></div>
        <div class="paint-toolbar">
          <div class="colors"></div>
          <span class="toolbar-gap"></span>
          <button class="tool-btn size-btn" data-size="6">•</button>
          <button class="tool-btn size-btn selected" data-size="14" style="font-size:28px">•</button>
          <button class="tool-btn size-btn" data-size="28" style="font-size:40px">•</button>
          <span class="toolbar-gap"></span>
          <button class="tool-btn tool-select selected" data-tool="brush" title="붓">🖌️</button>
          <button class="tool-btn tool-select" data-tool="crayon" title="크레용">🖍️</button>
          <button class="tool-btn tool-select" data-tool="marker" title="마커">🖊️</button>
          <button class="tool-btn tool-select" data-tool="rainbow" title="무지개">🌈</button>
          <button class="tool-btn tool-select" data-tool="splat" title="물감 뿌리기">💦</button>
          <button class="tool-btn tool-select" data-tool="eraser" title="지우개">🧽</button>
          <span class="toolbar-gap"></span>
          <button class="tool-btn clear-btn" title="다 지우기">🗑️</button>
          <button class="tool-btn save-btn" title="저장">💾</button>
        </div>
      </div>`;

    const canvas = body.querySelector('canvas');
    const holder = body.querySelector('.paint-canvas-holder');
    let { w, h, ctx } = fitCanvas(canvas);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, w, h);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // 리사이즈 시 그림 보존
    const onResize = () => {
      const snapshot = document.createElement('canvas');
      snapshot.width = canvas.width; snapshot.height = canvas.height;
      snapshot.getContext('2d').drawImage(canvas, 0, 0);
      ({ w, h, ctx } = fitCanvas(canvas));
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(snapshot, 0, 0, snapshot.width, snapshot.height, 0, 0, w, h);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    };
    window.addEventListener('resize', onResize);

    let color = COLORS[0];
    let size = 14;
    let tool = 'brush'; // brush | crayon | marker | rainbow | splat | eraser
    let hue = 0;
    const pointers = new Map(); // pointerId -> {x, y}

    // 색상 팔레트
    const colorsHolder = body.querySelector('.colors');
    colorsHolder.style.display = 'flex';
    colorsHolder.style.gap = '8px';
    colorsHolder.style.flexWrap = 'wrap';
    colorsHolder.style.justifyContent = 'center';
    COLORS.forEach((c, i) => {
      const dot = document.createElement('button');
      dot.className = 'color-dot' + (i === 0 ? ' selected' : '');
      dot.style.background = c;
      dot.addEventListener('click', () => {
        color = c;
        colorsHolder.querySelectorAll('.color-dot').forEach((d) => d.classList.remove('selected'));
        dot.classList.add('selected');
        if (tool === 'eraser' || tool === 'rainbow') selectTool('brush');
        Sound.blip();
      });
      colorsHolder.appendChild(dot);
    });

    function selectTool(t) {
      tool = t;
      body.querySelectorAll('.tool-select').forEach((b) =>
        b.classList.toggle('selected', b.dataset.tool === t));
    }
    body.querySelectorAll('.tool-select').forEach((btn) => {
      btn.addEventListener('click', () => { selectTool(btn.dataset.tool); Sound.blip(); });
    });

    body.querySelectorAll('.size-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        size = Number(btn.dataset.size);
        body.querySelectorAll('.size-btn').forEach((b) => b.classList.remove('selected'));
        btn.classList.add('selected');
        Sound.blip();
      });
    });

    // 다 지우기: 한 번 누르면 "한번 더!"로 바뀌고, 2초 안에 다시 누르면 지움
    const clearBtn = body.querySelector('.clear-btn');
    let clearArmed = null;
    clearBtn.addEventListener('click', () => {
      if (clearArmed) {
        clearTimeout(clearArmed);
        clearArmed = null;
        clearBtn.textContent = '🗑️';
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, w, h);
        Sound.pop();
      } else {
        clearBtn.textContent = '❗';
        Sound.buzz();
        clearArmed = setTimeout(() => { clearBtn.textContent = '🗑️'; clearArmed = null; }, 2000);
      }
    });

    body.querySelector('.save-btn').addEventListener('click', () => {
      const link = document.createElement('a');
      link.download = `내그림-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      Sound.yay();
    });

    function pos(e) {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    function strokeColor() {
      if (tool === 'eraser') return '#ffffff';
      if (tool === 'rainbow') { hue = (hue + 4) % 360; return `hsl(${hue} 90% 60%)`; }
      return color;
    }

    function splat(x, y) {
      const c = tool === 'rainbow' ? `hsl(${Math.random() * 360} 90% 60%)` : color;
      for (let i = 0; i < 22; i++) {
        const ang = Math.random() * Math.PI * 2;
        const dist = Math.random() * size * 3.2;
        ctx.fillStyle = tool === 'rainbow' ? `hsl(${Math.random() * 360} 90% 60%)` : c;
        ctx.beginPath();
        ctx.arc(x + Math.cos(ang) * dist, y + Math.sin(ang) * dist, randBetween(1.5, size * 0.5), 0, Math.PI * 2);
        ctx.fill();
      }
      Sound.pop();
    }

    // 도구별 선 그리기
    function drawSegment(a, b) {
      const c = strokeColor();
      if (tool === 'marker') {
        // 반투명 넓은 선 — 겹치면 자연스럽게 진해짐
        ctx.globalAlpha = 0.35;
        ctx.strokeStyle = c;
        ctx.lineWidth = size * 1.9;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
        ctx.globalAlpha = 1;
      } else if (tool === 'crayon') {
        // 지글지글한 가는 선 여러 개 + 부스러기 점
        ctx.strokeStyle = c;
        for (let i = 0; i < 3; i++) {
          const off = size * 0.35;
          ctx.globalAlpha = randBetween(0.25, 0.6);
          ctx.lineWidth = size * 0.4;
          ctx.beginPath();
          ctx.moveTo(a.x + randBetween(-off, off), a.y + randBetween(-off, off));
          ctx.lineTo(b.x + randBetween(-off, off), b.y + randBetween(-off, off));
          ctx.stroke();
        }
        ctx.fillStyle = c;
        for (let i = 0; i < 2; i++) {
          ctx.globalAlpha = randBetween(0.15, 0.4);
          const t = Math.random();
          ctx.beginPath();
          ctx.arc(a.x + (b.x - a.x) * t + randBetween(-size, size) * 0.5,
                  a.y + (b.y - a.y) * t + randBetween(-size, size) * 0.5,
                  randBetween(0.6, size * 0.18), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      } else {
        ctx.strokeStyle = c;
        ctx.lineWidth = tool === 'eraser' ? size * 1.6 : size;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    canvas.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      const p = pos(e);
      if (tool === 'splat') { splat(p.x, p.y); return; }
      pointers.set(e.pointerId, p);
      // 점 하나 찍기 (미세하게 움직인 것처럼 처리해서 도구 질감 유지)
      drawSegment(p, { x: p.x + 0.4, y: p.y + 0.4 });
    });

    canvas.addEventListener('pointermove', (e) => {
      const last = pointers.get(e.pointerId);
      if (!last) return;
      const p = pos(e);
      drawSegment(last, p);
      pointers.set(e.pointerId, p);
    });

    const endStroke = (e) => pointers.delete(e.pointerId);
    canvas.addEventListener('pointerup', endStroke);
    canvas.addEventListener('pointercancel', endStroke);
    canvas.addEventListener('pointerleave', endStroke);

    return {
      destroy() {
        window.removeEventListener('resize', onResize);
        if (clearArmed) clearTimeout(clearArmed);
      },
    };
  },
});
