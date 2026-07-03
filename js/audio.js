// 간단한 WebAudio 효과음 — 외부 파일 없이 모두 합성
const Sound = (() => {
  let ctx = null;

  function ac() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // 첫 터치에서 오디오 잠금 해제
  document.addEventListener('pointerdown', () => { try { ac(); } catch (e) {} }, { capture: true });

  function tone({ freq = 440, freqEnd = null, dur = 0.2, type = 'sine', vol = 0.22, when = 0 }) {
    try {
      const c = ac();
      const t0 = c.currentTime + when;
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t0);
      if (freqEnd) osc.frequency.exponentialRampToValueAtTime(Math.max(freqEnd, 1), t0 + dur);
      gain.gain.setValueAtTime(vol, t0);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
      osc.connect(gain).connect(c.destination);
      osc.start(t0);
      osc.stop(t0 + dur + 0.05);
    } catch (e) {}
  }

  const NOTE_FREQ = {
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23,
    G4: 392.0, A4: 440.0, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25,
  };

  return {
    NOTE_FREQ,
    tone,
    pop()   { tone({ freq: 520, freqEnd: 90, dur: 0.13, type: 'square', vol: 0.15 }); },
    ding()  { tone({ freq: 880, dur: 0.18, type: 'triangle' }); },
    blip()  { tone({ freq: 660, freqEnd: 990, dur: 0.1, type: 'sine', vol: 0.15 }); },
    buzz()  { tone({ freq: 130, dur: 0.18, type: 'sawtooth', vol: 0.1 }); },
    bonk()  { tone({ freq: 240, freqEnd: 60, dur: 0.15, type: 'square', vol: 0.18 }); },
    heart() { tone({ freq: 660, dur: 0.1 }); tone({ freq: 880, dur: 0.14, when: 0.09 }); },
    note(name, dur = 0.35) { tone({ freq: NOTE_FREQ[name] || 440, dur, type: 'triangle', vol: 0.3 }); },
    yay() {
      ['C4', 'E4', 'G4', 'C5'].forEach((n, i) =>
        tone({ freq: NOTE_FREQ[n], dur: 0.22, type: 'triangle', vol: 0.25, when: i * 0.11 }));
    },
    fanfare() {
      ['C4', 'C4', 'G4', 'G4', 'A4', 'A4', 'G4'].forEach((n, i) =>
        tone({ freq: NOTE_FREQ[n], dur: 0.2, type: 'triangle', vol: 0.22, when: i * 0.13 }));
    },
  };
})();
