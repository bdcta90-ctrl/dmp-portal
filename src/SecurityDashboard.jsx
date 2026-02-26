import { useState, useEffect, useRef, useCallback } from "react";
import * as XLSX from "xlsx";

// Large-Scale Employee Generator (1800)

const SURNAMES = ["김","이","박","최","정","강","조","윤","장","임","한","오","서","신","권","황","안","송","류","전","홍","고","문","양","손","배","백","허","유","남","심","노","하","곽","성","차","주","우","민","탁","진","지","편","도","마","원","표"];
const GIVEN_NAMES = ["지훈","서연","민수","윤정","태현","소영","준혁","미래","성진","하늘","재원","은비","동욱","지민","석현","예진","현우","수빈","태민","서윤","도윤","하은","시우","지아","예준","서현","건우","다은","승현","유진","민재","소희","정우","채원","현준","은서","도현","나은","지호","하린","우진","연우","시윤","가은","준서","아린","민호","수아","재민","지유"];
const DEPARTMENTS = ["재무팀","연구개발1팀","연구개발2팀","인사팀","마케팅팀","IT운영팀","법무팀","전략기획팀","영업1팀","영업2팀","고객지원팀","리스크관리팀","컴플라이언스팀","데이터분석팀","인프라팀","보안팀","경영지원팀","해외사업팀","신사업개발팀","디자인팀"];
const ROLES = ["선임연구원","과장","대리","부장","차장","사원","팀장","매니저","주임","파트장","센터장","실장"];
const EMPLOYMENT_TYPES = ["정규직","정규직","정규직","정규직","계약직","외주","협력사"];
const CLEARANCE_LEVELS = ["일반","일반","대외비","대외비","기밀","최고기밀"];

const pick = (a) => a[Math.floor(Math.random() * a.length)];
const randInt = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

function generateAllEmployees() {
  const emps = [];
  const usedNames = new Set();
  for (let i = 0; i < 1800; i++) {
    let name;
    do { name = pick(SURNAMES) + pick(GIVEN_NAMES); } while (usedNames.has(name) && usedNames.size < 2000);
    usedNames.add(name);
    const dept = DEPARTMENTS[i % DEPARTMENTS.length];
    const mgr = pick(SURNAMES) + pick(["팀장","부장","실장","센터장"]);
    emps.push({
      id: "EMP-" + String(i + 1).padStart(4, "0"),
      name, department: dept, role: pick(ROLES),
      employmentType: pick(EMPLOYMENT_TYPES),
      clearanceLevel: pick(CLEARANCE_LEVELS),
      managerId: mgr,
    });
  }
  return emps;
}

const EVENT_TYPES = [
  { type: "File Open", icon: "\uD83D\uDCC2", label: "고보안 파일 열람", severity: "low" },
  { type: "File Download", icon: "\u2B07\uFE0F", label: "다운로드 발생", severity: "medium" },
  { type: "Print", icon: "\uD83D\uDDA8\uFE0F", label: "출력 요청", severity: "medium" },
  { type: "Copy to USB", icon: "\uD83D\uDCBE", label: "외부 저장장치 복사", severity: "high" },
  { type: "Bulk Query", icon: "\uD83D\uDD0D", label: "대량 조회", severity: "high" },
  { type: "Permission Escalation", icon: "\uD83D\uDD11", label: "권한 상승", severity: "critical" },
  { type: "Share Link Created", icon: "\uD83D\uDD17", label: "외부 공유 링크 생성", severity: "high" },
  { type: "Delete/Modify", icon: "\uD83D\uDDD1\uFE0F", label: "삭제/변조 시도", severity: "critical" },
  { type: "External AI Upload", icon: "\uD83E\uDD16", label: "외부 AI 업로드", severity: "critical" },
];

const ASSETS = [
  { name: "고객계좌DB", type: "DB", sensitivity: 5, classification: "기밀" },
  { name: "2026_전략보고서.pdf", type: "리포트", sensitivity: 4, classification: "대외비" },
  { name: "인사평가_시트.xlsx", type: "파일", sensitivity: 4, classification: "기밀" },
  { name: "기술설계도_v3.dwg", type: "설계도", sensitivity: 5, classification: "최고기밀" },
  { name: "거래처_리스트.csv", type: "파일", sensitivity: 3, classification: "대외비" },
  { name: "연구개발_소스코드", type: "코드", sensitivity: 5, classification: "기밀" },
  { name: "재무제표_Q1.xlsx", type: "리포트", sensitivity: 4, classification: "대외비" },
  { name: "고객개인정보_DB", type: "DB", sensitivity: 5, classification: "최고기밀" },
  { name: "급여명세_전체.xlsx", type: "파일", sensitivity: 5, classification: "최고기밀" },
  { name: "M_A_계약서_draft.pdf", type: "리포트", sensitivity: 5, classification: "최고기밀" },
];

const CONTEXT_REASONS = [
  "내일 IR 발표 예정 - 출력 증가 정상 가능성",
  "감사 기간 중 - 대량 조회 정상 가능성",
  "프로젝트 마감 D-2 - 야간 접근 정상 가능성",
  "결재 승인 완료 건 - 정상 업무 흐름",
  "퇴사 예정자 - 데이터 유출 위험 높음",
  "최근 부서 이동 - 이전 부서 접근 비정상",
  "과거 보안 사고 이력 - 주의 대상",
  "비인가 시간 접근 - 이상행위 가능성",
];

var ACTION_GUIDES = {
  "관리자 확인 요청": {
    summary: "해당 직원의 직속 상급자에게 이상행위를 알리고 업무 정당성 확인을 요청합니다.",
    estimatedTime: "15~30분",
    riskIfSkipped: "정상 업무일 경우 불필요한 에스컬레이션 방지",
    steps: [
      { step:1, title:"대상자 상급자 확인", desc:"HR 시스템에서 해당 직원의 직속 관리자 정보를 조회합니다.", system:"HR Portal", auto:true },
      { step:2, title:"이상행위 요약 생성", desc:"AI가 자동으로 탐지된 행위, 시간, 접근 자산을 요약한 보고서를 생성합니다.", system:"자동생성", auto:true },
      { step:3, title:"관리자에게 알림 전송", desc:"사내 메신저 또는 이메일을 통해 관리자에게 확인 요청 메시지를 발송합니다.", system:"사내 메신저", auto:false },
      { step:4, title:"관리자 회신 대기", desc:"관리자가 정상 또는 비정상으로 회신할 때까지 최대 2시간 대기합니다.", system:"대기", auto:false },
      { step:5, title:"결과에 따른 후속 조치", desc:"정상이면 이벤트 종료, 비정상이면 에스컬레이션합니다.", system:"보안관제", auto:false }
    ],
    templates: { title: "이상행위 확인 요청", body: "[보안관제] {employee_name}님({department})의 이상행위가 탐지되었습니다.\n\n> 행위: {event_type}\n> 대상 자산: {asset_name}\n> 위험도: {risk_score}/100\n> 시간: {timestamp}\n\n해당 행위가 정상 업무인지 확인 부탁드립니다." }
  },
  "추가 MFA 인증": {
    summary: "해당 사용자의 현재 세션에 즉시 추가 인증(MFA)을 요구하여 본인 확인을 강제합니다.",
    estimatedTime: "즉시 (1~3분)",
    riskIfSkipped: "계정 탈취 시 추가 피해 발생 가능",
    steps: [
      { step:1, title:"현재 세션 식별", desc:"IAM에서 활성 세션과 접속 IP, 디바이스를 확인합니다.", system:"IAM Console", auto:true },
      { step:2, title:"MFA 챌린지 트리거", desc:"해당 세션에 2차 인증을 강제 요구합니다.", system:"IAM MFA Gateway", auto:true },
      { step:3, title:"인증 결과 모니터링", desc:"3분 내 MFA 인증 성공 여부를 확인합니다.", system:"보안관제", auto:true },
      { step:4, title:"인증 실패 시 세션 종료", desc:"3회 실패 시 세션 강제 종료 및 임시 잠금합니다.", system:"IAM 자동화", auto:true },
      { step:5, title:"감사 로그 기록", desc:"MFA 요청/결과를 감사 로그에 기록합니다.", system:"SIEM", auto:true }
    ],
    templates: null
  },
  "접근 일시 제한": {
    summary: "해당 자산에 대한 접근 권한을 30분간 임시 차단합니다.",
    estimatedTime: "즉시 적용 (30분 자동 해제)",
    riskIfSkipped: "데이터 유출 진행 중일 경우 추가 피해",
    steps: [
      { step:1, title:"차단 대상 확인", desc:"차단할 자산과 사용자를 최종 확인합니다.", system:"보안관제", auto:false },
      { step:2, title:"임시 ACL 정책 적용", desc:"ACL에서 사용자를 임시 제외합니다.", system:"IAM / DLP", auto:true },
      { step:3, title:"사용자에게 차단 알림", desc:"접근 제한 안내와 보안팀 연락처를 제공합니다.", system:"사내 메신저", auto:true },
      { step:4, title:"30분 타이머 시작", desc:"자동 해제 타이머 시작, 수동 연장 가능.", system:"자동화", auto:true },
      { step:5, title:"해제 또는 연장 결정", desc:"조사 결과에 따라 해제/연장/영구차단을 결정합니다.", system:"보안관제", auto:false }
    ],
    templates: { title: "접근 일시 제한 알림", body: "[보안알림] {employee_name}님, {asset_name} 접근이 일시 제한되었습니다.\n> 사유: 이상행위 탐지\n> 기간: 30분\n> 문의: 보안관제센터 내선 8282" }
  },
  "계정 잠금": {
    summary: "전체 시스템 접근을 즉시 차단합니다. 가장 강력한 조치입니다.",
    estimatedTime: "즉시 (해제 시 이중 승인)",
    riskIfSkipped: "대규모 데이터 유출 가능",
    steps: [
      { step:1, title:"긴급 잠금 승인", desc:"CISO/보안팀장 긴급 승인을 받습니다.", system:"결재 시스템", auto:false },
      { step:2, title:"전체 접근 차단", desc:"AD/LDAP 비활성화, 모든 세션 종료.", system:"AD / IAM", auto:true },
      { step:3, title:"물리적 접근 제한", desc:"출입카드, VPN 일시 정지.", system:"출입관리", auto:true },
      { step:4, title:"포렌식 보존", desc:"최근 30일 활동 로그 보존 처리.", system:"SIEM / DLP", auto:true },
      { step:5, title:"HR 통보", desc:"HR팀에 공식 통보, 공동 조사 시작.", system:"HR Portal", auto:false },
      { step:6, title:"해제 프로세스", desc:"보안팀장+CISO 이중 승인으로만 해제.", system:"결재 시스템", auto:false }
    ],
    templates: { title: "긴급 계정 잠금 통보", body: "[긴급보안] {employee_name}님({department}) 계정 즉시 잠금.\n> 사유: {event_type} (위험도 {risk_score})\n> 자산: {asset_name}\n> 시각: {timestamp}" }
  },
  "감사 로그 자동 생성": {
    summary: "모든 활동에 대한 상세 감사 추적을 시작합니다.",
    estimatedTime: "즉시 (지속 모니터링)",
    riskIfSkipped: "추후 조사 시 증거 부족",
    steps: [
      { step:1, title:"감사 대상 등록", desc:"SIEM에 강화 모니터링 대상 등록.", system:"SIEM", auto:true },
      { step:2, title:"로그 수집 범위 확장", desc:"전체 채널 상세 로그 수집 시작.", system:"DLP / EDR", auto:true },
      { step:3, title:"스냅샷 생성", desc:"현재 시점 권한/활동 이력 스냅샷 저장.", system:"IAM / SIEM", auto:true },
      { step:4, title:"이상 패턴 알림 설정", desc:"임계값을 낮춰 추가 이탈 즉시 알림.", system:"SIEM 알림", auto:true },
      { step:5, title:"감사 보고서 자동 생성", desc:"24시간 후 자동 보고서 생성/전달.", system:"자동화", auto:true }
    ],
    templates: null
  },
  "HR 연계 조사 요청": {
    summary: "인사팀과 공동 조사를 진행합니다.",
    estimatedTime: "1~3 영업일",
    riskIfSkipped: "내부자 위협 동기 파악 불가",
    steps: [
      { step:1, title:"조사 요청서 작성", desc:"이벤트 요약/위험도/사유 포함 요청서 작성.", system:"보안관제", auto:false },
      { step:2, title:"HR팀 공식 의뢰", desc:"인사팀에 조사 요청서 전달.", system:"결재", auto:false },
      { step:3, title:"HR 데이터 교차 확인", desc:"퇴직/평가/징계/이동 기록 확인.", system:"HR Portal", auto:false },
      { step:4, title:"면담 일정 조율", desc:"필요시 해당 직원 면담 진행.", system:"HR", auto:false },
      { step:5, title:"공동 보고서 작성", desc:"보안+HR 분석 결합 최종 보고서.", system:"보안관제/HR", auto:false }
    ],
    templates: { title: "HR 연계 조사 요청", body: "[조사요청] {employee_name}님({department}) HR 연계 조사 요청.\n> 행위: {event_type}\n> 자산: {asset_name}\n> 위험도: {risk_score}/100\n> 시각: {timestamp}" }
  }
};

function generateEvent(employees) {
  var emp = pick(employees), evt = pick(EVENT_TYPES), asset = pick(ASSETS);
  var s = ({low:15,medium:30,high:55,critical:75})[evt.severity]||20;
  s += asset.sensitivity*5;
  if(emp.employmentType==="외주"||emp.employmentType==="협력사") s+=15;
  if(emp.clearanceLevel==="일반"&&asset.classification==="기밀") s+=20;
  var riskScore = Math.min(100,Math.max(0,s+randInt(-5,10)));
  var sh=[].concat(CONTEXT_REASONS).sort(function(){return Math.random()-0.5});
  var contexts=[0,1,2].map(function(i){return{reason:sh[i],probability:Math.max(10,95-i*randInt(15,30))}}).sort(function(a,b){return b.probability-a.probability});
  var urgMap={"계정 잠금":"critical","접근 일시 제한":"high","HR 연계 조사 요청":"high","추가 MFA 인증":"medium","감사 로그 자동 생성":"medium","관리자 확인 요청":"low"};
  var avail=Object.keys(ACTION_GUIDES).sort(function(){return Math.random()-0.5});
  var recs=[];
  if(riskScore>=80) recs.push(avail.find(function(a){return urgMap[a]==="critical"})||avail[0]);
  if(riskScore>=50) recs.push(avail.find(function(a){return urgMap[a]==="high"})||avail[1]);
  recs.push(avail.find(function(a){return urgMap[a]==="medium"})||avail[2]);
  var unique=[]; recs.forEach(function(r){if(unique.indexOf(r)===-1)unique.push(r)});
  var actions=unique.slice(0,3).map(function(n){return{action:n,desc:ACTION_GUIDES[n].summary.slice(0,40)+"...",urgency:urgMap[n]||"medium"}});
  return { id:"EVT-"+Date.now()+"-"+randInt(100,999),timestamp:new Date(),employee:emp,eventType:evt,asset:asset,riskScore:riskScore,contexts:contexts,actions:actions,status:"new",isNew:true };
}

// Small Components

function PulsingDot(props){
  var color = props.color || "#ff2d55";
  return(
    <span style={{position:"relative",display:"inline-block",width:8,height:8}}>
      <span style={{position:"absolute",width:8,height:8,borderRadius:"50%",background:color,animation:"pulse 1.5s ease-in-out infinite"}}/>
      <span style={{position:"absolute",width:8,height:8,borderRadius:"50%",background:color,opacity:0.4,animation:"pulseRing 1.5s ease-in-out infinite"}}/>
    </span>
  );
}

function MiniBar(props){
  var value=props.value, max=props.max||100, color=props.color;
  return(
    <div style={{width:"100%",height:4,background:"rgba(255,255,255,0.06)",borderRadius:2}}>
      <div style={{width:(value/max)*100+"%",height:"100%",background:color,borderRadius:2,transition:"width 0.8s cubic-bezier(0.22,1,0.36,1)"}}/>
    </div>
  );
}

function RiskBadge(props){
  var score=props.score;
  var color,label,bg;
  if(score>=80){color="#ff2d55";label="심각";bg="rgba(255,45,85,0.15)";}
  else if(score>=60){color="#ff9500";label="높음";bg="rgba(255,149,0,0.15)";}
  else if(score>=40){color="#ffcc00";label="주의";bg="rgba(255,204,0,0.12)";}
  else{color="#30d158";label="낮음";bg="rgba(48,209,88,0.12)";}
  return(
    <div style={{width:48,height:48,borderRadius:"50%",border:"3px solid "+color,background:bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'JetBrains Mono',monospace",fontSize:16,fontWeight:700,color:color,boxShadow:"0 0 16px "+color+"33",position:"relative",flexShrink:0}}>
      {score}
      <div style={{position:"absolute",bottom:-6,background:color,color:"#000",fontSize:8,fontWeight:800,padding:"1px 5px",borderRadius:4,letterSpacing:1}}>{label}</div>
    </div>
  );
}

function StatCard(props){
  var label=props.label,value=props.value,sub=props.sub,color=props.color,icon=props.icon;
  return(
    <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:14,padding:"16px 18px",flex:1,minWidth:150}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",fontWeight:500,letterSpacing:0.5,marginBottom:5}}>{label}</div>
          <div style={{fontSize:28,fontWeight:700,color:color,fontFamily:"'JetBrains Mono',monospace",lineHeight:1}}>{typeof value==="number"?value.toLocaleString():value}</div>
        </div>
        <div style={{fontSize:22,opacity:0.6}}>{icon}</div>
      </div>
      {sub && <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",marginTop:6}}>{sub}</div>}
    </div>
  );
}

// Live Line Chart

function LiveRiskChart(props) {
  var events = props.events;
  var canvasRef = useRef(null);
  var dataRef = useRef([]);
  var stAnalyzing = useState(false);
  var analyzing = stAnalyzing[0], setAnalyzing = stAnalyzing[1];
  var stAnalysisMsg = useState("");
  var analysisMsg = stAnalysisMsg[0], setAnalysisMsg = stAnalysisMsg[1];
  var stAnalysisPct = useState(0);
  var analysisPct = stAnalysisPct[0], setAnalysisPct = stAnalysisPct[1];

  useEffect(function() {
    if (events.length > 0) {
      var latest = events[0];
      dataRef.current = dataRef.current.concat([{ score: latest.riskScore, time: Date.now() }]).slice(-60);
      // AI 분석 애니메이션 트리거
      if (latest.isNew) {
        setAnalyzing(true); setAnalysisPct(0);
        var msgs = ["🔍 이상 행위 패턴 감지...", "🧠 사용자 행동 프로파일 분석...", "📊 위험도 스코어 산출 중...", "⚡ AI 위험도 판정 완료"];
        var step = 0;
        var iv = setInterval(function() {
          step++;
          if (step < msgs.length) { setAnalysisMsg(msgs[step]); setAnalysisPct(Math.round((step / msgs.length) * 100)); }
          else { setAnalysisPct(100); setAnalysisMsg("✅ Score: " + latest.riskScore); setTimeout(function() { setAnalyzing(false); }, 800); clearInterval(iv); }
        }, 500);
        setAnalysisMsg(msgs[0]); setAnalysisPct(10);
      }
    }
  }, [events.length]);

  useEffect(function() {
    var canvas = canvasRef.current;
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var animId;
    var drawFn = function() {
      var w = canvas.width = canvas.offsetWidth * 2;
      var h = canvas.height = canvas.offsetHeight * 2;
      ctx.clearRect(0, 0, w, h);
      var data = dataRef.current;
      if (data.length < 2) { animId = requestAnimationFrame(drawFn); return; }
      ctx.strokeStyle = "rgba(255,255,255,0.04)";
      ctx.lineWidth = 1;
      for (var y = 0; y < h; y += h / 5) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
      [80, 60, 40].forEach(function(th, idx) {
        var yy = h - (th / 100) * h;
        ctx.strokeStyle = ["rgba(255,45,85,0.15)", "rgba(255,149,0,0.12)", "rgba(255,204,0,0.08)"][idx];
        ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(w, yy); ctx.stroke();
        ctx.setLineDash([]);
      });
      var pts = data.map(function(d, i) { return { x: (i / (data.length - 1)) * w, y: h - (d.score / 100) * h * 0.9 - h * 0.05 }; });
      var avgScore = data.reduce(function(s, d) { return s + d.score; }, 0) / data.length;
      var baseColor = avgScore >= 70 ? "255,45,85" : avgScore >= 50 ? "255,149,0" : avgScore >= 30 ? "255,204,0" : "48,209,88";
      var grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "rgba(" + baseColor + ",0.3)");
      grad.addColorStop(1, "rgba(" + baseColor + ",0.0)");
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (var i = 1; i < pts.length; i++) {
        var cx = (pts[i - 1].x + pts[i].x) / 2;
        ctx.bezierCurveTo(cx, pts[i - 1].y, cx, pts[i].y, pts[i].x, pts[i].y);
      }
      ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
      ctx.fillStyle = grad; ctx.fill();
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (var j = 1; j < pts.length; j++) {
        var cx2 = (pts[j - 1].x + pts[j].x) / 2;
        ctx.bezierCurveTo(cx2, pts[j - 1].y, cx2, pts[j].y, pts[j].x, pts[j].y);
      }
      ctx.strokeStyle = "rgba(" + baseColor + ",0.8)";
      ctx.lineWidth = 3;
      ctx.stroke();
      var last = pts[pts.length - 1];
      ctx.beginPath(); ctx.arc(last.x, last.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(" + baseColor + ",0.4)"; ctx.fill();
      ctx.beginPath(); ctx.arc(last.x, last.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = "rgb(" + baseColor + ")"; ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.2)";
      ctx.font = Math.round(h / 12) + "px 'JetBrains Mono', monospace";
      ctx.textAlign = "right";
      [0, 25, 50, 75, 100].forEach(function(v) {
        var yy = h - (v / 100) * h * 0.9 - h * 0.05;
        ctx.fillText(v, w - 4, yy + 4);
      });
      animId = requestAnimationFrame(drawFn);
    };
    drawFn();
    return function() { cancelAnimationFrame(animId); };
  }, [events.length]);

  return <div style={{position:"relative"}}>
    <canvas ref={canvasRef} style={{ width: "100%", height: 90, display: "block" }} />
    {analyzing && <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(2px)",borderRadius:8,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6,animation:"fadeIn 0.3s"}}>
      <div style={{display:"flex",alignItems:"center",gap:6}}>
        <div style={{width:14,height:14,border:"2px solid rgba(10,132,255,0.3)",borderTop:"2px solid #0a84ff",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>
        <span style={{fontSize:10,fontWeight:600,color:"#0a84ff",letterSpacing:0.5}}>AI 위험도 분석 중</span>
      </div>
      <div style={{width:"70%",height:3,borderRadius:2,background:"rgba(255,255,255,0.1)",overflow:"hidden"}}>
        <div style={{height:"100%",borderRadius:2,background:"linear-gradient(90deg,#0a84ff,#5ac8fa)",transition:"width 0.4s ease",width:analysisPct+"%"}}/>
      </div>
      <div style={{fontSize:9,color:"rgba(255,255,255,0.6)",fontWeight:500}}>{analysisMsg}</div>
    </div>}
  </div>;
}

// Action Guide Modal

function ActionGuideModal(props) {
  var action = props.action, event = props.event, onClose = props.onClose;
  var stDone = useState([]);
  var done = stDone[0], setDone = stDone[1];
  var stBusy = useState(false);
  var busy = stBusy[0], setBusy = stBusy[1];

  var guide = ACTION_GUIDES[action.action];
  var uc = { low: "#30d158", medium: "#ffcc00", high: "#ff9500", critical: "#ff2d55" };
  var c = uc[action.urgency];

  var fillTpl = function(t) {
    if (!t) return "";
    return t.replace("{employee_name}",event.employee.name).replace("{department}",event.employee.department).replace("{event_type}",event.eventType.label).replace("{asset_name}",event.asset.name).replace("{asset_classification}",event.asset.classification).replace("{risk_score}",event.riskScore).replace("{timestamp}",event.timestamp.toLocaleString("ko-KR"));
  };

  if (!guide) return null;

  var exec = function(n) { setBusy(true); setTimeout(function() { setDone(function(p) { return p.concat([n]); }); setBusy(false); }, 800 + Math.random() * 600); };
  var execAll = function() { var d = 0; guide.steps.filter(function(s){return s.auto}).forEach(function(s) { d += 500 + Math.random() * 400; setTimeout(function() { setDone(function(p) { var arr=p.slice(); if(arr.indexOf(s.step)===-1)arr.push(s.step); return arr; }); }, d); }); };

  return (
    <div style={{position:"fixed",inset:0,zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={function(e){if(e.target===e.currentTarget)onClose()}}>
      <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(8px)"}}/>
      <div style={{position:"relative",width:"min(680px,92vw)",maxHeight:"88vh",overflowY:"auto",background:"#12121a",border:"1px solid "+c+"30",borderRadius:18,boxShadow:"0 25px 80px rgba(0,0,0,0.6),0 0 40px "+c+"15"}}>
        <div style={{padding:"22px 26px 18px",borderBottom:"1px solid rgba(255,255,255,0.06)",position:"sticky",top:0,background:"#12121a",borderRadius:"18px 18px 0 0",zIndex:2}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                <div style={{width:10,height:10,borderRadius:"50%",background:c,boxShadow:"0 0 12px "+c}}/>
                <span style={{fontSize:18,fontWeight:700}}>{action.action}</span>
              </div>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.55)",lineHeight:1.5,maxWidth:500}}>{guide.summary}</div>
            </div>
            <button onClick={onClose} style={{background:"rgba(255,255,255,0.06)",border:"none",color:"rgba(255,255,255,0.5)",width:32,height:32,borderRadius:8,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>X</button>
          </div>
          <div style={{display:"flex",gap:12,marginTop:14}}>
            {[["소요 시간",guide.estimatedTime],["미수행 위험",guide.riskIfSkipped],["대상",event.employee.name+" ("+event.employee.department+")"]].map(function(item){return(
              <div key={item[0]} style={{flex:1,background:"rgba(255,255,255,0.03)",borderRadius:10,padding:"8px 10px"}}>
                <div style={{fontSize:9,color:"rgba(255,255,255,0.35)",fontWeight:600,marginBottom:3}}>{item[0]}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.75)",fontWeight:500}}>{item[1]}</div>
              </div>
            )})}
          </div>
        </div>
        <div style={{padding:"18px 26px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={{fontSize:13,fontWeight:600}}>수행 가이드 ({guide.steps.length}단계)</div>
            <button onClick={execAll} style={{background:c+"20",border:"1px solid "+c+"40",color:c,padding:"5px 12px",borderRadius:8,fontSize:11,fontWeight:600,cursor:"pointer"}}>자동 일괄 실행</button>
          </div>
          {guide.steps.map(function(s, i) {
            var isDone = done.indexOf(s.step) !== -1;
            return (
              <div key={s.step} style={{display:"flex",gap:12,position:"relative"}}>
                {i < guide.steps.length - 1 && <div style={{position:"absolute",left:14,top:32,width:2,height:"calc(100% - 8px)",background:isDone?c+"40":"rgba(255,255,255,0.06)"}}/>}
                <div style={{width:30,height:30,borderRadius:"50%",flexShrink:0,background:isDone?c:"rgba(255,255,255,0.04)",border:"2px solid "+(isDone?c:"rgba(255,255,255,0.1)"),display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:isDone?"#000":"rgba(255,255,255,0.4)",transition:"all 0.4s",zIndex:1}}>{isDone?"V":s.step}</div>
                <div style={{flex:1,paddingBottom:18,opacity:isDone?0.5:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <span style={{fontSize:12,fontWeight:600,textDecoration:isDone?"line-through":"none"}}>{s.title}</span>
                      <span style={{fontSize:8,color:s.auto?"#0a84ff":"#ff9f0a",background:s.auto?"rgba(10,132,255,0.12)":"rgba(255,159,10,0.12)",padding:"2px 5px",borderRadius:3,fontWeight:600}}>{s.auto?"AUTO":"수동"}</span>
                    </div>
                    {!isDone && <button onClick={function(){exec(s.step)}} disabled={busy} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:"#fff",padding:"3px 8px",borderRadius:5,fontSize:9,cursor:busy?"wait":"pointer"}}>{busy?"...":"실행"}</button>}
                    {isDone && <span style={{fontSize:9,color:"#30d158",fontWeight:600}}>완료</span>}
                  </div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",lineHeight:1.4}}>{s.desc}</div>
                  <div style={{fontSize:9,color:"rgba(255,255,255,0.2)",marginTop:2}}>시스템: {s.system}</div>
                </div>
              </div>
            );
          })}
        </div>
        {guide.templates && (
          <div style={{padding:"0 26px 22px"}}>
            <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:12,padding:16}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                <div style={{fontSize:12,fontWeight:600}}>메시지 템플릿</div>
                <button onClick={function(){try{navigator.clipboard.writeText(fillTpl(guide.templates.body))}catch(e){}}} style={{background:"rgba(10,132,255,0.15)",border:"1px solid rgba(10,132,255,0.3)",color:"#0a84ff",padding:"3px 10px",borderRadius:6,fontSize:10,fontWeight:600,cursor:"pointer"}}>복사</button>
              </div>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.45)",lineHeight:1.7,background:"rgba(0,0,0,0.3)",borderRadius:8,padding:12,fontFamily:"'JetBrains Mono',monospace",whiteSpace:"pre-wrap"}}>{fillTpl(guide.templates.body)}</div>
            </div>
          </div>
        )}
        {done.length === guide.steps.length && (
          <div style={{padding:"0 26px 22px",animation:"fadeIn 0.5s"}}>
            <div style={{background:c+"10",border:"1px solid "+c+"30",borderRadius:12,padding:16,textAlign:"center"}}>
              <div style={{fontSize:28,marginBottom:6}}>OK</div>
              <div style={{fontSize:14,fontWeight:700,color:c}}>모든 단계 완료</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",marginTop:4}}>감사 로그에 자동 기록됨</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Message Modal

function MessageModal(props) {
  var user = props.user, recipientType = props.recipientType, onClose = props.onClose;
  var stMsg = useState("");
  var msg = stMsg[0], setMsg = stMsg[1];
  var stSent = useState(false);
  var sent = stSent[0], setSent = stSent[1];

  var rLabel = recipientType === "user" ? user.name+" (본인)" : user.managerId+" ("+user.name+"의 팀장)";
  var presets = recipientType === "user"
    ? ["보안 이벤트가 탐지되어 안내드립니다. 업무 목적이었는지 확인 부탁드립니다.","접근 기록이 남았습니다. 무관한 접근이었다면 보안팀에 알려주세요.","계정에서 이상 접근이 감지되었습니다. 본인이 아닌 경우 비밀번호를 변경해 주세요."]
    : ["팀원의 보안 이상행위가 탐지되었습니다. 최근 업무 상황 확인 요청드립니다.","팀원의 고위험 보안 이벤트 감지, 면담 진행 권고드립니다.","보안관제센터입니다. 팀원 관련 긴급 사안입니다. 확인 후 회신 부탁드립니다."];

  return (
    <div style={{position:"fixed",inset:0,zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={function(e){if(e.target===e.currentTarget)onClose()}}>
      <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(8px)"}}/>
      <div style={{position:"relative",width:"min(520px,90vw)",background:"#12121a",border:"1px solid rgba(255,255,255,0.08)",borderRadius:18}}>
        {sent ? (
          <div style={{padding:48,textAlign:"center",animation:"fadeIn 0.4s"}}>
            <div style={{fontSize:48,marginBottom:12}}>OK</div>
            <div style={{fontSize:16,fontWeight:700,color:"#30d158"}}>전송 완료</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginTop:8}}>{rLabel}에게 전송됨</div>
          </div>
        ) : (
          <div>
            <div style={{padding:"22px 26px 14px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <div style={{fontSize:16,fontWeight:700}}>메시지 보내기</div>
                <button onClick={onClose} style={{background:"rgba(255,255,255,0.06)",border:"none",color:"rgba(255,255,255,0.5)",width:32,height:32,borderRadius:8,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>X</button>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginTop:10,background:"rgba(255,255,255,0.03)",borderRadius:8,padding:"7px 12px"}}>
                <span style={{fontSize:10,color:"rgba(255,255,255,0.35)",fontWeight:600}}>수신:</span>
                <span style={{fontSize:12,color:"#0a84ff",fontWeight:600}}>{rLabel}</span>
              </div>
            </div>
            <div style={{padding:"14px 26px"}}>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.35)",fontWeight:600,marginBottom:6}}>빠른 선택</div>
              {presets.map(function(p,i){return(
                <button key={i} onClick={function(){setMsg(p)}} style={{display:"block",width:"100%",background:msg===p?"rgba(10,132,255,0.12)":"rgba(255,255,255,0.03)",border:"1px solid "+(msg===p?"rgba(10,132,255,0.3)":"rgba(255,255,255,0.06)"),color:msg===p?"#0a84ff":"rgba(255,255,255,0.55)",padding:"9px 12px",borderRadius:8,fontSize:11,cursor:"pointer",textAlign:"left",lineHeight:1.5,marginBottom:5}}>{p}</button>
              )})}
              <div style={{fontSize:11,color:"rgba(255,255,255,0.35)",fontWeight:600,margin:"12px 0 6px"}}>직접 작성</div>
              <textarea value={msg} onChange={function(e){setMsg(e.target.value)}} placeholder="메시지 입력..." rows={3} style={{width:"100%",background:"rgba(0,0,0,0.3)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:10,padding:12,color:"#fff",fontSize:12,lineHeight:1.5,resize:"vertical",outline:"none",fontFamily:"'Pretendard',sans-serif",boxSizing:"border-box"}}/>
            </div>
            <div style={{padding:"0 26px 22px",display:"flex",gap:10,justifyContent:"flex-end"}}>
              <button onClick={onClose} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.6)",padding:"9px 18px",borderRadius:10,fontSize:12,cursor:"pointer"}}>취소</button>
              <button onClick={function(){setSent(true);setTimeout(onClose,1800)}} disabled={!msg.trim()} style={{background:msg.trim()?"linear-gradient(135deg,#0a84ff,#5e5ce6)":"rgba(255,255,255,0.04)",border:"none",color:msg.trim()?"#fff":"rgba(255,255,255,0.2)",padding:"9px 22px",borderRadius:10,fontSize:12,fontWeight:600,cursor:msg.trim()?"pointer":"not-allowed"}}>전송</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Event Card

function EventCard(props) {
  var event=props.event, isExpanded=props.isExpanded, onClick=props.onClick, onOpenGuide=props.onOpenGuide;
  var sc={low:"#30d158",medium:"#ffcc00",high:"#ff9500",critical:"#ff2d55"};
  var color=sc[event.eventType.severity];
  var ts=event.timestamp.toLocaleTimeString("ko-KR",{hour:"2-digit",minute:"2-digit",second:"2-digit"});
  // AI 분석 애니메이션 states
  var stPhase = useState(0); var phase = stPhase[0], setPhase = stPhase[1]; // 0=idle,1=context,2=context-done,3=action,4=done
  var stAiMsg = useState(""); var aiMsg = stAiMsg[0], setAiMsg = stAiMsg[1];
  var stAiPct = useState(0); var aiPct = stAiPct[0], setAiPct = stAiPct[1];
  var stCtxRevealed = useState(0); var ctxRevealed = stCtxRevealed[0], setCtxRevealed = stCtxRevealed[1];
  var stActRevealed = useState(0); var actRevealed = stActRevealed[0], setActRevealed = stActRevealed[1];
  var prevExpanded = useRef(false);

  useEffect(function() {
    if (isExpanded && !prevExpanded.current) {
      // 카드가 열릴 때 AI 분석 시작
      setPhase(1); setAiPct(0); setCtxRevealed(0); setActRevealed(0);
      var msgs = [
        {msg:"🔍 사용자 행동 패턴 분석 중...",pct:15},
        {msg:"📂 접근 자산 보안등급 확인 중...",pct:30},
        {msg:"🧠 이상 행위 컨텍스트 매칭 중...",pct:50},
        {msg:"📊 위험 요인 확률 산출 중...",pct:70},
        {msg:"✅ 맥락 분석 완료",pct:85},
      ];
      var step = 0;
      var ctxCount = event.contexts ? event.contexts.length : 0;
      setAiMsg(msgs[0].msg); setAiPct(msgs[0].pct);
      var iv = setInterval(function() {
        step++;
        if (step < msgs.length) {
          setAiMsg(msgs[step].msg); setAiPct(msgs[step].pct);
        } else if (step === msgs.length) {
          setPhase(2); setAiPct(85);
          // 맥락 항목 하나씩 reveal
          var cIdx = 0;
          var cIv = setInterval(function() {
            cIdx++;
            setCtxRevealed(cIdx);
            if (cIdx >= ctxCount) {
              clearInterval(cIv);
              // 추천 조치 분석 시작
              setTimeout(function() {
                setPhase(3); setAiMsg("⚡ AI가 추천 조치를 생성하고 있습니다..."); setAiPct(90);
                var aIdx = 0;
                var actCount = event.actions ? event.actions.length : 0;
                var aIv = setInterval(function() {
                  aIdx++;
                  setActRevealed(aIdx);
                  setAiPct(90 + Math.round((aIdx / actCount) * 10));
                  if (aIdx >= actCount) {
                    clearInterval(aIv);
                    setTimeout(function() { setPhase(4); setAiPct(100); setAiMsg(""); }, 300);
                  }
                }, 400);
              }, 500);
            }
          }, 300);
        } else { clearInterval(iv); }
      }, 450);
    }
    if (!isExpanded && prevExpanded.current) {
      setPhase(0); setAiPct(0); setCtxRevealed(0); setActRevealed(0); setAiMsg("");
    }
    prevExpanded.current = isExpanded;
  }, [isExpanded]);

  return (
    <div onClick={onClick} style={{background:event.isNew?"linear-gradient(135deg,"+color+"08,transparent 70%)":"rgba(255,255,255,0.02)",border:"1px solid "+(event.isNew?color+"30":"rgba(255,255,255,0.05)"),borderLeft:"3px solid "+color,borderRadius:10,padding:"12px 14px",cursor:"pointer",transition:"all 0.3s",animation:event.isNew?"slideIn 0.5s cubic-bezier(0.22,1,0.36,1)":"none",marginBottom:6}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:18}}>{event.eventType.icon}</span>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <span style={{fontSize:12,fontWeight:600}}>{event.employee.name}</span>
              <span style={{fontSize:9,color:"rgba(255,255,255,0.4)",background:"rgba(255,255,255,0.05)",padding:"1px 5px",borderRadius:3}}>{event.employee.department}</span>
              {event.isNew && <PulsingDot color={color}/>}
            </div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.45)",marginTop:1}}>{event.eventType.label} - <span style={{color:"rgba(255,255,255,0.25)"}}>{event.asset.name}</span></div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <RiskBadge score={event.riskScore}/>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.25)",fontFamily:"monospace",minWidth:60,textAlign:"right"}}>{ts}</div>
        </div>
      </div>
      {isExpanded && (
        <div onClick={function(e){e.stopPropagation()}} style={{marginTop:14,paddingTop:14,borderTop:"1px solid rgba(255,255,255,0.06)",animation:"fadeIn 0.3s"}}>
          {/* 프로필 3칸 (항상 표시) */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
            <div style={{background:"rgba(255,255,255,0.03)",borderRadius:10,padding:12}}>
              <div style={{fontSize:9,color:"rgba(255,255,255,0.3)",fontWeight:600,letterSpacing:1,marginBottom:8}}>사용자 프로필</div>
              {[["직무",event.employee.role],["고용형태",event.employee.employmentType],["보안등급",event.employee.clearanceLevel],["상급자",event.employee.managerId]].map(function(item){return(
                <div key={item[0]} style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                  <span style={{fontSize:10,color:"rgba(255,255,255,0.4)"}}>{item[0]}</span>
                  <span style={{fontSize:10,color:"#fff",fontWeight:500}}>{item[1]}</span>
                </div>
              )})}
            </div>
            <div style={{background:"rgba(255,255,255,0.03)",borderRadius:10,padding:12}}>
              <div style={{fontSize:9,color:"rgba(255,255,255,0.3)",fontWeight:600,letterSpacing:1,marginBottom:8}}>자산 정보</div>
              {[["유형",event.asset.type],["보안등급",event.asset.classification],["민감도","*".repeat(event.asset.sensitivity)]].map(function(item){return(
                <div key={item[0]} style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                  <span style={{fontSize:10,color:"rgba(255,255,255,0.4)"}}>{item[0]}</span>
                  <span style={{fontSize:10,color:"#fff",fontWeight:500}}>{item[1]}</span>
                </div>
              )})}
            </div>
            <div style={{background:"rgba(255,255,255,0.03)",borderRadius:10,padding:12}}>
              <div style={{fontSize:9,color:"rgba(255,255,255,0.3)",fontWeight:600,letterSpacing:1,marginBottom:8}}>이벤트 상세</div>
              {[["이벤트",event.eventType.type],["위험도",event.riskScore+"/100"],["ID",event.id.slice(0,16)]].map(function(item){return(
                <div key={item[0]} style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                  <span style={{fontSize:10,color:"rgba(255,255,255,0.4)"}}>{item[0]}</span>
                  <span style={{fontSize:10,color:"#fff",fontWeight:500,fontFamily:"monospace"}}>{item[1]}</span>
                </div>
              )})}
            </div>
          </div>

          {/* AI 분석 진행 표시 (phase 1~3) */}
          {phase >= 1 && phase < 4 && (
            <div style={{background:"rgba(10,132,255,0.08)",border:"1px solid rgba(10,132,255,0.15)",borderRadius:10,padding:"10px 14px",marginBottom:10,animation:"fadeIn 0.3s"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                <div style={{display:"flex",alignItems:"center",gap:7}}>
                  <div style={{width:16,height:16,border:"2px solid rgba(10,132,255,0.3)",borderTop:"2px solid #0a84ff",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>
                  <span style={{fontSize:11,fontWeight:600,color:"#0a84ff"}}>{phase===1?"AI 맥락 분석 중":phase===2?"맥락 분석 결과 로딩 중":"AI 추천 조치 생성 중"}</span>
                </div>
                <span style={{fontSize:11,fontWeight:700,color:"#0a84ff",fontFamily:"monospace"}}>{aiPct}%</span>
              </div>
              <div style={{height:3,borderRadius:2,background:"rgba(255,255,255,0.06)",overflow:"hidden",marginBottom:6}}>
                <div style={{height:"100%",borderRadius:2,background:"linear-gradient(90deg,#0a84ff,#5ac8fa)",transition:"width 0.4s ease",width:aiPct+"%"}}/>
              </div>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.5)"}}>{aiMsg}</div>
            </div>
          )}

          {/* AI 맥락 분석 (phase >= 2) */}
          {phase >= 2 && (
            <div style={{background:"rgba(0,122,255,0.05)",border:"1px solid rgba(0,122,255,0.12)",borderRadius:10,padding:12,marginBottom:10,animation:"fadeIn 0.3s"}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
                <div style={{fontSize:9,color:"#0a84ff",fontWeight:600,letterSpacing:1}}>AI 맥락 분석</div>
                {phase >= 4 && <span style={{fontSize:8,color:"#30d158",background:"rgba(48,209,88,0.1)",padding:"1px 6px",borderRadius:4,fontWeight:600}}>완료</span>}
              </div>
              {event.contexts.map(function(ctx,i){
                if (i >= ctxRevealed) return null;
                return(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:i<event.contexts.length-1?6:0,animation:"fadeIn 0.3s"}}>
                    <div style={{width:20,height:20,borderRadius:"50%",background:i===0?"rgba(0,132,255,0.2)":"rgba(255,255,255,0.05)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:i===0?"#0a84ff":"rgba(255,255,255,0.4)",fontWeight:700}}>{i+1}</div>
                    <div style={{flex:1,fontSize:11,color:"rgba(255,255,255,0.7)"}}>{ctx.reason}</div>
                    <div style={{display:"flex",alignItems:"center",gap:5,minWidth:80}}>
                      <MiniBar value={ctx.probability} color={i===0?"#0a84ff":"rgba(255,255,255,0.2)"}/>
                      <span style={{fontSize:10,color:i===0?"#0a84ff":"rgba(255,255,255,0.3)",fontFamily:"monospace",fontWeight:600,minWidth:28,textAlign:"right"}}>{ctx.probability}%</span>
                    </div>
                  </div>
                );
              })}
              {/* 아직 로딩중인 항목 placeholder */}
              {ctxRevealed < (event.contexts?event.contexts.length:0) && (
                <div style={{display:"flex",alignItems:"center",gap:8,marginTop:6}}>
                  <div style={{width:20,height:20,borderRadius:"50%",background:"rgba(255,255,255,0.03)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <div style={{width:10,height:10,border:"1.5px solid rgba(10,132,255,0.3)",borderTop:"1.5px solid #0a84ff",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>
                  </div>
                  <div style={{flex:1,height:8,borderRadius:4,background:"rgba(255,255,255,0.04)",overflow:"hidden"}}>
                    <div style={{width:"60%",height:"100%",borderRadius:4,background:"linear-gradient(90deg,rgba(10,132,255,0.15),rgba(10,132,255,0.05))",animation:"pulse 1.5s infinite"}}/>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 추천 조치 (phase >= 3) */}
          {phase >= 3 && (
            <div style={{background:"rgba(255,149,0,0.05)",border:"1px solid rgba(255,149,0,0.12)",borderRadius:10,padding:12,animation:"fadeIn 0.3s"}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
                <div style={{fontSize:9,color:"#ff9f0a",fontWeight:600,letterSpacing:1}}>추천 조치</div>
                {phase >= 4 && <span style={{fontSize:8,color:"#30d158",background:"rgba(48,209,88,0.1)",padding:"1px 6px",borderRadius:4,fontWeight:600}}>생성 완료</span>}
                {phase === 3 && <div style={{width:10,height:10,border:"1.5px solid rgba(255,159,10,0.3)",borderTop:"1.5px solid #ff9f0a",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>}
              </div>
              <div style={{display:"flex",gap:6}}>
                {event.actions.map(function(act,i){
                  if (i >= actRevealed) return(
                    <div key={i} style={{flex:1,background:"rgba(255,255,255,0.02)",border:"1px dashed rgba(255,255,255,0.08)",borderRadius:8,padding:"10px 12px",display:"flex",alignItems:"center",justifyContent:"center",minHeight:50}}>
                      <div style={{width:12,height:12,border:"1.5px solid rgba(255,159,10,0.3)",borderTop:"1.5px solid #ff9f0a",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>
                    </div>
                  );
                  var ac=sc[act.urgency]||"#ffcc00";
                  return(
                    <div key={i} onClick={function(){onOpenGuide(act)}} style={{flex:1,background:"rgba(255,255,255,0.03)",border:"1px solid "+ac+"20",borderRadius:8,padding:"10px 12px",cursor:"pointer",transition:"all 0.2s",animation:"fadeIn 0.3s"}}>
                      <div style={{fontSize:11,fontWeight:600,color:ac,marginBottom:4}}>{act.action}</div>
                      <div style={{fontSize:9,color:ac,fontWeight:600,background:ac+"10",padding:"2px 6px",borderRadius:4,display:"inline-block"}}>가이드 보기</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Sidebar Components

function RiskGauge(props) {
  var events=props.events;
  var r=events.slice(-20);
  var avg=r.length?r.reduce(function(s,e){return s+e.riskScore},0)/r.length:0;
  var angle=(avg/100)*180-90;
  var color=avg>=70?"#ff2d55":avg>=50?"#ff9500":avg>=30?"#ffcc00":"#30d158";
  return(
    <div style={{textAlign:"center",padding:"10px 0"}}>
      <svg width="150" height="85" viewBox="0 0 160 90">
        <path d="M 15 85 A 65 65 0 0 1 145 85" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" strokeLinecap="round"/>
        <path d="M 15 85 A 65 65 0 0 1 145 85" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" strokeDasharray={(avg/100)*204+" 204"} style={{transition:"stroke-dasharray 1s ease",filter:"drop-shadow(0 0 8px "+color+"66)"}}/>
        <line x1="80" y1="82" x2={80+45*Math.cos(angle*Math.PI/180)} y2={82+45*Math.sin(angle*Math.PI/180)} stroke="#fff" strokeWidth="2" strokeLinecap="round" style={{transition:"all 1s cubic-bezier(0.22,1,0.36,1)"}}/>
        <circle cx="80" cy="82" r="4" fill="#fff"/>
        <text x="80" y="72" textAnchor="middle" fill={color} fontSize="22" fontWeight="700" fontFamily="'JetBrains Mono',monospace">{Math.round(avg)}</text>
      </svg>
      <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",marginTop:-2}}>평균 위험도 (최근 20건)</div>
    </div>
  );
}

function TopRiskUsers(props) {
  var events=props.events, onMsg=props.onMsg;
  var m={};
  events.forEach(function(e){
    var k=e.employee.name;
    if(!m[k]) m[k]={name:k,dept:e.employee.department,managerId:e.employee.managerId,scores:[],count:0};
    m[k].scores.push(e.riskScore); m[k].count++;
  });
  var users=Object.values(m).map(function(u){return Object.assign({},u,{maxScore:Math.max.apply(null,u.scores)})}).sort(function(a,b){return b.maxScore-a.maxScore}).slice(0,5);
  return(
    <div>{users.map(function(u,i){
      var c=u.maxScore>=80?"#ff2d55":u.maxScore>=60?"#ff9500":u.maxScore>=40?"#ffcc00":"#30d158";
      return(
        <div key={i} style={{padding:"8px 0",borderBottom:i<4?"1px solid rgba(255,255,255,0.04)":"none"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:24,height:24,borderRadius:"50%",background:c+"15",border:"1px solid "+c+"30",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:c}}>{i+1}</div>
            <div style={{flex:1}}><div style={{fontSize:11,fontWeight:600}}>{u.name}</div><div style={{fontSize:9,color:"rgba(255,255,255,0.3)"}}>{u.dept} / {u.count}건</div></div>
            <div style={{fontSize:13,fontWeight:700,color:c,fontFamily:"monospace"}}>{Math.round(u.maxScore)}</div>
          </div>
          <div style={{display:"flex",gap:5,marginTop:6,marginLeft:32}}>
            <button onClick={function(){onMsg(u,"user")}} style={{background:"rgba(10,132,255,0.1)",border:"1px solid rgba(10,132,255,0.2)",color:"#0a84ff",padding:"3px 8px",borderRadius:5,fontSize:9,fontWeight:600,cursor:"pointer"}}>본인 메시지</button>
            <button onClick={function(){onMsg(u,"manager")}} style={{background:"rgba(255,159,10,0.1)",border:"1px solid rgba(255,159,10,0.2)",color:"#ff9f0a",padding:"3px 8px",borderRadius:5,fontSize:9,fontWeight:600,cursor:"pointer"}}>팀장 메시지</button>
          </div>
        </div>
      );
    })}</div>
  );
}

function TopRiskDepts(props) {
  var events=props.events;
  var m={};
  events.forEach(function(e){
    var d=e.employee.department;
    if(!m[d]) m[d]={dept:d,scores:[],count:0,users:{}};
    m[d].scores.push(e.riskScore); m[d].count++; m[d].users[e.employee.name]=true;
  });
  var depts=Object.values(m).map(function(d){return Object.assign({},d,{avgScore:d.scores.reduce(function(a,b){return a+b},0)/d.scores.length,userCount:Object.keys(d.users).length})}).sort(function(a,b){return b.avgScore-a.avgScore}).slice(0,5);
  return(
    <div>{depts.map(function(d,i){
      var c=d.avgScore>=65?"#ff2d55":d.avgScore>=50?"#ff9500":d.avgScore>=35?"#ffcc00":"#30d158";
      return(
        <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 0",borderBottom:i<4?"1px solid rgba(255,255,255,0.04)":"none"}}>
          <div style={{width:24,height:24,borderRadius:6,background:c+"15",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:c}}>{i+1}</div>
          <div style={{flex:1}}><div style={{fontSize:11,fontWeight:600}}>{d.dept}</div><div style={{fontSize:9,color:"rgba(255,255,255,0.3)"}}>{d.userCount}명 / {d.count}건</div></div>
          <div style={{width:60}}><MiniBar value={d.avgScore} max={100} color={c}/></div>
          <div style={{fontSize:12,fontWeight:700,color:c,fontFamily:"monospace",minWidth:28,textAlign:"right"}}>{Math.round(d.avgScore)}</div>
        </div>
      );
    })}</div>
  );
}

// Excel Export

function exportToExcel(events) {
  var data = events.map(function(e) {
    return {
      "이벤트ID": e.id,
      "시간": e.timestamp.toLocaleString("ko-KR"),
      "직원명": e.employee.name,
      "직원ID": e.employee.id,
      "부서": e.employee.department,
      "직무": e.employee.role,
      "고용형태": e.employee.employmentType,
      "보안등급": e.employee.clearanceLevel,
      "상급자": e.employee.managerId,
      "이벤트유형": e.eventType.label,
      "이벤트코드": e.eventType.type,
      "심각도": e.eventType.severity,
      "자산명": e.asset.name,
      "자산유형": e.asset.type,
      "자산등급": e.asset.classification,
      "민감도": e.asset.sensitivity,
      "위험점수": e.riskScore,
      "AI분석1": e.contexts[0] ? e.contexts[0].reason : "",
      "확률1": e.contexts[0] ? e.contexts[0].probability : "",
      "AI분석2": e.contexts[1] ? e.contexts[1].reason : "",
      "확률2": e.contexts[1] ? e.contexts[1].probability : "",
      "추천조치1": e.actions[0] ? e.actions[0].action : "",
      "추천조치2": e.actions[1] ? e.actions[1].action : "",
      "추천조치3": e.actions[2] ? e.actions[2].action : ""
    };
  });
  var ws = XLSX.utils.json_to_sheet(data);
  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "보안이벤트");
  XLSX.writeFile(wb, "보안이벤트_" + new Date().toISOString().slice(0, 10) + ".xlsx");
}

// Main App

export default function SecurityDashboard() {
  var stEmp = useState(function() { return generateAllEmployees(); });
  var employees = stEmp[0];
  var stEvents = useState([]);
  var events = stEvents[0], setEvents = stEvents[1];
  var stExpanded = useState(null);
  var expandedId = stExpanded[0], setExpandedId = stExpanded[1];
  var stPaused = useState(false);
  var isPaused = stPaused[0], setIsPaused = stPaused[1];
  var stSpeed = useState(2000);
  var speed = stSpeed[0], setSpeed = stSpeed[1];
  var stTotal = useState(0);
  var totalToday = stTotal[0], setTotalToday = stTotal[1];
  var stGuide = useState(null);
  var guideModal = stGuide[0], setGuideModal = stGuide[1];
  var stMessage = useState(null);
  var messageModal = stMessage[0], setMessageModal = stMessage[1];
  var stSearch = useState("");
  var searchText = stSearch[0], setSearchText = stSearch[1];
  var stSeverity = useState("all");
  var filterSeverity = stSeverity[0], setFilterSeverity = stSeverity[1];
  var stEventType = useState("all");
  var filterEventType = stEventType[0], setFilterEventType = stEventType[1];
  var feedRef = useRef(null);

  var addEvent = useCallback(function() {
    setEvents(function(p) { return [generateEvent(employees)].concat(p).slice(0, 500); });
    setTotalToday(function(p) { return p + 1; });
  }, [employees]);

  useEffect(function() {
    var init = [];
    for (var i = 0; i < 15; i++) {
      var e = generateEvent(employees);
      e.isNew = false;
      e.timestamp = new Date(Date.now() - randInt(1000, 120000));
      init.push(e);
    }
    init.sort(function(a, b) { return b.timestamp - a.timestamp; });
    setEvents(init);
    setTotalToday(init.length);
  }, [employees]);

  useEffect(function() {
    if (isPaused) return;
    var iv = setInterval(function() { addEvent(); }, speed + randInt(-500, 500));
    return function() { clearInterval(iv); };
  }, [isPaused, speed, addEvent]);

  useEffect(function() {
    var t = setTimeout(function() { setEvents(function(p) { return p.map(function(e) { return Object.assign({}, e, { isNew: false }); }); }); }, 2000);
    return function() { clearTimeout(t); };
  }, [events.length]);

  var filtered = events.filter(function(e) {
    if (searchText) {
      var q = searchText.toLowerCase();
      if (e.employee.name.toLowerCase().indexOf(q) === -1 && e.employee.department.toLowerCase().indexOf(q) === -1 && e.employee.id.toLowerCase().indexOf(q) === -1) return false;
    }
    if (filterSeverity !== "all" && e.eventType.severity !== filterSeverity) return false;
    if (filterEventType !== "all" && e.eventType.type !== filterEventType) return false;
    return true;
  });

  var crit = events.filter(function(e) { return e.riskScore >= 80; }).length;
  var high = events.filter(function(e) { return e.riskScore >= 60 && e.riskScore < 80; }).length;
  var activeSet = {};
  events.forEach(function(e) { activeSet[e.employee.name] = true; });
  var active = Object.keys(activeSet).length;

  var panelStyle = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 18 };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#fff", fontFamily: "'Pretendard',-apple-system,sans-serif", position: "relative", overflow: "hidden" }}>
      <style>{
        "@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');" +
        "@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');" +
        "@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.8)}}" +
        "@keyframes spin{to{transform:rotate(360deg)}}" +
        "@keyframes pulseRing{0%{transform:scale(1);opacity:.4}100%{transform:scale(3);opacity:0}}" +
        "@keyframes slideIn{from{opacity:0;transform:translateY(-20px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}" +
        "@keyframes fadeIn{from{opacity:0}to{opacity:1}}" +
        "@keyframes gridPulse{0%,100%{opacity:.03}50%{opacity:.06}}" +
        "::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:2px}" +
        "input::placeholder,textarea::placeholder{color:rgba(255,255,255,0.25)}"
      }</style>

      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, background: "radial-gradient(ellipse at 20% 20%,rgba(0,132,255,0.04) 0%,transparent 50%),radial-gradient(ellipse at 80% 80%,rgba(255,45,85,0.03) 0%,transparent 50%)" }} />
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)", backgroundSize: "60px 60px", animation: "gridPulse 4s ease infinite" }} />

      {guideModal && <ActionGuideModal action={guideModal.action} event={guideModal.event} onClose={function() { setGuideModal(null); }} />}
      {messageModal && <MessageModal user={messageModal.user} recipientType={messageModal.recipientType} onClose={function() { setMessageModal(null); }} />}

      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(10,10,15,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "12px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg,#0a84ff,#5e5ce6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, boxShadow: "0 4px 15px rgba(10,132,255,0.3)" }}>S</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>내부 정보 유출 위험자 식별 <span style={{ color: "rgba(255,255,255,0.25)", fontWeight: 400, fontSize: 11 }}>AI Decision Support</span></div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 1 }}>이상행위 탐지 / 의도 추론 / 조치 추천 / 활성 임직원 {employees.length.toLocaleString()}명</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}><PulsingDot color={isPaused ? "#666" : "#30d158"} /><span style={{ fontSize: 10, color: isPaused ? "#666" : "#30d158", fontWeight: 500 }}>{isPaused ? "정지" : "LIVE"}</span></div>
            <button onClick={function() { setIsPaused(!isPaused); }} style={{ background: isPaused ? "rgba(48,209,88,0.15)" : "rgba(255,255,255,0.06)", border: "1px solid " + (isPaused ? "rgba(48,209,88,0.3)" : "rgba(255,255,255,0.1)"), color: isPaused ? "#30d158" : "#fff", padding: "5px 12px", borderRadius: 7, fontSize: 11, fontWeight: 500, cursor: "pointer" }}>{isPaused ? "PLAY" : "PAUSE"}</button>
            <select value={speed} onChange={function(e) { setSpeed(Number(e.target.value)); }} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "5px 8px", borderRadius: 7, fontSize: 11, cursor: "pointer" }}>
              <option value={3000} style={{ background: "#1a1a2e" }}>느리게</option>
              <option value={2000} style={{ background: "#1a1a2e" }}>보통</option>
              <option value={800} style={{ background: "#1a1a2e" }}>빠르게</option>
              <option value={300} style={{ background: "#1a1a2e" }}>매우 빠름</option>
            </select>
            <button onClick={function() { exportToExcel(filtered); }} style={{ background: "rgba(48,209,88,0.12)", border: "1px solid rgba(48,209,88,0.25)", color: "#30d158", padding: "5px 12px", borderRadius: 7, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Excel ({filtered.length}건)</button>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", fontFamily: "monospace" }}>{new Date().toLocaleDateString("ko-KR")}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 24px", position: "relative", zIndex: 1 }}>
        {/* Stats */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <StatCard label="오늘 총 이벤트" value={totalToday} icon="E" color="#0a84ff" sub="실시간 집계" />
          <StatCard label="심각 (80+)" value={crit} icon="!" color="#ff2d55" sub="즉시 조치 필요" />
          <StatCard label="높음 (60-79)" value={high} icon="W" color="#ff9500" sub="주의 모니터링" />
          <StatCard label="활성 사용자" value={active} icon="U" color="#5e5ce6" sub={"전체 " + employees.length.toLocaleString() + "명 중"} />
        </div>

        {/* Search & Filters */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <input value={searchText} onChange={function(e) { setSearchText(e.target.value); }} placeholder="이름, 부서, 사번으로 검색..." style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 12, outline: "none", fontFamily: "'Pretendard',sans-serif", boxSizing: "border-box" }} />
          </div>
          <select value={filterSeverity} onChange={function(e) { setFilterSeverity(e.target.value); }} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", padding: "10px 12px", borderRadius: 10, fontSize: 12, cursor: "pointer" }}>
            <option value="all" style={{ background: "#1a1a2e" }}>전체 위험도</option>
            <option value="critical" style={{ background: "#1a1a2e" }}>심각</option>
            <option value="high" style={{ background: "#1a1a2e" }}>높음</option>
            <option value="medium" style={{ background: "#1a1a2e" }}>주의</option>
            <option value="low" style={{ background: "#1a1a2e" }}>낮음</option>
          </select>
          <select value={filterEventType} onChange={function(e) { setFilterEventType(e.target.value); }} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", padding: "10px 12px", borderRadius: 10, fontSize: 12, cursor: "pointer" }}>
            <option value="all" style={{ background: "#1a1a2e" }}>전체 행위</option>
            {EVENT_TYPES.map(function(et) { return <option key={et.type} value={et.type} style={{ background: "#1a1a2e" }}>{et.label}</option>; })}
          </select>
          {(searchText || filterSeverity !== "all" || filterEventType !== "all") && (
            <button onClick={function() { setSearchText(""); setFilterSeverity("all"); setFilterEventType("all"); }} style={{ background: "rgba(255,45,85,0.1)", border: "1px solid rgba(255,45,85,0.2)", color: "#ff2d55", padding: "10px 14px", borderRadius: 10, fontSize: 11, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>초기화</button>
          )}
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", whiteSpace: "nowrap" }}>결과: {filtered.length}건</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}>
          {/* Feed */}
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
              <div style={Object.assign({}, panelStyle, { padding: "10px 12px" })}>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>위험도 타임라인</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 48 }}>
                  {events.slice(-40).map(function(e, i, a) {
                    var h = Math.max(3, (e.riskScore / 100) * 48);
                    var c = e.riskScore >= 80 ? "#ff2d55" : e.riskScore >= 60 ? "#ff9500" : e.riskScore >= 40 ? "#ffcc00" : "#30d158";
                    return <div key={e.id} style={{ width: 5, height: h, borderRadius: 2, background: c, opacity: 0.5 + (i / a.length) * 0.5, transition: "height 0.5s cubic-bezier(0.22,1,0.36,1)" }} />;
                  })}
                </div>
              </div>
              <div style={Object.assign({}, panelStyle, { padding: "10px 12px" })}>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>실시간 위험도 추이</div>
                <LiveRiskChart events={events} />
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>실시간 이벤트 피드</span>
              <span style={{ fontSize: 10, color: "#0a84ff", background: "rgba(10,132,255,0.1)", padding: "2px 7px", borderRadius: 10 }}>{filtered.length}건</span>
            </div>
            <div ref={feedRef} style={{ maxHeight: "calc(100vh - 400px)", overflowY: "auto", paddingRight: 4 }}>
              {filtered.map(function(ev) {
                return <EventCard key={ev.id} event={ev} isExpanded={expandedId === ev.id} onClick={function() { setExpandedId(expandedId === ev.id ? null : ev.id); }} onOpenGuide={function(action) { setGuideModal({ action: action, event: ev }); }} />;
              })}
              {filtered.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "rgba(255,255,255,0.3)", fontSize: 13 }}>검색 결과가 없습니다</div>}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={panelStyle}><div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>전체 위험도 게이지</div><div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>최근 20건 기준</div><RiskGauge events={events} /></div>
            <div style={panelStyle}><div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>고위험 사용자 TOP 5</div><div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 10 }}>최고 위험 점수 기준</div><TopRiskUsers events={events} onMsg={function(u, t) { setMessageModal({ user: u, recipientType: t }); }} /></div>
            <div style={panelStyle}><div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>고위험 부서 TOP 5</div><div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 10 }}>평균 위험 점수 기준</div><TopRiskDepts events={events} /></div>
            <div style={panelStyle}>
              <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 10 }}>이벤트 유형 분포</div>
              {EVENT_TYPES.map(function(et) {
                var cnt = events.filter(function(e) { return e.eventType.type === et.type; }).length;
                var sc = { low: "#30d158", medium: "#ffcc00", high: "#ff9500", critical: "#ff2d55" };
                return (
                  <div key={et.type} style={{ marginBottom: 6 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.45)" }}>{et.icon} {et.label}</span>
                      <span style={{ fontSize: 10, color: sc[et.severity], fontFamily: "monospace", fontWeight: 600 }}>{cnt}</span>
                    </div>
                    <MiniBar value={cnt} max={Math.max(1, Math.max.apply(null, EVENT_TYPES.map(function(t) { return events.filter(function(e) { return e.eventType.type === t.type; }).length; })))} color={sc[et.severity]} />
                  </div>
                );
              })}
            </div>
            <div style={panelStyle}>
              <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 10 }}>7 Layer 데이터 상태</div>
              {[{ n: 1, name: "사용자/조직", s: "active" }, { n: 2, name: "권한/IAM", s: "active" }, { n: 3, name: "자산 메타", s: "active" }, { n: 4, name: "행동 로그", s: "streaming" }, { n: 5, name: "기준선", s: "active" }, { n: 6, name: "업무 Context", s: "active" }, { n: 7, name: "대응 Playbook", s: "active" }].map(function(l) {
                return (
                  <div key={l.n} style={{ display: "flex", alignItems: "center", gap: 7, padding: "5px 0", borderBottom: l.n < 7 ? "1px solid rgba(255,255,255,0.03)" : "none" }}>
                    <div style={{ width: 18, height: 18, borderRadius: 4, background: "rgba(10,132,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#0a84ff", fontWeight: 700 }}>{l.n}</div>
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", flex: 1 }}>{l.name}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                      {l.s === "streaming" && <PulsingDot color="#0a84ff" />}
                      <span style={{ fontSize: 8, fontWeight: 600, color: l.s === "streaming" ? "#0a84ff" : "#30d158" }}>{l.s === "streaming" ? "STREAMING" : "ACTIVE"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
