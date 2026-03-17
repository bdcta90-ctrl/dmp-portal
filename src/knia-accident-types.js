// ============================================================================
// KNIA (손해보험협회) 자동차사고 과실비율 인정기준 사고유형 분류
// Korean General Insurance Association - Fault Ratio Standard Accident Types
// Source: https://accident.knia.or.kr
// ============================================================================

const KNIA_ACCIDENT_TYPES = [

  // ========================================================================
  // I. 차대차 (Vehicle vs Vehicle) - 교차로 사고
  // ========================================================================

  // --- 차1: 신호기 있는 교차로 - 직진 대 직진 ---
  {
    id: "차1-1",
    cat1: "차대차",
    cat2: "교차로",
    cat3: "양쪽신호",
    label: "녹색직진 대 적색직진",
    faultA: 0,
    faultB: 100,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "차1-2(가)",
    cat1: "차대차",
    cat2: "교차로",
    cat3: "양쪽신호",
    label: "녹색진입 교차로 미통과 대 녹색직진 (A녹색진입)",
    faultA: 30,
    faultB: 70,
    modifiers: [
      { type: "교차로정체중진입", target: "A", adj: 10 },
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "차1-2(나)",
    cat1: "차대차",
    cat2: "교차로",
    cat3: "양쪽신호",
    label: "황색진입 교차로 미통과 대 녹색직진 (A황색진입)",
    faultA: 80,
    faultB: 20,
    modifiers: [
      { type: "교차로정체중진입", target: "A", adj: 10 },
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },

  // --- 차2: 신호기 있는 교차로 - 직진 대 좌회전 ---
  {
    id: "차2-1",
    cat1: "차대차",
    cat2: "교차로",
    cat3: "양쪽신호",
    label: "적색직진 대 녹색좌회전화살표",
    faultA: 100,
    faultB: 0,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 }
    ]
  },
  {
    id: "차2-2",
    cat1: "차대차",
    cat2: "교차로",
    cat3: "양쪽신호",
    label: "녹색직진 대 녹색(적색)좌회전",
    faultA: 0,
    faultB: 100,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },

  // --- 차3: 신호기 있는 교차로 - 직진 대 좌회전 (적색) ---
  {
    id: "차3-1",
    cat1: "차대차",
    cat2: "교차로",
    cat3: "양쪽신호",
    label: "적색직진 대 녹색화살표좌회전",
    faultA: 100,
    faultB: 0,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "차3-2",
    cat1: "차대차",
    cat2: "교차로",
    cat3: "양쪽신호",
    label: "적색직진 대 적색좌회전",
    faultA: 50,
    faultB: 50,
    modifiers: [
      { type: "교차로정체중진입", target: "A", adj: 10 },
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "소좌회전·대좌회전", target: "B", adj: 10 },
      { type: "서행불이행", target: "B", adj: 10 },
      { type: "급좌회전", target: "B", adj: 10 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 },
      { type: "좌회전완료직후", target: "B", adj: -10 }
    ]
  },

  // --- 차4: 신호기 있는 교차로 - 좌회전 대 우회전 ---
  {
    id: "차4-1",
    cat1: "차대차",
    cat2: "교차로",
    cat3: "양쪽신호",
    label: "녹색화살표좌회전 대 적색우회전",
    faultA: 20,
    faultB: 80,
    modifiers: [
      { type: "대좌회전·대우회전", target: "A", adj: 10 },
      { type: "좌회전직후차로변경", target: "A", adj: 10 },
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "대우회전", target: "B", adj: 10 },
      { type: "우회전직후차로변경", target: "B", adj: 10 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 },
      { type: "명확한선진입", target: "B", adj: -10 },
      { type: "일시정지위반", target: "B", adj: 10 }
    ]
  },
  {
    id: "차4-2",
    cat1: "차대차",
    cat2: "교차로",
    cat3: "양쪽신호",
    label: "녹색비보호좌회전 대 우회전",
    faultA: 60,
    faultB: 40,
    modifiers: [
      { type: "소좌회전·대좌회전", target: "A", adj: 10 },
      { type: "좌회전이후차로변경", target: "A", adj: 10 },
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "명확한선진입", target: "A", adj: -10 },
      { type: "대우회전", target: "B", adj: 10 },
      { type: "우회전이후차로변경", target: "B", adj: 10 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 },
      { type: "명확한선진입", target: "B", adj: -10 }
    ]
  },

  // --- 차5: 한쪽신호 - 신호없는도로 우회전 대 신호있는도로 직진 ---
  {
    id: "차5-1(가)",
    cat1: "차대차",
    cat2: "교차로",
    cat3: "한쪽신호",
    label: "신호없는도로 우회전 대 녹색직진",
    faultA: 80,
    faultB: 20,
    modifiers: [
      { type: "대우회전", target: "A", adj: 10 },
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "일시정지위반", target: "A", adj: 10 },
      { type: "명확한선진입", target: "A", adj: -10 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "차5-1(나)",
    cat1: "차대차",
    cat2: "교차로",
    cat3: "한쪽신호",
    label: "신호없는도로 우회전 대 황색직진",
    faultA: 40,
    faultB: 60,
    modifiers: [
      { type: "대우회전", target: "A", adj: 10 },
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "차5-1(다)",
    cat1: "차대차",
    cat2: "교차로",
    cat3: "한쪽신호",
    label: "신호없는도로 우회전 대 적색직진",
    faultA: 10,
    faultB: 90,
    modifiers: [
      { type: "대우회전", target: "A", adj: 10 },
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "차5-2",
    cat1: "차대차",
    cat2: "교차로",
    cat3: "한쪽신호",
    label: "보행자신호 우회전 대 녹색직진",
    faultA: 100,
    faultB: 0,
    modifiers: [
      { type: "대회전", target: "A", adj: 10 },
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },

  // --- 차6: 한쪽신호 - 신호없는도로 직진(좌회전) 대 신호있는도로 직진 ---
  {
    id: "차6-1(가)",
    cat1: "차대차",
    cat2: "교차로",
    cat3: "한쪽신호",
    label: "신호없는도로 직진 대 녹색직진",
    faultA: 80,
    faultB: 20,
    modifiers: [
      { type: "명확한선진입", target: "A", adj: -10 },
      { type: "소회전·대회전", target: "A", adj: 10 },
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "차6-1(나)",
    cat1: "차대차",
    cat2: "교차로",
    cat3: "한쪽신호",
    label: "신호없는도로 직진 대 황색직진",
    faultA: 40,
    faultB: 60,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "차6-1(다)",
    cat1: "차대차",
    cat2: "교차로",
    cat3: "한쪽신호",
    label: "신호없는도로 직진 대 적색직진",
    faultA: 10,
    faultB: 90,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },

  // --- 차7: 한쪽 지시표지 - 직진 대 직진 (일시정지 위반) ---
  {
    id: "차7-1",
    cat1: "차대차",
    cat2: "교차로",
    cat3: "한쪽지시표지",
    label: "직진 대 일시정지위반 직진",
    faultA: 20,
    faultB: 80,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "명확한선진입", target: "A", adj: -10 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 },
      { type: "명확한선진입", target: "B", adj: -10 }
    ]
  },

  // --- 차8: 한쪽 지시표지 - 직진 대 좌회전 (일시정지 위반) ---
  {
    id: "차8-1",
    cat1: "차대차",
    cat2: "교차로",
    cat3: "한쪽지시표지",
    label: "직진 대 일시정지위반 좌회전",
    faultA: 20,
    faultB: 80,
    modifiers: [
      { type: "서행불이행", target: "A", adj: 10 },
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "좌회전금지위반", target: "B", adj: 20 },
      { type: "일시정지후출발", target: "B", adj: -10 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },

  // --- 차9: 한쪽 지시표지 - 우회전 대 직진 (일시정지 위반) ---
  {
    id: "차9-1",
    cat1: "차대차",
    cat2: "교차로",
    cat3: "한쪽지시표지",
    label: "일시정지위반 우회전 대 직진",
    faultA: 80,
    faultB: 20,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "일시정지후출발", target: "A", adj: -10 },
      { type: "삼거리회전", target: "A", adj: 10 },
      { type: "서행불이행", target: "B", adj: 10 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },

  // --- 차10: 한쪽 지시표지 - 좌회전 대 좌회전 (일시정지 위반) ---
  {
    id: "차10-1",
    cat1: "차대차",
    cat2: "교차로",
    cat3: "한쪽지시표지",
    label: "일시정지위반 좌회전 대 좌회전",
    faultA: 80,
    faultB: 20,
    modifiers: [
      { type: "좌회전방법위반", target: "A", adj: 10 },
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "일시정지후출발", target: "A", adj: -10 },
      { type: "좌회전방법위반", target: "B", adj: 10 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },

  // --- 차11: 교차로 노면표시 위반 ---
  {
    id: "차11-1",
    cat1: "차대차",
    cat2: "교차로",
    cat3: "노면표시위반",
    label: "좌회전차로 직진 대 직진·좌회전차로 좌회전 (신호있음)",
    faultA: 100,
    faultB: 0,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "진로변경신호불이행·지연", target: "B", adj: 10 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "차11-2",
    cat1: "차대차",
    cat2: "교차로",
    cat3: "노면표시위반",
    label: "직진·좌회전차로 직진 대 직진차로 좌회전 (신호있음)",
    faultA: 0,
    faultB: 100,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "차11-3",
    cat1: "차대차",
    cat2: "교차로",
    cat3: "노면표시위반",
    label: "좌회전차로 직진 대 직진차로 좌회전 (신호없음)",
    faultA: 40,
    faultB: 60,
    modifiers: [
      { type: "서행불이행", target: "A", adj: 10 },
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "진로변경신호불이행", target: "B", adj: 10 },
      { type: "급좌회전", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "차11-4",
    cat1: "차대차",
    cat2: "교차로",
    cat3: "노면표시위반",
    label: "직진차로에서 추월 우회전 대 직진·우회전차로 직진",
    faultA: 100,
    faultB: 0,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "진로양보의무위반", target: "B", adj: 10 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "차11-5",
    cat1: "차대차",
    cat2: "교차로",
    cat3: "노면표시위반",
    label: "직진·우회전차로 선행우회전 대 우회전차로 후행직진",
    faultA: 0,
    faultB: 100,
    modifiers: [
      { type: "진로변경신호불이행·지연", target: "A", adj: 10 },
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },

  // --- 차12: 신호기 없는 교차로 - 직진 대 직진 ---
  {
    id: "차12-1(가)",
    cat1: "차대차",
    cat2: "교차로",
    cat3: "신호없음",
    label: "동일폭 교차로 우측차 대 좌측차 직진 (동시진입)",
    faultA: 40,
    faultB: 60,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "서행·일시정지", target: "A", adj: -10 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 },
      { type: "서행·일시정지", target: "B", adj: -10 }
    ]
  },
  {
    id: "차12-1(나)",
    cat1: "차대차",
    cat2: "교차로",
    cat3: "신호없음",
    label: "동일폭 교차로 우측차 선진입 대 좌측차 후진입",
    faultA: 30,
    faultB: 70,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "차12-1(다)",
    cat1: "차대차",
    cat2: "교차로",
    cat3: "신호없음",
    label: "동일폭 교차로 우측차 후진입 대 좌측차 선진입",
    faultA: 70,
    faultB: 30,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "차12-2(가)",
    cat1: "차대차",
    cat2: "교차로",
    cat3: "신호없음",
    label: "광로직진 대 협로직진 (동시진입)",
    faultA: 30,
    faultB: 70,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "차12-2(나)",
    cat1: "차대차",
    cat2: "교차로",
    cat3: "신호없음",
    label: "광로직진 대 협로직진 (B후진입)",
    faultA: 20,
    faultB: 80,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "차12-2(다)",
    cat1: "차대차",
    cat2: "교차로",
    cat3: "신호없음",
    label: "광로직진 대 협로직진 (B선진입)",
    faultA: 60,
    faultB: 40,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },

  // --- 차13: 신호없는 교차로 - 우회전 대 직진 ---
  {
    id: "차13-1",
    cat1: "차대차",
    cat2: "교차로",
    cat3: "신호없음",
    label: "우회전 대 좌측도로 직진 (동일폭)",
    faultA: 60,
    faultB: 40,
    modifiers: [
      { type: "대우회전", target: "A", adj: 10 },
      { type: "서행불이행", target: "A", adj: 10 },
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "명확한선진입", target: "A", adj: -20 },
      { type: "서행불이행", target: "B", adj: 10 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 },
      { type: "명확한선진입", target: "B", adj: -10 }
    ]
  },
  {
    id: "차13-2",
    cat1: "차대차",
    cat2: "교차로",
    cat3: "신호없음",
    label: "직진 후 진로변경 대 우측도로 우회전",
    faultA: 60,
    faultB: 40,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },

  // --- 차14: 신호없는 교차로 - 우회전 대 우측도로 직진 ---
  {
    id: "차14-1",
    cat1: "차대차",
    cat2: "교차로",
    cat3: "신호없음",
    label: "우회전 대 우측도로 직진 (이면도로)",
    faultA: 70,
    faultB: 30,
    modifiers: [
      { type: "서행불이행", target: "A", adj: 10 },
      { type: "대우회전", target: "A", adj: 10 },
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "명확한선진입", target: "A", adj: -10 },
      { type: "서행불이행", target: "B", adj: 10 },
      { type: "우측통행불이행", target: "B", adj: 10 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 },
      { type: "명확한선진입", target: "B", adj: -10 }
    ]
  },

  // --- 차15: 신호없는 교차로 - 직진 대 대향 좌회전 ---
  {
    id: "차15-1",
    cat1: "차대차",
    cat2: "교차로",
    cat3: "신호없음",
    label: "직진 대 대향 좌회전",
    faultA: 30,
    faultB: 70,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "명확한선진입", target: "A", adj: -10 },
      { type: "소좌회전·대좌회전", target: "B", adj: 10 },
      { type: "서행불이행", target: "B", adj: 10 },
      { type: "급좌회전", target: "B", adj: 10 },
      { type: "신호불이행", target: "B", adj: 10 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 },
      { type: "좌회전완료직후", target: "B", adj: -30 }
    ]
  },

  // --- 차16: 신호없는 교차로 - 좌측도로직진 대 우측도로좌회전 ---
  {
    id: "차16-1",
    cat1: "차대차",
    cat2: "교차로",
    cat3: "신호없음",
    label: "좌측도로 직진 대 우측도로 좌회전",
    faultA: 40,
    faultB: 60,
    modifiers: [
      { type: "서행불이행", target: "A", adj: 10 },
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "명확한선진입", target: "A", adj: -10 },
      { type: "소·대좌회전", target: "B", adj: 10 },
      { type: "신호불이행", target: "B", adj: 10 },
      { type: "서행불이행", target: "B", adj: 10 },
      { type: "좌회전금지위반", target: "B", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 },
      { type: "명확한선진입", target: "B", adj: -10 },
      { type: "좌회전완료직후", target: "B", adj: -30 },
      { type: "삼거리좌회전", target: "B", adj: 10 }
    ]
  },

  // --- 차17: 신호없는 교차로 - 양측 좌회전 ---
  {
    id: "차17-1",
    cat1: "차대차",
    cat2: "교차로",
    cat3: "신호없음",
    label: "우측도로 좌회전 대 좌측도로 좌회전",
    faultA: 40,
    faultB: 60,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },

  // --- 차18: 신호없는 교차로 - 우회전 대 우측도로 좌회전 ---
  {
    id: "차18-1",
    cat1: "차대차",
    cat2: "교차로",
    cat3: "신호없음",
    label: "우회전 대 우측도로 좌회전",
    faultA: 50,
    faultB: 50,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },

  // --- 차19~21: 교차로 부근 동시회전 ---
  {
    id: "차19-1",
    cat1: "차대차",
    cat2: "교차로",
    cat3: "동시회전",
    label: "선행 좌(우)회전 미리 안 붙임 대 후행 직진 추월",
    faultA: 20,
    faultB: 80,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "차20-1",
    cat1: "차대차",
    cat2: "교차로",
    cat3: "동시회전",
    label: "동시 우회전 (A오른쪽 대 B왼쪽)",
    faultA: 40,
    faultB: 60,
    modifiers: [
      { type: "대우회전", target: "A", adj: 10 },
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "대우회전", target: "B", adj: 10 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "차21-1",
    cat1: "차대차",
    cat2: "교차로",
    cat3: "동시회전",
    label: "동시 좌회전 (A좌측 대 B우측)",
    faultA: 40,
    faultB: 60,
    modifiers: [
      { type: "대좌회전", target: "A", adj: 10 },
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "대좌회전", target: "B", adj: 10 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },

  // ========================================================================
  // II. 차대차 - 대향차 (마주보는 방향)
  // ========================================================================

  // --- 차31: 중앙선 침범 ---
  {
    id: "차31-1",
    cat1: "차대차",
    cat2: "대향차",
    cat3: "중앙선침범",
    label: "직진 대 중앙선 침범 역주행",
    faultA: 0,
    faultB: 100,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "차31-2",
    cat1: "차대차",
    cat2: "대향차",
    cat3: "중앙선침범",
    label: "직진 대 도로외 장소에서 중앙선 넘어 좌회전 진입",
    faultA: 0,
    faultB: 100,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },

  // --- 차32: 중앙선 없는 도로 ---
  {
    id: "차32-1",
    cat1: "차대차",
    cat2: "대향차",
    cat3: "중앙선없음",
    label: "중앙선 없는 좁은 도로 교행 충돌",
    faultA: 50,
    faultB: 50,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },

  // --- 차33: 유턴 ---
  {
    id: "차33-1(가)",
    cat1: "차대차",
    cat2: "대향차",
    cat3: "유턴",
    label: "녹색직진 대 상시유턴구역 유턴",
    faultA: 20,
    faultB: 80,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "차33-1(나)",
    cat1: "차대차",
    cat2: "대향차",
    cat3: "유턴",
    label: "적색직진 대 신호유턴",
    faultA: 100,
    faultB: 0,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },

  // ========================================================================
  // III. 차대차 - 동일방향 진행
  // ========================================================================

  // --- 차41: 추돌 ---
  {
    id: "차41-1",
    cat1: "차대차",
    cat2: "동일방향",
    cat3: "추돌",
    label: "후행차 추돌 (선행차 정상주행)",
    faultA: 100,
    faultB: 0,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "제동등고장", target: "B", adj: 10 },
      { type: "급제동", target: "B", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },

  // --- 차42: 선행사고 정차 추돌 ---
  {
    id: "차42-1",
    cat1: "차대차",
    cat2: "동일방향",
    cat3: "추돌",
    label: "선행사고 주·정차 차량 추돌",
    faultA: 80,
    faultB: 20,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "고속도로주정차", target: "B", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },

  // --- 차43: 진로변경·합류 ---
  {
    id: "차43-1",
    cat1: "차대차",
    cat2: "동일방향",
    cat3: "진로변경",
    label: "본선 직진 대 합류차량 (차로감소)",
    faultA: 40,
    faultB: 60,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "차43-2",
    cat1: "차대차",
    cat2: "동일방향",
    cat3: "진로변경",
    label: "후행 직진 대 선행 진로변경",
    faultA: 30,
    faultB: 70,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "진로변경신호불이행", target: "B", adj: 10 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "차43-3",
    cat1: "차대차",
    cat2: "동일방향",
    cat3: "진로변경",
    label: "좌우 동시 진로변경 충돌",
    faultA: 50,
    faultB: 50,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },

  // --- 차44: 도로 진입 ---
  {
    id: "차44-1",
    cat1: "차대차",
    cat2: "동일방향",
    cat3: "도로진입",
    label: "직진 대 도로외 장소에서 우회전 진입",
    faultA: 20,
    faultB: 80,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },

  // --- 차45: 추월 ---
  {
    id: "차45-1",
    cat1: "차대차",
    cat2: "동일방향",
    cat3: "추월",
    label: "교차로 내 불법추월 대 좌회전",
    faultA: 100,
    faultB: 0,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },

  // --- 차46: 유턴 ---
  {
    id: "차46-1(가)",
    cat1: "차대차",
    cat2: "동일방향",
    cat3: "유턴",
    label: "선행차 정상유턴 대 후행차 급유턴",
    faultA: 0,
    faultB: 100,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "차46-1(나)",
    cat1: "차대차",
    cat2: "동일방향",
    cat3: "유턴",
    label: "양 차량 동시 유턴 충돌",
    faultA: 20,
    faultB: 80,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },

  // --- 차47: 정차 후 출발 ---
  {
    id: "차47-1",
    cat1: "차대차",
    cat2: "동일방향",
    cat3: "기타",
    label: "정차 후 갑자기 출발 대 추월시도 차량",
    faultA: 80,
    faultB: 20,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },

  // --- 차48: 낙하물 ---
  {
    id: "차48-1",
    cat1: "차대차",
    cat2: "동일방향",
    cat3: "낙하물",
    label: "후행차 낙하물 충격 (선행차 적재불량)",
    faultA: 0,
    faultB: 100,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },

  // ========================================================================
  // IV. 차대차 - 기타
  // ========================================================================

  // --- 차51: 주차장 ---
  {
    id: "차51-1",
    cat1: "차대차",
    cat2: "기타",
    cat3: "주차장",
    label: "주차장 통행로 주행 대 출차",
    faultA: 30,
    faultB: 70,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },

  // --- 차52: 문 열림 ---
  {
    id: "차52-1",
    cat1: "차대차",
    cat2: "기타",
    cat3: "문열림",
    label: "후행 직진 대 주·정차 중 문 열림",
    faultA: 20,
    faultB: 80,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },

  // --- 차53: 횡단보도 이륜차 ---
  {
    id: "차53-1",
    cat1: "차대차",
    cat2: "기타",
    cat3: "횡단보도",
    label: "적색 횡단보도 이륜차 대 정상 직진(좌회전) 차량",
    faultA: 100,
    faultB: 0,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },

  // --- 차54: 회전교차로 ---
  {
    id: "차54-1",
    cat1: "차대차",
    cat2: "기타",
    cat3: "회전교차로",
    label: "회전 중 차량 대 진입 차량",
    faultA: 20,
    faultB: 80,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "차54-2",
    cat1: "차대차",
    cat2: "기타",
    cat3: "회전교차로",
    label: "2차로 회전교차로 내부1차로 회전 대 대진입(2차로→1차로)",
    faultA: 10,
    faultB: 90,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },

  // --- 차55: 긴급자동차 ---
  {
    id: "차55-1",
    cat1: "차대차",
    cat2: "기타",
    cat3: "긴급자동차",
    label: "녹색직진 대 적색직진 긴급자동차",
    faultA: 60,
    faultB: 40,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },

  // ========================================================================
  // V. 차대사람 (Vehicle vs Pedestrian) - 보1~보36
  // ========================================================================

  // --- 보1~보12: 신호기 있는 횡단보도 ---
  {
    id: "보1",
    cat1: "차대사람",
    cat2: "횡단보도",
    cat3: "신호있음",
    label: "녹색통과차량 대 적색횡단보행자 (적색충격)",
    faultA: 30,
    faultB: 70,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "야간·시야장애", target: "B", adj: 5 }
    ]
  },
  {
    id: "보2",
    cat1: "차대사람",
    cat2: "횡단보도",
    cat3: "신호있음",
    label: "황색통과차량 대 적색횡단보행자 (적색충격)",
    faultA: 50,
    faultB: 50,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 }
    ]
  },
  {
    id: "보3",
    cat1: "차대사람",
    cat2: "횡단보도",
    cat3: "신호있음",
    label: "황색통과차량 대 적색횡단보행자 (녹색충격)",
    faultA: 70,
    faultB: 30,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 }
    ]
  },
  {
    id: "보4",
    cat1: "차대사람",
    cat2: "횡단보도",
    cat3: "신호있음",
    label: "황색통과차량 대 녹색횡단보행자 (녹색충격)",
    faultA: 100,
    faultB: 0,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 }
    ]
  },
  {
    id: "보5",
    cat1: "차대사람",
    cat2: "횡단보도",
    cat3: "신호있음",
    label: "적색통과차량 대 녹색횡단보행자 (녹색충격)",
    faultA: 100,
    faultB: 0,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 }
    ]
  },
  {
    id: "보6",
    cat1: "차대사람",
    cat2: "횡단보도",
    cat3: "신호있음",
    label: "적색통과차량 대 적색횡단보행자",
    faultA: 60,
    faultB: 40,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 }
    ]
  },
  {
    id: "보7",
    cat1: "차대사람",
    cat2: "횡단보도",
    cat3: "신호있음",
    label: "적색통과차량 대 녹색점멸횡단보행자 (적색충격)",
    faultA: 80,
    faultB: 20,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 }
    ]
  },
  {
    id: "보8",
    cat1: "차대사람",
    cat2: "횡단보도",
    cat3: "신호있음",
    label: "녹색통과차량 대 적색횡단개시·적색충격 보행자",
    faultA: 30,
    faultB: 70,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 }
    ]
  },
  {
    id: "보9",
    cat1: "차대사람",
    cat2: "횡단보도",
    cat3: "신호있음",
    label: "녹색통과차량 대 적색횡단개시·녹색충격 보행자",
    faultA: 80,
    faultB: 20,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 }
    ]
  },
  {
    id: "보10",
    cat1: "차대사람",
    cat2: "횡단보도",
    cat3: "신호있음",
    label: "적색통과차량 대 녹색횡단개시·녹색충격 보행자",
    faultA: 100,
    faultB: 0,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 }
    ]
  },
  {
    id: "보11",
    cat1: "차대사람",
    cat2: "횡단보도",
    cat3: "신호있음",
    label: "차량직진 대 녹색횡단개시·적색충격 보행자",
    faultA: 90,
    faultB: 10,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "녹색점멸횡단개시", target: "B", adj: 10 }
    ]
  },
  {
    id: "보12",
    cat1: "차대사람",
    cat2: "횡단보도",
    cat3: "신호있음",
    label: "적색통과차량 대 녹색점멸횡단보행자 (녹색점멸충격)",
    faultA: 95,
    faultB: 5,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 }
    ]
  },

  // --- 보13: 신호기 없는 횡단보도 ---
  {
    id: "보13",
    cat1: "차대사람",
    cat2: "횡단보도",
    cat3: "신호없음",
    label: "횡단보도 통과 차량 대 횡단보행자",
    faultA: 100,
    faultB: 0,
    modifiers: [
      { type: "야간·시야장애", target: "B", adj: 5 },
      { type: "간선도로", target: "B", adj: 5 },
      { type: "어린이보호구역", target: "B", adj: -5 }
    ]
  },

  // --- 보14~보20: 횡단보도 부근 ---
  {
    id: "보14",
    cat1: "차대사람",
    cat2: "횡단보도부근",
    cat3: "신호있음",
    label: "적색직진(좌회전) 차량 대 횡단보도 10m이내 보행자",
    faultA: 90,
    faultB: 10,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 }
    ]
  },
  {
    id: "보15",
    cat1: "차대사람",
    cat2: "횡단보도부근",
    cat3: "신호있음",
    label: "황색진입 차량 대 횡단보도 10m이내 보행자",
    faultA: 90,
    faultB: 10,
    modifiers: [
      { type: "보행자적색", target: "B", adj: 40 },
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 }
    ]
  },
  {
    id: "보16",
    cat1: "차대사람",
    cat2: "횡단보도부근",
    cat3: "신호있음",
    label: "녹색진입 차량 대 적색 횡단보도 10m이내 보행자",
    faultA: 50,
    faultB: 50,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 }
    ]
  },
  {
    id: "보17",
    cat1: "차대사람",
    cat2: "횡단보도부근",
    cat3: "신호있음",
    label: "우회전금지위반 차량 대 횡단보도 10m이내 보행자",
    faultA: 90,
    faultB: 10,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 }
    ]
  },
  {
    id: "보18",
    cat1: "차대사람",
    cat2: "횡단보도부근",
    cat3: "신호있음",
    label: "우회전규제녹색 차량 대 적색횡단 보행자",
    faultA: 40,
    faultB: 60,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 }
    ]
  },
  {
    id: "보19",
    cat1: "차대사람",
    cat2: "횡단보도부근",
    cat3: "신호있음",
    label: "횡단보도 통과전 직진 대 횡단보도 10m이내 보행자",
    faultA: 80,
    faultB: 20,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 }
    ]
  },
  {
    id: "보20",
    cat1: "차대사람",
    cat2: "횡단보도부근",
    cat3: "신호없음",
    label: "직진 차량 대 횡단보도 10m이내 보행자 (신호없음)",
    faultA: 80,
    faultB: 20,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 }
    ]
  },

  // --- 보21~보26: 도로 횡단·통행 ---
  {
    id: "보21",
    cat1: "차대사람",
    cat2: "도로횡단",
    cat3: "육교·지하도부근",
    label: "직진 차량 대 육교·지하도 10m이내 횡단 보행자",
    faultA: 60,
    faultB: 40,
    modifiers: [
      { type: "야간·시야장애", target: "B", adj: 5 },
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 }
    ]
  },
  {
    id: "보22",
    cat1: "차대사람",
    cat2: "도로횡단",
    cat3: "교차로",
    label: "교차로 진행 차량 대 교차로부근 횡단 보행자 (신호없음)",
    faultA: 90,
    faultB: 10,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "대로횡단", target: "B", adj: 20 },
      { type: "동일폭횡단", target: "B", adj: 10 }
    ]
  },
  {
    id: "보23",
    cat1: "차대사람",
    cat2: "도로횡단",
    cat3: "단일로",
    label: "직선로(곡선로) 직진 차량 대 횡단 보행자",
    faultA: 80,
    faultB: 20,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "야간·시야장애", target: "B", adj: 5 },
      { type: "간선도로", target: "B", adj: 10 }
    ]
  },
  {
    id: "보24",
    cat1: "차대사람",
    cat2: "도로통행",
    cat3: "보도",
    label: "차도에서 보도 진출입 차량 대 보도 위 보행자",
    faultA: 100,
    faultB: 0,
    modifiers: [
      { type: "차량진출입허용구간", target: "B", adj: 5 }
    ]
  },
  {
    id: "보25",
    cat1: "차대사람",
    cat2: "도로통행",
    cat3: "도로공사",
    label: "차도 주행 차량 대 도로공사로 차도 통행 보행자",
    faultA: 90,
    faultB: 10,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 }
    ]
  },
  {
    id: "보26",
    cat1: "차대사람",
    cat2: "도로통행",
    cat3: "차도측단",
    label: "차도 주행 차량 대 차도측단(1m이내) 보행자",
    faultA: 80,
    faultB: 20,
    modifiers: [
      { type: "차도측단외", target: "B", adj: 10 },
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 }
    ]
  },

  // --- 보28~보30: 보차도 구분 없는 도로 ---
  {
    id: "보28",
    cat1: "차대사람",
    cat2: "도로통행",
    cat3: "보차도구분없음",
    label: "차량 대 도로 중앙부분 통행 보행자",
    faultA: 80,
    faultB: 20,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 }
    ]
  },
  {
    id: "보30",
    cat1: "차대사람",
    cat2: "도로통행",
    cat3: "특수보행자",
    label: "차도 주행 차량 대 도로에 누운·앉은·놀이 보행자",
    faultA: 60,
    faultB: 40,
    modifiers: [
      { type: "야간·시야장애", target: "B", adj: 20 },
      { type: "주·정차후출발", target: "A", adj: -10 },
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 }
    ]
  },

  // --- 보31~보34: 후진·도로외 장소 ---
  {
    id: "보31",
    cat1: "차대사람",
    cat2: "후진",
    cat3: "도로외장소",
    label: "후진차량 대 3m이내 근거리 횡단 보행자",
    faultA: 80,
    faultB: 20,
    modifiers: [
      { type: "야간·시야장애", target: "B", adj: 10 },
      { type: "경음기미작동", target: "A", adj: 10 },
      { type: "후방미확인", target: "A", adj: 10 },
      { type: "어린이·노인·장애인", target: "B", adj: -5 }
    ]
  },
  {
    id: "보32",
    cat1: "차대사람",
    cat2: "후진",
    cat3: "도로외장소",
    label: "후진차량 대 후미 횡단 보행자",
    faultA: 100,
    faultB: 0,
    modifiers: [
      { type: "야간·시야장애", target: "B", adj: 5 },
      { type: "경음기미작동", target: "A", adj: 10 }
    ]
  },
  {
    id: "보33",
    cat1: "차대사람",
    cat2: "횡단보도",
    cat3: "이륜차",
    label: "횡단보도 이륜차 대 횡단 보행자",
    faultA: 100,
    faultB: 0,
    modifiers: [
      { type: "야간·시야장애", target: "B", adj: 5 },
      { type: "어린이·노인·장애인", target: "B", adj: -5 }
    ]
  },
  {
    id: "보34",
    cat1: "차대사람",
    cat2: "도로외장소",
    cat3: "아파트·단지",
    label: "도로외장소 직진 차량 대 횡단 보행자",
    faultA: 100,
    faultB: 0,
    modifiers: [
      { type: "야간·시야장애", target: "B", adj: 5 },
      { type: "어린이·노인·장애인", target: "B", adj: -5 }
    ]
  },

  // --- 보35~보36: 고속도로 ---
  {
    id: "보35",
    cat1: "차대사람",
    cat2: "고속도로",
    cat3: "보행자",
    label: "고속도로 차량 대 이유없는 통행·횡단 보행자",
    faultA: 20,
    faultB: 80,
    modifiers: [
      { type: "야간·악천후", target: "B", adj: 20 },
      { type: "무단횡단", target: "B", adj: 20 },
      { type: "보행용이지역", target: "B", adj: -20 },
      { type: "갓길보행", target: "B", adj: -20 }
    ]
  },
  {
    id: "보36",
    cat1: "차대사람",
    cat2: "고속도로",
    cat3: "보행자",
    label: "고속도로 차량 대 이유있는 통행·횡단 보행자",
    faultA: 40,
    faultB: 60,
    modifiers: [
      { type: "야간·악천후", target: "B", adj: 10 },
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 }
    ]
  },

  // ========================================================================
  // VI. 차대자전거 (Vehicle vs Bicycle) - 거1~거43
  // ========================================================================

  // --- 거1: 신호있는 교차로 - 직진 대 직진 ---
  {
    id: "거1-1",
    cat1: "차대자전거",
    cat2: "교차로",
    cat3: "양쪽신호",
    label: "녹색직진 자전거 대 적색직진 자동차",
    faultA: 0,
    faultB: 100,
    modifiers: [
      { type: "야간·시야장애", target: "A", adj: 5 },
      { type: "중대한과실", target: "A", adj: 10 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 },
      { type: "어린이·노인·장애인", target: "A", adj: -10 }
    ]
  },
  {
    id: "거1-2",
    cat1: "차대자전거",
    cat2: "교차로",
    cat3: "양쪽신호",
    label: "적색직진 자전거 대 녹색직진 자동차",
    faultA: 90,
    faultB: 10,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 },
      { type: "어린이·노인·장애인", target: "A", adj: -10 }
    ]
  },
  {
    id: "거1-3",
    cat1: "차대자전거",
    cat2: "교차로",
    cat3: "양쪽신호",
    label: "황색직진 자전거 대 적색직진 자동차",
    faultA: 20,
    faultB: 80,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "거1-4",
    cat1: "차대자전거",
    cat2: "교차로",
    cat3: "양쪽신호",
    label: "적색직진 자전거 대 황색직진 자동차",
    faultA: 70,
    faultB: 30,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "거1-5",
    cat1: "차대자전거",
    cat2: "교차로",
    cat3: "양쪽신호",
    label: "적색직진 자전거 대 적색직진 자동차",
    faultA: 40,
    faultB: 60,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },

  // --- 거2: 신호있는 교차로 - 직진 대 좌회전 ---
  {
    id: "거2-1",
    cat1: "차대자전거",
    cat2: "교차로",
    cat3: "양쪽신호",
    label: "녹색직진 자전거 대 녹색비보호좌회전 자동차",
    faultA: 5,
    faultB: 95,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "거2-2",
    cat1: "차대자전거",
    cat2: "교차로",
    cat3: "양쪽신호",
    label: "녹색비보호좌회전 자전거 대 녹색직진 자동차",
    faultA: 60,
    faultB: 40,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },

  // --- 거3: 한쪽 지시표지 교차로 - 직진 대 직진 ---
  {
    id: "거3-1",
    cat1: "차대자전거",
    cat2: "교차로",
    cat3: "한쪽지시표지",
    label: "일시정지위반 직진 자전거 대 직진 자동차",
    faultA: 60,
    faultB: 40,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "거3-2",
    cat1: "차대자전거",
    cat2: "교차로",
    cat3: "한쪽지시표지",
    label: "직진 자전거 대 일시정지위반 직진 자동차",
    faultA: 10,
    faultB: 90,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "거3-3",
    cat1: "차대자전거",
    cat2: "교차로",
    cat3: "한쪽지시표지",
    label: "일방통행위반 직진 자전거 대 직진 자동차",
    faultA: 60,
    faultB: 40,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "거3-4",
    cat1: "차대자전거",
    cat2: "교차로",
    cat3: "한쪽지시표지",
    label: "직진 자전거 대 일방통행위반 직진 자동차",
    faultA: 10,
    faultB: 90,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },

  // --- 거4: 한쪽 지시표지 교차로 - 직진 대 좌회전 ---
  {
    id: "거4-1",
    cat1: "차대자전거",
    cat2: "교차로",
    cat3: "한쪽지시표지",
    label: "일시정지위반 직진 자전거 대 좌회전 자동차",
    faultA: 50,
    faultB: 50,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "거4-2",
    cat1: "차대자전거",
    cat2: "교차로",
    cat3: "한쪽지시표지",
    label: "직진 자전거 대 일시정지위반 좌회전 자동차",
    faultA: 5,
    faultB: 95,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "거4-3",
    cat1: "차대자전거",
    cat2: "교차로",
    cat3: "한쪽지시표지",
    label: "좌회전 자전거 대 일시정지위반 직진 자동차",
    faultA: 20,
    faultB: 80,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "거4-4",
    cat1: "차대자전거",
    cat2: "교차로",
    cat3: "한쪽지시표지",
    label: "일시정지위반 좌회전 자전거 대 직진 자동차",
    faultA: 70,
    faultB: 30,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },

  // --- 거5: 한쪽 지시표지 교차로 - 직진 대 우회전 ---
  {
    id: "거5-1",
    cat1: "차대자전거",
    cat2: "교차로",
    cat3: "한쪽지시표지",
    label: "일시정지위반 직진 자전거 대 우회전 자동차",
    faultA: 50,
    faultB: 50,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "거5-2",
    cat1: "차대자전거",
    cat2: "교차로",
    cat3: "한쪽지시표지",
    label: "직진 자전거 대 일시정지위반 우회전 자동차",
    faultA: 5,
    faultB: 95,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "거5-3",
    cat1: "차대자전거",
    cat2: "교차로",
    cat3: "한쪽지시표지",
    label: "우회전 자전거 대 일시정지위반 직진 자동차",
    faultA: 20,
    faultB: 80,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "거5-4",
    cat1: "차대자전거",
    cat2: "교차로",
    cat3: "한쪽지시표지",
    label: "일시정지위반 우회전 자전거 대 직진 자동차",
    faultA: 70,
    faultB: 30,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },

  // --- 거6: 신호없는 교차로 - 직진 대 직진 ---
  {
    id: "거6-1",
    cat1: "차대자전거",
    cat2: "교차로",
    cat3: "신호없음",
    label: "동일폭 우측 자전거 직진 대 좌측 자동차 직진",
    faultA: 20,
    faultB: 80,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "거6-2",
    cat1: "차대자전거",
    cat2: "교차로",
    cat3: "신호없음",
    label: "동일폭 좌측 자전거 직진 대 우측 자동차 직진",
    faultA: 40,
    faultB: 60,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "거6-3",
    cat1: "차대자전거",
    cat2: "교차로",
    cat3: "신호없음",
    label: "광로 자전거 직진 대 협로 자동차 직진",
    faultA: 10,
    faultB: 90,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "거6-4",
    cat1: "차대자전거",
    cat2: "교차로",
    cat3: "신호없음",
    label: "협로 자전거 직진 대 광로 자동차 직진",
    faultA: 40,
    faultB: 60,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },

  // --- 거7: 신호없는 교차로 - 직진 대 우회전 ---
  {
    id: "거7-1",
    cat1: "차대자전거",
    cat2: "교차로",
    cat3: "신호없음",
    label: "동일폭 좌측 직진 자전거 대 우회전 자동차",
    faultA: 20,
    faultB: 80,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "거7-2",
    cat1: "차대자전거",
    cat2: "교차로",
    cat3: "신호없음",
    label: "동일폭 우측 직진 자전거 대 우회전 자동차",
    faultA: 30,
    faultB: 70,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "거7-3",
    cat1: "차대자전거",
    cat2: "교차로",
    cat3: "신호없음",
    label: "동일폭 우회전 자전거 대 좌측 직진 자동차",
    faultA: 40,
    faultB: 60,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "거7-4",
    cat1: "차대자전거",
    cat2: "교차로",
    cat3: "신호없음",
    label: "광로 직진 자전거 대 협로 우회전 자동차",
    faultA: 10,
    faultB: 90,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "거7-5",
    cat1: "차대자전거",
    cat2: "교차로",
    cat3: "신호없음",
    label: "협로 직진 자전거 대 광로 우회전 자동차",
    faultA: 30,
    faultB: 70,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "거7-6",
    cat1: "차대자전거",
    cat2: "교차로",
    cat3: "신호없음",
    label: "우회전 자전거 대 광로 직진 자동차",
    faultA: 50,
    faultB: 50,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },

  // --- 거8: 신호없는 교차로 - 직진 대 대향 좌회전 ---
  {
    id: "거8-1",
    cat1: "차대자전거",
    cat2: "교차로",
    cat3: "신호없음",
    label: "직진 자전거 대 대향 좌회전 자동차",
    faultA: 10,
    faultB: 90,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "거8-2",
    cat1: "차대자전거",
    cat2: "교차로",
    cat3: "신호없음",
    label: "좌회전 자전거 대 대향 직진 자동차",
    faultA: 50,
    faultB: 50,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },

  // --- 거9: 신호없는 교차로 - 직진 대 측면 좌회전 ---
  {
    id: "거9-1",
    cat1: "차대자전거",
    cat2: "교차로",
    cat3: "신호없음",
    label: "동일폭 좌측 직진 자전거 대 우측 좌회전 자동차",
    faultA: 20,
    faultB: 80,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "거9-2",
    cat1: "차대자전거",
    cat2: "교차로",
    cat3: "신호없음",
    label: "동일폭 우측 직진 자전거 대 좌측 좌회전 자동차",
    faultA: 15,
    faultB: 85,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "거9-3",
    cat1: "차대자전거",
    cat2: "교차로",
    cat3: "신호없음",
    label: "동일폭 좌회전 자전거 대 좌측 직진 자동차",
    faultA: 50,
    faultB: 50,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "거9-4",
    cat1: "차대자전거",
    cat2: "교차로",
    cat3: "신호없음",
    label: "동일폭 좌회전 자전거 대 우측 직진 자동차",
    faultA: 40,
    faultB: 60,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "거9-5",
    cat1: "차대자전거",
    cat2: "교차로",
    cat3: "신호없음",
    label: "광로 직진 자전거 대 협로 좌회전 자동차",
    faultA: 5,
    faultB: 95,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "거9-6",
    cat1: "차대자전거",
    cat2: "교차로",
    cat3: "신호없음",
    label: "협로 직진 자전거 대 광로 좌회전 자동차",
    faultA: 30,
    faultB: 70,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "거9-7",
    cat1: "차대자전거",
    cat2: "교차로",
    cat3: "신호없음",
    label: "좌회전 자전거 대 광로 직진 자동차",
    faultA: 60,
    faultB: 40,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "거9-8",
    cat1: "차대자전거",
    cat2: "교차로",
    cat3: "신호없음",
    label: "광로 좌회전 자전거 대 협로 직진 자동차",
    faultA: 30,
    faultB: 70,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },

  // --- 거10: 동일차로 선행우회전 대 후행직진 ---
  {
    id: "거10-1",
    cat1: "차대자전거",
    cat2: "교차로",
    cat3: "동일차로",
    label: "선행 우회전 미리안붙임 자동차 대 후행 직진 자전거",
    faultA: 70,
    faultB: 30,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "거10-2",
    cat1: "차대자전거",
    cat2: "교차로",
    cat3: "동일차로",
    label: "후행 우회전 자동차 대 선행 직진 자전거",
    faultA: 90,
    faultB: 10,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "거10-3",
    cat1: "차대자전거",
    cat2: "교차로",
    cat3: "동일차로",
    label: "선행 좌회전 미리안붙임 자동차 대 후행 직진 자전거",
    faultA: 70,
    faultB: 30,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "거10-4",
    cat1: "차대자전거",
    cat2: "교차로",
    cat3: "동일차로",
    label: "후행 좌회전 자동차 대 선행 직진 자전거",
    faultA: 90,
    faultB: 10,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },

  // --- 거21: 중앙선 침범 (역통행) ---
  {
    id: "거21-1",
    cat1: "차대자전거",
    cat2: "대향차",
    cat3: "역통행",
    label: "역통행 자전거 대 정상통행 자동차",
    faultA: 60,
    faultB: 40,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 },
      { type: "어린이·노인·장애인", target: "A", adj: -10 }
    ]
  },

  // --- 거31: 추돌 ---
  {
    id: "거31-1",
    cat1: "차대자전거",
    cat2: "동일방향",
    cat3: "추돌",
    label: "선행 자전거 대 후행 자동차 추돌",
    faultA: 0,
    faultB: 100,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "거31-2",
    cat1: "차대자전거",
    cat2: "동일방향",
    cat3: "추돌",
    label: "선행 자동차 대 후행 자전거 추돌",
    faultA: 10,
    faultB: 90,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },

  // --- 거32: 진로변경 ---
  {
    id: "거32-1",
    cat1: "차대자전거",
    cat2: "동일방향",
    cat3: "진로변경",
    label: "진로변경 자전거 대 후행 직진 자동차",
    faultA: 50,
    faultB: 50,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "거32-2",
    cat1: "차대자전거",
    cat2: "동일방향",
    cat3: "진로변경",
    label: "직진 자전거 대 진로변경 자동차",
    faultA: 10,
    faultB: 90,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },

  // --- 거33: 도로 진입 ---
  {
    id: "거33-1",
    cat1: "차대자전거",
    cat2: "동일방향",
    cat3: "도로진입",
    label: "도로통행 자전거 대 도로외 장소에서 진입 자동차",
    faultA: 5,
    faultB: 95,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "거33-2",
    cat1: "차대자전거",
    cat2: "동일방향",
    cat3: "도로진입",
    label: "도로외 장소에서 진입 자전거 대 도로통행 자동차",
    faultA: 50,
    faultB: 50,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },

  // --- 거41: 도로 횡단 ---
  {
    id: "거41-1",
    cat1: "차대자전거",
    cat2: "기타",
    cat3: "도로횡단",
    label: "도로 횡단 자전거 대 직진 자동차",
    faultA: 40,
    faultB: 60,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },

  // --- 거42: 자전거횡단도 ---
  {
    id: "거42-1",
    cat1: "차대자전거",
    cat2: "기타",
    cat3: "자전거횡단도",
    label: "자전거횡단도 횡단 자전거 대 직진 자동차",
    faultA: 0,
    faultB: 100,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },

  // --- 거43: 자전거 전용도로 ---
  {
    id: "거43-1",
    cat1: "차대자전거",
    cat2: "기타",
    cat3: "자전거전용도로",
    label: "자전거전용도로 통행 자전거 대 진로변경 진입 자동차",
    faultA: 0,
    faultB: 100,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "거43-2",
    cat1: "차대자전거",
    cat2: "기타",
    cat3: "자전거전용도로",
    label: "자전거우선도로 통행 자전거 대 진입 자동차",
    faultA: 10,
    faultB: 90,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  },
  {
    id: "거43-3",
    cat1: "차대자전거",
    cat2: "기타",
    cat3: "자전거전용도로",
    label: "자전거겸용도로 통행 자전거 대 진입 자동차",
    faultA: 15,
    faultB: 85,
    modifiers: [
      { type: "현저한과실", target: "A", adj: 10 },
      { type: "중대한과실", target: "A", adj: 20 },
      { type: "현저한과실", target: "B", adj: 10 },
      { type: "중대한과실", target: "B", adj: 20 }
    ]
  }
];

// ============================================================================
// Modifier type definitions reference (수정요소 유형 참조)
// ============================================================================
// 현저한과실: 한눈팔기, 음주(0.03%미만), 제한속도10km/h이내초과, 휴대전화사용
// 중대한과실: 음주(0.03%이상), 무면허, 졸음운전, 제한속도20km/h초과, 마약운전
// 교차로정체중진입: 교차로 내 정체 중 무리하게 진입
// 소좌회전·대좌회전: 좌회전 방법 위반 (소회전/대회전)
// 대우회전: 우회전 시 크게 돌아 회전
// 명확한선진입: 상대방보다 명확히 먼저 교차로 진입
// 서행불이행: 교차로 진입 시 서행 의무 위반
// 일시정지위반: 일시정지 표지 위반
// 급좌회전: 급격한 좌회전
// 좌회전완료직후: 좌회전 완료 직후 충돌 (감산)
// 진로변경신호불이행: 방향지시등 미사용
// 어린이·노인·장애인: 교통약자 보호 (감산)
// 야간·시야장애: 야간 또는 시야 장애 상황

export { KNIA_ACCIDENT_TYPES };
