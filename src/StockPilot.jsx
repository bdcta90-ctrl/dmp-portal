import { useState, useEffect, useRef } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid, Line } from "recharts";

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
function loadD(){try{const r=localStorage.getItem(SK2);if(r)return JSON.parse(r);}catch{}return null;}
function saveD(d){try{localStorage.setItem(SK2,JSON.stringify(d));}catch(e){console.error(e);}}

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
const[data,setData]=useState(()=>{try{const c=localStorage.getItem(MKT_CACHE_KEY);return c?JSON.parse(c):{};}catch{return{};}});
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
try{localStorage.setItem(MKT_CACHE_KEY,JSON.stringify(results));}catch{}
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
export default function StockPilot({onBack}){const[unlocked,setUnlocked]=useState(false);const[pw,setPw]=useState("");const[pwError,setPwError]=useState(false);const[pwShake,setPwShake]=useState(false);
const tryUnlock=()=>{if(pw==="0613"){setUnlocked(true);setPwError(false);}else{setPwError(true);setPwShake(true);setTimeout(()=>setPwShake(false),500);setPw("");}};
if(!unlocked)return(
<div style={{width:"100%",height:"100vh",background:"linear-gradient(135deg,#0B1121,#0F172A 40%,#131C2E)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Pretendard','Noto Sans KR',-apple-system,sans-serif"}}>
<style>{`@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css');
@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}
@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
<div style={{textAlign:"center",animation:"fadeIn .5s"}}>
{onBack&&<button onClick={onBack} style={{position:"absolute",top:24,left:24,padding:"8px 16px",borderRadius:10,background:"rgba(0,229,160,0.08)",border:"1px solid rgba(0,229,160,0.2)",color:"#00E5A0",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>← DMP</button>}
<div style={{width:64,height:64,borderRadius:16,background:"linear-gradient(135deg,#00E5A0,#00B8D4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,fontWeight:900,color:"#0F172A",margin:"0 auto 20px",boxShadow:"0 8px 32px rgba(0,229,160,0.3)"}}>₩</div>
<div style={{fontSize:24,fontWeight:800,color:"#F8FAFC",marginBottom:6}}>StockPilot</div>
<div style={{fontSize:12,color:"#64748B",marginBottom:32}}>Total Asset Management · 비밀번호를 입력하세요</div>
<div style={{animation:pwShake?"shake .4s":"none"}}>
<div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:16}}>
{[0,1,2,3].map(i=><div key={i} style={{width:14,height:14,borderRadius:"50%",background:pw.length>i?"#00E5A0":"rgba(100,116,139,0.3)",border:pw.length>i?"2px solid #00E5A0":"2px solid rgba(100,116,139,0.2)",transition:"all .15s",boxShadow:pw.length>i?"0 0 8px rgba(0,229,160,0.4)":"none"}}/>)}
</div>
<input value={pw} onChange={e=>{const v=e.target.value.replace(/[^0-9]/g,"").slice(0,4);setPw(v);setPwError(false);if(v.length===4){if(v==="0613"){setTimeout(()=>setUnlocked(true),200);}else{setPwError(true);setPwShake(true);setTimeout(()=>{setPwShake(false);setPw("");},500);}}}} onKeyDown={e=>e.key==="Enter"&&tryUnlock()} type="password" inputMode="numeric" maxLength={4} placeholder="••••" autoFocus style={{width:200,padding:"14px 20px",borderRadius:14,background:"rgba(30,41,59,0.6)",border:pwError?"2px solid #FF6B6B":"2px solid rgba(0,229,160,0.2)",color:"#F8FAFC",fontSize:24,fontWeight:700,textAlign:"center",letterSpacing:12,outline:"none",fontFamily:"monospace",transition:"border .2s"}}/>
</div>
{pwError&&<div style={{marginTop:12,fontSize:12,color:"#FF6B6B",animation:"fadeIn .3s"}}>비밀번호가 일치하지 않습니다</div>}
<div style={{marginTop:24,fontSize:11,color:"#334155"}}>🔒 개인 자산 정보 보호를 위해 잠금되어 있습니다</div>
</div></div>);
const[tab,setTab]=useState(0);const[stocks,setStocks]=useState(DEFAULT_STOCKS);const[seed,setSeed]=useState(50000000);const[cash,setCash]=useState(8500000);const[withdrawals,setWithdrawals]=useState(5000000);const[events,setEvents]=useState(DEFAULT_EVENTS);const[realEstate,setRealEstate]=useState(DEFAULT_RE);const[cars,setCars]=useState(DEFAULT_CARS);const[memos,setMemos]=useState([]);const[goal,setGoal]=useState(DEFAULT_GOAL);const[expenses,setExpenses]=useState(DEFAULT_EXPENSES);const[loaded,setLoaded]=useState(false);
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
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,flexWrap:"wrap",gap:6}}><div style={{display:"flex",alignItems:"center",gap:10}}>{onBack&&<button onClick={onBack} style={{padding:"6px 14px",borderRadius:8,background:"rgba(0,229,160,0.08)",border:"1px solid rgba(0,229,160,0.2)",color:"#00E5A0",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>← DMP</button>}<div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#00E5A0,#00B8D4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:900,color:"#0F172A",boxShadow:"0 4px 16px rgba(0,229,160,0.25)"}}>₩</div><div><div style={{fontSize:18,fontWeight:800,color:"#F8FAFC"}}>StockPilot</div><div style={{fontSize:10,color:"#64748B"}}>Total Asset Management v3.0</div></div></div><div style={{display:"flex",alignItems:"center",gap:10}}><div style={{fontSize:12,color:"#475569",padding:"6px 12px",background:"rgba(30,41,59,0.5)",borderRadius:8}}>{stocks.length}종목 · 순자산 {fk(gt)}원</div></div></div>
<Nav active={tab} setActive={setTab}/>
</div>
<MemoPad memos={memos} setMemos={setMemos}/>
<div style={{minHeight:500}}>{tab===0&&<Dashboard stocks={stocks} seed={seed} withdrawals={withdrawals} cash={cash} realEstate={realEstate} cars={cars} goal={goal} setGoal={setGoal}/>}{tab===1&&<Portfolio stocks={stocks} setStocks={setStocks} cash={cash} setCash={setCash} seed={seed} setSeed={setSeed} withdrawals={withdrawals} setWithdrawals={setWithdrawals}/>}{tab===2&&<Assets realEstate={realEstate} setRealEstate={setRealEstate} cars={cars} setCars={setCars}/>}{tab===3&&<Expenses expenses={expenses} setExpenses={setExpenses}/>}{tab===4&&<Analysis stocks={stocks}/>}{tab===5&&<Chatbot stocks={stocks} cash={cash} seed={seed} realEstate={realEstate} cars={cars} expenses={expenses}/>}{tab===6&&<Insight events={events} setEvents={setEvents}/>}{tab===7&&<Market/>}</div>
<div style={{textAlign:"center",padding:"20px 0 8px",fontSize:10,color:"#334155",borderTop:"1px solid rgba(255,255,255,0.03)",marginTop:28}}>StockPilot v3.0 © 2026 · 투자의 최종 판단과 책임은 투자자 본인에게 있습니다</div></div></div>);}
