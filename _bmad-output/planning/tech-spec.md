# Technical Specification — AI 자동차 손해사정 의사결정 지원 포털

**Author:** Guseo
**Date:** 2026-03-19
**Version:** 1.0
**관련 문서:** [PRD v1.0](./_bmad-output/planning/prd.md) | [CLAUDE.md](./CLAUDE.md)

---

## 1. 개요

### 1.1 문서 목적
PRD에 정의된 MVP를 **실제 구현하기 위한 기술 설계서**. 프론트엔드/백엔드 아키텍처, API 설계, 데이터 모델, 보안, 배포 전략을 다룬다.

### 1.2 대상 독자
- 프론트엔드 개발자 (React)
- 백엔드 개발자 (Node.js)
- DevOps/인프라 엔지니어
- 기술 리드/아키텍트

### 1.3 핵심 기술 결정

| 결정 | 선택 | 근거 |
|------|------|------|
| 프론트엔드 | React 18 + Vite | 프로토타입 기반 유지, 빌드 속도 |
| 백엔드 | Node.js + Express | JS 풀스택, 프로토타입 코드 재사용 |
| LLM | Claude Sonnet 4 | 현재 프로토타입에서 검증 완료 |
| 인증 | JWT | 10명 소규모, 간단 구현 |
| 데이터(MVP) | JSON 파일 | 프로토타입 데이터 즉시 활용 |
| 데이터(Growth) | PostgreSQL | 확장성, 쿼리 성능 |
| 배포 | Vercel(프론트) + Railway(백엔드) | 빠른 MVP 배포 |

---

## 2. 시스템 아키텍처

### 2.1 AS-IS (현재 프로토타입)

```
┌─────────────────────────────────────────────────┐
│  Browser (React SPA)                            │
│  ClaimsAgentNew.jsx (7,018줄 모놀리식)           │
│    ├─ callAI() → 직접 Claude API 호출 ⚠️        │
│    ├─ fetch("/data/*.json") → 27MB 정적 로딩     │
│    ├─ runOntologyInference() → 클라이언트 추론   │
│    └─ 인증 없음, 상태 관리 없음                   │
└─────────────────────────────────────────────────┘
```

**문제점:** API 키 노출, 7K줄 단일 파일, 인증 없음, 상태 유실

### 2.2 TO-BE (MVP)

```
┌─────────────────────────────┐
│  Browser (React 18 + Vite)  │
│  ├─ EstimateAgent.jsx       │
│  ├─ InjuryAgent.jsx         │
│  ├─ FaultAgent.jsx          │
│  ├─ ProcessAgent.jsx        │
│  ├─ KPIDashboard.jsx        │
│  └─ DataExplorer.jsx        │
└──────────┬──────────────────┘
           │ REST API (HTTPS)
           │ Authorization: Bearer <JWT>
┌──────────▼──────────────────┐
│  Backend (Node.js/Express)  │
│  ├─ /api/auth/*      (JWT)  │
│  ├─ /api/ai/analyze  (LLM)  │──→ Claude API (서버에서만)
│  ├─ /api/estimate/*         │
│  ├─ /api/injury/*           │
│  ├─ /api/fault/*            │
│  ├─ /api/process/*          │
│  ├─ /api/kpi/*              │
│  ├─ /api/data/*             │
│  └─ OntologyEngine          │
│     ├─ 49 Rules             │
│     ├─ Registry             │
│     └─ KnowledgeGraph       │
└──────────┬──────────────────┘
           │
┌──────────▼──────────────────┐
│  Data Layer                 │
│  ├─ JSON Files (MVP)        │
│  │   vehicle.json (60K)     │
│  │   parts.json (48K)       │
│  │   service.json (7.8K)    │
│  │   rental.json (2K)       │
│  ├─ Ontology Data           │
│  │   claims-constants.js    │
│  │   knia-accident-types.js │
│  └─ PostgreSQL (Growth)     │
└─────────────────────────────┘
```

---

## 3. 프론트엔드 설계

### 3.1 컴포넌트 분리

**현재 (1파일):**
```
ClaimsAgentNew.jsx (7,018줄)
  ├─ 견적 산정 UI (~1,500줄)
  ├─ 대인 피해 UI (~800줄)
  ├─ 과실 산정 UI (~900줄)
  ├─ 처리 방법 UI (~1,200줄)
  ├─ KPI 대시보드 (~1,000줄)
  ├─ 데이터 뷰어 (~800줄)
  ├─ 데이터 상수 (~600줄)
  └─ 유틸리티/공통 (~200줄)
```

**MVP (6파일 + 공통):**
```
src/
├─ components/
│   ├─ claims/
│   │   ├─ EstimateAgent.jsx    ← Tab 0 (견적 산정)
│   │   ├─ InjuryAgent.jsx      ← Tab 1 (대인 피해)
│   │   ├─ FaultAgent.jsx       ← Tab 2 (과실 산정)
│   │   ├─ ProcessAgent.jsx     ← Tab 3 (처리 방법)
│   │   ├─ KPIDashboard.jsx     ← Tab 4 (KPI)
│   │   ├─ DataExplorer.jsx     ← Tab 5 (데이터 뷰어)
│   │   └─ CaseBar.jsx          ← UC 선택 + 진행 상태
│   ├─ common/
│   │   ├─ DamageDiagram.jsx    ← SVG 파손 다이어그램
│   │   ├─ ScenarioModal.jsx    ← 시나리오 설명 모달
│   │   ├─ SmsModal.jsx         ← SMS 전송 모달
│   │   ├─ ReportModal.jsx      ← 일보 모달
│   │   └─ MarkdownRenderer.jsx ← RT 컴포넌트 (마크다운 렌더)
│   └─ layout/
│       └─ ClaimsLayout.jsx     ← 탭 관리 + 공유 상태
├─ hooks/
│   ├─ useOntologyInference.js  ← 추론 엔진 훅
│   ├─ useAIAnalysis.js         ← LLM 호출 훅
│   └─ useCaseData.js           ← UC 데이터 로딩 훅
├─ api/
│   └─ client.js                ← API 호출 래퍼 (fetch + JWT)
├─ data/
│   ├─ claims-constants.js      ← 수리방법, 연쇄손상, 차종배율
│   ├─ knia-accident-types.js   ← KNIA 401건
│   └─ explorer-data.js         ← DB탐색기 빌더
└─ stores/
    └─ claimsStore.js           ← 공유 상태 (Zustand)
```

### 3.2 상태 관리 (Zustand)

```javascript
// stores/claimsStore.js
import { create } from 'zustand';

const useClaimsStore = create((set, get) => ({
  // ── UC 상태 ──
  useCase: null,        // "uc1" ~ "uc10"
  activeTab: 0,         // 0=견적, 1=대인, 2=과실, 3=처리, 4=KPI, 5=데이터
  flow: [false, false, false, false], // 탭별 완료 상태

  // ── 차량 상태 (A/B/C) ──
  vehicles: {
    a: { origin:"", mk:"", md:"", yr:"", ml:"", sp:[], sv:"중간" },
    b: { origin:"", mk:"", md:"", yr:"", ml:"", sp:[], sv:"중간" },
    c: null, // UC6만 사용
  },
  activeSide: "a",    // dmgTab: 0=a, 1=b, 2=c

  // ── Agent 결과 ──
  estimateResult: null,  // 견적 산정 결과
  injuryResult: null,    // 대인 피해 결과
  faultResult: null,     // 과실 산정 결과
  processResult: null,   // 처리 방법 결과
  ontoResult: null,      // 온톨로지 추론 결과

  // ── Actions ──
  setUseCase: (uc) => set({ useCase: uc, flow: [false,false,false,false] }),
  switchSide: (side) => set({ activeSide: side }), // 데이터 리셋 없음
  completeTab: (idx) => set(s => {
    const f = [...s.flow]; f[idx] = true; return { flow: f };
  }),
  setEstimate: (r) => set({ estimateResult: r }),
  setInjury: (r) => set({ injuryResult: r }),
  setFault: (r) => set({ faultResult: r }),
  setProcess: (r) => set({ processResult: r }),
}));
```

### 3.3 API 클라이언트

```javascript
// api/client.js
const BASE_URL = import.meta.env.VITE_API_URL || '/api';

async function apiCall(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });
  if (res.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

export const api = {
  // 인증
  login: (credentials) => apiCall('/auth/login', { method:'POST', body:JSON.stringify(credentials) }),

  // AI 분석
  analyze: (system, message) => apiCall('/ai/analyze', { method:'POST', body:JSON.stringify({ system, message, maxTokens:1000 }) }),

  // 견적
  calculateEstimate: (data) => apiCall('/estimate/calculate', { method:'POST', body:JSON.stringify(data) }),

  // 대인
  analyzeInjury: (data) => apiCall('/injury/analyze', { method:'POST', body:JSON.stringify(data) }),

  // 과실
  calculateFault: (data) => apiCall('/fault/calculate', { method:'POST', body:JSON.stringify(data) }),

  // 처리방법
  recommendProcess: (data) => apiCall('/process/recommend', { method:'POST', body:JSON.stringify(data) }),

  // 데이터
  getVehicles: (params) => apiCall(`/data/vehicles?${new URLSearchParams(params)}`),
  getParts: (params) => apiCall(`/data/parts?${new URLSearchParams(params)}`),

  // KPI
  getDashboard: () => apiCall('/kpi/dashboard'),
};
```

---

## 4. 백엔드 설계

### 4.1 프로젝트 구조

```
server/
├─ index.js                    ← Express 앱 진입점
├─ middleware/
│   ├─ auth.js                 ← JWT 검증
│   ├─ cors.js                 ← CORS 설정
│   ├─ rateLimit.js            ← Rate Limiting
│   └─ logger.js               ← 요청 로깅 (6개월 보관)
├─ routes/
│   ├─ auth.js                 ← POST /login, /refresh
│   ├─ ai.js                   ← POST /ai/analyze (LLM 프록시)
│   ├─ estimate.js             ← POST /estimate/calculate
│   ├─ injury.js               ← POST /injury/analyze
│   ├─ fault.js                ← POST /fault/calculate
│   ├─ process.js              ← POST /process/recommend
│   ├─ kpi.js                  ← GET /kpi/dashboard, /kpi/reports
│   └─ data.js                 ← GET /data/vehicles, /parts, etc.
├─ services/
│   ├─ llmService.js           ← Claude API 호출 + Fallback
│   ├─ ontologyEngine.js       ← 49규칙 추론 엔진
│   ├─ estimateService.js      ← 견적 비용 계산 로직
│   ├─ faultService.js         ← 과실 보정 계산 로직
│   └─ dataService.js          ← JSON 데이터 로딩 + 페이지네이션
├─ data/
│   ├─ vehicle.json            ← 60,329건
│   ├─ parts.json              ← 48,637건
│   ├─ service.json            ← 7,846건
│   ├─ rental.json             ← 2,015건
│   ├─ claims-constants.js     ← 수리방법, 연쇄손상, 차종배율
│   └─ knia-accident-types.js  ← 401건
├─ config/
│   └─ env.js                  ← 환경변수 관리
└─ .env                        ← API 키, JWT 시크릿 (gitignore)
```

### 4.2 API 상세 설계

#### POST /api/auth/login

```json
// Request
{ "username": "이현수", "password": "****" }

// Response (200)
{
  "token": "eyJhbG...",
  "refreshToken": "eyJhbG...",
  "user": {
    "id": "USR-002",
    "name": "이현수 사정사",
    "role": "USER",
    "team": "김영수 센터",
    "strengths": ["견적", "처리"],
    "weaknesses": ["대인"]
  }
}
```

#### POST /api/ai/analyze

```json
// Request
{
  "system": "당신은 자동차 손해사정 전문 AI입니다...",
  "message": "차량: 현대 그랜저 2023년식...",
  "maxTokens": 1000
}

// Response (200)
{
  "text": "## 🤖 AI 견적 검증 리포트...",
  "model": "claude-sonnet-4-20250514",
  "tokensUsed": 850,
  "fallback": false
}

// Response (LLM 장애 시)
{
  "text": "## AI 견적 분석 리포트 (오프라인)...",
  "fallback": true
}
```

#### POST /api/estimate/calculate

```json
// Request
{
  "useCase": "uc1",
  "vehicle": { "mk": "BMW", "md": "7시리즈", "yr": "2023", "origin": "외산" },
  "damageParts": ["프론트 범퍼(상)", "우 프론트 펜더", "우 헤드라이트"],
  "severity": "심각",
  "photos": 3
}

// Response (200)
{
  "breakdown": [
    { "part": "프론트 범퍼(상)", "partsCost": 1800000, "laborCost": 650000, "total": 2450000, "method": "교환 필수" },
    { "part": "우 프론트 펜더", "partsCost": 1400000, "laborCost": 550000, "total": 1950000, "method": "판금+도장" }
  ],
  "summary": { "partsCost": 5200000, "laborCost": 2100000, "paintCost": 1500000, "total": 8800000 },
  "ontologyResult": {
    "rulesFired": 7,
    "results": [
      { "ruleId": "R10", "flag": "수입차_배수", "msg": "외산 ×1.6 적용", "severity": "info" }
    ]
  },
  "aiAnalysis": "## 🤖 AI 견적 검증 리포트...",
  "adasRequired": ["프론트 범퍼(상)", "우 헤드라이트"],
  "cashSettlement": { "min": 6160000, "max": 7040000 }
}
```

#### GET /api/data/vehicles?page=1&limit=100&search=현대

```json
// Response (200)
{
  "data": [
    ["VH-001", "현대", "아반떼", "CN7", "프리미엄", "2023", "준중형", "가솔린", "1600", "국산", "25800000", "-"]
  ],
  "headers": ["차량ID","브랜드","모델명","세대/코드","트림","출시연도","등급","유종","배기량(cc)","국산외산","출고가(원)","비고"],
  "total": 60329,
  "page": 1,
  "totalPages": 604
}
```

### 4.3 LLM 프록시 서비스

```javascript
// services/llmService.js
const CLAUDE_API = 'https://api.anthropic.com/v1/messages';
const API_KEY = process.env.CLAUDE_API_KEY; // 서버 환경변수

async function analyze(system, message, maxTokens = 1000) {
  try {
    const res = await fetch(CLAUDE_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: maxTokens,
        system,
        messages: [{ role: 'user', content: message }]
      })
    });
    const data = await res.json();
    return { text: data.content?.[0]?.text, fallback: false };
  } catch (e) {
    return { text: generateFallback(system, message), fallback: true };
  }
}
```

---

## 5. 온톨로지 추론 엔진

### 5.1 서버 이관

**현재 (클라이언트):**
```javascript
// ClaimsAgentNew.jsx 내부
function runOntologyInference(context) { ... }
```

**MVP (서버):**
```javascript
// services/ontologyEngine.js
const { ONTOLOGY_RULES } = require('../data/ontology-rules');

function runInference(context) {
  const results = [];
  const chain = [];
  const sorted = [...ONTOLOGY_RULES].sort((a, b) => a.priority - b.priority);

  for (const rule of sorted) {
    try {
      if (rule.condition(context)) {
        const result = rule.then(context);
        results.push({ ...result, ruleId: rule.id, ruleName: rule.name, cat: rule.cat });
        chain.push({ step: chain.length + 1, rule: rule.id, flag: result.flag, severity: result.severity });
      }
    } catch (e) { /* skip */ }
  }

  return { results, chain, rulesFired: results.length, rulesEvaluated: sorted.length };
}
```

### 5.2 Phase 기반 실행 (Growth)

```
Phase 0: 중단 규칙 → R20(사기) 발동 시 나머지 전체 보류
Phase 1: 기초 규칙 → R02(전손), R04(과실), R05/R06(면책)
Phase 2: 종속 규칙 → R02 발동 → R03(인증부품) 억제, R18(잔존물) 자동 발동
Phase 3: 정제 규칙 → R10(배율), R15(기한)
```

---

## 6. 데이터 설계

### 6.1 MVP (JSON 파일)

프로토타입의 `public/data/*.json` 을 백엔드 `server/data/`로 이동. 서버 시작 시 메모리 로딩.

```javascript
// services/dataService.js
let vehicleData = null;

function loadData() {
  vehicleData = JSON.parse(fs.readFileSync('./data/vehicle.json'));
  // ... parts, service, rental
}

function getVehicles({ page = 1, limit = 100, search = '' }) {
  let rows = vehicleData.rows;
  if (search) rows = rows.filter(r => r.some(c => c?.includes(search)));
  const total = rows.length;
  const paged = rows.slice((page - 1) * limit, page * limit);
  return { data: paged, headers: vehicleData.headers, total, page, totalPages: Math.ceil(total / limit) };
}
```

### 6.2 Growth (PostgreSQL)

```sql
-- 사용자/팀
CREATE TABLE users (
  id VARCHAR(10) PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  role VARCHAR(20) DEFAULT 'USER', -- USER, MANAGER, ADMIN
  team_id VARCHAR(10),
  strengths TEXT[],
  weaknesses TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- 배당건
CREATE TABLE cases (
  id VARCHAR(20) PRIMARY KEY,
  use_case VARCHAR(10),
  accident_type VARCHAR(100),
  vehicle_a JSONB,
  vehicle_b JSONB,
  vehicle_c JSONB,
  fault_a INTEGER,
  fault_b INTEGER,
  severity VARCHAR(20),
  status VARCHAR(20) DEFAULT 'open', -- open, in_progress, closed
  assigned_to VARCHAR(10) REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 견적 결과
CREATE TABLE estimates (
  id SERIAL PRIMARY KEY,
  case_id VARCHAR(20) REFERENCES cases(id),
  breakdown JSONB, -- 부위별 비용
  total_cost INTEGER,
  ai_analysis TEXT,
  ontology_result JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- KPI
CREATE TABLE kpi_reports (
  id SERIAL PRIMARY KEY,
  case_id VARCHAR(20) REFERENCES cases(id),
  adjuster_id VARCHAR(10) REFERENCES users(id),
  original_claim INTEGER,
  ai_result INTEGER,
  saving INTEGER,
  status VARCHAR(20),
  priority VARCHAR(10),
  fraud_detected BOOLEAN DEFAULT FALSE,
  fraud_reason TEXT,
  complaint BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 7. 인증/보안 설계

### 7.1 JWT 구조

```javascript
// Access Token payload
{
  "sub": "USR-002",
  "name": "이현수 사정사",
  "role": "USER",
  "team": "T-001",
  "iat": 1710000000,
  "exp": 1710001800  // 30분
}

// Refresh Token: 7일 유효, httpOnly cookie
```

### 7.2 역할 기반 접근 제어

| 엔드포인트 | USER (사정사) | MANAGER (팀장) | ADMIN |
|-----------|:---:|:---:|:---:|
| /api/estimate/* | ✅ | ✅ | ✅ |
| /api/injury/* | ✅ | ✅ | ✅ |
| /api/fault/* | ✅ | ✅ | ✅ |
| /api/process/* | ✅ | ✅ | ✅ |
| /api/kpi/dashboard | 본인 건만 | ✅ 전체 | ✅ |
| /api/kpi/team-stats | ❌ | ✅ | ✅ |
| /api/data/* | ✅ (읽기) | ✅ | ✅ (쓰기) |
| /api/auth/manage | ❌ | ❌ | ✅ |

### 7.3 개인정보 보호

```javascript
// LLM 전송 전 익명화
function anonymize(context) {
  return {
    ...context,
    vehicleA: context.vehicleA, // 차량 정보는 유지
    claimantDetails: context.claimantDetails?.map(c => ({
      ...c,
      name: `피해자${c.grade}급`, // 실명 → 등급으로 대체
    })),
  };
}
```

---

## 8. 배포 설계

### 8.1 환경 구성

| 환경 | 프론트엔드 | 백엔드 | 용도 |
|------|----------|--------|------|
| dev | localhost:5173 | localhost:3000 | 개발 |
| staging | staging.vercel.app | staging.railway.app | QA |
| production | dmp-portal.vercel.app | api.dmp-portal.com | 운영 |

### 8.2 CI/CD (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build
      - run: npm test

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: railway/deploy@v1
        with:
          railway-token: ${{ secrets.RAILWAY_TOKEN }}
```

### 8.3 환경변수 (.env)

```env
# 백엔드
CLAUDE_API_KEY=sk-ant-...
JWT_SECRET=random-256-bit-string
JWT_REFRESH_SECRET=another-random-string
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://dmp-portal.vercel.app

# 프론트엔드 (VITE_ 접두사)
VITE_API_URL=https://api.dmp-portal.com/api
```

---

## 9. 마이그레이션 계획

### Phase 1: 기반 구축 (1~2주)

| 작업 | 상세 | 산출물 |
|------|------|--------|
| 프로젝트 초기화 | Express 서버 + React 프로젝트 분리 | server/, client/ |
| 인증 구현 | JWT 로그인/로그아웃/갱신 | /api/auth/* |
| CI/CD 구축 | GitHub Actions + Vercel + Railway | .github/workflows/ |
| CORS/보안 | 미들웨어 설정 | middleware/ |

### Phase 2: LLM + 추론 이관 (3~4주)

| 작업 | 상세 | 산출물 |
|------|------|--------|
| LLM 프록시 | callAI() → /api/ai/analyze | llmService.js |
| 온톨로지 엔진 | 49규칙 서버 이관 | ontologyEngine.js |
| Fallback | LLM 장애 시 하드코딩 응답 | fallbackService.js |
| 데이터 API | JSON 로딩 + 페이지네이션 | /api/data/* |

### Phase 3: 4대 Agent (5~8주)

| 작업 | 상세 | 산출물 |
|------|------|--------|
| 견적 Agent | calc() 서버 이관 + API | EstimateAgent.jsx + /api/estimate |
| 대인 Agent | 대인 분석 API | InjuryAgent.jsx + /api/injury |
| 과실 Agent | 8요소 보정 서버 이관 | FaultAgent.jsx + /api/fault |
| 처리 Agent | 4시나리오 생성 API | ProcessAgent.jsx + /api/process |

### Phase 4: KPI + 데이터 (9~10주)

| 작업 | 상세 | 산출물 |
|------|------|--------|
| KPI 대시보드 | 실적 집계 API | KPIDashboard.jsx + /api/kpi |
| 데이터 뷰어 | 10탭 서버 페이지네이션 | DataExplorer.jsx + /api/data |

### Phase 5: 통합 + 배포 (11~12주)

| 작업 | 상세 | 산출물 |
|------|------|--------|
| 통합 테스트 | 4대 Agent 플로우 E2E | test/ |
| 성능 최적화 | 15초 이내 응답 튜닝 | 벤치마크 리포트 |
| 파일럿 배포 | DB손해사정 팀 온보딩 | 사용자 매뉴얼 |

---

## 10. 기술 부채 및 리스크

### 10.1 현재 기술 부채 (프로토타입)

| 부채 | MVP 해결 | 이후 |
|------|:-------:|:----:|
| 7,018줄 모놀리식 | ✅ 6개 컴포넌트 분리 | |
| API 키 클라이언트 노출 | ✅ 백엔드 프록시 | |
| 인증 없음 | ✅ JWT | |
| 27MB JSON 클라이언트 로딩 | ✅ 서버 페이지네이션 | |
| 온톨로지 클라이언트 추론 | ✅ 서버 이관 | |
| 하드코딩 UC 응답 44개 | 유지 (Fallback) | DB 이관 |
| useState 탭간 상태 유실 | ✅ Zustand | |
| 테스트 없음 | 기본 E2E | 단위 테스트 |
| CSS 인라인 | 유지 | Tailwind |

### 10.2 리스크 매트릭스

| 리스크 | 확률 | 영향 | 대응 |
|--------|:----:|:----:|------|
| LLM 응답 15초 초과 | 중 | 높 | 프롬프트 최적화 + 스트리밍 + 캐싱 |
| 프로토타입→MVP 이관 시 기능 누락 | 중 | 높 | UC별 E2E 테스트 체크리스트 |
| DB손해사정 파일럿 거부 | 낮 | 높 | 프로토타입 시연으로 사전 합의 |
| 데이터 정합성 (약관 개정) | 중 | 중 | 버전 관리 + 갱신 알림 |
| 개발 인력 부족 | 중 | 중 | 프로토타입 코드 최대 재사용 |

---

**Document Status:** Complete
**Version:** 1.0
**Last Updated:** 2026-03-19
