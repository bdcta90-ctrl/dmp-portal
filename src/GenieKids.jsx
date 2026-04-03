import { useState, useEffect, useRef } from "react";

// ============================================================
// GenieKids MVP - 지니야~?(어린이용) AI 엔터테인먼트
// "차세대 핑크퐁/티니핑을 목표로"
// ============================================================

const TABS = [
  { id: "home", label: "홈", icon: "🏠" },
  { id: "library", label: "콘텐츠 라이브러리", icon: "📚" },
  { id: "voice", label: "음성 인터랙션", icon: "🎙️" },
  { id: "characters", label: "캐릭터 월드", icon: "🌟" },
  { id: "report", label: "성장 리포트", icon: "📊" },
  { id: "business", label: "IP/비즈니스", icon: "💼" },
];

const COLORS = {
  pink: "#FF6B9D",
  purple: "#C084FC",
  blue: "#38BDF8",
  green: "#34D399",
  yellow: "#FBBF24",
  orange: "#FB923C",
  bg: "#F8FAFC",
  white: "#FFFFFF",
  textDark: "#1E293B",
  textMid: "#475569",
  textLight: "#94A3B8",
};

const CATEGORIES = [
  { id: "song", icon: "🎵", name: "동요/음악", count: 147, unit: "곡", desc: "지니와 함께 노래해요", color: COLORS.pink, ages: ["3-5세", "5-7세", "7-9세"], stars: 4.9, items: [
    { title: "반짝반짝 작은 별", age: "3-5세", duration: "2:30", pop: 98 },
    { title: "상어가족 (지니 버전)", age: "3-5세", duration: "3:15", pop: 97 },
    { title: "곰 세 마리", age: "3-5세", duration: "2:10", pop: 95 },
    { title: "지니의 아침 체조송", age: "5-7세", duration: "3:45", pop: 92 },
    { title: "알파벳 랩", age: "5-7세", duration: "4:00", pop: 90 },
    { title: "구구단 노래", age: "7-9세", duration: "3:30", pop: 88 },
  ]},
  { id: "story", icon: "📖", name: "동화/스토리", count: 283, unit: "편", desc: "지니가 들려주는 이야기", color: COLORS.purple, ages: ["3-5세", "5-7세", "7-9세"], stars: 4.8, items: [
    { title: "잠자는 숲속의 공주", age: "3-5세", duration: "8:20", pop: 96 },
    { title: "지니의 우주 모험", age: "5-7세", duration: "12:00", pop: 94 },
    { title: "용감한 기사 이야기", age: "5-7세", duration: "10:30", pop: 91 },
    { title: "해저 2만리 (어린이판)", age: "7-9세", duration: "15:00", pop: 89 },
    { title: "지니와 마법의 숲", age: "3-5세", duration: "7:45", pop: 93 },
  ]},
  { id: "game", icon: "🎮", name: "놀이/게임", count: 95, unit: "개", desc: "지니랑 놀자!", color: COLORS.green, ages: ["3-5세", "5-7세", "7-9세"], stars: 4.7, items: [
    { title: "끝말잇기", age: "5-7세", duration: "무제한", pop: 97 },
    { title: "동물 소리 맞추기", age: "3-5세", duration: "5분", pop: 95 },
    { title: "스무고개", age: "7-9세", duration: "무제한", pop: 92 },
    { title: "숫자 빙고", age: "5-7세", duration: "10분", pop: 90 },
    { title: "색깔 퀴즈", age: "3-5세", duration: "5분", pop: 88 },
  ]},
  { id: "learn", icon: "📚", name: "학습", count: 312, unit: "개", desc: "지니와 공부해요", color: COLORS.blue, ages: ["3-5세", "5-7세", "7-9세"], stars: 4.8, subcategories: ["한글", "영어", "수학", "과학"], items: [
    { title: "ㄱㄴㄷ 한글놀이", age: "3-5세", duration: "10분", pop: 96 },
    { title: "ABC 알파벳 여행", age: "5-7세", duration: "8분", pop: 94 },
    { title: "1+1=? 덧셈 첫걸음", age: "5-7세", duration: "7분", pop: 92 },
    { title: "왜 하늘은 파란색?", age: "7-9세", duration: "12분", pop: 90 },
    { title: "구구단 마스터", age: "7-9세", duration: "15분", pop: 88 },
  ]},
  { id: "sleep", icon: "🌙", name: "수면/자장가", count: 64, unit: "곡", desc: "잘자, 지니가 옆에 있어", color: "#8B5CF6", ages: ["3-5세", "5-7세"], stars: 4.9, items: [
    { title: "자장자장 우리 아가", age: "3-5세", duration: "5:00", pop: 98 },
    { title: "별빛 자장가", age: "3-5세", duration: "4:30", pop: 96 },
    { title: "숲속의 자장가", age: "3-5세", duration: "6:00", pop: 94 },
    { title: "비 오는 날 자장가", age: "5-7세", duration: "5:30", pop: 92 },
  ]},
  { id: "roleplay", icon: "🎭", name: "역할놀이", count: 48, unit: "개", desc: "지니야, 오늘은 뭐 하고 놀까?", color: COLORS.orange, ages: ["3-5세", "5-7세", "7-9세"], stars: 4.6, items: [
    { title: "소방관 놀이", age: "3-5세", duration: "무제한", pop: 95 },
    { title: "우주비행사 모험", age: "5-7세", duration: "무제한", pop: 93 },
    { title: "요리사 체험", age: "5-7세", duration: "무제한", pop: 91 },
    { title: "수의사 놀이", age: "3-5세", duration: "무제한", pop: 89 },
  ]},
];

const CHARACTERS = [
  { name: "지니", emoji: "🪄", role: "메인 AI 친구", color: COLORS.yellow, desc: "안녕! 나는 지니야! 뭐든지 물어봐~ 노래도 하고, 이야기도 들려주고, 같이 놀 수도 있어!", personality: "밝고 다정함, 호기심 많음", sample: "\"지니야~\" → \"응! 부를 때마다 설레! 오늘은 뭐 하고 놀까?\"", anim: { move: "bounce", speed: 1.2 } },
  { name: "별이", emoji: "🌟", role: "음악 담당", color: COLORS.pink, desc: "음악의 요정 별이야! 노래하고 춤추는 걸 제일 좋아해. 같이 노래할래?", personality: "활발하고 리듬감 넘침", sample: "\"별이야, 노래해줘\" → \"랄랄라~ 어떤 노래가 듣고 싶어?\"", anim: { move: "dance", speed: 0.8 } },
  { name: "달이", emoji: "🌙", role: "수면/자장가", color: "#8B5CF6", desc: "조용한 밤의 친구 달이야. 포근한 자장가로 꿈나라에 데려다줄게~", personality: "차분하고 포근함", sample: "\"달이야, 잘 자\" → \"오늘도 수고했어~ 포근한 자장가 들려줄게...\"", anim: { move: "sway", speed: 2.5 } },
  { name: "해나", emoji: "☀️", role: "학습 도우미", color: COLORS.orange, desc: "똑똑한 해나야! 한글, 영어, 수학, 과학 뭐든지 재미있게 가르쳐줄게!", personality: "똑똑하고 인내심 강함", sample: "\"해나야, 공부하자\" → \"좋아! 오늘은 뭘 배워볼까? 퀴즈도 준비했어!\"", anim: { move: "spin", speed: 3 } },
  { name: "구름이", emoji: "☁️", role: "동화 스토리텔러", color: COLORS.blue, desc: "이야기보따리 구름이야~ 세상에서 제일 재밌는 이야기 들려줄게!", personality: "상상력 풍부, 이야기꾼", sample: "\"구름이야, 이야기 해줘\" → \"옛날 옛적에~ 아주 먼 나라에...\"", anim: { move: "float", speed: 2 } },
  { name: "무지", emoji: "🌈", role: "놀이/게임", color: COLORS.green, desc: "놀이왕 무지! 끝말잇기, 퀴즈, 숨바꼭질... 뭐든 재미있게 놀 수 있어!", personality: "장난꾸러기, 에너지 넘침", sample: "\"무지야, 놀자\" → \"신난다! 오늘은 어떤 게임 할까? 끝말잇기? 퀴즈?\"", anim: { move: "jump", speed: 0.6 } },
  { name: "나라", emoji: "🌳", role: "자연/과학", color: "#059669", desc: "자연을 사랑하는 나라야. 동물, 식물, 우주... 신기한 것 많이 알려줄게!", personality: "차분하고 지혜로움", sample: "\"나라야, 공룡 알려줘\" → \"공룡은 아주 오래전에 살았어~ 티라노사우루스는...\"", anim: { move: "grow", speed: 2 } },
  { name: "하늘이", emoji: "🦋", role: "감정/사회성", color: "#EC4899", desc: "마음을 돌보는 하늘이야. 기쁠 때, 슬플 때 언제든 이야기해줘~", personality: "공감 능력 뛰어남, 따뜻함", sample: "\"하늘이야, 기분이 안 좋아\" → \"괜찮아, 이야기해줄래? 내가 들어줄게~\"", anim: { move: "flutter", speed: 1.5 } },
];

const VOICE_EXAMPLES = [
  { command: "지니야, 노래 틀어줘", response: "좋아! 오늘 인기 있는 '상어가족' 틀어줄까? 아니면 다른 노래?", icon: "🎵", category: "음악" },
  { command: "지니야, 공룡 이야기 해줘", response: "공룡 이야기! 좋아~ 옛날 옛적, 아주 큰 공룡이 살았는데...", icon: "🦕", category: "동화" },
  { command: "지니야, 숫자 퀴즈!", response: "퀴즈 타임! 준비됐어? 자, 3 더하기 2는 뭘까~?", icon: "🔢", category: "학습" },
  { command: "지니야, 잘 자", response: "잘 자~ 포근한 자장가 들려줄게. 좋은 꿈 꿔, 내일 또 만나!", icon: "🌙", category: "수면" },
  { command: "지니야, 끝말잇기 하자", response: "좋아! 내가 먼저 시작할게~ '사과'! 자, 너 차례야!", icon: "🎮", category: "놀이" },
  { command: "지니야, 오늘 날씨 어때?", response: "밖을 봐봐! 오늘은 해가 쨍쨍~ 놀러가기 딱 좋은 날이야!", icon: "☀️", category: "일상" },
  { command: "지니야, 영어로 사과가 뭐야?", response: "사과는 영어로 'Apple'이야! A-P-P-L-E! 같이 따라해볼래?", icon: "📚", category: "학습" },
  { command: "지니야, 심심해", response: "심심해? 그럼 재미있는 거 해볼까? 수수께끼, 노래, 이야기 뭐가 좋아?", icon: "🎭", category: "놀이" },
];

const PARENTAL_CONTROLS = [
  { label: "일일 이용시간 제한", value: "30분/60분/90분", icon: "⏰" },
  { label: "이용 가능 시간대", value: "오전 8시 ~ 오후 8시", icon: "🕐" },
  { label: "콘텐츠 연령 필터", value: "3-5세 / 5-7세 / 7-9세", icon: "👶" },
  { label: "학습/놀이 비율 설정", value: "학습 40% / 놀이 60%", icon: "📊" },
  { label: "사용 리포트 발송", value: "매주 월요일 오전 9시", icon: "📧" },
  { label: "긴급 종료 음성명령", value: "\"지니야, 그만\"", icon: "🔴" },
];

const GROWTH_SKILLS = [
  { name: "언어발달", value: 87, color: COLORS.pink, icon: "💬", detail: "새 단어 23개 학습, 문장 구성력 향상" },
  { name: "수리능력", value: 72, color: COLORS.blue, icon: "🔢", detail: "덧셈/뺄셈 정확도 85%, 구구단 3단까지" },
  { name: "창의성", value: 91, color: COLORS.purple, icon: "🎨", detail: "역할놀이 참여 활발, 새로운 이야기 구성" },
  { name: "사회성", value: 68, color: COLORS.green, icon: "🤝", detail: "감정 표현 향상, 예의바른 대화 습관" },
  { name: "음악감각", value: 83, color: COLORS.yellow, icon: "🎵", detail: "리듬감 발달, 10곡 이상 가사 기억" },
];

const WEEKLY_HIGHLIGHTS = [
  { icon: "🏆", text: "이번 주 '구구단 3단' 완벽 마스터!" },
  { icon: "📖", text: "'지니의 우주 모험' 시리즈 3편 완독" },
  { icon: "🎵", text: "새로운 동요 5곡 따라 부르기 성공" },
  { icon: "💡", text: "과학 퀴즈에서 연속 8문제 정답!" },
];

const RECOMMENDED = [
  { icon: "📚", title: "한글 받침 학습", reason: "언어발달 다음 단계로 추천" },
  { icon: "🔢", title: "구구단 4단 도전", reason: "3단 마스터 후 자연스러운 진행" },
  { icon: "🎭", title: "감정 표현 역할놀이", reason: "사회성 발달에 도움" },
];

const REVENUE_STREAMS = [
  { name: "프리미엄 구독", icon: "💎", revenue: "월 9,900원/가구", desc: "기본 무료 + 프리미엄 콘텐츠 구독", share: 45 },
  { name: "캐릭터 상품", icon: "🧸", revenue: "연 150억원 목표", desc: "인형, 문구, 의류 등 캐릭터 MD", share: 25 },
  { name: "교육기관 제휴", icon: "🏫", revenue: "기관당 월 50만원", desc: "유치원/어린이집 단체 라이선스", share: 15 },
  { name: "콘텐츠 라이선싱", icon: "📺", revenue: "편당 500만원~", desc: "방송사/OTT 콘텐츠 공급", share: 15 },
];

const COMPETITORS = [
  { name: "핑크퐁/아기상어", strength: "글로벌 인지도, 유튜브 70억뷰", weakness: "틀어놓는 일방향 영상. 대화·상호작용 제로", color: "#FF6B6B" },
  { name: "티니핑", strength: "캐릭터 IP 파워, 상품 매출 1조", weakness: "영상 콘텐츠 소비만. 아이의 성장 트래킹 불가", color: "#FF9CE3" },
  { name: "지니 키즈 (우리)", strength: "유일한 양방향 음성 대화. 400만 기가지니 즉시 탑재. 성장 리포트", weakness: "신규 IP — 하지만 기기는 이미 거실에 있음", color: COLORS.yellow },
];

const ROADMAP = [
  { phase: "Phase 1", period: "2026 Q2-Q4", title: "MVP 론칭", items: ["KT 기가지니 탑재", "핵심 콘텐츠 500개", "캐릭터 8종 론칭", "베타 테스트 1만 가구"], color: COLORS.blue },
  { phase: "Phase 2", period: "2027 Q1-Q4", title: "성장/확장", items: ["콘텐츠 2,000개 확대", "캐릭터 상품 출시", "유치원 300개소 제휴", "MAU 50만 달성"], color: COLORS.green },
  { phase: "Phase 3", period: "2028~", title: "IP 비즈니스", items: ["애니메이션 시리즈 제작", "글로벌 시장 진출", "테마파크 제휴", "연 매출 500억 목표"], color: COLORS.purple },
];

// ============================================================
// Sub-Components
// ============================================================

function StatCard({ icon, label, value, color }) {
  return (
    <div style={{ background: COLORS.white, borderRadius: 16, padding: "20px 16px", textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: `2px solid ${color}22`, flex: "1 1 200px", minWidth: 160 }}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 24, fontWeight: 800, color: color }}>{value}</div>
      <div style={{ fontSize: 13, color: COLORS.textMid, marginTop: 4 }}>{label}</div>
    </div>
  );
}

function CategoryCard({ cat, onClick }) {
  return (
    <div onClick={onClick} style={{ background: COLORS.white, borderRadius: 20, padding: 24, boxShadow: "0 4px 16px rgba(0,0,0,0.07)", cursor: "pointer", border: `2px solid ${cat.color}33`, transition: "all 0.2s", position: "relative", overflow: "hidden" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${cat.color}33`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.07)"; }}
    >
      <div style={{ position: "absolute", top: -20, right: -20, fontSize: 80, opacity: 0.08 }}>{cat.icon}</div>
      <div style={{ fontSize: 40, marginBottom: 12 }}>{cat.icon}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.textDark, marginBottom: 4 }}>{cat.name}</div>
      <div style={{ fontSize: 13, color: COLORS.textMid, marginBottom: 12 }}>{cat.desc}</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
        <span style={{ background: `${cat.color}18`, color: cat.color, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{cat.count}{cat.unit}</span>
        {cat.ages.map(a => <span key={a} style={{ background: "#F1F5F9", color: COLORS.textMid, padding: "3px 8px", borderRadius: 20, fontSize: 11 }}>{a}</span>)}
      </div>
      <div style={{ fontSize: 14, color: COLORS.yellow }}>{"★".repeat(Math.floor(cat.stars))} <span style={{ color: COLORS.textLight, fontSize: 12 }}>{cat.stars}</span></div>
    </div>
  );
}

function ProgressBar({ value, color, height = 12 }) {
  return (
    <div style={{ width: "100%", background: "#F1F5F9", borderRadius: height, height, overflow: "hidden" }}>
      <div style={{ width: `${value}%`, background: `linear-gradient(90deg, ${color}, ${color}CC)`, height: "100%", borderRadius: height, transition: "width 1s ease" }} />
    </div>
  );
}

function RadarChart({ skills }) {
  const size = 220;
  const center = size / 2;
  const maxR = 85;
  const n = skills.length;
  const angleStep = (2 * Math.PI) / n;

  const getPoint = (i, r) => {
    const angle = -Math.PI / 2 + i * angleStep;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  };

  const gridLevels = [0.25, 0.5, 0.75, 1.0];
  const dataPoints = skills.map((s, i) => getPoint(i, (s.value / 100) * maxR));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + "Z";

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block", margin: "0 auto" }}>
      {gridLevels.map(level => {
        const points = Array.from({ length: n }, (_, i) => getPoint(i, maxR * level));
        const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + "Z";
        return <path key={level} d={path} fill="none" stroke="#E2E8F0" strokeWidth={1} />;
      })}
      {skills.map((_, i) => {
        const p = getPoint(i, maxR);
        return <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} stroke="#E2E8F0" strokeWidth={1} />;
      })}
      <path d={dataPath} fill={`${COLORS.pink}33`} stroke={COLORS.pink} strokeWidth={2.5} />
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4} fill={skills[i].color} stroke="#fff" strokeWidth={2} />
      ))}
      {skills.map((s, i) => {
        const p = getPoint(i, maxR + 22);
        return <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" fontSize={11} fill={COLORS.textMid} fontWeight={600}>{s.icon} {s.name}</text>;
      })}
    </svg>
  );
}

// ============================================================
// Main Component
// ============================================================

export default function GenieKidsMVP({ onBack }) {
  const [tab, setTab] = useState("home");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [voiceStep, setVoiceStep] = useState(0); // 0=idle, 1=listening, 2=responding
  const [voiceText, setVoiceText] = useState("");
  const [floatingEmojis, setFloatingEmojis] = useState([]);
  const timerRef = useRef(null);

  // Floating emoji effect for home
  useEffect(() => {
    if (tab !== "home") return;
    const emojis = ["🌟", "🎵", "🦄", "🌈", "⭐", "🎀", "🦋", "🌸", "💫", "🎶"];
    const interval = setInterval(() => {
      setFloatingEmojis(prev => {
        const next = [...prev, { id: Date.now(), emoji: emojis[Math.floor(Math.random() * emojis.length)], left: Math.random() * 90 + 5, duration: 3 + Math.random() * 3 }];
        return next.slice(-8);
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [tab]);

  // Voice interaction simulation
  const simulateVoice = (example) => {
    setVoiceStep(1);
    setVoiceText(example.command);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setVoiceStep(2);
      setVoiceText(example.response);
      timerRef.current = setTimeout(() => { setVoiceStep(0); setVoiceText(""); }, 4000);
    }, 2000);
  };

  useEffect(() => () => clearTimeout(timerRef.current), []);

  // ============================================================
  // STYLE HELPERS
  // ============================================================
  const cardStyle = { background: COLORS.white, borderRadius: 20, padding: 24, boxShadow: "0 4px 16px rgba(0,0,0,0.06)" };
  const sectionTitle = (text, icon) => (
    <h2 style={{ fontSize: 22, fontWeight: 800, color: COLORS.textDark, margin: "32px 0 16px", display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 28 }}>{icon}</span> {text}
    </h2>
  );

  // ============================================================
  // TAB RENDERERS
  // ============================================================

  const renderHome = () => (
    <div>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #FFF1F5, #F0E6FF, #E0F2FE, #ECFDF5)", borderRadius: 24, padding: "48px 32px", textAlign: "center", position: "relative", overflow: "hidden", marginBottom: 24 }}>
        {/* Floating emojis */}
        {floatingEmojis.map(e => (
          <span key={e.id} style={{ position: "absolute", left: `${e.left}%`, bottom: -30, fontSize: 24, animation: `floatUp ${e.duration}s ease-out forwards`, pointerEvents: "none", opacity: 0.7 }}>
            {e.emoji}
          </span>
        ))}
        <div style={{ fontSize: 64, marginBottom: 16 }}>🪄</div>
        <h1 style={{ fontSize: 36, fontWeight: 900, background: `linear-gradient(135deg, ${COLORS.pink}, ${COLORS.purple}, ${COLORS.blue})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 8 }}>
          안녕, 나는 지니야!
        </h1>
        <p style={{ fontSize: 18, color: COLORS.textMid, marginBottom: 4 }}>부모는 TV·날씨만 묻지만, 아이는 "지니야~" 그 자체에 반응합니다</p>
        <p style={{ fontSize: 14, color: COLORS.textLight }}>핑크퐁은 틀어놓는 것. 지니 키즈는 대화하는 것. 쌍방향 음성 AI 키즈 콘텐츠 플랫폼</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24, flexWrap: "wrap" }}>
          {["🎵 노래", "📖 동화", "🎮 놀이", "📚 학습", "🌙 자장가"].map(t => (
            <span key={t} style={{ background: "rgba(255,255,255,0.8)", padding: "8px 18px", borderRadius: 30, fontSize: 14, fontWeight: 600, color: COLORS.textDark, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 32 }}>
        <StatCard icon="📡" label="기가지니 설치" value="400만+" color={COLORS.blue} />
        <StatCard icon="📦" label="런칭 콘텐츠" value="949개" color={COLORS.pink} />
        <StatCard icon="🪄" label="캐릭터 IP" value="8명" color={COLORS.green} />
        <StatCard icon="💰" label="구독 요금" value="월 9,900원" color={COLORS.purple} />
      </div>

      {/* Quick Access */}
      {sectionTitle("콘텐츠 바로가기", "🚀")}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {CATEGORIES.map(cat => (
          <CategoryCard key={cat.id} cat={cat} onClick={() => { setTab("library"); setSelectedCategory(cat.id); }} />
        ))}
      </div>

      {/* Character Preview */}
      {sectionTitle("지니 친구들을 소개할게!", "🌟")}
      <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }}>
        {CHARACTERS.slice(0, 5).map(ch => (
          <div key={ch.name} onClick={() => setTab("characters")} style={{ ...cardStyle, minWidth: 140, textAlign: "center", cursor: "pointer", border: `2px solid ${ch.color}22`, flex: "0 0 auto" }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>{ch.emoji}</div>
            <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.textDark }}>{ch.name}</div>
            <div style={{ fontSize: 11, color: COLORS.textMid }}>{ch.role}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const detailRef = useRef(null);
  const renderLibrary = () => (
    <div>
      {sectionTitle("콘텐츠 라이브러리", "📚")}
      <p style={{ color: COLORS.textMid, fontSize: 14, marginBottom: 20 }}>카테고리를 클릭하면 세부 콘텐츠 목록을 볼 수 있어요!</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20, marginBottom: 32 }}>
        {CATEGORIES.map(cat => (
          <div key={cat.id} onClick={() => { setSelectedCategory(selectedCategory === cat.id ? null : cat.id); setTimeout(() => detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100); }}
            style={{ background: COLORS.white, borderRadius: 20, padding: 24, boxShadow: selectedCategory === cat.id ? `0 8px 32px ${cat.color}44` : "0 4px 16px rgba(0,0,0,0.07)", cursor: "pointer", border: selectedCategory === cat.id ? `3px solid ${cat.color}` : `2px solid ${cat.color}33`, transition: "all 0.2s", position: "relative", overflow: "hidden", transform: selectedCategory === cat.id ? "scale(1.02)" : "scale(1)" }}>
            <div style={{ position: "absolute", top: -20, right: -20, fontSize: 80, opacity: 0.08 }}>{cat.icon}</div>
            <div style={{ fontSize: 40, marginBottom: 12 }}>{cat.icon}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.textDark, marginBottom: 4 }}>{cat.name}</div>
            <div style={{ fontSize: 13, color: COLORS.textMid, marginBottom: 12 }}>{cat.desc}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
              <span style={{ background: `${cat.color}18`, color: cat.color, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{cat.count}{cat.unit}</span>
              {cat.ages.map(a => <span key={a} style={{ background: "#F1F5F9", color: COLORS.textMid, padding: "3px 8px", borderRadius: 20, fontSize: 11 }}>{a}</span>)}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 14, color: COLORS.yellow }}>{"★".repeat(Math.floor(cat.stars))} <span style={{ color: COLORS.textLight, fontSize: 12 }}>{cat.stars}</span></div>
              <span style={{ fontSize: 12, color: selectedCategory === cat.id ? cat.color : COLORS.textLight, fontWeight: 600 }}>{selectedCategory === cat.id ? "▲ 접기" : "▼ 세부 보기"}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedCategory && (() => {
        const cat = CATEGORIES.find(c => c.id === selectedCategory);
        if (!cat) return null;
        return (
          <div ref={detailRef} style={{ ...cardStyle, border: `3px solid ${cat.color}55`, marginBottom: 24, animation: "fadeIn 0.3s ease" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 32 }}>{cat.icon}</span>
                <div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: COLORS.textDark, margin: 0 }}>{cat.name}</h3>
                  <p style={{ fontSize: 13, color: COLORS.textMid, margin: 0 }}>{cat.desc} - 총 {cat.count}{cat.unit}</p>
                </div>
              </div>
              <button onClick={() => setSelectedCategory(null)} style={{ background: `${cat.color}15`, border: `1px solid ${cat.color}33`, color: cat.color, padding: "6px 14px", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>✕ 닫기</button>
            </div>
            {cat.subcategories && (
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                {cat.subcategories.map(sub => (
                  <span key={sub} style={{ background: `${cat.color}15`, color: cat.color, padding: "4px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600 }}>{sub}</span>
                ))}
              </div>
            )}
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 6px" }}>
              <thead>
                <tr style={{ color: COLORS.textLight, fontSize: 12 }}>
                  <th style={{ textAlign: "left", padding: "4px 8px" }}>제목</th>
                  <th style={{ textAlign: "center", padding: "4px 8px" }}>연령</th>
                  <th style={{ textAlign: "center", padding: "4px 8px" }}>길이</th>
                  <th style={{ textAlign: "center", padding: "4px 8px" }}>인기도</th>
                </tr>
              </thead>
              <tbody>
                {cat.items.map((item, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "#FAFBFC" : COLORS.white, borderRadius: 8 }}>
                    <td style={{ padding: "10px 8px", fontWeight: 600, fontSize: 14, color: COLORS.textDark }}>{cat.icon} {item.title}</td>
                    <td style={{ textAlign: "center", padding: "10px 8px" }}><span style={{ background: `${cat.color}15`, color: cat.color, padding: "2px 10px", borderRadius: 12, fontSize: 12 }}>{item.age}</span></td>
                    <td style={{ textAlign: "center", padding: "10px 8px", fontSize: 13, color: COLORS.textMid }}>{item.duration}</td>
                    <td style={{ textAlign: "center", padding: "10px 8px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                        <div style={{ width: 60, height: 6, background: "#F1F5F9", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ width: `${item.pop}%`, height: "100%", background: cat.color, borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: 11, color: COLORS.textLight }}>{item.pop}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ textAlign: "center", padding: "16px 0 4px", color: COLORS.textLight, fontSize: 13 }}>
              샘플 {cat.items.length}개 표시 중 · 전체 {cat.count}{cat.unit}
            </div>
          </div>
        );
      })()}
    </div>
  );

  const renderVoice = () => (
    <div>
      {sectionTitle("음성 인터랙션 데모", "🎙️")}

      {/* Voice Simulation Area */}
      <div style={{ ...cardStyle, textAlign: "center", marginBottom: 32, border: `2px solid ${voiceStep === 1 ? COLORS.blue : voiceStep === 2 ? COLORS.green : "#E2E8F0"}`, background: voiceStep === 0 ? COLORS.white : voiceStep === 1 ? "#EFF6FF" : "#F0FDF4", transition: "all 0.3s" }}>
        <div style={{ fontSize: 64, marginBottom: 16, animation: voiceStep === 1 ? "pulse 1s infinite" : "none" }}>
          {voiceStep === 0 ? "⭐" : voiceStep === 1 ? "👂" : "💬"}
        </div>
        <h3 style={{ fontSize: 22, fontWeight: 800, color: voiceStep === 0 ? COLORS.textDark : voiceStep === 1 ? COLORS.blue : COLORS.green, marginBottom: 8 }}>
          {voiceStep === 0 ? "\"지니야~\" 하고 불러보세요!" : voiceStep === 1 ? "듣고 있어요..." : "지니가 대답해요!"}
        </h3>
        {voiceText && (
          <div style={{ background: voiceStep === 1 ? "#DBEAFE" : "#DCFCE7", padding: "16px 24px", borderRadius: 16, display: "inline-block", fontSize: 16, fontWeight: 600, color: COLORS.textDark, maxWidth: 500 }}>
            {voiceStep === 1 ? `🗣️ "${voiceText}"` : `⭐ "${voiceText}"`}
          </div>
        )}
        {voiceStep === 0 && <p style={{ fontSize: 14, color: COLORS.textLight, marginTop: 8 }}>아래 예시를 클릭하면 인터랙션을 체험할 수 있어요</p>}
      </div>

      {/* Example Conversations */}
      {sectionTitle("대화 예시", "💬")}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16, marginBottom: 32 }}>
        {VOICE_EXAMPLES.map((ex, i) => (
          <div key={i} onClick={() => simulateVoice(ex)} style={{ ...cardStyle, cursor: "pointer", border: "2px solid #F1F5F9", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.blue; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#F1F5F9"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <span style={{ fontSize: 28 }}>{ex.icon}</span>
              <span style={{ background: `${COLORS.blue}15`, color: COLORS.blue, padding: "2px 10px", borderRadius: 12, fontSize: 11, fontWeight: 600 }}>{ex.category}</span>
            </div>
            <div style={{ background: "#EFF6FF", padding: "10px 14px", borderRadius: "16px 16px 16px 4px", fontSize: 14, fontWeight: 600, color: COLORS.textDark, marginBottom: 8 }}>
              🗣️ {ex.command}
            </div>
            <div style={{ background: "#F0FDF4", padding: "10px 14px", borderRadius: "16px 16px 4px 16px", fontSize: 14, color: COLORS.textDark }}>
              ⭐ {ex.response}
            </div>
          </div>
        ))}
      </div>

      {/* Parental Controls */}
      {sectionTitle("학부모 안심 설정", "🔒")}
      <div style={{ ...cardStyle }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {PARENTAL_CONTROLS.map((pc, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, background: "#FAFBFC", borderRadius: 12 }}>
              <span style={{ fontSize: 28 }}>{pc.icon}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.textDark }}>{pc.label}</div>
                <div style={{ fontSize: 12, color: COLORS.textMid }}>{pc.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCharacters = () => (
    <div>
      {sectionTitle("캐릭터 월드", "🌟")}
      <p style={{ color: COLORS.textMid, fontSize: 15, marginBottom: 24 }}>지니와 친구들을 만나보세요! 각 캐릭터가 특별한 재능으로 아이들과 함께합니다.</p>

      {/* 4D 캐릭터 스테이지 */}
      <style>{`
        @keyframes gk-bounce { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-18px) scale(1.08); } }
        @keyframes gk-dance { 0% { transform: rotate(-8deg) scale(1); } 25% { transform: rotate(8deg) scale(1.1); } 50% { transform: rotate(-5deg) scale(1.05); } 75% { transform: rotate(6deg) scale(1.08); } 100% { transform: rotate(-8deg) scale(1); } }
        @keyframes gk-sway { 0%,100% { transform: translateX(0) rotate(0deg); } 50% { transform: translateX(10px) rotate(5deg); } }
        @keyframes gk-spin { 0% { transform: rotateY(0deg); } 100% { transform: rotateY(360deg); } }
        @keyframes gk-float { 0%,100% { transform: translateY(0) translateX(0); } 33% { transform: translateY(-12px) translateX(8px); } 66% { transform: translateY(-6px) translateX(-8px); } }
        @keyframes gk-jump { 0%,100% { transform: translateY(0) scaleY(1); } 15% { transform: translateY(0) scaleY(0.85) scaleX(1.12); } 40% { transform: translateY(-28px) scaleY(1.1) scaleX(0.95); } 60% { transform: translateY(-28px) scaleY(1.05); } 80% { transform: translateY(0) scaleY(0.9) scaleX(1.08); } }
        @keyframes gk-grow { 0%,100% { transform: scale(1); } 50% { transform: scale(1.15); } }
        @keyframes gk-flutter { 0%,100% { transform: translateY(0) rotate(0deg) scale(1); } 25% { transform: translateY(-10px) rotate(5deg) scale(1.05); } 50% { transform: translateY(-5px) rotate(-3deg) scale(1.02); } 75% { transform: translateY(-12px) rotate(4deg) scale(1.06); } }
        @keyframes gk-sparkle { 0%,100% { opacity: 0.3; transform: scale(0.5); } 50% { opacity: 1; transform: scale(1.2); } }
        @keyframes gk-stage-glow { 0%,100% { box-shadow: 0 0 40px rgba(255,107,157,0.15), 0 0 80px rgba(192,132,252,0.1); } 50% { box-shadow: 0 0 60px rgba(255,107,157,0.25), 0 0 120px rgba(56,189,248,0.15); } }
        .gk-char:hover { transform: scale(1.3) !important; z-index: 10 !important; filter: drop-shadow(0 0 20px currentColor); }
      `}</style>
      <div style={{ background: "linear-gradient(180deg, #1a103a 0%, #0f0a2a 40%, #15252a 70%, #1a3a25 100%)", borderRadius: 24, padding: "40px 20px 30px", marginBottom: 32, position: "relative", overflow: "hidden", animation: "gk-stage-glow 4s ease infinite", perspective: "800px" }}>
        {/* Stars background */}
        {Array.from({length: 30}).map((_, i) => (
          <div key={i} style={{ position: "absolute", width: 3 + Math.random() * 4, height: 3 + Math.random() * 4, borderRadius: "50%", background: "#fff", top: Math.random() * 50 + "%", left: Math.random() * 100 + "%", opacity: 0.3 + Math.random() * 0.5, animation: `gk-sparkle ${1.5 + Math.random() * 2}s ease ${Math.random() * 2}s infinite` }} />
        ))}
        {/* Moon */}
        <div style={{ position: "absolute", top: 20, right: 60, width: 50, height: 50, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #fef3c7, #fbbf24)", boxShadow: "0 0 30px rgba(251,191,36,0.3)", animation: "gk-sway 6s ease infinite" }} />
        {/* Ground */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 60, background: "linear-gradient(180deg, transparent, rgba(34,197,94,0.2) 40%, rgba(34,197,94,0.35))", borderRadius: "0 0 24px 24px" }} />
        {/* Stage title */}
        <div style={{ textAlign: "center", marginBottom: 24, position: "relative" }}>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", letterSpacing: 3, fontWeight: 600, marginBottom: 4 }}>4D INTERACTIVE STAGE</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", textShadow: "0 0 20px rgba(192,132,252,0.5)" }}>지니와 친구들의 무대</div>
        </div>
        {/* Characters on stage - 3D perspective */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 8, minHeight: 160, position: "relative", transformStyle: "preserve-3d" }}>
          {CHARACTERS.map((ch, i) => {
            const animName = `gk-${ch.anim?.move || "bounce"}`;
            const animSpeed = ch.anim?.speed || 1.5;
            const yOffset = i === 0 ? 0 : (i % 2 === 0 ? 10 : -5);
            return (
              <div key={ch.name} className="gk-char" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer", transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)", position: "relative", bottom: yOffset, color: ch.color }}>
                <div style={{ fontSize: 52, animation: `${animName} ${animSpeed}s ease-in-out infinite`, transformOrigin: "center bottom", filter: `drop-shadow(0 4px 12px ${ch.color}66)` }}>
                  {ch.emoji}
                </div>
                <div style={{ background: `${ch.color}cc`, color: "#fff", padding: "2px 10px", borderRadius: 10, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap", boxShadow: `0 2px 10px ${ch.color}44` }}>
                  {ch.name}
                </div>
                <div style={{ width: 40, height: 8, borderRadius: "50%", background: "rgba(0,0,0,0.25)", filter: "blur(3px)", marginTop: -2 }} />
              </div>
            );
          })}
        </div>
        <div style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "rgba(255,255,255,0.4)" }}>캐릭터 위에 마우스를 올려보세요!</div>
      </div>

      {/* 캐릭터 카드 그리드 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
        {CHARACTERS.map((ch, i) => (
          <div key={ch.name} style={{ ...cardStyle, border: `2px solid ${ch.color}33`, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -30, right: -30, fontSize: 100, opacity: 0.06 }}>{ch.emoji}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: `${ch.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, border: `3px solid ${ch.color}44` }}>
                {ch.emoji}
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: COLORS.textDark }}>{ch.name} {i === 0 && <span style={{ background: `linear-gradient(135deg, ${COLORS.yellow}, ${COLORS.orange})`, color: "#fff", padding: "2px 10px", borderRadius: 10, fontSize: 11, fontWeight: 700, marginLeft: 6 }}>MAIN</span>}</h3>
                <span style={{ fontSize: 13, color: ch.color, fontWeight: 600 }}>{ch.role}</span>
              </div>
            </div>
            <p style={{ fontSize: 14, color: COLORS.textDark, lineHeight: 1.6, marginBottom: 12 }}>{ch.desc}</p>
            <div style={{ background: "#FAFBFC", borderRadius: 12, padding: 12, marginBottom: 8 }}>
              <div style={{ fontSize: 11, color: COLORS.textLight, marginBottom: 4 }}>성격</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.textMid }}>{ch.personality}</div>
            </div>
            <div style={{ background: `${ch.color}08`, borderRadius: 12, padding: 12, border: `1px solid ${ch.color}22` }}>
              <div style={{ fontSize: 11, color: COLORS.textLight, marginBottom: 4 }}>대화 예시</div>
              <div style={{ fontSize: 13, color: COLORS.textDark, fontStyle: "italic" }}>{ch.sample}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReport = () => (
    <div>
      {sectionTitle("성장 리포트 (학부모용)", "📊")}
      <p style={{ color: COLORS.textMid, fontSize: 15, marginBottom: 24 }}>우리 아이의 이번 주 성장 기록이에요. 매주 월요일에 업데이트됩니다.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 24, marginBottom: 32 }}>
        {/* Radar Chart */}
        <div style={{ ...cardStyle }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: COLORS.textDark, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>🎯 종합 능력 지표</h3>
          <RadarChart skills={GROWTH_SKILLS} />
        </div>

        {/* Skill Bars */}
        <div style={{ ...cardStyle }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: COLORS.textDark, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>📈 영역별 성장도</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {GROWTH_SKILLS.map(s => (
              <div key={s.name}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.textDark }}>{s.icon} {s.name}</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: s.color }}>{s.value}%</span>
                </div>
                <ProgressBar value={s.value} color={s.color} />
                <div style={{ fontSize: 11, color: COLORS.textLight, marginTop: 4 }}>{s.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Highlights */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 24 }}>
        <div style={{ ...cardStyle }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: COLORS.textDark, marginBottom: 16 }}>🌟 이번 주 하이라이트</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {WEEKLY_HIGHLIGHTS.map((h, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, background: "#FAFBFC", borderRadius: 12 }}>
                <span style={{ fontSize: 24 }}>{h.icon}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.textDark }}>{h.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...cardStyle }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: COLORS.textDark, marginBottom: 16 }}>💡 추천 다음 활동</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {RECOMMENDED.map((r, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, background: `${COLORS.blue}08`, borderRadius: 12, border: `1px solid ${COLORS.blue}22` }}>
                <span style={{ fontSize: 24 }}>{r.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.textDark }}>{r.title}</div>
                  <div style={{ fontSize: 12, color: COLORS.textMid }}>{r.reason}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly summary table */}
      <div style={{ ...cardStyle, marginTop: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: COLORS.textDark, marginBottom: 16 }}>📅 주간 이용 요약</h3>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 4px" }}>
          <thead>
            <tr style={{ color: COLORS.textLight, fontSize: 12 }}>
              <th style={{ textAlign: "left", padding: "4px 8px" }}>요일</th>
              <th style={{ textAlign: "center", padding: "4px 8px" }}>이용시간</th>
              <th style={{ textAlign: "center", padding: "4px 8px" }}>주 활동</th>
              <th style={{ textAlign: "center", padding: "4px 8px" }}>학습</th>
              <th style={{ textAlign: "center", padding: "4px 8px" }}>놀이</th>
            </tr>
          </thead>
          <tbody>
            {["월", "화", "수", "목", "금", "토", "일"].map((day, i) => {
              const mins = [25, 32, 18, 28, 22, 45, 38][i];
              const acts = ["동요 + 한글학습", "동화 3편 청취", "숫자 퀴즈", "역할놀이", "영어 학습", "끝말잇기 + 동요", "동화 + 자장가"][i];
              const learn = [15, 10, 12, 5, 18, 8, 10][i];
              const play = [10, 22, 6, 23, 4, 37, 28][i];
              return (
                <tr key={day} style={{ background: i % 2 === 0 ? "#FAFBFC" : COLORS.white }}>
                  <td style={{ padding: "10px 8px", fontWeight: 700, fontSize: 14, color: COLORS.textDark }}>{day}요일</td>
                  <td style={{ textAlign: "center", padding: "10px 8px", fontWeight: 600, color: COLORS.blue }}>{mins}분</td>
                  <td style={{ textAlign: "center", padding: "10px 8px", fontSize: 13, color: COLORS.textMid }}>{acts}</td>
                  <td style={{ textAlign: "center", padding: "10px 8px" }}><span style={{ background: `${COLORS.green}15`, color: COLORS.green, padding: "2px 8px", borderRadius: 8, fontSize: 12 }}>{learn}분</span></td>
                  <td style={{ textAlign: "center", padding: "10px 8px" }}><span style={{ background: `${COLORS.pink}15`, color: COLORS.pink, padding: "2px 8px", borderRadius: 8, fontSize: 12 }}>{play}분</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderBusiness = () => (
    <div>
      {sectionTitle("IP / 비즈니스 모델", "💼")}

      {/* Revenue Streams */}
      <div style={{ ...cardStyle, marginBottom: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: COLORS.textDark, marginBottom: 20 }}>💰 수익 모델</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
          {REVENUE_STREAMS.map((rs, i) => (
            <div key={i} style={{ background: "#FAFBFC", borderRadius: 16, padding: 20, border: "1px solid #F1F5F9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 28 }}>{rs.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.textDark }}>{rs.name}</div>
                  <div style={{ fontSize: 12, color: COLORS.blue, fontWeight: 600 }}>{rs.revenue}</div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: COLORS.textMid, margin: "0 0 12px" }}>{rs.desc}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <ProgressBar value={rs.share} color={[COLORS.pink, COLORS.purple, COLORS.blue, COLORS.green][i]} height={8} />
                <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMid, whiteSpace: "nowrap" }}>{rs.share}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Target Market */}
      <div style={{ ...cardStyle, marginBottom: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: COLORS.textDark, marginBottom: 20 }}>📊 목표 시장 규모</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
          {[
            { label: "국내 키즈 콘텐츠 시장", value: "5.2조원", sub: "연평균 12% 성장", color: COLORS.pink },
            { label: "AI 스피커 보급 가구", value: "840만대", sub: "KT 기가지니 400만+", color: COLORS.blue },
            { label: "3-9세 아동 인구", value: "약 250만명", sub: "타겟 고객 기반", color: COLORS.green },
            { label: "캐릭터 상품 시장", value: "13.2조원", sub: "라이선싱 기회", color: COLORS.purple },
          ].map((m, i) => (
            <div key={i} style={{ textAlign: "center", padding: 20, background: `${m.color}08`, borderRadius: 16, border: `1px solid ${m.color}22` }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: m.color, marginBottom: 4 }}>{m.value}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.textDark, marginBottom: 2 }}>{m.label}</div>
              <div style={{ fontSize: 12, color: COLORS.textMid }}>{m.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Competitive Analysis */}
      <div style={{ ...cardStyle, marginBottom: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: COLORS.textDark, marginBottom: 20 }}>🏆 경쟁 분석</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {COMPETITORS.map((c, i) => (
            <div key={i} style={{ padding: 20, borderRadius: 16, border: `2px solid ${c.color}33`, background: `${c.color}05` }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: c.color, marginBottom: 12 }}>{c.name}</div>
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 12, color: COLORS.green, fontWeight: 700, marginBottom: 4 }}>✅ 강점</div>
                <div style={{ fontSize: 13, color: COLORS.textDark }}>{c.strength}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: COLORS.pink, fontWeight: 700, marginBottom: 4 }}>⚠️ 약점</div>
                <div style={{ fontSize: 13, color: COLORS.textDark }}>{c.weakness}</div>
              </div>
              {i === 2 && <div style={{ marginTop: 12, background: `${COLORS.yellow}20`, padding: "8px 12px", borderRadius: 10, fontSize: 12, fontWeight: 700, color: COLORS.orange, textAlign: "center" }}>우리의 핵심 차별점: AI 양방향 대화</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Roadmap */}
      <div style={{ ...cardStyle }}>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: COLORS.textDark, marginBottom: 20 }}>🗺️ 성장 로드맵</h3>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {ROADMAP.map((r, i) => (
            <div key={i} style={{ flex: "1 1 280px", borderRadius: 16, overflow: "hidden", border: `2px solid ${r.color}33` }}>
              <div style={{ background: `linear-gradient(135deg, ${r.color}, ${r.color}CC)`, padding: "16px 20px", color: "#fff" }}>
                <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.9 }}>{r.phase}</div>
                <div style={{ fontSize: 18, fontWeight: 800 }}>{r.title}</div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>{r.period}</div>
              </div>
              <div style={{ padding: 20 }}>
                {r.items.map((item, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontSize: 13, color: COLORS.textDark }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: r.color, flexShrink: 0 }} />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ============================================================
  // MAIN RENDER
  // ============================================================

  return (
    <div style={{ fontFamily: "'Noto Sans KR', sans-serif", background: COLORS.bg, minHeight: "100vh" }}>
      {/* CSS Animations */}
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
          100% { transform: translateY(-400px) rotate(360deg); opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>

      {/* Header */}
      <header style={{ background: "linear-gradient(135deg, #FFF1F5, #F0E6FF, #E0F2FE)", borderBottom: "2px solid #F1F5F9", padding: "0 24px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button onClick={onBack} style={{ background: COLORS.white, border: "1px solid #E2E8F0", borderRadius: 10, padding: "6px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600, color: COLORS.textMid, display: "flex", alignItems: "center", gap: 4 }}>
              ← DMP
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 28 }}>⭐</span>
              <span style={{ fontSize: 20, fontWeight: 900, background: `linear-gradient(135deg, ${COLORS.pink}, ${COLORS.purple})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                지니야~?
              </span>
              <span style={{ fontSize: 11, background: `${COLORS.yellow}30`, color: COLORS.orange, padding: "2px 8px", borderRadius: 8, fontWeight: 700 }}>어린이용 MVP</span>
            </div>
          </div>
          <div style={{ fontSize: 12, color: COLORS.textLight }}>KT GiGA Genie AI Kids Entertainment</div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav style={{ background: COLORS.white, borderBottom: "2px solid #F1F5F9", padding: "0 24px", overflowX: "auto" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", gap: 4 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setSelectedCategory(null); }}
              style={{
                background: tab === t.id ? `linear-gradient(135deg, ${COLORS.pink}15, ${COLORS.purple}15)` : "transparent",
                border: "none", borderBottom: tab === t.id ? `3px solid ${COLORS.pink}` : "3px solid transparent",
                padding: "12px 16px", cursor: "pointer", fontSize: 13, fontWeight: tab === t.id ? 800 : 500,
                color: tab === t.id ? COLORS.pink : COLORS.textMid, display: "flex", alignItems: "center", gap: 6,
                whiteSpace: "nowrap", transition: "all 0.2s", borderRadius: "8px 8px 0 0"
              }}
            >
              <span style={{ fontSize: 16 }}>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ maxWidth: 1400, margin: "0 auto", padding: 24 }}>
        {tab === "home" && renderHome()}
        {tab === "library" && renderLibrary()}
        {tab === "voice" && renderVoice()}
        {tab === "characters" && renderCharacters()}
        {tab === "report" && renderReport()}
        {tab === "business" && renderBusiness()}
      </main>

      {/* Footer */}
      <footer style={{ textAlign: "center", padding: "32px 24px", borderTop: "2px solid #F1F5F9", background: COLORS.white }}>
        <div style={{ fontSize: 24, marginBottom: 8 }}>⭐ 🌟 🎵 🦄 🌈</div>
        <div style={{ fontSize: 13, color: COLORS.textLight }}>지니야~? 어린이용 AI 엔터테인먼트 MVP | KT GiGA Genie</div>
        <div style={{ fontSize: 11, color: COLORS.textLight, marginTop: 4 }}>"차세대 핑크퐁/티니핑을 향해" | 2026 DMP Portal</div>
      </footer>
    </div>
  );
}
