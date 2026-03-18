import { useState } from "react";
import ClaimsAgentMVP from "./ClaimsAgent.jsx";
import SecurityDashboard from "./SecurityDashboard.jsx";
import AIFirewall from "./AIFirewall.jsx";
import StockPilot from "./StockPilot.jsx";
import ClaimsAgentNew from "./ClaimsAgentNew.jsx";

const THEMES = {
  dark: {
    id:"dark", label:"🌙 현행 (다크)", short:"다크",
    bg:"#0a0a0f", text:"#fff", sub:"rgba(255,255,255,.45)", muted:"rgba(255,255,255,.25)", faint:"rgba(255,255,255,.15)",
    headerBg:"rgba(10,10,15,.85)", cardBg:"transparent", cardText:"#fff",
    inputBg:"rgba(255,255,255,.05)", inputBorder:"rgba(255,255,255,.1)", inputText:"#fff",
    modalBg:"#16161e", modalBorder:"rgba(255,255,255,.08)",
    accent:"#10b981", accentGlow:"rgba(16,185,129,.3)",
    gridColor:"rgba(255,255,255,0.02)", gridGlow1:"rgba(16,185,129,0.06)", gridGlow2:"rgba(99,102,241,0.04)",
    tagBg:"rgba(255,255,255,.05)", tagText:"rgba(255,255,255,.35)", tagBorder:"rgba(255,255,255,.06)",
    divider:"rgba(255,255,255,.06)", scrollThumb:"rgba(255,255,255,.1)",
    ctaBg:"linear-gradient(135deg,rgba(16,185,129,.06),rgba(6,182,212,.04))", ctaBorder:"rgba(16,185,129,.12)",
    reqCardBg:"rgba(255,255,255,.02)", reqCardBorder:"rgba(255,255,255,.1)",
    selectBg:"#1a1a2e", placeholder:"rgba(255,255,255,.25)",
    listBg:"#12121a", listItemBg:"rgba(255,255,255,.02)", listBorder:"rgba(255,255,255,.06)",
  },
  light: {
    id:"light", label:"☀️ 밝은 (라이트)", short:"라이트",
    bg:"#f8fafc", text:"#0f172a", sub:"#64748b", muted:"#94a3b8", faint:"#cbd5e1",
    headerBg:"rgba(255,255,255,.92)", cardBg:"#fff", cardText:"#0f172a",
    inputBg:"#fff", inputBorder:"#e2e8f0", inputText:"#0f172a",
    modalBg:"#fff", modalBorder:"#e2e8f0",
    accent:"#059669", accentGlow:"rgba(5,150,105,.2)",
    gridColor:"rgba(0,0,0,0.03)", gridGlow1:"rgba(16,185,129,0.04)", gridGlow2:"rgba(99,102,241,0.03)",
    tagBg:"#f1f5f9", tagText:"#475569", tagBorder:"#e2e8f0",
    divider:"#e2e8f0", scrollThumb:"#cbd5e1",
    ctaBg:"linear-gradient(135deg,rgba(16,185,129,.04),rgba(6,182,212,.03))", ctaBorder:"#d1fae5",
    reqCardBg:"#fff", reqCardBorder:"#e2e8f0",
    selectBg:"#fff", placeholder:"#94a3b8",
    listBg:"#fff", listItemBg:"#f8fafc", listBorder:"#e2e8f0",
  },
  pro: {
    id:"pro", label:"🏢 전문 (네이비)", short:"전문",
    bg:"#0c1222", text:"#e2e8f0", sub:"#8892a4", muted:"#5a6578", faint:"#3a4358",
    headerBg:"rgba(12,18,34,.92)", cardBg:"rgba(255,255,255,.03)", cardText:"#e2e8f0",
    inputBg:"rgba(255,255,255,.06)", inputBorder:"rgba(255,255,255,.1)", inputText:"#e2e8f0",
    modalBg:"#141c30", modalBorder:"rgba(255,255,255,.08)",
    accent:"#3b82f6", accentGlow:"rgba(59,130,246,.3)",
    gridColor:"rgba(255,255,255,0.015)", gridGlow1:"rgba(59,130,246,0.05)", gridGlow2:"rgba(139,92,246,0.03)",
    tagBg:"rgba(59,130,246,.08)", tagText:"#93c5fd", tagBorder:"rgba(59,130,246,.15)",
    divider:"rgba(255,255,255,.06)", scrollThumb:"rgba(255,255,255,.1)",
    ctaBg:"linear-gradient(135deg,rgba(59,130,246,.06),rgba(99,102,241,.04))", ctaBorder:"rgba(59,130,246,.15)",
    reqCardBg:"rgba(255,255,255,.02)", reqCardBorder:"rgba(59,130,246,.12)",
    selectBg:"#1a2540", placeholder:"rgba(255,255,255,.2)",
    listBg:"#111827", listItemBg:"rgba(255,255,255,.03)", listBorder:"rgba(255,255,255,.06)",
  },
};

const MVPS = [
  {
    id: "security",
    category: "SECURITY",
    catColor: "#10b981",
    icon: "🛡️",
    iconBg: "linear-gradient(135deg,#ef4444,#f97316)",
    title: "내부 정보 유출 위험자 식별",
    desc: "1,800명 임직원 이상행위 탐지 · AI 의도 추론 · 조치 추천까지 제공하는 실시간 보안 위험 모니터링 대시보드",
    tags: ["보안관제", "AI분석", "실시간"],
    date: "2025.02",
    status: "Live",
    gradient: "linear-gradient(135deg,rgba(16,185,129,0.08),rgba(6,182,212,0.06))",
    border: "rgba(16,185,129,0.2)",
  },
  {
    id: "stockpilot",
    category: "FINANCE",
    catColor: "#6366f1",
    icon: "📊",
    iconBg: "linear-gradient(135deg,#6366f1,#8b5cf6)",
    title: "StockPilot 통합 자산관리",
    desc: "주식 포트폴리오 · 부동산/자동차 · 지출/연말정산 · AI진단 · 글로벌 시세까지 통합 관리하는 자산 관리 프로그램",
    tags: ["자산관리", "포트폴리오", "AI진단"],
    date: "2025.02",
    status: "Live",
    gradient: "linear-gradient(135deg,rgba(99,102,241,0.08),rgba(139,92,246,0.06))",
    border: "rgba(99,102,241,0.2)",
  },
  {
    id: "claims",
    category: "AI",
    catColor: "#f43f5e",
    icon: "🚗",
    iconBg: "linear-gradient(135deg,#f43f5e,#fb923c)",
    title: "AI 자동차 손해사정 Agent",
    desc: "견적 산정 · 과실비율 분석 · 처리방법 제안까지 AI가 의사결정을 지원하는 자동차 손해사정 포탈",
    tags: ["AI Agent", "손해사정", "AI진단"],
    date: "2025.02",
    status: "준비중",
    gradient: "linear-gradient(135deg,rgba(244,63,94,0.08),rgba(251,146,60,0.06))",
    border: "rgba(244,63,94,0.2)",
  },
  {
    id: "firewall",
    category: "SECURITY",
    catColor: "#3b82f6",
    icon: "🛡️",
    iconBg: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
    title: "AI 방화벽",
    desc: "기업 내 AI 도구 오남용 방지 · 외부 위협(패킷/이메일) 차단 · 내부 자산 보호를 위한 AI 기반 통합 보안 방화벽",
    tags: ["AI보안", "방화벽", "위협탐지"],
    date: "2025.03",
    status: "Live",
    gradient: "linear-gradient(135deg,rgba(59,130,246,0.08),rgba(29,78,216,0.06))",
    border: "rgba(59,130,246,0.2)",
  },
  {
    id: "claimsNew",
    category: "AI",
    catColor: "#f97316",
    icon: "🚗",
    iconBg: "linear-gradient(135deg,#f97316,#ea580c)",
    title: "AI 자동차 손해사정 (New)",
    desc: "견적 산정 · 과실비율 분석 · 처리방법 제안까지 AI가 의사결정을 지원하는 자동차 손해사정 포탈 (신규 개발 버전)",
    tags: ["AI Agent", "손해사정", "New"],
    date: "2025.03",
    status: "Live",
    gradient: "linear-gradient(135deg,rgba(249,115,22,0.08),rgba(234,88,12,0.06))",
    border: "rgba(249,115,22,0.2)",
  },
  {
    id: "claimsNewBackup",
    category: "AI",
    catColor: "#10b981",
    icon: "🚗",
    iconBg: "linear-gradient(135deg,#10b981,#059669)",
    title: "AI 자동차 손해사정 (시연버전)",
    desc: "20260318 DB자동차손해사정 시연버전",
    tags: ["AI Agent", "손해사정", "시연백업"],
    date: "2026.03",
    status: "Live",
    gradient: "linear-gradient(135deg,rgba(16,185,129,0.08),rgba(5,150,105,0.06))",
    border: "rgba(16,185,129,0.2)",
  },
  {
    id: "koreaJobs",
    category: "DATA",
    catColor: "#06b6d4",
    icon: "💼",
    iconBg: "linear-gradient(135deg,#06b6d4,#0891b2)",
    title: "대한민국 취업시장",
    desc: "2,880만 취업자를 175개 직업으로 시각화 · 고용전망 · 중위임금 · 학력요건 · AI 대체 위험도를 트리맵으로 분석하는 대시보드",
    tags: ["데이터시각화", "고용분석", "AI대체위험"],
    date: "2025.03",
    status: "Live",
    gradient: "linear-gradient(135deg,rgba(6,182,212,0.08),rgba(8,145,178,0.06))",
    border: "rgba(6,182,212,0.2)",
  },
];

export default function App() {
  const [page, setPage] = useState("portal");
  const [theme, setTheme] = useState("dark");
  const t = THEMES[theme];
  const [requestModal, setRequestModal] = useState(false);
  const [listModal, setListModal] = useState(false);
  const [reqForm, setReqForm] = useState({ name: "", team: "", email: "", category: "", title: "", desc: "", deadline: "" });
  const [reqDone, setReqDone] = useState(false);
  const [requests, setRequests] = useState([
    { id: 1, title: "AI방화벽", category: "Security", desc: "내부 네트워크 이상 트래픽을 AI로 탐지하고 자동 차단하는 방화벽 대시보드", name: "편길동", team: "Axbd", email: "hgd@kt.com@", date: "2026. 2. 26.", status: "접수" },
  ]);
  const [statusDropId, setStatusDropId] = useState(null);
  const STATUSES = ["접수", "검토중", "진행중", "완료", "보류"];
  const STATUS_COLORS = { "접수": "#10b981", "검토중": "#f59e0b", "진행중": "#3b82f6", "완료": "#6366f1", "보류": "#ef4444" };
  const CAT_COLORS = { "Security": "#10b981", "Finance": "#6366f1", "AI / ML": "#f43f5e", "Data": "#06b6d4", "DevOps": "#f59e0b", "기타": "#94a3b8" };

  if (page === "claims") return <ClaimsAgentMVP onBack={() => setPage("portal")} />;
  if (page === "security") return <SecurityDashboard onBack={() => setPage("portal")} />;
  if (page === "firewall") return <AIFirewall onBack={() => setPage("portal")} />;
  if (page === "claimsNew") return <ClaimsAgentNew onBack={() => setPage("portal")} />;
  if (page === "claimsNewBackup") return <ClaimsAgentNew onBack={() => setPage("portal")} />;
  if (page === "stockpilot") return <StockPilot onBack={() => setPage("portal")} />;
  if (page === "koreaJobs") return (
    <div style={{width:"100%",height:"100vh",position:"relative"}}>
      <button onClick={() => setPage("portal")} style={{position:"fixed",top:16,left:16,zIndex:100,padding:"8px 16px",borderRadius:10,border:"none",background:"rgba(0,0,0,.7)",backdropFilter:"blur(8px)",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>← 포털로 돌아가기</button>
      <iframe src="/korea-jobs.html" style={{width:"100%",height:"100%",border:"none"}} title="대한민국 취업시장"/>
    </div>
  );

  const handleRequest = () => {
    if (!reqForm.name.trim() || !reqForm.team.trim() || !reqForm.email.trim() || !reqForm.title.trim() || !reqForm.desc.trim()) return;
    setRequests(prev => [...prev, {
      id: Date.now(), title: reqForm.title, category: reqForm.category || "기타", desc: reqForm.desc,
      name: reqForm.name, team: reqForm.team, email: reqForm.email,
      date: new Date().toLocaleDateString("ko-KR"), status: "접수"
    }]);
    setReqDone(true);
    setTimeout(() => { setRequestModal(false); setReqDone(false); setReqForm({ name: "", team: "", email: "", category: "", title: "", desc: "", deadline: "" }); }, 2000);
  };

  const changeStatus = (id, status) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    setStatusDropId(null);
  };
  const deleteRequest = (id) => { setRequests(prev => prev.filter(r => r.id !== id)); };

  const formReady = reqForm.name.trim() && reqForm.team.trim() && reqForm.email.trim() && reqForm.title.trim() && reqForm.desc.trim();
  const inputStyle = { width: "100%", padding: "12px 14px", borderRadius: 10, background: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.inputText, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
  const labelStyle = { fontSize: 12, color: t.sub, fontWeight: 600, marginBottom: 6, display: "block" };

  return (
    <div style={{ width: "100%", minHeight: "100vh", fontFamily: "'Pretendard',-apple-system,'Noto Sans KR',sans-serif", background: t.bg, color: t.text, position: "relative", transition: "background .4s, color .4s" }}>
      <style>{`@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        @keyframes fadeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeInUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        @keyframes gridPulse{0%,100%{opacity:.03}50%{opacity:.06}}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${t.scrollThumb};border-radius:3px}
        input::placeholder,textarea::placeholder{color:${t.placeholder}}
        select option{background:${t.selectBg}}`}</style>

      {/* BG Grid */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, backgroundImage: `linear-gradient(${t.gridColor} 1px,transparent 1px),linear-gradient(90deg,${t.gridColor} 1px,transparent 1px)`, backgroundSize: "60px 60px", animation: "gridPulse 4s ease infinite" }} />
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, background: `radial-gradient(ellipse at 30% 20%,${t.gridGlow1} 0%,transparent 50%),radial-gradient(ellipse at 70% 80%,${t.gridGlow2} 0%,transparent 50%)` }} />

      {/* MVP 제작 의뢰 Modal */}
      {requestModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", backdropFilter: "blur(8px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => !reqDone && setRequestModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: t.modalBg, borderRadius: 20, padding: 32, width: 520, maxHeight: "85vh", overflowY: "auto", border: `1px solid ${t.modalBorder}`, boxShadow: "0 24px 64px rgba(0,0,0,.4)", animation: "fadeIn .3s" }}>
            {reqDone ? (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>의뢰가 접수되었습니다!</div>
                <div style={{ fontSize: 13, color: t.sub }}>AX BD팀이 빠르게 검토 후 연락드리겠습니다.</div>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 800 }}>MVP 제작 의뢰</div>
                    <div style={{ fontSize: 13, color: t.sub, marginTop: 4 }}>아이디어를 알려주시면 빠르게 프로토타입을 만들어드립니다.</div>
                  </div>
                  <button onClick={() => setRequestModal(false)} style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}`, borderRadius: 8, width: 32, height: 32, color: t.text, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>✕</button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {/* 이름 / 소속 팀 */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={labelStyle}>이름 *</label>
                      <input value={reqForm.name} onChange={e => setReqForm({ ...reqForm, name: e.target.value })} placeholder="홍길동" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>소속 팀 *</label>
                      <input value={reqForm.team} onChange={e => setReqForm({ ...reqForm, team: e.target.value })} placeholder="AX사업본부" style={inputStyle} />
                    </div>
                  </div>
                  {/* 이메일 / 카테고리 */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={labelStyle}>이메일 *</label>
                      <input value={reqForm.email} onChange={e => setReqForm({ ...reqForm, email: e.target.value })} placeholder="user@ktds.co.kr" type="email" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>카테고리</label>
                      <select value={reqForm.category} onChange={e => setReqForm({ ...reqForm, category: e.target.value })} style={{ ...inputStyle, appearance: "auto", cursor: "pointer" }}>
                        <option value="" style={{ background: t.selectBg }}>선택해주세요</option>
                        <option value="Security" style={{ background: t.selectBg }}>Security</option>
                        <option value="Finance" style={{ background: t.selectBg }}>Finance</option>
                        <option value="AI / ML" style={{ background: t.selectBg }}>AI / ML</option>
                        <option value="Data" style={{ background: t.selectBg }}>Data</option>
                        <option value="DevOps" style={{ background: t.selectBg }}>DevOps</option>
                        <option value="기타" style={{ background: t.selectBg }}>기타</option>
                      </select>
                    </div>
                  </div>
                  {/* MVP 제목 */}
                  <div>
                    <label style={labelStyle}>MVP 제목 *</label>
                    <input value={reqForm.title} onChange={e => setReqForm({ ...reqForm, title: e.target.value })} placeholder="예: AI 기반 고객 이탈 예측 대시보드" style={inputStyle} />
                  </div>
                  {/* 상세 설명 */}
                  <div>
                    <label style={labelStyle}>상세 설명 *</label>
                    <textarea value={reqForm.desc} onChange={e => setReqForm({ ...reqForm, desc: e.target.value })} placeholder="만들고자 하는 MVP의 핵심 기능과 목적을 설명해주세요..." rows={5} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} />
                  </div>
                  {/* 희망 완료일 */}
                  <div>
                    <label style={labelStyle}>희망 완료일</label>
                    <input value={reqForm.deadline} onChange={e => setReqForm({ ...reqForm, deadline: e.target.value })} type="date" style={{ ...inputStyle, width: "50%", colorScheme: "dark" }} />
                  </div>
                </div>
                <button onClick={handleRequest} style={{ width: "100%", marginTop: 24, padding: "15px 0", borderRadius: 12, border: "none", background: formReady ? "#10b981" : "rgba(255,255,255,.06)", color: formReady ? "#fff" : "rgba(255,255,255,.25)", fontSize: 15, fontWeight: 700, cursor: formReady ? "pointer" : "default", transition: "all .2s", fontFamily: "inherit" }}>
                  의뢰 제출하기
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* MVP 의뢰 목록 Modal */}
      {listModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", backdropFilter: "blur(8px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => { setListModal(false); setStatusDropId(null); }}>
          <div onClick={e => e.stopPropagation()} style={{ background: t.modalBg, borderRadius: 20, padding: 32, width: 640, maxHeight: "80vh", display: "flex", flexDirection: "column", border: `1px solid ${t.modalBorder}`, boxShadow: "0 24px 64px rgba(0,0,0,.4)", animation: "fadeIn .3s" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>📋 MVP 의뢰 목록</div>
                <div style={{ fontSize: 12, color: t.sub, marginTop: 4 }}>총 {requests.length}건의 의뢰가 있습니다</div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button onClick={() => { setListModal(false); setRequestModal(true); }} style={{ padding: "6px 14px", borderRadius: 8, background: "transparent", border: `1.5px solid ${t.accent}`, color: t.accent, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>+ 새 의뢰</button>
                <button onClick={() => setListModal(false)} style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}`, borderRadius: 8, width: 32, height: 32, color: t.text, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✕</button>
              </div>
            </div>
            {/* List */}
            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
              {requests.length === 0 && (
                <div style={{ textAlign: "center", padding: "48px 0", color: "rgba(255,255,255,.25)", fontSize: 14 }}>등록된 의뢰가 없습니다</div>
              )}
              {requests.map(req => {
                const sc = STATUS_COLORS[req.status] || "#10b981";
                return (
                  <div key={req.id} style={{ background: t.listItemBg, borderRadius: 14, padding: "18px 20px", border: `1px solid ${t.listBorder}`, position: "relative" }}>
                    {/* Title + Category + Status */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 16, fontWeight: 700 }}>{req.title}</span>
                        <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700, color: CAT_COLORS[req.category] || "#f59e0b", border: `1px solid ${(CAT_COLORS[req.category] || "#f59e0b")}40`, background: `${(CAT_COLORS[req.category] || "#f59e0b")}10` }}>{req.category}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, position: "relative" }}>
                        <button onClick={() => setStatusDropId(statusDropId === req.id ? null : req.id)} style={{ padding: "4px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer", background: sc, color: "#fff", border: "none", fontFamily: "inherit" }}>{req.status}</button>
                        <button onClick={() => deleteRequest(req.id)} style={{ width: 24, height: 24, borderRadius: 6, background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.2)", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontFamily: "inherit" }}>✕</button>
                        {/* Status Dropdown */}
                        {statusDropId === req.id && (
                          <div style={{ position: "absolute", top: "100%", right: 30, marginTop: 4, background: t.modalBg, borderRadius: 10, border: `1px solid ${t.divider}`, padding: "6px 0", zIndex: 10, minWidth: 100, boxShadow: "0 8px 24px rgba(0,0,0,.4)" }}>
                            {STATUSES.map(s => (
                              <div key={s} onClick={() => changeStatus(req.id, s)} style={{ padding: "8px 16px", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, color: req.status === s ? STATUS_COLORS[s] : "rgba(255,255,255,.6)", fontWeight: req.status === s ? 700 : 400, background: req.status === s ? `${STATUS_COLORS[s]}10` : "transparent" }}
                                onMouseEnter={e => { if (req.status !== s) e.currentTarget.style.background = "rgba(255,255,255,.05)"; }}
                                onMouseLeave={e => { if (req.status !== s) e.currentTarget.style.background = "transparent"; }}>
                                {req.status === s && "✔"} {s}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Desc */}
                    <div style={{ fontSize: 12.5, color: t.muted, marginBottom: 10, lineHeight: 1.6 }}>{req.desc}</div>
                    {/* Meta */}
                    <div style={{ display: "flex", gap: 16, fontSize: 11, color: t.muted }}>
                      <span>의뢰자 <strong style={{ color: t.sub }}>{req.name} ({req.team})</strong></span>
                      <span>이메일 <strong style={{ color: t.sub }}>{req.email}</strong></span>
                      <span>신청일 <strong style={{ color: t.sub }}>{req.date}</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: t.headerBg, backdropFilter: "blur(20px)", borderBottom: `1px solid ${t.divider}`, padding: "14px 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg,${t.accent},${theme==="pro"?"#6366f1":"#059669"})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#fff", boxShadow: `0 4px 15px ${t.accentGlow}` }}>DMP</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Deny MVP Portal</div>
              <div style={{ fontSize: 10, color: t.muted }}>kt ds AX BD · Rapid Prototyping Hub · <span style={{color: t.accent}}>5 MVPs</span></div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Theme Selector */}
            <div style={{ display: "flex", background: t.inputBg, borderRadius: 8, padding: 2, border: `1px solid ${t.divider}` }}>
              {Object.values(THEMES).map(th => (
                <button key={th.id} onClick={() => setTheme(th.id)} style={{
                  padding: "4px 10px", borderRadius: 6, border: "none", fontSize: 10, fontWeight: theme === th.id ? 700 : 500,
                  background: theme === th.id ? t.accent : "transparent", color: theme === th.id ? "#fff" : t.muted,
                  cursor: "pointer", transition: "all .2s", whiteSpace: "nowrap"
                }}>{th.short}</button>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 8, background: t.inputBg, border: `1px solid ${t.divider}`, fontSize: 12, color: t.sub }}>
              <span style={{ color: t.accent, fontWeight: 700 }}>{MVPS.filter(m => m.status === "Live").length}</span> MVPs
            </div>
            <div onClick={() => setListModal(true)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 8, background: t.inputBg, border: `1px solid ${t.divider}`, fontSize: 12, color: t.sub, cursor: "pointer", transition: "all .2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = t.accent + "60"}
              onMouseLeave={e => e.currentTarget.style.borderColor = t.divider}>
              📋 의뢰 목록 <span style={{ background: t.accent, color: "#fff", padding: "0 5px", borderRadius: 6, fontSize: 10, fontWeight: 700, marginLeft: 2 }}>{requests.length}</span>
            </div>
            <button onClick={() => setRequestModal(true)} style={{ padding: "7px 16px", borderRadius: 8, background: "transparent", border: `1.5px solid ${t.accent}`, color: t.accent, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "all .2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = t.accent; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = t.accent; }}>
              + MVP 제작 의뢰
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 32px 56px", animation: "fadeInUp .7s ease" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 20, background: t.accent + "12", border: `1px solid ${t.accent}30`, marginBottom: 20, fontSize: 12, color: t.accent, fontWeight: 600 }}>
          🚀 AX Business Development
        </div>
        <h1 style={{ fontSize: 48, fontWeight: 800, margin: "0 0 16px", lineHeight: 1.2, letterSpacing: -1.5, fontFamily: "'Space Grotesk','Pretendard',sans-serif" }}>
          Build Fast,<br />
          <span style={{ background: theme==="light"?"linear-gradient(135deg,#059669,#0891b2)":theme==="pro"?"linear-gradient(135deg,#60a5fa,#a78bfa)":"linear-gradient(135deg,#34d399,#22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Validate Faster.</span>
        </h1>
        <p style={{ fontSize: 15, color: t.sub, lineHeight: 1.8, maxWidth: 520 }}>
          AX 사업개발팀이 만든 MVP를 직접 체험해보세요.<br />
          카드를 클릭하면 실제 작동하는 MVP를 바로 사용할 수 있습니다.
        </p>
      </div>

      {/* MVP SHOWCASE */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px 40px" }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: t.muted, marginBottom: 24 }}>MVP SHOWCASE</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {MVPS.map((mvp, idx) => {
            const isClickable = mvp.id === "security" || mvp.id === "firewall" || mvp.id === "claimsNew" || mvp.id === "claimsNewBackup" || mvp.id === "stockpilot" || mvp.id === "koreaJobs";
            return (
              <div
                key={mvp.id}
                onClick={() => isClickable && setPage(mvp.id)}
                style={{
                  background: mvp.gradient, borderRadius: 18, padding: "24px 22px", border: `1px solid ${mvp.border}`,
                  cursor: isClickable ? "pointer" : "default", transition: "all .3s", position: "relative", overflow: "hidden",
                  opacity: mvp.status==="준비중" ? 0.55 : 1,
                  animation: `fadeInUp ${.4 + idx * .15}s ease`,
                }}
                onMouseEnter={e => { if (isClickable) { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = `0 16px 40px rgba(0,0,0,.3)`; e.currentTarget.style.borderColor = mvp.catColor + "60"; }}}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = mvp.border; }}
              >
                {/* Category + Status */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 10, fontWeight: 700, letterSpacing: 1, border: `1px solid ${mvp.catColor}40`, color: mvp.catColor, background: mvp.catColor + "10" }}>{mvp.category}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: mvp.status==="Live"?"#10b981":"#94a3b8", fontWeight: 600 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: mvp.status==="Live"?"#10b981":"#94a3b8", boxShadow: mvp.status==="Live"?"0 0 8px #10b981":"none", animation: mvp.status==="Live"?"pulse 2s infinite":"none" }} />
                    {mvp.status}
                  </div>
                </div>

                {/* Icon */}
                <div style={{ width: 48, height: 48, borderRadius: 14, background: mvp.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 16, boxShadow: `0 6px 20px rgba(0,0,0,.3)`, animation: "float 3s ease-in-out infinite" }}>
                  {mvp.icon}
                </div>

                {/* Title + Desc */}
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, lineHeight: 1.3 }}>{mvp.title}</div>
                <div style={{ fontSize: 12.5, color: t.sub, lineHeight: 1.7, marginBottom: 18, minHeight: 44 }}>{mvp.desc}</div>

                {/* Tags + Date */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                    {mvp.tags.map((tg, i) => (
                      <span key={i} style={{ padding: "2px 8px", borderRadius: 6, fontSize: 10, background: t.tagBg, color: t.tagText, border: `1px solid ${t.tagBorder}` }}>{tg}</span>
                    ))}
                  </div>
                  <span style={{ fontSize: 11, color: t.faint, fontFamily: "'DM Mono',monospace" }}>{mvp.date}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* New MVP Request Card */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px 20px" }}>
        <div
          onClick={() => setRequestModal(true)}
          style={{ background: t.reqCardBg, borderRadius: 18, padding: "24px 22px", border: `1px dashed ${t.reqCardBorder}`, cursor: "pointer", transition: "all .3s", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 120, gap: 8 }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = t.accent + "60"; e.currentTarget.style.background = t.accent + "08"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = t.reqCardBorder; e.currentTarget.style.background = t.reqCardBg; }}
        >
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: t.accent + "15", border: `1px solid ${t.accent}30`, display: "flex", alignItems: "center", justifyContent: "center", color: t.accent, fontSize: 20 }}>+</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: t.sub }}>새로운 MVP 제작 의뢰</div>
          <div style={{ fontSize: 12, color: t.muted }}>아이디어를 현실로 만들어보세요</div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 32px 24px", textAlign: "center" }}>
        <div style={{ background: t.ctaBg, borderRadius: 24, padding: "48px 40px", border: `1px solid ${t.ctaBorder}` }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 10px" }}>MVP가 필요하신가요?</h2>
          <p style={{ fontSize: 14, color: t.sub, marginBottom: 24, lineHeight: 1.7 }}>
            아이디어만 있으면 됩니다. AX BD팀이 빠르게 <span style={{ color: t.accent, fontWeight: 600 }}>프로토타입</span>을 만들어드립니다.
          </p>
          <button onClick={() => setRequestModal(true)} style={{ padding: "14px 36px", borderRadius: 12, border: "none", background: t.accent, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 8px 24px ${t.accentGlow}`, transition: "all .2s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 12px 32px ${t.accentGlow}`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `0 8px 24px ${t.accentGlow}`; }}>
            MVP 제작 의뢰하기
          </button>
        </div>
      </div>

      {/* Footer */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 32px 32px", textAlign: "center", color: t.faint, fontSize: 11 }}>
        © 2025 kt ds AX BD · Deny MVP Portal · Rapid Prototyping Hub
      </div>
    </div>
  );
}
