# Deny MVP Portal (DMP)

kt ds AX BD팀 MVP 포털

## 실행 방법

### 사전 요구사항
- **Node.js 18+** 설치 필요 (https://nodejs.org)

### 설치 & 실행

```bash
# 1. 프로젝트 폴더로 이동
cd dmp-portal

# 2. 의존성 설치 (최초 1회)
npm install

# 3. 개발 서버 실행
npm run dev
```

브라우저에서 **http://localhost:3000** 이 자동으로 열립니다.

### 빌드 (배포용)

```bash
npm run build
```

`dist/` 폴더에 정적 파일이 생성됩니다.

## 포함된 MVP

| MVP | 설명 |
|-----|------|
| 🛡️ 내부 정보 유출 위험자 식별 | 1,800명 임직원 이상행위 탐지 · AI 의도 추론 · 조치 추천 |
| 📈 StockPilot 종합 자산관리 | 주식/부동산/지출/연말정산/AI전략/글로벌시세 통합 관리 |

## 새 MVP 추가 방법

`src/App.jsx` 에서:
1. MVP 컴포넌트 함수 작성
2. `MVP_LIST` 배열에 항목 추가 (component 키에 식별자 지정)
3. `DMPPortal` 함수 내 라우팅 조건 추가
