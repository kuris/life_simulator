// =============================================
//  대한민국 직장인 생존기 — 이벤트 스크립트 v3.0
// =============================================

function buildDayEvents(profile, era) {
  var p          = profile;
  var e          = era;
  var econ       = e.econ;
  var commuteMin = p.home.commute;
  var isRemote   = (p.home.type === 'home') || (p.company.id === 'home_2020') || (p.company.id === 'home_2010') || (p.company.id === 'home_2000');
  var jobId      = p.job.id;
  var eraId      = e.id;

  var ev = [];

  // ── 01. 기상 ────────────────────────────────
  var wakeDesc = [
    { t:'time',  m:'[ 06:30 AM ] 알람이 울린다.' },
    { t:'story', m: e.name + '의 아침. 오늘도 어김없이 하루가 시작된다.' },
    { t:'system', m:'💭 ' + e.atmosphere[Math.floor(Math.random()*e.atmosphere.length)] },
  ];
  if (p.hasSpouse) wakeDesc.push({ t:'npc', m:'배우자: "일어나야지... 오늘도 힘내."' });
  if (p.hasKid)    wakeDesc.push({ t:'npc', m:'아이: "아빠/엄마~ 학교 가기 싫어!"' });

  var wakeChoices = [
    { label:'▶ 바로 일어난다 (칼기상)', type:'normal',
      effect:{ stress:-3 },
      result:[{ t:'good', m:'의지력! 상쾌하게 하루 시작.' }] },
    { label:'▶ 10분만 더... (스누즈)', type:'normal',
      effect:{ stamina:5, time:10 },
      result:[{ t:'story', m:'10분이 지나 겨우 일어났다.' }] },
    { label:'▶ 30분 더 잔다 (택시비 각오)', type:'bad',
      effect:{ stamina:10, stress:8, time:30, money:-(econ.bus*10) },
      result:[{ t:'bad', m:'지각할 것 같다. 택시를 잡았다. (-' + (econ.bus*10).toLocaleString() + '원)' }] },
  ];

  ev.push({ id:'wake', time:'06:30', loc:'🏠 집 — 침실', desc:wakeDesc, choices:wakeChoices });

  // ── 02. 아침 준비 ────────────────────────────
  var morningDesc = [
    { t:'time',  m:'[ 07:00 AM ] 아침 준비 시간.' },
  ];
  if (p.hasSpouse) morningDesc.push({ t:'npc', m:'배우자: "밥 차려줄게, 먹고 가!"' });
  if (p.hasKid)    morningDesc.push({ t:'npc', m:'아이: "아침밥은요?"' });

  var morningChoices = [
    { label:'▶ 집밥 든든하게 먹는다', type:'normal',
      effect:{ stamina:20, time:25 },
      result:[{ t:'good', m:'든든한 아침. 점심까지 버틸 수 있다.' }] },
    { label:'▶ 편의점 삼각김밥 (-' + Math.round(econ.jajangmyeon*0.3).toLocaleString() + '원)', type:'normal',
      effect:{ stamina:7, money:-Math.round(econ.jajangmyeon*0.3), time:5 },
      result:[{ t:'story', m:'편의점 삼각김밥 2개.' }] },
    { label:'▶ 굶고 나간다 (시간 없음)', type:'bad',
      effect:{ stamina:-10, stress:5 },
      result:[{ t:'bad', m:'공복 출근. 점심까지 버텨야 한다.' }] },
  ];
  if (p.hasKid) {
    morningChoices.push({ label:'▶ 아이 등교 챙겨주고 나간다', type:'family',
      effect:{ stamina:-3, time:20, rel_kid:8, flag:'goodParent' },
      result:[
        { t:'relation', m:'아이: "아빠/엄마 사랑해!"' },
        { t:'good', m:'좋은 부모 포인트 획득!' }
      ] });
  }
  if (eraId === '1980') {
    morningChoices.push({ label:'▶ 새마을 라디오 체조한다', type:'normal',
      effect:{ stamina:10, stress:-5, time:10 },
      result:[{ t:'good', m:'건강한 아침 체조. 몸이 개운하다.' }] });
  }
  if (eraId === '2026') {
    morningChoices.push({ label:'▶ ChatGPT로 오늘 일정 요약받는다', type:'normal',
      effect:{ stress:-3, time:5, flag:'ai_user' },
      result:[{ t:'good', m:'AI가 오늘 할 일을 정리해줬다.' }] });
  }
  if (eraId === '2020') {
    morningChoices.push({ label:'▶ 마스크 착용 확인 후 출발', type:'normal',
      effect:{ stress:2 },
      result:[{ t:'story', m:'마스크 없이는 건물에 못 들어간다.' }] });
  }

  ev.push({ id:'morning', time:'07:00', loc:'🏠 집 — 주방', desc:morningDesc, choices:morningChoices });

  // ── 03. 출근 ────────────────────────────────
  if (!isRemote) {
    var commuteStress   = Math.floor(commuteMin / 15);
    var commuteStamina  = -Math.floor(commuteMin / 12);
    var transitCost     = commuteMin > 5 ? econ.bus : 0;

    var commuteDesc = [
      { t:'time',  m:'[ 07:40 AM ] 출근길. 목적지: ' + p.company.label },
      { t:'story', m:'통근 거리 ' + commuteMin + '분. ' + (commuteMin>=80 ? '장거리 출근의 피로감이 이미 느껴진다.' : commuteMin<=10 ? '직주근접의 여유!' : '오늘도 빠르게 이동한다.') },
    ];
    if (eraId==='1980') commuteDesc.push({ t:'system', m:'버스비 ' + econ.bus + '원. 지하철은 아직 일부 구간만.' });
    if (eraId==='2020') commuteDesc.push({ t:'bad', m:'마스크를 끼고 지하철을 탄다.' });

    var commuteChoices = [
      { label:'▶ 대중교통 탑승 (-' + transitCost.toLocaleString() + '원)', type:'normal',
        effect:{ stress:commuteStress, stamina:commuteStamina, money:-transitCost, time:commuteMin },
        result:[{ t:'story', m:commuteMin + '분 후 도착.' }] },
      { label:'▶ 택시 탑승 (-' + Math.round(commuteMin*econ.bus*0.5).toLocaleString() + '원, 빠름)', type:'money',
        effect:{ stress:Math.max(0,commuteStress-3), money:-Math.round(commuteMin*econ.bus*0.5), time:Math.floor(commuteMin*0.6) },
        result:[{ t:'money', m:'택시비 -' + Math.round(commuteMin*econ.bus*0.5).toLocaleString() + '원. 편하게 도착.' }] },
    ];
    if (commuteMin >= 30) {
      commuteChoices.push({ label:'▶ 이동 중 업무 처리 (이메일/문서)', type:'normal',
        effect:{ stress:commuteStress+3, stamina:commuteStamina, money:-transitCost, time:commuteMin, flag:'diligent' },
        result:[{ t:'good', m:'이동 중에도 일을 했다. 효율적이다.' }] });
      commuteChoices.push({ label:'▶ 이어폰 끼고 팟캐스트/음악 듣는다', type:'normal',
        effect:{ stress:commuteStress-4, stamina:commuteStamina, money:-transitCost, time:commuteMin },
        result:[{ t:'good', m:'정신적 여유를 챙겼다.' }] });
    }

    ev.push({ id:'commute', time:'07:40', loc:'🚇 출근길 (' + commuteMin + '분)', desc:commuteDesc, choices:commuteChoices });
  } else {
    var remoteDesc = [
      { t:'time',  m:'[ 09:00 AM ] 재택근무 시작.' },
      { t:'good',  m:'출퇴근 없음. 하지만 집이 사무실이 됐다.' },
    ];
    if (eraId==='2020') remoteDesc.push({ t:'story', m:'코로나로 인한 강제 재택. 익숙해지는 중.' });

    ev.push({ id:'remote_start', time:'09:00', loc:'🏠 재택근무 시작', desc:remoteDesc,
      choices:[
        { label:'▶ 업무 환경 세팅 후 시작', type:'normal',
          effect:{ stress:-3, stamina:3 },
          result:[{ t:'good', m:'집에서 일하는 쾌적함. 오늘도 화이팅.' }] },
        { label:'▶ 잠옷 차림으로 노트북만 켠다', type:'normal',
          effect:{ stress:-5, stamina:5 },
          result:[{ t:'story', m:'자유로운 재택. 집중력 유지가 관건이다.' }] },
        { label:'▶ 커피 한 잔 내리고 느긋하게 시작 (-' + econ.coffee.toLocaleString() + '원)', type:'normal',
          effect:{ stress:-4, stamina:4, money:-econ.coffee },
          result:[{ t:'story', m:'집에서 내린 커피. 여유로운 재택의 낭만.' }] },
      ]
    });
  }

  // ── 04. 출근길 랜덤 이벤트 ──────────────────────
  if (!isRemote && commuteMin > 15) {
    var commuteEvents = [
      {
        title: '⚡ 지하철 연착',
        desc: [{ t:'bad', m:'지하철이 연착됐다! 신호 장애.' }],
        choices: [
          { label:'▶ 기다린다', type:'bad', effect:{ stress:8, time:12 }, result:[{ t:'bad', m:'12분 지연.' }] },
          { label:'▶ 버스로 우회', type:'normal', effect:{ stress:5, money:-econ.bus, time:8 }, result:[{ t:'story', m:'버스로 갔다.' }] },
        ]
      },
      {
        title: '☕ 커피 1+1 행사!',
        desc: [{ t:'event', m:'편의점에서 커피 1+1 행사 중! 아메리카노 ' + econ.coffee.toLocaleString() + '원.' }],
        choices: [
          { label:'▶ 2잔 산다 (1잔은 동료 선물)', type:'money', effect:{ stress:-5, stamina:8, money:-econ.coffee, time:5, flag:'kind' }, result:[{ t:'good', m:'동료 커피까지 챙겼다. 인심 포인트!' }] },
          { label:'▶ 내 것만 1잔', type:'normal', effect:{ stress:-3, stamina:6, money:-econ.coffee, time:5 }, result:[{ t:'story', m:'커피 한 잔. 오늘도 버틸 수 있다.' }] },
          { label:'▶ 지나친다 (절약)', type:'normal', effect:{ stress:2 }, result:[{ t:'inner', m:'\'참아야 해...\'' }] },
        ]
      },
      {
        title: '👜 길에서 지갑 발견',
        desc: [{ t:'event', m:'지갑이 떨어져 있다. 안에 돈이 있는 것 같다.' }],
        choices: [
          { label:'▶ 경찰서 신고', type:'normal', effect:{ stress:3, time:15, flag:'honest' }, result:[{ t:'good', m:'양심적인 행동. 마음이 편하다.' }] },
          { label:'▶ 모른 척 지나간다', type:'bad', effect:{ stress:5 }, result:[{ t:'inner', m:'찜찜한 하루 시작.' }] },
        ]
      },
      {
        title: '🌧️ 갑자기 비가 온다',
        desc: [{ t:'bad', m:'예보 없이 비가 쏟아진다! 우산이 없다.' }],
        choices: [
          { label:'▶ 편의점 우산 산다 (-' + Math.round(econ.coffee*0.8).toLocaleString() + '원)', type:'money', effect:{ money:-Math.round(econ.coffee*0.8), stress:3 }, result:[{ t:'story', m:'우산 구입 완료. 일회용이라 좀 불안하다.' }] },
          { label:'▶ 그냥 뛰어간다', type:'bad', effect:{ stress:10, stamina:-8 }, result:[{ t:'bad', m:'흠뻑 젖었다. 온몸이 불쾌하다.' }] },
          { label:'▶ 비 그치길 기다린다 (+10분)', type:'normal', effect:{ stress:5, time:10 }, result:[{ t:'story', m:'잠깐 처마 밑에서 기다렸다.' }] },
        ]
      },
    ];

    if (eraId === '1980') {
      commuteEvents.push({
        title: '🚌 버스가 초만원',
        desc: [{ t:'bad', m:'아침 버스가 사람으로 꽉 찼다. 몸이 눌린다.' }],
        choices: [
          { label:'▶ 억지로 탄다', type:'bad', effect:{ stress:10, stamina:-5, money:-econ.bus, time:commuteMin }, result:[{ t:'bad', m:'꼼짝 못 하고 도착했다.' }] },
          { label:'▶ 다음 버스 기다린다 (+15분)', type:'normal', effect:{ stress:5, money:-econ.bus, time:commuteMin+15 }, result:[{ t:'story', m:'여유롭게 다음 버스에 탔다.' }] },
        ]
      });
    }

    if (eraId === '2026') {
      commuteEvents.push({
        title: '🚇 GTX 앱 오류',
        desc: [{ t:'bad', m:'앱에서 GTX 예약 오류가 났다. 결제는 됐는데...' }],
        choices: [
          { label:'▶ 고객센터에 전화한다 (+20분)', type:'bad', effect:{ stress:15, time:20 }, result:[{ t:'bad', m:'연결까지 20분. 그동안 지각 확정.' }] },
          { label:'▶ 일반 전철로 우회한다', type:'normal', effect:{ stress:8, money:-econ.bus, time:30 }, result:[{ t:'story', m:'돌아가는 길. 이것도 나쁘지 않다.' }] },
        ]
      });
    }

    var picked = commuteEvents[Math.floor(Math.random()*commuteEvents.length)];
    ev.push({
      id:'commute_event', time:'08:10', loc:'🚇 출근길 — 돌발',
      desc:[ { t:'time', m:'[ 08:10 AM ] 출근길 돌발 상황!' } ].concat(picked.desc),
      choices: picked.choices
    });
  }

  // ── 05. 오전 업무 ────────────────────────────
  var workDesc = [
    { t:'time',  m:'[ 09:00 AM ] 업무 시작. (' + e.name + ')' },
    { t:'story', m:'오늘 하루 업무를 시작한다.' },
  ];
  if (eraId==='1980') workDesc.push({ t:'system', m:'부장님: "정신 차리고 빠릿빠릿 하게 움직여!"' });
  if (eraId==='1997') workDesc.push({ t:'bad', m:'구조조정 소문이 오늘도 돌고 있다...' });
  if (eraId==='2026') workDesc.push({ t:'story', m:'ChatGPT로 초안 작업... AI 덕분에 빠르다.' });
  if (jobId==='dismissed') workDesc.push({ t:'bad', m:'오늘도 구직 사이트를 열었다. 연락이 없다.' });

  var workChoices = [
    { label:'▶ 집중 모드 (2시간 몰입)', type:'normal',
      effect:{ stress:8, stamina:-12, time:120, flag:'diligent',
        money: p.employType.id==='parttime' ? p.job.dailyPay*2 : 0 },
      result:[{ t:'good', m:'오전 업무 처리 완료. 효율적이었다.' }] },
    { label:'▶ 커피 먹고 천천히 시작 (-' + econ.coffee.toLocaleString() + '원)', type:'normal',
      effect:{ stress:3, stamina:5, money:-econ.coffee, time:130 },
      result:[{ t:'story', m:'커피로 정신을 차리고 시작했다.' }] },
    { label:'▶ SNS 보다가 점심시간 됨', type:'bad',
      effect:{ stress:-5, time:120 },
      result:[{ t:'bad', m:'딴짓으로 오전이 증발했다.' }] },
    { label:'▶ 동료와 잡담하며 시간 보냄', type:'normal',
      effect:{ stress:-8, stamina:-3, time:120, flag:'socialLunch' },
      result:[{ t:'story', m:'수다로 시간이 날아갔다. 그래도 스트레스는 풀렸다.' }] },
  ];
  if (jobId==='selfemploy' || jobId==='restaurant') {
    workChoices.push({ label:'▶ 가게 마케팅/홍보에 집중', type:'money',
      effect:{ stress:10, stamina:-8, money:Math.floor(econ.wage*0.03), time:120 },
      result:[{ t:'money', m:'마케팅 효과! 추가 매출 +' + Math.floor(econ.wage*0.03).toLocaleString() + '원' }] });
  }
  if (eraId==='1997' && jobId==='dismissed') {
    workChoices.push({ label:'▶ 오전 내내 취업 면접을 본다', type:'history',
      effect:{ stress:15, stamina:-10, time:180, flag:'job_hunt' },
      result:[{ t:'story', m:'면접을 3개나 봤다. 지쳐도 계속해야 한다.' }] });
  }
  if (eraId==='2026') {
    workChoices.push({ label:'▶ AI 도구로 업무 자동화 세팅한다', type:'normal',
      effect:{ stress:-2, time:150, flag:'ai_user', money:20000 },
      result:[{ t:'good', m:'AI 자동화 세팅 완료. 다음 주 업무가 줄어들 것이다.' }] });
  }

  ev.push({ id:'morning_work', time:'09:00', loc:'💼 ' + p.company.label, desc:workDesc, choices:workChoices });

  // ── 06. 오전 랜덤 이벤트 (시대별) ────────────────
  var morningPool = getMorningPool(p, e);
  if (morningPool.length > 0) {
    var me = morningPool[Math.floor(Math.random()*morningPool.length)];
    ev.push({
      id:'morning_event', time:'10:30', loc:'📱 오전 알림',
      desc:[ { t:'time', m:'[ 10:30 AM ] 알림이 왔다.' }, { t:'event', m:'⚡ ' + me.title } ].concat(me.descLines),
      choices: me.choices
    });
  }

  // ── 07. 점심 ────────────────────────────────
  var lunchDesc = [
    { t:'time',  m:'[ 12:00 PM ] 점심 시간!' },
  ];
  if (eraId==='1980') lunchDesc.push({ t:'system', m:'구내식당 밥값: ' + econ.jajangmyeon + '원' });
  if (eraId==='1997') lunchDesc.push({ t:'bad', m:'요즘 직장인들이 편의점 도시락으로 끼니를 해결한다.' });

  var lunchChoices = [
    { label:'▶ 동료들과 외식 (-' + econ.jajangmyeon.toLocaleString() + '원)', type:'normal',
      effect:{ stress:-10, stamina:15, money:-econ.jajangmyeon, time:60, flag:'socialLunch' },
      result:[
        { t:'good', m:'맛있는 점심 + 수다로 오후 활력 충전!' },
        { t:'npc', m:'동료: "요즘 팀장님 많이 예민하시지 않아요?" (뒷담화 시작)' }
      ] },
    { label:'▶ 혼밥 (-' + Math.round(econ.jajangmyeon*0.6).toLocaleString() + '원)', type:'normal',
      effect:{ stress:2, stamina:10, money:-Math.round(econ.jajangmyeon*0.6), time:30 },
      result:[{ t:'story', m:'조용한 혼밥. 30분이 남는다.' }] },
    { label:'▶ 도시락 (절약!)', type:'money',
      effect:{ stress:-2, stamina:12 },
      result:[{ t:'good', m:'준비해온 도시락. 건강하고 경제적!' }] },
    { label:'▶ 점심 건너뜀 (절약 + 다이어트)', type:'bad',
      effect:{ stress:5, stamina:-15 },
      result:[{ t:'bad', m:'배가 고프다... 오후에 집중이 안 될 것 같다.' }] },
  ];
  // 배달 옵션: 시대별 분기
  if (eraId === '2020' || eraId === '2026') {
    lunchChoices.push({ label:'▶ 배달앱으로 시켜먹기 (-' + Math.round(econ.jajangmyeon*1.4).toLocaleString() + '원)', type:'normal',
      effect:{ stress:-3, stamina:12, money:-Math.round(econ.jajangmyeon*1.4), time:40 },
      result:[{ t:'story', m:'배달앱 클릭 한 번에 배달. -' + Math.round(econ.jajangmyeon*1.4).toLocaleString() + '원' }] });
  } else if (eraId === '2010') {
    lunchChoices.push({ label:'▶ 전화로 배달 시켜먹기 (-' + Math.round(econ.jajangmyeon*1.3).toLocaleString() + '원)', type:'normal',
      effect:{ stress:-2, stamina:11, money:-Math.round(econ.jajangmyeon*1.3), time:40 },
      result:[{ t:'story', m:'전화 배달. 배달앱은 아직 생소하다.' }] });
  } else if (eraId === '1997' || eraId === '2000') {
    lunchChoices.push({ label:'▶ 전화로 짜장면 배달 (-' + Math.round(econ.jajangmyeon*1.2).toLocaleString() + '원)', type:'normal',
      effect:{ stress:-2, stamina:11, money:-Math.round(econ.jajangmyeon*1.2), time:40 },
      result:[{ t:'story', m:'전화로 야... (5분 뒤) 배달직 아저씨가 온다!' }] });
  }
  if (eraId==='1980') {
    lunchChoices.push({ label:'▶ 구내식당 정식 먹는다', type:'normal',
      effect:{ stamina:18, money:-econ.jajangmyeon, stress:-5, time:30 },
      result:[{ t:'good', m:'구내식당 따끈한 정식. 옛날 직장인의 낭만.' }] });
  }
  if (eraId==='2020') {
    lunchChoices.push({ label:'▶ [코로나] 칸막이 혼밥 식당', type:'normal',
      effect:{ stamina:10, money:-econ.jajangmyeon, stress:5, time:30 },
      result:[{ t:'story', m:'칸막이 설치된 식당. 낯선 풍경이 이제 익숙해졌다.' }] });
  }

  ev.push({ id:'lunch', time:'12:00', loc:'🍱 점심 시간', desc:lunchDesc, choices:lunchChoices });

  // ── 08. 오후 업무 ────────────────────────────
  var pmDesc = [
    { t:'time',  m:'[ 02:00 PM ] 점심 식곤증과 싸우는 오후.' },
  ];
  if (eraId==='1997') pmDesc.push({ t:'bad', m:'오늘 구조조정 명단이 또 나왔다는 소문이 돈다.' });
  if (eraId==='2026') pmDesc.push({ t:'story', m:'AI 리포트 초안이 나왔다. 내가 할 일이 줄고 있다...' });
  if (eraId==='2020') pmDesc.push({ t:'story', m:'오후 화상회의 3개. 실제 회의보다 피곤하다.' });

  var pmChoices = [
    { label:'▶ 집중 업무 처리', type:'normal',
      effect:{ stress:8, stamina:-12, time:90, flag:'diligent',
        money: p.employType.id==='parttime' ? Math.floor(p.job.dailyPay*1.5) : 0 },
      result:[{ t:'good', m:'오후 업무 완수. 퇴근이 가까워진다.' }] },
    { label:'▶ 졸음과 싸우며 겨우 버틴다', type:'bad',
      effect:{ stress:5, stamina:-8, time:90 },
      result:[{ t:'bad', m:'극도의 졸음. 어떻게든 버텼다.' }] },
    { label:'▶ 화장실 10분 쉬는 타임', type:'normal',
      effect:{ stress:-5, stamina:5, time:100 },
      result:[{ t:'inner', m:'\'화장실이 유일한 안식처...\'' }] },
    { label:'▶ 아메리카노로 버팀 (-' + econ.coffee.toLocaleString() + '원)', type:'normal',
      effect:{ stress:-3, stamina:8, money:-econ.coffee, time:95 },
      result:[{ t:'story', m:'카페인으로 졸음을 이겼다.' }] },
    { label:'▶ 팀장한테 잘 보이려고 적극적으로 일한다', type:'normal',
      effect:{ stress:12, stamina:-15, time:90, flag:'diligent', money:30000 },
      result:[
        { t:'good', m:'팀장의 눈에 띄었다. "수고해요" 한 마디가 힘이 된다.' },
      ] },
  ];

  ev.push({ id:'afternoon_work', time:'14:00', loc:'💼 오후 업무', desc:pmDesc, choices:pmChoices });

  // ── 09. 오후 랜덤 이벤트 ──────────────────────
  var afternoonPool = getAfternoonPool(p, e);
  if (afternoonPool.length > 0) {
    var ae = afternoonPool[Math.floor(Math.random()*afternoonPool.length)];
    ev.push({
      id:'afternoon_event', time:'16:00', loc:'⚡ 오후 돌발 이벤트',
      desc:[ { t:'time', m:'[ 04:00 PM ] 갑자기 일이 터졌다!' }, { t:'event', m:'⚡ ' + ae.title } ].concat(ae.descLines),
      choices: ae.choices
    });
  }

  // ── 10. 퇴근 ────────────────────────────────
  var leaveDesc = [
    { t:'time',  m:'[ 06:00 PM ] 퇴근 시간이다!' },
  ];
  if (eraId==='1980') leaveDesc.push({ t:'system', m:'부장님이 아직 자리에 있다...' });
  if (eraId==='1997') leaveDesc.push({ t:'bad', m:'오늘도 살아남았다. 내일은 어떨지 모른다.' });
  if (eraId==='2010') leaveDesc.push({ t:'bad', m:'카카오톡에 메시지가 왔다. 퇴근 전 업무 요청인가...' });

  var leaveChoices = [
    { label:'▶ 칼퇴근 (6시 정각)', type:'normal',
      effect:{ stress:-5,
        money: p.employType.id==='parttime' ? Math.floor(p.job.dailyPay*2) : 0 },
      result:[{ t:'good', m:'칼퇴! 자유다!!!' }] },
    { label:'▶ 30분 눈치 보다 퇴근', type:'bad',
      effect:{ stress:8, stamina:-5, time:30 },
      result:[{ t:'story', m:'30분 눈치 추가. 피곤하다.' }] },
    { label:'▶ 야근 2시간 (+' + Math.round(p.job.dailyPay*0.5).toLocaleString() + '원)', type:'money',
      effect:{ stress:18, stamina:-15, time:120, flag:'overtime',
        money: Math.round(p.job.dailyPay*0.5) },
      result:[
        { t:'bad', m:'야근 시작...' },
        { t:'money', m:'야근수당 +' + Math.round(p.job.dailyPay*0.5).toLocaleString() + '원' }
      ] },
    { label:'▶ 퇴근 전 동료와 커피 (-' + econ.coffee.toLocaleString() + '원)', type:'normal',
      effect:{ stress:-8, money:-econ.coffee, time:20 },
      result:[{ t:'good', m:'퇴근 전 커피 타임. 소소한 행복.' }] },
    { label:'▶ 내일 일거리를 미리 정리하고 퇴근', type:'normal',
      effect:{ stress:3, stamina:-5, time:30, flag:'diligent' },
      result:[{ t:'good', m:'내일 아침이 편해질 것이다.' }] },
  ];

  ev.push({ id:'leave', time:'18:00', loc:'💼 퇴근 시간', desc:leaveDesc, choices:leaveChoices });

  // ── 11. 퇴근길 ──────────────────────────────
  if (!isRemote) {
    var goHomeDesc = [
      { t:'time', m:'[ 06:30 PM ] 퇴근길. 집까지 ' + commuteMin + '분.' },
    ];
    if (commuteMin >= 60) goHomeDesc.push({ t:'bad', m:'오늘도 긴 귀갓길이 기다린다.' });

    var goHomeChoices = [
      { label:'▶ 바로 귀가', type:'normal',
        effect:{ stamina:-Math.floor(commuteMin/12), stress:3, money:-econ.bus, time:commuteMin },
        result:[{ t:'story', m:commuteMin + '분 후 귀가.' }] },
      { label:'▶ 마트에서 장 보고 간다 (-' + Math.round(econ.jajangmyeon*3.5).toLocaleString() + '원)', type:'family',
        effect:{ stamina:-8, money:-Math.round(econ.jajangmyeon*3.5), time:commuteMin+30, rel_sp:6 },
        result:[
          { t:'money', m:'장 봤다. -' + Math.round(econ.jajangmyeon*3.5).toLocaleString() + '원' },
        ].concat(p.hasSpouse ? [{ t:'relation', m:'배우자가 좋아한다.' }] : []) },
      { label:'▶ 헬스장 들렀다 간다 (-' + Math.round(econ.coffee*1.5).toLocaleString() + '원)', type:'normal',
        effect:{ stress:-12, stamina:15, money:-Math.round(econ.coffee*1.5), time:commuteMin+70 },
        result:[{ t:'good', m:'운동으로 스트레스 해소!' }] },
      { label:'▶ 동료들과 술 한 잔 (-' + Math.round(econ.jajangmyeon*3).toLocaleString() + '원)', type:'normal',
        effect:{ stress:-18, stamina:-12, money:-Math.round(econ.jajangmyeon*3), time:commuteMin+90,
          rel_sp: p.hasSpouse ? -5 : 0 },
        result:[
          { t:'good', m:'시원한 맥주 한 잔. -' + Math.round(econ.jajangmyeon*3).toLocaleString() + '원' },
        ].concat(p.hasSpouse ? [{ t:'bad', m:'귀가가 늦어진다. 배우자가 걱정할 것 같다.' }] : []) },
    ];
    // 중고거래: 시대별 분기
    if (eraId === '2020' || eraId === '2026') {
      goHomeChoices.push({ label:'▶ 당근마켓 직거래 (+30,000원)', type:'money',
        effect:{ money:30000, time:commuteMin+20, stamina:-3 },
        result:[{ t:'money', m:'당근 거래 완료! +30,000원' }] });
    } else if (eraId === '2010') {
      goHomeChoices.push({ label:'▶ 중고나라 직거래 (+25,000원)', type:'money',
        effect:{ money:25000, time:commuteMin+25, stamina:-3 },
        result:[{ t:'money', m:'중고나라 거래 완료! +25,000원' }] });
    } else if (eraId === '2000') {
      goHomeChoices.push({ label:'▶ 네이버 카페 중고거래 (+20,000원)', type:'money',
        effect:{ money:20000, time:commuteMin+25, stamina:-3 },
        result:[{ t:'money', m:'인터넷 중고거래 완료! +20,000원' }] });
    }
    if (eraId === '1997') {
      goHomeChoices.push({ label:'▶ 금 모으기 운동 참여 후 귀가', type:'history',
        effect:{ money:-50000, stress:-3, flag:'patriot', time:commuteMin+30 },
        result:[{ t:'history', m:'금 헌납 참여. 나라를 위해 내가 할 수 있는 일을 했다.' }] });
    }

    ev.push({ id:'go_home', time:'18:30', loc:'🚇 퇴근길', desc:goHomeDesc, choices:goHomeChoices });
  }

  // ── 12. 귀가 후 집안일 ──────────────────────
  var choresDesc = [
    { t:'time',  m:'[ 07:30 PM ] 집에 도착했다.' },
    { t:'story', m:'소파에 쓰러지고 싶다. 하지만 집안일이 기다린다.' },
  ];
  if (p.hasSpouse) choresDesc.push({ t:'npc', m:'배우자: "왔어? 집안일 좀 도와줄 수 있어?"' });

  var choresChoices = [
    { label:'▶ 설거지 + 빨래 처리', type:'family',
      effect:{ stamina:-8, time:35, rel_sp:12, choreDone:['dishes','laundry'] },
      result:[
        { t:'good', m:'설거지 + 빨래 완료!' },
      ].concat(p.hasSpouse ? [{ t:'relation', m:'배우자 친밀도 +12' }] : []) },
    { label:'▶ 저녁 요리를 직접 한다', type:'family',
      effect:{ stamina:-10, time:45, money:-Math.floor(econ.jajangmyeon*1.5), rel_sp:15, rel_kid:8, choreDone:['cook'] },
      result:[
        { t:'good', m:'집밥 완성! 가족이 행복해한다.' },
        { t:'relation', m:'가족 관계 크게 상승!' }
      ] },
    { label:'▶ 청소기 + 분리수거', type:'family',
      effect:{ stamina:-7, time:30, rel_sp:10, choreDone:['vacuum','trash'] },
      result:[{ t:'good', m:'청소 완료! 집이 쾌적해졌다.' }] },
    { label:'▶ 일단 쉰다... (피곤)', type:'bad',
      effect:{ stamina:10, stress:-5, rel_sp:-5, chorePending:['dishes','laundry'] },
      result:[{ t:'bad', m:'집안일을 미뤘다. 배우자의 한숨 소리...' }] },
    { label:'▶ 배달 시키고 전부 쉰다 (-' + Math.round(econ.jajangmyeon*2).toLocaleString() + '원)', type:'normal',
      effect:{ stamina:5, money:-Math.round(econ.jajangmyeon*2), rel_sp:2 },
      result:[{ t:'story', m:'배달 주문. 몸은 편하지만 지출이 아프다.' }] },
    { label:'▶ 마트 장 보고 요리한다 (-' + Math.round(econ.jajangmyeon*1.8).toLocaleString() + '원)', type:'family',
      effect:{ stamina:-12, time:60, money:-Math.round(econ.jajangmyeon*1.8), rel_sp:18, rel_kid:10, choreDone:['shop','cook'] },
      result:[
        { t:'good', m:'장 봐서 요리까지 했다. 완벽한 집안일 처리!' },
        { t:'relation', m:'가족 관계 최상승!' }
      ] },
  ];

  ev.push({ id:'chores', time:'19:30', loc:'🏠 집 — 귀가 후', desc:choresDesc, choices:choresChoices });

  // ── 13. 가족 이벤트 ──────────────────────────
  var familyPool = getFamilyPool(p, e);
  if (familyPool.length > 0) {
    var fe = familyPool[Math.floor(Math.random()*familyPool.length)];
    ev.push({
      id:'family', time:'20:00', loc:'🏠 가족 시간',
      desc:[ { t:'time', m:'[ 08:00 PM ] 저녁 후 가족 시간.' }, { t:'event', m:'💬 ' + fe.title } ].concat(fe.descLines),
      choices: fe.choices.filter(function(c) { return !c.condition || c.condition(p); })
    });
  }

  // ── 14. 저녁 부업/수익 이벤트 ────────────────
  var incomePool = getIncomePool(p, e);
  if (incomePool.length > 0) {
    var ie = incomePool[Math.floor(Math.random()*incomePool.length)];
    ev.push({
      id:'income', time:'21:00', loc:'📱 저녁 — 수익/부업',
      desc:[ { t:'time', m:'[ 09:00 PM ] 저녁, 폰을 열었다.' }, { t:'event', m:'💸 ' + ie.title } ].concat(ie.descLines),
      choices: ie.choices
    });
  }

  // ── 15. 취침 전 ──────────────────────────────
  var nightChoices = [
    { label:'▶ 일찍 잠든다 (숙면)', type:'normal',
      effect:{ stamina:25, stress:-8, flag:'earlyBed' },
      result:[{ t:'good', m:'현명한 선택. 내일을 위한 충전!' }] },
    { label: eraId==='1980' ? '▶ TV 연속극 보다 잔다' : eraId==='1997' ? '▶ 비디오 빌려와서 보다 잔다' : eraId==='2000' ? '▶ PC로 영화/MP3 듣다 잔다' : '▶ 넷플릭스/유튜브 보다 잔다', type:'normal',
      effect:{ stress:-15, stamina:-5 },
      result:[{ t:'story', m: eraId==='1980' ? '주말의 명화... 밤이 깊어간다.' : eraId==='1997' ? '비디오 한 편. 현실을 잊었다.' : eraId==='2000' ? 'MP3 플레이어에 담아둔 음악이 흘러나온다.' : '알고리즘에 빠져 어느새 새벽 1시다.' }] },
    { label:'▶ 내일 걱정하며 뒤척인다', type:'bad',
      effect:{ stress:12, stamina:-8 },
      result:[{ t:'bad', m:'내일 회의, 돈 걱정... 잠이 안 온다.' }] },
    { label:'▶ 가계부 정리한다', type:'money',
      effect:{ stress:3, flag:'budgetCheck' },
      result:[{ t:'money', m:'지출 확인 완료. 오늘 얼마 썼나...' }] },
    { label:'▶ 가볍게 스트레칭 후 취침', type:'normal',
      effect:{ stamina:15, stress:-5 },
      result:[{ t:'good', m:'몸이 한결 가볍다. 좋은 밤.' }] },
  ];
  if (p.hasSpouse) {
    nightChoices.push({ label:'▶ 배우자와 오늘 하루 이야기 나눈다', type:'family',
      effect:{ stress:-18, rel_sp:12, time:45 },
      result:[
        { t:'npc', m:'배우자: "오늘도 수고했어."' },
        { t:'relation', m:'서로의 하루를 공유한 소중한 시간.' }
      ] });
  }
  if (p.hasKid) {
    nightChoices.push({ label:'▶ 아이에게 책 읽어준다', type:'family',
      effect:{ stress:-10, rel_kid:15, stamina:-3, time:30, flag:'goodParent' },
      result:[
        { t:'npc', m:'아이: "또 읽어줘! 더 읽어줘~"' },
        { t:'relation', m:'아이와의 소중한 시간.' }
      ] });
  }
  if (eraId==='1980') {
    nightChoices.push({ label:'▶ TV 앞에서 가족 모두 9시 뉴스를 본다', type:'family',
      effect:{ stress:-8, rel_sp:5, rel_kid:5 },
      result:[{ t:'good', m:'TV 뉴스 앞에 온 가족이 모인다. 1980년대의 낭만.' }] });
  }
  if (eraId==='2026') {
    nightChoices.push({ label:'▶ AI로 내일 계획을 짜본다', type:'normal',
      effect:{ stress:-5, flag:'ai_planner' },
      result:[{ t:'good', m:'AI가 내일 스케줄을 최적화해줬다.' }] });
  }

  ev.push({ id:'night', time:'22:00', loc:'🏠 취침 전', desc:[
    { t:'time',  m:'[ 10:00 PM ] 하루가 끝나간다.' },
    { t:'story', m:'오늘 하루를 어떻게 마무리할까?' },
  ], choices:nightChoices });

  return ev;
}

// ── 오전 이벤트 풀 ──────────────────────────────────
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
