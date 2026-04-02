// =============================================
//  대한민국 직장인 생존기 — 사운드 엔진 v2.0
//  Web Audio API 기반 (외부 파일 없음)
// =============================================

var SFX = (function() {
  var ctx = null;
  var enabled = true;
  var masterVol = 0.5;

  function getCtx() {
    if (!ctx) {
      try {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch(e) {
        enabled = false;
      }
    }
    if (ctx && ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function playTone(freq, type, duration, vol, startDelay) {
    if (!enabled) return;
    var c = getCtx();
    if (!c) return;
    var osc  = c.createOscillator();
    var gain = c.createGain();
    osc.type = type || 'sine';
    osc.frequency.value = freq;
    gain.gain.value = (vol || 0.3) * masterVol;
    osc.connect(gain);
    gain.connect(c.destination);
    var now = c.currentTime + (startDelay || 0);
    osc.start(now);
    gain.gain.setValueAtTime((vol || 0.3) * masterVol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.stop(now + duration + 0.05);
  }

  function playNoise(duration, vol, filter) {
    if (!enabled) return;
    var c = getCtx();
    if (!c) return;
    var bufferSize = Math.floor(c.sampleRate * duration);
    var buffer = c.createBuffer(1, bufferSize, c.sampleRate);
    var data = buffer.getChannelData(0);
    for (var i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    var source = c.createBufferSource();
    source.buffer = buffer;
    var gain = c.createGain();
    gain.gain.value = (vol || 0.1) * masterVol;
    if (filter) {
      var filt = c.createBiquadFilter();
      filt.type = filter.type || 'highpass';
      filt.frequency.value = filter.freq || 2000;
      filt.Q.value = filter.Q || 0.5;
      source.connect(filt);
      filt.connect(gain);
    } else {
      source.connect(gain);
    }
    gain.connect(c.destination);
    gain.gain.setValueAtTime((vol || 0.1) * masterVol, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
    source.start(c.currentTime);
    source.stop(c.currentTime + duration + 0.05);
  }

  // ============================================
  //  효과음 모음
  // ============================================
  var sounds = {

    typeChar: function() {
      if (!enabled) return;
      var c = getCtx();
      if (!c) return;
      playNoise(0.04, 0.06, { type:'bandpass', freq: 3000 + Math.random()*1500, Q:2 });
      playTone(1800 + Math.random()*400, 'square', 0.025, 0.04);
    },

    typeReturn: function() {
      if (!enabled) return;
      playNoise(0.12, 0.12, { type:'bandpass', freq:1800, Q:1.5 });
      playTone(320, 'sawtooth', 0.08, 0.05);
      setTimeout(function() { playTone(180, 'sawtooth', 0.06, 0.04); }, 60);
    },

    click: function() {
      if (!enabled) return;
      playTone(800, 'sine', 0.06, 0.3);
      playTone(1200, 'sine', 0.04, 0.15, 0.02);
    },

    hover: function() {
      if (!enabled) return;
      playTone(600, 'sine', 0.03, 0.08);
    },

    good: function() {
      if (!enabled) return;
      var notes = [523, 659, 784, 1047];
      notes.forEach(function(f, i) {
        setTimeout(function() { playTone(f, 'sine', 0.15, 0.25); }, i * 80);
      });
    },

    bad: function() {
      if (!enabled) return;
      playTone(220, 'sawtooth', 0.3, 0.35);
      setTimeout(function() { playTone(180, 'sawtooth', 0.25, 0.3); }, 150);
      setTimeout(function() { playTone(140, 'sawtooth', 0.3, 0.35); }, 280);
    },

    money: function() {
      if (!enabled) return;
      var notes = [659, 784, 1047, 1319];
      notes.forEach(function(f, i) {
        setTimeout(function() { playTone(f, 'triangle', 0.12, 0.2); }, i * 60);
      });
      setTimeout(function() {
        playNoise(0.08, 0.08, { type:'highpass', freq:5000, Q:3 });
      }, 240);
    },

    family: function() {
      if (!enabled) return;
      playTone(523, 'sine', 0.2, 0.2);
      setTimeout(function() { playTone(659, 'sine', 0.2, 0.2); }, 120);
      setTimeout(function() { playTone(784, 'sine', 0.3, 0.25); }, 240);
    },

    historic: function() {
      if (!enabled) return;
      var c = getCtx();
      if (!c) return;
      for (var i = 0; i < 3; i++) {
        (function(idx) {
          setTimeout(function() {
            playTone(880, 'sawtooth', 0.12, 0.4);
            setTimeout(function() { playTone(660, 'sawtooth', 0.1, 0.35); }, 80);
          }, idx * 220);
        })(i);
      }
      setTimeout(function() { playTone(60, 'sine', 0.4, 0.5); }, 50);
    },

    gameStart: function() {
      if (!enabled) return;
      var melody = [261, 329, 392, 523, 659, 784];
      melody.forEach(function(f, i) {
        setTimeout(function() { playTone(f, 'triangle', 0.18, 0.3); }, i * 90);
      });
      setTimeout(function() {
        playTone(1047, 'sine', 0.5, 0.45);
      }, melody.length * 90);
    },

    createDone: function() {
      if (!enabled) return;
      var fanfare = [523, 659, 784, 523, 659, 784, 1047];
      fanfare.forEach(function(f, i) {
        setTimeout(function() { playTone(f, 'triangle', 0.2, 0.35); }, i * 70);
      });
    },

    overtime: function() {
      if (!enabled) return;
      playTone(300, 'sawtooth', 0.2, 0.3);
      setTimeout(function() { playTone(250, 'sawtooth', 0.2, 0.3); }, 200);
      setTimeout(function() { playTone(200, 'sawtooth', 0.3, 0.35); }, 400);
    },

    lotto: function() {
      if (!enabled) return;
      var c = getCtx();
      if (!c) return;
      var osc  = c.createOscillator();
      var gain = c.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, c.currentTime);
      osc.frequency.exponentialRampToValueAtTime(2000, c.currentTime + 0.5);
      gain.gain.setValueAtTime(0.4 * masterVol, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.55);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start(c.currentTime);
      osc.stop(c.currentTime + 0.6);
      setTimeout(function() { sounds.good(); }, 600);
      setTimeout(function() {
        var epic = [523,659,784,1047,1319,1568,2093];
        epic.forEach(function(f,i) {
          setTimeout(function(){ playTone(f,'triangle',0.3,0.5); }, i*60);
        });
      }, 900);
    },

    lottoBad: function() {
      if (!enabled) return;
      var c = getCtx();
      if (!c) return;
      var osc  = c.createOscillator();
      var gain = c.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(400, c.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, c.currentTime + 0.5);
      gain.gain.setValueAtTime(0.3 * masterVol, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.55);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start(c.currentTime);
      osc.stop(c.currentTime + 0.6);
    },

    screenTransition: function() {
      if (!enabled) return;
      playTone(440, 'sine', 0.12, 0.2);
      setTimeout(function() { playTone(660, 'sine', 0.1, 0.15); }, 100);
    },

    ending: function() {
      if (!enabled) return;
      var c = getCtx();
      if (!c) return;
      var seq = [
        [392, 0], [523, 150], [659, 300], [784, 450],
        [659, 600], [784, 750], [1047, 900]
      ];
      seq.forEach(function(note) {
        setTimeout(function() {
          playTone(note[0], 'triangle', 0.25, 0.3);
        }, note[1]);
      });
    },

    stressAlert: function() {
      if (!enabled) return;
      playTone(440, 'sawtooth', 0.08, 0.35);
      setTimeout(function() { playTone(440, 'sawtooth', 0.08, 0.35); }, 200);
      setTimeout(function() { playTone(440, 'sawtooth', 0.08, 0.35); }, 400);
    },

    relationUp: function() {
      if (!enabled) return;
      playTone(784, 'sine', 0.12, 0.2);
      setTimeout(function() { playTone(1047, 'sine', 0.1, 0.18); }, 100);
    },

    relationDown: function() {
      if (!enabled) return;
      playTone(300, 'sine', 0.1, 0.2);
      setTimeout(function() { playTone(220, 'sine', 0.1, 0.2); }, 120);
    },

    alarm: function() {
      if (!enabled) return;
      for (var i = 0; i < 4; i++) {
        (function(idx) {
          setTimeout(function() {
            playTone(880, 'square', 0.06, 0.25);
            setTimeout(function() { playTone(1100, 'square', 0.05, 0.2); }, 80);
          }, idx * 200);
        })(i);
      }
    },

    cardOpen: function() {
      if (!enabled) return;
      playTone(523, 'sine', 0.08, 0.2);
      setTimeout(function() { playTone(784, 'sine', 0.06, 0.15); }, 80);
    },

    shock: function() {
      if (!enabled) return;
      var c = getCtx();
      if (!c) return;
      playTone(50, 'sawtooth', 0.5, 0.7);
      setTimeout(function() { playTone(80, 'sawtooth', 0.4, 0.4); }, 100);
      playNoise(0.3, 0.15, { type:'lowpass', freq:500, Q:1 });
    },

    coin: function() {
      if (!enabled) return;
      playNoise(0.06, 0.1, { type:'highpass', freq:6000, Q:4 });
      playTone(1800, 'sine', 0.06, 0.15);
      setTimeout(function() { playTone(2200, 'sine', 0.04, 0.1); }, 40);
    },

  };

  // ============================================
  //  타이핑 효과음
  // ============================================
  var _typeCharCount = 0;
  var _lastTypeTime  = 0;

  function onTypeChar() {
    if (!enabled) return;
    var now = Date.now();
    if (now - _lastTypeTime < 30) return;
    _lastTypeTime = now;
    _typeCharCount++;
    if (_typeCharCount % 8 === 0) {
      sounds.typeReturn();
    } else {
      sounds.typeChar();
    }
  }

  // ============================================
  //  UI — 음소거 버튼
  // ============================================
  function initSoundToggle() {
    var btn = document.createElement('button');
    btn.id = 'btn-sound-toggle';
    btn.title = '효과음/BGM ON/OFF';
    btn.innerHTML = '🔊';
    btn.style.cssText = [
      'position:fixed',
      'bottom:18px',
      'right:18px',
      'z-index:9999',
      'width:40px',
      'height:40px',
      'border-radius:50%',
      'border:2px solid var(--primary,#00ff88)',
      'background:rgba(0,0,0,0.7)',
      'color:var(--primary,#00ff88)',
      'font-size:18px',
      'cursor:pointer',
      'display:flex',
      'align-items:center',
      'justify-content:center',
      'transition:all .2s',
      'backdrop-filter:blur(6px)',
      'box-shadow:0 0 12px rgba(0,255,136,0.3)'
    ].join(';');
    btn.addEventListener('click', function() {
      enabled = !enabled;
      btn.innerHTML = enabled ? '🔊' : '🔇';
      btn.style.opacity = enabled ? '1' : '0.5';
      if (typeof BGM !== 'undefined') {
        if (!enabled) BGM.stop();
      }
      if (enabled) {
        getCtx();
        sounds.click();
      }
    });
    document.body.appendChild(btn);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSoundToggle);
  } else {
    initSoundToggle();
  }

  return {
    play: function(name) {
      if (sounds[name]) sounds[name]();
    },
    onTypeChar: onTypeChar,
    setVolume: function(v) { masterVol = Math.max(0, Math.min(1, v)); },
    isEnabled: function() { return enabled; },
    enable:    function() { enabled = true;  getCtx(); },
    disable:   function() { enabled = false; },
  };
})();


// =============================================
//  BGM 엔진 — 시대별 배경음악 (Web Audio API)
//  MIDI 스타일 합성, 외부 파일 없음, 루프 재생
// =============================================
var BGM = (function() {
  var ctx        = null;
  var masterGain = null;
  var vol        = 0.15;
  var stopFlag   = true;
  var loopTimer  = null;

  function getCtx() {
    if (!ctx) {
      try { ctx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch(e) { return null; }
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function getMG() {
    if (!masterGain) {
      masterGain = ctx.createGain();
      masterGain.gain.value = vol;
      masterGain.connect(ctx.destination);
    }
    return masterGain;
  }

  // MIDI 번호 → 주파수
  function m2f(m) { return 440 * Math.pow(2, (m - 69) / 12); }

  // 음표 하나 재생
  function playNote(mg, midi, dur, t, type, g) {
    if (stopFlag || !ctx) return;
    var osc  = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = type || 'triangle';
    osc.frequency.value = m2f(midi);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(g || 0.5, t + 0.02);
    gain.gain.setValueAtTime(g || 0.5, t + dur - 0.05);
    gain.gain.linearRampToValueAtTime(0, t + dur);
    osc.connect(gain);
    gain.connect(mg);
    osc.start(t);
    osc.stop(t + dur + 0.01);
  }

  // 킥 드럼
  function kick(mg, t) {
    if (stopFlag || !ctx) return;
    var o = ctx.createOscillator();
    var g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(140, t);
    o.frequency.exponentialRampToValueAtTime(40, t + 0.15);
    g.gain.setValueAtTime(0.7, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    o.connect(g); g.connect(mg); o.start(t); o.stop(t + 0.2);
  }

  // 스네어
  function snare(mg, t) {
    if (stopFlag || !ctx) return;
    var sr  = ctx.sampleRate;
    var buf = ctx.createBuffer(1, Math.floor(sr * 0.1), sr);
    var dat = buf.getChannelData(0);
    for (var i = 0; i < dat.length; i++) dat[i] = Math.random() * 2 - 1;
    var src = ctx.createBufferSource();
    var flt = ctx.createBiquadFilter();
    var g   = ctx.createGain();
    src.buffer = buf;
    flt.type = 'bandpass'; flt.frequency.value = 2800;
    g.gain.setValueAtTime(0.35, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    src.connect(flt); flt.connect(g); g.connect(mg);
    src.start(t); src.stop(t + 0.11);
  }

  // 하이햇
  function hat(mg, t) {
    if (stopFlag || !ctx) return;
    var sr  = ctx.sampleRate;
    var buf = ctx.createBuffer(1, Math.floor(sr * 0.04), sr);
    var dat = buf.getChannelData(0);
    for (var i = 0; i < dat.length; i++) dat[i] = Math.random() * 2 - 1;
    var src = ctx.createBufferSource();
    var flt = ctx.createBiquadFilter();
    var g   = ctx.createGain();
    src.buffer = buf;
    flt.type = 'highpass'; flt.frequency.value = 9000;
    g.gain.setValueAtTime(0.15, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    src.connect(flt); flt.connect(g); g.connect(mg);
    src.start(t); src.stop(t + 0.05);
  }

  // ── 시대별 악보 ──────────────────────────────
  var SONGS = {
    '1980': {
      bpm: 112,
      mel: [
        [60,0.5],[62,0.5],[64,0.5],[67,0.5],
        [69,0.5],[67,0.5],[64,0.5],[62,0.5],
        [60,0.5],[64,0.5],[67,0.5],[69,0.5],
        [72,1.0],[69,0.5],[67,0.5],
        [65,0.5],[64,0.5],[62,0.5],[60,0.5],
        [62,0.5],[64,0.5],[67,0.5],[60,1.5]
      ],
      bass: [[48,1],[52,1],[55,1],[48,1],[43,1],[47,1],[48,2]],
      drums: true, mtype:'square'
    },
    '1997': {
      bpm: 72,
      mel: [
        [69,1],[68,0.5],[67,0.5],[65,1],[64,1],
        [62,0.5],[64,0.5],[65,1],[67,1],
        [65,0.5],[64,0.5],[62,1],[60,2]
      ],
      bass: [[45,2],[40,2],[38,2],[45,2],[43,2],[38,4]],
      drums: false, mtype:'sawtooth'
    },
    '2000': {
      bpm: 130,
      mel: [
        [72,0.25],[74,0.25],[76,0.5],[74,0.25],[72,0.25],
        [71,0.5],[69,0.5],[71,0.25],[72,0.25],[74,0.5],
        [72,0.25],[71,0.25],[69,1],[67,1],
        [76,0.25],[77,0.25],[79,0.5],[77,0.25],[76,0.25],
        [74,0.5],[72,0.5],[71,0.25],[72,0.25],[74,1],[72,0.5],[69,1.5]
      ],
      bass: [[48,0.5],[48,0.5],[52,0.5],[55,0.5],[48,0.5],[50,0.5],[52,0.5],[48,0.5]],
      drums: true, mtype:'triangle'
    },
    '2010': {
      bpm: 122,
      mel: [
        [76,0.5],[74,0.5],[72,0.5],[71,0.5],[72,1],[69,1],
        [71,0.5],[72,0.5],[74,0.5],[72,0.5],[71,1],[69,1],
        [74,0.5],[76,0.5],[77,0.5],[76,0.5],[74,1],[72,1],
        [71,0.5],[69,0.5],[67,1],[69,2]
      ],
      bass: [[48,1],[55,1],[53,1],[50,1],[48,1],[52,1],[55,1],[57,1]],
      drums: true, mtype:'sine'
    },
    '2020': {
      bpm: 58,
      mel: [
        [64,2],[67,2],[69,2],[67,2],
        [65,2],[64,2],[62,2],[60,4]
      ],
      bass: [[40,4],[43,4],[38,4],[40,4]],
      drums: false, mtype:'sine'
    },
    '2026': {
      bpm: 102,
      mel: [
        [84,0.25],[82,0.25],[81,0.5],[79,0.5],
        [77,0.5],[79,0.5],[81,0.5],[79,0.5],
        [77,0.25],[76,0.25],[74,0.5],[72,0.5],[71,1],[72,1],
        [74,0.25],[76,0.25],[77,0.5],[76,0.25],[74,0.25],
        [72,0.5],[71,0.5],[69,1],[67,2]
      ],
      bass: [[43,1],[48,1],[55,1],[48,1],[45,1],[50,1],[57,1],[55,1]],
      drums: true, mtype:'triangle'
    },
    'title': {
      bpm: 88,
      mel: [
        [67,0.5],[69,0.5],[71,1],[74,1],[71,0.5],[72,0.5],[69,2],
        [64,0.5],[67,0.5],[69,1],[72,1],[69,0.5],[67,0.5],[64,2]
      ],
      bass: [[43,2],[47,2],[48,2],[43,2],[40,2],[43,2],[45,2],[43,2]],
      drums: false, mtype: 'sine'
    }
  };

  // ── 루프 스케줄러 ─────────────────────────────
  function scheduleLoop(song, when) {
    if (stopFlag) return;
    var c = getCtx();
    if (!c) return;
    var mg   = getMG();
    var beat = 60 / song.bpm;
    var t    = when;

    // 멜로디
    song.mel.forEach(function(n) {
      if (!stopFlag) playNote(mg, n[0], n[1] * beat * 0.9, t, song.mtype, 0.5);
      t += n[1] * beat;
    });

    // 베이스
    var tb = when;
    song.bass.forEach(function(n) {
      if (!stopFlag) playNote(mg, n[0], n[1] * beat * 0.85, tb, 'sine', 0.32);
      tb += n[1] * beat;
    });

    // 드럼
    if (song.drums) {
      var total = song.mel.reduce(function(s,n) { return s + n[1]; }, 0);
      var td = when;
      var idx = 0;
      while (td < when + total * beat - beat * 0.4) {
        kick(mg, td);
        hat(mg, td + beat * 0.25);
        hat(mg, td + beat * 0.5);
        hat(mg, td + beat * 0.75);
        if (idx % 2 === 1) snare(mg, td);
        td  += beat;
        idx += 1;
      }
    }

    var dur = t - when;
    loopTimer = setTimeout(function() {
      if (!stopFlag) scheduleLoop(song, ctx.currentTime + 0.05);
    }, Math.max(0, (dur - 0.3) * 1000));
  }

  return {
    play: function(eraId) {
      var c = getCtx();
      if (!c) return;
      this.stop();
      stopFlag   = false;
      masterGain = null;
      var song = SONGS[eraId] || SONGS['2026'];
      loopTimer = setTimeout(function() {
        if (!stopFlag && ctx) scheduleLoop(song, ctx.currentTime + 0.1);
      }, 600);
    },
    stop: function() {
      stopFlag = true;
      if (loopTimer) { clearTimeout(loopTimer); loopTimer = null; }
      if (masterGain && ctx) {
        try {
          masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
          masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
        } catch(e) {}
        setTimeout(function() { masterGain = null; }, 600);
      }
    },
    setVolume: function(v) {
      vol = Math.max(0, Math.min(1, v));
      if (masterGain) masterGain.gain.value = vol;
    },
    isPlaying: function() { return !stopFlag; }
  };
})();
