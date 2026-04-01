import { useState, useEffect } from "react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const S={bg:"#0f172a",card:"#1e293b",card2:"#253349",border:"#334155",text:"#f1f5f9",sub:"#94a3b8",muted:"#64748b",pri:"#6366f1",up:"#10b981",down:"#ef4444",cyan:"#0891b2",blue:"#2563eb",purple:"#7c3aed",green:"#059669",yellow:"#f59e0b",red:"#dc2626",pink:"#ec4899",gray:"#64748b",orange:"#f97316"};

const DATASETS = [
  { id:"ds-001", name:"과실판정 판례 데이터셋", category:"판례", records:"12,847건", updated:"2026-03-28", quality:94, status:"active", format:["JSON","CSV","Parquet"], tier:"Basic+", desc:"대법원·고등법원 교통사고 과실판정 판례를 구조화. 사고유형/과실비율/판단근거/법적기준 포함.", tags:["과실판정","교통사고","판례","법원"], size:"2.3GB", source:"대법원 판례정보", license:"공공누리 1유형", fields:["case_id","accident_type","fault_ratio","legal_basis","ruling_date","court_level","damage_type","vehicle_info"] },
  { id:"ds-002", name:"도로 인프라 데이터셋", category:"도로정보", records:"1,847,293건", updated:"2026-03-25", quality:97, status:"active", format:["JSON","GeoJSON","CSV"], tier:"Standard+", desc:"전국 도로의 신호등/차선/교차로/제한속도/안전시설 정보.", tags:["도로","신호등","교차로","GIS"], size:"8.7GB", source:"국토교통부·도로교통공단", license:"공공누리 1유형", fields:["road_id","road_type","speed_limit","signal_type","lane_count","intersection_type","lat","lng","safety_facility"] },
  { id:"ds-003", name:"교통사고 통계 데이터셋", category:"사고통계", records:"523,841건", updated:"2026-03-20", quality:96, status:"active", format:["JSON","CSV"], tier:"Basic+", desc:"최근 10년간 교통사고 발생 현황. 지역/시간/유형/사상자/기상 등 상세 정보.", tags:["교통사고","통계","사고다발","사상자"], size:"1.1GB", source:"도로교통공단 TAAS", license:"공공누리 1유형", fields:["accident_id","date","time","location","accident_type","severity","weather","road_condition","vehicle_count","casualty_count"] },
  { id:"ds-004", name:"사고다발지점 데이터셋", category:"사고통계", records:"4,271건", updated:"2026-03-15", quality:98, status:"active", format:["JSON","GeoJSON"], tier:"Standard+", desc:"전국 사고다발지점/사망사고 발생지점 GIS 데이터. 위험도 스코어 포함.", tags:["사고다발","위험지역","GIS","위험도"], size:"156MB", source:"경찰청·도로교통공단", license:"공공누리 1유형", fields:["hotspot_id","lat","lng","risk_score","accident_count","fatality_count","road_type","main_cause"] },
  { id:"ds-005", name:"분쟁심의위원회 판정 데이터셋", category:"판례", records:"8,932건", updated:"2026-03-10", quality:91, status:"active", format:["JSON","CSV"], tier:"Premium", desc:"손해보험협회 분쟁심의위원회 판정 결과.", tags:["분쟁","보험금","심의","판정"], size:"890MB", source:"손해보험협회", license:"라이선싱 계약", fields:["dispute_id","dispute_type","claim_amount","ruling_result","ruling_basis","insurance_type","date"] },
  { id:"ds-006", name:"자동차 안전등급 데이터셋", category:"차량정보", records:"3,847건", updated:"2026-02-28", quality:99, status:"active", format:["JSON","CSV"], tier:"Basic+", desc:"국내 판매 차량의 안전등급/충돌테스트/안전장치 정보.", tags:["자동차","안전등급","KNCAP","충돌테스트"], size:"245MB", source:"한국교통안전공단 KNCAP", license:"공공누리 1유형", fields:["vehicle_id","make","model","year","safety_rating","crash_test_score","safety_features","body_type"] },
  { id:"ds-007", name:"기상·날씨 이력 데이터셋", category:"기상", records:"2,190,000건", updated:"2026-03-28", quality:99, status:"active", format:["JSON","CSV"], tier:"Standard+", desc:"전국 기상관측소 6년치 시간별 기상 데이터.", tags:["기상","날씨","강수량","시정거리"], size:"4.2GB", source:"기상청 API", license:"공공누리 1유형", fields:["station_id","datetime","temperature","humidity","precipitation","wind_speed","visibility","road_surface_temp"] },
  { id:"ds-008", name:"과실산정 도표 AI 구조화 데이터셋", category:"암묵지", records:"1,247건", updated:"2026-03-05", quality:88, status:"beta", format:["JSON"], tier:"Premium", desc:"주요 손해사정 기업의 과실산정 도표를 AI가 구조화.", tags:["과실산정","도표","암묵지","AI구조화"], size:"320MB", source:"도메인 전문가 + AI 구조화", license:"독점 라이선싱", fields:["scenario_id","accident_pattern","base_fault","modifier_conditions","adjustment_rules","expert_notes","confidence_score"] },
];

const PIPELINE_DATA = [
  { id:"pipe-1", name:"대법원 판례 수집", source:"대법원 판례정보시스템", schedule:"매일 06:00", lastRun:"2026-03-28 06:12", status:"success", records:"+23건", duration:"4분 32초" },
  { id:"pipe-2", name:"도로교통공단 사고통계", source:"TAAS API", schedule:"매주 월요일 03:00", lastRun:"2026-03-25 03:08", status:"success", records:"+1,247건", duration:"12분 15초" },
  { id:"pipe-3", name:"기상청 실시간 기상", source:"기상청 API", schedule:"매시간", lastRun:"2026-03-28 15:00", status:"success", records:"+102건", duration:"45초" },
  { id:"pipe-4", name:"국토교통부 도로정보", source:"노드링크 API", schedule:"매월 1일", lastRun:"2026-03-01 02:15", status:"success", records:"+3,847건", duration:"35분 22초" },
  { id:"pipe-5", name:"분쟁심의위 판정 수집", source:"손해보험협회", schedule:"매주 수요일 09:00", lastRun:"2026-03-27 09:05", status:"warning", records:"+12건", duration:"2분 08초" },
  { id:"pipe-6", name:"KNCAP 차량안전등급", source:"TS API", schedule:"매월 15일", lastRun:"2026-03-15 04:00", status:"success", records:"+45건", duration:"1분 52초" },
];

const QUALITY_TREND = [
  {month:"2025-10",accuracy:82,completeness:78,consistency:85,timeliness:90},
  {month:"2025-11",accuracy:85,completeness:82,consistency:87,timeliness:91},
  {month:"2025-12",accuracy:87,completeness:85,consistency:89,timeliness:92},
  {month:"2026-01",accuracy:89,completeness:88,consistency:91,timeliness:93},
  {month:"2026-02",accuracy:91,completeness:90,consistency:93,timeliness:94},
  {month:"2026-03",accuracy:94,completeness:92,consistency:95,timeliness:96},
];

const USAGE_DATA = [
  {date:"03-22",apiCalls:1247,downloads:23,uniqueUsers:8},{date:"03-23",apiCalls:1583,downloads:31,uniqueUsers:12},
  {date:"03-24",apiCalls:1891,downloads:28,uniqueUsers:10},{date:"03-25",apiCalls:2234,downloads:42,uniqueUsers:15},
  {date:"03-26",apiCalls:1956,downloads:35,uniqueUsers:13},{date:"03-27",apiCalls:2567,downloads:47,uniqueUsers:18},
  {date:"03-28",apiCalls:2891,downloads:52,uniqueUsers:21},
];

const TIER_PLANS = [
  { name:"Basic", price:"100만원/월", annual:"1,000만원/년", color:S.cyan, datasets:"판례+사고통계+차량안전등급", apiCalls:"10,000/월", download:"50GB/월", features:["기본 데이터셋 3종","CSV/JSON 다운로드","REST API 접근","월간 품질 리포트"] },
  { name:"Standard", price:"300만원/월", annual:"3,000만원/년", color:S.pri, popular:true, datasets:"Basic + 도로인프라+사고다발+기상", apiCalls:"100,000/월", download:"500GB/월", features:["전체 공개 데이터셋 7종","GeoJSON/Parquet 지원","GraphQL API","주간 품질 리포트","커스텀 필터링 API","데이터 갱신 알림"] },
  { name:"Premium", price:"500만원/월", annual:"5,000만원/년", color:S.purple, datasets:"Standard + 분쟁심의위+과실산정도표", apiCalls:"무제한", download:"무제한", features:["전체 데이터셋 8종 + 베타","암묵지 데이터 포함","실시간 스트리밍 API","일간 품질 리포트","맞춤 인사이트 리포트","전담 기술 지원","SLA 99.9% 보장","커스텀 데이터 요청"] },
];

const DATA_FLOW_STEPS = [
  { icon:"🌐", title:"데이터 수집", desc:"판례·도로·사고통계·기상 등 외부 공개 데이터를 자동 크롤링", detail:"6개 파이프라인 · 7개 데이터소스" },
  { icon:"⚙️", title:"정제·구조화", desc:"NLP + 도메인 스키마 적용, 비정형→구조화", detail:"AI 자동 파싱 · 엔티티 추출" },
  { icon:"🧠", title:"지식 그래프", desc:"엔티티 간 관계 맵핑, 도메인 지식 그래프", detail:"사고유형↔과실비율↔판례↔도로조건" },
  { icon:"✅", title:"품질 검증", desc:"전문가 검증 + 4대 품질 지표 자동 측정", detail:"정확도 94%+ · 완전성 92%+" },
  { icon:"📦", title:"데이터 자산화", desc:"AI Agent 즉시 활용 가능한 형태로 패키징", detail:"JSON/CSV/Parquet · REST API" },
  { icon:"🚀", title:"서빙·배포", desc:"API/다운로드/스트리밍으로 제공", detail:"CDN · Rate Limiting · 모니터링" },
];

const Card = ({children,style,...props}) => (<div style={{background:S.card,borderRadius:12,border:`1px solid ${S.border}`,padding:20,...style}} {...props}>{children}</div>);
const Badge = ({children,color=S.pri,style,...props}) => (<span style={{display:"inline-block",padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600,background:color+"20",color,...style}} {...props}>{children}</span>);
const Stat = ({label,value,sub,icon,color=S.pri}) => (<Card style={{display:"flex",alignItems:"center",gap:14}}><div style={{width:44,height:44,borderRadius:10,background:color+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{icon}</div><div><div style={{fontSize:11,color:S.sub,marginBottom:2}}>{label}</div><div style={{fontSize:20,fontWeight:700,color:S.text}}>{value}</div>{sub&&<div style={{fontSize:11,color:S.muted}}>{sub}</div>}</div></Card>);
const Tab = ({tabs,active,onChange}) => (<div style={{display:"flex",gap:4,background:S.bg,borderRadius:8,padding:3}}>{tabs.map(t=>(<div key={t.id} onClick={()=>onChange(t.id)} style={{padding:"7px 16px",borderRadius:6,fontSize:12,fontWeight:active===t.id?700:500,cursor:"pointer",background:active===t.id?S.pri+"22":"transparent",color:active===t.id?S.pri:S.sub,transition:"all .15s"}}>{t.icon&&<span style={{marginRight:5}}>{t.icon}</span>}{t.label}</div>))}</div>);
const QualityBar = ({value,label,color=S.up}) => (<div style={{marginBottom:8}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:11,color:S.sub}}>{label}</span><span style={{fontSize:12,fontWeight:700,color}}>{value}%</span></div><div style={{height:6,background:S.bg,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${value}%`,background:color,borderRadius:3,transition:"width .5s ease"}}/></div></div>);
const StatusDot = ({status}) => { const c = status==="success"?S.up:status==="warning"?S.yellow:S.red; const l = status==="success"?"정상":status==="warning"?"경고":"오류"; return <span style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:11}}><span style={{width:7,height:7,borderRadius:"50%",background:c,display:"inline-block"}}/>{l}</span>; };
const FormatBadge = ({f}) => { const cm={JSON:S.yellow,CSV:S.up,Parquet:S.purple,GeoJSON:S.cyan}; return <Badge color={cm[f]||S.gray} style={{fontSize:10,padding:"2px 7px"}}>{f}</Badge>; };

function TabOverview(){
  const [anim,setAnim]=useState(false);
  useEffect(()=>{setTimeout(()=>setAnim(true),100);},[]);
  return(<div>
    <Card style={{background:`linear-gradient(135deg,${S.pri}15,${S.purple}15)`,marginBottom:20,position:"relative",overflow:"hidden"}}>
      <div style={{position:"relative"}}>
        <Badge color={S.up} style={{marginBottom:10}}>Phase 1 · MVP</Badge>
        <h2 style={{fontSize:22,fontWeight:800,color:S.text,marginBottom:6}}>🧬 AI Ready Data 생성 플랫폼</h2>
        <p style={{fontSize:13,color:S.sub,lineHeight:1.6,maxWidth:600,marginBottom:16}}>AI Agent 개발에 필요한 도메인 특화 데이터를 수집·정제·구조화하여<br/>즉시 활용 가능한 <b style={{color:S.text}}>고품질 데이터 자산</b>으로 제공합니다.</p>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}><Badge color={S.cyan}>🏢 보험·손해사정</Badge><Badge color={S.yellow}>📊 8개 데이터셋</Badge><Badge color={S.up}>✅ 품질 94%+</Badge><Badge color={S.purple}>🔌 REST API</Badge></div>
      </div>
    </Card>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:12,marginBottom:20}}>
      <Stat icon="📦" label="총 데이터셋" value="8종" sub="보험 도메인 특화" color={S.pri}/><Stat icon="📋" label="총 레코드 수" value="4.6M+" sub="12,847 판례 포함" color={S.cyan}/><Stat icon="✅" label="평균 품질 점수" value="94.6%" sub="4대 지표 평균" color={S.up}/><Stat icon="🔄" label="파이프라인 가동" value="6개" sub="자동 크롤링 운영 중" color={S.yellow}/>
    </div>
    <Card style={{marginBottom:20}}>
      <h3 style={{fontSize:14,fontWeight:700,marginBottom:16,color:S.text}}>📐 AI Ready Data 생성 파이프라인</h3>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:10}}>
        {DATA_FLOW_STEPS.map((s,i)=>(<div key={i} style={{background:S.bg,borderRadius:10,padding:14,textAlign:"center",position:"relative",opacity:anim?1:0,transform:anim?"translateY(0)":"translateY(12px)",transition:`all .4s ease ${i*0.08}s`}}>{i<DATA_FLOW_STEPS.length-1&&<div style={{position:"absolute",right:-8,top:"50%",transform:"translateY(-50%)",color:S.muted,fontSize:14,zIndex:1}}>→</div>}<div style={{fontSize:28,marginBottom:8}}>{s.icon}</div><div style={{fontSize:12,fontWeight:700,color:S.text,marginBottom:4}}>{s.title}</div><div style={{fontSize:10,color:S.sub,lineHeight:1.4}}>{s.desc}</div><div style={{fontSize:9,color:S.muted,marginTop:6}}>{s.detail}</div></div>))}
      </div>
    </Card>
    <Card style={{marginBottom:20}}>
      <h3 style={{fontSize:14,fontWeight:700,marginBottom:16,color:S.text}}>🗺️ 데이터 레이어 구조</h3>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:10}}>
        {[{layer:"Layer 1",name:"고객 보유 데이터",icon:"🏢",color:S.blue,items:["내부 과실산정 도표","사고 처리 이력","보험금 산정 데이터"],note:"(고객이 이미 보유)"},{layer:"Layer 2",name:"경쟁·타사 데이터",icon:"🔄",color:S.cyan,items:["타사 과실산정 기준","업계 통계","벤치마크"],note:"(수집 대상)"},{layer:"Layer 3",name:"암묵지 데이터",icon:"🧠",color:S.purple,items:["전문가 판단 로직","예외 케이스 노하우","경험 기반 규칙"],note:"(추출 대상)"},{layer:"Layer 4",name:"외부 보완 데이터",icon:"🌐",color:S.up,items:["대법원 판례","도로 인프라","사고 통계","기상 데이터"],note:"★ 고객이 '오!'하는 지점"},{layer:"Layer 5",name:"인사이트 데이터",icon:"💡",color:S.yellow,items:["교차 분석 패턴","AI 생성 규칙","예측 모델 피처"],note:"★ 차별화 핵심"}].map((l,i)=>(<div key={i} style={{background:l.color+"10",borderRadius:10,padding:14,borderLeft:`3px solid ${l.color}`}}><div style={{fontSize:10,color:l.color,fontWeight:700,marginBottom:4}}>{l.layer}</div><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}><span style={{fontSize:18}}>{l.icon}</span><span style={{fontSize:13,fontWeight:700,color:S.text}}>{l.name}</span></div>{l.items.map((it,j)=><div key={j} style={{fontSize:10,color:S.sub,padding:"2px 0"}}>• {it}</div>)}<div style={{fontSize:9,color:l.color,marginTop:6,fontWeight:600}}>{l.note}</div></div>))}
      </div>
    </Card>
    <Card>
      <h3 style={{fontSize:14,fontWeight:700,marginBottom:16,color:S.text}}>💰 구독 플랜</h3>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:14}}>
        {TIER_PLANS.map((p,i)=>(<div key={i} style={{background:S.bg,borderRadius:10,padding:18,border:p.popular?`2px solid ${p.color}`:`1px solid ${S.border}`,position:"relative"}}>{p.popular&&<div style={{position:"absolute",top:-10,right:12,background:p.color,color:"#fff",fontSize:10,fontWeight:700,padding:"2px 10px",borderRadius:10}}>POPULAR</div>}<div style={{fontSize:13,fontWeight:700,color:p.color,marginBottom:4}}>{p.name}</div><div style={{fontSize:22,fontWeight:800,color:S.text,marginBottom:2}}>{p.price}</div><div style={{fontSize:10,color:S.muted,marginBottom:12}}>연간 {p.annual}</div><div style={{fontSize:10,color:S.sub,marginBottom:6}}>📊 {p.datasets}</div><div style={{fontSize:10,color:S.sub,marginBottom:6}}>🔌 API {p.apiCalls}</div><div style={{fontSize:10,color:S.sub,marginBottom:10}}>💾 다운로드 {p.download}</div><div style={{borderTop:`1px solid ${S.border}`,paddingTop:10}}>{p.features.map((f,j)=><div key={j} style={{fontSize:10,color:S.sub,padding:"2px 0"}}>✓ {f}</div>)}</div></div>))}
      </div>
    </Card>
  </div>);
}

function TabCatalog(){
  const [search,setSearch]=useState(""); const [selCat,setSelCat]=useState("all"); const [selDs,setSelDs]=useState(null);
  const cats=["all",...new Set(DATASETS.map(d=>d.category))];
  const filtered=DATASETS.filter(d=>(selCat==="all"||d.category===selCat)&&(search===""||d.name.includes(search)||d.tags.some(t=>t.includes(search))));
  if(selDs) return(<div>
    <div onClick={()=>setSelDs(null)} style={{display:"inline-flex",alignItems:"center",gap:6,cursor:"pointer",color:S.pri,fontSize:12,marginBottom:16}}>← 카탈로그로 돌아가기</div>
    <Card style={{marginBottom:16}}>
      <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
        <div><div style={{display:"flex",gap:6,marginBottom:8}}><Badge color={S.cyan}>{selDs.category}</Badge><Badge color={selDs.status==="active"?S.up:S.yellow}>{selDs.status==="active"?"운영중":"Beta"}</Badge><Badge color={S.pri}>{selDs.tier}</Badge></div><h2 style={{fontSize:18,fontWeight:800,color:S.text,marginBottom:6}}>{selDs.name}</h2><p style={{fontSize:12,color:S.sub,lineHeight:1.6,maxWidth:500}}>{selDs.desc}</p></div>
        <div style={{display:"flex",flexDirection:"column",gap:6,minWidth:160}}><div style={{fontSize:11,color:S.muted}}>레코드 <b style={{color:S.text}}>{selDs.records}</b></div><div style={{fontSize:11,color:S.muted}}>용량 <b style={{color:S.text}}>{selDs.size}</b></div><div style={{fontSize:11,color:S.muted}}>소스 <b style={{color:S.text}}>{selDs.source}</b></div><div style={{fontSize:11,color:S.muted}}>라이선스 <b style={{color:S.text}}>{selDs.license}</b></div></div>
      </div>
    </Card>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
      <Card><h4 style={{fontSize:13,fontWeight:700,color:S.text,marginBottom:12}}>📊 품질 지표</h4><QualityBar value={selDs.quality} label="정확도" color={S.up}/><QualityBar value={Math.max(selDs.quality-2,85)} label="완전성" color={S.cyan}/><QualityBar value={Math.min(selDs.quality+1,99)} label="일관성" color={S.pri}/><QualityBar value={Math.min(selDs.quality+2,99)} label="적시성" color={S.yellow}/></Card>
      <Card><h4 style={{fontSize:13,fontWeight:700,color:S.text,marginBottom:12}}>🗂️ 필드 구조</h4><div style={{display:"flex",flexWrap:"wrap",gap:4}}>{selDs.fields.map(f=>(<div key={f} style={{padding:"4px 10px",background:S.bg,borderRadius:5,fontSize:10,color:S.cyan,fontFamily:"monospace",border:`1px solid ${S.border}`}}>{f}</div>))}</div><div style={{marginTop:12,display:"flex",gap:4}}>{selDs.format.map(f=><FormatBadge key={f} f={f}/>)}</div></Card>
    </div>
  </div>);

  return(<div>
    <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="데이터셋 검색" style={{flex:1,minWidth:200,padding:"9px 14px",borderRadius:8,border:`1px solid ${S.border}`,background:S.bg,color:S.text,fontSize:12,outline:"none"}}/>
      <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{cats.map(c=>(<div key={c} onClick={()=>setSelCat(c)} style={{padding:"7px 14px",borderRadius:6,fontSize:11,fontWeight:selCat===c?700:500,cursor:"pointer",background:selCat===c?S.pri+"22":S.bg,color:selCat===c?S.pri:S.sub,border:`1px solid ${selCat===c?S.pri+"44":S.border}`}}>{c==="all"?"전체":c}</div>))}</div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:12}}>
      {filtered.map(d=>(<Card key={d.id} style={{cursor:"pointer",transition:"all .15s"}} onClick={()=>setSelDs(d)}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}><div><div style={{fontSize:13,fontWeight:700,color:S.text,marginBottom:4}}>{d.name}</div><div style={{display:"flex",gap:4}}><Badge color={S.cyan}>{d.category}</Badge><Badge color={d.status==="active"?S.up:S.yellow}>{d.status==="active"?"운영중":"Beta"}</Badge></div></div><Badge color={S.pri}>{d.tier}</Badge></div>
        <div style={{fontSize:11,color:S.sub,lineHeight:1.5,marginBottom:10}}>{d.desc}</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{display:"flex",gap:4}}>{d.format.map(f=><FormatBadge key={f} f={f}/>)}</div><span style={{fontSize:11,color:S.muted}}>{d.records}</span></div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:10,paddingTop:10,borderTop:`1px solid ${S.border}`}}><span style={{fontSize:10,color:S.muted}}>품질 <b style={{color:d.quality>=90?S.up:S.yellow}}>{d.quality}%</b></span><span style={{fontSize:10,color:S.muted}}>{d.size}</span><span style={{fontSize:10,color:S.muted}}>{d.updated}</span></div>
      </Card>))}
    </div>
  </div>);
}

function TabPipeline(){
  return(<div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12,marginBottom:20}}>
      <Stat icon="🟢" label="정상 가동" value="5개" sub="전체 6개 중" color={S.up}/><Stat icon="⚠️" label="경고" value="1개" sub="분쟁심의위 수집" color={S.yellow}/><Stat icon="📊" label="오늘 수집" value="+1,384건" color={S.cyan}/><Stat icon="⏱️" label="평균 소요" value="9분 27초" color={S.pri}/>
    </div>
    <Card>
      <h3 style={{fontSize:14,fontWeight:700,marginBottom:16,color:S.text}}>🔄 크롤링 파이프라인 현황</h3>
      <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}><thead><tr>{["파이프라인","데이터소스","스케줄","마지막 실행","상태","수집 건수","소요시간"].map(h=><th key={h} style={{padding:"10px 12px",textAlign:"left",color:S.sub,borderBottom:`1px solid ${S.border}`,fontWeight:600,whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead><tbody>{PIPELINE_DATA.map(p=>(<tr key={p.id}><td style={{padding:"10px 12px",color:S.text,fontWeight:600,borderBottom:`1px solid ${S.border}22`}}>{p.name}</td><td style={{padding:"10px 12px",color:S.sub,borderBottom:`1px solid ${S.border}22`}}>{p.source}</td><td style={{padding:"10px 12px",color:S.muted,borderBottom:`1px solid ${S.border}22`,fontSize:10}}>{p.schedule}</td><td style={{padding:"10px 12px",color:S.sub,borderBottom:`1px solid ${S.border}22`,fontSize:10}}>{p.lastRun}</td><td style={{padding:"10px 12px",borderBottom:`1px solid ${S.border}22`}}><StatusDot status={p.status}/></td><td style={{padding:"10px 12px",color:S.up,fontWeight:600,borderBottom:`1px solid ${S.border}22`}}>{p.records}</td><td style={{padding:"10px 12px",color:S.muted,borderBottom:`1px solid ${S.border}22`,fontSize:10}}>{p.duration}</td></tr>))}</tbody></table></div>
    </Card>
  </div>);
}

function TabQuality(){
  const latest=QUALITY_TREND[QUALITY_TREND.length-1];
  return(<div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12,marginBottom:20}}>
      <Stat icon="🎯" label="정확도" value={`${latest.accuracy}%`} color={S.up}/><Stat icon="📐" label="완전성" value={`${latest.completeness}%`} color={S.cyan}/><Stat icon="🔗" label="일관성" value={`${latest.consistency}%`} color={S.pri}/><Stat icon="⏰" label="적시성" value={`${latest.timeliness}%`} color={S.yellow}/>
    </div>
    <Card style={{marginBottom:16}}>
      <h3 style={{fontSize:14,fontWeight:700,marginBottom:16,color:S.text}}>📈 품질 추이 (6개월)</h3>
      <ResponsiveContainer width="100%" height={220}><LineChart data={QUALITY_TREND}><CartesianGrid strokeDasharray="3 3" stroke={S.border}/><XAxis dataKey="month" tick={{fontSize:10,fill:S.muted}} stroke={S.border}/><YAxis domain={[75,100]} tick={{fontSize:10,fill:S.muted}} stroke={S.border}/><Tooltip contentStyle={{background:S.card,border:`1px solid ${S.border}`,borderRadius:8,fontSize:11}}/><Line type="monotone" dataKey="accuracy" stroke={S.up} strokeWidth={2} name="정확도" dot={{r:3}}/><Line type="monotone" dataKey="completeness" stroke={S.cyan} strokeWidth={2} name="완전성" dot={{r:3}}/><Line type="monotone" dataKey="consistency" stroke={S.pri} strokeWidth={2} name="일관성" dot={{r:3}}/><Line type="monotone" dataKey="timeliness" stroke={S.yellow} strokeWidth={2} name="적시성" dot={{r:3}}/></LineChart></ResponsiveContainer>
    </Card>
    <Card>
      <h3 style={{fontSize:14,fontWeight:700,marginBottom:16,color:S.text}}>📦 데이터셋별 품질</h3>
      {DATASETS.map(d=>(<div key={d.id} style={{marginBottom:12,padding:10,background:S.bg,borderRadius:8}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><span style={{fontSize:12,fontWeight:600,color:S.text}}>{d.name}</span><Badge color={d.quality>=95?S.up:d.quality>=90?S.cyan:S.yellow}>{d.quality}%</Badge></div><div style={{height:5,background:S.card,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${d.quality}%`,background:d.quality>=95?S.up:d.quality>=90?S.cyan:S.yellow,borderRadius:3}}/></div></div>))}
    </Card>
  </div>);
}

function TabUsage(){
  const totalCalls=USAGE_DATA.reduce((s,d)=>s+d.apiCalls,0); const totalDl=USAGE_DATA.reduce((s,d)=>s+d.downloads,0);
  return(<div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12,marginBottom:20}}>
      <Stat icon="🔌" label="주간 API 호출" value={totalCalls.toLocaleString()} sub="일평균 2,053" color={S.pri}/><Stat icon="💾" label="주간 다운로드" value={`${totalDl}회`} sub="일평균 37회" color={S.cyan}/><Stat icon="👥" label="주간 사용자" value="21명" sub="전주 대비 +31%" color={S.up}/>
    </div>
    <Card style={{marginBottom:16}}>
      <h3 style={{fontSize:14,fontWeight:700,marginBottom:16,color:S.text}}>📊 일별 API 호출량</h3>
      <ResponsiveContainer width="100%" height={200}><BarChart data={USAGE_DATA}><CartesianGrid strokeDasharray="3 3" stroke={S.border}/><XAxis dataKey="date" tick={{fontSize:10,fill:S.muted}} stroke={S.border}/><YAxis tick={{fontSize:10,fill:S.muted}} stroke={S.border}/><Tooltip contentStyle={{background:S.card,border:`1px solid ${S.border}`,borderRadius:8,fontSize:11}}/><Bar dataKey="apiCalls" fill={S.pri} name="API 호출" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer>
    </Card>
    <Card>
      <h3 style={{fontSize:14,fontWeight:700,marginBottom:16,color:S.text}}>💾 일별 다운로드 추이</h3>
      <ResponsiveContainer width="100%" height={180}><AreaChart data={USAGE_DATA}><CartesianGrid strokeDasharray="3 3" stroke={S.border}/><XAxis dataKey="date" tick={{fontSize:10,fill:S.muted}} stroke={S.border}/><YAxis tick={{fontSize:10,fill:S.muted}} stroke={S.border}/><Tooltip contentStyle={{background:S.card,border:`1px solid ${S.border}`,borderRadius:8,fontSize:11}}/><Area type="monotone" dataKey="downloads" stroke={S.cyan} fill={S.cyan+"22"} name="다운로드"/><Area type="monotone" dataKey="uniqueUsers" stroke={S.up} fill={S.up+"22"} name="사용자"/></AreaChart></ResponsiveContainer>
    </Card>
  </div>);
}

export default function AIReadyData({ onBack }){
  const [tab,setTab]=useState("overview");
  const tabs=[{id:"overview",label:"개요",icon:"🏠"},{id:"catalog",label:"데이터 카탈로그",icon:"📦"},{id:"pipeline",label:"파이프라인",icon:"🔄"},{id:"quality",label:"품질 대시보드",icon:"✅"},{id:"usage",label:"사용량",icon:"📊"}];
  return(
    <div style={{fontFamily:"'Pretendard','Noto Sans KR',sans-serif",background:S.bg,color:S.text,minHeight:"100vh",padding:"20px"}}>
      <div style={{maxWidth:1100,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <button onClick={onBack} style={{padding:"8px 16px",borderRadius:8,border:`1px solid ${S.border}`,background:"none",color:S.sub,fontSize:12,cursor:"pointer"}}>← 포털로 돌아가기</button>
          <h1 style={{fontSize:20,fontWeight:800,margin:0}}>🧬 AI Ready Data</h1>
          <div/>
        </div>
        <div style={{marginBottom:16}}><Tab tabs={tabs} active={tab} onChange={setTab}/></div>
        {tab==="overview"&&<TabOverview/>}
        {tab==="catalog"&&<TabCatalog/>}
        {tab==="pipeline"&&<TabPipeline/>}
        {tab==="quality"&&<TabQuality/>}
        {tab==="usage"&&<TabUsage/>}
      </div>
    </div>
  );
}
