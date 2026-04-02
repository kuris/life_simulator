// =============================================
//  대한민국 직장인 생존기 — 이벤트 스크립트 v3.0
// =============================================

function buildDayEvents(profile, era) {
  var p = profile, e = era, weather = getWeather(), ev = [];
  var core = getNarrativeCore(p, e);
  var isRemote = (p.home.type === 'home') || (p.company.id === 'home_2020') || (p.company.id === 'home_2010') || (p.company.id === 'home_2000');

  var blueprint = getDayBlueprint(p, e, isRemote);

  blueprint.forEach(function(slot) {
    var eventObj = null;
    if (slot.type === 'fixed') {
      if (FIXED_EVENTS[slot.key]) eventObj = FIXED_EVENTS[slot.key](p, e, weather);
    } else if (slot.type === 'random') {
      eventObj = getRandomFromPool(slot.key, p, e);
    } else if (slot.type === 'narrative') {
      if (core && core.stages[slot.stage]) {
        var s = core.stages[slot.stage];
        eventObj = {
          id: 'narrative_' + slot.stage, time: slot.time, loc: s.loc || '⚡ 이야기',
          desc: [{ t:'time', m:'[ ' + slot.time + ' ] ' + s.title }].concat(s.descLines),
          choices: s.choices, ascii: s.ascii
        };
      }
    } else if (slot.type === 'phil') {
      var phil = getPhilosophicalMoment(p, e, slot.key);
      if (phil) {
        eventObj = {
          id: 'phil_' + slot.key, time: slot.time, loc: '💭 생각',
          desc: [{ t:'time', m:'[ ' + slot.time + ' ] 잠시 생각이 든다.' }].concat(phil.descLines),
          choices: phil.choices
        };
      }
    }

    if (eventObj) {
      if (!eventObj.time) eventObj.time = slot.time;
      ev.push(eventObj);
    }
  });
  return ev;
}

function getDayBlueprint(p, e, isRemote) {
  var bp = [
    { time: '06:30', type: 'fixed', key: 'WAKE' },
    { time: '07:00', type: 'fixed', key: 'MORNING_PREP' }
  ];
  if (!isRemote) {
    bp.push({ time: '07:40', type: 'fixed', key: 'COMMUTE' });
    bp.push({ time: '08:10', type: 'random', key: 'COMMUTE_RANDOM' });
    bp.push({ time: '08:30', type: 'phil',   key: 'morning' });
  } else {
    bp.push({ time: '09:00', type: 'fixed', key: 'REMOTE_START' });
  }
  bp.push({ time: '09:00', type: 'fixed', key: 'WORK_AM' });
  bp.push({ time: '10:30', type: 'random', key: 'MORNING_RANDOM' });
  bp.push({ time: '12:00', type: 'fixed', key: 'LUNCH' });
  bp.push({ time: '13:00', type: 'phil', key: 'lunch' });
  bp.push({ time: '14:00', type: 'fixed', key: 'WORK_PM' });
  bp.push({ time: '14:30', type: 'narrative', stage: 0 });
  bp.push({ time: '16:00', type: 'random', key: 'AFTERNOON_RANDOM' });
  bp.push({ time: '16:30', type: 'narrative', stage: 1 });
  if (Math.random() < 0.2) bp.push({ time: '16:45', type: 'random', key: 'WILDCARD' });
  bp.push({ time: '18:00', type: 'fixed', key: 'LEAVE' });
  if (!isRemote) bp.push({ time: '18:30', type: 'fixed', key: 'GO_HOME' });
  bp.push({ time: '19:30', type: 'fixed', key: 'CHORES' });
  bp.push({ time: '20:00', type: 'random', key: 'FAMILY_RANDOM' });
  bp.push({ time: '21:00', type: 'random', key: 'INCOME_RANDOM' });
  bp.push({ time: '21:30', type: 'phil', key: 'evening' });
  bp.push({ time: '22:00', type: 'fixed', key: 'NIGHT' });
  return bp;
}

var FIXED_EVENTS = {
  WAKE: function(p, e, weather) {
    var desc = [
      { t:'time',  m:'[ 06:30 AM ] 알람이 울린다. (' + weather.label + ' 날씨)' },
      { t:'story', m: e.name + '의 아침. 창밖은 ' + weather.label + ' 풍경이다.' },
      { t:'system', m:'💭 ' + e.atmosphere[Math.floor(Math.random()*e.atmosphere.length)] },
    ];
    if (p.hasSpouse) desc.push({ t:'npc', m:'배우자: "일어나야지... 오늘도 힘내."' });
    if (p.hasKid)    desc.push({ t:'npc', m:'아이: "아빠/엄마~ 학교 가기 싫어!"' });

    var choices = [
      { label:'▶ 바로 일어난다 (칼기상)', type:'normal',
        effect: Object.assign({ stress:-3 }, weather.eff),
        result:[{ t:'good', m:'의지력! 상쾌하게 하루 시작. (' + weather.label + ' 날씨의 영향)' }] },
      { label:'▶ 10분만 더... (스누즈)', type:'normal',
        effect: Object.assign({ stamina:5, time:10 }, weather.eff),
        result:[{ t:'story', m:'10분이 지나 겨우 일어났다.' }] },
      { label:'▶ 30분 더 잔다 (택시비 각오)', type:'bad',
        effect: Object.assign({ stamina:10, stress:8, time:30, money:-(e.econ.bus*10) }, weather.eff),
        result:[{ t:'bad', m:'지각할 것 같다. 택시를 잡았다. (-' + (e.econ.bus*10).toLocaleString() + '원)' }] },
    ];
    return { id:'wake', loc:'🏠 집 — 침실', ascii: ASCII[weather.id.toUpperCase()] || ASCII.SUNNY, desc: desc, choices: choices };
  },

  MORNING_PREP: function(p, e, weather) {
    var econ = e.econ;
    var desc = [{ t:'time',  m:'[ 07:00 AM ] 아침 준비 시간.' }];
    if (p.hasSpouse) desc.push({ t:'npc', m:'배우자: "밥 차려줄게, 먹고 가!"' });
    if (p.hasKid)    desc.push({ t:'npc', m:'아이: "아침밥은요?"' });

    var choices = [
      { label:'▶ 집밥 든든하게 먹는다', type:'normal', effect:{ stamina:20, time:25 }, result:[{ t:'good', m:'든든한 아침. 점심까지 버틸 수 있다.' }] },
      { label:'▶ 편의점 삼각김밥 (-' + Math.round(econ.jajangmyeon*0.3).toLocaleString() + '원)', type:'normal',
        effect:{ stamina:7, money:-Math.round(econ.jajangmyeon*0.3), time:5 },
        result:[{ t:'story', m:'편의점 삼각김밥 2개.' }] },
      { label:'▶ 굶고 나간다 (시간 없음)', type:'bad', effect:{ stamina:-10, stress:5 }, result:[{ t:'bad', m:'공복 출근. 점심까지 버텨야 한다.' }] },
    ];
    if (p.hasKid) {
      choices.push({ label:'▶ 아이 등교 챙겨주고 나간다', type:'family', effect:{ stamina:-3, time:20, rel_kid:8, flag:'goodParent' },
        result:[{ t:'relation', m:'아이: "아빠/엄마 사랑해!"' }, { t:'good', m:'좋은 부모 포인트 획득!' }] });
    }
    if (e.id === '1980') choices.push({ label:'▶ 새마을 라디오 체조한다', type:'normal', effect:{ stamina:10, stress:-5, time:10 }, result:[{ t:'good', m:'건강한 아침 체조.' }] });
    if (e.id === '2026') choices.push({ label:'▶ ChatGPT로 오늘 일정 요약받는다', type:'normal', effect:{ stress:-3, time:5, flag:'ai_user' }, result:[{ t:'good', m:'AI가 오늘 할 일을 정리해줬다.' }] });
    if (e.id === '2020') choices.push({ label:'▶ 마스크 착용 확인 후 출발', type:'normal', effect:{ stress:2 }, result:[{ t:'story', m:'마스크 없이는 건물에 못 들어간다.' }] });

    if (Math.random() > 0.5) {
      var act = getMorningActivity(weather);
      choices.push(act.choice);
    }
    return { id:'morning', loc:'🏠 집 — 주방', desc: desc, choices: choices };
  },

  REMOTE_START: function(p, e) {
    var econ = e.econ;
    var desc = [{ t:'time',  m:'[ 09:00 AM ] 재택근무 시작.' }, { t:'good',  m:'출퇴근 없음. 하지만 집이 사무실이 됐다.' }];
    if (e.id === '2020') desc.push({ t:'story', m:'코로나로 인한 강제 재택. 익숙해지는 중.' });
    return {
      id:'remote_start', loc:'🏠 재택근무 시작', desc: desc,
      choices:[
        { label:'▶ 업무 환경 세팅 후 시작', type:'normal', effect:{ stress:-3, stamina:3 }, result:[{ t:'good', m:'집에서 일하는 쾌적함. 오늘도 화이팅.' }] },
        { label:'▶ 잠옷 차림으로 노트북만 켠다', type:'normal', effect:{ stress:-5, stamina:5 }, result:[{ t:'story', m:'자유로운 재택. 집중력 유지가 관건이다.' }] },
        { label:'▶ 커피 한 잔 내리고 느긋하게 시작 (-' + econ.coffee.toLocaleString() + '원)', type:'normal',
          effect:{ stress:-4, stamina:4, money:-econ.coffee },
          result:[{ t:'story', m:'집에서 내린 커피. 여유로운 재택의 낭만.' }] },
      ]
    };
  },

  COMMUTE: function(p, e) {
    var min = p.home.commute;
    var econ = e.econ;
    var transitCost = min > 5 ? econ.bus : 0;
    var commuteStress = Math.floor(min / 15);
    var commuteStamina = -Math.floor(min / 12);

    var desc = [
      { t:'time',  m:'[ 07:40 AM ] 출근길. 목적지: ' + p.company.label },
      { t:'story', m:'통근 거리 ' + min + '분. ' + (min>=80 ? '장거리 출근의 피로감이 이미 느껴진다.' : min<=10 ? '직주근접의 여유!' : '오늘도 빠르게 이동한다.') },
    ];
    if (e.id === '1980') desc.push({ t:'system', m:'버스비 ' + econ.bus + '원. 지하철은 아직 일부 구간만.' });
    if (e.id === '2020') desc.push({ t:'bad', m:'마스크를 끼고 지하철을 탄다.' });

    var choices = [
      { label:'▶ 대중교통 탑승 (-' + transitCost.toLocaleString() + '원)', type:'normal',
        effect:{ stress:commuteStress, stamina:commuteStamina, money:-transitCost, time:min },
        result:[{ t:'story', m:min + '분 후 도착.' }] },
      { label:'▶ 택시 탑승 (-' + Math.round(min*econ.bus*0.5).toLocaleString() + '원, 빠름)', type:'money',
        effect:{ stress:Math.max(0,commuteStress-3), money:-Math.round(min*econ.bus*0.5), time:Math.floor(min*0.6) },
        result:[{ t:'money', m:'택시비 -' + Math.round(min*econ.bus*0.5).toLocaleString() + '원. 편하게 도착.' }] },
    ];
    if (min >= 30) {
      choices.push({ label:
        e.id==='1980' || e.id==='1997' ? '▶ 이동 중 존다' : '▶ 이동 중 업무 처리 (이메일/문서)',
        type:'normal',
        effect:{ stress:commuteStress+3, stamina:commuteStamina, money:-transitCost, time:min, flag:'diligent' },
        result:[{ t:'good', m: e.id==='1980' || e.id==='1997' ? '이동 중 단암. 컴퓨터도 폰도 없는 시대다.' : '이동 중에도 일을 했다. 효율적이다.' }] });
      choices.push({ label:'▶ 이어폰 끼고 팟캐스트/음악 듣는다', type:'normal',
        effect:{ stress:commuteStress-4, stamina:commuteStamina, money:-transitCost, time:min },
        result:[{ t:'good', m:'정신적 여유를 챙겼다.' }] });
    }

    var news = getNews(e.id);
    if (news) {
      // In this new architecture, we return one event. News can be a side-effect log or a separate slot.
      // But for simplicity in this refactor, we'll keep it as a desc line if needed, or handle it in the loop.
      // Actually, the loop handles it if it's a separate slot.
    }

    var ascii = (e.id === '1980') ? ASCII.BUS : ASCII.COMMUTE;
    return { id:'commute', loc:(e.id==='1980' ? '🚌' : '🚇') + ' 출근길 (' + min + '분)', ascii: ascii, desc: desc, choices: choices };
  },

  WORK_AM: function(p, e) {
    var econ = e.econ;
    var desc = [
      { t:'time',  m:'[ 09:00 AM ] 업무 시작. (' + e.name + ')' },
      { t:'story', m:'오늘 하루 업무를 시작한다.' },
    ];
    if (e.id==='1980') desc.push({ t:'system', m:'부장님: "정신 차리고 빠릿빠릿 하게 움직여!"' });
    if (e.id==='1997') desc.push({ t:'bad', m:'구조조정 소문이 오늘도 돌고 있다...' });
    if (e.id==='2026') desc.push({ t:'story', m:'ChatGPT로 초안 작업... AI 덕분에 빠르다.' });
    if (p.job.id==='dismissed') desc.push({ t:'bad', m:'오늘도 구직 사이트를 열었다. 연락이 없다.' });

    var choices = [
      { label:'▶ 집중 모드 (2시간 몰입)', type:'normal',
        effect:{ stress:8, stamina:-12, time:120, flag:'diligent', money: p.employType.id==='parttime' ? p.job.dailyPay*2 : 0 },
        result:[{ t:'good', m:'오전 업무 처리 완료. 효율적이었다.' }] },
      { label:'▶ 커피 먹고 천천히 시작 (-' + econ.coffee.toLocaleString() + '원)', type:'normal',
        effect:{ stress:3, stamina:5, money:-econ.coffee, time:130 },
        result:[{ t:'story', m:'커피로 정신을 차리고 시작했다.' }] },
      { label: e.id==='1980' ? '▶ 동료랑 잡담하다 오전이 감' :
               e.id==='1997' ? '▶ 삐삐 확인하고 공중전화 다니다가 감' :
               e.id==='2000' ? '▶ 버디버디/싸이월드 하다가 점심 됨' :
               e.id==='2010' ? '▶ 카카오톡/트위터 보다 오전이 증발' :
               '▶ 인스타/유튜브 쇼츠 보다 오전이 증발', type:'bad',
        effect:{ stress:-5, time:120 },
        result:[{ t:'bad', m: e.id==='1980' ? '잡담으로 오전이 날아갔다.' :
                               e.id==='1997' ? '삐삐 뚜뚜뚜... 공중전화 다니느라 오전이 갔다.' :
                               e.id==='2000' ? '싸이월드 방명록 달고 버디버디 채팅하다 시간이 갔다.' :
                               e.id==='2010' ? '카톡 단톡방이 울렸다. 답장하다 오전이 증발했다.' :
                               '알고리즘에 빠졌다. 쇼츠 10분이 1시간이 됐다.' }] },
      { label:'▶ 동료와 잡담하며 시간 보냄', type:'normal',
        effect:{ stress:-8, stamina:-3, time:120, flag:'socialLunch' },
        result:[{ t:'story', m:'수다로 시간이 날아갔다. 스트레스는 풀렸다.' }] },
    ];
    if (p.job.id==='selfemploy' || p.job.id==='restaurant') {
      choices.push({ label:'▶ 가게 마케팅/홍보에 집중', type:'money', effect:{ stress:10, stamina:-8, money:Math.floor(econ.wage*0.03), time:120 }, result:[{ t:'money', m:'마케팅 효과! 추가 매출 +' + Math.floor(econ.wage*0.03).toLocaleString() + '원' }] });
    }
    if (e.id==='1997' && p.job.id==='dismissed') {
      choices.push({ label:'▶ 오전 내내 취업 면접을 본다', type:'history', effect:{ stress:15, stamina:-10, time:180, flag:'job_hunt' }, result:[{ t:'story', m:'면접을 3개나 봤다. 지쳐도 계속해야 한다.' }] });
    }
    if (e.id==='2026') {
      choices.push({ label:'▶ AI 도구로 업무 자동화 세팅한다', type:'normal', effect:{ stress:-2, time:150, flag:'ai_user', money:20000 }, result:[{ t:'good', m:'AI 자동화 세팅 완료. 다음 주 업무가 줄어들 것이다.' }] });
    }

    var ascii = (e.id === '1980') ? ASCII.FACTORY : ASCII.WORKING;
    return { id:'morning_work', loc:'💼 ' + p.company.label, ascii: ascii, desc: desc, choices: choices };
  },

  LUNCH: function(p, e) {
    var econ = e.econ;
    var desc = [{ t:'time',  m:'[ 12:00 PM ] 점심 시간!' }];
    if (e.id==='1980') desc.push({ t:'system', m:'구내식당 밥값: ' + econ.jajangmyeon + '원' });
    if (e.id==='1997') desc.push({ t:'bad', m:'요즘 직장인들이 편의점 도시락으로 끼니를 해결한다.' });

    var choices = [
      { label:'▶ 동료들과 외식 (-' + econ.jajangmyeon.toLocaleString() + '원)', type:'normal',
        effect:{ stress:-10, stamina:15, money:-econ.jajangmyeon, time:60, flag:'socialLunch' },
        result:[ { t:'good', m:'맛있는 점심 + 수다로 오후 활력 충전!' }, { t:'npc', m:'동료: "요즘 팀장님 많이 예민하시지 않아요?" (뒷담화 시작)' } ] },
      { label:'▶ 혼밥 (-' + Math.round(econ.jajangmyeon*0.6).toLocaleString() + '원)', type:'normal', effect:{ stress:2, stamina:10, money:-Math.round(econ.jajangmyeon*0.6), time:30 }, result:[{ t:'story', m:'조용한 혼밥. 30분이 남는다.' }] },
      { label:'▶ 도시락 (절약!)', type:'money', effect:{ stress:-2, stamina:12 }, result:[{ t:'good', m:'준비해온 도시락. 건강하고 경제적!' }] },
      { label:'▶ 점심 건너뜀 (절약 + 다이어트)', type:'bad', effect:{ stress:5, stamina:-15 }, result:[{ t:'bad', m:'배가 고프다... 오후에 집중이 안 될 것 같다.' }] },
    ];
    if (e.id === '2020' || e.id === '2026') {
      choices.push({ label:'▶ 배달앱으로 시켜먹기 (-' + Math.round(econ.jajangmyeon*1.4).toLocaleString() + '원)', type:'normal', effect:{ stress:-3, stamina:12, money:-Math.round(econ.jajangmyeon*1.4), time:40 }, result:[{ t:'story', m:'배달앱 클릭 한 번에 배달. -' + Math.round(econ.jajangmyeon*1.4).toLocaleString() + '원' }] });
    } else if (e.id === '2010') {
      choices.push({ label:'▶ 전화로 배달 시켜먹기 (-' + Math.round(econ.jajangmyeon*1.3).toLocaleString() + '원)', type:'normal', effect:{ stress:-2, stamina:11, money:-Math.round(econ.jajangmyeon*1.3), time:40 }, result:[{ t:'story', m:'전화 배달. 배달앱은 아직 생소하다.' }] });
    } else if (e.id === '1997' || e.id === '2000') {
      choices.push({ label:'▶ 전화로 짜장면 배달 (-' + Math.round(econ.jajangmyeon*1.2).toLocaleString() + '원)', type:'normal', effect:{ stress:-2, stamina:11, money:-Math.round(econ.jajangmyeon*1.2), time:40 }, result:[{ t:'story', m:'전화로 야... (5분 뒤) 배달직 아저씨가 온다!' }] });
    }
    if (e.id==='1980') {
      choices.push({ label:'▶ 구내식당 정식 먹는다', type:'normal', effect:{ stamina:18, money:-econ.jajangmyeon, stress:-5, time:30 }, result:[{ t:'good', m:'구내식당 따끈한 정식.' }] });
    }
    if (e.id==='2020') {
      choices.push({ label:'▶ [코로나] 칸막이 혼밥 식당', type:'normal', effect:{ stamina:10, money:-econ.jajangmyeon, stress:5, time:30 }, result:[{ t:'story', m:'칸막이 설치된 식당.' }] });
    }
    return { id:'lunch', loc:'🍱 점심 시간', ascii: ASCII.LUNCH, desc: desc, choices: choices };
  },

  WORK_PM: function(p, e) {
    var econ = e.econ;
    var desc = [{ t:'time',  m:'[ 02:00 PM ] 점심 식곤증과 싸우는 오후.' }];
    if (e.id==='1997') desc.push({ t:'bad', m:'오늘 구조조정 명단이 또 나왔다는 소문이 돈다.' });
    if (e.id==='2026') desc.push({ t:'story', m:'AI 리포트 초안이 나왔다. 내가 할 일이 줄고 있다...' });
    if (e.id==='2020') desc.push({ t:'story', m:'오후 화상회의 3개. 실제 회의보다 피곤하다.' });

    var choices = [
      { label:'▶ 집중 업무 처리', type:'normal',
        effect:{ stress:8, stamina:-12, time:90, flag:'diligent', money: p.employType.id==='parttime' ? Math.floor(p.job.dailyPay*1.5) : 0 },
        result:[{ t:'good', m:'오후 업무 완수. 퇴근이 가까워진다.' }] },
      { label:'▶ 졸음과 싸우며 겨우 버틴다', type:'bad', effect:{ stress:5, stamina:-8, time:90 }, result:[{ t:'bad', m:'극도의 졸음. 어떻게든 버텼다.' }] },
      { label:'▶ 화장실 10분 쉬는 타임', type:'normal', effect:{ stress:-5, stamina:5, time:100 }, result:[{ t:'inner', m:'\'화장실이 유일한 안식처...\'' }] },
      { label:'▶ 아메리카노로 버팀 (-' + econ.coffee.toLocaleString() + '원)', type:'normal', effect:{ stress:-3, stamina:8, money:-econ.coffee, time:95 }, result:[{ t:'story', m:'카페인으로 졸음을 이겼다.' }] },
      { label:'▶ 팀장한테 잘 보이려고 적극적으로 일한다', type:'normal', effect:{ stress:12, stamina:-15, time:90, flag:'diligent', money:30000 }, result:[{ t:'good', m:'팀장의 눈에 띄었다. "수고해요" 한 마디가 힘이 된다.' }] },
    ];
    return { id:'afternoon_work', loc:'💼 오후 업무', desc: desc, choices: choices };
  },

  LEAVE: function(p, e) {
    var econ = e.econ;
    var desc = [{ t:'time',  m:'[ 06:00 PM ] 퇴근 시간이다!' }];
    if (e.id==='1980') desc.push({ t:'system', m:'부장님이 아직 자리에 있다...' });
    if (e.id==='1997') desc.push({ t:'bad', m:'오늘도 살아남았다. 내일은 어떨지 모른다.' });
    if (e.id==='2010') desc.push({ t:'bad', m:'카카오톡에 메시지가 왔다. 퇴근 전 업무 요청인가...' });

    var choices = [
      { label:'▶ 칼퇴근 (6시 정각)', type:'normal', effect:{ stress:-5, money: p.employType.id==='parttime' ? Math.floor(p.job.dailyPay*2) : 0 }, result:[{ t:'good', m:'칼퇴! 자유다!!!' }] },
      { label:'▶ 30분 눈치 보다 퇴근', type:'bad', effect:{ stress:8, stamina:-5, time:30 }, result:[{ t:'story', m:'30분 눈치 추가. 피곤하다.' }] },
      { label:'▶ 야근 2시간 (+' + Math.round(p.job.dailyPay*0.5).toLocaleString() + '원)', type:'money',
        effect:{ stress:18, stamina:-15, time:120, flag:'overtime', money: Math.round(p.job.dailyPay*0.5) },
        result:[ { t:'bad', m:'야근 시작...' }, { t:'money', m:'야근수당 +' + Math.round(p.job.dailyPay*0.5).toLocaleString() + '원' } ] },
      { label:'▶ 퇴근 전 동료와 커피 (-' + econ.coffee.toLocaleString() + '원)', type:'normal', effect:{ stress:-8, money:-econ.coffee, time:20 }, result:[{ t:'good', m:'퇴근 전 커피 타임. 소소한 행복.' }] },
      { label:'▶ 내일 일거리를 미리 정리하고 퇴근', type:'normal', effect:{ stress:3, stamina:-5, time:30, flag:'diligent' }, result:[{ t:'good', m:'내일 아침이 편해질 것이다.' }] },
    ];
    return { id:'leave', loc:'💼 퇴근 시간', desc: desc, choices: choices };
  },

  GO_HOME: function(p, e) {
    var min = p.home.commute;
    var econ = e.econ;
    var desc = [{ t:'time', m:'[ 06:30 PM ] 퇴근길. 집까지 ' + min + '분.' }];
    if (min >= 60) desc.push({ t:'bad', m:'오늘도 긴 귀갓길이 기다린다.' });

    var choices = [
      { label:'▶ 바로 귀가', type:'normal', effect:{ stamina:-Math.floor(min/12), stress:3, money:-econ.bus, time:min }, result:[{ t:'story', m:min + '분 후 귀가.' }] },
      { label:'▶ 마트에서 장 보고 간다 (-' + Math.round(econ.jajangmyeon*3.5).toLocaleString() + '원)', type:'family',
        effect:{ stamina:-8, money:-Math.round(econ.jajangmyeon*3.5), time:min+30, rel_sp:6 },
        result:[ { t:'money', m:'장 봤다. -' + Math.round(econ.jajangmyeon*3.5).toLocaleString() + '원' } ].concat(p.hasSpouse ? [{ t:'relation', m:'배우자가 좋아한다.' }] : []) },
      { label:'▶ 헬스장 들렀다 간다 (-' + Math.round(econ.coffee*1.5).toLocaleString() + '원)', type:'normal', effect:{ stress:-12, stamina:15, money:-Math.round(econ.coffee*1.5), time:min+70 }, result:[{ t:'good', m:'운동으로 스트레스 해소!' }] },
      { label:'▶ 동료들과 술 한 잔 (-' + Math.round(econ.jajangmyeon*3).toLocaleString() + '원)', type:'normal',
        effect:{ stress:-18, stamina:-12, money:-Math.round(econ.jajangmyeon*3), time:min+90, rel_sp: p.hasSpouse ? -5 : 0 },
        result:[ { t:'good', m:'시원한 맥주 한 잔. -' + Math.round(econ.jajangmyeon*3).toLocaleString() + '원' } ].concat(p.hasSpouse ? [{ t:'bad', m:'귀가가 늦어진다.' }] : []) },
    ];
    if (e.id === '2020' || e.id === '2026') choices.push({ label:'▶ 당근마켓 직거래 (+30,000원)', type:'money', effect:{ money:30000, time:min+20, stamina:-3 }, result:[{ t:'money', m:'당근 거래 완료! +30,000원' }] });
    if (e.id === '1997') choices.push({ label:'▶ 금 모으기 운동 참여 후 귀가', type:'history', effect:{ money:-50000, stress:-3, flag:'patriot', time:min+30 }, result:[{ t:'history', m:'금 헌납 참여. 나라를 위해...' }] });

    return { id:'go_home', loc:'🚇 퇴근길', desc: desc, choices: choices };
  },

  CHORES: function(p, e) {
    var econ = e.econ;
    var desc = [{ t:'time',  m:'[ 07:30 PM ] 집에 도착했다.' }, { t:'story', m:'소파에 쓰러지고 싶다. 하지만 집안일이 기다린다.' }];
    if (p.hasSpouse) desc.push({ t:'npc', m:'배우자: "왔어? 집안일 좀 도와줄 수 있어?"' });

    var choices = [
      { label:'▶ 설거지 + 빨래 처리', type:'family', effect:{ stamina:-8, time:35, rel_sp:12, choreDone:['dishes','laundry'] }, result:[ { t:'good', m:'설거지 + 빨래 완료!' } ].concat(p.hasSpouse ? [{ t:'relation', m:'배우자 친밀도 +12' }] : []) },
      { label:'▶ 저녁 요리를 직접 한다', type:'family', effect:{ stamina:-10, time:45, money:-Math.floor(econ.jajangmyeon*1.5), rel_sp:15, rel_kid:8, choreDone:['cook'] }, result:[ { t:'good', m:'집밥 완성! 가족이 행복해한다.' }, { t:'relation', m:'가족 관계 크게 상승!' } ] },
      { label:'▶ 일단 쉰다... (피곤)', type:'bad', effect:{ stamina:10, stress:-5, rel_sp:-5, chorePending:['dishes','laundry'] }, result:[{ t:'bad', m:'집안일을 미뤘다. 배우자의 한숨 소리...' }] },
    ];
    return { id:'chores', loc:'🏠 집 — 귀가 후', ascii: ASCII.CHORES, desc: desc, choices: choices };
  },

  NIGHT: function(p, e) {
    var econ = e.econ;
    var desc = [{ t:'time',  m:'[ 10:00 PM ] 하루가 끝나간다.' }, { t:'story', m:'오늘 하루를 어떻게 마무리할까?' }];
    var choices = [
      { label:'▶ 일찍 잠든다 (숙면)', type:'normal', effect:{ stamina:25, stress:-8, flag:'earlyBed' }, result:[{ t:'good', m:'현명한 선택. 내일을 위한 충전!' }] },
      { label: e.id==='1980' ? '▶ TV 연속극 보다 잔다' :
               e.id==='1997' ? '▶ 비디오 빌려와서 보다 잔다' :
               e.id==='2000' ? '▶ 싸이월드 꾸미고 버디버디 하다가 잔다' :
               e.id==='2010' ? '▶ 카카오톡/트위터 보다가 잔다' :
               '▶ 넷플릭스/유튜브 보다 잔다', type:'normal',
        effect:{ stress:-15, stamina:-5 },
        result:[{ t:'story', m: e.id==='1980' ? '주말의 명화... 밤이 깊어간다.' :
                                 e.id==='1997' ? '비디오 한 편. 현실을 잊었다.' :
                                 e.id==='2000' ? '싸이월드 방명록 달고 잔다.' :
                                 e.id==='2010' ? '카톡 보다가 새벽 1시.' :
                                 '알고리즘에 빠졌다.' }] },
      { label:'▶ 가벼운 스트레칭 후 취침', type:'normal', effect:{ stamina:15, stress:-5 }, result:[{ t:'good', m:'몸이 한결 가볍다. 좋은 밤.' }] },
    ];
    if (p.hasSpouse) choices.push({ label:'▶ 배우자와 오늘 하루 이야기 나눈다', type:'family', effect:{ stress:-18, rel_sp:12, time:45 }, result:[ { t:'npc', m:'배우자: "오늘도 수고했어."' }, { t:'relation', m:'서로의 하루를 공유한 소중한 시간.' } ] });
    if (p.hasKid) choices.push({ label:'▶ 아이에게 책 읽어준다', type:'family', effect:{ stress:-10, rel_kid:15, stamina:-3, time:30, flag:'goodParent' }, result:[ { t:'npc', m:'아이: "또 읽어줘! 더 읽어줘~"' }, { t:'relation', m:'아이와의 소중한 시간.' } ] });
    if (e.id==='1980') choices.push({ label:'▶ TV 앞에서 가족 모두 9시 뉴스를 본다', type:'family', effect:{ stress:-8, rel_sp:5, rel_kid:5 }, result:[{ t:'good', m:'TV 뉴스 앞에 온 가족이 모인다.' }] });
    if (e.id==='2026') choices.push({ label:'▶ AI로 내일 계획을 짜본다', type:'normal', effect:{ stress:-5, flag:'ai_planner' }, result:[{ t:'good', m:'AI가 내일 스케줄을 최적화해줬다.' }] });

    return { id:'night', loc:'🏠 취침 전', ascii: ASCII.HOME_EVENING, desc: desc, choices: choices };
  },
};

function getRandomFromPool(key, p, e) {
  var pool = [];
  if (key === 'COMMUTE_RANDOM') return getCommuteRandomEvent(p, e, p.home.commute);
  if (key === 'MORNING_RANDOM') pool = getMorningPool(p, e);
  if (key === 'AFTERNOON_RANDOM') pool = getAfternoonPool(p, e);
  if (key === 'FAMILY_RANDOM') pool = getFamilyPool(p, e);
  if (key === 'INCOME_RANDOM') pool = getIncomePool(p, e);
  if (key === 'WILDCARD') pool = WILDCARD_POOL;
  if (pool.length === 0) return null;
  var item = pool[Math.floor(Math.random() * pool.length)];
  if (item.title && !item.desc) {
    return { id:'pool_ev', loc: item.loc || '⚡ 이벤트', desc: [{ t:'event', m:'⚡ ' + item.title }].concat(item.descLines || []), choices: item.choices, ascii: item.ascii };
  }
  return item;
}

function getCommuteRandomEvent(p, e, min) {
  var econ = e.econ;
  var eraId = e.id;
  var pool = [
    { title: '⚡ 지하철 연착', desc: [{ t:'bad', m:'지하철이 연착됐다! 신호 장애.' }],
      choices: [
        { label:'▶ 기다린다', type:'bad', effect:{ stress:8, time:12 }, result:[{ t:'bad', m:'12분 지연.' }] },
        { label:'▶ 버스로 우회', type:'normal', effect:{ stress:5, money:-econ.bus, time:8 }, result:[{ t:'story', m:'버스로 갔다.' }] },
      ]
    },
    { title: '☕ 커피 1+1 행사!', desc: [{ t:'event', m:'편의점에서 커피 1+1 행사 중! 아메리카노 ' + econ.coffee.toLocaleString() + '원.' }],
      choices: [
        { label:'▶ 2잔 산다 (1잔은 동료 선물)', type:'money', effect:{ stress:-5, stamina:8, money:-econ.coffee, time:5, flag:'kind' }, result:[{ t:'good', m:'동료 커피까지 챙겼다.' }] },
        { label:'▶ 내 것만 1잔', type:'normal', effect:{ stress:-3, stamina:6, money:-econ.coffee, time:5 }, result:[{ t:'story', m:'커피 한 잔.' }] },
        { label:'▶ 지나친다 (절약)', type:'normal', effect:{ stress:2 }, result:[{ t:'inner', m:'\'참아야 해...\'' }] },
      ]
    },
    { title: '👜 길에서 지갑 발견', desc: [{ t:'event', m:'지갑이 떨어져 있다.' }],
      choices: [
        { label:'▶ 경찰서 신고', type:'normal', effect:{ stress:3, time:15, flag:'honest' }, result:[{ t:'good', m:'양심적인 행동.' }] },
        { label:'▶ 모른 척 지나간다', type:'bad', effect:{ stress:5 }, result:[{ t:'inner', m:'찜찜한 하루 시작.' }] },
      ]
    },
    { title: '🌧️ 갑자기 비가 온다', desc: [{ t:'bad', m:'예보 없이 비가 쏟아진다!' }],
      choices: [
        { label:'▶ 편의점 우산 산다 (-' + Math.round(econ.coffee*0.8).toLocaleString() + '원)', type:'money', effect:{ money:-Math.round(econ.coffee*0.8), stress:3 }, result:[{ t:'story', m:'우산 구입 완료.' }] },
        { label:'▶ 그냥 뛰어간다', type:'bad', effect:{ stress:10, stamina:-8 }, result:[{ t:'bad', m:'흠뻑 젖었다.' }] },
        { label:'▶ 비 그치길 기다린다 (+10분)', type:'normal', effect:{ stress:5, time:10 }, result:[{ t:'story', m:'잠깐 기다렸다.' }] },
      ]
    }
  ];

  if (eraId === '1980') {
    pool.push({ title: '🚌 버스가 초만원', desc: [{ t:'bad', m:'아침 버스가 사람으로 꽉 찼다.' }],
      choices: [
        { label:'▶ 억지로 탄다', type:'bad', effect:{ stress:10, stamina:-5, money:-econ.bus, time:min }, result:[{ t:'bad', m:'꼼짝 못 하고 도착했다.' }] },
        { label:'▶ 다음 버스 기다린다 (+15분)', type:'normal', effect:{ stress:5, money:-econ.bus, time:min+15 }, result:[{ t:'story', m:'여유롭게 다음 버스에 탔다.' }] },
      ]
    });
  }
  if (eraId === '2026') {
    pool.push({ title: '🚇 GTX 앱 오류', desc: [{ t:'bad', m:'앱에서 GTX 예약 오류가 났다.' }],
      choices: [
        { label:'▶ 고객센터에 전화한다 (+20분)', type:'bad', effect:{ stress:15, time:20 }, result:[{ t:'bad', m:'연결까지 20분.' }] },
        { label:'▶ 일반 전철로 우회한다', type:'normal', effect:{ stress:8, money:-econ.bus, time:30 }, result:[{ t:'story', m:'돌아가는 길.' }] },
      ]
    });
  }

  var item = pool[Math.floor(Math.random() * pool.length)];
  return { id:'comm_ev', loc:'🚇 출근길 — 돌발', desc:[{ t:'time', m:'[ 08:10 AM ] 출근길 돌발 상황!' }].concat(item.desc), choices:item.choices };
}


function getMorningPool(p, e) {
  var econ = e.econ;
  var pool = [];

  pool.push({
    title:'📊 주식 알림',
    descLines: [{ t:'story', m:'보유 주식이 움직였다...' }],
    choices:[
      { label:'▶ 매도한다 (+20만원)', type:'money', effect:{ money:200000, stress:-3, flag:'stockProfit' }, result:[{ t:'money', m:'주식 매도 +200,000원!' }] },
      { label:'▶ 존버한다', type:'normal', effect:{ stress:5 }, result:[{ t:'inner', m:'\'더 오를 거야...\'' }] },
      { label:'▶ 추가 매수한다 (-20만원)', type:'bad', effect:{ money:-200000, stress:8, flag:'hasStock' }, result:[{ t:'money', m:'물타기 -200,000원.' }] },
    ]
  });

  pool.push({
    title:'🪙 코인 단톡 알림',
    descLines: [{ t:'npc', m:'친구: "야 이거 지금 진짜 올라가고 있어! 빨리 사!"' }],
    choices:[
      { label:'▶ 5만원 소액 투자', type:'money', effect:{ money:-50000, stress:3, flag:'hasCrypto' }, result:[{ t:'money', m:'코인 소액 투자 -50,000원.' }] },
      { label:'▶ 무시한다', type:'normal', effect:{ stress:-2 }, result:[{ t:'good', m:'현명한 판단. 지인 코인은 노.' }] },
    ]
  });

  // 중고거래 플랫폼: 시대별 분기
  if (e.id === '2020' || e.id === '2026') {
    pool.push({
      title:'📦 당근마켓 문의',
      descLines: [{ t:'story', m:'중고 거래 문의가 왔다.' }],
      choices:[
        { label:'▶ 오늘 직거래 (+45,000원)', type:'money', effect:{ money:45000, time:20 }, result:[{ t:'money', m:'당근 거래 +45,000원!' }] },
        { label:'▶ 내일로 미룬다', type:'normal', effect:{}, result:[{ t:'story', m:'내일 하기로 했다.' }] },
      ]
    });
  } else if (e.id === '2010') {
    pool.push({
      title:'💻 중고나라 직거래 문의',
      descLines: [{ t:'story', m:'중고나라 쪽지가 왔다.' }],
      choices:[
        { label:'▶ 직거래 진행 (+35,000원)', type:'money', effect:{ money:35000, time:25 }, result:[{ t:'money', m:'중고나라 거래 +35,000원!' }] },
        { label:'▶ 내일로 미룬다', type:'normal', effect:{}, result:[{ t:'story', m:'내일 하기로 했다.' }] },
      ]
    });
  } else if (e.id === '2000') {
    pool.push({
      title:'💻 네이버 카페 중고거래',
      descLines: [{ t:'story', m:'인터넷 카페에 올린 물건 문의가 왔다.' }],
      choices:[
        { label:'▶ 거래 진행 (+25,000원)', type:'money', effect:{ money:25000, time:30 }, result:[{ t:'money', m:'인터넷 중고거래 +25,000원!' }] },
        { label:'▶ 거절한다', type:'normal', effect:{}, result:[{ t:'story', m:'다음에 하기로 했다.' }] },
      ]
    });
  }

  pool.push({
    title:'☎️ 갑작스러운 보험 전화',
    descLines: [{ t:'npc', m:'모르는 번호: "고객님 잠깐 시간 괜찮으세요? 보험 관련해서..."' }],
    choices:[
      { label:'▶ 바로 끊는다', type:'normal', effect:{ stress:-1 }, result:[{ t:'good', m:'단호하게 끊었다. 시간 낭비 방지.' }] },
      { label:'▶ 들어보다 20분 낭비', type:'bad', effect:{ stress:8, time:20 }, result:[{ t:'bad', m:'20분을 날렸다...' }] },
    ]
  });

  if (e.id === '1980') {
    pool.push({
      title:'🏭 특근 제안 (일요일 근무)',
      descLines: [{ t:'npc', m:'반장: "이번 주 일요일에 특근 나올 수 있어? 수당 나와."' }],
      choices:[
        { label:'▶ 특근 한다 (+수당)', type:'money', effect:{ stress:10, stamina:-10, money:Math.floor(e.econ.wage*0.05) }, result:[{ t:'money', m:'특근 수당 +' + Math.floor(e.econ.wage*0.05).toLocaleString() + '원' }] },
        { label:'▶ 거절한다', type:'normal', effect:{ stress:5 }, result:[{ t:'story', m:'일요일만큼은 쉬고 싶다.' }] },
      ]
    });
  }

  if (e.id === '1997') {
    pool.push({
      title:'💥 구조조정 명단 소문',
      descLines: [{ t:'bad', m:'동료: "이번에 A팀 3명 나간대... 우리 팀은 괜찮을까?"' }],
      choices:[
        { label:'▶ 팀장에게 직접 확인한다', type:'history', effect:{ stress:12, flag:'confirmed_safe' }, result:[{ t:'story', m:'팀장: "아직 결정된 건 없어요." (표정이 어둡다)' }] },
        { label:'▶ 이직을 알아본다', type:'normal', effect:{ stress:8, flag:'job_hunt' }, result:[{ t:'story', m:'잡코리아를 몰래 열었다.' }] },
        { label:'▶ 무시하고 열심히 일한다', type:'normal', effect:{ stress:5, flag:'diligent' }, result:[{ t:'good', m:'실력으로 증명하자.' }] },
      ]
    });
    pool.push({
      title:'🥇 동료가 금 모으기 운동 이야기를 한다',
      descLines: [{ t:'npc', m:'동료: "나 오늘 금반지 헌납하고 왔어. 나라를 위해서."' }],
      choices:[
        { label:'▶ 나도 동참하기로 한다', type:'history', effect:{ stress:-3, flag:'patriot' }, result:[{ t:'history', m:'나라를 위한 작은 실천. 마음이 뿌듯하다.' }] },
        { label:'▶ 공감하며 듣는다', type:'normal', effect:{ stress:-2 }, result:[{ t:'story', m:'시대의 무게를 느낀다.' }] },
      ]
    });
  }

  if (e.id === '2026') {
    pool.push({
      title:'🤖 AI가 내 업무 초안을 완성했다',
      descLines: [{ t:'story', m:'GPT가 보고서 초안을 5분 만에 완성했다...' }],
      choices:[
        { label:'▶ AI 초안을 다듬어서 제출한다', type:'normal', effect:{ stress:-5, stamina:5, flag:'ai_user' }, result:[{ t:'good', m:'30분 걸릴 일을 10분에 끝냈다.' }] },
        { label:'▶ 직접 다 쓴다 (AI 안 믿음)', type:'bad', effect:{ stress:8, stamina:-10 }, result:[{ t:'bad', m:'2시간 걸렸다. 뭐가 맞는 건지 모르겠다.' }] },
      ]
    });
    pool.push({
      title:'💼 헤드헌터 연락',
      descLines: [{ t:'npc', m:'헤드헌터: "혹시 이직 생각 있으신가요? 연봉 30% 인상 포지션인데요."' }],
      choices:[
        { label:'▶ 관심 있게 듣는다', type:'money', effect:{ stress:-2, flag:'career_pivot' }, result:[{ t:'good', m:'이직을 진지하게 고민해볼 수 있다.' }] },
        { label:'▶ 거절한다', type:'normal', effect:{}, result:[{ t:'story', m:'지금 회사가 더 편하다.' }] },
      ]
    });
  }

  if (e.id === '2000') {
    pool.push({
      title:'💰 코스닥 종목 추천',
      descLines: [{ t:'npc', m:'동료: "이 닷컴 회사 주식 지금 사면 대박날 거야!"' }],
      choices:[
        { label:'▶ 100만원 투자한다', type:'bad', effect:{ money:-1000000, stress:10, flag:'hasStock' }, result:[{ t:'bad', m:'투자했다... 과연 대박이 날까?' }] },
        { label:'▶ 무시한다', type:'normal', effect:{ stress:-2 }, result:[{ t:'good', m:'닷컴 버블은 언젠가 꺼진다는 걸 안다.' }] },
      ]
    });
  }

  return pool;
}

// ── 오후 이벤트 풀 ──────────────────────────────────
function getAfternoonPool(p, e) {
  var econ = e.econ;
  var pool = [];

  pool.push({
    title:'🗣️ 갑작스러운 회의 소집',
    descLines: [{ t:'npc', m:'팀장: "다들 회의실로! 긴급 사항이에요."' }],
    choices:[
      { label:'▶ 적극 참여하고 의견 낸다', type:'normal', effect:{ stress:8, stamina:-8, time:90, flag:'diligent' }, result:[{ t:'good', m:'팀장에게 좋은 인상을 남겼다.' }] },
      { label:'▶ 조용히 앉아 끄덕인다', type:'normal', effect:{ stress:3, time:90 }, result:[{ t:'inner', m:'\'이 회의... 이메일로 충분했는데.\'' }] },
      { label:'▶ 회의 중 폰 보다가 걸렸다', type:'bad', effect:{ stress:20, time:90 }, result:[{ t:'bad', m:'팀장: "지금 폰 보시는 거예요?" 어색한 침묵.' }] },
      { label:'▶ 날카로운 질문으로 존재감을 드러낸다', type:'normal', effect:{ stress:6, time:90, flag:'diligent', money:10000 }, result:[{ t:'good', m:'팀장이 눈여겨봤다. 다음 프로젝트 참여 가능성이 올라간다.' }] },
    ]
  });

  pool.push({
    title:'☕ 간식 타임! (+힐링)',
    descLines: [{ t:'event', m:'회사에서 간식이 올라왔다. 도넛과 커피!' }],
    choices:[
      { label:'▶ 먹는다 (당연하지)', type:'normal', effect:{ stress:-8, stamina:10, time:10 }, result:[{ t:'good', m:'달달한 도넛. 오후가 버텨진다.' }] },
      { label:'▶ 다이어트 중... 패스', type:'bad', effect:{ stress:5 }, result:[{ t:'inner', m:'\'참아야 해...\' 하지만 눈은 도넛을 향한다.' }] },
      { label:'▶ 동료 몫까지 가져온다', type:'normal', effect:{ stress:-10, stamina:10, time:10, flag:'kind' }, result:[{ t:'good', m:'동료들이 고마워한다.' }] },
    ]
  });

  pool.push({
    title:'💰 연봉 협상 기회',
    descLines: [{ t:'npc', m:'인사팀: "연봉 조정 희망 사항 있으시면 말씀해주세요."' }],
    choices:[
      { label:'▶ 강하게 인상 요구한다', type:'money', effect:{ stress:8, money:500000 }, result:[{ t:'money', m:'용기 있게 요구했다. 검토해준다고 한다.' }] },
      { label:'▶ 적당히 요구한다', type:'normal', effect:{ stress:3, money:200000 }, result:[{ t:'good', m:'합리적인 요구. 기분 좋게 마무리.' }] },
      { label:'▶ 아무 말도 못 한다', type:'bad', effect:{ stress:5 }, result:[{ t:'bad', m:'또 말 못 했다. 후회가 남는다.' }] },
    ]
  });

  pool.push({
    title:'🖨️ 복사기/프린터 고장',
    descLines: [{ t:'bad', m:'중요한 자료를 출력해야 하는데 기계가 먹통이다.' }],
    choices:[
      { label:'▶ 직접 고쳐본다 (+15분)', type:'normal', effect:{ stress:10, stamina:-5, time:15 }, result:[{ t:'story', m:'어찌어찌 고쳤다. 의외로 뿌듯하다.' }] },
      { label:'▶ IT팀 부른다 (+30분)', type:'normal', effect:{ stress:5, time:30 }, result:[{ t:'story', m:'IT팀이 와서 고쳤다. 기다리는 30분이 지루했다.' }] },
      { label:'▶ 근처 인쇄소 간다 (-' + Math.round(econ.coffee*0.3).toLocaleString() + '원)', type:'money', effect:{ stress:8, money:-Math.round(econ.coffee*0.3), time:20 }, result:[{ t:'money', m:'인쇄소 다녀왔다. 빠르게 해결.' }] },
    ]
  });

  if (e.id === '1997') {
    pool.push({
      title:'💸 월급이 삭감됐다!',
      descLines: [{ t:'bad', m:'인사팀: "어려운 상황으로 인해 이번 달부터 급여 10% 삭감됩니다."' }],
      choices:[
        { label:'▶ 그래도 잘린 것보다 낫다 (수용)', type:'history', effect:{ stress:15, money:-Math.floor(e.econ.wage*0.1) }, result:[{ t:'bad', m:'급여가 줄었다. 생활비를 줄여야 한다.' }] },
        { label:'▶ 노조에 신고한다', type:'bad', effect:{ stress:20, flag:'union_report' }, result:[{ t:'story', m:'노조에 신고했다. 팀장의 눈치가 차가워졌다.' }] },
      ]
    });
  }

  if (e.id === '2020') {
    pool.push({
      title:'🦠 코로나 확진자 발생!',
      descLines: [{ t:'bad', m:'문자: "사무실 내 확진자가 발생하여 전 직원 자가격리 안내드립니다."' }],
      choices:[
        { label:'▶ 즉시 귀가하고 자가격리', type:'history', effect:{ stress:20, stamina:-5, flag:'covid_isolated' }, result:[{ t:'bad', m:'자가격리... 재택으로 업무를 처리해야 한다.' }] },
        { label:'▶ 검사 받고 결과 기다린다', type:'normal', effect:{ stress:15 }, result:[{ t:'story', m:'PCR 검사를 받았다. 결과까지 불안하다.' }] },
      ]
    });
  }

  if (e.id === '2010') {
    pool.push({
      title:'📱 퇴근 전 팀장 카톡',
      descLines: [{ t:'npc', m:'팀장: "오늘 퇴근 전까지 자료 수정 가능할까요?" ' }],
      choices:[
        { label:'▶ "네, 하겠습니다" (야근)', type:'bad', effect:{ stress:18, stamina:-12, money:50000, time:90, flag:'overtime' }, result:[{ t:'bad', m:'2시간 추가 야근. 오늘도 늦게 귀가한다.' }] },
        { label:'▶ 읽씹한다', type:'normal', effect:{ stress:8 }, result:[{ t:'inner', m:'\'내일 핑계를 생각해야지...\'' }] },
        { label:'▶ "근무 외 시간입니다" 거절', type:'history', effect:{ stress:12, flag:'wlb' }, result:[{ t:'good', m:'용기 있게 경계선을 그었다. 하지만 팀장 눈치가...' }] },
      ]
    });
  }

  if (e.id === '2026') {
    pool.push({
      title:'🤖 AI가 내 직무 보고서를 작성했다',
      descLines: [{ t:'story', m:'회사 AI 시스템이 내 업무 성과를 자동 분석했다.' }],
      choices:[
        { label:'▶ AI 보고서를 검토하고 보완한다', type:'normal', effect:{ stress:-3, flag:'ai_skilled' }, result:[{ t:'good', m:'AI와 협업하는 능력. 이게 미래 경쟁력이다.' }] },
        { label:'▶ 불쾌하다. AI한테 평가받고 싶지 않다', type:'bad', effect:{ stress:12, flag:'ai_resistant' }, result:[{ t:'bad', m:'하지만 현실을 외면할 수는 없다.' }] },
      ]
    });
  }

  return pool;
}

// ── 가족 이벤트 풀 ──────────────────────────────────
function getFamilyPool(p, e) {
  var econ = e.econ;
  var pool = [];

  if (p.hasSpouse) {
    pool.push({
      title:'💬 배우자와의 대화',
      descLines: [{ t:'npc', m:'배우자: "오늘 어땠어? 이야기 해줘."' }],
      choices:[
        { label:'▶ 집중해서 들어준다 (30분)', type:'family', effect:{ rel_sp:15, stress:-8, stamina:-3, time:30 },
          result:[{ t:'relation', m:'배우자와의 관계가 좋아졌다.' }, { t:'npc', m:'배우자: "당신이 제일 잘 들어줘. 힘이 돼."' }] },
        { label:'▶ 폰 보면서 "응응"', type:'bad', effect:{ rel_sp:-8, stress:-3 },
          result:[{ t:'bad', m:'배우자: "...됐어. 당신은 항상 그래." (표정이 굳는다)' }] },
        { label:'▶ 나도 힘들었다고 털어놓는다', type:'family', effect:{ rel_sp:10, stress:-15, time:45 },
          result:[{ t:'relation', m:'서로를 이해하는 시간이 됐다.' }] },
      ]
    });

    pool.push({
      title:'💑 배우자: "우리 오랜만에 밥 먹으러 가자"',
      descLines: [{ t:'npc', m:'배우자: "오늘 오랜만에 둘이 나가서 밥 먹을까?"' }],
      choices:[
        { label:'▶ 근사한 레스토랑 간다 (-' + Math.round(econ.jajangmyeon*10).toLocaleString() + '원)', type:'family', effect:{ rel_sp:25, money:-Math.round(econ.jajangmyeon*10), stress:-15 },
          result:[{ t:'relation', m:'로맨틱한 데이트. 관계가 크게 좋아졌다!' }] },
        { label:'▶ 동네 식당 (-' + Math.round(econ.jajangmyeon*3).toLocaleString() + '원)', type:'family', effect:{ rel_sp:15, money:-Math.round(econ.jajangmyeon*3), stress:-10 },
          result:[{ t:'good', m:'소박하지만 함께하는 시간이 소중하다.' }] },
        { label:'▶ "피곤해" 거절한다', type:'bad', effect:{ rel_sp:-12, stress:-5 },
          result:[{ t:'bad', m:'배우자가 실망한 표정으로 혼자 나갔다...' }] },
        { label:'▶ 집에서 요리해준다 (-' + Math.round(econ.jajangmyeon*1.5).toLocaleString() + '원)', type:'family', effect:{ rel_sp:20, money:-Math.round(econ.jajangmyeon*1.5), stress:-8 },
          result:[{ t:'relation', m:'집밥 데이트. 더 따뜻하고 소중하다.' }] },
      ]
    });

    pool.push({
      title:'🎁 배우자 기념일이 다가온다',
      descLines: [{ t:'system', m:'배우자 생일이 이틀 후다.' }],
      choices:[
        { label:'▶ 미리 선물을 산다 (-' + Math.round(econ.jajangmyeon*6).toLocaleString() + '원)', type:'family', effect:{ rel_sp:20, money:-Math.round(econ.jajangmyeon*6) },
          result:[{ t:'good', m:'미리 준비했다. 배우자가 감동받을 것이다.' }] },
        { label:'▶ 인터넷으로 미리 알아본다', type:'normal', effect:{ rel_sp:5 },
          result:[{ t:'story', m:'무슨 선물이 좋을지 조사했다.' }] },
        { label:'▶ 잊고 있었다 (위기)', type:'bad', effect:{ rel_sp:-5, stress:8 },
          result:[{ t:'bad', m:'위험하다... 서둘러야 한다.' }] },
      ]
    });

    if (p.rel_spouse < 45) {
      pool.push({
        title:'⚡ 배우자와 갈등',
        descLines: [{ t:'bad', m:'배우자: "당신은 집안일도 안 하고 맨날 피곤하다고만 해!"' }],
        choices:[
          { label:'▶ 진심으로 사과한다', type:'family', effect:{ rel_sp:15, stress:10 },
            result:[{ t:'relation', m:'화해했다. 관계가 회복된다.' }] },
          { label:'▶ 꽃다발 사서 사과 (-' + Math.round(econ.jajangmyeon*3.5).toLocaleString() + '원)', type:'family', effect:{ rel_sp:22, stress:5, money:-Math.round(econ.jajangmyeon*3.5) },
            result:[{ t:'relation', m:'꽃 한 다발. 배우자가 웃음을 되찾는다.' }] },
          { label:'▶ 맞받아 싸운다', type:'bad', effect:{ rel_sp:-20, stress:20 },
            result:[{ t:'bad', m:'싸움이 커졌다. 오늘 밤이 싸늘하다.' }] },
          { label:'▶ 조용히 피한다', type:'bad', effect:{ rel_sp:-8, stress:5 },
            result:[{ t:'bad', m:'문제가 해결되지 않은 채 묻혔다.' }] },
        ]
      });
    }
  }

  if (p.hasKid) {
    pool.push({
      title:'📚 아이가 숙제를 도와달라고 한다',
      descLines: [{ t:'npc', m:'아이: "아빠/엄마! 수학 숙제 모르겠어. 도와줘~"' }],
      choices:[
        { label:'▶ 같이 풀어준다 (30분)', type:'family', effect:{ rel_kid:15, stamina:-5, time:30, stress:-3 },
          result:[{ t:'good', m:'아이와 함께 완성!' }, { t:'npc', m:'아이: "이제 알겠어! 최고야!"' }] },
        { label:'▶ 인터넷 검색 알려주고 스스로 하게 한다', type:'normal', effect:{ rel_kid:3, time:5 },
          result:[{ t:'story', m:'자립심을 키워주는 교육법... 이라고 하자.' }] },
        { label:'▶ "나중에 봐줄게" 미룬다', type:'bad', effect:{ rel_kid:-8 },
          result:[{ t:'bad', m:'아이: "...알겠어." (풀죽은 목소리)' }] },
      ]
    });

    pool.push({
      title:'🎮 아이: "같이 놀아줘!"',
      descLines: [{ t:'npc', m:'아이: "아빠/엄마! 오늘 같이 놀아줘! 보드게임 하자!"' }],
      choices:[
        { label:'▶ 기꺼이 1시간 놀아준다', type:'family', effect:{ rel_kid:20, stress:-10, stamina:-5, time:60 },
          result:[{ t:'relation', m:'아이와의 즐거운 시간!' }, { t:'npc', m:'아이: "최고야!!!"' }] },
        { label:'▶ 30분만 놀아준다', type:'family', effect:{ rel_kid:10, stress:-5, time:30 },
          result:[{ t:'good', m:'30분이라도 함께했다.' }] },
        { label:'▶ 유튜브 틀어주고 쉰다', type:'bad', effect:{ rel_kid:-6, stamina:5 },
          result:[{ t:'bad', m:'유튜브 육아... 아이가 시무룩하다.' }] },
        { label:'▶ 학원 숙제 먼저 시킨다', type:'bad', effect:{ rel_kid:-3, stamina:2 },
          result:[{ t:'bad', m:'아이: "에이..." (투정)' }] },
      ]
    });

    pool.push({
      title:'🍼 아이의 학교 문제',
      descLines: [{ t:'npc', m:'아이: "오늘 학교에서 친구랑 싸웠어..."' }],
      choices:[
        { label:'▶ 차분히 이야기를 들어준다', type:'family', effect:{ rel_kid:18, stress:-5, time:30 },
          result:[{ t:'relation', m:'아이가 마음을 열었다. 신뢰가 쌓인다.' }] },
        { label:'▶ "그냥 사이좋게 지내" 한마디', type:'normal', effect:{ rel_kid:2 },
          result:[{ t:'story', m:'아이가 고개를 끄덕인다. 아직 해결되지 않은 것 같다.' }] },
        { label:'▶ 선생님께 전화해서 확인한다', type:'family', effect:{ rel_kid:10, stress:8, time:15 },
          result:[{ t:'good', m:'적극적인 부모. 아이가 안심한다.' }] },
      ]
    });
  }

  // 시대별 특수 가족 이벤트
  if (e.id === '1997') {
    pool.push({
      title:'😰 가족이 IMF 위기를 걱정한다',
      descLines: [{ t:'npc', m:'배우자: "우리 어떻게 되는 거야? 뉴스 보니까 무서워..."' }],
      choices:[
        { label:'▶ "괜찮아, 내가 지킬게" 안심시킨다', type:'family', effect:{ rel_sp:10, stress:8 },
          result:[{ t:'good', m:'배우자가 안도한다. 하지만 나는 불안하다.' }] },
        { label:'▶ 가계부 점검하고 절약 계획 세운다', type:'money', effect:{ rel_sp:8, stress:5, flag:'budgetCheck' },
          result:[{ t:'good', m:'위기 대응 계획을 세웠다.' }] },
      ]
    });
  }

  if (e.id === '2020') {
    pool.push({
      title:'🦠 가족 모두 집에 갇혀 지낸다',
      descLines: [{ t:'story', m:'오늘도 어딜 나가지 못한다. 온 가족이 집에 있다.' }],
      choices:[
        { label:'▶ 같이 영화 보고 저녁 먹는다', type:'family', effect:{ rel_sp:12, rel_kid:10, stress:-10 },
          result:[{ t:'good', m:'코로나가 오히려 가족 시간을 늘렸다.' }] },
        { label:'▶ 각자 방에서 각자의 시간', type:'normal', effect:{ stress:-5 },
          result:[{ t:'story', m:'거리두기는 집 안에서도...' }] },
        { label:'▶ 같이 요리 도전한다', type:'family', effect:{ rel_sp:15, rel_kid:12, stress:-12, money:-Math.round(econ.jajangmyeon*2) },
          result:[{ t:'good', m:'시간이 남아도는 코로나 시대. 요리 실력이 늘었다.' }] },
      ]
    });
  }

  if (e.id === '1980') {
    pool.push({
      title:'📺 온 가족 TV 시청',
      descLines: [{ t:'story', m:'저녁 9시, 온 가족이 TV 앞에 모였다.' }],
      choices:[
        { label:'▶ 함께 뉴스를 본다', type:'family', effect:{ rel_sp:8, rel_kid:5, stress:-5 },
          result:[{ t:'good', m:'가족이 함께하는 시간. 1980년대 풍경.' }] },
        { label:'▶ 드라마에 빠져든다', type:'normal', effect:{ stress:-8 },
          result:[{ t:'story', m:'주말의 명화... 밤이 깊어간다.' }] },
      ]
    });
  }

  // 가족 없을 때도 이벤트 추가
  if (!p.hasSpouse && !p.hasKid) {
    pool.push({
      title:'🏠 혼자 사는 저녁',
      descLines: [{ t:'story', m:'혼자만의 저녁 시간. 자유롭지만 가끔 쓸쓸하다.' }],
      choices:[
        { label:'▶ 좋아하는 취미를 즐긴다', type:'normal', effect:{ stress:-15, stamina:5 },
          result:[{ t:'good', m:'온전한 나만의 시간. 이것도 행복이다.' }] },
        { label:'▶ 친구에게 전화한다', type:'normal', effect:{ stress:-10 },
          result:[{ t:'good', m:'수다로 하루 피로가 날아간다.' }] },
        { label:'▶ 유료 자기계발 강의를 듣는다 (-' + econ.coffee.toLocaleString() + '원)', type:'money', effect:{ stress:3, money:-econ.coffee, flag:'self_dev' },
          result:[{ t:'good', m:'투자는 나 자신에게. 미래를 위한 시간.' }] },
        { label:'▶ 괜히 배달 시켜먹는다 (-' + Math.round(econ.jajangmyeon*2).toLocaleString() + '원)', type:'normal', effect:{ stress:-8, money:-Math.round(econ.jajangmyeon*2) },
          result:[{ t:'story', m:'혼자 먹는 야식. 맛있지만 돈이 아프다.' }] },
      ]
    });
  }

  return pool;
}

// ── 수익/부업 이벤트 풀 ──────────────────────────────
function getIncomePool(p, e) {
  var pool = [];

  pool.push({
    title:'🎰 로또 당첨 확인!',
    descLines: [{ t:'story', m:'지난주에 산 로또... 혹시나 하고 확인해본다.' }],
    choices:[{
      label:'▶ 당첨 번호 확인한다', type:'normal', effect:{ special:'lotto' }, result:[]
    }]
  });

  pool.push({
    title:'📦 중고 거래 수익',
    descLines: [{ t:'story', m:'중고 플랫폼에서 거래가 완료됐다!' }],
    choices:[{
      label:'▶ 수익 확인 (+40,000원)', type:'money', effect:{ money:40000 }, result:[{ t:'money', m:'중고 거래 +40,000원!' }]
    }]
  });

  pool.push({
    title:'💪 재능 거래로 부수입',
    descLines: [{ t:'story', m:'재능 플랫폼에 올린 내 스킬에 의뢰가 왔다.' }],
    choices:[
      { label:'▶ 의뢰 수락 (+80,000원)', type:'money', effect:{ money:80000, stress:5, time:60 }, result:[{ t:'money', m:'재능 거래 +80,000원!' }] },
      { label:'▶ 너무 피곤해서 거절', type:'normal', effect:{}, result:[{ t:'story', m:'다음에 더 여유가 있을 때 하자.' }] },
    ]
  });

  pool.push({
    title:'💭 오늘 하루를 돌아본다',
    descLines: [{ t:'story', m:'폰을 내려놓고 오늘을 되새긴다.' }],
    choices:[
      { label:'▶ 감사일기를 쓴다', type:'normal', effect:{ stress:-10, flag:'gratitude' }, result:[{ t:'good', m:'작은 것에 감사하는 마음. 내일도 버틸 수 있다.' }] },
      { label:'▶ 내일 계획을 세운다', type:'normal', effect:{ stress:3, flag:'diligent' }, result:[{ t:'good', m:'준비된 내일. 걱정이 조금 줄었다.' }] },
    ]
  });

  if (e.id !== '1980') {
    pool.push({
      title:'📊 주식 수익 실현',
      descLines: [{ t:'story', m:'보유 주식이 +8% 올랐다.' }],
      choices:[
        { label:'▶ 일부 매도 (+30만원)', type:'money', effect:{ money:300000, stress:-3 }, result:[{ t:'money', m:'주식 수익 +300,000원!' }] },
        { label:'▶ 존버한다', type:'normal', effect:{ stress:5 }, result:[{ t:'inner', m:'\'더 오를 거야...\'' }] },
      ]
    });
  }

  if (e.id === '2026' || e.id === '2010') {
    pool.push({
      title:'📹 유튜브 수익 정산',
      descLines: [{ t:'story', m:'구글 애드센스에서 이번 달 수익이 정산됐다.' }],
      choices:[{
        label:'▶ 수익 확인', type:'money', effect:{ special:'youtube' }, result:[]
      }]
    });
  }

  if (e.id === '1997') {
    pool.push({
      title:'🥇 금 모으기 운동 동참',
      descLines: [{ t:'history', m:'TV: "국민 여러분의 금을 모아주십시오. 나라를 살립시다."' }],
      choices:[
        { label:'▶ 금반지를 헌납한다 (애국)', type:'history', effect:{ money:-50000, stress:-5, flag:'patriot' }, result:[{ t:'history', m:'금 헌납 완료. 나라를 위해 내가 할 수 있는 일을 했다.' }] },
        { label:'▶ 그냥 지나친다', type:'normal', effect:{}, result:[{ t:'inner', m:'결혼반지만큼은...' }] },
      ]
    });
  }

  if (e.id === '2020') {
    pool.push({
      title:'💊 재난지원금 지급!',
      descLines: [{ t:'history', m:'문자: "코로나19 긴급재난지원금이 지급됩니다."' }],
      choices:[{
        label:'▶ 재난지원금 수령 (+100만원)', type:'money', effect:{ money:1000000, stress:-5 }, result:[{ t:'money', m:'재난지원금 +1,000,000원!' }, { t:'good', m:'정부 지원금. 오늘만큼은 조금 숨통이 트인다.' }]
      }]
    });
  }

  if (e.id === '2000') {
    pool.push({
      title:'💰 코스닥 대박 기회?',
      descLines: [{ t:'event', m:'IT 종목이 오늘 +30% 폭등했다.' }],
      choices:[
        { label:'▶ 지금이라도 산다 (-50만원)', type:'bad', effect:{ money:-500000, stress:10, flag:'hasStock' }, result:[{ t:'bad', m:'고점에 샀다. 이제 기다리는 일만 남았다.' }] },
        { label:'▶ 냉정하게 패스한다', type:'normal', effect:{ stress:-2 }, result:[{ t:'good', m:'냉정한 판단. 닷컴 버블의 교훈을 잊지 않는다.' }] },
      ]
    });
  }

  return pool;
}

// ───────────────────────────────────────────────
//  [New] Philosophical Questions — [ 삶의 의미 ]
// ───────────────────────────────────────────────
var PHIL_POOL = {
  morning: [
    {
      title: '잠시 생각이 든다',
      descLines: [ { t:'inner', m:'만원 지하철 안, 창틀에 비친 내 모습을 본다.' }, { t:'story', m:'나는 무엇을 위해 이토록 치열하게 달리고 있을까?' } ],
      choices: [
        { label: '▶ 내 가족의 안락한 삶을 위해', effect: { mental:10, flag:'Phil_Altruist' }, result: [ { t:'good', m:'헌신적인 마음이 나를 움직인다.' } ] },
        { label: '▶ 더 높은 곳, 사회적 성공을 위해', effect: { stress:10, money:10000, flag:'Phil_Materialist' }, result: [ { t:'money', m:'야망이 나를 채찍질한다.' } ] },
        { label: '▶ 그저 살아있음 그 자체의 증명을 위해', effect: { mental:5, flag:'Phil_Existentialist' }, result: [ { t:'inner', m:'존재한다는 것만으로도 충분하다.' } ] }
      ]
    }
  ],
  lunch: [
    {
      title: '식후 - 고찰',
      descLines: [ { t:'inner', m:'커피 한 잔의 여유 속, 문득 이런 의문이 든다.' }, { t:'story', m:'행복이란 무엇일까?' } ],
      choices: [
        { label: '▶ 고통 없이 평온한 상태', effect: { mental:15, stress:-10, flag:'Phil_Stoic' }, result: [ { t:'good', m:'마음의 평화를 최우선으로 삼는다.' } ] },
        { label: '▶ 원하는 것을 마음껏 누리는 기쁨', effect: { mental:10, money:-5000, flag:'Phil_Epicurean' }, result: [ { t:'good', m:'현재의 즐거움을 만끽하기로 했다.' } ] },
        { label: '▶ 남에게 도움이 되는 가치 있는 삶', effect: { relation:10, flag:'Phil_Humanist' }, result: [ { t:'good', m:'함께하는 가치를 다시금 새긴다.' } ] }
      ]
    }
  ],
  evening: [
    {
      title: '하루의 끝에서',
      descLines: [ { t:'inner', m:'침대에 누워 천장을 바라본다.' }, { t:'story', m:'오늘 하루는 내 인생에 어떤 의미였을까?' } ],
      choices: [
        { label: '▶ 내일로 나아가기 위한 디딤돌', effect: { mental:5, flag:'Phil_Stoic' }, result: [ { t:'good', m:'묵묵히 견뎌낸 나를 칭찬한다.' } ] },
        { label: '▶ 그저 속수무책으로 흘러간 시간', effect: { stress:5, flag:'Phil_Materialist' }, result: [ { t:'inner', m:'가끔은 허무함이 밀려오기도 한다.' } ] },
        { label: '▶ 내가 직접 선택하고 빚어낸 시간', effect: { mental:10, flag:'Phil_Existentialist' }, result: [ { t:'good', m:'나는 내 삶의 주인임을 느낀다.' } ] }
      ]
    }
  ]
};

var REFLECTION_POOL = {
  normal: [
    "이 선택이 10년 뒤의 나에게 어떤 의미로 남을까?",
    "우리는 결과를 위해 사는가, 아니면 과정을 위해 사는가?",
    "잠시 멈춰 서서 숨을 고르는 것만으로도 충분할 때가 있다.",
    "나의 가치는 타인의 시선에서 오는가, 내면의 확신에서 오는가?",
    "꿈을 쫓는 것은 용기일까, 아니면 현실로부터의 도피일까?"
  ],
  work: [
    "일은 삶의 목적일까, 아니면 단지 생존을 위한 수단일까?",
    "성취감 뒤에 찾아오는 공허함은 어디서 오는 것일까?",
    "나의 시간과 맞바꾼 이 소득은 정당한 가치를 지니고 있는가?",
    "조직의 부품이 된다는 것은 나를 잃는 것일까, 우리를 얻는 것일까?"
  ],
  family: [
    "익숙함이라는 이름 아래, 소중함을 잊고 살지는 않았나?",
    "사랑은 희생을 통해 증명되는 것일까, 아니면 공유를 통해 피어나는 것일까?",
    "가장 가까운 사람에게 나는 어떤 존재로 기억되고 싶은가?"
  ],
  money: [
    "돈으로 살 수 없는 것은 정말로 존재하지 않는 것일까?",
    "풍요로움은 통장의 잔고일까, 아니면 마음의 여유일까?",
    "소유가 늘어날수록 나는 더 자유로워지는가, 아니면 구속되는가?"
  ],
  romance: [
    "우연한 눈맞춤에 가슴이 설레는 것은 본능일까, 운명일까?",
    "누군가를 알아간다는 것은 나를 개방하는 과정이다.",
    "함께 걷는 것만으로도 세상이 달라 보일 수 있다."
  ]
};

var FORTUNE_POOL = [
  { id:'lottery_found', title:'🤞 길에서 복권을 주웠다!', loc:'🏢 길거리', ascii:'LOTTERY', desc:[{t:'story', m:'바닥에 떨어진 낡은 복권 한 장. 버려진 것 같은데...'}],
    choices:[
      { label:'▶ 주워서 번호를 확인한다', type:'money', effect:{ special:'lotto' }, result:[{t:'good', m:'혹시 모를 행운을 기대해본다.'}] },
      { label:'▶ 그냥 지나친다', type:'normal', effect:{ mental:3 }, result:[{t:'story', m:'정직한 삶이 최고다.'}] }
    ]
  },
  { id:'noble_person', title:'✨ 뜻밖의 인연', loc:'💼 사무실/카페', ascii:'MENTOR', desc:[{t:'npc', m:'어떤 분: "자네, 눈빛이 살아있구먼. 내 조언 하나 해주지..."'}],
    choices:[
      { label:'▶ 진중하게 조언을 경청한다', type:'normal', effect:{ mental:20, stress:-15 }, result:[{t:'good', m:'귀인을 만나 마음의 짐을 덜었다.'}] },
      { label:'▶ 바쁘다며 정중히 거절한다', type:'normal', effect:{ stamina:5 }, result:[{t:'story', m:'자신의 길은 스스로 정하는 법.'}] }
    ]
  }
];

var ROMANCE_POOL = [
  { id:'romance_spark', title:'💖 미묘한 시선', loc:'🏢 사무실 복도', ascii:'HEART', desc:[{t:'story', m:'평소 눈여겨보던 동료와 눈이 마주쳤다.'}],
    choices:[
      { label:'▶ 가벼운 미소를 지어보인다', type:'family', effect:{ rel_sp:-5, stress:-10, mental:15 }, result:[{t:'good', m:'서로의 온기가 느껴지는 찰나.'}] },
      { label:'▶ 서둘러 시선을 피한다', type:'normal', effect:{ stress:5 }, result:[{t:'inner', m:'두근거리는 마음을 진정시킨다.'}] }
    ]
  },
  { id:'romance_cafe', title:'☕ 우연한 합석', loc:'☕ 점심시간 카페', ascii:'HEART', desc:[{t:'story', m:'카페가 꽉 찼다. 우연히 합석하게 된 사람의 향기가 좋다.'}],
    choices:[
      { label:'▶ 가벼운 인사를 건넨다', type:'family', effect:{ rel_sp:-10, mental:20 }, result:[{t:'good', m:'새로운 세상이 열릴 것만 같다.'}] },
      { label:'▶ 커피만 빨리 마시고 일어난다', type:'normal', effect:{ stamina:5 }, result:[{t:'story', m:'각박한 사회인의 길.'}] }
    ]
  }
];

function getPhilosophicalMoment(p, e, timeKey) {
  var pool = PHIL_POOL[timeKey] || [];
  if (pool.length === 0) return null;
  // 30% 확률로 발생
  if (Math.random() > 0.4) return null;
  var idx = Math.floor(Math.random() * pool.length);
  return pool[idx];
}

function getReflection(type) {
  var key = 'normal';
  if (['work','bad'].indexOf(type) >=0) key = 'work';
  if (type === 'family') key = 'family';
  if (type === 'money') key = 'money';
  if (type === 'romance') key = 'romance';
  
  var pool = REFLECTION_POOL[key] || REFLECTION_POOL.normal;
  return pool[Math.floor(Math.random() * pool.length)];
}

function getWeather() {
  var r = Math.random();
  if (r < 0.4) return { id:'sunny',  label:'맑은',  eff:{ mental:5 } };
  if (r < 0.7) return { id:'cloudy', label:'흐린',  eff:{ stress:2 } };
  if (r < 0.9) return { id:'rainy',  label:'비오는', eff:{ stress:5, stamina:-5 } };
  return { id:'snowy',  label:'눈오는', eff:{ stress:8, stamina:-8 } };
}

function getMorningActivity(weather) {
  var activities = [
    { id:'jog', label:'🏃 근처 공원 조깅 (20분)', type:'normal', ascii:'JOGGING',
      eff:{ stamina:-10, stress:-15, time:20 }, res:{ t:'good', m:'땀을 흘리니 몸이 가볍다. 활기찬 시작!' } },
    { id:'walk', label:'🚶 동네 가벼운 산책 (15분)', type:'normal', ascii:'WALKING',
      eff:{ stamina:-3, stress:-10, time:15 }, res:{ t:'good', m:'제법 상쾌한 아침 공기.' } },
    { id:'cycle', label:'🚲 자전거 라이딩 (25분)', type:'normal', ascii:'CYCLING',
      eff:{ stamina:-15, stress:-20, time:25 }, res:{ t:'good', m:'허벅지가 탄탄해지는 느낌!' } },
    { id:'cook', label:'🍳 따뜻한 아침 식사 직접 요리', type:'normal', ascii:'COOKING',
      eff:{ stamina:15, stress:-5, time:30 }, res:{ t:'good', m:'정성껏 차린 한 끼가 하루를 응원한다.' } },
    { id:'meditate', label:'🧘 짧은 명상 (10분)', type:'normal', ascii:'MENTOR',
      eff:{ mental:10, stress:-5, time:10 }, res:{ t:'good', m:'마음을 차분히 가라앉혔다.' } }
  ];
  // 날씨가 안 좋으면 요리나 명상 확률 증가
  var idx;
  if (weather.id === 'rainy' || weather.id === 'snowy') {
    idx = Math.random() > 0.5 ? 3 : 4; 
  } else {
    idx = Math.floor(Math.random() * activities.length);
  }
  var a = activities[idx];
  return {
    choice: { label: a.label, type: a.type, effect: a.eff, result: [a.res], ascii: a.ascii }
  };
}

var WILDCARD_POOL = [
  { id:'bird_poop', title:'💩 이런 날벼락이!', loc:'🏢 길거리', ascii:'BIRD', desc:[{t:'bad', m:'하늘에서 무언가 툭... 아, 새똥이다.'}],
    choices:[
      { label:'▶ 운이 좋군! 복권을 사야겠다', type:'money', effect:{ special:'lotto', stress:5 }, result:[{t:'story', m:'새똥은 행운의 상징이라던데?'}], ascii:'LOTTERY' },
      { label:'▶ 으악! 최악이다...', type:'bad', effect:{ stress:15, mental:-10 }, result:[{t:'bad', m:'옷을 닦느라 진땀을 뺐다.'}] }
    ]
  },
  { id:'found_coin', title:'🪙 반짝이는 무언가', loc:'🏢 길거리', ascii:'COIN', desc:[{t:'story', m:'바닥에 동전 하나가 떨어져 있다.'}],
    choices:[
      { label:'▶ 냉큼 주머니에 넣는다', type:'money', effect:{ money:500, mental:2 }, result:[{t:'good', m:'500원 득템! 소소한 기쁨.'}] },
      { label:'▶ 주인에게 돌려줄까? (상상만)', type:'normal', effect:{ mental:5 }, result:[{t:'inner', m:'착한 일을 했다는 착각으로 멘탈 회복.'}] }
    ]
  }
];function getNarrativeCore(p, e) {
  var pool = NARRATIVE_CORE_POOL[e.id] || [];
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

var NARRATIVE_CORE_POOL = {
  '2026': [
    {
      id: 'ai_replacement',
      stages: [
        {
          title: '오후의 균열',
          loc: '🤝 팀장실',
          descLines: [
            { t:'story', m:'팀장이 조용히 회의실로 부른다.' },
            { t:'npc', m:'팀장: "솔직히 말할게요. 이번에 들어온 AI 인턴이 김민지 씨 업무의 70%를 자동화해버렸어요."' },
            { t:'bad', m:'침묵이 흐른다. 내 존재 가치가 데이터 한 줄로 부정당한 느낌이다.' }
          ],
          ascii: 'AI_CHART',
          choices: [
            { label:'▶ "그 AI 툴, 저도 가르쳐 주십시오"', type:'normal', effect:{ mental:5, flag:'ai_learner' }, result:[{ t:'good', m:'적응하려는 의지. 팀장이 고개를 끄덕인다.' }] },
            { label:'▶ "...제가 부족했다는 말씀인가요?"', type:'bad', effect:{ stress:15, mental:-10 }, result:[{ t:'bad', m:'감정적인 대응. 공기가 차가워진다.' }] },
            { label:'▶ 아무 말 없이 바닥만 본다', type:'normal', effect:{ stress:10 }, result:[{ t:'inner', m:'\'결국 올 것이 왔구나...\'' }] }
          ]
        },
        {
          title: '결정의 시간',
          loc: '💼 내 책상',
          descLines: [
            { t:'story', m:'퇴근 전, 모니터에 AI 인턴이 작성한 보고서가 떠 있다.' },
            { t:'story', m:'완벽하다. 인간의 감정이 배제된, 차갑지만 효율적인 결과물.' }
          ],
          choices: [
            { label:'▶ AI의 성과를 인정하고 협업을 제안한다', type:'history', effect:{ mental:10, money:20000, flag:'ai_partner' }, result:[{ t:'good', m:'기술을 도구로 삼기로 했다. 새로운 기회가 보이기 시작한다.' }] },
            { label:'▶ 내 방식대로 다시 고쳐 쓴다', type:'normal', effect:{ stress:20, stamina:-10 }, result:[{ t:'bad', m:'3시간을 더 써서 수동으로 고쳤다. 자존심은 지켰지만 지친다.' }] }
          ]
        }
      ]
    },
    {
      id: 'crypto_ghost',
      stages: [
        {
          title: '달콤한 유혹',
          loc: '☕ 회사 로비',
          descLines: [
            { t:'npc', m:'퇴사한 전 동료: "아직도 거기 다녀? 나 코인으로 벌써 은퇴했어. 비법 알려줄까?"' },
            { t:'story', m:'그가 보여준 계좌 잔고는 내 연봉의 10배다.' }
          ],
          choices: [
            { label:'▶ 비법을 전수받는다', type:'money', effect:{ money:-1000000, flag:'crypto_gambler' }, result:[{ t:'money', m:'100만원을 입금했다. "거인의 어깨"에 올라탄 느낌이다.' }] },
            { label:'▶ "운이 좋았네" 하고 거절한다', type:'normal', effect:{ mental:10 }, result:[{ t:'good', m:'성실한 노동의 가치를 믿기로 했다.' }] }
          ]
        },
        {
          title: '흔들리는 마음',
          loc: '📱 퇴근길 지하철',
          descLines: [
            { t:'story', m:'동료가 추천한 코인이 실시간으로 폭등하고 있다는 알림이 온다.' }
          ],
          choices: [
            { label:'▶ 지금이라도 추격 매수!', type:'bad', effect:{ money:-500000, stress:15, flag:'fomo' }, result:[{ t:'bad', m:'올라타자마자 하락하기 시작한다. 심장이 뛴다.' }] },
            { label:'▶ 화면을 끄고 창밖을 본다', type:'normal', effect:{ mental:5 }, result:[{ t:'inner', m:'\'내 돈이 아니야...\'' }] }
          ]
        }
      ]
    }
  ],
  '1997': [
    {
      id: 'imf_layoff',
      stages: [
        {
          title: '명단의 공포',
          loc: '🏢 복도',
          descLines: [
            { t:'story', m:'인사팀 사무실 앞에 사람들이 모여 있다. 하얀 봉투가 오간다.' },
            { t:'bad', m:'친했던 옆자리 오 차장이 고개를 떨구며 짐을 싼다.' }
          ],
          ascii: 'RESIGNATION',
          choices: [
            { label:'▶ 다가가 위로를 건넨다', type:'family', effect:{ stress:10, rel_sp:-2 }, result:[{ t:'story', m:'오 차장: "김 대리는 꼭 살아남게..." 그의 손이 떨린다.' }] },
            { label:'▶ 못 본 척 내 자리로 돌아온다', type:'bad', effect:{ stress:15, mental:-5 }, result:[{ t:'inner', m:'\'어쩔 수 없어. 나부터 살아야 해.\'' }] }
          ]
        },
        {
          title: '살아남은 자의 슬픔',
          loc: '💼 팀장실',
          descLines: [
            { t:'npc', m:'팀장: "김 대리, 자네는 이번엔 빠졌네. 하지만 조건이 있어. 당분간 무임금 야근이야."' }
          ],
          choices: [
            { label:'▶ "감사합니다" 하고 수긍한다', type:'normal', effect:{ stamina:-20, stress:10, flag:'survivor' }, result:[{ t:'story', m:'살아남았다는 안도감과 비참함이 교차한다.' }] },
            { label:'▶ "그건 너무합니다" 항의한다', type:'bad', effect:{ stress:25, flag:'protester' }, result:[{ t:'bad', m:'팀장: "지금 분위기 파악 안 돼?" 찍혀버렸다.' }] }
          ]
        }
      ]
    }
  ],
  '1980': [
    {
      id: 'export_miracle',
      stages: [
        {
          title: '국가적 사명',
          loc: '🏭 공장 라인',
          descLines: [
            { t:'npc', m:'반장: "이번 수출 물량 못 맞추면 나라 망신이야. 오늘부터 전원 합숙 특근이다!"' },
            { t:'story', m:'산업 역군이라는 칭호 아래, 땀 냄새 가득한 야간 작업이 시작된다.' }
          ],
          ascii: 'CONTAINER',
          choices: [
            { label:'▶ "해보자!" 정신력으로 버틴다', type:'normal', effect:{ stamina:-25, mental:15, flag:'patriot_worker' }, result:[{ t:'good', m:'애국심이 솟구친다. 우리는 할 수 있다!' }] },
            { label:'▶ 조용히 허리 통증을 참는다', type:'bad', effect:{ stamina:-30, stress:10 }, result:[{ t:'bad', m:'몸이 비명을 지르지만 멈출 수 없다.' }] }
          ]
        },
        {
          title: '기적의 아침',
          loc: '🚚 하차장',
          descLines: [
            { t:'story', m:'밤샘 작업 끝에 컨테이너가 출발한다. 태극기를 단 트럭이 멀어진다.' }
          ],
          choices: [
            { label:'▶ 뿌듯함에 젖어 담배 한 대', type:'normal', effect:{ stress:-15, money:-e.econ.cigarette }, result:[{ t:'good', m:'이게 나라를 세우는 맛이지.' }] },
            { label:'▶ 그대로 바닥에 쓰러져 잠든다', type:'bad', effect:{ stamina:20, time:120 }, result:[{ t:'story', m:'기절하듯 잠들었다. 훈장보다 잠이 달콤하다.' }] }
          ]
        }
      ]
    }
  ]
};

function getNews(eraId) {
  var pool = NEWS_POOL[eraId] || [];
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

var NEWS_POOL = {
  '1980': [
    '서울 지하철 2호선 성수~교대 구간 개통! 강남 시대 열린다.',
    '컬러 TV 방송 전격 실시, 전국이 천연색으로 물든다.',
    '프로야구 6개 구단 창단 완료, 내년 시즌 개막 기대감 고조.',
    '새마을 운동 전국적 확산... "우리도 한번 잘 살아보세"',
    '낮 12시부터 1시까지 절전 위해 전 부처 소등 실시.'
  ],
  '1997': [
    '정부, 결국 IMF 구제금융 신청 확정 "국가 부도 위기"',
    '한보철강 부도... 대기업 연쇄 도산 우려에 시장 패닉.',
    '금 모으기 운동 본부 발족 "장롱 속 돌반지를 나라를 위해"',
    '원-달러 환율 2,000원 돌파, 수입 물가 폭등 비상.',
    '지하철 파업 오늘부터 시작, 실직자들 대거 유입으로 혼잡 극심.'
  ],
  '2000': [
    '새천년 밀레니엄 버그(Y2K) 큰 혼란 없이 지나가... 안도의 한숨.',
    '코스닥 지수 280선 돌파! 벤처 기업 투기 열풍 확산.',
    '미국 닷컴 버블 붕괴 조짐? 나스닥 사상 최대 폭락.',
    '국민 1,000만 명 초고속 인터넷 이용... "세상이 클릭으로 연결"',
    '스타크래프트 대회 인기 폭발, 새로운 문화 코드로 정착.'
  ],
  '2010': [
    '카카오톡 가입자 1,000만 돌파, 문자 전송 시장 지형도 바뀐다.',
    '애플 아이폰 국내 출시 1년... 스마트폰 혁명 가속화.',
    '취업 시장의 새로운 강자 "모바일 앱 개발자" 연봉 치솟아.',
    '저성장 기조 고착화, 청년 실업률 역대 최고치 경신.',
    'SNS를 통한 퇴근 후 업무 지시... "연결되지 않을 권리" 논란.'
  ],
  '2020': [
    '전국 사회적 거리두기 4단계 전격 시행, 6시 이후 2인 금지.',
    '백신 수급 불균형 속에 1차 접종 인원 4,000만 명 돌파.',
    '재택근무 상시화 확산, 공유 오피스 시장 급격한 팽창.',
    '배달 앱 라이더 수입 경쟁 치열... "연봉 1억 라이더 등장"',
    '코인 투기 광풍... 2030 영끌 투자에 자산 격차 심화.'
  ],
  '2026': [
    'ChatGPT 인공지능, 화이트칼라 업무 50% 대체... AI 실업 경보.',
    '초거대 인공지능 제릴 "모든 직업의 보조자" 선언.',
    '재택근무 폐지 기업 vs 유지 기업... 인재 확보 전쟁 벌어져.',
    '배달비 5,000원 시대, 자영업자들 "배달 빼고 홀 장사만" 선언 잇달아.',
    'AI 면접관의 거짓말 탐지 기능 탑재, 윤리적 가이드라인 시급.'
  ]
};
