// ============================================================================
// Korean Auto Insurance Claims System - Data Constants
// 한국 자동차보험 손해사정 데이터 상수
// ============================================================================

// ============================================================================
// 1. REPAIR_METHODS - 수리 방법 (6 types)
// ============================================================================
const REPAIR_METHODS = [
  {
    id: "exchange",
    name: "교환",
    nameEn: "Exchange",
    desc: "부품 전체 교체 (탈거 + 신품 장착 + 조정)",
    applicableMaterials: ["metal", "plastic", "glass", "electronic"],
    severityRange: ["경미", "중간", "심각", "전손"],
    costMultiplier: 1.0,
    laborType: "교환공임",
    includesPaint: false,
    sot: 1.0
  },
  {
    id: "sheet_metal",
    name: "판금",
    nameEn: "Sheet Metal Repair",
    desc: "금속 패널의 변형을 망치·돌리 등으로 원형 복원 (용접, 당김 포함)",
    applicableMaterials: ["metal"],
    severityRange: ["경미", "중간", "심각"],
    costMultiplier: 0.55,
    laborType: "판금공임",
    includesPaint: false,
    sot: 1.5
  },
  {
    id: "paint",
    name: "도장",
    nameEn: "Paint",
    desc: "하도·중도·상도 도장 작업 (조색, 블렌딩, 클리어코트 포함)",
    applicableMaterials: ["metal", "plastic"],
    severityRange: ["경미", "중간", "심각"],
    costMultiplier: 0.45,
    laborType: "도장공임",
    includesPaint: true,
    sot: 2.0
  },
  {
    id: "detach_attach",
    name: "탈착",
    nameEn: "Detach & Attach",
    desc: "부품을 탈거 후 재장착 (인접 부품 접근을 위한 보조 작업 포함)",
    applicableMaterials: ["metal", "plastic", "glass", "electronic", "rubber", "fabric"],
    severityRange: ["경미", "중간"],
    costMultiplier: 0.25,
    laborType: "탈착공임",
    includesPaint: false,
    sot: 0.5
  },
  {
    id: "restore_repair",
    name: "복원수리",
    nameEn: "Restore Repair",
    desc: "플라스틱 용접·접착·퍼티 복원 등 비금속 부품 보수",
    applicableMaterials: ["plastic", "rubber", "fabric"],
    severityRange: ["경미", "중간"],
    costMultiplier: 0.35,
    laborType: "수리공임",
    includesPaint: false,
    sot: 1.2
  },
  {
    id: "calibration",
    name: "캘리브레이션",
    nameEn: "Calibration",
    desc: "ADAS 센서·카메라 교정 작업 (정적/동적 캘리브레이션)",
    applicableMaterials: ["electronic"],
    severityRange: ["경미", "중간", "심각"],
    costMultiplier: 0.8,
    laborType: "진단공임",
    includesPaint: false,
    sot: 1.5
  },
  {
    id: "pdr",
    name: "PDR (무도장 덴트복원)",
    nameEn: "Paintless Dent Repair",
    desc: "도장면 손상 없이 금속 패널의 찌그러짐을 전용 공구로 복원. 우박 손상, 주차장 경미 덴트에 적합. 도장 불필요로 원래 도장 유지.",
    applicableMaterials: ["metal"],
    severityRange: ["경미"],
    costMultiplier: 0.3,
    laborType: "PDR공임",
    includesPaint: false,
    sot: 0.8
  },
  {
    id: "glass_repair",
    name: "유리 보수",
    nameEn: "Glass Repair",
    desc: "전면 유리 소형 파손(500원 동전 크기 이하) 레진 충전 보수. 교환 대비 80% 비용 절감. 운전석 정면, 유리 가장자리 5cm 이내는 보수 불가.",
    applicableMaterials: ["glass"],
    severityRange: ["경미"],
    costMultiplier: 0.15,
    laborType: "유리보수공임",
    includesPaint: false,
    sot: 0.5
  },
  {
    id: "welding",
    name: "용접",
    nameEn: "Welding",
    desc: "구조부·프레임 손상 시 절단 후 용접 접합. CO2/MIG/스팟 용접. 사이드실, 필러, 서브프레임 등 구조부 복원에 필수. 프레임 수정기 병행.",
    applicableMaterials: ["metal"],
    severityRange: ["심각"],
    costMultiplier: 1.2,
    laborType: "용접공임",
    includesPaint: false,
    sot: 3.0
  },
  {
    id: "polish_compound",
    name: "광택/컴파운딩",
    nameEn: "Polish & Compound",
    desc: "클리어코트 스크래치·스월마크 제거. 1단계 컴파운딩 → 2단계 폴리싱 → 3단계 왁싱/코팅. 도장면 자체 손상 없는 표면 결함만 해당.",
    applicableMaterials: ["metal", "plastic"],
    severityRange: ["경미"],
    costMultiplier: 0.1,
    laborType: "광택공임",
    includesPaint: false,
    sot: 0.5
  },
  {
    id: "wrapping",
    name: "랩핑/필름",
    nameEn: "Wrapping / PPF",
    desc: "도장 대신 비닐 필름으로 외관 복원 또는 보호. PPF(Paint Protection Film), 컬러 랩핑. 원래 도장 보존 가능. 임시 복원 또는 고객 요청 시.",
    applicableMaterials: ["metal", "plastic"],
    severityRange: ["경미", "중간"],
    costMultiplier: 0.4,
    laborType: "랩핑공임",
    includesPaint: false,
    sot: 2.0
  },
  {
    id: "ecu_coding",
    name: "ECU 코딩/프로그래밍",
    nameEn: "ECU Coding / Programming",
    desc: "전자제어장치 소프트웨어 업데이트·재설정. 부품 교환 후 차량-부품 매칭, 에어백 리셋, 키 등록, 자기학습 초기화 등. 제조사 전용 진단장비 필요.",
    applicableMaterials: ["electronic"],
    severityRange: ["경미", "중간", "심각"],
    costMultiplier: 0.6,
    laborType: "진단공임",
    includesPaint: false,
    sot: 1.0
  }
];


// ============================================================================
// 2. DAMAGE_CHAINS - 인과 손상 전파 맵 (70+ 부품)
// ============================================================================
const DAMAGE_CHAINS = {
  // ── 전면부 (Front) ─────────────────────────────────────────────────────
  "프론트 범퍼(상)": {
    chain: [
      { target: "프론트 범퍼(하/립)", probability: 0.8, minSeverity: "경미" },
      { target: "프론트 그릴", probability: 0.7, minSeverity: "중간" },
      { target: "라디에이터", probability: 0.4, minSeverity: "심각" },
      { target: "인터쿨러", probability: 0.3, minSeverity: "심각" },
      { target: "전방 카메라/센서", probability: 0.5, minSeverity: "중간" },
      { target: "어라운드뷰 전면", probability: 0.35, minSeverity: "중간" },
      { target: "좌 헤드라이트", probability: 0.35, minSeverity: "중간" },
      { target: "우 헤드라이트", probability: 0.35, minSeverity: "중간" },
      { target: "본넷", probability: 0.25, minSeverity: "심각" },
      { target: "프론트 엠블럼", probability: 0.6, minSeverity: "경미" },
      { target: "전방 레이더", probability: 0.4, minSeverity: "중간" },
      { target: "카메라 캘리브레이션", probability: 0.5, minSeverity: "중간" },
      { target: "좌 프론트 펜더", probability: 0.2, minSeverity: "심각" },
      { target: "우 프론트 펜더", probability: 0.2, minSeverity: "심각" }
    ]
  },
  "프론트 범퍼(하/립)": {
    chain: [
      { target: "좌 안개등", probability: 0.5, minSeverity: "중간" },
      { target: "우 안개등", probability: 0.5, minSeverity: "중간" },
      { target: "언더커버", probability: 0.6, minSeverity: "경미" },
      { target: "프론트 범퍼(상)", probability: 0.3, minSeverity: "중간" },
      { target: "프론트 서브프레임", probability: 0.2, minSeverity: "심각" },
      { target: "어라운드뷰 전면", probability: 0.25, minSeverity: "중간" },
      { target: "좌 전륜 휠/타이어", probability: 0.15, minSeverity: "심각" },
      { target: "우 전륜 휠/타이어", probability: 0.15, minSeverity: "심각" },
      { target: "전방 레이더", probability: 0.3, minSeverity: "중간" }
    ]
  },
  "본넷": {
    chain: [
      { target: "좌 프론트 펜더", probability: 0.3, minSeverity: "중간" },
      { target: "우 프론트 펜더", probability: 0.3, minSeverity: "중간" },
      { target: "전면 유리", probability: 0.2, minSeverity: "심각" },
      { target: "와이퍼", probability: 0.35, minSeverity: "중간" },
      { target: "프론트 그릴", probability: 0.25, minSeverity: "중간" },
      { target: "좌 헤드라이트", probability: 0.2, minSeverity: "중간" },
      { target: "우 헤드라이트", probability: 0.2, minSeverity: "중간" },
      { target: "프론트 엠블럼", probability: 0.4, minSeverity: "경미" },
      { target: "전방 카메라/센서", probability: 0.15, minSeverity: "심각" },
      { target: "라디에이터", probability: 0.2, minSeverity: "심각" }
    ]
  },
  "프론트 그릴": {
    chain: [
      { target: "라디에이터", probability: 0.3, minSeverity: "중간" },
      { target: "인터쿨러", probability: 0.25, minSeverity: "중간" },
      { target: "전방 카메라/센서", probability: 0.4, minSeverity: "중간" },
      { target: "전방 레이더", probability: 0.35, minSeverity: "중간" },
      { target: "프론트 범퍼(상)", probability: 0.2, minSeverity: "경미" },
      { target: "프론트 엠블럼", probability: 0.5, minSeverity: "경미" },
      { target: "에어컨/냉방", probability: 0.2, minSeverity: "심각" },
      { target: "카메라 캘리브레이션", probability: 0.4, minSeverity: "중간" }
    ]
  },
  "라디에이터": {
    chain: [
      { target: "인터쿨러", probability: 0.5, minSeverity: "중간" },
      { target: "에어컨/냉방", probability: 0.4, minSeverity: "중간" },
      { target: "프론트 그릴", probability: 0.2, minSeverity: "경미" },
      { target: "프론트 범퍼(상)", probability: 0.15, minSeverity: "중간" },
      { target: "본넷", probability: 0.1, minSeverity: "심각" },
      { target: "프론트 서브프레임", probability: 0.3, minSeverity: "심각" },
      { target: "좌 전 서스펜션", probability: 0.2, minSeverity: "심각" },
      { target: "우 전 서스펜션", probability: 0.2, minSeverity: "심각" }
    ]
  },
  "인터쿨러": {
    chain: [
      { target: "라디에이터", probability: 0.5, minSeverity: "중간" },
      { target: "프론트 그릴", probability: 0.2, minSeverity: "경미" },
      { target: "프론트 범퍼(상)", probability: 0.15, minSeverity: "중간" },
      { target: "에어컨/냉방", probability: 0.3, minSeverity: "중간" },
      { target: "프론트 서브프레임", probability: 0.2, minSeverity: "심각" },
      { target: "언더커버", probability: 0.25, minSeverity: "중간" }
    ]
  },
  "좌 헤드라이트": {
    chain: [
      { target: "좌 프론트 펜더", probability: 0.3, minSeverity: "중간" },
      { target: "프론트 범퍼(상)", probability: 0.25, minSeverity: "경미" },
      { target: "좌 안개등", probability: 0.3, minSeverity: "중간" },
      { target: "본넷", probability: 0.15, minSeverity: "중간" },
      { target: "프론트 그릴", probability: 0.2, minSeverity: "경미" },
      { target: "전방 카메라/센서", probability: 0.2, minSeverity: "중간" },
      { target: "카메라 캘리브레이션", probability: 0.3, minSeverity: "경미" },
      { target: "좌 전륜 휠/타이어", probability: 0.15, minSeverity: "심각" },
      { target: "어라운드뷰 전면", probability: 0.2, minSeverity: "중간" }
    ]
  },
  "우 헤드라이트": {
    chain: [
      { target: "우 프론트 펜더", probability: 0.3, minSeverity: "중간" },
      { target: "프론트 범퍼(상)", probability: 0.25, minSeverity: "경미" },
      { target: "우 안개등", probability: 0.3, minSeverity: "중간" },
      { target: "본넷", probability: 0.15, minSeverity: "중간" },
      { target: "프론트 그릴", probability: 0.2, minSeverity: "경미" },
      { target: "전방 카메라/센서", probability: 0.2, minSeverity: "중간" },
      { target: "카메라 캘리브레이션", probability: 0.3, minSeverity: "경미" },
      { target: "우 전륜 휠/타이어", probability: 0.15, minSeverity: "심각" },
      { target: "어라운드뷰 전면", probability: 0.2, minSeverity: "중간" }
    ]
  },
  "좌 안개등": {
    chain: [
      { target: "프론트 범퍼(하/립)", probability: 0.3, minSeverity: "경미" },
      { target: "프론트 범퍼(상)", probability: 0.15, minSeverity: "중간" },
      { target: "좌 헤드라이트", probability: 0.2, minSeverity: "중간" },
      { target: "좌 프론트 펜더", probability: 0.15, minSeverity: "중간" },
      { target: "좌 전륜 휠/타이어", probability: 0.1, minSeverity: "심각" },
      { target: "언더커버", probability: 0.15, minSeverity: "경미" },
      { target: "어라운드뷰 전면", probability: 0.1, minSeverity: "중간" }
    ]
  },
  "우 안개등": {
    chain: [
      { target: "프론트 범퍼(하/립)", probability: 0.3, minSeverity: "경미" },
      { target: "프론트 범퍼(상)", probability: 0.15, minSeverity: "중간" },
      { target: "우 헤드라이트", probability: 0.2, minSeverity: "중간" },
      { target: "우 프론트 펜더", probability: 0.15, minSeverity: "중간" },
      { target: "우 전륜 휠/타이어", probability: 0.1, minSeverity: "심각" },
      { target: "언더커버", probability: 0.15, minSeverity: "경미" },
      { target: "어라운드뷰 전면", probability: 0.1, minSeverity: "중간" }
    ]
  },
  "전면 유리": {
    chain: [
      { target: "전방 카메라/센서", probability: 0.6, minSeverity: "중간" },
      { target: "와이퍼", probability: 0.4, minSeverity: "중간" },
      { target: "좌 A필러", probability: 0.2, minSeverity: "심각" },
      { target: "우 A필러", probability: 0.2, minSeverity: "심각" },
      { target: "루프패널", probability: 0.1, minSeverity: "심각" },
      { target: "카메라 캘리브레이션", probability: 0.7, minSeverity: "경미" },
      { target: "라이다", probability: 0.3, minSeverity: "중간" },
      { target: "AVN/인포테인먼트", probability: 0.1, minSeverity: "심각" },
      { target: "본넷", probability: 0.15, minSeverity: "심각" },
      { target: "어라운드뷰 전면", probability: 0.25, minSeverity: "중간" }
    ]
  },
  "와이퍼": {
    chain: [
      { target: "전면 유리", probability: 0.15, minSeverity: "중간" },
      { target: "본넷", probability: 0.1, minSeverity: "경미" },
      { target: "좌 A필러", probability: 0.05, minSeverity: "심각" },
      { target: "우 A필러", probability: 0.05, minSeverity: "심각" },
      { target: "전방 카메라/센서", probability: 0.1, minSeverity: "중간" },
      { target: "카메라 캘리브레이션", probability: 0.15, minSeverity: "중간" },
      { target: "라이다", probability: 0.05, minSeverity: "중간" }
    ]
  },
  "프론트 엠블럼": {
    chain: [
      { target: "프론트 범퍼(상)", probability: 0.1, minSeverity: "경미" },
      { target: "본넷", probability: 0.1, minSeverity: "경미" },
      { target: "프론트 그릴", probability: 0.15, minSeverity: "경미" },
      { target: "전방 레이더", probability: 0.2, minSeverity: "중간" },
      { target: "전방 카메라/센서", probability: 0.15, minSeverity: "중간" },
      { target: "카메라 캘리브레이션", probability: 0.2, minSeverity: "경미" },
      { target: "라디에이터", probability: 0.05, minSeverity: "심각" }
    ]
  },
  "전방 카메라/센서": {
    chain: [
      { target: "전면 유리", probability: 0.1, minSeverity: "심각" },
      { target: "카메라 캘리브레이션", probability: 0.9, minSeverity: "경미" },
      { target: "전방 레이더", probability: 0.2, minSeverity: "중간" },
      { target: "라이다", probability: 0.15, minSeverity: "중간" },
      { target: "AVN/인포테인먼트", probability: 0.1, minSeverity: "중간" },
      { target: "계기판/클러스터", probability: 0.1, minSeverity: "중간" },
      { target: "어라운드뷰 전면", probability: 0.3, minSeverity: "경미" }
    ]
  },
  "어라운드뷰 전면": {
    chain: [
      { target: "프론트 범퍼(상)", probability: 0.1, minSeverity: "경미" },
      { target: "프론트 범퍼(하/립)", probability: 0.1, minSeverity: "경미" },
      { target: "전방 카메라/센서", probability: 0.3, minSeverity: "경미" },
      { target: "카메라 캘리브레이션", probability: 0.8, minSeverity: "경미" },
      { target: "AVN/인포테인먼트", probability: 0.15, minSeverity: "중간" },
      { target: "프론트 그릴", probability: 0.1, minSeverity: "경미" },
      { target: "후방 카메라", probability: 0.2, minSeverity: "경미" },
      { target: "좌 사이드미러", probability: 0.1, minSeverity: "경미" },
      { target: "우 사이드미러", probability: 0.1, minSeverity: "경미" }
    ]
  },

  // ── 후면부 (Rear) ──────────────────────────────────────────────────────
  "리어 범퍼(상)": {
    chain: [
      { target: "리어 범퍼(하/디퓨저)", probability: 0.7, minSeverity: "경미" },
      { target: "트렁크/테일게이트", probability: 0.3, minSeverity: "심각" },
      { target: "좌 리어램프", probability: 0.35, minSeverity: "중간" },
      { target: "우 리어램프", probability: 0.35, minSeverity: "중간" },
      { target: "후방 카메라", probability: 0.4, minSeverity: "중간" },
      { target: "후방 주차센서", probability: 0.5, minSeverity: "경미" },
      { target: "리어 엠블럼", probability: 0.5, minSeverity: "경미" },
      { target: "머플러/배기팁", probability: 0.3, minSeverity: "경미" },
      { target: "좌 리어쿼터패널", probability: 0.2, minSeverity: "심각" },
      { target: "우 리어쿼터패널", probability: 0.2, minSeverity: "심각" },
      { target: "번호판등", probability: 0.3, minSeverity: "경미" },
      { target: "후측방 레이더(좌)", probability: 0.2, minSeverity: "중간" },
      { target: "후측방 레이더(우)", probability: 0.2, minSeverity: "중간" },
      { target: "카메라 캘리브레이션", probability: 0.4, minSeverity: "중간" }
    ]
  },
  "리어 범퍼(하/디퓨저)": {
    chain: [
      { target: "리어 범퍼(상)", probability: 0.3, minSeverity: "중간" },
      { target: "머플러/배기팁", probability: 0.5, minSeverity: "경미" },
      { target: "후방 주차센서", probability: 0.35, minSeverity: "경미" },
      { target: "언더커버", probability: 0.4, minSeverity: "경미" },
      { target: "리어 서브프레임", probability: 0.2, minSeverity: "심각" },
      { target: "좌 후륜 휠/타이어", probability: 0.1, minSeverity: "심각" },
      { target: "우 후륜 휠/타이어", probability: 0.1, minSeverity: "심각" },
      { target: "후방 카메라", probability: 0.3, minSeverity: "중간" },
      { target: "번호판등", probability: 0.25, minSeverity: "경미" }
    ]
  },
  "트렁크/테일게이트": {
    chain: [
      { target: "리어 스포일러", probability: 0.5, minSeverity: "중간" },
      { target: "리어 유리", probability: 0.3, minSeverity: "심각" },
      { target: "후방 카메라", probability: 0.4, minSeverity: "중간" },
      { target: "리어 엠블럼", probability: 0.5, minSeverity: "경미" },
      { target: "좌 리어램프", probability: 0.25, minSeverity: "중간" },
      { target: "우 리어램프", probability: 0.25, minSeverity: "중간" },
      { target: "리어 범퍼(상)", probability: 0.2, minSeverity: "중간" },
      { target: "번호판등", probability: 0.35, minSeverity: "경미" },
      { target: "카메라 캘리브레이션", probability: 0.4, minSeverity: "중간" },
      { target: "좌 C필러", probability: 0.15, minSeverity: "심각" },
      { target: "우 C필러", probability: 0.15, minSeverity: "심각" }
    ]
  },
  "좌 리어램프": {
    chain: [
      { target: "좌 리어쿼터패널", probability: 0.25, minSeverity: "중간" },
      { target: "트렁크/테일게이트", probability: 0.15, minSeverity: "중간" },
      { target: "리어 범퍼(상)", probability: 0.15, minSeverity: "경미" },
      { target: "좌 C필러", probability: 0.1, minSeverity: "심각" },
      { target: "번호판등", probability: 0.2, minSeverity: "경미" },
      { target: "후방 카메라", probability: 0.1, minSeverity: "중간" },
      { target: "리어 엠블럼", probability: 0.1, minSeverity: "경미" },
      { target: "리어 스포일러", probability: 0.05, minSeverity: "중간" },
      { target: "카메라 캘리브레이션", probability: 0.1, minSeverity: "경미" }
    ]
  },
  "우 리어램프": {
    chain: [
      { target: "우 리어쿼터패널", probability: 0.25, minSeverity: "중간" },
      { target: "트렁크/테일게이트", probability: 0.15, minSeverity: "중간" },
      { target: "리어 범퍼(상)", probability: 0.15, minSeverity: "경미" },
      { target: "우 C필러", probability: 0.1, minSeverity: "심각" },
      { target: "번호판등", probability: 0.2, minSeverity: "경미" },
      { target: "후방 카메라", probability: 0.1, minSeverity: "중간" },
      { target: "리어 엠블럼", probability: 0.1, minSeverity: "경미" },
      { target: "리어 스포일러", probability: 0.05, minSeverity: "중간" },
      { target: "카메라 캘리브레이션", probability: 0.1, minSeverity: "경미" }
    ]
  },
  "리어 유리": {
    chain: [
      { target: "리어 스포일러", probability: 0.2, minSeverity: "심각" },
      { target: "트렁크/테일게이트", probability: 0.15, minSeverity: "중간" },
      { target: "좌 C필러", probability: 0.15, minSeverity: "심각" },
      { target: "우 C필러", probability: 0.15, minSeverity: "심각" },
      { target: "후방 카메라", probability: 0.2, minSeverity: "중간" },
      { target: "루프패널", probability: 0.1, minSeverity: "심각" },
      { target: "카메라 캘리브레이션", probability: 0.3, minSeverity: "중간" },
      { target: "안테나/샤크핀", probability: 0.1, minSeverity: "중간" },
      { target: "리어 엠블럼", probability: 0.05, minSeverity: "경미" },
      { target: "좌 리어쿼터패널", probability: 0.05, minSeverity: "심각" },
      { target: "우 리어쿼터패널", probability: 0.05, minSeverity: "심각" }
    ]
  },
  "리어 스포일러": {
    chain: [
      { target: "트렁크/테일게이트", probability: 0.2, minSeverity: "중간" },
      { target: "리어 유리", probability: 0.25, minSeverity: "중간" },
      { target: "좌 리어램프", probability: 0.1, minSeverity: "중간" },
      { target: "우 리어램프", probability: 0.1, minSeverity: "중간" },
      { target: "루프패널", probability: 0.1, minSeverity: "심각" },
      { target: "후방 카메라", probability: 0.15, minSeverity: "중간" },
      { target: "리어 범퍼(상)", probability: 0.1, minSeverity: "중간" },
      { target: "좌 C필러", probability: 0.05, minSeverity: "심각" },
      { target: "우 C필러", probability: 0.05, minSeverity: "심각" },
      { target: "카메라 캘리브레이션", probability: 0.15, minSeverity: "중간" }
    ]
  },
  "리어 엠블럼": {
    chain: [
      { target: "트렁크/테일게이트", probability: 0.1, minSeverity: "경미" },
      { target: "리어 범퍼(상)", probability: 0.1, minSeverity: "경미" },
      { target: "후방 카메라", probability: 0.1, minSeverity: "중간" },
      { target: "번호판등", probability: 0.15, minSeverity: "경미" },
      { target: "리어 유리", probability: 0.05, minSeverity: "중간" },
      { target: "좌 리어램프", probability: 0.05, minSeverity: "경미" },
      { target: "우 리어램프", probability: 0.05, minSeverity: "경미" },
      { target: "카메라 캘리브레이션", probability: 0.1, minSeverity: "경미" }
    ]
  },
  "후방 카메라": {
    chain: [
      { target: "트렁크/테일게이트", probability: 0.1, minSeverity: "경미" },
      { target: "리어 범퍼(상)", probability: 0.1, minSeverity: "경미" },
      { target: "카메라 캘리브레이션", probability: 0.9, minSeverity: "경미" },
      { target: "AVN/인포테인먼트", probability: 0.1, minSeverity: "중간" },
      { target: "리어 유리", probability: 0.05, minSeverity: "심각" },
      { target: "어라운드뷰 전면", probability: 0.15, minSeverity: "경미" }
    ]
  },
  "후방 주차센서": {
    chain: [
      { target: "리어 범퍼(상)", probability: 0.1, minSeverity: "경미" },
      { target: "리어 범퍼(하/디퓨저)", probability: 0.1, minSeverity: "경미" },
      { target: "AVN/인포테인먼트", probability: 0.1, minSeverity: "중간" },
      { target: "계기판/클러스터", probability: 0.05, minSeverity: "중간" },
      { target: "카메라 캘리브레이션", probability: 0.3, minSeverity: "경미" },
      { target: "후방 카메라", probability: 0.15, minSeverity: "경미" },
      { target: "머플러/배기팁", probability: 0.05, minSeverity: "경미" }
    ]
  },
  "번호판등": {
    chain: [
      { target: "리어 범퍼(상)", probability: 0.05, minSeverity: "경미" },
      { target: "트렁크/테일게이트", probability: 0.05, minSeverity: "경미" },
      { target: "리어 엠블럼", probability: 0.1, minSeverity: "경미" },
      { target: "후방 카메라", probability: 0.05, minSeverity: "중간" },
      { target: "리어 범퍼(하/디퓨저)", probability: 0.05, minSeverity: "경미" },
      { target: "좌 리어램프", probability: 0.05, minSeverity: "경미" },
      { target: "우 리어램프", probability: 0.05, minSeverity: "경미" }
    ]
  },
  "머플러/배기팁": {
    chain: [
      { target: "리어 범퍼(하/디퓨저)", probability: 0.3, minSeverity: "경미" },
      { target: "리어 범퍼(상)", probability: 0.15, minSeverity: "중간" },
      { target: "언더커버", probability: 0.2, minSeverity: "경미" },
      { target: "리어 서브프레임", probability: 0.1, minSeverity: "심각" },
      { target: "연료탱크/배터리팩", probability: 0.05, minSeverity: "심각" },
      { target: "플로어패널", probability: 0.1, minSeverity: "심각" },
      { target: "좌 후륜 휠/타이어", probability: 0.05, minSeverity: "심각" },
      { target: "우 후륜 휠/타이어", probability: 0.05, minSeverity: "심각" }
    ]
  },

  // ── 좌측면 (Left Side) ────────────────────────────────────────────────
  "좌 프론트 펜더": {
    chain: [
      { target: "좌 프론트 도어", probability: 0.4, minSeverity: "중간" },
      { target: "좌 헤드라이트", probability: 0.3, minSeverity: "중간" },
      { target: "좌 사이드미러", probability: 0.25, minSeverity: "중간" },
      { target: "좌 A필러", probability: 0.2, minSeverity: "심각" },
      { target: "본넷", probability: 0.15, minSeverity: "중간" },
      { target: "좌 전륜 휠/타이어", probability: 0.2, minSeverity: "중간" },
      { target: "좌 사이드몰딩", probability: 0.4, minSeverity: "경미" },
      { target: "좌 안개등", probability: 0.2, minSeverity: "중간" },
      { target: "프론트 범퍼(상)", probability: 0.15, minSeverity: "중간" },
      { target: "좌 전 서스펜션", probability: 0.15, minSeverity: "심각" }
    ]
  },
  "좌 A필러": {
    chain: [
      { target: "전면 유리", probability: 0.5, minSeverity: "심각" },
      { target: "좌 프론트 펜더", probability: 0.4, minSeverity: "심각" },
      { target: "좌 프론트 도어", probability: 0.4, minSeverity: "심각" },
      { target: "루프패널", probability: 0.3, minSeverity: "심각" },
      { target: "좌 도어유리(전)", probability: 0.3, minSeverity: "심각" },
      { target: "좌 사이드실(로커패널)", probability: 0.2, minSeverity: "심각" },
      { target: "에어백(운전석)", probability: 0.15, minSeverity: "심각" },
      { target: "사이드/커튼 에어백", probability: 0.2, minSeverity: "심각" },
      { target: "카메라 캘리브레이션", probability: 0.2, minSeverity: "심각" }
    ]
  },
  "좌 프론트 도어": {
    chain: [
      { target: "좌 사이드미러", probability: 0.5, minSeverity: "중간" },
      { target: "좌 도어핸들", probability: 0.4, minSeverity: "중간" },
      { target: "좌 도어유리(전)", probability: 0.35, minSeverity: "중간" },
      { target: "좌 B필러", probability: 0.3, minSeverity: "심각" },
      { target: "좌 리어 도어", probability: 0.25, minSeverity: "심각" },
      { target: "좌 프론트 펜더", probability: 0.2, minSeverity: "중간" },
      { target: "좌 사이드몰딩", probability: 0.6, minSeverity: "경미" },
      { target: "좌 A필러", probability: 0.2, minSeverity: "심각" },
      { target: "좌 사이드실(로커패널)", probability: 0.15, minSeverity: "심각" },
      { target: "사이드/커튼 에어백", probability: 0.15, minSeverity: "심각" },
      { target: "에어백(운전석)", probability: 0.1, minSeverity: "심각" }
    ]
  },
  "좌 B필러": {
    chain: [
      { target: "좌 프론트 도어", probability: 0.4, minSeverity: "심각" },
      { target: "좌 리어 도어", probability: 0.4, minSeverity: "심각" },
      { target: "루프패널", probability: 0.3, minSeverity: "심각" },
      { target: "좌 사이드실(로커패널)", probability: 0.5, minSeverity: "심각" },
      { target: "좌 도어유리(전)", probability: 0.25, minSeverity: "심각" },
      { target: "좌 도어유리(후)", probability: 0.25, minSeverity: "심각" },
      { target: "사이드/커튼 에어백", probability: 0.3, minSeverity: "심각" },
      { target: "플로어패널", probability: 0.2, minSeverity: "심각" },
      { target: "좌 사이드몰딩", probability: 0.4, minSeverity: "경미" }
    ]
  },
  "좌 리어 도어": {
    chain: [
      { target: "좌 B필러", probability: 0.3, minSeverity: "심각" },
      { target: "좌 C필러", probability: 0.25, minSeverity: "심각" },
      { target: "좌 프론트 도어", probability: 0.2, minSeverity: "심각" },
      { target: "좌 도어핸들", probability: 0.4, minSeverity: "중간" },
      { target: "좌 도어유리(후)", probability: 0.35, minSeverity: "중간" },
      { target: "좌 사이드몰딩", probability: 0.6, minSeverity: "경미" },
      { target: "좌 사이드실(로커패널)", probability: 0.2, minSeverity: "심각" },
      { target: "좌 리어쿼터패널", probability: 0.15, minSeverity: "심각" },
      { target: "사이드/커튼 에어백", probability: 0.15, minSeverity: "심각" }
    ]
  },
  "좌 C필러": {
    chain: [
      { target: "좌 리어 도어", probability: 0.3, minSeverity: "심각" },
      { target: "좌 리어쿼터패널", probability: 0.5, minSeverity: "심각" },
      { target: "루프패널", probability: 0.25, minSeverity: "심각" },
      { target: "리어 유리", probability: 0.2, minSeverity: "심각" },
      { target: "좌 도어유리(후)", probability: 0.2, minSeverity: "심각" },
      { target: "트렁크/테일게이트", probability: 0.1, minSeverity: "심각" },
      { target: "사이드/커튼 에어백", probability: 0.2, minSeverity: "심각" }
    ]
  },
  "좌 리어쿼터패널": {
    chain: [
      { target: "리어 범퍼(상)", probability: 0.35, minSeverity: "중간" },
      { target: "좌 리어램프", probability: 0.4, minSeverity: "중간" },
      { target: "좌 C필러", probability: 0.3, minSeverity: "심각" },
      { target: "트렁크/테일게이트", probability: 0.2, minSeverity: "심각" },
      { target: "좌 리어 도어", probability: 0.2, minSeverity: "심각" },
      { target: "좌 후륜 휠/타이어", probability: 0.2, minSeverity: "중간" },
      { target: "좌 사이드실(로커패널)", probability: 0.15, minSeverity: "심각" },
      { target: "연료탱크/배터리팩", probability: 0.1, minSeverity: "심각" },
      { target: "좌 후 서스펜션", probability: 0.15, minSeverity: "심각" },
      { target: "좌 사이드몰딩", probability: 0.4, minSeverity: "경미" }
    ]
  },
  "좌 사이드미러": {
    chain: [
      { target: "좌 프론트 도어", probability: 0.15, minSeverity: "경미" },
      { target: "좌 도어유리(전)", probability: 0.2, minSeverity: "중간" },
      { target: "좌 프론트 펜더", probability: 0.1, minSeverity: "중간" },
      { target: "후측방 레이더(좌)", probability: 0.3, minSeverity: "경미" },
      { target: "카메라 캘리브레이션", probability: 0.4, minSeverity: "경미" },
      { target: "좌 A필러", probability: 0.05, minSeverity: "심각" },
      { target: "좌 사이드몰딩", probability: 0.1, minSeverity: "경미" },
      { target: "좌 도어핸들", probability: 0.05, minSeverity: "경미" }
    ]
  },
  "좌 도어핸들": {
    chain: [
      { target: "좌 프론트 도어", probability: 0.1, minSeverity: "경미" },
      { target: "좌 리어 도어", probability: 0.1, minSeverity: "경미" },
      { target: "좌 사이드몰딩", probability: 0.15, minSeverity: "경미" },
      { target: "좌 도어유리(전)", probability: 0.05, minSeverity: "중간" },
      { target: "좌 도어유리(후)", probability: 0.05, minSeverity: "중간" },
      { target: "좌 사이드미러", probability: 0.05, minSeverity: "경미" },
      { target: "좌 B필러", probability: 0.03, minSeverity: "심각" }
    ]
  },
  "좌 사이드몰딩": {
    chain: [
      { target: "좌 프론트 도어", probability: 0.1, minSeverity: "경미" },
      { target: "좌 리어 도어", probability: 0.1, minSeverity: "경미" },
      { target: "좌 프론트 펜더", probability: 0.1, minSeverity: "경미" },
      { target: "좌 리어쿼터패널", probability: 0.1, minSeverity: "경미" },
      { target: "좌 도어핸들", probability: 0.1, minSeverity: "경미" },
      { target: "좌 사이드실(로커패널)", probability: 0.05, minSeverity: "중간" },
      { target: "좌 B필러", probability: 0.03, minSeverity: "중간" },
      { target: "좌 사이드미러", probability: 0.05, minSeverity: "경미" }
    ]
  },
  "좌 도어유리(전)": {
    chain: [
      { target: "좌 프론트 도어", probability: 0.15, minSeverity: "중간" },
      { target: "좌 사이드미러", probability: 0.15, minSeverity: "중간" },
      { target: "좌 A필러", probability: 0.1, minSeverity: "심각" },
      { target: "좌 B필러", probability: 0.1, minSeverity: "심각" },
      { target: "좌 도어핸들", probability: 0.1, minSeverity: "경미" },
      { target: "사이드/커튼 에어백", probability: 0.1, minSeverity: "심각" },
      { target: "좌 사이드몰딩", probability: 0.1, minSeverity: "경미" },
      { target: "에어백(운전석)", probability: 0.05, minSeverity: "심각" }
    ]
  },
  "좌 도어유리(후)": {
    chain: [
      { target: "좌 리어 도어", probability: 0.15, minSeverity: "중간" },
      { target: "좌 B필러", probability: 0.1, minSeverity: "심각" },
      { target: "좌 C필러", probability: 0.1, minSeverity: "심각" },
      { target: "좌 도어핸들", probability: 0.1, minSeverity: "경미" },
      { target: "좌 리어쿼터패널", probability: 0.05, minSeverity: "심각" },
      { target: "사이드/커튼 에어백", probability: 0.1, minSeverity: "심각" },
      { target: "좌 사이드몰딩", probability: 0.1, minSeverity: "경미" },
      { target: "리어 유리", probability: 0.05, minSeverity: "심각" }
    ]
  },

  // ── 우측면 (Right Side) ───────────────────────────────────────────────
  "우 프론트 펜더": {
    chain: [
      { target: "우 프론트 도어", probability: 0.4, minSeverity: "중간" },
      { target: "우 헤드라이트", probability: 0.3, minSeverity: "중간" },
      { target: "우 사이드미러", probability: 0.25, minSeverity: "중간" },
      { target: "우 A필러", probability: 0.2, minSeverity: "심각" },
      { target: "본넷", probability: 0.15, minSeverity: "중간" },
      { target: "우 전륜 휠/타이어", probability: 0.2, minSeverity: "중간" },
      { target: "우 사이드몰딩", probability: 0.4, minSeverity: "경미" },
      { target: "우 안개등", probability: 0.2, minSeverity: "중간" },
      { target: "프론트 범퍼(상)", probability: 0.15, minSeverity: "중간" },
      { target: "우 전 서스펜션", probability: 0.15, minSeverity: "심각" }
    ]
  },
  "우 A필러": {
    chain: [
      { target: "전면 유리", probability: 0.5, minSeverity: "심각" },
      { target: "우 프론트 펜더", probability: 0.4, minSeverity: "심각" },
      { target: "우 프론트 도어", probability: 0.4, minSeverity: "심각" },
      { target: "루프패널", probability: 0.3, minSeverity: "심각" },
      { target: "우 도어유리(전)", probability: 0.3, minSeverity: "심각" },
      { target: "우 사이드실(로커패널)", probability: 0.2, minSeverity: "심각" },
      { target: "에어백(조수석)", probability: 0.15, minSeverity: "심각" },
      { target: "사이드/커튼 에어백", probability: 0.2, minSeverity: "심각" },
      { target: "카메라 캘리브레이션", probability: 0.2, minSeverity: "심각" }
    ]
  },
  "우 프론트 도어": {
    chain: [
      { target: "우 사이드미러", probability: 0.5, minSeverity: "중간" },
      { target: "우 도어핸들", probability: 0.4, minSeverity: "중간" },
      { target: "우 도어유리(전)", probability: 0.35, minSeverity: "중간" },
      { target: "우 B필러", probability: 0.3, minSeverity: "심각" },
      { target: "우 리어 도어", probability: 0.25, minSeverity: "심각" },
      { target: "우 프론트 펜더", probability: 0.2, minSeverity: "중간" },
      { target: "우 사이드몰딩", probability: 0.6, minSeverity: "경미" },
      { target: "우 A필러", probability: 0.2, minSeverity: "심각" },
      { target: "우 사이드실(로커패널)", probability: 0.15, minSeverity: "심각" },
      { target: "사이드/커튼 에어백", probability: 0.15, minSeverity: "심각" },
      { target: "에어백(조수석)", probability: 0.1, minSeverity: "심각" }
    ]
  },
  "우 B필러": {
    chain: [
      { target: "우 프론트 도어", probability: 0.4, minSeverity: "심각" },
      { target: "우 리어 도어", probability: 0.4, minSeverity: "심각" },
      { target: "루프패널", probability: 0.3, minSeverity: "심각" },
      { target: "우 사이드실(로커패널)", probability: 0.5, minSeverity: "심각" },
      { target: "우 도어유리(전)", probability: 0.25, minSeverity: "심각" },
      { target: "우 도어유리(후)", probability: 0.25, minSeverity: "심각" },
      { target: "사이드/커튼 에어백", probability: 0.3, minSeverity: "심각" },
      { target: "플로어패널", probability: 0.2, minSeverity: "심각" },
      { target: "우 사이드몰딩", probability: 0.4, minSeverity: "경미" }
    ]
  },
  "우 리어 도어": {
    chain: [
      { target: "우 B필러", probability: 0.3, minSeverity: "심각" },
      { target: "우 C필러", probability: 0.25, minSeverity: "심각" },
      { target: "우 프론트 도어", probability: 0.2, minSeverity: "심각" },
      { target: "우 도어핸들", probability: 0.4, minSeverity: "중간" },
      { target: "우 도어유리(후)", probability: 0.35, minSeverity: "중간" },
      { target: "우 사이드몰딩", probability: 0.6, minSeverity: "경미" },
      { target: "우 사이드실(로커패널)", probability: 0.2, minSeverity: "심각" },
      { target: "우 리어쿼터패널", probability: 0.15, minSeverity: "심각" },
      { target: "사이드/커튼 에어백", probability: 0.15, minSeverity: "심각" }
    ]
  },
  "우 C필러": {
    chain: [
      { target: "우 리어 도어", probability: 0.3, minSeverity: "심각" },
      { target: "우 리어쿼터패널", probability: 0.5, minSeverity: "심각" },
      { target: "루프패널", probability: 0.25, minSeverity: "심각" },
      { target: "리어 유리", probability: 0.2, minSeverity: "심각" },
      { target: "우 도어유리(후)", probability: 0.2, minSeverity: "심각" },
      { target: "트렁크/테일게이트", probability: 0.1, minSeverity: "심각" },
      { target: "사이드/커튼 에어백", probability: 0.2, minSeverity: "심각" }
    ]
  },
  "우 리어쿼터패널": {
    chain: [
      { target: "리어 범퍼(상)", probability: 0.35, minSeverity: "중간" },
      { target: "우 리어램프", probability: 0.4, minSeverity: "중간" },
      { target: "우 C필러", probability: 0.3, minSeverity: "심각" },
      { target: "트렁크/테일게이트", probability: 0.2, minSeverity: "심각" },
      { target: "우 리어 도어", probability: 0.2, minSeverity: "심각" },
      { target: "우 후륜 휠/타이어", probability: 0.2, minSeverity: "중간" },
      { target: "우 사이드실(로커패널)", probability: 0.15, minSeverity: "심각" },
      { target: "연료탱크/배터리팩", probability: 0.1, minSeverity: "심각" },
      { target: "우 후 서스펜션", probability: 0.15, minSeverity: "심각" },
      { target: "우 사이드몰딩", probability: 0.4, minSeverity: "경미" }
    ]
  },
  "우 사이드미러": {
    chain: [
      { target: "우 프론트 도어", probability: 0.15, minSeverity: "경미" },
      { target: "우 도어유리(전)", probability: 0.2, minSeverity: "중간" },
      { target: "우 프론트 펜더", probability: 0.1, minSeverity: "중간" },
      { target: "후측방 레이더(우)", probability: 0.3, minSeverity: "경미" },
      { target: "카메라 캘리브레이션", probability: 0.4, minSeverity: "경미" },
      { target: "우 A필러", probability: 0.05, minSeverity: "심각" },
      { target: "우 사이드몰딩", probability: 0.1, minSeverity: "경미" },
      { target: "우 도어핸들", probability: 0.05, minSeverity: "경미" }
    ]
  },
  "우 도어핸들": {
    chain: [
      { target: "우 프론트 도어", probability: 0.1, minSeverity: "경미" },
      { target: "우 리어 도어", probability: 0.1, minSeverity: "경미" },
      { target: "우 사이드몰딩", probability: 0.15, minSeverity: "경미" },
      { target: "우 도어유리(전)", probability: 0.05, minSeverity: "중간" },
      { target: "우 도어유리(후)", probability: 0.05, minSeverity: "중간" },
      { target: "우 사이드미러", probability: 0.05, minSeverity: "경미" },
      { target: "우 B필러", probability: 0.03, minSeverity: "심각" }
    ]
  },
  "우 사이드몰딩": {
    chain: [
      { target: "우 프론트 도어", probability: 0.1, minSeverity: "경미" },
      { target: "우 리어 도어", probability: 0.1, minSeverity: "경미" },
      { target: "우 프론트 펜더", probability: 0.1, minSeverity: "경미" },
      { target: "우 리어쿼터패널", probability: 0.1, minSeverity: "경미" },
      { target: "우 도어핸들", probability: 0.1, minSeverity: "경미" },
      { target: "우 사이드실(로커패널)", probability: 0.05, minSeverity: "중간" },
      { target: "우 B필러", probability: 0.03, minSeverity: "중간" },
      { target: "우 사이드미러", probability: 0.05, minSeverity: "경미" }
    ]
  },
  "우 도어유리(전)": {
    chain: [
      { target: "우 프론트 도어", probability: 0.15, minSeverity: "중간" },
      { target: "우 사이드미러", probability: 0.15, minSeverity: "중간" },
      { target: "우 A필러", probability: 0.1, minSeverity: "심각" },
      { target: "우 B필러", probability: 0.1, minSeverity: "심각" },
      { target: "우 도어핸들", probability: 0.1, minSeverity: "경미" },
      { target: "사이드/커튼 에어백", probability: 0.1, minSeverity: "심각" },
      { target: "우 사이드몰딩", probability: 0.1, minSeverity: "경미" },
      { target: "에어백(조수석)", probability: 0.05, minSeverity: "심각" }
    ]
  },
  "우 도어유리(후)": {
    chain: [
      { target: "우 리어 도어", probability: 0.15, minSeverity: "중간" },
      { target: "우 B필러", probability: 0.1, minSeverity: "심각" },
      { target: "우 C필러", probability: 0.1, minSeverity: "심각" },
      { target: "우 도어핸들", probability: 0.1, minSeverity: "경미" },
      { target: "우 리어쿼터패널", probability: 0.05, minSeverity: "심각" },
      { target: "사이드/커튼 에어백", probability: 0.1, minSeverity: "심각" },
      { target: "우 사이드몰딩", probability: 0.1, minSeverity: "경미" },
      { target: "리어 유리", probability: 0.05, minSeverity: "심각" }
    ]
  },

  // ── 상부 (Top / Roof) ────────────────────────────────────────────────
  "루프패널": {
    chain: [
      { target: "좌 A필러", probability: 0.2, minSeverity: "심각" },
      { target: "우 A필러", probability: 0.2, minSeverity: "심각" },
      { target: "좌 B필러", probability: 0.15, minSeverity: "심각" },
      { target: "우 B필러", probability: 0.15, minSeverity: "심각" },
      { target: "좌 C필러", probability: 0.1, minSeverity: "심각" },
      { target: "우 C필러", probability: 0.1, minSeverity: "심각" },
      { target: "루프랙/레일", probability: 0.5, minSeverity: "경미" },
      { target: "안테나/샤크핀", probability: 0.3, minSeverity: "경미" },
      { target: "선루프 유리", probability: 0.4, minSeverity: "중간" },
      { target: "선루프 프레임", probability: 0.35, minSeverity: "중간" },
      { target: "전면 유리", probability: 0.15, minSeverity: "심각" },
      { target: "리어 유리", probability: 0.15, minSeverity: "심각" }
    ]
  },
  "선루프 유리": {
    chain: [
      { target: "루프패널", probability: 0.2, minSeverity: "심각" },
      { target: "선루프 프레임", probability: 0.6, minSeverity: "중간" },
      { target: "안테나/샤크핀", probability: 0.15, minSeverity: "중간" },
      { target: "루프랙/레일", probability: 0.1, minSeverity: "중간" },
      { target: "좌 B필러", probability: 0.05, minSeverity: "심각" },
      { target: "우 B필러", probability: 0.05, minSeverity: "심각" },
      { target: "좌 A필러", probability: 0.03, minSeverity: "심각" },
      { target: "우 A필러", probability: 0.03, minSeverity: "심각" },
      { target: "전면 유리", probability: 0.05, minSeverity: "심각" }
    ]
  },
  "선루프 프레임": {
    chain: [
      { target: "선루프 유리", probability: 0.7, minSeverity: "경미" },
      { target: "루프패널", probability: 0.4, minSeverity: "심각" },
      { target: "좌 A필러", probability: 0.1, minSeverity: "심각" },
      { target: "우 A필러", probability: 0.1, minSeverity: "심각" },
      { target: "좌 B필러", probability: 0.1, minSeverity: "심각" },
      { target: "우 B필러", probability: 0.1, minSeverity: "심각" },
      { target: "안테나/샤크핀", probability: 0.15, minSeverity: "중간" },
      { target: "루프랙/레일", probability: 0.2, minSeverity: "중간" },
      { target: "전면 유리", probability: 0.05, minSeverity: "심각" },
      { target: "리어 유리", probability: 0.05, minSeverity: "심각" }
    ]
  },
  "루프랙/레일": {
    chain: [
      { target: "루프패널", probability: 0.3, minSeverity: "중간" },
      { target: "좌 A필러", probability: 0.1, minSeverity: "심각" },
      { target: "우 A필러", probability: 0.1, minSeverity: "심각" },
      { target: "좌 C필러", probability: 0.1, minSeverity: "심각" },
      { target: "우 C필러", probability: 0.1, minSeverity: "심각" },
      { target: "선루프 유리", probability: 0.1, minSeverity: "중간" },
      { target: "안테나/샤크핀", probability: 0.15, minSeverity: "경미" },
      { target: "선루프 프레임", probability: 0.1, minSeverity: "중간" },
      { target: "좌 B필러", probability: 0.05, minSeverity: "심각" },
      { target: "우 B필러", probability: 0.05, minSeverity: "심각" }
    ]
  },
  "안테나/샤크핀": {
    chain: [
      { target: "루프패널", probability: 0.15, minSeverity: "경미" },
      { target: "리어 유리", probability: 0.05, minSeverity: "심각" },
      { target: "선루프 유리", probability: 0.05, minSeverity: "중간" },
      { target: "AVN/인포테인먼트", probability: 0.1, minSeverity: "중간" },
      { target: "루프랙/레일", probability: 0.1, minSeverity: "경미" },
      { target: "선루프 프레임", probability: 0.05, minSeverity: "중간" },
      { target: "좌 C필러", probability: 0.03, minSeverity: "심각" },
      { target: "우 C필러", probability: 0.03, minSeverity: "심각" }
    ]
  },

  // ── 하부/구조 (Under / Floor / Structure) ─────────────────────────────
  "프론트 서브프레임": {
    chain: [
      { target: "좌 전 서스펜션", probability: 0.6, minSeverity: "심각" },
      { target: "우 전 서스펜션", probability: 0.6, minSeverity: "심각" },
      { target: "스티어링 링키지", probability: 0.5, minSeverity: "심각" },
      { target: "좌 전륜 휠/타이어", probability: 0.3, minSeverity: "심각" },
      { target: "우 전륜 휠/타이어", probability: 0.3, minSeverity: "심각" },
      { target: "좌 프론트 펜더", probability: 0.2, minSeverity: "심각" },
      { target: "우 프론트 펜더", probability: 0.2, minSeverity: "심각" },
      { target: "언더커버", probability: 0.4, minSeverity: "중간" },
      { target: "플로어패널", probability: 0.3, minSeverity: "심각" },
      { target: "브레이크(전)", probability: 0.25, minSeverity: "심각" },
      { target: "라디에이터", probability: 0.2, minSeverity: "심각" }
    ]
  },
  "리어 서브프레임": {
    chain: [
      { target: "좌 후 서스펜션", probability: 0.6, minSeverity: "심각" },
      { target: "우 후 서스펜션", probability: 0.6, minSeverity: "심각" },
      { target: "좌 후륜 휠/타이어", probability: 0.3, minSeverity: "심각" },
      { target: "우 후륜 휠/타이어", probability: 0.3, minSeverity: "심각" },
      { target: "플로어패널", probability: 0.3, minSeverity: "심각" },
      { target: "연료탱크/배터리팩", probability: 0.25, minSeverity: "심각" },
      { target: "머플러/배기팁", probability: 0.2, minSeverity: "심각" },
      { target: "브레이크(후)", probability: 0.25, minSeverity: "심각" },
      { target: "언더커버", probability: 0.3, minSeverity: "중간" },
      { target: "좌 리어쿼터패널", probability: 0.15, minSeverity: "심각" },
      { target: "우 리어쿼터패널", probability: 0.15, minSeverity: "심각" }
    ]
  },
  "좌 사이드실(로커패널)": {
    chain: [
      { target: "좌 프론트 도어", probability: 0.2, minSeverity: "심각" },
      { target: "좌 리어 도어", probability: 0.2, minSeverity: "심각" },
      { target: "좌 B필러", probability: 0.3, minSeverity: "심각" },
      { target: "좌 A필러", probability: 0.2, minSeverity: "심각" },
      { target: "플로어패널", probability: 0.4, minSeverity: "심각" },
      { target: "좌 사이드몰딩", probability: 0.6, minSeverity: "경미" },
      { target: "좌 프론트 펜더", probability: 0.15, minSeverity: "심각" },
      { target: "좌 리어쿼터패널", probability: 0.15, minSeverity: "심각" },
      { target: "고전압 배터리(EV)", probability: 0.2, minSeverity: "심각" }
    ]
  },
  "우 사이드실(로커패널)": {
    chain: [
      { target: "우 프론트 도어", probability: 0.2, minSeverity: "심각" },
      { target: "우 리어 도어", probability: 0.2, minSeverity: "심각" },
      { target: "우 B필러", probability: 0.3, minSeverity: "심각" },
      { target: "우 A필러", probability: 0.2, minSeverity: "심각" },
      { target: "플로어패널", probability: 0.4, minSeverity: "심각" },
      { target: "우 사이드몰딩", probability: 0.6, minSeverity: "경미" },
      { target: "우 프론트 펜더", probability: 0.15, minSeverity: "심각" },
      { target: "우 리어쿼터패널", probability: 0.15, minSeverity: "심각" },
      { target: "고전압 배터리(EV)", probability: 0.2, minSeverity: "심각" }
    ]
  },
  "플로어패널": {
    chain: [
      { target: "좌 사이드실(로커패널)", probability: 0.3, minSeverity: "심각" },
      { target: "우 사이드실(로커패널)", probability: 0.3, minSeverity: "심각" },
      { target: "프론트 서브프레임", probability: 0.2, minSeverity: "심각" },
      { target: "리어 서브프레임", probability: 0.2, minSeverity: "심각" },
      { target: "연료탱크/배터리팩", probability: 0.25, minSeverity: "심각" },
      { target: "고전압 배터리(EV)", probability: 0.3, minSeverity: "심각" },
      { target: "언더커버", probability: 0.3, minSeverity: "중간" },
      { target: "좌 B필러", probability: 0.15, minSeverity: "심각" },
      { target: "우 B필러", probability: 0.15, minSeverity: "심각" },
      { target: "머플러/배기팁", probability: 0.15, minSeverity: "심각" }
    ]
  },
  "언더커버": {
    chain: [
      { target: "프론트 서브프레임", probability: 0.15, minSeverity: "심각" },
      { target: "리어 서브프레임", probability: 0.1, minSeverity: "심각" },
      { target: "플로어패널", probability: 0.1, minSeverity: "심각" },
      { target: "머플러/배기팁", probability: 0.2, minSeverity: "중간" },
      { target: "연료탱크/배터리팩", probability: 0.15, minSeverity: "심각" },
      { target: "고전압 배터리(EV)", probability: 0.15, minSeverity: "심각" },
      { target: "좌 전 서스펜션", probability: 0.1, minSeverity: "중간" },
      { target: "우 전 서스펜션", probability: 0.1, minSeverity: "중간" }
    ]
  },
  "연료탱크/배터리팩": {
    chain: [
      { target: "플로어패널", probability: 0.3, minSeverity: "심각" },
      { target: "리어 서브프레임", probability: 0.25, minSeverity: "심각" },
      { target: "언더커버", probability: 0.3, minSeverity: "중간" },
      { target: "머플러/배기팁", probability: 0.2, minSeverity: "심각" },
      { target: "좌 사이드실(로커패널)", probability: 0.15, minSeverity: "심각" },
      { target: "우 사이드실(로커패널)", probability: 0.15, minSeverity: "심각" },
      { target: "좌 리어쿼터패널", probability: 0.1, minSeverity: "심각" },
      { target: "우 리어쿼터패널", probability: 0.1, minSeverity: "심각" },
      { target: "고전압 배터리(EV)", probability: 0.4, minSeverity: "중간" },
      { target: "12V 배터리", probability: 0.2, minSeverity: "심각" },
      { target: "충전포트(EV)", probability: 0.15, minSeverity: "심각" },
      { target: "좌 후 서스펜션", probability: 0.1, minSeverity: "심각" },
      { target: "우 후 서스펜션", probability: 0.1, minSeverity: "심각" }
    ]
  },

  // ── 휠/서스펜션 (Wheels / Suspension) ──────────────────────────────────
  "좌 전륜 휠/타이어": {
    chain: [
      { target: "좌 프론트 펜더", probability: 0.3, minSeverity: "중간" },
      { target: "좌 전 서스펜션", probability: 0.5, minSeverity: "심각" },
      { target: "브레이크(전)", probability: 0.35, minSeverity: "심각" },
      { target: "스티어링 링키지", probability: 0.25, minSeverity: "심각" },
      { target: "프론트 서브프레임", probability: 0.2, minSeverity: "심각" },
      { target: "좌 안개등", probability: 0.15, minSeverity: "중간" },
      { target: "좌 사이드실(로커패널)", probability: 0.1, minSeverity: "심각" },
      { target: "프론트 범퍼(하/립)", probability: 0.2, minSeverity: "중간" },
      { target: "언더커버", probability: 0.2, minSeverity: "경미" }
    ]
  },
  "우 전륜 휠/타이어": {
    chain: [
      { target: "우 프론트 펜더", probability: 0.3, minSeverity: "중간" },
      { target: "우 전 서스펜션", probability: 0.5, minSeverity: "심각" },
      { target: "브레이크(전)", probability: 0.35, minSeverity: "심각" },
      { target: "스티어링 링키지", probability: 0.25, minSeverity: "심각" },
      { target: "프론트 서브프레임", probability: 0.2, minSeverity: "심각" },
      { target: "우 안개등", probability: 0.15, minSeverity: "중간" },
      { target: "우 사이드실(로커패널)", probability: 0.1, minSeverity: "심각" },
      { target: "프론트 범퍼(하/립)", probability: 0.2, minSeverity: "중간" },
      { target: "언더커버", probability: 0.2, minSeverity: "경미" }
    ]
  },
  "좌 후륜 휠/타이어": {
    chain: [
      { target: "좌 리어쿼터패널", probability: 0.3, minSeverity: "중간" },
      { target: "좌 후 서스펜션", probability: 0.5, minSeverity: "심각" },
      { target: "브레이크(후)", probability: 0.35, minSeverity: "심각" },
      { target: "리어 서브프레임", probability: 0.2, minSeverity: "심각" },
      { target: "좌 사이드실(로커패널)", probability: 0.1, minSeverity: "심각" },
      { target: "리어 범퍼(하/디퓨저)", probability: 0.15, minSeverity: "중간" },
      { target: "연료탱크/배터리팩", probability: 0.1, minSeverity: "심각" }
    ]
  },
  "우 후륜 휠/타이어": {
    chain: [
      { target: "우 리어쿼터패널", probability: 0.3, minSeverity: "중간" },
      { target: "우 후 서스펜션", probability: 0.5, minSeverity: "심각" },
      { target: "브레이크(후)", probability: 0.35, minSeverity: "심각" },
      { target: "리어 서브프레임", probability: 0.2, minSeverity: "심각" },
      { target: "우 사이드실(로커패널)", probability: 0.1, minSeverity: "심각" },
      { target: "리어 범퍼(하/디퓨저)", probability: 0.15, minSeverity: "중간" },
      { target: "연료탱크/배터리팩", probability: 0.1, minSeverity: "심각" }
    ]
  },
  "좌 전 서스펜션": {
    chain: [
      { target: "좌 전륜 휠/타이어", probability: 0.6, minSeverity: "중간" },
      { target: "프론트 서브프레임", probability: 0.4, minSeverity: "심각" },
      { target: "스티어링 링키지", probability: 0.35, minSeverity: "심각" },
      { target: "브레이크(전)", probability: 0.3, minSeverity: "심각" },
      { target: "좌 프론트 펜더", probability: 0.15, minSeverity: "심각" },
      { target: "언더커버", probability: 0.2, minSeverity: "중간" },
      { target: "좌 사이드실(로커패널)", probability: 0.1, minSeverity: "심각" },
      { target: "좌 A필러", probability: 0.05, minSeverity: "심각" },
      { target: "플로어패널", probability: 0.1, minSeverity: "심각" }
    ]
  },
  "우 전 서스펜션": {
    chain: [
      { target: "우 전륜 휠/타이어", probability: 0.6, minSeverity: "중간" },
      { target: "프론트 서브프레임", probability: 0.4, minSeverity: "심각" },
      { target: "스티어링 링키지", probability: 0.35, minSeverity: "심각" },
      { target: "브레이크(전)", probability: 0.3, minSeverity: "심각" },
      { target: "우 프론트 펜더", probability: 0.15, minSeverity: "심각" },
      { target: "언더커버", probability: 0.2, minSeverity: "중간" },
      { target: "우 사이드실(로커패널)", probability: 0.1, minSeverity: "심각" },
      { target: "우 A필러", probability: 0.05, minSeverity: "심각" },
      { target: "플로어패널", probability: 0.1, minSeverity: "심각" }
    ]
  },
  "좌 후 서스펜션": {
    chain: [
      { target: "좌 후륜 휠/타이어", probability: 0.6, minSeverity: "중간" },
      { target: "리어 서브프레임", probability: 0.4, minSeverity: "심각" },
      { target: "브레이크(후)", probability: 0.3, minSeverity: "심각" },
      { target: "좌 리어쿼터패널", probability: 0.15, minSeverity: "심각" },
      { target: "연료탱크/배터리팩", probability: 0.1, minSeverity: "심각" },
      { target: "좌 사이드실(로커패널)", probability: 0.1, minSeverity: "심각" },
      { target: "플로어패널", probability: 0.1, minSeverity: "심각" },
      { target: "머플러/배기팁", probability: 0.05, minSeverity: "심각" }
    ]
  },
  "우 후 서스펜션": {
    chain: [
      { target: "우 후륜 휠/타이어", probability: 0.6, minSeverity: "중간" },
      { target: "리어 서브프레임", probability: 0.4, minSeverity: "심각" },
      { target: "브레이크(후)", probability: 0.3, minSeverity: "심각" },
      { target: "우 리어쿼터패널", probability: 0.15, minSeverity: "심각" },
      { target: "연료탱크/배터리팩", probability: 0.1, minSeverity: "심각" },
      { target: "우 사이드실(로커패널)", probability: 0.1, minSeverity: "심각" },
      { target: "플로어패널", probability: 0.1, minSeverity: "심각" },
      { target: "머플러/배기팁", probability: 0.05, minSeverity: "심각" }
    ]
  },
  "스티어링 링키지": {
    chain: [
      { target: "좌 전 서스펜션", probability: 0.4, minSeverity: "심각" },
      { target: "우 전 서스펜션", probability: 0.4, minSeverity: "심각" },
      { target: "프론트 서브프레임", probability: 0.35, minSeverity: "심각" },
      { target: "좌 전륜 휠/타이어", probability: 0.3, minSeverity: "심각" },
      { target: "우 전륜 휠/타이어", probability: 0.3, minSeverity: "심각" },
      { target: "브레이크(전)", probability: 0.2, minSeverity: "심각" },
      { target: "에어백(운전석)", probability: 0.1, minSeverity: "심각" },
      { target: "계기판/클러스터", probability: 0.05, minSeverity: "심각" },
      { target: "언더커버", probability: 0.15, minSeverity: "중간" },
      { target: "좌 프론트 펜더", probability: 0.1, minSeverity: "심각" },
      { target: "우 프론트 펜더", probability: 0.1, minSeverity: "심각" }
    ]
  },
  "브레이크(전)": {
    chain: [
      { target: "좌 전륜 휠/타이어", probability: 0.3, minSeverity: "심각" },
      { target: "우 전륜 휠/타이어", probability: 0.3, minSeverity: "심각" },
      { target: "좌 전 서스펜션", probability: 0.2, minSeverity: "심각" },
      { target: "우 전 서스펜션", probability: 0.2, minSeverity: "심각" },
      { target: "프론트 서브프레임", probability: 0.1, minSeverity: "심각" },
      { target: "스티어링 링키지", probability: 0.15, minSeverity: "심각" },
      { target: "좌 프론트 펜더", probability: 0.05, minSeverity: "심각" },
      { target: "우 프론트 펜더", probability: 0.05, minSeverity: "심각" },
      { target: "언더커버", probability: 0.1, minSeverity: "중간" }
    ]
  },
  "브레이크(후)": {
    chain: [
      { target: "좌 후륜 휠/타이어", probability: 0.3, minSeverity: "심각" },
      { target: "우 후륜 휠/타이어", probability: 0.3, minSeverity: "심각" },
      { target: "좌 후 서스펜션", probability: 0.2, minSeverity: "심각" },
      { target: "우 후 서스펜션", probability: 0.2, minSeverity: "심각" },
      { target: "리어 서브프레임", probability: 0.1, minSeverity: "심각" },
      { target: "좌 리어쿼터패널", probability: 0.05, minSeverity: "심각" },
      { target: "우 리어쿼터패널", probability: 0.05, minSeverity: "심각" },
      { target: "연료탱크/배터리팩", probability: 0.05, minSeverity: "심각" }
    ]
  },

  // ── 기타/ADAS (ADAS / Electronics / Safety) ───────────────────────────
  "에어백(운전석)": {
    chain: [
      { target: "계기판/클러스터", probability: 0.3, minSeverity: "심각" },
      { target: "AVN/인포테인먼트", probability: 0.15, minSeverity: "심각" },
      { target: "좌 A필러", probability: 0.2, minSeverity: "심각" },
      { target: "좌 프론트 도어", probability: 0.1, minSeverity: "심각" },
      { target: "전면 유리", probability: 0.1, minSeverity: "심각" },
      { target: "사이드/커튼 에어백", probability: 0.4, minSeverity: "심각" },
      { target: "에어백(조수석)", probability: 0.3, minSeverity: "심각" },
      { target: "스티어링 링키지", probability: 0.15, minSeverity: "심각" },
      { target: "좌 도어유리(전)", probability: 0.05, minSeverity: "심각" },
      { target: "본넷", probability: 0.05, minSeverity: "심각" }
    ]
  },
  "에어백(조수석)": {
    chain: [
      { target: "계기판/클러스터", probability: 0.25, minSeverity: "심각" },
      { target: "AVN/인포테인먼트", probability: 0.2, minSeverity: "심각" },
      { target: "우 A필러", probability: 0.2, minSeverity: "심각" },
      { target: "우 프론트 도어", probability: 0.1, minSeverity: "심각" },
      { target: "전면 유리", probability: 0.1, minSeverity: "심각" },
      { target: "사이드/커튼 에어백", probability: 0.4, minSeverity: "심각" },
      { target: "에어백(운전석)", probability: 0.3, minSeverity: "심각" },
      { target: "우 도어유리(전)", probability: 0.05, minSeverity: "심각" },
      { target: "본넷", probability: 0.05, minSeverity: "심각" }
    ]
  },
  "사이드/커튼 에어백": {
    chain: [
      { target: "에어백(운전석)", probability: 0.3, minSeverity: "심각" },
      { target: "에어백(조수석)", probability: 0.3, minSeverity: "심각" },
      { target: "루프패널", probability: 0.15, minSeverity: "심각" },
      { target: "좌 B필러", probability: 0.2, minSeverity: "심각" },
      { target: "우 B필러", probability: 0.2, minSeverity: "심각" },
      { target: "좌 C필러", probability: 0.15, minSeverity: "심각" },
      { target: "우 C필러", probability: 0.15, minSeverity: "심각" },
      { target: "좌 도어유리(전)", probability: 0.1, minSeverity: "심각" },
      { target: "우 도어유리(전)", probability: 0.1, minSeverity: "심각" },
      { target: "좌 도어유리(후)", probability: 0.1, minSeverity: "심각" },
      { target: "우 도어유리(후)", probability: 0.1, minSeverity: "심각" },
      { target: "좌 A필러", probability: 0.1, minSeverity: "심각" },
      { target: "우 A필러", probability: 0.1, minSeverity: "심각" },
      { target: "좌 사이드실(로커패널)", probability: 0.05, minSeverity: "심각" },
      { target: "우 사이드실(로커패널)", probability: 0.05, minSeverity: "심각" }
    ]
  },
  "계기판/클러스터": {
    chain: [
      { target: "에어백(운전석)", probability: 0.2, minSeverity: "심각" },
      { target: "AVN/인포테인먼트", probability: 0.3, minSeverity: "중간" },
      { target: "전면 유리", probability: 0.05, minSeverity: "심각" },
      { target: "좌 A필러", probability: 0.1, minSeverity: "심각" },
      { target: "에어컨/냉방", probability: 0.1, minSeverity: "중간" },
      { target: "전방 카메라/센서", probability: 0.1, minSeverity: "중간" },
      { target: "에어백(조수석)", probability: 0.15, minSeverity: "심각" },
      { target: "카메라 캘리브레이션", probability: 0.1, minSeverity: "중간" },
      { target: "12V 배터리", probability: 0.1, minSeverity: "심각" },
      { target: "스티어링 링키지", probability: 0.05, minSeverity: "심각" }
    ]
  },
  "AVN/인포테인먼트": {
    chain: [
      { target: "계기판/클러스터", probability: 0.25, minSeverity: "중간" },
      { target: "에어컨/냉방", probability: 0.15, minSeverity: "중간" },
      { target: "전방 카메라/센서", probability: 0.1, minSeverity: "중간" },
      { target: "후방 카메라", probability: 0.1, minSeverity: "중간" },
      { target: "카메라 캘리브레이션", probability: 0.2, minSeverity: "경미" },
      { target: "어라운드뷰 전면", probability: 0.15, minSeverity: "중간" },
      { target: "후방 주차센서", probability: 0.1, minSeverity: "중간" },
      { target: "12V 배터리", probability: 0.1, minSeverity: "심각" },
      { target: "안테나/샤크핀", probability: 0.05, minSeverity: "경미" },
      { target: "라이다", probability: 0.05, minSeverity: "중간" },
      { target: "전방 레이더", probability: 0.05, minSeverity: "중간" }
    ]
  },
  "에어컨/냉방": {
    chain: [
      { target: "라디에이터", probability: 0.3, minSeverity: "중간" },
      { target: "프론트 범퍼(상)", probability: 0.05, minSeverity: "심각" },
      { target: "계기판/클러스터", probability: 0.1, minSeverity: "중간" },
      { target: "AVN/인포테인먼트", probability: 0.05, minSeverity: "중간" },
      { target: "인터쿨러", probability: 0.2, minSeverity: "중간" },
      { target: "프론트 그릴", probability: 0.1, minSeverity: "심각" },
      { target: "12V 배터리", probability: 0.1, minSeverity: "심각" },
      { target: "전면 유리", probability: 0.02, minSeverity: "심각" }
    ]
  },
  "전방 레이더": {
    chain: [
      { target: "프론트 그릴", probability: 0.1, minSeverity: "경미" },
      { target: "프론트 범퍼(상)", probability: 0.1, minSeverity: "경미" },
      { target: "프론트 엠블럼", probability: 0.15, minSeverity: "경미" },
      { target: "카메라 캘리브레이션", probability: 0.8, minSeverity: "경미" },
      { target: "전방 카메라/센서", probability: 0.2, minSeverity: "중간" },
      { target: "라이다", probability: 0.15, minSeverity: "중간" },
      { target: "계기판/클러스터", probability: 0.05, minSeverity: "중간" },
      { target: "AVN/인포테인먼트", probability: 0.05, minSeverity: "중간" },
      { target: "어라운드뷰 전면", probability: 0.1, minSeverity: "경미" }
    ]
  },
  "후측방 레이더(좌)": {
    chain: [
      { target: "리어 범퍼(상)", probability: 0.1, minSeverity: "경미" },
      { target: "좌 리어쿼터패널", probability: 0.1, minSeverity: "경미" },
      { target: "카메라 캘리브레이션", probability: 0.7, minSeverity: "경미" },
      { target: "좌 사이드미러", probability: 0.1, minSeverity: "경미" },
      { target: "후측방 레이더(우)", probability: 0.05, minSeverity: "중간" },
      { target: "AVN/인포테인먼트", probability: 0.05, minSeverity: "중간" },
      { target: "라이다", probability: 0.05, minSeverity: "중간" },
      { target: "후방 카메라", probability: 0.05, minSeverity: "경미" }
    ]
  },
  "후측방 레이더(우)": {
    chain: [
      { target: "리어 범퍼(상)", probability: 0.1, minSeverity: "경미" },
      { target: "우 리어쿼터패널", probability: 0.1, minSeverity: "경미" },
      { target: "카메라 캘리브레이션", probability: 0.7, minSeverity: "경미" },
      { target: "우 사이드미러", probability: 0.1, minSeverity: "경미" },
      { target: "후측방 레이더(좌)", probability: 0.05, minSeverity: "중간" },
      { target: "AVN/인포테인먼트", probability: 0.05, minSeverity: "중간" },
      { target: "라이다", probability: 0.05, minSeverity: "중간" },
      { target: "후방 카메라", probability: 0.05, minSeverity: "경미" }
    ]
  },
  "라이다": {
    chain: [
      { target: "전방 카메라/센서", probability: 0.2, minSeverity: "중간" },
      { target: "전방 레이더", probability: 0.15, minSeverity: "중간" },
      { target: "카메라 캘리브레이션", probability: 0.85, minSeverity: "경미" },
      { target: "루프패널", probability: 0.1, minSeverity: "중간" },
      { target: "전면 유리", probability: 0.1, minSeverity: "중간" },
      { target: "AVN/인포테인먼트", probability: 0.1, minSeverity: "중간" },
      { target: "계기판/클러스터", probability: 0.05, minSeverity: "중간" },
      { target: "후측방 레이더(좌)", probability: 0.1, minSeverity: "중간" },
      { target: "후측방 레이더(우)", probability: 0.1, minSeverity: "중간" },
      { target: "어라운드뷰 전면", probability: 0.15, minSeverity: "경미" }
    ]
  },
  "카메라 캘리브레이션": {
    chain: [
      { target: "전방 카메라/센서", probability: 0.3, minSeverity: "경미" },
      { target: "후방 카메라", probability: 0.3, minSeverity: "경미" },
      { target: "전방 레이더", probability: 0.25, minSeverity: "경미" },
      { target: "후측방 레이더(좌)", probability: 0.2, minSeverity: "경미" },
      { target: "후측방 레이더(우)", probability: 0.2, minSeverity: "경미" },
      { target: "라이다", probability: 0.2, minSeverity: "경미" },
      { target: "어라운드뷰 전면", probability: 0.25, minSeverity: "경미" },
      { target: "AVN/인포테인먼트", probability: 0.15, minSeverity: "경미" },
      { target: "계기판/클러스터", probability: 0.1, minSeverity: "경미" },
      { target: "후방 주차센서", probability: 0.15, minSeverity: "경미" },
      { target: "전면 유리", probability: 0.05, minSeverity: "중간" }
    ]
  },
  "12V 배터리": {
    chain: [
      { target: "계기판/클러스터", probability: 0.1, minSeverity: "심각" },
      { target: "AVN/인포테인먼트", probability: 0.1, minSeverity: "심각" },
      { target: "좌 헤드라이트", probability: 0.05, minSeverity: "심각" },
      { target: "우 헤드라이트", probability: 0.05, minSeverity: "심각" },
      { target: "에어컨/냉방", probability: 0.05, minSeverity: "심각" },
      { target: "고전압 배터리(EV)", probability: 0.15, minSeverity: "심각" },
      { target: "전방 카메라/센서", probability: 0.05, minSeverity: "심각" },
      { target: "후방 카메라", probability: 0.05, minSeverity: "심각" },
      { target: "카메라 캘리브레이션", probability: 0.1, minSeverity: "심각" },
      { target: "충전포트(EV)", probability: 0.1, minSeverity: "심각" },
      { target: "에어백(운전석)", probability: 0.05, minSeverity: "심각" },
      { target: "에어백(조수석)", probability: 0.05, minSeverity: "심각" }
    ]
  },
  "고전압 배터리(EV)": {
    chain: [
      { target: "플로어패널", probability: 0.4, minSeverity: "심각" },
      { target: "좌 사이드실(로커패널)", probability: 0.25, minSeverity: "심각" },
      { target: "우 사이드실(로커패널)", probability: 0.25, minSeverity: "심각" },
      { target: "언더커버", probability: 0.3, minSeverity: "중간" },
      { target: "12V 배터리", probability: 0.2, minSeverity: "심각" },
      { target: "충전포트(EV)", probability: 0.15, minSeverity: "심각" },
      { target: "연료탱크/배터리팩", probability: 0.5, minSeverity: "중간" },
      { target: "리어 서브프레임", probability: 0.2, minSeverity: "심각" },
      { target: "AVN/인포테인먼트", probability: 0.1, minSeverity: "심각" },
      { target: "계기판/클러스터", probability: 0.1, minSeverity: "심각" },
      { target: "프론트 서브프레임", probability: 0.15, minSeverity: "심각" },
      { target: "에어컨/냉방", probability: 0.1, minSeverity: "심각" }
    ]
  },
  "충전포트(EV)": {
    chain: [
      { target: "고전압 배터리(EV)", probability: 0.15, minSeverity: "심각" },
      { target: "좌 리어쿼터패널", probability: 0.15, minSeverity: "중간" },
      { target: "우 리어쿼터패널", probability: 0.15, minSeverity: "중간" },
      { target: "리어 범퍼(상)", probability: 0.1, minSeverity: "중간" },
      { target: "12V 배터리", probability: 0.1, minSeverity: "심각" },
      { target: "AVN/인포테인먼트", probability: 0.05, minSeverity: "심각" },
      { target: "계기판/클러스터", probability: 0.05, minSeverity: "심각" },
      { target: "연료탱크/배터리팩", probability: 0.1, minSeverity: "심각" },
      { target: "좌 리어램프", probability: 0.05, minSeverity: "중간" },
      { target: "우 리어램프", probability: 0.05, minSeverity: "중간" }
    ]
  }
};


// ============================================================================
// 3. VEHICLE_CLASS_MULTIPLIERS - 12단계 차량 등급 분류 (확장)
// ============================================================================
const VEHICLE_CLASS_MULTIPLIERS = {
  tiers: [
    {
      id: "domestic_mini",
      label: "국산 경차",
      labelEn: "Domestic Mini",
      partsMult: 0.75,
      laborRate: 30000,
      makes: [],  // determined by model overrides
      examples: ["캐스퍼", "레이", "모닝", "스파크", "다마스"]
    },
    {
      id: "domestic_std",
      label: "국산 일반",
      labelEn: "Domestic Standard",
      partsMult: 1.0,
      laborRate: 34634,
      makes: ["현대", "기아", "쉐보레", "르노코리아", "KG모빌리티(쌍용)"],
      examples: ["아반떼", "K5", "투싼", "셀토스", "트레일블레이저", "QM6", "토레스"]
    },
    {
      id: "domestic_large",
      label: "국산 대형/RV",
      labelEn: "Domestic Large/RV",
      partsMult: 1.15,
      laborRate: 36000,
      makes: [],
      examples: ["팰리세이드", "카니발", "모하비", "스타리아", "쏘렌토"]
    },
    {
      id: "domestic_premium",
      label: "국산 고급",
      labelEn: "Domestic Premium",
      partsMult: 1.3,
      laborRate: 38000,
      makes: ["제네시스"],
      examples: ["G70", "G80", "G90", "GV60", "GV70", "GV80"]
    },
    {
      id: "import_economy",
      label: "수입 경제형",
      labelEn: "Import Economy",
      partsMult: 1.4,
      laborRate: 48000,
      makes: ["BYD", "폴스타", "스마트"],
      examples: ["ATTO 3", "돌핀", "씰", "폴스타 2"]
    },
    {
      id: "import_std",
      label: "수입 일반",
      labelEn: "Import Standard",
      partsMult: 1.6,
      laborRate: 53404,
      makes: ["폭스바겐", "푸조", "시트로엥", "미니", "마쯔다", "닛산", "혼다", "토요타", "스바루"],
      examples: ["골프", "308", "시빅", "RAV4", "CX-5"]
    },
    {
      id: "import_mid",
      label: "수입 중급",
      labelEn: "Import Mid-Range",
      partsMult: 2.0,
      laborRate: 58000,
      makes: ["BMW", "벤츠", "아우디", "볼보", "렉서스", "캐딜락", "링컨", "지프", "인피니티", "알파로메오"],
      examples: ["3시리즈", "C-Class", "A4", "XC60", "ES300h", "CT5"]
    },
    {
      id: "ev_premium",
      label: "EV 프리미엄",
      labelEn: "EV Premium",
      partsMult: 2.5,
      laborRate: 62000,
      makes: [],
      examples: ["아이오닉5 N", "EV9", "iX", "EQS", "모델S", "타이칸", "넥쏘(FCEV)", "미라이(FCEV)"]
    },
    {
      id: "import_premium",
      label: "수입 프리미엄",
      labelEn: "Import Premium",
      partsMult: 2.8,
      laborRate: 65000,
      makes: ["랜드로버", "마세라티", "재규어"],
      examples: ["레인지로버", "그레칼레", "F-PACE", "디펜더"]
    },
    {
      id: "supercar_entry",
      label: "슈퍼카 엔트리",
      labelEn: "Supercar Entry",
      partsMult: 3.5,
      laborRate: 78000,
      makes: ["포르쉐", "테슬라(고급)"],
      examples: ["911", "카이엔 터보", "타이칸", "모델S Plaid", "모델X Plaid"]
    },
    {
      id: "supercar_std",
      label: "슈퍼카 일반",
      labelEn: "Supercar Standard",
      partsMult: 5.0,
      laborRate: 95000,
      makes: ["페라리", "람보르기니", "맥라렌", "애스턴마틴"],
      examples: ["296 GTB", "우라칸", "720S", "DB12", "로마"]
    },
    {
      id: "supercar_ultra",
      label: "슈퍼카 울트라",
      labelEn: "Supercar Ultra",
      partsMult: 8.0,
      laborRate: 150000,
      makes: ["부가티", "롤스로이스", "벤틀리", "파가니", "코닉세그"],
      examples: ["시론", "팬텀", "컨티넨탈 GT", "우아이라", "제스코"]
    }
  ],

  // 특정 모델이 제조사 기본 등급과 다른 경우 오버라이드 (전 브랜드 전 모델)
  modelOverrides: {
    // ── 현대 (기본: domestic_std) ──
    "현대": {
      "캐스퍼": "domestic_mini",
      "베뉴": "domestic_std",
      "코나": "domestic_std",
      "코나 일렉트릭": "domestic_std",
      "아반떼": "domestic_std",
      "아반떼 N": "domestic_std",
      "쏘나타": "domestic_std",
      "투싼": "domestic_std",
      "싼타페": "domestic_large",
      "팰리세이드": "domestic_large",
      "스타리아": "domestic_large",
      "스타리아 라운지": "domestic_large",
      "넥쏘": "ev_premium",  // 수소전기차 (FCEV) — 수소탱크+연료전지 스택
      "아이오닉5": "domestic_std",
      "아이오닉5 N": "ev_premium",
      "아이오닉6": "domestic_std",
      "아이오닉9": "domestic_large",
      "포터II": "domestic_std",
      "마이티": "domestic_std"
    },
    // ── 기아 (기본: domestic_std) ──
    "기아": {
      "레이": "domestic_mini",
      "모닝": "domestic_mini",
      "K3": "domestic_std",
      "K5": "domestic_std",
      "K8": "domestic_large",
      "K9": "domestic_premium",
      "니로": "domestic_std",
      "니로 EV": "domestic_std",
      "셀토스": "domestic_std",
      "스포티지": "domestic_std",
      "쏘렌토": "domestic_large",
      "카니발": "domestic_large",
      "모하비": "domestic_large",
      "EV3": "domestic_std",
      "EV6": "domestic_std",
      "EV6 GT": "domestic_large",
      "EV9": "ev_premium",
      "스팅어": "domestic_premium",
      "봉고III": "domestic_std"
    },
    // ── 쉐보레 (기본: domestic_std) ──
    "쉐보레": {
      "스파크": "domestic_mini",
      "트랙스": "domestic_std",
      "트랙스 크로스오버": "domestic_std",
      "트레일블레이저": "domestic_std",
      "말리부": "domestic_std",
      "콜로라도": "domestic_large",
      "타호": "domestic_large",
      "볼트EV": "domestic_std",
      "볼트EUV": "domestic_std",
      "이쿼녹스EV": "domestic_std"
    },
    // ── 르노코리아 (기본: domestic_std) ──
    "르노코리아": {
      "SM6": "domestic_std",
      "QM6": "domestic_std",
      "XM3": "domestic_std",
      "아르카나": "domestic_std",
      "마스터": "domestic_large",
      "조에": "domestic_std"
    },
    // ── KG모빌리티/쌍용 (기본: domestic_std) ──
    "KG모빌리티(쌍용)": {
      "토레스": "domestic_std",
      "토레스 EVX": "domestic_std",
      "티볼리": "domestic_std",
      "코란도": "domestic_std",
      "렉스턴": "domestic_large",
      "렉스턴 스포츠": "domestic_large",
      "무쏘": "domestic_large"
    },
    // ── 제네시스 (기본: domestic_premium) ──
    "제네시스": {
      "G70": "domestic_premium",
      "G70 슈팅브레이크": "domestic_premium",
      "G80": "domestic_premium",
      "G80 전동화": "domestic_premium",
      "G90": "domestic_premium",
      "G90 롱휠베이스": "import_mid",
      "GV60": "domestic_premium",
      "GV70": "domestic_premium",
      "GV70 전동화": "domestic_premium",
      "GV80": "domestic_premium",
      "GV80 쿠페": "domestic_premium"
    },
    // ── BMW (기본: import_mid) ──
    "BMW": {
      "1시리즈": "import_mid",
      "2시리즈": "import_mid",
      "2시리즈 그란쿠페": "import_mid",
      "2시리즈 액티브투어러": "import_mid",
      "3시리즈": "import_mid",
      "4시리즈": "import_mid",
      "5시리즈": "import_mid",
      "7시리즈": "import_premium",
      "8시리즈": "import_premium",
      "X1": "import_mid",
      "X2": "import_mid",
      "X3": "import_mid",
      "X4": "import_mid",
      "X5": "import_premium",
      "X6": "import_premium",
      "X7": "import_premium",
      "XM": "supercar_entry",
      "Z4": "import_premium",
      "i4": "ev_premium",
      "i5": "ev_premium",
      "i7": "ev_premium",
      "iX": "ev_premium",
      "iX1": "import_mid",
      "iX3": "import_mid",
      "M2": "import_premium",
      "M3": "import_premium",
      "M4": "import_premium",
      "M5": "supercar_entry",
      "M8": "supercar_entry"
    },
    // ── 벤츠 (기본: import_mid) ──
    "벤츠": {
      "A-Class": "import_mid",
      "B-Class": "import_mid",
      "C-Class": "import_mid",
      "E-Class": "import_mid",
      "S-Class": "import_premium",
      "CLA": "import_mid",
      "CLE": "import_mid",
      "CLS": "import_mid",
      "GLA": "import_mid",
      "GLB": "import_mid",
      "GLC": "import_mid",
      "GLC 쿠페": "import_mid",
      "GLE": "import_premium",
      "GLE 쿠페": "import_premium",
      "GLS": "import_premium",
      "G-Class": "import_premium",
      "EQA": "import_mid",
      "EQB": "import_mid",
      "EQE": "ev_premium",
      "EQE SUV": "ev_premium",
      "EQS": "ev_premium",
      "EQS SUV": "ev_premium",
      "AMG GT": "supercar_entry",
      "AMG GT 4도어": "supercar_entry",
      "AMG GT 63": "supercar_entry",
      "마이바흐 S-Class": "supercar_entry",
      "마이바흐 GLS": "supercar_entry",
      "AMG ONE": "supercar_ultra"
    },
    // ── 아우디 (기본: import_mid) ──
    "아우디": {
      "A3": "import_mid",
      "A4": "import_mid",
      "A5": "import_mid",
      "A6": "import_mid",
      "A7": "import_mid",
      "A8": "import_premium",
      "Q2": "import_mid",
      "Q3": "import_mid",
      "Q4 e-tron": "import_mid",
      "Q5": "import_mid",
      "Q7": "import_premium",
      "Q8": "import_premium",
      "Q8 e-tron": "ev_premium",
      "e-tron GT": "ev_premium",
      "RS3": "import_premium",
      "RS4": "import_premium",
      "RS5": "import_premium",
      "RS6": "import_premium",
      "RS7": "import_premium",
      "RS Q8": "import_premium",
      "R8": "supercar_entry",
      "TT": "import_mid",
      "S3": "import_mid",
      "S4": "import_mid",
      "S5": "import_mid"
    },
    // ── 볼보 (기본: import_mid) ──
    "볼보": {
      "S60": "import_mid",
      "S90": "import_mid",
      "V60": "import_mid",
      "V60 크로스컨트리": "import_mid",
      "V90 크로스컨트리": "import_mid",
      "XC40": "import_mid",
      "XC40 리차지": "import_mid",
      "XC60": "import_mid",
      "XC90": "import_premium",
      "C40 리차지": "import_mid",
      "EX30": "import_mid",
      "EX90": "import_premium",
      "EM90": "import_premium"
    },
    // ── 렉서스 (기본: import_mid) ──
    "렉서스": {
      "ES": "import_mid",
      "IS": "import_mid",
      "NX": "import_mid",
      "UX": "import_mid",
      "RX": "import_mid",
      "RZ": "import_mid",
      "GX": "import_premium",
      "LS": "import_premium",
      "LC": "import_premium",
      "LX": "import_premium",
      "LBX": "import_mid"
    },
    // ── 캐딜락 (기본: import_mid) ──
    "캐딜락": {
      "CT4": "import_mid",
      "CT5": "import_mid",
      "CT5-V": "import_premium",
      "XT4": "import_mid",
      "XT5": "import_mid",
      "XT6": "import_mid",
      "에스컬레이드": "import_premium",
      "리릭": "ev_premium",
      "셀레스틱": "import_premium"
    },
    // ── 링컨 (기본: import_mid) ──
    "링컨": {
      "코세어": "import_mid",
      "노틸러스": "import_mid",
      "에비에이터": "import_premium",
      "네비게이터": "import_premium"
    },
    // ── 지프 (기본: import_mid) ──
    "지프": {
      "레니게이드": "import_mid",
      "컴패스": "import_mid",
      "체로키": "import_mid",
      "그랜드 체로키": "import_mid",
      "그랜드 체로키 L": "import_premium",
      "그랜드 왜고니어": "import_premium",
      "랭글러": "import_mid",
      "글래디에이터": "import_mid"
    },
    // ── 포르쉐 (기본: supercar_entry) ──
    "포르쉐": {
      "마칸": "import_premium",
      "마칸 일렉트릭": "ev_premium",
      "카이엔": "import_premium",
      "카이엔 터보": "supercar_entry",
      "카이엔 터보 GT": "supercar_entry",
      "파나메라": "supercar_entry",
      "타이칸": "ev_premium",
      "타이칸 터보 S": "supercar_entry",
      "718 박스터": "supercar_entry",
      "718 카이맨": "supercar_entry",
      "911 카레라": "supercar_entry",
      "911 터보": "supercar_entry",
      "911 GT3": "supercar_std",
      "911 GT3 RS": "supercar_std",
      "918 스파이더": "supercar_std"
    },
    // ── 테슬라 (기본: import_mid) ──
    "테슬라": {
      "모델3": "import_mid",
      "모델3 퍼포먼스": "import_mid",
      "모델Y": "import_mid",
      "모델Y 퍼포먼스": "import_mid",
      "모델S": "ev_premium",
      "모델S Plaid": "supercar_entry",
      "모델X": "ev_premium",
      "모델X Plaid": "supercar_entry",
      "사이버트럭": "import_premium"
    },
    // ── 토요타 (기본: import_std) ──
    "토요타": {
      "캠리": "import_std",
      "코롤라": "import_std",
      "코롤라 크로스": "import_std",
      "RAV4": "import_std",
      "하이랜더": "import_std",
      "프리우스": "import_std",
      "bZ4X": "import_std",
      "수프라": "import_mid",
      "GR86": "import_mid",
      "크라운": "import_std",
      "랜드크루저": "import_mid",
      "랜드크루저 프라도": "import_mid",
      "시에나": "import_std",
      "타코마": "import_std",
      "툰드라": "import_mid",
      "미라이": "ev_premium"  // 수소전기차 (FCEV)
    },
    // ── 혼다 (기본: import_std) ──
    "혼다": {
      "시빅": "import_std",
      "시빅 타입R": "import_mid",
      "어코드": "import_std",
      "CR-V": "import_std",
      "HR-V": "import_std",
      "파일럿": "import_std",
      "ZR-V": "import_std",
      "e:NY1": "import_std",
      "NSX": "supercar_entry"
    },
    // ── 닛산 (기본: import_std) ──
    "닛산": {
      "알티마": "import_std",
      "센트라": "import_std",
      "쥬크": "import_std",
      "캐시카이": "import_std",
      "X-트레일": "import_std",
      "패스파인더": "import_std",
      "리프": "import_std",
      "아리아": "import_std",
      "Z": "import_mid",
      "GT-R": "supercar_entry",
      "GT-R NISMO": "supercar_entry"
    },
    // ── 포드 (기본: import_std) ──
    "포드": {
      "머스탱": "import_mid",
      "머스탱 마하-E": "import_mid",
      "익스플로러": "import_std",
      "브롱코": "import_mid",
      "브롱코 스포츠": "import_std",
      "레인저": "import_std",
      "F-150": "import_mid",
      "F-150 라이트닝": "import_mid",
      "에스케이프": "import_std",
      "포커스": "import_std",
      "GT": "supercar_std"
    },
    // ── 리비안 (기본: import_premium) ──
    "리비안": {
      "R1T": "import_premium",
      "R1S": "import_premium",
      "R2": "import_mid",
      "R3": "import_mid"
    },
    // ── BYD (기본: import_economy) ──
    "BYD": {
      "ATTO 3": "import_economy",
      "돌핀": "import_economy",
      "씰": "import_economy",
      "한": "import_economy",
      "탕": "import_economy",
      "송": "import_economy",
      "위안 플러스": "import_economy"
    },
    // ── 폴스타 (기본: import_economy) ──
    "폴스타": {
      "폴스타 2": "import_economy",
      "폴스타 3": "import_mid",
      "폴스타 4": "import_mid"
    },
    // ── 폭스바겐 (기본: import_std) ──
    "폭스바겐": {
      "골프": "import_std",
      "골프 GTI": "import_std",
      "골프 R": "import_mid",
      "티구안": "import_std",
      "투아렉": "import_mid",
      "파사트": "import_std",
      "아테온": "import_std",
      "아르테온": "import_std",
      "폴로": "import_std",
      "T-Roc": "import_std",
      "ID.4": "import_std",
      "ID.7": "import_std",
      "ID. Buzz": "import_mid",
      "타이곤": "import_std"
    },
    // ── 푸조 (기본: import_std) ──
    "푸조": {
      "208": "import_std",
      "e-208": "import_std",
      "308": "import_std",
      "e-308": "import_std",
      "408": "import_std",
      "508": "import_std",
      "2008": "import_std",
      "e-2008": "import_std",
      "3008": "import_std",
      "5008": "import_std"
    },
    // ── 미니 (기본: import_std) ──
    "미니": {
      "쿠퍼": "import_std",
      "쿠퍼 S": "import_std",
      "JCW": "import_mid",
      "컨트리맨": "import_std",
      "컨버터블": "import_std",
      "클럽맨": "import_std",
      "일렉트릭": "import_std"
    },
    // ── 마쯔다 (기본: import_std) ──
    "마쯔다": {
      "CX-5": "import_std",
      "CX-30": "import_std",
      "CX-60": "import_mid",
      "CX-90": "import_mid",
      "마쯔다3": "import_std",
      "마쯔다6": "import_std",
      "MX-5": "import_std",
      "MX-30": "import_std"
    },
    // ── 재규어 (기본: import_premium) ──
    "재규어": {
      "XE": "import_mid",
      "XF": "import_mid",
      "F-PACE": "import_premium",
      "E-PACE": "import_mid",
      "I-PACE": "import_premium",
      "F-TYPE": "import_premium"
    },
    // ── 랜드로버 (기본: import_premium) ──
    "랜드로버": {
      "디스커버리": "import_premium",
      "디스커버리 스포츠": "import_mid",
      "디펜더": "import_premium",
      "디펜더 V8": "supercar_entry",
      "레인지로버": "import_premium",
      "레인지로버 스포츠": "import_premium",
      "레인지로버 벨라": "import_premium",
      "레인지로버 이보크": "import_mid",
      "레인지로버 SV": "supercar_entry"
    },
    // ── 마세라티 (기본: import_premium) ──
    "마세라티": {
      "기블리": "import_premium",
      "그레칼레": "import_premium",
      "콰트로포르테": "import_premium",
      "르반떼": "import_premium",
      "그란투리스모": "supercar_entry",
      "MC20": "supercar_std",
      "MC20 치엘로": "supercar_std"
    },
    // ── 로터스 (기본: supercar_entry) ──
    "로터스": {
      "에미라": "supercar_entry",
      "엘레트레": "supercar_entry",
      "에보라": "supercar_entry",
      "에스프리": "supercar_std"
    },
    // ── 페라리 (기본: supercar_std) ──
    "페라리": {
      "로마": "supercar_std",
      "로마 스파이더": "supercar_std",
      "296 GTB": "supercar_std",
      "296 GTS": "supercar_std",
      "포르토피노 M": "supercar_std",
      "F8 트리뷰토": "supercar_std",
      "812": "supercar_std",
      "812 컴페티치오네": "supercar_ultra",
      "SF90": "supercar_ultra",
      "SF90 스트라달레": "supercar_ultra",
      "라 페라리": "supercar_ultra",
      "데이토나 SP3": "supercar_ultra",
      "퓨로산게": "supercar_std"
    },
    // ── 람보르기니 (기본: supercar_std) ──
    "람보르기니": {
      "우라칸": "supercar_std",
      "우라칸 STO": "supercar_std",
      "우라칸 테크니카": "supercar_std",
      "우루스": "supercar_std",
      "우루스 퍼포만테": "supercar_std",
      "레부엘토": "supercar_ultra",
      "시안": "supercar_ultra",
      "카운타크 LPI 800-4": "supercar_ultra"
    },
    // ── 맥라렌 (기본: supercar_std) ──
    "맥라렌": {
      "아투라": "supercar_std",
      "720S": "supercar_std",
      "750S": "supercar_std",
      "GT": "supercar_std",
      "765LT": "supercar_std",
      "P1": "supercar_ultra",
      "스피드테일": "supercar_ultra",
      "세나": "supercar_ultra",
      "엘바": "supercar_ultra"
    },
    // ── 애스턴마틴 (기본: supercar_std) ──
    "애스턴마틴": {
      "DB11": "supercar_std",
      "DB12": "supercar_std",
      "DBS": "supercar_std",
      "DBX": "supercar_std",
      "DBX707": "supercar_std",
      "밴퀴시": "supercar_std",
      "발할라": "supercar_ultra",
      "발키리": "supercar_ultra"
    },
    // ── 벤틀리 (기본: supercar_ultra) ──
    "벤틀리": {
      "컨티넨탈 GT": "supercar_entry",
      "컨티넨탈 GTC": "supercar_entry",
      "플라잉스퍼": "supercar_entry",
      "벤테이가": "supercar_entry",
      "벤테이가 EWB": "supercar_entry",
      "뮬산": "supercar_std",
      "바칼라르": "supercar_ultra"
    },
    // ── 롤스로이스 (기본: supercar_ultra) ──
    "롤스로이스": {
      "고스트": "supercar_std",
      "레이스": "supercar_std",
      "던": "supercar_std",
      "컬리넌": "supercar_std",
      "스펙터": "supercar_std",
      "팬텀": "supercar_ultra",
      "팬텀 EWB": "supercar_ultra",
      "보트테일": "supercar_ultra"
    },
    // ── 부가티 (기본: supercar_ultra) ──
    "부가티": {
      "시론": "supercar_ultra",
      "시론 퍼 스포츠": "supercar_ultra",
      "미스트랄": "supercar_ultra",
      "디보": "supercar_ultra",
      "볼리데": "supercar_ultra"
    },
    // ── 파가니 (기본: supercar_ultra) ──
    "파가니": {
      "우아이라": "supercar_ultra",
      "우아이라 로드스터": "supercar_ultra",
      "우토피아": "supercar_ultra"
    },
    // ── 코닉세그 (기본: supercar_ultra) ──
    "코닉세그": {
      "제스코": "supercar_ultra",
      "제메라": "supercar_ultra",
      "레게라": "supercar_ultra",
      "CC850": "supercar_ultra"
    }
  },

  // EV vs ICE 고전압 부품 배율
  evMultiplier: {
    ice: 1.0,         // 내연기관 기본
    hev: 1.05,        // 하이브리드 (배터리 소형)
    phev: 1.15,       // 플러그인 하이브리드
    bev: 1.4,         // 순수전기차 (고전압 부품, 배터리팩)
    fcev: 1.5          // 수소전기차 (수소탱크, 연료전지)
  },

  // 연식별 부품 가용성 배율
  ageAvailability: {
    "0~3년": { mult: 1.0, desc: "현행 모델 — 부품 즉시 공급", supplyDays: 1 },
    "4~6년": { mult: 1.0, desc: "이전 모델 — 정상 공급", supplyDays: 2 },
    "7~10년": { mult: 1.1, desc: "구형 — 일부 부품 재고 한정", supplyDays: 5 },
    "11~15년": { mult: 1.25, desc: "노후 — 단종부품 발생, 대체부품 검토", supplyDays: 10 },
    "16~20년": { mult: 1.4, desc: "클래식 — 다수 부품 단종, 재생/중고 필수", supplyDays: 20 },
    "21년+": { mult: 1.6, desc: "빈티지 — 대부분 부품 특수 발주 필요", supplyDays: 30 }
  },

  // 지역별 공임 차이
  regionalLabor: {
    "서울": { mult: 1.1, desc: "수도권 중심 — 공임 최고" },
    "경기": { mult: 1.05, desc: "수도권" },
    "인천": { mult: 1.03, desc: "수도권" },
    "부산": { mult: 1.0, desc: "광역시" },
    "대구": { mult: 0.98, desc: "광역시" },
    "대전": { mult: 0.97, desc: "광역시" },
    "광주": { mult: 0.96, desc: "광역시" },
    "울산": { mult: 0.98, desc: "광역시" },
    "세종": { mult: 0.95, desc: "특별자치시" },
    "강원": { mult: 0.92, desc: "도 지역" },
    "충북": { mult: 0.93, desc: "도 지역" },
    "충남": { mult: 0.93, desc: "도 지역" },
    "전북": { mult: 0.91, desc: "도 지역" },
    "전남": { mult: 0.90, desc: "도 지역" },
    "경북": { mult: 0.92, desc: "도 지역" },
    "경남": { mult: 0.95, desc: "도 지역" },
    "제주": { mult: 0.97, desc: "특별자치도 — 물류비 가산" }
  },

  // 부품 유형별 가격 티어 배율 (OEM 대비)
  partsTierRatio: {
    "순정(OEM)": { ratio: 1.0, desc: "제조사 순정 부품" },
    "품질인증(인증대체)": { ratio: 0.65, desc: "OEM 대비 35% 저렴, 품질 인증" },
    "비순정(애프터마켓)": { ratio: 0.50, desc: "OEM 대비 50% 저렴" },
    "재생부품": { ratio: 0.45, desc: "OEM 대비 55% 저렴, 공정 재생" },
    "재활용(중고)": { ratio: 0.35, desc: "OEM 대비 65% 저렴, 상태 편차" }
  },

  // 연간 감가율 (차종별)
  annualDepreciation: {
    domestic_mini: 0.12,
    domestic_std: 0.10,
    domestic_large: 0.09,
    domestic_premium: 0.08,
    import_economy: 0.14,
    import_std: 0.12,
    import_mid: 0.11,
    ev_premium: 0.13,
    import_premium: 0.10,
    supercar_entry: 0.08,
    supercar_std: 0.06,
    supercar_ultra: 0.04
  },

  // 도장 비용 배율 (등급별)
  paintMultiplier: {
    domestic_mini: 0.85,
    domestic_std: 1.0,
    domestic_large: 1.05,
    domestic_premium: 1.2,
    import_economy: 1.2,
    import_std: 1.4,
    import_mid: 1.6,
    ev_premium: 1.8,
    import_premium: 2.0,
    supercar_entry: 2.5,
    supercar_std: 3.0,
    supercar_ultra: 5.0
  },

  // 부품 수급 소요 일수 (영업일 기준)
  supplyTimeDays: {
    domestic_mini: 1,
    domestic_std: 2,
    domestic_large: 2,
    domestic_premium: 3,
    import_economy: 4,
    import_std: 5,
    import_mid: 7,
    ev_premium: 8,
    import_premium: 10,
    supercar_entry: 14,
    supercar_std: 21,
    supercar_ultra: 30
  },

  // 렌터카 / 교통비 일일 한도 (원)
  rentalDailyLimit: {
    domestic_mini: 35000,
    domestic_std: 45000,
    domestic_large: 55000,
    domestic_premium: 65000,
    import_economy: 55000,
    import_std: 75000,
    import_mid: 95000,
    ev_premium: 110000,
    import_premium: 130000,
    supercar_entry: 180000,
    supercar_std: 300000,
    supercar_ultra: 500000
  },

  // 감가상각률 (연간 %, 차급별 차등)
  annualDepreciationRate: {
    domestic_mini: 0.17,
    domestic_std: 0.15,
    domestic_large: 0.14,
    domestic_premium: 0.14,
    import_economy: 0.19,
    import_std: 0.18,
    import_mid: 0.17,
    ev_premium: 0.18,
    import_premium: 0.16,
    supercar_entry: 0.12,
    supercar_std: 0.08,
    supercar_ultra: 0.05
  }
};


// ============================================================================
// Exports
// ============================================================================
export { REPAIR_METHODS, DAMAGE_CHAINS, VEHICLE_CLASS_MULTIPLIERS };
