# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**DMP (Deny MVP Portal)** — A React 18 + Vite rapid prototyping hub by kt ds AX Business Development team. Currently a prototype showcasing 5 MVPs. The primary focus is evolving the **자동차 손해사정 의사결정 지원 포털** (Auto Claims Assessment Decision Support Portal) into a production-ready system.

**Project Direction:**
- DB 없이 MVP 진행 (JSON-LD 온톨로지 + IndexedDB + Web Worker)
- 프론트/백엔드 분리 예정
- 10만건+ 대용량 처리 가능하게 전환
- 예외처리 강화 + 고객 편의성 개선

**Requirements:** Node.js 18+

## Commands

```bash
npm install           # Install dependencies (first time)
npm run dev           # Start dev server (port 5173, auto-opens browser)
npm run build         # Production build to dist/
npm run preview       # Preview production build locally
```

No tests, linting, or formatting tools configured.

## Architecture

**Single-page app with no routing library.** `App.jsx` manages all navigation via `useState` (`page` state). Every MVP component receives an `onBack` prop for navigation back to the portal. Theme is NOT passed to child components — each MVP manages its own styling independently.

### MVP Components (self-contained monolithic files in `src/`):

| Component | Domain |
|-----------|--------|
| `SecurityDashboard.jsx` | Employee behavior monitoring & insider threat detection |
| `StockPilot.jsx` | Integrated asset management (stocks, real estate, auto, expenses) |
| `ClaimsAgent.jsx` | 최초 버전 백업용 — 수정 불필요 |
| `ClaimsAgentNew.jsx` | 손해사정 의사결정 지원 포털 — **핵심 개발 대상** (10 cases, 25 rules) |
| `AIFirewall.jsx` | AI tool usage firewall & threat detection |

### Key Patterns

- **No CSS files** — all styling is inline `style` props + injected `<style>` tags. Theme colors from `THEMES` object in `App.jsx` (dark/light/pro).
- **No state management library** — pure `useState`/`useEffect` hooks.
- **No database** — mock/client-side data. `StockPilot` uses `localStorage` (key: `stockpilot-v3`).
- **Components are large** — `ClaimsAgentNew.jsx` is ~5700 lines. Search by function name, not scrolling.
- **Backup files** (`*_back.jsx`) — manual version snapshots. Don't delete them.
- **Deployment**: Vercel (serverless). `api/sheets.js` uses Vercel function signature (`export default async function handler(req, res)`).
- **Hardcoded URLs**: Google Sheets webhook URL in `api/sheets.js` — do not accidentally modify.

### External API Integration

Configured in `vite.config.js` as dev server proxies:
- `/api/yahoo` → Yahoo Finance API
- `/api/upbit` → Upbit cryptocurrency API
- `api/sheets.js` — Vercel serverless function for Google Sheets webhook

### Adding a New MVP

1. Create component file in `src/` with `onBack` prop
2. Add entry to `MVPS` array in `App.jsx` (id, category, title, desc, tags, etc.)
3. Add routing condition in `App()`: `if (page === "id") return <Component onBack={() => setPage("portal")} />`

### Dependencies

Runtime: `react`, `react-dom`, `recharts` (charts), `xlsx` (Excel export)

---

## ClaimsAgentNew.jsx — 핵심 아키텍처

이 파일이 프로젝트의 핵심. 수정 시 반드시 아래 구조를 이해해야 함.

### 10 Use Cases (UC1~UC10)

| UC | 시나리오 | 구현 수준 | 핵심 규칙 | 빠진 필드 |
|----|---------|----------|----------|----------|
| UC1 | 교차로 골목길 충돌 (그랜저 vs BMW 7) | 풀 구현 (CASE_CARS + 데모 응답) | R04,R07,R10,R12,R13 | - |
| UC2 | 주차장 신차 충돌 (100% 자기과실, GV80 신차) | 풀 구현 (**하드코딩 응답**) | R03,R07,R09,R11 | - |
| UC3 | 차선변경 과실 분쟁 (85:15) | 풀 구현 | R04,R10,R13 | - |
| UC4 | 음주+12대중과실+무보험 (K5 vs 투싼) | 컨텍스트만 (AI 동적) | R05,R08,R21 | `majorFaultType`, `BAC` |
| UC5 | 렌터카 영업차량 휴차료 (쏘나타) | 컨텍스트만 | R17 | `operationalRate` |
| UC6 | 3중추돌 A→B→C (그랜저→K8→?) | 컨텍스트만 | R16,R13 | **vehicleC**, `faultC`, `multipleInjuryGrades` |
| UC7 | 전손+잔존물+할부 (모하비 전복) | 컨텍스트만 (가장 완성도 높음) | R02→R18→R19 연쇄 | `loanHolderName` |
| UC8 | 사망+유족 다수 (스타리아 vs 트럭) | 컨텍스트만 | R25,R24,R12 | **`claimantDetails[]`** (6명 개별등급 없음) |
| UC9 | 보험사기 패턴 (BMW 5 반복접수) | 컨텍스트만 | R20 (P0 서킷브레이커) | **`fraudPatterns` 비구조화** (텍스트만) |
| UC10 | 태풍 침수+청구시효 (G80) | 컨텍스트만 | R22,R23 | `accidentDate` (시효 하드코딩), `floodInsuranceActive` |

**UC1~3 vs UC4~10 구조적 차이:**
- UC1~3: CASE_CARS(A/B 차량 프리셋 + 파손부위 + AI감지) + 데모 응답 템플릿 + Tab별 특화 → 오프라인 데모 가능
- UC4~10: `buildContextFromCase()` 컨텍스트만 → CASE_CARS 없음, 데모 응답 없음, 100% AI API 의존 → 오프라인 불가
- UC4~10은 vehicleA 문자열 파싱(`"현대 스타리아(9인승)".split(" ")`)에 의존 → 손상 다이어그램 불가

**UC4~10 보강 필요 컨텍스트 필드:**

| 필드 | 필요 UC | 용도 | 연관 규칙 |
|------|---------|------|----------|
| `claimantDetails[]` | UC6,UC8 | 피해자별 `{grade, treatDays, type}` 배열 | R01,R12,R14 개별 적용 |
| `passengerType` | UC8 | 동승자 유형 (업무/요청/호의/강요) | R14 감액률 결정 |
| `majorFaultType` | UC4 | 12대 중과실 구체 유형 (신호위반 등) | R08 메시지 |
| `BAC` | UC4 | 혈중알콜농도 수치 | R05 면책 범위 |
| `vehicleC`, `faultC`, `repairCostC` | UC6 | C차 정보 + 과실 + 비용 | R16 6방향 비용 배분 |
| `operationalRate` | UC5 | 영업차량 가동률 | R17 정밀 휴차료 |
| `loanHolderName` | UC7 | 할부 금융사 식별 | R19 우선변제 대상 |
| `accidentDate`, `claimDate` | UC10 | 시효 자동 계산 (현재 `daysSinceAccident` 하드코딩) | R23 |
| `floodInsuranceActive` | UC10 | 침수 특약 가입 여부 | R22 분기 |
| 구조화된 `fraudEvidence{}` | UC9 | `claimHistoryCount`, `sameRepairShop`, `hospitalDelayDays` 등 | R20 패턴 검증 |

### 추론 규칙 (ONTOLOGY Rules)

우선순위 0(치명)~3(낮음)으로 분류. **추론 엔진** (`runOntologyInference`): 우선순위 정렬 → 조건 평가 → 매칭 규칙 실행 → 감사 추적 반환.

#### 기존 25개 규칙 (R01~R25, 구현 완료)

**P0 (중단/치명):** R05(음주면책), R06(무면허), R08(12대중과실), R20(사기탐지), R23(소멸시효), R25(사망사고)
**P1 (필수):** R01(경상진단서), R02(전손판정), R04(과실자동산정), R12(대인한도), R16(다중차량), R17(영업손실), R19(대출우선), R21(무보험), R24(다수피해자)
**P2 (중요):** R03(인증부품), R07(렌탈동급), R09(자기부담금), R11(신차감가), R13(과실상계), R14(탑승자감액)
**P3 (참고):** R10(수입차배율), R15(지급기한)

#### 추가 규칙 (R26~R49, 구현 예정)

**즉시 추가 (현재 UC 결과 품질에 직접 영향):**

| ID | 규칙명 | 도메인 | 우선순위 | 조건 요약 | 결과 요약 |
|----|--------|--------|---------|----------|----------|
| R26 | ADAS 캘리브레이션 필수 | 견적 | P2 | 범퍼/전면유리/미러/헤드라이트 교환 시 | 차종별 ADAS 센서 보정 비용 자동 추가 (₩150K~₩600K) |
| R32 | 위자료 자동 산정 | 대인 | P1 | injuryGrade 존재 + 사망/후유장해/상해 구분 | 등급별 위자료 자동 계산 (INSURANCE_REF.consolation 데이터 연결) |
| R36 | 개별 피해자 대인한도 조회 | 대인 | P1 | claimantDetails[] 존재 + 2명 이상 | 각 피해자별 등급→한도 매핑 + 합계 산출 (R12의 다중 피해자 확장) |
| R38 | 현저한 과실 가산 | 과실 | P2 | 전방주시의무위반/경미음주/제한속도10~20km초과/휴대전화 | KNIA 기준 기본 과실에 +5~10% 가산 |
| R39 | 중대한 과실 가산 | 과실 | P1 | BAC≥0.03%/무면허/졸음/제한속도20km+/약물 | KNIA 기준 기본 과실에 +10~20% 가산. R05/R06과 연계 |
| R42 | 미수선 현금정산 산출 | 처리 | P2 | 고객 희망=현금정산 또는 경미 손상 | 견적의 70~80% 현금 지급 + 향후 수리청구권 소멸 안내 |

**차순 추가 (기능 완성도 향상):**

| ID | 규칙명 | 도메인 | 우선순위 | 조건 요약 | 결과 요약 |
|----|--------|--------|---------|----------|----------|
| R27 | 수리방법 자동 선택 | 견적 | P2 | 부위 + 소재(금속/플라스틱/유리) + 심각도 | 최적 수리방법 추천 (판금/교환/도장) + 비용 차이 30~60% 안내 |
| R29 | 연쇄 손상 자동 추가 | 견적 | P2 | 1차 파손부위 + 심각도 ≥ 중간 | damageChain 기반 2차/3차 손상 부위 + 확률 + 심각도 전이 안내 |
| R33 | 휴업손해 산정 | 대인 | P1 | claimantDetails[].treatDays > 0 + 소득정보 | 일일수입 × 휴업일수 자동 계산 |
| R43 | 분쟁심의 회부 기준 | 처리 | P1 | 과실 차이 ≥ 15% 또는 견적 차이 ≥ 30% | 과실심의위원회/분쟁조정 자동 권고 + 예상 소요기간 |
| R44 | 구상권 행사 판단 | 처리 | P2 | faultB > 0 + 자사 지급 완료 | 타사 구상 청구 금액 = 지급보험금 × 타사과실% |
| R47 | 대인Ⅱ 초과 적용 | 보험 | P1 | 대인Ⅰ 한도 초과 + 대인Ⅱ 가입 | Ⅰ 초과분 → Ⅱ에서 보상 (무한/한정 구분) |

**향후 추가 (프로덕션 전환 시):**

| ID | 규칙명 | 도메인 | 조건 요약 | 결과 요약 |
|----|--------|--------|----------|----------|
| R28 | 경미손상 복원수리 | 견적 | 외판+경미+클리어/베이스/소재 유형 | 3유형 분류 → 교환 대신 복원수리 (₩60K~₩280K) |
| R30 | 수입차 부품 수급 지연 | 견적 | isImport + 교환 수리 | 배송 2~4주 경고 + 렌트 기간 연장 비용 추가 |
| R31 | 주행거리 감가 반영 | 견적 | mileage > 0 | 연식+주행거리 복합 감가율 (현재 연식만 사용) |
| R34 | 후유장해 보상 산정 | 대인 | injuryGrade ≤ 5 | 노동능력상실률 × ₩45M × 라이프니츠 계수 |
| R35 | 과잉진료 의심 | 대인 | 경상(12~14급) + treatDays > 기준×2 | 치료기간 과다 경고 + 자문의 의뢰 권고 |
| R37 | 향후치료비 예측 | 대인 | injuryGrade ≤ 7 + 수술이력 | 재수술 확률 × 예상비용 선산정 |
| R40 | 보행자/자전거 특례 | 과실 | accidentType에 보행자/자전거 | 차량 과실 가중 + 대인Ⅰ 무조건 적용 |
| R41 | 증거 기반 과실 정밀 보정 | 과실 | 블랙박스/CCTV 증거 내용 | 증거 내용 기반 ±3~10% 정밀 보정 |
| R45 | 합의서 자동 생성 | 처리 | 시나리오 확정 + 금액 확정 | 합의서 템플릿 (당사자/금액/면책조항/서명란) |
| R46 | 소송 전환 비용 예측 | 처리 | 분쟁 미해결 + 소송 의사 | 소송비 ₩2~5M + 기간 12~24개월 + 승소확률 |
| R48 | 자기신체/무보험차상해 특약 | 보험 | 자사 운전자/동승자 상해 + 특약 | 자사 피해자 보상 경로 안내 (자손 vs 무보험차상해) |
| R49 | 긴급출동/견인비용 | 보험 | 사고 현장 견인 필요 | 견인비 ₩50K~₩200K + 긴급출동 서비스 안내 |

### 주요 데이터 구조

- **VEHICLE_DB** (30개 제조사, 국산/외산 구분)
- **DAMAGE_CATS** (8카테고리, 70+ 부위)
- **ACCIDENT_TYPES** (20종) — KNIA 249개 도표의 축약판
- **PRICE_PARTS (PP)** — 부위별 `{pt, pc:[min,max], lc:[min,max]}`
- **CASE_CARS** — UC별 A/B 차량 프리셋 데이터
- **INSURANCE_REF** — 삼성화재/현대해상 약관 참조

### 6탭 상세 분석

#### Tab 0: 견적산정

**UI**: 2단 그리드 — 좌(차량정보+사진+파손부위+심각도) / 우(견적카드+AI분석+온톨로지체인)
**상태 변수**: 23개 (`mk`, `md`, `yr`, `ml`, `sp`, `sv`, `ph`, `rs`, `at`, `ontoResult` 등)

**AI/LLM 적용:**
- `callAI()` — Claude Sonnet 4 (`claude-sonnet-4-20250514`, max 1000토큰)로 견적 적정성 분석
- UC2는 `UC_ESTIMATE_RESPONSE` 하드코딩 응답 반환 (AI 호출 건너뜀)
- `autoDetect()` — 사진 파일명 기반 파손 추정 (실제 이미지 CV 아님), JSON 3단계 파싱+정규식 폴백

**온톨로지→추론 흐름:**
```
calc() → buildContextFromCase(uc, {repairCost, severity, isImport...})
       → runOntologyInference(context)
       → ontoSummary 생성 (발동 규칙 텍스트)
       → callAI(system + ontoSummary, userMsg) → 마크다운 리포트
```
주요 발동 규칙: R02(전손판정), R03(인증부품 OEM 25%), R10(수입차 ×1.6), R11(신차감가)

**견적 계산 공식:**
```
배수 = 심각도(0.6/1.0/1.5/2.2) × 차종(1.0/1.6/3.0) × 차령(5년초과 0.85)
부품비 = R(PP[part].p[0], PP[part].p[1]) × 배수  (15개 부위만 PP 정의)
공임비 = R(PP[part].l[0], PP[part].l[1]) × 배수
도장비 = 부위수 × R(60000, 160000) × 배수
차량가액 = 40M × (1 - min((2025-연식)×0.08, 0.6))
```

**모달**: SmsModal (고객안내문자), ReportModal (손해사정일보 — 10개 섹션, 보기/수정/전송)

#### Tab 1: 대인피해

**UI**: 2단 — 좌(자유형 텍스트 입력) / 우(접수자 테이블+AI분석+액션)
**상태 변수**: `input`, `result`, `aiText`, `loading`

**AI/LLM 적용:**
- UC1/2/3: `UC_RESULT`(구조화), `UC_AI_TEXT`(마크다운) 고정 응답
- 나머지 UC: `callAI()`로 동적 분석

**온톨로지 규칙:**
- R01: 경상환자(12~14급) 치료 28일 초과 → 진단서 필수
- R12: 상해등급 → 대인배상Ⅰ 한도 조회 (1급 ₩2억 ~ 14급 ₩1,200만)
- R14: 동승자 감액 (강요100%, 음주동승40%, 요청30%, 호의20%)
- R24: 복수 피해자(3명+) 개별 등급 한도 조회
- R25: 사망사고 유족 분배 (배우자>자녀>부모)

**데이터**: `INSURANCE_REF.injuryGrades` 14등급 한도표 + 위자료 기준 (데이터 존재하나 **UI에서 계산 미사용**)

#### Tab 2: 과실산정

**UI**: 2단 — 좌(사고유형+도로+날씨+신호+진술+증거) / 우(과실율바+근거요인+AI리포트)
**상태 변수**: `at`(사고유형), `rt`, `wt`, `sg`, `mD`(A진술), `oD`(B진술), 증거4종

**AI/LLM 적용:**
- UC3: `UC_FAULT_RESPONSE` 고정 응답
- 나머지: `callAI()`로 판례+협상안 생성
- 진술서 키워드 감정 분석 (유리/불리 키워드 매칭)

**과실율 계산 (8요소 보정):**
```
FAULT_MAP[typeIdx] 기본값 (0~100%, 20개 사고유형별)
+ 도로 보정 (±2~5%)
+ 날씨 보정 (±0~5%)
+ 신호 보정 (±(-12)~5%)
+ 진술 분석 (키워드 기반 ±4~8%)
+ 사진 증거 (장수 기반 ±3~6%)
+ 증거자료 (블랙박스-3, 경찰보고서-2, CCTV-4, 목격자-2)
= 최종 과실율 clamp(0, 100)
```
신뢰도: 증거 3종+파일 2개 이상 → "매우 높음"

**온톨로지 규칙:** R04(사고유형→기본과실 7개 매핑), R13(과실상계 = 타사손해 × 자사과실%)
**모달**: FaultReportModal (10개 섹션 일보, Case 3만)

#### Tab 3: 처리방법

**UI**: 단계별 — idle → intake-loading → intake-qa → loading → result(3카드) → detail
**상태 변수**: `stage`, `summary`, `analysis`, `scenarios`, `custPref`(A/B 고객성향)

**AI/LLM 적용 — 4회 호출 (가장 많은 탭):**
1. 요약 JSON (`업무영역`, `핵심쟁점`, `긴급도`)
2. 분석 마크다운 (사고개요→과실→수리비→렌트→대인→손실시뮬→결론)
3. 3시나리오 JSON (최적안/공격안/안전안 — cost, period, satisfaction, pros, cons)
4. 고객 상담 스크립트 (선택 시나리오 + 고객 성향 반영)

**온톨로지 연동:** 전체 25규칙 평가 → `ontoSummary`를 AI 프롬프트에 포함

**3시나리오 구조 (UC1 기준):**

| 항목 | 최적안 | 공격안 | 안전안 |
|------|--------|--------|--------|
| 과실 | 50:50 합의 | 30:70 관철 | 40:60 양보 |
| 비용 | ₩14.5M | ₩13.6M | ₩16.8M |
| 만족도 | 4.5/5 | 3.5/5 | 4.2/5 |
| 리스크 | 낮음 | 높음 (과실심의) | 낮음 |

**UC_COST_DETAIL**: 시나리오별 항목별 세부 비용 + `repairCompare`(미수선/제휴/공식)

#### Tab 4: KPI

**UI**: 실시간 대시보드 — 배당유입(15초갱신), 절감실적, 팀현황 + 16컬럼 리포트 테이블
**AI 적용**: **없음** — 전체 목업 데이터
**데이터**: 16개 사전정의 리포트(RPT-001~016) + `generateReport()`로 동적 생성
**팀 데이터**: `TEAM` 9명 (센터장1+사정사8), 강점/약점 매핑

#### Tab 5: 데이터뷰어

**UI**: 3모드 — explorer(DB탭+테이블+검색+페이지네이션) / map(데이터구조) / ontology(규칙시각화)

**5개 임베드 DB (총 118.9K행):**

| DB | 행수 | 주요 필드 |
|----|------|----------|
| 차량DB | 60,329 | 브랜드, 모델, 트림, 출시연도, 등급, 출고가 |
| 서비스센터DB | 7,846 | 센터명, 주소, 브랜드, 지역, 전화 |
| 렌터카DB | 2,015 | 업체, 모델, 등급(8단계), 일일요금 |
| 부품DB | 48,637 | 부품번호, 차종, 가격, ADAS, EV/ICE |
| 약관기준DB | 75 | 보장종목, 상해등급, 위자료, 자기부담금 |

**9개 외부 데이터 소스**: 6개 연동 완료(차량가액, 보험통계, 종합정보, 과실비율, 인증부품, OEM부품) + 3개 준비중(카히스토리, 450도표 구조화, CODEF)
**Excel I/O**: XLSX 업로드(시트 자동감지) + 다운로드(컬럼폭 자동조정)

### 추론 파이프라인 (전체 흐름)

```
[1] 사용자 입력 (차량/파손/사고유형/진술/증거)
     ↓
[2] buildContextFromCase(useCase, extraData)
     → 10개 UC 프리셋 + 사용자 오버라이드 병합
     → 컨텍스트 필드: accidentType, severity, faultA/B, repairCost,
       vehicleValue, injuryGrade, dui, unlicensed, fraudScore...
     ↓
[3] runOntologyInference(context)
     → 25규칙 priority 정렬 → 조건(condition) 평가 → 매칭 시 then() 실행
     → {results[], chain[], rulesFired, rulesEvaluated, timestamp}
     ↓
[4] ontoSummary = results.map("[flag] msg").join("\n")
     ↓
[5] callAI(systemPrompt + ontoSummary, userMessage)
     → Claude Sonnet 4 (max 1000토큰)
     → 실패 시 generateFallback() → 템플릿 응답
     ↓
[6] UI 렌더링 (견적카드 + AI리포트 + 온톨로지체인 + 시나리오)
```

### 현재 한계 + 빠진 기능 (손해사정사 실무 기준)

**Tab 0 (견적산정) 빠진 기능:**
- 실제 이미지 CV 분석 (현재 파일명만 파싱)
- 수리방법별 비용 분기 — 판금/교환/도장 선택에 따른 비용 차이 (현재 단일 랜덤 범위)
- ADAS 캘리브레이션 자동 판단 (차종+부위별 필수/선택)
- 미수선 현금정산 모듈 (현재 텍스트 언급만)
- 수입차 부품 수급 기간 (현재 배수만 적용, 배송 2~4주 미반영)
- 감가 정밀 계산 (주행거리 미반영, 판례별 감가율 미적용)
- PP 테이블 15개 부위만 정의 — 70+ 부위 중 나머지는 기본값 사용
- 대인 상해 연동 부재 (물적+인적 통합 분석 불가)
- 렌트 동종동급 자동 매핑 (현재 R07 지적만, 대안 미제시)
- 손해사정 비용(수리비 3~5%) 미계산

**Tab 1 (대인피해) 빠진 기능:**
- 위자료 자동 계산 — `INSURANCE_REF.consolation` 데이터 존재하나 UI 미연결
- 휴업손해 (일일수입 × 휴업일수) — 완전 부재
- 후유장해 (노동능력상실률 × 기본금액 × 85%) — 데이터 존재, 미계산
- 향후치료비 (장기 치료계획, 재수술 가능성) — 완전 부재
- 개호비 (간병비, 1~5급 중증에 해당) — 완전 부재
- 기타 실손해 (수송비, 의료기구, 병문안비) — 완전 부재
- 치료비 상세 산정 (진료비, 약제비, 검사료, 수술료 분리) — 총액만 표시
- 증거 관리 (진단서 업로드/검증, 의료기록 연동)
- 분쟁 이력 추적 (동일 청구인 과거 건)
- 실시간 판례 연동 (유사 상해 판례 자동 매칭)

**Tab 2 (과실산정) 빠진 기능:**
- KNIA 249개 도표 연동 (현재 20개만, 7개 사고유형 매핑)
- 현저한 과실 7종 + 중대한 과실 6종 자동 인식/적용
- 판례 DB 검색 (현재 고정 텍스트 "대법원 2018다456789")
- 과실비율 협상 이력/버전 관리
- 분쟁심의위원회 신청 양식 자동 작성
- 비접촉사고 상세 분류 (현재 FAULT_MAP 40% 고정)
- 보험사기 실시간 감지 (Tab 2 입력 단계에서)
- 다중피해자 과실상계 개별 적용 테이블

**Tab 3 (처리방법) 빠진 기능:**
- 합의서 자동생성 (현재 시나리오 추천만)
- 소송 비용/기간 예측 (소송 시나리오 자체 없음)
- 시나리오별 수락 확률 (유사 사건 데이터 기반)
- 지급 프로세스 연동 (계좌, 일정, 알림)
- 민원 사이클 관리 (합의 후 재개, 에스컬레이션)
- 대면/전화 상담 스크립트 상세화 (반론 대응 분기)

**Tab 4 (KPI) 빠진 기능:**
- 개인별 사정사 KPI (팀원별 처리건수, 절감율, 민원율)
- 시계열 추이 (월별/분기별 트렌드)
- SLA 준수율 (서류완비→지급 10일 이내 비율)
- 손해율 계산 (보험료 대비 지급보험금)
- 고객만족도 추적
- 모든 KPI가 목업 — 실제 계산 로직 없음

**Tab 5 (데이터뷰어) 빠진 기능:**
- 판례 DB (법원 판결문 검색/매칭)
- 보험사기 패턴 DB (SIU 연동)
- 협상 히스토리 DB (과거 합의 사례/수락율)
- 의료비 기준 DB (병원별 진료비 표준)
- 시장 렌트비 (실시간 렌터카 시세)
- 3개 외부 소스 미연동 (카히스토리, 450도표 구조화, CODEF)

**크로스탭 공통 빠진 기능:**
- 온톨로지 추론이 Tab 0에서만 1회 실행 — Tab 1~3에서 데이터 변경 시 재평가 안 됨
- 규칙 충돌 해결 없음 — 복수 규칙 동시 발동 시 상호작용 미정의
- UC2 하드코딩 — AI 호출 건너뜀
- A/B 차량 전환 시 사용자 수정값 유실
- 주행거리(`ml`) 입력만 받고 감가 계산 미반영
- 리포트 전송은 2초 시뮬레이션 — 실제 전송/PDF 미구현
- `callAI()` API 키가 클라이언트에 노출됨 — 백엔드 분리 시 반드시 이동

---

## 온톨로지 전환 계획

### 스키마 파일 구조 (JSON-LD, `src/ontology/`)

| 파일 | 용도 | 갱신 주기 |
|------|------|----------|
| `claims-ontology.jsonld` | 공유 @context (schema.org + SKOS + dmp: 네임스페이스) | 스키마 변경 시 |
| `schema-vehicle.jsonld` | 차량/부품 분류, 부위 간 관계 (canCauseDamageTo, adjacentTo) | 신차/부품 추가 시 |
| `schema-damage.jsonld` | 손상 평가, 인과 체인, 전파 확률 | 인과 관계 발견 시 |
| `schema-accident.jsonld` | KNIA 249개 사고유형 트리 + 과실비율 + 수정요소 | KNIA 개정 시 (~2~3년) |
| `schema-rules.jsonld` | 25개 규칙 + conflictsWith/overrides/dependsOn 관계 | 규칙 추가/변경 시 |
| `schema-costs.jsonld` | 분기별 가격, 공임표, 감가 테이블 (시간 유효성 포함) | **분기별** (가격 변동) |
| `schema-injury.jsonld` | 상해 등급, 보상 한도, 정산 범위 | 법규 개정 시 |

### 온톨로지 실시간 반영 원칙

데이터 추가/수정 시 온톨로지에 즉시 반영되도록 아래 구조를 따른다.

**1. 단일 진실 원천 (Single Source of Truth)**
- 모든 도메인 데이터는 `src/ontology/*.jsonld` 파일에서만 정의
- 컴포넌트(ClaimsAgentNew.jsx 등)는 온톨로지를 **import하여 참조만** — 자체 상수 정의 금지
- 현재 ClaimsAgentNew.jsx에 하드코딩된 `VEHICLE_DB`, `DAMAGE_CATS`, `ACCIDENT_TYPES`, `PRICE_PARTS`는 온톨로지에서 파생하도록 전환

**2. 온톨로지 레지스트리 (`src/ontology/registry.js`)**
- 모든 `.jsonld` 파일을 로드하고 `@graph` 노드를 `Map<@id, node>`로 인덱싱
- 관계 탐색 함수 제공: `getRelated(id, relation)`, `getChildren(id)`, `getAncestors(id)`
- 컴포넌트는 레지스트리 API를 통해서만 온톨로지 데이터에 접근
```
registry.getVehicleModels("현대")        // schema-vehicle.jsonld에서 조회
registry.getDamageChain("프론트 범퍼")    // schema-damage.jsonld에서 인과 체인
registry.getFaultRatio("차1-1")          // schema-accident.jsonld에서 과실비율
registry.getApplicableRules(context)     // schema-rules.jsonld에서 규칙 매칭
registry.getPartCost("본넷", "순정", "국산_일반")  // schema-costs.jsonld에서 비용
```

**3. 변경 전파 흐름 (온톨로지 → 지식 그래프 → UI)**
```
.jsonld 수정 → registry 재인덱싱 → 지식 그래프 재구축 → 추론 엔진 재실행 → UI 자동 반영
```

전체 파이프라인:
```
[1] 데이터 소스        src/ontology/*.jsonld (JSON-LD 파일)
         ↓ import
[2] 레지스트리         registry.js — @graph → Map<@id, node> 플랫 인덱스
         ↓ buildGraph()
[3] 지식 그래프        knowledgeGraph.js — 노드 + 엣지 + 관계 탐색 (인메모리 그래프)
         ↓ infer()
[4] 추론 엔진          inferenceEngine.js — 25개 규칙 평가 + 충돌 해결 + 감사 추적
         ↓ results
[5] UI 컴포넌트        ClaimsAgentNew.jsx — 추론 결과 렌더링
```

**지식 그래프 모듈 (`src/ontology/knowledgeGraph.js`)**
- 레지스트리의 플랫 인덱스를 **방향 그래프 (Directed Graph)** 로 변환
- 노드: 차량, 부위, 사고유형, 규칙, 비용 등 모든 엔티티
- 엣지: `canCauseDamageTo`, `broader/narrower`, `overrides`, `conflictsWith`, `hasPart` 등 관계
- 그래프 연산 API:
```
graph.traverse(startId, relation, depth)   // 관계 따라 N-depth 탐색
graph.shortestPath(fromId, toId)           // 두 노드 간 최단 경로
graph.getSubgraph(nodeId, radius)          // 특정 노드 주변 서브그래프 추출
graph.findCausalChain(partId, severity)    // 연쇄 손상 경로 추론
graph.matchPattern(pattern)                // 패턴 매칭 (사기 탐지 등)
```

**변경 감지 + 증분 반영:**
- 레지스트리가 `.jsonld` 변경 시 diff를 계산 (추가/수정/삭제된 노드 목록)
- 지식 그래프는 **전체 재구축 없이 증분 업데이트** (`addNode`, `removeNode`, `updateEdge`)
- 영향 받는 노드의 추론 결과만 선택적 재계산 (전체 25규칙 재실행 불필요)
```
registry.onChange(diff) → graph.applyDiff(diff) → engine.reInfer(diff.affectedNodes)
```

**환경별 동작:**
- **개발 시**: Vite HMR이 `.jsonld` 변경 감지 → 파이프라인 [1]→[5] 자동 실행
- **런타임 시**: IndexedDB 캐시 버전 비교 → 변경분만 그래프에 증분 적용
- **대용량 시**: 그래프 구축/추론을 Web Worker에서 처리, 결과만 메인 스레드로 전달

**4. 버전 관리**
- 각 `.jsonld` 파일에 `dmp:version`과 `dcterms:modified` 메타데이터 포함
- 분기별 갱신 데이터(비용 등)는 `validFrom`/`validUntil` 시간 범위로 관리
- 레지스트리가 현재 날짜 기준으로 유효한 데이터만 반환

**5. 데이터 추가 시 체크리스트 (온톨로지 + 지식 그래프 자동 반영)**

아래 `.jsonld` 파일만 수정하면 레지스트리 → 지식 그래프 → 추론 엔진 → UI까지 자동 전파된다.

| 작업 | 수정 파일 | 지식 그래프 영향 |
|------|----------|-----------------|
| 신규 차량/모델 추가 | `schema-vehicle.jsonld` (노드 + 제조사 `narrower` 연결) | 차량 노드 + `hasPart` 엣지 추가 |
| 신규 부위 추가 | `schema-vehicle.jsonld` 부품 + `schema-damage.jsonld` 인과 + `schema-costs.jsonld` 가격 | 부위 노드 + `canCauseDamageTo` 엣지 + 비용 노드 연결 |
| 신규 사고유형 추가 | `schema-accident.jsonld` (도표 + `broader` 연결 + 과실비율 + 수정요소) | 사고유형 트리에 리프 노드 추가 |
| 신규 규칙 추가 | `schema-rules.jsonld` (규칙 + 우선순위 + `overrides`/`conflictsWith`) | 규칙 노드 + 충돌/의존 엣지, 추론 엔진 Phase 재배치 |
| 가격 변경 | `schema-costs.jsonld` (기존 `validUntil` + 신규 `validFrom`) | 비용 노드 교체, 시간 유효성 필터 적용 |
| 연쇄 손상 관계 변경 | `schema-damage.jsonld` (확률/심각도 전이 수정) | `canCauseDamageTo` 엣지 가중치 업데이트, 인과 경로 재계산 |

### 사고유형 확장 (20개 → 249개)

KNIA 과실비율 인정기준 249도표, 4단계 계층:
```
L1: 차대차(~154) | 차대사람(~36) | 차대자전거(~43)
L2: 교차로 | 대향차 | 동일방향 | 기타 | 이륜차
L3: 신호유무 × 도로형태
L4: 이동패턴 (직진vs좌회전 등) → 개별 도표 (기본 과실비율)
```

수정요소: 현저한 과실 7종(+5~10%) + 중대한 과실 6종(+10~20%) + 도표별 고유 요소

현재 20개 타입은 KNIA 1~8개 도표에 각각 매핑됨. 차대자전거(43개)는 현재 완전 누락.

**정적 JSON 임베딩 가능** — 규제 표준이므로 2~3년 주기 개정 시만 업데이트.

### 수리방법-비용 체계

**6종 수리방법:** 교환, 판금, 도장, 탈착, 복원수리(경미손상 3유형), 캘리브레이션(ADAS)

**비용 계산 공식 (현재 랜덤 범위 → 다팩터 공식으로 전환):**
```
공임비 = SOT(시간) × 시간당공임 × 공임유형배율 × 정비소배율
부품비 = 티어별가격(5종) × 연식감가 × 차종배율(8단계)
도장비 = 도장면수 × (재료비 + 공임 + 건조비)
총수리비 = 공임비 + 부품비 + 도장비 + 탈착비 + 캘리브레이션비 - 인센티브
```

**부품 가격 5개 티어:** 순정 → 인증대체(OEM -35%) → 비순정(-50%) → 재생(-55%) → 재활용(-60%)

**차종 배율 8단계:** 국산일반(1.0) → 국산고급(1.3) → 수입일반(1.6) → 수입중급(2.0) → 수입고급(2.5) → 슈퍼카엔트리(3.5) → 슈퍼카일반(5.0) → 슈퍼카최고급(8.0)

**연쇄 손상 모델:** 부위별 `damageChain` — 확률 + 심각도 전이 + ADAS 캘리브레이션 트리거

### 규칙 충돌 해결 모델

**3단계 실행:**
1. **Phase 0**: 중단 규칙 — R20(사기 → 전체 중단), R23(소멸시효 → 경고)
2. **Phase 1**: 기초 규칙 — R04(과실), R02(전손), R05/R06(면책), R08, R25
3. **Phase 2~3**: 종속 규칙 — 오버라이드 맵 적용 후 순차 실행

**핵심 충돌 해결:**
- R05+R06 → 높은 쪽 적용 (중복 가산 아님)
- R02(전손) → R03(인증부품), R11(신차감가) 억제
- R02 → R18(잔존물) → R19(대출) 체인 자동 발동
- R20(사기) → 서킷 브레이커 (전체 중단)

### A/B 차량 상태 관리 (리팩토링 필요)

현재 단일 useState 세트를 A/B 공유 → `useReducer` + 엔티티별 독립 상태로 전환:
- `SWITCH_SIDE`: 데이터 터치 없이 활성 탭만 전환
- `UPDATE_FIELD`: 값 변경 + `_dirty` 플래그 설정
- `RESET_TO_PRESET`: 명시적 사용자 액션으로만 리셋

### 10만건 대용량 처리

| 기술 | 용도 |
|------|------|
| TanStack Virtual | 가상 스크롤 (React 상태에 50~100건만 유지) |
| Dexie.js (IndexedDB) | 클라이언트 영속성 (DB 없이) |
| Web Worker 풀 (2~4개) | 온톨로지 추론 + 데이터 생성을 메인 스레드 밖에서 |
| TanStack Table | 정렬/필터/그룹 |
| 컬럼 기반 처리 | 100K × 25규칙 = 2.5M 평가를 병렬 처리 |

100K 레코드 ≈ 300MB — 데스크톱 OK, 모바일은 50K 제한 권장.

---

## 외부 데이터 연동

### 정적 JSON 임베딩 가능 (API 불필요)

- **과실비율 249도표** — KNIA 규제 표준, 2~3년 주기 개정
- **사고유형 분류 체계** — 공개 정보
- **차량 부품 카탈로그** — 자체 구축

### 수동 입력 필요 (라이선스/접근 제한)

- **차량기준가액** — KIDI 저작권 보호, 5회/일 조회 제한. 라이선스 필요
- **수리비/표준공임** — AOS 기관회원 전용 (보험사/정비소만 접근)
- **부품 가격** — KAPA 웹 전용, API 없음

### 참조 소스

- KNIA 과실비율: `accident.knia.or.kr`
- KIDI 차량가액: `kidi.or.kr/user/car/carprice.do`
- BIGIN 빅데이터: `bigin.kidi.or.kr:9443`
- AOS 견적시스템: `webaos.com` (기관 전용)
- KAPA 인증부품: `i-kapa.org`

---

## MVP 요청 시스템

App.jsx에 내장된 MVP 제작 의뢰 모달. 상태 플로우: 접수 → 검토중 → 진행중 → 완료/보류. Google Sheets 웹훅(`api/sheets.js`) 연동.

## BMAD Integration

`_bmad/` (v6.2.0) + `.claude/skills/` — 브레인스토밍, PRD 생성, 편집 리뷰 등 슬래시 명령으로 호출.
