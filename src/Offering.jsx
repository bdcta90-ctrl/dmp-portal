import { useState, useEffect, useRef } from "react";

// ─── 오퍼링 데이터 ───
const OFFERINGS = {
  claimsNewBackup: {
    badge: "AI AGENT",
    title: "AI 자동차\n손해사정",
    subtitle: "AI-Powered Claims Assessment",
    tagline: "수작업 견적 산정의 시대는 끝났습니다",
    hero: "보험금 산정부터 과실비율 분석, 최적 처리방안 제안까지.\nAI가 손해사정 전 과정의 의사결정을 지원합니다.",
    problem: {
      title: "기존 손해사정의 한계",
      points: [
        { num: "01", title: "속도", desc: "1건 처리에 평균 2-3시간, 복잡 사고는 수일 소요" },
        { num: "02", title: "일관성", desc: "담당자별 견적 편차 20-40%, 과실비율 판단 불일치" },
        { num: "03", title: "비용", desc: "과다 청구 검증 어려움, 연간 수십억 불필요 지급" },
        { num: "04", title: "경험 의존", desc: "숙련 사정사 은퇴 시 노하우 유실, 신규 인력 양성 한계" },
      ],
    },
    features: [
      { icon: "🔍", title: "AI 견적 산정", desc: "부품가·공임·도장비를 자동 계산하고 제3자 청구 견적과 AI 적정가를 비교 분석합니다" },
      { icon: "⚖️", title: "과실비율 분석", desc: "대법원 판례 12,847건 기반으로 사고유형별 기본과실과 수정요소를 자동 산출합니다" },
      { icon: "🚗", title: "렌터카 검증", desc: "대법원 동급차량 판례 기준으로 렌터카 청구 적정성을 자동 검증합니다" },
      { icon: "📊", title: "다중 시나리오", desc: "보수적·균형·적극적 3가지 합의 시나리오와 예상 절감액을 제시합니다" },
      { icon: "📋", title: "유사 사례 매칭", desc: "과거 처리 이력에서 유사도 높은 3-5건을 찾아 판단 근거를 제공합니다" },
      { icon: "💰", title: "절감 효과 분석", desc: "건별 100-400만원 절감 효과를 실시간으로 산출하여 ROI를 가시화합니다" },
    ],
    metrics: [
      { value: "20-40%", label: "보험금 절감률" },
      { value: "12,847", label: "학습 판례 수" },
      { value: "94%+", label: "과실 판정 정확도" },
      { value: "3분", label: "견적 산출 시간" },
    ],
    process: [
      { step: "01", title: "사고 접수", desc: "사고 유형·차량 정보·피해 내역 입력" },
      { step: "02", title: "AI 분석", desc: "견적 산정·과실비율·렌터카 자동 검증" },
      { step: "03", title: "시나리오 생성", desc: "3가지 합의안과 예상 절감액 제시" },
      { step: "04", title: "의사결정 지원", desc: "유사 판례·처리 가이드 제공" },
    ],
    cta: "프로토타입 체험하기",
  },
  security: {
    badge: "SECURITY",
    title: "내부 보안\n위험 식별",
    subtitle: "Insider Threat Detection",
    tagline: "1,800명의 이상행위를 실시간으로 탐지합니다",
    hero: "파일 열람, USB 복사, 대량 조회, 권한 상승.\nAI가 임직원 행동 패턴을 분석하고 위험을 선제적으로 차단합니다.",
    problem: {
      title: "내부 위협의 현실",
      points: [
        { num: "01", title: "사각지대", desc: "기존 SIEM은 외부 위협 중심, 내부자 이상행위 탐지 한계" },
        { num: "02", title: "오탐 과다", desc: "단순 룰 기반 알림으로 보안팀 피로도 증가, 실제 위협 놓침" },
        { num: "03", title: "대응 지연", desc: "위협 감지에서 조치까지 평균 72시간, 데이터 유출 이미 발생" },
        { num: "04", title: "컨텍스트 부재", desc: "알림만 있고 왜 위험한지, 어떻게 대응할지 가이드 없음" },
      ],
    },
    features: [
      { icon: "📡", title: "실시간 행위 분석", desc: "1,800명 임직원의 파일 접근·출력·외부 전송 행위를 실시간 모니터링합니다" },
      { icon: "🧠", title: "AI 리스크 스코어링", desc: "이벤트 심각도 × 자산 민감도 × 역할 불일치를 종합한 위험 점수를 산출합니다" },
      { icon: "🎯", title: "의도 추론 엔진", desc: "단순 실수인지 의도적 유출인지 행동 패턴과 맥락을 분석하여 판단합니다" },
      { icon: "📋", title: "10단계 대응 플레이북", desc: "관리자 확인부터 MFA 강제·접근 차단·포렌식·CISO 보고까지 자동 가이드합니다" },
      { icon: "🔒", title: "자산 분류 관리", desc: "40+개 핵심 자산(DB·소스코드·계약서·재무)을 보안등급별로 분류 관리합니다" },
      { icon: "📊", title: "컴플라이언스 리포트", desc: "감사 대비 증적 자료와 대응 이력을 자동 생성하여 규제 준수를 지원합니다" },
    ],
    metrics: [
      { value: "1,800", label: "모니터링 대상" },
      { value: "40+", label: "핵심 자산 분류" },
      { value: "< 5분", label: "위협 탐지 시간" },
      { value: "10단계", label: "대응 플레이북" },
    ],
    process: [
      { step: "01", title: "행위 수집", desc: "파일·네트워크·권한 이벤트 실시간 수집" },
      { step: "02", title: "AI 분석", desc: "리스크 스코어링 · 이상 패턴 탐지" },
      { step: "03", title: "의도 추론", desc: "실수 vs 의도적 유출 판단" },
      { step: "04", title: "자동 대응", desc: "플레이북 기반 조치 실행" },
    ],
    cta: "프로토타입 체험하기",
    bizPlan: "/docs/IRIS_사업기획서_KT제안.md",
  },
  firewall: {
    badge: "AI GOVERNANCE",
    title: "AI\n방화벽",
    subtitle: "Enterprise AI Firewall",
    tagline: "기업의 AI 사용을 통제하고 위협을 차단합니다",
    hero: "25개 이상의 AI 도구 사용을 실시간 모니터링.\n기밀 데이터 유출을 원천 차단하고, 승인된 AI만 허용합니다.",
    problem: {
      title: "Shadow AI의 위험",
      points: [
        { num: "01", title: "데이터 유출", desc: "직원 68%가 회사 데이터를 외부 AI에 입력, 학습 데이터로 활용될 위험" },
        { num: "02", title: "거버넌스 부재", desc: "AI 도구 25개 이상 사용되지만 90%는 보안 검증 미완료" },
        { num: "03", title: "위협 다변화", desc: "프롬프트 인젝션·모델 추출·악성 이메일 등 AI 특화 공격 증가" },
        { num: "04", title: "규제 리스크", desc: "AI 규제법 강화로 사용 이력·데이터 처리 추적 의무화" },
      ],
    },
    features: [
      { icon: "🛡️", title: "AI 도구 관제", desc: "ChatGPT·Claude·Gemini 등 25+ AI 도구의 접속·사용량·위험도를 실시간 모니터링합니다" },
      { icon: "🚫", title: "정책 기반 차단", desc: "도구별·부서별·데이터 유형별 접근 정책을 설정하고 위반 시 자동 차단합니다" },
      { icon: "🔍", title: "위협 탐지 엔진", desc: "악성 이메일·프롬프트 인젝션·모델 추출 등 10종 AI 특화 위협을 탐지합니다" },
      { icon: "📊", title: "부서별 분석", desc: "10개 부서별 AI 사용 패턴·위험 프로필·정책 준수율을 대시보드로 제공합니다" },
      { icon: "⚡", title: "자동 대응", desc: "격리·차단·포렌식·외부 기관 신고까지 15+ 대응 액션을 자동 실행합니다" },
      { icon: "📋", title: "감사 추적", desc: "AI 사용 이력과 위협 대응 로그를 자동 기록하여 규제 감사에 대비합니다" },
    ],
    metrics: [
      { value: "25+", label: "AI 도구 관제" },
      { value: "10종", label: "위협 유형 탐지" },
      { value: "15+", label: "자동 대응 액션" },
      { value: "실시간", label: "차단 속도" },
    ],
    process: [
      { step: "01", title: "AI 트래픽 감지", desc: "모든 AI 도구 접속·데이터 전송 모니터링" },
      { step: "02", title: "정책 검증", desc: "허용/차단/모니터링 정책 자동 적용" },
      { step: "03", title: "위협 분석", desc: "YARA·DLP·샌드박스 기반 위협 탐지" },
      { step: "04", title: "자동 대응", desc: "격리·차단·알림·포렌식 실행" },
    ],
    cta: "프로토타입 체험하기",
  },
  crawling: {
    badge: "DATA PLATFORM",
    title: "데이터\n크롤링 센터",
    subtitle: "AI-Powered Data Collection",
    tagline: "수주 걸리던 데이터 수집을 수분으로 단축합니다",
    hero: "도메인과 목적을 입력하면 AI가 최적 데이터 소스를 추천.\n자동 크롤링부터 정제·구조화·데이터셋 구축까지 원스톱으로.",
    problem: {
      title: "데이터 수집의 병목",
      points: [
        { num: "01", title: "소스 탐색", desc: "도메인에 맞는 신뢰할 수 있는 데이터 소스 찾기에 수일 소요" },
        { num: "02", title: "수동 수집", desc: "각 소스별 크롤러 개발·유지보수에 엔지니어 리소스 낭비" },
        { num: "03", title: "비정형 데이터", desc: "수집한 원본 데이터를 AI 학습에 쓸 수 있는 형태로 변환 어려움" },
        { num: "04", title: "품질 관리", desc: "중복·누락·오류 데이터 필터링에 추가 시간과 비용 발생" },
      ],
    },
    features: [
      { icon: "🤖", title: "AI 소스 추천", desc: "도메인·목적을 분석하여 필수/추천/창의적 데이터 소스를 3단계로 추천합니다" },
      { icon: "🔥", title: "자동 크롤링", desc: "Firecrawl 기반으로 웹·API·RSS·파일 등 다양한 소스를 자동 수집합니다" },
      { icon: "🧠", title: "AI 정제·구조화", desc: "비정형 원본 데이터에서 핵심 정보를 추출하고 구조화된 JSON/CSV로 변환합니다" },
      { icon: "📦", title: "데이터셋 빌더", desc: "수집된 데이터를 프로젝트별 데이터셋으로 묶고 CSV/JSON 다운로드를 제공합니다" },
      { icon: "🏛️", title: "공공 데이터 연동", desc: "공공데이터포털·KOSIS·기상청 등 신뢰할 수 있는 공공 소스 바로가기를 지원합니다" },
      { icon: "📊", title: "사용량 관리", desc: "월간 크롤링 사용량을 추적하고 한도 초과 전 알림을 제공합니다" },
    ],
    metrics: [
      { value: "3단계", label: "AI 소스 추천" },
      { value: "4종", label: "소스 유형 지원" },
      { value: "수분", label: "데이터셋 구축" },
      { value: "500회/월", label: "무료 크롤링" },
    ],
    process: [
      { step: "01", title: "프로젝트 생성", desc: "도메인·업무 목적 입력" },
      { step: "02", title: "AI 소스 추천", desc: "필수/추천/창의적 소스 자동 제안" },
      { step: "03", title: "자동 수집·정제", desc: "크롤링 → AI 추출 → 구조화" },
      { step: "04", title: "데이터셋 구축", desc: "CSV/JSON 다운로드 · 분석 활용" },
    ],
    cta: "프로토타입 체험하기",
  },
  aidata: {
    badge: "DATA PRODUCT",
    title: "AI Ready\nData",
    subtitle: "Domain-Specific Data Platform",
    tagline: "AI Agent 개발에 필요한 데이터를 즉시 제공합니다",
    hero: "보험·손해사정 도메인 특화 8개 데이터셋.\n판례·도로·사고통계·기상 데이터를 수집·정제·검증하여\n94%+ 품질의 AI Ready 데이터 자산으로 판매합니다.",
    problem: {
      title: "AI 데이터의 현실",
      points: [
        { num: "01", title: "데이터 부재", desc: "도메인 특화 AI 구축에 필요한 정제된 데이터셋이 시장에 없음" },
        { num: "02", title: "구축 기간", desc: "자체 데이터 파이프라인 구축에 3-6개월, 전문 인력 필요" },
        { num: "03", title: "품질 미달", desc: "공공 데이터 그대로는 누락·비정형·비일관 데이터로 AI 학습 불가" },
        { num: "04", title: "유지 비용", desc: "데이터 갱신·품질 모니터링·파이프라인 운영에 지속적 비용 발생" },
      ],
    },
    features: [
      { icon: "📦", title: "8개 전문 데이터셋", desc: "판례·도로인프라·사고통계·기상·차량안전·분쟁판정·과실도표까지 보험 도메인 완전 커버" },
      { icon: "✅", title: "4대 품질 지표", desc: "정확도·완전성·일관성·적시성을 자동 측정하여 94%+ 품질을 보장합니다" },
      { icon: "🔄", title: "6개 자동 파이프라인", desc: "대법원·TAAS·기상청·국토부 등 6개 소스에서 매일 자동 수집·갱신합니다" },
      { icon: "🧠", title: "지식 그래프", desc: "사고유형↔과실비율↔판례↔도로조건을 엔티티 단위로 연결합니다" },
      { icon: "🔌", title: "REST API 제공", desc: "JSON/CSV/Parquet/GeoJSON 포맷으로 API를 통해 즉시 활용 가능합니다" },
      { icon: "💰", title: "구독 기반 판매", desc: "Basic 100만원부터 Premium 500만원까지 기업 규모에 맞는 플랜을 제공합니다" },
    ],
    metrics: [
      { value: "4.6M+", label: "총 레코드 수" },
      { value: "94.6%", label: "평균 품질 점수" },
      { value: "8종", label: "전문 데이터셋" },
      { value: "6개", label: "자동 파이프라인" },
    ],
    process: [
      { step: "01", title: "자동 수집", desc: "6개 파이프라인 · 7개 소스 매일 크롤링" },
      { step: "02", title: "정제·구조화", desc: "NLP + 도메인 스키마 · 엔티티 추출" },
      { step: "03", title: "품질 검증", desc: "4대 지표 자동 측정 · SME 검증" },
      { step: "04", title: "서빙·판매", desc: "API/다운로드 · 구독 플랜 제공" },
    ],
    cta: "프로토타입 체험하기",
  },
};

// ─── 스타일 상수 ───
const FONT = "'Pretendard','Noto Sans KR',sans-serif";
const MONO = "'DM Mono','JetBrains Mono',monospace";
const C = { bg: "#fafafa", dark: "#0a0a0f", text: "#1a1a1a", sub: "#555", muted: "#999", border: "#e5e5e5", accent: "#1a1a1a", white: "#fff" };

function FadeIn({ children, delay = 0, style }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setTimeout(() => setVis(true), delay); ob.disconnect(); } }, { threshold: 0.15 });
    ob.observe(el);
    return () => ob.disconnect();
  }, [delay]);
  return <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(30px)", transition: "all .7s cubic-bezier(.16,1,.3,1)", ...style }}>{children}</div>;
}

// ─── 마크다운 뷰어 (사업기획서용) ───
function BizPlanViewer({ url, onClose }) {
  const [md, setMd] = useState("");
  const [loading, setLoading] = useState(true);
  const [toc, setToc] = useState([]);
  const contentRef = useRef(null);

  useEffect(() => {
    fetch(url).then(r => r.text()).then(t => {
      setMd(t);
      // TOC 추출
      const heads = [];
      t.split("\n").forEach(line => {
        const m2 = line.match(/^## (\d+)\. (.+)/);
        const m3 = line.match(/^### (\d+-\d+)\. (.+)/);
        if (m2) heads.push({ level: 2, num: m2[1], text: m2[2], id: "s" + m2[1] });
        else if (m3) heads.push({ level: 3, num: m3[1], text: m3[2], id: "s" + m3[1].replace(".", "-") });
      });
      setToc(heads);
      setLoading(false);
    }).catch(() => { setMd("문서를 불러올 수 없습니다."); setLoading(false); });
  }, [url]);

  const scrollTo = (id) => {
    const el = contentRef.current?.querySelector("#" + id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toHtml = (text) => {
    let html = text;
    // 코드 블록 (먼저 처리)
    html = html.replace(/```([\s\S]*?)```/g, (_, code) => {
      const escaped = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      return `<pre style="background:#0f172a;color:#e2e8f0;padding:20px 24px;border-radius:12px;font-size:12px;overflow-x:auto;line-height:1.7;margin:20px 0;font-family:'JetBrains Mono',monospace;border:1px solid #1e293b">${escaped}</pre>`;
    });
    // 헤딩
    html = html.replace(/^#### (.+)$/gm, '<h4 style="font-size:14px;font-weight:700;margin:24px 0 10px;color:#1e293b;display:flex;align-items:center;gap:8px"><span style="display:inline-block;width:4px;height:16px;background:#6366f1;border-radius:2px"></span>$1</h4>');
    html = html.replace(/^### (\d+-\d+)\. (.+)$/gm, '<h3 id="s$1" style="font-size:15px;font-weight:700;margin:32px 0 14px;color:#1e293b;padding-bottom:10px;border-bottom:1px solid #e2e8f0">$1. $2</h3>');
    html = html.replace(/^### (.+)$/gm, '<h3 style="font-size:15px;font-weight:700;margin:32px 0 14px;color:#1e293b;padding-bottom:10px;border-bottom:1px solid #e2e8f0">$1</h3>');
    html = html.replace(/^## (\d+)\. (.+)$/gm, '<h2 id="s$1" style="font-size:22px;font-weight:800;margin:56px 0 20px;color:#0a0a0f;padding:16px 0 12px;border-bottom:3px solid #0a0a0f;letter-spacing:-0.5px">$1. $2</h2>');
    html = html.replace(/^## (.+)$/gm, '<h2 style="font-size:22px;font-weight:800;margin:56px 0 20px;color:#0a0a0f;padding:16px 0 12px;border-bottom:3px solid #0a0a0f">$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<div style="margin-bottom:32px"><h1 style="font-size:32px;font-weight:900;color:#0a0a0f;letter-spacing:-1px;line-height:1.2;margin:0">$1</h1></div>');
    // 볼드
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight:700;color:#0f172a">$1</strong>');
    // 테이블
    html = html.replace(/\|(.+)\|/g, (match) => {
      const cells = match.split("|").filter(c => c.trim() !== "");
      if (cells.every(c => /^[\s:-]+$/.test(c))) return '<tr class="sep"></tr>';
      return `<tr>${cells.map(c => `<td>${c.trim()}</td>`).join("")}</tr>`;
    });
    html = html.replace(/(<tr>[\s\S]*?<\/tr>\s*(<tr class="sep"><\/tr>)\s*<tr>[\s\S]*?)+/g, (match) => {
      const rows = match.split("\n").filter(r => r.trim() && !r.includes('class="sep"'));
      if (rows.length === 0) return match;
      const firstRow = rows[0];
      const restRows = rows.slice(1);
      const headerRow = firstRow.replace(/<td>/g, '<th>').replace(/<\/td>/g, '</th>');
      return `<div style="overflow-x:auto;margin:16px 0;border-radius:10px;border:1px solid #e2e8f0"><table class="bp-table"><thead>${headerRow}</thead><tbody>${restRows.join("\n")}</tbody></table></div>`;
    });
    // 남은 단독 테이블
    html = html.replace(/(<tr>.*?<\/tr>\n?)+/g, (match) => {
      if (match.includes('<table')) return match;
      const rows = match.split("\n").filter(r => r.trim() && !r.includes('class="sep"'));
      if (rows.length === 0) return match;
      const headerRow = rows[0].replace(/<td>/g, '<th>').replace(/<\/td>/g, '</th>');
      const restRows = rows.slice(1);
      return `<div style="overflow-x:auto;margin:16px 0;border-radius:10px;border:1px solid #e2e8f0"><table class="bp-table"><thead>${headerRow}</thead><tbody>${restRows.join("\n")}</tbody></table></div>`;
    });
    // 인용
    html = html.replace(/^> (.+)$/gm, '<blockquote style="border-left:4px solid #6366f1;padding:14px 20px;margin:20px 0;background:linear-gradient(135deg,#f8fafc,#eef2ff);border-radius:0 10px 10px 0;font-size:13.5px;color:#334155;line-height:1.7">$1</blockquote>');
    // 구분선
    html = html.replace(/^---$/gm, '<hr style="border:none;border-top:1px solid #e2e8f0;margin:40px 0">');
    // 리스트
    html = html.replace(/^- (.+)$/gm, '<div style="display:flex;gap:8px;margin:5px 0 5px 8px;font-size:13px;color:#334155;line-height:1.6"><span style="color:#6366f1;font-weight:700">•</span><span>$1</span></div>');
    html = html.replace(/^(\d+)\. (.+)$/gm, '<div style="display:flex;gap:8px;margin:5px 0 5px 8px;font-size:13px;color:#334155;line-height:1.6"><span style="color:#6366f1;font-weight:700;min-width:16px">$1.</span><span>$2</span></div>');
    // 줄바꿈
    html = html.replace(/\n\n/g, '<div style="height:12px"></div>');
    html = html.replace(/\n/g, '<br/>');
    return html;
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,.6)", backdropFilter: "blur(4px)", display: "flex", justifyContent: "center", alignItems: "flex-start", overflow: "auto", padding: "24px 16px" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, maxWidth: 1040, width: "100%", maxHeight: "calc(100vh - 48px)", display: "flex", flexDirection: "column", boxShadow: "0 25px 60px rgba(0,0,0,.3)", overflow: "hidden" }}>
        {/* 헤더 */}
        <div style={{ flexShrink: 0, background: "linear-gradient(135deg,#0a0a0f,#1e293b)", padding: "20px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#6366f1,#818cf8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 900, color: "#fff" }}>IR</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#f1f5f9", fontFamily: FONT, letterSpacing: "-0.3px" }}>IRIS 사업기획서</div>
              <div style={{ fontSize: 11, color: "#64748b", fontFamily: FONT }}>Internal Risk Identification System — KT 제안</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ padding: "5px 12px", borderRadius: 6, background: "rgba(99,102,241,.15)", color: "#818cf8", fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>2026.04</div>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,.1)", border: "none", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, cursor: "pointer", color: "#94a3b8", transition: "all .2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,.2)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,.1)"}>×</button>
          </div>
        </div>

        {/* 본문 영역 */}
        <div ref={contentRef} style={{ flex: 1, overflow: "auto", padding: "32px 40px 60px", fontFamily: FONT }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: 80, color: "#999" }}>
              <div style={{ width: 40, height: 40, border: "3px solid #e2e8f0", borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
              불러오는 중...
            </div>
          ) : (
            <>
              {/* TOC */}
              {toc.length > 0 && (
                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 14, padding: "20px 24px", marginBottom: 40 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#94a3b8", marginBottom: 12, textTransform: "uppercase" }}>Contents</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {toc.map((h, i) => (
                      <button key={i} onClick={() => scrollTo(h.id)}
                        style={{ background: "none", border: "none", textAlign: "left", cursor: "pointer", fontFamily: FONT, fontSize: 13, color: h.level === 2 ? "#1e293b" : "#64748b", fontWeight: h.level === 2 ? 700 : 500, padding: "4px 8px", paddingLeft: h.level === 3 ? 24 : 8, borderRadius: 6, transition: "all .15s" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#e2e8f0"}
                        onMouseLeave={e => e.currentTarget.style.background = "none"}>
                        {h.level === 3 ? "└ " : ""}{h.num}. {h.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div dangerouslySetInnerHTML={{ __html: toHtml(md) }} />
            </>
          )}
        </div>
      </div>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        .bp-table{width:100%;border-collapse:collapse;font-size:12.5px;font-family:${FONT}}
        .bp-table thead th{padding:10px 14px;text-align:left;font-weight:700;background:#f1f5f9;color:#0f172a;border-bottom:2px solid #cbd5e1;font-size:11.5px;letter-spacing:0.3px;white-space:nowrap}
        .bp-table tbody td{padding:10px 14px;text-align:left;border-bottom:1px solid #f1f5f9;color:#334155;line-height:1.6;vertical-align:top}
        .bp-table tbody tr:hover{background:#f8fafc}
        .bp-table tbody tr:last-child td{border-bottom:none}
      `}</style>
    </div>
  );
}

export default function Offering({ id, onBack, onEnter }) {
  const data = OFFERINGS[id];
  const [showBizPlan, setShowBizPlan] = useState(false);
  if (!data) return null;

  const sectionStyle = { maxWidth: 1080, margin: "0 auto", padding: "0 40px" };

  return (
    <div style={{ fontFamily: FONT, background: C.bg, color: C.text, minHeight: "100vh", overflowX: "hidden" }}>

      {/* ─── NAV ─── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "16px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(250,250,250,.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(0,0,0,.06)" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: C.sub, fontSize: 13, cursor: "pointer", fontFamily: FONT, fontWeight: 500 }}>← 포털</button>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: C.muted }}>{data.badge}</span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {data.bizPlan && <button onClick={() => setShowBizPlan(true)} style={{ padding: "8px 20px", borderRadius: 6, border: `1.5px solid ${C.dark}`, background: "transparent", color: C.dark, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>사업기획서</button>}
          <button onClick={onEnter} style={{ padding: "8px 20px", borderRadius: 6, border: "none", background: C.dark, color: C.white, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>{data.cta}</button>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section style={{ paddingTop: 140, paddingBottom: 100, ...sectionStyle }}>
        <FadeIn>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: C.muted, marginBottom: 24, fontFamily: MONO }}>{data.subtitle}</div>
          <h1 style={{ fontSize: "clamp(48px, 8vw, 80px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, color: C.text, marginBottom: 28, whiteSpace: "pre-line" }}>{data.title}</h1>
          <p style={{ fontSize: 18, color: C.sub, lineHeight: 1.8, maxWidth: 600, marginBottom: 40, whiteSpace: "pre-line" }}>{data.hero}</p>
          <div style={{ width: 60, height: 3, background: C.text, borderRadius: 2 }} />
        </FadeIn>
      </section>

      {/* ─── TAGLINE BANNER ─── */}
      <section style={{ background: C.dark, padding: "80px 0" }}>
        <FadeIn style={sectionStyle}>
          <p style={{ fontSize: "clamp(22px, 3.5vw, 36px)", fontWeight: 700, color: C.white, lineHeight: 1.5, textAlign: "center", letterSpacing: -0.5 }}>{data.tagline}</p>
        </FadeIn>
      </section>

      {/* ─── PROBLEM ─── */}
      <section style={{ padding: "100px 0", ...sectionStyle }}>
        <FadeIn>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: C.muted, marginBottom: 12, fontFamily: MONO }}>THE PROBLEM</div>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 48, letterSpacing: -0.5 }}>{data.problem.title}</h2>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 32 }}>
          {data.problem.points.map((p, i) => (
            <FadeIn key={i} delay={i * 100}>
              <div style={{ borderTop: "2px solid #1a1a1a", paddingTop: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 8, fontFamily: MONO }}>{p.num}</div>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{p.title}</div>
                <div style={{ fontSize: 13, color: C.sub, lineHeight: 1.7 }}>{p.desc}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ─── METRICS ─── */}
      <section style={{ background: C.dark, padding: "80px 0" }}>
        <div style={sectionStyle}>
          <FadeIn>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40, textAlign: "center" }}>
              {data.metrics.map((m, i) => (
                <div key={i}>
                  <div style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 800, color: C.white, lineHeight: 1, marginBottom: 8, fontFamily: MONO }}>{m.value}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)", fontWeight: 500 }}>{m.label}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section style={{ padding: "100px 0", ...sectionStyle }}>
        <FadeIn>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: C.muted, marginBottom: 12, fontFamily: MONO }}>CAPABILITIES</div>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 56, letterSpacing: -0.5 }}>핵심 기능</h2>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 40 }}>
          {data.features.map((f, i) => (
            <FadeIn key={i} delay={i * 80}>
              <div style={{ paddingBottom: 32, borderBottom: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 28, marginBottom: 14 }}>{f.icon}</div>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: C.sub, lineHeight: 1.7 }}>{f.desc}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ─── PROCESS ─── */}
      <section style={{ background: "#f0f0f0", padding: "100px 0" }}>
        <div style={sectionStyle}>
          <FadeIn>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: C.muted, marginBottom: 12, fontFamily: MONO }}>HOW IT WORKS</div>
            <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 56, letterSpacing: -0.5 }}>작동 방식</h2>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
            {data.process.map((p, i) => (
              <FadeIn key={i} delay={i * 120}>
                <div style={{ background: C.white, borderRadius: 12, padding: 28, position: "relative" }}>
                  <div style={{ fontSize: 48, fontWeight: 800, color: "rgba(0,0,0,.06)", position: "absolute", top: 12, right: 16, fontFamily: MONO }}>{p.step}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.muted, marginBottom: 12, fontFamily: MONO }}>STEP {p.step}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{p.title}</div>
                  <div style={{ fontSize: 13, color: C.sub, lineHeight: 1.6 }}>{p.desc}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section style={{ padding: "100px 0", textAlign: "center", ...sectionStyle }}>
        <FadeIn>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: C.muted, marginBottom: 16, fontFamily: MONO }}>PROTOTYPE</div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, marginBottom: 16, letterSpacing: -0.5 }}>직접 체험해보세요</h2>
          <p style={{ fontSize: 14, color: C.sub, marginBottom: 36 }}>실제 작동하는 프로토타입을 바로 사용할 수 있습니다</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={onEnter} style={{ padding: "16px 48px", borderRadius: 8, border: "none", background: C.dark, color: C.white, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: FONT, letterSpacing: 0.5, transition: "all .2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#333"}
              onMouseLeave={e => e.currentTarget.style.background = C.dark}>
              {data.cta} →
            </button>
            {data.bizPlan && (
              <button onClick={() => setShowBizPlan(true)} style={{ padding: "16px 48px", borderRadius: 8, border: `2px solid ${C.dark}`, background: "transparent", color: C.dark, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: FONT, letterSpacing: 0.5, transition: "all .2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = C.dark; e.currentTarget.style.color = C.white; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.dark; }}>
                사업기획서 →
              </button>
            )}
          </div>
        </FadeIn>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: "32px 0", textAlign: "center" }}>
        <div style={{ fontSize: 11, color: C.muted }}>© 2025 kt ds AX BD · Deny MVP Portal</div>
      </footer>

      {/* ─── 사업기획서 모달 ─── */}
      {showBizPlan && data.bizPlan && (
        <BizPlanViewer url={data.bizPlan} onClose={() => setShowBizPlan(false)} />
      )}
    </div>
  );
}
