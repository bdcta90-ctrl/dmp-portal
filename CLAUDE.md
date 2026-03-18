# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 1. Project Overview

**DMP (Deny MVP Portal)** — React 18 + Vite rapid prototyping hub by kt ds AX Business Development team. 7 MVP showcases with the primary focus on evolving **자동차 손해사정 의사결정 지원 포털** (Auto Claims Assessment Decision Support Portal).

**Project Direction:**
- DB 없이 MVP 진행 (JSON-LD 온톨로지 + IndexedDB + Web Worker 계획)
- 프론트/백엔드 분리 예정
- 10만건+ 대용량 처리 가능하게 전환
- 예외처리 강화 + 고객 편의성 개선

**Requirements:** Node.js 18+

## 2. Commands

```bash
npm install           # Install dependencies (first time)
npm run dev           # Start dev server (port 5173, auto-opens browser)
npm run build         # Production build to dist/
npm run preview       # Preview production build locally
```

No tests, linting, or formatting tools configured.

## 3. File Structure

```
src/
├── App.jsx                    (504줄 — 포털 메인: 라우팅, 테마(dark/light/pro), MVP 카드 7개, 의뢰 모달)
├── ClaimsAgentNew.jsx         (7,018줄 — 핵심 손해사정 포털: 10 UC, 49 Rules, 6탭, 10 DB)
├── SecurityDashboard.jsx      (2,144줄 — 내부정보유출 위험자 식별: 3탭, 실시간 이벤트)
├── StockPilot.jsx             (566줄 — 통합 자산관리: 주식/부동산/자동차/지출)
├── AIFirewall.jsx             (695줄 — AI 방화벽: AI 오남용 방지, 위협 탐지)
├── ClaimsAgent.jsx            (2,987줄 — 최초 버전 백업 — 수정 불필요)
├── App_back.jsx               (백업)
├── ClaimsAgent_back.jsx       (백업)
├── claims-constants.js        (2,119줄 — 수리방법 12종, 연쇄손상 88부위→801체인, 차종배율 12단계)
├── knia-accident-types.js     (6,367줄 — KNIA 과실비율 401건, 4단계 계층)
├── explorer-data.js           (137줄 — DB탐색기 빌더: build*Rows(), *_HEADERS, RULE_SUMMARIES)
├── main.jsx                   (9줄 — 엔트리포인트)
├── ontology/                  (JSON-LD 스키마 7파일 + ARCHITECTURE.md)
│   ├── claims-ontology.jsonld (공유 @context)
│   ├── schema-vehicle.jsonld  (차량/부품)
│   ├── schema-damage.jsonld   (손상/인과체인)
│   ├── schema-accident.jsonld (KNIA 사고유형)
│   ├── schema-rules.jsonld    (규칙 관계)
│   ├── schema-costs.jsonld    (비용/감가)
│   └── schema-injury.jsonld   (상해등급/보상)
public/
├── data/
│   ├── vehicle.json           (60,329건, 7MB — 차량 DB)
│   ├── parts.json             (48,637건, 15MB — 부품 DB)
│   ├── service.json           (7,846건, 3.7MB — 서비스센터 DB)
│   └── rental.json            (2,015건, 1MB — 렌터카 DB)
├── korea-jobs.html            (195KB — 대한민국 취업시장 시각화, iframe으로 로드)
api/
└── sheets.js                  (Vercel serverless — Google Sheets webhook)
```

## 4. Architecture

**SPA with no routing library.** `App.jsx` manages navigation via `useState` (`page` state). Every MVP component receives an `onBack` prop for portal return. Theme is NOT passed to children — each MVP manages its own styling independently.

**Key Patterns:**
- **No CSS files** — inline `style` props + injected `<style>` tags. Portal themes via `THEMES` object (dark/light/pro).
- **No state management library** — pure `useState`/`useEffect` hooks.
- **No database** — JSON files in `public/data/`, hardcoded constants, `localStorage` (StockPilot key: `stockpilot-v3`).
- **Components are large** — `ClaimsAgentNew.jsx` is 7,018 lines. Search by function name, not scrolling.
- **Backup files** (`*_back.jsx`) — manual version snapshots. Don't delete.
- **Deployment**: Vercel (serverless). `api/sheets.js` uses Vercel function signature.

**Dependencies:** `react`, `react-dom`, `recharts` (charts), `xlsx` (Excel export), `pdf-parse`, `pdf2json`

## 5. File Dependencies

```
claims-constants.js
  exports: REPAIR_METHODS (12), DAMAGE_CHAINS (88→801), VEHICLE_CLASS_MULTIPLIERS (12 tiers)
     ↓ imported by
explorer-data.js
  imports: KNIA_ACCIDENT_TYPES from knia-accident-types.js
  imports: REPAIR_METHODS, DAMAGE_CHAINS, VEHICLE_CLASS_MULTIPLIERS from claims-constants.js
  exports: build*Rows() (5 functions), *_HEADERS (5 arrays), buildOntologyRuleRows(), RULE_SUMMARIES
     ↓ imported by
ClaimsAgentNew.jsx
  imports: explorer-data.js → all build*Rows, all *_HEADERS
  imports: knia-accident-types.js → KNIA_ACCIDENT_TYPES (used in buildContextFromCase)
  imports: claims-constants.js → REPAIR_METHODS, DAMAGE_CHAINS, VEHICLE_CLASS_MULTIPLIERS

App.jsx
  imports: ClaimsAgent.jsx, ClaimsAgentNew.jsx, SecurityDashboard.jsx, AIFirewall.jsx, StockPilot.jsx
```

## 6. ClaimsAgentNew.jsx — Core Architecture

### 10 Use Cases (UC1~UC10)

| UC | 시나리오 | A차 | B차 | 핵심 규칙 |
|----|---------|-----|-----|----------|
| UC1 | 교차로 골목길 충돌 (50:50) | 현대 그랜저 | BMW 7시리즈 | R04,R07,R10,R12,R13 |
| UC2 | 주차장 신차 충돌 (100% 자사과실) | 현대 그랜저 | GV80 신차 | R03,R07,R09,R11 |
| UC3 | 차선변경 과실 분쟁 (85:15) | 현대 그랜저 | BMW 5시리즈 | R04,R10,R13 |
| UC4 | 음주+12대중과실+무보험 | 기아 K5 | 현대 투싼 | R05,R08,R21 |
| UC5 | 렌터카 영업차량 휴차료 | 현대 쏘나타 | 기아 스포티지 | R17 |
| UC6 | 3중추돌 A→B→C | 현대 그랜저 | 기아 K8 (+C차) | R16,R13 |
| UC7 | 전손+잔존물+할부 (모하비 전복) | 기아 모하비 | 가드레일 | R02,R18,R19 |
| UC8 | 사망+유족 다수 (9인승 vs 트럭) | 현대 스타리아 | 대형 트럭 | R25,R24,R12 |
| UC9 | 보험사기 패턴 (반복접수) | BMW 5시리즈 | 현대 아반떼 | R20 |
| UC10 | 태풍 침수+청구시효 | 제네시스 G80 | 자연재해 | R22,R23 |

**모든 UC에 대해 구현 완료:**
- `buildContextFromCase()`: 10개 UC 프리셋 컨텍스트
- `CASE_CARS`: 10개 UC × A/B 차량 (UC6은 C차 포함) — 차량정보 + 파손부위 + AI감지 프리셋
- `ESTIMATE_RESPONSES`: 10개 UC 견적 하드코딩 응답
- `PROCESS_RESPONSES`: 10개 UC × 4 시나리오(최적/공격/안전/전략) 하드코딩 응답
- `CASE_SCENARIOS`: 10개 UC 시나리오 설명 (accident, opponent, issue, focus)

**견적 탭 3-view 구조:**
- UC1: 타사(UC1_ESTIMATE_RESPONSE) / 자사(UC1_ESTIMATE_SELF) / 보험사총지출(UC1_ESTIMATE_TOTAL) — 3뷰 전부 하드코딩
- UC2: 타사(UC_ESTIMATE_RESPONSE) / 자사(UC_ESTIMATE_SELF) / 보험사총지출(UC_ESTIMATE_TOTAL) — 3뷰 전부 하드코딩
- UC3~UC10: 타사 견적만 하드코딩 (UC3_ESTIMATE_RESPONSE ~ UC10_ESTIMATE_RESPONSE), 자사/총지출은 타사와 동일 텍스트 출력

### 49 Rules (R01~R49, 전부 구현 완료)

**P0 (중단/치명):** R05(음주면책), R06(무면허), R08(12대중과실), R20(사기탐지), R23(소멸시효), R25(사망사고)
**P1 (필수):** R01(경상진단서), R02(전손판정), R04(과실자동산정), R12(대인한도), R16(다중차량), R17(영업손실), R19(대출우선), R21(무보험), R24(다수피해자), R32(위자료), R33(휴업손해), R34(후유장해), R36(개별대인), R39(중대과실가산), R40(보행자특례), R43(분쟁심의), R47(대인Ⅱ초과)
**P2 (중요):** R03(인증부품), R07(렌탈동급), R09(자기부담금), R11(신차감가), R13(과실상계), R14(탑승자감액), R26(ADAS캘리), R27(수리방법선택), R28(경미복원), R29(연쇄손상), R35(과잉진료), R37(향후치료비), R38(현저과실가산), R42(미수선현금), R44(구상권), R48(자기신체특약)
**P3 (참고):** R10(수입차배율), R15(지급기한), R30(수입차부품수급), R31(주행거리감가), R41(증거보정), R45(합의서생성), R46(소송비예측), R49(긴급출동)

### 6-Tab UI

| Tab | 이름 | 색상 | AI 호출 | 핵심 기능 |
|-----|------|------|---------|----------|
| 0 | 견적 산정 | #0891b2 | callAI 1회 | 차량+파손+사진→견적+AI분석+온톨로지체인, 3-view(타사/자사/총지출) |
| 1 | 대인 피해 | #dc2626 | callAI 1회 | 자유형 텍스트→상해등급+합의금+AI분석 |
| 2 | 과실 산정 | #7c3aed | callAI 1회 | 사고유형+도로+날씨+신호+진술+증거→과실율+AI리포트 |
| 3 | 처리 방법 | #059669 | callAI 4회 | 요약JSON+분석MD+4시나리오JSON+상담스크립트 |
| 4 | KPI 관리 | #f59e0b | 없음 | 배당유입(15초갱신), 절감실적, 팀현황, 리포트테이블 |
| 5 | 데이터 뷰어 | #6366f1 | 없음 | 10개DB(explorer)+데이터구조맵+온톨로지시각화 |

### 10 Embedded DBs (Tab 5)

| DB | 행수 | 소스 |
|----|------|------|
| 차량DB | 60,329 | vehicle.json |
| 서비스센터DB | 7,846 | service.json |
| 렌터카DB | 2,015 | rental.json |
| 부품DB | 48,637 | parts.json |
| 약관기준DB | 75 | 인라인 |
| 추론규칙DB | 49 | ONTOLOGY.rules |
| 사고유형DB | 401 | KNIA_ACCIDENT_TYPES |
| 수리방법DB | 12 | REPAIR_METHODS |
| 연쇄손상DB | 801 | DAMAGE_CHAINS |
| 차종배율DB | 12 | VEHICLE_CLASS_MULTIPLIERS.tiers |

### Inference Pipeline

```
[1] 사용자 입력 (차량/파손/사고유형/진술/증거)
     ↓
[2] buildContextFromCase(useCase, extraData)
     → 10개 UC 프리셋 + 사용자 오버라이드 병합
     ↓
[3] runOntologyInference(context)
     → 49규칙 priority 정렬 → 조건 평가 → 매칭 시 then() 실행
     → {results[], chain[], rulesFired, rulesEvaluated, timestamp}
     ↓
[4] ontoSummary = results.map("[flag] msg").join("\n")
     ↓
[5] callAI(systemPrompt + ontoSummary, userMessage)
     → Claude Sonnet 4 (claude-sonnet-4-20250514, max 1000토큰)
     → 실패 시 generateFallback() → 템플릿 응답
     ↓
[6] UI 렌더링 (견적카드 + AI리포트 + 온톨로지체인 + 시나리오)
```

## 7. Data Constants Detail

### claims-constants.js (2,119줄)

**REPAIR_METHODS** — 12종 수리방법:
교환, 판금, 도장, 탈착, 복원수리, 캘리브레이션, PDR(무도장덴트), 유리보수, 용접, 광택/컴파운딩, 랩핑/필름, ECU코딩/프로그래밍

Each entry fields: `id`, `name`, `nameEn`, `desc`, `applicableMaterials[]`, `severityRange[]`, `costMultiplier`, `laborType`, `includesPaint`, `sot`

**DAMAGE_CHAINS** — 88개 출발부위 → 801개 체인 엔트리:
각 부위별 `chain: [{target, probability, minSeverity}]` 구조. 1차 파손→2차/3차 연쇄손상 확률과 전파 심각도.

**VEHICLE_CLASS_MULTIPLIERS:**
- `tiers[]` — 12단계: 국산경차(0.75) → 국산일반(1.0) → 국산대형(1.15) → 국산프리미엄(1.3) → 수입이코노미(1.4) → 수입일반(1.6) → 수입중급(2.0) → EV프리미엄(2.5) → 수입프리미엄(2.8) → 슈퍼카엔트리(3.5) → 슈퍼카일반(5.0) → 슈퍼카울트라(8.0)
- `modelOverrides{}` — 전 브랜드 전 모델 ~400+ 오버라이드 매핑 (현대/기아/제네시스/BMW/벤츠/아우디/테슬라 등)
- `paintMultiplier{}` — 등급별 도장 배율
- `supplyTimeDays{}` — 등급별 부품 수급 기간

### knia-accident-types.js (6,367줄)

**KNIA_ACCIDENT_TYPES** — 401건:
4단계 계층: `cat1`(차대차/차대사람/차대이륜차/차대자전거) → `cat2`(교차로/대향차/동일방향 등) → `cat3`(양쪽신호/비신호 등) → `label`(구체 상황)

Each entry: `{id, cat1, cat2, cat3, label, faultA, faultB, modifiers[]}`
Modifier: `{type, target, adj}` — "현저한과실", "중대한과실" 등

## 8. UC Response Constants

```
ESTIMATE_RESPONSES: {
  uc1: UC1_ESTIMATE_RESPONSE,  // 타사 BMW 7 견적
  uc2: UC_ESTIMATE_RESPONSE,   // 타사 GV80 견적
  uc3: UC3_ESTIMATE_RESPONSE,  // 타사 BMW 5 견적
  ...uc4~uc10 각각 별도 상수
}

// UC1/UC2만 3-view 하드코딩 (자사/타사/보험사총지출)
UC1_ESTIMATE_SELF, UC1_ESTIMATE_TOTAL  // UC1 자사/총지출
UC_ESTIMATE_SELF, UC_ESTIMATE_TOTAL    // UC2 자사/총지출

PROCESS_RESPONSES: {
  uc1: UC_PROCESS_RESPONSE,
  uc2: UC2_PROCESS_RESPONSE,
  uc3: UC3_PROCESS_RESPONSE,
  ...uc4~uc10 각각 별도 상수
}
```

**처리방법 응답 구조 (전 UC 동일):**
- 4개 시나리오: 최적안, 공격안, 안전안, 전략안 (`strategic: true`)
- 각 시나리오: `title`, `subtitle`, `cost`, `period`, `satisfaction`, `actions[]`(6개), `pros[]`, `cons[]`, `savingNote`, `recommended`
- UC1~3: 추가로 `*_PROCESS_SUMMARY`, `*_PROCESS_AI_ANALYSIS`, `*_PROCESS_BASELINE`, `*_COST_DETAIL` 하드코딩
- UC4~10: 요약/분석은 AI 동적 호출, PROCESS_RESPONSES만 하드코딩

## 9. How-To Guides

### How to add UC11

1. `buildContextFromCase()` (line ~1764) — `uc11:{accidentType, vehicleA, vehicleB, faultA, faultB, ...}` 추가
2. `CASE_CARS` (line ~3280) — `uc11:{a:{origin,mk,md,yr,ml,sp[],sv,ai:{}}, b:{...}}` 추가
3. `DAMAGE_CONFIGS` — `uc11_a`, `uc11_b` 파손 다이어그램 설정 추가
4. `UC11_ESTIMATE_RESPONSE` 상수 생성 (마크다운 견적 리포트)
5. `ESTIMATE_RESPONSES` 맵에 `uc11: UC11_ESTIMATE_RESPONSE` 추가 (line ~3556)
6. `UC11_PROCESS_RESPONSE` 상수 생성 (4시나리오 JSON 문자열)
7. `PROCESS_RESPONSES` 맵에 `uc11: UC11_PROCESS_RESPONSE` 추가 (line ~4843)
8. `CASE_SCENARIOS` (line ~3501) — `uc11:{accident, opponent, issue, focus}` 추가
9. (선택) UC1/2처럼 3-view 지원 시: `UC11_ESTIMATE_SELF`, `UC11_ESTIMATE_TOTAL` 생성 + vehTab 분기 추가

### How to add Rule R50

1. `ONTOLOGY.rules` 배열 (line ~1533) — 새 규칙 객체 추가:
   ```js
   {id:"R50", name:"규칙명", cat:"견적|대인|과실|처리|보험", priority:0-3,
    condition:(ctx)=> /* boolean */, then:(ctx)=> /* {flag,msg} */}
   ```
2. `RULE_SUMMARIES` in `explorer-data.js` (line ~71) — `R50:{cond:"조건 요약", result:"결과 요약", clause:"관련 조항"}` 추가
3. 규칙 충돌 확인: 같은 cat/priority의 기존 규칙과 condition 중복 체크

### How to add a Repair Method

1. `REPAIR_METHODS` 배열 (claims-constants.js) — 새 객체 추가:
   ```js
   {id:"new_method", name:"방법명", nameEn:"English", desc:"설명",
    applicableMaterials:["metal","plastic","glass","electronic","rubber","fabric"],
    severityRange:["경미","중간","심각","전손"], costMultiplier:0.5,
    laborType:"공임유형", includesPaint:false, sot:1.0}
   ```
2. `buildRepairMethodRows()` in explorer-data.js — 자동 반영 (no change needed)

### How to add KNIA Accident Type

1. `KNIA_ACCIDENT_TYPES` 배열 (knia-accident-types.js) — 새 엔트리 추가:
   ```js
   {id:"차X-Y", cat1:"차대차", cat2:"교차로", cat3:"양쪽신호",
    label:"상황 설명", faultA:30, faultB:70,
    modifiers:[{type:"현저한과실", target:"A", adj:10}, ...]}
   ```
2. `buildAccidentTypeRows()` in explorer-data.js — 자동 반영

### How to add DB Explorer Tab

1. `explorer-data.js` — `buildNewRows()` 함수 + `NEW_HEADERS` 배열 export
2. `ClaimsAgentNew.jsx`:
   - `DK` 배열 (line ~6141) — `"새DB이름"` 추가
   - `DATASETS` 에 `"새DB이름":{title, icon, total, stats, headers, sample}` 추가 (line ~6149 패턴 참조)

## 10. State Management

### Key State Variables (ClaimsAgentNew.jsx)

| 변수 | 타입 | 용도 |
|------|------|------|
| `useCase` | `null\|"uc1"~"uc10"` | 현재 선택된 UC |
| `tab` | `0~5` | 메인 탭 (견적/대인/과실/처리/KPI/데이터) |
| `dmgTab` | `0\|1\|2` | 자사(0)/타사(1)/C차(2) — 파손 다이어그램 + 차량정보 전환 |
| `vehTab` | `0\|1\|2` | AI분석 3-view: 타사견적(0)/자사견적(1)/보험사총지출(2) |
| `flow` | `[bool,bool,bool,bool]` | Tab 0~3 완료 추적 |
| `scenarioOpen` | `bool` | 시나리오 설명 모달 |
| `stage` | `string` | 처리방법탭 진행단계: idle→intake-loading→intake-qa→loading→result→detail |
| `mk, md, yr, ml` | `string` | 제조사, 모델, 연식, 주행거리 |
| `sp, sv` | `array, string` | 파손부위 배열, 심각도 |
| `ph` | `array` | 업로드된 사진 배열 |
| `at` | `number` | 사고유형 인덱스 |
| `tA` | `string` | AI 분석 결과 텍스트 |

**dmgTab 전환 시 동작:** `useEffect`에서 dmgTab 값에 따라 CASE_CARS의 a/b/c 데이터를 mk, md, yr, ml, sp, sv에 자동 로드.

## 11. API Integration

**callAI()** (line ~2058):
- Endpoint: `https://api.anthropic.com/v1/messages`
- Model: `claude-sonnet-4-20250514`
- max_tokens: 1000
- Fallback: `generateFallback()` — 템플릿 응답
- **API 키가 클라이언트에 노출됨** — 백엔드 분리 시 반드시 이동

**Proxy (vite.config.js):**
- `/api/yahoo` → Yahoo Finance API
- `/api/upbit` → Upbit cryptocurrency API

**Serverless:** `api/sheets.js` → Google Sheets webhook (MVP 의뢰 저장)

## 12. Ontology & Knowledge Graph Plan

### 스키마 파일 (src/ontology/)

| 파일 | 용도 | 갱신 주기 |
|------|------|----------|
| `claims-ontology.jsonld` | 공유 @context (schema.org + SKOS + dmp:) | 스키마 변경 시 |
| `schema-vehicle.jsonld` | 차량/부품 분류, 부위 관계 | 신차/부품 추가 시 |
| `schema-damage.jsonld` | 손상 평가, 인과 체인, 전파 확률 | 인과 관계 발견 시 |
| `schema-accident.jsonld` | KNIA 사고유형 트리 + 과실비율 + 수정요소 | KNIA 개정 (~2~3년) |
| `schema-rules.jsonld` | 49개 규칙 + conflictsWith/overrides/dependsOn | 규칙 추가/변경 시 |
| `schema-costs.jsonld` | 분기별 가격, 공임표, 감가 테이블 | **분기별** |
| `schema-injury.jsonld` | 상해 등급, 보상 한도, 정산 범위 | 법규 개정 시 |

### 계획된 파이프라인

```
[1] src/ontology/*.jsonld → [2] registry.js (Map<@id,node>) → [3] knowledgeGraph.js (방향 그래프)
     → [4] inferenceEngine.js (49규칙 + 충돌 해결) → [5] UI 컴포넌트
```

현재는 ONTOLOGY.rules가 ClaimsAgentNew.jsx 인라인으로 정의됨. 온톨로지 전환 시 레지스트리 기반으로 이동 예정.

### 데이터 추가 시 체크리스트

| 작업 | 수정 파일 |
|------|----------|
| 신규 차량/모델 | `schema-vehicle.jsonld` + `claims-constants.js`(modelOverrides) |
| 신규 부위 | `schema-vehicle.jsonld` + `schema-damage.jsonld` + `schema-costs.jsonld` |
| 신규 사고유형 | `schema-accident.jsonld` + `knia-accident-types.js` |
| 신규 규칙 | `schema-rules.jsonld` + `ClaimsAgentNew.jsx`(ONTOLOGY.rules) + `explorer-data.js`(RULE_SUMMARIES) |
| 가격 변경 | `schema-costs.jsonld` |

## 13. External Data Integration

**9개 외부 데이터 소스 (EXT_DATA_SOURCES):**

연동 완료 (6): 차량가액(BIGIN), 보험통계(KIDI), 종합정보(인슈넷), 과실비율(KNIA), 인증부품(KAPA), OEM부품(현대/기아 순정)
준비중 (3): 카히스토리, KNIA 450도표 구조화, CODEF(보험계약정보)

**정적 임베딩 가능 (API 불필요):** 과실비율 401도표, 사고유형 분류, 차량 부품 카탈로그
**수동 입력 필요 (라이선스):** 차량기준가액(KIDI, 5회/일), 수리비/표준공임(AOS, 기관전용), 부품가격(KAPA, API 없음)

## 14. SecurityDashboard Architecture

**3탭 구조:**
- 실시간 감시: 이벤트 스트림(3초 간격 생성), 위험도 점수, AI 의도 추론, 11개 조치 가이드
- 데이터 뷰어: 자산/직원/컴플라이언스 테이블
- 지식 그래프: 관계 시각화

**데이터:** 1,800명 임직원 프로필(부서, 직급, 보안등급, 고용형태, 입사일, 상급자), 25개 자산, 31개 컴플라이언스 항목, 11개 조치 가이드(이상행위확인→HR연계→CISO보고 등)

**이벤트 생성:** `generateEvent()` — 직원+행위유형+자산 조합, 위험도 점수(0~100) 동적 산출, 근무시간 외/주말/역할 불일치/반복 행위 가중, 복합 위협 탐지

## 15. Portal Showcases

| MVP | ID | 상태 | 비고 |
|-----|-----|------|------|
| 내부 정보 유출 위험자 식별 | security | Live | SecurityDashboard.jsx |
| StockPilot 통합 자산관리 | stockpilot | Live | StockPilot.jsx |
| AI 자동차 손해사정 Agent | claims | 준비중 | ClaimsAgent.jsx (최초버전) |
| AI 방화벽 | firewall | Live | AIFirewall.jsx |
| AI 자동차 손해사정 (New) | claimsNew | Live | ClaimsAgentNew.jsx |
| AI 자동차 손해사정 (시연버전) | claimsNewBackup | Live | ClaimsAgentNew.jsx 동일 컴포넌트 |
| 대한민국 취업시장 | koreaJobs | Live | public/korea-jobs.html (iframe) |

### Adding a New MVP

1. Create component in `src/` with `onBack` prop
2. Add entry to `MVPS` array in `App.jsx` (id, category, title, desc, tags, status, gradient, border)
3. Add import statement at top of `App.jsx`
4. Add routing condition: `if (page === "id") return <Component onBack={() => setPage("portal")} />`
5. Add id to `isClickable` condition in card renderer (line ~421)
