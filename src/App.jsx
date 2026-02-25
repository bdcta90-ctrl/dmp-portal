import { useState, useEffect, useRef, useCallback } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid, Line } from "recharts";
import * as XLSX from "xlsx";

// ============================================================
// SecurityDashboard MVP (원본)
// ============================================================




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

  useEffect(function() {
    if (events.length > 0) {
      var latest = events[0];
      dataRef.current = dataRef.current.concat([{ score: latest.riskScore, time: Date.now() }]).slice(-60);
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

  return <canvas ref={canvasRef} style={{ width: "100%", height: 90, display: "block" }} />;
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
          <div style={{background:"rgba(0,122,255,0.05)",border:"1px solid rgba(0,122,255,0.12)",borderRadius:10,padding:12,marginBottom:10}}>
            <div style={{fontSize:9,color:"#0a84ff",fontWeight:600,letterSpacing:1,marginBottom:8}}>AI 맥락 분석</div>
            {event.contexts.map(function(ctx,i){return(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:i<2?6:0}}>
                <div style={{width:20,height:20,borderRadius:"50%",background:i===0?"rgba(0,132,255,0.2)":"rgba(255,255,255,0.05)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:i===0?"#0a84ff":"rgba(255,255,255,0.4)",fontWeight:700}}>{i+1}</div>
                <div style={{flex:1,fontSize:11,color:"rgba(255,255,255,0.7)"}}>{ctx.reason}</div>
                <div style={{display:"flex",alignItems:"center",gap:5,minWidth:80}}>
                  <MiniBar value={ctx.probability} color={i===0?"#0a84ff":"rgba(255,255,255,0.2)"}/>
                  <span style={{fontSize:10,color:i===0?"#0a84ff":"rgba(255,255,255,0.3)",fontFamily:"monospace",fontWeight:600,minWidth:28,textAlign:"right"}}>{ctx.probability}%</span>
                </div>
              </div>
            )})}
          </div>
          <div style={{background:"rgba(255,149,0,0.05)",border:"1px solid rgba(255,149,0,0.12)",borderRadius:10,padding:12}}>
            <div style={{fontSize:9,color:"#ff9f0a",fontWeight:600,letterSpacing:1,marginBottom:8}}>추천 조치 - 클릭하여 수행 가이드</div>
            <div style={{display:"flex",gap:6}}>
              {event.actions.map(function(act,i){
                var ac=sc[act.urgency]||"#ffcc00";
                return(
                  <div key={i} onClick={function(){onOpenGuide(act)}} style={{flex:1,background:"rgba(255,255,255,0.03)",border:"1px solid "+ac+"20",borderRadius:8,padding:"10px 12px",cursor:"pointer",transition:"all 0.2s"}}>
                    <div style={{fontSize:11,fontWeight:600,color:ac,marginBottom:4}}>{act.action}</div>
                    <div style={{fontSize:9,color:ac,fontWeight:600,background:ac+"10",padding:"2px 6px",borderRadius:4,display:"inline-block"}}>가이드 보기</div>
                  </div>
                );
              })}
            </div>
          </div>
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

function SecurityDashboardMVP({ onBack }) {
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
            <button onClick={onBack} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "#aaa", padding: "6px 12px", cursor: "pointer", fontSize: 12, fontFamily: "inherit", marginRight: 8 }}>{"← DMP"}</button><div style={{ width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg,#0a84ff,#5e5ce6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, boxShadow: "0 4px 15px rgba(10,132,255,0.3)" }}>S</div>
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


// ============================================================
// StockPilot MVP (원본)
// ============================================================




const COLORS = ["#00E5A0","#FF6B6B","#4ECDC4","#FFE66D","#A78BFA","#F97316","#38BDF8","#FB7185","#34D399","#FBBF24","#818CF8","#F472B6"];
const SECTOR_OPTIONS = ["반도체","2차전지","바이오","금융","IT/소프트웨어","자동차","에너지","소비재","통신","부동산","방산/우주","AI/로봇","엔터","기타"];
const MONTHS = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];

const DEFAULT_STOCKS = [
  { id:1, name:"삼성전자", sector:"반도체", avgPrice:71000, currentPrice:68500, quantity:100, memo:"" },
  { id:2, name:"SK하이닉스", sector:"반도체", avgPrice:185000, currentPrice:210000, quantity:30, memo:"" },
  { id:3, name:"LG에너지솔루션", sector:"2차전지", avgPrice:420000, currentPrice:380000, quantity:10, memo:"" },
  { id:4, name:"셀트리온", sector:"바이오", avgPrice:175000, currentPrice:195000, quantity:20, memo:"" },
  { id:5, name:"카카오", sector:"IT/소프트웨어", avgPrice:48000, currentPrice:42000, quantity:50, memo:"" },
  { id:6, name:"현대차", sector:"자동차", avgPrice:245000, currentPrice:260000, quantity:15, memo:"" },
  { id:7, name:"한화에어로스페이스", sector:"방산/우주", avgPrice:280000, currentPrice:650000, quantity:20, memo:"" },
];
const DEFAULT_RE = [{ id:1, name:"서울 강남 아파트", type:"아파트", purchasePrice:1200000000, currentValue:1450000000, purchaseDate:"2021-03", loanBalance:600000000, monthlyPayment:2800000, address:"서울시 강남구", area:84, memo:"전용 84㎡" }];
const DEFAULT_CARS = [{ id:1, name:"제네시스 G80", brand:"현대", purchasePrice:72000000, currentValue:48000000, purchaseDate:"2022-06", loanBalance:20000000, monthlyPayment:850000, mileage:35000, memo:"3.5T AWD" }];
const DEFAULT_EVENTS = [
  { year:1997, title:"IMF 외환위기", desc:"아시아 금융위기, 한국 IMF 구제금융 신청", type:"crisis" },
  { year:2000, title:"닷컴 버블 붕괴", desc:"IT 버블 붕괴, 나스닥 78% 폭락", type:"crisis" },
  { year:2008, title:"글로벌 금융위기", desc:"리먼브라더스 파산, 서브프라임 모기지 사태", type:"crisis" },
  { year:2020, title:"코로나 팬데믹", desc:"COVID-19 글로벌 확산, 서킷브레이커 발동", type:"crisis" },
  { year:2022, title:"금리인상 쇼크", desc:"급격한 금리인상, 성장주 폭락, 루나 사태", type:"correction" },
  { year:2028, title:"AI 화이트컬러 리스크 (예상)", desc:"AI가 활성화되고, Agentic AI가 활성화되면 화이트컬러 직종이 먼저 무너질 것이고, 이로 인한 주택담보대출 상환률이 떨어져 금융사의 부실이 이어질 것이다. 시기는 좀 더 분석이 필요. (출처: 3pro tv)", type:"predicted" },
  { year:2032, title:"??? (예상)", desc:"약 12년 주기 빅 리스크 예상 시점", type:"predicted" },
];
const DEFAULT_EXPENSES = { annualIncome:60000000, cards:[
{id:1,name:"신용카드",type:"credit",mandatory:false,monthlyMin:0},
{id:2,name:"체크카드",type:"debit",mandatory:false,monthlyMin:0},
{id:3,name:"계좌이체(국민)",type:"transfer",mandatory:false,monthlyMin:0},
{id:4,name:"현금",type:"cash",mandatory:false,monthlyMin:0},
{id:5,name:"필수카드A",type:"credit",mandatory:true,monthlyMin:300000},
{id:6,name:"필수카드B",type:"credit",mandatory:true,monthlyMin:300000},
], entries:[] };
const DEFAULT_GOAL = { targetAmount:500000000, targetDate:"2030-12", monthlyInvestment:3000000, memo:"5억 달성 후 경제적 자유" };

const fk=(v)=>{if(Math.abs(v)>=1e8)return`${(v/1e8).toFixed(1)}억`;if(Math.abs(v)>=1e4)return`${(v/1e4).toFixed(0)}만`;return v?.toLocaleString()??"0";};
const ff=(v)=>v?.toLocaleString("ko-KR")??"0";

const SK2="stockpilot-v3";
function loadD(){return null;}
function saveD(d){}

const IS={width:"100%",padding:"10px 14px",background:"rgba(15,23,42,0.8)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,color:"#F8FAFC",fontSize:14,outline:"none",fontFamily:"'Pretendard',sans-serif",boxSizing:"border-box"};
const BT=(bg="linear-gradient(135deg,#00E5A0,#00B8D4)",c="#0F172A")=>({padding:"10px 20px",background:bg,color:c,border:"none",borderRadius:10,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"'Pretendard',sans-serif"});

function Card({children,style={},glow,onClick}){return<div onClick={onClick} style={{background:"rgba(30,41,59,0.7)",borderRadius:14,padding:18,border:"1px solid rgba(255,255,255,0.06)",boxShadow:glow?"0 0 40px rgba(0,229,160,0.08)":"0 2px 12px rgba(0,0,0,0.15)",backdropFilter:"blur(12px)",transition:"all 0.3s",cursor:onClick?"pointer":undefined,...style}}>{children}</div>;}
function SB({label,value,sub,color="#00E5A0",icon}){return<Card style={{flex:1,minWidth:0}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div><div style={{fontSize:13,color:"#64748B",marginBottom:8,fontWeight:500}}>{label}</div><div style={{fontSize:18,fontWeight:800,color,fontFamily:"monospace",letterSpacing:"-0.02em"}}>{value}</div>{sub&&<div style={{fontSize:12,color:"#94A3B8",marginTop:6}}>{sub}</div>}</div>{icon&&<span style={{fontSize:28,opacity:0.5}}>{icon}</span>}</div></Card>;}

function MemoPad({memos,setMemos}){const[open,setOpen]=useState(false);const[text,setText]=useState("");const today=new Date().toISOString().slice(0,10);const add=()=>{if(!text.trim())return;setMemos(p=>[{id:Date.now(),date:today,text:text.trim()},...p]);setText("");};return(<div style={{marginBottom:14}}><button onClick={()=>setOpen(!open)} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 16px",background:"rgba(255,230,109,0.1)",border:"1px solid rgba(255,230,109,0.2)",borderRadius:12,cursor:"pointer",color:"#FFE66D",fontSize:13,fontWeight:600,fontFamily:"'Pretendard',sans-serif"}}>📝 메모장 {open?"▲":"▼"} <span style={{fontSize:11,color:"#94A3B8",fontWeight:400}}>{memos.length}건</span></button>{open&&<Card style={{marginTop:8,background:"rgba(255,230,109,0.03)",border:"1px solid rgba(255,230,109,0.12)"}}><div style={{display:"flex",gap:8,marginBottom:12}}><input value={today} disabled style={{...IS,width:120,opacity:0.6}}/><input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()} placeholder="메모를 입력하세요..." style={{...IS,flex:1,borderColor:"rgba(255,230,109,0.2)"}}/><button onClick={add} style={BT("linear-gradient(135deg,#FFE66D,#F97316)","#0F172A")}>추가</button></div><div style={{maxHeight:200,overflow:"auto",display:"flex",flexDirection:"column",gap:6}}>{memos.length===0&&<div style={{textAlign:"center",color:"#475569",fontSize:13,padding:16}}>메모가 없습니다</div>}{memos.map(m=><div key={m.id} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"8px 12px",background:"rgba(15,23,42,0.4)",borderRadius:8}}><span style={{fontSize:11,color:"#FFE66D",fontFamily:"monospace",fontWeight:600,whiteSpace:"nowrap",marginTop:2}}>{m.date}</span><span style={{flex:1,fontSize:13,color:"#CBD5E1",lineHeight:1.5}}>{m.text}</span><button onClick={()=>setMemos(p=>p.filter(x=>x.id!==m.id))} style={{background:"none",border:"none",color:"#64748B",cursor:"pointer",fontSize:14}}>✕</button></div>)}</div></Card>}</div>);}

function GoalTracker({goal,setGoal,currentNet}){const[ed,setEd]=useState(false);const[f,setF]=useState(goal);const save=()=>{setGoal(f);setEd(false);};const progress=goal.targetAmount>0?Math.min((currentNet/goal.targetAmount)*100,100):0;const rem=goal.targetAmount-currentNet;const td=new Date(goal.targetDate+"-01");const now=new Date();const ml=Math.max((td.getFullYear()-now.getFullYear())*12+(td.getMonth()-now.getMonth()),1);const mn=rem>0?rem/ml:0;const yl=(ml/12).toFixed(1);return(<Card style={{background:"linear-gradient(135deg,rgba(0,229,160,0.04),rgba(56,189,248,0.04))",border:"1px solid rgba(0,229,160,0.12)",marginBottom:12}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:22}}>🎯</span><span style={{fontSize:17,fontWeight:700,color:"#F8FAFC"}}>목표 달성 트래커</span></div><button onClick={()=>{setF(goal);setEd(!ed);}} style={{...BT("rgba(100,116,139,0.2)","#94A3B8"),padding:"6px 14px",fontSize:12}}>{ed?"취소":"설정"}</button></div>{ed?<div><div style={{display:"flex",gap:16,flexWrap:"wrap",marginBottom:12}}><div style={{flex:1,minWidth:150}}><label style={{fontSize:12,color:"#64748B",display:"block",marginBottom:4}}>목표 금액 (원)</label><input value={f.targetAmount} onChange={e=>setF({...f,targetAmount:Number(e.target.value)||0})} style={IS} type="number"/></div><div style={{flex:1,minWidth:120}}><label style={{fontSize:12,color:"#64748B",display:"block",marginBottom:4}}>목표 시점</label><input value={f.targetDate} onChange={e=>setF({...f,targetDate:e.target.value})} style={IS} placeholder="2030-12"/></div><div style={{flex:1,minWidth:150}}><label style={{fontSize:12,color:"#64748B",display:"block",marginBottom:4}}>월 투자 가능액</label><input value={f.monthlyInvestment} onChange={e=>setF({...f,monthlyInvestment:Number(e.target.value)||0})} style={IS} type="number"/></div><div style={{flex:2,minWidth:200}}><label style={{fontSize:12,color:"#64748B",display:"block",marginBottom:4}}>메모</label><input value={f.memo} onChange={e=>setF({...f,memo:e.target.value})} style={IS}/></div></div><div style={{display:"flex",justifyContent:"flex-end"}}><button onClick={save} style={BT()}>저장</button></div></div>:<><div style={{marginBottom:12}}><div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}><span style={{color:"#94A3B8"}}>현재 {fk(currentNet)}원</span><span style={{color:"#00E5A0",fontWeight:700}}>목표 {fk(goal.targetAmount)}원</span></div><div style={{height:12,background:"rgba(15,23,42,0.6)",borderRadius:6,overflow:"hidden",position:"relative"}}><div style={{height:"100%",width:`${progress}%`,background:"linear-gradient(90deg,#00E5A0,#38BDF8)",borderRadius:6,transition:"width 0.5s"}}/><div style={{position:"absolute",top:0,left:0,right:0,bottom:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#F8FAFC"}}>{progress.toFixed(1)}%</div></div></div><div className="sp-goal-grid"><div style={{background:"rgba(15,23,42,0.4)",borderRadius:10,padding:"10px 14px"}}><div style={{fontSize:11,color:"#64748B"}}>잔여 금액</div><div style={{fontSize:16,fontWeight:800,color:rem>0?"#FFE66D":"#00E5A0",fontFamily:"monospace"}}>{rem>0?fk(rem)+"원":"🎉 달성!"}</div></div><div style={{background:"rgba(15,23,42,0.4)",borderRadius:10,padding:"10px 14px"}}><div style={{fontSize:11,color:"#64748B"}}>남은 기간</div><div style={{fontSize:16,fontWeight:800,color:"#38BDF8",fontFamily:"monospace"}}>{yl}년 ({ml}개월)</div></div><div style={{background:"rgba(15,23,42,0.4)",borderRadius:10,padding:"10px 14px"}}><div style={{fontSize:11,color:"#64748B"}}>월 필요액</div><div style={{fontSize:16,fontWeight:800,color:mn<=goal.monthlyInvestment?"#00E5A0":"#FF6B6B",fontFamily:"monospace"}}>{fk(Math.round(mn))}원</div><div style={{fontSize:10,color:"#94A3B8"}}>가능 {fk(goal.monthlyInvestment)} {mn<=goal.monthlyInvestment?"✅":"⚠️"}</div></div><div style={{background:"rgba(15,23,42,0.4)",borderRadius:10,padding:"10px 14px"}}><div style={{fontSize:11,color:"#64748B"}}>필요 연수익률</div><div style={{fontSize:16,fontWeight:800,color:"#A78BFA",fontFamily:"monospace"}}>{currentNet>0?(((goal.targetAmount/currentNet)**(1/(ml/12))-1)*100).toFixed(1):"—"}%</div><div style={{fontSize:10,color:"#94A3B8"}}>복리 기준</div></div></div>{goal.memo&&<div style={{marginTop:10,fontSize:12,color:"#94A3B8",fontStyle:"italic"}}>💡 {goal.memo}</div>}</>}</Card>);}

function Nav({active,setActive}){const items=[{id:0,icon:"📊",label:"대시보드"},{id:1,icon:"💼",label:"포트폴리오"},{id:2,icon:"🏠",label:"자산"},{id:3,icon:"💳",label:"지출"},{id:4,icon:"🔍",label:"분석"},{id:5,icon:"🤖",label:"AI전략"},{id:6,icon:"📅",label:"인사이트"},{id:7,icon:"📈",label:"시세"}];return(<nav className="sp-nav">{items.map(it=><button key={it.id} onClick={()=>setActive(it.id)} style={{background:active===it.id?"linear-gradient(135deg,#00E5A0,#00B8D4)":"transparent",color:active===it.id?"#0F172A":"#94A3B8",fontWeight:active===it.id?700:500}}><span className="sp-nav-icon" style={{fontSize:18}}>{it.icon}</span><span>{it.label}</span></button>)}</nav>);}

// Dashboard
function Dashboard({stocks,seed,withdrawals,cash,realEstate,cars,goal,setGoal}){const ti=stocks.reduce((s,st)=>s+st.avgPrice*st.quantity,0),tc=stocks.reduce((s,st)=>s+st.currentPrice*st.quantity,0);const rev=realEstate.reduce((s,r)=>s+r.currentValue,0),rel=realEstate.reduce((s,r)=>s+r.loanBalance,0);const cav=cars.reduce((s,c)=>s+c.currentValue,0),cal=cars.reduce((s,c)=>s+c.loanBalance,0);const net=tc+cash+rev-rel+cav-cal,gross=tc+cash+rev+cav,loan=rel+cal,spnl=tc-ti,pr=ti>0?(spnl/ti*100):0,sr=seed>0?((net-seed+withdrawals)/seed*100):0;
const sd={};stocks.forEach(st=>{sd[st.sector]=(sd[st.sector]||0)+st.currentPrice*st.quantity;});const pd=Object.entries(sd).map(([n,v])=>({name:n,value:v})).sort((a,b)=>b.value-a.value);if(cash>0)pd.push({name:"현금",value:cash});
const ac=[];if(tc>0)ac.push({name:"주식",value:tc});if(rev>0)ac.push({name:"부동산",value:rev});if(cav>0)ac.push({name:"자동차",value:cav});if(cash>0)ac.push({name:"현금",value:cash});const cc=["#00E5A0","#A78BFA","#FFE66D","#38BDF8"];
const md=[];for(let i=6;i>=0;i--){const d=new Date();d.setMonth(d.getMonth()-i);md.push({month:`${d.getMonth()+1}월`,순자산:Math.round(net*(1+(Math.sin(i*1.5)*0.08)+((6-i)*0.02))*(0.85+i*0.025)),씨드:seed});}md[md.length-1].순자산=net;
const top5=[...stocks].sort((a,b)=>(b.currentPrice*b.quantity)-(a.currentPrice*a.quantity)).slice(0,5);
return(<div style={{display:"flex",flexDirection:"column",gap:16}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}><div><h2 style={{margin:0,fontSize:22,fontWeight:800,color:"#F8FAFC"}}>자산 대시보드</h2></div><div style={{fontSize:12,color:"#64748B",background:"rgba(100,116,139,0.15)",padding:"6px 14px",borderRadius:20}}>{new Date().toLocaleDateString("ko-KR")}</div></div>
<GoalTracker goal={goal} setGoal={setGoal} currentNet={net}/>
<div className="sp-grid4"><SB label="순자산" value={fk(net)+"원"} sub={`총${fk(gross)}−대출${fk(loan)}`} icon="💰"/><SB label="주식 손익" value={(spnl>=0?"+":"")+fk(spnl)+"원"} color={spnl>=0?"#00E5A0":"#FF6B6B"} sub={`${pr.toFixed(2)}%`} icon={spnl>=0?"📈":"📉"}/><SB label="씨드 수익률" value={sr.toFixed(2)+"%"} color={sr>=0?"#00E5A0":"#FF6B6B"} sub={`출금${fk(withdrawals)}`} icon="🎯"/><SB label="현금" value={fk(cash)+"원"} color="#38BDF8" sub={`${gross>0?(cash/gross*100).toFixed(1):0}%`} icon="💵"/></div>
{(realEstate.length>0||cars.length>0)&&<div className="sp-grid3">{realEstate.length>0&&<SB label="부동산 순자산" value={fk(rev-rel)+"원"} color="#A78BFA" sub={`시가${fk(rev)}·대출${fk(rel)}`} icon="🏠"/>}{cars.length>0&&<SB label="자동차" value={fk(cav-cal)+"원"} color="#FFE66D" sub={`시가${fk(cav)}·대출${fk(cal)}`} icon="🚗"/>}<SB label="총대출" value={fk(loan)+"원"} color="#FF6B6B" icon="🏦"/></div>}
<div className="sp-grid2"><Card glow><h3 style={{margin:"0 0 16px",fontSize:17,fontWeight:700,color:"#F8FAFC"}}>섹터 비중</h3><div style={{display:"flex",alignItems:"center",gap:14}}><ResponsiveContainer width="50%" height={200}><PieChart><Pie data={pd} cx="50%" cy="50%" innerRadius={45} outerRadius={78} dataKey="value" stroke="none" animationDuration={800}>{pd.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}</Pie><Tooltip formatter={v=>fk(v)+"원"} contentStyle={{background:"#1E293B",border:"1px solid #334155",borderRadius:8,fontSize:12,color:"#F8FAFC"}}/></PieChart></ResponsiveContainer><div style={{display:"flex",flexDirection:"column",gap:4,flex:1}}>{pd.map((d,i)=><div key={d.name} style={{display:"flex",alignItems:"center",gap:6,fontSize:12}}><div style={{width:8,height:8,borderRadius:2,background:COLORS[i%COLORS.length],flexShrink:0}}/><span style={{color:"#CBD5E1",flex:1}}>{d.name}</span><span style={{color:"#94A3B8",fontFamily:"monospace"}}>{((d.value)/(tc+cash)*100).toFixed(1)}%</span></div>)}</div></div></Card>
<Card><h3 style={{margin:"0 0 16px",fontSize:17,fontWeight:700,color:"#F8FAFC"}}>자산 구성</h3><div style={{display:"flex",alignItems:"center",gap:14}}><ResponsiveContainer width="50%" height={200}><PieChart><Pie data={ac} cx="50%" cy="50%" innerRadius={45} outerRadius={78} dataKey="value" stroke="none">{ac.map((_,i)=><Cell key={i} fill={cc[i%cc.length]}/>)}</Pie><Tooltip formatter={v=>fk(v)+"원"} contentStyle={{background:"#1E293B",border:"1px solid #334155",borderRadius:8,fontSize:12,color:"#F8FAFC"}}/></PieChart></ResponsiveContainer><div style={{display:"flex",flexDirection:"column",gap:5,flex:1}}>{ac.map((d,i)=><div key={d.name} style={{display:"flex",alignItems:"center",gap:6,fontSize:12}}><div style={{width:8,height:8,borderRadius:2,background:cc[i%cc.length],flexShrink:0}}/><span style={{color:"#CBD5E1",flex:1}}>{d.name}</span><span style={{color:"#94A3B8",fontFamily:"monospace"}}>{(d.value/gross*100).toFixed(1)}%</span></div>)}</div></div></Card></div>
<div className="sp-grid2-wide"><Card><h3 style={{margin:"0 0 16px",fontSize:17,fontWeight:700,color:"#F8FAFC"}}>순자산 추이</h3><ResponsiveContainer width="100%" height={240}><AreaChart data={md}><defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00E5A0" stopOpacity={0.3}/><stop offset="95%" stopColor="#00E5A0" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/><XAxis dataKey="month" tick={{fontSize:11,fill:"#64748B"}} axisLine={false}/><YAxis tick={{fontSize:11,fill:"#64748B"}} tickFormatter={fk} axisLine={false}/><Tooltip formatter={v=>fk(v)+"원"} contentStyle={{background:"#1E293B",border:"1px solid #334155",borderRadius:8,fontSize:12,color:"#F8FAFC"}}/><Area type="monotone" dataKey="순자산" stroke="#00E5A0" fill="url(#ag)" strokeWidth={2.5} dot={false}/><Line type="monotone" dataKey="씨드" stroke="#475569" strokeDasharray="5 5" strokeWidth={1.5} dot={false}/></AreaChart></ResponsiveContainer></Card>
<Card><h3 style={{margin:"0 0 16px",fontSize:17,fontWeight:700,color:"#F8FAFC"}}>TOP 5</h3><div style={{display:"flex",flexDirection:"column",gap:10}}>{top5.map((st,i)=>{const v=st.currentPrice*st.quantity,r=((st.currentPrice-st.avgPrice)/st.avgPrice*100);return<div key={st.id} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 18px",background:"rgba(15,23,42,0.5)",borderRadius:12}}><div style={{width:32,height:32,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",background:`linear-gradient(135deg,${COLORS[i]},${COLORS[i]}88)`,fontWeight:800,fontSize:14,color:"#0F172A"}}>{i+1}</div><div style={{flex:1}}><div style={{fontSize:15,fontWeight:600,color:"#F8FAFC"}}>{st.name}</div><div style={{fontSize:12,color:"#64748B"}}>{st.sector}·{st.quantity}주</div></div><div style={{textAlign:"right"}}><div style={{fontSize:15,fontWeight:700,color:"#F8FAFC",fontFamily:"monospace"}}>{fk(v)}원</div><div style={{fontSize:13,fontWeight:600,fontFamily:"monospace",color:r>=0?"#00E5A0":"#FF6B6B"}}>{r>=0?"+":""}{r.toFixed(1)}%</div></div></div>;})}</div></Card></div></div>);}

// Portfolio
function Portfolio({stocks,setStocks,cash,setCash,seed,setSeed,withdrawals,setWithdrawals}){const[editing,setEditing]=useState(null);const[form,setForm]=useState({name:"",sector:"반도체",avgPrice:"",currentPrice:"",quantity:"",memo:""});const[showSet,setShowSet]=useState(false);const[simT,setSimT]=useState(null);const[simP,setSimP]=useState("");const[simQ,setSimQ]=useState("");
const startEdit=(st)=>{setEditing(st?.id||"new");setForm(st?{name:st.name,sector:st.sector,avgPrice:String(st.avgPrice),currentPrice:String(st.currentPrice),quantity:String(st.quantity),memo:st.memo||""}:{name:"",sector:"반도체",avgPrice:"",currentPrice:"",quantity:"",memo:""});};
const saveS=()=>{const d={name:form.name,sector:form.sector,avgPrice:Number(form.avgPrice),currentPrice:Number(form.currentPrice),quantity:Number(form.quantity),memo:form.memo};if(!d.name||!d.avgPrice||!d.quantity)return;if(editing==="new")setStocks(p=>[...p,{...d,id:Date.now()}]);else setStocks(p=>p.map(s=>s.id===editing?{...s,...d}:s));setEditing(null);};
const sr2=simT&&simP&&simQ?(()=>{const ap=Number(simP),aq=Number(simQ);if(!ap||!aq)return null;const tc2=simT.avgPrice*simT.quantity+ap*aq,tq=simT.quantity+aq,na=tc2/tq;return{newAvg:na,totalQty:tq,totalCost:tc2,changeRate:((na-simT.avgPrice)/simT.avgPrice*100),newPnlRate:((simT.currentPrice-na)/na*100),oldPnlRate:((simT.currentPrice-simT.avgPrice)/simT.avgPrice*100),addCost:ap*aq};})():null;
return(<div style={{display:"flex",flexDirection:"column",gap:16}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}><div><h2 style={{margin:0,fontSize:22,fontWeight:800,color:"#F8FAFC"}}>포트폴리오</h2></div><div style={{display:"flex",gap:8}}><button onClick={()=>setShowSet(!showSet)} style={BT("rgba(100,116,139,0.2)","#94A3B8")}>⚙️</button><button onClick={()=>startEdit(null)} style={BT()}>+ 종목</button></div></div>
{showSet&&<Card><div style={{display:"flex",gap:16,flexWrap:"wrap"}}>{[["씨드",seed,setSeed],["현금",cash,setCash],["출금",withdrawals,setWithdrawals]].map(([l,v,fn])=><div key={l} style={{flex:1,minWidth:140}}><label style={{fontSize:12,color:"#64748B",display:"block",marginBottom:4}}>{l}(원)</label><input value={v} onChange={e=>fn(Number(e.target.value)||0)} style={IS} type="number"/></div>)}</div></Card>}
{editing!==null&&<Card glow><div style={{display:"flex",gap:10,flexWrap:"wrap"}}><div style={{flex:2,minWidth:130}}><label style={{fontSize:12,color:"#64748B",display:"block",marginBottom:4}}>종목명*</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} style={IS}/></div><div style={{flex:1,minWidth:100}}><label style={{fontSize:12,color:"#64748B",display:"block",marginBottom:4}}>섹터</label><select value={form.sector} onChange={e=>setForm({...form,sector:e.target.value})} style={{...IS,appearance:"auto"}}>{SECTOR_OPTIONS.map(s=><option key={s}>{s}</option>)}</select></div><div style={{flex:1,minWidth:100}}><label style={{fontSize:12,color:"#64748B",display:"block",marginBottom:4}}>평단*</label><input value={form.avgPrice} onChange={e=>setForm({...form,avgPrice:e.target.value})} style={IS} type="number"/></div><div style={{flex:1,minWidth:100}}><label style={{fontSize:12,color:"#64748B",display:"block",marginBottom:4}}>현재가</label><input value={form.currentPrice} onChange={e=>setForm({...form,currentPrice:e.target.value})} style={IS} type="number"/></div><div style={{flex:1,minWidth:80}}><label style={{fontSize:12,color:"#64748B",display:"block",marginBottom:4}}>수량*</label><input value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})} style={IS} type="number"/></div></div><div style={{display:"flex",gap:8,marginTop:12,justifyContent:"flex-end"}}><button onClick={()=>setEditing(null)} style={BT("rgba(100,116,139,0.2)","#94A3B8")}>취소</button><button onClick={saveS} style={BT()}>저장</button></div></Card>}
{simT&&<Card glow style={{border:"1px solid rgba(56,189,248,0.3)",background:"rgba(56,189,248,0.04)"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><h3 style={{margin:0,fontSize:15,fontWeight:700,color:"#38BDF8"}}>🧮 평단 시뮬레이터 — {simT.name}</h3><button onClick={()=>setSimT(null)} style={{background:"none",border:"none",color:"#64748B",cursor:"pointer",fontSize:18}}>✕</button></div><div style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:14}}><div style={{background:"rgba(15,23,42,0.5)",borderRadius:10,padding:"12px 16px",flex:1,minWidth:180}}><div style={{fontSize:11,color:"#64748B",marginBottom:6}}>현재 보유</div>{[["평단",ff(simT.avgPrice)+"원"],["수량",simT.quantity+"주"],["현재가",ff(simT.currentPrice)+"원"]].map(([l,v])=><div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#CBD5E1",marginBottom:3}}><span>{l}</span><span style={{fontFamily:"monospace",fontWeight:700}}>{v}</span></div>)}</div><div style={{display:"flex",flexDirection:"column",gap:8,flex:1,minWidth:180}}><div style={{fontSize:11,color:"#38BDF8",fontWeight:600}}>추가 매수</div><div><label style={{fontSize:11,color:"#94A3B8"}}>단가</label><input value={simP} onChange={e=>setSimP(e.target.value)} style={{...IS,borderColor:"rgba(56,189,248,0.3)"}} type="number"/></div><div><label style={{fontSize:11,color:"#94A3B8"}}>수량</label><input value={simQ} onChange={e=>setSimQ(e.target.value)} style={{...IS,borderColor:"rgba(56,189,248,0.3)"}} type="number"/></div></div></div>
{sr2&&<div style={{background:"linear-gradient(135deg,rgba(56,189,248,0.06),rgba(0,229,160,0.06))",borderRadius:12,padding:16,border:"1px solid rgba(56,189,248,0.12)"}}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>{[["새 평단",ff(Math.round(sr2.newAvg))+"원","#F8FAFC",`${sr2.changeRate<=0?"▼":"▲"}${Math.abs(sr2.changeRate).toFixed(2)}%`],["총수량",sr2.totalQty+"주","#F8FAFC",`+${Number(simQ)}주`],["예상수익률",`${sr2.newPnlRate>=0?"+":""}${sr2.newPnlRate.toFixed(2)}%`,sr2.newPnlRate>=0?"#00E5A0":"#FF6B6B",`기존${sr2.oldPnlRate>=0?"+":""}${sr2.oldPnlRate.toFixed(2)}%`]].map(([l,v,c,s])=><div key={l} style={{textAlign:"center"}}><div style={{fontSize:11,color:"#64748B"}}>{l}</div><div style={{fontSize:18,fontWeight:800,color:c,fontFamily:"monospace"}}>{v}</div><div style={{fontSize:11,color:"#94A3B8"}}>{s}</div></div>)}</div><div style={{display:"flex",gap:12,marginTop:12,fontSize:11,flexWrap:"wrap"}}><span style={{color:"#64748B"}}>추가:{ff(sr2.addCost)}원</span><span style={{color:"#64748B"}}>총투자:{fk(sr2.totalCost)}원</span><span style={{color:"#64748B"}}>손익분기:<span style={{color:"#FFE66D",fontWeight:700}}>{ff(Math.round(sr2.newAvg))}원</span></span></div></div>}</Card>}
<div style={{display:"flex",flexDirection:"column",gap:6}}><div className="sp-stock-row" style={{padding:"10px 18px",fontSize:12,color:"#64748B",fontWeight:600}}><span>종목</span><span>섹터</span><span>평단</span><span>현재가</span><span>수량</span><span>평가</span><span>손익</span><span></span></div>{stocks.map(st=>{const v=st.currentPrice*st.quantity,p=(st.currentPrice-st.avgPrice)/st.avgPrice*100;return<div key={st.id} className="sp-stock-row" style={{padding:"14px 18px",background:simT?.id===st.id?"rgba(56,189,248,0.06)":"rgba(30,41,59,0.5)",borderRadius:10,border:simT?.id===st.id?"1px solid rgba(56,189,248,0.3)":"1px solid rgba(255,255,255,0.04)",fontSize:13}}><span style={{fontWeight:700,color:"#F8FAFC"}}>{st.name}</span><span style={{color:"#94A3B8",fontSize:11}}>{st.sector}</span><span style={{fontFamily:"monospace",color:"#CBD5E1"}}>{ff(st.avgPrice)}</span><span style={{fontFamily:"monospace",color:"#CBD5E1"}}>{ff(st.currentPrice)}</span><span style={{fontFamily:"monospace",color:"#CBD5E1"}}>{st.quantity}</span><span style={{fontFamily:"monospace",fontWeight:600,color:"#F8FAFC"}}>{fk(v)}</span><span style={{fontFamily:"monospace",fontWeight:700,color:p>=0?"#00E5A0":"#FF6B6B"}}>{p>=0?"+":""}{p.toFixed(1)}%</span><div style={{display:"flex",gap:3}}><button onClick={()=>{setSimT(st);setSimP(String(st.currentPrice));setSimQ("");}} style={{padding:"5px 8px",background:"rgba(56,189,248,0.15)",color:"#38BDF8",border:"none",borderRadius:5,cursor:"pointer",fontSize:11}}>🧮</button><button onClick={()=>startEdit(st)} style={{padding:"5px 8px",background:"rgba(56,189,248,0.15)",color:"#38BDF8",border:"none",borderRadius:5,cursor:"pointer",fontSize:11}}>수정</button><button onClick={()=>{setStocks(p=>p.filter(s=>s.id!==st.id));}} style={{padding:"5px 8px",background:"rgba(255,107,107,0.15)",color:"#FF6B6B",border:"none",borderRadius:5,cursor:"pointer",fontSize:11}}>삭제</button></div></div>;})}</div></div>);}

// Assets
function Assets({realEstate,setRealEstate,cars,setCars}){const[tab,setTab]=useState("re");const[editing,setEditing]=useState(null);const[form,setForm]=useState({});const rf=[{key:"name",label:"자산명*",type:"text",flex:2},{key:"type",label:"유형",type:"select",options:["아파트","빌라","오피스텔","상가","토지","기타"],flex:1},{key:"purchasePrice",label:"매입가*",type:"number",flex:1},{key:"currentValue",label:"시세*",type:"number",flex:1},{key:"loanBalance",label:"대출",type:"number",flex:1},{key:"monthlyPayment",label:"월상환",type:"number",flex:1},{key:"address",label:"주소",type:"text",flex:2},{key:"area",label:"㎡",type:"number",flex:1},{key:"memo",label:"메모",type:"text",flex:3}];const cf=[{key:"name",label:"차량명*",type:"text",flex:2},{key:"brand",label:"브랜드",type:"text",flex:1},{key:"purchasePrice",label:"구매가*",type:"number",flex:1},{key:"currentValue",label:"시세*",type:"number",flex:1},{key:"loanBalance",label:"대출",type:"number",flex:1},{key:"monthlyPayment",label:"월상환",type:"number",flex:1},{key:"mileage",label:"km",type:"number",flex:1},{key:"memo",label:"메모",type:"text",flex:3}];
const fs=tab==="re"?rf:cf,ls=tab==="re"?realEstate:cars,sl=tab==="re"?setRealEstate:setCars;const tv=ls.reduce((s,it)=>s+(it.currentValue||0),0),tl=ls.reduce((s,it)=>s+(it.loanBalance||0),0);
return(<div style={{display:"flex",flexDirection:"column",gap:16}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}><h2 style={{margin:0,fontSize:22,fontWeight:800,color:"#F8FAFC"}}>실물 자산</h2><button onClick={()=>{const d={};fs.forEach(f=>d[f.key]=f.type==="select"?f.options[0]:"");setForm(d);setEditing("new");}} style={BT(tab==="re"?"linear-gradient(135deg,#A78BFA,#818CF8)":"linear-gradient(135deg,#FFE66D,#F97316)",tab==="re"?"#FFF":"#0F172A")}>+ 추가</button></div>
<div style={{display:"flex",gap:4,background:"rgba(15,23,42,0.6)",borderRadius:12,padding:4}}>{[["re","🏠 부동산","#A78BFA"],["car","🚗 자동차","#FFE66D"]].map(([k,l,c])=><button key={k} onClick={()=>{setTab(k);setEditing(null);}} style={{flex:1,padding:10,border:"none",borderRadius:10,cursor:"pointer",background:tab===k?`${c}20`:"transparent",color:tab===k?c:"#64748B",fontWeight:tab===k?700:500,fontSize:13,fontFamily:"'Pretendard',sans-serif"}}>{l}</button>)}</div>
<div className="sp-grid2"><SB label="시세" value={fk(tv)+"원"} color={tab==="re"?"#A78BFA":"#FFE66D"} icon={tab==="re"?"🏠":"🚗"}/><SB label="순자산" value={fk(tv-tl)+"원"} color={tv-tl>=0?"#00E5A0":"#FF6B6B"} icon="💎"/></div>
{editing!==null&&<Card glow><div style={{display:"flex",gap:10,flexWrap:"wrap"}}>{fs.map(f=><div key={f.key} style={{flex:f.flex,minWidth:f.flex>2?200:110}}><label style={{fontSize:11,color:"#64748B",display:"block",marginBottom:4}}>{f.label}</label>{f.type==="select"?<select value={form[f.key]||""} onChange={e=>setForm({...form,[f.key]:e.target.value})} style={{...IS,appearance:"auto"}}>{f.options.map(o=><option key={o}>{o}</option>)}</select>:<input value={form[f.key]||""} onChange={e=>setForm({...form,[f.key]:e.target.value})} style={IS} type={f.type}/>}</div>)}</div><div style={{display:"flex",gap:8,marginTop:12,justifyContent:"flex-end"}}><button onClick={()=>setEditing(null)} style={BT("rgba(100,116,139,0.2)","#94A3B8")}>취소</button><button onClick={()=>{const d={};fs.forEach(f=>d[f.key]=f.type==="number"?(Number(form[f.key])||0):(form[f.key]||""));if(!d.name)return;if(editing==="new")sl(p=>[...p,{...d,id:Date.now()}]);else sl(p=>p.map(it=>it.id===editing?{...it,...d}:it));setEditing(null);}} style={BT(tab==="re"?"linear-gradient(135deg,#A78BFA,#818CF8)":"linear-gradient(135deg,#FFE66D,#F97316)",tab==="re"?"#FFF":"#0F172A")}>저장</button></div></Card>}
{ls.length===0?<Card style={{textAlign:"center",padding:40}}><div style={{fontSize:40}}>{tab==="re"?"🏠":"🚗"}</div><div style={{color:"#64748B"}}>자산 없음</div></Card>:<div style={{display:"flex",flexDirection:"column",gap:10}}>{ls.map(it=>{const g=(it.currentValue||0)-(it.purchasePrice||0),gr=it.purchasePrice?(g/it.purchasePrice*100):0;return<Card key={it.id} style={{padding:16}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:16,flexWrap:"wrap"}}><div style={{flex:1,minWidth:180}}><div style={{fontSize:15,fontWeight:800,color:"#F8FAFC"}}>{tab==="re"?"🏠":"🚗"} {it.name}</div><div style={{fontSize:11,color:"#64748B"}}>{tab==="re"?`${it.type||""}·${it.address||""}`:`${it.brand||""}·${it.mileage?it.mileage.toLocaleString()+"km":""}`}</div></div><div style={{display:"flex",gap:16}}>{[["시세",fk(it.currentValue),"#F8FAFC"],["순자산",fk((it.currentValue||0)-(it.loanBalance||0)),(it.currentValue||0)-(it.loanBalance||0)>=0?"#00E5A0":"#FF6B6B"],["차익",`${g>=0?"+":""}${gr.toFixed(1)}%`,g>=0?"#00E5A0":"#FF6B6B"]].map(([l,v,c])=><div key={l} style={{textAlign:"center"}}><div style={{fontSize:10,color:"#64748B"}}>{l}</div><div style={{fontSize:14,fontWeight:800,color:c,fontFamily:"monospace"}}>{v}</div></div>)}</div><div style={{display:"flex",gap:4}}><button onClick={()=>{const f2={};fs.forEach(fd=>f2[fd.key]=it[fd.key]!==undefined?String(it[fd.key]):"");setForm(f2);setEditing(it.id);}} style={{padding:"5px 12px",background:"rgba(56,189,248,0.15)",color:"#38BDF8",border:"none",borderRadius:6,cursor:"pointer",fontSize:11}}>수정</button><button onClick={()=>{sl(p=>p.filter(x=>x.id!==it.id));}} style={{padding:"5px 12px",background:"rgba(255,107,107,0.15)",color:"#FF6B6B",border:"none",borderRadius:6,cursor:"pointer",fontSize:11}}>삭제</button></div></div></Card>;})}</div>}</div>);}

// Expenses
function Expenses({expenses,setExpenses}){
const[sm,setSm]=useState(new Date().getMonth());
const[sa,setSa]=useState(false);
const[si,setSi]=useState(false);
const[addingCard,setAddingCard]=useState(false);
const[newCard,setNewCard]=useState({name:"",type:"credit",monthlyLimit:0});
const[editCard,setEditCard]=useState(null);
const[editForm,setEditForm]=useState({name:"",type:"credit",monthlyLimit:0});
const cards=expenses.cards||[];
const cats=cards.map(c=>c.name);
const cardMap={};cards.forEach(c=>cardMap[c.name]=c);
const[form,setForm]=useState({date:new Date().toISOString().slice(0,10),category:cats[0]||"",amount:"",desc:""});
const me=expenses.entries.filter(e=>new Date(e.date).getMonth()===sm);
const mt=me.reduce((s,e)=>s+e.amount,0);
const cardUsage={};cards.forEach(c=>{cardUsage[c.name]=me.filter(e=>e.category===c.name).reduce((s,e)=>s+e.amount,0);});
const ye=expenses.entries,inc=expenses.annualIncome,ms2=inc*0.25;
const crNames=cards.filter(c=>c.type==="credit").map(c=>c.name);
const dbNames=cards.filter(c=>c.type==="debit").map(c=>c.name);
const csNames=cards.filter(c=>c.type==="cash").map(c=>c.name);
const trNames=cards.filter(c=>c.type==="transfer").map(c=>c.name);
const crT=ye.filter(e=>crNames.includes(e.category)).reduce((s,e)=>s+e.amount,0);
const dbT=ye.filter(e=>dbNames.includes(e.category)).reduce((s,e)=>s+e.amount,0);
const csT=ye.filter(e=>csNames.includes(e.category)).reduce((s,e)=>s+e.amount,0);
const trT=ye.filter(e=>trNames.includes(e.category)).reduce((s,e)=>s+e.amount,0);
const ttS=crT+dbT+csT+trT;const ex=Math.max(ttS-ms2,0);
const crD=Math.min(crT>0?Math.min(crT,ex)*0.15:0,3e6);
const dbD=Math.min(dbT>0?Math.min(dbT,Math.max(ex-crT,0))*0.30:0,3e6);
const csD=Math.min(csT>0?Math.min(csT,Math.max(ex-crT-dbT,0))*0.30:0,3e6);
const tD=crD+dbD+csD;const eR=Math.round(tD*0.15);
const catD=cats.map(c=>({name:c,amount:me.filter(e=>e.category===c).reduce((s,e)=>s+e.amount,0)})).filter(c=>c.amount>0);
const addE=()=>{if(!form.amount||!form.date)return;setExpenses(p=>({...p,entries:[...p.entries,{id:Date.now(),date:form.date,category:form.category,amount:Number(form.amount),desc:form.desc}]}));setForm({...form,amount:"",desc:""});};
const typeLabel={credit:"신용카드",debit:"체크카드",transfer:"계좌이체",cash:"현금"};
const typeColor={credit:"#FB7185",debit:"#38BDF8",transfer:"#A78BFA",cash:"#00E5A0"};
const typeIcon={credit:"💳",debit:"💳",transfer:"🏦",cash:"💵"};
const doAddCard=()=>{if(!newCard.name.trim())return;setExpenses(p=>({...p,cards:[...p.cards,{id:Date.now(),name:newCard.name.trim(),type:newCard.type,mandatory:Number(newCard.monthlyLimit)>0,monthlyMin:Number(newCard.monthlyLimit)||0,monthlyLimit:Number(newCard.monthlyLimit)||0}]}));setNewCard({name:"",type:"credit",monthlyLimit:0});setAddingCard(false);};
const doSaveCard=(id)=>{const c=cards.find(x=>x.id===id);if(!c||!editForm.name.trim())return;const oldName=c.name;const nn=editForm.name.trim();setExpenses(p=>({...p,cards:p.cards.map(x=>x.id===id?{...x,name:nn,type:editForm.type,mandatory:Number(editForm.monthlyLimit)>0,monthlyMin:Number(editForm.monthlyLimit)||0,monthlyLimit:Number(editForm.monthlyLimit)||0}:x),entries:oldName!==nn?p.entries.map(e=>e.category===oldName?{...e,category:nn}:e):p.entries}));setEditCard(null);};
const doDeleteCard=(id)=>{setExpenses(p=>({...p,cards:p.cards.filter(x=>x.id!==id)}));};
return(<div style={{display:"flex",flexDirection:"column",gap:16}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}><div><h2 style={{margin:0,fontSize:22,fontWeight:800,color:"#F8FAFC"}}>💳 지출 관리</h2><p style={{margin:"4px 0 0",fontSize:13,color:"#64748B"}}>월별 지출 & 연말정산 최적화</p></div><div style={{display:"flex",gap:6}}><button onClick={()=>setSi(!si)} style={BT("rgba(100,116,139,0.2)","#94A3B8")}>⚙️ 소득</button><button onClick={()=>setSa(!sa)} style={BT("linear-gradient(135deg,#F97316,#FB7185)","#FFF")}>+ 지출</button></div></div>
<div style={{display:"flex",gap:3,background:"rgba(15,23,42,0.6)",borderRadius:10,padding:3,overflowX:"auto"}}>{MONTHS.map((m,i)=><button key={i} onClick={()=>setSm(i)} style={{padding:"10px 12px",border:"none",borderRadius:8,cursor:"pointer",background:sm===i?"linear-gradient(135deg,#F97316,#FB7185)":"transparent",color:sm===i?"#FFF":"#64748B",fontWeight:sm===i?700:400,fontSize:11,fontFamily:"'Pretendard',sans-serif",flex:1,minWidth:36}}>{m}</button>)}</div>
{si&&<Card><h3 style={{margin:"0 0 12px",fontSize:15,fontWeight:700,color:"#F8FAFC"}}>연소득 설정</h3><div style={{display:"flex",gap:12,alignItems:"flex-end"}}><div style={{flex:1}}><label style={{fontSize:12,color:"#64748B",display:"block",marginBottom:4}}>연간 총급여 (원)</label><input value={expenses.annualIncome} onChange={e=>setExpenses(p=>({...p,annualIncome:Number(e.target.value)||0}))} style={IS} type="number"/></div><button onClick={()=>setSi(false)} style={BT()}>확인</button></div></Card>}
<div className="sp-card-grid">
<Card><div style={{fontSize:12,color:"#64748B",marginBottom:6}}>{MONTHS[sm]} 총 지출</div><div style={{fontSize:18,fontWeight:800,color:"#F97316",fontFamily:"monospace"}}>{fk(mt)}원</div><div style={{fontSize:11,color:"#94A3B8",marginTop:4}}>{me.length}건</div></Card>
{cards.map(c=>{const used=cardUsage[c.name]||0;const lim=c.monthlyLimit||c.monthlyMin||0;const pct=lim>0?Math.min(used/lim*100,100):0;const over=lim>0&&used>lim;const tc3=typeColor[c.type]||"#94A3B8";
return editCard===c.id?<Card key={c.id} style={{gridColumn:"span 2",border:"1px solid rgba(56,189,248,0.3)",background:"rgba(56,189,248,0.03)"}}>
<div style={{display:"flex",flexDirection:"column",gap:8}}>
<div style={{display:"flex",gap:6}}><input autoFocus value={editForm.name} onChange={e=>setEditForm(p=>({...p,name:e.target.value}))} onKeyDown={e=>{if(e.key==="Enter")doSaveCard(c.id);if(e.key==="Escape")setEditCard(null);}} style={{...IS,flex:1,padding:"6px 10px",fontSize:12}} placeholder="카드명"/>
<select value={editForm.type} onChange={e=>setEditForm(p=>({...p,type:e.target.value}))} style={{...IS,width:95,padding:"6px 8px",fontSize:11,appearance:"auto"}}><option value="credit">신용카드</option><option value="debit">체크카드</option><option value="transfer">계좌이체</option><option value="cash">현금</option></select></div>
<div><label style={{fontSize:11,color:"#64748B"}}>월 사용한도 (0=무제한)</label><input value={editForm.monthlyLimit} onChange={e=>setEditForm(p=>({...p,monthlyLimit:e.target.value}))} style={{...IS,padding:"6px 10px",fontSize:12}} type="number" placeholder="0"/></div>
<div style={{display:"flex",gap:6,justifyContent:"flex-end"}}><button onClick={()=>doDeleteCard(c.id)} style={{padding:"5px 10px",background:"rgba(255,107,107,0.15)",color:"#FF6B6B",border:"none",borderRadius:6,cursor:"pointer",fontSize:11}}>삭제</button><button onClick={()=>setEditCard(null)} style={{padding:"5px 10px",background:"rgba(100,116,139,0.15)",color:"#94A3B8",border:"none",borderRadius:6,cursor:"pointer",fontSize:11}}>취소</button><button onClick={()=>doSaveCard(c.id)} style={{padding:"5px 12px",background:"rgba(0,229,160,0.15)",color:"#00E5A0",border:"none",borderRadius:6,cursor:"pointer",fontSize:11,fontWeight:700}}>저장</button></div>
</div></Card>
:<Card key={c.id} style={{cursor:"pointer",transition:"border 0.2s",border:"1px solid rgba(255,255,255,0.04)"}} onClick={()=>{setEditCard(c.id);setEditForm({name:c.name,type:c.type,monthlyLimit:c.monthlyLimit||c.monthlyMin||0});}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
<div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:14}}>{typeIcon[c.type]}</span><span style={{fontSize:13,fontWeight:700,color:"#F8FAFC"}}>{c.name}</span></div>
<span style={{fontSize:9,padding:"2px 6px",borderRadius:4,background:`${tc3}18`,color:tc3,fontWeight:600}}>{typeLabel[c.type]}</span>
</div>
{lim>0?<><div style={{height:5,background:"rgba(255,255,255,0.06)",borderRadius:3,overflow:"hidden",marginBottom:4}}><div style={{height:"100%",width:`${pct}%`,background:over?"#FF6B6B":used>=lim?"#00E5A0":tc3,borderRadius:3,transition:"width 0.3s"}}/></div>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}><span style={{fontSize:13,fontWeight:700,color:over?"#FF6B6B":used>=lim?"#00E5A0":"#F8FAFC",fontFamily:"monospace"}}>{fk(used)}</span><span style={{fontSize:10,color:"#64748B"}}>/ {fk(lim)} {over?"🚨":used>=lim?"✅":""}</span></div></>
:<><div style={{fontSize:15,fontWeight:800,color:"#F8FAFC",fontFamily:"monospace"}}>{fk(used)}원</div><div style={{fontSize:10,color:"#475569",marginTop:2}}>한도 미설정</div></>}
</Card>;})}
{addingCard?<Card style={{gridColumn:"span 2",border:"1px solid rgba(167,139,250,0.3)",background:"rgba(167,139,250,0.03)"}}>
<div style={{display:"flex",flexDirection:"column",gap:8}}>
<div style={{display:"flex",gap:6}}><input autoFocus value={newCard.name} onChange={e=>setNewCard(p=>({...p,name:e.target.value}))} onKeyDown={e=>{if(e.key==="Enter")doAddCard();if(e.key==="Escape")setAddingCard(false);}} style={{...IS,flex:1,padding:"6px 10px",fontSize:12}} placeholder="카드/계좌 이름"/>
<select value={newCard.type} onChange={e=>setNewCard(p=>({...p,type:e.target.value}))} style={{...IS,width:95,padding:"6px 8px",fontSize:11,appearance:"auto"}}><option value="credit">신용카드</option><option value="debit">체크카드</option><option value="transfer">계좌이체</option><option value="cash">현금</option></select></div>
<div><label style={{fontSize:11,color:"#64748B"}}>월 사용한도 (0=무제한)</label><input value={newCard.monthlyLimit} onChange={e=>setNewCard(p=>({...p,monthlyLimit:e.target.value}))} style={{...IS,padding:"6px 10px",fontSize:12}} type="number" placeholder="300000"/></div>
<div style={{display:"flex",gap:6,justifyContent:"flex-end"}}><button onClick={()=>setAddingCard(false)} style={{padding:"5px 10px",background:"rgba(100,116,139,0.15)",color:"#94A3B8",border:"none",borderRadius:6,cursor:"pointer",fontSize:11}}>취소</button><button onClick={doAddCard} style={{padding:"5px 14px",background:"linear-gradient(135deg,#A78BFA,#818CF8)",color:"#FFF",border:"none",borderRadius:6,cursor:"pointer",fontSize:11,fontWeight:700}}>추가</button></div>
</div></Card>
:<div onClick={()=>setAddingCard(true)} style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"16px 14px",background:"rgba(255,255,255,0.02)",border:"2px dashed rgba(255,255,255,0.1)",borderRadius:14,cursor:"pointer",transition:"all 0.2s",gap:6}}><div style={{width:32,height:32,borderRadius:"50%",background:"rgba(167,139,250,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:"#A78BFA"}}>+</div><span style={{fontSize:10,color:"#64748B",whiteSpace:"nowrap"}}>카드/계좌</span></div>}
</div>
<Card style={{background:"linear-gradient(135deg,rgba(249,115,22,0.04),rgba(251,113,133,0.04))",border:"1px solid rgba(249,115,22,0.15)"}}><h3 style={{margin:"0 0 14px",fontSize:15,fontWeight:700,color:"#F97316"}}>🧾 연말정산 예측</h3>
<div className="sp-expense-grid4" style={{marginBottom:12}}>{[["연소득",fk(inc),"#F8FAFC"],["최저사용(25%)",fk(ms2),"#94A3B8"],["총지출",fk(ttS),ttS>=ms2?"#00E5A0":"#FF6B6B"],["초과분",fk(ex),"#38BDF8"]].map(([l,v,c])=><div key={l} style={{background:"rgba(15,23,42,0.4)",borderRadius:8,padding:"8px 12px"}}><div style={{fontSize:10,color:"#64748B"}}>{l}</div><div style={{fontSize:14,fontWeight:700,color:c,fontFamily:"monospace"}}>{v}원</div></div>)}</div>
<div className="sp-expense-grid3" style={{marginBottom:12}}>{[["신용카드(15%)",fk(crT),fk(Math.round(crD)),"#FB7185"],["체크카드(30%)",fk(dbT),fk(Math.round(dbD)),"#38BDF8"],["현금(30%)",fk(csT),fk(Math.round(csD)),"#00E5A0"]].map(([l,u,d,c])=><div key={l} style={{background:"rgba(15,23,42,0.4)",borderRadius:8,padding:"8px 12px"}}><div style={{fontSize:10,color:"#64748B"}}>{l}</div><div style={{fontSize:12,fontWeight:600,color:c,fontFamily:"monospace"}}>사용{u}원</div><div style={{fontSize:11,color:"#94A3B8"}}>공제{d}원</div></div>)}</div>
<div style={{background:"rgba(249,115,22,0.08)",borderRadius:10,padding:"12px 16px",display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8}}><div><div style={{fontSize:12,color:"#94A3B8"}}>총 소득공제</div><div style={{fontSize:16,fontWeight:800,color:"#F97316",fontFamily:"monospace"}}>{fk(Math.round(tD))}원</div></div><div style={{textAlign:"right"}}><div style={{fontSize:12,color:"#94A3B8"}}>예상 환급(세율15%)</div><div style={{fontSize:16,fontWeight:800,color:"#00E5A0",fontFamily:"monospace"}}>{fk(eR)}원</div></div></div>
<div style={{marginTop:8,fontSize:11,color:"#64748B"}}>💡 최저사용({fk(ms2)}) 초과분부터 공제 적용. 체크카드/현금(30%)이 신용카드(15%)보다 공제율 2배!</div></Card>
{catD.length>0&&<Card><h3 style={{margin:"0 0 12px",fontSize:15,fontWeight:700,color:"#F8FAFC"}}>{MONTHS[sm]} 카테고리</h3><ResponsiveContainer width="100%" height={Math.max(catD.length*32,100)}><BarChart data={catD} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/><XAxis type="number" tickFormatter={fk} tick={{fontSize:11,fill:"#64748B"}} axisLine={false}/><YAxis type="category" dataKey="name" tick={{fontSize:11,fill:"#94A3B8"}} width={85} axisLine={false}/><Tooltip formatter={v=>ff(v)+"원"} contentStyle={{background:"#1E293B",border:"1px solid #334155",borderRadius:8,fontSize:12,color:"#F8FAFC"}}/><Bar dataKey="amount" fill="#F97316" radius={[0,4,4,0]}/></BarChart></ResponsiveContainer></Card>}
{sa&&<Card glow style={{border:"1px solid rgba(249,115,22,0.3)"}}><div style={{display:"flex",gap:10,flexWrap:"wrap"}}><div style={{flex:1,minWidth:110}}><label style={{fontSize:11,color:"#64748B"}}>날짜*</label><input value={form.date} onChange={e=>setForm({...form,date:e.target.value})} style={IS} type="date"/></div><div style={{flex:1,minWidth:110}}><label style={{fontSize:11,color:"#64748B"}}>결제수단</label><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} style={{...IS,appearance:"auto"}}>{cats.map(c=><option key={c}>{c}</option>)}</select></div><div style={{flex:1,minWidth:110}}><label style={{fontSize:11,color:"#64748B"}}>금액*</label><input value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} style={IS} type="number"/></div><div style={{flex:2,minWidth:150}}><label style={{fontSize:11,color:"#64748B"}}>내용</label><input value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} style={IS} placeholder="사용처"/></div><div style={{display:"flex",alignItems:"flex-end"}}><button onClick={addE} style={BT("linear-gradient(135deg,#F97316,#FB7185)","#FFF")}>추가</button></div></div></Card>}
<div><div style={{fontSize:13,fontWeight:700,color:"#F8FAFC",marginBottom:6}}>{MONTHS[sm]} 내역</div>{me.length===0?<div style={{textAlign:"center",color:"#475569",padding:16,fontSize:13}}>지출 내역 없음</div>:me.sort((a,b)=>new Date(b.date)-new Date(a.date)).map(e=>{const cm=cardMap[e.category];const tc3=cm?typeColor[cm.type]:"#F97316";return<div key={e.id} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",background:"rgba(30,41,59,0.5)",borderRadius:8,marginBottom:4,border:"1px solid rgba(255,255,255,0.04)"}}><span style={{fontSize:11,color:"#64748B",fontFamily:"monospace",width:50}}>{e.date.slice(5)}</span><span style={{fontSize:11,padding:"2px 8px",borderRadius:4,background:`${tc3}15`,color:tc3,fontWeight:600}}>{e.category}</span><span style={{flex:1,fontSize:12,color:"#CBD5E1"}}>{e.desc||"—"}</span><span style={{fontSize:13,fontWeight:700,color:"#F8FAFC",fontFamily:"monospace"}}>{ff(e.amount)}원</span><button onClick={()=>setExpenses(p=>({...p,entries:p.entries.filter(x=>x.id!==e.id)}))} style={{background:"none",border:"none",color:"#475569",cursor:"pointer",fontSize:14}}>✕</button></div>})}</div></div>);}

// Analysis
function Analysis({stocks}){const[sel,setSel]=useState(null);const ss={};stocks.forEach(st=>{if(!ss[st.sector])ss[st.sector]={t:0,i:0,stocks:[]};ss[st.sector].t+=st.currentPrice*st.quantity;ss[st.sector].i+=st.avgPrice*st.quantity;ss[st.sector].stocks.push(st);});const bd=Object.entries(ss).map(([n,d])=>({name:n,평가:d.t,투자:d.i,수익률:d.i>0?((d.t-d.i)/d.i*100):0})).sort((a,b)=>b.평가-a.평가);
return(<div style={{display:"flex",flexDirection:"column",gap:16}}><h2 style={{margin:0,fontSize:22,fontWeight:800,color:"#F8FAFC"}}>섹터 분석</h2><Card glow><ResponsiveContainer width="100%" height={200}><BarChart data={bd} onClick={e=>e?.activeLabel&&setSel(e.activeLabel)}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/><XAxis dataKey="name" tick={{fontSize:11,fill:"#94A3B8"}} axisLine={false}/><YAxis tickFormatter={fk} tick={{fontSize:11,fill:"#64748B"}} axisLine={false}/><Tooltip formatter={(v,n)=>n==="수익률"?v.toFixed(2)+"%":fk(v)+"원"} contentStyle={{background:"#1E293B",border:"1px solid #334155",borderRadius:8,fontSize:12,color:"#F8FAFC"}}/><Bar dataKey="투자" fill="#475569" radius={[4,4,0,0]}/><Bar dataKey="평가" fill="#00E5A0" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></Card>
<div className="sp-grid4">{bd.map((d,i)=><Card key={d.name} style={{cursor:"pointer",border:sel===d.name?"1px solid #00E5A0":undefined}} onClick={()=>setSel(d.name)}><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}><div style={{width:8,height:8,borderRadius:"50%",background:COLORS[i%COLORS.length]}}/><span style={{fontSize:13,fontWeight:700,color:"#F8FAFC"}}>{d.name}</span></div><div style={{fontSize:12,display:"flex",justifyContent:"space-between"}}><span style={{color:"#64748B"}}>수익률</span><span style={{fontWeight:700,fontFamily:"monospace",color:d.수익률>=0?"#00E5A0":"#FF6B6B"}}>{d.수익률>=0?"+":""}{d.수익률.toFixed(1)}%</span></div></Card>)}</div>
{sel&&ss[sel]&&<Card><h3 style={{margin:"0 0 12px",fontSize:17,fontWeight:700,color:"#F8FAFC"}}>{sel} 상세</h3>{ss[sel].stocks.map(st=>{const p=((st.currentPrice-st.avgPrice)/st.avgPrice*100);return<div key={st.id} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.05)"}}><div><div style={{fontWeight:700,color:"#F8FAFC",fontSize:13}}>{st.name}</div><div style={{fontSize:11,color:"#64748B"}}>{ff(st.avgPrice)}원·{st.quantity}주</div></div><div style={{textAlign:"right"}}><div style={{fontWeight:600,fontFamily:"monospace",color:"#F8FAFC"}}>{fk(st.currentPrice*st.quantity)}</div><div style={{fontSize:11,fontWeight:700,fontFamily:"monospace",color:p>=0?"#00E5A0":"#FF6B6B"}}>{p>=0?"+":""}{p.toFixed(2)}%</div></div></div>;})}</Card>}</div>);}

// Chatbot
function Chatbot({stocks,cash,seed,realEstate,cars,expenses}){const[msgs,setMsgs]=useState([{role:"assistant",content:"포트폴리오 AI 전략가입니다.\n주식·부동산·지출 기반 전략 제안.\n\n예시: \"물타기 전략?\", \"리밸런싱?\", \"연말정산 최적화?\""}]);const[inp,setInp]=useState("");const[loading,setLoading]=useState(false);const ref=useRef(null);useEffect(()=>{ref.current?.scrollIntoView({behavior:"smooth"});},[msgs]);
const ctx=()=>{let c=`씨드:${ff(seed)},현금:${ff(cash)}\n`;stocks.forEach(st=>c+=`${st.name}(${st.sector}):평단${ff(st.avgPrice)},현재${ff(st.currentPrice)},${st.quantity}주\n`);realEstate.forEach(r=>c+=`[부동산]${r.name}:시세${ff(r.currentValue)},대출${ff(r.loanBalance)}\n`);c+=`연소득:${ff(expenses.annualIncome)}\n`;return c;};
const send=async()=>{if(!inp.trim()||loading)return;const um=inp.trim();setInp("");setMsgs(p=>[...p,{role:"user",content:um}]);setLoading(true);try{const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:`한국 주식/자산 전문 전략가. 한국어 답변. 구체적 수치. 연말정산/대출/리밸런싱 종합 자문. 투자 최종 판단은 사용자 책임.\n\n${ctx()}`,messages:msgs.filter((m,i)=>!(m.role==="assistant"&&i===0)).concat([{role:"user",content:um}]).map(m=>({role:m.role,content:m.content}))})});const d=await r.json();setMsgs(p=>[...p,{role:"assistant",content:d.content?.map(c2=>c2.text||"").join("")||"응답 실패"}]);}catch{setMsgs(p=>[...p,{role:"assistant",content:"⚠️ 연결 실패"}]);}setLoading(false);};
return(<div style={{display:"flex",flexDirection:"column",gap:14,height:"calc(100vh - 200px)",minHeight:500}}><h2 style={{margin:0,fontSize:22,fontWeight:800,color:"#F8FAFC"}}>AI 전략</h2><Card style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",padding:0}}><div style={{flex:1,overflow:"auto",padding:16,display:"flex",flexDirection:"column",gap:10}}>{msgs.map((m,i)=><div key={i} style={{alignSelf:m.role==="user"?"flex-end":"flex-start",maxWidth:"85%",padding:"10px 14px",borderRadius:14,background:m.role==="user"?"linear-gradient(135deg,#00E5A0,#00B8D4)":"rgba(15,23,42,0.8)",color:m.role==="user"?"#0F172A":"#E2E8F0",fontSize:13,lineHeight:1.7,whiteSpace:"pre-wrap",fontWeight:m.role==="user"?600:400}}>{m.content}</div>)}{loading&&<div style={{alignSelf:"flex-start",padding:"10px 18px",borderRadius:14,background:"rgba(15,23,42,0.8)",color:"#64748B",fontSize:13}}><span style={{animation:"pulse 1.5s infinite"}}>분석 중...</span></div>}<div ref={ref}/></div><div style={{display:"flex",gap:8,padding:14,borderTop:"1px solid rgba(255,255,255,0.06)",background:"rgba(15,23,42,0.5)"}}><input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="질문 입력..." style={{flex:1,padding:"10px 14px",background:"rgba(30,41,59,0.8)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,color:"#F8FAFC",fontSize:14,outline:"none",fontFamily:"'Pretendard',sans-serif"}}/><button onClick={send} disabled={loading} style={{padding:"10px 20px",background:loading?"#475569":"linear-gradient(135deg,#00E5A0,#00B8D4)",color:"#0F172A",border:"none",borderRadius:10,fontWeight:700,cursor:loading?"not-allowed":"pointer"}}>전송</button></div></Card></div>);}

// Insight
function Insight({events,setEvents}){const[sa,setSa]=useState(false);const[f,setF]=useState({year:"2026",title:"",desc:"",type:"memo"});const tc2={crisis:{color:"#FF6B6B",bg:"rgba(255,107,107,0.1)",icon:"🔴"},correction:{color:"#FFE66D",bg:"rgba(255,230,109,0.1)",icon:"🟡"},predicted:{color:"#A78BFA",bg:"rgba(167,139,250,0.1)",icon:"🔮"},memo:{color:"#38BDF8",bg:"rgba(56,189,248,0.1)",icon:"📝"},opportunity:{color:"#00E5A0",bg:"rgba(0,229,160,0.1)",icon:"🟢"}};const cy=new Date().getFullYear();
return(<div style={{display:"flex",flexDirection:"column",gap:16}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><h2 style={{margin:0,fontSize:22,fontWeight:800,color:"#F8FAFC"}}>인사이트 타임라인</h2><button onClick={()=>setSa(!sa)} style={BT("linear-gradient(135deg,#A78BFA,#818CF8)","#FFF")}>+ 기록</button></div>
<Card style={{background:"rgba(167,139,250,0.05)",border:"1px solid rgba(167,139,250,0.15)"}}><div style={{display:"flex",alignItems:"center",gap:12}}><span style={{fontSize:28}}>🔮</span><div><div style={{fontWeight:700,color:"#A78BFA",fontSize:14}}>~12년 주기 리스크</div><div style={{fontSize:12,color:"#94A3B8"}}>1997→2008→2020→<span style={{color:"#A78BFA",fontWeight:700}}>2028?→2032?</span></div></div></div></Card>
{sa&&<Card glow><div style={{display:"flex",gap:10,flexWrap:"wrap"}}><div style={{flex:1,minWidth:80}}><label style={{fontSize:11,color:"#64748B"}}>연도</label><input value={f.year} onChange={e=>setF({...f,year:e.target.value})} style={IS} type="number"/></div><div style={{flex:3,minWidth:150}}><label style={{fontSize:11,color:"#64748B"}}>제목</label><input value={f.title} onChange={e=>setF({...f,title:e.target.value})} style={IS}/></div><div style={{flex:1,minWidth:90}}><label style={{fontSize:11,color:"#64748B"}}>유형</label><select value={f.type} onChange={e=>setF({...f,type:e.target.value})} style={{...IS,appearance:"auto"}}><option value="crisis">🔴위기</option><option value="correction">🟡조정</option><option value="predicted">🔮예측</option><option value="opportunity">🟢기회</option><option value="memo">📝메모</option></select></div></div><div style={{marginTop:10}}><label style={{fontSize:11,color:"#64748B"}}>설명</label><input value={f.desc} onChange={e=>setF({...f,desc:e.target.value})} style={IS}/></div><div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:12}}><button onClick={()=>setSa(false)} style={BT("rgba(100,116,139,0.2)","#94A3B8")}>취소</button><button onClick={()=>{if(!f.title)return;setEvents(p=>[...p,{...f,year:Number(f.year)}].sort((a,b)=>a.year-b.year));setSa(false);setF({year:"2026",title:"",desc:"",type:"memo"});}} style={BT("linear-gradient(135deg,#A78BFA,#818CF8)","#FFF")}>추가</button></div></Card>}
<div style={{position:"relative",paddingLeft:40}}><div style={{position:"absolute",left:15,top:0,bottom:0,width:2,background:"linear-gradient(to bottom,#00E5A0,#A78BFA,#FF6B6B)",borderRadius:2}}/>{events.map((ev,i)=>{const c=tc2[ev.type]||tc2.memo,fut=ev.year>cy;return<div key={i} style={{position:"relative",marginBottom:14,opacity:fut?0.6:1}}><div style={{position:"absolute",left:-33,top:14,width:12,height:12,borderRadius:"50%",background:c.color,border:"3px solid #0F172A",zIndex:1,boxShadow:`0 0 12px ${c.color}40`}}/><Card style={{background:c.bg,border:`1px solid ${c.color}20`,padding:16}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:20}}>{c.icon}</span><div><div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}><span style={{fontSize:12,fontWeight:800,color:c.color,fontFamily:"monospace",background:`${c.color}15`,padding:"2px 6px",borderRadius:5}}>{ev.year}</span><span style={{fontSize:17,fontWeight:700,color:"#F8FAFC"}}>{ev.title}</span>{fut&&<span style={{fontSize:10,padding:"2px 6px",background:"rgba(167,139,250,0.2)",color:"#A78BFA",borderRadius:8,fontWeight:600}}>미래</span>}</div><div style={{fontSize:12,color:"#94A3B8",marginTop:3,lineHeight:1.5}}>{ev.desc}</div></div></div>{(ev.type==="memo"||ev.type==="opportunity")&&<button onClick={()=>setEvents(p=>p.filter((_,j)=>j!==i))} style={{background:"rgba(255,107,107,0.15)",color:"#FF6B6B",border:"none",borderRadius:5,padding:"3px 8px",fontSize:10,cursor:"pointer"}}>삭제</button>}</div></Card></div>;})}</div></div>);}

// Market
const MKT_SYMBOLS=[
{key:"GC=F",name:"금(Gold)",unit:"$/oz",icon:"🥇",color:"#FFE66D",cat:"원자재",tz:"America/New_York",open:18,close:17,openM:0,closeM:0,almost24:true},
{key:"SI=F",name:"은(Silver)",unit:"$/oz",icon:"🥈",color:"#C0C0C0",cat:"원자재",tz:"America/New_York",open:18,close:17,openM:0,closeM:0,almost24:true},
{key:"CL=F",name:"WTI 유가",unit:"$/bbl",icon:"🛢️",color:"#F97316",cat:"원자재",tz:"America/New_York",open:18,close:17,openM:0,closeM:0,almost24:true},
{key:"^GSPC",name:"S&P 500",unit:"pt",icon:"🇺🇸",color:"#00E5A0",cat:"해외지수",tz:"America/New_York",open:9,close:16,openM:30,closeM:0},
{key:"^IXIC",name:"NASDAQ",unit:"pt",icon:"🇺🇸",color:"#38BDF8",cat:"해외지수",tz:"America/New_York",open:9,close:16,openM:30,closeM:0},
{key:"^KS11",name:"KOSPI",unit:"pt",icon:"🇰🇷",color:"#FF6B6B",cat:"국내지수",tz:"Asia/Seoul",open:9,close:15,openM:0,closeM:30},
{key:"^KQ11",name:"KOSDAQ",unit:"pt",icon:"🇰🇷",color:"#A78BFA",cat:"국내지수",tz:"Asia/Seoul",open:9,close:15,openM:0,closeM:30},
{key:"USDKRW=X",name:"환율(USD/KRW)",unit:"원",icon:"💱",color:"#34D399",cat:"환율",tz:"fx",open:0,close:0},
{key:"KRW-BTC",name:"비트코인(BTC)",unit:"원",icon:"₿",color:"#F7931A",cat:"코인",tz:"crypto",src:"upbit"},
{key:"KRW-ETH",name:"이더리움(ETH)",unit:"원",icon:"⟠",color:"#627EEA",cat:"코인",tz:"crypto",src:"upbit"},
{key:"KRW-XRP",name:"리플(XRP)",unit:"원",icon:"✕",color:"#00AAE4",cat:"코인",tz:"crypto",src:"upbit"},
{key:"KRW-USDT",name:"테더(USDT)",unit:"원",icon:"₮",color:"#26A17B",cat:"코인",tz:"crypto",src:"upbit"},
{key:"KRW-SC",name:"시아(SC)",unit:"원",icon:"◆",color:"#20EE82",cat:"코인",tz:"crypto",src:"upbit"},
{key:"KRW-XEC",name:"이캐시(XEC)",unit:"원",icon:"ℯ",color:"#0074C2",cat:"코인",tz:"crypto",src:"upbit"},
{key:"KRW-SOL",name:"솔라나(SOL)",unit:"원",icon:"◎",color:"#9945FF",cat:"코인",tz:"crypto",src:"upbit"},
{key:"KRW-AMO",name:"아모(AMO)",unit:"원",icon:"Ⓐ",color:"#FF4D94",cat:"코인",tz:"crypto",src:"upbit"},
{key:"KRW-GRND",name:"슈퍼워크(GRND)",unit:"원",icon:"👟",color:"#6EE7B7",cat:"코인",tz:"crypto",src:"upbit"},
];
function getMarketStatus(sym){
const now=new Date();
if(sym.tz==="crypto")return{status:"open",label:"24/7 거래",color:"#00E5A0"};
if(sym.tz==="fx"){const d=now.getUTCDay();if(d===0||(d===6&&now.getUTCHours()>=22))return{status:"closed",label:"주말 휴장",color:"#64748B"};return{status:"open",label:"24시간 거래",color:"#00E5A0"};}
const tStr=now.toLocaleString("en-US",{timeZone:sym.tz,hour12:false,hour:"2-digit",minute:"2-digit",weekday:"short"});
const parts=tStr.split(", ");const wd=parts[0];const[hh,mm]=(parts[1]||tStr).split(":").map(Number);
if(["Sat","Sun"].includes(wd))return{status:"closed",label:"주말 휴장",color:"#64748B"};
const nowMin=hh*60+mm;
const openMin=sym.open*60+(sym.openM||0);
const closeMin=sym.close*60+(sym.closeM||0);
if(sym.almost24){const breakStart=sym.close*60;const breakEnd=sym.open*60;if(nowMin>=breakStart&&nowMin<breakEnd)return{status:"closed",label:`휴장 (${sym.open}:${String(sym.openM||0).padStart(2,"0")} 개장)`,color:"#64748B"};const toBreak=breakStart-nowMin;if(toBreak>0&&toBreak<=30)return{status:"closing",label:`${toBreak}분 후 휴장`,color:"#FFE66D"};return{status:"open",label:"거래중",color:"#00E5A0"};}
if(nowMin>=openMin&&nowMin<closeMin){const toClose=closeMin-nowMin;if(toClose<=30)return{status:"closing",label:`${toClose}분 후 장마감`,color:"#FFE66D"};return{status:"open",label:"장중",color:"#00E5A0"};}
if(nowMin<openMin){const toOpen=openMin-nowMin;if(toOpen<=60)return{status:"pre",label:`${toOpen}분 후 개장`,color:"#38BDF8"};return{status:"closed",label:`장전 (${sym.open}:${String(sym.openM||0).padStart(2,"0")} 개장)`,color:"#64748B"};}
return{status:"closed",label:`장마감 (${sym.open}:${String(sym.openM||0).padStart(2,"0")} 개장)`,color:"#64748B"};}
const MKT_CACHE_KEY="stockpilot-market";
function Market(){
const[data,setData]=useState({});
const[loading,setLoading]=useState(false);
const[error,setError]=useState("");
const[lastUpdate,setLastUpdate]=useState(data._ts||null);
const fetchAll=async()=>{
setLoading(true);setError("");
const results={};let ok=0,fail=0;
const yahooSyms=MKT_SYMBOLS.filter(s=>s.src!=="upbit");
const upbitSyms=MKT_SYMBOLS.filter(s=>s.src==="upbit");
for(const sym of yahooSyms){
try{
const r=await fetch(`/api/yahoo/v8/finance/chart/${encodeURIComponent(sym.key)}?range=1mo&interval=1d`);
if(!r.ok)throw new Error(r.status);
const j=await r.json();
const res=j?.chart?.result?.[0];
if(!res)throw new Error("no data");
const meta=res.meta||{};
const closes=res.indicators?.quote?.[0]?.close||[];
const timestamps=res.timestamp||[];
const price=meta.regularMarketPrice||closes[closes.length-1]||0;
const prevClose=meta.chartPreviousClose||meta.previousClose||closes[closes.length-2]||price;
const change=price-prevClose;
const changePct=prevClose>0?(change/prevClose*100):0;
const history=timestamps.map((t,i)=>({date:new Date(t*1000).toLocaleDateString("ko-KR",{month:"numeric",day:"numeric"}),close:closes[i]})).filter(h=>h.close!=null);
results[sym.key]={price,change,changePct,prevClose,history,currency:meta.currency||""};
ok++;
}catch(e){fail++;results[sym.key]=data[sym.key]||{price:0,change:0,changePct:0,history:[],error:true};}}
if(upbitSyms.length>0){
try{
const mkts=upbitSyms.map(s=>s.key).join(",");
const r=await fetch(`/api/upbit/v1/ticker?markets=${mkts}`);
if(!r.ok)throw new Error(r.status);
const tickers=await r.json();
const tickerMap={};tickers.forEach(t=>tickerMap[t.market]=t);
for(const sym of upbitSyms){
const t=tickerMap[sym.key];
if(!t){fail++;results[sym.key]=data[sym.key]||{price:0,change:0,changePct:0,history:[],error:true};continue;}
results[sym.key]={price:t.trade_price,change:t.signed_change_price,changePct:t.signed_change_rate*100,prevClose:t.prev_closing_price,high24:t.high_price,low24:t.low_price,volume24:t.acc_trade_volume_24h,history:[]};ok++;}
for(const sym of upbitSyms){
try{
const cr=await fetch(`/api/upbit/v1/candles/days?market=${sym.key}&count=20`);
if(!cr.ok)continue;
const candles=await cr.json();
if(Array.isArray(candles)){
const hist=candles.reverse().map(c=>({date:c.candle_date_time_kst?.slice(5,10).replace("-","/"),close:c.trade_price}));
if(results[sym.key])results[sym.key].history=hist;}}catch{}}
}catch(e){upbitSyms.forEach(sym=>{fail++;results[sym.key]=data[sym.key]||{price:0,change:0,changePct:0,history:[],error:true};});}}
const ts=Date.now();
results._ts=ts;
setData(results);setLastUpdate(ts);
/* localStorage disabled in artifact */
setLoading(false);
if(fail>0&&ok===0)setError("시세 조회 실패 — Vite 프록시 설정을 확인하세요");
else if(fail>0)setError(`${ok}개 성공, ${fail}개 실패`);
};
const[countdown,setCountdown]=useState(30);
const[clock,setClock]=useState(Date.now());
const cdRef=useRef(30);
useEffect(()=>{fetchAll();const iv=setInterval(()=>{fetchAll();cdRef.current=30;setCountdown(30);},30000);const tick=setInterval(()=>{cdRef.current=Math.max(cdRef.current-1,0);setCountdown(cdRef.current);setClock(Date.now());},1000);return()=>{clearInterval(iv);clearInterval(tick);};},[]);
const cats=["원자재","해외지수","국내지수","환율","코인"];
const fmtPrice=(v,sym)=>{if(!v)return"—";if(sym.unit==="원")return ff(Math.round(v))+"원";if(sym.unit==="$"&&v<0.01)return"$"+v.toFixed(6);if(sym.unit==="$"&&v<1)return"$"+v.toFixed(4);if(v>=1000)return v.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});return v.toFixed(2);};
return(<div style={{display:"flex",flexDirection:"column",gap:16}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
<div><h2 style={{margin:0,fontSize:22,fontWeight:800,color:"#F8FAFC"}}>📈 글로벌 시세</h2><p style={{margin:"4px 0 0",fontSize:12,color:"#64748B",display:"flex",alignItems:"center",gap:8}}>{lastUpdate?`${new Date(lastUpdate).toLocaleString("ko-KR")}`:"데이터 없음"}<span style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:11,color:loading?"#FFE66D":"#00E5A0",fontWeight:600}}><span style={{width:6,height:6,borderRadius:"50%",background:loading?"#FFE66D":"#00E5A0",animation:"pulse 1.5s infinite"}}/>{loading?"조회 중":countdown+"초 후 갱신"}</span></p></div>
<button onClick={()=>{fetchAll();cdRef.current=30;setCountdown(30);}} disabled={loading} style={{...BT(),opacity:loading?0.5:1}}>{loading?"⏳ 조회 중...":"🔄 새로고침"}</button>
</div>
{error&&<div style={{padding:"8px 14px",background:"rgba(255,107,107,0.1)",border:"1px solid rgba(255,107,107,0.2)",borderRadius:8,fontSize:12,color:"#FF6B6B"}}>{error}</div>}
{cats.map(cat=>{const items=MKT_SYMBOLS.filter(s=>s.cat===cat);
const catTz=items[0]?.tz;const tzLabel=catTz==="Asia/Seoul"?"KST":catTz==="America/New_York"?"ET":catTz==="crypto"?"UTC":catTz==="fx"?"FX":"";
const catTime=catTz&&catTz!=="fx"&&catTz!=="crypto"?new Date().toLocaleTimeString("ko-KR",{timeZone:catTz,hour:"2-digit",minute:"2-digit",hour12:false}):catTz==="crypto"?new Date().toLocaleTimeString("ko-KR",{timeZone:"UTC",hour:"2-digit",minute:"2-digit",hour12:false}):"";
const anyOpen=items.some(s=>getMarketStatus(s).status==="open");
return<div key={cat}>
<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
<div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:14,fontWeight:700,color:"#94A3B8"}}>{cat}</span>
{anyOpen&&<span style={{width:6,height:6,borderRadius:"50%",background:"#00E5A0",boxShadow:"0 0 8px #00E5A0",animation:"pulse 1.5s infinite"}}/>}</div>
{catTime&&<span style={{fontSize:11,color:"#64748B",fontFamily:"monospace"}}>{tzLabel} {catTime}</span>}
</div>
<div className="sp-grid4" style={{marginBottom:16}}>{items.map(sym=>{const d=data[sym.key]||{};const up=d.change>=0;const sparkH=d.history||[];
return<Card key={sym.key} style={{overflow:"hidden"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
<div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:18}}>{sym.icon}</span><span style={{fontSize:13,fontWeight:700,color:"#F8FAFC"}}>{sym.name}</span></div>
<span style={{fontSize:9,color:"#64748B"}}>{sym.unit}</span>
</div>
{(()=>{const ms=getMarketStatus(sym);return<div style={{display:"inline-flex",alignItems:"center",gap:4,marginBottom:6,padding:"2px 8px",borderRadius:10,background:`${ms.color}12`,alignSelf:"flex-start"}}>
<span style={{width:5,height:5,borderRadius:"50%",background:ms.color,boxShadow:ms.status==="open"?`0 0 6px ${ms.color}`:"none",animation:ms.status==="open"?"pulse 1.5s infinite":"none"}}/><span style={{fontSize:9,color:ms.color,fontWeight:600}}>{ms.label}</span></div>;})()}
<div style={{fontSize:20,fontWeight:800,color:sym.color,fontFamily:"monospace",marginBottom:4}}>{d.price?fmtPrice(d.price,sym):"—"}</div>
<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
<span style={{fontSize:12,fontWeight:700,fontFamily:"monospace",color:up?"#00E5A0":"#FF6B6B"}}>{up?"+":""}{d.change?Math.abs(d.change)<0.01?d.change.toFixed(6):d.change.toFixed(2):"0"}</span>
<span style={{fontSize:11,padding:"1px 6px",borderRadius:4,background:up?"rgba(0,229,160,0.12)":"rgba(255,107,107,0.12)",color:up?"#00E5A0":"#FF6B6B",fontWeight:600,fontFamily:"monospace"}}>{up?"+":""}{(d.changePct||0).toFixed(2)}%</span>
</div>
{sparkH.length>1&&<div style={{height:40,display:"flex",alignItems:"flex-end",gap:1}}>
{(()=>{const vals=sparkH.map(h=>h.close);const mn=Math.min(...vals),mx=Math.max(...vals),rng=mx-mn||1;
return vals.slice(-20).map((v,i)=>{const h=Math.max(((v-mn)/rng)*36+4,2);const prev=i>0?vals.slice(-20)[i-1]:v;
return<div key={i} style={{flex:1,height:h,borderRadius:1,background:v>=prev?`${sym.color}`:up?"rgba(0,229,160,0.3)":"rgba(255,107,107,0.3)",transition:"height 0.3s"}}/>;});})()}
</div>}
{d.error&&<div style={{fontSize:10,color:"#FF6B6B",marginTop:4}}>⚠ 조회실패 (캐시)</div>}
{d.high24&&<div style={{display:"flex",justifyContent:"space-between",marginTop:4,fontSize:9,color:"#64748B"}}><span>H {fmtPrice(d.high24,sym)}</span><span>L {fmtPrice(d.low24,sym)}</span></div>}
</Card>})}</div></div>})}
<Card style={{background:"rgba(255,255,255,0.02)"}}>
<h3 style={{margin:"0 0 10px",fontSize:14,fontWeight:700,color:"#94A3B8"}}>💡 안내</h3>
<div style={{fontSize:12,color:"#64748B",lineHeight:1.8}}>
• 주식/원자재/환율 → Yahoo Finance, 코인 → <b style={{color:"#00E5A0"}}>업비트(Upbit) API</b> (KRW 원화가격)<br/>
• 모든 시세 <b style={{color:"#00E5A0"}}>30초마다 자동 갱신</b> (코인은 거의 실시간, 주식은 약 15분 지연)<br/>
• 조회된 데이터는 자동 캐시되어 오프라인에서도 마지막 시세 확인 가능<br/>
• Vite 프록시 설정이 필요합니다 (아래 안내 참고)<br/>
• 모든 데이터는 localStorage에 저장되어 PC 재부팅 후에도 유지됩니다
</div></Card>
</div>);}

// Main
function StockPilotMVP({ onBack }){const[tab,setTab]=useState(0);const[stocks,setStocks]=useState(DEFAULT_STOCKS);const[seed,setSeed]=useState(50000000);const[cash,setCash]=useState(8500000);const[withdrawals,setWithdrawals]=useState(5000000);const[events,setEvents]=useState(DEFAULT_EVENTS);const[realEstate,setRealEstate]=useState(DEFAULT_RE);const[cars,setCars]=useState(DEFAULT_CARS);const[memos,setMemos]=useState([]);const[goal,setGoal]=useState(DEFAULT_GOAL);const[expenses,setExpenses]=useState(DEFAULT_EXPENSES);const[loaded,setLoaded]=useState(false);
useEffect(()=>{(()=>{const d=loadD();if(d){d.stocks&&setStocks(d.stocks);d.seed&&setSeed(d.seed);d.cash!==undefined&&setCash(d.cash);d.withdrawals!==undefined&&setWithdrawals(d.withdrawals);d.events&&setEvents(d.events);d.realEstate&&setRealEstate(d.realEstate);d.cars&&setCars(d.cars);d.memos&&setMemos(d.memos);d.goal&&setGoal(d.goal);d.expenses&&setExpenses(prev=>{const e={...prev,...d.expenses};if(!e.cards&&d.expenses.mandatoryCards){e.cards=[{id:1,name:"신용카드",type:"credit",mandatory:false,monthlyMin:0},{id:2,name:"체크카드",type:"debit",mandatory:false,monthlyMin:0},{id:3,name:"계좌이체",type:"transfer",mandatory:false,monthlyMin:0},{id:4,name:"현금",type:"cash",mandatory:false,monthlyMin:0},...d.expenses.mandatoryCards.map((mc,i)=>({id:100+i,name:mc.name.replace(/\s/g,""),type:"credit",mandatory:true,monthlyMin:mc.monthlyMin||300000}))];}return e;});}setLoaded(true);})();},[]);
useEffect(()=>{if(!loaded)return;const t=setTimeout(()=>saveD({stocks,seed,cash,withdrawals,events,realEstate,cars,memos,goal,expenses}),500);return()=>clearTimeout(t);},[stocks,seed,cash,withdrawals,events,realEstate,cars,memos,goal,expenses,loaded]);
const gt=stocks.reduce((s,st)=>s+st.currentPrice*st.quantity,0)+cash+realEstate.reduce((s,r)=>s+r.currentValue-r.loanBalance,0)+cars.reduce((s,c)=>s+c.currentValue-c.loanBalance,0);
return(<div className="sp-root" style={{minHeight:"100vh",background:"linear-gradient(135deg,#0B1121,#0F172A 40%,#131C2E)",color:"#E2E8F0",fontFamily:"'Pretendard','Noto Sans KR',-apple-system,sans-serif",boxSizing:"border-box"}}><style>{`@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css');
*{box-sizing:border-box;margin:0;padding:0;}
html,body{width:100%;height:100%;overflow-x:hidden;}
#root{max-width:100%!important;width:100%!important;margin:0!important;padding:0!important;text-align:left!important;}
body{display:block!important;place-items:unset!important;min-width:0!important;min-height:100vh;}
::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:#334155;border-radius:3px;}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.4;}}
input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;}
.sp-root{padding:16px 32px;}
.sp-wrap{width:100%;max-width:100%;margin:0 auto;}
.sp-grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;}
.sp-grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;}
.sp-grid2{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
.sp-grid2-wide{display:grid;grid-template-columns:3fr 2fr;gap:14px;}
.sp-nav{display:flex;gap:3px;padding:4px;background:rgba(15,23,42,0.95);border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.06);}
.sp-nav button{flex:1;padding:8px 6px;border:none;border-radius:8px;cursor:pointer;font-weight:500;font-size:13px;display:flex;flex-direction:row;align-items:center;justify-content:center;gap:6px;font-family:'Pretendard',sans-serif;transition:all 0.2s;}
.sp-flex-wrap{display:flex;gap:12px;flex-wrap:wrap;}
.sp-goal-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;}
.sp-expense-grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;}
.sp-expense-grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;}
.sp-stock-row{display:grid;grid-template-columns:2.5fr 1fr 1fr 1fr 0.7fr 1.2fr 0.8fr 130px;gap:8px;align-items:center;}
@media(max-width:1440px){
.sp-wrap{max-width:100%;}
.sp-grid4{grid-template-columns:repeat(4,1fr);}
}
.sp-card-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:12px;}
.sp-card-grid>*{min-width:0;}
@media(max-width:1440px){.sp-card-grid{grid-template-columns:repeat(4,1fr);}}
@media(max-width:1200px){
.sp-root{padding:20px 28px;}
.sp-card-grid{grid-template-columns:repeat(3,1fr);}
.sp-grid4{grid-template-columns:repeat(2,1fr);}
.sp-grid3{grid-template-columns:repeat(2,1fr);}
.sp-grid2-wide{grid-template-columns:1fr;}
.sp-goal-grid{grid-template-columns:repeat(2,1fr);}
.sp-expense-grid4{grid-template-columns:repeat(2,1fr);}
.sp-stock-row{grid-template-columns:2fr 1fr 1fr 1fr 0.6fr 1fr 0.8fr 100px;gap:4px;}
}
@media(max-width:900px){
.sp-root{padding:16px 16px;}
.sp-card-grid{grid-template-columns:repeat(2,1fr);}
.sp-grid4{grid-template-columns:repeat(2,1fr);}
.sp-grid3{grid-template-columns:1fr;}
.sp-grid2{grid-template-columns:1fr;}
.sp-grid2-wide{grid-template-columns:1fr;}
.sp-goal-grid{grid-template-columns:repeat(2,1fr);}
.sp-expense-grid4{grid-template-columns:repeat(2,1fr);}
.sp-expense-grid3{grid-template-columns:1fr;}
.sp-nav button{font-size:12px;padding:10px 4px;gap:4px;}
.sp-stock-row{grid-template-columns:1.5fr 0.8fr 0.8fr 0.8fr 0.5fr 0.8fr 0.7fr 80px;font-size:11px!important;gap:2px;}
}
@media(max-width:640px){
.sp-root{padding:12px 10px;}
.sp-grid4{grid-template-columns:1fr 1fr;}
.sp-nav button{flex-direction:column;font-size:10px;padding:8px 2px;gap:2px;}
.sp-nav button span.sp-nav-icon{font-size:16px;}
.sp-stock-row{grid-template-columns:1fr 1fr;gap:6px;}
.sp-goal-grid{grid-template-columns:1fr;}
.sp-expense-grid4{grid-template-columns:1fr;}
}
`}</style><div className="sp-wrap">
<div style={{position:"sticky",top:0,zIndex:100,background:"linear-gradient(135deg,#0B1121,#0F172A)",borderBottom:"1px solid rgba(255,255,255,0.06)",padding:"10px 0 10px",marginBottom:16}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,flexWrap:"wrap",gap:6}}><div style={{display:"flex",alignItems:"center",gap:10}}><button onClick={onBack} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:8,color:"#94A3B8",padding:"6px 12px",cursor:"pointer",fontSize:12,fontFamily:"inherit",marginRight:8}}>{"← DMP"}</button><div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#00E5A0,#00B8D4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:900,color:"#0F172A",boxShadow:"0 4px 16px rgba(0,229,160,0.25)"}}>₩</div><div><div style={{fontSize:18,fontWeight:800,color:"#F8FAFC"}}>StockPilot</div><div style={{fontSize:10,color:"#64748B"}}>Total Asset Management v3.0</div></div></div><div style={{display:"flex",alignItems:"center",gap:10}}><div style={{fontSize:12,color:"#475569",padding:"6px 12px",background:"rgba(30,41,59,0.5)",borderRadius:8}}>{stocks.length}종목 · 순자산 {fk(gt)}원</div></div></div>
<Nav active={tab} setActive={setTab}/>
</div>
<MemoPad memos={memos} setMemos={setMemos}/>
<div style={{minHeight:500}}>{tab===0&&<Dashboard stocks={stocks} seed={seed} withdrawals={withdrawals} cash={cash} realEstate={realEstate} cars={cars} goal={goal} setGoal={setGoal}/>}{tab===1&&<Portfolio stocks={stocks} setStocks={setStocks} cash={cash} setCash={setCash} seed={seed} setSeed={setSeed} withdrawals={withdrawals} setWithdrawals={setWithdrawals}/>}{tab===2&&<Assets realEstate={realEstate} setRealEstate={setRealEstate} cars={cars} setCars={setCars}/>}{tab===3&&<Expenses expenses={expenses} setExpenses={setExpenses}/>}{tab===4&&<Analysis stocks={stocks}/>}{tab===5&&<Chatbot stocks={stocks} cash={cash} seed={seed} realEstate={realEstate} cars={cars} expenses={expenses}/>}{tab===6&&<Insight events={events} setEvents={setEvents}/>}{tab===7&&<Market/>}</div>
<div style={{textAlign:"center",padding:"20px 0 8px",fontSize:10,color:"#334155",borderTop:"1px solid rgba(255,255,255,0.03)",marginTop:28}}>StockPilot v3.0 © 2026 · 투자의 최종 판단과 책임은 투자자 본인에게 있습니다</div></div></div>);}


// ============================================================
// DMP Portal (메인)
// ============================================================

// ═══════════════════════════════════════════════════════════════
//  MVP 3: AI 자동차 손해사정 Agent (ClaimsAgentMVP)
// ═══════════════════════════════════════════════════════════════
const CA_VEHICLE_DB = [
  { make: "현대", model: "팰리세이드", years: [2019,2020,2021,2022,2023,2024,2025] },
  { make: "현대", model: "아반떼", years: [2020,2021,2022,2023,2024] },
  { make: "현대", model: "쏘나타", years: [2019,2020,2021,2022,2023,2024] },
  { make: "현대", model: "투싼", years: [2021,2022,2023,2024] },
  { make: "현대", model: "그랜저", years: [2019,2020,2021,2022,2023,2024,2025] },
  { make: "기아", model: "K5", years: [2020,2021,2022,2023,2024] },
  { make: "기아", model: "K8", years: [2021,2022,2023,2024] },
  { make: "기아", model: "스포티지", years: [2022,2023,2024] },
  { make: "기아", model: "쏘렌토", years: [2020,2021,2022,2023,2024] },
  { make: "기아", model: "EV6", years: [2022,2023,2024] },
  { make: "제네시스", model: "GV80", years: [2020,2021,2022,2023,2024] },
  { make: "제네시스", model: "G80", years: [2020,2021,2022,2023,2024] },
  { make: "BMW", model: "520d", years: [2020,2021,2022,2023,2024] },
  { make: "BMW", model: "X5", years: [2020,2021,2022,2023,2024] },
  { make: "벤츠", model: "E300", years: [2020,2021,2022,2023,2024] },
  { make: "벤츠", model: "GLE300d", years: [2021,2022,2023,2024] },
  { make: "폭스바겐", model: "티구안", years: [2021,2022,2023,2024] },
  { make: "르노코리아", model: "XM3", years: [2022,2023,2024] },
  { make: "Volvo", model: "XC60", years: [2019,2020,2021,2022,2023] },
];
const CA_DAMAGE_PARTS = ["프론트 범퍼","리어 범퍼","본넷","좌측 펜더","우측 펜더","좌측 도어","우측 도어","트렁크","헤드라이트","리어램프","전면 유리","루프","사이드미러","그릴","라디에이터"];
const CA_ACCIDENT_TYPES = ["후미추돌(통상 뒤차 우선 과실)","차대차-교차로-신호위반/직진-좌회전","차대차-동일방향-차선변경 접촉","차대차-교차로-직진-우회전","차대차-대향-중앙선 침범","차대차-주차장내 접촉","차대물-고정물 충돌(가드레일/전주)","차대인-횡단보도 보행자","차대차-후진 접촉","단독사고-빗길 미끄러짐"];
const CA_ROAD_TYPES=["일반도로","고속도로","주차장","골목길/이면도로","교차로"];
const CA_WEATHER_TYPES=["맑음","비","눈","안개","강풍","흐림"];
const CA_SIGNAL_STATES=["정상신호","황색신호","적색신호","점멸","신호없음"];
const CA_PP={"프론트 범퍼":{p:[180000,350000],l:[180000,280000]},"리어 범퍼":{p:[160000,320000],l:[170000,260000]},"본넷":{p:[300000,550000],l:[220000,350000]},"좌측 펜더":{p:[150000,280000],l:[130000,220000]},"우측 펜더":{p:[150000,280000],l:[130000,220000]},"좌측 도어":{p:[200000,400000],l:[160000,280000]},"우측 도어":{p:[200000,400000],l:[160000,280000]},"트렁크":{p:[250000,480000],l:[180000,300000]},"헤드라이트":{p:[180000,450000],l:[80000,150000]},"리어램프":{p:[120000,350000],l:[60000,120000]},"전면 유리":{p:[200000,600000],l:[100000,200000]},"루프":{p:[400000,800000],l:[300000,500000]},"사이드미러":{p:[80000,250000],l:[40000,80000]},"그릴":{p:[60000,200000],l:[40000,80000]},"라디에이터":{p:[250000,500000],l:[150000,300000]}};
const CA_CASES=[
  {id:"CLM-2025-0001",date:"2025-10-17",type:"차선변경 접촉",make:"기아",model:"K5 노블레스(GT-Line)",parts:"휀다, 그릴",severity:"경미",status:"종결",fault:"가해자70%/피해자30%",cost:720000,rental:"기아 K8/2일",channel:"현장접수",region:"서울"},
  {id:"CLM-2025-0015",date:"2025-03-08",type:"교차로-신호위반",make:"현대",model:"팰리세이드 캘리그래피",parts:"프론트범퍼,헤드라이트,좌측펜더",severity:"중간",status:"미결",fault:"A20%/B80%",cost:2850000,rental:"GV80/7일",channel:"APP",region:"경기"},
  {id:"CLM-2025-0042",date:"2025-05-12",type:"대향-중앙선 침범",make:"제네시스",model:"GV80 프레스티지",parts:"프론트범퍼,본넷,우측펜더,우측도어,헤드라이트",severity:"심각",status:"미결",fault:"A10%/B90%",cost:5200000,rental:"G80/14일",channel:"콜센터",region:"서울"},
  {id:"CLM-2025-0078",date:"2025-07-22",type:"고정물 충돌",make:"BMW",model:"520d 럭셔리",parts:"프론트범퍼,좌측펜더,헤드라이트,라디에이터",severity:"심각",status:"민원",fault:"단독100%",cost:4800000,rental:"520i/10일",channel:"APP",region:"대전"},
  {id:"CLM-2025-0103",date:"2025-09-05",type:"주차장 접촉",make:"벤츠",model:"E300 아방가르드",parts:"리어범퍼,트렁크",severity:"경미",status:"종결",fault:"A45%/B55%",cost:980000,rental:"없음",channel:"모바일앱",region:"부산"},
  {id:"CLM-2025-0156",date:"2025-11-18",type:"후미추돌",make:"현대",model:"아반떼 프리미엄",parts:"리어범퍼,트렁크,리어램프",severity:"중간",status:"미결",fault:"A0%/B100%",cost:1650000,rental:"아반떼/5일",channel:"콜센터",region:"광주"},
  {id:"CLM-2025-0200",date:"2025-12-01",type:"후진 접촉",make:"기아",model:"쏘렌토 시그니처",parts:"리어범퍼",severity:"경미",status:"종결",fault:"A20%/B80%",cost:380000,rental:"없음",channel:"현장접수",region:"울산"},
  {id:"CLM-2025-0002",date:"2025-01-23",type:"후미추돌",make:"르노코리아",model:"SM6(캘리그래피)",parts:"본넷",severity:"경미",status:"과실협의",fault:"협의중",cost:450000,rental:"없음",channel:"콜센터",region:"인천"},
];

const caR=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const caF=n=>"₩"+n.toLocaleString();

async function caCallAI(s,m){try{const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:s,messages:[{role:"user",content:m}]})});const d=await r.json();return d.content?.[0]?.text||"응답 실패";}catch(e){return"API 오류: "+e.message;}}

function caUseTW(t,sp=10){const[d,sD]=useState("");const[dn,sN]=useState(false);useEffect(()=>{if(!t){sD("");sN(false);return;}sD("");sN(false);let i=0;const iv=setInterval(()=>{i++;sD(t.slice(0,i));if(i>=t.length){clearInterval(iv);sN(true);}},sp);return()=>clearInterval(iv);},[t,sp]);return{displayed:d,done:dn};}

const caIC={
  car:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 17h14M5 17a2 2 0 01-2-2V9a2 2 0 012-2h.93a2 2 0 001.66-.9l.82-1.2A2 2 0 0110.07 4h3.86a2 2 0 011.66.9l.82 1.2a2 2 0 001.66.9H19a2 2 0 012 2v6a2 2 0 01-2 2"/><circle cx="8" cy="14" r="1"/><circle cx="16" cy="14" r="1"/></svg>,
  ai:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a4 4 0 014 4v2h2a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8a2 2 0 012-2h2V6a4 4 0 014-4z"/><circle cx="9" cy="14" r="1" fill="currentColor"/><circle cx="15" cy="14" r="1" fill="currentColor"/></svg>,
  est:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  flt:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>,
  mth:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  fld:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>,
  arr:<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  bk:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  x:<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  sr:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  rf:<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>,
  st:<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  cs:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
  wr:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>,
  sh:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
};

function CaRT({text}){if(!text)return null;return<div style={{lineHeight:1.75}}>{text.split("\n").map((l,i)=>{
  if(l.startsWith("###"))return<h4 key={i} style={{color:"#0891b2",margin:"11px 0 3px",fontSize:13,fontWeight:700}}>{l.replace(/^###\s*/,"")}</h4>;
  if(l.startsWith("##"))return<h3 key={i} style={{color:"#0f172a",margin:"13px 0 5px",fontSize:14.5,fontWeight:700}}>{l.replace(/^##\s*/,"")}</h3>;
  if(l.startsWith("**")&&l.endsWith("**"))return<p key={i} style={{fontWeight:700,color:"#0f172a",margin:"5px 0"}}>{l.replace(/\*\*/g,"")}</p>;
  if(l.startsWith("- ")||l.startsWith("• "))return<div key={i} style={{paddingLeft:14,margin:"2px 0",color:"#475569"}}><span style={{color:"#0891b2",marginRight:7,fontSize:8}}>●</span>{l.replace(/^[-•]\s*/,"").replace(/\*\*(.*?)\*\*/g,"$1")}</div>;
  if(l.startsWith("※")||l.startsWith("⚠"))return<p key={i} style={{color:"#d97706",margin:"4px 0",fontSize:12}}>{l}</p>;
  if(!l.trim())return<div key={i} style={{height:4}}/>;
  return<p key={i} style={{margin:"2px 0",color:"#475569"}}>{l.replace(/\*\*(.*?)\*\*/g,"$1")}</p>;
})}</div>;}
function CaSp({s}){return<div style={{width:s?13:17,height:s?13:17,border:"2px solid #e2e8f0",borderTop:"2px solid #0891b2",borderRadius:"50%",animation:"caSpin .8s linear infinite",display:"inline-block"}}/>;}
function CaEm({text}){return<div style={{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",color:"#94a3b8",gap:10,minHeight:260}}><div style={{width:48,height:48,borderRadius:14,background:"#f8fafc",display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid #e2e8f0"}}>{caIC.car}</div><div style={{fontSize:13,textAlign:"center",maxWidth:280}}>{text}</div></div>;}
function CaSB({label,value,onChange,opts}){return<div><label style={caLB}>{label}</label><select value={value} onChange={e=>onChange(e.target.value)} style={caSL}><option value="">선택</option>{opts.map(o=><option key={o} value={o}>{o}</option>)}</select></div>;}
function CaIB({label,value,onChange,ph}){return<div><label style={caLB}>{label}</label><input type="number" value={value} onChange={e=>onChange(e.target.value)} placeholder={ph} style={caIN}/></div>;}
function CaMC({label,value,ac,big}){return<div style={{background:"#fff",borderRadius:10,padding:"10px 12px",border:big?`2px solid ${ac}`:"1px solid #e2e8f0"}}><div style={{color:"#94a3b8",fontSize:10,fontWeight:600,marginBottom:2}}>{label}</div><div style={{color:ac||"#0f172a",fontSize:big?15:13,fontWeight:700,fontFamily:"'DM Mono',monospace"}}>{value}</div></div>;}

const caCD={background:"#fff",border:"1px solid #e2e8f0",borderRadius:14,padding:"16px 18px",marginBottom:13};
const caST={color:"#94a3b8",fontSize:11.5,fontWeight:600,margin:"0 0 10px",display:"flex",alignItems:"center",gap:6,letterSpacing:.3};
const caSL={width:"100%",padding:"7px 11px",borderRadius:8,fontSize:12.5,background:"#f8fafc",border:"1px solid #e2e8f0",color:"#0f172a",outline:"none"};
const caIN={width:"100%",padding:"7px 11px",borderRadius:8,fontSize:12.5,background:"#f8fafc",border:"1px solid #e2e8f0",color:"#0f172a",outline:"none",boxSizing:"border-box"};
const caLB={color:"#94a3b8",fontSize:10,marginBottom:2,display:"block",fontWeight:600};
const caTA={width:"100%",padding:"9px 13px",borderRadius:10,fontSize:12.5,background:"#f8fafc",border:"1px solid #e2e8f0",color:"#0f172a",outline:"none",resize:"vertical",fontFamily:"inherit",boxSizing:"border-box",lineHeight:1.6};
const caBT={width:"100%",padding:"12px 0",borderRadius:10,border:"none",cursor:"pointer",color:"#fff",fontSize:13.5,fontWeight:700,letterSpacing:.4,transition:"all .3s"};

function CaTab1(){
  const[mk,sMk]=useState("");const[md,sMd]=useState("");const[yr,sYr]=useState("");const[ml,sMl]=useState("");
  const[sp,sSp]=useState([]);const[sv,sSv]=useState("중간");const[rs,sRs]=useState(null);const[ld,sLd]=useState(false);const[at,sAt]=useState("");
  const{displayed:tA,done:aD}=caUseTW(at);const mds=CA_VEHICLE_DB.filter(v=>v.make===mk);const veh=CA_VEHICLE_DB.find(v=>v.make===mk&&v.model===md);
  const sM={"경미":.6,"중간":1,"심각":1.5,"전손 추정":2.2};const sC={"경미":"#16a34a","중간":"#d97706","심각":"#dc2626","전손 추정":"#7f1d1d"};
  const calc=async()=>{if(!mk||!md||!sp.length)return;sLd(true);sRs(null);sAt("");
    const im=["BMW","벤츠","폭스바겐","Volvo"].includes(mk);const m=sM[sv]*(im?1.6:1)*(yr&&2025-+yr>5?.85:1);
    const bd=sp.map(p=>{const b=CA_PP[p]||{p:[150000,300000],l:[100000,200000]};const pc=Math.round(caR(b.p[0],b.p[1])*m);const lc=Math.round(caR(b.l[0],b.l[1])*m);return{pt:p,pc,lc,t:pc+lc};});
    const tp=bd.reduce((s,b)=>s+b.pc,0),tl=bd.reduce((s,b)=>s+b.lc,0),pt=Math.round(sp.length*caR(80000,180000)*m);
    sRs({bd,tp,tl,pt,gt:tp+tl+pt,vh:`${mk} ${md} ${yr||""}`});
    const a=await caCallAI("당신은 자동차 손해사정 전문 AI입니다. 견적 분석을 간결하게 해주세요.",`차량:${mk} ${md} ${yr||"미상"}년식\n파손:${sp.join(",")}(${sv})\n견적:부품${caF(tp)},공임${caF(tl)},도장${caF(pt)},합계${caF(tp+tl+pt)}\n견적 적정성, 미수선 처리, ADAS 캘리브레이션 등을 분석해주세요.`);
    sAt(a);sLd(false);};
  return(
    <div style={{display:"grid",gridTemplateColumns:"340px 1fr",gap:20,height:"100%"}}>
      <div style={{overflowY:"auto",paddingRight:8}}>
        <div style={caCD}><h3 style={caST}>{caIC.car}<span>차량 정보</span></h3><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
          <CaSB label="제조사" value={mk} onChange={sMk} opts={[...new Set(CA_VEHICLE_DB.map(v=>v.make))]}/>
          <CaSB label="모델" value={md} onChange={sMd} opts={mds.map(v=>v.model)}/>
          <CaSB label="연식" value={yr} onChange={sYr} opts={(veh?.years||[]).map(String)}/>
          <CaIB label="주행거리(km)" value={ml} onChange={sMl} ph="35874"/></div></div>
        <div style={caCD}><h3 style={caST}>파손 부위</h3><div style={{display:"flex",flexWrap:"wrap",gap:5}}>
          {CA_DAMAGE_PARTS.map(p=><button key={p} onClick={()=>sSp(v=>v.includes(p)?v.filter(x=>x!==p):[...v,p])} style={{padding:"4px 10px",borderRadius:18,fontSize:11.5,cursor:"pointer",background:sp.includes(p)?"#0891b2":"#f8fafc",color:sp.includes(p)?"#fff":"#94a3b8",border:sp.includes(p)?"1px solid #0891b2":"1px solid #e2e8f0",fontWeight:sp.includes(p)?600:400,transition:"all .15s"}}>{sp.includes(p)?"✓ ":""}{p}</button>)}</div></div>
        <div style={caCD}><h3 style={caST}>파손 정도</h3><div style={{display:"flex",gap:5}}>
          {Object.keys(sM).map(s=><button key={s} onClick={()=>sSv(s)} style={{flex:1,padding:"6px 0",borderRadius:7,fontSize:12,cursor:"pointer",background:sv===s?sC[s]:"#f8fafc",color:sv===s?"#fff":"#94a3b8",border:sv===s?"none":"1px solid #e2e8f0",fontWeight:sv===s?700:400}}>{s}</button>)}</div></div>
        <button onClick={calc} disabled={ld||!mk||!md||!sp.length} style={{...caBT,background:ld?"#e2e8f0":"#0891b2",opacity:(!mk||!md||!sp.length)?.4:1}}>{ld?<CaSp/>:"견적 산정 실행"}</button>
      </div>
      <div style={{overflowY:"auto"}}>{!rs&&!ld&&<CaEm text="차량과 파손 부위 선택 후 실행하세요"/>}
        {rs&&<div style={{animation:"caFadeIn .4s"}}>
          <div style={{...caCD,border:"2px solid #a5f3fc"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <h3 style={{color:"#0f172a",fontSize:15.5,fontWeight:700,margin:0}}>예상 견적</h3>
            <span style={{background:"#ecfeff",padding:"3px 11px",borderRadius:18,color:"#0891b2",fontSize:11.5,fontWeight:600}}>{rs.vh}</span></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:9}}>
              <CaMC label="부품비" value={caF(rs.tp)} ac="#2563eb"/><CaMC label="공임비" value={caF(rs.tl)} ac="#7c3aed"/>
              <CaMC label="도장비" value={caF(rs.pt)} ac="#d97706"/><CaMC label="합계" value={caF(rs.gt)} ac="#0891b2" big/></div></div>
          <div style={caCD}><h3 style={caST}>세부 산출</h3>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}><thead><tr style={{borderBottom:"2px solid #e2e8f0"}}>
              <th style={{textAlign:"left",padding:"8px 10px",color:"#94a3b8",fontSize:11,fontWeight:600}}>부위</th>
              <th style={{textAlign:"left",padding:"8px 10px",color:"#94a3b8",fontSize:11,fontWeight:600}}>부품비</th>
              <th style={{textAlign:"left",padding:"8px 10px",color:"#94a3b8",fontSize:11,fontWeight:600}}>공임비</th>
              <th style={{textAlign:"left",padding:"8px 10px",color:"#94a3b8",fontSize:11,fontWeight:600}}>소계</th></tr></thead>
              <tbody>{rs.bd.map((b,i)=><tr key={i} style={{borderBottom:"1px solid #f1f5f9"}}>
                <td style={{padding:"8px 10px",color:"#475569"}}>{b.pt}</td>
                <td style={{padding:"8px 10px",color:"#2563eb"}}>{caF(b.pc)}</td>
                <td style={{padding:"8px 10px",color:"#7c3aed"}}>{caF(b.lc)}</td>
                <td style={{padding:"8px 10px",fontWeight:600}}>{caF(b.t)}</td></tr>)}</tbody></table></div>
          <div style={{...caCD,border:"1px solid #a5f3fc"}}><div style={{display:"flex",alignItems:"center",gap:7,marginBottom:9}}>
            <div style={{width:22,height:22,borderRadius:"50%",background:"#0891b2",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}}>{caIC.ai}</div>
            <span style={{fontSize:13,fontWeight:700}}>AI 분석</span>{!aD&&at&&<CaSp s/>}</div>
            <div style={{fontSize:12.5}}><CaRT text={tA}/></div></div>
        </div>}
      </div></div>);
}

function CaTab2(){
  const[at,sAt]=useState("");const[rt,sRt]=useState("");const[wt,sWt]=useState("");const[sg,sSg]=useState("");
  const[mD,sMd]=useState("");const[oD,sOd]=useState("");const[dc,sDc]=useState(false);const[pr,sPr]=useState(false);
  const[rs,sRs]=useState(null);const[ld,sLd]=useState(false);const[ai,sAi]=useState("");
  const{displayed:tA,done:aD}=caUseTW(ai);
  const calc=async()=>{if(!at)return;sLd(true);sRs(null);sAi("");
    let b=50;if(at.includes("후미추돌"))b=15;else if(at.includes("신호위반"))b=30;else if(at.includes("차선변경"))b=35;else if(at.includes("중앙선"))b=10;else if(at.includes("주차장"))b=45;else if(at.includes("후진"))b=20;else if(at.includes("단독"))b=100;else if(at.includes("횡단보도"))b=60;
    if(wt==="비"||wt==="눈")b=Math.min(100,b+3);if(sg==="적색신호")b=Math.max(0,b-10);if(pr)b=Math.max(0,b-2);
    sRs({mf:b,of:100-b,cf:dc?"높음":"보통"});
    const a=await caCallAI("당신은 과실 산정 전문 AI입니다. 판단근거,판례,협상차선안을 제시하세요.",
      `사고:${at}\n도로:${rt||"미상"},날씨:${wt||"미상"},신호:${sg||"미상"}\n결과:A${b}%/B${100-b}%\n분석해주세요.`);
    sAi(a);sLd(false);};
  return(
    <div style={{display:"grid",gridTemplateColumns:"340px 1fr",gap:20,height:"100%"}}>
      <div style={{overflowY:"auto",paddingRight:8}}>
        <div style={caCD}><h3 style={caST}>사고 유형</h3><select value={at} onChange={e=>sAt(e.target.value)} style={caSL}><option value="">선택</option>{CA_ACCIDENT_TYPES.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
        <div style={caCD}><h3 style={caST}>사고 상황</h3><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
          <CaSB label="도로" value={rt} onChange={sRt} opts={CA_ROAD_TYPES}/><CaSB label="날씨" value={wt} onChange={sWt} opts={CA_WEATHER_TYPES}/>
          <CaSB label="신호" value={sg} onChange={sSg} opts={CA_SIGNAL_STATES}/></div></div>
        <div style={caCD}><h3 style={caST}>진술</h3><label style={caLB}>A차량(청구자)</label><textarea value={mD} onChange={e=>sMd(e.target.value)} placeholder="사고 상황..." style={caTA} rows={2}/>
          <label style={{...caLB,marginTop:8}}>B차량(상대방)</label><textarea value={oD} onChange={e=>sOd(e.target.value)} placeholder="상대방 진술..." style={caTA} rows={2}/></div>
        <div style={caCD}><h3 style={caST}>증거</h3><div style={{display:"flex",gap:12}}>
          <label style={{display:"flex",alignItems:"center",gap:4,color:"#64748b",fontSize:12.5,cursor:"pointer"}}><input type="checkbox" checked={dc} onChange={e=>sDc(e.target.checked)} style={{accentColor:"#0891b2"}}/>블랙박스</label>
          <label style={{display:"flex",alignItems:"center",gap:4,color:"#64748b",fontSize:12.5,cursor:"pointer"}}><input type="checkbox" checked={pr} onChange={e=>sPr(e.target.checked)} style={{accentColor:"#0891b2"}}/>경찰보고서</label></div></div>
        <button onClick={calc} disabled={ld||!at} style={{...caBT,background:ld?"#e2e8f0":"#7c3aed",opacity:!at?.4:1}}>{ld?<CaSp/>:"과실비율 산정"}</button>
      </div>
      <div style={{overflowY:"auto"}}>{!rs&&!ld&&<CaEm text="사고 유형 입력 후 실행하세요"/>}
        {rs&&<div style={{animation:"caFadeIn .4s"}}>
          <div style={{...caCD,border:"2px solid #c4b5fd"}}>
            <h3 style={{color:"#0f172a",fontSize:15.5,fontWeight:700,margin:"0 0 14px"}}>과실 산정 결과</h3>
            <div style={{display:"flex",alignItems:"center",gap:18,marginBottom:14}}>
              <div style={{flex:1,textAlign:"center"}}><div style={{fontSize:36,fontWeight:800,color:"#2563eb",fontFamily:"'DM Mono',monospace"}}>{rs.mf}%</div><div style={{color:"#94a3b8",fontSize:12}}>A (청구자)</div></div>
              <div style={{width:1,height:44,background:"#e2e8f0"}}/>
              <div style={{flex:1,textAlign:"center"}}><div style={{fontSize:36,fontWeight:800,color:"#dc2626",fontFamily:"'DM Mono',monospace"}}>{rs.of}%</div><div style={{color:"#94a3b8",fontSize:12}}>B (상대방)</div></div></div>
            <div style={{height:9,borderRadius:5,background:"#f1f5f9",overflow:"hidden",display:"flex"}}>
              <div style={{width:`${rs.mf}%`,background:"linear-gradient(90deg,#3b82f6,#60a5fa)",transition:"width 1s"}}/>
              <div style={{width:`${rs.of}%`,background:"linear-gradient(90deg,#ef4444,#f87171)",transition:"width 1s"}}/></div>
            <div style={{marginTop:8}}><span style={{padding:"2px 9px",borderRadius:10,fontSize:10.5,fontWeight:600,background:rs.cf==="높음"?"#dcfce7":"#fef3c7",color:rs.cf==="높음"?"#16a34a":"#d97706"}}>증거 신뢰도: {rs.cf}</span></div></div>
          <div style={{...caCD,border:"1px solid #c4b5fd"}}><div style={{display:"flex",alignItems:"center",gap:7,marginBottom:9}}>
            <div style={{width:22,height:22,borderRadius:"50%",background:"#7c3aed",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}}>{caIC.ai}</div>
            <span style={{fontSize:13,fontWeight:700}}>AI 과실 분석</span>{!aD&&ai&&<CaSp s/>}</div>
            <div style={{fontSize:12.5}}><CaRT text={tA}/></div></div></div>}
      </div></div>);
}

function CaTab3(){
  const[stage,setStage]=useState("idle");
  const[selCase,setSelCase]=useState(null);const[modal,setModal]=useState(false);const[csQ,setCsQ]=useState("");
  const[input,setInput]=useState("");
  const[summary,setSummary]=useState(null);const[sumText,setSumText]=useState("");const{displayed:tS,done:sD}=caUseTW(sumText);
  const[proposals,setProposals]=useState(null);
  const[selIdx,setSelIdx]=useState(null);const[detText,setDetText]=useState("");const{displayed:tD,done:dD}=caUseTW(detText);

  const filtered=CA_CASES.filter(c=>!csQ||c.id.toLowerCase().includes(csQ.toLowerCase())||c.model.includes(csQ)||c.type.includes(csQ));
  const loadCase=c=>{setSelCase(c);setModal(false);setInput(`사고ID: ${c.id}\n사고일: ${c.date}\n유형: ${c.type}\n차량: ${c.make} ${c.model}\n파손: ${c.parts}\n정도: ${c.severity}\n과실: ${c.fault}\n수리비: ${caF(c.cost)}\n렌트: ${c.rental}\n상태: ${c.status}\n지역: ${c.region}`);
    setStage("idle");setSummary(null);setProposals(null);setSelIdx(null);setDetText("");setSumText("");};

  const analyze=async()=>{if(!input.trim())return;setStage("loading");setSummary(null);setProposals(null);setSelIdx(null);setDetText("");setSumText("");
    const sR=await caCallAI("손해사정 전문 AI. JSON만 응답:\n{\"업무영역\":\"\",\"핵심쟁점\":\"\",\"차량\":\"\",\"추정비용\":\"\",\"긴급도\":\"높음/보통/낮음\",\"주의사항\":\"\"}",input);
    let sO;try{sO=JSON.parse(sR.replace(/```json|```/g,"").trim())}catch{sO={업무영역:"자동차 손해사정",핵심쟁점:"수리 방법 결정",차량:"확인 필요",추정비용:"산정 중",긴급도:"보통",주의사항:""}}
    setSummary(sO);
    const nR=await caCallAI("손해사정 전문 AI. 2-3줄로 사고건을 정리해주세요.",`정리:\n${input}`);setSumText(nR);
    const c=selCase?.cost||2000000;
    const pR=await caCallAI("손해사정 전문 AI. 3가지 처리방법 JSON배열만:\n[{\"title\":\"\",\"subtitle\":\"\",\"cost\":\"금액\",\"period\":\"기간\",\"satisfaction\":4.5,\"pros\":[],\"cons\":[],\"recommended\":false}]\n순서:(1)미수선(2)제휴(3)공식",input);
    let pA;try{pA=JSON.parse(pR.replace(/```json|```/g,"").trim())}catch{
      pA=[{title:"미수선 처리",subtitle:"현금정산(협의금)",cost:caF(Math.round(c*.7)),period:"3~5일",satisfaction:3.8,pros:["빠른 종결","고객 자유도"],cons:["수리 미보장"],recommended:false},
        {title:"제휴 서비스 센터",subtitle:"보험사 협력정비망",cost:caF(Math.round(c*.85)),period:"5~7일",satisfaction:4.2,pros:["비용 절감","품질 보증"],cons:["일부 대체부품"],recommended:true},
        {title:"공식 서비스 센터",subtitle:"제조사 공식 AS",cost:caF(c),period:"7~14일",satisfaction:4.7,pros:["OEM 부품","최고 품질"],cons:["비용 최대"],recommended:false}]}
    setProposals(pA);setStage("result");};

  const showDet=async idx=>{setSelIdx(idx);setDetText("");setStage("detail");
    const p=proposals[idx];
    const r=await caCallAI("손해사정 전문 AI. 선택된 방법의 미리보기+절차를 안내하세요.\n## 미리보기\n- 상세비용,타임라인\n## 다음 절차\n- Step별 안내\n## 고객 스크립트\n## 유의사항",
      `사고건:\n${input}\n방법:${p.title}(${p.subtitle})\n비용:${p.cost},기간:${p.period}\n상세+절차 안내해주세요.`);
    setDetText(r);};
  const reset=()=>{setStage("idle");setSelCase(null);setInput("");setSummary(null);setProposals(null);setSelIdx(null);setDetText("");setSumText("")};

  const CI=[caIC.cs,caIC.wr,caIC.sh],CC=["#0891b2","#7c3aed","#2563eb"],CB=["#ecfeff","#f5f3ff","#eff6ff"],CR=["#a5f3fc","#c4b5fd","#bfdbfe"];

  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      {modal&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.2)",backdropFilter:"blur(3px)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setModal(false)}>
        <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:18,padding:24,width:580,maxHeight:"68vh",overflow:"hidden",display:"flex",flexDirection:"column",boxShadow:"0 16px 48px rgba(0,0,0,.1)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <h3 style={{margin:0,fontSize:15,fontWeight:700}}>사고건 불러오기</h3>
            <button onClick={()=>setModal(false)} style={{background:"none",border:"none",cursor:"pointer",color:"#94a3b8"}}>{caIC.x}</button></div>
          <div style={{position:"relative",marginBottom:10}}><span style={{position:"absolute",left:11,top:9,color:"#94a3b8"}}>{caIC.sr}</span>
            <input value={csQ} onChange={e=>setCsQ(e.target.value)} placeholder="사고ID, 차종, 유형..." style={{...caIN,paddingLeft:32,width:"100%"}}/></div>
          <div style={{overflowY:"auto",flex:1}}>
            {filtered.map(c=><div key={c.id} onClick={()=>loadCase(c)} style={{padding:"11px 13px",borderRadius:11,border:"1px solid #e2e8f0",marginBottom:6,cursor:"pointer",background:"#fafbfc",transition:"all .15s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="#0891b2";e.currentTarget.style.background="#f0fdfa"}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="#e2e8f0";e.currentTarget.style.background="#fafbfc"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <div style={{display:"flex",gap:7,alignItems:"center"}}>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:12,fontWeight:700,color:"#0891b2"}}>{c.id}</span>
                  <span style={{background:c.status==="종결"?"#dcfce7":c.status==="미결"?"#fef3c7":"#fee2e2",color:c.status==="종결"?"#16a34a":c.status==="미결"?"#d97706":"#dc2626",padding:"1px 7px",borderRadius:10,fontSize:9.5,fontWeight:600}}>{c.status}</span></div>
                <span style={{color:"#94a3b8",fontSize:10.5}}>{c.date}</span></div>
              <div style={{color:"#334155",fontSize:12,fontWeight:600}}>{c.make} {c.model}</div>
              <div style={{color:"#64748b",fontSize:11}}>{c.type} · {c.parts} ({c.severity}) · {caF(c.cost)}</div>
            </div>)}</div></div></div>}

      <div style={{display:"flex",gap:8,marginBottom:12,alignItems:"center",flexWrap:"wrap"}}>
        <button onClick={()=>setModal(true)} style={{display:"flex",alignItems:"center",gap:5,padding:"7px 13px",borderRadius:9,fontSize:12,background:"#fff",border:"1px solid #e2e8f0",cursor:"pointer",color:"#0f172a",fontWeight:600,transition:"all .15s"}}
          onMouseEnter={e=>e.currentTarget.style.borderColor="#0891b2"} onMouseLeave={e=>e.currentTarget.style.borderColor="#e2e8f0"}>{caIC.fld}<span>사고건 불러오기</span></button>
        {selCase&&<div style={{display:"flex",alignItems:"center",gap:5,background:"#ecfeff",padding:"4px 11px",borderRadius:9,fontSize:11.5,color:"#0891b2",fontWeight:600}}>
          {selCase.id} | {selCase.make} {selCase.model}
          <button onClick={()=>{setSelCase(null);setInput("")}} style={{background:"none",border:"none",cursor:"pointer",color:"#0891b2",padding:1}}>{caIC.x}</button></div>}
        {stage!=="idle"&&<button onClick={reset} style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:3,padding:"5px 10px",borderRadius:7,fontSize:11,background:"none",border:"1px solid #e2e8f0",cursor:"pointer",color:"#94a3b8"}}>{caIC.rf} 초기화</button>}
      </div>

      {stage==="idle"&&<div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <div style={{...caCD,flex:1,display:"flex",flexDirection:"column"}}><h3 style={caST}>사고건 내용 입력</h3>
          <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder={"사고건을 입력하세요...\n예: 520d 양쪽 사이드미러+범퍼 파손\n또는 '사고건 불러오기'로 기존 접수건 선택"} style={{...caTA,flex:1,minHeight:140,resize:"none"}}/>
          <div style={{display:"flex",gap:5,marginTop:10,flexWrap:"wrap"}}>
            {["520d 사이드미러+범퍼 파손","GV80 전면 5부위 심각","아반떼 후미추돌"].map((q,i)=>
              <button key={i} onClick={()=>setInput(q)} style={{padding:"4px 10px",borderRadius:14,fontSize:11,cursor:"pointer",background:"#f8fafc",color:"#94a3b8",border:"1px solid #e2e8f0",transition:"all .15s"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="#059669";e.currentTarget.style.color="#059669"}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="#e2e8f0";e.currentTarget.style.color="#94a3b8"}}>{q}</button>)}</div></div>
        <button onClick={analyze} disabled={!input.trim()} style={{...caBT,marginTop:10,background:!input.trim()?"#e2e8f0":"#059669",opacity:!input.trim()?.4:1}}>AI 분석 시작</button></div>}

      {stage==="loading"&&<div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12}}>
        <CaSp/><div style={{color:"#94a3b8",fontSize:13}}>사고건 분석 중...</div>
        <div style={{display:"flex",gap:5}}>{["접수 분석","방법 산출","비용 비교"].map((t,i)=>
          <span key={i} style={{padding:"3px 9px",borderRadius:10,fontSize:10.5,background:"#fff",color:"#94a3b8",border:"1px solid #e2e8f0",animation:`caFadeIn ${.3+i*.3}s ease`}}>{t}</span>)}</div></div>}

      {stage==="result"&&summary&&<div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:12}}>
        <div style={{...caCD,border:"2px solid #86efac",marginBottom:0}}>
          <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:10}}>
            <div style={{width:24,height:24,borderRadius:"50%",background:"#059669",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}}>{caIC.ai}</div>
            <span style={{fontSize:14,fontWeight:700}}>접수 내용 분석</span>{!sD&&<CaSp s/>}</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7,marginBottom:10}}>
            {[{l:"업무영역",v:summary.업무영역},{l:"차량",v:summary.차량},{l:"추정비용",v:summary.추정비용},{l:"긴급도",v:summary.긴급도}].map((x,i)=>
              <div key={i} style={{background:"#f0fdf4",borderRadius:9,padding:"8px 11px",border:"1px solid #bbf7d0"}}>
                <div style={{color:"#6b7280",fontSize:9.5,fontWeight:600}}>{x.l}</div><div style={{color:"#0f172a",fontSize:12,fontWeight:600}}>{x.v||"-"}</div></div>)}
          </div>
          <div style={{background:"#f0fdf4",borderRadius:9,padding:"9px 12px",border:"1px solid #bbf7d0",fontSize:12.5,color:"#475569",lineHeight:1.7}}>{tS||"분석 중..."}</div>
          {summary.주의사항&&<div style={{marginTop:7,padding:"6px 11px",borderRadius:7,background:"#fef3c7",border:"1px solid #fde68a",fontSize:11.5,color:"#92400e"}}>⚠️ {summary.주의사항}</div>}
        </div>

        {proposals&&<div style={{animation:"caFadeIn .5s"}}>
          <h3 style={{...caST,fontSize:13,margin:"4px 0 10px"}}>처리 방법 3가지 — 카드를 선택하세요</h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
            {proposals.map((p,idx)=><div key={idx} onClick={()=>showDet(idx)} style={{background:CB[idx],borderRadius:15,padding:"18px 16px",border:`2px solid ${CR[idx]}`,cursor:"pointer",transition:"all .2s",position:"relative"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=`0 8px 24px ${CC[idx]}12`;e.currentTarget.style.borderColor=CC[idx]}}
              onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";e.currentTarget.style.borderColor=CR[idx]}}>
              {p.recommended&&<div style={{position:"absolute",top:9,right:9,background:CC[idx],color:"#fff",padding:"2px 8px",borderRadius:10,fontSize:9.5,fontWeight:700}}>추천</div>}
              <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:12}}>
                <div style={{width:36,height:36,borderRadius:10,background:`${CC[idx]}10`,display:"flex",alignItems:"center",justifyContent:"center",color:CC[idx]}}>{CI[idx]}</div>
                <div><div style={{fontSize:14,fontWeight:700,color:"#0f172a"}}>{p.title}</div><div style={{fontSize:10.5,color:"#64748b"}}>{p.subtitle}</div></div></div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:10}}>
                <div style={{background:"rgba(255,255,255,.7)",borderRadius:7,padding:"7px 9px"}}>
                  <div style={{fontSize:9,color:"#94a3b8",fontWeight:600}}>예상 비용</div>
                  <div style={{fontSize:13,fontWeight:700,color:CC[idx],fontFamily:"'DM Mono',monospace"}}>{p.cost}</div></div>
                <div style={{background:"rgba(255,255,255,.7)",borderRadius:7,padding:"7px 9px"}}>
                  <div style={{fontSize:9,color:"#94a3b8",fontWeight:600}}>처리 기간</div>
                  <div style={{fontSize:13,fontWeight:700,color:"#334155"}}>{p.period}</div></div></div>
              <div style={{display:"flex",alignItems:"center",gap:2,marginBottom:7}}>
                <span style={{color:"#f59e0b",display:"flex",gap:1}}>{[1,2,3,4,5].map(s=><span key={s} style={{opacity:s<=Math.round(p.satisfaction)?1:.2}}>{caIC.st}</span>)}</span>
                <span style={{fontSize:11,fontWeight:600,color:"#64748b",marginLeft:3}}>{p.satisfaction}</span></div>
              <div style={{fontSize:11,color:"#64748b"}}>{p.pros?.slice(0,2).map((x,i)=><span key={i} style={{marginRight:5}}>✓ {x}</span>)}</div>
              <div style={{marginTop:10,display:"flex",alignItems:"center",justifyContent:"center",gap:4,padding:"7px 0",borderTop:`1px solid ${CR[idx]}`,color:CC[idx],fontSize:12,fontWeight:600}}>
                미리보기 · 절차 확인 {caIC.arr}</div>
            </div>)}
          </div></div>}
      </div>}

      {stage==="detail"&&proposals&&selIdx!==null&&<div style={{flex:1,overflowY:"auto",animation:"caFadeIn .3s"}}>
        <button onClick={()=>{setStage("result");setSelIdx(null);setDetText("")}} style={{display:"flex",alignItems:"center",gap:4,padding:"6px 12px",borderRadius:9,fontSize:12,background:"none",border:"1px solid #e2e8f0",cursor:"pointer",color:"#64748b",marginBottom:12}}>{caIC.bk} 3가지 방법 보기</button>
        <div style={{background:CB[selIdx],borderRadius:15,padding:"16px 20px",border:`2px solid ${CC[selIdx]}`,marginBottom:12,display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:40,height:40,borderRadius:11,background:`${CC[selIdx]}10`,display:"flex",alignItems:"center",justifyContent:"center",color:CC[selIdx]}}>{CI[selIdx]}</div>
          <div style={{flex:1}}><div style={{fontSize:16,fontWeight:700,color:"#0f172a"}}>({selIdx+1}) {proposals[selIdx].title}</div><div style={{fontSize:12,color:"#64748b"}}>{proposals[selIdx].subtitle}</div></div>
          <div style={{display:"flex",gap:14}}>
            <div style={{textAlign:"center"}}><div style={{fontSize:9.5,color:"#94a3b8",fontWeight:600}}>비용</div><div style={{fontSize:16,fontWeight:700,color:CC[selIdx],fontFamily:"'DM Mono',monospace"}}>{proposals[selIdx].cost}</div></div>
            <div style={{width:1,height:30,background:"#e2e8f0"}}/>
            <div style={{textAlign:"center"}}><div style={{fontSize:9.5,color:"#94a3b8",fontWeight:600}}>기간</div><div style={{fontSize:16,fontWeight:700,color:"#334155"}}>{proposals[selIdx].period}</div></div></div></div>
        <div style={{...caCD,border:`1px solid ${CR[selIdx]}`}}>
          <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:9}}>
            <div style={{width:22,height:22,borderRadius:"50%",background:CC[selIdx],display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}}>{caIC.ai}</div>
            <span style={{fontSize:13,fontWeight:700}}>상세 미리보기 · 절차 안내</span>{!dD&&<CaSp s/>}</div>
          <div style={{fontSize:12.5}}><CaRT text={tD}/></div></div>
        <div style={{padding:"12px 14px",background:"#fff",borderRadius:11,border:"1px solid #e2e8f0",marginTop:12}}>
          <div style={{fontSize:11,color:"#94a3b8",fontWeight:600,marginBottom:8}}>다른 방법 확인</div>
          <div style={{display:"flex",gap:8}}>
            {proposals.map((p,idx)=>idx!==selIdx&&<button key={idx} onClick={()=>showDet(idx)} style={{flex:1,padding:"9px 12px",borderRadius:9,cursor:"pointer",background:CB[idx],border:`1px solid ${CR[idx]}`,display:"flex",alignItems:"center",gap:6,transition:"all .15s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor=CC[idx]} onMouseLeave={e=>e.currentTarget.style.borderColor=CR[idx]}>
              <span style={{color:CC[idx]}}>{CI[idx]}</span><span style={{fontSize:12,fontWeight:600,color:"#334155"}}>{p.title}</span>
              <span style={{marginLeft:"auto",color:CC[idx]}}>{caIC.arr}</span></button>)}</div></div>
      </div>}
    </div>);
}

function ClaimsAgentMVP({ onBack }){
  const[tab,setTab]=useState(0);
  const tabs=[{l:"견적 산정",e:"Estimate",i:caIC.est,c:"#0891b2"},{l:"과실 산정",e:"Fault",i:caIC.flt,c:"#7c3aed"},{l:"처리 방법 제안",e:"Method",i:caIC.mth,c:"#059669"}];
  return(
    <div style={{width:"100%",height:"100vh",fontFamily:"'Noto Sans KR',-apple-system,sans-serif",background:"linear-gradient(155deg,#f8fafc,#f0f9ff 40%,#faf5ff 70%,#f8fafc)",color:"#0f172a",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');
        @keyframes caSpin{to{transform:rotate(360deg)}}@keyframes caFadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        select option{background:#fff;color:#0f172a}button:active{transform:scale(.98)}`}</style>
      <div style={{padding:"12px 26px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid #e2e8f0",background:"rgba(255,255,255,.85)",backdropFilter:"blur(10px)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button onClick={onBack} style={{padding:"6px 14px",borderRadius:8,background:"rgba(8,145,178,0.08)",border:"1px solid rgba(8,145,178,0.2)",color:"#0891b2",fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:5,fontFamily:"inherit"}}>
            ← DMP
          </button>
          <div style={{width:32,height:32,borderRadius:8,background:"linear-gradient(135deg,#0891b2,#7c3aed)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",boxShadow:"0 3px 8px rgba(8,145,178,.2)"}}>{caIC.car}</div>
          <div><div style={{fontSize:15,fontWeight:800,letterSpacing:-.3}}><span style={{color:"#0891b2"}}>AI</span> 손해사정 Portal</div>
            <div style={{color:"#94a3b8",fontSize:9.5,letterSpacing:.4}}>Auto Claims Agent · kt ds AX</div></div></div>
        <div style={{display:"flex",alignItems:"center",gap:5,color:"#94a3b8",fontSize:11}}><div style={{width:6,height:6,borderRadius:"50%",background:"#4ade80",boxShadow:"0 0 5px #4ade80"}}/>Active</div></div>
      <div style={{display:"flex",gap:2,padding:"8px 26px",borderBottom:"1px solid #e2e8f0",background:"rgba(255,255,255,.55)"}}>
        {tabs.map((t,i)=><button key={i} onClick={()=>setTab(i)} style={{display:"flex",alignItems:"center",gap:5,padding:"7px 16px",borderRadius:9,border:"none",cursor:"pointer",background:tab===i?`${t.c}0D`:"transparent",color:tab===i?t.c:"#94a3b8",fontSize:12.5,fontWeight:tab===i?700:500,transition:"all .15s",borderBottom:tab===i?`2px solid ${t.c}`:"2px solid transparent"}}>
          {t.i}<span>{t.l}</span><span style={{fontSize:9.5,opacity:.5,marginLeft:2}}>{t.e}</span></button>)}</div>
      <div style={{flex:1,padding:"14px 26px",overflow:"hidden",minHeight:0}}>
        <div style={{height:"100%",display:tab===0?"block":"none"}}><CaTab1/></div>
        <div style={{height:"100%",display:tab===1?"block":"none"}}><CaTab2/></div>
        <div style={{height:"100%",display:tab===2?"flex":"none",flexDirection:"column"}}><CaTab3/></div></div>
    </div>);
}

// ═══════════════════════════════════════════════════════════════
//  MVP PORTAL
// ═══════════════════════════════════════════════════════════════

const MVP_LIST = [
  {
    id: "security-monitor",
    title: "내부 정보 유출 위험자 식별",
    description: "1,800명 임직원 이상행위 탐지 · AI 의도 추론 · 조치 추천까지 제공하는 실시간 보안 위험 모니터링 대시보드",
    category: "Security",
    status: "Live",
    tags: ["보안관제", "AI분석", "실시간"],
    gradient: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    icon: "🛡️",
    date: "2025.02",
    component: "security",
  },
  {
    id: "stock-portfolio",
    title: "StockPilot 종합 자산관리",
    description: "주식 포트폴리오 · 부동산/자동차 · 지출/연말정산 · AI전략 · 글로벌 시세까지 통합 관리하는 자산 관리 프로그램",
    category: "Finance",
    status: "Live",
    tags: ["자산관리", "포트폴리오", "AI전략"],
    gradient: "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)",
    icon: "📈",
    date: "2025.02",
    component: "stock",
  },
  {
    id: "claims-agent",
    title: "AI 자동차 손해사정 Agent",
    description: "견적 산정 · 과실비율 분석 · 처리방법 제안까지 AI가 의사결정을 지원하는 자동차 손해사정 포탈",
    category: "AI",
    status: "Live",
    tags: ["손해사정", "AI Agent", "보험"],
    gradient: "linear-gradient(135deg, #0c1220, #1a1040, #0d2137)",
    icon: "🚗",
    date: "2025.02",
    component: "claims",
  },
];

const CAT_COLORS = { Security: "#0a84ff", Finance: "#00E5A0", AI: "#c77dff", Data: "#ffd166", DevOps: "#ff6b6b" };

export default function DMPPortal() {
  const [activeMvp, setActiveMvp] = useState(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showRequestList, setShowRequestList] = useState(false);
  const [formData, setFormData] = useState({ name: "", team: "", email: "", title: "", description: "", category: "", deadline: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [requests, setRequests] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [visibleCards, setVisibleCards] = useState(new Set());
  const cardRefs = useRef([]);

  useEffect(() => {
    const h = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setVisibleCards((p) => new Set([...p, e.target.dataset.id])); }),
      { threshold: 0.1 }
    );
    cardRefs.current.forEach((r) => r && observer.observe(r));
    setTimeout(() => setVisibleCards(new Set(MVP_LIST.map(m => m.id))), 300);
    return () => observer.disconnect();
  }, []);

  // Load saved requests on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("dmp-requests");
      if (saved) setRequests(JSON.parse(saved));
    } catch {}
  }, []);

  // Save requests on change
  useEffect(() => {
    try { localStorage.setItem("dmp-requests", JSON.stringify(requests)); } catch {}
  }, [requests]);

  const handleSubmit = () => {
    const newReq = { ...formData, id: Date.now(), submittedAt: new Date().toISOString(), status: "접수" };
    setRequests((prev) => [newReq, ...prev]);
    setFormSubmitted(true);
    setTimeout(() => { setFormSubmitted(false); setShowRequestForm(false); setFormData({ name: "", team: "", email: "", title: "", description: "", category: "", deadline: "" }); }, 2500);
  };

  const updateRequestStatus = (id, status) => {
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
  };

  const deleteRequest = (id) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const cc = (c) => CAT_COLORS[c] || "#a0a0a0";
  const inputStyle = { padding: "12px 14px", borderRadius: 8, background: "#1a1a2a", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: 13, outline: "none", fontFamily: "inherit", width: "100%" };
  const STATUS_COLORS = { "접수": "#5ce1e6", "검토중": "#feca57", "진행중": "#00e5a0", "완료": "#a78bfa", "보류": "#ff6b6b" };

  if (activeMvp === "security") return <SecurityDashboardMVP onBack={() => setActiveMvp(null)} />;
  if (activeMvp === "stock") return <StockPilotMVP onBack={() => setActiveMvp(null)} />;
  if (activeMvp === "claims") return <ClaimsAgentMVP onBack={() => setActiveMvp(null)} />;

  return (
    <div style={{ fontFamily: "'Sora','Noto Sans KR',sans-serif", background: "#08080d", color: "#e0e0e0", minHeight: "100vh", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @keyframes float { 0%,100%{transform:translate(-50%,-50%) scale(1)} 50%{transform:translate(-50%,-50%) scale(1.08)} }
        @keyframes portalPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.5)} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes successPop { 0%{transform:scale(0);opacity:0} 50%{transform:scale(1.2)} 100%{transform:scale(1);opacity:1} }
        ::-webkit-scrollbar{width:6px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:#ffffff15;border-radius:3px}
        select option { background: #1a1a2a; color: #fff; padding: 8px; }
        input[type="date"] { color-scheme: dark; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.7); cursor: pointer; }
      `}</style>

      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0,229,160,0.04), transparent 60%)` }} />

      <header style={{ position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(20px)", background: "rgba(8,8,13,0.85)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg,#00e5a0,#00b880)", display: "flex", alignItems: "center", justifyContent: "center", gap: 1, boxShadow: "0 0 20px rgba(0,229,160,0.3)" }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: "#08080d" }}>D</span><span style={{ fontSize: 15, fontWeight: 700, color: "#08080d" }}>M</span><span style={{ fontSize: 15, fontWeight: 700, color: "#08080d" }}>P</span>
            </div>
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 600, color: "#fff" }}>Deny MVP Portal</h1>
              <p style={{ fontSize: 11, color: "#888", letterSpacing: 0.5, marginTop: 2 }}>kt ds AX BD · Rapid Prototyping Hub</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 20, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#00e5a0" }}>{MVP_LIST.length}</span>
              <span style={{ fontSize: 11, color: "#888" }}>MVPs</span>
            </div>
            <button onClick={() => setShowRequestList(true)} style={{ padding: "10px 16px", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#ccc", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
              📋 의뢰 목록 {requests.length > 0 && <span style={{ background: "#00e5a0", color: "#08080d", fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 10 }}>{requests.length}</span>}
            </button>
            <button onClick={() => setShowRequestForm(true)} style={{ padding: "10px 20px", borderRadius: 8, background: "transparent", border: "1.5px solid #00e5a0", color: "#00e5a0", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.25s ease", fontFamily: "inherit" }}
              onMouseEnter={(e) => { e.target.style.background = "#00e5a0"; e.target.style.color = "#0a0a0f"; }}
              onMouseLeave={(e) => { e.target.style.background = "transparent"; e.target.style.color = "#00e5a0"; }}>
              + MVP 제작 의뢰
            </button>
          </div>
        </div>
      </header>

      <section style={{ position: "relative", maxWidth: 1200, margin: "0 auto", padding: "80px 32px 60px", display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 340 }}>
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ display: "inline-block", padding: "6px 14px", borderRadius: 20, background: "rgba(0,229,160,0.08)", border: "1px solid rgba(0,229,160,0.15)", color: "#00e5a0", fontSize: 12, fontWeight: 500, marginBottom: 24, animation: "fadeInUp 0.6s ease both" }}>🚀 AX Business Development</div>
          <h2 style={{ fontSize: 48, fontWeight: 700, lineHeight: 1.15, color: "#fff", letterSpacing: "-1.5px", animation: "fadeInUp 0.6s ease 0.1s both" }}>Build Fast,<br /><span style={{ background: "linear-gradient(135deg,#00e5a0,#5ce1e6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Validate Faster.</span></h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "#999", marginTop: 20, maxWidth: 440, animation: "fadeInUp 0.6s ease 0.2s both" }}>AX 사업개발팀이 만든 MVP를 직접 체험해보세요.<br />카드를 클릭하면 실제 작동하는 MVP를 바로 사용할 수 있습니다.</p>
        </div>
        <div style={{ position: "relative", width: 260, height: 260 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ position: "absolute", borderRadius: "50%", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 120 + i * 60, height: 120 + i * 60, opacity: 0.15 - i * 0.03, border: `1px solid rgba(0,229,160,${0.3 - i * 0.08})`, animation: `float 4s ease-in-out ${i * 0.8}s infinite` }} />
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px 80px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: "#00e5a0", letterSpacing: 2, textTransform: "uppercase" }}>MVP Showcase</h3>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg,rgba(0,229,160,0.3),transparent)" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
          {MVP_LIST.map((mvp, idx) => (
            <div key={mvp.id}
              ref={(el) => { if (el) { el.dataset.id = mvp.id; cardRefs.current[idx] = el; } }}
              style={{ position: "relative", borderRadius: 16, overflow: "hidden", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", cursor: "pointer", transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)", boxShadow: "0 4px 30px rgba(0,0,0,0.3)", opacity: visibleCards.has(mvp.id) ? 1 : 0, transform: visibleCards.has(mvp.id) ? "translateY(0)" : "translateY(40px)" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-6px) scale(1.01)"; e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,229,160,0.12)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0) scale(1)"; e.currentTarget.style.boxShadow = "0 4px 30px rgba(0,0,0,0.3)"; }}
              onClick={() => setActiveMvp(mvp.component)}>
              <div style={{ position: "absolute", inset: 0, opacity: 0.4, background: mvp.gradient }} />
              <div style={{ position: "relative", padding: 28, zIndex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", padding: "4px 10px", borderRadius: 4, border: "1px solid", color: cc(mvp.category), borderColor: cc(mvp.category) + "44" }}>{mvp.category}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#00e5a0", fontWeight: 500 }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00e5a0", animation: "portalPulse 2s infinite", display: "inline-block" }} />{mvp.status}</span>
                </div>
                <div style={{ fontSize: 40, marginBottom: 16 }}>{mvp.icon}</div>
                <h4 style={{ fontSize: 20, fontWeight: 600, color: "#fff", marginBottom: 10, lineHeight: 1.3 }}>{mvp.title}</h4>
                <p style={{ fontSize: 13, color: "#aaa", lineHeight: 1.6, marginBottom: 20 }}>{mvp.description}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 6 }}>{mvp.tags.map((t) => <span key={t} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 4, background: "rgba(255,255,255,0.06)", color: "#999" }}>{t}</span>)}</div>
                  <span style={{ fontSize: 11, color: "#666" }}>{mvp.date}</span>
                </div>
                <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#00e5a0" }}>체험하기 →</span>
                </div>
              </div>
            </div>
          ))}

          <div style={{ position: "relative", borderRadius: 16, background: "transparent", border: "2px dashed rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 320, cursor: "pointer", transition: "all 0.3s ease" }}
            onClick={() => setShowRequestForm(true)}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#00e5a066"; e.currentTarget.style.transform = "translateY(-4px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#ffffff10"; e.currentTarget.style.transform = "translateY(0)"; }}>
            <div style={{ textAlign: "center", padding: 40 }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(0,229,160,0.08)", border: "1px solid rgba(0,229,160,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: "#00e5a0", margin: "0 auto 16px" }}>+</div>
              <p style={{ fontSize: 15, fontWeight: 600, color: "#ccc" }}>새로운 MVP 제작 의뢰</p>
              <p style={{ fontSize: 12, color: "#666", marginTop: 6 }}>아이디어를 현실로 만들어보세요</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "60px 32px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center", padding: "60px 40px", borderRadius: 20, background: "rgba(0,229,160,0.03)", border: "1px solid rgba(0,229,160,0.1)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-50%", left: "50%", transform: "translateX(-50%)", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,229,160,0.06),transparent 70%)", pointerEvents: "none" }} />
          <h3 style={{ fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 12, position: "relative" }}>MVP가 필요하신가요?</h3>
          <p style={{ fontSize: 14, color: "#999", lineHeight: 1.6, marginBottom: 32, position: "relative" }}>아이디어만 있으면 됩니다. AX BD팀이 빠르게 프로토타입을 만들어드립니다.</p>
          <button onClick={() => setShowRequestForm(true)} style={{ padding: "14px 36px", borderRadius: 10, background: "#00e5a0", color: "#08080d", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "inherit", position: "relative", boxShadow: "0 0 20px rgba(0,229,160,0.2)", transition: "all 0.3s" }}
            onMouseEnter={(e) => { e.target.style.transform = "scale(1.05)"; e.target.style.boxShadow = "0 0 40px rgba(0,229,160,0.4)"; }}
            onMouseLeave={(e) => { e.target.style.transform = "scale(1)"; e.target.style.boxShadow = "0 0 20px rgba(0,229,160,0.2)"; }}>
            MVP 제작 의뢰하기
          </button>
        </div>
      </section>

      <footer style={{ textAlign: "center", padding: 32, borderTop: "1px solid rgba(255,255,255,0.04)", position: "relative", zIndex: 1 }}>
        <p style={{ fontSize: 11, color: "#555" }}>© 2025 Deny MVP Portal · kt ds AX Business Development Team</p>
      </footer>

      {/* Request Form Modal */}
      {showRequestForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }} onClick={() => !formSubmitted && setShowRequestForm(false)}>
          <div style={{ width: "100%", maxWidth: 620, maxHeight: "90vh", overflowY: "auto", borderRadius: 20, background: "#12121a", border: "1px solid rgba(255,255,255,0.08)", padding: 36, position: "relative", boxShadow: "0 40px 100px rgba(0,0,0,0.5)" }} onClick={(e) => e.stopPropagation()}>
            {formSubmitted ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(0,229,160,0.1)", border: "2px solid #00e5a0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, color: "#00e5a0", margin: "0 auto 20px", animation: "successPop 0.5s ease both" }}>✓</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 8 }}>의뢰가 접수되었습니다!</h3>
                <p style={{ fontSize: 13, color: "#999" }}>AX BD팀이 검토 후 연락드리겠습니다.</p>
              </div>
            ) : (
              <>
                <button onClick={() => setShowRequestForm(false)} style={{ position: "absolute", top: 16, right: 16, width: 36, height: 36, borderRadius: "50%", background: "rgba(0,0,0,0.4)", border: "none", color: "#fff", fontSize: 14, cursor: "pointer", zIndex: 10 }}>✕</button>
                <h3 style={{ fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 8 }}>MVP 제작 의뢰</h3>
                <p style={{ fontSize: 13, color: "#888", lineHeight: 1.5, marginBottom: 28 }}>아이디어를 알려주시면 빠르게 프로토타입을 만들어드립니다.</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "#999", letterSpacing: 0.5, textTransform: "uppercase" }}>이름 *</label>
                    <input style={inputStyle} placeholder="홍길동" value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "#999", letterSpacing: 0.5, textTransform: "uppercase" }}>소속 팀 *</label>
                    <input style={inputStyle} placeholder="AX사업본부" value={formData.team} onChange={(e) => setFormData((p) => ({ ...p, team: e.target.value }))} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "#999", letterSpacing: 0.5, textTransform: "uppercase" }}>이메일 *</label>
                    <input style={inputStyle} type="email" placeholder="user@ktds.co.kr" value={formData.email} onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "#999", letterSpacing: 0.5, textTransform: "uppercase" }}>카테고리</label>
                    <select style={{ ...inputStyle, appearance: "auto", cursor: "pointer" }} value={formData.category} onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}>
                      <option value="">선택해주세요</option>
                      <option value="Security">Security</option>
                      <option value="Finance">Finance</option>
                      <option value="AI / ML">AI / ML</option>
                      <option value="Data">Data</option>
                      <option value="DevOps">DevOps</option>
                      <option value="기타">기타</option>
                    </select>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: "1 / -1" }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "#999", letterSpacing: 0.5, textTransform: "uppercase" }}>MVP 제목 *</label>
                    <input style={inputStyle} placeholder="예: AI 기반 고객 이탈 예측 대시보드" value={formData.title} onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: "1 / -1" }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "#999", letterSpacing: 0.5, textTransform: "uppercase" }}>상세 설명 *</label>
                    <textarea style={{ ...inputStyle, minHeight: 120, resize: "vertical" }} placeholder="만들고자 하는 MVP의 핵심 기능과 목적을 설명해주세요..." value={formData.description} onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "#999", letterSpacing: 0.5, textTransform: "uppercase" }}>희망 완료일</label>
                    <input style={{ ...inputStyle, cursor: "pointer" }} type="date" value={formData.deadline} onChange={(e) => setFormData((p) => ({ ...p, deadline: e.target.value }))} />
                  </div>
                </div>
                <button style={{ width: "100%", padding: 14, borderRadius: 10, background: "#00e5a0", color: "#08080d", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", marginTop: 24, fontFamily: "inherit", opacity: formData.name && formData.title && formData.description ? 1 : 0.4, pointerEvents: formData.name && formData.title && formData.description ? "auto" : "none", transition: "all 0.25s" }}
                  onClick={handleSubmit}>
                  의뢰 제출하기
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Request List Modal */}
      {showRequestList && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }} onClick={() => setShowRequestList(false)}>
          <div style={{ width: "100%", maxWidth: 860, maxHeight: "90vh", overflowY: "auto", borderRadius: 20, background: "#12121a", border: "1px solid rgba(255,255,255,0.08)", padding: 36, position: "relative", boxShadow: "0 40px 100px rgba(0,0,0,0.5)" }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowRequestList(false)} style={{ position: "absolute", top: 16, right: 16, width: 36, height: 36, borderRadius: "50%", background: "rgba(0,0,0,0.4)", border: "none", color: "#fff", fontSize: 14, cursor: "pointer", zIndex: 10 }}>✕</button>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <h3 style={{ fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 4 }}>📋 MVP 의뢰 목록</h3>
                <p style={{ fontSize: 13, color: "#888" }}>총 {requests.length}건의 의뢰가 있습니다</p>
              </div>
              <button onClick={() => { setShowRequestList(false); setShowRequestForm(true); }} style={{ padding: "10px 20px", borderRadius: 8, background: "#00e5a0", color: "#08080d", fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                + 새 의뢰
              </button>
            </div>

            {requests.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>📝</div>
                <p style={{ fontSize: 15, color: "#666", marginBottom: 20 }}>아직 의뢰 내역이 없습니다</p>
                <button onClick={() => { setShowRequestList(false); setShowRequestForm(true); }} style={{ padding: "10px 24px", borderRadius: 8, background: "rgba(0,229,160,0.1)", border: "1px solid rgba(0,229,160,0.25)", color: "#00e5a0", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  첫 번째 MVP 의뢰하기
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {requests.map((req) => (
                  <div key={req.id} style={{ padding: "18px 20px", borderRadius: 14, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", transition: "all 0.2s" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                          <h4 style={{ fontSize: 16, fontWeight: 600, color: "#fff" }}>{req.title}</h4>
                          {req.category && <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: (cc(req.category)) + "15", color: cc(req.category), fontWeight: 600 }}>{req.category}</span>}
                        </div>
                        <p style={{ fontSize: 12, color: "#888", lineHeight: 1.5, maxWidth: 500 }}>{req.description.length > 100 ? req.description.slice(0, 100) + "..." : req.description}</p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                        <select value={req.status} onChange={(e) => updateRequestStatus(req.id, e.target.value)}
                          style={{ padding: "6px 10px", borderRadius: 6, background: (STATUS_COLORS[req.status] || "#888") + "15", border: "1px solid " + (STATUS_COLORS[req.status] || "#888") + "40", color: STATUS_COLORS[req.status] || "#888", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", appearance: "auto" }}>
                          {Object.keys(STATUS_COLORS).map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <button onClick={() => deleteRequest(req.id)} style={{ width: 32, height: 32, borderRadius: 6, background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.15)", color: "#ff6b6b", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                      {[
                        { l: "의뢰자", v: `${req.name} (${req.team})` },
                        { l: "이메일", v: req.email },
                        { l: "신청일", v: new Date(req.submittedAt).toLocaleDateString("ko-KR") },
                        ...(req.deadline ? [{ l: "희망일", v: req.deadline }] : []),
                      ].map((m) => (
                        <div key={m.l} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <span style={{ fontSize: 10, color: "#666" }}>{m.l}</span>
                          <span style={{ fontSize: 11, color: "#aaa", fontWeight: 500 }}>{m.v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
