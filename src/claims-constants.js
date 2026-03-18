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
// 3. VEHICLE_CLASS_MULTIPLIERS - 8단계 차량 등급 분류
// ============================================================================
const VEHICLE_CLASS_MULTIPLIERS = {
  tiers: [
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
      id: "domestic_premium",
      label: "국산 고급",
      labelEn: "Domestic Premium",
      partsMult: 1.3,
      laborRate: 38000,
      makes: ["제네시스"],
      examples: ["G70", "G80", "G90", "GV60", "GV70", "GV80"]
    },
    {
      id: "import_std",
      label: "수입 일반",
      labelEn: "Import Standard",
      partsMult: 1.6,
      laborRate: 53404,
      makes: ["폭스바겐", "푸조", "시트로엥", "미니", "마쯔다", "닛산", "혼다", "토요타", "스바루", "BYD", "폴스타"],
      examples: ["골프", "308", "시빅", "RAV4", "CX-5", "아토3"]
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

  // 특정 모델이 제조사 기본 등급과 다른 경우 오버라이드
  modelOverrides: {
    "BMW": {
      "7시리즈": "import_premium",
      "X7": "import_premium",
      "XM": "supercar_entry",
      "i7": "import_premium",
      "M3": "import_premium",
      "M4": "import_premium",
      "M5": "import_premium",
      "M8": "supercar_entry",
      "iX": "import_premium"
    },
    "벤츠": {
      "S-Class": "import_premium",
      "GLS": "import_premium",
      "EQS": "import_premium",
      "AMG GT": "supercar_entry",
      "AMG GT 63": "supercar_entry",
      "마이바흐 S-Class": "supercar_entry",
      "마이바흐 GLS": "supercar_entry",
      "G-Class": "import_premium",
      "AMG ONE": "supercar_ultra"
    },
    "아우디": {
      "A8": "import_premium",
      "Q8": "import_premium",
      "e-tron GT": "import_premium",
      "RS6": "import_premium",
      "RS7": "import_premium",
      "R8": "supercar_entry"
    },
    "볼보": {
      "XC90": "import_premium",
      "EX90": "import_premium"
    },
    "렉서스": {
      "LS": "import_premium",
      "LC": "import_premium",
      "LX": "import_premium"
    },
    "포르쉐": {
      "마칸": "import_premium",
      "카이엔": "import_premium",
      "918 스파이더": "supercar_std"
    },
    "테슬라": {
      "모델3": "import_mid",
      "모델Y": "import_mid",
      "모델S": "import_premium",
      "모델S Plaid": "supercar_entry",
      "모델X": "import_premium",
      "모델X Plaid": "supercar_entry",
      "사이버트럭": "import_premium"
    },
    "토요타": {
      "수프라": "import_mid",
      "GR86": "import_mid",
      "랜드크루저": "import_mid"
    },
    "혼다": {
      "NSX": "supercar_entry"
    },
    "닛산": {
      "GT-R": "supercar_entry"
    },
    "지프": {
      "그랜드 체로키 L": "import_premium",
      "그랜드 왜고니어": "import_premium"
    },
    "현대": {
      "아이오닉5 N": "domestic_premium",
      "스타리아 라운지": "domestic_premium"
    },
    "기아": {
      "EV9": "domestic_premium",
      "스팅어": "domestic_premium"
    },
    "제네시스": {
      "G90 롱휠베이스": "import_mid"
    },
    "랜드로버": {
      "레인지로버 SV": "supercar_entry",
      "디펜더 V8": "supercar_entry"
    },
    "마세라티": {
      "MC20": "supercar_std"
    },
    "페라리": {
      "SF90": "supercar_ultra",
      "라 페라리": "supercar_ultra",
      "데이토나 SP3": "supercar_ultra"
    },
    "람보르기니": {
      "레부엘토": "supercar_ultra",
      "시안": "supercar_ultra"
    },
    "맥라렌": {
      "P1": "supercar_ultra",
      "스피드테일": "supercar_ultra",
      "세나": "supercar_ultra"
    },
    "애스턴마틴": {
      "발할라": "supercar_ultra",
      "발키리": "supercar_ultra"
    }
  },

  // 도장 비용 배율 (등급별)
  paintMultiplier: {
    domestic_std: 1.0,
    domestic_premium: 1.2,
    import_std: 1.4,
    import_mid: 1.6,
    import_premium: 2.0,
    supercar_entry: 2.5,
    supercar_std: 3.0,
    supercar_ultra: 5.0
  },

  // 부품 수급 소요 일수 (영업일 기준)
  supplyTimeDays: {
    domestic_std: 2,
    domestic_premium: 3,
    import_std: 5,
    import_mid: 7,
    import_premium: 10,
    supercar_entry: 14,
    supercar_std: 21,
    supercar_ultra: 30
  },

  // 렌터카 / 교통비 일일 한도 (원)
  rentalDailyLimit: {
    domestic_std: 45000,
    domestic_premium: 65000,
    import_std: 75000,
    import_mid: 95000,
    import_premium: 130000,
    supercar_entry: 180000,
    supercar_std: 300000,
    supercar_ultra: 500000
  },

  // 감가상각률 (연간 %, 차급별 차등)
  annualDepreciationRate: {
    domestic_std: 0.15,
    domestic_premium: 0.14,
    import_std: 0.18,
    import_mid: 0.17,
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
