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

const NAMES = ["김현수","이지민","박서연","최민준","정소영","조태우","한예진","윤동훈","서수빈","강재현","임채원","신유진","배준서","송하은","류민재"];
const POSITIONS = ["사원","대리","과장","차장","부장","팀장","매니저","연구원","선임연구원"];
const DETECTION_METHODS = {
  malicious_email:["YARA 룰 매칭(악성 시그니처 탐지)","샌드박스 분석(첨부파일 동적 실행 검사)","이메일 헤더 SPF/DKIM 검증 실패"],
  phishing:["URL 평판 분석(피싱 도메인 DB 매칭)","머신러닝 기반 페이지 구조 분석","SSL 인증서 이상 탐지(자체서명/만료)"],
  data_exfil:["DLP 정책 위반(민감정보 패턴 탐지)","비정상 데이터 전송량 감지(평소 대비 300% 초과)","비인가 외부 전송 목적지 탐지"],
  malware_packet:["IDS/IPS 시그니처 매칭","네트워크 패킷 딥 인스펙션(비정상 페이로드)","C&C 서버 통신 패턴 탐지"],
  ddos:["트래픽 볼륨 이상 탐지(임계치 초과)","SYN Flood 패턴 감지","봇넷 IP 블랙리스트 매칭"],
  unauthorized_api:["API 키 미인증/만료 감지","비인가 엔드포인트 접근 시도","Rate Limit 초과(분당 500회 이상)"],
  prompt_injection:["프롬프트 패턴 분석(시스템 프롬프트 우회 시도)","입력 토큰 이상 탐지(인코딩 우회)","역할 변경 명령어 감지"],
  model_extraction:["반복적 추론 요청 패턴 감지(모델 복제 시도)","응답 데이터 대량 수집 탐지","비정상 API 호출 패턴(파라미터 순차 변경)"],
  sensitive_upload:["PII 탐지(주민등록번호/카드번호 패턴)","기밀 문서 분류 태그 탐지","내부 전용 파일 확장자 외부 전송 감지"],
  shadow_ai:["DNS 쿼리 분석(비인가 AI 도메인)","TLS 핑거프린트 기반 서비스 식별","프록시 우회 접속 시도 탐지"],
};
const THREAT_IMPACTS = {
  malicious_email:["랜섬웨어 감염으로 전사 시스템 마비 위험","내부 계정 탈취 → 2차 피해 확산","기밀 데이터 암호화 및 금전 요구"],
  phishing:["임직원 계정 정보 유출","내부 시스템 무단 접근 권한 획득","거래처 사칭 금전 피해 발생 가능"],
  data_exfil:["고객 개인정보 유출 → 개인정보보호법 위반","영업 기밀 유출 → 경쟁사 유출 위험","규제 당국 과징금 및 기업 신뢰도 하락"],
  malware_packet:["내부 네트워크 감염 확산","백도어 설치 → 지속적 정보 유출","시스템 성능 저하 및 서비스 장애"],
  ddos:["서비스 가용성 저하/중단","고객 서비스 장애 → 매출 손실","공격 중 다른 보안 위협 은폐 가능"],
  unauthorized_api:["내부 데이터 무단 접근/추출","API 남용으로 서비스 성능 저하","권한 상승 공격의 전조 가능"],
  prompt_injection:["AI 시스템 오작동 유도","내부 정책/데이터 유출","AI 의사결정 조작 위험"],
  model_extraction:["AI 모델 지적재산 탈취","경쟁사에 모델 복제 위험","학습 데이터 역추론 가능"],
  sensitive_upload:["기업 기밀 외부 AI 서버에 저장","개인정보 제3자 제공 위반","학습 데이터로 활용되어 영구 유출"],
  shadow_ai:["보안 정책 우회로 통제 불가","민감 데이터가 비인가 AI에 노출","컴플라이언스 위반 리스크"],
};
const RESPONSE_GUIDES = {
  malicious_email:["이메일 격리 및 첨부파일 삭제","발신 IP/도메인 블랙리스트 등록","수신자에게 열람 금지 경고 발송","보안팀 악성코드 분석 의뢰"],
  phishing:["피싱 URL 즉시 차단","해당 계정 비밀번호 강제 변경","전사 피싱 경고 공지 발송","유사 도메인 모니터링 등록"],
  data_exfil:["전송 즉시 차단 및 세션 종료","해당 사용자 계정 일시 정지","유출 데이터 범위 파악 및 로그 확보","CISO 긴급 보고 및 사고대응팀 소집"],
  malware_packet:["패킷 차단 및 출발지 IP 블랙리스트","감염 의심 단말 네트워크 격리","안티바이러스 긴급 스캔 실행","네트워크 포렌식 분석"],
  ddos:["트래픽 필터링 및 Rate Limiting 강화","CDN/방화벽 DDoS 방어 모드 활성화","ISP 연계 상위 트래픽 차단 요청","서비스 가용성 모니터링 강화"],
  unauthorized_api:["API 키 즉시 폐기/재발급","해당 IP/계정 접근 차단","API 접근 로그 전수 조사","인증 체계 점검 및 강화"],
  prompt_injection:["해당 세션 즉시 종료","입력 필터링 규칙 업데이트","AI 시스템 출력 로그 검토","프롬프트 가드레일 강화"],
  model_extraction:["해당 계정/IP 즉시 차단","API Rate Limit 긴급 하향","추론 요청 패턴 정밀 분석","모델 접근 권한 재검토"],
  sensitive_upload:["업로드 즉시 차단","해당 파일의 민감정보 범위 파악","사용자에게 정책 위반 경고","DLP 정책 규칙 보강"],
  shadow_ai:["비인가 AI 도메인 DNS 차단","사용자에게 경고 및 교육 안내","허용된 AI 도구 목록 안내","반복 위반 시 HR 연계 조치"],
};

function generateThreatEvent() {
  const threat = pick(THREAT_TYPES);
  const dept = pick(DEPARTMENTS);
  const src = `${randInt(10,220)}.${randInt(1,254)}.${randInt(1,254)}.${randInt(1,254)}`;
  const action = threat.severity === "critical" ? pick(["차단","세션 종료","IP 차단"]) : pick(ACTIONS_TAKEN);
  const userName = pick(NAMES);
  return {
    id: "FW-"+Date.now()+"-"+randInt(100,999),
    timestamp: new Date(),
    threat, dept, sourceIP: src, action,
    userName, position: pick(POSITIONS), empId: "EMP-"+randInt(10000,99999),
    destination: pick(["내부 DB","파일서버","이메일 서버","API 게이트웨이","클라우드 스토리지"]),
    payload: threat.type === "malicious_email" ? "악성 첨부파일 감지 ("+pick(["invoice.exe","report.zip.js","update.bat"])+")":
             threat.type === "phishing" ? "위조 로그인 페이지 링크 탐지":
             threat.type === "prompt_injection" ? "시스템 프롬프트 우회 시도 감지":
             threat.type === "sensitive_upload" ? pick(["고객DB.csv","계약서_기밀.pdf","소스코드.zip"])+" 업로드 시도":
             threat.type === "shadow_ai" ? pick(AI_TOOLS.filter(t=>t.status==="blocked")).name+" 비인가 접속 시도":
             "비정상 트래픽 패턴 감지",
    detectionMethod: pick(DETECTION_METHODS[threat.type]||["규칙 기반 탐지"]),
    impacts: THREAT_IMPACTS[threat.type]||["보안 위협 발생 가능"],
    responses: RESPONSE_GUIDES[threat.type]||["보안팀 확인 필요"],
    isNew: true,
    riskScore: threat.severity==="critical"?randInt(85,100):threat.severity==="high"?randInt(60,84):randInt(30,59),
  };
}

function generateAIUsageEvent(tools) {
  const tool = pick(tools);
  const dept = pick(DEPARTMENTS);
  const blocked = tool.status === "blocked";
  const userName = pick(NAMES);
  return {
    id: "AI-"+Date.now()+"-"+randInt(100,999),
    timestamp: new Date(),
    tool: tool.name, toolIcon: tool.icon, category: tool.category, toolRisk: tool.risk,
    dept, user: userName, position: pick(POSITIONS), empId: "EMP-"+randInt(10000,99999),
    action: blocked ? "차단" : tool.status==="monitoring" ? pick(["허용(모니터링)","경고"]) : "허용",
    dataVolume: blocked ? "—" : randInt(1,500)+"KB",
    query: blocked ? "접근 차단됨" :
      tool.category==="생성형AI" ? pick(["보고서 초안 작성","이메일 번역","회의록 요약","코드 리뷰 요청","데이터 분석"]):
      tool.category==="코드생성" ? pick(["함수 자동완성","버그 수정 제안","리팩토링","테스트 코드 생성"]):
      pick(["문서 교정","이미지 편집","번역","검색"]),
    riskFlag: blocked ? "정책 위반" : tool.risk==="high" ? "주의 필요" : null,
    detectionMethod: blocked ? "AI 보안 정책 — "+tool.name+" 차단 규칙 매칭" : tool.status==="monitoring" ? "모니터링 대상 AI 도구 사용 감지" : "허용 정책에 의한 정상 접근",
    impacts: blocked ? ["비인가 AI에 사내 데이터 노출 위험","AI 학습 데이터로 활용 시 영구 유출","컴플라이언스 위반 리스크"] : tool.risk==="high" ? ["민감 데이터 외부 전송 가능성","AI 서비스 약관에 따른 데이터 활용 위험"] : [],
    responses: blocked ? ["접근 차단 완료","사용자에게 정책 위반 경고 발송","허용된 AI 도구 목록 안내","반복 위반 시 부서장 통보"] : tool.risk==="high" ? ["데이터 전송 내용 모니터링","민감정보 포함 여부 DLP 검사"] : [],
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
  const[eventDetail,setEventDetail]=useState(null);
  const[newPolicyModal,setNewPolicyModal]=useState(false);
  const[newPolicy,setNewPolicy]=useState({name:"",vendor:"",category:"생성형AI",risk:"medium",status:"blocked",icon:"🔧"});

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
  const addNewTool=()=>{
    if(!newPolicy.name.trim()||!newPolicy.vendor.trim())return;
    setTools(prev=>[...prev,{...newPolicy,dailyAttempts:0}]);
    setNewPolicy({name:"",vendor:"",category:"생성형AI",risk:"medium",status:"blocked",icon:"🔧"});
    setNewPolicyModal(false);
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

      {/* Event Detail Modal */}
      {eventDetail&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",backdropFilter:"blur(8px)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setEventDetail(null)}>
        <div onClick={e=>e.stopPropagation()} style={{background:"#111827",borderRadius:20,width:640,maxWidth:"92vw",maxHeight:"85vh",overflow:"hidden",display:"flex",flexDirection:"column",border:"1px solid rgba(255,255,255,.08)",boxShadow:"0 32px 80px rgba(0,0,0,.5)",animation:"fadeIn .3s"}}>
          {/* Header */}
          <div style={{padding:"20px 24px 14px",borderBottom:"1px solid rgba(255,255,255,.06)",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:40,height:40,borderRadius:12,background:eventDetail.kind==="threat"?"rgba(255,45,85,.12)":"rgba(59,130,246,.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{eventDetail.kind==="threat"?eventDetail.threat.icon:eventDetail.toolIcon}</div>
              <div>
                <div style={{fontSize:16,fontWeight:800}}>{eventDetail.kind==="threat"?eventDetail.threat.label:eventDetail.tool+" — "+eventDetail.action}</div>
                <div style={{fontSize:11,color:"#64748b"}}>{eventDetail.id} · {eventDetail.timestamp.toLocaleString("ko-KR")}</div>
              </div>
            </div>
            <button onClick={()=>setEventDetail(null)} style={{width:32,height:32,borderRadius:8,background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",cursor:"pointer",color:"#94a3b8",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
          </div>
          {/* Body */}
          <div style={{flex:1,overflowY:"auto",padding:"18px 24px 24px",display:"flex",flexDirection:"column",gap:14}}>
            {/* Risk Score + Status */}
            <div style={{display:"flex",gap:8}}>
              {eventDetail.riskScore&&<span style={{padding:"4px 12px",borderRadius:8,fontSize:11,fontWeight:700,background:(eventDetail.riskScore>=85?"rgba(255,45,85,.12)":eventDetail.riskScore>=60?"rgba(255,149,0,.12)":"rgba(255,204,0,.12)"),color:eventDetail.riskScore>=85?"#ff2d55":eventDetail.riskScore>=60?"#ff9500":"#ffcc00",border:`1px solid ${eventDetail.riskScore>=85?"rgba(255,45,85,.2)":eventDetail.riskScore>=60?"rgba(255,149,0,.2)":"rgba(255,204,0,.2)"}`}}>위험도: {eventDetail.riskScore}점</span>}
              <span style={{padding:"4px 12px",borderRadius:8,fontSize:11,fontWeight:700,background:eventDetail.action.includes("차단")?"rgba(255,45,85,.12)":eventDetail.action.includes("허용")?"rgba(48,209,88,.12)":"rgba(255,149,0,.12)",color:eventDetail.action.includes("차단")?"#ff2d55":eventDetail.action.includes("허용")?"#30d158":"#ff9500"}}>{eventDetail.action}</span>
              {eventDetail.kind==="threat"&&<span style={{padding:"4px 12px",borderRadius:8,fontSize:11,fontWeight:700,background:"rgba(255,255,255,.04)",color:"#94a3b8"}}>{eventDetail.threat.severity}</span>}
            </div>
            {/* 발생자 정보 */}
            <div style={{background:"rgba(255,255,255,.03)",borderRadius:14,padding:"14px 16px",border:"1px solid rgba(255,255,255,.06)"}}>
              <div style={{fontSize:11,fontWeight:700,color:"#60a5fa",marginBottom:10,display:"flex",alignItems:"center",gap:6}}>👤 이벤트 발생자 정보</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {[["이름",eventDetail.userName||eventDetail.user||"—"],["직급",eventDetail.position||"—"],["부서",eventDetail.dept],["사번",eventDetail.empId||"—"],["출발지 IP",eventDetail.sourceIP||"내부 네트워크"],["대상",eventDetail.destination||eventDetail.tool||"—"]].map(([k,v],i)=>(
                  <div key={i} style={{display:"flex",gap:8,fontSize:11.5}}>
                    <span style={{color:"#64748b",minWidth:70,fontWeight:600}}>{k}</span>
                    <span style={{color:"#e2e8f0",fontWeight:500,fontFamily:k.includes("IP")||k==="사번"?"'DM Mono',monospace":"inherit"}}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* 탐지 근거 */}
            <div style={{background:"rgba(59,130,246,.04)",borderRadius:14,padding:"14px 16px",border:"1px solid rgba(59,130,246,.12)"}}>
              <div style={{fontSize:11,fontWeight:700,color:"#60a5fa",marginBottom:10,display:"flex",alignItems:"center",gap:6}}>🔍 탐지 근거</div>
              <div style={{fontSize:12,color:"#e2e8f0",lineHeight:1.7,marginBottom:8}}>{eventDetail.detectionMethod}</div>
              {eventDetail.payload&&<div style={{fontSize:11,color:"#94a3b8",padding:"8px 12px",borderRadius:8,background:"rgba(0,0,0,.2)",fontFamily:"'DM Mono',monospace"}}>페이로드: {eventDetail.payload}</div>}
            </div>
            {/* 대응 방법 */}
            {eventDetail.responses&&eventDetail.responses.length>0&&<div style={{background:"rgba(48,209,88,.04)",borderRadius:14,padding:"14px 16px",border:"1px solid rgba(48,209,88,.12)"}}>
              <div style={{fontSize:11,fontWeight:700,color:"#30d158",marginBottom:10,display:"flex",alignItems:"center",gap:6}}>🛡️ 대응 조치 가이드</div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {eventDetail.responses.map((r,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"flex-start",gap:8,fontSize:11.5,color:"#e2e8f0",lineHeight:1.6}}>
                    <span style={{color:"#30d158",fontWeight:700,fontSize:10,marginTop:2,flexShrink:0}}>Step {i+1}</span>
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </div>}
            {/* 위협 영향 */}
            {eventDetail.impacts&&eventDetail.impacts.length>0&&<div style={{background:"rgba(255,45,85,.04)",borderRadius:14,padding:"14px 16px",border:"1px solid rgba(255,45,85,.12)"}}>
              <div style={{fontSize:11,fontWeight:700,color:"#ff2d55",marginBottom:10,display:"flex",alignItems:"center",gap:6}}>⚠️ 야기되는 위협</div>
              <div style={{display:"flex",flexDirection:"column",gap:5}}>
                {eventDetail.impacts.map((imp,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:8,fontSize:11.5,color:"#fca5a5"}}>
                    <span style={{width:5,height:5,borderRadius:"50%",background:"#ff2d55",flexShrink:0}}/>
                    <span>{imp}</span>
                  </div>
                ))}
              </div>
            </div>}
          </div>
        </div>
      </div>}

      {/* New Policy Modal */}
      {newPolicyModal&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",backdropFilter:"blur(8px)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setNewPolicyModal(false)}>
        <div onClick={e=>e.stopPropagation()} style={{background:"#111827",borderRadius:18,padding:28,width:480,border:"1px solid rgba(255,255,255,.08)",animation:"fadeIn .3s"}}>
          <div style={{fontSize:18,fontWeight:800,marginBottom:4}}>📋 새 AI 보안 정책 추가</div>
          <div style={{fontSize:11,color:"#64748b",marginBottom:20}}>새로운 AI 도구에 대한 보안 정책을 등록합니다.</div>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{display:"grid",gridTemplateColumns:"48px 1fr",gap:12,alignItems:"end"}}>
              <div>
                <div style={{fontSize:10,color:"#64748b",fontWeight:600,marginBottom:4}}>아이콘</div>
                <input value={newPolicy.icon} onChange={e=>setNewPolicy({...newPolicy,icon:e.target.value})} style={{width:"100%",padding:"10px 0",borderRadius:10,background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",color:"#fff",fontSize:20,textAlign:"center",outline:"none",boxSizing:"border-box"}}/>
              </div>
              <div>
                <div style={{fontSize:10,color:"#64748b",fontWeight:600,marginBottom:4}}>도구 이름 *</div>
                <input value={newPolicy.name} onChange={e=>setNewPolicy({...newPolicy,name:e.target.value})} placeholder="예: Sora, Grok" style={{width:"100%",padding:"10px 14px",borderRadius:10,background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",color:"#fff",fontSize:13,outline:"none",boxSizing:"border-box"}}/>
              </div>
            </div>
            <div>
              <div style={{fontSize:10,color:"#64748b",fontWeight:600,marginBottom:4}}>개발사/벤더 *</div>
              <input value={newPolicy.vendor} onChange={e=>setNewPolicy({...newPolicy,vendor:e.target.value})} placeholder="예: OpenAI, xAI" style={{width:"100%",padding:"10px 14px",borderRadius:10,background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",color:"#fff",fontSize:13,outline:"none",boxSizing:"border-box"}}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div>
                <div style={{fontSize:10,color:"#64748b",fontWeight:600,marginBottom:4}}>카테고리</div>
                <select value={newPolicy.category} onChange={e=>setNewPolicy({...newPolicy,category:e.target.value})} style={{width:"100%",padding:"10px 14px",borderRadius:10,background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",color:"#fff",fontSize:12,cursor:"pointer",outline:"none"}}>
                  {["생성형AI","코드생성","이미지생성","영상생성","음악생성","문서작성","번역","검색AI","기타"].map(c=><option key={c} value={c} style={{background:"#1a2540"}}>{c}</option>)}
                </select>
              </div>
              <div>
                <div style={{fontSize:10,color:"#64748b",fontWeight:600,marginBottom:4}}>위험도</div>
                <select value={newPolicy.risk} onChange={e=>setNewPolicy({...newPolicy,risk:e.target.value})} style={{width:"100%",padding:"10px 14px",borderRadius:10,background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",color:"#fff",fontSize:12,cursor:"pointer",outline:"none"}}>
                  {[{v:"high",l:"🔴 높음"},{v:"medium",l:"🟡 중간"},{v:"low",l:"🟢 낮음"}].map(r=><option key={r.v} value={r.v} style={{background:"#1a2540"}}>{r.l}</option>)}
                </select>
              </div>
            </div>
            <div>
              <div style={{fontSize:10,color:"#64748b",fontWeight:600,marginBottom:6}}>초기 정책</div>
              <div style={{display:"flex",gap:8}}>
                {["blocked","monitoring","allowed"].map(s=>(
                  <button key={s} onClick={()=>setNewPolicy({...newPolicy,status:s})} style={{flex:1,padding:"10px 0",borderRadius:10,border:newPolicy.status===s?"2px solid":`1px solid rgba(255,255,255,.1)`,borderColor:newPolicy.status===s?(s==="blocked"?"#ff2d55":s==="allowed"?"#30d158":"#ffcc00"):"rgba(255,255,255,.1)",background:newPolicy.status===s?(s==="blocked"?"rgba(255,45,85,.1)":s==="allowed"?"rgba(48,209,88,.1)":"rgba(255,204,0,.1)"):"rgba(255,255,255,.03)",color:s==="blocked"?"#ff2d55":s==="allowed"?"#30d158":"#ffcc00",fontSize:12,fontWeight:700,cursor:"pointer"}}>
                    {s==="blocked"?"🚫 차단":s==="allowed"?"✅ 허용":"👁️ 모니터링"}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div style={{display:"flex",gap:10,marginTop:20,justifyContent:"flex-end"}}>
            <button onClick={()=>setNewPolicyModal(false)} style={{padding:"10px 20px",borderRadius:10,border:"1px solid rgba(255,255,255,.1)",background:"transparent",color:"#94a3b8",fontSize:12,fontWeight:600,cursor:"pointer"}}>취소</button>
            <button onClick={addNewTool} disabled={!newPolicy.name.trim()||!newPolicy.vendor.trim()} style={{padding:"10px 24px",borderRadius:10,border:"none",background:newPolicy.name.trim()&&newPolicy.vendor.trim()?"linear-gradient(135deg,#3b82f6,#1d4ed8)":"rgba(255,255,255,.04)",color:newPolicy.name.trim()&&newPolicy.vendor.trim()?"#fff":"#475569",fontSize:12,fontWeight:700,cursor:newPolicy.name.trim()&&newPolicy.vendor.trim()?"pointer":"not-allowed"}}>정책 등록</button>
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
                  <div key={ev.id} onClick={()=>setEventDetail(ev)} style={{padding:"10px 12px",borderRadius:10,background:ev.kind==="threat"?"rgba(255,45,85,.04)":"rgba(59,130,246,.04)",border:`1px solid ${ev.kind==="threat"?"rgba(255,45,85,.1)":"rgba(59,130,246,.1)"}`,display:"flex",alignItems:"center",gap:10,animation:"fadeIn .3s",cursor:"pointer",transition:"all .15s"}}
                    onMouseEnter={e=>e.currentTarget.style.borderColor=ev.kind==="threat"?"rgba(255,45,85,.3)":"rgba(59,130,246,.3)"}
                    onMouseLeave={e=>e.currentTarget.style.borderColor=ev.kind==="threat"?"rgba(255,45,85,.1)":"rgba(59,130,246,.1)"}>
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
                  <div key={ev.id} onClick={()=>setEventDetail({...ev,kind:"ai"})} style={{padding:"12px 14px",borderRadius:11,background:ev.action==="차단"?"rgba(255,45,85,.04)":ev.riskFlag?"rgba(255,204,0,.04)":"rgba(255,255,255,.02)",border:`1px solid ${ev.action==="차단"?"rgba(255,45,85,.1)":ev.riskFlag?"rgba(255,204,0,.08)":"rgba(255,255,255,.04)"}`,animation:"fadeIn .3s",cursor:"pointer",transition:"all .15s"}}
                    onMouseEnter={e=>e.currentTarget.style.borderColor=ev.action==="차단"?"rgba(255,45,85,.25)":"rgba(59,130,246,.2)"}
                    onMouseLeave={e=>e.currentTarget.style.borderColor=ev.action==="차단"?"rgba(255,45,85,.1)":ev.riskFlag?"rgba(255,204,0,.08)":"rgba(255,255,255,.04)"}>
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
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,fontSize:11,marginBottom:10}}>
                      <div><span style={{color:"#64748b"}}>발생자:</span> <span style={{color:"#e2e8f0",fontWeight:600}}>{ev.userName} ({ev.position})</span></div>
                      <div><span style={{color:"#64748b"}}>사번:</span> <span style={{color:"#e2e8f0",fontFamily:"'DM Mono',monospace"}}>{ev.empId}</span></div>
                      <div><span style={{color:"#64748b"}}>출발지:</span> <span style={{color:"#e2e8f0",fontFamily:"'DM Mono',monospace"}}>{ev.sourceIP}</span></div>
                      <div><span style={{color:"#64748b"}}>목적지:</span> <span style={{color:"#e2e8f0"}}>{ev.destination}</span></div>
                    </div>
                    <div style={{fontSize:10,color:"#60a5fa",marginBottom:4,fontWeight:600}}>🔍 탐지 근거</div>
                    <div style={{fontSize:11,color:"#94a3b8",marginBottom:8,padding:"6px 10px",borderRadius:6,background:"rgba(0,0,0,.2)"}}>{ev.detectionMethod}</div>
                    <div style={{fontSize:10,color:"#64748b",marginBottom:3}}>페이로드: <span style={{color:"#e2e8f0"}}>{ev.payload}</span></div>
                    <button onClick={(e)=>{e.stopPropagation();setEventDetail({...ev,kind:"threat"});}} style={{marginTop:8,width:"100%",padding:"8px 0",borderRadius:8,border:"1px solid rgba(59,130,246,.2)",background:"rgba(59,130,246,.06)",color:"#60a5fa",fontSize:11,fontWeight:700,cursor:"pointer"}}>📋 상세 분석 보기 (대응 가이드 · 위협 영향)</button>
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
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
              <div>
                <div style={{fontSize:14,fontWeight:700,marginBottom:4}}>📋 AI 보안 정책 관리</div>
                <div style={{fontSize:11,color:"#64748b"}}>기업 내 AI 도구 사용 정책을 관리하고, 위험도 기반 자동 분류 및 접근 제어를 수행합니다.</div>
              </div>
              <button onClick={()=>setNewPolicyModal(true)} style={{padding:"8px 18px",borderRadius:9,border:"none",background:"linear-gradient(135deg,#3b82f6,#1d4ed8)",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:5,boxShadow:"0 2px 8px rgba(59,130,246,.3)"}}>+ 새 정책 추가</button>
            </div>
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
