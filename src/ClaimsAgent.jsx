import { useState, useRef, useEffect } from "react";

// ═══════════════════════════════════════════
//  DATA
// ═══════════════════════════════════════════
const VEHICLE_DB = [
  {make:"현대",origin:"국산",models:["아반떼","쏘나타","그랜저","아이오닉5","아이오닉6","투싼","싼타페","팰리세이드","코나","베뉴","캐스퍼","넥쏘","스타리아","포터II","마이티"]},
  {make:"기아",origin:"국산",models:["K3","K5","K8","K9","EV3","EV6","EV9","니로","스포티지","쏘렌토","카니발","모하비","셀토스","레이","봉고III"]},
  {make:"제네시스",origin:"국산",models:["G70","G80","G90","GV60","GV70","GV80","GV80쿠페"]},
  {make:"르노코리아",origin:"국산",models:["XM3","아르카나","QM6","SM6","마스터","그랑 콜레오스"]},
  {make:"KG모빌리티(쌍용)",origin:"국산",models:["토레스","토레스EVX","티볼리","코란도","렉스턴","렉스턴스포츠"]},
  {make:"쉐보레",origin:"국산",models:["트랙스","트레일블레이저","이쿼녹스EV","콜로라도","타호","볼트EV","볼트EUV"]},
  {make:"BMW",origin:"외산",models:["1시리즈","2시리즈 쿠페","3시리즈","4시리즈","5시리즈","7시리즈","8시리즈","i4","i5","i7","iX","iX1","X1","X3","X4","X5","X6","X7","XM","Z4","M2","M3","M4","M5"]},
  {make:"벤츠",origin:"외산",models:["A-Class","C-Class","E-Class","S-Class","CLA","CLE","EQA","EQB","EQE","EQS","GLA","GLB","GLC","GLC쿠페","GLE","GLE쿠페","GLS","G-Class","AMG GT","마이바흐"]},
  {make:"아우디",origin:"외산",models:["A3","A4","A5","A6","A7","A8","Q2","Q3","Q5","Q7","Q8","Q8 e-tron","e-tron GT","RS3","RS6","TT","R8"]},
  {make:"폭스바겐",origin:"외산",models:["골프","골프 GTI","폴로","제타","파사트","아테온","티구안","투아렉","ID.4","ID.7","T-Roc"]},
  {make:"볼보",origin:"외산",models:["S60","S90","V60","XC40","XC60","XC90","C40 Recharge","EX30","EX90"]},
  {make:"포르쉐",origin:"외산",models:["911","718 박스터","718 카이맨","타이칸","파나메라","카이엔","마칸"]},
  {make:"재규어",origin:"외산",models:["XE","XF","F-Type","F-PACE","E-PACE","I-PACE"]},
  {make:"랜드로버",origin:"외산",models:["디펜더","디스커버리","레인지로버","레인지로버 스포츠","레인지로버 벨라","레인지로버 이보크"]},
  {make:"미니",origin:"외산",models:["미니 3도어","미니 5도어","미니 컨트리맨","미니 일렉트릭"]},
  {make:"푸조",origin:"외산",models:["208","308","408","508","2008","3008","5008"]},
  {make:"토요타",origin:"외산",models:["캠리","코롤라","코롤라 크로스","프리우스","bZ4X","RAV4","하이랜더","랜드크루저","GR86","수프라"]},
  {make:"렉서스",origin:"외산",models:["ES","IS","LS","LC","NX","RX","GX","LX","RZ"]},
  {make:"혼다",origin:"외산",models:["시빅","어코드","CR-V","HR-V","파일럿","ZR-V"]},
  {make:"닛산",origin:"외산",models:["알티마","캐시카이","X-Trail","아리아","리프","패스파인더"]},
  {make:"테슬라",origin:"외산",models:["Model 3","Model Y","Model S","Model X","Cybertruck"]},
  {make:"포드",origin:"외산",models:["머스탱","머스탱 마하-E","브롱코","익스플로러","레인저","F-150","F-150 라이트닝"]},
  {make:"링컨",origin:"외산",models:["코세어","노틸러스","에비에이터","내비게이터"]},
  {make:"캐딜락",origin:"외산",models:["CT5","리릭","에스컬레이드","XT4","XT5","XT6"]},
  {make:"지프",origin:"외산",models:["랭글러","그랜드 체로키","컴패스","레니게이드","글래디에이터"]},
  {make:"리비안",origin:"외산",models:["R1T","R1S"]},
  {make:"BYD",origin:"외산",models:["ATTO 3","씰","돌핀","한","탕","송 플러스"]},
  {make:"페라리",origin:"외산",models:["296 GTB","SF90","F8","812","로마","푸로산게"]},
  {make:"람보르기니",origin:"외산",models:["우라칸","레부엘토","우루스"]},
  {make:"벤틀리",origin:"외산",models:["컨티넨탈 GT","플라잉스퍼","벤테이가"]},
  {make:"롤스로이스",origin:"외산",models:["고스트","팬텀","레이스","컬리넌","스펙터"]},
  {make:"맥라렌",origin:"외산",models:["750S","아투라","GT"]},
  {make:"애스턴마틴",origin:"외산",models:["밴티지","DB12","DBS","DBX"]},
  {make:"마세라티",origin:"외산",models:["기블리","MC20","그레칼레","레반떼","그란투리스모"]},
  {make:"로터스",origin:"외산",models:["에미라","엘레트레"]},
  {make:"마쯔다",origin:"외산",models:["MAZDA3","CX-30","CX-5","CX-60","MX-5"]},
];

const DAMAGE_CATS = {
  "전면부": ["프론트 범퍼(상)","프론트 범퍼(하/립)","본넷","프론트 그릴","라디에이터","인터쿨러","좌 헤드라이트","우 헤드라이트","좌 안개등","우 안개등","전면 유리","와이퍼","프론트 엠블럼","전방 카메라/센서","어라운드뷰 전면"],
  "후면부": ["리어 범퍼(상)","리어 범퍼(하/디퓨저)","트렁크/테일게이트","좌 리어램프","우 리어램프","리어 유리","리어 스포일러","리어 엠블럼","후방 카메라","후방 주차센서","번호판등","머플러/배기팁"],
  "좌측면": ["좌 프론트 펜더","좌 A필러","좌 프론트 도어","좌 B필러","좌 리어 도어","좌 C필러","좌 리어쿼터패널","좌 사이드미러","좌 도어핸들","좌 사이드몰딩","좌 도어유리(전)","좌 도어유리(후)"],
  "우측면": ["우 프론트 펜더","우 A필러","우 프론트 도어","우 B필러","우 리어 도어","우 C필러","우 리어쿼터패널","우 사이드미러","우 도어핸들","우 사이드몰딩","우 도어유리(전)","우 도어유리(후)"],
  "상부": ["루프패널","선루프 유리","선루프 프레임","루프랙/레일","안테나/샤크핀"],
  "하부/구조": ["프론트 서브프레임","리어 서브프레임","좌 사이드실(로커패널)","우 사이드실(로커패널)","플로어패널","언더커버","연료탱크/배터리팩"],
  "휠/서스펜션": ["좌 전륜 휠/타이어","우 전륜 휠/타이어","좌 후륜 휠/타이어","우 후륜 휠/타이어","좌 전 서스펜션","우 전 서스펜션","좌 후 서스펜션","우 후 서스펜션","스티어링 링키지","브레이크(전)","브레이크(후)"],
  "기타/ADAS": ["에어백(운전석)","에어백(조수석)","사이드/커튼 에어백","계기판/클러스터","AVN/인포테인먼트","에어컨/냉방","전방 레이더","후측방 레이더(좌)","후측방 레이더(우)","라이다","카메라 캘리브레이션","12V 배터리","고전압 배터리(EV)","충전포트(EV)"],
};
const ALL_PARTS = Object.values(DAMAGE_CATS).flat();
const ACCIDENT_TYPES = ["후미추돌(통상 뒤차 우선 과실)","차대차-교차로-신호위반/직진-좌회전","차대차-동일방향-차선변경 접촉","차대차-교차로-직진-우회전","차대차-대향-중앙선 침범","차대차-주차장내 접촉","차대물-고정물 충돌(가드레일/전주)","차대인-횡단보도 보행자","차대차-후진 접촉","단독사고-빗길 미끄러짐"];
const ROAD_TYPES=["일반도로","고속도로","주차장","골목길/이면도로","교차로"];
const WEATHER_TYPES=["맑음","비","눈","안개","강풍","흐림"];
const SIGNAL_STATES=["정상신호","황색신호","적색신호","점멸","신호없음"];
const PP={"프론트 범퍼":{p:[180000,350000],l:[180000,280000]},"리어 범퍼":{p:[160000,320000],l:[170000,260000]},"본넷":{p:[300000,550000],l:[220000,350000]},"좌측 펜더":{p:[150000,280000],l:[130000,220000]},"우측 펜더":{p:[150000,280000],l:[130000,220000]},"좌측 도어":{p:[200000,400000],l:[160000,280000]},"우측 도어":{p:[200000,400000],l:[160000,280000]},"트렁크":{p:[250000,480000],l:[180000,300000]},"헤드라이트":{p:[180000,450000],l:[80000,150000]},"리어램프":{p:[120000,350000],l:[60000,120000]},"전면 유리":{p:[200000,600000],l:[100000,200000]},"루프":{p:[400000,800000],l:[300000,500000]},"사이드미러":{p:[80000,250000],l:[40000,80000]},"그릴":{p:[60000,200000],l:[40000,80000]},"라디에이터":{p:[250000,500000],l:[150000,300000]}};
const CASES=[
  {id:"CLM-2025-0001",date:"2025-10-17",type:"차선변경 접촉",make:"기아",model:"K5 노블레스(GT-Line)",parts:"휀다, 그릴",severity:"경미",status:"종결",fault:"가해자70%/피해자30%",cost:720000,rental:"기아 K8/2일",channel:"현장접수",region:"서울"},
  {id:"CLM-2025-0015",date:"2025-03-08",type:"교차로-신호위반",make:"현대",model:"팰리세이드 캘리그래피",parts:"프론트범퍼,헤드라이트,좌측펜더",severity:"중간",status:"미결",fault:"A20%/B80%",cost:2850000,rental:"GV80/7일",channel:"APP",region:"경기"},
  {id:"CLM-2025-0042",date:"2025-05-12",type:"대향-중앙선 침범",make:"제네시스",model:"GV80 프레스티지",parts:"프론트범퍼,본넷,우측펜더,우측도어,헤드라이트",severity:"심각",status:"미결",fault:"A10%/B90%",cost:5200000,rental:"G80/14일",channel:"콜센터",region:"서울"},
  {id:"CLM-2025-0078",date:"2025-07-22",type:"고정물 충돌",make:"BMW",model:"520d 럭셔리",parts:"프론트범퍼,좌측펜더,헤드라이트,라디에이터",severity:"심각",status:"민원",fault:"단독100%",cost:4800000,rental:"520i/10일",channel:"APP",region:"대전"},
  {id:"CLM-2025-0103",date:"2025-09-05",type:"주차장 접촉",make:"벤츠",model:"E300 아방가르드",parts:"리어범퍼,트렁크",severity:"경미",status:"종결",fault:"A45%/B55%",cost:980000,rental:"없음",channel:"모바일앱",region:"부산"},
  {id:"CLM-2025-0156",date:"2025-11-18",type:"후미추돌",make:"현대",model:"아반떼 프리미엄",parts:"리어범퍼,트렁크,리어램프",severity:"중간",status:"미결",fault:"A0%/B100%",cost:1650000,rental:"아반떼/5일",channel:"콜센터",region:"광주"},
  {id:"CLM-2025-0200",date:"2025-12-01",type:"후진 접촉",make:"기아",model:"쏘렌토 시그니처",parts:"리어범퍼",severity:"경미",status:"종결",fault:"A20%/B80%",cost:380000,rental:"없음",channel:"현장접수",region:"울산"},
  {id:"CLM-2025-0002",date:"2025-01-23",type:"후미추돌",make:"르노코리아",model:"SM6(캘리그래피)",parts:"본넷",severity:"경미",status:"과실협의",fault:"협의중",cost:450000,rental:"없음",channel:"콜센터",region:"인천"},
];

const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const F=n=>"₩"+n.toLocaleString();

async function callAI(s,m){try{const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:s,messages:[{role:"user",content:m}]})});const d=await r.json();return d.content?.[0]?.text||"응답 실패";}catch(e){return"API 오류: "+e.message;}}

function useTW(t,sp=10){const[d,sD]=useState("");const[dn,sN]=useState(false);useEffect(()=>{if(!t){sD("");sN(false);return;}sD("");sN(false);let i=0;const iv=setInterval(()=>{i++;sD(t.slice(0,i));if(i>=t.length){clearInterval(iv);sN(true);}},sp);return()=>clearInterval(iv);},[t,sp]);return{displayed:d,done:dn};}

// ═══ ICONS ═══
const IC={
  car:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 17h14M5 17a2 2 0 01-2-2V9a2 2 0 012-2h.93a2 2 0 001.66-.9l.82-1.2A2 2 0 0110.07 4h3.86a2 2 0 011.66.9l.82 1.2a2 2 0 001.66.9H19a2 2 0 012 2v6a2 2 0 01-2 2"/><circle cx="8" cy="14" r="1"/><circle cx="16" cy="14" r="1"/></svg>,
  ai:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a4 4 0 014 4v2h2a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8a2 2 0 012-2h2V6a4 4 0 014-4z"/><circle cx="9" cy="14" r="1" fill="currentColor"/><circle cx="15" cy="14" r="1" fill="currentColor"/></svg>,
  est:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  flt:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>,
  mth:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  up:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
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

// ═══ SHARED ═══
function RT({text}){if(!text)return null;return<div style={{lineHeight:1.75}}>{text.split("\n").map((l,i)=>{
  if(l.startsWith("###"))return<h4 key={i} style={{color:"#0891b2",margin:"11px 0 3px",fontSize:13,fontWeight:700}}>{l.replace(/^###\s*/,"")}</h4>;
  if(l.startsWith("##"))return<h3 key={i} style={{color:"#0f172a",margin:"13px 0 5px",fontSize:14.5,fontWeight:700}}>{l.replace(/^##\s*/,"")}</h3>;
  if(l.startsWith("**")&&l.endsWith("**"))return<p key={i} style={{fontWeight:700,color:"#0f172a",margin:"5px 0"}}>{l.replace(/\*\*/g,"")}</p>;
  if(l.startsWith("- ")||l.startsWith("• "))return<div key={i} style={{paddingLeft:14,margin:"2px 0",color:"#475569"}}><span style={{color:"#0891b2",marginRight:7,fontSize:8}}>●</span>{l.replace(/^[-•]\s*/,"").replace(/\*\*(.*?)\*\*/g,"$1")}</div>;
  if(l.startsWith("※")||l.startsWith("⚠"))return<p key={i} style={{color:"#d97706",margin:"4px 0",fontSize:12}}>{l}</p>;
  if(!l.trim())return<div key={i} style={{height:4}}/>;
  return<p key={i} style={{margin:"2px 0",color:"#475569"}}>{l.replace(/\*\*(.*?)\*\*/g,"$1")}</p>;
})}</div>;}
function Sp({s}){return<div style={{width:s?13:17,height:s?13:17,border:"2px solid #e2e8f0",borderTop:"2px solid #0891b2",borderRadius:"50%",animation:"spin .8s linear infinite",display:"inline-block"}}/>;}
function Em({text}){return<div style={{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",color:"#94a3b8",gap:10,minHeight:260}}><div style={{width:48,height:48,borderRadius:14,background:"#f8fafc",display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid #e2e8f0"}}>{IC.car}</div><div style={{fontSize:13,textAlign:"center",maxWidth:280}}>{text}</div></div>;}
function SB({label,value,onChange,opts}){return<div><label style={LB}>{label}</label><select value={value} onChange={e=>onChange(e.target.value)} style={SL}><option value="">선택</option>{opts.map(o=><option key={o} value={o}>{o}</option>)}</select></div>;}
function IB({label,value,onChange,ph}){return<div><label style={LB}>{label}</label><input type="number" value={value} onChange={e=>onChange(e.target.value)} placeholder={ph} style={IN}/></div>;}
function MC({label,value,ac,big}){return<div style={{background:"#fff",borderRadius:10,padding:"10px 12px",border:big?`2px solid ${ac}`:"1px solid #e2e8f0"}}><div style={{color:"#94a3b8",fontSize:10,fontWeight:600,marginBottom:2}}>{label}</div><div style={{color:ac||"#0f172a",fontSize:big?15:13,fontWeight:700,fontFamily:"'DM Mono',monospace"}}>{value}</div></div>;}

const CD={background:"#fff",border:"1px solid #e2e8f0",borderRadius:14,padding:"16px 18px",marginBottom:13};
const ST={color:"#94a3b8",fontSize:11.5,fontWeight:600,margin:"0 0 10px",display:"flex",alignItems:"center",gap:6,letterSpacing:.3};
const SL={width:"100%",padding:"7px 11px",borderRadius:8,fontSize:12.5,background:"#f8fafc",border:"1px solid #e2e8f0",color:"#0f172a",outline:"none"};
const IN={width:"100%",padding:"7px 11px",borderRadius:8,fontSize:12.5,background:"#f8fafc",border:"1px solid #e2e8f0",color:"#0f172a",outline:"none",boxSizing:"border-box"};
const LB={color:"#94a3b8",fontSize:10,marginBottom:2,display:"block",fontWeight:600};
const TA={width:"100%",padding:"9px 13px",borderRadius:10,fontSize:12.5,background:"#f8fafc",border:"1px solid #e2e8f0",color:"#0f172a",outline:"none",resize:"vertical",fontFamily:"inherit",boxSizing:"border-box",lineHeight:1.6};
const BT={width:"100%",padding:"12px 0",borderRadius:10,border:"none",cursor:"pointer",color:"#fff",fontSize:13.5,fontWeight:700,letterSpacing:.4,transition:"all .3s"};

// ═══ TAB 1: 견적 산정 (확장) ═══
function Tab1(){
  const[origin,setOrigin]=useState("전체");
  const[mk,sMk]=useState("");const[md,sMd]=useState("");const[yr,sYr]=useState("");const[ml,sMl]=useState("");
  const[sp,sSp]=useState([]);const[sv,sSv]=useState("중간");const[openCat,setOpenCat]=useState(null);
  const[rs,sRs]=useState(null);const[ld,sLd]=useState(false);const[at,sAt]=useState("");
  const[ph,sPh]=useState([]);const[pvIdx,sPvIdx]=useState(null);
  const[aiDetecting,setAiDetecting]=useState(false);const[aiDetected,setAiDetected]=useState(null);
  const{displayed:tA,done:aD}=useTW(at);
  const fr=useRef(null);

  const filteredMakes=VEHICLE_DB.filter(v=>origin==="전체"||v.origin===origin);
  const makeEntry=VEHICLE_DB.find(v=>v.make===mk);
  const models=makeEntry?.models||[];
  const yrs=Array.from({length:15},(_,i)=>String(2025-i));

  const toggle=p=>sSp(v=>v.includes(p)?v.filter(x=>x!==p):[...v,p]);
  const addPhotos=(e)=>{const files=Array.from(e.target.files);const np=files.slice(0,10-ph.length).map(f=>({name:f.name,url:URL.createObjectURL(f),size:(f.size/1024/1024).toFixed(1)}));sPh(prev=>[...prev,...np].slice(0,10));if(fr.current)fr.current.value="";};
  const removePhoto=(idx)=>{sPh(prev=>prev.filter((_,i)=>i!==idx));if(pvIdx===idx)sPvIdx(null);else if(pvIdx!==null&&pvIdx>idx)sPvIdx(pvIdx-1);};

  const autoDetect=async()=>{
    if(!ph.length)return;
    setAiDetecting(true);setAiDetected(null);
    const sys=`당신은 자동차 사고 사진 분석 전문 AI입니다. 사용자가 사진 ${ph.length}장을 업로드했습니다.
사진 파일명, 장수, 차량정보를 기반으로 파손 부위와 파손 정도를 추정하세요.
JSON만 응답(다른 텍스트 없이):
{"parts":["부위1","부위2"],"severity":"경미/중간/심각/전손 추정","confidence":"높음/보통/낮음","memo":"한줄 설명"}
부위는 반드시 이 목록에서만 선택: ${ALL_PARTS.join(",")}`;
    const msg=`사진 ${ph.length}장. 파일명: ${ph.map(p=>p.name).join(", ")}\n차량: ${mk||"미상"} ${md||"미상"}\n현재 선택: ${sp.join(",")||"없음"}\n사진 파일명과 차량 정보로 파손 부위/정도를 추정하세요.`;
    const res=await callAI(sys,msg);
    try{
      const obj=JSON.parse(res.replace(/```json|```/g,"").trim());
      setAiDetected(obj);
      if(obj.parts?.length)sSp(prev=>{const m=new Set([...prev,...obj.parts.filter(p=>ALL_PARTS.includes(p))]);return[...m];});
      if(obj.severity)sSv(obj.severity);
    }catch{setAiDetected({parts:[],severity:"중간",confidence:"낮음",memo:"파싱 실패. 수동 선택해주세요."});}
    setAiDetecting(false);
  };

  const sM={"경미":.6,"중간":1,"심각":1.5,"전손 추정":2.2};
  const sC={"경미":"#16a34a","중간":"#d97706","심각":"#dc2626","전손 추정":"#7f1d1d"};
  const isImport=makeEntry?.origin==="외산";
  const isSuper=["페라리","람보르기니","벤틀리","롤스로이스","맥라렌","애스턴마틴","부가티","마세라티","포르쉐","로터스"].includes(mk);
  const catColors={"전면부":"#0891b2","후면부":"#7c3aed","좌측면":"#2563eb","우측면":"#059669","상부":"#d97706","하부/구조":"#dc2626","휠/서스펜션":"#6366f1","기타/ADAS":"#0d9488"};

  const calc=async()=>{if(!mk||!md||!sp.length)return;sLd(true);sRs(null);sAt("");
    const impM=isSuper?3.0:isImport?1.6:1.0;
    const m=sM[sv]*impM*(yr&&2025-+yr>5?.85:1);
    const bd=sp.map(p=>{const base=PP[p]||{p:[120000,280000],l:[80000,200000]};const pc=Math.round(R(base.p[0],base.p[1])*m);const lc=Math.round(R(base.l[0],base.l[1])*m);return{pt:p,pc,lc,t:pc+lc};});
    const tp=bd.reduce((s,b)=>s+b.pc,0),tl=bd.reduce((s,b)=>s+b.lc,0),pt=Math.round(sp.length*R(60000,160000)*m);
    sRs({bd,tp,tl,pt,gt:tp+tl+pt,vh:`${mk} ${md} ${yr||""}`});
    const a=await callAI("당신은 자동차 손해사정 전문 AI입니다. 견적 분석을 간결하게 해주세요.",
      `차량:${mk} ${md} ${yr||"미상"}년식 (${isImport?"외산":"국산"}${isSuper?" 슈퍼카":""})\n파손:${sp.join(",")}(${sv})\n사진:${ph.length}장\n견적:부품${F(tp)},공임${F(tl)},도장${F(pt)},합계${F(tp+tl+pt)}\n\n견적 적정성, 수리vs교환, 미수선처리, ADAS캘리브레이션, 부품수급 등을 분석해주세요.`);
    sAt(a);sLd(false);
  };

  return(
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,height:"100%"}}>
      {/* Photo Preview Modal */}
      {pvIdx!==null&&ph[pvIdx]&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",backdropFilter:"blur(6px)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>sPvIdx(null)}>
        <div onClick={e=>e.stopPropagation()} style={{position:"relative",maxWidth:"85vw",maxHeight:"85vh",display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
          <button onClick={()=>sPvIdx(null)} style={{position:"absolute",top:-10,right:-10,width:30,height:30,borderRadius:"50%",background:"#fff",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px rgba(0,0,0,.2)",zIndex:10,color:"#64748b"}}>{IC.x}</button>
          <img src={ph[pvIdx].url} style={{maxWidth:"85vw",maxHeight:"70vh",borderRadius:12,objectFit:"contain",boxShadow:"0 16px 48px rgba(0,0,0,.3)"}}/>
          <div style={{background:"rgba(255,255,255,.95)",borderRadius:8,padding:"6px 16px",display:"flex",alignItems:"center",gap:14}}>
            <span style={{fontSize:12.5,fontWeight:600}}>{ph[pvIdx].name}</span>
            <span style={{fontSize:11,color:"#94a3b8"}}>{ph[pvIdx].size}MB · {pvIdx+1}/{ph.length}</span></div>
          {ph.length>1&&<div style={{display:"flex",gap:5}}>{ph.map((p,i)=><img key={i} src={p.url} onClick={e=>{e.stopPropagation();sPvIdx(i)}} style={{width:48,height:48,borderRadius:6,objectFit:"cover",cursor:"pointer",border:i===pvIdx?"3px solid #0891b2":"3px solid transparent",opacity:i===pvIdx?1:.5}}/>)}</div>}
          {ph.length>1&&<>
            <button onClick={e=>{e.stopPropagation();sPvIdx((pvIdx-1+ph.length)%ph.length)}} style={{position:"absolute",left:-18,top:"44%",width:36,height:36,borderRadius:"50%",background:"rgba(255,255,255,.9)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 3px 10px rgba(0,0,0,.12)"}}>{IC.bk}</button>
            <button onClick={e=>{e.stopPropagation();sPvIdx((pvIdx+1)%ph.length)}} style={{position:"absolute",right:-18,top:"44%",width:36,height:36,borderRadius:"50%",background:"rgba(255,255,255,.9)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 3px 10px rgba(0,0,0,.12)"}}>{IC.arr}</button>
          </>}
        </div></div>}

      {/* ═══ LEFT: 입력 ═══ */}
      <div style={{overflowY:"auto",paddingRight:6}}>
        {/* 차량 정보 */}
        <div style={CD}>
          <h3 style={ST}>{IC.car}<span>차량 정보</span></h3>
          <div style={{display:"flex",gap:4,marginBottom:10}}>
            {["전체","국산","외산"].map(o=><button key={o} onClick={()=>{setOrigin(o);sMk("");sMd("")}} style={{
              flex:1,padding:"6px 0",borderRadius:7,fontSize:11.5,cursor:"pointer",fontWeight:origin===o?700:400,
              background:origin===o?(o==="국산"?"#0891b2":o==="외산"?"#7c3aed":"#475569"):"#f8fafc",
              color:origin===o?"#fff":"#94a3b8",border:origin===o?"none":"1px solid #e2e8f0",
            }}>{o==="전체"?"전체":o==="국산"?"🇰🇷 국산":"🌍 외산"}</button>)}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
            <div><label style={LB}>제조사 {makeEntry&&<span style={{color:isImport?"#7c3aed":"#0891b2",fontSize:9}}>({makeEntry.origin})</span>}</label>
              <select value={mk} onChange={e=>{sMk(e.target.value);sMd("")}} style={SL}><option value="">선택</option>
                {filteredMakes.map(v=><option key={v.make} value={v.make}>{v.make}</option>)}</select></div>
            <div><label style={LB}>모델</label>
              <select value={md} onChange={e=>sMd(e.target.value)} style={SL}><option value="">선택</option>
                {models.map(m=><option key={m} value={m}>{m}</option>)}</select></div>
            <SB label="연식" value={yr} onChange={sYr} opts={yrs}/>
            <IB label="주행거리(km)" value={ml} onChange={sMl} ph="35874"/>
          </div>
          {isSuper&&<div style={{marginTop:8,padding:"5px 10px",borderRadius:7,background:"#fef3c7",border:"1px solid #fde68a",fontSize:11,color:"#92400e"}}>⚠️ 슈퍼카/럭셔리 — 부품비 할증(3x) 적용</div>}
          {isImport&&!isSuper&&<div style={{marginTop:8,padding:"5px 10px",borderRadius:7,background:"#f5f3ff",border:"1px solid #ddd6fe",fontSize:11,color:"#6d28d9"}}>🌍 외산 차량 — 부품비 할증(1.6x) 적용</div>}
        </div>

        {/* 사진 업로드 */}
        <div style={CD}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <h3 style={{...ST,margin:0}}>{IC.up}<span>사고 사진</span></h3>
            <span style={{fontSize:10,color:ph.length>=10?"#dc2626":"#94a3b8",fontWeight:600}}>{ph.length}/10</span></div>
          <div onClick={()=>ph.length<10&&fr.current?.click()} style={{
            border:"2px dashed "+(ph.length>=10?"#fca5a5":"#e2e8f0"),borderRadius:10,padding:ph.length?10:16,textAlign:"center",
            cursor:ph.length>=10?"not-allowed":"pointer",color:ph.length>=10?"#f87171":"#94a3b8",fontSize:12,background:ph.length>=10?"#fef2f2":"#fafbfc",
          }}><input ref={fr} type="file" accept="image/*" multiple onChange={addPhotos} style={{display:"none"}}/>
            {!ph.length?<div><div style={{marginBottom:4,color:"#cbd5e1"}}>{IC.up}</div>클릭하여 업로드 (최대10장)</div>:
             ph.length<10?<span style={{fontSize:11}}>+ 추가 ({10-ph.length}장 남음)</span>:<span style={{fontSize:11}}>최대 10장 완료</span>}
          </div>
          {ph.length>0&&<div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:5,marginTop:8}}>
            {ph.map((p,i)=><div key={i} style={{position:"relative",aspectRatio:"1",borderRadius:8,overflow:"hidden",border:"1px solid #e2e8f0",cursor:"pointer"}} onClick={()=>sPvIdx(i)}>
              <img src={p.url} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
              <button onClick={e=>{e.stopPropagation();removePhoto(i)}} style={{position:"absolute",top:2,right:2,width:16,height:16,borderRadius:"50%",background:"rgba(0,0,0,.5)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",padding:0}}>{IC.x}</button>
              <div style={{position:"absolute",bottom:2,left:2,background:"rgba(0,0,0,.5)",color:"#fff",fontSize:8,fontWeight:600,padding:"1px 4px",borderRadius:5}}>{i+1}</div>
            </div>)}
          </div>}
          {ph.length>0&&<button onClick={autoDetect} disabled={aiDetecting} style={{
            marginTop:8,width:"100%",padding:"8px 0",borderRadius:8,border:"1px solid #a5f3fc",background:"#ecfeff",
            color:"#0891b2",fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,
          }}>{aiDetecting?<><Sp s/> AI 분석 중...</>:<>{IC.ai} 사진 기반 AI 자동 감지</>}</button>}
          {aiDetected&&<div style={{marginTop:8,padding:"8px 12px",borderRadius:8,background:"#f0fdf4",border:"1px solid #bbf7d0",fontSize:11.5}}>
            <div style={{fontWeight:700,color:"#16a34a",marginBottom:3}}>AI 감지 완료 <span style={{fontWeight:400,color:"#6b7280"}}>(신뢰도: {aiDetected.confidence})</span></div>
            <div style={{color:"#475569"}}>{aiDetected.memo}</div>
            {aiDetected.parts?.length>0&&<div style={{marginTop:4,display:"flex",flexWrap:"wrap",gap:3}}>
              {aiDetected.parts.map((p,i)=><span key={i} style={{background:"#dcfce7",color:"#16a34a",padding:"2px 7px",borderRadius:10,fontSize:10,fontWeight:600}}>✓ {p}</span>)}
            </div>}
            <div style={{marginTop:4,color:"#6b7280",fontSize:10.5}}>파손 정도: <strong style={{color:sC[aiDetected.severity]||"#334155"}}>{aiDetected.severity}</strong> (자동 적용)</div>
          </div>}
        </div>

        {/* 파손 부위 - 카테고리 */}
        <div style={CD}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <h3 style={{...ST,margin:0}}>파손 부위</h3>
            <span style={{fontSize:10.5,color:"#0891b2",fontWeight:600}}>{sp.length}개 선택</span></div>
          {sp.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:3,marginBottom:8,padding:"6px 8px",background:"#f0f9ff",borderRadius:8,border:"1px solid #bae6fd"}}>
            {sp.map((p,i)=><span key={i} style={{display:"flex",alignItems:"center",gap:3,background:"#0891b2",color:"#fff",padding:"2px 8px",borderRadius:12,fontSize:10,fontWeight:600}}>
              {p}<button onClick={()=>toggle(p)} style={{background:"none",border:"none",cursor:"pointer",color:"#fff",padding:0,marginLeft:2,display:"flex"}}>{IC.x}</button></span>)}
          </div>}
          <div style={{display:"flex",flexDirection:"column",gap:3}}>
            {Object.entries(DAMAGE_CATS).map(([cat,parts])=>{
              const cnt=parts.filter(p=>sp.includes(p)).length;
              const open=openCat===cat;const col=catColors[cat]||"#64748b";
              return<div key={cat}>
                <button onClick={()=>setOpenCat(open?null:cat)} style={{
                  width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",
                  padding:"7px 10px",borderRadius:8,border:"1px solid "+(open?col:"#e2e8f0"),cursor:"pointer",
                  background:open?`${col}08`:"#fafbfc",fontSize:12,fontWeight:600,color:open?col:"#475569",transition:"all .15s",
                }}>
                  <span>{cat}{cnt>0&&<span style={{background:col,color:"#fff",padding:"1px 6px",borderRadius:8,fontSize:9,marginLeft:4}}>{cnt}</span>}</span>
                  <span style={{fontSize:10,transform:open?"rotate(180deg)":"none",transition:"transform .2s"}}>▼</span>
                </button>
                {open&&<div style={{display:"flex",flexWrap:"wrap",gap:4,padding:"8px 4px"}}>
                  {parts.map(p=><button key={p} onClick={()=>toggle(p)} style={{
                    padding:"3px 9px",borderRadius:14,fontSize:10.5,cursor:"pointer",
                    background:sp.includes(p)?col:"#fff",color:sp.includes(p)?"#fff":"#64748b",
                    border:`1px solid ${sp.includes(p)?col:"#e2e8f0"}`,fontWeight:sp.includes(p)?600:400,transition:"all .12s",
                  }}>{sp.includes(p)?"✓ ":""}{p}</button>)}
                </div>}
              </div>;})}
          </div>
        </div>

        {/* 파손 정도 */}
        <div style={CD}>
          <h3 style={ST}>파손 정도</h3>
          <div style={{display:"flex",gap:5}}>
            {Object.keys(sM).map(s=><button key={s} onClick={()=>sSv(s)} style={{flex:1,padding:"6px 0",borderRadius:7,fontSize:12,cursor:"pointer",background:sv===s?sC[s]:"#f8fafc",color:sv===s?"#fff":"#94a3b8",border:sv===s?"none":"1px solid #e2e8f0",fontWeight:sv===s?700:400}}>{s}</button>)}
          </div>
          {aiDetected&&sv===aiDetected.severity&&<div style={{marginTop:5,fontSize:10,color:"#16a34a"}}>✓ AI 자동 판정 적용됨</div>}
        </div>

        <button onClick={calc} disabled={ld||!mk||!md||!sp.length} style={{...BT,background:ld?"#e2e8f0":"#0891b2",opacity:(!mk||!md||!sp.length)?.4:1,flexShrink:0}}>{ld?<Sp/>:"견적 산정 실행"}</button>
      </div>

      {/* ═══ RIGHT: 결과 ═══ */}
      <div style={{overflowY:"auto"}}>{!rs&&!ld&&<Em text="차량과 파손 부위 선택 후 실행하세요"/>}
        {rs&&<div style={{animation:"fadeIn .4s"}}>
          <div style={{...CD,border:"2px solid #a5f3fc"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <h3 style={{color:"#0f172a",fontSize:15.5,fontWeight:700,margin:0}}>예상 견적</h3>
            <div style={{display:"flex",gap:6,alignItems:"center"}}>
              {rs.isImport&&<span style={{background:"#f5f3ff",padding:"3px 8px",borderRadius:12,color:"#7c3aed",fontSize:10,fontWeight:600}}>{rs.isSuper?"슈퍼카":"외산"}</span>}
              <span style={{background:"#ecfeff",padding:"3px 11px",borderRadius:18,color:"#0891b2",fontSize:11.5,fontWeight:600}}>{rs.vh}</span>
            </div></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:9}}>
              <MC label="부품비" value={F(rs.tp)} ac="#2563eb"/><MC label="공임비" value={F(rs.tl)} ac="#7c3aed"/>
              <MC label="도장비" value={F(rs.pt)} ac="#d97706"/><MC label="합계" value={F(rs.gt)} ac="#0891b2" big/></div></div>
          <div style={CD}><h3 style={ST}>세부 산출 ({rs.bd.length}개 부위)</h3>
            <div style={{maxHeight:260,overflowY:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}><thead><tr style={{borderBottom:"2px solid #e2e8f0",position:"sticky",top:0,background:"#fff"}}>
              <th style={{textAlign:"left",padding:"8px 10px",color:"#94a3b8",fontSize:11,fontWeight:600}}>부위</th>
              <th style={{textAlign:"left",padding:"8px 10px",color:"#94a3b8",fontSize:11,fontWeight:600}}>부품비</th>
              <th style={{textAlign:"left",padding:"8px 10px",color:"#94a3b8",fontSize:11,fontWeight:600}}>공임비</th>
              <th style={{textAlign:"left",padding:"8px 10px",color:"#94a3b8",fontSize:11,fontWeight:600}}>소계</th></tr></thead>
              <tbody>{rs.bd.map((b,i)=><tr key={i} style={{borderBottom:"1px solid #f1f5f9"}}>
                <td style={{padding:"7px 10px",color:"#475569",fontSize:11.5}}>{b.pt}</td>
                <td style={{padding:"7px 10px",color:"#2563eb",fontSize:11.5}}>{F(b.pc)}</td>
                <td style={{padding:"7px 10px",color:"#7c3aed",fontSize:11.5}}>{F(b.lc)}</td>
                <td style={{padding:"7px 10px",fontWeight:600,fontSize:11.5}}>{F(b.t)}</td></tr>)}</tbody></table>
            </div></div>
          <div style={{...CD,border:"1px solid #a5f3fc"}}><div style={{display:"flex",alignItems:"center",gap:7,marginBottom:9}}>
            <div style={{width:22,height:22,borderRadius:"50%",background:"#0891b2",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}}>{IC.ai}</div>
            <span style={{fontSize:13,fontWeight:700}}>AI 분석</span>{!aD&&at&&<Sp s/>}</div>
            <div style={{fontSize:12.5}}><RT text={tA}/></div></div>
        </div>}
      </div></div>);
}

// ═══ TAB 2: 과실 ═══
function Tab2(){
  const[at,sAt]=useState("");const[rt,sRt]=useState("");const[wt,sWt]=useState("");const[sg,sSg]=useState("");
  const[mD,sMd]=useState("");const[oD,sOd]=useState("");const[dc,sDc]=useState(false);const[pr,sPr]=useState(false);
  const[rs,sRs]=useState(null);const[ld,sLd]=useState(false);const[ai,sAi]=useState("");
  const{displayed:tA,done:aD}=useTW(ai);
  const calc=async()=>{if(!at)return;sLd(true);sRs(null);sAi("");
    let b=50;if(at.includes("후미추돌"))b=15;else if(at.includes("신호위반"))b=30;else if(at.includes("차선변경"))b=35;else if(at.includes("중앙선"))b=10;else if(at.includes("주차장"))b=45;else if(at.includes("후진"))b=20;else if(at.includes("단독"))b=100;else if(at.includes("횡단보도"))b=60;
    if(wt==="비"||wt==="눈")b=Math.min(100,b+3);if(sg==="적색신호")b=Math.max(0,b-10);if(pr)b=Math.max(0,b-2);
    sRs({mf:b,of:100-b,cf:dc?"높음":"보통"});
    const a=await callAI("당신은 과실 산정 전문 AI입니다. 판단근거,판례,협상차선안을 제시하세요.",
      `사고:${at}\n도로:${rt||"미상"},날씨:${wt||"미상"},신호:${sg||"미상"}\n결과:A${b}%/B${100-b}%\n분석해주세요.`);
    sAi(a);sLd(false);};
  return(
    <div style={{display:"grid",gridTemplateColumns:"340px 1fr",gap:20,height:"100%"}}>
      <div style={{overflowY:"auto",paddingRight:8}}>
        <div style={CD}><h3 style={ST}>사고 유형</h3><select value={at} onChange={e=>sAt(e.target.value)} style={SL}><option value="">선택</option>{ACCIDENT_TYPES.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
        <div style={CD}><h3 style={ST}>사고 상황</h3><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
          <SB label="도로" value={rt} onChange={sRt} opts={ROAD_TYPES}/><SB label="날씨" value={wt} onChange={sWt} opts={WEATHER_TYPES}/>
          <SB label="신호" value={sg} onChange={sSg} opts={SIGNAL_STATES}/></div></div>
        <div style={CD}><h3 style={ST}>진술</h3><label style={LB}>A차량(청구자)</label><textarea value={mD} onChange={e=>sMd(e.target.value)} placeholder="사고 상황..." style={TA} rows={2}/>
          <label style={{...LB,marginTop:8}}>B차량(상대방)</label><textarea value={oD} onChange={e=>sOd(e.target.value)} placeholder="상대방 진술..." style={TA} rows={2}/></div>
        <div style={CD}><h3 style={ST}>증거</h3><div style={{display:"flex",gap:12}}>
          <label style={{display:"flex",alignItems:"center",gap:4,color:"#64748b",fontSize:12.5,cursor:"pointer"}}><input type="checkbox" checked={dc} onChange={e=>sDc(e.target.checked)} style={{accentColor:"#0891b2"}}/>블랙박스</label>
          <label style={{display:"flex",alignItems:"center",gap:4,color:"#64748b",fontSize:12.5,cursor:"pointer"}}><input type="checkbox" checked={pr} onChange={e=>sPr(e.target.checked)} style={{accentColor:"#0891b2"}}/>경찰보고서</label></div></div>
        <button onClick={calc} disabled={ld||!at} style={{...BT,background:ld?"#e2e8f0":"#7c3aed",opacity:!at?.4:1}}>{ld?<Sp/>:"과실비율 산정"}</button>
      </div>
      <div style={{overflowY:"auto"}}>{!rs&&!ld&&<Em text="사고 유형 입력 후 실행하세요"/>}
        {rs&&<div style={{animation:"fadeIn .4s"}}>
          <div style={{...CD,border:"2px solid #c4b5fd"}}>
            <h3 style={{color:"#0f172a",fontSize:15.5,fontWeight:700,margin:"0 0 14px"}}>과실 산정 결과</h3>
            <div style={{display:"flex",alignItems:"center",gap:18,marginBottom:14}}>
              <div style={{flex:1,textAlign:"center"}}><div style={{fontSize:36,fontWeight:800,color:"#2563eb",fontFamily:"'DM Mono',monospace"}}>{rs.mf}%</div><div style={{color:"#94a3b8",fontSize:12}}>A (청구자)</div></div>
              <div style={{width:1,height:44,background:"#e2e8f0"}}/>
              <div style={{flex:1,textAlign:"center"}}><div style={{fontSize:36,fontWeight:800,color:"#dc2626",fontFamily:"'DM Mono',monospace"}}>{rs.of}%</div><div style={{color:"#94a3b8",fontSize:12}}>B (상대방)</div></div></div>
            <div style={{height:9,borderRadius:5,background:"#f1f5f9",overflow:"hidden",display:"flex"}}>
              <div style={{width:`${rs.mf}%`,background:"linear-gradient(90deg,#3b82f6,#60a5fa)",transition:"width 1s"}}/>
              <div style={{width:`${rs.of}%`,background:"linear-gradient(90deg,#ef4444,#f87171)",transition:"width 1s"}}/></div>
            <div style={{marginTop:8}}><span style={{padding:"2px 9px",borderRadius:10,fontSize:10.5,fontWeight:600,background:rs.cf==="높음"?"#dcfce7":"#fef3c7",color:rs.cf==="높음"?"#16a34a":"#d97706"}}>증거 신뢰도: {rs.cf}</span></div></div>
          <div style={{...CD,border:"1px solid #c4b5fd"}}><div style={{display:"flex",alignItems:"center",gap:7,marginBottom:9}}>
            <div style={{width:22,height:22,borderRadius:"50%",background:"#7c3aed",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}}>{IC.ai}</div>
            <span style={{fontSize:13,fontWeight:700}}>AI 과실 분석</span>{!aD&&ai&&<Sp s/>}</div>
            <div style={{fontSize:12.5}}><RT text={tA}/></div></div></div>}
      </div></div>);
}

// ═══ TAB 3: 처리 방법 (CARD) ═══
function Tab3(){
  const[stage,setStage]=useState("idle");
  const[selCase,setSelCase]=useState(null);const[modal,setModal]=useState(false);const[csQ,setCsQ]=useState("");
  const[input,setInput]=useState("");
  const[summary,setSummary]=useState(null);const[sumText,setSumText]=useState("");const{displayed:tS,done:sD}=useTW(sumText);
  const[proposals,setProposals]=useState(null);
  const[selIdx,setSelIdx]=useState(null);const[detText,setDetText]=useState("");const{displayed:tD,done:dD}=useTW(detText);

  const filtered=CASES.filter(c=>!csQ||c.id.toLowerCase().includes(csQ.toLowerCase())||c.model.includes(csQ)||c.type.includes(csQ));
  const loadCase=c=>{setSelCase(c);setModal(false);setInput(`사고ID: ${c.id}\n사고일: ${c.date}\n유형: ${c.type}\n차량: ${c.make} ${c.model}\n파손: ${c.parts}\n정도: ${c.severity}\n과실: ${c.fault}\n수리비: ${F(c.cost)}\n렌트: ${c.rental}\n상태: ${c.status}\n지역: ${c.region}`);
    setStage("idle");setSummary(null);setProposals(null);setSelIdx(null);setDetText("");setSumText("");};

  const analyze=async()=>{if(!input.trim())return;setStage("loading");setSummary(null);setProposals(null);setSelIdx(null);setDetText("");setSumText("");
    const sR=await callAI("손해사정 전문 AI. JSON만 응답:\n{\"업무영역\":\"\",\"핵심쟁점\":\"\",\"차량\":\"\",\"추정비용\":\"\",\"긴급도\":\"높음/보통/낮음\",\"주의사항\":\"\"}",input);
    let sO;try{sO=JSON.parse(sR.replace(/```json|```/g,"").trim())}catch{sO={업무영역:"자동차 손해사정",핵심쟁점:"수리 방법 결정",차량:"확인 필요",추정비용:"산정 중",긴급도:"보통",주의사항:""}}
    setSummary(sO);
    const nR=await callAI("손해사정 전문 AI. 2-3줄로 사고건을 정리해주세요.",`정리:\n${input}`);setSumText(nR);
    const c=selCase?.cost||2000000;
    const pR=await callAI("손해사정 전문 AI. 3가지 처리방법 JSON배열만:\n[{\"title\":\"\",\"subtitle\":\"\",\"cost\":\"금액\",\"period\":\"기간\",\"satisfaction\":4.5,\"pros\":[],\"cons\":[],\"recommended\":false}]\n순서:(1)미수선(2)제휴(3)공식",input);
    let pA;try{pA=JSON.parse(pR.replace(/```json|```/g,"").trim())}catch{
      pA=[{title:"미수선 처리",subtitle:"현금정산(협의금)",cost:F(Math.round(c*.7)),period:"3~5일",satisfaction:3.8,pros:["빠른 종결","고객 자유도"],cons:["수리 미보장"],recommended:false},
        {title:"제휴 서비스 센터",subtitle:"보험사 협력정비망",cost:F(Math.round(c*.85)),period:"5~7일",satisfaction:4.2,pros:["비용 절감","품질 보증"],cons:["일부 대체부품"],recommended:true},
        {title:"공식 서비스 센터",subtitle:"제조사 공식 AS",cost:F(c),period:"7~14일",satisfaction:4.7,pros:["OEM 부품","최고 품질"],cons:["비용 최대"],recommended:false}]}
    setProposals(pA);setStage("result");};

  const showDet=async idx=>{setSelIdx(idx);setDetText("");setStage("detail");
    const p=proposals[idx];
    const r=await callAI("손해사정 전문 AI. 선택된 방법의 미리보기+절차를 안내하세요.\n## 미리보기\n- 상세비용,타임라인\n## 다음 절차\n- Step별 안내\n## 고객 스크립트\n## 유의사항",
      `사고건:\n${input}\n방법:${p.title}(${p.subtitle})\n비용:${p.cost},기간:${p.period}\n상세+절차 안내해주세요.`);
    setDetText(r);};
  const reset=()=>{setStage("idle");setSelCase(null);setInput("");setSummary(null);setProposals(null);setSelIdx(null);setDetText("");setSumText("")};

  const CI=[IC.cs,IC.wr,IC.sh],CC=["#0891b2","#7c3aed","#2563eb"],CB=["#ecfeff","#f5f3ff","#eff6ff"],CR=["#a5f3fc","#c4b5fd","#bfdbfe"];

  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      {modal&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.2)",backdropFilter:"blur(3px)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setModal(false)}>
        <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:18,padding:24,width:580,maxHeight:"68vh",overflow:"hidden",display:"flex",flexDirection:"column",boxShadow:"0 16px 48px rgba(0,0,0,.1)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <h3 style={{margin:0,fontSize:15,fontWeight:700}}>사고건 불러오기</h3>
            <button onClick={()=>setModal(false)} style={{background:"none",border:"none",cursor:"pointer",color:"#94a3b8"}}>{IC.x}</button></div>
          <div style={{position:"relative",marginBottom:10}}><span style={{position:"absolute",left:11,top:9,color:"#94a3b8"}}>{IC.sr}</span>
            <input value={csQ} onChange={e=>setCsQ(e.target.value)} placeholder="사고ID, 차종, 유형..." style={{...IN,paddingLeft:32,width:"100%"}}/></div>
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
              <div style={{color:"#64748b",fontSize:11}}>{c.type} · {c.parts} ({c.severity}) · {F(c.cost)}</div>
            </div>)}</div></div></div>}

      <div style={{display:"flex",gap:8,marginBottom:12,alignItems:"center",flexWrap:"wrap"}}>
        <button onClick={()=>setModal(true)} style={{display:"flex",alignItems:"center",gap:5,padding:"7px 13px",borderRadius:9,fontSize:12,background:"#fff",border:"1px solid #e2e8f0",cursor:"pointer",color:"#0f172a",fontWeight:600,transition:"all .15s"}}
          onMouseEnter={e=>e.currentTarget.style.borderColor="#0891b2"} onMouseLeave={e=>e.currentTarget.style.borderColor="#e2e8f0"}>{IC.fld}<span>사고건 불러오기</span></button>
        {selCase&&<div style={{display:"flex",alignItems:"center",gap:5,background:"#ecfeff",padding:"4px 11px",borderRadius:9,fontSize:11.5,color:"#0891b2",fontWeight:600}}>
          {selCase.id} | {selCase.make} {selCase.model}
          <button onClick={()=>{setSelCase(null);setInput("")}} style={{background:"none",border:"none",cursor:"pointer",color:"#0891b2",padding:1}}>{IC.x}</button></div>}
        {stage!=="idle"&&<button onClick={reset} style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:3,padding:"5px 10px",borderRadius:7,fontSize:11,background:"none",border:"1px solid #e2e8f0",cursor:"pointer",color:"#94a3b8"}}>{IC.rf} 초기화</button>}
      </div>

      {stage==="idle"&&<div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <div style={{...CD,flex:1,display:"flex",flexDirection:"column"}}><h3 style={ST}>사고건 내용 입력</h3>
          <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder={"사고건을 입력하세요...\n예: 520d 양쪽 사이드미러+범퍼 파손\n또는 '사고건 불러오기'로 기존 접수건 선택"} style={{...TA,flex:1,minHeight:140,resize:"none"}}/>
          <div style={{display:"flex",gap:5,marginTop:10,flexWrap:"wrap"}}>
            {["520d 사이드미러+범퍼 파손","GV80 전면 5부위 심각","아반떼 후미추돌"].map((q,i)=>
              <button key={i} onClick={()=>setInput(q)} style={{padding:"4px 10px",borderRadius:14,fontSize:11,cursor:"pointer",background:"#f8fafc",color:"#94a3b8",border:"1px solid #e2e8f0",transition:"all .15s"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="#059669";e.currentTarget.style.color="#059669"}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="#e2e8f0";e.currentTarget.style.color="#94a3b8"}}>{q}</button>)}</div></div>
        <button onClick={analyze} disabled={!input.trim()} style={{...BT,marginTop:10,background:!input.trim()?"#e2e8f0":"#059669",opacity:!input.trim()?.4:1}}>AI 분석 시작</button></div>}

      {stage==="loading"&&<div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12}}>
        <Sp/><div style={{color:"#94a3b8",fontSize:13}}>사고건 분석 중...</div>
        <div style={{display:"flex",gap:5}}>{["접수 분석","방법 산출","비용 비교"].map((t,i)=>
          <span key={i} style={{padding:"3px 9px",borderRadius:10,fontSize:10.5,background:"#fff",color:"#94a3b8",border:"1px solid #e2e8f0",animation:`fadeIn ${.3+i*.3}s ease`}}>{t}</span>)}</div></div>}

      {stage==="result"&&summary&&<div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:12}}>
        <div style={{...CD,border:"2px solid #86efac",marginBottom:0}}>
          <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:10}}>
            <div style={{width:24,height:24,borderRadius:"50%",background:"#059669",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}}>{IC.ai}</div>
            <span style={{fontSize:14,fontWeight:700}}>접수 내용 분석</span>{!sD&&<Sp s/>}</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7,marginBottom:10}}>
            {[{l:"업무영역",v:summary.업무영역},{l:"차량",v:summary.차량},{l:"추정비용",v:summary.추정비용},{l:"긴급도",v:summary.긴급도}].map((x,i)=>
              <div key={i} style={{background:"#f0fdf4",borderRadius:9,padding:"8px 11px",border:"1px solid #bbf7d0"}}>
                <div style={{color:"#6b7280",fontSize:9.5,fontWeight:600}}>{x.l}</div><div style={{color:"#0f172a",fontSize:12,fontWeight:600}}>{x.v||"-"}</div></div>)}
          </div>
          <div style={{background:"#f0fdf4",borderRadius:9,padding:"9px 12px",border:"1px solid #bbf7d0",fontSize:12.5,color:"#475569",lineHeight:1.7}}>{tS||"분석 중..."}</div>
          {summary.주의사항&&<div style={{marginTop:7,padding:"6px 11px",borderRadius:7,background:"#fef3c7",border:"1px solid #fde68a",fontSize:11.5,color:"#92400e"}}>⚠️ {summary.주의사항}</div>}
        </div>

        {proposals&&<div style={{animation:"fadeIn .5s"}}>
          <h3 style={{...ST,fontSize:13,margin:"4px 0 10px"}}>처리 방법 3가지 — 카드를 선택하세요</h3>
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
                <span style={{color:"#f59e0b",display:"flex",gap:1}}>{[1,2,3,4,5].map(s=><span key={s} style={{opacity:s<=Math.round(p.satisfaction)?1:.2}}>{IC.st}</span>)}</span>
                <span style={{fontSize:11,fontWeight:600,color:"#64748b",marginLeft:3}}>{p.satisfaction}</span></div>
              <div style={{fontSize:11,color:"#64748b"}}>{p.pros?.slice(0,2).map((x,i)=><span key={i} style={{marginRight:5}}>✓ {x}</span>)}</div>
              <div style={{marginTop:10,display:"flex",alignItems:"center",justifyContent:"center",gap:4,padding:"7px 0",borderTop:`1px solid ${CR[idx]}`,color:CC[idx],fontSize:12,fontWeight:600}}>
                미리보기 · 절차 확인 {IC.arr}</div>
            </div>)}
          </div></div>}
      </div>}

      {stage==="detail"&&proposals&&selIdx!==null&&<div style={{flex:1,overflowY:"auto",animation:"fadeIn .3s"}}>
        <button onClick={()=>{setStage("result");setSelIdx(null);setDetText("")}} style={{display:"flex",alignItems:"center",gap:4,padding:"6px 12px",borderRadius:9,fontSize:12,background:"none",border:"1px solid #e2e8f0",cursor:"pointer",color:"#64748b",marginBottom:12}}>{IC.bk} 3가지 방법 보기</button>
        <div style={{background:CB[selIdx],borderRadius:15,padding:"16px 20px",border:`2px solid ${CC[selIdx]}`,marginBottom:12,display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:40,height:40,borderRadius:11,background:`${CC[selIdx]}10`,display:"flex",alignItems:"center",justifyContent:"center",color:CC[selIdx]}}>{CI[selIdx]}</div>
          <div style={{flex:1}}><div style={{fontSize:16,fontWeight:700,color:"#0f172a"}}>({selIdx+1}) {proposals[selIdx].title}</div><div style={{fontSize:12,color:"#64748b"}}>{proposals[selIdx].subtitle}</div></div>
          <div style={{display:"flex",gap:14}}>
            <div style={{textAlign:"center"}}><div style={{fontSize:9.5,color:"#94a3b8",fontWeight:600}}>비용</div><div style={{fontSize:16,fontWeight:700,color:CC[selIdx],fontFamily:"'DM Mono',monospace"}}>{proposals[selIdx].cost}</div></div>
            <div style={{width:1,height:30,background:"#e2e8f0"}}/>
            <div style={{textAlign:"center"}}><div style={{fontSize:9.5,color:"#94a3b8",fontWeight:600}}>기간</div><div style={{fontSize:16,fontWeight:700,color:"#334155"}}>{proposals[selIdx].period}</div></div></div></div>
        <div style={{...CD,border:`1px solid ${CR[selIdx]}`}}>
          <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:9}}>
            <div style={{width:22,height:22,borderRadius:"50%",background:CC[selIdx],display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}}>{IC.ai}</div>
            <span style={{fontSize:13,fontWeight:700}}>상세 미리보기 · 절차 안내</span>{!dD&&<Sp s/>}</div>
          <div style={{fontSize:12.5}}><RT text={tD}/></div></div>
        <div style={{padding:"12px 14px",background:"#fff",borderRadius:11,border:"1px solid #e2e8f0",marginTop:12}}>
          <div style={{fontSize:11,color:"#94a3b8",fontWeight:600,marginBottom:8}}>다른 방법 확인</div>
          <div style={{display:"flex",gap:8}}>
            {proposals.map((p,idx)=>idx!==selIdx&&<button key={idx} onClick={()=>showDet(idx)} style={{flex:1,padding:"9px 12px",borderRadius:9,cursor:"pointer",background:CB[idx],border:`1px solid ${CR[idx]}`,display:"flex",alignItems:"center",gap:6,transition:"all .15s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor=CC[idx]} onMouseLeave={e=>e.currentTarget.style.borderColor=CR[idx]}>
              <span style={{color:CC[idx]}}>{CI[idx]}</span><span style={{fontSize:12,fontWeight:600,color:"#334155"}}>{p.title}</span>
              <span style={{marginLeft:"auto",color:CC[idx]}}>{IC.arr}</span></button>)}</div></div>
      </div>}
    </div>);
}

// ═══ MAIN ═══
export default function ClaimsAgentMVP({ onBack }){
  const[tab,setTab]=useState(0);
  const tabs=[{l:"견적 산정",e:"Estimate",i:IC.est,c:"#0891b2"},{l:"과실 산정",e:"Fault",i:IC.flt,c:"#7c3aed"},{l:"처리 방법 제안",e:"Method",i:IC.mth,c:"#059669"}];
  return(
    <div style={{width:"100%",height:"100vh",fontFamily:"'Noto Sans KR',-apple-system,sans-serif",background:"linear-gradient(155deg,#f8fafc,#f0f9ff 40%,#faf5ff 70%,#f8fafc)",color:"#0f172a",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');
        @keyframes spin{to{transform:rotate(360deg)}}@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        select option{background:#fff;color:#0f172a}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px}button:active{transform:scale(.98)}`}</style>
      <div style={{padding:"12px 26px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid #e2e8f0",background:"rgba(255,255,255,.85)",backdropFilter:"blur(10px)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button onClick={onBack} style={{padding:"6px 14px",borderRadius:8,background:"rgba(8,145,178,0.08)",border:"1px solid rgba(8,145,178,0.2)",color:"#0891b2",fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:5,fontFamily:"inherit"}}>← DMP</button>
          <div style={{width:32,height:32,borderRadius:8,background:"linear-gradient(135deg,#0891b2,#7c3aed)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",boxShadow:"0 3px 8px rgba(8,145,178,.2)"}}>{IC.car}</div>
          <div><div style={{fontSize:15,fontWeight:800,letterSpacing:-.3}}><span style={{color:"#0891b2"}}>AI</span> 손해사정 Portal</div>
            <div style={{color:"#94a3b8",fontSize:9.5,letterSpacing:.4}}>Auto Claims Agent · kt ds AX</div></div></div>
        <div style={{display:"flex",alignItems:"center",gap:5,color:"#94a3b8",fontSize:11}}><div style={{width:6,height:6,borderRadius:"50%",background:"#4ade80",boxShadow:"0 0 5px #4ade80"}}/>Active</div></div>
      <div style={{display:"flex",gap:2,padding:"8px 26px",borderBottom:"1px solid #e2e8f0",background:"rgba(255,255,255,.55)"}}>
        {tabs.map((t,i)=><button key={i} onClick={()=>setTab(i)} style={{display:"flex",alignItems:"center",gap:5,padding:"7px 16px",borderRadius:9,border:"none",cursor:"pointer",background:tab===i?`${t.c}0D`:"transparent",color:tab===i?t.c:"#94a3b8",fontSize:12.5,fontWeight:tab===i?700:500,transition:"all .15s",borderBottom:tab===i?`2px solid ${t.c}`:"2px solid transparent"}}>
          {t.i}<span>{t.l}</span><span style={{fontSize:9.5,opacity:.5,marginLeft:2}}>{t.e}</span></button>)}</div>
      <div style={{flex:1,padding:"14px 26px",overflow:"hidden",minHeight:0}}>
        <div style={{height:"100%",display:tab===0?"block":"none"}}><Tab1/></div>
        <div style={{height:"100%",display:tab===1?"block":"none"}}><Tab2/></div>
        <div style={{height:"100%",display:tab===2?"flex":"none",flexDirection:"column"}}><Tab3/></div></div>
    </div>);
}
