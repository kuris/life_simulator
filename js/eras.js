// =============================================
//  대한민국 직장인 생존기 — 시대 데이터 v3.0
// =============================================

const ERAS = [
  // ── 1980년대 ──────────────────────────────────
  {
    id: '1980',
    cssClass: 'era-1980',
    icon: '📻',
    name: '1980년대',
    years: '1980~1989',
    title: '한강의 기적, 그 이면',
    tagline: '"공장 굴뚝이 희망이던 시절"',
    fate: '버티면 집을 살 수 있는 시대',
    recommend: false,
    difficulty: { stamina: 5, stress: 3, money: 2, overall: '★★★★☆', label: '체력 소모 높음' },
    preview: {
      lines: [
        '월급은 적지만 물가도 낮습니다.',
        '야근은 기본, 불평은 사치입니다.',
        '버티면 자산 상승의 기회가 찾아옵니다.',
      ],
      life: [
        '→ 평생 한 직장에서 일할 가능성이 높습니다.',
        '→ 가족을 위해 묵묵히 희생하는 삶이 됩니다.',
        '→ 퇴직할 때쯤 집 한 채를 손에 쥘 수 있습니다.',
      ],
    },
    desc: '군사정권 아래 경제 고도성장. 새벽 4시 공장 사이렌. 야근은 당연하고, 불평은 금지. 연봉 협상? 그런 거 없음.',
    econ: {
      wage:        150000,
      jajangmyeon: 500,
      bus:         50,
      coffee:      200,
      rent:        30000,
      beer:        300,
      rice:        20000,
      cigarette:   200,
    },
    econLabel: [
      { k:'월급 (평균)', v:'15만원' },
      { k:'버스비', v:'50원' },
      { k:'짜장면', v:'500원' },
      { k:'담배 한 갑', v:'200원' },
    ],
    jobs: [
      { id:'factory',  label:'공장 근로자 (산업역군)',  icon:'🏭', dailyPay:5000,  stress:4, desc:'새벽 출근, 야근 기본. 하지만 취직됐다는 것만으로도 행복.' },
      { id:'bank',     label:'은행원 (엘리트)',          icon:'🏦', dailyPay:8000,  stress:2, desc:'당시 최고 엘리트 직업. 양복 필수, 머리는 항상 단정.' },
      { id:'govt',     label:'공무원 (철밥통)',          icon:'📋', dailyPay:6000,  stress:1, desc:'박봉이지만 절대 안 잘린다. 부모님의 로망.' },
      { id:'trader',   label:'시장 상인 / 장사꾼',       icon:'🏪', dailyPay:7000,  stress:3, desc:'남대문·동대문 새벽 시장. 발품이 곧 돈이다.' },
      { id:'teacher',  label:'초등학교 교사',            icon:'📚', dailyPay:7500,  stress:2, desc:'존경받는 직업. 촌지 문화가 아직 남아있던 시절.' },
      { id:'soldier',  label:'직업 군인',                icon:'🪖', dailyPay:4000,  stress:3, desc:'국가가 먹여 살려준다. 하지만 자유는 없다.' },
    ],
    homeLocations: [
      { id:'company_dorm', label:'회사 기숙사 (무료)',    commute:5,   rent:0,     type:'walk' },
      { id:'jjokbang',     label:'쪽방 (목욕탕 공용)',    commute:20,  rent:5000,  type:'walk' },
      { id:'rental_room',  label:'하숙집 (밥 포함)',      commute:30,  rent:15000, type:'bus' },
      { id:'parents_home', label:'부모님 댁 (경기도)',    commute:60,  rent:0,     type:'bus' },
    ],
    historicEvent: null,
    atmosphere: [
      '새마을 운동 포스터가 건물마다 붙어있다.',
      '라디오에서는 트로트가 흘러나온다.',
      '복사기 한 대에 부서 전체가 줄을 선다.',
      '"빨리빨리" 문화가 한창 형성되던 시절.',
      '야근하다 새벽 버스를 놓치면 그냥 사무실에서 잔다.',
    ],
  },

  // ── 1997년 IMF ────────────────────────────────
  {
    id: '1997',
    cssClass: 'era-1997',
    icon: '💥',
    name: '1997년 IMF 외환위기',
    years: '1997~1999',
    title: '하루아침에 무너진 것들',
    tagline: '"평생직장이라 믿었는데..."',
    fate: '한순간에 모든 것이 무너질 수 있는 시대',
    recommend: false,
    difficulty: { stamina: 4, stress: 5, money: 5, overall: '★★★★★', label: '최고 난이도' },
    preview: {
      lines: [
        '언제 해고될지 모르는 공포 속에 삽니다.',
        '회사가 살아남을지도 불확실합니다.',
        '금 반지를 헌납하는 사람들이 넘칩니다.',
      ],
      life: [
        '→ 구조조정의 칼날이 언제든 당신을 향할 수 있습니다.',
        '→ 한 달 치 월급이 생존의 전부일 수 있습니다.',
        '→ 이 시대를 버텨낸다면 진짜 강해집니다.',
      ],
    },
    desc: '1997년 11월. IMF 구제금융 신청. 회사들이 줄줄이 쓰러지고, 구조조정의 칼날이 날아다닌다. 금 모으기 운동에 국민들이 결혼반지를 내놓는다.',
    econ: {
      wage:        1800000,
      jajangmyeon: 2500,
      bus:         500,
      coffee:      1000,
      rent:        250000,
      beer:        1500,
      rice:        40000,
      cigarette:   1500,
    },
    econLabel: [
      { k:'월급 (평균)', v:'180만원' },
      { k:'버스비', v:'500원' },
      { k:'짜장면', v:'2,500원' },
      { k:'담배 한 갑', v:'1,500원' },
    ],
    jobs: [
      { id:'corp_worker', label:'대기업 직원 (구조조정 대상)', icon:'🏢', dailyPay:80000,  stress:5, desc:'언제 잘릴지 모른다. 매달 구조조정 명단이 돌아다닌다.' },
      { id:'salaryman',   label:'중소기업 사원',               icon:'💼', dailyPay:60000,  stress:4, desc:'회사 자체가 살아남을지 모른다. 매일 아슬아슬.' },
      { id:'self_employ', label:'자영업자 (식당)',              icon:'🍜', dailyPay:50000,  stress:5, desc:'손님이 반으로 줄었다. 임대료는 그대로다.' },
      { id:'dismissed',   label:'갓 해고된 직장인',            icon:'📦', dailyPay:0,      stress:8, desc:'사직서를 받았다. 퇴직금 300만원이 전부다. 재취업을 노린다.' },
      { id:'finance',     label:'금융권 직원',                 icon:'💰', dailyPay:100000, stress:6, desc:'은행이 합병되고 있다. 내 자리도 없어질지 모른다.' },
      { id:'civil_serv',  label:'공무원 (유일한 안전지대)',    icon:'🏛', dailyPay:70000,  stress:2, desc:'세상이 뒤집혀도 공무원은 안 잘린다. 친구들의 부러움.' },
    ],
    homeLocations: [
      { id:'rent_apt',    label:'월세 아파트 (강남)',     commute:30, rent:350000, type:'subway' },
      { id:'rent_villa',  label:'빌라 전세 (강북)',       commute:40, rent:200000, type:'subway' },
      { id:'parents_imf', label:'부모님 집 (IMF로 귀환)', commute:60, rent:0,      type:'bus' },
      { id:'goshiwon',    label:'고시원 (재취업 준비)',   commute:20, rent:150000, type:'walk' },
    ],
    historicEvent: {
      id: 'imf_crisis',
      trigger: 8,
      title: '💥 IMF 외환위기 발생!',
      log: [
        { t:'history', m:'══════════════════════════════════' },
        { t:'history', m:'  💥 1997년 11월 21일' },
        { t:'history', m:'  IMF 구제금융 신청 확정' },
        { t:'history', m:'══════════════════════════════════' },
        { t:'bad',     m:'라디오: "정부가 IMF에 210억 달러 구제금융을 신청했습니다."' },
        { t:'bad',     m:'회사 메신저: "오늘 오후 2시, 전 직원 긴급 회의"' },
        { t:'inner',   m:'\'설마... 우리 회사도?\'' },
      ],
      choices: [
        {
          label: '▶ 회의에서 적극적으로 살아남기 전략을 펼친다',
          type: 'history',
          effect: { stress:15, flag:'survived_imf' },
          result: [
            { t:'good',    m:'용기 있게 회의에서 말했다. 팀장이 눈여겨본다.' },
            { t:'history', m:'→ 구조조정 1차 명단에서 이름이 빠졌다...' },
          ]
        },
        {
          label: '▶ 조용히 있으면서 눈에 안 띄게 버틴다',
          type: 'normal',
          effect: { stress:20 },
          result: [
            { t:'story', m:'조용히 버텼다. 아직 내 이름은 없다...' },
            { t:'inner', m:'\'1차는 넘겼다. 2차가 언제 올지 모르지만.\'' },
          ]
        },
        {
          label: '▶ 선제적으로 이직/창업을 준비한다',
          type: 'money',
          effect: { stress:10, flag:'proactive_job', money:-100000 },
          result: [
            { t:'good',  m:'이직 준비를 시작했다. 미리 움직이는 게 낫다.' },
            { t:'money', m:'이력서 작성 비용, 자격증 준비비 -100,000원' },
          ]
        },
        {
          label: '▶ 금 모으기 운동에 동참한다 (금반지 헌납)',
          type: 'history',
          effect: { stress:-5, money:-50000, flag:'gold_donation' },
          result: [
            { t:'history', m:'금 모으기 운동 동참. 결혼반지를 내놓았다.' },
            { t:'good',    m:'나라를 위해 내가 할 수 있는 일을 했다.' },
          ]
        },
      ]
    },
    atmosphere: [
      '"부도" "구조조정" "정리해고" 뉴스가 매일 터진다.',
      '지하철에 실직자들이 눈에 띄게 늘었다.',
      '편의점 봉지라면이 저녁 식사가 된 사람들.',
      '금 모으기 운동 — 국민들이 자발적으로 결혼반지를 내놓는다.',
      '대기업들이 하루아침에 사라진다.',
    ],
  },

  // ── 2000년대 ──────────────────────────────────
  {
    id: '2000',
    cssClass: 'era-2000',
    icon: '💻',
    name: '2000년대 IT 붐',
    years: '2000~2009',
    title: '인터넷이 세상을 바꾼다',
    tagline: '"닷컴으로 억대 연봉, 아니면 닷컴 실패"',
    fate: '도전하면 대박, 망설이면 그냥 월급쟁이',
    recommend: false,
    difficulty: { stamina: 3, stress: 3, money: 3, overall: '★★★☆☆', label: '표준 난이도' },
    preview: {
      lines: [
        'IT만 알면 몸값이 치솟는 시대입니다.',
        '벤처 창업 한 번이면 인생역전 가능.',
        '하지만 닷컴 버블이 모든 걸 날릴 수도 있습니다.',
      ],
      life: [
        '→ 코딩을 배우면 시대의 승자가 됩니다.',
        '→ 투자 타이밍을 잘못 잡으면 빚더미에 앉습니다.',
        '→ PC방 사업으로 대박을 노려볼 수도 있습니다.',
      ],
    },
    desc: '코스닥 열풍, 벤처 붐. 인터넷 회사 차리면 억만장자 꿈. 하지만 닷컴 버블 붕괴도 현실. IT 개발자는 새 엘리트.',
    econ: {
      wage:        2200000,
      jajangmyeon: 3500,
      bus:         700,
      coffee:      2500,
      rent:        450000,
      beer:        2500,
      rice:        55000,
      cigarette:   2500,
    },
    econLabel: [
      { k:'월급 (평균)', v:'220만원' },
      { k:'버스비', v:'700원' },
      { k:'짜장면', v:'3,500원' },
      { k:'아메리카노', v:'2,500원' },
    ],
    jobs: [
      { id:'it_dev',    label:'IT 개발자 (코딩 신인류)',  icon:'💻', dailyPay:120000, stress:3, desc:'야후, 네이버, 다음이 막 뜨던 시절. 개발자는 신이다.' },
      { id:'venture',   label:'벤처기업 창업자',          icon:'🚀', dailyPay:0,      stress:5, desc:'투자 받으면 떼돈, 못 받으면 거지. 극과 극의 삶.' },
      { id:'portal',    label:'포털사이트 직원',          icon:'🌐', dailyPay:100000, stress:2, desc:'네이버·다음 직원. 최고의 인기 직장 중 하나.' },
      { id:'academy',   label:'학원 강사',                icon:'📚', dailyPay:80000,  stress:3, desc:'사교육 열풍. 영어·수학 강사는 연봉 억대도 가능.' },
      { id:'corp_2000', label:'대기업 공채 사원',         icon:'🏢', dailyPay:90000,  stress:3, desc:'IMF 이후 취업 문 더 좁아졌다. 들어가면 안정.' },
      { id:'game_dev',  label:'게임 개발자',              icon:'🎮', dailyPay:95000,  stress:4, desc:'리니지, 스타크래프트 시절. 야근은 기본, 열정은 필수.' },
    ],
    homeLocations: [
      { id:'apt_gangnam', label:'강남 아파트 (월세)',   commute:25, rent:600000,  type:'subway' },
      { id:'villa_2000',  label:'빌라 (이태원/홍대)',   commute:35, rent:400000,  type:'subway' },
      { id:'officetel',   label:'오피스텔 (강남/판교)', commute:15, rent:500000,  type:'walk' },
      { id:'share_house', label:'쉐어하우스 (동기들과)',commute:40, rent:250000,  type:'subway' },
    ],
    historicEvent: {
      id: 'dotcom_bubble',
      trigger: 7,
      title: '📉 닷컴 버블 붕괴!',
      log: [
        { t:'history', m:'══════════════════════════════════' },
        { t:'history', m:'  📉 2001년 닷컴 버블 붕괴' },
        { t:'history', m:'  코스닥 -80% 폭락' },
        { t:'history', m:'══════════════════════════════════' },
        { t:'bad',     m:'스팸처럼 받던 벤처 투자 문의가 갑자기 뚝 끊겼다.' },
        { t:'bad',     m:'동료들이 하나둘 회사를 떠나기 시작한다.' },
        { t:'inner',   m:'\'우리 회사 주식이... 휴지가 됐다.\'' },
      ],
      choices: [
        {
          label: '▶ 대기업으로 이직을 서두른다',
          type: 'normal',
          effect: { stress:12, money:-50000, flag:'safe_job' },
          result: [{ t:'good', m:'빠르게 대기업 이직 준비. 안정을 선택했다.' }]
        },
        {
          label: '▶ 벤처 정신으로 버틴다',
          type: 'history',
          effect: { stress:20, flag:'venture_spirit' },
          result: [
            { t:'story', m:'버티기로 했다. 진짜 실력 있는 사람은 살아남는다.' },
            { t:'inner', m:'\'포기는 없다. 인터넷의 미래는 밝다.\'' },
          ]
        },
        {
          label: '▶ 해외 취업을 알아본다',
          type: 'history',
          effect: { stress:8, money:-200000, flag:'overseas_job' },
          result: [
            { t:'good',  m:'실리콘밸리... 꿈이지만 가능성은 있다.' },
            { t:'money', m:'여권, 영어 공부비 -200,000원' },
          ]
        },
      ]
    },
    atmosphere: [
      '사무실마다 버블티 가게가 생겼다.',
      'PC방이 전국에 우후죽순 생겨난다.',
      '대화명에 "야후 메신저"를 쓰던 시절.',
      '폴더폰이 최신 기기. 문자 10원, 전화 분당 30원.',
      '"닷컴" 이름만 달면 투자가 몰렸다.',
    ],
  },

  // ── 2010년대 ──────────────────────────────────
  {
    id: '2010',
    cssClass: 'era-2010',
    icon: '📱',
    name: '2010년대',
    years: '2010~2019',
    title: '스마트폰이 모든 걸 바꿨다',
    tagline: '"카카오톡 단톡방에서 퇴근 후 업무 지시"',
    fate: '연결된 세상에서 퇴근은 없다',
    recommend: false,
    difficulty: { stamina: 3, stress: 4, money: 3, overall: '★★★★☆', label: '멘탈 소모 높음' },
    preview: {
      lines: [
        '퇴근 후에도 카카오톡 업무 지시가 옵니다.',
        '유튜브로 인생역전을 노릴 수 있습니다.',
        '청년 취업난이 시작됩니다.',
      ],
      life: [
        '→ 스마트폰 하나로 세상과 연결된 삶입니다.',
        '→ 야근과 카톡 사이에서 번아웃이 찾아옵니다.',
        '→ 부업과 콘텐츠로 새로운 수익을 만들 수 있습니다.',
      ],
    },
    desc: '아이폰 충격, SNS 시대. 카카오 메신저로 24시간 연결. 유튜브로 1인 창작자 등장. 하지만 청년 취업난도 심화.',
    econ: {
      wage:        2800000,
      jajangmyeon: 5000,
      bus:         1250,
      coffee:      4000,
      rent:        800000,
      beer:        4000,
      rice:        60000,
      cigarette:   4500,
    },
    econLabel: [
      { k:'월급 (평균)', v:'280만원' },
      { k:'버스비', v:'1,250원' },
      { k:'짜장면', v:'5,000원' },
      { k:'카페 아메리카노', v:'4,000원' },
    ],
    jobs: [
      { id:'mobile_dev',  label:'모바일 앱 개발자',  icon:'📱', dailyPay:150000, stress:3, desc:'앱 하나로 억대 수익. 카카오게임즈 출신이면 명함값 한다.' },
      { id:'youtuber_10', label:'유튜버 (초창기)',    icon:'📹', dailyPay:0,      stress:3, desc:'아직 수익화 초기. 재미로 시작했다가 대박 날 수도.' },
      { id:'startup',     label:'스타트업 직원',     icon:'🚀', dailyPay:110000, stress:4, desc:'스톡옵션이 꿈이다. 하지만 야근이 일상.' },
      { id:'influencer',  label:'SNS 인플루언서',    icon:'📸', dailyPay:0,      stress:2, desc:'팔로워 10만명이면 협찬이 들어온다. 새로운 직업.' },
      { id:'corp_2010',   label:'대기업 사원',       icon:'🏢', dailyPay:130000, stress:3, desc:'여전히 선망의 대상. 카카오·네이버는 최고 인기.' },
      { id:'delivery_10', label:'배달/물류 기사',    icon:'🛵', dailyPay:120000, stress:3, desc:'쿠팡·배민 초창기. 몸은 힘들지만 수입은 나쁘지 않다.' },
    ],
    homeLocations: [
      { id:'officetel_2',  label:'오피스텔 (신도시)',   commute:30, rent:700000,  type:'subway' },
      { id:'share_2010',   label:'쉐어하우스 (유행)',   commute:35, rent:400000,  type:'subway' },
      { id:'parents_2010', label:'부모님 집 (캥거루족)',commute:70, rent:0,       type:'bus' },
      { id:'oneroom',      label:'원룸 (혼자 살기)',    commute:25, rent:550000,  type:'subway' },
    ],
    historicEvent: {
      id: 'kakao_culture',
      trigger: 6,
      title: '📱 퇴근 후 카톡 업무 지시',
      log: [
        { t:'history', m:'[ 오후 11시 30분 — 카카오톡 알림 ]' },
        { t:'bad',     m:'팀장: "혹시 지금 내일 발표 자료 수정 가능해요?"' },
        { t:'bad',     m:'"급해서요 ^^ 오늘 밤까지 되면 좋겠는데..."' },
        { t:'inner',   m:'\'밤 11시에... 이게 맞나?\'' },
      ],
      choices: [
        {
          label: '▶ "네 알겠습니다" 하고 야근한다',
          type: 'bad',
          effect: { stress:20, stamina:-15, flag:'midnight_work' },
          result: [
            { t:'bad',   m:'새벽 2시에 겨우 완성했다. 내일 출근이 걱정된다.' },
            { t:'inner', m:'\'이러다 번아웃 온다...\'' },
          ]
        },
        {
          label: '▶ 읽씹한다 (안 읽은 척)',
          type: 'normal',
          effect: { stress:8 },
          result: [
            { t:'story', m:'읽음 표시를 피해 안 읽은 척했다.' },
            { t:'inner', m:'\'내일 핑계를 생각해둬야겠다...\'' },
          ]
        },
        {
          label: '▶ "근무시간 외 업무는 어렵습니다" 정중히 거절',
          type: 'history',
          effect: { stress:12, flag:'work_life_balance' },
          result: [
            { t:'good', m:'용기 있게 경계선을 그었다.' },
            { t:'bad',  m:'...팀장의 다음날 태도가 차가워졌다.' },
          ]
        },
      ]
    },
    atmosphere: [
      '카카오톡 단톡방 — 퇴근 후에도 일이 끊이지 않는다.',
      '"인스타 감성" "맛집 사진" 이 단어들이 일상어가 됐다.',
      '지하철에서 모두가 스마트폰만 보고 있다.',
      '배달 앱이 등장하면서 짜장면 배달비가 생겼다.',
      '유튜브로 첫 수익을 낸 사람들의 이야기가 화제.',
    ],
  },

  // ── 2020년 코로나 ──────────────────────────────
  {
    id: '2020',
    cssClass: 'era-2020',
    icon: '🦠',
    name: '2020년 코로나 팬데믹',
    years: '2020~2022',
    title: '모든 것이 멈췄다',
    tagline: '"오늘 매출 0원... 임대료는 내일도 나온다"',
    fate: '살아남는 방식이 완전히 바뀌는 시대',
    recommend: false,
    difficulty: { stamina: 3, stress: 5, money: 4, overall: '★★★★☆', label: '스트레스 극한' },
    preview: {
      lines: [
        '마스크 없이는 건물에 들어갈 수 없습니다.',
        '자영업자는 매출 0을 각오해야 합니다.',
        '배달·재택 업종은 오히려 대박입니다.',
      ],
      life: [
        '→ 직업 선택이 생사를 가릅니다.',
        '→ 집에서 모든 걸 해결해야 하는 삶입니다.',
        '→ 재난지원금과 배달앱이 유일한 위안이 됩니다.',
      ],
    },
    desc: '갑자기 닥친 팬데믹. 재택근무 원년. 자영업자는 무너지고 배달·플랫폼은 폭발 성장. 마스크 없이는 밖을 못 나간다.',
    econ: {
      wage:        3200000,
      jajangmyeon: 6000,
      bus:         1300,
      coffee:      4500,
      rent:        1000000,
      beer:        5000,
      rice:        65000,
      cigarette:   4500,
    },
    econLabel: [
      { k:'월급 (평균)', v:'320만원' },
      { k:'버스비', v:'1,300원' },
      { k:'짜장면', v:'6,000원' },
      { k:'아메리카노', v:'4,500원' },
    ],
    jobs: [
      { id:'remote',     label:'재택근무 직장인',    icon:'🏠', dailyPay:150000, stress:2, desc:'화상회의로 일한다. 집이 사무실. 집중력이 떨어진다.' },
      { id:'baemin',     label:'배달 플랫폼 라이더', icon:'🛵', dailyPay:180000, stress:3, desc:'팬데믹에 배달 주문 폭발. 몸은 힘들지만 수입은 짭짤.' },
      { id:'restaurant', label:'식당 자영업자',      icon:'🍜', dailyPay:0,      stress:6, desc:'손님이 오지 않는다. 매출 0에 임대료는 나간다.' },
      { id:'nurse',      label:'의료진 (간호사)',    icon:'🏥', dailyPay:160000, stress:7, desc:'코로나 최전선. 몸과 마음이 모두 한계.' },
      { id:'streamer',   label:'스트리머 / 유튜버',  icon:'📹', dailyPay:0,      stress:2, desc:'비대면 시대. 콘텐츠 소비가 폭발. 이 타이밍에 터지면 대박.' },
      { id:'ecommerce',  label:'쇼핑몰 사업자',     icon:'📦', dailyPay:100000, stress:3, desc:'비대면 쇼핑 폭발. 잘 되면 대박, 못 되면 재고가 문제.' },
    ],
    homeLocations: [
      { id:'home_office',  label:'내 집 (재택근무 세팅)',  commute:0,  rent:1000000, type:'home' },
      { id:'apt_2020',     label:'아파트 (거리두기)',      commute:30, rent:900000,  type:'subway' },
      { id:'oneroom_2020', label:'원룸 (혼자 코로나 버팀)',commute:25, rent:600000,  type:'subway' },
      { id:'parents_2020', label:'부모님 집 (코로나 귀향)',commute:60, rent:0,       type:'bus' },
    ],
    historicEvent: {
      id: 'covid_lockdown',
      trigger: 5,
      title: '🦠 사회적 거리두기 강화!',
      log: [
        { t:'history', m:'══════════════════════════════════' },
        { t:'history', m:'  🦠 사회적 거리두기 4단계 발령' },
        { t:'history', m:'  오후 6시 이후 2인 이상 집합 금지' },
        { t:'history', m:'══════════════════════════════════' },
        { t:'bad',     m:'문자: "코로나19 방역수칙 위반 시 벌금 10만원"' },
        { t:'story',   m:'식당들이 오후 6시 이후 영업을 못 한다.' },
        { t:'inner',   m:'\'이게 도대체 언제 끝나는 거야...\'' },
      ],
      choices: [
        {
          label: '▶ 철저히 방역수칙 지킨다 (집콕)',
          type: 'normal',
          effect: { stress:15, stamina:-5, flag:'covid_safe' },
          result: [
            { t:'good',  m:'안전하게 집에 있었다. 하지만 외로움이 밀려온다.' },
            { t:'story', m:'배달 앱이 친구가 됐다.' }
          ]
        },
        {
          label: '▶ 배달 앱으로 모든 걸 해결한다',
          type: 'money',
          effect: { stress:-5, money:-50000, flag:'delivery_life' },
          result: [
            { t:'money', m:'배달비 포함 식비 -50,000원. 하지만 편하다.' },
            { t:'story', m:'배달 라이더가 유일한 대면 접촉이다.' }
          ]
        },
        {
          label: '▶ [자영업자] 무시하고 영업을 계속한다',
          type: 'history',
          condition: function(p) { return p.job.id === 'restaurant'; },
          effect: { stress:10, money:100000, flag:'illegal_operation' },
          result: [
            { t:'bad',   m:'단속반이 와서 경고장을 받았다.' },
            { t:'money', m:'하지만 오늘 매출 +100,000원. 생존이다.' }
          ]
        },
      ]
    },
    atmosphere: [
      '마스크를 쓰지 않으면 건물에 못 들어간다.',
      '화상회의에서 화장실 소리가 들리는 해프닝.',
      '"거리두기" 스티커가 모든 의자에 붙어있다.',
      '손소독제가 금처럼 귀하던 시절.',
      '치킨 배달이 1시간 이상 걸린다. 수요 폭발.',
    ],
  },

  // ── 2026년 현재 ──────────────────────────────
  {
    id: '2026',
    cssClass: 'era-2026',
    icon: '🤖',
    name: '2026년 AI 시대',
    years: '2024~2026',
    title: 'AI가 내 일자리를 위협한다',
    tagline: '"ChatGPT가 초안 쓰고, 내가 수정하는 시대"',
    fate: 'AI에 적응하거나, 도태되거나',
    recommend: true,
    recommendReason: '첫 플레이에 추천 — 현재 시대, 가장 공감 가는 스토리',
    difficulty: { stamina: 3, stress: 3, money: 4, overall: '★★★☆☆', label: '균형 잡힌 난이도' },
    preview: {
      lines: [
        '짜장면 8천원, 월세 130만원의 현실입니다.',
        'AI가 내 업무를 대신하기 시작했습니다.',
        '월급은 오르지만 지출은 더 빠르게 오릅니다.',
      ],
      life: [
        '→ AI를 잘 쓰는 사람과 못 쓰는 사람이 갈립니다.',
        '→ 부업 없이는 생활이 빠듯한 시대입니다.',
        '→ 워라밸을 지키는 선택이 진짜 용기입니다.',
      ],
    },
    desc: 'AI가 직업을 대체하기 시작했다. 플랫폼 노동자는 늘었지만 권리는 없다. 짜장면 8천원, 월세 130만원. 그래도 살아야 한다.',
    econ: {
      wage:        3500000,
      jajangmyeon: 8000,
      bus:         1500,
      coffee:      5000,
      rent:        1300000,
      beer:        6000,
      rice:        70000,
      cigarette:   5500,
    },
    econLabel: [
      { k:'월급 (평균)', v:'350만원' },
      { k:'버스비', v:'1,500원' },
      { k:'짜장면', v:'8,000원' },
      { k:'아메리카노', v:'5,000원' },
    ],
    jobs: [
      { id:'ai_worker',   label:'AI 개발자 / ML엔지니어',   icon:'🤖', dailyPay:200000, stress:3, desc:'지금 가장 핫한 직업. 연봉 1억은 기본.' },
      { id:'platform',    label:'플랫폼 노동자 (배민/쿠팡)', icon:'🛵', dailyPay:150000, stress:4, desc:'내 사장이지만... 알고리즘이 더 높은 사장이다.' },
      { id:'creator',     label:'유튜버 / 크리에이터',       icon:'🎬', dailyPay:0,      stress:3, desc:'구독자 100만명이면 억대 수익. 하지만 알고리즘은 잔인하다.' },
      { id:'office_2026', label:'일반 사무직',               icon:'💼', dailyPay:160000, stress:3, desc:'AI한테 업무를 빼앗길까 두렵다. 생산성 증명이 필요하다.' },
      { id:'selfemploy',  label:'자영업자',                  icon:'🏪', dailyPay:0,      stress:5, desc:'배달 수수료, 카드 수수료, 임대료... 남는 게 없다.' },
      { id:'parttime_26', label:'알바생 (시급 9,860원)',      icon:'🥤', dailyPay:78880,  stress:2, desc:'시급은 올랐는데 물가는 더 올랐다. 뭔가 이상하다.' },
    ],
    homeLocations: [
      { id:'near_2026',    label:'회사 근처 (도보 10분)',  commute:10,  rent:1300000, type:'walk' },
      { id:'subway_2026',  label:'지하철 2호선권 (40분)',  commute:40,  rent:900000,  type:'subway' },
      { id:'far_2026',     label:'경기도 GTX (80분)',      commute:80,  rent:500000,  type:'bus' },
      { id:'parents_2026', label:'부모님 집 (무료, 120분)',commute:120, rent:0,       type:'bus' },
    ],
    historicEvent: {
      id: 'ai_layoff',
      trigger: 9,
      title: '🤖 회사에서 AI 도입 발표!',
      log: [
        { t:'history', m:'══════════════════════════════════' },
        { t:'history', m:'  🤖 전사 공지: AI 전환 계획 발표' },
        { t:'history', m:'  "일부 업무 자동화 추진 예정"' },
        { t:'history', m:'══════════════════════════════════' },
        { t:'bad',     m:'팀장: "AI 도구 도입으로 인원 재조정이 있을 수 있습니다."' },
        { t:'bad',     m:'동료가 조용히 짐을 싸기 시작한다.' },
        { t:'inner',   m:'\'내 자리는 괜찮은 거지...?\'' },
      ],
      choices: [
        {
          label: '▶ 적극적으로 AI 툴을 마스터한다',
          type: 'normal',
          effect: { stress:8, stamina:-10, flag:'ai_skilled', money:50000 },
          result: [
            { t:'good', m:'AI를 다룰 줄 아는 사람은 대체되지 않는다.' },
            { t:'good', m:'팀장: "요즘 일 처리가 빨라졌네요. 수고해요."' },
          ]
        },
        {
          label: '▶ 모른 척하고 기존 방식대로 한다',
          type: 'bad',
          effect: { stress:15, flag:'ai_resistant' },
          result: [
            { t:'bad',   m:'변화를 거부하다간 뒤처진다.' },
            { t:'inner', m:'\'이렇게 하면 나도 잘리는 거 아닌가...\'' },
          ]
        },
        {
          label: '▶ 이 기회에 이직/창업을 진지하게 고민한다',
          type: 'money',
          effect: { stress:5, flag:'career_pivot' },
          result: [
            { t:'story', m:'이직 플랫폼을 몰래 열었다. 연봉 협상 준비를 시작한다.' },
            { t:'inner', m:'\'변화는 위기이자 기회다.\'' },
          ]
        },
      ]
    },
    atmosphere: [
      '"ChatGPT로 짠 코드입니까?" 이제 면접에서 물어본다.',
      '배달비 5,000원 — 짜장면이랑 거의 같아졌다.',
      '집값은 안 떨어지고, 금리는 높고.',
      '유튜브에 "직장인 브이로그"가 넘쳐난다.',
      'AI 면접, AI 면접관. 사람이 사람을 뽑지 않는 시대.',
    ],
  },
];

// ── 고용 형태 ────────────────────────────────────────
const EMPLOY_TYPES = [
  { id:'fulltime',   label:'정규직',      icon:'🏢', desc:'4대보험 완비. 안정적이지만 야근·눈치.' },
  { id:'contract',   label:'계약직',      icon:'📋', desc:'계약 만료 공포. 언제 잘릴지 모른다.' },
  { id:'parttime',   label:'시간제 알바', icon:'🥤', desc:'시급제. 투잡이 용이하다.' },
  { id:'freelance',  label:'프리랜서',    icon:'💻', desc:'프로젝트 단위 수입. 들쭉날쭉.' },
  { id:'selfemploy', label:'자영업자',    icon:'🏪', desc:'사장이지만 제일 바쁘다. 매출=급여.' },
];

// ── 집안일 목록 ──────────────────────────────────────
const CHORE_LIST = [
  { id:'dishes',  label:'설거지',     time:15, stamina:-4,  stress:-3, rel_sp:4,  rel_kid:1 },
  { id:'laundry', label:'빨래',       time:20, stamina:-5,  stress:-3, rel_sp:4,  rel_kid:1 },
  { id:'vacuum',  label:'청소기',     time:25, stamina:-7,  stress:-4, rel_sp:6,  rel_kid:2 },
  { id:'trash',   label:'분리수거',   time:10, stamina:-3,  stress:-2, rel_sp:3,  rel_kid:0 },
  { id:'cook',    label:'저녁요리',   time:45, stamina:-10, stress:-5, rel_sp:10, rel_kid:6 },
  { id:'shop',    label:'마트 장보기',time:35, stamina:-8,  stress:-3, rel_sp:6,  rel_kid:3 },
];

// ── 시대별 물가 체감 비교 헬퍼 ──────────────────────
function getPriceLabel(eraId) {
  const e = ERAS.find(function(r) { return r.id === eraId; });
  if (!e) return '';
  return '짜장면 ' + e.econ.jajangmyeon.toLocaleString() + '원';
}
