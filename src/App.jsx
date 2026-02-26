import { useState } from "react";
import ClaimsAgentMVP from "./ClaimsAgent.jsx";
import SecurityDashboard from "./SecurityDashboard.jsx";

const agents = [
  {
    id: "claims",
    title: "AI 손해사정 Agent",
    sub: "Auto Claims · 견적·과실·처리방법",
    desc: "사고 접수부터 견적 산정, 과실비율 분석, 최적 처리방법 추천까지 손해사정 업무 전 과정을 AI가 지원합니다.",
    icon: "🚗",
    color: "#0891b2",
    gradient: "linear-gradient(135deg,#0891b2,#7c3aed)",
    tags: ["견적 산정", "과실 분석", "처리 제안", "판례 매칭"],
    status: "운영 중",
  },
  {
    id: "security",
    title: "정보유출 탐지 Agent",
    sub: "Insider Threat · 이상행위 탐지",
    desc: "1,800명 임직원의 실시간 행동을 모니터링하여 내부 정보 유출 위험자를 AI가 자동 식별하고 조치를 추천합니다.",
    icon: "🛡️",
    color: "#ff2d55",
    gradient: "linear-gradient(135deg,#ff2d55,#ff6b35)",
    tags: ["실시간 탐지", "위험도 분석", "조치 추천", "Excel 리포트"],
    status: "운영 중",
  },
  {
    id: "coming1",
    title: "계약 분석 Agent",
    sub: "Contract Analysis · 조항 검토",
    desc: "계약서를 업로드하면 핵심 조항, 리스크 포인트, 누락 사항을 AI가 자동 분석합니다.",
    icon: "📋",
    color: "#6366f1",
    gradient: "linear-gradient(135deg,#6366f1,#8b5cf6)",
    tags: ["조항 분석", "리스크 탐지", "비교 검토"],
    status: "준비 중",
  },
  {
    id: "coming2",
    title: "고객 상담 Agent",
    sub: "Customer Support · 상담 자동화",
    desc: "고객 문의를 자동 분류하고 최적의 응대 스크립트와 해결 방안을 AI가 실시간으로 제안합니다.",
    icon: "💬",
    color: "#059669",
    gradient: "linear-gradient(135deg,#059669,#10b981)",
    tags: ["자동 분류", "스크립트 생성", "감정 분석"],
    status: "준비 중",
  },
];

export default function App() {
  const [page, setPage] = useState("portal"); // "portal" | "claims" | "security"

  if (page === "claims") return <ClaimsAgentMVP onBack={() => setPage("portal")} />;
  if (page === "security") return <SecurityDashboard onBack={() => setPage("portal")} />;

  // DMP Portal
  return (
    <div style={{ width: "100%", minHeight: "100vh", fontFamily: "'Noto Sans KR',-apple-system,sans-serif", background: "linear-gradient(155deg,#f8fafc,#f0f9ff 30%,#faf5ff 60%,#f0fdf4 90%)", color: "#0f172a" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');
        @keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px}`}</style>

      {/* Header */}
      <div style={{ padding: "16px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #e2e8f0", background: "rgba(255,255,255,.85)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#0891b2,#7c3aed,#059669)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 16, fontWeight: 800, boxShadow: "0 4px 12px rgba(8,145,178,.25)" }}>D</div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: -.3 }}>
              <span style={{ background: "linear-gradient(135deg,#0891b2,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>DMP</span>
              <span style={{ color: "#334155", marginLeft: 6 }}>AI Agent Portal</span>
            </div>
            <div style={{ color: "#94a3b8", fontSize: 10, letterSpacing: .5, marginTop: 1 }}>Decision Making Platform · kt ds AX BD팀</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ padding: "5px 12px", borderRadius: 20, background: "#f0fdf4", border: "1px solid #bbf7d0", fontSize: 11, color: "#16a34a", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 6px #4ade80" }} />
            System Active
          </div>
          <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'DM Mono',monospace" }}>
            {new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}
          </div>
        </div>
      </div>

      {/* Hero */}
      <div style={{ padding: "48px 40px 32px", textAlign: "center", animation: "fadeIn .6s ease" }}>
        <div style={{ fontSize: 13, color: "#0891b2", fontWeight: 600, letterSpacing: 1, marginBottom: 8 }}>AI-POWERED DECISION SUPPORT</div>
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 10px", letterSpacing: -1, lineHeight: 1.3 }}>
          업무별 <span style={{ background: "linear-gradient(135deg,#0891b2,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI Agent</span>를 선택하세요
        </h1>
        <p style={{ color: "#64748b", fontSize: 14.5, maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
          각 Agent는 업무 도메인에 특화된 AI 분석·추천·자동화 기능을 제공합니다.
        </p>
      </div>

      {/* Agent Cards Grid */}
      <div style={{ padding: "0 40px 48px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, maxWidth: 960, margin: "0 auto" }}>
        {agents.map((a, idx) => {
          const isActive = a.status === "운영 중";
          return (
            <div
              key={a.id}
              onClick={() => isActive && setPage(a.id)}
              style={{
                background: "#fff", borderRadius: 18, padding: "28px 26px", border: "1px solid #e2e8f0",
                cursor: isActive ? "pointer" : "default", transition: "all .25s", position: "relative", overflow: "hidden",
                opacity: isActive ? 1 : .55, animation: `fadeIn ${.3 + idx * .12}s ease`,
              }}
              onMouseEnter={e => { if (isActive) { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 12px 32px ${a.color}15`; e.currentTarget.style.borderColor = a.color + "40"; }}}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
            >
              {/* Status Badge */}
              <div style={{ position: "absolute", top: 16, right: 16, display: "flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 12, background: isActive ? "#f0fdf4" : "#f8fafc", border: `1px solid ${isActive ? "#bbf7d0" : "#e2e8f0"}`, fontSize: 10, fontWeight: 600, color: isActive ? "#16a34a" : "#94a3b8" }}>
                {isActive && <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#4ade80" }} />}
                {a.status}
              </div>

              {/* Icon + Title */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: a.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, boxShadow: `0 6px 20px ${a.color}25`, animation: isActive ? "float 3s ease-in-out infinite" : "none" }}>
                  {a.icon}
                </div>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: "#0f172a" }}>{a.title}</div>
                  <div style={{ fontSize: 11.5, color: "#94a3b8", marginTop: 1 }}>{a.sub}</div>
                </div>
              </div>

              {/* Description */}
              <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7, margin: "0 0 16px" }}>{a.desc}</p>

              {/* Tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 18 }}>
                {a.tags.map((t, i) => (
                  <span key={i} style={{ padding: "3px 10px", borderRadius: 12, fontSize: 10.5, fontWeight: 600, background: a.color + "08", color: a.color, border: `1px solid ${a.color}15` }}>{t}</span>
                ))}
              </div>

              {/* CTA */}
              {isActive ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 0", borderRadius: 10, background: a.gradient, color: "#fff", fontSize: 13, fontWeight: 700, letterSpacing: .3 }}>
                  Agent 실행
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 0", borderRadius: 10, background: "#f8fafc", color: "#94a3b8", fontSize: 13, fontWeight: 600, border: "1px solid #e2e8f0" }}>
                  Coming Soon
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ padding: "20px 40px", borderTop: "1px solid #e2e8f0", textAlign: "center", color: "#94a3b8", fontSize: 11 }}>
        © 2025 kt ds AX BD팀 · DMP AI Agent Portal · Prototype v1.0
      </div>
    </div>
  );
}
