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
  // ── 전면 (Front) ──────────────────────────────────────────────────────
  "프론트 범퍼(상)": {
    chain: [
      { target: "프론트 범퍼(하)", probability: 0.8, minSeverity: "경미" },
      { target: "프론트 그릴", probability: 0.7, minSeverity: "중간" },
      { target: "라디에이터", probability: 0.4, minSeverity: "심각" },
      { target: "전방 카메라/센서", probability: 0.5, minSeverity: "중간" },
      { target: "헤드라이트(좌)", probability: 0.35, minSeverity: "중간" },
      { target: "헤드라이트(우)", probability: 0.35, minSeverity: "중간" },
      { target: "본넷", probability: 0.25, minSeverity: "심각" },
      { target: "범퍼 리인포스먼트(전)", probability: 0.6, minSeverity: "중간" },
      { target: "프론트 범퍼 브라켓(좌)", probability: 0.5, minSeverity: "경미" },
      { target: "프론트 범퍼 브라켓(우)", probability: 0.5, minSeverity: "경미" }
    ]
  },
  "프론트 범퍼(하)": {
    chain: [
      { target: "안개등(좌)", probability: 0.5, minSeverity: "중간" },
      { target: "안개등(우)", probability: 0.5, minSeverity: "중간" },
      { target: "언더커버(전)", probability: 0.6, minSeverity: "경미" },
      { target: "프론트 립 스포일러", probability: 0.7, minSeverity: "경미" },
      { target: "에어 덕트", probability: 0.4, minSeverity: "중간" }
    ]
  },
  "본넷": {
    chain: [
      { target: "본넷 힌지(좌)", probability: 0.4, minSeverity: "심각" },
      { target: "본넷 힌지(우)", probability: 0.4, minSeverity: "심각" },
      { target: "본넷 래치", probability: 0.3, minSeverity: "심각" },
      { target: "프론트 펜더(좌)", probability: 0.3, minSeverity: "중간" },
      { target: "프론트 펜더(우)", probability: 0.3, minSeverity: "중간" },
      { target: "전면 유리", probability: 0.2, minSeverity: "심각" },
      { target: "카울 탑 커버", probability: 0.25, minSeverity: "심각" }
    ]
  },
  "프론트 그릴": {
    chain: [
      { target: "라디에이터", probability: 0.3, minSeverity: "중간" },
      { target: "콘덴서", probability: 0.25, minSeverity: "중간" },
      { target: "전방 카메라/센서", probability: 0.4, minSeverity: "중간" },
      { target: "전방 레이더", probability: 0.35, minSeverity: "중간" },
      { target: "프론트 범퍼(상)", probability: 0.2, minSeverity: "경미" }
    ]
  },
  "헤드라이트(좌)": {
    chain: [
      { target: "프론트 펜더(좌)", probability: 0.3, minSeverity: "중간" },
      { target: "프론트 범퍼(상)", probability: 0.25, minSeverity: "경미" },
      { target: "프론트 턴시그널(좌)", probability: 0.5, minSeverity: "경미" },
      { target: "헤드라이트 브라켓(좌)", probability: 0.6, minSeverity: "중간" },
      { target: "프론트 사이드 마커(좌)", probability: 0.3, minSeverity: "경미" }
    ]
  },
  "헤드라이트(우)": {
    chain: [
      { target: "프론트 펜더(우)", probability: 0.3, minSeverity: "중간" },
      { target: "프론트 범퍼(상)", probability: 0.25, minSeverity: "경미" },
      { target: "프론트 턴시그널(우)", probability: 0.5, minSeverity: "경미" },
      { target: "헤드라이트 브라켓(우)", probability: 0.6, minSeverity: "중간" },
      { target: "프론트 사이드 마커(우)", probability: 0.3, minSeverity: "경미" }
    ]
  },
  "안개등(좌)": {
    chain: [
      { target: "프론트 범퍼(하)", probability: 0.3, minSeverity: "경미" },
      { target: "안개등 베젤(좌)", probability: 0.7, minSeverity: "경미" }
    ]
  },
  "안개등(우)": {
    chain: [
      { target: "프론트 범퍼(하)", probability: 0.3, minSeverity: "경미" },
      { target: "안개등 베젤(우)", probability: 0.7, minSeverity: "경미" }
    ]
  },
  "라디에이터": {
    chain: [
      { target: "콘덴서", probability: 0.6, minSeverity: "중간" },
      { target: "라디에이터 서포트(상)", probability: 0.5, minSeverity: "중간" },
      { target: "라디에이터 서포트(하)", probability: 0.5, minSeverity: "중간" },
      { target: "라디에이터 호스", probability: 0.4, minSeverity: "중간" },
      { target: "냉각 팬", probability: 0.35, minSeverity: "심각" },
      { target: "인터쿨러", probability: 0.3, minSeverity: "심각" }
    ]
  },
  "범퍼 리인포스먼트(전)": {
    chain: [
      { target: "라디에이터 서포트(상)", probability: 0.5, minSeverity: "심각" },
      { target: "라디에이터 서포트(하)", probability: 0.5, minSeverity: "심각" },
      { target: "프론트 사이드 멤버(좌)", probability: 0.4, minSeverity: "심각" },
      { target: "프론트 사이드 멤버(우)", probability: 0.4, minSeverity: "심각" },
      { target: "크래쉬 박스(좌)", probability: 0.7, minSeverity: "중간" },
      { target: "크래쉬 박스(우)", probability: 0.7, minSeverity: "중간" }
    ]
  },
  "전면 유리": {
    chain: [
      { target: "전방 카메라/센서", probability: 0.6, minSeverity: "중간" },
      { target: "룸 미러", probability: 0.2, minSeverity: "심각" },
      { target: "카울 탑 커버", probability: 0.3, minSeverity: "중간" },
      { target: "레인 센서", probability: 0.4, minSeverity: "중간" },
      { target: "A필러 몰딩(좌)", probability: 0.15, minSeverity: "심각" },
      { target: "A필러 몰딩(우)", probability: 0.15, minSeverity: "심각" }
    ]
  },

  // ── 전면 구조물 ───────────────────────────────────────────────────────
  "프론트 사이드 멤버(좌)": {
    chain: [
      { target: "서브 프레임(전)", probability: 0.5, minSeverity: "심각" },
      { target: "프론트 펜더(좌)", probability: 0.4, minSeverity: "심각" },
      { target: "에이프런 패널(좌)", probability: 0.6, minSeverity: "심각" },
      { target: "프론트 휠하우스(좌)", probability: 0.5, minSeverity: "심각" },
      { target: "대쉬 패널", probability: 0.3, minSeverity: "전손" }
    ]
  },
  "프론트 사이드 멤버(우)": {
    chain: [
      { target: "서브 프레임(전)", probability: 0.5, minSeverity: "심각" },
      { target: "프론트 펜더(우)", probability: 0.4, minSeverity: "심각" },
      { target: "에이프런 패널(우)", probability: 0.6, minSeverity: "심각" },
      { target: "프론트 휠하우스(우)", probability: 0.5, minSeverity: "심각" },
      { target: "대쉬 패널", probability: 0.3, minSeverity: "전손" }
    ]
  },
  "서브 프레임(전)": {
    chain: [
      { target: "로어 암(좌)", probability: 0.5, minSeverity: "심각" },
      { target: "로어 암(우)", probability: 0.5, minSeverity: "심각" },
      { target: "스티어링 기어박스", probability: 0.4, minSeverity: "심각" },
      { target: "엔진 마운트", probability: 0.35, minSeverity: "심각" },
      { target: "스태빌라이저 바(전)", probability: 0.3, minSeverity: "심각" }
    ]
  },

  // ── 측면 좌 (Left Side) ──────────────────────────────────────────────
  "프론트 펜더(좌)": {
    chain: [
      { target: "프론트 도어(좌)", probability: 0.4, minSeverity: "중간" },
      { target: "헤드라이트(좌)", probability: 0.3, minSeverity: "중간" },
      { target: "사이드 미러(좌)", probability: 0.25, minSeverity: "중간" },
      { target: "펜더 라이너(좌)", probability: 0.7, minSeverity: "경미" },
      { target: "A필러(좌)", probability: 0.2, minSeverity: "심각" },
      { target: "에이프런 패널(좌)", probability: 0.3, minSeverity: "심각" }
    ]
  },
  "프론트 도어(좌)": {
    chain: [
      { target: "사이드 미러(좌)", probability: 0.5, minSeverity: "중간" },
      { target: "도어 핸들(좌전)", probability: 0.4, minSeverity: "중간" },
      { target: "도어 유리(좌전)", probability: 0.35, minSeverity: "중간" },
      { target: "B필러(좌)", probability: 0.3, minSeverity: "심각" },
      { target: "리어 도어(좌)", probability: 0.25, minSeverity: "심각" },
      { target: "프론트 펜더(좌)", probability: 0.2, minSeverity: "중간" },
      { target: "도어 몰딩(좌전)", probability: 0.6, minSeverity: "경미" },
      { target: "사이드 에어백(좌전)", probability: 0.15, minSeverity: "심각" }
    ]
  },
  "리어 도어(좌)": {
    chain: [
      { target: "B필러(좌)", probability: 0.3, minSeverity: "심각" },
      { target: "C필러(좌)", probability: 0.25, minSeverity: "심각" },
      { target: "프론트 도어(좌)", probability: 0.2, minSeverity: "심각" },
      { target: "도어 핸들(좌후)", probability: 0.4, minSeverity: "중간" },
      { target: "도어 유리(좌후)", probability: 0.35, minSeverity: "중간" },
      { target: "도어 몰딩(좌후)", probability: 0.6, minSeverity: "경미" },
      { target: "사이드 실(좌)", probability: 0.2, minSeverity: "심각" }
    ]
  },
  "사이드 미러(좌)": {
    chain: [
      { target: "프론트 도어(좌)", probability: 0.15, minSeverity: "경미" },
      { target: "사이드 턴시그널(좌)", probability: 0.6, minSeverity: "경미" },
      { target: "블라인드 스팟 미러(좌)", probability: 0.5, minSeverity: "경미" }
    ]
  },
  "쿼터 패널(좌)": {
    chain: [
      { target: "리어 범퍼(좌)", probability: 0.35, minSeverity: "중간" },
      { target: "리어 램프(좌)", probability: 0.4, minSeverity: "중간" },
      { target: "C필러(좌)", probability: 0.3, minSeverity: "심각" },
      { target: "리어 휠하우스(좌)", probability: 0.5, minSeverity: "중간" },
      { target: "트렁크 리드", probability: 0.2, minSeverity: "심각" },
      { target: "연료 주입구", probability: 0.15, minSeverity: "심각" },
      { target: "리어 도어(좌)", probability: 0.2, minSeverity: "심각" }
    ]
  },

  // ── 측면 우 (Right Side) ─────────────────────────────────────────────
  "프론트 펜더(우)": {
    chain: [
      { target: "프론트 도어(우)", probability: 0.4, minSeverity: "중간" },
      { target: "헤드라이트(우)", probability: 0.3, minSeverity: "중간" },
      { target: "사이드 미러(우)", probability: 0.25, minSeverity: "중간" },
      { target: "펜더 라이너(우)", probability: 0.7, minSeverity: "경미" },
      { target: "A필러(우)", probability: 0.2, minSeverity: "심각" },
      { target: "에이프런 패널(우)", probability: 0.3, minSeverity: "심각" }
    ]
  },
  "프론트 도어(우)": {
    chain: [
      { target: "사이드 미러(우)", probability: 0.5, minSeverity: "중간" },
      { target: "도어 핸들(우전)", probability: 0.4, minSeverity: "중간" },
      { target: "도어 유리(우전)", probability: 0.35, minSeverity: "중간" },
      { target: "B필러(우)", probability: 0.3, minSeverity: "심각" },
      { target: "리어 도어(우)", probability: 0.25, minSeverity: "심각" },
      { target: "프론트 펜더(우)", probability: 0.2, minSeverity: "중간" },
      { target: "도어 몰딩(우전)", probability: 0.6, minSeverity: "경미" },
      { target: "사이드 에어백(우전)", probability: 0.15, minSeverity: "심각" }
    ]
  },
  "리어 도어(우)": {
    chain: [
      { target: "B필러(우)", probability: 0.3, minSeverity: "심각" },
      { target: "C필러(우)", probability: 0.25, minSeverity: "심각" },
      { target: "프론트 도어(우)", probability: 0.2, minSeverity: "심각" },
      { target: "도어 핸들(우후)", probability: 0.4, minSeverity: "중간" },
      { target: "도어 유리(우후)", probability: 0.35, minSeverity: "중간" },
      { target: "도어 몰딩(우후)", probability: 0.6, minSeverity: "경미" },
      { target: "사이드 실(우)", probability: 0.2, minSeverity: "심각" }
    ]
  },
  "사이드 미러(우)": {
    chain: [
      { target: "프론트 도어(우)", probability: 0.15, minSeverity: "경미" },
      { target: "사이드 턴시그널(우)", probability: 0.6, minSeverity: "경미" },
      { target: "블라인드 스팟 미러(우)", probability: 0.5, minSeverity: "경미" }
    ]
  },
  "쿼터 패널(우)": {
    chain: [
      { target: "리어 범퍼(우)", probability: 0.35, minSeverity: "중간" },
      { target: "리어 램프(우)", probability: 0.4, minSeverity: "중간" },
      { target: "C필러(우)", probability: 0.3, minSeverity: "심각" },
      { target: "리어 휠하우스(우)", probability: 0.5, minSeverity: "중간" },
      { target: "트렁크 리드", probability: 0.2, minSeverity: "심각" },
      { target: "리어 도어(우)", probability: 0.2, minSeverity: "심각" }
    ]
  },

  // ── 필러 (Pillars) ───────────────────────────────────────────────────
  "A필러(좌)": {
    chain: [
      { target: "전면 유리", probability: 0.5, minSeverity: "심각" },
      { target: "프론트 펜더(좌)", probability: 0.4, minSeverity: "심각" },
      { target: "프론트 도어(좌)", probability: 0.4, minSeverity: "심각" },
      { target: "루프 패널", probability: 0.3, minSeverity: "심각" },
      { target: "대쉬 패널", probability: 0.2, minSeverity: "전손" }
    ]
  },
  "A필러(우)": {
    chain: [
      { target: "전면 유리", probability: 0.5, minSeverity: "심각" },
      { target: "프론트 펜더(우)", probability: 0.4, minSeverity: "심각" },
      { target: "프론트 도어(우)", probability: 0.4, minSeverity: "심각" },
      { target: "루프 패널", probability: 0.3, minSeverity: "심각" },
      { target: "대쉬 패널", probability: 0.2, minSeverity: "전손" }
    ]
  },
  "B필러(좌)": {
    chain: [
      { target: "프론트 도어(좌)", probability: 0.4, minSeverity: "심각" },
      { target: "리어 도어(좌)", probability: 0.4, minSeverity: "심각" },
      { target: "루프 패널", probability: 0.3, minSeverity: "심각" },
      { target: "사이드 실(좌)", probability: 0.5, minSeverity: "심각" },
      { target: "센터 필러 가니쉬(좌)", probability: 0.6, minSeverity: "중간" }
    ]
  },
  "B필러(우)": {
    chain: [
      { target: "프론트 도어(우)", probability: 0.4, minSeverity: "심각" },
      { target: "리어 도어(우)", probability: 0.4, minSeverity: "심각" },
      { target: "루프 패널", probability: 0.3, minSeverity: "심각" },
      { target: "사이드 실(우)", probability: 0.5, minSeverity: "심각" },
      { target: "센터 필러 가니쉬(우)", probability: 0.6, minSeverity: "중간" }
    ]
  },
  "C필러(좌)": {
    chain: [
      { target: "리어 도어(좌)", probability: 0.3, minSeverity: "심각" },
      { target: "쿼터 패널(좌)", probability: 0.5, minSeverity: "심각" },
      { target: "루프 패널", probability: 0.25, minSeverity: "심각" },
      { target: "후면 유리", probability: 0.2, minSeverity: "심각" }
    ]
  },
  "C필러(우)": {
    chain: [
      { target: "리어 도어(우)", probability: 0.3, minSeverity: "심각" },
      { target: "쿼터 패널(우)", probability: 0.5, minSeverity: "심각" },
      { target: "루프 패널", probability: 0.25, minSeverity: "심각" },
      { target: "후면 유리", probability: 0.2, minSeverity: "심각" }
    ]
  },

  // ── 사이드 실 (Rocker Panels) ────────────────────────────────────────
  "사이드 실(좌)": {
    chain: [
      { target: "프론트 도어(좌)", probability: 0.2, minSeverity: "심각" },
      { target: "리어 도어(좌)", probability: 0.2, minSeverity: "심각" },
      { target: "B필러(좌)", probability: 0.3, minSeverity: "심각" },
      { target: "플로어 패널", probability: 0.4, minSeverity: "심각" },
      { target: "사이드 실 몰딩(좌)", probability: 0.7, minSeverity: "경미" }
    ]
  },
  "사이드 실(우)": {
    chain: [
      { target: "프론트 도어(우)", probability: 0.2, minSeverity: "심각" },
      { target: "리어 도어(우)", probability: 0.2, minSeverity: "심각" },
      { target: "B필러(우)", probability: 0.3, minSeverity: "심각" },
      { target: "플로어 패널", probability: 0.4, minSeverity: "심각" },
      { target: "사이드 실 몰딩(우)", probability: 0.7, minSeverity: "경미" }
    ]
  },

  // ── 후면 (Rear) ──────────────────────────────────────────────────────
  "리어 범퍼": {
    chain: [
      { target: "리어 범퍼 리인포스먼트", probability: 0.6, minSeverity: "중간" },
      { target: "트렁크 리드", probability: 0.3, minSeverity: "심각" },
      { target: "리어 램프(좌)", probability: 0.35, minSeverity: "중간" },
      { target: "리어 램프(우)", probability: 0.35, minSeverity: "중간" },
      { target: "후방 카메라", probability: 0.4, minSeverity: "중간" },
      { target: "후방 센서(주차)", probability: 0.5, minSeverity: "경미" },
      { target: "후방 레이더", probability: 0.35, minSeverity: "중간" },
      { target: "배기구 팁", probability: 0.3, minSeverity: "경미" },
      { target: "리어 범퍼 브라켓(좌)", probability: 0.5, minSeverity: "경미" },
      { target: "리어 범퍼 브라켓(우)", probability: 0.5, minSeverity: "경미" }
    ]
  },
  "트렁크 리드": {
    chain: [
      { target: "리어 스포일러", probability: 0.5, minSeverity: "중간" },
      { target: "트렁크 힌지(좌)", probability: 0.4, minSeverity: "심각" },
      { target: "트렁크 힌지(우)", probability: 0.4, minSeverity: "심각" },
      { target: "트렁크 래치", probability: 0.3, minSeverity: "심각" },
      { target: "하이마운트 스탑램프", probability: 0.4, minSeverity: "중간" },
      { target: "후면 유리", probability: 0.25, minSeverity: "심각" },
      { target: "트렁크 웨더스트립", probability: 0.5, minSeverity: "중간" },
      { target: "리어 범퍼", probability: 0.2, minSeverity: "중간" }
    ]
  },
  "리어 램프(좌)": {
    chain: [
      { target: "쿼터 패널(좌)", probability: 0.2, minSeverity: "중간" },
      { target: "트렁크 리드", probability: 0.15, minSeverity: "중간" },
      { target: "리어 범퍼", probability: 0.15, minSeverity: "경미" },
      { target: "리어 램프 가니쉬(좌)", probability: 0.5, minSeverity: "경미" }
    ]
  },
  "리어 램프(우)": {
    chain: [
      { target: "쿼터 패널(우)", probability: 0.2, minSeverity: "중간" },
      { target: "트렁크 리드", probability: 0.15, minSeverity: "중간" },
      { target: "리어 범퍼", probability: 0.15, minSeverity: "경미" },
      { target: "리어 램프 가니쉬(우)", probability: 0.5, minSeverity: "경미" }
    ]
  },
  "후면 유리": {
    chain: [
      { target: "리어 스포일러", probability: 0.2, minSeverity: "심각" },
      { target: "하이마운트 스탑램프", probability: 0.3, minSeverity: "중간" },
      { target: "후면 유리 몰딩", probability: 0.6, minSeverity: "경미" },
      { target: "C필러(좌)", probability: 0.1, minSeverity: "심각" },
      { target: "C필러(우)", probability: 0.1, minSeverity: "심각" }
    ]
  },
  "리어 범퍼 리인포스먼트": {
    chain: [
      { target: "리어 사이드 멤버(좌)", probability: 0.5, minSeverity: "심각" },
      { target: "리어 사이드 멤버(우)", probability: 0.5, minSeverity: "심각" },
      { target: "리어 플로어 패널", probability: 0.4, minSeverity: "심각" },
      { target: "트렁크 플로어", probability: 0.35, minSeverity: "심각" },
      { target: "머플러", probability: 0.3, minSeverity: "심각" }
    ]
  },

  // ── 상부 (Top / Roof) ────────────────────────────────────────────────
  "루프 패널": {
    chain: [
      { target: "A필러(좌)", probability: 0.2, minSeverity: "심각" },
      { target: "A필러(우)", probability: 0.2, minSeverity: "심각" },
      { target: "B필러(좌)", probability: 0.15, minSeverity: "심각" },
      { target: "B필러(우)", probability: 0.15, minSeverity: "심각" },
      { target: "루프 몰딩", probability: 0.6, minSeverity: "경미" },
      { target: "루프 랙", probability: 0.4, minSeverity: "중간" },
      { target: "헤드라이닝", probability: 0.3, minSeverity: "심각" },
      { target: "선루프 어셈블리", probability: 0.4, minSeverity: "중간" },
      { target: "샤크 안테나", probability: 0.3, minSeverity: "경미" }
    ]
  },
  "선루프 어셈블리": {
    chain: [
      { target: "루프 패널", probability: 0.3, minSeverity: "심각" },
      { target: "선루프 유리", probability: 0.8, minSeverity: "경미" },
      { target: "선루프 모터", probability: 0.3, minSeverity: "심각" },
      { target: "선루프 레일", probability: 0.4, minSeverity: "중간" },
      { target: "헤드라이닝", probability: 0.35, minSeverity: "중간" }
    ]
  },

  // ── 하부 (Under / Floor) ─────────────────────────────────────────────
  "플로어 패널": {
    chain: [
      { target: "사이드 실(좌)", probability: 0.3, minSeverity: "심각" },
      { target: "사이드 실(우)", probability: 0.3, minSeverity: "심각" },
      { target: "크로스 멤버", probability: 0.4, minSeverity: "심각" },
      { target: "연료 탱크", probability: 0.2, minSeverity: "심각" },
      { target: "배기 파이프", probability: 0.25, minSeverity: "심각" },
      { target: "고전압 배터리(EV)", probability: 0.3, minSeverity: "심각" }
    ]
  },
  "언더커버(전)": {
    chain: [
      { target: "오일 팬", probability: 0.2, minSeverity: "심각" },
      { target: "서브 프레임(전)", probability: 0.1, minSeverity: "심각" },
      { target: "스태빌라이저 바(전)", probability: 0.15, minSeverity: "중간" }
    ]
  },
  "언더커버(후)": {
    chain: [
      { target: "머플러", probability: 0.2, minSeverity: "중간" },
      { target: "연료 탱크", probability: 0.15, minSeverity: "심각" },
      { target: "리어 디퓨저", probability: 0.3, minSeverity: "경미" }
    ]
  },

  // ── ADAS / 전자장비 ──────────────────────────────────────────────────
  "전방 카메라/센서": {
    chain: [
      { target: "전면 유리", probability: 0.1, minSeverity: "심각" },
      { target: "ADAS ECU", probability: 0.3, minSeverity: "중간" }
    ]
  },
  "전방 레이더": {
    chain: [
      { target: "프론트 그릴", probability: 0.1, minSeverity: "경미" },
      { target: "프론트 범퍼(상)", probability: 0.1, minSeverity: "경미" },
      { target: "ADAS ECU", probability: 0.3, minSeverity: "중간" }
    ]
  },
  "후방 카메라": {
    chain: [
      { target: "트렁크 리드", probability: 0.1, minSeverity: "경미" },
      { target: "ADAS ECU", probability: 0.2, minSeverity: "중간" }
    ]
  },
  "후방 레이더": {
    chain: [
      { target: "리어 범퍼", probability: 0.1, minSeverity: "경미" },
      { target: "ADAS ECU", probability: 0.2, minSeverity: "중간" }
    ]
  },
  "코너 레이더(좌전)": {
    chain: [
      { target: "프론트 범퍼(하)", probability: 0.15, minSeverity: "경미" },
      { target: "ADAS ECU", probability: 0.2, minSeverity: "중간" }
    ]
  },
  "코너 레이더(우전)": {
    chain: [
      { target: "프론트 범퍼(하)", probability: 0.15, minSeverity: "경미" },
      { target: "ADAS ECU", probability: 0.2, minSeverity: "중간" }
    ]
  },
  "코너 레이더(좌후)": {
    chain: [
      { target: "리어 범퍼", probability: 0.15, minSeverity: "경미" },
      { target: "ADAS ECU", probability: 0.2, minSeverity: "중간" }
    ]
  },
  "코너 레이더(우후)": {
    chain: [
      { target: "리어 범퍼", probability: 0.15, minSeverity: "경미" },
      { target: "ADAS ECU", probability: 0.2, minSeverity: "중간" }
    ]
  },

  // ── 서스펜션 / 하체 ──────────────────────────────────────────────────
  "프론트 휠(좌)": {
    chain: [
      { target: "타이어(좌전)", probability: 0.7, minSeverity: "중간" },
      { target: "프론트 너클(좌)", probability: 0.4, minSeverity: "심각" },
      { target: "프론트 펜더(좌)", probability: 0.3, minSeverity: "중간" },
      { target: "브레이크 디스크(좌전)", probability: 0.25, minSeverity: "심각" },
      { target: "브레이크 캘리퍼(좌전)", probability: 0.2, minSeverity: "심각" }
    ]
  },
  "프론트 휠(우)": {
    chain: [
      { target: "타이어(우전)", probability: 0.7, minSeverity: "중간" },
      { target: "프론트 너클(우)", probability: 0.4, minSeverity: "심각" },
      { target: "프론트 펜더(우)", probability: 0.3, minSeverity: "중간" },
      { target: "브레이크 디스크(우전)", probability: 0.25, minSeverity: "심각" },
      { target: "브레이크 캘리퍼(우전)", probability: 0.2, minSeverity: "심각" }
    ]
  },
  "리어 휠(좌)": {
    chain: [
      { target: "타이어(좌후)", probability: 0.7, minSeverity: "중간" },
      { target: "리어 너클(좌)", probability: 0.4, minSeverity: "심각" },
      { target: "쿼터 패널(좌)", probability: 0.25, minSeverity: "중간" },
      { target: "브레이크 디스크(좌후)", probability: 0.25, minSeverity: "심각" }
    ]
  },
  "리어 휠(우)": {
    chain: [
      { target: "타이어(우후)", probability: 0.7, minSeverity: "중간" },
      { target: "리어 너클(우)", probability: 0.4, minSeverity: "심각" },
      { target: "쿼터 패널(우)", probability: 0.25, minSeverity: "중간" },
      { target: "브레이크 디스크(우후)", probability: 0.25, minSeverity: "심각" }
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
