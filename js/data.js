// =============================================
//  직장인 하루 시뮬레이터 v2.0 — 기본 데이터
// =============================================

// ─── 고용 형태 ────────────────────────────────────
const EMPLOYMENT_TYPES = [
  {
    id: 'fulltime', label: '정규직 월급쟁이',
    icon: '🏢', dailyPay: 18000,
    desc: '안정적이지만 야근과 눈치가 일상. 4대보험 完.',
    payType: 'monthly',   // 월급날 지급
    stressBase: 2,
  },
  {
    id: 'contract', label: '계약직 / 비정규직',
    icon: '📋', dailyPay: 14000,
    desc: '계약 만료 공포와 함께하는 나날. 불안정하지만 자유시간은 있음.',
    payType: 'monthly',
    stressBase: 3,
  },
  {
    id: 'parttime', label: '알바 (시급제)',
    icon: '🥤', dailyPay: 9860,
    desc: '시급 9,860원. 출/퇴근이 자유롭지만 불안정. 투잡 용이.',
    payType: 'daily',    // 당일 지급
    stressBase: 1,
  },
  {
    id: 'freelance', label: '프리랜서',
    icon: '💻', dailyPay: 0,
    desc: '일이 있을 때만 돈이 들어온다. 들쭉날쭉 수입.',
    payType: 'project',  // 프로젝트 완료 시
    stressBase: 2,
  },
  {
    id: 'selfemploy', label: '자영업자 / 사장님',
    icon: '🏪', dailyPay: 0,
    desc: '내가 사장이지만... 제일 바쁜 건 나다. 매출이 곧 급여.',
    payType: 'daily',
    stressBase: 4,
  },
];

// ─── 직종 ─────────────────────────────────────────
const JOBS = [
  { id: 'office',   label: '일반 사무직',     icon: '📁',  bonus: 0,      overtimeRate: 1.2 },
  { id: 'it',       label: 'IT / 개발자',     icon: '💻',  bonus: 50000,  overtimeRate: 1.5 },
  { id: 'sales',    label: '영업직',           icon: '📊',  bonus: 80000,  overtimeRate: 1.0 },
  { id: 'service',  label: '서비스/접객업',    icon: '🎯',  bonus: 0,      overtimeRate: 1.0 },
  { id: 'delivery', label: '배달/운전직',      icon: '🛵',  bonus: 30000,  overtimeRate: 1.3 },
  { id: 'finance',  label: '금융/회계',        icon: '💰',  bonus: 100000, overtimeRate: 1.1 },
  { id: 'teacher',  label: '교사/강사',        icon: '📚',  bonus: 0,      overtimeRate: 1.0 },
  { id: 'medical',  label: '의료/간호직',      icon: '🏥',  bonus: 20000,  overtimeRate: 1.5 },
  { id: 'cafe',     label: '카페 알바',        icon: '☕',  bonus: 0,      overtimeRate: 1.0 },
  { id: 'store',    label: '편의점 알바',      icon: '🏪',  bonus: 0,      overtimeRate: 1.0 },
  { id: 'design',   label: '디자인/크리에이터',icon: '🎨',  bonus: 40000,  overtimeRate: 1.2 },
];

// ─── 회사/근무지 위치 ─────────────────────────────
const COMPANY_LOCATIONS = [
  { id: 'gangnam',  label: '강남 (테헤란로)',    traffic: 'heavy' },
  { id: 'yeouido',  label: '여의도 (IFC)',        traffic: 'medium' },
  { id: 'pangyo',   label: '판교 (테크노밸리)',   traffic: 'medium' },
  { id: 'jongno',   label: '종로 (광화문)',        traffic: 'medium' },
  { id: 'hongdae',  label: '홍대/마포',           traffic: 'light' },
  { id: 'home',     label: '재택근무',            traffic: 'none' },
];

// ─── 거주지 ────────────────────────────────────────
const HOME_LOCATIONS = [
  { id: 'walk',    label: '회사 도보권 (10분)',     commute: 10,  rent: 130, type: 'walk' },
  { id: 'near',    label: '지하철 1구간 (20분)',     commute: 20,  rent: 100, type: 'subway' },
  { id: 'mid',     label: '지하철 2호선권 (40분)',   commute: 40,  rent: 80,  type: 'subway' },
  { id: 'far',     label: '경기도 출퇴근 (80분)',    commute: 80,  rent: 45,  type: 'bus' },
  { id: 'veryFar', label: '지방 KTX 출퇴근 (2시간)',commute: 120, rent: 25,  type: 'ktx' },
  { id: 'parents', label: '부모님 집 (무료, 120분)',commute: 120, rent: 0,   type: 'bus' },
];

// ─── 집안일 목록 ──────────────────────────────────
const CHORE_LIST = [
  { id: 'dishes',   label: '설거지',     stress: -2, stamina: -3,  time: 15, relation: 3 },
  { id: 'laundry',  label: '빨래',       stress: -2, stamina: -4,  time: 20, relation: 3 },
  { id: 'vacuum',   label: '청소기',     stress: -3, stamina: -5,  time: 25, relation: 5 },
  { id: 'trash',    label: '쓰레기 분리', stress: -1, stamina: -2,  time: 10, relation: 2 },
  { id: 'cook',     label: '저녁 요리',  stress: -5, stamina: -8,  time: 40, relation: 8 },
  { id: 'shop',     label: '마트 장보기',stress: -3, stamina: -5,  time: 30, relation: 5 },
];

// ─── 부업 / 별도 수익 이벤트 풀 ──────────────────────
const SIDE_INCOME_EVENTS = [
  {
    id: 'stock_up',
    title: '📈 주식이 올랐다!',
    desc: ['어제 사둔 주식이 +7% 상승했다.', '팔까, 더 기다릴까?'],
    condition: (p) => p.flags.includes('hasStock'),
    choices: [
      {
        label: '▶ 일부 매도한다 (50만원 수익 실현)',
        effect: { money: 500000, stress: -5, flag: 'stockProfit' },
        result: [{ t: 'money', m: '💰 주식 수익 +500,000원 입금! 신난다.' }]
      },
      {
        label: '▶ 존버한다 (더 오를 수도 있으니까)',
        effect: { stress: 3 },
        result: [{ t: 'inner', m: '\'더 오를 거야... 아마도...\'' }]
      }
    ]
  },
  {
    id: 'stock_down',
    title: '📉 주식이 폭락했다!',
    desc: ['보유 주식이 -12% 하락했다는 알림이 왔다.'],
    condition: (p) => p.flags.includes('hasStock'),
    choices: [
      {
        label: '▶ 손절 매도한다 (-30만원)',
        effect: { money: -300000, stress: 20 },
        result: [{ t: 'bad', m: '✘ -300,000원 손실... 오늘 하루가 망했다.' }]
      },
      {
        label: '▶ 물타기 추가 매수한다',
        effect: { money: -200000, stress: 15, flag: 'moreStock' },
        result: [{ t: 'bad', m: '더 샀다. 이게 맞는 건지 모르겠다... (-200,000원)' }]
      },
      {
        label: '▶ 그냥 안 본다 (멘탈 보호)',
        effect: { stress: 10 },
        result: [{ t: 'inner', m: '\'모르면 행복하지...\'' }]
      }
    ]
  },
  {
    id: 'crypto',
    title: '🪙 코인 친구가 단톡에 올라온다',
    desc: ['친구: "야 이거 사면 10배는 가능함. 나 이미 올인했음 ㅋㅋ"'],
    choices: [
      {
        label: '▶ 100만원 투자한다 (하이리스크)',
        effect: { money: -1000000, stress: 10, flag: 'hasCrypto' },
        result: [{ t: 'bad', m: '✘ 코인에 100만원 투자... 제발 오르길.' }]
      },
      {
        label: '▶ 소액 5만원만 한다',
        effect: { money: -50000, stress: 3, flag: 'hasCrypto' },
        result: [{ t: 'story', m: '소액만 투자. 이게 현명한 선택이겠지.' }]
      },
      {
        label: '▶ 무시한다 (현명한 판단)',
        effect: { stress: -2 },
        result: [{ t: 'good', m: '✔ 지인 코인 추천은 무시하는 게 정답이다.' }]
      }
    ]
  },
  {
    id: 'parttime_offer',
    title: '💼 투잡 제안이 들어왔다',
    desc: ['지인: "저번에 부탁한 번역 작업인데... 주말에 해줄 수 있어? 시간당 3만원"'],
    choices: [
      {
        label: '▶ 수락한다 (주말 4시간 작업)',
        effect: { money: 120000, stress: 8, stamina: -10, time: 30, flag: 'hasParttime' },
        result: [{ t: 'money', m: '💰 부업 수익 +120,000원! 하지만 주말이 사라진다.' }]
      },
      {
        label: '▶ 거절한다 (주말은 나의 것)',
        effect: { stress: -3 },
        result: [{ t: 'good', m: '✔ 쉬기로 결정. 건강이 최우선.' }]
      }
    ]
  },
  {
    id: 'lottery',
    title: '🎰 로또 당첨 확인!',
    desc: ['지난주에 산 로또... 혹시나 확인해본다.'],
    condition: (p) => p.flags.includes('boughtLotto'),
    choices: [
      {
        label: '▶ 당첨 번호 확인한다',
        effect: {},
        result: [],
        special: 'checkLotto'
      }
    ]
  },
  {
    id: 'sell_stuff',
    title: '📦 당근마켓에 올린 물건이 팔렸다!',
    desc: ['알림: "구매자가 연락했습니다. 오늘 직거래 가능한가요?"'],
    choices: [
      {
        label: '▶ 오늘 직거래한다 (퇴근길에)',
        effect: { money: 45000, time: 20, stamina: -3 },
        result: [{ t: 'money', m: '💰 당근마켓 거래 완료! +45,000원' }]
      },
      {
        label: '▶ 내일 하자고 한다',
        effect: {},
        result: [{ t: 'story', m: '내일로 미뤘다. 귀찮긴 해도 어쩔 수 없다.' }]
      }
    ]
  },
  {
    id: 'youtube_adsense',
    title: '▶ 유튜브 수익이 들어왔다',
    desc: ['취미로 올리던 유튜브... 구글 애드센스에서 정산이 왔다.'],
    condition: (p) => p.flags.includes('hasYoutube'),
    choices: [
      {
        label: '▶ 수익 확인! (랜덤)',
        effect: {},
        result: [],
        special: 'youtubeIncome'
      }
    ]
  },
  {
    id: 'overtime_pay',
    title: '💳 야근수당 입금 확인',
    desc: ['이번 달 야근수당이 입금됐다는 문자가 왔다.'],
    condition: (p) => p.flags.includes('didOvertime'),
    choices: [
      {
        label: '▶ 확인한다',
        effect: { money: 150000, stress: -5 },
        result: [{ t: 'money', m: '💰 야근수당 +150,000원! 그래도 돈이 위로가 된다.' }]
      }
    ]
  },
  {
    id: 'buy_stock',
    title: '📊 주식 앱 열어봤다',
    desc: ['요즘 주식 이야기가 많다. 계좌를 개설해볼까?'],
    condition: (p) => !p.flags.includes('hasStock'),
    choices: [
      {
        label: '▶ 삼성전자 200만원어치 산다',
        effect: { money: -2000000, stress: 5, flag: 'hasStock' },
        result: [{ t: 'money', m: '📊 삼성전자 200만원어치 매수 완료. 오르거라...' }]
      },
      {
        label: '▶ ETF 50만원만 적립식으로',
        effect: { money: -500000, stress: 2, flag: 'hasStock' },
        result: [{ t: 'good', m: '✔ 안전한 ETF 적립식 투자. 현명하다.' }]
      },
      {
        label: '▶ 그냥 닫는다',
        effect: {},
        result: [{ t: 'story', m: '아직은 아닌 것 같다.' }]
      }
    ]
  },
  {
    id: 'buy_lotto',
    title: '🎱 편의점 앞 로또 자판기',
    desc: ['매주 사는 로또... 이번 주 행운을 빌어본다.'],
    condition: (p) => !p.flags.includes('boughtLotto'),
    choices: [
      {
        label: '▶ 5천원어치 산다 (5장)',
        effect: { money: -5000, stress: -2, flag: 'boughtLotto' },
        result: [{ t: 'story', m: '5천원에 꿈을 샀다. 토요일을 기다린다.' }]
      },
      {
        label: '▶ 그냥 지나친다',
        effect: {},
        result: [{ t: 'inner', m: '\'꿈은 공짜가 아니잖아...\'' }]
      }
    ]
  },
];

// ─── 집안일 이벤트 풀 ────────────────────────────────
const CHORE_EVENTS = [
  {
    id: 'chore_dishes',
    title: '🍽️ 설거지가 쌓여있다',
    desc: ['싱크대에 그릇이 한가득 쌓여있다.'],
    hasSpouseVariant: true,
    spouseNag: '배우자: "설거지 좀 해줄 수 있어? 나 너무 피곤해..."',
    choices: [
      {
        label: '▶ 바로 설거지한다',
        effect: { stamina: -5, time: 15, relation_spouse: 5, choresDone: ['dishes'] },
        result: [{ t: 'good', m: '✔ 설거지 완료. 깔끔하다. 배우자도 좋아한다.' }]
      },
      {
        label: '▶ 나중에 한다 (일단 쉬고)',
        effect: { choresPending: ['dishes'] },
        result: [{ t: 'chore', m: '⚠ 설거지가 집안일 목록에 추가됐다.' }]
      },
      {
        label: '▶ 식기세척기에 넣는다',
        effect: { stamina: -2, time: 5, relation_spouse: 3, choresDone: ['dishes'] },
        result: [{ t: 'good', m: '✔ 식기세척기의 힘을 빌렸다. (+3분, 관계 +3)' }]
      }
    ]
  },
  {
    id: 'chore_laundry',
    title: '👕 빨래통이 넘쳐흐른다',
    desc: ['빨래통에 옷이 가득 찼다. 어제도 못 했는데...'],
    hasSpouseVariant: true,
    spouseNag: '배우자: "빨래 언제 할 거야? 입을 옷이 없잖아."',
    choices: [
      {
        label: '▶ 세탁기 돌린다 (건조기까지)',
        effect: { stamina: -3, time: 10, relation_spouse: 4, choresDone: ['laundry'] },
        result: [{ t: 'good', m: '✔ 빨래 시작! 건조까지 2시간 후 완료 예정.' }]
      },
      {
        label: '▶ 세탁소에 맡긴다',
        effect: { money: -20000, time: 10, relation_spouse: 4, choresDone: ['laundry'] },
        result: [{ t: 'money', m: '세탁소 이용. -20,000원이지만 시간을 아꼈다.' }]
      },
      {
        label: '▶ 내일로 미룬다',
        effect: { choresPending: ['laundry'], relation_spouse: -3 },
        result: [{ t: 'bad', m: '✘ 또 미뤘다... 배우자가 한숨을 쉰다.' }]
      }
    ]
  },
  {
    id: 'chore_vacuum',
    title: '🧹 바닥이 지저분하다',
    desc: ['먼지가 쌓이고 아이 장난감이 여기저기 흩어져 있다.'],
    choices: [
      {
        label: '▶ 청소기 돌린다',
        effect: { stamina: -7, time: 25, relation_spouse: 5, choresDone: ['vacuum'] },
        result: [{ t: 'good', m: '✔ 청소 완료! 집이 쾌적해졌다.' }]
      },
      {
        label: '▶ 로봇 청소기 켜놓고 나간다',
        effect: { time: 3, relation_spouse: 3, choresDone: ['vacuum'] },
        result: [{ t: 'good', m: '✔ 로봇 청소기를 믿자. 현대 문명에 감사.' }]
      },
      {
        label: '▶ 그냥 산다',
        effect: { relation_spouse: -2 },
        result: [{ t: 'inner', m: '\'나중에...\'' }]
      }
    ]
  },
  {
    id: 'chore_cook',
    title: '🍳 저녁을 해야 한다',
    desc: ['오늘 저녁은 누가 요리하나?'],
    hasSpouseVariant: true,
    spouseNag: '배우자: "오늘 저녁 니가 해줄 수 있어? 나 오늘 너무 힘들었어..."',
    choices: [
      {
        label: '▶ 직접 요리한다 (40분)',
        effect: { stamina: -10, time: 40, money: -15000, relation_spouse: 10, relation_kid: 5, choresDone: ['cook'] },
        result: [
          { t: 'good', m: '✔ 집밥 완성! 가족 모두 행복해한다.' },
          { t: 'relation', m: '💕 가족 관계 크게 상승!' }
        ]
      },
      {
        label: '▶ 배달을 시킨다',
        effect: { money: -25000, stamina: 0, relation_spouse: 2 },
        result: [{ t: 'story', m: '배달 어플 클릭. 30분 후 도착 예정. (-25,000원)' }]
      },
      {
        label: '▶ 밖에서 먹고 온다 (외식)',
        effect: { money: -40000, stamina: 5, relation_spouse: 5, relation_kid: 5 },
        result: [{ t: 'good', m: '외식! 가족이 좋아한다. (-40,000원)' }]
      },
      {
        label: '▶ 라면 끓인다',
        effect: { money: -1500, stamina: -3, time: 10, relation_spouse: -5 },
        result: [{ t: 'bad', m: '라면... 배우자의 표정이 어두워진다.' }]
      }
    ]
  },
];

// ─── 가족 이벤트 풀 ─────────────────────────────────
const FAMILY_EVENTS = [
  {
    id: 'spouse_talk',
    title: '💬 배우자와의 대화',
    condition: (p) => p.hasSpouse,
    desc: ['배우자가 오늘 있었던 일을 이야기하고 싶어한다.'],
    choices: [
      {
        label: '▶ 집중해서 들어준다',
        effect: { relation_spouse: 15, stress: -8, stamina: -3, time: 30 },
        result: [
          { t: 'npc', m: '배우자: "역시 당신이 제일 잘 들어줘. 힘이 돼."' },
          { t: 'relation', m: '💕 배우자와의 관계가 크게 좋아졌다.' }
        ]
      },
      {
        label: '▶ "응응" 하면서 폰 본다',
        effect: { relation_spouse: -8, stress: -3 },
        result: [
          { t: 'bad', m: '배우자가 이상한 걸 눈치챘다...' },
          { t: 'npc', m: '배우자: "...됐어. 당신은 항상 그래."' }
        ]
      },
      {
        label: '▶ 나도 오늘 힘들었다고 털어놓는다',
        effect: { relation_spouse: 10, stress: -15, time: 45 },
        result: [
          { t: 'npc', m: '배우자: "그랬구나... 둘 다 힘들었네. 서로 수고했어."' },
          { t: 'relation', m: '💕 서로를 이해하는 시간이 됐다.' }
        ]
      }
    ]
  },
  {
    id: 'spouse_fight',
    title: '⚡ 배우자와 갈등이 생겼다',
    condition: (p) => p.hasSpouse && p.relation_spouse < 40,
    desc: [
      '쌓인 불만이 터졌다.',
      '배우자: "당신은 집안일은 하나도 안 하고 맨날 피곤하다고만 해!"',
    ],
    choices: [
      {
        label: '▶ 진심으로 사과한다',
        effect: { relation_spouse: 12, stress: 10 },
        result: [
          { t: 'npc', m: '배우자: "...그래, 다음부터는 좀 도와줘."' },
          { t: 'relation', m: '화해했다. 관계가 회복되기 시작한다.' }
        ]
      },
      {
        label: '▶ 맞받아 싸운다',
        effect: { relation_spouse: -20, stress: 20 },
        result: [
          { t: 'bad', m: '✘ 싸움이 커졌다. 오늘 밤 분위기가 싸늘하다.' }
        ]
      },
      {
        label: '▶ 조용히 자리를 피한다',
        effect: { relation_spouse: -8, stress: 8 },
        result: [
          { t: 'bad', m: '✘ 문제를 회피했다. 해결되지 않은 채 묻혔다.' }
        ]
      },
      {
        label: '▶ 꽃을 사서 사과한다',
        effect: { relation_spouse: 20, stress: 5, money: -30000 },
        result: [
          { t: 'good', m: '✔ 꽃 한 다발. 배우자가 웃음을 되찾는다. (-30,000원)' },
          { t: 'relation', m: '💕 관계가 크게 회복됐다!' }
        ]
      }
    ]
  },
  {
    id: 'date_night',
    title: '💑 오늘 데이트하자!',
    condition: (p) => p.hasSpouse,
    desc: ['배우자: "오늘 오랜만에 우리 둘이 나가서 밥 먹을까?"'],
    choices: [
      {
        label: '▶ 좋아! 근사한 레스토랑 간다',
        effect: { relation_spouse: 25, money: -80000, stress: -15, stamina: -5 },
        result: [
          { t: 'good', m: '✔ 분위기 좋은 레스토랑에서 데이트. 오랜만에 로맨틱했다.' },
          { t: 'relation', m: '💕 배우자와의 관계가 매우 크게 좋아졌다!' }
        ]
      },
      {
        label: '▶ 동네 식당에서 소박하게',
        effect: { relation_spouse: 15, money: -30000, stress: -10 },
        result: [{ t: 'good', m: '✔ 소박하지만 함께하는 시간이 소중했다.' }]
      },
      {
        label: '▶ 피곤해서 집에서 편의점 데이트',
        effect: { relation_spouse: 5, money: -10000, stress: -8 },
        result: [{ t: 'story', m: '집에서 편의점 음식으로 데이트. 나름 아늑했다.' }]
      },
      {
        label: '▶ "나 오늘 너무 피곤해" 거절한다',
        effect: { relation_spouse: -10, stress: -5 },
        result: [
          { t: 'bad', m: '✘ 배우자가 실망한 표정이다.' },
          { t: 'npc', m: '배우자: "...알겠어. 나 혼자 갔다올게."' }
        ]
      }
    ]
  },
  {
    id: 'kid_homework',
    title: '📚 아이가 숙제를 도와달라고 한다',
    condition: (p) => p.hasKid,
    desc: ['아이: "아빠/엄마! 수학 숙제 모르겠어. 도와줘~"'],
    choices: [
      {
        label: '▶ 같이 풀어준다 (30분)',
        effect: { relation_kid: 15, stamina: -5, time: 30, stress: -3 },
        result: [
          { t: 'good', m: '✔ 아이와 함께 숙제를 마쳤다.' },
          { t: 'npc', m: '아이: "이제 알겠어! 아빠/엄마 최고!"' }
        ]
      },
      {
        label: '▶ 인강/유튜브로 보내버린다',
        effect: { relation_kid: 2, time: 5 },
        result: [{ t: 'story', m: '유튜브 강의 링크를 보냈다. 스스로 해결하길...' }]
      },
      {
        label: '▶ "나중에 봐줄게" 하고 미룬다',
        effect: { relation_kid: -8 },
        result: [
          { t: 'bad', m: '✘ 아이가 실망한 것 같다.' },
          { t: 'npc', m: '아이: "...알겠어." (풀죽은 목소리)' }
        ]
      }
    ]
  },
  {
    id: 'kid_play',
    title: '🎮 아이가 같이 놀자고 한다',
    condition: (p) => p.hasKid,
    desc: ['아이: "아빠/엄마 오늘 같이 놀아줘! 보드게임 하자!"'],
    choices: [
      {
        label: '▶ 기꺼이 놀아준다 (1시간)',
        effect: { relation_kid: 20, stamina: -5, stress: -10, time: 60 },
        result: [
          { t: 'good', m: '✔ 아이와 즐거운 시간을 보냈다.' },
          { t: 'npc', m: '아이: "아빠/엄마랑 노는 게 제일 좋아!!!"' },
          { t: 'relation', m: '💙 아이와의 관계가 크게 좋아졌다!' }
        ]
      },
      {
        label: '▶ 30분만 놀아준다',
        effect: { relation_kid: 10, stamina: -3, stress: -5, time: 30 },
        result: [{ t: 'good', m: '30분 함께 놀았다. 아이가 좋아한다.' }]
      },
      {
        label: '▶ 유튜브 틀어주고 쉰다',
        effect: { relation_kid: -5, stamina: 5 },
        result: [{ t: 'bad', m: '✘ 유튜브 육아... 아이가 시무룩하다.' }]
      }
    ]
  },
  {
    id: 'kid_sick',
    title: '🤒 아이가 아프다',
    condition: (p) => p.hasKid,
    desc: ['학교에서 연락이 왔다. "아이가 열이 있어서 조퇴해야 할 것 같습니다."'],
    choices: [
      {
        label: '▶ 즉시 조퇴해서 데리러 간다',
        effect: { relation_kid: 20, stress: 15, stamina: -10, money: -20000, time: 60, flag: 'goodParent' },
        result: [
          { t: 'good', m: '✔ 아이를 데리러 갔다. 아이가 안도한다.' },
          { t: 'npc', m: '아이: "아빠/엄마... 와줬어?" (눈물을 글썽이며)' }
        ]
      },
      {
        label: '▶ 배우자에게 연락한다',
        condition: (p) => p.hasSpouse,
        effect: { stress: 8 },
        result: [{ t: 'story', m: '배우자에게 부탁했다. 미안하지만 어쩔 수 없다.' }]
      },
      {
        label: '▶ 부모님께 부탁한다',
        effect: { stress: 5, relation_kid: -5 },
        result: [{ t: 'story', m: '부모님께 연락드렸다. 죄송하고 감사한 마음이다.' }]
      }
    ]
  },
  {
    id: 'anniversary',
    title: '💍 오늘이 결혼기념일이다!',
    condition: (p) => p.hasSpouse,
    desc: ['달력을 보니 오늘이 결혼기념일이다. 배우자는 알고 있을까?'],
    choices: [
      {
        label: '▶ 깜짝 이벤트를 준비한다 (케이크+선물)',
        effect: { relation_spouse: 35, money: -100000, stress: -5 },
        result: [
          { t: 'good', m: '✔ 배우자가 감동했다. 눈물을 글썽인다.' },
          { t: 'npc', m: '배우자: "기억했구나... 고마워. 정말 사랑해."' },
          { t: 'relation', m: '💕 관계가 엄청나게 좋아졌다!!' }
        ]
      },
      {
        label: '▶ 꽃다발과 케이크만',
        effect: { relation_spouse: 20, money: -50000, stress: -3 },
        result: [{ t: 'good', m: '✔ 소박하지만 진심을 담은 선물. 배우자가 기뻐한다.' }]
      },
      {
        label: '▶ 깜빡했다... 그냥 넘어간다',
        effect: { relation_spouse: -25, stress: 15 },
        result: [
          { t: 'bad', m: '✘ 배우자가 어둡다. 오늘 밤이 무섭다...' },
          { t: 'npc', m: '배우자: "...오늘이 무슨 날인지 알아?" (차가운 눈빛)' }
        ]
      }
    ]
  },
];

// ─── 직장 이벤트 풀 ────────────────────────────────
const WORK_EVENTS = [
  {
    id: 'performance_review',
    title: '📊 인사 평가 시즌',
    desc: ['팀장: "이번 달 성과 평가 자료 제출해주세요."'],
    choices: [
      {
        label: '▶ 밤새워 완벽하게 준비한다',
        effect: { stress: 15, stamina: -20, money: 80000, flag: 'goodPerformance' },
        result: [
          { t: 'good', m: '✔ 완벽한 자료로 좋은 평가를 받았다.' },
          { t: 'money', m: '💰 성과급 +80,000원 예정!' }
        ]
      },
      {
        label: '▶ 적당히 준비한다',
        effect: { stress: 5, stamina: -5 },
        result: [{ t: 'story', m: '나쁘지 않은 평가를 받을 것 같다.' }]
      },
      {
        label: '▶ 대충 제출한다 (퇴근이 더 중요)',
        effect: { stress: -5, flag: 'badPerformance' },
        result: [{ t: 'bad', m: '✘ 대충 냈다. 다음 달 상여금이 걱정된다.' }]
      }
    ]
  },
  {
    id: 'new_project',
    title: '🚀 새 프로젝트 배정',
    desc: ['팀장: "다음 달부터 새 프로젝트 담당해주실 분?"'],
    choices: [
      {
        label: '▶ 자원한다 (도전!)',
        effect: { stress: 10, money: 200000, stamina: -10, flag: 'hasNewProject' },
        result: [
          { t: 'good', m: '✔ 새 프로젝트 담당! 부담스럽지만 성장의 기회다.' },
          { t: 'money', m: '💰 프로젝트 수당 +200,000원!' }
        ]
      },
      {
        label: '▶ 조용히 있는다 (눈치 작전)',
        effect: { stress: 2 },
        result: [{ t: 'story', m: '조용히 버텼다. 다행히 지목되지 않았다.' }]
      }
    ]
  },
  {
    id: 'boss_praise',
    title: '🌟 팀장에게 칭찬을 받았다',
    desc: ['팀장: "지난번 발표 자료 정말 잘 만드셨더라고요. 수고하셨어요."'],
    choices: [
      {
        label: '▶ 감사하게 받아들인다',
        effect: { stress: -10, stamina: 5 },
        result: [{ t: 'good', m: '✔ 인정받는 느낌. 오늘 하루가 조금 밝아진다.' }]
      }
    ]
  },
  {
    id: 'resign_thought',
    title: '💭 퇴사 생각이 든다',
    condition: (p) => p.stress > 60,
    desc: [
      '\'이걸 왜 하고 있지?\'',
      '정말 퇴사하고 싶다는 생각이 스쳐간다.',
    ],
    choices: [
      {
        label: '▶ 구인 사이트를 몰래 열어본다',
        effect: { stress: -5, flag: 'lookingForJob' },
        result: [{ t: 'inner', m: '\'월급은 더 주는 데가 있네...\' 기웃거린다.' }]
      },
      {
        label: '▶ 참는다 (나만 힘든 게 아니야)',
        effect: { stress: -3, stamina: -5 },
        result: [{ t: 'inner', m: '\'조금만 더 버티자.\' 마음을 다잡는다.' }]
      },
      {
        label: '▶ 팀장에게 고충을 토로한다',
        effect: { stress: -8, relation_boss: 5 },
        result: [
          { t: 'npc', m: '팀장: "요즘 힘들었구나. 내가 신경을 못 썼네요."' },
          { t: 'good', m: '솔직하게 말하길 잘했다.' }
        ]
      }
    ]
  },
  {
    id: 'coworker_gossip',
    title: '🗣️ 동료가 뒷담화를 한다',
    desc: ['동료 B: "있잖아요... 사실 김 대리가 이번에..."'],
    choices: [
      {
        label: '▶ 같이 한다 (스트레스 해소)',
        effect: { stress: -8, flag: 'gossip' },
        result: [{ t: 'story', m: '시원하게 털어놨다. 단, 나중에 약점이 될 수도 있다.' }]
      },
      {
        label: '▶ "저 좀 바빠서요" 자리를 피한다',
        effect: { stress: 2 },
        result: [{ t: 'good', m: '✔ 현명한 선택. 뒷담화는 부메랑이다.' }]
      }
    ]
  },
  {
    id: 'freelance_deadline',
    title: '⏰ 프리랜서 마감이 다가온다',
    condition: (p) => p.employType === 'freelance',
    desc: ['클라이언트: "내일까지 수정본 주실 수 있어요? 급해서요."'],
    choices: [
      {
        label: '▶ 오늘 밤 새워서 마감 맞춘다',
        effect: { money: 300000, stamina: -25, stress: 15, flag: 'metDeadline' },
        result: [
          { t: 'money', m: '💰 프로젝트 수금 +300,000원!' },
          { t: 'bad', m: '✘ 하지만 체력이 바닥났다.' }
        ]
      },
      {
        label: '▶ 하루 연장 요청한다',
        effect: { stress: 8 },
        result: [{ t: 'story', m: '연장을 부탁했다. 클라이언트가 마지못해 수락했다.' }]
      }
    ]
  },
  {
    id: 'selfemploy_customer',
    title: '😤 진상 손님이 왔다',
    condition: (p) => p.employType === 'selfemploy',
    desc: ['손님: "이게 뭐예요? 영수증 어딨어요? 사장 나와요 사장!"'],
    choices: [
      {
        label: '▶ 정중하게 응대한다 (고객이 왕)',
        effect: { stress: 20, stamina: -5 },
        result: [{ t: 'bad', m: '✘ 진상은 계속된다... 스트레스가 폭발할 것 같다.' }]
      },
      {
        label: '▶ 단호하게 선을 긋는다',
        effect: { stress: 10 },
        result: [{ t: 'story', m: '정중하지만 단호하게 처리했다.' }]
      },
      {
        label: '▶ 환불해주고 보내버린다',
        effect: { money: -30000, stress: -5 },
        result: [{ t: 'good', m: '✔ 돈 주고 정신적 평화를 샀다. (-30,000원)' }]
      }
    ]
  },
  {
    id: 'raise_request',
    title: '💰 연봉 협상 기회!',
    desc: ['인사팀: "이번에 연봉 조정 희망 사항 있으시면 말씀해주세요."'],
    choices: [
      {
        label: '▶ 강하게 인상을 요구한다',
        effect: { stress: 8, money: 500000, flag: 'raisePending' },
        result: [{ t: 'money', m: '용기 있게 말했다. 검토해준다고 한다.' }]
      },
      {
        label: '▶ 적당히 현실적인 선에서 요구한다',
        effect: { stress: 3, money: 200000 },
        result: [{ t: 'good', m: '✔ 합리적인 요구. 기분 좋게 마무리됐다.' }]
      },
      {
        label: '▶ 아무 말도 못 한다',
        effect: { stress: 5 },
        result: [{ t: 'bad', m: '✘ 또 아무 말도 못 했다. 후회가 남는다.' }]
      }
    ]
  }
];

// ─── 하루 이벤트 스크립트 생성 함수 ──────────────────
function buildEventScript(profile) {
  const { hasKid, hasSpouse, job, home, company, employType } = profile;
  const commuteMin = home.commute;
  const isRemote = company.id === 'home';

  const events = [];

  // ── 01. 기상 ──────────────────────────────────────
  events.push({
    id: 'wake_up', time: '06:30', location: '🏠 집 — 침실',
    desc: [
      { t: 'time',  m: '[ 06:30 AM ] 알람이 울린다.' },
      { t: 'story', m: '오늘도 어김없이 직장인의 아침이 시작됐다.' },
      ...(hasSpouse ? [{ t: 'npc', m: '배우자: "음... 벌써 일어나야 해?" (반쯤 깬 목소리)' }] : []),
      ...(hasKid    ? [{ t: 'npc', m: '아이: (벌써 일어나서 돌아다니는 소리가 들린다)' }] : []),
    ],
    choices: [
      { label: '▶ 바로 일어난다 (6:30 칼기상)', type: 'normal',
        effect: { stress: -3, stamina: 0, time: 0 },
        result: [{ t: 'good', m: '✔ 의지력 발휘. 상쾌하게 하루 시작!' }] },
      { label: '▶ 10분 스누즈 (살짝만)', type: 'normal',
        effect: { stamina: 3, time: 10 },
        result: [{ t: 'story', m: '10분 더... 그래도 나쁘지 않다.' }] },
      { label: '▶ 30분 더 잔다 (피곤함 우선)', type: 'bad',
        effect: { stamina: 8, stress: 5, time: 30 },
        result: [{ t: 'bad', m: '✘ 30분이 사라졌다. 아침이 촉박해진다.' }] },
    ]
  });

  // ── 02. 아침 준비 ─────────────────────────────────
  events.push({
    id: 'morning_prep', time: '07:00', location: '🏠 집 — 주방/욕실',
    desc: [
      { t: 'time',  m: '[ 07:00 AM ] 아침을 준비할 시간이다.' },
      ...(hasSpouse ? [{ t: 'npc', m: '배우자: "밥은? 내가 차려줄까?"' }] : []),
      ...(hasKid ? [{ t: 'npc', m: '아이: "엄마/아빠 학교 가기 싫어~~~" (또 시작됐다)' }] : []),
    ],
    choices: [
      { label: '▶ 집밥 든든하게 먹는다', type: 'normal',
        effect: { stamina: 20, money: 0, time: 25 },
        result: [{ t: 'good', m: '✔ 든든한 아침. 점심까지 버틸 수 있다. (+20 체력)' }] },
      { label: '▶ 편의점 삼각김밥으로 때운다', type: 'normal',
        effect: { stamina: 7, money: -2000, time: 5 },
        result: [{ t: 'story', m: '빠르게 해결. 편의점 삼각김밥 2개. (-2,000원)' }] },
      { label: '▶ 굶는다 (시간 없음)', type: 'bad',
        effect: { stamina: -10, stress: 5, time: 0 },
        result: [{ t: 'bad', m: '✘ 공복 출근. 점심까지 배가 고프다.' }] },
      ...(hasKid ? [{ label: '▶ 아이 챙겨서 등교시키고 나간다', type: 'family',
        effect: { stamina: -3, time: 25, relation_kid: 8, flag: 'goodParent' },
        result: [{ t: 'relation', m: '💙 아이 등교 완료! 부모 점수 +8' }] }] : []),
    ]
  });

  // ── 03. 출근 이동 ─────────────────────────────────
  if (!isRemote) {
    events.push({
      id: 'commute', time: '07:40', location: `🚇 출근길 — ${home.type === 'walk' ? '도보' : home.type === 'ktx' ? 'KTX' : '대중교통'}`,
      desc: [
        { t: 'time',  m: `[ 07:40 AM ] 출근길에 오른다. (${commuteMin}분 소요 예정)` },
        ...(commuteMin >= 80 ? [{ t: 'bad', m: '오늘도 긴 출퇴근... 하루의 에너지가 여기서 소진된다.' }] : []),
        ...(commuteMin <= 10 ? [{ t: 'good', m: '직주근접의 여유로운 아침! 부러움의 대상이다.' }] : []),
      ],
      choices: [
        { label: `▶ ${home.type === 'walk' ? '도보로 걸어간다' : home.type === 'ktx' ? 'KTX 탑승' : '지하철/버스 탑승'}`,
          type: 'normal',
          effect: { stamina: -(Math.floor(commuteMin / 15)), stress: Math.floor(commuteMin / 20), money: -(commuteMin > 10 ? 1500 : 0), time: commuteMin },
          result: [{ t: 'story', m: `${commuteMin}분 후 도착. 오늘도 출근 성공.` }] },
        { label: '▶ 택시 타고 빠르게 간다', type: 'money',
          effect: { stamina: 0, stress: -3, money: -(commuteMin * 250), time: Math.floor(commuteMin * 0.6) },
          result: [{ t: 'money', m: `택시비 -${(commuteMin * 250).toLocaleString()}원. 편하게 도착.` }] },
        ...(commuteMin >= 40 ? [{ label: '▶ 이동 중 업무 이메일 처리한다', type: 'normal',
          effect: { stress: 5, stamina: -(Math.floor(commuteMin / 20)), money: -(commuteMin > 10 ? 1500 : 0), time: commuteMin, flag: 'diligent' },
          result: [{ t: 'good', m: '✔ 이동 중 메일 처리. 효율적이다.' }] }] : []),
        ...(commuteMin >= 40 ? [{ label: '▶ 이어폰 끼고 유튜브/팟캐스트 듣는다', type: 'normal',
          effect: { stress: -5, stamina: -(Math.floor(commuteMin / 20)), money: -(commuteMin > 10 ? 1500 : 0), time: commuteMin },
          result: [{ t: 'good', m: '이동 시간에 콘텐츠 소비. 나름 즐거웠다.' }] }] : []),
      ]
    });
  } else {
    events.push({
      id: 'commute_home', time: '09:00', location: '🏠 재택근무 시작',
      desc: [
        { t: 'time',  m: '[ 09:00 AM ] 재택근무 시작!' },
        { t: 'good', m: '출퇴근 없는 삶. 하지만 집과 사무실의 경계가 없는 삶.' },
      ],
      choices: [
        { label: '▶ 홈오피스 세팅하고 업무 시작', type: 'normal',
          effect: { stress: -5, stamina: 5 },
          result: [{ t: 'good', m: '✔ 집에서 일하는 쾌적함. 하지만 집안일이 눈에 밟힌다...' }] },
        { label: '▶ 잠옷 바람으로 노트북 켠다', type: 'normal',
          effect: { stress: -8, stamina: 3 },
          result: [{ t: 'story', m: '자유로운 재택근무 라이프. 하지만 집중력이 걱정된다.' }] },
      ]
    });
  }

  // ── 04. 출근길 돌발 이벤트 ─────────────────────────
  if (!isRemote && commuteMin > 15) {
    const commuteRandom = [
      {
        desc: [{ t: 'event', m: '⚡ 지하철이 10분 연착됐다! 신호 장애라고 한다.' }],
        choices: [
          { label: '▶ 기다린다', type: 'bad',
            effect: { stress: 10, time: 12 },
            result: [{ t: 'bad', m: '✘ 12분 지연. 스트레스가 쌓인다.' }] },
          { label: '▶ 버스로 우회한다', type: 'normal',
            effect: { stress: 7, money: -1200, time: 8 },
            result: [{ t: 'story', m: '버스로 돌아갔다. 비슷한 시간이 걸렸다.' }] },
        ]
      },
      {
        desc: [{ t: 'event', m: '☕ 편의점에서 아메리카노 1+1 행사 중이다!' }],
        choices: [
          { label: '▶ 커피 2잔 산다 (1잔은 동료에게)', type: 'money',
            effect: { stress: -5, stamina: 8, money: -2500, time: 5, flag: 'niceColleague' },
            result: [{ t: 'good', m: '☕ 커피 2잔. 하나는 동료에게 줄 예정! (-2,500원)' }] },
          { label: '▶ 내 것만 산다', type: 'normal',
            effect: { stress: -3, stamina: 6, money: -2000, time: 5 },
            result: [{ t: 'story', m: '커피 한 잔. 오늘 하루 버틸 수 있다. (-2,000원)' }] },
          { label: '▶ 지나친다 (절약)', type: 'normal',
            effect: { stress: 2 },
            result: [{ t: 'inner', m: '\'참아야 해... 1+1인데...\' 아쉽다.' }] },
        ]
      },
      {
        desc: [{ t: 'event', m: '📦 지하철에서 지갑이 떨어진 것을 발견했다.' }],
        choices: [
          { label: '▶ 경찰서/역무원에 신고한다', type: 'normal',
            effect: { stress: 3, time: 15, flag: 'honest' },
            result: [{ t: 'good', m: '✔ 양심적인 행동. 마음이 뿌듯하다.' }] },
          { label: '▶ 모른 척 지나친다', type: 'bad',
            effect: { stress: 5 },
            result: [{ t: 'inner', m: '\'내가 본 게 아닌 거야...\' 찜찜한 하루 시작.' }] },
        ]
      },
    ];
    const picked = commuteRandom[Math.floor(Math.random() * commuteRandom.length)];
    events.push({
      id: 'commute_event', time: '08:10', location: '🚇 출근길 — 돌발',
      desc: [{ t: 'time', m: '[ 08:10 AM ] 출근길에 예상치 못한 일이 생겼다!' }, ...picked.desc],
      choices: picked.choices
    });
  }

  // ── 05. 오전 업무 ─────────────────────────────────
  events.push({
    id: 'morning_work', time: '09:00', location: `💼 회사 — ${company.label}`,
    desc: [
      { t: 'time',  m: `[ 09:00 AM ] ${isRemote ? '재택 업무 시작.' : '사무실에 도착했다.'}` },
      { t: 'story', m: '오늘 업무를 시작한다. 이미 메일이 쌓여있다.' },
      ...(employType.id === 'parttime' ? [{ t: 'system', m: `[알바] 오늘 시작 시간 체크인. 시급 ${employType.dailyPay.toLocaleString()}원` }] : []),
      ...(employType.id === 'selfemploy' ? [{ t: 'system', m: '[사장님] 오늘 매출 목표를 설정한다.' }] : []),
    ],
    choices: [
      { label: '▶ 집중 업무 모드 (2시간 몰입)', type: 'normal',
        effect: { stress: 8, stamina: -12, time: 120, flag: 'diligent',
          money: employType.id === 'parttime' ? employType.dailyPay * 2 : 0 },
        result: [{ t: 'good', m: '✔ 집중해서 업무를 처리했다. 효율적인 오전이었다.' }] },
      { label: '▶ 커피 마시며 천천히 시작', type: 'normal',
        effect: { stress: 3, stamina: 3, money: -2000, time: 130 },
        result: [{ t: 'story', m: '커피로 정신 차리고 서서히 시작. 나쁘지 않은 페이스.' }] },
      { label: '▶ SNS/유튜브 보며 시간 때운다', type: 'bad',
        effect: { stress: -5, stamina: 0, time: 120 },
        result: [{ t: 'bad', m: '✘ 딴짓으로 오전이 날아갔다. 오후가 걱정된다.' }] },
      ...(employType.id === 'selfemploy' ? [{ label: '▶ 마케팅/홍보에 시간을 쏟는다', type: 'money',
        effect: { stress: 10, stamina: -8, money: 50000, time: 120 },
        result: [{ t: 'money', m: '💰 마케팅 효과로 추가 매출 +50,000원!' }] }] : []),
    ]
  });

  // ── 06. 오전 랜덤 이벤트 (부업/수익/가족) ─────────────
  const morningPoolAll = [
    ...SIDE_INCOME_EVENTS.filter(e => !e.condition || e.condition(profile)),
    ...WORK_EVENTS.filter(e => !e.condition || e.condition(profile)).slice(0, 3),
  ];
  if (morningPoolAll.length > 0) {
    const picked = morningPoolAll[Math.floor(Math.random() * morningPoolAll.length)];
    events.push({
      id: 'morning_random', time: '10:30', location: '📱 오전 — 알림/이벤트',
      desc: [
        { t: 'time', m: '[ 10:30 AM ] 폰에 알림이 왔다.' },
        { t: 'event', m: `⚡ ${picked.title}` },
        ...picked.desc.map(d => ({ t: 'story', m: d }))
      ],
      choices: picked.choices
    });
  }

  // ── 07. 점심 ──────────────────────────────────────
  events.push({
    id: 'lunch', time: '12:00', location: '🍱 점심 시간',
    desc: [
      { t: 'time',  m: '[ 12:00 PM ] 점심시간이다!' },
      { t: 'story', m: '오늘 점심은 어떻게 할까?' },
    ],
    choices: [
      { label: '▶ 동료들과 외식한다 (1만원대)', type: 'normal',
        effect: { stress: -10, stamina: 15, money: -12000, time: 60, flag: 'socialLunch' },
        result: [
          { t: 'good', m: '✔ 맛있는 점심 + 동료들과 수다. 오후 활력 충전!' },
          { t: 'npc', m: '동료: "오늘 팀장이 좀 예민한 것 같지 않아요?"' }
        ] },
      { label: '▶ 혼밥 (편의점/분식)', type: 'normal',
        effect: { stress: 2, stamina: 10, money: -5000, time: 30 },
        result: [{ t: 'story', m: '혼자 조용히 먹었다. 30분이 남는다. (-5,000원)' }] },
      { label: '▶ 배달 시켜서 자리에서 먹는다', type: 'normal',
        effect: { stress: -3, stamina: 12, money: -14000, time: 40 },
        result: [{ t: 'story', m: '치킨버거 + 감자튀김. 자리에서 먹는 호사. (-14,000원)' }] },
      { label: '▶ 점심 굶고 산책한다', type: 'normal',
        effect: { stress: -8, stamina: -5, money: 0, time: 40 },
        result: [{ t: 'good', m: '바람 쐬며 산책. 맑은 공기가 오후 집중력을 준다.' }] },
      ...(employType.id === 'parttime' ? [{ label: '▶ 알바 중 짧게 10분 쉰다', type: 'normal',
        effect: { stamina: 5, money: 0, time: 10 },
        result: [{ t: 'story', m: '짧은 휴식. 빠르게 복귀해야 한다.' }] }] : []),
      { label: '▶ 도시락 싸와서 먹는다 (절약!)', type: 'money',
        effect: { stress: -2, stamina: 12, money: 0, time: 25 },
        result: [{ t: 'good', m: '✔ 집에서 싸온 도시락. 건강하고 경제적이다!' }] },
    ]
  });

  // ── 08. 오후 업무/이벤트 ──────────────────────────
  events.push({
    id: 'afternoon_work', time: '14:00', location: `💼 오후 업무`,
    desc: [
      { t: 'time',  m: '[ 02:00 PM ] 오후 업무 시간이다.' },
      { t: 'story', m: '점심 식후 졸음과 싸우며 오후 업무를 시작한다.' },
    ],
    choices: [
      { label: '▶ 집중해서 업무 처리한다', type: 'normal',
        effect: { stress: 8, stamina: -12, time: 90, flag: 'diligent',
          money: employType.id === 'parttime' ? employType.dailyPay * 1.5 : 0 },
        result: [{ t: 'good', m: '✔ 오후 업무 처리 완료. 퇴근이 가까워진다.' }] },
      { label: '▶ 졸음과 싸우며 어떻게든 버틴다', type: 'bad',
        effect: { stress: 5, stamina: -8, time: 90 },
        result: [{ t: 'bad', m: '✘ 극도의 졸음... 어떻게든 버텼다.' }] },
      { label: '▶ 화장실에서 10분 쉬고 온다', type: 'normal',
        effect: { stress: -5, stamina: 5, time: 100 },
        result: [{ t: 'story', m: '\'화장실 쉬는 타임\'. 직장인의 유일한 안식처.' }] },
    ]
  });

  // ── 09. 오후 랜덤 이벤트 ──────────────────────────
  const afternoonPool = [
    ...WORK_EVENTS.filter(e => !e.condition || e.condition(profile)),
    ...FAMILY_EVENTS.filter(e => !e.condition || e.condition(profile)).slice(0, 2),
    ...SIDE_INCOME_EVENTS.filter(e => !e.condition || e.condition(profile)).slice(0, 2),
  ];
  if (afternoonPool.length > 0) {
    const picked2 = afternoonPool[Math.floor(Math.random() * afternoonPool.length)];
    events.push({
      id: 'afternoon_random', time: '16:00', location: '📱 오후 — 돌발 이벤트',
      desc: [
        { t: 'time', m: '[ 04:00 PM ] 뭔가 일이 터졌다.' },
        { t: 'event', m: `⚡ ${picked2.title}` },
        ...picked2.desc.map(d => ({ t: 'story', m: d }))
      ],
      choices: picked2.choices
    });
  }

  // ── 10. 퇴근 결정 ─────────────────────────────────
  events.push({
    id: 'leave_work', time: '18:00', location: `💼 퇴근 시간`,
    desc: [
      { t: 'time',  m: '[ 06:00 PM ] 드디어 퇴근 시간이다!' },
      { t: 'story', m: '가방을 챙긴다. 오늘 하루도 어떻게든 버텼다.' },
      ...(employType.id === 'fulltime' || employType.id === 'contract' ? [
        { t: 'inner', m: '\'칼퇴할까... 눈치 보일까...\'' }
      ] : []),
    ],
    choices: [
      { label: '▶ 칼퇴! (6시 정각)', type: 'good',
        effect: { stress: -5, stamina: 5,
          money: employType.id === 'parttime' ? employType.dailyPay * 2 : 0 },
        result: [{ t: 'good', m: '✔ 칼같이 퇴근! 자유다!!!' }] },
      { label: '▶ 30분 눈치 보다 나간다', type: 'bad',
        effect: { stress: 8, stamina: -5, time: 30 },
        result: [{ t: 'story', m: '눈치 30분 추가. 몸이 지쳐간다.' }] },
      { label: '▶ 야근한다 (2시간)', type: 'money',
        effect: { stress: 18, stamina: -15, time: 120, flag: 'didOvertime',
          money: employType.id === 'parttime' ? employType.dailyPay * 3 : 80000 },
        result: [
          { t: 'bad', m: '✘ 야근 시작... 퇴근이 멀어진다.' },
          { t: 'money', m: `💰 야근 수당 +${employType.id === 'parttime' ? (employType.dailyPay * 3).toLocaleString() : '80,000'}원` }
        ] },
      { label: '▶ 동료들과 퇴근 직전 커피 한 잔', type: 'normal',
        effect: { stress: -8, money: -3000, time: 20 },
        result: [{ t: 'good', m: '✔ 퇴근 전 커피 타임. 하루를 마무리하는 소소한 행복.' }] },
    ]
  });

  // ── 11. 퇴근길 ────────────────────────────────────
  if (!isRemote) {
    events.push({
      id: 'go_home', time: '18:30', location: `🚇 퇴근길`,
      desc: [
        { t: 'time', m: `[ 06:30 PM ] 퇴근길에 올랐다. 집까지 ${commuteMin}분.` },
        ...(commuteMin >= 60 ? [{ t: 'bad', m: '퇴근 후에도 긴 이동... 집에 가는 길이 멀다.' }] : []),
      ],
      choices: [
        { label: '▶ 바로 귀가한다', type: 'normal',
          effect: { stamina: -(Math.floor(commuteMin / 15)), stress: 3, money: -(commuteMin > 10 ? 1500 : 0), time: commuteMin },
          result: [{ t: 'story', m: `${commuteMin}분 후 집 도착.` }] },
        { label: '▶ 퇴근길에 장을 본다 (마트)', type: 'money',
          effect: { stamina: -8, money: -35000, time: commuteMin + 30, relation_spouse: 8 },
          result: [
            { t: 'money', m: '장 봤다. 냉장고가 채워진다. (-35,000원)' },
            ...(hasSpouse ? [{ t: 'relation', m: '💕 배우자가 좋아한다.' }] : [])
          ] },
        { label: '▶ 헬스장 들러서 운동한다', type: 'normal',
          effect: { stress: -12, stamina: 15, money: -8000, time: commuteMin + 70 },
          result: [{ t: 'good', m: '✔ 운동으로 스트레스 해소! (-8,000원)' }] },
        { label: '▶ 동료들과 퇴근 후 한 잔', type: 'money',
          effect: { stress: -18, stamina: -12, money: -35000, time: commuteMin + 90, relation_spouse: hasSpouse ? -5 : 0 },
          result: [
            { t: 'good', m: '✔ 치맥과 함께 스트레스 해소! (-35,000원)' },
            ...(hasSpouse ? [{ t: 'bad', m: '⚡ 귀가 시간이 늦어진다. 배우자가 걱정할 것 같다.' }] : [])
          ] },
        { label: '▶ 당근마켓 직거래한다 (퇴근길)', type: 'money',
          effect: { money: 30000, time: commuteMin + 20, stamina: -3 },
          result: [{ t: 'money', m: '💰 당근 직거래 성공! +30,000원' }] },
      ]
    });
  }

  // ── 12. 귀가 후 집안일 ────────────────────────────
  events.push({
    id: 'home_chores', time: '19:30', location: '🏠 집 — 귀가',
    desc: [
      { t: 'time',  m: '[ 07:30 PM ] 집에 도착했다.' },
      { t: 'story', m: '소파에 쓰러지고 싶다. 하지만 해야 할 일이 있다...' },
      ...(hasSpouse ? [{ t: 'npc', m: '배우자: "왔어? 오늘 집안일 좀 도와줄 수 있어?"' }] : []),
    ],
    choices: [
      { label: '▶ 설거지 + 빨래 한다 (집안일 처리)', type: 'family',
        effect: { stamina: -8, time: 35, relation_spouse: 12, choresDone: ['dishes', 'laundry'] },
        result: [
          { t: 'good', m: '✔ 설거지 + 빨래 완료!' },
          ...(hasSpouse ? [{ t: 'relation', m: '💕 배우자 관계 +12' }] : [])
        ] },
      { label: '▶ 청소기 돌리고 쓰레기 버린다', type: 'family',
        effect: { stamina: -7, time: 30, relation_spouse: 10, choresDone: ['vacuum', 'trash'] },
        result: [{ t: 'good', m: '✔ 청소 완료! 집이 깨끗해졌다.' }] },
      { label: '▶ 저녁 요리를 직접 한다', type: 'family',
        effect: { stamina: -10, time: 45, money: -15000, relation_spouse: 15, relation_kid: 8, choresDone: ['cook'] },
        result: [
          { t: 'good', m: '✔ 집밥 완성! 가족이 행복해한다.' },
          { t: 'relation', m: '💕 가족 관계 크게 상승!' }
        ] },
      { label: '▶ 일단 좀 쉰다 (피곤하니까)', type: 'bad',
        effect: { stamina: 10, stress: -5, relation_spouse: -5 },
        result: [{ t: 'bad', m: '✘ 집안일 미뤘다. 배우자의 한숨 소리가 들린다.' }] },
      { label: '▶ 배달 시키고 쉰다', type: 'normal',
        effect: { stamina: 5, money: -20000, relation_spouse: 2 },
        result: [{ t: 'story', m: '배달로 해결. 몸은 편하지만 지출이 아프다. (-20,000원)' }] },
    ]
  });

  // ── 13. 가족 시간 ─────────────────────────────────
  const familyEv = FAMILY_EVENTS.filter(e => !e.condition || e.condition(profile));
  if (familyEv.length > 0) {
    const fe = familyEv[Math.floor(Math.random() * familyEv.length)];
    events.push({
      id: 'family_time', time: '20:00', location: '🏠 집 — 가족 시간',
      desc: [
        { t: 'time',  m: '[ 08:00 PM ] 저녁 식사 후 가족 시간이다.' },
        { t: 'event', m: `💬 ${fe.title}` },
        ...fe.desc.map(d => ({ t: 'npc', m: d }))
      ],
      choices: fe.choices.filter(c => !c.condition || c.condition(profile))
    });
  }

  // ── 14. 저녁 부업/수익 이벤트 ───────────────────────
  const eveningIncomePool = SIDE_INCOME_EVENTS.filter(e => !e.condition || e.condition(profile));
  if (eveningIncomePool.length > 0) {
    const ei = eveningIncomePool[Math.floor(Math.random() * eveningIncomePool.length)];
    events.push({
      id: 'evening_income', time: '21:00', location: '📱 저녁 — 부업/수익',
      desc: [
        { t: 'time',  m: '[ 09:00 PM ] 저녁 시간, 폰을 열었다.' },
        { t: 'event', m: `💸 ${ei.title}` },
        ...ei.desc.map(d => ({ t: 'story', m: d }))
      ],
      choices: ei.choices
    });
  }

  // ── 15. 취침 전 ────────────────────────────────────
  events.push({
    id: 'night_routine', time: '22:00', location: '🏠 집 — 취침 전',
    desc: [
      { t: 'time',  m: '[ 10:00 PM ] 하루가 끝나간다.' },
      { t: 'story', m: '내일도 출근인데... 오늘 하루를 어떻게 마무리할까?' },
    ],
    choices: [
      { label: '▶ 일찍 잠든다 (수면 우선)', type: 'normal',
        effect: { stamina: 25, stress: -8, flag: 'earlyBed' },
        result: [{ t: 'good', m: '✔ 현명한 선택. 내일을 위해 충전!' }] },
      { label: '▶ 유튜브/넷플릭스 보다 잔다', type: 'normal',
        effect: { stress: -15, stamina: -5 },
        result: [{ t: 'story', m: '알고리즘에 빠져 어느새 12시다. 내일이 걱정된다.' }] },
      ...(hasSpouse ? [{ label: '▶ 배우자와 오늘 하루 이야기 나눈다', type: 'family',
        effect: { stress: -18, relation_spouse: 12, time: 45 },
        result: [
          { t: 'npc', m: '배우자: "오늘도 수고했어. 정말."' },
          { t: 'relation', m: '💕 배우자와의 소중한 시간.' }
        ] }] : []),
      ...(hasKid ? [{ label: '▶ 아이에게 책 읽어준다', type: 'family',
        effect: { stress: -10, relation_kid: 15, stamina: -3, time: 30, flag: 'goodParent' },
        result: [
          { t: 'npc', m: '아이: "또 읽어줘! 제발~"' },
          { t: 'relation', m: '💙 아이와의 소중한 순간.' }
        ] }] : []),
      { label: '▶ 내일 걱정하며 뒤척인다', type: 'bad',
        effect: { stress: 12, stamina: -8 },
        result: [{ t: 'bad', m: '✘ 내일 회의 생각, 돈 걱정... 잠이 안 온다.' }] },
      { label: '▶ 가계부 정리한다 (오늘 지출 확인)', type: 'money',
        effect: { stress: 5, stamina: -2, flag: 'checkedBudget' },
        result: [{ t: 'money', m: '가계부 정리 완료. 오늘도 열심히 살았다.' }] },
    ]
  });

  return events;
}
