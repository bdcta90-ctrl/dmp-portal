// ============================================================================
// Explorer Data - generates table data for extended DB Explorer tabs
// ============================================================================
import { KNIA_ACCIDENT_TYPES } from "./knia-accident-types.js";
import { REPAIR_METHODS, DAMAGE_CHAINS, VEHICLE_CLASS_MULTIPLIERS } from "./claims-constants.js";

// ── 사고유형DB: KNIA 과실비율 인정기준 ──
export function buildAccidentTypeRows() {
  return KNIA_ACCIDENT_TYPES.map(t => [
    t.id,
    t.cat1 || "",
    t.cat2 || "",
    t.cat3 || "",
    t.label || "",
    String(t.faultA),
    String(t.faultB)
  ]);
}
export const ACCIDENT_TYPE_HEADERS = ["도표번호","대분류","중분류","소분류","설명","A과실","B과실"];

// ── 수리방법DB ──
export function buildRepairMethodRows() {
  return REPAIR_METHODS.map(m => [
    m.id,
    m.name,
    m.desc,
    (m.applicableMaterials || []).join(", "),
    (m.severityRange || []).join(", "),
    String(m.costMultiplier),
    m.laborType || ""
  ]);
}
export const REPAIR_METHOD_HEADERS = ["ID","수리방법","설명","적용소재","심각도범위","배수","공임유형"];

// ── 연쇄손상DB: flatten DAMAGE_CHAINS ──
export function buildDamageChainRows() {
  const rows = [];
  for (const [source, data] of Object.entries(DAMAGE_CHAINS)) {
    if (data && data.chain) {
      for (const c of data.chain) {
        rows.push([
          source,
          c.target,
          String(c.probability),
          c.minSeverity || ""
        ]);
      }
    }
  }
  return rows;
}
export const DAMAGE_CHAIN_HEADERS = ["출발부위","대상부위","확률","최소심각도"];

// ── 차종배율DB ──
export function buildVehicleClassRows() {
  const pm = VEHICLE_CLASS_MULTIPLIERS.paintMultiplier || {};
  const sd = VEHICLE_CLASS_MULTIPLIERS.supplyTimeDays || {};
  return (VEHICLE_CLASS_MULTIPLIERS.tiers || []).map(t => [
    t.id,
    t.label,
    String(t.partsMult),
    String(t.laborRate?.toLocaleString() || ""),
    String(pm[t.id] ?? ""),
    String(sd[t.id] ?? "")
  ]);
}
export const VEHICLE_CLASS_HEADERS = ["등급","라벨","부품배율","시간당공임","도장배율","부품수급(일)"];

// ── 추론규칙DB: ONTOLOGY.rules를 테이블 행으로 변환 ──
// condition/then은 함수이므로 요약 문자열 맵 사용
const RULE_SUMMARIES = {
  R01:{cond:"경상(12~14급) + 치료 28일 초과",result:"진단서 제출 의무 안내",clause:"보통약관 별표1"},
  R02:{cond:"수리비 >= 차량가액 80%",result:"전부손해 판정",clause:"보통약관 제24조"},
  R03:{cond:"품질인증부품 사용 + 비경미손상",result:"OEM 25% 인센티브",clause:"2025.08.16 개정"},
  R04:{cond:"사고유형 존재",result:"기본과실 자동 산정",clause:"별표3 과실상계"},
  R05:{cond:"음주운전",result:"자차 면책 + 부담금 10~20%",clause:"보통약관 제11조"},
  R06:{cond:"무면허",result:"자차 면책 + 부담금 20%",clause:"보통약관 제11조"},
  R07:{cond:"렌트등급 > 차량등급",result:"동종동급 위반 정정",clause:"대법원 동종동급"},
  R08:{cond:"12대 중과실 해당",result:"형사처벌 면제 불가",clause:"교통사고처리특례법"},
  R09:{cond:"자차손해 + 손해액 > 0",result:"자기부담금 산출 (20%, 20~50만)",clause:"보통약관 제24조"},
  R10:{cond:"수입차",result:"부품 배수 적용 (×1.6~3.0)",clause:"업계 관행"},
  R11:{cond:"출고 6개월 이내 + 심각 파손",result:"감가 청구 대비 (10~15%)",clause:"대법원 판례"},
  R12:{cond:"상해등급 1~14급",result:"대인Ⅰ 한도 조회",clause:"자배법 시행령 별표1"},
  R13:{cond:"쌍방 과실 + 타사 손해 존재",result:"과실상계 계산",clause:"별표3 과실상계"},
  R14:{cond:"동승자 유형 ≠ 업무",result:"동승자 감액 적용",clause:"별표5 감액비율표"},
  R15:{cond:"보험금 청구 접수",result:"10일 이내 지급 결정 의무",clause:"보통약관 제35조"},
  R16:{cond:"3대 이상 다중차량",result:"각 차량별 과실 배분",clause:"별표3 다중사고"},
  R17:{cond:"영업용 차량",result:"휴차료 산정 (렌트 대체)",clause:"대법원 판례"},
  R18:{cond:"전부손해 확정",result:"잔존물 가치 산정 (~8%)",clause:"보통약관 제24조"},
  R19:{cond:"할부/리스 잔여채무",result:"보상금 우선변제",clause:"보통약관 제37조"},
  R20:{cond:"사기 스코어 ≥ 60",result:"SIU 의뢰 (서킷브레이커)",clause:"보험사기방지특별법"},
  R21:{cond:"상대방 무보험",result:"정부보장사업 연계",clause:"자배법 제30조"},
  R22:{cond:"침수 차량",result:"전손 특례 검토",clause:"업계 관행"},
  R23:{cond:"사고 후 365일 초과",result:"청구 시효 확인 (3년)",clause:"상법 제662조"},
  R24:{cond:"피해자 3명+ 다등급",result:"복수 피해자 한도 분배",clause:"자배법 시행령 별표1"},
  R25:{cond:"사망 사고",result:"유족 보상 분배",clause:"자배법 시행령 별표1"},
  R26:{cond:"ADAS 부위 수리/교환",result:"캘리브레이션 필수",clause:"제조사 정비 매뉴얼"},
  R27:{cond:"심각도 + 파손부위 존재",result:"수리방법 자동 선택",clause:"보험개발원 수리기준"},
  R28:{cond:"경미 손상 + 파손부위",result:"복원수리 3유형 적용",clause:"보험개발원 경미손상"},
  R29:{cond:"중간+ 심각도 + 파손부위",result:"연쇄 손상 자동 추가",clause:"정비 실무 기준"},
  R30:{cond:"수입차 + 비경미",result:"부품 수급 지연 (2~6주)",clause:"업계 실무"},
  R31:{cond:"주행거리 > 0 + 차량연식",result:"주행거리 감가 반영",clause:"보험개발원 차량기준가액"},
  R32:{cond:"상해등급 1~14급",result:"위자료 자동 산정",clause:"대법원 판례"},
  R33:{cond:"치료일수 + 일수입 > 0",result:"휴업손해 산정",clause:"대법원 판례"},
  R34:{cond:"1~5급 + 후유장해율 > 0",result:"후유장해 보상 산정",clause:"대법원 판례"},
  R35:{cond:"10~14급 + 치료일수 > 기준×2",result:"과잉진료 의심",clause:"보통약관 제35조"},
  R36:{cond:"피해자 상세 2명+",result:"개별 대인한도 조회",clause:"자배법 시행령 별표1"},
  R37:{cond:"1~7급 + 수술 이력",result:"향후치료비 예측",clause:"대법원 판례"},
  R38:{cond:"현저한 과실 요소 존재",result:"기본과실 +5~10% 가산",clause:"과실비율 수정요소"},
  R39:{cond:"음주/무면허/졸음/약물/과속",result:"기본과실 +10~20% 가산",clause:"과실비율 수정요소"},
  R40:{cond:"보행자/자전거/횡단보도 사고",result:"차량 과실 가중 (80~100%)",clause:"도로교통법 제27조"},
  R41:{cond:"블랙박스/CCTV 증거 확보",result:"과실 정밀 보정 (±3~10%)",clause:"대법원 증거법칙"},
  R42:{cond:"현금정산 또는 경미+300만이하",result:"미수선 현금정산 (70~80%)",clause:"보통약관 미수선"},
  R43:{cond:"과실 차이 15%p+ 또는 견적 차이 30%+",result:"분쟁심의 회부 권고",clause:"보험업법 제29조"},
  R44:{cond:"타사 과실 > 0 + 지급보험금",result:"구상권 행사 판단",clause:"상법 제682조"},
  R45:{cond:"합의 금액 확정",result:"합의서 자동 생성",clause:"민법 제731조"},
  R46:{cond:"소송 전환 고려",result:"소송 비용 예측",clause:"민사소송법"},
  R47:{cond:"1~5급 + 보상액 > 대인Ⅰ한도",result:"대인Ⅱ 초과 적용",clause:"자배법 대인Ⅱ"},
  R48:{cond:"자차 부상/무보험 상대 + 상해등급",result:"자기신체/무보험차상해 특약",clause:"보통약관 특약"},
  R49:{cond:"견인 필요/심각/전손",result:"긴급출동·견인비용",clause:"보통약관 긴급출동"},
};

export function buildOntologyRuleRows(rules) {
  return rules.map(r => {
    const s = RULE_SUMMARIES[r.id] || {};
    return [
      r.id,
      r.name,
      r.cat || "",
      String(r.priority),
      s.cond || "",
      s.result || "",
      s.clause || ""
    ];
  });
}
export const ONTOLOGY_RULE_HEADERS = ["규칙ID","규칙명","카테고리","우선순위","조건 요약","결과 요약","관련 조항"];
