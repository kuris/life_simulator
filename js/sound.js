// =============================================
//  대한민국 직장인 생존기 — 사운드 엔진 v1.0
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
    // 브라우저 자동재생 정책: 사용자 제스처 후 resume
    if (ctx && ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function masterGain(gainNode) {
    var mg = ctx.createGain();
    mg.gain.value = masterVol;
    gainNode.connect(mg);
    mg.connect(ctx.destination);
    return mg;
  }

  // ── 기본 오실레이터 ──────────────────────────
  function playTone(freq, type, duration, vol, startDelay, fadeOut) {
    if (!enabled) return;
    var c = getCtx();
    if (!c) return;
    var osc = c.createOscillator();
    var gain = c.createGain();
    osc.type = type || 'sine';
    osc.frequency.value = freq;
    gain.gain.value = (vol || 0.3) * masterVol;
    osc.connect(gain);
    gain.connect(c.destination);
    var now = c.currentTime + (startDelay || 0);
    osc.start(now);
    if (fadeOut !== false) {
      gain.gain.setValueAtTime((vol || 0.3) * masterVol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    }
    osc.stop(now + duration + 0.05);
  }

  // ── 노이즈 생성기 (타자 소리 등) ─────────────
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

    // ── 타자기 한 글자 ──────────────────────────
    typeChar: function() {
      if (!enabled) return;
      var c = getCtx();
      if (!c) return;
      // 짧은 클릭 + 고주파 노이즈
      playNoise(0.04, 0.06, { type:'bandpass', freq: 3000 + Math.random()*1500, Q:2 });
      playTone(1800 + Math.random()*400, 'square', 0.025, 0.04);
    },

    // ── 타자기 줄 바꿈 (캐리지 리턴) ─────────────
    typeReturn: function() {
      if (!enabled) return;
      playNoise(0.12, 0.12, { type:'bandpass', freq:1800, Q:1.5 });
      playTone(320, 'sawtooth', 0.08, 0.05);
      setTimeout(function() { playTone(180, 'sawtooth', 0.06, 0.04); }, 60);
    },

    // ── 버튼 클릭 ────────────────────────────────
    click: function() {
      if (!enabled) return;
      playTone(800, 'sine', 0.06, 0.3);
      playTone(1200, 'sine', 0.04, 0.15, 0.02);
    },

    // ── 선택지 호버 ──────────────────────────────
    hover: function() {
      if (!enabled) return;
      playTone(600, 'sine', 0.03, 0.08);
    },

    // ── 좋은 결과 (good) ─────────────────────────
    good: function() {
      if (!enabled) return;
      var notes = [523, 659, 784, 1047]; // C5 E5 G5 C6
      notes.forEach(function(f, i) {
        setTimeout(function() { playTone(f, 'sine', 0.15, 0.25); }, i * 80);
      });
    },

    // ── 나쁜 결과 (bad) ──────────────────────────
    bad: function() {
      if (!enabled) return;
      playTone(220, 'sawtooth', 0.3, 0.35);
      setTimeout(function() { playTone(180, 'sawtooth', 0.25, 0.3); }, 150);
      setTimeout(function() { playTone(140, 'sawtooth', 0.3, 0.35); }, 280);
    },

    // ── 돈/수익 ──────────────────────────────────
    money: function() {
      if (!enabled) return;
      var notes = [659, 784, 1047, 1319]; // E5 G5 C6 E6
      notes.forEach(function(f, i) {
        setTimeout(function() { playTone(f, 'triangle', 0.12, 0.2); }, i * 60);
      });
      // 동전 효과
      setTimeout(function() {
        playNoise(0.08, 0.08, { type:'highpass', freq:5000, Q:3 });
      }, 240);
    },

    // ── 가족/관계 ─────────────────────────────────
    family: function() {
      if (!enabled) return;
      playTone(523, 'sine', 0.2, 0.2);
      setTimeout(function() { playTone(659, 'sine', 0.2, 0.2); }, 120);
      setTimeout(function() { playTone(784, 'sine', 0.3, 0.25); }, 240);
    },

    // ── 역사적 이벤트 / 경보 ──────────────────────
    historic: function() {
      if (!enabled) return;
      var c = getCtx();
      if (!c) return;
      // 경보음 느낌
      for (var i = 0; i < 3; i++) {
        (function(idx) {
          setTimeout(function() {
            playTone(880, 'sawtooth', 0.12, 0.4);
            setTimeout(function() { playTone(660, 'sawtooth', 0.1, 0.35); }, 80);
          }, idx * 220);
        })(i);
      }
      // 저주파 드럼
      setTimeout(function() { playTone(60, 'sine', 0.4, 0.5); }, 50);
    },

    // ── 게임 시작 ─────────────────────────────────
    gameStart: function() {
      if (!enabled) return;
      var melody = [261, 329, 392, 523, 659, 784]; // C4 E4 G4 C5 E5 G5
      melody.forEach(function(f, i) {
        setTimeout(function() { playTone(f, 'triangle', 0.18, 0.3); }, i * 90);
      });
      setTimeout(function() {
        playTone(1047, 'sine', 0.5, 0.45);
      }, melody.length * 90);
    },

    // ── 캐릭터 생성 완료 ──────────────────────────
    createDone: function() {
      if (!enabled) return;
      var fanfare = [523, 659, 784, 523, 659, 784, 1047];
      fanfare.forEach(function(f, i) {
        setTimeout(function() { playTone(f, 'triangle', 0.2, 0.35); }, i * 70);
      });
    },

    // ── 야근 알림 ─────────────────────────────────
    overtime: function() {
      if (!enabled) return;
      playTone(300, 'sawtooth', 0.2, 0.3);
      setTimeout(function() { playTone(250, 'sawtooth', 0.2, 0.3); }, 200);
      setTimeout(function() { playTone(200, 'sawtooth', 0.3, 0.35); }, 400);
    },

    // ── 로또 당첨 ─────────────────────────────────
    lotto: function() {
      if (!enabled) return;
      // 빠른 상승 글리산도
      var c = getCtx();
      if (!c) return;
      var osc = c.createOscillator();
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
      // 팡파레
      setTimeout(function() { sounds.good(); }, 600);
      setTimeout(function() {
        var epic = [523,659,784,1047,1319,1568,2093];
        epic.forEach(function(f,i) {
          setTimeout(function(){ playTone(f,'triangle',0.3,0.5); }, i*60);
        });
      }, 900);
    },

    // ── 로또 꽝 ──────────────────────────────────
    lottoBad: function() {
      if (!enabled) return;
      var c = getCtx();
      if (!c) return;
      var osc = c.createOscillator();
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

    // ── 화면 전환 ─────────────────────────────────
    screenTransition: function() {
      if (!enabled) return;
      playTone(440, 'sine', 0.12, 0.2);
      setTimeout(function() { playTone(660, 'sine', 0.1, 0.15); }, 100);
    },

    // ── 엔딩 (점수 연산) ──────────────────────────
    ending: function() {
      if (!enabled) return;
      // 레트로 엔딩 사운드
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

    // ── 스트레스 위험 경보 ────────────────────────
    stressAlert: function() {
      if (!enabled) return;
      playTone(440, 'sawtooth', 0.08, 0.35);
      setTimeout(function() { playTone(440, 'sawtooth', 0.08, 0.35); }, 200);
      setTimeout(function() { playTone(440, 'sawtooth', 0.08, 0.35); }, 400);
    },

    // ── 관계 상승 ─────────────────────────────────
    relationUp: function() {
      if (!enabled) return;
      playTone(784, 'sine', 0.12, 0.2);
      setTimeout(function() { playTone(1047, 'sine', 0.1, 0.18); }, 100);
    },

    // ── 관계 하락 ─────────────────────────────────
    relationDown: function() {
      if (!enabled) return;
      playTone(300, 'sine', 0.1, 0.2);
      setTimeout(function() { playTone(220, 'sine', 0.1, 0.2); }, 120);
    },

    // ── 알람 클락 (기상) ──────────────────────────
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

    // ── 카드 열기 ─────────────────────────────────
    cardOpen: function() {
      if (!enabled) return;
      playTone(523, 'sine', 0.08, 0.2);
      setTimeout(function() { playTone(784, 'sine', 0.06, 0.15); }, 80);
    },

    // ── IMF / 충격 이벤트 ─────────────────────────
    shock: function() {
      if (!enabled) return;
      var c = getCtx();
      if (!c) return;
      // 저주파 충격음
      playTone(50, 'sawtooth', 0.5, 0.7);
      setTimeout(function() { playTone(80, 'sawtooth', 0.4, 0.4); }, 100);
      // 노이즈 버스트
      playNoise(0.3, 0.15, { type:'lowpass', freq:500, Q:1 });
    },

    // ── 코인/투자 ─────────────────────────────────
    coin: function() {
      if (!enabled) return;
      playNoise(0.06, 0.1, { type:'highpass', freq:6000, Q:4 });
      playTone(1800, 'sine', 0.06, 0.15);
      setTimeout(function() { playTone(2200, 'sine', 0.04, 0.1); }, 40);
    },

  };

  // ============================================
  //  타이핑 효과음 통합
  // ============================================
  var _typeCharCount = 0;
  var _lastTypeTime = 0;

  function onTypeChar() {
    if (!enabled) return;
    var now = Date.now();
    // 너무 빠른 연속 재생 방지 (30ms 미만이면 건너뜀)
    if (now - _lastTypeTime < 30) return;
    _lastTypeTime = now;
    _typeCharCount++;
    // 8번마다 캐리지 리턴 효과 (줄바꿈 느낌)
    if (_typeCharCount % 8 === 0) {
      sounds.typeReturn();
    } else {
      sounds.typeChar();
    }
  }

  // ============================================
  //  UI 초기화 (음소거 버튼)
  // ============================================
  function initSoundToggle() {
    var btn = document.createElement('button');
    btn.id = 'btn-sound-toggle';
    btn.title = '효과음 ON/OFF';
    btn.innerHTML = '🔊';
    btn.style.cssText = [
      'position:fixed',
      'bottom:18px',
      'right:18px',
      'z-index:9999',
      'width:40px',
      'height:40px',
      'border-radius:50%',
      'border:2px solid var(--primary, #00ff88)',
      'background:rgba(0,0,0,0.7)',
      'color:var(--primary, #00ff88)',
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
      if (enabled) {
        getCtx();
        sounds.click();
      }
    });
    document.body.appendChild(btn);
  }

  // DOM 로드 후 초기화
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
    enable: function() { enabled = true; getCtx(); },
    disable: function() { enabled = false; },
  };
})();
