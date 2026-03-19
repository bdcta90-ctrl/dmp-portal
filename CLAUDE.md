# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 1. Project Overview

**DMP (Deny MVP Portal)** — React 18 + Vite rapid prototyping hub by kt ds AX Business Development team. 7 MVP showcases. Primary focus: **자동차 손해사정 의사결정 지원 포털** (Auto Claims Assessment Decision Support Portal) MVP 전환.

**Project Direction:**
- DB 없이 MVP 진행 (JSON-LD 온톨로지 + IndexedDB + Web Worker 계획)
- 프론트/백엔드 분리 예정 (TECH_SPEC 참조: `_bmad-output/planning/tech-spec.md`)
- 10만건+ 대용량 처리 (TanStack Virtual + Web Worker)
- 타겟 고객: DB자동차손해사정 (파일럿 1팀 10명)
- PRD 완성: `_bmad-output/planning/prd.md`

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
├── App.jsx                    (포털 메인 — 라우팅, 테마, MVP 카드, 비밀번호 게이트)
├── ClaimsAgentNew.jsx         (~7,018줄 — 핵심 손해사정 포털, 10 UC, 49규칙)
├── SecurityDashboard.jsx      (~2,976줄 — 내부 보안 위험 식별, 35규칙, 40자산)
├── StockPilot.jsx             (통합 자산관리)
├── AIFirewall.jsx             (AI 방화벽)
├── ClaimsAgent.jsx            (최초 버전 백업 — 수정 불필요)
├── claims-constants.js        (2,119줄 — 수리방법12종, 연쇄손상801건, 차종배율12단계)
├── knia-accident-types.js     (6,367줄 — KNIA 과실비율 401건)
├── explorer-data.js           (137줄 — DB탐색기 빌더 함수)
├── main.jsx                   (엔트리포인트)
├── App_back.jsx / ClaimsAgent_back.jsx (백업 — 삭제 금지)
public/
├── data/
│   ├── vehicle.json           (60,329건, 7MB — 차량DB 전체)
│   ├── parts.json             (48,637건, 15MB — 부품DB 전체)
│   ├── service.json           (7,846건, 3.7MB — 서비스센터DB 전체)
│   └── rental.json            (2,015건, 1MB — 렌터카DB 전체)
├── korea-jobs.html            (대한민국 취업시장 시각화)
api/
├── sheets.js                  (Vercel serverless — Google Sheets MVP의뢰 webhook)
└── access-log.js              (Vercel serverless — 접속이력 Google Sheets 로깅)
_bmad-output/planning/
├── prd.md                     (576줄 — PRD v1.0 완성)
└── tech-spec.md               (726줄 — 기술 설계서 v1.0)
```

## 4. Architecture

**SPA with useState routing.** `App.jsx` manages navigation via `setPage()`. Every MVP component receives `onBack` prop.

**Key Patterns:**
- No CSS files — all inline `style` props + `<style>` tags
- No state management library — useState/useEffect (Zustand 전환 예정)
- No database — client-side data + JSON fetch
- Deployment: Vercel (serverless). `api/*.js` = Vercel function signature
- **비밀번호 게이트**: StockPilot, 취업시장, (New), Agent → 비번 `0613`
- **접속 로그**: 모든 Showcase 접속 시 `/api/access-log` → Google Sheets 자동 기록

**Vite Proxies:**
- `/api/yahoo` → Yahoo Finance API
- `/api/upbit` → Upbit cryptocurrency API
- `/openapi` → apis.data.go.kr (공공데이터 API)

## 5. File Dependencies

```
claims-constants.js
  exports: REPAIR_METHODS(12), DAMAGE_CHAINS(801), VEHICLE_CLASS_MULTIPLIERS(12단계)
     ↓ imported by
explorer-data.js
  exports: build*Rows(), *_HEADERS (5종)
     ↓ imported by
ClaimsAgentNew.jsx
  also imports: knia-accident-types.js → KNIA_ACCIDENT_TYPES(401)
```

## 6. ClaimsAgentNew.jsx — Core Architecture (~7,018줄)

### 10 Use Cases (UC1~UC10)

| UC | 시나리오 | 핵심 규칙 | 차량 |
|----|---------|----------|------|
| UC1 | 교차로 충돌 50:50 | R04,R07,R10,R13 | 그랜저 vs BMW 7 |
| UC2 | 주차장 신차 100:0 | R03,R11 | 그랜저 vs GV80(3개월) |
| UC3 | 차선변경 85:15 | R04,R13 + **100:0 대인미접수 전략** | 그랜저 vs BMW 5 |
| UC4 | 음주+중과실+무보험 | R05,R08,R21 | K5 vs 투싼 |
| UC5 | 렌터카 휴차료 | R17 | 쏘나타 vs 스포티지 |
| UC6 | **3중추돌 A→B→C** | R16 (3대 시스템) | 그랜저→K8→스포티지 |
| UC7 | 전손+할부 | R02→R18→R19 연쇄 | 모하비 전복 |
| UC8 | 사망+유족 | R25,R24,R36 | 스타리아 vs 트럭 |
| UC9 | 보험사기 | R20 서킷브레이커 | BMW 5 반복접수 |
| UC10 | 침수+시효 | R22,R23 | G80 침수 |

### 49 Rules (R01~R49, 전부 구현 완료)

**P0 (중단/치명):** R05(음주), R06(무면허), R08(12대중과실), R20(사기), R23(시효), R25(사망)
**P1:** R01(경상진단서), R02(전손), R04(과실자동), R12(대인한도), R16(다중차량), R17(영업손실), R19(대출), R21(무보험), R24(다수피해자), R32(위자료), R33(휴업손해), R34(후유장해), R36(개별한도), R39(중대한과실), R40(보행자특례), R43(분쟁심의), R47(대인Ⅱ)
**P2:** R03(인증부품), R07(렌탈동급), R09(자기부담금), R11(신차감가), R13(과실상계), R14(동승자감액), R26(ADAS), R27(수리방법), R28(경미손상), R29(연쇄손상), R35(과잉진료), R38(현저한과실), R42(미수선), R44(구상권), R48(자기신체특약)
**P3:** R10(수입차배율), R15(지급기한), R30(수입차수급), R31(주행거리), R37(향후치료비), R41(증거보정), R45(합의서), R46(소송예측), R49(긴급출동)

### UC Response Constants

```javascript
ESTIMATE_RESPONSES = {uc1:UC1_ESTIMATE_RESPONSE, uc2:UC_ESTIMATE_RESPONSE, ..., uc10:UC10_ESTIMATE_RESPONSE}
PROCESS_RESPONSES = {uc1:UC_PROCESS_RESPONSE, ..., uc10:UC10_PROCESS_RESPONSE}
// 각 UC × 4시나리오(최적/공격/안전/전략) + AI추천/전략추천 배지 + 정렬
```

### 6탭 UI

0.견적산정(자사/타사/C차 전환, 3탭 AI분석) → 1.대인피해 → 2.과실산정(8요소) → 3.처리방법(4카드) → 4.KPI → 5.데이터뷰어(10DB탭)

### Vehicle Selector

`자사 차량(A) / 타사 차량(B)` → `국산 / 외산` → 제조사 → 모델 (UC6: A/B/C 3탭)

## 7. Data Constants

### claims-constants.js (2,119줄)
- **REPAIR_METHODS**: 12종 (교환,판금,도장,탈착,복원수리,캘리브레이션,PDR,유리보수,용접,광택,랩핑,ECU코딩)
- **DAMAGE_CHAINS**: 88 출발부위, 801 체인 엔트리
- **VEHICLE_CLASS_MULTIPLIERS**: 12단계 (국산경차~슈퍼카울트라), 100+ 모델 오버라이드, 5차원 배율(EV/연식/지역/부품티어/감가)

### knia-accident-types.js (6,367줄)
- 401 사고유형 (차대차193, 차대사람92, 차대자전거82, 특수34)
- 4단계 계층 (L1→L4), 수정요소(현저한7종/중대한6종)

## 8. How-To Guides

### UC11 추가
1. `buildContextFromCase()` base 객체에 uc11 추가
2. `CASE_CARS`에 a/b 차량 추가 (UC6처럼 c도 가능)
3. `DAMAGE_CONFIGS`에 uc11_a, uc11_b 추가
4. `UC11_ESTIMATE_RESPONSE` 상수 생성
5. `ESTIMATE_RESPONSES` 맵에 추가
6. `UC11_PROCESS_RESPONSE` (4시나리오) 생성
7. `PROCESS_RESPONSES` 맵에 추가
8. `CASE_SCENARIOS` 맵에 시나리오 맥락 추가
9. CaseBar 탭 라벨 추가

### R50 규칙 추가
1. `ONTOLOGY.rules` 배열에 `{id,name,cat,priority,condition(ctx),then(ctx)}` 추가
2. `explorer-data.js`의 `RULE_SUMMARIES`에 요약 추가
3. 기존 규칙과 충돌 확인 (overrides/conflictsWith)

### 수리방법 추가
1. `claims-constants.js`의 `REPAIR_METHODS` 배열에 객체 추가
2. 필드: id, name, nameEn, desc, applicableMaterials[], severityRange[], costMultiplier, laborType, includesPaint, sot

### DB 탐색기 탭 추가
1. `explorer-data.js`에 `build*Rows()` + `*_HEADERS` export
2. `ClaimsAgentNew.jsx`의 `DK` 배열 + `DATASETS`에 추가

## 9. SecurityDashboard.jsx (~2,976줄)

### 구조
- 2탭: 실시간 감시 / 데이터 뷰어
- 데이터 뷰어 3분할: DB탐색기(5탭) / 데이터구조맵(5카테고리) / 온톨로지센터(지식그래프+추론규칙35개+위험도공식)

### 핵심 기능
- 1,800명 직원 생성 (HR 프로파일: 퇴사예정5%, 부서이동8%, 경고, 성과)
- 9종 이벤트 (가중 확률: File Open 30%~Permission Escalation 2%)
- **35개 추론 규칙 (SR01~SR35)**: 시간, HR, 접근, 고용, 패턴, 이벤트, 자산
- **40개 자산** (시스템/문서/데이터/코드/영상/음성/로그)
- **31건 법규** (개인정보보호법9, 정보통신망법3, 신용정보법2, 전자금융거래법2, 산업기술보호법3, 근로기준법2, ISMS-P 5, ISO 27001 5)
- 위험도 가중치 편집 (18개 요소, 관리자 조정 가능)
- 지식그래프: 계층형 레이아웃 (부서→직원→자산→이벤트→조치), 줌/팬(viewBox), 100명 표시, 90+ 빨강 펄싱
- AI 챗봇: 21개 쿼리 패턴 (자연어 정규식), 50건 표시, 통계 요약

## 10. Portal Showcases (App.jsx)

| # | ID | 타이틀 | 비밀번호 | 상태 |
|---|-----|-------|:-------:|:---:|
| 1 | claimsNewBackup | AI 자동차 손해사정 (시연버전) | 불필요 | Live |
| 2 | security | 내부 보안 위험 식별 | 불필요 | Live |
| 3 | firewall | AI 방화벽 | 불필요 | Live |
| 4 | stockpilot | StockPilot 통합 자산관리 | 0613 | Live |
| 5 | koreaJobs | 대한민국 취업시장 | 0613 | Live |
| 6 | claimsNew | AI 자동차 손해사정 (New) | 0613 | Live |
| 7 | claims | AI 자동차 손해사정 Agent | 0613 | 준비중 |

## 11. API Integration

- `callAI()`: Claude Sonnet 4 (`claude-sonnet-4-20250514`), max 1000토큰, fallback 하드코딩
- `/openapi` proxy → data.go.kr (보험통계, 피해자통계, 실손보험, 교통사고)
- `/api/access-log` → Google Sheets 접속이력 로깅 (showcase, 시간, IP, UA, 화면크기)
- **API 키 클라이언트 노출 — 백엔드 분리 시 반드시 이동**

## 12. Planning Documents

- **PRD** (`_bmad-output/planning/prd.md`, 576줄): Executive Summary, Success Criteria(손해율80%, 15초응답), User Journeys(3인), Domain Requirements, Innovation, Scope(MVP10/Growth8/Vision4), FR/NFR, Milestones(12주)
- **TECH_SPEC** (`_bmad-output/planning/tech-spec.md`, 726줄): 아키텍처(프론트/백분리), 컴포넌트6분할, API설계, 온톨로지엔진, PostgreSQL스키마, JWT인증, CI/CD, 마이그레이션5Phase
