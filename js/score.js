// 게임 공용: 최고 기록 + 우리 집 등수 + 결과 화면
const GameScore = (() => {
  function bestMap(n) { return Store.get(`player.${n}.best`, {}); }
  function best(n, gid) { return bestMap(n)[gid]; }

  // 기록 저장 (lowerBetter=true면 낮을수록 좋은 기록)
  function record(gid, score, lowerBetter) {
    const n = Player.current();
    if (!n) return { best: score, prev: null, isNew: false };
    const m = bestMap(n); const prev = m[gid];
    const isNew = prev == null || (lowerBetter ? score < prev : score > prev);
    if (isNew) { m[gid] = score; Store.set(`player.${n}.best`, m); }
    return { best: isNew ? score : prev, prev, isNew };
  }

  // 우리 집(프로필들) 중 몇 등인지
  function rank(gid, lowerBetter) {
    const n = Player.current();
    const board = Player.list().map((p) => ({ name: p.name, s: best(p.name, gid) })).filter((x) => x.s != null);
    board.sort((a, b) => (lowerBetter ? a.s - b.s : b.s - a.s));
    const idx = board.findIndex((x) => x.name === n);
    return { rank: idx >= 0 ? idx + 1 : Math.max(1, board.length), total: board.length, board };
  }

  function medal(r) { return r === 1 ? '🥇' : r === 2 ? '🥈' : r === 3 ? '🥉' : `${r}등`; }

  // 점수형 게임 마무리: 보상 + 기록 + 등수 문구 반환
  function finish(gid, score, { reward = 0, lowerBetter = false, fx } = {}) {
    if (reward > 0) Reward('🍓', reward, (fx && fx.x) || window.innerWidth / 2, (fx && fx.y) || window.innerHeight / 2);
    const rec = record(gid, score, lowerBetter);
    const rk = rank(gid, lowerBetter);
    const lines = [];
    lines.push(rec.isNew ? '🏆 새 최고 기록이에요!' : `최고 기록: ${rec.best}${lowerBetter ? '' : '점'}`);
    if (Player.current()) lines.push(rk.total > 1 ? `우리 집 ${medal(rk.rank)} (${rk.total}명 중)` : `우리 집 ${medal(1)}!`);
    return { rec, rk, lines, reward };
  }

  // 결과 오버레이
  function showResult(body, cfg) {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    const rewardLine = cfg.reward > 0 ? `<p style="font-size:30px">🍓 +${cfg.reward} 획득!</p>` : '';
    overlay.innerHTML = `<div class="overlay-card"><h3>${cfg.emoji || ''} ${cfg.title}</h3>` +
      (cfg.statLines || []).map((l) => `<p>${l}</p>`).join('') + rewardLine +
      `<div class="overlay-buttons"><button class="btn big primary again-b">🔁 또 하기</button>` +
      `<button class="btn big list-b">🎮 그만</button></div></div>`;
    body.appendChild(overlay);
    overlay.querySelector('.again-b').addEventListener('click', () => { Sound.ding(); overlay.remove(); cfg.again && cfg.again(); });
    overlay.querySelector('.list-b').addEventListener('click', () => { Sound.pop(); overlay.remove(); (cfg.list || (() => GameShell.showSection('game')))(); });
    return overlay;
  }

  return { best, record, rank, medal, finish, showResult };
})();
