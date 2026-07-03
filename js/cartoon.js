// 귀여운 카툰 SVG 라이브러리 — 정원/방 아이템, 배경 모티프, 테마
const Cartoon = (() => {
  const OUT = '#5b4a52';
  function svg(inner, vb = '0 0 100 100') {
    return `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">` +
      `<g stroke="${OUT}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">${inner}</g></svg>`;
  }

  // ---------- 놓을 수 있는 아이템 ----------
  const ITEM = {
    tree: `<rect x="44" y="52" width="12" height="40" rx="5" fill="#c08a55"/><circle cx="50" cy="38" r="28" fill="#79c85f"/>`,
    pine: `<rect x="45" y="74" width="10" height="18" rx="3" fill="#c08a55"/><path d="M50,50 L74,80 L26,80 Z" fill="#5aae4a"/><path d="M50,32 L70,62 L30,62 Z" fill="#6bbd56"/><path d="M50,14 L66,42 L34,42 Z" fill="#7ecb68"/>`,
    tulip: `<path d="M50,92 L50,54" stroke="#5aa54a" stroke-width="5"/><path d="M50,70 Q34,64 33,78 Q47,78 50,70 Z" fill="#7cc95a"/><path d="M37,52 Q36,30 50,42 Q64,30 63,52 Q57,60 50,55 Q43,60 37,52 Z" fill="#ff8fb0"/>`,
    sunflower: `<path d="M50,92 L50,46" stroke="#5aa54a" stroke-width="5"/><path d="M50,72 Q32,64 30,78 Q46,80 50,72Z" fill="#7cc95a"/><circle cx="50" cy="40" r="24" fill="#ffc93f"/><circle cx="50" cy="40" r="12" fill="#8a5a2b"/>`,
    rose: `<path d="M50,92 L50,52" stroke="#5aa54a" stroke-width="5"/><path d="M50,74 Q66,68 68,82 Q54,82 50,74Z" fill="#7cc95a"/><circle cx="50" cy="40" r="20" fill="#ff7a90"/><circle cx="50" cy="40" r="12" fill="none" stroke="#e0637a" stroke-width="3"/><circle cx="50" cy="40" r="5" fill="#e0637a" stroke="none"/>`,
    mushroom: `<rect x="40" y="54" width="20" height="34" rx="9" fill="#f7e6c8"/><path d="M20,54 Q20,26 50,26 Q80,26 80,54 Z" fill="#ff6b6b"/><g stroke="none" fill="#fff"><circle cx="38" cy="42" r="5"/><circle cx="61" cy="38" r="4"/><circle cx="52" cy="49" r="3.5"/></g>`,
    bush: `<circle cx="34" cy="62" r="18" fill="#6bbd56"/><circle cx="64" cy="62" r="20" fill="#6bbd56"/><circle cx="50" cy="50" r="20" fill="#79c85f"/>`,
    bunny: `<ellipse cx="42" cy="20" rx="7" ry="16" fill="#fff"/><ellipse cx="58" cy="20" rx="7" ry="16" fill="#fff"/><g stroke="none" fill="#ffc0d0"><ellipse cx="42" cy="20" rx="3" ry="10"/><ellipse cx="58" cy="20" rx="3" ry="10"/></g><ellipse cx="50" cy="68" rx="23" ry="21" fill="#fff"/><circle cx="50" cy="44" r="17" fill="#fff"/><g stroke="none" fill="${OUT}"><circle cx="43" cy="42" r="2.4"/><circle cx="57" cy="42" r="2.4"/></g><path d="M47,48 Q50,51 53,48" fill="none" stroke-width="2.4"/><g stroke="none" fill="#ffc0d0"><circle cx="39" cy="48" r="3.4"/><circle cx="61" cy="48" r="3.4"/></g>`,
    cat: `<path d="M34,28 L30,10 L48,22 Z" fill="#f6a44b"/><path d="M66,28 L70,10 L52,22 Z" fill="#f6a44b"/><path d="M70,66 Q88,60 84,80 Q78,80 78,74 Q80,68 70,72 Z" fill="#f6a44b"/><ellipse cx="50" cy="66" rx="22" ry="22" fill="#f6a44b"/><circle cx="50" cy="42" r="18" fill="#f6a44b"/><g stroke="none" fill="${OUT}"><circle cx="43" cy="40" r="2.5"/><circle cx="57" cy="40" r="2.5"/></g><path d="M46,46 L54,46 L50,50 Z" fill="#e07a5f" stroke="none"/>`,
    dog: `<ellipse cx="30" cy="36" rx="9" ry="15" fill="#c9915a"/><ellipse cx="70" cy="36" rx="9" ry="15" fill="#c9915a"/><ellipse cx="50" cy="68" rx="22" ry="21" fill="#e0b07a"/><circle cx="50" cy="42" r="19" fill="#e0b07a"/><ellipse cx="50" cy="50" rx="11" ry="8" fill="#f6dcb8"/><g stroke="none" fill="${OUT}"><circle cx="43" cy="40" r="2.6"/><circle cx="57" cy="40" r="2.6"/><circle cx="50" cy="48" r="3"/></g>`,
    bird: `<path d="M52,54 L74,48 L66,64 Z" fill="#5aa9e0"/><circle cx="44" cy="52" r="22" fill="#6fb8ef"/><path d="M40,52 Q30,44 26,54 Q34,58 42,56Z" fill="#5aa9e0"/><path d="M24,50 L12,52 L24,56 Z" fill="#ffb03a"/><circle cx="30" cy="46" r="3" fill="${OUT}" stroke="none"/><path d="M40,72 L40,80 M52,72 L52,80" stroke="#ffb03a" stroke-width="3"/>`,
    butterfly: `<ellipse cx="50" cy="50" rx="4" ry="20" fill="${OUT}"/><path d="M46,44 Q16,22 14,48 Q16,66 46,54Z" fill="#ff8fb0"/><path d="M54,44 Q84,22 86,48 Q84,66 54,54Z" fill="#ff8fb0"/><path d="M46,54 Q24,66 30,82 Q46,80 48,60Z" fill="#ffcf5a"/><path d="M54,54 Q76,66 70,82 Q54,80 52,60Z" fill="#ffcf5a"/><path d="M50,30 Q42,18 36,16 M50,30 Q58,18 64,16" fill="none" stroke-width="2.5"/>`,
    bee: `<ellipse cx="70" cy="40" rx="16" ry="12" fill="#fff" opacity=".85"/><ellipse cx="70" cy="40" rx="16" ry="12" fill="#eaf6ff"/><ellipse cx="50" cy="58" rx="26" ry="20" fill="#ffce4a"/><path d="M44,40 Q44,78 44,78 M60,42 Q62,76 62,76" stroke-width="6"/><circle cx="30" cy="52" r="14" fill="#ffce4a"/><g stroke="none" fill="${OUT}"><circle cx="26" cy="50" r="2.6"/></g><path d="M24,40 Q20,32 16,32 M32,38 Q32,30 36,28" fill="none" stroke-width="2.5"/>`,
    duck: `<path d="M66,54 Q86,48 82,66 Q74,68 70,60Z" fill="#ffd84d"/><ellipse cx="46" cy="62" rx="26" ry="20" fill="#ffd84d"/><circle cx="34" cy="42" r="15" fill="#ffd84d"/><path d="M20,42 L8,46 L20,50 Z" fill="#ff9f3a"/><circle cx="32" cy="38" r="2.6" fill="${OUT}" stroke="none"/>`,
    turtle: `<path d="M22,72 L18,84 M78,72 L82,84 M40,80 L38,90 M60,80 L62,90" stroke-width="6" stroke="#8fbf5a"/><path d="M76,58 Q92,58 90,50 Q84,46 76,52Z" fill="#8fbf5a"/><circle cx="82" cy="52" r="2.4" fill="${OUT}" stroke="none"/><path d="M20,62 Q20,38 50,38 Q80,38 80,62 Z" fill="#79c85f"/><g stroke-width="3" stroke="#4f8a3a" fill="none"><path d="M50,40 L50,60 M32,48 L68,48 M30,58 L70,58"/></g>`,
    fish: `<path d="M64,50 L82,38 L78,50 L82,62 Z" fill="#ff9f6a"/><ellipse cx="46" cy="50" rx="26" ry="18" fill="#ffb37a"/><path d="M40,34 Q50,26 58,36Z" fill="#ff9f6a"/><circle cx="34" cy="46" r="4" fill="#fff"/><circle cx="34" cy="46" r="2" fill="${OUT}" stroke="none"/>`,
    fountain: `<path d="M24,88 L76,88 L70,74 L30,74 Z" fill="#cfd8e0"/><ellipse cx="50" cy="74" rx="20" ry="5" fill="#8fd4f0" stroke="none"/><rect x="46" y="52" width="8" height="22" fill="#cfd8e0"/><path d="M36,56 Q50,62 64,56 Q62,48 50,48 Q38,48 36,56Z" fill="#cfd8e0"/><path d="M50,48 Q45,36 50,28 Q55,36 50,48" fill="#8fd4f0" stroke="none"/>`,
    bench: `<rect x="24" y="50" width="52" height="8" rx="3" fill="#c08a55"/><rect x="24" y="40" width="52" height="8" rx="3" fill="#c08a55"/><rect x="28" y="58" width="6" height="26" fill="#a5794a"/><rect x="66" y="58" width="6" height="26" fill="#a5794a"/>`,
    house: `<rect x="26" y="48" width="48" height="40" rx="3" fill="#ffd9a0"/><path d="M18,50 L50,22 L82,50 Z" fill="#e07a5f"/><rect x="44" y="64" width="14" height="24" rx="2" fill="#a5794a"/><rect x="32" y="55" width="12" height="12" rx="2" fill="#bfe6ff"/>`,
    balloon: `<path d="M50,60 L50,88" stroke-width="2"/><ellipse cx="50" cy="38" rx="21" ry="25" fill="#ff8fb0"/><path d="M46,61 L54,61 L50,67 Z" fill="#ff8fb0"/>`,
    rainbow: `<g fill="none" stroke-width="7"><path d="M16,82 A34,34 0 0,1 84,82" stroke="#ff8fb0"/><path d="M27,82 A23,23 0 0,1 73,82" stroke="#ffcf5a"/><path d="M38,82 A12,12 0 0,1 62,82" stroke="#7ecb68"/></g>`,
    star: `<path d="M50,16 L59,40 L85,40 L64,56 L72,82 L50,66 L28,82 L36,56 L15,40 L41,40 Z" fill="#ffd84d"/>`,
    gift: `<rect x="28" y="48" width="44" height="38" rx="3" fill="#ff8fb0"/><rect x="46" y="48" width="8" height="38" fill="#ffd84d"/><rect x="28" y="48" width="44" height="8" fill="#ffd84d"/><path d="M50,48 Q40,32 34,42 Q40,46 50,48 Q60,46 66,42 Q60,32 50,48Z" fill="#ffd84d"/>`,
    snowman: `<circle cx="50" cy="70" r="20" fill="#fff"/><circle cx="50" cy="40" r="14" fill="#fff"/><g stroke="none" fill="${OUT}"><circle cx="45" cy="37" r="2"/><circle cx="55" cy="37" r="2"/></g><path d="M50,40 L60,43 L50,46 Z" fill="#ff9f43" stroke="none"/><rect x="40" y="18" width="20" height="6" fill="${OUT}"/><rect x="44" y="6" width="12" height="14" fill="${OUT}"/>`,
    sofa: `<rect x="24" y="36" width="52" height="24" rx="8" fill="#a3d8ea"/><rect x="18" y="48" width="64" height="30" rx="10" fill="#8fcbe0"/><rect x="14" y="42" width="15" height="34" rx="7" fill="#7bbed4"/><rect x="71" y="42" width="15" height="34" rx="7" fill="#7bbed4"/><rect x="26" y="76" width="9" height="11" fill="#6a5140"/><rect x="65" y="76" width="9" height="11" fill="#6a5140"/>`,
    chair: `<rect x="35" y="30" width="30" height="28" rx="4" fill="#f0b86a"/><rect x="33" y="52" width="34" height="10" rx="3" fill="#e0a758"/><rect x="35" y="62" width="6" height="24" fill="#c08a55"/><rect x="59" y="62" width="6" height="24" fill="#c08a55"/>`,
    table: `<rect x="24" y="46" width="52" height="10" rx="3" fill="#c08a55"/><rect x="30" y="56" width="7" height="30" fill="#a5794a"/><rect x="63" y="56" width="7" height="30" fill="#a5794a"/><ellipse cx="50" cy="42" rx="8" ry="6" fill="#ff8fb0"/>`,
    bed: `<rect x="14" y="40" width="12" height="34" rx="3" fill="#c08a55"/><rect x="16" y="62" width="72" height="22" rx="4" fill="#dfe7ef"/><path d="M32,62 Q32,54 42,54 L84,54 Q88,54 88,62 L88,72 L32,72 Z" fill="#ff9fb4"/><rect x="22" y="54" width="18" height="14" rx="4" fill="#fff"/>`,
    lamp: `<rect x="46" y="46" width="8" height="40" fill="#c0a58a"/><ellipse cx="50" cy="86" rx="14" ry="5" fill="#c0a58a"/><path d="M34,46 L66,46 L60,26 L40,26 Z" fill="#ffe08a"/>`,
    tv: `<rect x="20" y="24" width="60" height="42" rx="5" fill="#4a4a52"/><rect x="26" y="30" width="48" height="30" rx="3" fill="#8fd4f0"/><rect x="44" y="66" width="12" height="10" fill="#6a5140"/><rect x="34" y="76" width="32" height="6" rx="3" fill="#6a5140"/>`,
    bookshelf: `<rect x="26" y="18" width="48" height="70" rx="3" fill="#c08a55"/><g stroke="none"><rect x="32" y="24" width="8" height="26" fill="#ff8fb0"/><rect x="42" y="28" width="8" height="22" fill="#7ecb68"/><rect x="52" y="24" width="8" height="26" fill="#ffd84d"/><rect x="62" y="30" width="6" height="20" fill="#8fcbe0"/></g><rect x="26" y="50" width="48" height="5" fill="#a5794a" stroke="none"/><g stroke="none"><rect x="32" y="58" width="7" height="24" fill="#8fcbe0"/><rect x="41" y="62" width="8" height="20" fill="#ff8fb0"/><rect x="52" y="58" width="8" height="24" fill="#7ecb68"/></g>`,
    teddy: `<circle cx="36" cy="26" r="8" fill="#c9915a"/><circle cx="64" cy="26" r="8" fill="#c9915a"/><circle cx="50" cy="38" r="17" fill="#d8a066"/><circle cx="50" cy="72" r="20" fill="#d8a066"/><ellipse cx="50" cy="42" rx="9" ry="7" fill="#f6dcb8"/><g stroke="none" fill="${OUT}"><circle cx="44" cy="35" r="2.4"/><circle cx="56" cy="35" r="2.4"/><circle cx="50" cy="41" r="2.4"/></g>`,
    rug: `<ellipse cx="50" cy="58" rx="40" ry="20" fill="#ff9fb4"/><ellipse cx="50" cy="58" rx="27" ry="12" fill="none" stroke="#fff" stroke-width="3"/><ellipse cx="50" cy="58" rx="13" ry="5" fill="#ffd84d" stroke="none"/>`,
    clock: `<circle cx="50" cy="50" r="30" fill="#fff"/><path d="M50,50 L50,30 M50,50 L64,56" stroke-width="4"/><circle cx="50" cy="50" r="3" fill="${OUT}" stroke="none"/>`,
    picture: `<rect x="24" y="26" width="52" height="44" rx="3" fill="#ffe0a0"/><rect x="30" y="32" width="40" height="32" fill="#bfe6ff" stroke="none"/><circle cx="60" cy="42" r="5" fill="#ffd84d" stroke="none"/><path d="M30,64 L44,50 L54,60 L64,48 L70,64 Z" fill="#7ecb68" stroke="none"/>`,
    plantpot: `<path d="M36,58 L64,58 L60,86 L40,86 Z" fill="#e08a5f"/><path d="M50,58 Q38,40 28,42 Q40,50 46,58" fill="#7ecb68"/><path d="M50,58 Q62,36 74,40 Q60,48 54,58" fill="#7ecb68"/><path d="M50,58 L50,44" stroke="#5aa54a" stroke-width="4"/>`,
    cake: `<rect x="28" y="54" width="44" height="26" rx="4" fill="#ffe0b0"/><path d="M28,60 Q38,54 48,60 Q58,66 72,60 L72,66 L28,66 Z" fill="#ff9fb4" stroke="none"/><rect x="48" y="40" width="4" height="14" fill="#ffd84d"/><circle cx="50" cy="38" r="3" fill="#ff6b6b" stroke="none"/>`,
    ball: `<circle cx="50" cy="54" r="28" fill="#ff8fb0"/><path d="M22,54 L78,54 M50,26 L50,82" stroke-width="3"/><path d="M28,40 Q50,50 72,40 M28,68 Q50,58 72,68" fill="none" stroke-width="3"/>`,
    toybox: `<rect x="24" y="48" width="52" height="38" rx="4" fill="#8fcbe0"/><rect x="24" y="44" width="52" height="10" rx="3" fill="#7bbed4"/><path d="M42,44 Q50,32 58,44Z" fill="#ffd84d"/><circle cx="36" cy="66" r="6" fill="#ff8fb0" stroke="none"/><path d="M56,60 L66,60 L66,74 L56,74Z" fill="#7ecb68" stroke="none"/>`,
  };

  function item(id) { return svg(ITEM[id] || ITEM.star); }

  // ---------- 배경 모티프 ----------
  const MOTIF = {
    sun: svg(`<circle cx="50" cy="50" r="26" fill="#ffdf6e"/><g stroke="#ffce4a" stroke-width="6"><path d="M50,14 L50,4 M50,96 L50,86 M14,50 L4,50 M96,50 L86,50 M24,24 L17,17 M76,24 L83,17 M24,76 L17,83 M76,76 L83,83"/></g>`),
    moon: svg(`<path d="M62,18 A34,34 0 1,0 62,86 A26,26 0 1,1 62,18 Z" fill="#fdf0b0"/>`),
    cloud: svg(`<path d="M18,64 Q10,44 32,44 Q36,26 58,34 Q80,26 80,50 Q94,52 88,64 Z" fill="#fff"/>`, '0 0 100 90'),
    stars: svg(`<g fill="#fff8c0" stroke="none"><path d="M24,30 l3,7 7,1 -5,5 1,7 -6,-3 -6,3 1,-7 -5,-5 7,-1z"/><path d="M70,20 l2,5 5,1 -4,4 1,5 -4,-2 -4,2 1,-5 -4,-4 5,-1z"/><path d="M60,60 l2,5 5,1 -4,4 1,5 -4,-2 -4,2 1,-5 -4,-4 5,-1z"/></g>`),
    pond: svg(`<ellipse cx="100" cy="56" rx="92" ry="32" fill="#8fd4f0"/><ellipse cx="100" cy="48" rx="66" ry="18" fill="#a9e0f5" stroke="none"/><path d="M60,44 Q70,40 80,44" fill="none" stroke="#fff" stroke-width="3"/>`, '0 0 200 100'),
    cottage: svg(`<rect x="26" y="48" width="48" height="40" rx="3" fill="#ffe1b0"/><path d="M16,52 L50,20 L84,52 Z" fill="#e07a5f"/><rect x="44" y="64" width="15" height="24" rx="2" fill="#b5824f"/><circle cx="55" cy="76" r="1.6" fill="#ffd84d" stroke="none"/><rect x="31" y="56" width="12" height="12" rx="2" fill="#bfe6ff"/>`),
    treeAutumn: svg(`<rect x="44" y="52" width="12" height="40" rx="5" fill="#b0764a"/><circle cx="50" cy="38" r="28" fill="#ef9a3c"/>`),
    leafpile: svg(`<g stroke="none"><ellipse cx="50" cy="76" rx="34" ry="12" fill="#e08a3a"/><path d="M30,72 l6,-8 6,8z" fill="#ef9a3c"/><path d="M56,70 l6,-9 6,9z" fill="#e0742a"/><path d="M44,66 l5,-7 5,7z" fill="#f0b050"/></g>`),
    pineSnow: svg(`<rect x="45" y="74" width="10" height="18" rx="3" fill="#a5794a"/><path d="M50,50 L74,80 L26,80 Z" fill="#5a9a4c"/><path d="M50,14 L66,42 L34,42 Z" fill="#6bbd56"/><g stroke="none" fill="#fff"><path d="M50,14 L60,32 Q50,26 40,32 Z"/><ellipse cx="50" cy="80" rx="24" ry="5"/></g>`),
    waves: svg(`<path d="M-6,30 Q25,10 50,30 T100,30 T150,30 T200,30 T250,30 T306,30 L306,82 L-6,82 Z" fill="#6fc0e8" stroke="none"/><path d="M0,44 Q25,26 50,44 T100,44 T150,44 T200,44 T250,44 T300,44" fill="none" stroke="#fff" stroke-width="3"/>`, '0 0 300 80'),
    sandcastle: svg(`<rect x="30" y="52" width="40" height="34" fill="#f0d49a"/><rect x="26" y="44" width="10" height="12" fill="#f0d49a"/><rect x="46" y="40" width="10" height="16" fill="#f0d49a"/><rect x="64" y="44" width="10" height="12" fill="#f0d49a"/><path d="M51,40 L51,30 L60,34 Z" fill="#ff6b6b"/>`),
    palm: svg(`<path d="M52,92 Q44,60 50,40" fill="none" stroke="#b0764a" stroke-width="9"/><g stroke="none" fill="#5aae4a"><path d="M50,40 Q22,24 6,32 Q30,34 50,48Z"/><path d="M50,40 Q78,24 94,32 Q70,34 50,48Z"/><path d="M50,38 Q38,10 22,6 Q42,20 50,46Z"/><path d="M50,38 Q62,10 78,6 Q58,20 50,46Z"/></g><g stroke="none" fill="#a5794a"><circle cx="43" cy="44" r="4"/><circle cx="57" cy="44" r="4"/></g>`),
    window: svg(`<rect x="8" y="10" width="84" height="78" rx="4" fill="#bfe6ff"/><path d="M50,12 L50,86 M12,49 L88,49" stroke-width="5"/><rect x="4" y="6" width="92" height="86" rx="6" fill="none" stroke-width="6"/><rect x="2" y="88" width="96" height="9" rx="3" fill="#e0c090"/>`, '0 0 100 100'),
    door: svg(`<rect x="18" y="8" width="64" height="86" rx="6" fill="#c08a55"/><rect x="24" y="14" width="52" height="34" rx="3" fill="#b07a45" stroke-width="3"/><rect x="24" y="52" width="52" height="36" rx="3" fill="#b07a45" stroke-width="3"/><circle cx="70" cy="52" r="3.5" fill="#ffd84d"/>`, '0 0 100 100'),
    heartpic: svg(`<rect x="24" y="26" width="52" height="44" rx="3" fill="#ffe0ee"/><path d="M50,60 C34,48 34,34 44,34 C49,34 50,40 50,40 C50,40 51,34 56,34 C66,34 66,48 50,60 Z" fill="#ff7a9c" stroke="none"/>`),
    canopy: svg(`<path d="M10,20 L90,20 L74,44 L26,44 Z" fill="#ffc0da"/><rect x="20" y="44" width="8" height="46" fill="#e8a0be"/><rect x="72" y="44" width="8" height="46" fill="#e8a0be"/><path d="M46,10 L54,10 L58,20 L42,20 Z" fill="#ffd84d"/>`),
  };
  function motif(id) { return MOTIF[id] || (ITEM[id] ? item(id) : ''); }

  // ---------- 테마 (배경 레이아웃) ----------
  // fixtures: 고정 배치 {m, x, y, w}  (x,y=0~1 비율, w=px)
  // repeat: 지평선을 따라 반복 {list, step, y, w}
  const THEMES = [
    { id: 'spring', type: 'outdoor', name: '봄 언덕 정원', emoji: '🌸',
      css: 'linear-gradient(#bfe6ff 0%, #d9f2ff 44%, #cdeeaa 45%, #a7e07a 100%)',
      fixtures: [ { m: 'sun', x: 0.05, y: 0.12, w: 84 }, { m: 'cloud', x: 0.5, y: 0.1, w: 120 }, { m: 'cloud', x: 0.82, y: 0.16, w: 90 }, { m: 'pond', x: 0.12, y: 0.8, w: 200 }, { m: 'cottage', x: 0.62, y: 0.62, w: 150 } ],
      repeat: { list: ['tree', 'bush'], step: 360, y: 0.58, w: 130 } },
    { id: 'autumn', type: 'outdoor', name: '가을 정원', emoji: '🍂',
      css: 'linear-gradient(#ffe2b0 0%, #ffedcf 44%, #e8c98a 45%, #d8a860 100%)',
      fixtures: [ { m: 'sun', x: 0.06, y: 0.14, w: 78 }, { m: 'cloud', x: 0.7, y: 0.12, w: 100 }, { m: 'cottage', x: 0.5, y: 0.62, w: 150 } ],
      repeat: { list: ['treeAutumn', 'leafpile'], step: 340, y: 0.6, w: 130 } },
    { id: 'winter', type: 'outdoor', name: '겨울 정원', emoji: '⛄',
      css: 'linear-gradient(#cfe4f5 0%, #e8f3fb 46%, #f4fafe 47%, #eaf3fb 100%)',
      fixtures: [ { m: 'cloud', x: 0.3, y: 0.1, w: 110 }, { m: 'snowman', x: 0.2, y: 0.74, w: 120 }, { m: 'cottage', x: 0.6, y: 0.6, w: 150 } ],
      repeat: { list: ['pineSnow', 'pineSnow'], step: 320, y: 0.58, w: 120 } },
    { id: 'beach', type: 'outdoor', name: '바닷가', emoji: '🏖️',
      css: 'linear-gradient(#bfe6ff 0%, #d8f2ff 40%, #7fd0ef 41%, #7fd0ef 66%, #f6e2b0 67%, #ecce80 100%)',
      fixtures: [ { m: 'sun', x: 0.08, y: 0.12, w: 84 }, { m: 'cloud', x: 0.6, y: 0.1, w: 110 }, { m: 'palm', x: 0.16, y: 0.82, w: 170 }, { m: 'sandcastle', x: 0.62, y: 0.84, w: 120 } ],
      repeat: { list: ['waves'], step: 298, y: 0.61, w: 300 } },
    { id: 'night', type: 'outdoor', name: '밤하늘 정원', emoji: '🌙',
      css: 'linear-gradient(#2b2a5c 0%, #3d4a86 44%, #4a6a4a 45%, #3a5a3a 100%)',
      fixtures: [ { m: 'moon', x: 0.8, y: 0.1, w: 90 }, { m: 'stars', x: 0.2, y: 0.12, w: 140 }, { m: 'stars', x: 0.55, y: 0.2, w: 120 }, { m: 'pond', x: 0.14, y: 0.8, w: 200 }, { m: 'cottage', x: 0.6, y: 0.62, w: 150 } ],
      repeat: { list: ['tree', 'bush'], step: 360, y: 0.58, w: 130 } },
    { id: 'cozy', type: 'indoor', name: '아늑한 방', emoji: '🛋️',
      css: 'linear-gradient(#ffe6c8 0%, #ffe6c8 56%, #d9a86a 57%, #c98f52 100%)',
      fixtures: [ { m: 'window', x: 0.2, y: 0.28, w: 150 }, { m: 'picture', x: 0.62, y: 0.24, w: 90 }, { m: 'clock', x: 0.82, y: 0.22, w: 78 }, { m: 'door', x: 0.9, y: 0.6, w: 120 }, { m: 'rug', x: 0.4, y: 0.86, w: 260 } ] },
    { id: 'treehouse', type: 'indoor', name: '나무집', emoji: '🌳',
      css: 'linear-gradient(#d7a86a 0%, #d7a86a 56%, #b5824f 57%, #a5734224 100%), linear-gradient(#c99a5e,#b5824f)',
      fixtures: [ { m: 'window', x: 0.22, y: 0.28, w: 140 }, { m: 'bush', x: 0.62, y: 0.24, w: 100 }, { m: 'picture', x: 0.8, y: 0.24, w: 88 }, { m: 'rug', x: 0.45, y: 0.86, w: 240 } ] },
    { id: 'living', type: 'indoor', name: '이층집 거실', emoji: '🏠',
      css: 'linear-gradient(#eef0e2 0%, #eef0e2 56%, #cdb08a 57%, #bfa079 100%)',
      fixtures: [ { m: 'window', x: 0.18, y: 0.26, w: 170 }, { m: 'window', x: 0.5, y: 0.26, w: 170 }, { m: 'picture', x: 0.78, y: 0.22, w: 90 }, { m: 'door', x: 0.92, y: 0.6, w: 120 }, { m: 'rug', x: 0.4, y: 0.86, w: 280 } ] },
    { id: 'princess', type: 'indoor', name: '공주방', emoji: '👑',
      css: 'linear-gradient(#ffe0ef 0%, #ffe0ef 56%, #e8a0c0 57%, #d98cb0 100%)',
      fixtures: [ { m: 'window', x: 0.2, y: 0.28, w: 150 }, { m: 'canopy', x: 0.66, y: 0.5, w: 180 }, { m: 'heartpic', x: 0.42, y: 0.22, w: 88 }, { m: 'rug', x: 0.35, y: 0.87, w: 240 } ] },
  ];
  function theme(id) { return THEMES.find((t) => t.id === id); }

  // ---------- 상점 목록 (아이템 id + 가격 + 어디에 쓰는지) ----------
  const SHOP = [
    { id: 'tree', cost: 6, where: 'out' }, { id: 'pine', cost: 6, where: 'out' }, { id: 'tulip', cost: 3, where: 'out' },
    { id: 'sunflower', cost: 3, where: 'out' }, { id: 'rose', cost: 4, where: 'out' }, { id: 'mushroom', cost: 4, where: 'out' },
    { id: 'bush', cost: 4, where: 'out' }, { id: 'fountain', cost: 12, where: 'out' }, { id: 'bench', cost: 6, where: 'out' },
    { id: 'house', cost: 15, where: 'out' }, { id: 'snowman', cost: 6, where: 'out' }, { id: 'rainbow', cost: 10, where: 'out' },
    { id: 'bunny', cost: 5, where: 'both' }, { id: 'cat', cost: 6, where: 'both' }, { id: 'dog', cost: 6, where: 'both' },
    { id: 'bird', cost: 4, where: 'out' }, { id: 'butterfly', cost: 3, where: 'out' }, { id: 'bee', cost: 3, where: 'out' },
    { id: 'duck', cost: 5, where: 'out' }, { id: 'turtle', cost: 5, where: 'both' }, { id: 'fish', cost: 4, where: 'both' },
    { id: 'balloon', cost: 3, where: 'both' }, { id: 'star', cost: 2, where: 'both' }, { id: 'gift', cost: 4, where: 'both' },
    { id: 'sofa', cost: 12, where: 'in' }, { id: 'chair', cost: 5, where: 'in' }, { id: 'table', cost: 6, where: 'in' },
    { id: 'bed', cost: 12, where: 'in' }, { id: 'lamp', cost: 5, where: 'in' }, { id: 'tv', cost: 10, where: 'in' },
    { id: 'bookshelf', cost: 8, where: 'in' }, { id: 'teddy', cost: 5, where: 'both' }, { id: 'rug', cost: 6, where: 'in' },
    { id: 'clock', cost: 4, where: 'in' }, { id: 'picture', cost: 5, where: 'in' }, { id: 'plantpot', cost: 5, where: 'both' },
    { id: 'cake', cost: 6, where: 'both' }, { id: 'ball', cost: 3, where: 'both' }, { id: 'toybox', cost: 6, where: 'in' },
  ];
  function shopFor(type) {
    const w = type === 'indoor' ? 'in' : 'out';
    return SHOP.filter((s) => s.where === w || s.where === 'both');
  }
  const COST = {}; SHOP.forEach((s) => { COST[s.id] = s.cost; });

  return { item, motif, THEMES, theme, SHOP, shopFor, COST };
})();
