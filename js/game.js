// =============================================
//  대한민국 직장인 생존기 — 게임 엔진 v3.0
// =============================================

var G = {
  era: null,
  profile: {
    employType: null,
    job: null,
    hasSpouse: false,
    hasKid: false,
    company: null,
    home: null,
    flags: [],
    rel_spouse: 60,
    rel_kid: 60,
  },
  stats: {
    stress: 0, stamina: 100, mental: 100,
    time: 390, // 06:30
    income: 0, expense: 0,
  },
  chores: { done: [], pending: [] },
  events: [],
  eventIdx: 0,
  createStep: 0,
  historicFired: false,
  scenarios: [],
  currentScenario: null,
};

// ─── 자동저장 / 이어하기 ────────────────────────────────
var SAVE_KEY = 'vrlife_save_v1';

function saveGame() {
  try {
    var snap = {
      eraId:        G.era ? G.era.id : null,
      profile:      G.profile,
      stats:        G.stats,
      chores:       G.chores,
      eventIdx:     G.eventIdx,
      historicFired: G.historicFired,
      savedAt:      Date.now()
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(snap));
  } catch(e) {}
}

function clearSave() {
  try { localStorage.removeItem(SAVE_KEY); } catch(e) {}
}

function loadSave() {
  try {
    var raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch(e) { return null; }
}

function checkResume() {
  var snap = loadSave();
  if (!snap || !snap.eraId) return;

  // 24시간 이상 지나면 저장 데이터 무효화
  if (Date.now() - snap.savedAt > 24 * 60 * 60 * 1000) { clearSave(); return; }

  var era = null;
  for (var i = 0; i < ERAS.length; i++) {
    if (ERAS[i].id === snap.eraId) { era = ERAS[i]; break; }
  }
  if (!era) { clearSave(); return; }

  var d = new Date(snap.savedAt);
  var timeStr = (d.getMonth()+1) + '/' + d.getDate() + ' ' + pad2(d.getHours()) + ':' + pad2(d.getMinutes());

  var overlay = document.createElement('div');
  overlay.id = 'resume-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.88);display:flex;align-items:center;justify-content:center;z-index:9999;';

  var nameDisp = snap.profile.name || (snap.profile.gender === 'female' ? '김민지' : '김철수');
  var gIcon    = snap.profile.gender === 'female' ? '👩' : '👨';

  var box = document.createElement('div');
  box.style.cssText = 'background:var(--surface);border:1px solid var(--primary);border-radius:12px;padding:28px 32px;max-width:380px;width:90%;text-align:center;box-shadow:0 0 40px rgba(0,255,136,.2);';
  box.innerHTML =
    '<div style="font-size:32px;margin-bottom:10px">💾</div>' +
    '<div style="font-size:15px;font-weight:700;color:var(--primary);margin-bottom:6px">이전 게임 기록이 있습니다</div>' +
    '<div style="font-size:11px;color:var(--dim);margin-bottom:14px">' + timeStr + ' 저장됨</div>' +
    '<div style="background:var(--surface2);border-radius:8px;padding:12px;margin-bottom:20px;font-size:13px;line-height:2;">' +
      gIcon + ' ' + nameDisp + ' &nbsp;|&nbsp; ' + era.name + '<br>' +
      '진행: 이벤트 ' + (snap.eventIdx || 0) + '번째' +
    '</div>' +
    '<div style="display:flex;gap:10px;">' +
      '<button id="resume-continue" style="flex:1;background:var(--primary);color:var(--bg);border:none;border-radius:6px;padding:11px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;">⏮ 이어하기</button>' +
      '<button id="resume-new" style="flex:1;background:transparent;color:var(--dim);border:1px solid var(--border);border-radius:6px;padding:11px;font-size:13px;cursor:pointer;font-family:inherit;">🔄 새로 시작</button>' +
    '</div>';

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  document.getElementById('resume-continue').onclick = function() {
    overlay.remove();
    resumeGame(snap, era);
  };
  document.getElementById('resume-new').onclick = function() {
    clearSave();
    overlay.remove();
  };
}

function resumeGame(snap, era) {
  G.era     = era;
  G.profile = snap.profile;
  G.stats   = snap.stats;
  G.chores  = snap.chores || { done:[], pending:[] };
  G.historicFired = snap.historicFired || false;
  document.body.className = era.cssClass;

  G.events   = buildDayEvents(G.profile, G.era);
  G.eventIdx = snap.eventIdx || 0;

  showScreen('game');
  if (typeof BGM !== 'undefined') BGM.stop(); // 타이틀 음악 중지
  if (typeof BGM !== 'undefined') BGM.play(era.id);

  var chip = document.getElementById('game-era-chip');
  if (chip) { chip.textContent = era.name; chip.style.background = 'var(--primary)'; chip.style.color = 'var(--bg)'; }
  var dateEl = document.getElementById('side-date');
  if (dateEl) dateEl.textContent = era.name + ' 어느 날';
  var priceEl = document.getElementById('s-era-price');
  if (priceEl) priceEl.textContent = getPriceLabel(era.id);

  setupFamilyPanel();
  updateSide();
  clearEl('game-log');
  clearEl('game-choices');

  log('game-log', 'system', '[ 💾 세이브 데이터 로드 — 이어 플레이 ]');
  setTimeout(nextEvent, 600);
}

// 페이지 로드 시 자동 체크
window.addEventListener('load', function() {
  setTimeout(checkResume, 500);
  // 첫 상호작용으로 오디오 컨텍스트 활성화 및 타이틀 음악
  document.addEventListener('click', startTitleBgm, { once: true });
  // 시나리오 데이터 로드
  fetchScenarios();
});

function startTitleBgm() {
  if (G.era) return; // 이미 게임 중이면 패스
  if (typeof BGM !== 'undefined') BGM.play('title');
}

// ─── 유틸 ────────────────────────────────────────────
function minToTime(m) {
  var total = m % (24 * 60);
  if (total < 0) total += 24 * 60;
  var h = Math.floor(total / 60) % 24;
  var mm = total % 60;
  var ampm = h < 12 ? 'AM' : 'PM';
  var displayH = h % 12 || 12;
  return pad2(displayH) + ':' + pad2(mm) + ' ' + ampm;
}

function pad2(n) { return n < 10 ? '0' + n : '' + n; }

function showScreen(id) {
  var screens = document.querySelectorAll('.screen');
  for (var i = 0; i < screens.length; i++) {
    screens[i].classList.remove('active');
  }
  var el = document.getElementById('screen-' + id);
  if (el) el.classList.add('active');
  if (typeof SFX !== 'undefined') SFX.play('screenTransition');
}

function log(id, type, msg) {
  var container = document.getElementById(id);
  if (!container) return null;
  var d = document.createElement('div');
  if (type === 'divider') {
    d.className = 'log-line divider';
  } else if (type === 'empty') {
    d.className = 'log-line empty';
  } else if (type === 'ascii') {
    d.className = 'log-line ascii';
    if (msg) {
      logAscii(d, msg);
    }
  } else {
    d.className = 'log-line ' + type;
    if (msg) {
      logWithType(d, type, msg);
    }
  }
  container.appendChild(d);
  if (id === 'game-log' && !G._focusing) {
    requestAnimationFrame(function() {
      container.scrollTop = container.scrollHeight;
      // 레이아웃이 완전히 잡힌 후 한 번 더 스크롤 (비동기 이미지/아트 대응)
      requestAnimationFrame(function() {
        container.scrollTop = container.scrollHeight;
      });
    });
  }
  return d;
}

function logWithType(el, type, msg) {
  // 타이핑 효과로 텍스트 출력 + 소리
  var i = 0;
  var speed = 22;
  function tick() {
    if (i < msg.length) {
      el.textContent += msg[i];
      if (typeof SFX !== 'undefined') SFX.onTypeChar();
      i++;
      setTimeout(tick, speed);
    } else {
      // 줄 완성 시 타입별 효과음
      if (typeof SFX !== 'undefined') {
        if (type === 'good') SFX.play('good');
        else if (type === 'bad') SFX.play('bad');
        else if (type === 'money') SFX.play('money');
        else if (type === 'relation') SFX.play('relationUp');
        else if (type === 'history' || type === 'news') SFX.play('historic');
      }
    }
  }
  setTimeout(tick, 0);
}

function logAscii(el, msg) {
  // 아스키 아트는 한 줄씩 출력 (시각적 일관성)
  var lines = msg.split('\n');
  var i = 0;
  var speed = 40;
  function tick() {
    if (i < lines.length) {
      el.textContent += lines[i] + '\n';
      if (typeof SFX !== 'undefined') SFX.onTypeChar();
      i++;
      setTimeout(tick, speed);
    }
  }
  setTimeout(tick, 0);
}

function clearEl(id) {
  var e = document.getElementById(id);
  if (e) e.innerHTML = '';
}

function mkBtn(html, onClick, extra) {
  extra = extra || '';
  var b = document.createElement('button');
  b.className = 'btn-choice ' + extra;
  b.innerHTML = html;
  b.addEventListener('mouseenter', function() {
    if (typeof SFX !== 'undefined') SFX.play('hover');
  });
  b.onclick = function() {
    if (typeof SFX !== 'undefined') SFX.play('click');
    onClick();
  };
  return b;
}

// ─── 플레이어 기본 프로필 ──────────────────────────
var P = {
  gender: null,   // 'male' | 'female'
  age: null,      // 숫자 (선택)
  name: '',       // 이름/닉네임 (선택)
};

// 나이 → 시대 매핑 (2026년 기준 출생연도 계산)
// 예) 나이 55 → 1971년생 → 1980년대에 10대 → 추천: 1980년대
var ERA_AGE_MAP = [
  // [ 최소나이, 최대나이, 추천시대ID, 추천이유 ]
  [56, 99, '1980', '1980년대에 한창 직장 생활을 하셨겠군요!'],
  [44, 55, '1997', '1997 IMF 외환위기를 직장인으로 겪으셨겠네요.'],
  [34, 43, '2000', '2000년대 IT 붐 시절에 사회에 첫발을 내딛으셨군요!'],
  [24, 33, '2010', '2010년대 스마트폰 세대로 직장 생활을 시작하셨네요.'],
  [18, 23, '2026', '지금 이 시대를 살아가고 있는 현역 직장인이시군요!'],
  [15, 17, '2026', '아직 이 시대가 익숙한 세대! 2026년으로 도전해보세요.'],
];

function goToProfile() {
  if (typeof SFX !== 'undefined') SFX.play('click');
  showScreen('profile');
  // 성별 버튼 초기화
  document.getElementById('btn-male').classList.remove('selected');
  document.getElementById('btn-female').classList.remove('selected');
  document.getElementById('age-input').value = '';
  document.getElementById('name-input').value = '';
  document.getElementById('age-recommend-box').style.display = 'none';
  document.getElementById('btn-auto-era').style.display = 'none';
  P.gender = null;
  P.age = null;
  P.name = '';
}

function selectGender(g) {
  P.gender = g;
  document.getElementById('btn-male').classList.toggle('selected', g === 'male');
  document.getElementById('btn-female').classList.toggle('selected', g === 'female');
}

function onAgeInput(val) {
  var age = parseInt(val, 10);
  var box = document.getElementById('age-recommend-box');
  var autoBtn = document.getElementById('btn-auto-era');

  if (!val || isNaN(age) || age < 15 || age > 80) {
    box.style.display = 'none';
    autoBtn.style.display = 'none';
    P.age = null;
    return;
  }

  P.age = age;
  var rec = getEraByAge(age);
  if (!rec) {
    box.style.display = 'none';
    autoBtn.style.display = 'none';
    return;
  }

  // 추천 시대 찾기
  var eraObj = null;
  for (var i = 0; i < ERAS.length; i++) {
    if (ERAS[i].id === rec.eraId) { eraObj = ERAS[i]; break; }
  }
  if (!eraObj) return;

  // 추천 박스 표시
  box.style.display = 'block';
  box.innerHTML =
    '<div class="age-rec-header">📍 ' + age + '세 분께 추천하는 시대</div>' +
    '<div class="age-rec-card">' +
      '<span class="age-rec-icon">' + eraObj.icon + '</span>' +
      '<div class="age-rec-info">' +
        '<div class="age-rec-name">' + eraObj.name + '</div>' +
        '<div class="age-rec-fate">' + eraObj.fate + '</div>' +
        '<div class="age-rec-reason">' + rec.reason + '</div>' +
      '</div>' +
    '</div>';

  autoBtn.style.display = 'block';
  autoBtn.dataset.eraId = rec.eraId;
}

function getEraByAge(age) {
  for (var i = 0; i < ERA_AGE_MAP.length; i++) {
    var m = ERA_AGE_MAP[i];
    if (age >= m[0] && age <= m[1]) {
      return { eraId: m[2], reason: m[3] };
    }
  }
  return null;
}

// 나이 기반 자동 시대 선택
function confirmProfileAndAuto() {
  P.name = document.getElementById('name-input').value.trim();
  if (!P.gender) {
    showProfileError('성별을 먼저 선택해주세요!');
    return;
  }
  var btn = document.getElementById('btn-auto-era');
  var eraId = btn.dataset.eraId;
  if (!eraId) return;
  selectEra(eraId);
}

// 직접 시대 고르기
function confirmProfileAndPick() {
  P.name = document.getElementById('name-input').value.trim();
  if (!P.gender) {
    showProfileError('성별을 먼저 선택해주세요!');
    return;
  }
  showScreen('era');
  renderEraList();
}

function showProfileError(msg) {
  var existing = document.getElementById('profile-error');
  if (existing) existing.remove();
  var el = document.createElement('div');
  el.id = 'profile-error';
  el.className = 'profile-error-msg';
  el.textContent = '⚠ ' + msg;
  var actions = document.querySelector('.profile-actions');
  if (actions) actions.parentNode.insertBefore(el, actions);
  setTimeout(function() { if (el.parentNode) el.remove(); }, 2500);
}

// 시대 선택 화면으로 직접 이동 (렌더링 포함)
function goToEraSelect() {
  showScreen('era');
  renderEraList();
}

// 현재 선택된 시대 ID (프리뷰 용)
var _selectedEraId = null;

function renderEraList() {
  var list = document.getElementById('era-list');
  if (!list) return;
  list.innerHTML = '';

  ERAS.forEach(function(era) {
    var card = document.createElement('div');
    card.className = 'esb-card' + (era.recommend ? ' esb-recommend' : '');
    card.dataset.eraId = era.id;

    // 난이도 색상
    var diffColor = 'diff-medium';
    if (era.difficulty) {
      var dStress = era.difficulty.stress || 0;
      if (dStress >= 5) diffColor = 'diff-hard';
      else if (dStress <= 2) diffColor = 'diff-easy';
    }

    // 난이도 시각화: 별 + 라벨 (이모지 포함)
    function makeDiffRow(diff) {
      if (!diff) return '';
      var staminaStars = makeStars(diff.stamina || 0);
      var stressStars  = makeStars(diff.stress  || 0);
      var stressCol = (diff.stress >= 5) ? '#ff4444' : (diff.stress >= 4) ? '#ffcc44' : '#44ff88';
      return '<div class="esb-diff-grid">' +
        '<span class="esb-diff-row"><span class="esb-diff-icon">💪</span><span class="esb-diff-key">체력</span>' +
          '<span class="esb-diff-bar" style="color:#44ff88">' + staminaStars + '</span></span>' +
        '<span class="esb-diff-row"><span class="esb-diff-icon">🧠</span><span class="esb-diff-key">멘탈</span>' +
          '<span class="esb-diff-bar" style="color:' + stressCol + '">' + stressStars + '</span></span>' +
        '<span class="esb-diff-label-chip ' + diffColor + '">' + (diff.label || '') + '</span>' +
      '</div>';
    }

    function makeStars(n) {
      var filled = Math.min(n, 5);
      var s = '';
      for (var k = 0; k < 5; k++) s += (k < filled ? '★' : '☆');
      return s;
    }

    // 추천 뱃지
    var recBadge = era.recommend
      ? '<div class="esb-rec-badge">🟩 ' + (era.recommendReason || '첫 플레이 추천') + '</div>'
      : '';

    // 경제 태그 (상위 2개)
    var econHtml = era.econLabel.slice(0,2).map(function(l) {
      return '<span class="era-econ-tag">' + l.k + ' ' + l.v + '</span>';
    }).join('');

    var diffHtml = makeDiffRow(era.difficulty);

    card.innerHTML =
      recBadge +
      '<div class="esb-top">' +
        '<div class="esb-icon">' + era.icon + '</div>' +
        '<div class="esb-meta">' +
          '<div class="esb-year">' + era.name + '<span class="esb-years"> ' + era.years + '</span></div>' +
          '<div class="esb-title">' + era.title + '</div>' +
          '<div class="esb-tagline">' + era.tagline + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="esb-fate">' + (era.fate || '') + '</div>' +
      '<div class="esb-info-row">' +
        diffHtml +
        '<div class="esb-econ-tags">' + econHtml + '</div>' +
      '</div>' +
      '<div class="esb-click-hint">▼ 클릭하면 상세 정보가 펼쳐집니다</div>' +
      '<div class="esb-preview" id="preview-' + era.id + '"></div>' +
      '<button class="esb-start-btn" data-era-id="' + era.id + '">▶ 이 시대를 살아가기</button>';

    // 카드 클릭 → 프리뷰 열기/닫기
    card.addEventListener('click', function(e) {
      if (e.target.classList.contains('esb-start-btn')) return;
      toggleEraPreview(era.id);
    });

    // 시작 버튼
    var startBtn = card.querySelector('.esb-start-btn');
    startBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      selectEra(era.id);
    });

    list.appendChild(card);
  });
}

function toggleEraPreview(eraId) {
  var era = null;
  for (var i = 0; i < ERAS.length; i++) {
    if (ERAS[i].id === eraId) { era = ERAS[i]; break; }
  }
  if (!era || !era.preview) return;

  // 모든 카드에서 선택 해제
  var allCards = document.querySelectorAll('.esb-card');
  for (var j = 0; j < allCards.length; j++) {
    var cId = allCards[j].dataset.eraId;
    if (cId !== eraId) {
      allCards[j].classList.remove('esb-active');
      var op = document.getElementById('preview-' + cId);
      if (op) { op.style.maxHeight = '0'; op.innerHTML = ''; }
    }
  }

  var card = document.querySelector('.esb-card[data-era-id="' + eraId + '"]');
  var pBox = document.getElementById('preview-' + eraId);
  if (!card || !pBox) return;

  var isOpen = card.classList.contains('esb-active');
  if (isOpen) {
    card.classList.remove('esb-active');
    pBox.style.maxHeight = '0';
    setTimeout(function() { pBox.innerHTML = ''; }, 300);
    _selectedEraId = null;
    return;
  }

  card.classList.add('esb-active');
  _selectedEraId = eraId;

  // 경제 태그 전체
  var econFull = era.econLabel.map(function(l) {
    return '<span class="era-econ-tag">' + l.k + ': ' + l.v + '</span>';
  }).join('');

  // 프리뷰 HTML 구성 — 라인별 타이핑 효과
  pBox.innerHTML =
    '<div class="prev-divider"></div>' +
    '<div class="prev-section-title" id="ptitle-' + eraId + '"></div>' +
    '<div class="prev-lines" id="plines-' + eraId + '"></div>' +
    '<div class="prev-life-block" id="plife-' + eraId + '" style="display:none">' +
      '<div class="prev-life-title">💬 당신은 이런 인생을 살게 됩니다</div>' +
      '<div class="prev-lifes" id="plifes-' + eraId + '"></div>' +
    '</div>' +
    '<div class="prev-bottom" id="pbottom-' + eraId + '" style="display:none">' +
      '<div class="prev-econ-row">' + econFull + '</div>' +
      '<div class="prev-desc">' + era.desc + '</div>' +
    '</div>';

  // 애니메이션 열기
  pBox.style.maxHeight = '0';
  pBox.style.overflow = 'hidden';
  requestAnimationFrame(function() {
    pBox.style.transition = 'max-height .4s ease';
    pBox.style.maxHeight = '600px';
  });

  // 타이핑 시퀀스
  var titleEl = document.getElementById('ptitle-' + eraId);
  var linesEl = document.getElementById('plines-' + eraId);
  var lifeBlock = document.getElementById('plife-' + eraId);
  var lifesEl = document.getElementById('plifes-' + eraId);
  var bottomEl = document.getElementById('pbottom-' + eraId);

  var titleText = '[ ' + era.name + ' 선택됨 ]';
  var delay = 0;

  // 1) 타이틀 타이핑
  typeText(titleEl, titleText, 40, delay, function() {
    // 2) 라인별 순차 표시
    var lineDelay = 0;
    era.preview.lines.forEach(function(line, idx) {
      (function(l, d) {
        setTimeout(function() {
          var div = document.createElement('div');
          div.className = 'prev-line prev-line-anim';
          div.innerHTML = '<span class="prev-bullet">▸</span> ';
          linesEl.appendChild(div);
          typeText(div, l, 22, 0, null, true);
        }, d);
      })(line, lineDelay);
      lineDelay += 180 + line.length * 18;
    });

    // 3) 인생 예측 블록
    setTimeout(function() {
      lifeBlock.style.display = 'block';
      lifeBlock.style.opacity = '0';
      lifeBlock.style.transition = 'opacity .4s';
      requestAnimationFrame(function() { lifeBlock.style.opacity = '1'; });

      var ld = 100;
      era.preview.life.forEach(function(l) {
        (function(txt, d) {
          setTimeout(function() {
            var div = document.createElement('div');
            div.className = 'prev-life prev-life-anim';
            lifesEl.appendChild(div);
            typeText(div, txt, 20, 0, null, true);
          }, d);
        })(l, ld);
        ld += 150 + l.length * 16;
      });

      // 4) 경제 정보
      setTimeout(function() {
        bottomEl.style.display = 'block';
        bottomEl.style.opacity = '0';
        bottomEl.style.transition = 'opacity .5s';
        requestAnimationFrame(function() { bottomEl.style.opacity = '1'; });
      }, ld + 200);

    }, lineDelay + 300);
  });
}

// 타이핑 효과 헬퍼
// append=true 이면 기존 내용(이미 있는 span 등) 뒤에 새 span을 추가
function typeText(el, text, speed, initialDelay, callback, append) {
  var i = 0;
  var span = document.createElement('span');
  if (append) {
    el.appendChild(span);
  } else {
    el.innerHTML = '';
    el.appendChild(span);
  }
  function tick() {
    if (i < text.length) {
      span.textContent += text[i];
      if (typeof SFX !== 'undefined') SFX.onTypeChar();
      i++;
      setTimeout(tick, speed);
    } else {
      if (callback) callback();
    }
  }
  setTimeout(tick, initialDelay || 0);
}

// ─── 퀵 스타트 (타이틀 카드 직접 클릭) ────────────────
function quickStartEra(eraId) {
  if (typeof SFX !== 'undefined') SFX.play('click');

  // 랜덤 성별 배정
  var gender = Math.random() < 0.5 ? 'male' : 'female';
  P.gender = gender;
  P.name   = gender === 'female' ? '김민지' : '김철수';
  P.age    = null;

  // 시대 찾기
  var era = null;
  for (var i = 0; i < ERAS.length; i++) {
    if (ERAS[i].id === eraId) { era = ERAS[i]; break; }
  }
  if (!era) return;
  G.era = era;
  document.body.className = era.cssClass;

  // 랜덤 고용 형태
  var empTypes = ['fulltime', 'contract', 'freelance'];
  var empId = empTypes[Math.floor(Math.random() * empTypes.length)];
  var empObj = null;
  for (var j = 0; j < EMPLOY_TYPES.length; j++) {
    if (EMPLOY_TYPES[j].id === empId) { empObj = EMPLOY_TYPES[j]; break; }
  }
  if (!empObj) empObj = EMPLOY_TYPES[0];

  // 랜덤 직업
  var job = era.jobs[Math.floor(Math.random() * era.jobs.length)];

  // 랜덤 거주지/회사
  var companies = getCompanyList(era.id);
  var company = companies[Math.floor(Math.random() * companies.length)];
  var home    = era.homeLocations[Math.floor(Math.random() * era.homeLocations.length)];

  // 결혼 여부 (30% 확률)
  var hasSpouse = Math.random() < 0.3;
  var hasKid    = hasSpouse && Math.random() < 0.4;

  G.profile = {
    gender: gender, name: P.name, age: null,
    employType: empObj, job: job,
    hasSpouse: hasSpouse, hasKid: hasKid,
    company: company, home: home,
    flags: [], rel_spouse: 60, rel_kid: 60
  };

  var baseIncome = (empObj.id === 'fulltime' || empObj.id === 'contract')
    ? Math.round(job.dailyPay) : 0;
  G.stats = { stress:0, stamina:100, mental:100, time:390, income:baseIncome, expense:0 };
  G.chores = { done:[], pending:[] };
  G.eventIdx = 0;
  G.historicFired = false;
  G.events = buildDayEvents(G.profile, G.era);

  showScreen('game');
  if (typeof BGM !== 'undefined') BGM.stop(); // 타이틀 음악 중지
  if (typeof SFX !== 'undefined') SFX.play('gameStart');
  if (typeof BGM !== 'undefined') BGM.play(eraId);

  var chip = document.getElementById('game-era-chip');
  if (chip) {
    chip.textContent = era.name;
    chip.style.background = 'var(--primary)';
    chip.style.color = 'var(--bg)';
  }
  var dateEl = document.getElementById('side-date');
  if (dateEl) dateEl.textContent = era.name + ' 어느 날';
  var priceEl = document.getElementById('s-era-price');
  if (priceEl) priceEl.textContent = getPriceLabel(era.id);

  setupFamilyPanel();
  updateSide();
  clearEl('game-log');
  clearEl('game-choices');

  var hpanel = document.getElementById('side-history');
  if (hpanel) hpanel.style.display = 'none';

  // 퀵스타트 안내 로그
  var gIcon = gender === 'female' ? '👩' : '👨';
  log('game-log', 'system', '[ ⚡ 빠른 시작 — ' + era.name + ' ]');
  log('game-log', 'good', gIcon + ' ' + P.name + ' · ' + empObj.label + ' · ' + job.icon + ' ' + job.label);
  log('game-log', 'system', '🏢 ' + company.label + ' | 🏠 ' + home.label);
  log('game-log', 'divider', '');

  setTimeout(nextEvent, 800);
}

function selectEra(eraId) {
  G.era = null;
  for (var i = 0; i < ERAS.length; i++) {
    if (ERAS[i].id === eraId) { G.era = ERAS[i]; break; }
  }
  if (!G.era) return;

  document.body.className = G.era.cssClass;

  // 성별/이름/나이 유지, 나머지 초기화
  G.profile = {
    gender:     P.gender || 'male',
    name:       P.name   || (P.gender === 'female' ? '김민지' : '김철수'),
    age:        P.age    || null,
    employType: null, job: null,
    hasSpouse: false, hasKid: false,
    kids: [],          // [{ gender:'male'|'female', age:number }, ...]
    company: null, home: null,
    flags: [], rel_spouse: 60, rel_kid: 60
  };
  G.createStep = 0;
  G.historicFired = false;

  showScreen('create');
  clearEl('create-log');
  clearEl('create-choices');

  var badge = document.getElementById('create-era-badge');
  if (badge) {
    var gIcon = G.profile.gender === 'female' ? '👩' : '👨';
    var nameStr = G.profile.name ? ' · ' + G.profile.name : '';
    var ageStr = G.profile.age ? ' · ' + G.profile.age + '세' : '';
    badge.textContent = '[ ' + gIcon + nameStr + ageStr + ' — ' + G.era.name + ' ]';
  }
  runCreate();
}

// ─── 캐릭터 생성 ──────────────────────────────────
var CREATE_STEPS = [
  {
    label: 'STEP 1/5 — 고용 형태',
    logs: [{ t:'system', m:'어떤 형태로 일하고 있나요?' }],
    render: function(next) {
      EMPLOY_TYPES.forEach(function(et) {
        var b = mkBtn(
          et.icon + ' ' + et.label + '<br><span style="color:var(--dim);font-size:10px">→ ' + et.desc + '</span>',
          function() {
            G.profile.employType = et;
            log('create-log', 'good', '✔ ' + et.icon + ' ' + et.label);
            next();
          }
        );
        document.getElementById('create-choices').appendChild(b);
      });
    }
  },
  {
    label: 'STEP 2/5 — 직종',
    logs: [{ t:'system', m:'어떤 분야에서 일하나요?' }],
    render: function(next) {
      var grid = document.createElement('div');
      grid.className = 'choice-grid';
      G.era.jobs.forEach(function(j) {
        var b = mkBtn(
          j.icon + ' ' + j.label + '<br><span style="color:var(--dim);font-size:10px">' + j.desc + '</span>',
          function() {
            G.profile.job = j;
            log('create-log', 'good', '✔ ' + j.icon + ' ' + j.label);
            next();
          }
        );
        grid.appendChild(b);
      });
      document.getElementById('create-choices').appendChild(grid);
    }
  },
  {
    label: 'STEP 3/5 — 배우자',
    logs: [{ t:'system', m:'결혼 여부는?' }],
    render: function(next) {
      // 성별에 따라 배우자 호칭 결정
      var spouseLabel = G.profile.gender === 'female' ? '남편' : '아내';
      var spouseIcon  = G.profile.gender === 'female' ? '👨' : '👩';
      var opts = [
        { label: spouseIcon + ' 결혼했다 (' + spouseLabel + ' 있음)', val: true },
        { label: '🙋 솔로 (미혼)', val: false }
      ];
      opts.forEach(function(o) {
        var b = mkBtn(o.label, function() {
          G.profile.hasSpouse = o.val;
          log('create-log', 'good', '✔ ' + o.label);
          next();
        });
        document.getElementById('create-choices').appendChild(b);
      });
    }
  },
  {
    label: 'STEP 4/5 — 자녀',
    skip: function() { return !G.profile.hasSpouse; },
    logs: [{ t:'system', m:'자녀가 있나요? (최대 3명까지 추가할 수 있어요)' }],
    render: function(next) {
      var p = G.profile;
      p.kids = [];

      var area = document.getElementById('create-choices');

      function renderKidUI() {
        area.innerHTML = '';

        // 현재 추가된 아이들 표시
        if (p.kids.length > 0) {
          var listDiv = document.createElement('div');
          listDiv.style.cssText = 'margin-bottom:10px;';
          p.kids.forEach(function(kid, idx) {
            var icon = kid.gender === 'female' ? '👧' : '👦';
            var row = document.createElement('div');
            row.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:4px;font-size:12px;color:var(--text);';
            row.innerHTML = '<span>' + icon + ' 아이' + (idx+1) + ' · ' + (kid.gender === 'female' ? '여자' : '남자') + ' · ' + kid.age + '세</span>' +
              '<button onclick="G.profile.kids.splice(' + idx + ',1);" style="background:rgba(255,68,68,.15);border:1px solid #ff4444;color:#ff4444;border-radius:3px;padding:1px 8px;font-size:10px;cursor:pointer;font-family:inherit;">✕</button>';
            row.querySelector('button').onclick = function() {
              p.kids.splice(idx, 1);
              renderKidUI();
            };
            listDiv.appendChild(row);
          });
          area.appendChild(listDiv);
        }

        // 3명 미만이면 추가 폼 표시
        if (p.kids.length < 3) {
          var formDiv = document.createElement('div');
          formDiv.style.cssText = 'background:var(--surface2);border:1px solid var(--border);border-radius:6px;padding:10px;margin-bottom:8px;';

          var kidNum = p.kids.length + 1;
          formDiv.innerHTML =
            '<div style="font-size:11px;color:var(--primary);margin-bottom:8px;">아이' + kidNum + '번 정보</div>' +
            '<div style="display:flex;gap:6px;margin-bottom:8px;">' +
              '<button id="kid-btn-male" class="btn-choice" style="flex:1;padding:7px;">👦 남자</button>' +
              '<button id="kid-btn-female" class="btn-choice" style="flex:1;padding:7px;">👧 여자</button>' +
            '</div>' +
            '<div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;">' +
              '<span style="font-size:11px;color:var(--dim);">나이:</span>' +
              '<input id="kid-age-input" type="number" min="1" max="25" placeholder="예) 5" ' +
                'style="background:var(--surface);border:1px solid var(--border);color:var(--text);border-radius:3px;padding:4px 8px;font-family:inherit;font-size:13px;width:80px;" />' +
              '<span style="font-size:11px;color:var(--dim);">세</span>' +
            '</div>' +
            '<button id="kid-add-btn" class="btn-choice" style="width:100%;padding:8px;">➕ 이 아이 추가</button>';

          area.appendChild(formDiv);

          var maleBtn   = formDiv.querySelector('#kid-btn-male');
          var femaleBtn = formDiv.querySelector('#kid-btn-female');
          var addBtn    = formDiv.querySelector('#kid-add-btn');
          var ageInput  = formDiv.querySelector('#kid-age-input');
          var kidGender = 'male';

          maleBtn.onclick = function() {
            kidGender = 'male';
            maleBtn.style.borderColor = 'var(--primary)';
            femaleBtn.style.borderColor = 'var(--border)';
          };
          femaleBtn.onclick = function() {
            kidGender = 'female';
            femaleBtn.style.borderColor = 'var(--primary)';
            maleBtn.style.borderColor = 'var(--border)';
          };

          addBtn.onclick = function() {
            var age = parseInt(ageInput.value, 10);
            if (isNaN(age) || age < 1 || age > 25) {
              ageInput.style.borderColor = '#ff4444';
              return;
            }
            p.kids.push({ gender: kidGender, age: age });
            p.hasKid = true;
            if (typeof SFX !== 'undefined') SFX.play('click');
            renderKidUI();
          };
        }

        // 완료 / 자녀 없음 버튼
        var doneDiv = document.createElement('div');
        doneDiv.style.cssText = 'display:flex;gap:6px;margin-top:4px;';

        var noneBtn = document.createElement('button');
        noneBtn.className = 'btn-choice';
        noneBtn.style.flex = '1';
        noneBtn.textContent = '🚫 자녀 없음';
        noneBtn.onclick = function() {
          p.kids = []; p.hasKid = false;
          log('create-log', 'good', '✔ 자녀 없음 (솔로 또는 딩크)');
          next();
        };

        var doneBtn = document.createElement('button');
        doneBtn.className = 'btn-choice';
        doneBtn.style.cssText = 'flex:1;border-color:var(--primary);color:var(--primary);';
        doneBtn.textContent = '✅ 입력 완료 (' + p.kids.length + '명)';
        doneBtn.disabled = p.kids.length === 0;
        doneBtn.style.opacity = p.kids.length === 0 ? '0.4' : '1';
        doneBtn.onclick = function() {
          if (p.kids.length === 0) return;
          p.hasKid = true;
          var summary = p.kids.map(function(k, i) {
            return '아이' + (i+1) + ' ' + (k.gender === 'female' ? '👧' : '👦') + ' ' + k.age + '세';
          }).join(' / ');
          log('create-log', 'good', '✔ 자녀 ' + p.kids.length + '명: ' + summary);
          next();
        };

        doneDiv.appendChild(noneBtn);
        if (p.kids.length > 0) doneDiv.appendChild(doneBtn);
        area.appendChild(doneDiv);
      }

      renderKidUI();
    }
  },
  {
    label: 'STEP 5a/5 — 근무지',
    logs: [{ t:'system', m:'어디서 일하나요?' }],
    render: function(next) {
      var companies = getCompanyList(G.era.id);
      companies.forEach(function(c) {
        var b = mkBtn('🏢 ' + c.label, function() {
          G.profile.company = c;
          log('create-log', 'good', '✔ 근무지: ' + c.label);
          next();
        });
        document.getElementById('create-choices').appendChild(b);
      });
    }
  },
  {
    label: 'STEP 5b/5 — 거주지',
    skip: function() {
      return G.profile.company &&
        (G.profile.company.id.indexOf('home') >= 0);
    },
    logs: [{ t:'system', m:'집이 어디인가요?' }],
    render: function(next) {
      G.era.homeLocations.forEach(function(h) {
        var commuteText = h.commute > 0 ? ' (' + h.commute + '분)' : ' (재택)';
        var b = mkBtn('🏠 ' + h.label + commuteText, function() {
          G.profile.home = h;
          log('create-log', 'good', '✔ ' + h.label);
          next();
        });
        document.getElementById('create-choices').appendChild(b);
      });
    }
  },
];

function getCompanyList(eraId) {
  if (eraId === '1980') return [
    { id:'factory_loc', label:'공장 (구로 공단)' },
    { id:'bank_loc',    label:'도심 은행 (광화문)' },
    { id:'govt_loc',    label:'관공서 (중구)' },
    { id:'market_loc',  label:'재래시장 (남대문)' },
  ];
  if (eraId === '1997') return [
    { id:'gangnam_97',  label:'강남 대기업 (테헤란로)' },
    { id:'jongno_97',   label:'종로 금융권' },
    { id:'market_97',   label:'자영업 (동네)' },
    { id:'home_1997',   label:'재택 / 구직 중' },
  ];
  if (eraId === '2000') return [
    { id:'teheran',     label:'테헤란로 (IT 밸리)' },
    { id:'coex',        label:'삼성동 (포털사)' },
    { id:'home_2000',   label:'재택/자택 벤처' },
  ];
  if (eraId === '2010') return [
    { id:'pangyo',      label:'판교 (테크노밸리)' },
    { id:'hongdae',     label:'홍대/합정 (스타트업)' },
    { id:'home_2010',   label:'재택/스마트워크' },
  ];
  if (eraId === '2020') return [
    { id:'home_2020',   label:'재택근무 (코로나)' },
    { id:'hospital',    label:'병원/의료기관' },
    { id:'street_2020', label:'배달/야외 근무' },
  ];
  // 2026 기본
  return [
    { id:'gangnam_26',  label:'강남 (테헤란로)' },
    { id:'pangyo_26',   label:'판교 (AI 밸리)' },
    { id:'home_26',     label:'재택근무 (AI 시대)' },
  ];
}

var cIdx = 0;
function runCreate() { cIdx = 0; advCreate(); }
function advCreate() {
  while (cIdx < CREATE_STEPS.length && CREATE_STEPS[cIdx].skip && CREATE_STEPS[cIdx].skip()) {
    cIdx++;
  }
  if (cIdx >= CREATE_STEPS.length) { finishCreate(); return; }
  var step = CREATE_STEPS[cIdx];
  log('create-log', 'divider', '');
  log('create-log', 'system', '▌ ' + step.label);
  step.logs.forEach(function(l) { log('create-log', l.t, l.m); });
  log('create-log', 'empty', '');
  clearEl('create-choices');
  step.render(function() {
    if (typeof SFX !== 'undefined') SFX.play('click');
    cIdx++;
    setTimeout(advCreate, 350);
  });
}

function finishCreate() {
  var p = G.profile;
  if (!p.home) {
    p.home = { id:'remote', label:'재택근무', commute:0, rent:0, type:'home' };
  }
  var baseIncome = (p.employType.id === 'fulltime' || p.employType.id === 'contract')
    ? Math.round(p.job.dailyPay) : 0;
  G.stats = { stress:0, stamina:100, mental:100, time:390, income:baseIncome, expense:0 };

  if (typeof SFX !== 'undefined') setTimeout(function(){ SFX.play('createDone'); }, 200);

  log('create-log', 'divider', '');
  var gIcon = p.gender === 'female' ? '👩' : '👨';
  var spouseWord = p.gender === 'female' ? '남편' : '아내';
  var nameDisp = p.name ? p.name : (p.gender === 'female' ? '김민지' : '김철수');
  var ageDisp  = p.age ? p.age + '세 · ' : '';

  log('create-log', 'good', '✅ 캐릭터 생성 완료!');
  log('create-log', 'system', '  ' + gIcon + ' ' + ageDisp + nameDisp);
  log('create-log', 'system', '  시대: ' + G.era.name);
  log('create-log', 'system', '  직업: ' + p.job.icon + ' ' + p.job.label);
  log('create-log', 'system', '  고용: ' + p.employType.label);
  var familyStr = p.hasSpouse ? (spouseWord + ' 있음') : '솔로';
  if (p.hasKid && p.kids && p.kids.length > 0) {
    var kidSummary = p.kids.map(function(k, i) {
      return (k.gender === 'female' ? '👧' : '👦') + k.age + '세';
    }).join(' ');
    familyStr += ' / 자녀 ' + p.kids.length + '명 (' + kidSummary + ')';
  } else if (p.hasKid) {
    familyStr += ' / 자녀 있음';
  }
  log('create-log', 'system', '  가족: ' + familyStr);
  log('create-log', 'system', '  근무지: ' + p.company.label);
  if (p.home.commute > 0) {
    log('create-log', 'system', '  통근: ' + p.home.commute + '분');
  }
  log('create-log', 'empty', '');

  clearEl('create-choices');
  var startBtn = mkBtn('▶ ' + G.era.name + '의 ' + nameDisp + '으로 살아가기!', function() { initGame(); });
  startBtn.style.fontSize = '15px';
  document.getElementById('create-choices').appendChild(startBtn);
}

// ─── 게임 초기화 ──────────────────────────────────
function initGame() {
  G.chores = { done: [], pending: [] };
  G.profile.flags = [];
  G.eventIdx = 0;
  G.historicFired = false;
  G.events = buildDayEvents(G.profile, G.era);

  showScreen('game');
  if (typeof BGM !== 'undefined') BGM.stop(); // 타이틀 음악 중지
  if (typeof SFX !== 'undefined') SFX.play('gameStart');
  if (typeof BGM !== 'undefined') BGM.play(G.era.id);

  var chip = document.getElementById('game-era-chip');
  if (chip) {
    chip.textContent = G.era.name;
    chip.style.background = 'var(--primary)';
    chip.style.color = 'var(--bg)';
  }
  var dateEl = document.getElementById('side-date');
  if (dateEl) dateEl.textContent = G.era.name + ' 어느 날';

  var priceEl = document.getElementById('s-era-price');
  if (priceEl) priceEl.textContent = getPriceLabel(G.era.id);

  setupFamilyPanel();
  updateSide();
  clearEl('game-log');
  clearEl('game-choices');

  var hpanel = document.getElementById('side-history');
  if (hpanel) hpanel.style.display = 'none';

  setTimeout(nextEvent, 400);
}

// ─── 사이드 패널 ──────────────────────────────────
function setupFamilyPanel() {
  var p = G.profile;
  var area = document.getElementById('family-stats');
  if (!area) return;

  // 성별에 따른 배우자 호칭
  var spouseLabel = p.gender === 'female' ? '남편' : '아내';
  var spouseIcon  = p.gender === 'female' ? '👨' : '👩';
  var playerIcon  = p.gender === 'female' ? '👩' : '👨';

  // 사이드패널 플레이어 이름 표시
  var nameDisp = p.name || (p.gender === 'female' ? '김민지' : '김철수');
  var ageDisp  = p.age ? ' (' + p.age + '세)' : '';
  var playerInfoEl = document.getElementById('side-player-info');
  if (playerInfoEl) {
    playerInfoEl.textContent = playerIcon + ' ' + nameDisp + ageDisp;
  }

  if (!p.hasSpouse && !p.hasKid) {
    area.innerHTML = '<div style="color:var(--dim);font-size:11px">솔로 · 자유로운 삶</div>';
    return;
  }
  var html = '';
  if (p.hasSpouse) {
    html +=
      '<div class="rel-row">' +
        '<div class="rel-name">' + spouseIcon + ' ' + spouseLabel + '</div>' +
        '<div class="bar-wrap" style="flex:1"><div class="bar-fill bar-purple" id="bar-sp" style="width:' + p.rel_spouse + '%"></div></div>' +
        '<span class="stat-num" id="num-sp">' + p.rel_spouse + '</span>' +
      '</div>' +
      '<div class="rel-hearts" id="hearts-sp">' + hearts(p.rel_spouse) + '</div>';
  }
  // 아이들 마다 관계 바 표시
  var kids = (p.kids && p.kids.length > 0) ? p.kids : (p.hasKid ? [{ gender:'male', age:null }] : []);
  kids.forEach(function(kid, idx) {
    var kIcon = kid.gender === 'female' ? '👧' : '👦';
    var kLabel = '아이' + (kids.length > 1 ? (idx + 1) : '') + (kid.age ? ' (' + kid.age + '세)' : '');
    var barId  = 'bar-kid-' + idx;
    var numId  = 'num-kid-' + idx;
    var hrtId  = 'hearts-kid-' + idx;
    // 관계도: 첫번째 rel_kid 공유, 나머지는 기본 60
    var rel = (idx === 0) ? p.rel_kid : (p['rel_kid_' + idx] || 60);
    html += '<div class="rel-row" style="margin-top:5px">' +
      '<div class="rel-name">' + kIcon + ' ' + kLabel + '</div>' +
      '<div class="bar-wrap" style="flex:1"><div class="bar-fill bar-blue" id="' + barId + '" style="width:' + rel + '%"></div></div>' +
      '<span class="stat-num" id="' + numId + '">' + rel + '</span>' +
    '</div>' +
    '<div class="rel-hearts" id="' + hrtId + '">' + hearts(rel) + '</div>';
  });
  area.innerHTML = html;
}

function hearts(v) {
  var f = Math.min(5, Math.floor(v / 20));
  var e = 5 - f;
  var h = '';
  for (var i = 0; i < f; i++) h += '❤️';
  for (var j = 0; j < e; j++) h += '🖤';
  return h;
}

function updateSide() {
  var s = G.stats;
  var p = G.profile;
  var te = document.getElementById('side-time');
  if (te) te.textContent = minToTime(s.time);

  setBar('bar-stamina', 'num-stamina', s.stamina, s.stamina < 30 ? 'bar-red' : 'bar-green');
  setBar('bar-stress',  'num-stress',  s.stress,  s.stress > 70 ? 'bar-red' : 'bar-yellow');
  setBar('bar-mental',  'num-mental',  s.mental,  s.mental < 30 ? 'bar-red' : 'bar-blue');

  setText('s-income',  '+' + s.income.toLocaleString() + '원');
  setText('s-expense', '-' + s.expense.toLocaleString() + '원');
  var net = s.income - s.expense;
  var ne = document.getElementById('s-net');
  if (ne) {
    ne.textContent = (net >= 0 ? '+' : '') + net.toLocaleString() + '원';
    ne.style.color = net >= 0 ? 'var(--accent)' : '#ff4444';
  }

  if (p.hasSpouse) {
    setBar('bar-sp', 'num-sp', p.rel_spouse, 'bar-purple');
    setText('hearts-sp', hearts(p.rel_spouse));
  }
  if (p.hasKid) {
    setBar('bar-kid', 'num-kid', p.rel_kid, 'bar-blue');
    setText('hearts-kid', hearts(p.rel_kid));
  }
  updateChorePanel();
}

function setBar(barId, numId, val, cls) {
  var el = document.getElementById(barId);
  if (!el) return;
  el.className = 'bar-fill ' + cls;
  el.style.width = Math.max(0, Math.min(100, val)) + '%';
  var ne = document.getElementById(numId);
  if (ne) ne.textContent = Math.round(val);
}

function setText(id, val) {
  var e = document.getElementById(id);
  if (e) e.textContent = val;
}

function updateChorePanel() {
  var area = document.getElementById('side-chores');
  if (!area) return;
  if (!G.chores.done.length && !G.chores.pending.length) {
    area.innerHTML = '<div style="color:var(--dim);font-size:11px">없음</div>';
    return;
  }
  area.innerHTML = '';
  G.chores.done.forEach(function(id) {
    var c = null;
    for (var i = 0; i < CHORE_LIST.length; i++) {
      if (CHORE_LIST[i].id === id) { c = CHORE_LIST[i]; break; }
    }
    if (!c) return;
    var d = document.createElement('div');
    d.className = 'chore-item done';
    d.innerHTML = '<span class="chore-dot done"></span>' + c.label + ' ✓';
    area.appendChild(d);
  });
  G.chores.pending.forEach(function(id) {
    var c = null;
    for (var i = 0; i < CHORE_LIST.length; i++) {
      if (CHORE_LIST[i].id === id) { c = CHORE_LIST[i]; break; }
    }
    if (!c) return;
    var d = document.createElement('div');
    d.className = 'chore-item';
    d.innerHTML = '<span class="chore-dot"></span>' + c.label;
    area.appendChild(d);
  });
}

// ─── 이벤트 실행 ──────────────────────────────────
function nextEvent() {
  var era = G.era;
  if (!G.historicFired && era.historicEvent && G.eventIdx >= era.historicEvent.trigger) {
    G.historicFired = true;
    fireHistoricEvent();
    return;
  }

  if (G.eventIdx >= G.events.length) { showEnding(); return; }
  var ev = G.events[G.eventIdx++];

  var locEl = document.getElementById('game-loc');
  if (locEl) locEl.textContent = ev.loc;

  // 기상 이벤트 알람 효과
  if (ev.id === 'wake' && typeof SFX !== 'undefined') {
    setTimeout(function() { SFX.play('alarm'); }, 200);
  }

  G._focusing = true;
  var startLine = log('game-log', 'divider', '');
  if (ev.ascii) log('game-log', 'ascii', ev.ascii);

  if (ev.desc) {
    ev.desc.forEach(function(l) { log('game-log', l.t, l.m); });
  }

  log('game-log', 'empty', '');
  renderChoices(ev.choices || []);
  updateSide();

  // 스마트 포커스 스크롤: 지문의 시작점(startLine)으로 스크롤 고정
  setTimeout(function() {
    var container = document.getElementById('game-log');
    if (container && startLine) {
      container.scrollTop = startLine.offsetTop - 10;
    }
    G._focusing = false;
  }, 100);
}

// ─── 역사적 이벤트 발동 ─────────────────────────────
function fireHistoricEvent() {
  var he = G.era.historicEvent;
  var hpanel = document.getElementById('side-history');
  var htxt = document.getElementById('history-text');
  if (hpanel && htxt) {
    hpanel.style.display = 'block';
    htxt.textContent = he.title;
    hpanel.classList.add('history-flash');
    setTimeout(function() { hpanel.classList.remove('history-flash'); }, 2000);
  }

  // 역사적 이벤트 충격 사운드
  if (typeof SFX !== 'undefined') {
    SFX.play('shock');
    setTimeout(function() { SFX.play('historic'); }, 400);
  }

  var locEl = document.getElementById('game-loc');
  if (locEl) locEl.textContent = '⚡ 역사적 사건 발생!';

  log('game-log', 'divider', '');
  if (he.log) {
    he.log.forEach(function(l) { log('game-log', l.t, l.m); });
  }
  log('game-log', 'empty', '');
  renderChoices(he.choices || []);
  updateSide();
}

// ─── 선택지 렌더링 ────────────────────────────────
function renderChoices(choices) {
  clearEl('game-choices');
  var area = document.getElementById('game-choices');
  if (!area) return;
  var lbl = document.createElement('div');
  lbl.className = 'choice-hdr';
  lbl.textContent = '▼ 어떻게 하겠습니까?';
  area.appendChild(lbl);

  var typeMap = { bad:'t-bad', money:'t-money', family:'t-family', history:'t-history' };
  choices.forEach(function(ch) {
    if (ch.condition && !ch.condition(G.profile)) return;
    var cls = typeMap[ch.type] || '';
    var b = mkBtn(ch.label, function() { applyChoice(ch); }, cls);
    area.appendChild(b);
  });
}

// ─── 선택 적용 ────────────────────────────────────
function applyChoice(choice) {
  var btns = document.querySelectorAll('#game-choices .btn-choice');
  for (var i = 0; i < btns.length; i++) {
    btns[i].disabled = true;
    btns[i].style.opacity = '.25';
  }

  var eff = choice.effect || {};
  var s = G.stats;
  var p = G.profile;

  // 특수 이벤트 처리
  if (eff.special) {
    (choice.result || []).forEach(function(r) { log('game-log', r.t, r.m); });
    handleSpecial(eff.special);
    return;
  }

  var prevStress  = s.stress;
  var prevStamina = s.stamina;
  var prevMental  = s.mental;
  var prevRelSp   = p.rel_spouse;
  var prevRelKid  = p.rel_kid;

  if (eff.stress   != null) s.stress  = Math.max(0, Math.min(100, s.stress  + eff.stress));
  if (eff.stamina  != null) s.stamina = Math.max(0, Math.min(100, s.stamina + eff.stamina));
  if (eff.mental   != null) s.mental  = Math.max(0, Math.min(100, s.mental  + eff.mental));
  if (eff.time     != null) s.time   += eff.time;
  if (eff.money    != null) {
    if (eff.money > 0) {
      s.income += eff.money;
      if (typeof SFX !== 'undefined') setTimeout(function() { SFX.play('coin'); }, 300);
    } else {
      s.expense += -eff.money;
    }
  }
  if (eff.rel_sp  != null && p.hasSpouse) {
    p.rel_spouse = Math.max(0, Math.min(100, p.rel_spouse + eff.rel_sp));
    if (typeof SFX !== 'undefined') {
      if (p.rel_spouse > prevRelSp) setTimeout(function(){ SFX.play('relationUp'); }, 500);
      else if (p.rel_spouse < prevRelSp) setTimeout(function(){ SFX.play('relationDown'); }, 500);
    }
  }
  if (eff.rel_kid != null && p.hasKid) {
    p.rel_kid = Math.max(0, Math.min(100, p.rel_kid + eff.rel_kid));
    if (typeof SFX !== 'undefined') {
      if (p.rel_kid > prevRelKid) setTimeout(function(){ SFX.play('relationUp'); }, 600);
      else if (p.rel_kid < prevRelKid) setTimeout(function(){ SFX.play('relationDown'); }, 600);
    }
  }
  if (eff.flag && p.flags.indexOf(eff.flag) < 0) p.flags.push(eff.flag);

  // 야근 효과음
  if (eff.flag === 'overtime' && typeof SFX !== 'undefined') {
    setTimeout(function() { SFX.play('overtime'); }, 400);
  }

  if (eff.choreDone) {
    eff.choreDone.forEach(function(id) {
      if (G.chores.done.indexOf(id) < 0) G.chores.done.push(id);
      G.chores.pending = G.chores.pending.filter(function(x) { return x !== id; });
    });
  }
  if (eff.chorePending) {
    eff.chorePending.forEach(function(id) {
      if (G.chores.done.indexOf(id) < 0 && G.chores.pending.indexOf(id) < 0) {
        G.chores.pending.push(id);
      }
    });
  }

  if (choice.ascii && ASCII[choice.ascii]) {
    log('game-log', 'ascii', ASCII[choice.ascii]);
  }
  (choice.result || []).forEach(function(r) { log('game-log', r.t, r.m); });

  // 위험 스탯 경보음
  if (typeof SFX !== 'undefined') {
    if (s.stress >= 85 && prevStress < 85) setTimeout(function(){ SFX.play('stressAlert'); }, 600);
    if (s.stamina <= 15 && prevStamina > 15) setTimeout(function(){ SFX.play('bad'); }, 600);
    if (s.mental <= 20 && prevMental > 20) setTimeout(function(){ SFX.play('bad'); }, 600);
  }

  if (s.stress >= 85 && s.stress < 90) log('game-log', 'bad', '⚠ 스트레스가 위험 수준에 달했다!');
  if (s.stamina <= 15 && s.stamina > 10) log('game-log', 'bad', '⚠ 체력이 바닥났다. 쉬어야 한다.');
  if (s.mental <= 20 && s.mental > 15) log('game-log', 'bad', '⚠ 멘탈이 위험하다. 번아웃 직전.');

  updateSide();
  saveGame();   // 매 선택 후 자동저장

  // ── 성찰 시스템 (80% 확률) ────────────────
  if (Math.random() < 0.8) {
    var thought = getReflection(choice.type || 'normal');
    setTimeout(function() {
      var logEl = log('game-log', 'phil-thought', '✨ 성찰: "' + thought + '"');
      if (logEl) logEl.scrollIntoView({ behavior:'smooth', block:'center' });
    }, 450);
  }

  setTimeout(nextEvent, 1000); // 딜레이를 약간 늘려 성찰을 읽을 시간을 확보
}

// ─── 특수 이벤트 처리 ──────────────────────────────
function handleSpecial(type) {
  var s = G.stats;
  
  if (type.indexOf('minigame:') === 0) {
    var gameId = type.split(':')[1];
    setTimeout(function() { startMiniGame(gameId); }, 300);
    return;
  }

  if (type === 'lotto') {
    var r = Math.random();
    var msg, money = 0;
    if      (r < 0.0005) { msg = '🎰🎰🎰 1등 당첨!!! 20억원!!!'; money = 2000000000; }
    else if (r < 0.005)  { msg = '🎊 4등 당첨! 50,000원!'; money = 50000; }
    else if (r < 0.03)   { msg = '✨ 5등 당첨! 5,000원!'; money = 5000; }
    else                 { msg = '😭 꽝... 역시 로또는 꿈이었다.'; money = 0; }

    // 로또 긴장감 사운드
    if (typeof SFX !== 'undefined') {
      if (money >= 50000) setTimeout(function(){ SFX.play('lotto'); }, 200);
      else                setTimeout(function(){ SFX.play('lottoBad'); }, 200);
    }

    log('game-log', money > 10000 ? 'good' : 'bad', msg);
    if (money > 0) s.income += money;
    updateSide();
    setTimeout(nextEvent, money >= 50000 ? 2500 : 1200);

  } else if (type === 'youtube') {
    var amounts = [800, 2500, 6000, 15000, 38000, 95000, 280000, 500000];
    var amt = amounts[Math.floor(Math.random() * amounts.length)];
    log('game-log', 'money', '📊 유튜브 수익: +' + amt.toLocaleString() + '원');
    log('game-log', amt >= 50000 ? 'good' : 'story',
      amt >= 50000 ? '제법 괜찮은 수익이다!' : '아직 소소하지만 꾸준히 하면 늘겠지.');
    if (typeof SFX !== 'undefined') setTimeout(function(){ SFX.play('money'); }, 300);
    s.income += amt;
    updateSide();
    setTimeout(nextEvent, 1000);
  }
}

// ─── 미니게임 시스템 ──────────────────────────────
function startMiniGame(id) {
  if (id === 'typing') {
    var words = ['SURVIVAL', 'KOREA', 'SUCCESS', 'EFFORT', 'PASSION', 'ROUTINE', 'SALARY', 'FREEDOM'];
    var target = words[Math.floor(Math.random() * words.length)];
    
    // UI에 시스템 메시지 표시
    log('game-log', 'system-msg', '⌨️ TYPING MISSION');
    log('game-log', 'system', '제한 시간 내에 [' + target + ']를 입력하세요!');
    
    // 간단한 프롬프트로 구현 (나중에 전용 UI로 고도화 가능)
    var start = Date.now();
    var input = prompt('명령어를 입력하세요: ' + target);
    var duration = (Date.now() - start) / 1000;
    
    if (input && input.toUpperCase() === target && duration < 7) {
      log('game-log', 'good', '✅ 성취! 업무 집중력 상향. (스트레스 -15)');
      G.stats.stress = Math.max(0, G.stats.stress - 15);
      G.stats.mental = Math.min(100, G.stats.mental + 10);
    } else {
      log('game-log', 'bad', '❌ 지연... 흐름이 끊겼습니다. (스트레스 +10)');
      G.stats.stress = Math.min(100, G.stats.stress + 10);
    }
    updateSide();
    setTimeout(nextEvent, 1000);
  }
}

// ─── 엔딩 ─────────────────────────────────────────
function showEnding() {
  showScreen('ending');
  clearSave();   // 엔딩 도달하면 저장 데이터 삭제
  if (typeof BGM !== 'undefined') BGM.stop();
  if (typeof SFX !== 'undefined') setTimeout(function(){ SFX.play('ending'); }, 300);
  clearEl('ending-log');

  var s = G.stats;
  var p = G.profile;
  var era = G.era;

  var score = 50;
  score += Math.round((100 - s.stress) * 0.2);
  score += Math.round(s.stamina * 0.15);
  score += Math.round(s.mental * 0.1);
  score += Math.min(30, Math.round((s.income - s.expense) / 10000) * 0.3);

  var flags = p.flags;
  var bonuses = [];

  var flagBonuses = {
    diligent:      [8,  '성실함'],
    earlyBed:      [5,  '숙면'],
    honest:        [6,  '양심적'],
    goodParent:    [10, '좋은 부모'],
    kind:          [4,  '배려심'],
    overtime:      [-5, '야근'],
    stockProfit:   [8,  '주식 수익'],
    budgetCheck:   [3,  '가계부 정리'],
    socialLunch:   [3,  '사교적'],
    ai_user:       [5,  'AI 활용'],
    survived_imf:  [15, 'IMF 생존'],
    covid_safe:    [8,  '방역 우수'],
    patriot:       [10, '애국 시민'],
    wlb:           [7,  '워라밸 수호'],
    work_life_balance:[7,'워라밸 수호'],
    venture_spirit:[6,  '도전 정신'],
    job_hunt:      [5,  '재취업 의지'],
    ai_skilled:    [10, 'AI 마스터'],
    career_pivot:  [6,  '변화 대응'],
    self_dev:      [5,  '자기계발'],
    gratitude:     [3,  '감사하는 마음'],
    gold_donation: [8,  '금 헌납 (애국)'],
  };

  for (var f in flagBonuses) {
    if (flags.indexOf(f) >= 0) {
      var val = flagBonuses[f][0];
      var label = flagBonuses[f][1];
      score += val;
      bonuses.push([label, val > 0 ? '+' + val : '' + val]);
    }
  }

  if (p.hasSpouse) {
    var b1 = Math.round((p.rel_spouse - 60) * 0.2);
    if (b1 !== 0) {
      bonuses.push(['배우자 관계(' + p.rel_spouse + ')', b1 > 0 ? '+' + b1 : '' + b1]);
      score += b1;
    }
  }
  if (p.hasKid) {
    var b2 = Math.round((p.rel_kid - 60) * 0.15);
    if (b2 !== 0) {
      bonuses.push(['자녀 관계(' + p.rel_kid + ')', b2 > 0 ? '+' + b2 : '' + b2]);
      score += b2;
    }
  }
  if (G.chores.done.length >= 3) { bonuses.push(['집안일 처리', '+7']); score += 7; }
  if (G.chores.pending.length >= 3) { bonuses.push(['집안일 방치', '-5']); score -= 5; }

  score = Math.max(0, Math.min(100, Math.round(score)));

  // 엔딩 타입
  var ending;
  if (p.hasSpouse && p.rel_spouse >= 75 && score >= 70) {
    ending = { type:'family_happy', label:'💕 행복한 가정 엔딩', color:'#ff88cc', msg:era.name + '을 가족과 함께 행복하게 살았다. 힘들었지만 곁에 있어줬다.' };
  } else if (!p.hasSpouse && score >= 75) {
    ending = { type:'success_solo', label:'🌟 고독한 성공 엔딩', color:'#ffcc00', msg:'혼자였지만 당신만의 방식으로 성공했다. 하지만 가끔 외롭다.' };
  } else if (p.hasSpouse && p.rel_spouse < 30) {
    ending = { type:'divorce', label:'💔 이혼 위기 엔딩', color:'#ff4444', msg:'일에만 치여 살다 결국 배우자와 멀어졌다. 관계 회복이 시급하다.' };
  } else if (s.stress >= 85) {
    ending = { type:'burnout', label:'😵 번아웃 엔딩', color:'#ff6644', msg:'스트레스가 폭발했다. 오늘 이후 한동안 회복 시간이 필요하다.' };
  } else if (score >= 55) {
    ending = { type:'normal', label:'🙂 평범한 하루 엔딩', color:'var(--primary)', msg:era.name + '의 평범한 직장인으로 오늘 하루를 살아냈다.' };
  } else {
    ending = { type:'hard', label:'😔 힘들었던 하루', color:'#ff9944', msg:'오늘은 정말 힘든 날이었다. 하지만 내일은 다를 것이다.' };
  }

  var eraEndMsg = {
    '1980': '새마을운동의 시대, 당신은 나름의 방식으로 살아남았다.',
    '1997': 'IMF의 파도 속에서 당신은 오늘 하루를 버텨냈다.',
    '2000': '인터넷 혁명의 시대, 변화 속에서 자신을 지켜냈다.',
    '2010': '스마트폰이 세상을 바꾼 시대, 당신도 변화했다.',
    '2020': '팬데믹 속에서 당신은 무너지지 않았다.',
    '2026': 'AI가 일을 대체하는 시대, 당신만의 가치를 지켰다.',
  };

  var nameDisp2   = p.name || (p.gender === 'female' ? '김민지' : '김철수');
  var gIcon2      = p.gender === 'female' ? '👩' : '👨';
  var spouseWord2 = p.gender === 'female' ? '남편' : '아내';
  var parentWord  = p.gender === 'female' ? '엄마' : '아빠';

  var endLogs = [
    { t:'time',  m:'[ ' + era.name + ' — 하루가 끝났다 ]' },
    { t:'system', m: gIcon2 + ' ' + nameDisp2 + (p.age ? ' (' + p.age + '세)' : '') },
    { t:'story', m: eraEndMsg[era.id] || '' },
    { t:'empty', m:'' },
  ];
  if (s.stress >= 80) endLogs.push({ t:'bad', m:'💀 스트레스가 위험 수준. 이대로 괜찮은 걸까?' });
  else if (s.stress >= 50) endLogs.push({ t:'story', m:'😔 피로가 쌓인다. 주말이 그립다.' });
  else endLogs.push({ t:'good', m:'😊 생각보다 나쁘지 않은 하루였다.' });

  if (p.hasSpouse && p.rel_spouse >= 75) endLogs.push({ t:'npc', m:spouseWord2 + ': "오늘도 수고했어. 정말 사랑해." (꼭 안아준다)' });
  if (p.hasSpouse && p.rel_spouse < 35) endLogs.push({ t:'bad', m:'⚡ ' + spouseWord2 + '와의 관계가 위험 수준이다. 진지하게 대화가 필요하다.' });
  if (p.hasKid && p.rel_kid >= 75) endLogs.push({ t:'npc', m:'아이: "' + parentWord + ' 오늘 최고였어!" (힘차게 안아준다)' });
  if (p.hasKid && p.rel_kid < 35) endLogs.push({ t:'bad', m:'💔 아이가 쓸쓸해 보인다. ' + parentWord + '로서 더 많은 시간을 줘야 할 것 같다.' });

  endLogs.forEach(function(l) { log('ending-log', l.t, l.m); });

  var net = s.income - s.expense;
  var choreDone = G.chores.done.map(function(id) {
    for (var i = 0; i < CHORE_LIST.length; i++) {
      if (CHORE_LIST[i].id === id) return CHORE_LIST[i].label;
    }
    return id;
  }).join(', ') || '없음';
  var chorePend = G.chores.pending.map(function(id) {
    for (var i = 0; i < CHORE_LIST.length; i++) {
      if (CHORE_LIST[i].id === id) return CHORE_LIST[i].label;
    }
    return id;
  }).join(', ') || '없음';

  var econRows = era.econLabel.map(function(l) {
    return '<div class="score-row"><span>' + l.k + '</span><span>' + l.v + '</span></div>';
  }).join('');

  var choreHtml = G.chores.done.length > 0
    ? '<div class="score-sec">[ 집안일 ]</div>' +
      '<div class="score-row"><span>완료</span><span style="color:#44ff88">' + choreDone + '</span></div>' +
      '<div class="score-row"><span>미처리</span><span style="color:' + (G.chores.pending.length > 0 ? '#ff9944' : '#44ff88') + '">' + chorePend + '</span></div>'
    : '';

  var familyHtml = '';
  if (p.hasSpouse || p.hasKid) {
    familyHtml = '<div class="score-sec">[ 가족 관계 ]</div>';
    if (p.hasSpouse) familyHtml += '<div class="score-row"><span>' + spouseWord2 + '</span><span>' + hearts(p.rel_spouse) + ' (' + p.rel_spouse + ')</span></div>';
    if (p.hasKid)    familyHtml += '<div class="score-row"><span>자녀</span><span>'   + hearts(p.rel_kid)    + ' (' + p.rel_kid    + ')</span></div>';
  }

  var bonusHtml = '';
  if (bonuses.length > 0) {
    bonusHtml = '<div class="score-sec">[ 보너스/패널티 ]</div>';
    bonuses.forEach(function(b) {
      bonusHtml += '<div class="score-row"><span>' + b[0] + '</span><span style="color:' + (b[1].charAt(0) === '+' ? '#44ff88' : '#ff4444') + '">' + b[1] + '</span></div>';
    });
  }

  var gradeInfo = getGrade(score);

  document.getElementById('ending-board').innerHTML =
    '<div class="score-title">── ' + era.name + ' 오늘의 기록 ──</div>' +
    '<div class="score-row"><span>' + gIcon2 + ' 플레이어</span><span style="color:var(--primary)">' + nameDisp2 + (p.age ? ' · ' + p.age + '세' : '') + '</span></div>' +
    '<div class="score-sec">[ 시대 물가 ]</div>' + econRows +
    '<div class="score-sec">[ 스탯 ]</div>' +
    '<div class="score-row"><span>스트레스</span><span style="color:' + (s.stress >= 70 ? '#ff4444' : '#44ff88') + '">' + s.stress + '/100</span></div>' +
    '<div class="score-row"><span>체력</span><span>' + s.stamina + '/100</span></div>' +
    '<div class="score-row"><span>멘탈</span><span>' + s.mental + '/100</span></div>' +
    '<div class="score-row"><span>퇴근 시각</span><span>' + minToTime(s.time) + '</span></div>' +
    '<div class="score-sec">[ 재정 ]</div>' +
    '<div class="score-row"><span>수입</span><span style="color:#44ff88">+' + s.income.toLocaleString() + '원</span></div>' +
    '<div class="score-row"><span>지출</span><span style="color:#ff6644">-' + s.expense.toLocaleString() + '원</span></div>' +
    '<div class="score-row hl"><span>순수익</span><span style="color:' + (net >= 0 ? 'var(--accent)' : '#ff4444') + '">' + (net >= 0 ? '+' : '') + net.toLocaleString() + '원</span></div>' +
    choreHtml + familyHtml + bonusHtml +
    getPhilosophySection(p.flags) +
    '<div class="ending-rank-wrap">' +
      '<div class="ending-grade-badge" style="background:' + gradeInfo.color + '">' + gradeInfo.grade + '</div>' +
      '<div class="ending-score-num" style="color:var(--primary)">' + score + '점</div>' +
      '<div class="ending-grade" style="color:' + ending.color + '">' + ending.label + '</div>' +
      '<div class="ending-msg">' + ending.msg + '</div>' +
    '</div>';
}

function getPhilosophySection(flags) {
  var counts = {
    Phil_Stoic: 0,
    Phil_Epicurean: 0,
    Phil_Altruist: 0,
    Phil_Materialist: 0,
    Phil_Existentialist: 0,
    Phil_Humanist: 0
  };

  var hasPhil = false;
  flags.forEach(function(f) {
    if (counts.hasOwnProperty(f)) {
      counts[f]++;
      hasPhil = true;
    }
  });

  if (!hasPhil) return '';

  var maxVal = 0;
  var dominant = 'Phil_Stoic';
  for (var k in counts) {
    if (counts[k] > maxVal) {
      maxVal = counts[k];
      dominant = k;
    }
  }

  var philData = {
    Phil_Stoic: {
      title: '현대판 스토아 학자',
      desc: '당신은 통제할 수 없는 고통에 의연히 대처하며, 묵묵히 자신의 자리를 지키는 인내의 미덕을 보였습니다.',
      icon: '🛡️'
    },
    Phil_Epicurean: {
      title: '세속의 정원사',
      desc: '당신은 오늘이라는 찰나의 순간에서 기쁨을 찾고, 불필요한 고통보다는 마음의 평온과 즐거움을 우선시했습니다.',
      icon: '🍷'
    },
    Phil_Altruist: {
      title: '따스한 등불',
      desc: '자신의 안위보다 타인의 웃음과 행복에서 삶의 의미를 찾는 당신은, 누군가의 어둠을 밝혀주는 존재입니다.',
      icon: '🕯️'
    },
    Phil_Materialist: {
      title: '현실적인 전략가',
      desc: '추상적인 가치보다 눈에 보이는 성취와 자산을 소중히 여기며, 더 나은 내일을 위해 확실한 발판을 다졌습니다.',
      icon: '💰'
    },
    Phil_Existentialist: {
      title: '의미를 빚는 조각가',
      desc: '주어진 운명에 순응하기보다, 치열한 고민을 통해 스스로 삶의 이유를 만들어가려는 주체적인 태도를 보였습니다.',
      icon: '🎭'
    },
    Phil_Humanist: {
      title: '길 위의 동행자',
      desc: '사람과 사람 사이의 온기와 유대감을 소중히 여기며, 함께 살아간다는 것의 가치를 다시금 일깨워주었습니다.',
      icon: '🤝'
    }
  };

  var data = philData[dominant];

  return '<div class="score-sec">[ 인생의 의미 ]</div>' +
         '<div class="phil-card" style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:12px; margin-top:5px;">' +
           '<div style="font-size:14px; color:var(--primary); font-weight:700; margin-bottom:4px;">' + data.icon + ' ' + data.title + '</div>' +
           '<div style="font-size:11px; color:var(--text); line-height:1.5; opacity:0.8;">' + data.desc + '</div>' +
         '</div>';
}

function getGrade(score) {
  if (score >= 90) return { grade:'S', color:'#ffd700' };
  if (score >= 80) return { grade:'A', color:'#44ff88' };
  if (score >= 65) return { grade:'B', color:'#44aaff' };
  if (score >= 50) return { grade:'C', color:'var(--primary)' };
  if (score >= 35) return { grade:'D', color:'#ff9944' };
  return { grade:'F', color:'#ff4444' };
}

// ─── 리셋 ─────────────────────────────────────────
function resetGame() {
  clearSave();   // 리셋 시 저장 데이터 삭제
  if (typeof BGM !== 'undefined') BGM.stop();
  P.gender = null;
  P.age    = null;
  P.name   = '';
  G.profile = { gender:null, name:'', age:null, employType:null, job:null, hasSpouse:false, hasKid:false, company:null, home:null, flags:[], rel_spouse:60, rel_kid:60 };
  G.stats = { stress:0, stamina:100, mental:100, time:390, income:0, expense:0 };
  G.chores = { done:[], pending:[] };
  G.era = null;
  G.eventIdx = 0;
  cIdx = 0;
  showScreen('title');
  document.body.className = 'era-2026';
}

async function fetchScenarios() {
  const SHEET_ID = '1MBSZEGp5t3QQz7a7L7BLah1IN425Tu2KiIPoZhtiByU';
  const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;
  try {
    const res = await fetch(SHEET_URL);
    const csvText = await res.text();
    const rows = parseCSV(csvText);
    G.scenarios = mapCsvToScenarios(rows);
    renderScenarioCards();
  } catch (e) {
    console.warn('시나리오 로드 실패(구글 시트):', e);
    // 폴백: 로컬 파일 시도
    try {
      const res = await fetch('data/scenarios.json');
      const data = await res.json();
      G.scenarios = data.scenarios || [];
      renderScenarioCards();
    } catch(e2) {}
  }
}

function parseCSV(text) {
  const rows = [];
  let currentRow = [];
  let currentCell = '';
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i+1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentCell += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = '';
    } else if ((char === '\n' || char === '\r') && !insideQuotes) {
      if (currentCell || currentRow.length > 0) {
        currentRow.push(currentCell.trim());
        rows.push(currentRow);
      }
      currentCell = '';
      currentRow = [];
      if (char === '\r' && nextChar === '\n') i++;
    } else {
      currentCell += char;
    }
  }
  if (currentCell || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    rows.push(currentRow);
  }
  return rows;
}

function mapCsvToScenarios(rows) {
  if (rows.length < 2) {
    console.warn('Scenarios: No data rows found.');
    return [];
  }
  const header = rows[0];
  console.log('CSV Header:', header); // 브라우저 콘솔에서 확인용
  
  const scenarios = [];

  const findIdx = (key, fallback) => {
    const found = header.findIndex(h => h.toLowerCase().trim().includes(key.toLowerCase()));
    return found !== -1 ? found : fallback;
  };

  const idx = {
    id: findIdx('id', 0), 
    date: findIdx('date', 1), 
    era: findIdx('eraid', 2), 
    title: findIdx('title', 3), 
    desc: findIdx('desc', 4), 
    rec: findIdx('recommend', 5),
    time: findIdx('time', 6), 
    etitle: findIdx('eventtitle', 7), 
    estory: findIdx('eventstory', 8)
  };

  console.log('Mapped Indices:', idx);

  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (r.length < 3) continue;

    try {
      if (r[0].includes('\n') && r.length < 5) {
        const subRows = parseCSV(r[0]);
        subRows.forEach(sr => {
          const s = mapSingleScenario(sr, idx);
          if (s) scenarios.push(s);
        });
        continue;
      }

      const s = mapSingleScenario(r, idx);
      if (s) scenarios.push(s);
    } catch (err) {
      console.error('Mapping error at row ' + i, err);
    }
  }
  return scenarios;
}

function mapSingleScenario(r, idx) {
  if (!r) return null;
  
  const getValue = (pos) => (r[pos] !== undefined ? r[pos] : '').trim();
  
  const title = getValue(idx.title);
  if (!title && !getValue(idx.id)) return null; // 정말 비어있는 줄 패스

  const s = {
    id: getValue(idx.id) || ('sc_' + Math.random().toString(36).substr(2, 5)),
    date: getValue(idx.date) || '날짜 미상',
    eraId: getValue(idx.era) || '2026',
    title: title || '제목 없음',
    desc: getValue(idx.desc) || '설명 없음',
    recommend: getValue(idx.rec) || 'salaryman',
    icon: '📍',
    events: []
  };

  // 아이콘 자동 선택
  if (title.includes('💥')) s.icon = '💥';
  else if (title.includes('🚨')) s.icon = '🚨';
  else if (title.includes('📺')) s.icon = '📺';
  else if (title.includes('📉')) s.icon = '📉';
  else if (title.includes('💸')) s.icon = '💸';
  else if (title.includes('⚾')) s.icon = '⚾';
  else if (title.includes('✈️')) s.icon = '✈️';

  const event = {
    time: getValue('time') || '09:00',
    title: getValue('etitle') || '역사적 사건',
    type: 'scenario',
    key: 'evt_' + s.id,
    desc: getValue('estory').split('|').map(line => ({ t: 'bad', m: line.trim() })),
    choices: []
  };

  // 선택지 매핑 (Choice1_Text가 시작되는 인덱스 찾기)
  const cStart = idx.estory + 1;
  for (let j = 0; j < 3; j++) {
     const b = cStart + (j * 3);
     if (r[b]) {
       event.choices.push({
         label: '▶ ' + r[b],
         effect: parseEffect(r[b+1]),
         result: [{ t:'story', m: r[b+2] || '...' }]
       });
     }
  }
  s.events.push(event);
  return s;
}

function parseEffect(effStr) {
  const obj = {};
  if (!effStr) return obj;
  // ,와 | 모두 지원하도록 정규식 사용
  const pairs = effStr.split(/[,|]/);
  pairs.forEach(pair => {
    const kv = pair.split(':');
    if (kv.length === 2) {
      const val = parseInt(kv[1].trim());
      if (!isNaN(val)) obj[kv[0].trim()] = val;
    }
  });
  return obj;
}

function renderScenarioCards() {
  var container = document.getElementById('scenario-grid');
  if (!container) return;
  container.innerHTML = '';

  G.scenarios.forEach(function(s) {
    var card = document.createElement('div');
    card.className = 'scenario-card';
    card.onclick = function() { startScenario(s.id); };
    card.innerHTML =
      '<div class="sc-icon">' + (s.icon || '📍') + '</div>' +
      '<div class="sc-content">' +
        '<div class="sc-title">' + s.title + '</div>' +
        '<div class="sc-date">' + s.date + '</div>' +
        '<div class="sc-desc">' + s.desc + '</div>' +
      '</div>' +
      '<div class="sc-footer">' +
        '<span class="sc-diff">' + (s.difficulty || '★★★☆☆') + '</span>' +
        '<span class="sc-btn">입장하기 →</span>' +
      '</div>';
    container.appendChild(card);
  });
}

function startScenario(id) {
  var s = G.scenarios.find(function(item) { return item.id === id; });
  if (!s) return;

  var era = ERAS.find(function(e) { return e.id === s.eraId; });
  if (!era) return;

  if (typeof SFX !== 'undefined') SFX.play('click');
  
  // 시나리오 초기화
  G.era = era;
  G.currentScenario = s;
  document.body.className = era.cssClass;

  // 기본 프로필 설정 (시나리오 추천 직업 등 활용)
  var job = era.jobs.find(function(j) { return j.id === s.recommend; }) || era.jobs[0];
  var home = era.homeLocations[0];

  G.profile = {
    gender: 'male',
    name: '김철수',
    job: job,
    home: home,
    employType: EMPLOY_TYPES[0],
    hasSpouse: true,
    hasKid: true,
    rel_spouse: 60,
    rel_kid: 60,
    flags: ['scenario_mode']
  };

  G.stats = {
    stress: 20, stamina: 100, mental: 100,
    time: 390, // 06:30
    income: job.dailyPay, expense: home.rent / 30,
    money: era.econ.wage * 0.5 // 자산 절반 시작
  };

  G.events = buildDayEvents(G.profile, G.era);
  G.eventIdx = 0;

  showScreen('game');
  if (typeof BGM !== 'undefined') BGM.stop();
  if (typeof BGM !== 'undefined') BGM.play(era.id);

  // HUD 업데이트
  var chip = document.getElementById('game-era-chip');
  if (chip) chip.textContent = s.title; 
  var dateEl = document.getElementById('side-date');
  if (dateEl) dateEl.textContent = s.date;

  updateSide();
  clearEl('game-log');
  clearEl('game-choices');

  log('game-log', 'history', '══════════════════════════════════');
  log('game-log', 'history', '  🕰️ 타임머신 가동: ' + s.date);
  log('game-log', 'history', '  시나리오: ' + s.title);
  log('game-log', 'history', '══════════════════════════════════');
  log('game-log', 'story', s.desc);
  
  setTimeout(nextEvent, 1000);
}
