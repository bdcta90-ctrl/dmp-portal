import { useState, useEffect, useMemo, useRef } from "react";
import { ITEMS, PERSONAS, generateOrders, generatePriceHistory, FC } from "./foodData";

const S={bg:"#fafaf9",card:"#ffffff",dk:"#1c1917",sub:"#78716c",muted:"#a8a29e",bd:"#e7e5e4",
  pri:"#ea580c",priL:"#fed7aa",gn:"#16a34a",gnL:"#dcfce7",bl:"#2563eb",blL:"#dbeafe",
  rd:"#dc2626",rdL:"#fee2e2",yl:"#ca8a04",ylL:"#fef9c3",pr:"#7c3aed"};

let _orders=null,_prices=null;
function getOrders(){if(!_orders)_orders=generateOrders(10000);return _orders;}
function getPrices(){if(!_prices)_prices=generatePriceHistory(10000);return _prices;}

// ── 주문 상세 모달 ──
function OrderDetailModal({order,onClose}){
  if(!order)return null;
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",animation:"fadeIn .2s"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:14,padding:"24px 28px",maxWidth:600,width:"90%",maxHeight:"80vh",overflow:"auto",boxShadow:"0 20px 60px rgba(0,0,0,.2)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div>
            <div style={{fontSize:16,fontWeight:800}}>{order.id}</div>
            <div style={{fontSize:11,color:S.sub}}>{order.date} {order.time} · {order.customer} · {order.region}</div>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:S.sub}}>✕</button>
        </div>
        <div style={{display:"flex",gap:8,marginBottom:14}}>
          <span style={{padding:"3px 10px",borderRadius:5,fontSize:10,fontWeight:700,background:order.channel==="전화"?S.rdL:order.channel==="카톡"?S.ylL:S.blL,color:order.channel==="전화"?S.rd:order.channel==="카톡"?S.yl:S.bl}}>{order.channel}</span>
          <span style={{padding:"3px 10px",borderRadius:5,fontSize:10,fontWeight:700,background:order.status==="배송완료"?S.gnL:order.status==="배송중"?S.blL:order.status==="준비중"?S.ylL:S.rdL,color:order.status==="배송완료"?S.gn:order.status==="배송중"?S.bl:order.status==="준비중"?S.yl:S.rd}}>{order.status}</span>
          <span style={{padding:"3px 10px",borderRadius:5,fontSize:10,fontWeight:600,background:"#f5f5f4",color:S.sub}}>배송: {order.delivery}</span>
        </div>
        {/* 품목 상세 테이블 */}
        <div style={{border:`1px solid ${S.bd}`,borderRadius:8,overflow:"hidden",marginBottom:14}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
            <thead><tr style={{background:"#f5f5f4"}}>{["품목","수량","단가","소계","절감액"].map(h=><th key={h} style={{padding:"8px 10px",textAlign:"left",fontSize:9,color:S.sub,fontWeight:600}}>{h}</th>)}</tr></thead>
            <tbody>{(order.itemDetails||[]).map((it,i)=>(
              <tr key={i} style={{borderTop:`1px solid ${S.bd}`}}>
                <td style={{padding:"7px 10px",fontWeight:600}}>{it.name}</td>
                <td style={{padding:"7px 10px"}}>{it.qty} {it.unit}</td>
                <td style={{padding:"7px 10px"}}>{FC(it.price)}</td>
                <td style={{padding:"7px 10px",fontWeight:700}}>{FC(it.total)}</td>
                <td style={{padding:"7px 10px",fontWeight:700,color:it.saving>0?S.gn:S.sub}}>{it.saving>0?"▼"+FC(it.saving):"—"}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        {/* 합계 */}
        <div style={{display:"flex",justifyContent:"flex-end",gap:20,padding:"10px 0",borderTop:`2px solid ${S.dk}`}}>
          <div style={{textAlign:"right"}}><div style={{fontSize:9,color:S.sub}}>결제금액</div><div style={{fontSize:18,fontWeight:800}}>{FC(order.total)}</div></div>
          {order.saving>0&&<div style={{textAlign:"right"}}><div style={{fontSize:9,color:S.sub}}>AI 절감</div><div style={{fontSize:18,fontWeight:800,color:S.gn}}>▼{FC(order.saving)}</div></div>}
        </div>
      </div>
    </div>
  );
}

// ── 전체 주문 이력 모달 (사용자별) ──
function OrderHistoryModal({orders,personaName,onClose}){
  const[selOrder,setSelOrder]=useState(null);
  const[histPage,setHistPage]=useState(0);
  const PAGE=20;

  // 품목별 집계
  const itemStats=useMemo(()=>{
    const map={};
    orders.forEach(o=>(o.itemDetails||[]).forEach(it=>{
      if(!map[it.name])map[it.name]={name:it.name,totalQty:0,unit:it.unit,totalAmount:0,totalSaving:0,orderCount:0};
      map[it.name].totalQty+=it.qty;
      map[it.name].totalAmount+=it.total;
      map[it.name].totalSaving+=it.saving;
      map[it.name].orderCount++;
    }));
    return Object.values(map).sort((a,b)=>b.totalAmount-a.totalAmount);
  },[orders]);

  const totalPages=Math.ceil(orders.length/PAGE);
  const paged=orders.slice(histPage*PAGE,(histPage+1)*PAGE);

  if(selOrder)return <OrderDetailModal order={selOrder} onClose={()=>setSelOrder(null)}/>;

  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",zIndex:9998,display:"flex",alignItems:"center",justifyContent:"center",animation:"fadeIn .2s"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:14,padding:"24px 28px",maxWidth:900,width:"95%",maxHeight:"85vh",overflow:"auto",boxShadow:"0 20px 60px rgba(0,0,0,.2)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div><div style={{fontSize:16,fontWeight:800}}>{personaName} 전체 주문 이력</div><div style={{fontSize:11,color:S.sub}}>총 {orders.length}건</div></div>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:S.sub}}>✕</button>
        </div>

        {/* 품목별 집계 */}
        <div style={{background:"#fafaf9",borderRadius:10,padding:"14px 16px",border:`1px solid ${S.bd}`,marginBottom:14}}>
          <div style={{fontSize:12,fontWeight:700,marginBottom:8}}>📦 품목별 집계 (Top 15)</div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:10}}>
              <thead><tr style={{background:"#fff"}}>{["품목","주문횟수","총 수량","단위","주문 금액","절감 금액"].map(h=><th key={h} style={{padding:"6px 8px",textAlign:"left",fontSize:9,color:S.sub,fontWeight:600}}>{h}</th>)}</tr></thead>
              <tbody>{itemStats.slice(0,15).map((it,i)=>(
                <tr key={it.name} style={{borderTop:`1px solid ${S.bd}`}}>
                  <td style={{padding:"5px 8px",fontWeight:600}}><span style={{color:S.pri,fontWeight:700}}>{i+1}.</span> {it.name}</td>
                  <td style={{padding:"5px 8px"}}>{it.orderCount}회</td>
                  <td style={{padding:"5px 8px",fontWeight:700}}>{it.totalQty}</td>
                  <td style={{padding:"5px 8px",color:S.sub,fontSize:9}}>{it.unit}</td>
                  <td style={{padding:"5px 8px",fontWeight:700}}>{FC(it.totalAmount)}</td>
                  <td style={{padding:"5px 8px",fontWeight:700,color:it.totalSaving>0?S.gn:S.sub}}>{it.totalSaving>0?"▼"+FC(it.totalSaving):"—"}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>

        {/* 주문 목록 */}
        <div style={{fontSize:12,fontWeight:700,marginBottom:8}}>📋 주문 목록 (클릭 시 상세)</div>
        <div style={{border:`1px solid ${S.bd}`,borderRadius:8,overflow:"hidden"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:10}}>
            <thead><tr style={{background:"#f5f5f4"}}>{["주문번호","날짜","시간","채널","품목수","결제금액","절감","상태"].map(h=><th key={h} style={{padding:"7px 8px",textAlign:"left",fontSize:9,color:S.sub,fontWeight:600}}>{h}</th>)}</tr></thead>
            <tbody>{paged.map(o=>(
              <tr key={o.id} onClick={()=>setSelOrder(o)} style={{borderTop:`1px solid ${S.bd}`,cursor:"pointer",transition:"background .1s"}} onMouseEnter={e=>e.currentTarget.style.background="#fef7f0"} onMouseLeave={e=>e.currentTarget.style.background=""}>
                <td style={{padding:"5px 8px",fontFamily:"monospace",color:S.sub,fontSize:9}}>{o.id}</td>
                <td style={{padding:"5px 8px"}}>{o.date}</td>
                <td style={{padding:"5px 8px",color:S.sub}}>{o.time}</td>
                <td style={{padding:"5px 8px"}}><span style={{padding:"1px 5px",borderRadius:3,fontSize:8,fontWeight:600,background:o.channel==="전화"?S.rdL:o.channel==="카톡"?S.ylL:S.blL,color:o.channel==="전화"?S.rd:o.channel==="카톡"?S.yl:S.bl}}>{o.channel}</span></td>
                <td style={{padding:"5px 8px"}}>{o.itemCount}개</td>
                <td style={{padding:"5px 8px",fontWeight:700}}>{FC(o.total)}</td>
                <td style={{padding:"5px 8px",fontWeight:700,color:o.saving>0?S.gn:S.sub}}>{o.saving>0?"▼"+FC(o.saving):"—"}</td>
                <td style={{padding:"5px 8px"}}><span style={{padding:"1px 5px",borderRadius:3,fontSize:8,fontWeight:600,background:o.status==="배송완료"?S.gnL:o.status==="배송중"?S.blL:o.status==="준비중"?S.ylL:S.rdL,color:o.status==="배송완료"?S.gn:o.status==="배송중"?S.bl:o.status==="준비중"?S.yl:S.rd}}>{o.status}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        {totalPages>1&&<div style={{display:"flex",gap:4,justifyContent:"center",marginTop:10}}>
          <button disabled={histPage===0} onClick={()=>setHistPage(p=>p-1)} style={{padding:"4px 10px",borderRadius:4,border:`1px solid ${S.bd}`,background:"#fff",fontSize:10,cursor:"pointer"}}>◀ 이전</button>
          <span style={{padding:"4px 10px",fontSize:10,color:S.sub}}>{histPage+1} / {totalPages}</span>
          <button disabled={histPage>=totalPages-1} onClick={()=>setHistPage(p=>p+1)} style={{padding:"4px 10px",borderRadius:4,border:`1px solid ${S.bd}`,background:"#fff",fontSize:10,cursor:"pointer"}}>다음 ▶</button>
        </div>}
      </div>
    </div>
  );
}

export default function FoodPlatform({onBack}){
  const[tab,setTab]=useState("admin");
  const[search,setSearch]=useState("");
  const[page,setPage]=useState(0);
  const[selectedItem,setSelectedItem]=useState(null);
  const[cart,setCart]=useState([]);
  const[aiResult,setAiResult]=useState(null);
  const[catFilter,setCatFilter]=useState("전체");
  const[detailOrder,setDetailOrder]=useState(null);
  const[historyModal,setHistoryModal]=useState(null); // {personaName, orders}
  const[orderPeriod,setOrderPeriod]=useState("day"); // day, week, month
  const[liveOrders,setLiveOrders]=useState([]);
  const[newOrderFlash,setNewOrderFlash]=useState(null);
  const liveIdRef=useRef(10001);
  const PAGE_SIZE=50;

  const orders=useMemo(()=>getOrders(),[]);
  const prices=useMemo(()=>getPrices(),[]);

  // ── 실시간 주문 시뮬레이션 ──
  useEffect(()=>{
    // 초기 최근 주문으로 시작
    setLiveOrders(orders.slice(0,30));

    const interval=setInterval(()=>{
      const template=orders[Math.floor(Math.random()*orders.length)];
      const now=new Date();
      const newOrder={
        ...template,
        id:`ORD-${String(liveIdRef.current++).padStart(5,"0")}`,
        date:`${now.getFullYear()}.${String(now.getMonth()+1).padStart(2,"0")}.${String(now.getDate()).padStart(2,"0")}`,
        time:`${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`,
        status:Math.random()<0.6?"준비중":"배송중",
        _isNew:true,
      };
      setLiveOrders(prev=>[newOrder,...prev].slice(0,200));
      setNewOrderFlash(newOrder.id);
      setTimeout(()=>setNewOrderFlash(null),2000);
    },4000+Math.random()*3000);

    return()=>clearInterval(interval);
  },[orders]);

  // ── 기간별 주문 필터 (관리자 대시보드용) ──
  const periodOrders=useMemo(()=>{
    const today=new Date(2026,2,25);
    const todayStr=`${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,"0")}.${String(today.getDate()).padStart(2,"0")}`;
    if(orderPeriod==="day") return orders.filter(o=>o.date===todayStr);
    if(orderPeriod==="week"){
      const weekAgo=new Date(today);weekAgo.setDate(weekAgo.getDate()-7);
      const wStr=`${weekAgo.getFullYear()}.${String(weekAgo.getMonth()+1).padStart(2,"0")}.${String(weekAgo.getDate()).padStart(2,"0")}`;
      return orders.filter(o=>o.date>=wStr&&o.date<=todayStr);
    }
    // month
    const monthAgo=new Date(today);monthAgo.setDate(monthAgo.getDate()-30);
    const mStr=`${monthAgo.getFullYear()}.${String(monthAgo.getMonth()+1).padStart(2,"0")}.${String(monthAgo.getDate()).padStart(2,"0")}`;
    return orders.filter(o=>o.date>=mStr&&o.date<=todayStr);
  },[orders,orderPeriod]);

  const addCart=(itemId,qty)=>setCart(p=>{const ex=p.find(c=>c.id===itemId);if(ex)return p.map(c=>c.id===itemId?{...c,qty}:c);return[...p,{id:itemId,qty}];});

  const runAI=()=>{
    if(!cart.length)return;
    const result=cart.map(c=>{
      const it=ITEMS.find(i=>i.id===c.id);
      const best=it.suppliers[0],worst=it.suppliers[it.suppliers.length-1];
      return{name:it.name,unit:it.unit,qty:c.qty,supplier:best.name,price:best.price,total:best.price*c.qty,worstTotal:worst.price*c.qty,saving:(worst.price-best.price)*c.qty,rating:best.rating,cold:best.cold,delivery:best.delivery};
    });
    setAiResult({items:result,total:result.reduce((s,r)=>s+r.total,0),saving:result.reduce((s,r)=>s+r.saving,0),suppliers:[...new Set(result.map(r=>r.supplier))]});
  };

  const tabs=[
    {id:"admin",name:"관리자 대시보드",icon:"📊"},
    {id:"user",name:"사용자 대시보드",icon:"👤"},
    {id:"order",name:"식자재 주문",icon:"🛒"},
    {id:"price",name:"시세 현황",icon:"📈"},
    {id:"history",name:"주문 이력",icon:"📋"},
  ];

  const totalOrders=orders.length;
  const totalRevenue=orders.reduce((s,o)=>s+o.total,0);
  const totalSaving=orders.reduce((s,o)=>s+o.saving,0);
  const delivered=orders.filter(o=>o.status==="배송완료").length;
  const todayOrders=orders.filter(o=>o.date==="2026.03.25");
  const channelDist={전화:orders.filter(o=>o.channel==="전화").length,카톡:orders.filter(o=>o.channel==="카톡").length,앱:orders.filter(o=>o.channel==="앱").length};

  const jungOrders=orders.filter(o=>o.customer.includes("정복순"));
  const yunOrders=orders.filter(o=>o.customer.includes("윤지호"));

  const cats=["전체",...new Set(ITEMS.map(i=>i.cat))];

  const periodStats=useMemo(()=>({
    count:periodOrders.length,
    revenue:periodOrders.reduce((s,o)=>s+o.total,0),
    saving:periodOrders.reduce((s,o)=>s+o.saving,0),
    delivered:periodOrders.filter(o=>o.status==="배송완료").length,
  }),[periodOrders]);

  return(
    <div style={{minHeight:"100vh",background:S.bg,fontFamily:"'Pretendard','맑은 고딕',sans-serif"}}>
      {/* 모달들 */}
      {detailOrder&&<OrderDetailModal order={detailOrder} onClose={()=>setDetailOrder(null)}/>}
      {historyModal&&<OrderHistoryModal orders={historyModal.orders} personaName={historyModal.personaName} onClose={()=>setHistoryModal(null)}/>}

      {/* 헤더 */}
      <div style={{background:S.pri,padding:"10px 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button onClick={onBack} style={{background:"rgba(255,255,255,.2)",border:"none",borderRadius:6,padding:"5px 10px",color:"#fff",fontSize:11,cursor:"pointer"}}>← 돌아가기</button>
          <span style={{fontSize:18,fontWeight:800,color:"#fff"}}>🍳 식자재 AI</span>
          <span style={{fontSize:10,color:"rgba(255,255,255,.6)"}}>소상공인 구매 최적화 · {ITEMS.length}품목 · {orders.length.toLocaleString()}건 주문</span>
        </div>
        {cart.length>0&&<span style={{background:"rgba(255,255,255,.2)",borderRadius:6,padding:"5px 12px",fontSize:11,color:"#fff",cursor:"pointer"}}>🛒 {cart.length}개</span>}
      </div>
      {/* 탭 */}
      <div style={{background:"#fff",borderBottom:`1px solid ${S.bd}`,padding:"0 24px",display:"flex",gap:0,overflowX:"auto"}}>
        {tabs.map(t=><button key={t.id} onClick={()=>{setTab(t.id);setPage(0);setSearch("");}} style={{padding:"10px 16px",border:"none",borderBottom:tab===t.id?`3px solid ${S.pri}`:"3px solid transparent",background:"transparent",fontSize:11,fontWeight:tab===t.id?700:500,color:tab===t.id?S.pri:S.sub,cursor:"pointer",whiteSpace:"nowrap"}}>{t.icon} {t.name}</button>)}
      </div>

      <div style={{padding:"16px 24px",maxWidth:1400,margin:"0 auto"}}>

      {/* ═══ 관리자 대시보드 ═══ */}
      {tab==="admin"&&<div style={{animation:"fadeIn .3s"}}>
        <div style={{fontSize:15,fontWeight:800,marginBottom:12}}>📊 관리자 대시보드 — 전체 운영 현황</div>
        {/* KPI 카드 */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:8,marginBottom:14}}>
          {[{v:totalOrders.toLocaleString()+"건",l:"총 주문",c:S.bl},{v:FC(totalRevenue),l:"총 거래액",c:S.pri},{v:FC(totalSaving),l:"총 절감액",c:S.gn},{v:Math.round(delivered/totalOrders*100)+"%",l:"배송 완료율",c:S.gn},{v:todayOrders.length+"건",l:"오늘 주문",c:S.pr},{v:ITEMS.length+"개",l:"등록 품목",c:S.yl}].map(k=>(
            <div key={k.l} style={{background:"#fff",borderRadius:10,padding:"12px 14px",border:`1px solid ${S.bd}`}}>
              <div style={{fontSize:18,fontWeight:800,color:k.c}}>{k.v}</div>
              <div style={{fontSize:9,color:S.sub,marginTop:2}}>{k.l}</div>
            </div>
          ))}
        </div>
        {/* 채널별 분포 + Top5 + 시세급등 */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
          <div style={{background:"#fff",borderRadius:10,padding:"14px 16px",border:`1px solid ${S.bd}`}}>
            <div style={{fontSize:12,fontWeight:700,marginBottom:10}}>📱 채널별 주문 분포</div>
            {[{ch:"🔴 전화",cnt:channelDist.전화,c:S.rd},{ch:"🟡 카카오톡",cnt:channelDist.카톡,c:S.yl},{ch:"🔵 앱",cnt:channelDist.앱,c:S.bl}].map(c=>{
              const pct=Math.round(c.cnt/totalOrders*100);
              return(<div key={c.ch} style={{marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:10,marginBottom:3}}><span>{c.ch}</span><span style={{fontWeight:700}}>{c.cnt.toLocaleString()}건 ({pct}%)</span></div>
                <div style={{height:6,borderRadius:3,background:"#f5f5f4"}}><div style={{height:6,borderRadius:3,background:c.c,width:pct+"%",transition:"width .5s"}}/></div>
              </div>);
            })}
          </div>
          <div style={{background:"#fff",borderRadius:10,padding:"14px 16px",border:`1px solid ${S.bd}`}}>
            <div style={{fontSize:12,fontWeight:700,marginBottom:10}}>🏆 Top 5 인기 품목</div>
            {(()=>{const freq={};orders.forEach(o=>o.items.forEach(it=>{const name=it.split(" ")[0];freq[name]=(freq[name]||0)+1;}));return Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,5);})().map(([name,cnt],i)=>(
              <div key={name} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",fontSize:10,borderBottom:`1px solid ${S.bd}`}}>
                <span><span style={{fontWeight:700,color:S.pri}}>{i+1}.</span> {name}</span>
                <span style={{fontWeight:600}}>{cnt.toLocaleString()}건</span>
              </div>
            ))}
          </div>
          <div style={{background:"#fff",borderRadius:10,padding:"14px 16px",border:`1px solid ${S.bd}`}}>
            <div style={{fontSize:12,fontWeight:700,marginBottom:10}}>📈 시세 급등 품목</div>
            {prices.filter(p=>p.change>5).slice(0,5).map((p,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",fontSize:10,borderBottom:`1px solid ${S.bd}`}}>
                <span>{p.item}</span>
                <span style={{fontWeight:700,color:S.rd}}>+{p.change}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── 실시간 주문 피드 ── */}
        <div style={{background:"#fff",borderRadius:10,padding:"14px 16px",border:`1px solid ${S.bd}`,marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:12,fontWeight:700}}>🔴 실시간 주문</span>
              <span style={{width:8,height:8,borderRadius:"50%",background:S.rd,display:"inline-block",animation:"pulse 1.5s infinite"}}/>
            </div>
          </div>
          <div style={{maxHeight:320,overflow:"auto"}}>
            <table style={{width:"100%",minWidth:900,borderCollapse:"collapse",fontSize:10}}>
              <thead><tr style={{background:"#f5f5f4",position:"sticky",top:0,zIndex:1}}>{["주문번호","날짜","시간","사장님","지역","채널","품목수","결제금액","AI절감","상태"].map(h=><th key={h} style={{padding:"7px 8px",textAlign:"left",color:S.sub,fontWeight:600,fontSize:9}}>{h}</th>)}</tr></thead>
              <tbody>{liveOrders.slice(0,50).map(o=>(
                <tr key={o.id} onClick={()=>setDetailOrder(o)} style={{borderTop:`1px solid ${S.bd}`,cursor:"pointer",background:newOrderFlash===o.id?"#fff7ed":"transparent",transition:"background .6s"}} onMouseEnter={e=>{if(newOrderFlash!==o.id)e.currentTarget.style.background="#fef7f0";}} onMouseLeave={e=>{if(newOrderFlash!==o.id)e.currentTarget.style.background="";}}>
                  <td style={{padding:"6px 8px",fontFamily:"monospace",color:S.sub,fontSize:9}}>{o.id}{o._isNew&&<span style={{marginLeft:4,padding:"0 4px",borderRadius:3,background:S.rdL,color:S.rd,fontSize:7,fontWeight:700}}>NEW</span>}</td>
                  <td style={{padding:"6px 8px"}}>{o.date}</td>
                  <td style={{padding:"6px 8px",color:S.sub}}>{o.time}</td>
                  <td style={{padding:"6px 8px",fontWeight:600}}>{o.customer}</td>
                  <td style={{padding:"6px 8px",fontSize:9,color:S.sub}}>{o.region}</td>
                  <td style={{padding:"6px 8px"}}><span style={{padding:"1px 5px",borderRadius:3,fontSize:8,fontWeight:600,background:o.channel==="전화"?S.rdL:o.channel==="카톡"?S.ylL:S.blL,color:o.channel==="전화"?S.rd:o.channel==="카톡"?S.yl:S.bl}}>{o.channel}</span></td>
                  <td style={{padding:"6px 8px"}}>{o.itemCount}개</td>
                  <td style={{padding:"6px 8px",fontWeight:700}}>{FC(o.total)}</td>
                  <td style={{padding:"6px 8px",fontWeight:700,color:S.gn}}>{o.saving>0?"▼"+FC(o.saving):"—"}</td>
                  <td style={{padding:"6px 8px"}}><span style={{padding:"1px 5px",borderRadius:3,fontSize:8,fontWeight:600,background:o.status==="배송완료"?S.gnL:o.status==="배송중"?S.blL:o.status==="준비중"?S.ylL:S.rdL,color:o.status==="배송완료"?S.gn:o.status==="배송중"?S.bl:o.status==="준비중"?S.yl:S.rd}}>{o.status}</span></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>

        {/* ── 기간별 주문 현황 ── */}
        <div style={{background:"#fff",borderRadius:10,padding:"14px 16px",border:`1px solid ${S.bd}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <span style={{fontSize:12,fontWeight:700}}>📅 기간별 주문 현황</span>
            <div style={{display:"flex",gap:4}}>
              {[{id:"day",label:"일"},{id:"week",label:"주"},{id:"month",label:"월"}].map(p=>(
                <button key={p.id} onClick={()=>setOrderPeriod(p.id)} style={{padding:"4px 12px",borderRadius:5,border:`1px solid ${orderPeriod===p.id?S.pri:S.bd}`,background:orderPeriod===p.id?S.priL:"#fff",color:orderPeriod===p.id?S.pri:S.sub,fontSize:10,fontWeight:orderPeriod===p.id?700:500,cursor:"pointer"}}>{p.label}</button>
              ))}
            </div>
          </div>
          {/* 기간 KPI */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:10}}>
            {[{v:periodStats.count.toLocaleString()+"건",l:"주문수",c:S.bl},{v:FC(periodStats.revenue),l:"거래액",c:S.pri},{v:FC(periodStats.saving),l:"절감액",c:S.gn},{v:periodStats.count>0?Math.round(periodStats.delivered/periodStats.count*100)+"%":"0%",l:"배송완료율",c:S.gn}].map(k=>(
              <div key={k.l} style={{textAlign:"center",padding:"10px 8px",background:"#fafaf9",borderRadius:8}}>
                <div style={{fontSize:16,fontWeight:800,color:k.c}}>{k.v}</div>
                <div style={{fontSize:9,color:S.sub}}>{k.l}</div>
              </div>
            ))}
          </div>
          {/* 기간 주문 테이블 */}
          <div style={{maxHeight:250,overflow:"auto"}}>
            <table style={{width:"100%",minWidth:900,borderCollapse:"collapse",fontSize:10}}>
              <thead><tr style={{background:"#f5f5f4",position:"sticky",top:0}}>{["주문번호","날짜","시간","사장님","지역","채널","품목수","결제금액","AI절감","상태"].map(h=><th key={h} style={{padding:"7px 8px",textAlign:"left",color:S.sub,fontWeight:600,fontSize:9}}>{h}</th>)}</tr></thead>
              <tbody>{periodOrders.slice(0,50).map(o=>(
                <tr key={o.id} onClick={()=>setDetailOrder(o)} style={{borderTop:`1px solid ${S.bd}`,cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.background="#fef7f0"} onMouseLeave={e=>e.currentTarget.style.background=""}>
                  <td style={{padding:"6px 8px",fontFamily:"monospace",color:S.sub,fontSize:9}}>{o.id}</td>
                  <td style={{padding:"6px 8px"}}>{o.date}</td>
                  <td style={{padding:"6px 8px",color:S.sub}}>{o.time}</td>
                  <td style={{padding:"6px 8px",fontWeight:600}}>{o.customer}</td>
                  <td style={{padding:"6px 8px",fontSize:9,color:S.sub}}>{o.region}</td>
                  <td style={{padding:"6px 8px"}}><span style={{padding:"1px 5px",borderRadius:3,fontSize:8,fontWeight:600,background:o.channel==="전화"?S.rdL:o.channel==="카톡"?S.ylL:S.blL,color:o.channel==="전화"?S.rd:o.channel==="카톡"?S.yl:S.bl}}>{o.channel}</span></td>
                  <td style={{padding:"6px 8px"}}>{o.itemCount}개</td>
                  <td style={{padding:"6px 8px",fontWeight:700}}>{FC(o.total)}</td>
                  <td style={{padding:"6px 8px",fontWeight:700,color:S.gn}}>{o.saving>0?"▼"+FC(o.saving):"—"}</td>
                  <td style={{padding:"6px 8px"}}><span style={{padding:"1px 5px",borderRadius:3,fontSize:8,fontWeight:600,background:o.status==="배송완료"?S.gnL:o.status==="배송중"?S.blL:o.status==="준비중"?S.ylL:S.rdL,color:o.status==="배송완료"?S.gn:o.status==="배송중"?S.bl:o.status==="준비중"?S.yl:S.rd}}>{o.status}</span></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          {periodOrders.length>50&&<div style={{fontSize:9,color:S.sub,textAlign:"center",marginTop:6}}>상위 50건 표시 / 총 {periodOrders.length.toLocaleString()}건</div>}
        </div>
      </div>}

      {/* ═══ 사용자 대시보드 (정복순 + 윤지호) ═══ */}
      {tab==="user"&&<div style={{animation:"fadeIn .3s"}}>
        <div style={{fontSize:15,fontWeight:800,marginBottom:12}}>👤 사용자 대시보드 — 사장님 시뮬레이션</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          {PERSONAS.map(p=>{
            const myOrders=p.name==="정복순"?jungOrders:yunOrders;
            const myTotal=myOrders.reduce((s,o)=>s+o.total,0);
            const mySaving=myOrders.reduce((s,o)=>s+o.saving,0);
            const myDelivered=myOrders.filter(o=>o.status==="배송완료").length;
            return(
              <div key={p.name} style={{background:"#fff",borderRadius:14,border:`2px solid ${p.channel==="전화"?S.rd:S.bl}20`,overflow:"hidden"}}>
                {/* 프로필 헤더 */}
                <div style={{background:p.channel==="전화"?"linear-gradient(135deg,#fef2f2,#fff)":"linear-gradient(135deg,#eff6ff,#fff)",padding:"16px 20px",borderBottom:`1px solid ${S.bd}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <span style={{fontSize:36}}>{p.emoji}</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:16,fontWeight:800}}>{p.name} ({p.age}세)</div>
                      <div style={{fontSize:11,color:S.sub}}>{p.biz} · {p.region}</div>
                      <div style={{fontSize:10,color:S.sub,marginTop:2}}>{p.desc}</div>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:3}}>
                      <span style={{padding:"3px 8px",borderRadius:4,fontSize:9,fontWeight:700,background:p.channel==="전화"?S.rdL:S.blL,color:p.channel==="전화"?S.rd:S.bl}}>{p.channel==="전화"?"🔴 전화 주문":"🔵 앱 주문"}</span>
                      <span style={{padding:"3px 8px",borderRadius:4,fontSize:9,fontWeight:600,background:"#f5f5f4",color:S.sub}}>디지털 {"★".repeat(p.digital)}{"☆".repeat(5-p.digital)}</span>
                    </div>
                  </div>
                </div>
                {/* KPI */}
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,padding:"12px 16px"}}>
                  {[{v:myOrders.length+"건",l:"총 주문",c:S.bl},{v:FC(myTotal),l:"총 결제",c:S.dk},{v:FC(mySaving),l:"AI 절감",c:S.gn},{v:myDelivered+"건",l:"배송 완료",c:S.gn}].map(k=>(
                    <div key={k.l} style={{textAlign:"center",padding:"8px 4px",background:"#fafaf9",borderRadius:8}}>
                      <div style={{fontSize:14,fontWeight:800,color:k.c}}>{k.v}</div>
                      <div style={{fontSize:8,color:S.sub}}>{k.l}</div>
                    </div>
                  ))}
                </div>
                {/* 단골 품목 */}
                <div style={{padding:"0 16px 8px"}}>
                  <div style={{fontSize:10,fontWeight:700,color:S.sub,marginBottom:4}}>주요 주문 품목</div>
                  <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                    {p.items.map(it=><span key={it} style={{padding:"2px 8px",borderRadius:4,fontSize:9,background:S.priL,color:S.pri,fontWeight:600}}>{it}</span>)}
                  </div>
                </div>
                {/* 최근 주문 5건 + 전체 주문보기 버튼 */}
                <div style={{padding:"8px 16px 14px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                    <span style={{fontSize:10,fontWeight:700,color:S.sub}}>최근 주문 5건</span>
                    <button onClick={()=>setHistoryModal({personaName:p.name,orders:myOrders})} style={{padding:"3px 10px",borderRadius:5,border:`1px solid ${S.pri}`,background:S.priL,color:S.pri,fontSize:9,fontWeight:700,cursor:"pointer",transition:"all .15s"}} onMouseEnter={e=>{e.currentTarget.style.background=S.pri;e.currentTarget.style.color="#fff";}} onMouseLeave={e=>{e.currentTarget.style.background=S.priL;e.currentTarget.style.color=S.pri;}}>전체 주문보기 →</button>
                  </div>
                  {myOrders.slice(0,5).map(o=>(
                    <div key={o.id} onClick={()=>setDetailOrder(o)} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:`1px solid ${S.bd}`,fontSize:10,cursor:"pointer",transition:"background .1s"}} onMouseEnter={e=>e.currentTarget.style.background="#fef7f0"} onMouseLeave={e=>e.currentTarget.style.background=""}>
                      <div>
                        <span style={{color:S.sub}}>{o.date}</span>
                        <span style={{marginLeft:6}}>{o.items.slice(0,3).join(", ")}{o.items.length>3?"...":""}</span>
                      </div>
                      <div style={{display:"flex",gap:8}}>
                        <span style={{fontWeight:600}}>{FC(o.total)}</span>
                        {o.saving>0&&<span style={{color:S.gn,fontWeight:700}}>▼{FC(o.saving)}</span>}
                      </div>
                    </div>
                  ))}
                </div>
                {/* 채널 시뮬레이션 */}
                <div style={{background:"#f9fafb",padding:"12px 16px",borderTop:`1px solid ${S.bd}`}}>
                  <div style={{fontSize:10,fontWeight:700,color:S.pri,marginBottom:6}}>{p.channel==="전화"?"📞 전화 주문 시뮬레이션":"📱 앱 주문 시뮬레이션"}</div>
                  {p.channel==="전화"?(
                    <div style={{background:"#fff",borderRadius:8,padding:"10px 14px",border:`1px solid ${S.bd}`,fontSize:10,color:S.dk,lineHeight:1.7}}>
                      <div style={{color:S.sub,fontSize:9}}>📞 AI 상담원 대화</div>
                      <div style={{marginTop:4}}><b>정복순:</b> "여보세요, 어제랑 같이 보내주세요"</div>
                      <div><b>AI:</b> "네 사장님, 대파 1단, 멸치 500g, 양파 반 망 맞으시죠?"</div>
                      <div><b>정복순:</b> "응 맞아"</div>
                      <div><b>AI:</b> "오늘 대파가 어제보다 12% 올랐어요. 쪽파로 바꾸시면 3,200원 아낄 수 있는데 어떠세요?"</div>
                      <div><b>정복순:</b> "아이고 그럼 쪽파로 해줘"</div>
                      <div><b>AI:</b> "네! 총 24,550원이고 내일 새벽 6시에 도착합니다. 어제보다 3,200원 아꼈어요!"</div>
                    </div>
                  ):(
                    <div style={{background:"#fff",borderRadius:8,padding:"10px 14px",border:`1px solid ${S.bd}`,fontSize:10,color:S.dk}}>
                      <div style={{color:S.sub,fontSize:9}}>📱 앱 화면 시뮬레이션</div>
                      <div style={{display:"flex",gap:6,marginTop:6,flexWrap:"wrap"}}>
                        {["🔄 어제랑 같이 주문","📊 가격 비교","⚡ 최저가 자동 매칭","🛒 원클릭 결제"].map(btn=>(
                          <span key={btn} style={{padding:"5px 10px",borderRadius:6,background:S.blL,color:S.bl,fontSize:9,fontWeight:600}}>{btn}</span>
                        ))}
                      </div>
                      <div style={{marginTop:8,padding:"8px 10px",borderRadius:6,background:S.gnL,fontSize:10}}>
                        <span style={{fontWeight:700,color:S.gn}}>AI 추천:</span> 닭가슴살 → 축산도매D가 오늘 5% 할인 중. 전환 시 ₩3,400 절감!
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>}

      {/* ═══ 식자재 주문 ═══ */}
      {tab==="order"&&<div style={{animation:"fadeIn .3s"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div style={{fontSize:15,fontWeight:800}}>🛒 식자재 주문 — {ITEMS.length}품목</div>
          {cart.length>0&&<button onClick={runAI} style={{padding:"7px 18px",borderRadius:7,border:"none",background:S.pri,color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer"}}>🤖 AI 최적화 ({cart.length}개)</button>}
        </div>
        <div style={{display:"flex",gap:4,marginBottom:10,flexWrap:"wrap"}}>
          {cats.map(c=><button key={c} onClick={()=>{setCatFilter(c);setPage(0);}} style={{padding:"4px 10px",borderRadius:5,border:`1px solid ${catFilter===c?S.pri:S.bd}`,background:catFilter===c?S.priL:"#fff",color:catFilter===c?S.pri:S.sub,fontSize:9,fontWeight:catFilter===c?700:500,cursor:"pointer"}}>{c}</button>)}
        </div>
        <input value={search} onChange={e=>{setSearch(e.target.value);setPage(0);}} placeholder="🔍 품목 검색..." style={{padding:"7px 12px",borderRadius:6,border:`1px solid ${S.bd}`,background:"#fff",fontSize:11,width:250,marginBottom:10,outline:"none"}}/>
        {(()=>{
          const filtered=ITEMS.filter(i=>(catFilter==="전체"||i.cat===catFilter)&&(!search||i.name.includes(search)));
          const paged=filtered.slice(page*PAGE_SIZE,(page+1)*PAGE_SIZE);
          const totalPages=Math.ceil(filtered.length/PAGE_SIZE);
          return(<>
            <div style={{fontSize:9,color:S.sub,marginBottom:6}}>{filtered.length}개 품목 (페이지 {page+1}/{totalPages})</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:8,marginBottom:10}}>
              {paged.map(item=>{
                const best=item.suppliers[0].price,worst=item.suppliers[item.suppliers.length-1].price;
                const inCart=cart.find(c=>c.id===item.id);
                return(
                  <div key={item.id} onClick={()=>setSelectedItem(selectedItem===item.id?null:item.id)} style={{background:"#fff",borderRadius:10,padding:"10px 12px",border:`1.5px solid ${selectedItem===item.id?S.pri:inCart?S.gn+"40":S.bd}`,cursor:"pointer",transition:"all .12s"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{fontSize:11,fontWeight:700}}>{item.name}</span>
                      <span style={{fontSize:7,padding:"1px 5px",borderRadius:3,background:item.cat==="육류"?S.rdL:item.cat==="채소"?S.gnL:item.cat==="수산"?S.blL:S.ylL,color:item.cat==="육류"?S.rd:item.cat==="채소"?S.gn:item.cat==="수산"?S.bl:S.yl,fontWeight:600}}>{item.cat}</span>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginTop:4}}>
                      <div><span style={{fontSize:14,fontWeight:800,color:S.pri}}>{FC(best)}</span><span style={{fontSize:8,color:S.sub,marginLeft:4}}>/{item.unit}</span></div>
                      <span style={{fontSize:8,color:S.gn}}>{item.suppliers.length}곳</span>
                    </div>
                    {inCart&&<div style={{fontSize:8,color:S.gn,fontWeight:700,marginTop:2}}>✅ 장바구니: {inCart.qty}개</div>}
                    {selectedItem===item.id&&<div style={{marginTop:6,borderTop:`1px solid ${S.bd}`,paddingTop:6}}>
                      {item.suppliers.map((sup,si)=>(
                        <div key={si} style={{display:"flex",justifyContent:"space-between",fontSize:9,padding:"3px 0"}}>
                          <span style={{color:si===0?S.gn:S.dk}}>{si===0?"⭐ ":""}{sup.name} <span style={{color:S.sub}}>({sup.rating}점{sup.cold?" ❄️":""})</span></span>
                          <span style={{fontWeight:700,color:si===0?S.gn:S.dk}}>{FC(sup.price)}</span>
                        </div>
                      ))}
                      <div style={{display:"flex",gap:4,marginTop:6}}>
                        {[1,2,3,5,10].map(q=><button key={q} onClick={e=>{e.stopPropagation();addCart(item.id,q);}} style={{flex:1,padding:"4px 0",borderRadius:4,border:`1px solid ${inCart?.qty===q?S.pri:S.bd}`,background:inCart?.qty===q?S.priL:"#fff",color:inCart?.qty===q?S.pri:S.dk,fontSize:9,fontWeight:600,cursor:"pointer"}}>{q}</button>)}
                      </div>
                    </div>}
                  </div>
                );
              })}
            </div>
            {totalPages>1&&<div style={{display:"flex",gap:4,justifyContent:"center"}}>
              <button disabled={page===0} onClick={()=>setPage(p=>p-1)} style={{padding:"4px 10px",borderRadius:4,border:`1px solid ${S.bd}`,background:"#fff",fontSize:10,cursor:"pointer"}}>◀ 이전</button>
              <span style={{padding:"4px 10px",fontSize:10,color:S.sub}}>{page+1} / {totalPages}</span>
              <button disabled={page>=totalPages-1} onClick={()=>setPage(p=>p+1)} style={{padding:"4px 10px",borderRadius:4,border:`1px solid ${S.bd}`,background:"#fff",fontSize:10,cursor:"pointer"}}>다음 ▶</button>
            </div>}
          </>);
        })()}
        {aiResult&&<div style={{background:S.gnL,borderRadius:12,padding:"16px 20px",border:`2px solid ${S.gn}`,marginTop:14,animation:"fadeIn .3s"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div><div style={{fontSize:14,fontWeight:800,color:S.gn}}>🤖 AI 최적 조합 완료!</div><div style={{fontSize:10,color:S.sub}}>{aiResult.suppliers.length}개 공급사 최적 매칭</div></div>
            <div style={{fontSize:22,fontWeight:800,color:S.gn}}>▼{FC(aiResult.saving)} 절감</div>
          </div>
          <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:10,background:"#fff",borderRadius:8}}>
            <thead><tr style={{background:"#f5f5f4"}}>{["품목","수량","최적 공급사","단가","소계","절감","배송"].map(h=><th key={h} style={{padding:"7px 8px",textAlign:"left",fontSize:9,color:S.sub}}>{h}</th>)}</tr></thead>
            <tbody>{aiResult.items.map((r,i)=><tr key={i} style={{borderTop:`1px solid ${S.bd}`}}>
              <td style={{padding:"6px 8px",fontWeight:600}}>{r.name}</td>
              <td style={{padding:"6px 8px"}}>{r.qty} {r.unit}</td>
              <td style={{padding:"6px 8px",color:S.gn,fontWeight:600}}>⭐{r.supplier}</td>
              <td style={{padding:"6px 8px"}}>{FC(r.price)}</td>
              <td style={{padding:"6px 8px",fontWeight:700}}>{FC(r.total)}</td>
              <td style={{padding:"6px 8px",color:S.gn,fontWeight:700}}>{r.saving>0?"▼"+FC(r.saving):"—"}</td>
              <td style={{padding:"6px 8px",fontSize:9}}>{r.delivery}{r.cold?" ❄️":""}</td>
            </tr>)}</tbody>
          </table></div>
          <div style={{display:"flex",justifyContent:"flex-end",alignItems:"center",gap:10,marginTop:10}}>
            <span style={{fontSize:14,fontWeight:700}}>총 {FC(aiResult.total)}</span>
            <button style={{padding:"7px 20px",borderRadius:7,border:"none",background:S.pri,color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer"}}>🚚 주문 확정</button>
          </div>
        </div>}
      </div>}

      {/* ═══ 시세 현황 ═══ */}
      {tab==="price"&&<div style={{animation:"fadeIn .3s"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div style={{fontSize:15,fontWeight:800}}>📈 시세 현황 — {prices.length.toLocaleString()}건</div>
          <input value={search} onChange={e=>{setSearch(e.target.value);setPage(0);}} placeholder="🔍 품목 검색..." style={{padding:"6px 10px",borderRadius:6,border:`1px solid ${S.bd}`,fontSize:10,width:200,outline:"none"}}/>
        </div>
        {(()=>{
          const filtered=prices.filter(p=>!search||p.item.includes(search));
          const paged=filtered.slice(page*100,(page+1)*100);
          const totalPages=Math.ceil(filtered.length/100);
          return(<>
            <div style={{fontSize:9,color:S.sub,marginBottom:6}}>{filtered.length.toLocaleString()}건 (페이지 {page+1}/{totalPages})</div>
            <div style={{background:"#fff",borderRadius:10,border:`1px solid ${S.bd}`,overflow:"hidden"}}>
              <div style={{overflowX:"auto"}}><table style={{width:"100%",minWidth:800,borderCollapse:"collapse",fontSize:10}}>
                <thead><tr style={{background:"#f5f5f4"}}>{["날짜","품목","카테고리","단위","최저가","평균가","최고가","등락","비교업체","최저가 업체"].map(h=><th key={h} style={{padding:"7px 8px",textAlign:"left",color:S.sub,fontWeight:600,fontSize:9}}>{h}</th>)}</tr></thead>
                <tbody>{paged.map((p,i)=>(
                  <tr key={i} style={{borderTop:`1px solid ${S.bd}`}}>
                    <td style={{padding:"5px 8px",color:S.sub}}>{p.date}</td>
                    <td style={{padding:"5px 8px",fontWeight:600}}>{p.item}</td>
                    <td style={{padding:"5px 8px",fontSize:9}}>{p.cat}</td>
                    <td style={{padding:"5px 8px",fontSize:9,color:S.sub}}>{p.unit}</td>
                    <td style={{padding:"5px 8px",fontWeight:700,color:S.gn}}>{FC(p.minPrice)}</td>
                    <td style={{padding:"5px 8px"}}>{FC(p.avgPrice)}</td>
                    <td style={{padding:"5px 8px",color:S.rd}}>{FC(p.maxPrice)}</td>
                    <td style={{padding:"5px 8px",fontWeight:700,color:p.change>=0?S.rd:S.gn}}>{p.change>=0?"+":""}{p.change}%</td>
                    <td style={{padding:"5px 8px"}}>{p.suppliers}곳</td>
                    <td style={{padding:"5px 8px",fontSize:9,color:S.gn}}>{p.bestSupplier}</td>
                  </tr>
                ))}</tbody>
              </table></div>
            </div>
            {totalPages>1&&<div style={{display:"flex",gap:4,justifyContent:"center",marginTop:8}}>
              <button disabled={page===0} onClick={()=>setPage(p=>p-1)} style={{padding:"4px 10px",borderRadius:4,border:`1px solid ${S.bd}`,background:"#fff",fontSize:10,cursor:"pointer"}}>◀</button>
              <span style={{padding:"4px 10px",fontSize:10,color:S.sub}}>{page+1} / {totalPages}</span>
              <button disabled={page>=totalPages-1} onClick={()=>setPage(p=>p+1)} style={{padding:"4px 10px",borderRadius:4,border:`1px solid ${S.bd}`,background:"#fff",fontSize:10,cursor:"pointer"}}>▶</button>
            </div>}
          </>);
        })()}
      </div>}

      {/* ═══ 주문 이력 ═══ */}
      {tab==="history"&&<div style={{animation:"fadeIn .3s"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div style={{fontSize:15,fontWeight:800}}>📋 주문 이력 — {orders.length.toLocaleString()}건</div>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            <input value={search} onChange={e=>{setSearch(e.target.value);setPage(0);}} placeholder="🔍 검색 (사장님/품목)..." style={{padding:"6px 10px",borderRadius:6,border:`1px solid ${S.bd}`,fontSize:10,width:200,outline:"none"}}/>
            <span style={{fontSize:11,color:S.gn,fontWeight:700}}>총 절감: {FC(totalSaving)}</span>
          </div>
        </div>
        {(()=>{
          const filtered=orders.filter(o=>!search||o.customer.includes(search)||o.items.some(it=>it.includes(search)));
          const paged=filtered.slice(page*100,(page+1)*100);
          const totalPages=Math.ceil(filtered.length/100);
          return(<>
            <div style={{fontSize:9,color:S.sub,marginBottom:6}}>{filtered.length.toLocaleString()}건 (페이지 {page+1}/{totalPages})</div>
            <div style={{background:"#fff",borderRadius:10,border:`1px solid ${S.bd}`,overflow:"hidden"}}>
              <div style={{overflowX:"auto"}}><table style={{width:"100%",minWidth:1000,borderCollapse:"collapse",fontSize:10}}>
                <thead><tr style={{background:"#f5f5f4"}}>{["주문번호","날짜","시간","사장님","지역","채널","품목","결제금액","AI절감","배송","상태"].map(h=><th key={h} style={{padding:"7px 8px",textAlign:"left",color:S.sub,fontWeight:600,fontSize:9}}>{h}</th>)}</tr></thead>
                <tbody>{paged.map(o=>(
                  <tr key={o.id} onClick={()=>setDetailOrder(o)} style={{borderTop:`1px solid ${S.bd}`,cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.background="#fef7f0"} onMouseLeave={e=>e.currentTarget.style.background=""}>
                    <td style={{padding:"5px 8px",fontFamily:"monospace",color:S.sub,fontSize:9}}>{o.id}</td>
                    <td style={{padding:"5px 8px"}}>{o.date}</td>
                    <td style={{padding:"5px 8px",color:S.sub}}>{o.time}</td>
                    <td style={{padding:"5px 8px",fontWeight:600}}>{o.customer}</td>
                    <td style={{padding:"5px 8px",fontSize:9,color:S.sub}}>{o.region}</td>
                    <td style={{padding:"5px 8px"}}><span style={{padding:"1px 5px",borderRadius:3,fontSize:8,fontWeight:600,background:o.channel==="전화"?S.rdL:o.channel==="카톡"?S.ylL:S.blL,color:o.channel==="전화"?S.rd:o.channel==="카톡"?S.yl:S.bl}}>{o.channel}</span></td>
                    <td style={{padding:"5px 8px",fontSize:9,maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{o.items.join(", ")}</td>
                    <td style={{padding:"5px 8px",fontWeight:700}}>{FC(o.total)}</td>
                    <td style={{padding:"5px 8px",fontWeight:700,color:o.saving>0?S.gn:S.sub}}>{o.saving>0?"▼"+FC(o.saving):"—"}</td>
                    <td style={{padding:"5px 8px",fontSize:9}}>{o.delivery}</td>
                    <td style={{padding:"5px 8px"}}><span style={{padding:"1px 5px",borderRadius:3,fontSize:8,fontWeight:600,background:o.status==="배송완료"?S.gnL:o.status==="배송중"?S.blL:o.status==="준비중"?S.ylL:S.rdL,color:o.status==="배송완료"?S.gn:o.status==="배송중"?S.bl:o.status==="준비중"?S.yl:S.rd}}>{o.status}</span></td>
                  </tr>
                ))}</tbody>
              </table></div>
            </div>
            {totalPages>1&&<div style={{display:"flex",gap:4,justifyContent:"center",marginTop:8}}>
              <button disabled={page===0} onClick={()=>setPage(p=>p-1)} style={{padding:"4px 10px",borderRadius:4,border:`1px solid ${S.bd}`,background:"#fff",fontSize:10,cursor:"pointer"}}>◀</button>
              <span style={{padding:"4px 10px",fontSize:10,color:S.sub}}>{page+1} / {totalPages}</span>
              <button disabled={page>=totalPages-1} onClick={()=>setPage(p=>p+1)} style={{padding:"4px 10px",borderRadius:4,border:`1px solid ${S.bd}`,background:"#fff",fontSize:10,cursor:"pointer"}}>▶</button>
            </div>}
          </>);
        })()}
      </div>}

      </div>
      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
      `}</style>
    </div>
  );
}
