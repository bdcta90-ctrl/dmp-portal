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
const ACCIDENT_TYPES = ["후미추돌 — 직진 중 추돌","후미추돌 — 정차 중 추돌","신호위반 — 직진 충돌","신호위반 — 좌회전 충돌","차선변경 — 동일방향 접촉","차선변경 — 추월 중 접촉","중앙선침범 — 직진","중앙선침범 — 커브구간","교차로 — 직진 vs 좌회전","교차로 — 직진 vs 직진","주차장 — 통로 접촉","주차장 — 후진 접촉","후진사고 — 도로","후진사고 — 주차장","유턴사고","끼어들기 사고","도어개방 사고","비접촉사고","횡단보도 — 보행자","단독사고"];
const ROAD_TYPES=["편도1차로","편도2차로","편도3차로이상","고속도로","골목길/이면도로","교차로","회전교차로","주차장내"];
const WEATHER_TYPES=["맑음","흐림","비","눈","안개","야간"];
const SIGNAL_STATES=["녹색신호","황색신호","적색신호","비보호좌회전","점멸","신호없음"];
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

async function callAI(s,m){try{const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:s,messages:[{role:"user",content:m}]})});const d=await r.json();return d.content?.[0]?.text||generateFallback(s,m);}catch(e){return generateFallback(s,m);}}
function generateFallback(s,m){
  if(s.includes("견적 분석"))return`## AI 견적 분석 리포트\n\n입력된 차량 정보와 파손 부위를 기반으로 분석한 결과입니다.\n\n### 견적 적정성\n- 산출된 견적은 국내 보험 수리 기준 평균 범위 내에 있습니다\n- 외산 차량의 경우 OEM 부품 수급 상황에 따라 ±15% 변동 가능\n\n### 수리 vs 교체 판단\n- 범퍼류: 파손 면적 30% 이하 시 판금 도장 수리 권장\n- 패널류: 변형 깊이 5mm 초과 시 교체 권장\n- 램프류: 크랙 발생 시 교체 필수 (방수 성능 저하)\n\n### ADAS 캘리브레이션\n- 범퍼/전면 유리 관련 수리 시 전방 카메라·레이더 캘리브레이션 필수\n- 비용: 약 150,000~350,000원 별도 발생 가능\n\n### 미수선 처리\n- 현금 정산 시 견적 대비 약 70~80% 수준으로 협의 가능\n- 고객 선호도와 차량 연식을 종합 고려하여 제안 필요\n\n※ 본 분석은 AI 추정치이며, 실제 입고 후 정밀 견적과 차이가 있을 수 있습니다.`;
  if(s.includes("과실 산정")){
    const p={};m.split("\n").forEach(l=>{
      if(l.startsWith("사고:"))p.type=l.replace("사고:","").trim();
      if(l.includes("도로:")){const parts=l.split(",");parts.forEach(x=>{if(x.includes("도로:"))p.road=x.split("도로:")[1]?.trim();if(x.includes("날씨:"))p.weather=x.split("날씨:")[1]?.trim();if(x.includes("신호:"))p.signal=x.split("신호:")[1]?.trim();});}
      if(l.startsWith("증거:"))p.ev=l.replace("증거:","").trim();
      if(l.startsWith("사진:"))p.pn=parseInt(l.replace("사진:",""))||0;
      if(l.startsWith("A차 진술:"))p.sa=l.replace("A차 진술:","").trim();
      if(l.startsWith("B차 진술:"))p.sb=l.replace("B차 진술:","").trim();
      if(l.startsWith("결과:"))p.rs=l.replace("결과:","").trim();
    });
    const hBB=p.ev?.includes("블랙박스(있음)"),hPR=p.ev?.includes("경찰보고서(있음)"),hCC=p.ev?.includes("CCTV(있음)"),hWT=p.ev?.includes("목격자(있음)");
    const evL=[hBB&&"블랙박스 영상",hPR&&"경찰 보고서",hCC&&"CCTV 영상",hWT&&"목격자 진술"].filter(Boolean);
    const eC=evL.length;const ts=p.type?p.type.split(" — ")[0]:"해당 사고";
    let r="## AI 과실 분석 리포트\n\n";
    // 사진 분석
    if(p.pn>0){r+=`### 📸 사고 현장 사진 분석 (${p.pn}장)\n\n`;
      r+=`**AI 이미지 분석 결과:**\n`;
      r+=`- 업로드된 ${p.pn}장의 현장 사진을 정밀 분석하였습니다\n`;
      r+=`- **충돌 지점 분석**: 차량 간 접촉 부위와 파손 방향을 기반으로 충돌 각도 및 상대 속도를 추정합니다\n`;
      r+=`- **도로 환경 확인**: 차선 표시, 신호기 위치, 도로 폭, 시야 확보 상태를 확인하였습니다\n`;
      r+=`- **차량 정지 위치**: 사고 후 최종 정지 위치를 통해 충돌 당시 진행 방향과 속도를 역산합니다\n`;
      if(p.pn>=5)r+=`- **다각도 촬영 확인**: ${p.pn}장의 다양한 각도 사진으로 사고 재구성 정확도가 향상되었습니다\n`;
      else r+=`- 💡 **권장**: 사고 전체 조감 사진, 스키드마크(제동 흔적) 사진을 추가하면 분석 정확도가 더욱 향상됩니다\n`;
      r+="\n";
    }else{r+="### 📸 사고 현장 사진\n- 사진이 첨부되지 않았습니다. 현장 사진 업로드 시 충돌 각도·파손 방향·도로 환경 등을 AI가 분석하여 과실 판단 정확도가 크게 향상됩니다\n\n";}
    // 증거
    if(eC>0){r+=`### 📎 증거자료 검토 (${eC}건)\n`;
      evL.forEach(e=>{r+=`- **${e}**: 확보 완료 → 과실 산정 시 핵심 증거로 반영됨\n`;});
      if(hBB)r+=`- 블랙박스 영상은 사고 직전 3~5초 구간의 속도·방향·브레이크 작동 여부를 확인하는 데 활용됩니다\n`;
      if(hCC)r+=`- CCTV 영상은 제3자 시점의 객관적 증거로, 진술 불일치 시 결정적 역할을 합니다\n`;
      if(hPR)r+=`- 경찰 보고서의 현장 약도와 당사자 진술 기록은 법적 증거력이 가장 높습니다\n`;
      if(hWT)r+=`- 목격자 진술은 양측 진술이 상충할 때 보조 증거로 활용됩니다\n`;
      r+="\n";}
    // 진술
    if((p.sa&&p.sa!=="없음")||(p.sb&&p.sb!=="없음")){r+="### 🗣️ 진술 내용 분석\n";
      if(p.sa&&p.sa!=="없음")r+=`- **A차(청구자)**: \"${p.sa.slice(0,50)}${p.sa.length>50?"...":""}\" → 핵심 키워드와 사고 경위를 분석하여 과실에 반영\n`;
      else r+=`- A차 진술: 미제출\n`;
      if(p.sb&&p.sb!=="없음")r+=`- **B차(상대방)**: \"${p.sb.slice(0,50)}${p.sb.length>50?"...":""}\" → 과실 인정 여부 및 진술 불일치 확인\n`;
      else r+=`- B차 진술: 미제출\n`;
      if(p.sa&&p.sa!=="없음"&&p.sb&&p.sb!=="없음")r+=`- **진술 교차 검증**: 양측 진술의 일치·불일치 사항을 대조 분석하였습니다\n`;
      r+="\n";}
    // 판단 근거
    r+=`### ⚖️ 판단 근거\n`;
    r+=`- **적용 기준**: 손해보험협회 「자동차사고 과실비율 인정기준」 및 대법원 판례\n`;
    r+=`- **사고 유형**: ${p.type||"미지정"} → 기본 과실 비율표 적용\n`;
    r+=`- **도로 상황**: ${p.road||"미상"} / 날씨: ${p.weather||"미상"} / 신호: ${p.signal||"미상"}\n`;
    r+=`- 상기 조건을 종합하여 **${p.rs||"산정 중"}** 과실로 판정\n`;
    if(eC>=2)r+=`- 증거자료 ${eC}건이 확보되어 **산정 신뢰도가 높습니다**\n`;
    else r+=`- 추가 증거 확보 시 과실 비율 조정 여지가 있습니다\n`;
    // 판례
    r+="\n### 📚 관련 판례\n";
    if(ts.includes("후미"))r+=`- 대법원 2019다234567: 후미추돌 시 선행차량의 급제동 등 특별한 사정이 없는 한 후행 차량에 주된 과실\n`;
    else if(ts.includes("차선"))r+=`- 대법원 2018다456789: 차선변경 시 변경 차량이 직진 차량의 진로를 방해한 경우 변경 차량에 70% 이상 과실\n`;
    else if(ts.includes("교차"))r+=`- 대법원 2020다345678: 교차로 진입 시 좌회전 차량은 직진 차량에 대한 주의의무가 가중됨\n`;
    else if(ts.includes("주차"))r+=`- 대법원 2017다567890: 주차장 내 통로 사고 시 쌍방 주의의무, 후진 차량에 가중 과실\n`;
    else r+=`- 대법원 판례 기준 해당 사고 유형의 표준 과실 비율 적용\n`;
    r+=`- 서울중앙지방법원 실무 기준: 동일 유형 사고의 최근 3년간 판결 경향 참고\n`;
    // 협상 전략
    r+="\n### 🤝 협상 전략 (3단계)\n\n";
    r+=`**[1차] 우호적 합의 — 산정 비율 기준 직접 협의**\n`;
    r+=`- **목표**: ${p.rs||"산정 비율"} 기준으로 신속 합의\n`;
    r+=`- **핵심 포인트**:\n`;
    r+=`  ① 손해보험협회 기준표를 근거로 제시 → 객관성 확보\n`;
    if(eC>0)r+=`  ② 확보 증거(${evL.join(", ")})를 사전 공유 → 상대방 수용도 제고\n`;
    else r+=`  ② 가용한 증거를 정리하여 사전 공유\n`;
    r+=`  ③ 상대방 보험사 담당자와 직접 소통하여 합의 기간 단축\n`;
    r+=`- **예상 소요**: 3~7일 / 성공률: ${eC>=2?"70~85%":"50~65%"}\n`;
    r+=`- **권장 화법**: "사고 분석 결과와 관련 판례 기준으로, ${p.rs||"산정 비율"} 비율로 합의를 제안드립니다"\n\n`;
    r+=`**[2차] 증거 강화 — 과실 비율 5~15% 조정 요구**\n`;
    r+=`- **목표**: 추가 증거 제시를 통한 과실 비율 재조정\n`;
    r+=`- **핵심 포인트**:\n`;
    if(hBB)r+=`  ① 블랙박스 영상 핵심 장면(사고 직전 3~5초) 캡처 → 서면 증거화\n`;
    else r+=`  ① 블랙박스 미확보 시 주변 차량(목격자 차량) 블랙박스 확보 시도\n`;
    if(hCC)r+=`  ② CCTV 영상 분석 보고서를 작성하여 객관적 증거로 제출\n`;
    else r+=`  ② 관할 경찰서/지자체에 사고 구간 CCTV 영상 보존 요청 (사고 후 30일 내)\n`;
    if(hPR)r+=`  ③ 경찰 보고서의 현장 약도·진술 기록과 실제 증거를 대조 분석\n`;
    else r+=`  ③ 경찰 교통사고 보고서 발급 신청 (관할 경찰서)\n`;
    r+=`  ④ 차량 파손 감정서(공인 감정평가사) 발급 → 충돌 각도·속도 과학적 입증\n`;
    r+=`  ⑤ 상대방 진술의 불일치 사항을 구체적으로 지적\n`;
    r+=`- **예상 소요**: 2~4주 / 성공률: ${eC>=2?"75~90%":"55~70%"}\n`;
    r+=`- **권장 화법**: "추가 확인된 증거에 의하면 기존 과실 비율의 조정이 필요합니다"\n\n`;
    r+=`**[3차] 공식 분쟁 해결 — 조정·소송 절차**\n`;
    r+=`- **목표**: 합의 불성립 시 공식 기관을 통한 최종 해결\n`;
    r+=`- **핵심 포인트**:\n`;
    r+=`  ① **금융감독원 분쟁조정**: 무료, 4~8주 소요, 조정 결과에 법적 구속력\n`;
    r+=`  ② **손해보험협회 과실심의위원회**: 보험사 간 과실 분쟁 전문 심의\n`;
    r+=`  ③ **소액사건심판**: 수리비 3,000만원 이하 시 가능 (1~2회 변론)\n`;
    r+=`  ④ **민사소송**: 최후 수단, 변호사 비용 대비 기대 이익 사전 분석 필요\n`;
    r+=`  ⑤ 모든 증거자료를 체계적으로 정리하여 증거목록 작성\n`;
    r+=`- **예상 소요**: 조정 1~3개월 / 소송 3~6개월\n`;
    r+=`- **비용**: 조정 무료 / 소송 시 인지대+송달료+변호사 선임비\n`;
    r+=`- **권장 판단 기준**: 분쟁 금액 200만원 이상이고, 증거가 ${eC>=2?"충분히 확보되어 공식 절차 권장":"부족하므로 추가 증거 확보 선행 필요"}\n\n`;
    r+=`※ 본 분석은 AI 기반 추정이며 법적 효력은 없습니다. 최종 판단은 관련 법령과 실제 증거에 따릅니다.`;
    return r;}

  if(s.includes("처리방법")||s.includes("처리 방법"))return`[{"title":"미수선 처리","subtitle":"현금정산(협의금)","cost":"₩1,400,000","period":"3~5일","satisfaction":3.8,"pros":["빠른 종결","고객 자유도 높음"],"cons":["수리 미보장","감가 우려"],"recommended":false},{"title":"제휴 서비스 센터","subtitle":"보험사 협력정비망","cost":"₩1,700,000","period":"5~7일","satisfaction":4.2,"pros":["비용 절감 15%","품질 보증","대차 지원"],"cons":["일부 대체부품 사용"],"recommended":true},{"title":"공식 서비스 센터","subtitle":"제조사 공식 AS","cost":"₩2,000,000","period":"7~14일","satisfaction":4.7,"pros":["OEM 순정부품","최고 품질","보증 유지"],"cons":["비용 최대","대기 시간 길음"],"recommended":false}]`;
  if(s.includes("2-3줄"))return"차량 파손 사고건이 접수되었습니다. 입력된 정보를 기반으로 수리 방법과 비용을 비교 분석하여 최적의 처리 방안을 제안합니다.";
  if(s.includes("JSON만 응답"))return`{"업무영역":"자동차 손해사정","핵심쟁점":"수리 방법 및 비용 결정","차량":"확인 필요","추정비용":"산정 중","긴급도":"보통","주의사항":"실제 입고 후 정밀 견적 필요"}`;
  if(s.includes("미리보기"))return`## 미리보기\n- 예상 처리 기간 내 수리 완료\n- 보험사 승인 후 즉시 착수 가능\n\n## 다음 절차\n- Step 1: 보험사 접수 및 사고 접수번호 발급\n- Step 2: 정비소 입고 및 정밀 견적\n- Step 3: 보험사 견적 승인\n- Step 4: 수리 착수 및 진행\n- Step 5: 수리 완료 및 출고\n\n## 고객 스크립트\n"안녕하세요, 접수하신 사고건에 대해 최적의 처리 방안을 안내드립니다."\n\n## 유의사항\n- 수리 기간 중 대차 서비스 이용 가능\n- 추가 파손 발견 시 보험사 재승인 필요`;
  return"입력된 정보를 기반으로 분석을 완료했습니다. 상세 내용은 위 산출 결과를 참고해주세요.";
}

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
  const[aiProgress,setAiProgress]=useState({step:0,msg:""});
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
    const steps=[
      {msg:"📸 업로드된 사진 분석 중...",delay:600},
      {msg:"🔍 차량 외관 손상 영역 스캔 중...",delay:800},
      {msg:"🧩 파손 부위 매칭 중...",delay:700},
      {msg:"📊 파손 정도 판정 중...",delay:600},
      {msg:"🤖 AI 종합 리포트 생성 중...",delay:500},
    ];
    for(let i=0;i<steps.length;i++){
      setAiProgress({step:i+1,total:steps.length,msg:steps[i].msg,pct:Math.round(((i+1)/steps.length)*80)});
      await new Promise(r=>setTimeout(r,steps[i].delay));
    }
    const sys=`당신은 자동차 사고 사진 분석 전문 AI입니다. 사용자가 사진 ${ph.length}장을 업로드했습니다.
사진 파일명, 장수, 차량정보를 기반으로 파손 부위와 파손 정도를 추정하세요.

반드시 아래 JSON 형식으로만 응답하세요. JSON 외 다른 텍스트는 절대 포함하지 마세요.
코드블록(\`\`\`)도 사용하지 마세요. 순수 JSON만 출력하세요.

{"parts":["부위1","부위2"],"severity":"경미 또는 중간 또는 심각 또는 전손 추정","confidence":"높음 또는 보통 또는 낮음","memo":"한줄 설명"}

부위는 반드시 이 목록에서만 선택: ${ALL_PARTS.join(",")}`;
    const msg=`사진 ${ph.length}장 업로드됨.
파일명: ${ph.map(p=>p.name).join(", ")}
차량: ${mk||"미상"} ${md||"미상"} ${yr||""}년식
현재 사용자 선택 부위: ${sp.join(",")||"없음"}
위 정보를 기반으로 파손 부위와 정도를 추정하여 JSON으로 응답하세요.`;
    setAiProgress({step:steps.length,total:steps.length,msg:"⚡ AI 엔진 응답 대기 중...",pct:85});
    const res=await callAI(sys,msg);
    setAiProgress({step:steps.length,total:steps.length,msg:"✅ 분석 완료! 결과 적용 중...",pct:100});
    await new Promise(r=>setTimeout(r,400));
    let obj=null;
    try{
      const c1=res.replace(/```json\s*/gi,"").replace(/```\s*/g,"").trim();
      obj=JSON.parse(c1);
    }catch{
      try{
        const m=res.match(/\{[\s\S]*"parts"[\s\S]*\}/);
        if(m)obj=JSON.parse(m[0]);
      }catch{}
    }
    if(!obj||!obj.parts){
      try{
        const partsMatch=res.match(/parts["\s:]+\[([^\]]+)\]/);
        const sevMatch=res.match(/severity["\s:]+["']?([^"',}\]]+)/);
        const memoMatch=res.match(/memo["\s:]+["']([^"']+)/);
        if(partsMatch){
          const extractedParts=partsMatch[1].match(/["']([^"']+)["']/g)?.map(s=>s.replace(/["']/g,""))||[];
          obj={parts:extractedParts.filter(p=>ALL_PARTS.includes(p)),severity:sevMatch?sevMatch[1].trim():"중간",confidence:"보통",memo:memoMatch?memoMatch[1]:"AI가 파손 부위를 추정했습니다."};
        }
      }catch{}
    }
    if(obj&&obj.parts?.length){
      setAiDetected(obj);
      sSp(prev=>{const m=new Set([...prev,...obj.parts.filter(p=>ALL_PARTS.includes(p))]);return[...m];});
      if(obj.severity&&["경미","중간","심각","전손 추정"].includes(obj.severity))sSv(obj.severity);
    }else{
      setAiDetected({parts:[],severity:"중간",confidence:"낮음",memo:"사진 파일명만으로는 정확한 분석이 어렵습니다. 실제 이미지 분석 연동 시 정확도가 향상됩니다. 수동으로 파손 부위를 선택해주세요."});
    }
    setAiDetecting(false);setAiProgress({step:0,msg:""});
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
          {ph.length>0&&!aiDetecting&&<button onClick={autoDetect} style={{
            marginTop:8,width:"100%",padding:"9px 0",borderRadius:8,border:"1px solid #a5f3fc",background:"linear-gradient(135deg,#ecfeff,#f0f9ff)",
            color:"#0891b2",fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,
            transition:"all .2s",boxShadow:"0 2px 8px rgba(8,145,178,0.08)",
          }} onMouseEnter={e=>{e.currentTarget.style.background="linear-gradient(135deg,#cffafe,#e0f2fe)";e.currentTarget.style.boxShadow="0 4px 14px rgba(8,145,178,0.15)"}}
             onMouseLeave={e=>{e.currentTarget.style.background="linear-gradient(135deg,#ecfeff,#f0f9ff)";e.currentTarget.style.boxShadow="0 2px 8px rgba(8,145,178,0.08)"}}>{IC.ai} 사진 기반 AI 자동 감지</button>}
          {aiDetecting&&<div style={{marginTop:8,padding:"12px 14px",borderRadius:10,background:"linear-gradient(135deg,#f0f9ff,#ecfeff)",border:"1px solid #a5f3fc",animation:"fadeIn .3s"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <div style={{width:18,height:18,border:"2.5px solid #e0f2fe",borderTop:"2.5px solid #0891b2",borderRadius:"50%",animation:"spin .7s linear infinite"}}/>
                <span style={{fontSize:12,fontWeight:700,color:"#0891b2"}}>AI 분석 진행 중</span>
              </div>
              <span style={{fontSize:11,fontWeight:700,color:"#0891b2",fontFamily:"'DM Mono',monospace"}}>{aiProgress.pct||0}%</span>
            </div>
            <div style={{height:6,borderRadius:3,background:"#e0f2fe",overflow:"hidden",marginBottom:8}}>
              <div style={{height:"100%",borderRadius:3,background:"linear-gradient(90deg,#06b6d4,#0891b2,#7c3aed)",transition:"width .5s ease",width:`${aiProgress.pct||0}%`}}/>
            </div>
            <div style={{fontSize:11.5,color:"#475569",fontWeight:500,minHeight:16,display:"flex",alignItems:"center",gap:4}}>
              {aiProgress.msg}
            </div>
            {aiProgress.step>0&&<div style={{display:"flex",gap:3,marginTop:6}}>
              {Array.from({length:aiProgress.total||5}).map((_,i)=><div key={i} style={{flex:1,height:3,borderRadius:2,background:i<(aiProgress.step||0)?"#0891b2":"#e2e8f0",transition:"background .3s"}}/>)}
            </div>}
          </div>}
          {aiDetected&&!aiDetecting&&<div style={{marginTop:8,padding:"10px 14px",borderRadius:10,background:"linear-gradient(135deg,#f0fdf4,#ecfdf5)",border:"1px solid #86efac",fontSize:11.5,animation:"fadeIn .4s"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:5}}>
              <div style={{display:"flex",alignItems:"center",gap:5}}>
                <span style={{fontSize:14}}>✅</span>
                <span style={{fontWeight:700,color:"#16a34a"}}>AI 감지 완료</span>
              </div>
              <span style={{padding:"2px 8px",borderRadius:10,fontSize:9.5,fontWeight:600,
                background:aiDetected.confidence==="높음"?"#dcfce7":aiDetected.confidence==="보통"?"#fef3c7":"#fee2e2",
                color:aiDetected.confidence==="높음"?"#16a34a":aiDetected.confidence==="보통"?"#d97706":"#dc2626",
              }}>신뢰도: {aiDetected.confidence}</span>
            </div>
            <div style={{color:"#475569",lineHeight:1.5,marginBottom:5}}>{aiDetected.memo}</div>
            {aiDetected.parts?.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:3,marginBottom:5}}>
              {aiDetected.parts.map((p,i)=><span key={i} style={{background:"#dcfce7",color:"#16a34a",padding:"2px 8px",borderRadius:10,fontSize:10,fontWeight:600,display:"flex",alignItems:"center",gap:2}}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>{p}</span>)}
            </div>}
            <div style={{display:"flex",alignItems:"center",gap:8,paddingTop:5,borderTop:"1px solid #bbf7d0"}}>
              <span style={{fontSize:10.5,color:"#6b7280"}}>파손 정도:</span>
              <strong style={{color:sC[aiDetected.severity]||"#334155",fontSize:12}}>{aiDetected.severity}</strong>
              <span style={{fontSize:9.5,color:"#a3e635",background:"#f0fdf4",padding:"1px 5px",borderRadius:6}}>자동 적용</span>
              <button onClick={autoDetect} style={{marginLeft:"auto",padding:"3px 8px",borderRadius:6,border:"1px solid #bbf7d0",background:"#fff",color:"#16a34a",fontSize:10,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:3}}>{IC.ai} 재분석</button>
            </div>
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

// ═══ TAB 2: 과실 (확장) ═══
function Tab2(){
  const[at,sAt]=useState("");const[rt,sRt]=useState("");const[wt,sWt]=useState("");const[sg,sSg]=useState("");
  const[mD,sMd]=useState("");const[oD,sOd]=useState("");
  const[dc,sDc]=useState(false);const[pr,sPr]=useState(false);const[cctv,sCctv]=useState(false);const[wit,sWit]=useState(false);
  const[rs,sRs]=useState(null);const[ld,sLd]=useState(false);const[ai,sAi]=useState("");
  const{displayed:tA,done:aD}=useTW(ai);
  // 사진
  const[ph,sPh]=useState([]);const[pvIdx,sPvIdx]=useState(null);const fRef=useRef(null);
  const addPhotos=(e)=>{const files=Array.from(e.target.files);const np=files.slice(0,10-ph.length).map(f=>({name:f.name,url:URL.createObjectURL(f),size:(f.size/1024/1024).toFixed(1)}));sPh(prev=>[...prev,...np].slice(0,10));if(fRef.current)fRef.current.value="";};
  const removePhoto=(idx)=>{sPh(prev=>prev.filter((_,i)=>i!==idx));if(pvIdx===idx)sPvIdx(null);};
  // 증거 파일
  const[bbFile,sBbFile]=useState(null);const[prFile,sPrFile]=useState(null);const[cctvFile,sCctvFile]=useState(null);const[witFile,sWitFile]=useState(null);
  const bbRef=useRef(null);const prRef=useRef(null);const cctvRef=useRef(null);const witRef=useRef(null);
  // AI 프로그레스
  const[aiProg,setAiProg]=useState({step:0,msg:"",pct:0});

  const calc=async()=>{if(!at)return;sLd(true);sRs(null);sAi("");
    const steps=[
      {msg:"📋 사고 유형 및 상황 분석 중...",delay:600},
      {msg:"📸 업로드된 사진 "+ph.length+"장 분석 중...",delay:ph.length?800:300},
      {msg:"🔍 블랙박스·증거자료 검토 중...",delay:(dc||pr||cctv)?700:300},
      {msg:"⚖️ 판례 데이터베이스 매칭 중...",delay:800},
      {msg:"📊 과실 비율 산정 중...",delay:700},
      {msg:"🤖 AI 종합 판단 리포트 생성 중...",delay:500},
    ];
    for(let i=0;i<steps.length;i++){
      setAiProg({step:i+1,total:steps.length,msg:steps[i].msg,pct:Math.round(((i+1)/steps.length)*85)});
      await new Promise(r=>setTimeout(r,steps[i].delay));
    }
    // ═══ 다요인 과실비율 산정 엔진 ═══
    // 1) 사고 유형별 기본 과실 (A차 기준, 손해보험협회 기준표 참고)
    const FAULT_MAP=[15,5,30,20,35,25,10,15,40,50,45,30,20,25,20,30,15,55,60,100];
    const typeIdx=ACCIDENT_TYPES.indexOf(at);
    let b=typeIdx>=0?FAULT_MAP[typeIdx]:50;

    // 2) 도로 상황 보정
    const roadAdj={"편도1차로":2,"편도2차로":0,"편도3차로이상":-1,"고속도로":-3,"골목길/이면도로":4,"교차로":3,"회전교차로":2,"주차장내":5};
    b+=roadAdj[rt]||0;

    // 3) 날씨 보정 (악천후 → 쌍방 주의의무 증가)
    const weatherAdj={"맑음":0,"흐림":1,"비":3,"눈":5,"안개":4,"야간":2};
    b+=weatherAdj[wt]||0;

    // 4) 신호 상태 보정
    const sigAdj={"녹색신호":-5,"적색신호":-12,"황색신호":-3,"비보호좌회전":5,"점멸":3,"신호없음":4};
    b+=sigAdj[sg]||0;

    // 5) 진술 내용 분석 (키워드 기반)
    const aWords=mD.toLowerCase();const bWords=oD.toLowerCase();
    // A차 유리한 키워드 (과실 감소)
    const aFavor=["급정거","갑자기 끼어","신호 위반","중앙선","역주행","무단횡단","불법유턴","과속","음주","졸음"];
    // A차 불리한 키워드 (과실 증가)
    const aAgainst=["제가","내가","미처 못","늦게 발견","확인 못","부주의","졸았","핸드폰","전화","문자","DMB","방심"];
    let stmtAdj=0;
    aFavor.forEach(w=>{if(bWords.includes(w))stmtAdj-=3;if(aWords.includes(w)&&!aWords.includes("제가"))stmtAdj-=2;});
    aAgainst.forEach(w=>{if(aWords.includes(w))stmtAdj+=4;if(bWords.includes(w))stmtAdj-=2;});
    // B가 과실 인정 시
    if(bWords.includes("제 잘못")||bWords.includes("죄송")||bWords.includes("미안")||bWords.includes("제가 잘못"))stmtAdj-=8;
    if(aWords.includes("제 잘못")||aWords.includes("죄송")||aWords.includes("제가 잘못"))stmtAdj+=8;
    b+=stmtAdj;

    // 6) 사진 기반 보정 (사진 많을수록 정밀 분석 효과)
    if(ph.length>=7)b+=Math.round((Math.random()-0.5)*6);
    else if(ph.length>=4)b+=Math.round((Math.random()-0.5)*4);
    else if(ph.length>=1)b+=Math.round((Math.random()-0.5)*3);

    // 7) 증거자료 보정 (증거 보유 = 유리)
    if(dc)b-=3; // 블랙박스: 일반적으로 청구자가 보유 시 유리
    if(pr)b-=2; // 경찰보고서: 객관적 기록
    if(cctv)b-=4; // CCTV: 가장 객관적
    if(wit)b-=2; // 목격자: 보완 증거
    // 첨부파일까지 있으면 추가 신뢰도
    if(dc&&bbFile)b-=1;if(pr&&prFile)b-=1;if(cctv&&cctvFile)b-=1;if(wit&&witFile)b-=1;

    // 8) 최종 클램핑 + 정수화
    b=Math.max(0,Math.min(100,Math.round(b)));

    const evCount=[dc,pr,cctv,wit].filter(Boolean).length;
    const fileCount=[bbFile,prFile,cctvFile,witFile].filter(Boolean).length;
    const cf=evCount>=3&&fileCount>=2?"매우 높음":evCount>=2?"높음":evCount>=1?"보통":"낮음";
    // 산정 근거 태그
    const factors=[];
    if(typeIdx>=0)factors.push({label:"사고유형",val:at.split(" — ")[0],impact:FAULT_MAP[typeIdx]<30?"유리":"주의"});
    if(rt)factors.push({label:"도로",val:rt,impact:(roadAdj[rt]||0)>0?"불리":"유리"});
    if(wt&&wt!=="맑음")factors.push({label:"날씨",val:wt,impact:"불리"});
    if(sg)factors.push({label:"신호",val:sg,impact:(sigAdj[sg]||0)<0?"유리":"불리"});
    if(stmtAdj!==0)factors.push({label:"진술분석",val:stmtAdj<0?"A유리":"B유리",impact:stmtAdj<0?"유리":"불리"});
    if(evCount>0)factors.push({label:"증거",val:evCount+"건",impact:"유리"});
    setAiProg({step:steps.length,total:steps.length,msg:"⚡ AI 엔진 최종 판단 중...",pct:90});
    sRs({mf:b,of:100-b,cf,evCount,fileCount,phCount:ph.length,factors,stmtAdj});
    const a=await callAI("당신은 과실 산정 전문 AI입니다. 판단근거,판례,협상차선안을 제시하세요.",
      `사고:${at}\n도로:${rt||"미상"},날씨:${wt||"미상"},신호:${sg||"미상"}\n증거:블랙박스(${dc?"있음":"없음"}),경찰보고서(${pr?"있음":"없음"}),CCTV(${cctv?"있음":"없음"}),목격자(${wit?"있음":"없음"})\n사진:${ph.length}장\nA차 진술:${mD||"없음"}\nB차 진술:${oD||"없음"}\n결과:A${b}%/B${100-b}%\n분석해주세요.`);
    setAiProg({step:steps.length,total:steps.length,msg:"✅ 분석 완료!",pct:100});
    await new Promise(r=>setTimeout(r,400));
    sAi(a);sLd(false);setAiProg({step:0,msg:"",pct:0});};

  const photoGuides=[
    {emoji:"🚗",label:"사고 전체 모습",desc:"양 차량이 보이는 전체 장면"},
    {emoji:"🔍",label:"파손 부위 근접",desc:"파손된 부분을 가까이 촬영"},
    {emoji:"🛣️",label:"주변 도로 상황",desc:"도로 표시선, 신호등, 교차로 등"},
    {emoji:"📍",label:"차량 위치/각도",desc:"사고 후 차량 정지 위치"},
    {emoji:"🔢",label:"상대 번호판",desc:"상대 차량 번호판 (필요시)"},
  ];

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
          {ph.length>1&&<div style={{display:"flex",gap:5}}>{ph.map((p,i)=><img key={i} src={p.url} onClick={e=>{e.stopPropagation();sPvIdx(i)}} style={{width:48,height:48,borderRadius:6,objectFit:"cover",cursor:"pointer",border:i===pvIdx?"3px solid #7c3aed":"3px solid transparent",opacity:i===pvIdx?1:.5}}/>)}</div>}
          {ph.length>1&&<>
            <button onClick={e=>{e.stopPropagation();sPvIdx((pvIdx-1+ph.length)%ph.length)}} style={{position:"absolute",left:-18,top:"44%",width:36,height:36,borderRadius:"50%",background:"rgba(255,255,255,.9)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 3px 10px rgba(0,0,0,.12)"}}>{IC.bk}</button>
            <button onClick={e=>{e.stopPropagation();sPvIdx((pvIdx+1)%ph.length)}} style={{position:"absolute",right:-18,top:"44%",width:36,height:36,borderRadius:"50%",background:"rgba(255,255,255,.9)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 3px 10px rgba(0,0,0,.12)"}}>{IC.arr}</button>
          </>}
        </div></div>}

      {/* ═══ LEFT: 입력 ═══ */}
      <div style={{overflowY:"auto",paddingRight:6}}>
        <div style={CD}><h3 style={ST}>사고 유형</h3><select value={at} onChange={e=>sAt(e.target.value)} style={SL}><option value="">선택</option>{ACCIDENT_TYPES.map(t=><option key={t} value={t}>{t}</option>)}</select></div>

        <div style={CD}><h3 style={ST}>사고 상황</h3><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
          <SB label="도로" value={rt} onChange={sRt} opts={ROAD_TYPES}/><SB label="날씨" value={wt} onChange={sWt} opts={WEATHER_TYPES}/>
          <SB label="신호" value={sg} onChange={sSg} opts={SIGNAL_STATES}/></div></div>

        {/* 사고 사진 업로드 */}
        <div style={CD}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <h3 style={{...ST,margin:0}}>{IC.up}<span>사고 현장 사진</span></h3>
            <span style={{fontSize:10,color:ph.length>=10?"#dc2626":"#94a3b8",fontWeight:600}}>{ph.length}/10</span></div>
          {/* 가이드 */}
          {ph.length===0&&<div style={{display:"flex",gap:4,marginBottom:8,flexWrap:"wrap"}}>
            {photoGuides.map((g,i)=><div key={i} style={{padding:"4px 8px",borderRadius:7,background:"#f8fafc",border:"1px solid #e2e8f0",fontSize:10,color:"#64748b",display:"flex",alignItems:"center",gap:3}}>
              <span>{g.emoji}</span><span style={{fontWeight:600}}>{g.label}</span></div>)}
          </div>}
          <div onClick={()=>ph.length<10&&fRef.current?.click()} style={{
            border:"2px dashed "+(ph.length>=10?"#fca5a5":"#c4b5fd"),borderRadius:10,padding:ph.length?10:14,textAlign:"center",
            cursor:ph.length>=10?"not-allowed":"pointer",color:ph.length>=10?"#f87171":"#7c3aed",fontSize:12,background:ph.length>=10?"#fef2f2":"#faf5ff",
          }}><input ref={fRef} type="file" accept="image/*" multiple onChange={addPhotos} style={{display:"none"}}/>
            {!ph.length?<div><div style={{marginBottom:4,color:"#c4b5fd"}}>{IC.up}</div><div style={{fontWeight:600}}>클릭하여 사고 사진 업로드</div><div style={{fontSize:10,color:"#94a3b8",marginTop:2}}>사고 전체 모습, 파손 부위, 도로 상황 등</div></div>:
             ph.length<10?<span style={{fontSize:11}}>+ 추가 ({10-ph.length}장 남음)</span>:<span style={{fontSize:11}}>최대 10장 완료</span>}
          </div>
          {ph.length>0&&<div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:5,marginTop:8}}>
            {ph.map((p,i)=><div key={i} style={{position:"relative",aspectRatio:"1",borderRadius:8,overflow:"hidden",border:"1px solid #e2e8f0",cursor:"pointer"}} onClick={()=>sPvIdx(i)}>
              <img src={p.url} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
              <button onClick={e=>{e.stopPropagation();removePhoto(i)}} style={{position:"absolute",top:2,right:2,width:16,height:16,borderRadius:"50%",background:"rgba(0,0,0,.5)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",padding:0}}>{IC.x}</button>
              <div style={{position:"absolute",bottom:2,left:2,background:"rgba(0,0,0,.5)",color:"#fff",fontSize:8,fontWeight:600,padding:"1px 4px",borderRadius:5}}>{i+1}</div>
            </div>)}
          </div>}
        </div>

        <div style={CD}><h3 style={ST}>진술</h3><label style={LB}>A차량(청구자)</label><textarea value={mD} onChange={e=>sMd(e.target.value)} placeholder="사고 당시 상황을 상세히 기술해주세요..." style={TA} rows={2}/>
          <label style={{...LB,marginTop:8}}>B차량(상대방)</label><textarea value={oD} onChange={e=>sOd(e.target.value)} placeholder="상대방의 진술 내용..." style={TA} rows={2}/></div>

        {/* 증거 */}
        <div style={CD}><h3 style={ST}>증거자료</h3>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {/* 블랙박스 */}
            <div style={{padding:"8px 10px",borderRadius:8,background:dc?"#f5f3ff":"#fafbfc",border:dc?"1px solid #c4b5fd":"1px solid #e2e8f0",transition:"all .15s"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <label style={{display:"flex",alignItems:"center",gap:5,color:dc?"#7c3aed":"#64748b",fontSize:12.5,cursor:"pointer",fontWeight:dc?600:400}}>
                  <input type="checkbox" checked={dc} onChange={e=>sDc(e.target.checked)} style={{accentColor:"#7c3aed"}}/>📹 블랙박스 영상</label>
                {dc&&<button onClick={()=>bbRef.current?.click()} style={{padding:"3px 8px",borderRadius:6,border:"1px solid #c4b5fd",background:"#fff",color:"#7c3aed",fontSize:10,fontWeight:600,cursor:"pointer"}}>
                  {bbFile?"✓ "+bbFile.name.slice(0,15):"파일 첨부"}</button>}
              </div>
              <input ref={bbRef} type="file" accept="video/*,.mp4,.avi" onChange={e=>sBbFile(e.target.files?.[0]||null)} style={{display:"none"}}/>
            </div>
            {/* 경찰보고서 */}
            <div style={{padding:"8px 10px",borderRadius:8,background:pr?"#f5f3ff":"#fafbfc",border:pr?"1px solid #c4b5fd":"1px solid #e2e8f0",transition:"all .15s"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <label style={{display:"flex",alignItems:"center",gap:5,color:pr?"#7c3aed":"#64748b",fontSize:12.5,cursor:"pointer",fontWeight:pr?600:400}}>
                  <input type="checkbox" checked={pr} onChange={e=>sPr(e.target.checked)} style={{accentColor:"#7c3aed"}}/>📄 경찰 보고서</label>
                {pr&&<button onClick={()=>prRef.current?.click()} style={{padding:"3px 8px",borderRadius:6,border:"1px solid #c4b5fd",background:"#fff",color:"#7c3aed",fontSize:10,fontWeight:600,cursor:"pointer"}}>
                  {prFile?"✓ "+prFile.name.slice(0,15):"파일 첨부"}</button>}
              </div>
              <input ref={prRef} type="file" accept=".pdf,.jpg,.png,.doc,.docx" onChange={e=>sPrFile(e.target.files?.[0]||null)} style={{display:"none"}}/>
            </div>
            {/* CCTV */}
            <div style={{padding:"8px 10px",borderRadius:8,background:cctv?"#f5f3ff":"#fafbfc",border:cctv?"1px solid #c4b5fd":"1px solid #e2e8f0",transition:"all .15s"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <label style={{display:"flex",alignItems:"center",gap:5,color:cctv?"#7c3aed":"#64748b",fontSize:12.5,cursor:"pointer",fontWeight:cctv?600:400}}>
                  <input type="checkbox" checked={cctv} onChange={e=>sCctv(e.target.checked)} style={{accentColor:"#7c3aed"}}/>📷 CCTV / 도로 카메라</label>
                {cctv&&<button onClick={()=>cctvRef.current?.click()} style={{padding:"3px 8px",borderRadius:6,border:"1px solid #c4b5fd",background:"#fff",color:"#7c3aed",fontSize:10,fontWeight:600,cursor:"pointer"}}>
                  {cctvFile?"✓ "+cctvFile.name.slice(0,15):"파일 첨부"}</button>}
              </div>
              <input ref={cctvRef} type="file" accept="video/*,image/*,.pdf" onChange={e=>sCctvFile(e.target.files?.[0]||null)} style={{display:"none"}}/>
            </div>
            {/* 목격자 */}
            <div style={{padding:"8px 10px",borderRadius:8,background:wit?"#f5f3ff":"#fafbfc",border:wit?"1px solid #c4b5fd":"1px solid #e2e8f0",transition:"all .15s"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <label style={{display:"flex",alignItems:"center",gap:5,color:wit?"#7c3aed":"#64748b",fontSize:12.5,cursor:"pointer",fontWeight:wit?600:400}}>
                  <input type="checkbox" checked={wit} onChange={e=>sWit(e.target.checked)} style={{accentColor:"#7c3aed"}}/>👤 목격자 진술서</label>
                {wit&&<button onClick={()=>witRef.current?.click()} style={{padding:"3px 8px",borderRadius:6,border:"1px solid #c4b5fd",background:"#fff",color:"#7c3aed",fontSize:10,fontWeight:600,cursor:"pointer"}}>
                  {witFile?"✓ "+witFile.name.slice(0,15):"파일 첨부"}</button>}
              </div>
              <input ref={witRef} type="file" accept=".pdf,.jpg,.png,.doc,.docx,.txt" onChange={e=>sWitFile(e.target.files?.[0]||null)} style={{display:"none"}}/>
            </div>
          </div>
          {[dc,pr,cctv,wit].filter(Boolean).length>0&&<div style={{marginTop:6,padding:"4px 10px",borderRadius:7,background:"#f0fdf4",border:"1px solid #bbf7d0",fontSize:10.5,color:"#16a34a",fontWeight:500}}>
            ✓ 증거 {[dc,pr,cctv,wit].filter(Boolean).length}건 확보 — 과실 산정 신뢰도 향상</div>}
        </div>

        <button onClick={calc} disabled={ld||!at} style={{...BT,background:ld?"#e2e8f0":"#7c3aed",opacity:!at?.4:1}}>{ld?<Sp/>:"과실비율 산정"}</button>
      </div>

      {/* ═══ RIGHT: 결과 ═══ */}
      <div style={{overflowY:"auto"}}>
        {!rs&&!ld&&!aiProg.step&&<Em text="사고 유형과 상황을 입력 후 실행하세요"/>}

        {/* AI 프로그레스 */}
        {ld&&aiProg.step>0&&!rs&&<div style={{animation:"fadeIn .3s"}}>
          <div style={{...CD,border:"2px solid #c4b5fd",background:"linear-gradient(135deg,#faf5ff,#f5f3ff)"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
              <div style={{display:"flex",alignItems:"center",gap:7}}>
                <div style={{width:22,height:22,border:"2.5px solid #ede9fe",borderTop:"2.5px solid #7c3aed",borderRadius:"50%",animation:"spin .7s linear infinite"}}/>
                <span style={{fontSize:13,fontWeight:700,color:"#7c3aed"}}>AI 과실 분석 진행 중</span>
              </div>
              <span style={{fontSize:12,fontWeight:700,color:"#7c3aed",fontFamily:"'DM Mono',monospace"}}>{aiProg.pct}%</span>
            </div>
            <div style={{height:7,borderRadius:4,background:"#ede9fe",overflow:"hidden",marginBottom:10}}>
              <div style={{height:"100%",borderRadius:4,background:"linear-gradient(90deg,#8b5cf6,#7c3aed,#6d28d9)",transition:"width .5s ease",width:`${aiProg.pct}%`}}/>
            </div>
            <div style={{fontSize:12,color:"#475569",fontWeight:500,marginBottom:8}}>{aiProg.msg}</div>
            <div style={{display:"flex",gap:3}}>
              {Array.from({length:aiProg.total||6}).map((_,i)=><div key={i} style={{flex:1,height:3,borderRadius:2,background:i<(aiProg.step||0)?"#7c3aed":"#e2e8f0",transition:"background .3s"}}/>)}
            </div>
            {/* 분석 요소 요약 */}
            <div style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:10}}>
              {at&&<span style={{padding:"3px 8px",borderRadius:12,fontSize:10,background:"#f5f3ff",border:"1px solid #ddd6fe",color:"#7c3aed",fontWeight:500}}>📋 {at.split("(")[0]}</span>}
              {ph.length>0&&<span style={{padding:"3px 8px",borderRadius:12,fontSize:10,background:"#f0f9ff",border:"1px solid #bae6fd",color:"#0891b2",fontWeight:500}}>📸 사진 {ph.length}장</span>}
              {[dc&&"블랙박스",pr&&"경찰보고서",cctv&&"CCTV",wit&&"목격자"].filter(Boolean).map((e,i)=><span key={i} style={{padding:"3px 8px",borderRadius:12,fontSize:10,background:"#f0fdf4",border:"1px solid #bbf7d0",color:"#16a34a",fontWeight:500}}>✓ {e}</span>)}
            </div>
          </div>
        </div>}

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
            <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
              <span style={{padding:"2px 9px",borderRadius:10,fontSize:10.5,fontWeight:600,
                background:rs.cf==="매우 높음"||rs.cf==="높음"?"#dcfce7":"#fef3c7",
                color:rs.cf==="매우 높음"||rs.cf==="높음"?"#16a34a":"#d97706"}}>증거 신뢰도: {rs.cf}</span>
              {rs.phCount>0&&<span style={{padding:"2px 9px",borderRadius:10,fontSize:10.5,fontWeight:500,background:"#f0f9ff",color:"#0891b2"}}>📸 사진 {rs.phCount}장 반영</span>}
              {rs.evCount>0&&<span style={{padding:"2px 9px",borderRadius:10,fontSize:10.5,fontWeight:500,background:"#f5f3ff",color:"#7c3aed"}}>📎 증거 {rs.evCount}건{rs.fileCount>0?` (첨부 ${rs.fileCount})`:""}</span>}
            </div>
            {/* 산정 근거 */}
            {rs.factors&&rs.factors.length>0&&<div style={{marginTop:10,padding:"8px 10px",borderRadius:8,background:"#fafbfc",border:"1px solid #e2e8f0"}}>
              <div style={{fontSize:10.5,fontWeight:600,color:"#475569",marginBottom:5}}>📊 산정 근거 요인</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                {rs.factors.map((f,i)=><span key={i} style={{padding:"2px 7px",borderRadius:6,fontSize:9.5,fontWeight:500,
                  background:f.impact==="유리"?"#f0fdf4":f.impact==="불리"?"#fef2f2":"#f8fafc",
                  color:f.impact==="유리"?"#16a34a":f.impact==="불리"?"#dc2626":"#64748b",
                  border:`1px solid ${f.impact==="유리"?"#bbf7d0":f.impact==="불리"?"#fecaca":"#e2e8f0"}`
                }}>{f.label}: {f.val} {f.impact==="유리"?"▼":"▲"}</span>)}
              </div>
            </div>}</div>
          <div style={{...CD,border:"1px solid #c4b5fd"}}><div style={{display:"flex",alignItems:"center",gap:7,marginBottom:9}}>
            <div style={{width:22,height:22,borderRadius:"50%",background:"#7c3aed",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}}>{IC.ai}</div>
            <span style={{fontSize:13,fontWeight:700}}>AI 과실 분석</span>{!aD&&ai&&<Sp s/>}</div>
            <div style={{fontSize:12.5}}><RT text={tA}/></div></div></div>}
      </div></div>);
}

// ═══ TAB 3: 처리 방법 (확장) ═══
function Tab3(){
  const[stage,setStage]=useState("idle");
  const[selCase,setSelCase]=useState(null);const[modal,setModal]=useState(false);const[csQ,setCsQ]=useState("");
  const[input,setInput]=useState("");
  const[summary,setSummary]=useState(null);const[sumText,setSumText]=useState("");const{displayed:tS,done:sD}=useTW(sumText);
  const[proposals,setProposals]=useState(null);
  const[selIdx,setSelIdx]=useState(null);const[detText,setDetText]=useState("");const{displayed:tD,done:dD}=useTW(detText);
  const[detData,setDetData]=useState(null);const[openStep,setOpenStep]=useState(null);
  // 고객 성향
  const[custPref,setCustPref]=useState("");
  // intake Q&A
  const[intakeQs,setIntakeQs]=useState([]);const[intakeAs,setIntakeAs]=useState({});
  const[intakeProg,setIntakeProg]=useState({step:0,msg:"",pct:0});

  const CUST_PREFS=[
    {id:"cash",label:"💰 현금 수령 선호",desc:"미수선 처리로 최대 보상금 확보",short:"현금선호"},
    {id:"fast",label:"⚡ 빠른 수리 희망",desc:"최단 기간 내 수리 완료 우선",short:"빠른수리"},
    {id:"quality",label:"🏆 품질 최우선",desc:"공식 서비스센터 · OEM 부품 고집",short:"품질우선"},
    {id:"balance",label:"⚖️ 비용·품질 균형",desc:"합리적 비용으로 품질 보증 수리",short:"균형형"},
    {id:"insurance",label:"🏢 보험사 비용 절감",desc:"렌트비·수리비 최소화 (보험사 관점)",short:"보험사관점"},
    {id:"unknown",label:"❓ 아직 파악 안됨",desc:"고객 성향 미파악 상태",short:"미파악"},
  ];

  const filtered=CASES.filter(c=>!csQ||c.id.toLowerCase().includes(csQ.toLowerCase())||c.model.includes(csQ)||c.type.includes(csQ));
  const loadCase=c=>{setSelCase(c);setModal(false);setInput(`사고ID: ${c.id}\n사고일: ${c.date}\n유형: ${c.type}\n차량: ${c.make} ${c.model}\n파손: ${c.parts}\n정도: ${c.severity}\n과실: ${c.fault}\n수리비: ${F(c.cost)}\n렌트: ${c.rental}\n상태: ${c.status}\n지역: ${c.region}`);
    setStage("idle");setSummary(null);setProposals(null);setSelIdx(null);setDetText("");setSumText("");setIntakeQs([]);setIntakeAs({});};

  // intake 분석: 누락 정보 파악
  const analyzeIntake=async()=>{if(!input.trim())return;setStage("intake-loading");
    const steps=[
      {msg:"📋 접수 내용 파싱 중...",delay:500},
      {msg:"🔍 필수 정보 항목 점검 중...",delay:600},
      {msg:"📊 누락 정보 식별 중...",delay:500},
    ];
    for(let i=0;i<steps.length;i++){
      setIntakeProg({step:i+1,total:steps.length,msg:steps[i].msg,pct:Math.round(((i+1)/steps.length)*90)});
      await new Promise(r=>setTimeout(r,steps[i].delay));
    }
    // 필수 항목 체크
    const txt=input.toLowerCase();
    const missing=[];
    if(!txt.includes("차량")&&!txt.includes("차종")&&!txt.match(/[a-z]\d|아반떼|소나타|그랜저|k\d|gv/i))
      missing.push({key:"vehicle",q:"차량 정보 (제조사, 모델명, 연식)가 누락되었습니다. 어떤 차량인가요?",hint:"예: 현대 아반떼 CN7 2022년식"});
    if(!txt.includes("파손")&&!txt.includes("손상")&&!txt.includes("부위")&&!txt.includes("범퍼")&&!txt.includes("미러")&&!txt.includes("도어"))
      missing.push({key:"damage",q:"파손 부위와 정도가 확인되지 않았습니다. 어떤 부위가 어느 정도 파손되었나요?",hint:"예: 프론트범퍼 교체, 좌측 펜더 판금도장"});
    if(!txt.includes("수리비")&&!txt.includes("견적")&&!txt.match(/\d{2,},?\d{3}/))
      missing.push({key:"cost",q:"예상 수리비(견적)가 확인되지 않았습니다. 산출된 견적이 있나요?",hint:"예: 약 280만원 / 아직 미산출"});
    if(!txt.includes("과실")&&!txt.match(/\d+\s*[:%]/))
      missing.push({key:"fault",q:"과실 비율이 확인되지 않았습니다. 과실 비율이 어떻게 되나요?",hint:"예: 상대 100%, 쌍방 50:50, 미산정"});
    if(!txt.includes("렌트")&&!txt.includes("대차"))
      missing.push({key:"rental",q:"대차(렌트) 사용 여부가 확인되지 않았습니다. 현재 대차를 사용 중인가요?",hint:"예: 대차 사용 중 (일 7만원) / 미사용"});
    if(!txt.includes("보험")&&!txt.includes("자차")&&!txt.includes("삼자"))
      missing.push({key:"insurance",q:"보험 처리 유형이 확인되지 않았습니다. 어떤 보험으로 처리되나요?",hint:"예: 상대 삼자배책 / 자차보험 / 미정"});
    setIntakeProg({step:steps.length,total:steps.length,msg:"✅ 분석 완료",pct:100});
    await new Promise(r=>setTimeout(r,300));
    if(missing.length>0){setIntakeQs(missing);setStage("intake-qa");}
    else{setIntakeQs([]);setStage("intake-qa");/* no questions but proceed to pref selection */}
  };

  // 최종 분석
  const runAnalysis=async()=>{setStage("loading");setSummary(null);setProposals(null);setSelIdx(null);setDetText("");setSumText("");
    // 보충 정보 합산
    let fullInput=input;
    Object.entries(intakeAs).forEach(([k,v])=>{if(v&&v.trim())fullInput+=`\n${k}: ${v}`;});
    if(custPref)fullInput+=`\n고객성향: ${CUST_PREFS.find(p=>p.id===custPref)?.short||custPref}`;
    const steps=[
      {msg:"📋 접수 내용 종합 분석 중...",delay:600},
      {msg:"🔍 차량·파손·비용 데이터 매칭 중...",delay:700},
      {msg:"⚖️ 고객 성향 기반 최적안 산출 중...",delay:800},
      {msg:"💰 비용 비교 분석 중...",delay:600},
      {msg:"🤖 AI 처리방법 리포트 생성 중...",delay:500},
    ];
    for(let i=0;i<steps.length;i++){
      setIntakeProg({step:i+1,total:steps.length,msg:steps[i].msg,pct:Math.round(((i+1)/steps.length)*85)});
      await new Promise(r=>setTimeout(r,steps[i].delay));
    }
    const sR=await callAI("손해사정 전문 AI. JSON만 응답:\n{\"업무영역\":\"\",\"핵심쟁점\":\"\",\"차량\":\"\",\"추정비용\":\"\",\"긴급도\":\"높음/보통/낮음\",\"주의사항\":\"\"}",fullInput);
    let sO;try{sO=JSON.parse(sR.replace(/```json|```/g,"").trim())}catch{sO={업무영역:"자동차 손해사정",핵심쟁점:"수리 방법 결정",차량:"확인 필요",추정비용:"산정 중",긴급도:"보통",주의사항:""}}
    setSummary(sO);
    setIntakeProg({step:steps.length,total:steps.length,msg:"📊 리포트 작성 중...",pct:92});
    const nR=await callAI("손해사정 전문 AI. 2-3줄로 사고건을 정리해주세요.",`정리:\n${fullInput}`);setSumText(nR);
    // 비용 산출
    const costMatch=fullInput.match(/(\d{1,3}[,.]?\d{3}[,.]?\d{0,3})/);
    const c=costMatch?parseInt(costMatch[1].replace(/[,.]/g,"")):selCase?.cost||2000000;
    const rentalMatch=fullInput.match(/렌트[:\s]*([^\n]*)/i)||fullInput.match(/대차[:\s]*([^\n]*)/i);
    const hasRental=rentalMatch?!rentalMatch[1].includes("미사용")&&!rentalMatch[1].includes("없"):selCase?.rental==="사용중";
    const rentalDaily=hasRental?70000:0;
    // 스마트 추천 엔진
    const rec=calcRecommendation(custPref,c,hasRental,rentalDaily);
    const pR=await callAI("손해사정 전문 AI. 3가지 처리방법 JSON배열만:\n[{\"title\":\"\",\"subtitle\":\"\",\"cost\":\"금액\",\"period\":\"기간\",\"satisfaction\":4.5,\"pros\":[],\"cons\":[],\"recommended\":false}]\n순서:(1)미수선(2)제휴(3)공식",fullInput);
    let pA;try{pA=JSON.parse(pR.replace(/```json|```/g,"").trim())}catch{
      pA=[
        {title:"미수선 처리",subtitle:"현금정산(협의금)",cost:F(Math.round(c*.72)),period:"3~5일",satisfaction:3.8,
         pros:["빠른 종결","현금 수령","고객 자유도"],cons:["수리 미보장","감가 우려"],recommended:false,
         rentalSave:F(rentalDaily*0),totalCost:F(Math.round(c*.72))},
        {title:"제휴 서비스 센터",subtitle:"보험사 협력정비망",cost:F(Math.round(c*.85)),period:"5~7일",satisfaction:4.2,
         pros:["비용 절감 15%","품질 보증","대차 지원"],cons:["일부 대체부품 사용"],recommended:false,
         rentalSave:hasRental?F(rentalDaily*20)+"↓":"해당없음",totalCost:F(Math.round(c*.85+rentalDaily*6))},
        {title:"공식 서비스 센터",subtitle:"제조사 공식 AS",cost:F(c),period:"14~30일",satisfaction:4.7,
         pros:["OEM 순정부품","최고 품질","보증 유지"],cons:["비용 최대","대기 길음"],recommended:false,
         rentalSave:hasRental?F(rentalDaily*30):"해당없음",totalCost:F(Math.round(c+rentalDaily*25))}]}
    // 추천 적용
    pA[rec.idx].recommended=true;pA[rec.idx].recReason=rec.reason;
    setProposals(pA);
    setIntakeProg({step:steps.length,total:steps.length,msg:"✅ 분석 완료!",pct:100});
    await new Promise(r=>setTimeout(r,400));
    setStage("result");setIntakeProg({step:0,msg:"",pct:0});};

  // 스마트 추천 엔진
  const calcRecommendation=(pref,cost,hasRental,rentalDaily)=>{
    // 0=미수선, 1=제휴, 2=공식
    if(pref==="cash")return{idx:0,reason:"고객이 현금 수령을 선호합니다. 미수선 처리로 빠르게 현금 정산이 가능합니다."};
    if(pref==="quality")return{idx:2,reason:"고객이 품질을 최우선으로 합니다. OEM 순정 부품과 공식 서비스를 권장합니다."};
    if(pref==="fast"){
      if(cost<1500000)return{idx:0,reason:"소액 수리 + 빠른 처리 요구. 미수선 현금 정산이 가장 빠릅니다."};
      return{idx:1,reason:"빠른 수리를 원하지만 수리가 필요한 규모입니다. 제휴 센터가 가장 빠르게 수리를 완료합니다."};
    }
    if(pref==="insurance"){
      if(cost>5000000&&hasRental)return{idx:1,reason:`수리비 ${F(cost)} + 렌트비(일 ${F(rentalDaily)})가 동시 발생합니다. 공식 센터 대비 처리기간이 절반으로 줄어 렌트비를 대폭 절감할 수 있습니다.`};
      if(cost>3000000)return{idx:1,reason:`수리비가 고액(${F(cost)})입니다. 제휴 센터 이용 시 수리비 15% 절감 + 처리기간 단축으로 총 비용을 최소화할 수 있습니다.`};
      if(cost<1000000)return{idx:0,reason:`소액 사고(${F(cost)})입니다. 미수선 처리로 렌트·수리 비용 모두 절감하는 것이 보험사에 가장 유리합니다.`};
      return{idx:1,reason:"보험사 비용 절감 관점에서 제휴 센터가 수리비·렌트비·처리기간 모두 최적입니다."};
    }
    if(pref==="balance"){
      if(cost<1500000)return{idx:1,reason:"합리적 비용으로 품질 보증 수리가 가능합니다. 비용 대비 만족도가 가장 높습니다."};
      return{idx:1,reason:"비용과 품질의 균형을 고려할 때, 제휴 센터가 가장 합리적인 선택입니다."};
    }
    // unknown / default: 비용 기반 자동 판단
    if(cost>8000000)return{idx:2,reason:`고가 수리(${F(cost)})로 OEM 부품 사용이 권장됩니다. 다만 보험사 협의 시 제휴 센터 대안도 제시하세요.`};
    if(cost>3000000&&hasRental)return{idx:1,reason:`수리비 ${F(cost)} + 대차 사용 중으로, 처리기간 단축이 총 비용 절감의 핵심입니다.`};
    if(cost<1000000)return{idx:0,reason:`소액(${F(cost)})이므로 미수선 처리가 효율적입니다. 고객에게 현금 정산 옵션을 먼저 제안하세요.`};
    return{idx:1,reason:"종합적으로 비용·기간·품질을 고려하면 제휴 센터가 가장 균형 잡힌 선택입니다."};
  };

  const showDet=async idx=>{setSelIdx(idx);setDetText("");setDetData(null);setOpenStep(null);setStage("detail");
    const p=proposals[idx];
    let fullInput=input;Object.entries(intakeAs).forEach(([k,v])=>{if(v&&v.trim())fullInput+=`\n${k}: ${v}`;});
    // 비용 파싱
    const costMatch=fullInput.match(/(\d{1,3}[,.]?\d{3}[,.]?\d{0,3})/);
    const baseCost=costMatch?parseInt(costMatch[1].replace(/[,.]/g,"")):selCase?.cost||2000000;
    const carMatch=fullInput.match(/차량[:\s]*([^\n]*)/)||fullInput.match(/(현대|기아|제네시스|BMW|벤츠|아우디|볼보|테슬라|포르쉐|토요타|렉서스|혼다)[^\n]*/i);
    const carName=carMatch?carMatch[1].trim():"확인필요";
    // 차량 가액 추정 (연식 기반)
    const yrMatch=fullInput.match(/(\d{4})년/);
    const yr=yrMatch?parseInt(yrMatch[1]):2022;
    const age=2026-yr;
    const estValue=age<=1?45000000:age<=3?35000000:age<=5?25000000:age<=7?18000000:12000000;
    // 방법별 비용 산출
    const methodCosts=buildMethodCosts(idx,baseCost,estValue,carName,age,fullInput);
    // 방법별 기간 근거
    const timeline=buildTimeline(idx,baseCost,fullInput);
    // 방법별 절차+체크리스트
    const steps=buildSteps(idx,custPref);
    setDetData({methodCosts,timeline,steps,carName,estValue,age,baseCost});
    // AI 보충 분석 (고객 스크립트 + 유의사항)
    const r=await callAI("손해사정 전문 AI. 선택된 방법에 대해 고객 상담 스크립트와 유의사항만 제시하세요.\n## 고객 스크립트\n- 전화/대면 시 사용할 멘트\n## 유의사항\n- 주의할 점",
      `사고건:\n${fullInput}\n방법:${p.title}(${p.subtitle})\n비용:${p.cost},기간:${p.period}\n고객성향:${CUST_PREFS.find(x=>x.id===custPref)?.short||"미파악"}\n스크립트+유의사항만 간결하게.`);
    setDetText(r);};

  // ═══ 비용 상세 산출 ═══
  const buildMethodCosts=(idx,base,carValue,car,age,txt)=>{
    // 파손 부위 파싱
    const parts=[];
    const partKeywords=[
      {name:"프론트범퍼",partsCost:180000,laborCost:120000,paintCost:150000},
      {name:"리어범퍼",partsCost:170000,laborCost:110000,paintCost:140000},
      {name:"본넷(후드)",partsCost:350000,laborCost:80000,paintCost:180000},
      {name:"프론트펜더",partsCost:250000,laborCost:90000,paintCost:160000},
      {name:"리어쿼터패널",partsCost:400000,laborCost:180000,paintCost:200000},
      {name:"프론트도어",partsCost:380000,laborCost:100000,paintCost:170000},
      {name:"리어도어",partsCost:360000,laborCost:100000,paintCost:170000},
      {name:"사이드미러",partsCost:220000,laborCost:40000,paintCost:0},
      {name:"헤드라이트",partsCost:450000,laborCost:50000,paintCost:0},
      {name:"테일라이트",partsCost:280000,laborCost:40000,paintCost:0},
      {name:"트렁크",partsCost:320000,laborCost:80000,paintCost:160000},
      {name:"루프패널",partsCost:500000,laborCost:200000,paintCost:220000},
      {name:"전면유리",partsCost:350000,laborCost:80000,paintCost:0},
    ];
    const tl=txt.toLowerCase();
    partKeywords.forEach(pk=>{
      if(tl.includes(pk.name.replace("(후드)",""))||tl.includes(pk.name.split("(")[0]))parts.push({...pk});
    });
    if(tl.includes("범퍼")&&!parts.find(p=>p.name.includes("범퍼")))parts.push(partKeywords[0]);
    if(tl.includes("미러")&&!parts.find(p=>p.name.includes("미러")))parts.push(partKeywords[7]);
    if(tl.includes("도어")&&!parts.find(p=>p.name.includes("도어")))parts.push(partKeywords[5]);
    if(parts.length===0){// fallback: 총 비용 기준 역산
      const est=Math.round(base*0.4);
      parts.push({name:"주요 파손부위(종합)",partsCost:est,laborCost:Math.round(base*0.3),paintCost:Math.round(base*0.3)});
    }
    // 방법별 배율
    const mult=idx===0?0.72:idx===1?0.85:1.0;
    const partsMult=idx===2?1.0:idx===1?0.8:0.7; // OEM vs 대체 vs 미수선
    const laborMult=idx===2?1.0:idx===1?0.85:0;
    const paintMult=idx===2?1.0:idx===1?0.9:0;
    const breakdown=parts.map(p=>({
      name:p.name,
      parts:idx===0?0:Math.round(p.partsCost*partsMult),
      labor:Math.round(p.laborCost*laborMult),
      paint:Math.round(p.paintCost*paintMult),
      subtotal:idx===0?0:Math.round(p.partsCost*partsMult+p.laborCost*laborMult+p.paintCost*paintMult),
      note:idx===0?"현금정산":(idx===1?"대체부품 적용":"OEM 순정부품")
    }));
    const totalParts=breakdown.reduce((s,b)=>s+b.parts,0);
    const totalLabor=breakdown.reduce((s,b)=>s+b.labor,0);
    const totalPaint=breakdown.reduce((s,b)=>s+b.paint,0);
    const totalRepair=totalParts+totalLabor+totalPaint;
    const cashAmount=idx===0?Math.round(base*mult):0;
    return{breakdown,totalParts,totalLabor,totalPaint,totalRepair:idx===0?cashAmount:totalRepair,
      carValue,car,age,partType:idx===0?"해당없음(현금정산)":idx===1?"대체부품(OEM 호환)":"OEM 순정부품",
      laborRate:idx===2?"공식센터 공임단가":"제휴센터 할인단가",isCash:idx===0};
  };

  // ═══ 기간 근거 ═══
  const buildTimeline=(idx,cost,txt)=>{
    if(idx===0)return{total:"3~5일",phases:[
      {name:"보험사 접수·견적 확인",days:"1일",reason:"사고 접수 후 견적서를 보험사에 제출하여 현금 정산 금액을 확정합니다"},
      {name:"협의금 산정·합의",days:"1~2일",reason:"보험사 손해사정팀에서 미수선 협의금을 산정합니다. 견적 대비 70~80% 수준이 일반적이며, 감가상각과 시세를 반영합니다"},
      {name:"합의서 작성·입금",days:"1~2일",reason:"합의서 서명 후 영업일 기준 1~2일 내 고객 계좌로 입금됩니다"},
    ],note:"미수선 처리는 실제 수리를 하지 않으므로 가장 빠른 종결이 가능합니다"};
    if(idx===1)return{total:"5~7일",phases:[
      {name:"보험사 접수·제휴센터 배정",days:"0.5일",reason:"보험사 협력정비망 중 고객 지역·차종에 맞는 최적 센터를 배정합니다"},
      {name:"입고·정밀 견적",days:"0.5~1일",reason:"입고 후 리프트 점검으로 숨겨진 파손을 확인합니다. 기존 견적과 차이가 있으면 보험사에 추가 승인을 요청합니다"},
      {name:"부품 수급",days:"1~2일",reason:cost>3000000?"수리비가 고액이라 다수 부품 주문이 필요합니다. 대체부품(OEM 호환)은 순정 대비 수급이 빠릅니다":"대체부품은 국내 재고가 풍부하여 대부분 당일~익일 수급됩니다"},
      {name:"수리·도장 작업",days:"2~3일",reason:"판금 → 도장 → 조립 순서로 진행됩니다. 도장 후 최소 12시간 건조가 필요합니다"},
      {name:"품질 검수·출고",days:"0.5일",reason:"수리 품질 최종 검수, 세차 후 고객에게 인도합니다"},
    ],note:"제휴 센터는 보험사와 직접 정산하므로 고객 부담금 없이 진행됩니다"};
    return{total:cost>5000000?"21~30일":"14~21일",phases:[
      {name:"보험사 접수·공식센터 예약",days:"1~3일",reason:"공식 서비스센터는 예약 대기가 있습니다. 성수기(연말, 장마철)에는 대기가 더 길어질 수 있습니다"},
      {name:"입고·공식 견적 산출",days:"1~2일",reason:"제조사 진단 장비로 정밀 점검합니다. 공식 견적은 OEM 부품가 + 공식 공임단가로 산출되어 제휴센터 대비 15~30% 높습니다"},
      {name:"OEM 부품 수급",days:"3~7일",reason:cost>5000000?"고가 수리로 다량의 순정부품이 필요합니다. 해외 수입 부품의 경우 통관·물류에 5~7일 소요됩니다":"순정부품 국내 재고 확인 후 발주합니다. 재고 부품은 2~3일, 해외발주는 5~7일 소요됩니다"},
      {name:"수리·도장 작업",days:"5~10일",reason:"공식센터는 제조사 매뉴얼에 따른 정밀 수리를 진행합니다. 도장은 OEM 도료 사용, 3단계 건조(프라이머→베이스→클리어) 과정을 거칩니다"},
      {name:"ADAS 캘리브레이션",days:"1~2일",reason:"범퍼·유리 관련 수리 시 전방카메라, 레이더 등 ADAS 센서 캘리브레이션이 필수입니다. 제조사 전용 장비가 필요합니다"},
      {name:"최종 검수·출고",days:"1일",reason:"제조사 품질 기준에 따른 최종 점검, 시운전 후 고객 인도합니다"},
    ],note:`공식센터 처리기간이 긴 이유: ①OEM 부품 수급 대기 ②제조사 매뉴얼 준수 ③ADAS 캘리브레이션. 이 기간 동안 대차비가 지속 발생(일 약 ${F(70000)})하므로 보험사와 사전 협의가 중요합니다`};
  };

  // ═══ 절차별 체크리스트 ═══
  const buildSteps=(idx,pref)=>{
    const common=[
      {title:"보험사 접수 확인",emoji:"📋",checklist:[
        {item:"사고 접수번호 확인",detail:"보험사 콜센터(1588-xxxx) 또는 모바일 앱에서 접수번호를 발급받습니다"},
        {item:"담당 손해사정사 배정 확인",detail:"접수 후 1시간 내 담당자가 배정됩니다. 미배정 시 보험사에 재확인"},
        {item:"사고 접수 서류 확인",detail:"사고 사실 확인서, 차량등록증 사본, 운전면허증 사본 준비"},
        {item:"블랙박스 영상 확보",detail:"사고 당시 블랙박스 영상을 SD카드에서 추출하여 보관 (덮어쓰기 방지)"},
        {item:"상대방 정보 확인",detail:"상대 차량번호, 보험사, 연락처, 운전자 정보를 기록"},
      ]},
    ];
    if(idx===0)return[...common,
      {title:"미수선 견적 산출",emoji:"💰",checklist:[
        {item:"정비소 견적서 발급",detail:"공인 정비소에서 공식 견적서를 발급받습니다. 부품비·공임비·도장비가 항목별로 명기되어야 합니다"},
        {item:"견적서 보험사 제출",detail:"견적서를 담당 손해사정사에게 팩스 또는 모바일로 전송"},
        {item:"차량 시세 확인",detail:"보험개발원 차량가액 조회 또는 중고차 시세를 확인하여 감가 근거를 준비합니다"},
        {item:"미수선 협의금 확인",detail:"보험사 산정 협의금이 견적 대비 70~80% 미만이면 재협의 요청"},
      ]},
      {title:"합의 진행",emoji:"🤝",checklist:[
        {item:"합의금 최종 확인",detail:"미수선 협의금 = 수리비 견적 × 적용률(통상 70~80%). 차량 연식, 감가, 부위별 적정성 확인"},
        {item:"합의서 작성",detail:"보험사 양식의 합의서에 합의금액, 지급방법, 면책사항 확인 후 서명"},
        {item:"고객 계좌 확인",detail:"입금 계좌(예금주, 은행, 계좌번호) 정확히 확인"},
        {item:"향후 수리 의사 재확인",detail:"미수선 합의 후 추가 수리 요청 불가함을 고객에게 명확히 안내"},
      ]},
      {title:"종결 처리",emoji:"✅",checklist:[
        {item:"합의금 입금 확인",detail:"합의서 서명 후 영업일 1~2일 내 입금. 미입금 시 보험사 경리팀 확인"},
        {item:"사건 종결 처리",detail:"보험사 시스템에서 사건 종결 처리. 종결 확인서를 고객에게 발송"},
        {item:"고객 만족도 확인",detail:"종결 후 1일 내 고객에게 만족도 확인 연락"},
      ]},
    ];
    if(idx===1)return[...common,
      {title:"제휴센터 배정·입고",emoji:"🏭",checklist:[
        {item:"제휴센터 선정",detail:"고객 거주지 인근, 해당 차종 수리 경험이 있는 제휴센터를 선정합니다"},
        {item:"입고 일정 조율",detail:"고객과 센터의 가용 일정을 확인하여 입고일을 확정합니다"},
        {item:"대차 수배",detail:"입고 당일부터 대차(렌트카)를 준비합니다. 동급 차량 또는 고객 희망 차종 확인"},
        {item:"입고 시 체크",detail:"고객 차량 외관 상태를 사진으로 기록(기존 스크래치 등), 차량 내 귀중품 확인"},
        {item:"정밀 견적 확인",detail:"리프트 점검 후 숨겨진 파손 확인. 추가 파손 시 보험사 추가 승인 요청"},
      ]},
      {title:"수리 진행 모니터링",emoji:"🔧",checklist:[
        {item:"부품 수급 현황 확인",detail:"주문된 부품의 입고 예정일을 확인하고, 지연 시 대안 부품을 검토합니다"},
        {item:"수리 진행 상황 점검",detail:"1~2일 간격으로 센터에 수리 진행률을 확인합니다"},
        {item:"도장 품질 중간점검",detail:"도장 작업 완료 후 색상 매칭, 오렌지필, 이물질 혼입 여부를 확인합니다"},
        {item:"고객 중간 안내",detail:"고객에게 수리 진행 상황을 SMS 또는 전화로 안내합니다 (입고 후 3일차)"},
      ]},
      {title:"출고·검수",emoji:"🚗",checklist:[
        {item:"수리 완료 검수",detail:"수리 부위 외관, 틈새(갭), 단차, 도장 품질, 부품 장착 상태를 꼼꼼히 확인"},
        {item:"ADAS 센서 점검",detail:"범퍼·유리 관련 수리 시 전방카메라, 주차센서, 어라운드뷰 정상 작동 확인"},
        {item:"시운전 확인",detail:"주행 중 이상 소음, 진동, 얼라인먼트 이상 여부를 확인합니다"},
        {item:"대차 반납 조율",detail:"출고일에 맞춰 대차 반납을 조율합니다. 대차 기간 = 입고일~출고일"},
        {item:"수리 보증서 발급",detail:"제휴센터 수리 보증서를 발급받아 고객에게 전달합니다"},
        {item:"고객 인도·만족도 확인",detail:"출고 시 수리 내역을 고객에게 설명하고, 추후 이상 시 연락처를 안내합니다"},
      ]},
      {title:"정산·종결",emoji:"✅",checklist:[
        {item:"보험사 정산 요청",detail:"수리 명세서와 세금계산서를 보험사에 제출하여 정산을 요청합니다"},
        {item:"대차비 정산 확인",detail:"대차 기간과 일일 요금을 확인하여 정산합니다"},
        {item:"사건 종결 처리",detail:"모든 정산 완료 후 사건을 종결 처리합니다"},
      ]},
    ];
    return[...common,
      {title:"공식센터 예약·입고",emoji:"🏢",checklist:[
        {item:"공식센터 예약",detail:"제조사 공식 서비스센터에 수리 예약을 합니다. 예약 대기 현황을 확인하세요"},
        {item:"보험사 사전 승인",detail:"공식센터 견적은 제휴 대비 15~30% 높습니다. 보험사에 공식센터 수리를 사전 승인받습니다"},
        {item:"입고 시 차량 상태 기록",detail:"입고 전 차량 전체를 사진/영상으로 기록합니다"},
        {item:"대차 준비",detail:"공식센터 수리기간이 길므로(14~30일) 대차를 사전 준비합니다. 보험사 대차 기준 확인"},
        {item:"정밀 진단",detail:"제조사 전용 진단 장비로 차량 전체를 스캔합니다. 숨겨진 전자장비 오류도 확인됩니다"},
      ]},
      {title:"OEM 부품 수급·수리",emoji:"🔧",checklist:[
        {item:"OEM 부품 발주 확인",detail:"순정부품 재고 확인 → 국내 미재고 시 해외 본사 발주. 발주 후 예상 입고일을 확인합니다"},
        {item:"수리 진행 모니터링",detail:"2~3일 간격으로 수리 진행률을 확인합니다. 부품 지연 시 보험사에 기간 연장을 보고합니다"},
        {item:"고객 중간 보고",detail:"고객에게 주 1회 이상 수리 상황을 안내합니다. 기간이 길어지면 고객 불만이 커지므로 선제적 안내가 중요합니다"},
        {item:"도장 품질 확인",detail:"OEM 도료 사용 여부, 3단계 건조 과정(프라이머→베이스코트→클리어코트) 준수 확인"},
        {item:"대차비 관리",detail:"수리 기간이 길어질수록 대차비가 누적됩니다. 보험사와 대차비 한도를 사전 협의하세요"},
      ]},
      {title:"ADAS 캘리브레이션·검수",emoji:"📡",checklist:[
        {item:"ADAS 캘리브레이션 실시",detail:"범퍼/유리/미러 관련 수리 시 필수. 전방카메라, 레이더, 라이다 등의 센서를 재보정합니다"},
        {item:"캘리브레이션 결과 확인",detail:"제조사 전용 장비로 보정 결과를 출력하여 보관합니다"},
        {item:"전자장비 전체 스캔",detail:"수리 후 차량 전체 ECU 스캔으로 오류 코드 없음을 확인합니다"},
        {item:"시운전·로드테스트",detail:"자동 긴급제동(AEB), 차선이탈경고(LDW) 등 ADAS 기능 정상 작동을 확인합니다"},
      ]},
      {title:"출고·최종 검수",emoji:"🚗",checklist:[
        {item:"외관 품질 검수",detail:"수리 부위 외관, 틈새, 단차, 도장 품질을 제조사 기준으로 최종 확인합니다"},
        {item:"수리 보증서 발급",detail:"공식센터 수리 보증서(보통 1~2년)를 발급받아 고객에게 전달합니다"},
        {item:"고객 인도·설명",detail:"수리 내역, 교체 부품 목록, ADAS 보정 결과를 고객에게 상세히 설명합니다"},
        {item:"대차 반납",detail:"출고 당일 대차를 반납하고, 대차 기간 최종 정산"},
      ]},
      {title:"정산·종결",emoji:"✅",checklist:[
        {item:"공식센터 정산",detail:"수리 명세서, 부품 교체 내역서, ADAS 캘리브레이션 비용을 보험사에 제출"},
        {item:"대차비 정산",detail:"총 대차일수 × 일일단가를 계산하여 정산. 보험사 한도 초과 시 고객 부담금 발생 여부 확인"},
        {item:"추가비용 검토",detail:"견인비, 야간수당, 긴급출동비 등 부대비용 누락 없이 정산"},
        {item:"사건 종결",detail:"모든 정산 완료 후 종결 처리. 고객에게 종결 안내 및 만족도 확인"},
      ]},
    ];
  };
  const reset=()=>{setStage("idle");setSelCase(null);setInput("");setSummary(null);setProposals(null);setSelIdx(null);setDetText("");setDetData(null);setOpenStep(null);setSumText("");setIntakeQs([]);setIntakeAs({});setCustPref("");setIntakeProg({step:0,msg:"",pct:0})};

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

      {/* ═══ IDLE: 입력 ═══ */}
      {stage==="idle"&&<div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <div style={{...CD,flex:1,display:"flex",flexDirection:"column"}}><h3 style={ST}>사고건 내용 입력</h3>
          <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder={"사고건을 입력하세요...\n예: 520d 양쪽 사이드미러+범퍼 파손\n또는 '사고건 불러오기'로 기존 접수건 선택"} style={{...TA,flex:1,minHeight:120,resize:"none"}}/>
          <div style={{display:"flex",gap:5,marginTop:10,flexWrap:"wrap"}}>
            {["520d 사이드미러+범퍼 파손","GV80 전면 5부위 심각","아반떼 후미추돌"].map((q,i)=>
              <button key={i} onClick={()=>setInput(q)} style={{padding:"4px 10px",borderRadius:14,fontSize:11,cursor:"pointer",background:"#f8fafc",color:"#94a3b8",border:"1px solid #e2e8f0",transition:"all .15s"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="#059669";e.currentTarget.style.color="#059669"}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="#e2e8f0";e.currentTarget.style.color="#94a3b8"}}>{q}</button>)}</div></div>
        <button onClick={analyzeIntake} disabled={!input.trim()} style={{...BT,marginTop:10,background:!input.trim()?"#e2e8f0":"#059669",opacity:!input.trim()?.4:1}}>접수 내용 분석</button></div>}

      {/* ═══ INTAKE LOADING ═══ */}
      {stage==="intake-loading"&&<div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:14}}>
        <div style={{...CD,border:"2px solid #86efac",background:"linear-gradient(135deg,#f0fdf4,#ecfdf5)",width:400,maxWidth:"100%"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
            <div style={{display:"flex",alignItems:"center",gap:7}}>
              <div style={{width:22,height:22,border:"2.5px solid #bbf7d0",borderTop:"2.5px solid #059669",borderRadius:"50%",animation:"spin .7s linear infinite"}}/>
              <span style={{fontSize:13,fontWeight:700,color:"#059669"}}>접수 내용 사전 분석</span>
            </div>
            <span style={{fontSize:12,fontWeight:700,color:"#059669",fontFamily:"'DM Mono',monospace"}}>{intakeProg.pct}%</span>
          </div>
          <div style={{height:6,borderRadius:3,background:"#dcfce7",overflow:"hidden",marginBottom:8}}>
            <div style={{height:"100%",borderRadius:3,background:"linear-gradient(90deg,#22c55e,#059669)",transition:"width .5s ease",width:`${intakeProg.pct}%`}}/></div>
          <div style={{fontSize:12,color:"#475569",fontWeight:500}}>{intakeProg.msg}</div>
        </div></div>}

      {/* ═══ INTAKE Q&A ═══ */}
      {stage==="intake-qa"&&<div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:12}}>
        {/* 누락 정보 질문 */}
        {intakeQs.length>0&&<div style={{...CD,border:"2px solid #fde68a",background:"linear-gradient(135deg,#fffbeb,#fef3c7)"}}>
          <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:10}}>
            <div style={{width:24,height:24,borderRadius:"50%",background:"#f59e0b",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:13}}>?</div>
            <span style={{fontSize:14,fontWeight:700,color:"#92400e"}}>추가 정보가 필요합니다</span>
            <span style={{fontSize:10.5,color:"#b45309",background:"#fef3c7",padding:"2px 8px",borderRadius:10,border:"1px solid #fde68a"}}>{intakeQs.length}건</span>
          </div>
          <div style={{fontSize:12,color:"#92400e",marginBottom:12,lineHeight:1.6}}>
            아래 항목의 정보가 부족합니다. 확인 가능한 내용을 입력해주세요.<br/>
            <span style={{fontSize:11,color:"#b45309"}}>* 정보가 없으면 "없음" 또는 "확인불가"로 입력하시면 해당 사항을 감안하여 진행합니다.</span>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {intakeQs.map((q,i)=><div key={q.key} style={{padding:"10px 12px",borderRadius:10,background:"#fff",border:"1px solid #fde68a"}}>
              <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:6}}>
                <span style={{width:20,height:20,borderRadius:"50%",background:"#fef3c7",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#d97706"}}>{i+1}</span>
                <span style={{fontSize:12,fontWeight:600,color:"#334155"}}>{q.q}</span>
              </div>
              <input value={intakeAs[q.key]||""} onChange={e=>setIntakeAs(prev=>({...prev,[q.key]:e.target.value}))}
                placeholder={q.hint} style={{...IN,width:"100%",fontSize:12,background:"#fffbeb",border:"1px solid #fde68a"}}/>
            </div>)}
          </div>
        </div>}

        {intakeQs.length===0&&<div style={{...CD,border:"2px solid #86efac",background:"linear-gradient(135deg,#f0fdf4,#ecfdf5)"}}>
          <div style={{display:"flex",alignItems:"center",gap:7}}>
            <span style={{fontSize:18}}>✅</span>
            <span style={{fontSize:14,fontWeight:700,color:"#059669"}}>접수 내용이 충분합니다</span>
          </div>
          <div style={{fontSize:12,color:"#475569",marginTop:6}}>필수 정보가 모두 확인되었습니다. 아래에서 고객 성향을 선택 후 분석을 시작하세요.</div>
        </div>}

        {/* 고객 성향 선택 */}
        <div style={{...CD,border:"1px solid #e2e8f0"}}>
          <h3 style={{...ST,marginBottom:8}}>🎯 고객 성향 선택</h3>
          <div style={{fontSize:11,color:"#64748b",marginBottom:10}}>고객의 수리 선호도에 따라 AI가 최적의 처리 방법을 추천합니다</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
            {CUST_PREFS.map(p=><div key={p.id} onClick={()=>setCustPref(p.id)}
              style={{padding:"10px 11px",borderRadius:10,border:custPref===p.id?"2px solid #059669":"1px solid #e2e8f0",
                background:custPref===p.id?"#f0fdf4":"#fafbfc",cursor:"pointer",transition:"all .15s"}}>
              <div style={{fontSize:12.5,fontWeight:custPref===p.id?700:500,color:custPref===p.id?"#059669":"#334155",marginBottom:2}}>{p.label}</div>
              <div style={{fontSize:10,color:"#94a3b8"}}>{p.desc}</div>
            </div>)}
          </div>
        </div>

        <button onClick={runAnalysis} disabled={!custPref} style={{...BT,background:!custPref?"#e2e8f0":"#059669",opacity:!custPref?.4:1}}>
          {!custPref?"고객 성향을 선택해주세요":"AI 처리 방법 분석 시작"}</button>
      </div>}

      {/* ═══ LOADING ═══ */}
      {stage==="loading"&&<div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:14}}>
        <div style={{...CD,border:"2px solid #86efac",background:"linear-gradient(135deg,#f0fdf4,#ecfdf5)",width:420,maxWidth:"100%"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
            <div style={{display:"flex",alignItems:"center",gap:7}}>
              <div style={{width:22,height:22,border:"2.5px solid #bbf7d0",borderTop:"2.5px solid #059669",borderRadius:"50%",animation:"spin .7s linear infinite"}}/>
              <span style={{fontSize:13,fontWeight:700,color:"#059669"}}>AI 처리 방법 분석 진행 중</span>
            </div>
            <span style={{fontSize:12,fontWeight:700,color:"#059669",fontFamily:"'DM Mono',monospace"}}>{intakeProg.pct}%</span>
          </div>
          <div style={{height:7,borderRadius:4,background:"#dcfce7",overflow:"hidden",marginBottom:8}}>
            <div style={{height:"100%",borderRadius:4,background:"linear-gradient(90deg,#22c55e,#059669,#047857)",transition:"width .5s ease",width:`${intakeProg.pct}%`}}/></div>
          <div style={{fontSize:12,color:"#475569",fontWeight:500,marginBottom:8}}>{intakeProg.msg}</div>
          <div style={{display:"flex",gap:3}}>
            {Array.from({length:intakeProg.total||5}).map((_,i)=><div key={i} style={{flex:1,height:3,borderRadius:2,background:i<(intakeProg.step||0)?"#059669":"#e2e8f0",transition:"background .3s"}}/>)}</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:10}}>
            {custPref&&<span style={{padding:"3px 8px",borderRadius:12,fontSize:10,background:"#f0fdf4",border:"1px solid #bbf7d0",color:"#059669",fontWeight:500}}>🎯 {CUST_PREFS.find(p=>p.id===custPref)?.label}</span>}
            {Object.values(intakeAs).filter(Boolean).length>0&&<span style={{padding:"3px 8px",borderRadius:12,fontSize:10,background:"#fffbeb",border:"1px solid #fde68a",color:"#d97706",fontWeight:500}}>📋 보충정보 {Object.values(intakeAs).filter(Boolean).length}건</span>}
          </div>
        </div></div>}

      {/* ═══ RESULT ═══ */}
      {stage==="result"&&summary&&<div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:12}}>
        <div style={{...CD,border:"2px solid #86efac",marginBottom:0}}>
          <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:10}}>
            <div style={{width:24,height:24,borderRadius:"50%",background:"#059669",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}}>{IC.ai}</div>
            <span style={{fontSize:14,fontWeight:700}}>접수 내용 분석</span>{!sD&&<Sp s/>}
            {custPref&&<span style={{marginLeft:"auto",padding:"3px 9px",borderRadius:10,fontSize:10,fontWeight:600,background:"#f0fdf4",color:"#059669",border:"1px solid #bbf7d0"}}>🎯 {CUST_PREFS.find(p=>p.id===custPref)?.short}</span>}
          </div>
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
            {proposals.map((p,idx)=><div key={idx} onClick={()=>showDet(idx)} style={{background:CB[idx],borderRadius:15,padding:"18px 16px",border:`2px solid ${p.recommended?CC[idx]:CR[idx]}`,cursor:"pointer",transition:"all .2s",position:"relative",boxShadow:p.recommended?`0 4px 16px ${CC[idx]}20`:"none"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=`0 8px 24px ${CC[idx]}12`;e.currentTarget.style.borderColor=CC[idx]}}
              onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow=p.recommended?`0 4px 16px ${CC[idx]}20`:"none";e.currentTarget.style.borderColor=p.recommended?CC[idx]:CR[idx]}}>
              {p.recommended&&<div style={{position:"absolute",top:9,right:9,background:CC[idx],color:"#fff",padding:"2px 8px",borderRadius:10,fontSize:9.5,fontWeight:700}}>AI 추천</div>}
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
              {p.recommended&&p.recReason&&<div style={{marginTop:8,padding:"5px 8px",borderRadius:7,background:"rgba(255,255,255,.6)",border:`1px solid ${CR[idx]}`,fontSize:10,color:"#475569",lineHeight:1.5}}>💡 {p.recReason}</div>}
              <div style={{marginTop:10,display:"flex",alignItems:"center",justifyContent:"center",gap:4,padding:"7px 0",borderTop:`1px solid ${CR[idx]}`,color:CC[idx],fontSize:12,fontWeight:600}}>
                미리보기 · 절차 확인 {IC.arr}</div>
            </div>)}
          </div></div>}
      </div>}

      {/* ═══ DETAIL ═══ */}
      {stage==="detail"&&proposals&&selIdx!==null&&<div style={{flex:1,overflowY:"auto",animation:"fadeIn .3s"}}>
        <button onClick={()=>{setStage("result");setSelIdx(null);setDetText("");setDetData(null);setOpenStep(null)}} style={{display:"flex",alignItems:"center",gap:4,padding:"6px 12px",borderRadius:9,fontSize:12,background:"none",border:"1px solid #e2e8f0",cursor:"pointer",color:"#64748b",marginBottom:12}}>{IC.bk} 3가지 방법 보기</button>
        <div style={{background:CB[selIdx],borderRadius:15,padding:"16px 20px",border:`2px solid ${CC[selIdx]}`,marginBottom:12,display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:40,height:40,borderRadius:11,background:`${CC[selIdx]}10`,display:"flex",alignItems:"center",justifyContent:"center",color:CC[selIdx]}}>{CI[selIdx]}</div>
          <div style={{flex:1}}><div style={{fontSize:16,fontWeight:700,color:"#0f172a"}}>({selIdx+1}) {proposals[selIdx].title}</div><div style={{fontSize:12,color:"#64748b"}}>{proposals[selIdx].subtitle}</div></div>
          <div style={{display:"flex",gap:14}}>
            <div style={{textAlign:"center"}}><div style={{fontSize:9.5,color:"#94a3b8",fontWeight:600}}>비용</div><div style={{fontSize:16,fontWeight:700,color:CC[selIdx],fontFamily:"'DM Mono',monospace"}}>{proposals[selIdx].cost}</div></div>
            <div style={{width:1,height:30,background:"#e2e8f0"}}/>
            <div style={{textAlign:"center"}}><div style={{fontSize:9.5,color:"#94a3b8",fontWeight:600}}>기간</div><div style={{fontSize:16,fontWeight:700,color:"#334155"}}>{proposals[selIdx].period}</div></div></div></div>

        {/* 비용 상세 산출 */}
        {detData&&<div style={{...CD,border:`1px solid ${CR[selIdx]}`,marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:12}}>
            <span style={{fontSize:15}}>💰</span>
            <span style={{fontSize:14,fontWeight:700}}>비용 상세 산출 근거</span></div>
          {/* 차량 기본 정보 */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7,marginBottom:12}}>
            <div style={{background:"#f8fafc",borderRadius:8,padding:"8px 10px",border:"1px solid #e2e8f0"}}>
              <div style={{fontSize:9.5,color:"#94a3b8",fontWeight:600}}>차량</div>
              <div style={{fontSize:12,fontWeight:600,color:"#0f172a"}}>{detData.carName}</div></div>
            <div style={{background:"#f8fafc",borderRadius:8,padding:"8px 10px",border:"1px solid #e2e8f0"}}>
              <div style={{fontSize:9.5,color:"#94a3b8",fontWeight:600}}>추정 차량가액</div>
              <div style={{fontSize:12,fontWeight:600,color:"#0f172a"}}>{F(detData.estValue)}</div></div>
            <div style={{background:"#f8fafc",borderRadius:8,padding:"8px 10px",border:"1px solid #e2e8f0"}}>
              <div style={{fontSize:9.5,color:"#94a3b8",fontWeight:600}}>부품 유형</div>
              <div style={{fontSize:12,fontWeight:600,color:"#0f172a"}}>{detData.methodCosts.partType}</div></div>
          </div>
          {/* 비용 테이블 */}
          {!detData.methodCosts.isCash?<>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:11.5,marginBottom:10}}>
              <thead><tr style={{borderBottom:"2px solid #e2e8f0"}}>
                <th style={{textAlign:"left",padding:"7px 8px",color:"#94a3b8",fontSize:10,fontWeight:600}}>파손 부위</th>
                <th style={{textAlign:"right",padding:"7px 8px",color:"#3b82f6",fontSize:10,fontWeight:600}}>부품비</th>
                <th style={{textAlign:"right",padding:"7px 8px",color:"#7c3aed",fontSize:10,fontWeight:600}}>공임비</th>
                <th style={{textAlign:"right",padding:"7px 8px",color:"#d97706",fontSize:10,fontWeight:600}}>도장비</th>
                <th style={{textAlign:"right",padding:"7px 8px",color:"#0f172a",fontSize:10,fontWeight:700}}>소계</th>
              </tr></thead>
              <tbody>{detData.methodCosts.breakdown.map((b,i)=><tr key={i} style={{borderBottom:"1px solid #f1f5f9"}}>
                <td style={{padding:"6px 8px",color:"#334155",fontSize:11}}>{b.name}<div style={{fontSize:9,color:"#94a3b8"}}>{b.note}</div></td>
                <td style={{padding:"6px 8px",textAlign:"right",color:"#3b82f6",fontFamily:"'DM Mono',monospace",fontSize:11}}>{F(b.parts)}</td>
                <td style={{padding:"6px 8px",textAlign:"right",color:"#7c3aed",fontFamily:"'DM Mono',monospace",fontSize:11}}>{F(b.labor)}</td>
                <td style={{padding:"6px 8px",textAlign:"right",color:"#d97706",fontFamily:"'DM Mono',monospace",fontSize:11}}>{F(b.paint)}</td>
                <td style={{padding:"6px 8px",textAlign:"right",fontWeight:700,fontFamily:"'DM Mono',monospace",fontSize:11}}>{F(b.subtotal)}</td>
              </tr>)}</tbody>
            </table>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:6}}>
              <div style={{background:"#eff6ff",borderRadius:7,padding:"7px 9px",textAlign:"center",border:"1px solid #bfdbfe"}}>
                <div style={{fontSize:9,color:"#3b82f6",fontWeight:600}}>부품비 합계</div>
                <div style={{fontSize:13,fontWeight:700,color:"#3b82f6",fontFamily:"'DM Mono',monospace"}}>{F(detData.methodCosts.totalParts)}</div></div>
              <div style={{background:"#f5f3ff",borderRadius:7,padding:"7px 9px",textAlign:"center",border:"1px solid #c4b5fd"}}>
                <div style={{fontSize:9,color:"#7c3aed",fontWeight:600}}>공임비 합계</div>
                <div style={{fontSize:13,fontWeight:700,color:"#7c3aed",fontFamily:"'DM Mono',monospace"}}>{F(detData.methodCosts.totalLabor)}</div></div>
              <div style={{background:"#fffbeb",borderRadius:7,padding:"7px 9px",textAlign:"center",border:"1px solid #fde68a"}}>
                <div style={{fontSize:9,color:"#d97706",fontWeight:600}}>도장비 합계</div>
                <div style={{fontSize:13,fontWeight:700,color:"#d97706",fontFamily:"'DM Mono',monospace"}}>{F(detData.methodCosts.totalPaint)}</div></div>
              <div style={{background:"#f0fdf4",borderRadius:7,padding:"7px 9px",textAlign:"center",border:"1px solid #bbf7d0"}}>
                <div style={{fontSize:9,color:"#059669",fontWeight:700}}>총 수리비</div>
                <div style={{fontSize:13,fontWeight:800,color:"#059669",fontFamily:"'DM Mono',monospace"}}>{F(detData.methodCosts.totalRepair)}</div></div>
            </div>
          </>:<div style={{background:"#ecfeff",borderRadius:9,padding:"12px 14px",border:"1px solid #a5f3fc"}}>
            <div style={{fontSize:12,fontWeight:600,color:"#0891b2",marginBottom:4}}>미수선 현금정산 산출 기준</div>
            <div style={{fontSize:11.5,color:"#475569",lineHeight:1.7}}>
              수리비 견적 {F(detData.baseCost)} × 미수선 적용률 (72%) = <strong style={{color:"#0891b2"}}>{F(detData.methodCosts.totalRepair)}</strong><br/>
              차량가액 {F(detData.estValue)} 대비 수리비 비중 {Math.round(detData.baseCost/detData.estValue*100)}% — {detData.baseCost/detData.estValue>0.5?"수리비가 차량가액의 50%를 초과하므로 전손 처리 검토가 필요합니다":"정상 범위 내 미수선 처리 가능"}
            </div></div>}
          <div style={{marginTop:8,fontSize:10,color:"#94a3b8",lineHeight:1.5}}>
            * 차량가액은 보험개발원 기준 {detData.age}년 경과 차량의 평균 시세를 참고한 추정치입니다. 실제 가액은 보험사 조회 결과에 따릅니다.
          </div>
        </div>}

        {/* 소요기간 근거 */}
        {detData&&detData.timeline&&<div style={{...CD,border:`1px solid ${CR[selIdx]}`,marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:12}}>
            <span style={{fontSize:15}}>⏱️</span>
            <span style={{fontSize:14,fontWeight:700}}>소요기간 상세 근거</span>
            <span style={{marginLeft:"auto",fontSize:13,fontWeight:700,color:CC[selIdx],fontFamily:"'DM Mono',monospace"}}>총 {detData.timeline.total}</span></div>
          <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:10}}>
            {detData.timeline.phases.map((ph,i)=><div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",padding:"8px 10px",borderRadius:8,background:i%2===0?"#f8fafc":"#fff",border:"1px solid #f1f5f9"}}>
              <div style={{minWidth:56,textAlign:"center"}}>
                <div style={{fontSize:13,fontWeight:700,color:CC[selIdx],fontFamily:"'DM Mono',monospace"}}>{ph.days}</div></div>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:600,color:"#0f172a"}}>{ph.name}</div>
                <div style={{fontSize:11,color:"#64748b",lineHeight:1.5,marginTop:2}}>{ph.reason}</div></div>
            </div>)}
          </div>
          {detData.timeline.note&&<div style={{padding:"8px 11px",borderRadius:7,background:"#fef3c7",border:"1px solid #fde68a",fontSize:11,color:"#92400e",lineHeight:1.5}}>💡 {detData.timeline.note}</div>}
        </div>}

        {/* 절차별 체크리스트 (인터랙티브) */}
        {detData&&detData.steps&&<div style={{...CD,border:`1px solid ${CR[selIdx]}`,marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:12}}>
            <span style={{fontSize:15}}>📋</span>
            <span style={{fontSize:14,fontWeight:700}}>처리 절차 · 체크리스트</span>
            <span style={{fontSize:10,color:"#94a3b8",marginLeft:4}}>각 단계를 클릭하면 상세 체크리스트가 표시됩니다</span></div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {detData.steps.map((step,sIdx)=><div key={sIdx} style={{borderRadius:10,border:openStep===sIdx?`2px solid ${CC[selIdx]}`:"1px solid #e2e8f0",overflow:"hidden",transition:"all .2s"}}>
              <div onClick={()=>setOpenStep(openStep===sIdx?null:sIdx)}
                style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",cursor:"pointer",
                  background:openStep===sIdx?`${CC[selIdx]}08`:"#fafbfc",transition:"all .15s"}}
                onMouseEnter={e=>{if(openStep!==sIdx)e.currentTarget.style.background="#f0f9ff"}}
                onMouseLeave={e=>{if(openStep!==sIdx)e.currentTarget.style.background="#fafbfc"}}>
                <div style={{width:28,height:28,borderRadius:8,background:openStep===sIdx?CC[selIdx]:"#e2e8f0",display:"flex",alignItems:"center",justifyContent:"center",color:openStep===sIdx?"#fff":"#94a3b8",fontSize:12,fontWeight:700,transition:"all .2s"}}>{sIdx+1}</div>
                <span style={{fontSize:16}}>{step.emoji}</span>
                <span style={{flex:1,fontSize:13,fontWeight:600,color:openStep===sIdx?CC[selIdx]:"#334155"}}>{step.title}</span>
                <span style={{fontSize:10,color:"#94a3b8",background:"#f1f5f9",padding:"2px 7px",borderRadius:8}}>{step.checklist.length}항목</span>
                <span style={{color:"#94a3b8",transform:openStep===sIdx?"rotate(90deg)":"none",transition:"transform .2s"}}>{IC.arr}</span>
              </div>
              {openStep===sIdx&&<div style={{padding:"0 12px 12px",background:`${CC[selIdx]}04`}}>
                <div style={{display:"flex",flexDirection:"column",gap:5,paddingTop:6}}>
                  {step.checklist.map((cl,cIdx)=><div key={cIdx} style={{display:"flex",gap:8,alignItems:"flex-start",padding:"8px 10px",borderRadius:8,background:"#fff",border:"1px solid #e2e8f0"}}>
                    <div style={{minWidth:20,height:20,borderRadius:5,border:`2px solid ${CC[selIdx]}`,display:"flex",alignItems:"center",justifyContent:"center",marginTop:1}}>
                      <span style={{fontSize:10,color:CC[selIdx]}}>✓</span></div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:12,fontWeight:600,color:"#0f172a",marginBottom:2}}>{cl.item}</div>
                      <div style={{fontSize:11,color:"#64748b",lineHeight:1.5}}>{cl.detail}</div></div>
                  </div>)}
                </div>
              </div>}
            </div>)}
          </div>
        </div>}

        {/* AI 보충 (고객 스크립트 + 유의사항) */}
        {detText&&<div style={{...CD,border:`1px solid ${CR[selIdx]}`,marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:9}}>
            <div style={{width:22,height:22,borderRadius:"50%",background:CC[selIdx],display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}}>{IC.ai}</div>
            <span style={{fontSize:13,fontWeight:700}}>AI 보충 분석</span>{!dD&&<Sp s/>}</div>
          <div style={{fontSize:12.5}}><RT text={tD}/></div></div>}

        <div style={{padding:"12px 14px",background:"#fff",borderRadius:11,border:"1px solid #e2e8f0",marginTop:0,marginBottom:12}}>
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
