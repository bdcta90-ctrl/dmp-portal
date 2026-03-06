import { useState, useEffect, useRef, useCallback } from "react";

// ═══ AI 방화벽 대시보드 ═══

const AI_TOOLS = [
  {name:"ChatGPT",vendor:"OpenAI",risk:"high",category:"생성형AI",status:"blocked",icon:"🤖",dailyAttempts:0},
  {name:"Claude",vendor:"Anthropic",risk:"medium",category:"생성형AI",status:"allowed",icon:"🧠",dailyAttempts:0},
  {name:"Gemini",vendor:"Google",risk:"medium",category:"생성형AI",status:"blocked",icon:"💎",dailyAttempts:0},
  {name:"Copilot",vendor:"Microsoft",risk:"medium",category:"코드생성",status:"allowed",icon:"✈️",dailyAttempts:0},
  {name:"Midjourney",vendor:"Midjourney",risk:"high",category:"이미지생성",status:"blocked",icon:"🎨",dailyAttempts:0},
  {name:"DALL-E",vendor:"OpenAI",risk:"high",category:"이미지생성",status:"blocked",icon:"🖼️",dailyAttempts:0},
  {name:"Stable Diffusion",vendor:"Stability AI",risk:"high",category:"이미지생성",status:"blocked",icon:"🌀",dailyAttempts:0},
  {name:"Notion AI",vendor:"Notion",risk:"low",category:"문서작성",status:"allowed",icon:"📝",dailyAttempts:0},
  {name:"Grammarly",vendor:"Grammarly",risk:"low",category:"문서작성",status:"allowed",icon:"✍️",dailyAttempts:0},
  {name:"DeepL",vendor:"DeepL",risk:"low",category:"번역",status:"allowed",icon:"🌐",dailyAttempts:0},
  {name:"Cursor",vendor:"Anysphere",risk:"medium",category:"코드생성",status:"monitoring",icon:"⌨️",dailyAttempts:0},
  {name:"Perplexity",vendor:"Perplexity",risk:"medium",category:"검색AI",status:"monitoring",icon:"🔍",dailyAttempts:0},
  {name:"Suno AI",vendor:"Suno",risk:"high",category:"음악생성",status:"blocked",icon:"🎵",dailyAttempts:0},
  {name:"Runway",vendor:"Runway",risk:"high",category:"영상생성",status:"blocked",icon:"🎬",dailyAttempts:0},
];

const THREAT_TYPES = [
  {type:"malicious_email",label:"악성 이메일",icon:"📧",severity:"high"},
  {type:"phishing",label:"피싱 시도",icon:"🎣",severity:"critical"},
  {type:"data_exfil",label:"데이터 유출 시도",icon:"📤",severity:"critical"},
  {type:"malware_packet",label:"악성 패킷",icon:"🦠",severity:"high"},
  {type:"ddos",label:"DDoS 공격",icon:"💥",severity:"critical"},
  {type:"unauthorized_api",label:"비인가 API 호출",icon:"🔗",severity:"medium"},
  {type:"prompt_injection",label:"프롬프트 인젝션",icon:"💉",severity:"high"},
  {type:"model_extraction",label:"모델 추출 시도",icon:"🧲",severity:"critical"},
  {type:"sensitive_upload",label:"민감정보 업로드",icon:"🔒",severity:"high"},
  {type:"shadow_ai",label:"Shadow AI 탐지",icon:"👤",severity:"medium"},
];

const DEPARTMENTS = ["개발팀","마케팅팀","영업팀","인사팀","재무팀","연구소","경영지원","IT인프라","법무팀","전략기획"];
const ACTIONS_TAKEN = ["차단","경고 발송","격리","로그 기록","관리자 알림","세션 종료","IP 차단","정밀 분석 대기"];

const pick = arr => arr[Math.floor(Math.random()*arr.length)];
const randInt = (a,b) => Math.floor(Math.random()*(b-a+1))+a;

function generateThreatEvent() {
  const threat = pick(THREAT_TYPES);
  const dept = pick(DEPARTMENTS);
  const src = `${randInt(10,220)}.${randInt(1,254)}.${randInt(1,254)}.${randInt(1,254)}`;
  const action = threat.severity === "critical" ? pick(["차단","세션 종료","IP 차단"]) : pick(ACTIONS_TAKEN);
  return {
    id: "FW-"+Date.now()+"-"+randInt(100,999),
    timestamp: new Date(),
    threat, dept, sourceIP: src, action,
    destination: pick(["내부 DB","파일서버","이메일 서버","API 게이트웨이","클라우드 스토리지"]),
    payload: threat.type === "malicious_email" ? "악성 첨부파일 감지 ("+pick(["invoice.exe","report.zip.js","update.bat"])+")":
             threat.type === "phishing" ? "위조 로그인 페이지 링크 탐지":
             threat.type === "prompt_injection" ? "시스템 프롬프트 우회 시도 감지":
             threat.type === "sensitive_upload" ? pick(["고객DB.csv","계약서_기밀.pdf","소스코드.zip"])+" 업로드 시도":
             threat.type === "shadow_ai" ? pick(AI_TOOLS.filter(t=>t.status==="blocked")).name+" 비인가 접속 시도":
             "비정상 트래픽 패턴 감지",
    isNew: true,
    riskScore: threat.severity==="critical"?randInt(85,100):threat.severity==="high"?randInt(60,84):randInt(30,59),
  };
}

function generateAIUsageEvent(tools) {
  const tool = pick(tools);
  const dept = pick(DEPARTMENTS);
  const blocked = tool.status === "blocked";
  return {
    id: "AI-"+Date.now()+"-"+randInt(100,999),
    timestamp: new Date(),
    tool: tool.name, toolIcon: tool.icon, category: tool.category,
    dept, user: pick(["김","이","박","최","정","조","한","윤","서","강"])+pick(["현수","지민","서연","민준","소영","태우","예진","동훈","수빈","재현"]),
    action: blocked ? "차단" : tool.status==="monitoring" ? pick(["허용(모니터링)","경고"]) : "허용",
    dataVolume: blocked ? "—" : randInt(1,500)+"KB",
    query: blocked ? "접근 차단됨" :
      tool.category==="생성형AI" ? pick(["보고서 초안 작성","이메일 번역","회의록 요약","코드 리뷰 요청","데이터 분석"]):
      tool.category==="코드생성" ? pick(["함수 자동완성","버그 수정 제안","리팩토링","테스트 코드 생성"]):
      pick(["문서 교정","이미지 편집","번역","검색"]),
    riskFlag: blocked ? "정책 위반" : tool.risk==="high" ? "주의 필요" : null,
    isNew: true,
  };
}

// Small Components
function PulsingDot({color}){return<div style={{width:7,height:7,borderRadius:"50%",background:color||"#10b981",boxShadow:`0 0 8px ${color||"#10b981"}`,animation:"pulse 2s infinite"}}/>;}

function LiveChart({data,color,height}){
  const canvasRef=useRef(null);
  useEffect(()=>{
    const canvas=canvasRef.current;if(!canvas)return;
    const ctx=canvas.getContext("2d");let animId;
    const draw=()=>{
      const w=canvas.width=canvas.offsetWidth*2;const h=canvas.height=canvas.offsetHeight*2;
      ctx.clearRect(0,0,w,h);
      if(data.length<2){animId=requestAnimationFrame(draw);return;}
      const pts=data.slice(-40).map((d,i,a)=>({x:(i/(a.length-1))*w,y:h-(d/100)*h*0.85-h*0.05}));
      const grad=ctx.createLinearGradient(0,0,0,h);
      grad.addColorStop(0,color+"60");grad.addColorStop(1,color+"05");
      ctx.beginPath();ctx.moveTo(pts[0].x,pts[0].y);
      for(let i=1;i<pts.length;i++){const cx=(pts[i-1].x+pts[i].x)/2;ctx.bezierCurveTo(cx,pts[i-1].y,cx,pts[i].y,pts[i].x,pts[i].y);}
      ctx.lineTo(w,h);ctx.lineTo(0,h);ctx.closePath();ctx.fillStyle=grad;ctx.fill();
      ctx.beginPath();ctx.moveTo(pts[0].x,pts[0].y);
      for(let j=1;j<pts.length;j++){const cx=(pts[j-1].x+pts[j].x)/2;ctx.bezierCurveTo(cx,pts[j-1].y,cx,pts[j].y,pts[j].x,pts[j].y);}
      ctx.strokeStyle=color;ctx.lineWidth=3;ctx.shadowColor=color+"80";ctx.shadowBlur=8;ctx.stroke();ctx.shadowBlur=0;
      const last=pts[pts.length-1];
      ctx.beginPath();ctx.arc(last.x,last.y,5,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();
      animId=requestAnimationFrame(draw);
    };draw();
    return()=>cancelAnimationFrame(animId);
  },[data.length]);
  return<canvas ref={canvasRef} style={{width:"100%",height:height||80,display:"block"}}/>;
}

// Main Dashboard
export default function AIFirewall({onBack}){
  const[threats,setThreats]=useState([]);
  const[aiEvents,setAiEvents]=useState([]);
  const[tools,setTools]=useState(AI_TOOLS.map(t=>({...t,dailyAttempts:randInt(5,120)})));
  const[isPaused,setIsPaused]=useState(false);
  const[speed,setSpeed]=useState(2500);
  const[activeTab,setActiveTab]=useState("overview");
  const[expandedThreat,setExpandedThreat]=useState(null);
  const[threatScores,setThreatScores]=useState([]);
  const[aiScores,setAiScores]=useState([]);
  const[totalBlocked,setTotalBlocked]=useState(randInt(1200,2400));
  const[totalAllowed,setTotalAllowed]=useState(randInt(3500,5800));
  const[totalThreats,setTotalThreats]=useState(randInt(180,420));
  const[policyModal,setPolicyModal]=useState(null);

  const addEvents=useCallback(()=>{
    const te=generateThreatEvent();
    const ae=generateAIUsageEvent(tools);
    setThreats(prev=>[te,...prev].slice(0,100));
    setAiEvents(prev=>[ae,...prev].slice(0,100));
    setThreatScores(prev=>[...prev,te.riskScore].slice(-60));
    setAiScores(prev=>[...prev,ae.action==="차단"?80:ae.action==="경고"?50:20].slice(-60));
    if(ae.action==="차단")setTotalBlocked(p=>p+1);
    else setTotalAllowed(p=>p+1);
    if(te.threat.severity==="critical"||te.threat.severity==="high")setTotalThreats(p=>p+1);
    // Update tool attempts
    setTools(prev=>prev.map(t=>t.name===ae.tool?{...t,dailyAttempts:t.dailyAttempts+1}:t));
  },[tools]);

  useEffect(()=>{
    if(isPaused)return;
    const iv=setInterval(addEvents,speed);
    return()=>clearInterval(iv);
  },[isPaused,speed,addEvents]);

  // Initial data
  useEffect(()=>{for(let i=0;i<15;i++)addEvents();},[]);

  const sevColors={critical:"#ff2d55",high:"#ff9500",medium:"#ffcc00",low:"#30d158"};
  const panelStyle={background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:14,padding:16};
  const blockedTools=tools.filter(t=>t.status==="blocked");
  const allowedTools=tools.filter(t=>t.status==="allowed");
  const monitoringTools=tools.filter(t=>t.status==="monitoring");
  const critThreats=threats.filter(t=>t.threat.severity==="critical").length;
  const highThreats=threats.filter(t=>t.threat.severity==="high").length;

  const toggleToolStatus=(name,newStatus)=>{
    setTools(prev=>prev.map(t=>t.name===name?{...t,status:newStatus}:t));
    setPolicyModal(null);
  };

  return(
    <div style={{width:"100%",minHeight:"100vh",fontFamily:"'Pretendard',-apple-system,'Noto Sans KR',sans-serif",background:"#080c14",color:"#e2e8f0"}}>
      <style>{`@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes scanLine{0%{top:0;opacity:.6}100%{top:100%;opacity:0}}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,.08);border-radius:3px}`}</style>

      {/* Background Effects */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,background:"radial-gradient(ellipse at 20% 30%,rgba(59,130,246,0.04) 0%,transparent 50%),radial-gradient(ellipse at 80% 70%,rgba(239,68,68,0.03) 0%,transparent 50%)"}}/>

      {/* Policy Modal */}
      {policyModal&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",backdropFilter:"blur(8px)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setPolicyModal(null)}>
        <div onClick={e=>e.stopPropagation()} style={{background:"#111827",borderRadius:18,padding:28,width:420,border:"1px solid rgba(255,255,255,.08)",animation:"fadeIn .3s"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
            <span style={{fontSize:28}}>{policyModal.icon}</span>
            <div>
              <div style={{fontSize:17,fontWeight:700}}>{policyModal.name}</div>
              <div style={{fontSize:12,color:"#64748b"}}>{policyModal.vendor} · {policyModal.category}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:6,marginBottom:16}}>
            <span style={{padding:"3px 10px",borderRadius:6,fontSize:10,fontWeight:700,background:policyModal.risk==="high"?"rgba(255,45,85,.12)":policyModal.risk==="medium"?"rgba(255,204,0,.12)":"rgba(48,209,88,.12)",color:policyModal.risk==="high"?"#ff2d55":policyModal.risk==="medium"?"#ffcc00":"#30d158",border:`1px solid ${policyModal.risk==="high"?"rgba(255,45,85,.2)":policyModal.risk==="medium"?"rgba(255,204,0,.2)":"rgba(48,209,88,.2)"}`}}>위험도: {policyModal.risk}</span>
            <span style={{padding:"3px 10px",borderRadius:6,fontSize:10,fontWeight:700,background:policyModal.status==="blocked"?"rgba(255,45,85,.12)":policyModal.status==="allowed"?"rgba(48,209,88,.12)":"rgba(255,204,0,.12)",color:policyModal.status==="blocked"?"#ff2d55":policyModal.status==="allowed"?"#30d158":"#ffcc00"}}>현재: {policyModal.status==="blocked"?"차단":policyModal.status==="allowed"?"허용":"모니터링"}</span>
          </div>
          <div style={{fontSize:12,color:"#94a3b8",marginBottom:16,lineHeight:1.7}}>일일 접근 시도: <strong style={{color:"#e2e8f0"}}>{policyModal.dailyAttempts}건</strong></div>
          <div style={{fontSize:11,fontWeight:600,color:"#64748b",marginBottom:8}}>정책 변경</div>
          <div style={{display:"flex",gap:8}}>
            {["allowed","monitoring","blocked"].map(s=>(
              <button key={s} onClick={()=>toggleToolStatus(policyModal.name,s)} style={{flex:1,padding:"10px 0",borderRadius:10,border:policyModal.status===s?"2px solid":`1px solid rgba(255,255,255,.1)`,borderColor:policyModal.status===s?(s==="blocked"?"#ff2d55":s==="allowed"?"#30d158":"#ffcc00"):"rgba(255,255,255,.1)",background:policyModal.status===s?(s==="blocked"?"rgba(255,45,85,.1)":s==="allowed"?"rgba(48,209,88,.1)":"rgba(255,204,0,.1)"):"rgba(255,255,255,.03)",color:s==="blocked"?"#ff2d55":s==="allowed"?"#30d158":"#ffcc00",fontSize:12,fontWeight:700,cursor:"pointer"}}>
                {s==="blocked"?"🚫 차단":s==="allowed"?"✅ 허용":"👁️ 모니터링"}
              </button>
            ))}
          </div>
        </div>
      </div>}

      {/* Header */}
      <div style={{position:"sticky",top:0,zIndex:100,background:"rgba(8,12,20,.92)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(59,130,246,.1)",padding:"12px 24px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            {onBack&&<button onClick={onBack} style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",borderRadius:8,padding:"6px 12px",color:"#94a3b8",fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>← DMP</button>}
            <div style={{width:38,height:38,borderRadius:10,background:"linear-gradient(135deg,#3b82f6,#1d4ed8)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,boxShadow:"0 4px 15px rgba(59,130,246,.3)"}}>🛡️</div>
            <div>
              <div style={{fontSize:16,fontWeight:800,display:"flex",alignItems:"center",gap:8}}>AI 방화벽 <span style={{fontSize:10,padding:"2px 8px",borderRadius:6,background:"rgba(59,130,246,.12)",color:"#60a5fa",fontWeight:700}}>LIVE</span></div>
              <div style={{fontSize:10,color:"#64748b"}}>AI Tool 보안관제 · 외부 위협 차단 · 내부 자산 보호</div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            {/* Tabs */}
            <div style={{display:"flex",background:"rgba(255,255,255,.04)",borderRadius:8,padding:2}}>
              {[{id:"overview",l:"📊 개요"},{id:"ai",l:"🤖 AI 관제"},{id:"threats",l:"🚨 위협 탐지"},{id:"policy",l:"📋 정책"}].map(tab=>(
                <button key={tab.id} onClick={()=>setActiveTab(tab.id)} style={{padding:"6px 14px",borderRadius:6,border:"none",fontSize:11,fontWeight:activeTab===tab.id?700:500,background:activeTab===tab.id?"rgba(59,130,246,.15)":"transparent",color:activeTab===tab.id?"#60a5fa":"#64748b",cursor:"pointer"}}>{tab.l}</button>
              ))}
            </div>
            <button onClick={()=>setIsPaused(!isPaused)} style={{padding:"6px 12px",borderRadius:7,background:isPaused?"rgba(48,209,88,.1)":"rgba(255,45,85,.1)",border:`1px solid ${isPaused?"rgba(48,209,88,.2)":"rgba(255,45,85,.2)"}`,color:isPaused?"#30d158":"#ff2d55",fontSize:11,fontWeight:600,cursor:"pointer"}}>{isPaused?"▶ 재개":"⏸ 일시정지"}</button>
          </div>
        </div>
      </div>

      <div style={{padding:"16px 24px"}}>
        {/* ═══ OVERVIEW TAB ═══ */}
        {activeTab==="overview"&&<div style={{animation:"fadeIn .4s"}}>
          {/* Stats Row */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,marginBottom:16}}>
            {[
              {label:"차단된 AI 요청",value:totalBlocked.toLocaleString(),icon:"🚫",color:"#ff2d55",sub:"오늘"},
              {label:"허용된 AI 요청",value:totalAllowed.toLocaleString(),icon:"✅",color:"#30d158",sub:"오늘"},
              {label:"외부 위협 탐지",value:totalThreats.toLocaleString(),icon:"🚨",color:"#ff9500",sub:"심각+높음"},
              {label:"모니터링 대상",value:monitoringTools.length+"개 도구",icon:"👁️",color:"#ffcc00",sub:"AI 도구"},
              {label:"활성 정책",value:tools.length+"개",icon:"📋",color:"#60a5fa",sub:"AI 보안 정책"},
            ].map((s,i)=>(
              <div key={i} style={{...panelStyle,display:"flex",flexDirection:"column",gap:6}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:10,color:"#64748b",fontWeight:600}}>{s.label}</span>
                  <span style={{fontSize:14}}>{s.icon}</span>
                </div>
                <div style={{fontSize:22,fontWeight:800,color:s.color,fontFamily:"'DM Mono',monospace"}}>{s.value}</div>
                <div style={{fontSize:9,color:"#475569"}}>{s.sub}</div>
              </div>
            ))}
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
            {/* Threat Score Chart */}
            <div style={{...panelStyle,border:"1px solid rgba(255,45,85,.12)",background:"rgba(255,45,85,.02)"}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
                <PulsingDot color="#ff2d55"/>
                <span style={{fontSize:12,fontWeight:700}}>외부 위협 추이</span>
                <span style={{fontSize:9,padding:"2px 6px",borderRadius:5,background:"rgba(255,45,85,.12)",color:"#ff2d55",fontWeight:700}}>실시간</span>
              </div>
              <LiveChart data={threatScores} color="#ff2d55" height={100}/>
            </div>
            {/* AI Traffic Chart */}
            <div style={{...panelStyle,border:"1px solid rgba(59,130,246,.12)",background:"rgba(59,130,246,.02)"}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
                <PulsingDot color="#3b82f6"/>
                <span style={{fontSize:12,fontWeight:700}}>AI 트래픽 추이</span>
                <span style={{fontSize:9,padding:"2px 6px",borderRadius:5,background:"rgba(59,130,246,.12)",color:"#60a5fa",fontWeight:700}}>실시간</span>
              </div>
              <LiveChart data={aiScores} color="#3b82f6" height={100}/>
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 360px",gap:16}}>
            {/* Recent Events Feed */}
            <div style={panelStyle}>
              <div style={{fontSize:12,fontWeight:700,marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
                📡 최근 이벤트 <span style={{fontSize:10,color:"#60a5fa",background:"rgba(59,130,246,.1)",padding:"2px 7px",borderRadius:10}}>{threats.length+aiEvents.length}건</span>
              </div>
              <div style={{maxHeight:340,overflowY:"auto",display:"flex",flexDirection:"column",gap:6}}>
                {[...threats.slice(0,5).map(t=>({...t,kind:"threat"})),...aiEvents.slice(0,5).map(a=>({...a,kind:"ai"}))].sort((a,b)=>b.timestamp-a.timestamp).slice(0,10).map(ev=>(
                  <div key={ev.id} style={{padding:"10px 12px",borderRadius:10,background:ev.kind==="threat"?"rgba(255,45,85,.04)":"rgba(59,130,246,.04)",border:`1px solid ${ev.kind==="threat"?"rgba(255,45,85,.1)":"rgba(59,130,246,.1)"}`,display:"flex",alignItems:"center",gap:10,animation:"fadeIn .3s"}}>
                    <span style={{fontSize:16}}>{ev.kind==="threat"?ev.threat.icon:ev.toolIcon}</span>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:11.5,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ev.kind==="threat"?ev.threat.label:ev.tool+" — "+ev.query}</div>
                      <div style={{fontSize:10,color:"#64748b"}}>{ev.dept} · {ev.timestamp.toLocaleTimeString("ko-KR",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}</div>
                    </div>
                    <span style={{padding:"3px 8px",borderRadius:6,fontSize:9,fontWeight:700,color:ev.kind==="threat"?(ev.action==="차단"?"#ff2d55":"#ff9500"):(ev.action==="차단"?"#ff2d55":ev.action.includes("허용")?"#30d158":"#ffcc00"),background:ev.kind==="threat"?(ev.action==="차단"?"rgba(255,45,85,.12)":"rgba(255,149,0,.12)"):(ev.action==="차단"?"rgba(255,45,85,.12)":ev.action.includes("허용")?"rgba(48,209,88,.12)":"rgba(255,204,0,.12)")}}>{ev.action}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Tool Status Sidebar */}
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div style={panelStyle}>
                <div style={{fontSize:12,fontWeight:700,marginBottom:10}}>🤖 AI 도구 현황</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:10}}>
                  {[{l:"차단",v:blockedTools.length,c:"#ff2d55"},{l:"허용",v:allowedTools.length,c:"#30d158"},{l:"모니터링",v:monitoringTools.length,c:"#ffcc00"}].map(s=>(
                    <div key={s.l} style={{textAlign:"center",padding:"8px 0",borderRadius:8,background:s.c+"10",border:`1px solid ${s.c}20`}}>
                      <div style={{fontSize:18,fontWeight:800,color:s.c,fontFamily:"'DM Mono',monospace"}}>{s.v}</div>
                      <div style={{fontSize:9,color:"#64748b"}}>{s.l}</div>
                    </div>
                  ))}
                </div>
                {tools.slice(0,8).map(tool=>(
                  <div key={tool.name} onClick={()=>setPolicyModal(tool)} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 8px",borderRadius:8,cursor:"pointer",marginBottom:3,transition:"all .15s"}}
                    onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.04)"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <span style={{fontSize:14}}>{tool.icon}</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:11,fontWeight:600}}>{tool.name}</div>
                      <div style={{fontSize:9,color:"#64748b"}}>{tool.category}</div>
                    </div>
                    <span style={{width:8,height:8,borderRadius:"50%",background:tool.status==="blocked"?"#ff2d55":tool.status==="allowed"?"#30d158":"#ffcc00"}}/>
                  </div>
                ))}
              </div>
              <div style={panelStyle}>
                <div style={{fontSize:12,fontWeight:700,marginBottom:8}}>🏢 부서별 AI 사용량</div>
                {DEPARTMENTS.slice(0,6).map(dept=>{
                  const cnt=aiEvents.filter(e=>e.dept===dept).length;
                  const blocked=aiEvents.filter(e=>e.dept===dept&&e.action==="차단").length;
                  const pct=Math.min(100,cnt*8);
                  return(
                    <div key={dept} style={{marginBottom:6}}>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:10,marginBottom:2}}>
                        <span style={{color:"#94a3b8"}}>{dept}</span>
                        <span style={{color:"#64748b"}}>{cnt}건{blocked>0&&<span style={{color:"#ff2d55",marginLeft:4}}>({blocked}차단)</span>}</span>
                      </div>
                      <div style={{height:4,borderRadius:2,background:"rgba(255,255,255,.06)",overflow:"hidden"}}>
                        <div style={{height:"100%",borderRadius:2,background:blocked>2?"linear-gradient(90deg,#3b82f6,#ff2d55)":"#3b82f6",width:pct+"%",transition:"width .5s"}}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>}

        {/* ═══ AI CONTROL TAB ═══ */}
        {activeTab==="ai"&&<div style={{animation:"fadeIn .4s"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            {/* AI Event Feed */}
            <div style={panelStyle}>
              <div style={{fontSize:13,fontWeight:700,marginBottom:12,display:"flex",alignItems:"center",gap:6}}>🤖 AI 도구 사용 로그 <span style={{fontSize:10,color:"#60a5fa",background:"rgba(59,130,246,.1)",padding:"2px 7px",borderRadius:10}}>{aiEvents.length}건</span></div>
              <div style={{maxHeight:"calc(100vh - 200px)",overflowY:"auto",display:"flex",flexDirection:"column",gap:6}}>
                {aiEvents.slice(0,30).map(ev=>(
                  <div key={ev.id} style={{padding:"12px 14px",borderRadius:11,background:ev.action==="차단"?"rgba(255,45,85,.04)":ev.riskFlag?"rgba(255,204,0,.04)":"rgba(255,255,255,.02)",border:`1px solid ${ev.action==="차단"?"rgba(255,45,85,.1)":ev.riskFlag?"rgba(255,204,0,.08)":"rgba(255,255,255,.04)"}`,animation:"fadeIn .3s"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                      <span style={{fontSize:16}}>{ev.toolIcon}</span>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:6}}>
                          <span style={{fontSize:12,fontWeight:700}}>{ev.tool}</span>
                          <span style={{fontSize:9,color:"#64748b",background:"rgba(255,255,255,.04)",padding:"1px 6px",borderRadius:4}}>{ev.category}</span>
                        </div>
                        <div style={{fontSize:10,color:"#64748b"}}>{ev.user} · {ev.dept} · {ev.timestamp.toLocaleTimeString("ko-KR",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}</div>
                      </div>
                      <span style={{padding:"3px 10px",borderRadius:6,fontSize:10,fontWeight:700,color:ev.action==="차단"?"#ff2d55":ev.action.includes("허용")?"#30d158":"#ffcc00",background:ev.action==="차단"?"rgba(255,45,85,.12)":ev.action.includes("허용")?"rgba(48,209,88,.12)":"rgba(255,204,0,.12)"}}>{ev.action}</span>
                    </div>
                    <div style={{fontSize:11,color:"#94a3b8",paddingLeft:24}}>요청: {ev.query} {ev.dataVolume!=="—"&&<span style={{color:"#64748b"}}>· {ev.dataVolume}</span>}</div>
                    {ev.riskFlag&&<div style={{fontSize:10,color:"#ff9500",paddingLeft:24,marginTop:3}}>⚠️ {ev.riskFlag}</div>}
                  </div>
                ))}
              </div>
            </div>
            {/* AI Tool Dashboard */}
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {[{title:"🚫 차단 목록",tools:blockedTools,color:"#ff2d55",bg:"rgba(255,45,85,.03)",border:"rgba(255,45,85,.1)"},
                {title:"✅ 허용 목록",tools:allowedTools,color:"#30d158",bg:"rgba(48,209,88,.03)",border:"rgba(48,209,88,.1)"},
                {title:"👁️ 모니터링",tools:monitoringTools,color:"#ffcc00",bg:"rgba(255,204,0,.03)",border:"rgba(255,204,0,.1)"}
              ].map(group=>(
                <div key={group.title} style={{...panelStyle,background:group.bg,border:`1px solid ${group.border}`}}>
                  <div style={{fontSize:12,fontWeight:700,color:group.color,marginBottom:10}}>{group.title} ({group.tools.length})</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                    {group.tools.map(tool=>(
                      <div key={tool.name} onClick={()=>setPolicyModal(tool)} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 10px",borderRadius:8,background:"rgba(255,255,255,.03)",border:`1px solid ${group.border}`,cursor:"pointer",transition:"all .2s"}}
                        onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.06)"}
                        onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.03)"}>
                        <span style={{fontSize:14}}>{tool.icon}</span>
                        <div>
                          <div style={{fontSize:11,fontWeight:600}}>{tool.name}</div>
                          <div style={{fontSize:9,color:"#64748b"}}>{tool.dailyAttempts}건/일</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>}

        {/* ═══ THREATS TAB ═══ */}
        {activeTab==="threats"&&<div style={{animation:"fadeIn .4s"}}>
          {/* Threat Chart */}
          <div style={{...panelStyle,marginBottom:16,border:"1px solid rgba(255,45,85,.12)",background:"rgba(255,45,85,.02)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <PulsingDot color="#ff2d55"/>
                <span style={{fontSize:14,fontWeight:700}}>실시간 위협 탐지 현황</span>
                <span style={{fontSize:10,padding:"2px 8px",borderRadius:6,background:"rgba(255,45,85,.12)",color:"#ff2d55",fontWeight:700}}>AI 분석</span>
              </div>
              <div style={{display:"flex",gap:10}}>
                <div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:6,height:6,borderRadius:2,background:"#ff2d55"}}/><span style={{fontSize:10,color:"#64748b"}}>심각 {critThreats}</span></div>
                <div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:6,height:6,borderRadius:2,background:"#ff9500"}}/><span style={{fontSize:10,color:"#64748b"}}>높음 {highThreats}</span></div>
              </div>
            </div>
            <LiveChart data={threatScores} color="#ff2d55" height={140}/>
          </div>
          {/* Threat Feed */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:16}}>
            <div style={{maxHeight:"calc(100vh - 360px)",overflowY:"auto",display:"flex",flexDirection:"column",gap:8}}>
              {threats.slice(0,30).map(ev=>(
                <div key={ev.id} onClick={()=>setExpandedThreat(expandedThreat===ev.id?null:ev.id)} style={{padding:"14px 16px",borderRadius:12,background:ev.threat.severity==="critical"?"rgba(255,45,85,.05)":"rgba(255,255,255,.02)",border:`1px solid ${sevColors[ev.threat.severity]}20`,cursor:"pointer",transition:"all .2s",animation:"fadeIn .3s"}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=sevColors[ev.threat.severity]+"50"}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=sevColors[ev.threat.severity]+"20"}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:20}}>{ev.threat.icon}</span>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <span style={{fontSize:13,fontWeight:700}}>{ev.threat.label}</span>
                        <span style={{padding:"2px 6px",borderRadius:5,fontSize:9,fontWeight:700,color:sevColors[ev.threat.severity],background:sevColors[ev.threat.severity]+"15"}}>{ev.riskScore}</span>
                      </div>
                      <div style={{fontSize:10,color:"#64748b",marginTop:2}}>{ev.dept} · {ev.sourceIP} → {ev.destination}</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:10,fontFamily:"'DM Mono',monospace",color:"#64748b"}}>{ev.timestamp.toLocaleTimeString("ko-KR",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}</div>
                      <span style={{padding:"2px 8px",borderRadius:5,fontSize:9,fontWeight:700,color:ev.action==="차단"||ev.action==="IP 차단"||ev.action==="세션 종료"?"#ff2d55":"#ff9500",background:ev.action==="차단"||ev.action==="IP 차단"||ev.action==="세션 종료"?"rgba(255,45,85,.12)":"rgba(255,149,0,.12)"}}>{ev.action}</span>
                    </div>
                  </div>
                  {expandedThreat===ev.id&&<div style={{marginTop:10,paddingTop:10,borderTop:"1px solid rgba(255,255,255,.06)",animation:"fadeIn .3s"}}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,fontSize:11}}>
                      <div><span style={{color:"#64748b"}}>페이로드:</span> <span style={{color:"#e2e8f0"}}>{ev.payload}</span></div>
                      <div><span style={{color:"#64748b"}}>출발지:</span> <span style={{color:"#e2e8f0",fontFamily:"'DM Mono',monospace"}}>{ev.sourceIP}</span></div>
                      <div><span style={{color:"#64748b"}}>목적지:</span> <span style={{color:"#e2e8f0"}}>{ev.destination}</span></div>
                      <div><span style={{color:"#64748b"}}>조치:</span> <span style={{color:ev.action.includes("차단")?"#ff2d55":"#ff9500",fontWeight:600}}>{ev.action}</span></div>
                    </div>
                  </div>}
                </div>
              ))}
            </div>
            {/* Threat Type Distribution */}
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div style={panelStyle}>
                <div style={{fontSize:12,fontWeight:700,marginBottom:10}}>🎯 위협 유형 분포</div>
                {THREAT_TYPES.map(tt=>{
                  const cnt=threats.filter(t=>t.threat.type===tt.type).length;
                  const pct=Math.min(100,cnt*6);
                  return(
                    <div key={tt.type} style={{marginBottom:8}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:10,marginBottom:2}}>
                        <span style={{color:"#94a3b8"}}>{tt.icon} {tt.label}</span>
                        <span style={{fontFamily:"'DM Mono',monospace",color:sevColors[tt.severity]}}>{cnt}</span>
                      </div>
                      <div style={{height:4,borderRadius:2,background:"rgba(255,255,255,.06)",overflow:"hidden"}}>
                        <div style={{height:"100%",borderRadius:2,background:sevColors[tt.severity],width:pct+"%",transition:"width .5s"}}/>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={panelStyle}>
                <div style={{fontSize:12,fontWeight:700,marginBottom:8}}>⚡ 최근 차단 조치</div>
                {threats.filter(t=>t.action.includes("차단")).slice(0,5).map(t=>(
                  <div key={t.id} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0",borderBottom:"1px solid rgba(255,255,255,.04)"}}>
                    <span style={{fontSize:12}}>{t.threat.icon}</span>
                    <div style={{flex:1,fontSize:10,color:"#94a3b8"}}>{t.threat.label}</div>
                    <span style={{fontSize:9,fontFamily:"'DM Mono',monospace",color:"#64748b"}}>{t.sourceIP}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>}

        {/* ═══ POLICY TAB ═══ */}
        {activeTab==="policy"&&<div style={{animation:"fadeIn .4s"}}>
          <div style={{...panelStyle,marginBottom:16}}>
            <div style={{fontSize:14,fontWeight:700,marginBottom:4}}>📋 AI 보안 정책 관리</div>
            <div style={{fontSize:11,color:"#64748b",marginBottom:16}}>기업 내 AI 도구 사용 정책을 관리하고, 위험도 기반 자동 분류 및 접근 제어를 수행합니다.</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
              {tools.map(tool=>(
                <div key={tool.name} onClick={()=>setPolicyModal(tool)} style={{padding:"14px 16px",borderRadius:12,background:tool.status==="blocked"?"rgba(255,45,85,.04)":tool.status==="allowed"?"rgba(48,209,88,.04)":"rgba(255,204,0,.04)",border:`1px solid ${tool.status==="blocked"?"rgba(255,45,85,.12)":tool.status==="allowed"?"rgba(48,209,88,.12)":"rgba(255,204,0,.12)"}`,cursor:"pointer",transition:"all .2s"}}
                  onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                  onMouseLeave={e=>e.currentTarget.style.transform="none"}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                    <span style={{fontSize:22}}>{tool.icon}</span>
                    <div>
                      <div style={{fontSize:13,fontWeight:700}}>{tool.name}</div>
                      <div style={{fontSize:10,color:"#64748b"}}>{tool.vendor}</div>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                    <span style={{padding:"2px 7px",borderRadius:5,fontSize:9,fontWeight:600,background:"rgba(255,255,255,.04)",color:"#94a3b8"}}>{tool.category}</span>
                    <span style={{padding:"2px 7px",borderRadius:5,fontSize:9,fontWeight:700,color:tool.risk==="high"?"#ff2d55":tool.risk==="medium"?"#ffcc00":"#30d158",background:tool.risk==="high"?"rgba(255,45,85,.1)":tool.risk==="medium"?"rgba(255,204,0,.1)":"rgba(48,209,88,.1)"}}>{tool.risk}</span>
                    <span style={{padding:"2px 7px",borderRadius:5,fontSize:9,fontWeight:700,marginLeft:"auto",color:tool.status==="blocked"?"#ff2d55":tool.status==="allowed"?"#30d158":"#ffcc00",background:tool.status==="blocked"?"rgba(255,45,85,.12)":tool.status==="allowed"?"rgba(48,209,88,.12)":"rgba(255,204,0,.12)"}}>{tool.status==="blocked"?"차단":tool.status==="allowed"?"허용":"모니터링"}</span>
                  </div>
                  <div style={{fontSize:10,color:"#64748b",marginTop:6}}>일일 시도: <strong style={{color:"#e2e8f0"}}>{tool.dailyAttempts}</strong>건</div>
                </div>
              ))}
            </div>
          </div>
        </div>}
      </div>
    </div>
  );
}
