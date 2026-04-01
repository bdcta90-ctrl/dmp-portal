import { useState, useEffect } from "react";

const S = {
  bg: "#0a0f1a", card: "#111827", border: "#1e293b", text: "#f1f5f9",
  sub: "#94a3b8", muted: "#64748b", pri: "#3b82f6", cyan: "#06b6d4",
  green: "#10b981", yellow: "#f59e0b", red: "#ef4444", purple: "#8b5cf6",
};

const CRAWL_USAGE_KEY = "dmp_crawl_usage";
const CRAWL_LIMIT = 500;
const CRAWL_WARNING = 450;

function getCrawlUsage() {
  try {
    const d = JSON.parse(localStorage.getItem(CRAWL_USAGE_KEY) || "{}");
    const now = new Date();
    const resetKey = `${now.getFullYear()}-${now.getMonth()}`;
    if (d.resetKey !== resetKey) return { count: 0, resetKey, startDate: now.toISOString() };
    return d;
  } catch { return { count: 0, resetKey: "", startDate: "" }; }
}

function addCrawlUsage(n = 1) {
  const usage = getCrawlUsage();
  const now = new Date();
  usage.count += n;
  usage.resetKey = `${now.getFullYear()}-${now.getMonth()}`;
  if (!usage.startDate) usage.startDate = now.toISOString();
  localStorage.setItem(CRAWL_USAGE_KEY, JSON.stringify(usage));
  return usage;
}

function getResetDate() {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return `${next.getFullYear()}년 ${next.getMonth() + 1}월 1일`;
}

const CATEGORY_COLORS = { essential: S.red, recommended: S.pri, creative: S.purple };
const CATEGORY_LABELS = { essential: "필수 데이터", recommended: "추천 데이터", creative: "참신한 인사이트" };
const FREQ_LABELS = { realtime: "실시간", hourly: "시간", daily: "일", weekly: "주", monthly: "월" };

function ProjectList({ projects, onNew, onSelect, onDelete }) {
  return (
    <div>
      <button onClick={onNew} style={{ width: "100%", padding: "14px", borderRadius: 10, border: `2px dashed ${S.border}`, background: "none", color: S.pri, fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 12 }}>
        + 새 프로젝트 생성
      </button>
      {projects.length === 0 && (
        <div style={{ textAlign: "center", padding: 40, color: S.muted, fontSize: 12 }}>
          프로젝트가 없습니다. 새 프로젝트를 생성하여 데이터 수집을 시작하세요.
        </div>
      )}
      {projects.map(p => (
        <div key={p.id} style={{ background: S.card, borderRadius: 10, padding: 16, border: `1px solid ${S.border}`, marginBottom: 8, cursor: "pointer" }}
          onClick={() => onSelect(p)}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: S.text }}>{p.name}</div>
              <div style={{ fontSize: 10, color: S.muted, marginTop: 2 }}>{p.domain} · {p.topic}</div>
              <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 3, background: S.pri + "20", color: S.pri }}>소스 {p.dataSources?.length || 0}개</span>
                <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 3, background: S.green + "20", color: S.green }}>데이터셋 {p.datasets?.length || 0}개</span>
              </div>
            </div>
            <button onClick={e => { e.stopPropagation(); onDelete(p.id); }}
              style={{ background: "none", border: "none", color: S.muted, cursor: "pointer", fontSize: 14 }}>🗑️</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProjectCreate({ onCreate }) {
  const [domain, setDomain] = useState("");
  const [topic, setTopic] = useState("");
  const [name, setName] = useState("");
  return (
    <div style={{ background: S.card, borderRadius: 12, padding: 20, border: `1px solid ${S.border}` }}>
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>새 프로젝트 생성</div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 10, color: S.muted, display: "block", marginBottom: 4 }}>프로젝트 이름</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="예: 수도권 부동산 분석"
          style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${S.border}`, background: "#0f172a", color: S.text, fontSize: 12, boxSizing: "border-box" }} />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 10, color: S.muted, display: "block", marginBottom: 4 }}>도메인 (분야)</label>
        <input value={domain} onChange={e => setDomain(e.target.value)} placeholder="예: 부동산, 주식, 바이오, AI, 이커머스..."
          style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${S.border}`, background: "#0f172a", color: S.text, fontSize: 12, boxSizing: "border-box" }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 10, color: S.muted, display: "block", marginBottom: 4 }}>업무/목적</label>
        <textarea value={topic} onChange={e => setTopic(e.target.value)} rows={3}
          placeholder="예: 수도권 아파트 가격 동향 분석 및 투자 시점 예측..."
          style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${S.border}`, background: "#0f172a", color: S.text, fontSize: 12, resize: "vertical", boxSizing: "border-box" }} />
      </div>
      <button onClick={() => { if (name && domain && topic) onCreate({ name, domain, topic }); }}
        disabled={!name || !domain || !topic}
        style={{ width: "100%", padding: "10px", borderRadius: 8, border: "none", background: (!name || !domain || !topic) ? S.border : S.pri, color: "#fff", fontSize: 12, fontWeight: 700, cursor: (!name || !domain || !topic) ? "default" : "pointer" }}>
        생성하고 AI 추천 받기
      </button>
    </div>
  );
}

function ProjectDetail({ project, onUpdate, onViewDatasets }) {
  const [suggesting, setSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState(project.suggestions || null);
  const [error, setError] = useState("");
  const [crawling, setCrawling] = useState({});
  const [showManualForm, setShowManualForm] = useState(false);
  const [manual, setManual] = useState({ name: "", description: "", url: "", sourceType: "web", frequency: "daily", format: "HTML" });

  const requestSuggestions = async () => {
    setSuggesting(true); setError("");
    try {
      const res = await fetch("/api/ai-suggest", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: project.domain, topic: project.topic }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); } else { setSuggestions(data); onUpdate({ suggestions: data }); }
    } catch (err) { setError(err.message); }
    finally { setSuggesting(false); }
  };

  const addSource = (item, category) => {
    const newSource = {
      id: "ds_" + Date.now() + Math.random().toString(36).slice(2, 6),
      name: item.name, description: item.description, url: item.source, sourceType: item.sourceType,
      frequency: item.frequency, format: item.format, fields: item.fields, category, status: "ready",
      records: [], lastCollected: null, recordCount: 0,
    };
    onUpdate({ dataSources: [...(project.dataSources || []), newSource] });
  };

  const addManualSource = () => {
    if (!manual.name || !manual.url) return;
    addSource({ name: manual.name, description: manual.description, source: manual.url, sourceType: manual.sourceType, frequency: manual.frequency, format: manual.format, fields: [] }, "recommended");
    setManual({ name: "", description: "", url: "", sourceType: "web", frequency: "daily", format: "HTML" });
    setShowManualForm(false);
  };

  const [usageWarning, setUsageWarning] = useState(null);
  const [crawlCount, setCrawlCount] = useState(getCrawlUsage().count);
  const [crawlToast, setCrawlToast] = useState(null);

  const crawlAndExtract = async (source) => {
    const usage = getCrawlUsage();
    if (usage.count >= CRAWL_LIMIT) return { error: `이번 달 Firecrawl 무료 한도(${CRAWL_LIMIT}회) 초과. ${getResetDate()}에 초기화됩니다.` };
    if (usage.count >= CRAWL_WARNING && !usageWarning) setUsageWarning(`Firecrawl 사용량 ${usage.count}/${CRAWL_LIMIT}회 (잔여 ${CRAWL_LIMIT - usage.count}회). ${getResetDate()}에 초기화됩니다.`);
    const res = await fetch("/api/crawl", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: source.url, sourceType: source.sourceType }) });
    const data = await res.json();
    if (data.error) return { error: data.error };
    if (data.quotaExceeded) return { error: `Firecrawl 무료 한도 초과. ${getResetDate()}에 초기화됩니다.` };
    const updated = addCrawlUsage(1);
    setCrawlCount(updated.count);
    setCrawlToast(`Firecrawl ${updated.count}/${CRAWL_LIMIT}회 사용 (잔여 ${CRAWL_LIMIT - updated.count}회)`);
    setTimeout(() => setCrawlToast(null), 3000);
    if (updated.count >= CRAWL_WARNING) setUsageWarning(`Firecrawl 사용량 ${updated.count}/${CRAWL_LIMIT}회 (잔여 ${CRAWL_LIMIT - updated.count}회). ${getResetDate()}에 초기화됩니다.`);
    const rawContent = typeof data.content === "string" ? data.content : JSON.stringify(data.content);
    let extracted = null;
    try {
      const aiRes = await fetch("/api/ai-extract", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rawContent: rawContent.slice(0, 8000), sourceName: source.name, sourceDescription: source.description, fields: source.fields }) });
      const aiData = await aiRes.json();
      if (!aiData.error) extracted = aiData;
    } catch {}
    return { id: "rec_" + Date.now() + Math.random().toString(36).slice(2, 5), collectedAt: data.collectedAt, type: data.type, size: rawContent.length, preview: rawContent.slice(0, 1000), extracted, title: extracted?.title || source.name, summary: extracted?.summary || "", structuredData: extracted?.data || [], metadata: extracted?.metadata || {} };
  };

  const crawlSource = async (sourceId) => {
    setCrawling(c => ({ ...c, [sourceId]: true }));
    const source = project.dataSources.find(s => s.id === sourceId);
    if (!source) return;
    try {
      const record = await crawlAndExtract(source);
      if (record.error) { alert("수집 실패: " + record.error); return; }
      const updatedSources = (project.dataSources || []).map(s => s.id === sourceId ? { ...s, status: "active", lastCollected: record.collectedAt, recordCount: (s.recordCount || 0) + 1, records: [...(s.records || []), record] } : s);
      onUpdate({ dataSources: updatedSources });
    } catch (err) { alert("수집 오류: " + err.message); }
    finally { setCrawling(c => ({ ...c, [sourceId]: false })); }
  };

  const removeSource = (sourceId) => { onUpdate({ dataSources: (project.dataSources || []).filter(s => s.id !== sourceId) }); };

  const createDataset = () => {
    const activeSources = (project.dataSources || []).filter(s => s.recordCount > 0);
    if (activeSources.length === 0) { alert("수집된 데이터가 없습니다."); return; }
    const newDataset = {
      id: "set_" + Date.now(), name: `${project.name} 데이터셋 #${(project.datasets || []).length + 1}`, createdAt: new Date().toISOString(),
      sources: activeSources.map(s => ({ name: s.name, recordCount: s.recordCount, lastCollected: s.lastCollected })),
      totalRecords: activeSources.reduce((sum, s) => sum + (s.recordCount || 0), 0),
      records: activeSources.flatMap(s => (s.records || []).map(r => ({ ...r, sourceName: s.name }))),
    };
    onUpdate({ datasets: [...(project.datasets || []), newDataset] });
    alert(`데이터셋 "${newDataset.name}" 생성 완료 (${newDataset.totalRecords}건)`);
  };

  const [crawlingAll, setCrawlingAll] = useState(false);
  const [crawlResult, setCrawlResult] = useState(null);
  const crawlAll = async () => {
    const srcs = (project.dataSources || []).filter(s => s.url);
    if (srcs.length === 0) { alert("등록된 데이터 소스가 없습니다."); return; }
    setCrawlingAll(true);
    let success = 0, fail = 0; const errors = [];
    for (const s of srcs) {
      try {
        setCrawling(c => ({ ...c, [s.id]: true }));
        const record = await crawlAndExtract(s);
        if (record.error) { fail++; errors.push(`${s.name}: ${record.error}`); continue; }
        const updatedSources = (project.dataSources || []).map(ds => ds.id === s.id ? { ...ds, status: "active", lastCollected: record.collectedAt, recordCount: (ds.recordCount || 0) + 1, records: [...(ds.records || []), record] } : ds);
        onUpdate({ dataSources: updatedSources });
        success++;
      } catch (e) { fail++; errors.push(`${s.name}: ${e.message}`); }
      finally { setCrawling(c => ({ ...c, [s.id]: false })); }
    }
    setCrawlingAll(false);
    setCrawlResult({ success, fail, errors });
  };

  const sources = project.dataSources || [];
  const totalRecords = sources.reduce((s, d) => s + (d.recordCount || 0), 0);

  return (
    <div>
      <div style={{ background: S.card, borderRadius: 12, padding: 16, border: `1px solid ${S.border}`, marginBottom: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: S.text }}>{project.name}</div>
        <div style={{ fontSize: 10, color: S.muted, marginTop: 2 }}>{project.domain} · {project.topic}</div>
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 4, background: S.pri + "20", color: S.pri }}>소스 {sources.length}개</span>
          <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 4, background: S.green + "20", color: S.green }}>수집 {totalRecords}건</span>
          <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 4, background: S.purple + "20", color: S.purple }}>데이터셋 {(project.datasets || []).length}개</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <button onClick={requestSuggestions} disabled={suggesting} style={{ flex: 1, minWidth: 120, padding: "10px", borderRadius: 8, border: "none", background: suggesting ? S.border : S.pri, color: "#fff", fontSize: 11, fontWeight: 700, cursor: suggesting ? "wait" : "pointer" }}>{suggesting ? "🤖 AI 분석 중..." : "🤖 AI 추천"}</button>
        <button onClick={() => setShowManualForm(f => !f)} style={{ flex: 1, minWidth: 120, padding: "10px", borderRadius: 8, border: "none", background: showManualForm ? S.yellow : S.cyan, color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>{showManualForm ? "✕ 닫기" : "✏️ 수동 추가"}</button>
        <button onClick={crawlAll} disabled={crawlingAll || sources.length === 0} style={{ flex: 1, minWidth: 120, padding: "10px", borderRadius: 8, border: "none", background: (crawlingAll || sources.length === 0) ? S.border : "#f59e0b", color: "#fff", fontSize: 11, fontWeight: 700, cursor: (crawlingAll || sources.length === 0) ? "default" : "pointer" }}>{crawlingAll ? "⏳ 수집 중..." : `⚡ 전체 수집 (${sources.length})`}</button>
        <button onClick={createDataset} style={{ flex: 1, minWidth: 120, padding: "10px", borderRadius: 8, border: "none", background: totalRecords > 0 ? S.green : S.border, color: "#fff", fontSize: 11, fontWeight: 700, cursor: totalRecords > 0 ? "pointer" : "default" }}>📦 데이터셋 생성</button>
        <button onClick={onViewDatasets} style={{ flex: 1, minWidth: 120, padding: "10px", borderRadius: 8, border: `1px solid ${S.border}`, background: "none", color: S.sub, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>📊 데이터셋 ({(project.datasets || []).length})</button>
      </div>

      {showManualForm && (
        <div style={{ background: S.card, borderRadius: 10, padding: 14, border: `1px solid ${S.cyan}40`, marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: S.cyan, marginBottom: 10 }}>✏️ 데이터 소스 직접 추가</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
            <div><label style={{ fontSize: 9, color: S.muted, display: "block", marginBottom: 2 }}>이름 *</label><input value={manual.name} onChange={e => setManual(m => ({ ...m, name: e.target.value }))} placeholder="예: 네이버 뉴스 크롤링" style={{ width: "100%", padding: "6px 10px", borderRadius: 5, border: `1px solid ${S.border}`, background: "#0f172a", color: S.text, fontSize: 11, boxSizing: "border-box" }} /></div>
            <div><label style={{ fontSize: 9, color: S.muted, display: "block", marginBottom: 2 }}>URL *</label><input value={manual.url} onChange={e => setManual(m => ({ ...m, url: e.target.value }))} placeholder="https://..." style={{ width: "100%", padding: "6px 10px", borderRadius: 5, border: `1px solid ${S.border}`, background: "#0f172a", color: S.text, fontSize: 11, boxSizing: "border-box" }} /></div>
          </div>
          <div style={{ marginBottom: 8 }}><label style={{ fontSize: 9, color: S.muted, display: "block", marginBottom: 2 }}>설명</label><input value={manual.description} onChange={e => setManual(m => ({ ...m, description: e.target.value }))} placeholder="이 소스에서 어떤 데이터를 수집하는지..." style={{ width: "100%", padding: "6px 10px", borderRadius: 5, border: `1px solid ${S.border}`, background: "#0f172a", color: S.text, fontSize: 11, boxSizing: "border-box" }} /></div>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <div style={{ flex: 1 }}><label style={{ fontSize: 9, color: S.muted, display: "block", marginBottom: 2 }}>소스 유형</label><select value={manual.sourceType} onChange={e => setManual(m => ({ ...m, sourceType: e.target.value }))} style={{ width: "100%", padding: "6px 8px", borderRadius: 5, border: `1px solid ${S.border}`, background: "#0f172a", color: S.text, fontSize: 11 }}><option value="web">웹페이지</option><option value="api">API</option><option value="rss">RSS/XML</option><option value="file">파일</option></select></div>
            <div style={{ flex: 1 }}><label style={{ fontSize: 9, color: S.muted, display: "block", marginBottom: 2 }}>수집 주기</label><select value={manual.frequency} onChange={e => setManual(m => ({ ...m, frequency: e.target.value }))} style={{ width: "100%", padding: "6px 8px", borderRadius: 5, border: `1px solid ${S.border}`, background: "#0f172a", color: S.text, fontSize: 11 }}><option value="realtime">실시간</option><option value="hourly">시간</option><option value="daily">일</option><option value="weekly">주</option><option value="monthly">월</option></select></div>
            <div style={{ flex: 1 }}><label style={{ fontSize: 9, color: S.muted, display: "block", marginBottom: 2 }}>형식</label><select value={manual.format} onChange={e => setManual(m => ({ ...m, format: e.target.value }))} style={{ width: "100%", padding: "6px 8px", borderRadius: 5, border: `1px solid ${S.border}`, background: "#0f172a", color: S.text, fontSize: 11 }}><option value="HTML">HTML</option><option value="JSON">JSON</option><option value="CSV">CSV</option><option value="XML">XML</option></select></div>
          </div>
          <button onClick={addManualSource} disabled={!manual.name || !manual.url} style={{ width: "100%", padding: "8px", borderRadius: 6, border: "none", background: (!manual.name || !manual.url) ? S.border : S.cyan, color: "#fff", fontSize: 11, fontWeight: 700, cursor: (!manual.name || !manual.url) ? "default" : "pointer" }}>+ 데이터 소스 등록</button>
        </div>
      )}

      {error && <div style={{ padding: 10, borderRadius: 8, background: S.red + "18", border: `1px solid ${S.red}40`, color: S.red, fontSize: 11, marginBottom: 12 }}>{error}</div>}
      {usageWarning && (<div style={{ padding: 10, borderRadius: 8, background: S.yellow + "18", border: `1px solid ${S.yellow}40`, marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: 11, color: S.yellow }}>⚠️ {usageWarning}</span><button onClick={() => setUsageWarning(null)} style={{ background: "none", border: "none", color: S.muted, cursor: "pointer" }}>✕</button></div>)}
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 8, marginBottom: 4 }}>
        {crawlToast && <span style={{ fontSize: 9, color: S.green, fontWeight: 600 }}>{crawlToast}</span>}
        <span style={{ fontSize: 8, color: crawlCount >= CRAWL_WARNING ? S.yellow : S.muted }}>🔥 Firecrawl {crawlCount}/{CRAWL_LIMIT}회 (초기화: {getResetDate()})</span>
      </div>
      {crawlResult && (<div style={{ background: S.card, borderRadius: 10, padding: 14, border: `1px solid ${crawlResult.fail > 0 ? S.yellow : S.green}40`, marginBottom: 12 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}><span style={{ fontSize: 12, fontWeight: 700, color: S.text }}>수집 결과: 성공 <span style={{ color: S.green }}>{crawlResult.success}</span> / 실패 <span style={{ color: S.red }}>{crawlResult.fail}</span></span><button onClick={() => setCrawlResult(null)} style={{ background: "none", border: "none", color: S.muted, cursor: "pointer", fontSize: 12 }}>✕</button></div>{crawlResult.errors.length > 0 && <textarea readOnly value={crawlResult.errors.join("\n")} rows={Math.min(crawlResult.errors.length, 8)} style={{ width: "100%", padding: 8, borderRadius: 6, border: `1px solid ${S.border}`, background: "#0f172a", color: S.red, fontSize: 10, fontFamily: "monospace", resize: "vertical", boxSizing: "border-box" }} onClick={e => e.target.select()} />}</div>)}

      {suggestions && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: S.text, marginBottom: 8 }}>🤖 AI 추천 데이터 소스</div>
          {["essential", "recommended", "creative"].map(cat => {
            const items = suggestions[cat] || [];
            if (items.length === 0) return null;
            return (
              <div key={cat} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: CATEGORY_COLORS[cat], marginBottom: 4 }}>{CATEGORY_LABELS[cat]} ({items.length})</div>
                {items.map((item, i) => {
                  const alreadyAdded = sources.some(s => s.name === item.name);
                  const isSearchNeeded = !item.source || item.source === "검색 필요" || !item.source.startsWith("http");
                  return (
                    <div key={i} style={{ background: "#0f172a", borderRadius: 8, padding: "10px 12px", marginBottom: 4, border: `1px solid ${isSearchNeeded ? S.yellow + "40" : S.border}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: S.text }}>{item.name}</div>
                          <div style={{ fontSize: 9, color: S.muted, marginTop: 2 }}>{item.description}</div>
                          {item.reason && <div style={{ fontSize: 9, color: S.cyan, marginTop: 3, lineHeight: 1.5, background: S.cyan + "10", padding: "4px 8px", borderRadius: 4 }}>💡 {item.reason}</div>}
                          <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 8, padding: "1px 4px", borderRadius: 2, background: S.border, color: S.sub }}>{item.sourceType}</span>
                            <span style={{ fontSize: 8, padding: "1px 4px", borderRadius: 2, background: S.border, color: S.sub }}>{FREQ_LABELS[item.frequency] || item.frequency}</span>
                            <span style={{ fontSize: 8, padding: "1px 4px", borderRadius: 2, background: S.border, color: S.sub }}>{item.format}</span>
                          </div>
                          {isSearchNeeded ? <div style={{ fontSize: 9, color: S.yellow, marginTop: 3 }}>⚠️ URL 미확인 — 수동 추가하세요</div> : <div style={{ fontSize: 8, color: S.muted, marginTop: 3, wordBreak: "break-all" }}>{item.source}</div>}
                        </div>
                        {!isSearchNeeded && <button onClick={() => addSource(item, cat)} disabled={alreadyAdded} style={{ padding: "4px 10px", borderRadius: 5, border: "none", background: alreadyAdded ? S.border : CATEGORY_COLORS[cat], color: "#fff", fontSize: 9, fontWeight: 600, cursor: alreadyAdded ? "default" : "pointer", whiteSpace: "nowrap", marginLeft: 8 }}>{alreadyAdded ? "추가됨" : "+ 추가"}</button>}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      <div style={{ background: S.card, borderRadius: 10, padding: 12, border: `1px solid ${S.border}`, marginBottom: 12 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: S.muted, marginBottom: 6 }}>🏛️ 공공데이터 검색 바로가기</div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {[{ name: "공공데이터포털", url: "https://www.data.go.kr" }, { name: "KOSIS 통계", url: "https://kosis.kr" }, { name: "서울열린데이터", url: "https://data.seoul.go.kr" }, { name: "국토부 실거래가", url: "https://rt.molit.go.kr" }, { name: "한국은행 통계", url: "https://ecos.bok.or.kr" }, { name: "기상청 데이터", url: "https://data.kma.go.kr" }].map(l => (
            <a key={l.name} href={l.url} target="_blank" rel="noopener noreferrer" style={{ padding: "4px 10px", borderRadius: 5, border: `1px solid ${S.border}`, background: "#0f172a", color: S.cyan, fontSize: 9, textDecoration: "none", fontWeight: 600 }}>{l.name}</a>
          ))}
        </div>
      </div>

      {sources.length > 0 && (
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: S.text, marginBottom: 8 }}>📡 등록된 데이터 소스</div>
          {sources.map(s => (
            <div key={s.id} style={{ background: S.card, borderRadius: 8, padding: "10px 12px", marginBottom: 6, border: `1px solid ${S.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: S.text }}>{s.name}</span>
                    <span style={{ fontSize: 8, padding: "1px 5px", borderRadius: 3, background: s.status === "active" ? S.green + "20" : S.yellow + "20", color: s.status === "active" ? S.green : S.yellow }}>{s.status === "active" ? "수집중" : "대기"}</span>
                  </div>
                  <div style={{ fontSize: 9, color: S.muted, marginTop: 2 }}>{s.description}</div>
                  <div style={{ display: "flex", gap: 8, marginTop: 4, fontSize: 9, color: S.sub }}>
                    <span>수집 {s.recordCount || 0}건</span>
                    <span>{FREQ_LABELS[s.frequency] || s.frequency} 주기</span>
                    {s.lastCollected && <span>최근: {new Date(s.lastCollected).toLocaleString("ko-KR")}</span>}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  <button onClick={() => crawlSource(s.id)} disabled={crawling[s.id]} style={{ padding: "4px 10px", borderRadius: 5, border: "none", background: crawling[s.id] ? S.border : S.cyan, color: "#fff", fontSize: 9, fontWeight: 600, cursor: crawling[s.id] ? "wait" : "pointer" }}>{crawling[s.id] ? "수집중..." : "▶ 수집"}</button>
                  <button onClick={() => removeSource(s.id)} style={{ padding: "4px 8px", borderRadius: 5, border: `1px solid ${S.border}`, background: "none", color: S.muted, fontSize: 9, cursor: "pointer" }}>✕</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DatasetView({ project, onUpdate, onBack }) {
  const datasets = project.datasets || [];
  const [selected, setSelected] = useState(null);
  const [expandedRec, setExpandedRec] = useState(null);
  const [viewMode, setViewMode] = useState("card");

  const deleteDataset = (id) => { if (!confirm("이 데이터셋을 삭제하시겠습니까?")) return; onUpdate({ datasets: datasets.filter(d => d.id !== id) }); if (selected?.id === id) setSelected(null); };

  const downloadExcel = (ds) => {
    const structuredRows = (ds.records || []).flatMap(rec => {
      if (rec.structuredData && rec.structuredData.length > 0) return rec.structuredData.map(d => ({ "소스": rec.sourceName || rec.title || "", "수집일시": rec.collectedAt ? new Date(rec.collectedAt).toLocaleString("ko-KR") : "", ...d }));
      return [{ "소스": rec.sourceName || rec.title || "", "수집일시": rec.collectedAt ? new Date(rec.collectedAt).toLocaleString("ko-KR") : "", "요약": rec.summary || "", "내용": rec.preview?.slice(0, 2000) || "" }];
    });
    const rows = structuredRows.length > 0 ? structuredRows : (ds.records || []).map((rec, i) => ({ "No": i + 1, "소스": rec.sourceName || "", "수집일시": rec.collectedAt ? new Date(rec.collectedAt).toLocaleString("ko-KR") : "", "내용": rec.preview || "" }));
    const headers = Object.keys(rows[0] || {});
    const csv = "\uFEFF" + [headers.join(","), ...rows.map(r => headers.map(h => `"${String(r[h] || "").replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `${ds.name.replace(/[^a-zA-Z0-9가-힣]/g, "_")}.csv`; a.click();
  };

  const downloadJSON = (ds) => {
    const blob = new Blob([JSON.stringify(ds.records || [], null, 2)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `${ds.name.replace(/[^a-zA-Z0-9가-힣]/g, "_")}.json`; a.click();
  };

  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 700, color: S.text, marginBottom: 8 }}>📊 데이터셋</div>
      {datasets.length === 0 && <div style={{ textAlign: "center", padding: 40, color: S.muted, fontSize: 12 }}>데이터셋이 없습니다.</div>}
      {!selected && datasets.map(ds => (
        <div key={ds.id} style={{ background: S.card, borderRadius: 8, padding: 12, marginBottom: 6, border: `1px solid ${S.border}`, cursor: "pointer" }} onClick={() => setSelected(ds)}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div><div style={{ fontSize: 12, fontWeight: 600, color: S.text }}>{ds.name}</div><div style={{ fontSize: 9, color: S.muted, marginTop: 2 }}>{new Date(ds.createdAt).toLocaleDateString("ko-KR")} · {ds.totalRecords}건</div></div>
            <div style={{ display: "flex", gap: 4 }}>
              <button onClick={e => { e.stopPropagation(); downloadExcel(ds); }} style={{ padding: "4px 8px", borderRadius: 4, border: `1px solid ${S.border}`, background: "none", color: S.green, fontSize: 9, cursor: "pointer" }}>CSV</button>
              <button onClick={e => { e.stopPropagation(); downloadJSON(ds); }} style={{ padding: "4px 8px", borderRadius: 4, border: `1px solid ${S.border}`, background: "none", color: S.pri, fontSize: 9, cursor: "pointer" }}>JSON</button>
              <button onClick={e => { e.stopPropagation(); deleteDataset(ds.id); }} style={{ background: "none", border: "none", color: S.muted, cursor: "pointer", fontSize: 12 }}>🗑️</button>
            </div>
          </div>
        </div>
      ))}
      {selected && (
        <div>
          <button onClick={() => { setSelected(null); setExpandedRec(null); }} style={{ background: "none", border: "none", color: S.pri, fontSize: 11, cursor: "pointer", marginBottom: 8 }}>← 목록</button>
          <div style={{ fontSize: 13, fontWeight: 700, color: S.text, marginBottom: 8 }}>{selected.name} ({selected.totalRecords}건)</div>
          {(selected.records || []).map((rec, i) => (
            <div key={i} style={{ background: S.card, borderRadius: 8, padding: 12, marginBottom: 6, border: `1px solid ${S.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginBottom: 4 }}><span style={{ color: S.cyan, fontWeight: 600 }}>{rec.sourceName}</span><span style={{ color: S.muted }}>{new Date(rec.collectedAt).toLocaleString("ko-KR")}</span></div>
              {rec.summary && <div style={{ fontSize: 10, color: S.green, marginBottom: 4, padding: "4px 8px", background: S.green + "10", borderRadius: 4 }}>📋 {rec.summary}</div>}
              <div onClick={() => setExpandedRec(expandedRec === i ? null : i)} style={{ fontSize: 9, color: S.muted, background: "#0f172a", padding: 8, borderRadius: 4, maxHeight: expandedRec === i ? 300 : 60, overflow: expandedRec === i ? "auto" : "hidden", fontFamily: "monospace", whiteSpace: "pre-wrap", wordBreak: "break-all", cursor: "pointer" }}>{rec.preview?.slice(0, expandedRec === i ? undefined : 200)}</div>
            </div>
          ))}
        </div>
      )}
      <button onClick={onBack} style={{ width: "100%", marginTop: 12, padding: 10, borderRadius: 8, border: `1px solid ${S.border}`, background: "none", color: S.sub, fontSize: 11, cursor: "pointer" }}>← 프로젝트로 돌아가기</button>
    </div>
  );
}

export default function CrawlingCenter({ onBack }) {
  const [projects, setProjects] = useState(() => {
    try { const d = localStorage.getItem("dmp_datacenter"); return d ? JSON.parse(d) : []; } catch { return []; }
  });
  const setProjectsAndSave = (fn) => {
    setProjects(prev => {
      const next = typeof fn === "function" ? fn(prev) : fn;
      try { localStorage.setItem("dmp_datacenter", JSON.stringify(next)); } catch {}
      return next;
    });
  };
  const [activeProject, setActiveProject] = useState(null);
  const [view, setView] = useState("list");

  const addProject = (proj) => { const np = { ...proj, id: "proj_" + Date.now(), createdAt: new Date().toISOString(), dataSources: [], datasets: [] }; setProjectsAndSave(p => [...p, np]); return np; };
  const updateProject = (id, updates) => { setProjectsAndSave(p => p.map(pr => pr.id === id ? { ...pr, ...updates } : pr)); };
  const deleteProject = (id) => { if (!confirm("삭제하시겠습니까?")) return; setProjectsAndSave(p => p.filter(pr => pr.id !== id)); if (activeProject?.id === id) { setActiveProject(null); setView("list"); } };

  return (
    <div style={{ fontFamily: "'Pretendard','Noto Sans KR',sans-serif", background: S.bg, color: S.text, minHeight: "100vh", padding: "20px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <button onClick={onBack} style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${S.border}`, background: "none", color: S.sub, fontSize: 12, cursor: "pointer" }}>← 포털로 돌아가기</button>
          <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>🔬 데이터 크롤링 센터</h1>
          <span style={{ fontSize: 10, color: S.muted }}>AI 기반 데이터 소스 추천 · 자동 수집 · 데이터셋 구축</span>
        </div>
        {view !== "list" && <div style={{ marginBottom: 12 }}><button onClick={() => { setView("list"); setActiveProject(null); }} style={{ padding: "6px 14px", borderRadius: 6, border: `1px solid ${S.border}`, background: "none", color: S.sub, fontSize: 11, cursor: "pointer" }}>← 목록</button></div>}
        {view === "list" && <ProjectList projects={projects} onNew={() => setView("create")} onSelect={p => { setActiveProject(p); setView("detail"); }} onDelete={deleteProject} />}
        {view === "create" && <ProjectCreate onCreate={p => { const np = addProject(p); setActiveProject(np); setView("detail"); }} />}
        {view === "detail" && activeProject && <ProjectDetail project={projects.find(p => p.id === activeProject.id) || activeProject} onUpdate={u => updateProject(activeProject.id, u)} onViewDatasets={() => setView("datasets")} />}
        {view === "datasets" && activeProject && <DatasetView project={projects.find(p => p.id === activeProject.id) || activeProject} onUpdate={u => updateProject(activeProject.id, u)} onBack={() => setView("detail")} />}
      </div>
    </div>
  );
}
