// 색칠 도안 데이터 + SVG 생성기 (색칠 놀이와 동물 마을에서 공유)
const ColoringTemplates = (() => {
  // 꽃잎 6개를 프로그램으로 생성
  function flowerPetals() {
    const petals = [];
    for (let i = 0; i < 6; i++) {
      const angle = i * 60 - 90;
      const rad = (angle * Math.PI) / 180;
      const cx = 100 + 36 * Math.cos(rad);
      const cy = 70 + 36 * Math.sin(rad);
      petals.push({
        id: 'petal' + i,
        tag: 'ellipse',
        attrs: { cx, cy, rx: 23, ry: 15, transform: `rotate(${angle} ${cx} ${cy})` },
      });
    }
    return petals;
  }

  const templates = {
    cat: {
      name: '아기 고양이', emoji: '🐱', habitat: 'walk',
      regions: [
        { id: 'tail', tag: 'path', attrs: { d: 'M46 130 Q8 118 14 84 Q18 66 36 74 Q28 98 56 112 Z' } },
        { id: 'earL', tag: 'path', attrs: { d: 'M78 54 L62 10 L106 38 Z' } },
        { id: 'earR', tag: 'path', attrs: { d: 'M142 54 L158 10 L114 38 Z' } },
        { id: 'body', tag: 'ellipse', attrs: { cx: 110, cy: 142, rx: 58, ry: 44 } },
        { id: 'belly', tag: 'ellipse', attrs: { cx: 110, cy: 154, rx: 30, ry: 24 } },
        { id: 'head', tag: 'circle', attrs: { cx: 110, cy: 80, r: 44 } },
      ],
      details: `
        <circle cx="94" cy="74" r="4.5" fill="#333"/>
        <circle cx="126" cy="74" r="4.5" fill="#333"/>
        <path d="M104 88 L116 88 L110 96 Z" fill="#333"/>
        <path d="M110 96 Q110 104 100 106 M110 96 Q110 104 120 106" fill="none" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M66 84 L38 78 M66 94 L38 98 M154 84 L182 78 M154 94 L182 98" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>`,
    },

    butterfly: {
      name: '나비', emoji: '🦋', habitat: 'fly',
      regions: [
        { id: 'wingUL', tag: 'path', attrs: { d: 'M94 92 Q20 18 12 68 Q8 108 92 104 Z' } },
        { id: 'wingUR', tag: 'path', attrs: { d: 'M106 92 Q180 18 188 68 Q192 108 108 104 Z' } },
        { id: 'wingLL', tag: 'path', attrs: { d: 'M94 106 Q28 146 48 178 Q74 198 96 116 Z' } },
        { id: 'wingLR', tag: 'path', attrs: { d: 'M106 106 Q172 146 152 178 Q126 198 104 116 Z' } },
        { id: 'spotL', tag: 'circle', attrs: { cx: 48, cy: 66, r: 13 } },
        { id: 'spotR', tag: 'circle', attrs: { cx: 152, cy: 66, r: 13 } },
        { id: 'spotLL', tag: 'circle', attrs: { cx: 72, cy: 150, r: 9 } },
        { id: 'spotLR', tag: 'circle', attrs: { cx: 128, cy: 150, r: 9 } },
        { id: 'body', tag: 'ellipse', attrs: { cx: 100, cy: 108, rx: 11, ry: 46 } },
        { id: 'head', tag: 'circle', attrs: { cx: 100, cy: 52, r: 14 } },
      ],
      details: `
        <path d="M94 42 Q80 20 66 14 M106 42 Q120 20 134 14" fill="none" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="66" cy="14" r="4" fill="#333"/>
        <circle cx="134" cy="14" r="4" fill="#333"/>
        <circle cx="95" cy="50" r="2.5" fill="#333"/>
        <circle cx="105" cy="50" r="2.5" fill="#333"/>
        <path d="M96 58 Q100 61 104 58" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round"/>`,
    },

    fish: {
      name: '아기 물고기', emoji: '🐟', habitat: 'pond',
      regions: [
        { id: 'tail', tag: 'path', attrs: { d: 'M146 100 L192 62 L182 100 L192 138 Z' } },
        { id: 'finTop', tag: 'path', attrs: { d: 'M76 68 Q96 26 126 62 Z' } },
        { id: 'finBottom', tag: 'path', attrs: { d: 'M82 134 Q100 170 124 132 Z' } },
        { id: 'body', tag: 'ellipse', attrs: { cx: 96, cy: 100, rx: 58, ry: 40 } },
        { id: 'stripe', tag: 'path', attrs: { d: 'M112 62 Q126 100 112 138 Q134 130 137 100 Q134 70 112 62 Z' } },
        { id: 'cheek', tag: 'circle', attrs: { cx: 68, cy: 114, r: 9 } },
      ],
      details: `
        <circle cx="64" cy="88" r="9" fill="#fff" stroke="#333" stroke-width="2.5"/>
        <circle cx="66" cy="89" r="4" fill="#333"/>
        <path d="M44 106 Q52 113 60 108" fill="none" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>`,
    },

    dino: {
      name: '꼬마 공룡', emoji: '🦕', habitat: 'walk',
      regions: [
        { id: 'tail', tag: 'path', attrs: { d: 'M156 128 Q198 118 194 84 Q192 70 178 76 Q182 98 148 110 Z' } },
        { id: 'legL', tag: 'rect', attrs: { x: 80, y: 152, width: 22, height: 40, rx: 10 } },
        { id: 'legR', tag: 'rect', attrs: { x: 126, y: 152, width: 22, height: 40, rx: 10 } },
        { id: 'body', tag: 'ellipse', attrs: { cx: 116, cy: 136, rx: 52, ry: 36 } },
        { id: 'neck', tag: 'path', attrs: { d: 'M64 122 Q46 72 56 40 Q74 24 86 44 Q80 84 96 114 Z' } },
        { id: 'head', tag: 'circle', attrs: { cx: 66, cy: 36, r: 22 } },
        { id: 'spot1', tag: 'circle', attrs: { cx: 104, cy: 128, r: 9 } },
        { id: 'spot2', tag: 'circle', attrs: { cx: 132, cy: 146, r: 8 } },
        { id: 'spot3', tag: 'circle', attrs: { cx: 142, cy: 118, r: 7 } },
      ],
      details: `
        <circle cx="60" cy="30" r="4" fill="#333"/>
        <path d="M48 42 Q56 50 64 46" fill="none" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>`,
    },

    flower: {
      name: '방긋 꽃', emoji: '🌸', habitat: 'plant',
      regions: [
        { id: 'stem', tag: 'path', attrs: { d: 'M96 104 Q92 150 98 196 L110 196 Q102 150 106 104 Z' } },
        { id: 'leafL', tag: 'path', attrs: { d: 'M98 152 Q58 140 50 164 Q78 180 98 160 Z' } },
        { id: 'leafR', tag: 'path', attrs: { d: 'M104 136 Q144 124 152 148 Q124 164 104 144 Z' } },
        ...flowerPetals(),
        { id: 'center', tag: 'circle', attrs: { cx: 100, cy: 70, r: 21 } },
      ],
      details: `
        <circle cx="93" cy="66" r="2.8" fill="#333"/>
        <circle cx="107" cy="66" r="2.8" fill="#333"/>
        <path d="M93 76 Q100 82 107 76" fill="none" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>`,
    },

    fairy: {
      name: '하트 요정', emoji: '💖', habitat: 'fly',
      regions: [
        { id: 'wingL', tag: 'path', attrs: { d: 'M62 92 Q14 60 18 100 Q22 132 62 114 Z' } },
        { id: 'wingR', tag: 'path', attrs: { d: 'M138 92 Q186 60 182 100 Q178 132 138 114 Z' } },
        { id: 'dress', tag: 'path', attrs: { d: 'M84 140 Q100 132 116 140 L122 170 Q100 180 78 170 Z' } },
        { id: 'footL', tag: 'circle', attrs: { cx: 88, cy: 178, r: 7 } },
        { id: 'footR', tag: 'circle', attrs: { cx: 112, cy: 178, r: 7 } },
        { id: 'head', tag: 'circle', attrs: { cx: 100, cy: 92, r: 52 } },
        { id: 'face', tag: 'circle', attrs: { cx: 100, cy: 100, r: 36 } },
        { id: 'cheekL', tag: 'circle', attrs: { cx: 78, cy: 110, r: 7 } },
        { id: 'cheekR', tag: 'circle', attrs: { cx: 122, cy: 110, r: 7 } },
        { id: 'heart', tag: 'path', attrs: { d: 'M100 36 C86 22 72 24 74 12 C76 2 92 4 100 14 C108 4 124 2 126 12 C128 24 114 22 100 36 Z' } },
      ],
      details: `
        <path d="M100 36 L100 42" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="86" cy="96" r="7" fill="#333"/>
        <circle cx="114" cy="96" r="7" fill="#333"/>
        <circle cx="88.5" cy="93" r="2.5" fill="#fff"/>
        <circle cx="116.5" cy="93" r="2.5" fill="#fff"/>
        <path d="M92 116 Q100 124 108 116" fill="none" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>`,
    },

    princess: {
      name: '공주님', emoji: '👑', habitat: 'walk',
      regions: [
        { id: 'hair', tag: 'path', attrs: { d: 'M100 16 Q56 20 52 64 Q50 96 64 112 L136 112 Q150 96 148 64 Q144 20 100 16 Z' } },
        { id: 'face', tag: 'circle', attrs: { cx: 100, cy: 64, r: 30 } },
        { id: 'crown', tag: 'path', attrs: { d: 'M80 28 L84 8 L94 20 L100 6 L106 20 L116 8 L120 28 Z' } },
        { id: 'skirt', tag: 'path', attrs: { d: 'M86 106 L54 184 Q100 200 146 184 L114 106 Z' } },
        { id: 'sleeveL', tag: 'circle', attrs: { cx: 80, cy: 112, r: 9 } },
        { id: 'sleeveR', tag: 'circle', attrs: { cx: 120, cy: 112, r: 9 } },
        { id: 'bodice', tag: 'path', attrs: { d: 'M86 104 Q100 96 114 104 L110 132 Q100 138 90 132 Z' } },
        { id: 'cheekL', tag: 'circle', attrs: { cx: 82, cy: 74, r: 5 } },
        { id: 'cheekR', tag: 'circle', attrs: { cx: 118, cy: 74, r: 5 } },
      ],
      details: `
        <circle cx="90" cy="60" r="4" fill="#333"/>
        <circle cx="110" cy="60" r="4" fill="#333"/>
        <path d="M92 76 Q100 82 108 76" fill="none" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>`,
    },

    unicorn: {
      name: '유니콘', emoji: '🦄', habitat: 'walk',
      regions: [
        { id: 'tail', tag: 'path', attrs: { d: 'M158 122 Q194 110 188 78 Q184 64 170 70 Q174 94 148 106 Z' } },
        { id: 'legL', tag: 'rect', attrs: { x: 78, y: 150, width: 20, height: 42, rx: 9 } },
        { id: 'legR', tag: 'rect', attrs: { x: 128, y: 150, width: 20, height: 42, rx: 9 } },
        { id: 'body', tag: 'ellipse', attrs: { cx: 112, cy: 132, rx: 54, ry: 36 } },
        { id: 'mane1', tag: 'circle', attrs: { cx: 96, cy: 52, r: 13 } },
        { id: 'mane2', tag: 'circle', attrs: { cx: 102, cy: 76, r: 12 } },
        { id: 'mane3', tag: 'circle', attrs: { cx: 106, cy: 98, r: 11 } },
        { id: 'neck', tag: 'path', attrs: { d: 'M70 118 Q54 78 62 46 Q76 30 88 48 Q84 84 98 112 Z' } },
        { id: 'earL', tag: 'path', attrs: { d: 'M74 30 L90 14 L84 36 Z' } },
        { id: 'head', tag: 'circle', attrs: { cx: 64, cy: 44, r: 24 } },
        { id: 'horn', tag: 'path', attrs: { d: 'M54 27 L70 22 L40 2 Z' } },
      ],
      details: `
        <circle cx="58" cy="42" r="4" fill="#333"/>
        <path d="M46 52 Q54 58 62 54" fill="none" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>`,
    },

    rabbit: {
      name: '아기 토끼', emoji: '🐰', habitat: 'walk',
      regions: [
        { id: 'earL', tag: 'ellipse', attrs: { cx: 82, cy: 38, rx: 14, ry: 34, transform: 'rotate(-12 82 38)' } },
        { id: 'earR', tag: 'ellipse', attrs: { cx: 118, cy: 38, rx: 14, ry: 34, transform: 'rotate(12 118 38)' } },
        { id: 'earInL', tag: 'ellipse', attrs: { cx: 82, cy: 42, rx: 7, ry: 22, transform: 'rotate(-12 82 42)' } },
        { id: 'earInR', tag: 'ellipse', attrs: { cx: 118, cy: 42, rx: 7, ry: 22, transform: 'rotate(12 118 42)' } },
        { id: 'body', tag: 'ellipse', attrs: { cx: 100, cy: 142, rx: 52, ry: 44 } },
        { id: 'belly', tag: 'ellipse', attrs: { cx: 100, cy: 154, rx: 28, ry: 26 } },
        { id: 'footL', tag: 'ellipse', attrs: { cx: 70, cy: 184, rx: 16, ry: 10 } },
        { id: 'footR', tag: 'ellipse', attrs: { cx: 130, cy: 184, rx: 16, ry: 10 } },
        { id: 'head', tag: 'circle', attrs: { cx: 100, cy: 92, r: 38 } },
      ],
      details: `
        <circle cx="86" cy="86" r="4" fill="#333"/>
        <circle cx="114" cy="86" r="4" fill="#333"/>
        <path d="M95 98 L105 98 L100 104 Z" fill="#333"/>
        <path d="M100 104 Q100 110 92 112 M100 104 Q100 110 108 112" fill="none" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M62 94 L40 90 M62 100 L40 104 M138 94 L160 90 M138 100 L160 104" stroke="#333" stroke-width="2" stroke-linecap="round"/>`,
    },

    duck: {
      name: '아기 오리', emoji: '🦆', habitat: 'pond',
      regions: [
        { id: 'tail', tag: 'path', attrs: { d: 'M146 110 Q174 90 170 116 Q162 130 144 124 Z' } },
        { id: 'body', tag: 'ellipse', attrs: { cx: 102, cy: 126, rx: 52, ry: 34 } },
        { id: 'wing', tag: 'ellipse', attrs: { cx: 114, cy: 124, rx: 26, ry: 16, transform: 'rotate(-15 114 124)' } },
        { id: 'beak', tag: 'path', attrs: { d: 'M40 74 L12 84 L40 94 Q50 88 40 74 Z' } },
        { id: 'head', tag: 'circle', attrs: { cx: 62, cy: 80, r: 28 } },
        { id: 'cheek', tag: 'circle', attrs: { cx: 52, cy: 92, r: 6 } },
      ],
      details: `
        <circle cx="56" cy="72" r="4" fill="#333"/>`,
    },

    starFairy: {
      name: '별 요정', emoji: '⭐', habitat: 'fly',
      regions: [
        { id: 'wingL', tag: 'path', attrs: { d: 'M62 90 L12 64 L36 98 L18 120 L62 116 Z' } },
        { id: 'wingR', tag: 'path', attrs: { d: 'M138 90 L188 64 L164 98 L182 120 L138 116 Z' } },
        { id: 'dress', tag: 'path', attrs: { d: 'M84 140 Q100 132 116 140 L122 170 Q100 180 78 170 Z' } },
        { id: 'footL', tag: 'circle', attrs: { cx: 88, cy: 178, r: 7 } },
        { id: 'footR', tag: 'circle', attrs: { cx: 112, cy: 178, r: 7 } },
        { id: 'head', tag: 'circle', attrs: { cx: 100, cy: 92, r: 52 } },
        { id: 'face', tag: 'circle', attrs: { cx: 100, cy: 100, r: 36 } },
        { id: 'cheekL', tag: 'circle', attrs: { cx: 78, cy: 110, r: 7 } },
        { id: 'cheekR', tag: 'circle', attrs: { cx: 122, cy: 110, r: 7 } },
        { id: 'star', tag: 'path', attrs: { d: 'M100 2 L103.8 11.7 L114.3 12.4 L106.2 19 L108.8 29.1 L100 23.5 L91.2 29.1 L93.8 19 L85.7 12.4 L96.2 11.7 Z' } },
      ],
      details: `
        <path d="M100 32 L100 42" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="86" cy="96" r="7" fill="#333"/>
        <circle cx="114" cy="96" r="7" fill="#333"/>
        <circle cx="88.5" cy="93" r="2.5" fill="#fff"/>
        <circle cx="116.5" cy="93" r="2.5" fill="#fff"/>
        <path d="M92 116 Q100 124 108 116" fill="none" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>`,
    },

    ribbonFairy: {
      name: '리본 요정', emoji: '🎀', habitat: 'fly',
      regions: [
        { id: 'wingL', tag: 'path', attrs: { d: 'M62 92 Q14 60 18 100 Q22 132 62 114 Z' } },
        { id: 'wingR', tag: 'path', attrs: { d: 'M138 92 Q186 60 182 100 Q178 132 138 114 Z' } },
        { id: 'dress', tag: 'path', attrs: { d: 'M84 140 Q100 132 116 140 L122 170 Q100 180 78 170 Z' } },
        { id: 'footL', tag: 'circle', attrs: { cx: 88, cy: 178, r: 7 } },
        { id: 'footR', tag: 'circle', attrs: { cx: 112, cy: 178, r: 7 } },
        { id: 'head', tag: 'circle', attrs: { cx: 100, cy: 92, r: 52 } },
        { id: 'face', tag: 'circle', attrs: { cx: 100, cy: 100, r: 36 } },
        { id: 'cheekL', tag: 'circle', attrs: { cx: 78, cy: 110, r: 7 } },
        { id: 'cheekR', tag: 'circle', attrs: { cx: 122, cy: 110, r: 7 } },
        { id: 'ribbon', tag: 'path', attrs: { d: 'M100 24 L76 8 Q69 22 76 36 L100 24 L124 8 Q131 22 124 36 Z' } },
        { id: 'ribbonKnot', tag: 'circle', attrs: { cx: 100, cy: 23, r: 6 } },
      ],
      details: `
        <path d="M100 30 L100 42" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="86" cy="96" r="7" fill="#333"/>
        <circle cx="114" cy="96" r="7" fill="#333"/>
        <circle cx="88.5" cy="93" r="2.5" fill="#fff"/>
        <circle cx="116.5" cy="93" r="2.5" fill="#fff"/>
        <path d="M92 116 Q100 124 108 116" fill="none" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>`,
    },

    flowerFairy: {
      name: '꽃 요정', emoji: '🌷', habitat: 'fly',
      regions: [
        { id: 'wingL', tag: 'path', attrs: { d: 'M62 92 Q14 60 18 100 Q22 132 62 114 Z' } },
        { id: 'wingR', tag: 'path', attrs: { d: 'M138 92 Q186 60 182 100 Q178 132 138 114 Z' } },
        { id: 'dress', tag: 'path', attrs: { d: 'M84 140 Q100 132 116 140 L122 170 Q100 180 78 170 Z' } },
        { id: 'footL', tag: 'circle', attrs: { cx: 88, cy: 178, r: 7 } },
        { id: 'footR', tag: 'circle', attrs: { cx: 112, cy: 178, r: 7 } },
        { id: 'head', tag: 'circle', attrs: { cx: 100, cy: 92, r: 52 } },
        { id: 'face', tag: 'circle', attrs: { cx: 100, cy: 100, r: 36 } },
        { id: 'cheekL', tag: 'circle', attrs: { cx: 78, cy: 110, r: 7 } },
        { id: 'cheekR', tag: 'circle', attrs: { cx: 122, cy: 110, r: 7 } },
        { id: 'tulip', tag: 'path', attrs: { d: 'M86 4 Q84 26 100 32 Q116 26 114 4 Q107 14 100 4 Q93 14 86 4 Z' } },
      ],
      details: `
        <path d="M100 32 L100 42" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="86" cy="96" r="7" fill="#333"/>
        <circle cx="114" cy="96" r="7" fill="#333"/>
        <circle cx="88.5" cy="93" r="2.5" fill="#fff"/>
        <circle cx="116.5" cy="93" r="2.5" fill="#fff"/>
        <path d="M92 116 Q100 124 108 116" fill="none" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>`,
    },

    snowPrincess: {
      name: '눈의 공주', emoji: '❄️', habitat: 'walk',
      regions: [
        { id: 'hair', tag: 'path', attrs: { d: 'M100 16 Q56 20 52 64 Q50 96 64 112 L136 112 Q150 96 148 64 Q144 20 100 16 Z' } },
        { id: 'braid', tag: 'path', attrs: { d: 'M134 98 Q152 128 146 164 Q138 178 128 164 Q136 132 122 106 Z' } },
        { id: 'face', tag: 'circle', attrs: { cx: 100, cy: 64, r: 30 } },
        { id: 'tiara', tag: 'path', attrs: { d: 'M82 28 Q100 12 118 28 L114 38 Q100 28 86 38 Z' } },
        { id: 'skirt', tag: 'path', attrs: { d: 'M86 106 L50 188 Q100 204 150 188 L114 106 Z' } },
        { id: 'sleeveL', tag: 'circle', attrs: { cx: 80, cy: 112, r: 9 } },
        { id: 'sleeveR', tag: 'circle', attrs: { cx: 120, cy: 112, r: 9 } },
        { id: 'bodice', tag: 'path', attrs: { d: 'M86 104 Q100 96 114 104 L110 132 Q100 138 90 132 Z' } },
        { id: 'cheekL', tag: 'circle', attrs: { cx: 82, cy: 74, r: 5 } },
        { id: 'cheekR', tag: 'circle', attrs: { cx: 118, cy: 74, r: 5 } },
      ],
      details: `
        <circle cx="90" cy="60" r="4" fill="#333"/>
        <circle cx="110" cy="60" r="4" fill="#333"/>
        <path d="M92 76 Q100 82 108 76" fill="none" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
        <g stroke="#333" stroke-width="2" stroke-linecap="round" opacity=".8">
          <path d="M100 152 L100 172 M91 157 L109 167 M109 157 L91 167"/>
        </g>`,
    },

    bird: {
      name: '아기 새', emoji: '🐦', habitat: 'fly',
      regions: [
        { id: 'tail', tag: 'path', attrs: { d: 'M148 106 L190 90 L184 112 L192 128 L150 122 Z' } },
        { id: 'body', tag: 'ellipse', attrs: { cx: 102, cy: 110, rx: 50, ry: 38 } },
        { id: 'belly', tag: 'ellipse', attrs: { cx: 92, cy: 124, rx: 26, ry: 20 } },
        { id: 'wing', tag: 'ellipse', attrs: { cx: 116, cy: 100, rx: 28, ry: 15, transform: 'rotate(-22 116 100)' } },
        { id: 'tuft', tag: 'path', attrs: { d: 'M74 54 Q66 34 82 26 Q80 42 92 50 Z' } },
        { id: 'beak', tag: 'path', attrs: { d: 'M52 70 L26 80 L52 90 Z' } },
        { id: 'head', tag: 'circle', attrs: { cx: 74, cy: 76, r: 27 } },
      ],
      details: `
        <circle cx="66" cy="70" r="4.5" fill="#333"/>
        <path d="M56 84 Q62 88 68 85" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round"/>`,
    },

    bee: {
      name: '꿀벌', emoji: '🐝', habitat: 'fly',
      regions: [
        { id: 'wingL', tag: 'ellipse', attrs: { cx: 86, cy: 46, rx: 17, ry: 27, transform: 'rotate(-22 86 46)' } },
        { id: 'wingR', tag: 'ellipse', attrs: { cx: 124, cy: 46, rx: 17, ry: 27, transform: 'rotate(22 124 46)' } },
        { id: 'stinger', tag: 'path', attrs: { d: 'M150 108 L178 102 L156 124 Z' } },
        { id: 'body', tag: 'ellipse', attrs: { cx: 104, cy: 110, rx: 52, ry: 38 } },
        { id: 'stripe1', tag: 'ellipse', attrs: { cx: 96, cy: 110, rx: 10, ry: 37 } },
        { id: 'stripe2', tag: 'ellipse', attrs: { cx: 124, cy: 110, rx: 9, ry: 33 } },
        { id: 'head', tag: 'circle', attrs: { cx: 54, cy: 96, r: 25 } },
      ],
      details: `
        <path d="M46 74 Q38 58 26 54 M60 73 Q60 54 72 46" fill="none" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="26" cy="54" r="3.5" fill="#333"/>
        <circle cx="72" cy="46" r="3.5" fill="#333"/>
        <circle cx="48" cy="90" r="4.5" fill="#333"/>
        <path d="M40 104 Q48 110 56 106" fill="none" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>`,
    },

    dragon: {
      name: '아기 드래곤', emoji: '🐲', habitat: 'fly',
      regions: [
        { id: 'tail', tag: 'path', attrs: { d: 'M154 126 Q192 114 188 84 Q186 72 172 76 Q176 96 146 108 Z' } },
        { id: 'tailTip', tag: 'path', attrs: { d: 'M182 72 L198 78 L186 92 Z' } },
        { id: 'wing', tag: 'path', attrs: { d: 'M104 82 Q96 28 56 32 Q76 46 72 62 Q86 58 84 78 Q96 74 104 92 Z' } },
        { id: 'legL', tag: 'rect', attrs: { x: 84, y: 154, width: 20, height: 36, rx: 9 } },
        { id: 'legR', tag: 'rect', attrs: { x: 124, y: 154, width: 20, height: 36, rx: 9 } },
        { id: 'body', tag: 'ellipse', attrs: { cx: 112, cy: 134, rx: 50, ry: 36 } },
        { id: 'belly', tag: 'ellipse', attrs: { cx: 104, cy: 146, rx: 28, ry: 20 } },
        { id: 'hornL', tag: 'path', attrs: { d: 'M64 62 L52 40 L76 54 Z' } },
        { id: 'hornR', tag: 'path', attrs: { d: 'M88 58 L96 36 L74 52 Z' } },
        { id: 'head', tag: 'circle', attrs: { cx: 74, cy: 84, r: 30 } },
        { id: 'cheek', tag: 'circle', attrs: { cx: 56, cy: 96, r: 6 } },
      ],
      details: `
        <circle cx="66" cy="78" r="4.5" fill="#333"/>
        <circle cx="50" cy="84" r="2" fill="#333"/>
        <path d="M56 106 Q66 112 76 107" fill="none" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>`,
    },
  };

  // 색칠용 팔레트
  const PALETTE = [
    '#ff5252', '#ff9800', '#ffd600', '#8bc34a', '#00bcd4', '#2196f3', '#7c4dff',
    '#f06292', '#a1887f', '#4a3b52', '#9e9e9e', '#66bb6a', '#ffab91', '#ffffff',
  ];

  // 질감 패턴 (흰/검 반투명이라 어떤 색 위에서도 어울림)
  const TEXTURE_DEFS = `<defs>
    <pattern id="tex-brush" width="14" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(-8)">
      <path d="M0 2 H14" stroke="#fff" stroke-opacity=".32" stroke-width="2.2"/>
      <path d="M0 6.5 H14" stroke="#000" stroke-opacity=".10" stroke-width="1.6"/>
    </pattern>
    <pattern id="tex-crayon" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
      <path d="M0 1.2 H7" stroke="#fff" stroke-opacity=".42" stroke-width="1.5" stroke-dasharray="3 1.5"/>
      <path d="M0 4.8 H7" stroke="#000" stroke-opacity=".10" stroke-width="1.2" stroke-dasharray="2 2"/>
    </pattern>
    <pattern id="tex-marker" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(90)">
      <rect x="0" y="0" width="12" height="6" fill="#fff" opacity=".15"/>
      <path d="M0 0 H12" stroke="#000" stroke-opacity=".08" stroke-width="1.2"/>
    </pattern>
  </defs>`;

  // colors[id]는 '#hex' (민무늬) 또는 {c:'#hex', t:'brush|crayon|marker'} (질감)
  function parseFill(v) {
    if (!v) return { color: '#ffffff', tex: null };
    if (typeof v === 'string') return { color: v, tex: null };
    return { color: v.c || '#ffffff', tex: v.t || null };
  }

  // 템플릿 + 색 정보로 SVG 문자열 생성 (editable이면 모든 영역에 질감 오버레이 슬롯 생성)
  function buildSVG(tplId, colors, opts = {}) {
    const t = templates[tplId];
    if (!t) return '';
    let s = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">` + TEXTURE_DEFS;
    for (const r of t.regions) {
      const { color, tex } = parseFill(colors && colors[r.id]);
      const attrs = Object.entries(r.attrs)
        .map(([k, v]) => `${k}="${v}"`).join(' ');
      s += `<${r.tag} ${attrs} fill="${color}" stroke="#333" stroke-width="3.5" stroke-linejoin="round" data-region="${r.id}"/>`;
      if (tex || opts.editable) {
        s += `<${r.tag} ${attrs} fill="${tex ? `url(#tex-${tex})` : 'none'}" stroke="none" pointer-events="none" data-tex-for="${r.id}"/>`;
      }
    }
    s += t.details + '</svg>';
    return s;
  }

  return { templates, PALETTE, buildSVG };
})();
