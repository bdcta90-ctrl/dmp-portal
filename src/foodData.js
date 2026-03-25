// ═══ 식자재 대량 데이터 생성기 ═══

const CATS=["채소","육류","수산","양념","건어물","유제품","가공식품","곡류","과일","음료","반찬","냉동"];
const UNITS={"채소":["단(3kg)","망(20kg)","kg","봉","묶음"],"육류":["kg","근(600g)","팩(500g)"],"수산":["kg","마리","팩","박스"],"양념":["kg","봉(500g)","병(1L)","통"],"건어물":["kg","봉(200g)","팩"],"유제품":["박스(12개)","팩(1L)","kg"],"가공식품":["팩","박스","개","봉"],"곡류":["kg","포(20kg)","봉(2kg)"],"과일":["kg","박스","개"],"음료":["박스(24개)","병(1.5L)","캔(30개)"],"반찬":["kg","팩","통"],"냉동":["kg","팩","박스"]};

const ITEMS_RAW=[
  // 채소 (60+)
  "대파","쪽파","양파","마늘","생강","감자","고구마","당근","무","배추","양배추","브로콜리","시금치","깻잎","상추","청경채","콩나물","숙주","미나리","부추","고추","청양고추","피망","파프리카","오이","호박","애호박","가지","토마토","방울토마토","셀러리","아스파라거스","연근","우엉","도라지","취나물","고사리","더덕","참나물","냉이","달래","두릅","머위","비타민","적양배추","케일","루꼴라","로메인","치커리","새싹","파슬리","바질","로즈마리","레몬그라스","고수","청경채","팽이버섯","새송이버섯","표고버섯","느타리버섯","양송이버섯","목이버섯",
  // 육류 (30+)
  "삼겹살(국내산)","목살(국내산)","앞다리살","뒷다리살","갈비(국내산)","한우등심(1+)","한우채끝","한우안심","한우국거리","소불고기용","돼지불고기용","닭가슴살","닭다리","닭날개","닭볶음탕용","오리훈제","오리로스","양고기","소갈비살","차돌박이","소곱창","돼지곱창","족발용돼지발","수육용사태","돼지등갈비","항정살","가브리살","토시살","제비추리",
  // 수산 (30+)
  "고등어","갈치","조기","삼치","광어(양식)","우럭(양식)","연어(수입)","참치(냉동)","오징어","주꾸미","낙지","문어","새우(흰다리)","대하","꽃게","홍합","바지락","전복","굴","멍게","미역","다시마","김","전어","꽁치","명태","황태","대구","아귀","가자미",
  // 양념 (25+)
  "고춧가루(국산)","간장(진간장)","된장","고추장","쌈장","참기름","들기름","식용유","올리브유","굴소스","미림","맛술","식초","매실액","물엿","설탕","소금(천일염)","소금(꽃소금)","후추","카레가루","머스터드","마요네즈","케첩","칠리소스","와사비",
  // 건어물 (15+)
  "멸치(국물용)","멸치(볶음용)","건새우","건오징어","황태채","북어채","다시팩","건표고","건고추","마른김","조미김","건미역","쥐포","어포","육포",
  // 유제품 (15+)
  "우유(서울우유)","우유(매일)","생크림","버터","치즈(슬라이스)","모짜렐라치즈","크림치즈","요거트","연유","우유(저지방)","두유","코코넛밀크","아몬드밀크","사워크림","휘핑크림",
  // 가공식품 (30+)
  "두부(찌개용)","두부(부침용)","어묵(사각)","어묵(봉)","만두(냉동)","라면","당면","쫄면","칼국수면","수제비반죽","떡볶이떡","떡국떡","순대","햄(스팸)","소시지","베이컨","통조림(참치)","통조림(꽁치)","통조림(골뱅이)","김치(포기)","깍두기","총각김치","겉절이","장아찌","젓갈(새우젓)","젓갈(멸치액젓)","피클","올리브","케이퍼","죽순통조림",
  // 곡류 (10+)
  "쌀(20kg)","찹쌀","현미","보리","흑미","콩(메주콩)","팥","녹두","밀가루(중력분)","밀가루(강력분)","부침가루","튀김가루",
  // 과일 (15+)
  "사과","배","귤","오렌지","레몬","라임","바나나","딸기","포도","수박","참외","복숭아","자두","키위","망고",
  // 음료 (10+)
  "생수(2L)","탄산수","콜라","사이다","주스(오렌지)","주스(사과)","녹차(티백)","커피원두","에스프레소","얼음",
].map((name,i)=>{
  const cat=i<63?"채소":i<92?"육류":i<122?"수산":i<147?"양념":i<162?"건어물":i<177?"유제품":i<207?"가공식품":i<219?"곡류":i<234?"과일":"음료";
  const units=UNITS[cat];
  return{name,cat,unit:units[i%units.length]};
});

// 공급업체 50개
const SUPPLIERS=["마포도매 A","가락시장 B","직거래농가 C","축산도매 D","한돈마트 E","마포축산 F","계란도매 G","양념상회 H","풀무원직배 I","한우직거래 J","건어물상회 K","유제품도매 L","김치공장 M","마포김치 N","노량진수산 O","인천수산 P","서울식자재 Q","경기도매 R","충남농산 S","전남직송 T","부산수산 U","제주직송 V","횡성한우 W","이천쌀도매 X","광주김치 Y","대전도매 Z","춘천닭갈비 AA","속초수산 BB","양양버섯 CC","청주가공 DD","원주유기농 EE","공주밤도매 FF","해남고구마 GG","진주양념 HH","영덕대게 II","통영굴도매 JJ","밀양과일 KK","나주배도매 LL","성주참외 MM","고창수박 NN","담양떡 OO","보성녹차 PP","화순유기농 QQ","정읍고추 RR","강화젓갈 SS","파주두부 TT","양주버섯 UU","이천도자기쌀 VV","동해건어물 WW","울릉도오징어 XX"];

const REGIONS=["마포구","서대문구","은평구","종로구","용산구","성동구","광진구","동대문구","중랑구","성북구","강북구","도봉구","노원구","중구","강남구","서초구","송파구","강동구","양천구","강서구","구로구","금천구","영등포구","동작구","관악구"];

const DELIVERY_TIMES=["새벽4시","새벽5시","새벽6시","새벽7시","오전8시","오전9시","오전10시"];
const STATUSES=["배송완료","배송중","준비중","취소"];
const STATUS_W=[0.7,0.15,0.1,0.05];

const pick=arr=>arr[Math.floor(Math.random()*arr.length)];
const randInt=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const randPrice=(cat)=>{
  const base={"채소":randInt(1500,12000),"육류":randInt(8000,85000),"수산":randInt(5000,65000),"양념":randInt(2000,35000),"건어물":randInt(8000,45000),"유제품":randInt(3000,18000),"가공식품":randInt(2000,25000),"곡류":randInt(3000,55000),"과일":randInt(2000,15000),"음료":randInt(1500,8000),"반찬":randInt(5000,30000),"냉동":randInt(4000,25000)};
  return Math.round((base[cat]||5000)/100)*100;
};

// 식자재 500+ 품목 (공급사별 가격)
export const ITEMS=ITEMS_RAW.map((item,id)=>{
  const numSup=randInt(2,5);
  const sups=[];
  const usedIdx=new Set();
  for(let j=0;j<numSup;j++){
    let si;do{si=randInt(0,SUPPLIERS.length-1);}while(usedIdx.has(si));
    usedIdx.add(si);
    sups.push({
      name:SUPPLIERS[si],
      price:randPrice(item.cat),
      rating:Math.round((3.5+Math.random()*1.5)*10)/10,
      cold:["육류","수산","유제품","냉동"].includes(item.cat),
      delivery:pick(DELIVERY_TIMES),
    });
  }
  sups.sort((a,b)=>a.price-b.price);
  return{id:id+1,...item,suppliers:sups};
});

// 주문 이력 10,000건 생성
const CUST_NAMES=["정복순(잔치국수)","김순자(백반집)","박광호(단체급식)","이미경(분식)","최영수(중식)","박준혁(양식)","한소윤(카페)","윤지호(도시락)","강미영(떡볶이)","오성호(치킨)","장은정(김밥천국)","서민수(설렁탕)","노진우(냉면집)","유하늘(브런치)","임서연(비건식당)","홍재민(일식)","배소라(태국식)","조현우(감자탕)","문지영(베이커리)","권태호(곱창집)"];

export function generateOrders(count=10000){
  const orders=[];
  const now=new Date(2026,2,25);
  for(let i=0;i<count;i++){
    const d=new Date(now);d.setDate(d.getDate()-Math.floor(i/15));d.setHours(randInt(3,10),randInt(0,59));
    const numItems=randInt(2,8);
    const items=[];const usedItems=new Set();
    for(let j=0;j<numItems;j++){
      let it;do{it=pick(ITEMS);}while(usedItems.has(it.id));
      usedItems.add(it.id);
      const qty=randInt(1,5);
      items.push({name:it.name,qty,unit:it.unit,price:it.suppliers[0].price,bestPrice:it.suppliers[0].price,worstPrice:it.suppliers[it.suppliers.length-1].price});
    }
    const total=items.reduce((s,it)=>s+it.bestPrice*it.qty,0);
    const worstTotal=items.reduce((s,it)=>s+it.worstPrice*it.qty,0);
    const saving=worstTotal-total;
    const r=Math.random();const status=r<0.7?"배송완료":r<0.85?"배송중":r<0.95?"준비중":"취소";
    orders.push({
      id:`ORD-${String(count-i).padStart(5,"0")}`,
      date:`${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,"0")}.${String(d.getDate()).padStart(2,"0")}`,
      time:`${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`,
      customer:pick(CUST_NAMES),
      region:pick(REGIONS),
      items:items.map(it=>`${it.name} ${it.qty}${it.unit.split("(")[0]}`),
      itemDetails:items.map(it=>({name:it.name,qty:it.qty,unit:it.unit,price:it.bestPrice,total:it.bestPrice*it.qty,saving:Math.max(0,(it.worstPrice-it.bestPrice)*it.qty)})),
      itemCount:numItems,
      total,saving:Math.max(0,saving),
      status,
      delivery:pick(DELIVERY_TIMES),
      channel:pick(["전화","카톡","앱","앱","앱","카톡"]),
    });
  }
  return orders;
}

// 시세 이력 10,000건 생성 (품목별 일별 시세)
export function generatePriceHistory(count=10000){
  const history=[];
  const now=new Date(2026,2,25);
  for(let i=0;i<count;i++){
    const item=ITEMS[i%ITEMS.length];
    const dayOffset=Math.floor(i/ITEMS.length);
    const d=new Date(now);d.setDate(d.getDate()-dayOffset);
    const basePrice=item.suppliers[0].price;
    const fluctuation=Math.round(basePrice*(Math.random()*0.3-0.15)/100)*100;
    const price=basePrice+fluctuation;
    const prevPrice=basePrice+Math.round(basePrice*(Math.random()*0.3-0.15)/100)*100;
    const change=Math.round((price-prevPrice)/prevPrice*1000)/10;
    history.push({
      id:i+1,
      date:`${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,"0")}.${String(d.getDate()).padStart(2,"0")}`,
      item:item.name,
      cat:item.cat,
      unit:item.unit,
      minPrice:item.suppliers[0].price+fluctuation,
      maxPrice:item.suppliers[item.suppliers.length-1].price+fluctuation,
      avgPrice:Math.round((item.suppliers.reduce((s,sp)=>s+sp.price,0)/item.suppliers.length)+fluctuation),
      change,
      suppliers:item.suppliers.length,
      bestSupplier:item.suppliers[0].name,
    });
  }
  return history;
}

export const PERSONAS=[
  {name:"정복순",age:73,biz:"잔치국수집",channel:"전화",digital:1,emoji:"👵",arpu:54000,items:["대파","멸치(국물용)","양파","밀가루(중력분)","소금(천일염)"],region:"마포구 공덕동",desc:"매일 새벽 5시 기상, 전화로만 주문. 30년 단골 거래처가 있지만 가격 비교를 못 함."},
  {name:"윤지호",age:22,biz:"도시락/배달전문",channel:"앱",digital:5,emoji:"🧑‍💻",arpu:69000,items:["닭가슴살","쌀(20kg)","계란(대란)","양배추","당근","오이","김치(포기)","참기름"],region:"마포구 합정동",desc:"공유주방에서 배달 도시락 운영. 매일 JIT 소량 주문, 앱으로 즉시 비교."},
];

export const FC=n=>"₩"+Math.round(n).toLocaleString();
