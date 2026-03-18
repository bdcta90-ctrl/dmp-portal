import { useState, useEffect, useRef, useCallback } from "react";
import * as XLSX from "xlsx";

// Large-Scale Employee Generator (1800)

const SURNAMES = ["김","이","박","최","정","강","조","윤","장","임","한","오","서","신","권","황","안","송","류","전","홍","고","문","양","손","배","백","허","유","남","심","노","하","곽","성","차","주","우","민","탁","진","지","편","도","마","원","표","구","라","방","변","봉","빈","설","섭","승","엄","여","염"];
const GIVEN_NAMES = ["지훈","서연","민수","윤정","태현","소영","준혁","미래","성진","하늘","재원","은비","동욱","지민","석현","예진","현우","수빈","태민","서윤","도윤","하은","시우","지아","예준","서현","건우","다은","승현","유진","민재","소희","정우","채원","현준","은서","도현","나은","지호","하린","우진","연우","시윤","가은","준서","아린","민호","수아","재민","지유","지후","서준","주원","하준","민서","지안","수현","시은","소율","예서","태준","유나","세진","한결","보람","새봄","이슬","푸름","나래","한솔"];
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
      profile: {
        hireDate: new Date(2015 + Math.floor(Math.random() * 11), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        resignPlanned: Math.random() < 0.05,
        recentTransfer: Math.random() < 0.08,
        warningCount: Math.floor(Math.random() * 3),
        performanceRating: ["S","A","B","C","D"][Math.floor(Math.random()*5)],
        avgDailyEvents: Math.floor(Math.random() * 15) + 3,
      },
    });
  }
  return emps;
}

const EVENT_TYPES = [
  { type: "File Open", icon: "📂", label: "고보안 파일 열람", severity: "low" },
  { type: "File Download", icon: "⬇️", label: "다운로드 발생", severity: "medium" },
  { type: "Print", icon: "🖨️", label: "출력 요청", severity: "medium" },
  { type: "Copy to USB", icon: "💾", label: "외부 저장장치 복사", severity: "high" },
  { type: "Bulk Query", icon: "🔍", label: "대량 조회", severity: "high" },
  { type: "Permission Escalation", icon: "🔑", label: "권한 상승", severity: "critical" },
  { type: "Share Link Created", icon: "🔗", label: "외부 공유 링크 생성", severity: "high" },
  { type: "Delete/Modify", icon: "🗑️", label: "삭제/변조 시도", severity: "critical" },
  { type: "External AI Upload", icon: "🤖", label: "외부 AI 업로드", severity: "critical" },
];

const ASSETS = [
  { name: "고객계좌DB", type: "DB", sensitivity: 5, classification: "기밀", since: "2015.03", lastAudit: "2026.02" },
  { name: "2026_전략보고서.pdf", type: "리포트", sensitivity: 4, classification: "대외비", since: "2025.11", lastAudit: "2026.01" },
  { name: "인사평가_시트.xlsx", type: "파일", sensitivity: 4, classification: "기밀", since: "2016.01", lastAudit: "2025.12" },
  { name: "기술설계도_v3.dwg", type: "설계도", sensitivity: 5, classification: "최고기밀", since: "2017.05", lastAudit: "2026.03" },
  { name: "거래처_리스트.csv", type: "파일", sensitivity: 3, classification: "대외비", since: "2018.02", lastAudit: "2025.10" },
  { name: "연구개발_소스코드", type: "코드", sensitivity: 5, classification: "기밀", since: "2016.06", lastAudit: "2026.03" },
  { name: "재무제표_Q1.xlsx", type: "리포트", sensitivity: 4, classification: "대외비", since: "2026.01", lastAudit: "2026.03" },
  { name: "고객개인정보_DB", type: "DB", sensitivity: 5, classification: "최고기밀", since: "2015.01", lastAudit: "2026.01" },
  { name: "급여명세_전체.xlsx", type: "파일", sensitivity: 5, classification: "최고기밀", since: "2015.01", lastAudit: "2026.02" },
  { name: "M_A_계약서_draft.pdf", type: "리포트", sensitivity: 5, classification: "최고기밀", since: "2024.08", lastAudit: "2026.01" },
  { name: "ERP 재무모듈", type: "시스템", classification: "대외비", sensitivity: 4, since: "2015.01", lastAudit: "2025.12" },
  { name: "CRM 고객관리", type: "시스템", classification: "기밀", sensitivity: 4, since: "2016.03", lastAudit: "2025.11" },
  { name: "사내 이메일 시스템", type: "시스템", classification: "대외비", sensitivity: 3, since: "2015.01", lastAudit: "2026.01" },
  { name: "VPN 접속 로그", type: "로그", classification: "대외비", sensitivity: 3, since: "2018.06", lastAudit: "2026.02" },
  { name: "CCTV 영상 저장소", type: "영상", classification: "기밀", sensitivity: 4, since: "2017.01", lastAudit: "2025.10" },
  { name: "클라우드 스토리지(AWS S3)", type: "시스템", classification: "기밀", sensitivity: 5, since: "2020.01", lastAudit: "2026.01" },
  { name: "소스코드 Git 저장소", type: "코드", classification: "최고기밀", sensitivity: 5, since: "2016.05", lastAudit: "2026.03" },
  { name: "인사 평가 기록", type: "문서", classification: "기밀", sensitivity: 4, since: "2015.01", lastAudit: "2025.09" },
  { name: "이사회 의사록", type: "문서", classification: "최고기밀", sensitivity: 5, since: "2015.01", lastAudit: "2026.02" },
  { name: "파트너사 계약서", type: "문서", classification: "대외비", sensitivity: 3, since: "2015.06", lastAudit: "2025.08" },
  { name: "AI 학습 데이터셋", type: "데이터", classification: "기밀", sensitivity: 4, since: "2023.01", lastAudit: "2026.03" },
  { name: "고객 통화 녹취", type: "음성", classification: "최고기밀", sensitivity: 5, since: "2019.01", lastAudit: "2025.12" },
  { name: "비밀번호 해시 DB", type: "시스템", classification: "최고기밀", sensitivity: 5, since: "2015.01", lastAudit: "2026.03" },
  { name: "감사 보고서", type: "문서", classification: "기밀", sensitivity: 4, since: "2015.01", lastAudit: "2025.11" },
  { name: "M&A 검토 자료", type: "문서", classification: "최고기밀", sensitivity: 5, since: "2024.06", lastAudit: "2026.01" },
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
  },
  "데이터 백업 격리": {
    icon:"💾", urgency:"high", summary:"유출 의심 데이터의 증거 보전을 위한 긴급 백업",
    estimatedTime:"즉시 (5~10분)", riskIfSkipped:"증거 인멸 위험",
    steps:[
      {step:1,title:"대상 파일/DB 식별",desc:"접근 로그에서 대상 자산 확인",system:"보안관제",auto:true},
      {step:2,title:"스냅샷 생성",desc:"해당 자산의 현재 상태 스냅샷",system:"스토리지",auto:true},
      {step:3,title:"격리 저장소로 복사",desc:"포렌식용 읽기전용 격리 저장소에 보관",system:"포렌식",auto:true},
      {step:4,title:"해시값 생성",desc:"SHA-256 해시로 무결성 보장",system:"포렌식",auto:true},
      {step:5,title:"보관 기록 등록",desc:"증거물 관리대장 등록",system:"보안관제",auto:false},
    ],
    templates: null
  },
  "포렌식 조사 의뢰": {
    icon:"🔬", urgency:"critical", summary:"디지털 포렌식 전문팀에 조사 의뢰",
    estimatedTime:"3~7 영업일", riskIfSkipped:"법적 증거 확보 불가",
    steps:[
      {step:1,title:"조사 범위 확정",desc:"대상 직원, 기간, 시스템 범위 확정",system:"보안관제",auto:false},
      {step:2,title:"포렌식 의뢰서 작성",desc:"사건 개요, 요청사항, 긴급도 명시",system:"결재",auto:false},
      {step:3,title:"증거물 인계",desc:"백업 격리된 데이터 인계",system:"포렌식",auto:false},
      {step:4,title:"조사 착수 및 중간보고",desc:"주 1회 진행상황 보고",system:"포렌식",auto:false},
      {step:5,title:"최종 보고서 수령",desc:"포렌식 결과 보고서 + 증거물 반환",system:"포렌식",auto:false},
    ],
    templates: null
  },
  "보안교육 지정": {
    icon:"📚", urgency:"low", summary:"위험 행동 직원 대상 보안교육 이수 지정",
    estimatedTime:"1~2주 (온라인)", riskIfSkipped:"재발 방지 미흡",
    steps:[
      {step:1,title:"교육 대상자 선정",desc:"위험 점수 기반 자동 선정",system:"보안관제",auto:true},
      {step:2,title:"교육 과정 배정",desc:"정보보호 교육 플랫폼에 등록",system:"HR Portal",auto:true},
      {step:3,title:"교육 일정 통보",desc:"이메일/사내메신저로 알림",system:"사내 메신저",auto:true},
      {step:4,title:"이수 현황 모니터링",desc:"미이수자 재알림",system:"HR Portal",auto:true},
      {step:5,title:"이수 확인 및 기록",desc:"교육 완료 기록 HR 연동",system:"HR Portal",auto:false},
    ],
    templates: null
  },
  "CISO 긴급 보고": {
    icon:"🚨", urgency:"critical", summary:"최고정보보호책임자에게 즉시 보고",
    estimatedTime:"즉시 (10분 이내)", riskIfSkipped:"경영진 대응 지연",
    steps:[
      {step:1,title:"사건 요약 작성",desc:"1장 요약 보고서 자동 생성",system:"보안관제",auto:true},
      {step:2,title:"CISO 연락",desc:"긴급 연락망 자동 발신",system:"사내 메신저",auto:true},
      {step:3,title:"구두 보고",desc:"전화/대면 보고",system:"대면",auto:false},
      {step:4,title:"후속 조치 지시 수령",desc:"CISO 판단에 따른 추가 조치",system:"결재",auto:false},
      {step:5,title:"보고 기록 등록",desc:"보고 일시, 내용, 지시사항 기록",system:"보안관제",auto:true},
    ],
    templates: { title: "CISO 긴급 보고", body: "[긴급보고] CISO님, 보안 사고 긴급 보고드립니다.\n> 대상: {employee_name} ({department})\n> 행위: {event_type}\n> 자산: {asset_name}\n> 위험도: {risk_score}/100\n> 시각: {timestamp}\n\n즉시 확인 및 지시 부탁드립니다." }
  },
  "외부 신고": {
    icon:"📢", urgency:"critical", summary:"관계기관(KISA, 금감원, 경찰) 신고",
    estimatedTime:"즉시~24시간", riskIfSkipped:"법적 의무 위반 (과태료)",
    steps:[
      {step:1,title:"신고 대상 기관 확정",desc:"KISA(개인정보), 금감원(금융), 경찰(형사)",system:"보안관제",auto:false},
      {step:2,title:"신고서 작성",desc:"법정 양식에 맞춰 작성",system:"결재",auto:false},
      {step:3,title:"증거자료 첨부",desc:"포렌식 보고서, 로그, 스크린샷",system:"포렌식",auto:false},
      {step:4,title:"신고 제출",desc:"온라인 또는 방문 제출",system:"외부",auto:false},
      {step:5,title:"접수번호 및 후속 대응",desc:"기관 조사 협조",system:"외부",auto:false},
    ],
    templates: null
  }
};

var DEPT_ASSETS = {
  "재무팀": ["고객계좌DB","급여명세_전체.xlsx","재무제표_Q1.xlsx"],
  "연구개발1팀": ["기술설계도_v3.dwg","연구개발_소스코드"],
  "연구개발2팀": ["기술설계도_v3.dwg","연구개발_소스코드"],
  "인사팀": ["급여명세_전체.xlsx","인사평가_시트.xlsx"],
  "마케팅팀": ["2026_전략보고서.pdf","거래처_리스트.csv"],
  "IT운영팀": ["연구개발_소스코드", "소스코드 Git 저장소", "VPN 접속 로그", "비밀번호 해시 DB", "클라우드 스토리지(AWS S3)"],
  "법무팀": ["M_A_계약서_draft.pdf"],
  "보안팀": ["VPN 접속 로그", "CCTV 영상 저장소", "감사 보고서", "비밀번호 해시 DB"],
  "전략기획팀": ["2026_전략보고서.pdf"],
  "영업1팀": ["거래처_리스트.csv"],
  "영업2팀": ["거래처_리스트.csv"],
  "고객지원팀": ["고객개인정보_DB"],
  "리스크관리팀": ["고객계좌DB", "감사 보고서", "M&A 검토 자료"],
  "컴플라이언스팀": ["고객개인정보_DB", "감사 보고서", "고객계좌DB"],
  "데이터분석팀": ["고객개인정보_DB","고객계좌DB"],
  "인프라팀": ["연구개발_소스코드", "VPN 접속 로그", "비밀번호 해시 DB", "클라우드 스토리지(AWS S3)", "소스코드 Git 저장소"],
  "경영지원팀": ["급여명세_전체.xlsx", "인사 평가 기록", "이사회 의사록", "파트너사 계약서"],
  "해외사업팀": ["2026_전략보고서.pdf", "파트너사 계약서", "M&A 검토 자료"],
  "신사업개발팀": ["2026_전략보고서.pdf", "기술설계도_v3.dwg", "AI 학습 데이터셋", "M&A 검토 자료"],
  "디자인팀": [],
};

var EVENT_WEIGHTS = [30,25,15,8,5,2,6,3,6]; // File Open 30%, Permission Escalation 2%, etc.

function weightedPickEvent() {
  var total = EVENT_WEIGHTS.reduce(function(a,b){return a+b},0);
  var r = Math.random() * total;
  var cum = 0;
  for (var i = 0; i < EVENT_WEIGHTS.length; i++) {
    cum += EVENT_WEIGHTS[i];
    if (r < cum) return EVENT_TYPES[i];
  }
  return EVENT_TYPES[0];
}

function generateEvent(employees, existingEvents) {
  var emp = pick(employees), evt = weightedPickEvent(), asset = pick(ASSETS);
  var evts = existingEvents || [];

  // Base score from severity + asset sensitivity
  var s = ({low:15,medium:30,high:55,critical:75})[evt.severity]||20;
  // Role-asset mismatch (computed early for sensitivity bonus)
  var deptAssets = DEPT_ASSETS[emp.department] || [];
  var roleMismatch = !deptAssets.includes(asset.name) ? 20 : 0;
  var sensitivityBonus = roleMismatch > 0 ? asset.sensitivity * 5 : asset.sensitivity * 2; // legitimate access = lower weight
  s += sensitivityBonus;
  if(emp.employmentType==="외주"||emp.employmentType==="협력사") s+=15;
  var clearanceMismatch = (emp.clearanceLevel === "일반" && (asset.classification === "기밀" || asset.classification === "최고기밀") && roleMismatch > 0) ? 20 : 0;
  s += clearanceMismatch;

  // Time-based bonus
  var hourNow = new Date().getHours();
  var isOffHours = hourNow < 7 || hourNow >= 22;
  var isWeekend = [0,6].includes(new Date().getDay());
  var timeBonus = isOffHours ? 20 : isWeekend ? 10 : 0;

  // Frequency bonus
  var userRecentCount = evts.filter(function(e){return e.employee.id === emp.id}).length;
  var freqBonus = userRecentCount >= 5 ? 20 : userRecentCount >= 3 ? 10 : 0;

  // Profile-based adjustments
  var profileBonus = 0;
  if (emp.profile) {
    if (emp.profile.resignPlanned) profileBonus += 25;
    if (emp.profile.recentTransfer) profileBonus += 10;
    profileBonus += emp.profile.warningCount * 8;
    if (emp.profile.performanceRating === "D") profileBonus += 15;
  }

  s += timeBonus + freqBonus + roleMismatch + profileBonus;

  var riskScore = Math.max(0, Math.min(100, s));

  // Deterministic AI contexts based on actual factors
  var contexts = [];
  if (isOffHours) contexts.push({reason: "비업무시간(" + hourNow + "시) 접근 — 야간 유출 위험", probability: 85});
  if (isWeekend) contexts.push({reason: "주말 접근 — 비정상 업무 패턴", probability: 80});
  if (emp.profile && emp.profile.resignPlanned) contexts.push({reason: "퇴사 예정자 — 데이터 반출 위험 높음", probability: 92});
  if (emp.profile && emp.profile.recentTransfer) contexts.push({reason: "최근 부서 이동 — 이전 부서 자산 접근 주의", probability: 72});
  if (roleMismatch > 0) contexts.push({reason: emp.department + "에서 " + asset.name + " 접근 — 업무 범위 외 자산", probability: 78});
  if (freqBonus > 0) contexts.push({reason: "최근 " + userRecentCount + "건 연속 이벤트 — 이상 빈도 탐지", probability: 75});
  if (emp.profile && emp.profile.warningCount > 0) contexts.push({reason: "과거 경고 " + emp.profile.warningCount + "회 — 주의 대상자", probability: 70});
  if (emp.profile && emp.profile.performanceRating === "D") contexts.push({reason: "저성과자(D등급) — 불만 동기 가능성", probability: 65});
  if (emp.employmentType==="외주"||emp.employmentType==="협력사") contexts.push({reason: "외부 인력(" + emp.employmentType + ") — 내부 자산 접근 주의", probability: 73});
  if (clearanceMismatch > 0) contexts.push({reason: "보안등급 불일치(일반→" + asset.classification + ") — 권한 위반 의심", probability: 88});

  // Fill up to 3 contexts, add generic ones if needed
  var genericReasons = CONTEXT_REASONS.slice();
  while (contexts.length < 3) {
    var gr = genericReasons.splice(Math.floor(Math.random()*genericReasons.length), 1)[0];
    if (gr) contexts.push({reason: gr, probability: Math.max(10, 60 - contexts.length * 15 + randInt(-10, 10))});
    else break;
  }
  contexts.sort(function(a,b){return b.probability - a.probability});
  contexts = contexts.slice(0, 3);

  var urgMap={"계정 잠금":"critical","접근 일시 제한":"high","HR 연계 조사 요청":"high","추가 MFA 인증":"medium","감사 로그 자동 생성":"medium","관리자 확인 요청":"low","데이터 백업 격리":"high","포렌식 조사 의뢰":"critical","보안교육 지정":"low","CISO 긴급 보고":"critical","외부 신고":"critical"};
  var avail=Object.keys(ACTION_GUIDES).sort(function(){return Math.random()-0.5});
  var recs=[];
  if(riskScore>=80) recs.push(avail.find(function(a){return urgMap[a]==="critical"})||avail[0]);
  if(riskScore>=50) recs.push(avail.find(function(a){return urgMap[a]==="high"})||avail[1]);
  if(riskScore>=50) recs.push(avail.find(function(a){return urgMap[a]==="medium"})||avail[2]);
  if(riskScore<50) recs.push(avail.find(function(a){return urgMap[a]==="medium"})||avail[0]);
  var unique=[]; recs.forEach(function(r){if(r && unique.indexOf(r)===-1)unique.push(r)});
  var maxActions = riskScore >= 80 ? 3 : riskScore >= 50 ? 2 : 1;
  var actions=unique.slice(0,maxActions).map(function(n){return{action:n,desc:ACTION_GUIDES[n].summary.slice(0,40)+"...",urgency:urgMap[n]||"medium"}});

  var event = { id:"EVT-"+Date.now()+"-"+randInt(100,999),timestamp:new Date(),employee:emp,eventType:evt,asset:asset,riskScore:riskScore,contexts:contexts,actions:actions,status:"new",isNew:true,roleMismatch:roleMismatch>0,isOffHours:isOffHours,isWeekend:isWeekend,compoundThreat:false,compoundDetail:"" };

  // Compound threat detection
  var recentHighRisk = evts.filter(function(e){
    return e.employee.id === emp.id && e.riskScore >= 70 && (Date.now() - e.timestamp.getTime()) < 600000;
  });
  if (recentHighRisk.length >= 2) {
    event.compoundThreat = true;
    event.compoundDetail = "동일 사용자 10분 내 고위험 " + (recentHighRisk.length+1) + "건 — 복합 위협 알림";
    event.riskScore = Math.min(100, event.riskScore + 15);
  }

  return event;
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
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 1;
      for (var y = 0; y < h; y += h / 5) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
      [80, 60, 40].forEach(function(th, idx) {
        var yy = h - (th / 100) * h;
        ctx.strokeStyle = ["rgba(255,45,85,0.25)", "rgba(255,149,0,0.2)", "rgba(255,204,0,0.12)"][idx];
        ctx.setLineDash([6, 4]);
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(w, yy); ctx.stroke();
        ctx.setLineDash([]);
        // threshold labels
        ctx.fillStyle = ["rgba(255,45,85,0.5)", "rgba(255,149,0,0.4)", "rgba(255,204,0,0.3)"][idx];
        ctx.font = Math.round(h / 14) + "px 'DM Mono', monospace";
        ctx.textAlign = "left";
        ctx.fillText(["심각","높음","주의"][idx] + " " + th, 4, yy - 4);
      });
      var pts = data.map(function(d, i) { return { x: (i / (data.length - 1)) * w, y: h - (d.score / 100) * h * 0.9 - h * 0.05 }; });
      var avgScore = data.reduce(function(s, d) { return s + d.score; }, 0) / data.length;
      var baseColor = avgScore >= 70 ? "255,45,85" : avgScore >= 50 ? "255,149,0" : avgScore >= 30 ? "255,204,0" : "48,209,88";
      var grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "rgba(" + baseColor + ",0.5)");
      grad.addColorStop(0.5, "rgba(" + baseColor + ",0.15)");
      grad.addColorStop(1, "rgba(" + baseColor + ",0.02)");
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
      ctx.strokeStyle = "rgb(" + baseColor + ")";
      ctx.lineWidth = 3.5;
      ctx.shadowColor = "rgba(" + baseColor + ",0.6)";
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;
      var last = pts[pts.length - 1];
      ctx.beginPath(); ctx.arc(last.x, last.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(" + baseColor + ",0.3)"; ctx.fill();
      ctx.beginPath(); ctx.arc(last.x, last.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "rgb(" + baseColor + ")"; ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.font = Math.round(h / 12) + "px 'DM Mono', monospace";
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
    <canvas ref={canvasRef} style={{ width: "100%", height: 180, display: "block" }} />
    {analyzing && <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.55)",backdropFilter:"blur(3px)",borderRadius:10,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6,animation:"fadeIn 0.3s"}}>
      <div style={{display:"flex",alignItems:"center",gap:6}}>
        <div style={{width:16,height:16,border:"2.5px solid rgba(10,132,255,0.3)",borderTop:"2.5px solid #5ac8fa",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>
        <span style={{fontSize:12,fontWeight:700,color:"#5ac8fa",letterSpacing:0.5}}>AI 위험도 분석 중</span>
      </div>
      <div style={{width:"60%",height:4,borderRadius:3,background:"rgba(255,255,255,0.08)",overflow:"hidden"}}>
        <div style={{height:"100%",borderRadius:3,background:"linear-gradient(90deg,#0a84ff,#5ac8fa,#30d158)",transition:"width 0.4s ease",width:analysisPct+"%"}}/>
      </div>
      <div style={{fontSize:10,color:"rgba(255,255,255,0.7)",fontWeight:500}}>{analysisMsg}</div>
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
  var stAiPhase = useState(0); // 0=generating, 1=done
  var aiPhase = stAiPhase[0], setAiPhase = stAiPhase[1];
  var stAiProgress = useState(0);
  var aiProgress = stAiProgress[0], setAiProgress = stAiProgress[1];
  var stAiStep = useState("");
  var aiStep = stAiStep[0], setAiStep = stAiStep[1];
  var stRevealedCount = useState(0);
  var revealedCount = stRevealedCount[0], setRevealedCount = stRevealedCount[1];

  var rLabel = recipientType === "user" ? user.name+" (본인)" : user.managerId+" ("+user.name+"의 팀장)";
  var presets = recipientType === "user"
    ? ["[자동생성] "+user.name+"님, 금일 "+user.department+"에서 보안 이벤트가 탐지되었습니다. 업무 목적이었는지 확인 부탁드립니다.","[자동생성] "+user.name+"님의 계정에서 비정상 접근이 감지되었습니다. 본인 행위가 아닌 경우 즉시 비밀번호를 변경해 주세요.","[자동생성] 보안관제 알림: "+user.name+"님의 접근 기록이 정책 위반으로 분류되었습니다. 사유서 제출을 요청드립니다."]
    : ["[자동생성] "+user.managerId+"님, 팀원 "+user.name+"의 보안 이상행위가 탐지되었습니다. 최근 업무 상황 확인 및 면담을 요청드립니다.","[자동생성] "+user.managerId+"님, "+user.name+"("+user.department+") 고위험 보안 이벤트 감지. 업무 연관성 확인 후 결과 회신 부탁드립니다.","[자동생성] 보안관제센터입니다. "+user.name+" 관련 긴급 사안 발생. "+user.managerId+"님의 즉시 확인 및 조치가 필요합니다."];

  // AI 생성 애니메이션
  useEffect(function() {
    var steps = [
      {msg:"🔍 "+user.name+" 이벤트 이력 분석 중...",pct:15},
      {msg:"🧠 "+user.department+" 부서 보안 정책 확인 중...",pct:35},
      {msg:"📋 "+(recipientType==="user"?"본인 통보":"팀장 보고")+" 템플릿 매칭 중...",pct:60},
      {msg:"✍️ 상황 맞춤 메시지 생성 중...",pct:85},
      {msg:"✅ AI 메시지 생성 완료",pct:100}
    ];
    var i=0;
    var iv = setInterval(function() {
      if(i<steps.length) { setAiStep(steps[i].msg); setAiProgress(steps[i].pct); i++; }
      else { clearInterval(iv); setAiPhase(1); var j=0; var rv=setInterval(function(){ j++; setRevealedCount(j); if(j>=presets.length) clearInterval(rv); },300); }
    },600);
    setAiStep(steps[0].msg); setAiProgress(steps[0].pct);
    return function(){ clearInterval(iv); };
  },[]);

  return (
    <div style={{position:"fixed",inset:0,zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={function(e){if(e.target===e.currentTarget)onClose()}}>
      <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(8px)"}}/>
      <div style={{position:"relative",width:"min(540px,90vw)",background:"#12121a",border:"1px solid rgba(255,255,255,0.08)",borderRadius:18}}>
        {sent ? (
          <div style={{padding:48,textAlign:"center",animation:"fadeIn 0.4s"}}>
            <div style={{fontSize:48,marginBottom:12}}>✅</div>
            <div style={{fontSize:16,fontWeight:700,color:"#30d158"}}>전송 완료</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginTop:8}}>{rLabel}에게 전송됨</div>
          </div>
        ) : (
          <div>
            <div style={{padding:"22px 26px 14px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:28,height:28,borderRadius:8,background:recipientType==="user"?"rgba(10,132,255,0.15)":"rgba(255,159,10,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>{recipientType==="user"?"👤":"👥"}</div>
                  <div>
                    <div style={{fontSize:16,fontWeight:700}}>AI 메시지 생성</div>
                    <div style={{fontSize:10,color:"rgba(255,255,255,0.35)"}}>상황 분석 기반 자동 메시지 추천</div>
                  </div>
                </div>
                <button onClick={onClose} style={{background:"rgba(255,255,255,0.06)",border:"none",color:"rgba(255,255,255,0.5)",width:32,height:32,borderRadius:8,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>X</button>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginTop:10,background:"rgba(255,255,255,0.03)",borderRadius:8,padding:"7px 12px"}}>
                <span style={{fontSize:10,color:"rgba(255,255,255,0.35)",fontWeight:600}}>수신:</span>
                <span style={{fontSize:12,color:recipientType==="user"?"#0a84ff":"#ff9f0a",fontWeight:600}}>{rLabel}</span>
              </div>
            </div>
            <div style={{padding:"14px 26px"}}>
              {/* AI 생성 중 로딩 */}
              {aiPhase===0 && (
                <div style={{background:"rgba(10,132,255,0.05)",border:"1px solid rgba(10,132,255,0.15)",borderRadius:12,padding:"20px 18px",marginBottom:12,animation:"fadeIn 0.3s"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                    <div style={{width:18,height:18,border:"2px solid rgba(10,132,255,0.3)",borderTop:"2px solid #0a84ff",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>
                    <span style={{fontSize:12,fontWeight:700,color:"#0a84ff"}}>AI가 메시지를 생성하고 있습니다</span>
                  </div>
                  <div style={{width:"100%",height:4,borderRadius:3,background:"rgba(255,255,255,0.06)",overflow:"hidden",marginBottom:8}}>
                    <div style={{height:"100%",borderRadius:3,background:"linear-gradient(90deg,#0a84ff,#5ac8fa)",transition:"width 0.5s ease",width:aiProgress+"%"}}/>
                  </div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:500}}>{aiStep}</div>
                </div>
              )}

              {/* AI 생성 완료 - 빠른 선택 */}
              {aiPhase===1 && (
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
                    <span style={{fontSize:11,color:"rgba(255,255,255,0.35)",fontWeight:600}}>AI 추천 메시지</span>
                    <span style={{fontSize:9,padding:"2px 6px",borderRadius:6,background:"rgba(10,132,255,0.12)",color:"#0a84ff",fontWeight:700}}>AI 생성</span>
                  </div>
                  {presets.map(function(p,i){
                    var isRevealed = i < revealedCount;
                    return(
                      <button key={i} onClick={function(){setMsg(p)}} style={{display:"block",width:"100%",background:msg===p?"rgba(10,132,255,0.12)":"rgba(255,255,255,0.03)",border:"1px solid "+(msg===p?"rgba(10,132,255,0.3)":"rgba(255,255,255,0.06)"),color:msg===p?"#0a84ff":"rgba(255,255,255,0.55)",padding:"10px 14px",borderRadius:10,fontSize:11.5,cursor:isRevealed?"pointer":"default",textAlign:"left",lineHeight:1.6,marginBottom:6,opacity:isRevealed?1:0,transform:isRevealed?"translateY(0)":"translateY(8px)",transition:"all 0.4s ease",position:"relative",overflow:"hidden"}}>{isRevealed && <span style={{position:"absolute",top:4,right:8,fontSize:8,color:"rgba(10,132,255,0.5)",fontWeight:600}}>#{i+1}</span>}{p.replace("[자동생성] ","")}</button>
                    );
                  })}
                </div>
              )}

              <div style={{fontSize:11,color:"rgba(255,255,255,0.35)",fontWeight:600,margin:"14px 0 6px"}}>직접 작성</div>
              <textarea value={msg} onChange={function(e){setMsg(e.target.value)}} placeholder="메시지를 직접 입력하거나 위 AI 추천을 선택하세요..." rows={3} style={{width:"100%",background:"rgba(0,0,0,0.3)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:10,padding:12,color:"#fff",fontSize:12,lineHeight:1.5,resize:"vertical",outline:"none",fontFamily:"'Pretendard',sans-serif",boxSizing:"border-box"}}/>
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
    <div onClick={onClick} style={{background:event.compoundThreat?"linear-gradient(135deg,rgba(255,45,85,0.12),transparent 70%)":event.isNew?"linear-gradient(135deg,"+color+"08,transparent 70%)":"rgba(255,255,255,0.02)",border:event.compoundThreat?"2px solid rgba(255,45,85,0.5)":"1px solid "+(event.isNew?color+"30":"rgba(255,255,255,0.05)"),borderLeft:event.compoundThreat?"4px solid #ff2d55":"3px solid "+color,borderRadius:10,padding:"12px 14px",cursor:"pointer",transition:"all 0.3s",animation:event.compoundThreat?"pulse 2s infinite":event.isNew?"slideIn 0.5s cubic-bezier(0.22,1,0.36,1)":"none",marginBottom:6}}>
      {event.compoundThreat && <div style={{fontSize:10,color:"#ff2d55",fontWeight:700,marginBottom:6,display:"flex",alignItems:"center",gap:5,background:"rgba(255,45,85,0.08)",padding:"4px 8px",borderRadius:6}}>
        <span style={{animation:"pulse 1s infinite"}}>{"⚠️"}</span> {event.compoundDetail}
      </div>}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:18}}>{event.eventType.icon}</span>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <span style={{fontSize:12,fontWeight:600}}>{event.employee.name}</span>
              <span style={{fontSize:9,color:"rgba(255,255,255,0.4)",background:"rgba(255,255,255,0.05)",padding:"1px 5px",borderRadius:3}}>{event.employee.department}</span>
              {event.isNew && <PulsingDot color={color}/>}
              {event.roleMismatch && <span style={{fontSize:8,color:"#ff2d55",background:"rgba(255,45,85,0.15)",padding:"1px 5px",borderRadius:3,fontWeight:700}}>{"❌"} 권한외 접근</span>}
              {event.isOffHours && <span style={{fontSize:8,color:"#5e5ce6",background:"rgba(94,92,230,0.15)",padding:"1px 5px",borderRadius:3,fontWeight:600}}>{"🌙"} 야간</span>}
              {event.isWeekend && !event.isOffHours && <span style={{fontSize:8,color:"#ff9f0a",background:"rgba(255,159,10,0.15)",padding:"1px 5px",borderRadius:3,fontWeight:600}}>{"📅"} 주말</span>}
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

          {/* HR 프로필 */}
          {event.employee.profile && (
            <div style={{background:"rgba(94,92,230,0.06)",border:"1px solid rgba(94,92,230,0.15)",borderRadius:10,padding:"8px 12px",marginBottom:10,animation:"fadeIn 0.3s"}}>
              <div style={{fontSize:9,color:"#5e5ce6",fontWeight:600,letterSpacing:1,marginBottom:6}}>HR 프로필</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",fontSize:10,color:"rgba(255,255,255,0.6)"}}>
                <span>입사일: {event.employee.profile.hireDate.toLocaleDateString("ko-KR",{year:"numeric",month:"2-digit",day:"2-digit"})}</span>
                <span style={{color:"rgba(255,255,255,0.15)"}}>|</span>
                <span style={{color:event.employee.profile.resignPlanned?"#ff2d55":"rgba(255,255,255,0.6)"}}>퇴사예정: {event.employee.profile.resignPlanned?"예 ⚠️":"아니오"}</span>
                <span style={{color:"rgba(255,255,255,0.15)"}}>|</span>
                <span style={{color:event.employee.profile.recentTransfer?"#ff9f0a":"rgba(255,255,255,0.6)"}}>최근이동: {event.employee.profile.recentTransfer?"있음":"없음"}</span>
                <span style={{color:"rgba(255,255,255,0.15)"}}>|</span>
                <span style={{color:event.employee.profile.warningCount>0?"#ff9500":"rgba(255,255,255,0.6)"}}>경고: {event.employee.profile.warningCount}회</span>
                <span style={{color:"rgba(255,255,255,0.15)"}}>|</span>
                <span style={{color:event.employee.profile.performanceRating==="D"?"#ff2d55":event.employee.profile.performanceRating==="S"?"#30d158":"rgba(255,255,255,0.6)"}}>평가: {event.employee.profile.performanceRating}</span>
              </div>
            </div>
          )}

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
  var stTimeline = useState(null);
  var timelineUser = stTimeline[0], setTimelineUser = stTimeline[1];
  var m={};
  events.forEach(function(e){
    var k=e.employee.name;
    if(!m[k]) m[k]={name:k,dept:e.employee.department,managerId:e.employee.managerId,scores:[],count:0};
    m[k].scores.push(e.riskScore); m[k].count++;
  });
  var users=Object.values(m).map(function(u){return Object.assign({},u,{maxScore:Math.max.apply(null,u.scores)})}).sort(function(a,b){return b.maxScore-a.maxScore}).slice(0,5);

  var timelineEvents = timelineUser ? events.filter(function(e){return e.employee.name === timelineUser}).sort(function(a,b){return a.timestamp - b.timestamp}) : [];

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
            <button onClick={function(){setTimelineUser(timelineUser===u.name?null:u.name)}} style={{background:"rgba(94,92,230,0.1)",border:"1px solid rgba(94,92,230,0.2)",color:"#5e5ce6",padding:"3px 8px",borderRadius:5,fontSize:9,fontWeight:600,cursor:"pointer"}}>{timelineUser===u.name?"닫기":"타임라인"}</button>
          </div>
        </div>
      );
    })}
    {timelineUser && timelineEvents.length > 0 && (
      <div style={{marginTop:10,background:"rgba(94,92,230,0.06)",border:"1px solid rgba(94,92,230,0.15)",borderRadius:8,padding:10,animation:"fadeIn 0.3s"}}>
        <div style={{fontSize:10,fontWeight:600,color:"#5e5ce6",marginBottom:8}}>{timelineUser} 이벤트 타임라인 ({timelineEvents.length}건)</div>
        <div style={{maxHeight:200,overflowY:"auto"}}>
          {timelineEvents.map(function(ev,idx){
            var tc = ev.riskScore>=80?"#ff2d55":ev.riskScore>=60?"#ff9500":ev.riskScore>=40?"#ffcc00":"#30d158";
            return(
              <div key={idx} style={{display:"flex",gap:8,position:"relative",paddingBottom:8}}>
                {idx < timelineEvents.length-1 && <div style={{position:"absolute",left:5,top:14,width:1,height:"calc(100% - 6px)",background:"rgba(255,255,255,0.08)"}}/>}
                <div style={{width:11,height:11,borderRadius:"50%",background:tc,flexShrink:0,marginTop:2,zIndex:1,boxShadow:"0 0 6px "+tc+"66"}}/>
                <div style={{flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontSize:10,color:"rgba(255,255,255,0.7)"}}>{ev.eventType.icon} {ev.eventType.label}</span>
                    <span style={{fontSize:9,color:tc,fontWeight:700,fontFamily:"monospace"}}>{ev.riskScore}</span>
                  </div>
                  <div style={{fontSize:9,color:"rgba(255,255,255,0.3)"}}>{ev.timestamp.toLocaleTimeString("ko-KR",{hour:"2-digit",minute:"2-digit",second:"2-digit"})} · {ev.asset.name}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    )}
    </div>
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

// ═══════════════════════════════════════════════════
// AI ChatBot for Security Dashboard
// ═══════════════════════════════════════════════════

function SecurityChatBot(props) {
  var events = props.events, employees = props.employees, onSelectEvent = props.onSelectEvent, onClose = props.onClose;
  var stMessages = useState([{role:"ai",text:"안녕하세요! 보안관제 AI 어시스턴트입니다.\n\n이벤트 데이터를 자연어로 질의할 수 있습니다. 예시:\n• \"위험점수 80점 이상 인원 정리해줘\"\n• \"외부 공유 링크 생성된 이벤트 목록\"\n• \"USB 복사 이벤트 보여줘\"\n• \"기밀 자산 접근 목록\"",type:"text",ts:new Date()}]);
  var messages = stMessages[0], setMessages = stMessages[1];
  var stInput = useState("");
  var input = stInput[0], setInput = stInput[1];
  var stTyping = useState(false);
  var typing = stTyping[0], setTyping = stTyping[1];
  var stTypingMsg = useState("");
  var typingMsg = stTypingMsg[0], setTypingMsg = stTypingMsg[1];
  var chatEndRef = useRef(null);

  useEffect(function() {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, typing]);

  // Parse natural language query and filter events
  var processQuery = function(query) {
    var q = query.toLowerCase();
    var result = { filtered: [], description: "", columns: [] };

    // Parse risk score threshold
    var scoreMatch = q.match(/(\d+)\s*점?\s*이상/) || q.match(/위험.*?(\d+)/);
    var minScore = scoreMatch ? parseInt(scoreMatch[1]) : null;

    // Parse time range
    var timeMatch = q.match(/(\d{1,2})\s*시.*?(\d{1,2})\s*시/);
    var startHour = null, endHour = null;
    if (timeMatch) {
      startHour = parseInt(timeMatch[1]);
      endHour = parseInt(timeMatch[2]);
      if (q.indexOf("오후") >= 0 && startHour < 12) startHour += 12;
      if (q.indexOf("오전") >= 0 && startHour === 12) startHour = 0;
    }

    // Parse event type keywords
    var eventTypeMatch = null;
    var typeKeywords = [
      { keywords: ["외부 공유", "공유 링크", "링크 생성", "외부공유"], type: "Share Link Created" },
      { keywords: ["usb", "외부 저장", "저장장치"], type: "Copy to USB" },
      { keywords: ["다운로드", "download"], type: "File Download" },
      { keywords: ["출력", "프린트", "인쇄"], type: "Print" },
      { keywords: ["권한 상승", "권한상승", "escalation"], type: "Permission Escalation" },
      { keywords: ["대량 조회", "대량조회", "bulk"], type: "Bulk Query" },
      { keywords: ["삭제", "변조", "delete"], type: "Delete/Modify" },
      { keywords: ["파일 열람", "파일열람", "열람"], type: "File Open" },
      { keywords: ["ai 업로드", "외부 ai", "chatgpt", "외부ai"], type: "External AI Upload" },
    ];
    typeKeywords.forEach(function(tk) {
      tk.keywords.forEach(function(kw) { if (q.indexOf(kw) >= 0) eventTypeMatch = tk.type; });
    });

    // Parse severity keywords
    var severityMatch = null;
    if (q.indexOf("심각") >= 0 || q.indexOf("critical") >= 0) severityMatch = "critical";
    else if (q.indexOf("높음") >= 0 || q.indexOf("high") >= 0) severityMatch = "high";
    else if (q.indexOf("주의") >= 0 || q.indexOf("medium") >= 0) severityMatch = "medium";

    // Parse asset classification
    var assetClass = null;
    if (q.indexOf("기밀") >= 0 || q.indexOf("최고기밀") >= 0) assetClass = q.indexOf("최고기밀") >= 0 ? "최고기밀" : "기밀";
    else if (q.indexOf("대외비") >= 0) assetClass = "대외비";

    // Parse department
    var deptMatch = null;
    var knownDepts = [];
    employees.forEach(function(e) { if (knownDepts.indexOf(e.department) === -1) knownDepts.push(e.department); });
    knownDepts.forEach(function(d) { if (q.indexOf(d.toLowerCase()) >= 0 || q.indexOf(d) >= 0) deptMatch = d; });

    // Parse employee name
    var nameMatch = null;
    employees.forEach(function(e) { if (q.indexOf(e.name) >= 0) nameMatch = e.name; });

    // Filter events
    var filtered = events.filter(function(e) {
      if (minScore !== null && e.riskScore < minScore) return false;
      if (startHour !== null && endHour !== null) {
        var h = e.timestamp.getHours();
        if (h < startHour || h > endHour) return false;
      }
      if (eventTypeMatch && e.eventType.type !== eventTypeMatch) return false;
      if (severityMatch && e.eventType.severity !== severityMatch) return false;
      if (assetClass && e.asset.classification !== assetClass) return false;
      if (deptMatch && e.employee.department !== deptMatch) return false;
      if (nameMatch && e.employee.name !== nameMatch) return false;
      return true;
    });

    // Sort by risk score descending
    filtered.sort(function(a, b) { return b.riskScore - a.riskScore; });

    // Build description
    var descParts = [];
    if (startHour !== null) descParts.push(startHour + "시~" + endHour + "시");
    if (minScore !== null) descParts.push("위험점수 " + minScore + "점 이상");
    if (eventTypeMatch) {
      var etLabel = ""; EVENT_TYPES.forEach(function(et) { if (et.type === eventTypeMatch) etLabel = et.label; });
      descParts.push("\"" + etLabel + "\"");
    }
    if (severityMatch) descParts.push("심각도: " + severityMatch);
    if (assetClass) descParts.push("자산등급: " + assetClass);
    if (deptMatch) descParts.push("부서: " + deptMatch);
    if (nameMatch) descParts.push("이름: " + nameMatch);

    // Determine result type
    var isLinkQuery = eventTypeMatch === "Share Link Created" && (q.indexOf("링크 목록") >= 0 || q.indexOf("링크 정리") >= 0 || q.indexOf("목록") >= 0);

    result.filtered = filtered;
    result.description = descParts.length > 0 ? descParts.join(", ") + " 조건으로 검색" : "전체 이벤트 검색";
    result.isLinkList = isLinkQuery;
    return result;
  };

  var handleSend = function() {
    if (!input.trim() || typing) return;
    var userMsg = input.trim();
    setInput("");
    setMessages(function(prev) { return prev.concat([{ role: "user", text: userMsg, ts: new Date() }]); });
    setTyping(true);

    // AI typing simulation
    var steps = ["🔍 쿼리 분석 중...", "📊 이벤트 데이터 필터링...", "🧠 결과 정리 중..."];
    var si = 0;
    setTypingMsg(steps[0]);
    var iv = setInterval(function() {
      si++;
      if (si < steps.length) setTypingMsg(steps[si]);
      else {
        clearInterval(iv);
        setTyping(false);
        var result = processQuery(userMsg);
        if (result.filtered.length === 0) {
          setMessages(function(prev) { return prev.concat([{ role: "ai", text: "조건에 맞는 이벤트가 없습니다.\n\n조건: " + result.description + "\n\n다른 조건으로 다시 질의해 주세요.", type: "text", ts: new Date() }]); });
        } else {
          setMessages(function(prev) { return prev.concat([{ role: "ai", text: "총 **" + result.filtered.length + "건** 검색되었습니다.\n조건: " + result.description, type: "table", data: result.filtered, isLinkList: result.isLinkList, ts: new Date() }]); });
        }
      }
    }, 700);
  };

  var handleKeyDown = function(e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } };

  var sevColors = { low: "#30d158", medium: "#ffcc00", high: "#ff9500", critical: "#ff2d55" };

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, width: 440, height: "70vh", maxHeight: 640, background: "#0e0e18", border: "1px solid rgba(10,132,255,0.2)", borderRadius: 20, display: "flex", flexDirection: "column", zIndex: 150, boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(10,132,255,0.08)", animation: "fadeIn 0.3s" }}>
      {/* Header */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg,#0a84ff,#5e5ce6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🤖</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>보안관제 AI 어시스턴트</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>자연어로 이벤트 데이터를 분석합니다</div>
          </div>
        </div>
        <button onClick={onClose} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, width: 28, height: 28, color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px", display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.map(function(m, idx) {
          var isAi = m.role === "ai";
          return (
            <div key={idx} style={{ display: "flex", justifyContent: isAi ? "flex-start" : "flex-end" }}>
              <div style={{ maxWidth: "90%", padding: m.type === "table" ? "12px 14px" : "10px 14px", borderRadius: isAi ? "4px 14px 14px 14px" : "14px 4px 14px 14px", background: isAi ? "rgba(255,255,255,0.04)" : "rgba(10,132,255,0.15)", border: "1px solid " + (isAi ? "rgba(255,255,255,0.06)" : "rgba(10,132,255,0.25)"), fontSize: 12, lineHeight: 1.7, color: isAi ? "rgba(255,255,255,0.75)" : "#fff", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {m.type === "table" ? (
                  <div>
                    <div style={{ marginBottom: 10, fontSize: 12, lineHeight: 1.6 }}>{m.text.split("**").map(function(part, pi) { return pi % 2 === 1 ? <strong key={pi} style={{ color: "#5ac8fa" }}>{part}</strong> : part; })}</div>
                    {m.isLinkList ? (
                      /* Link list mode */
                      <div style={{ maxHeight: 260, overflowY: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
                          <thead><tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                            <th style={{ textAlign: "left", padding: "5px 6px", color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>시간</th>
                            <th style={{ textAlign: "left", padding: "5px 6px", color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>사용자</th>
                            <th style={{ textAlign: "left", padding: "5px 6px", color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>자산</th>
                            <th style={{ textAlign: "center", padding: "5px 6px", color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>위험도</th>
                          </tr></thead>
                          <tbody>{m.data.slice(0, 20).map(function(ev) {
                            return (
                              <tr key={ev.id} onClick={function() { onSelectEvent(ev.id); }} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", cursor: "pointer", transition: "background 0.2s" }}
                                onMouseEnter={function(e) { e.currentTarget.style.background = "rgba(10,132,255,0.08)"; }}
                                onMouseLeave={function(e) { e.currentTarget.style.background = "transparent"; }}>
                                <td style={{ padding: "6px", color: "rgba(255,255,255,0.5)", fontFamily: "'DM Mono',monospace" }}>{ev.timestamp.toLocaleTimeString("ko-KR",{hour:"2-digit",minute:"2-digit"})}</td>
                                <td style={{ padding: "6px" }}><span style={{ color: "#fff", fontWeight: 600 }}>{ev.employee.name}</span><span style={{ color: "rgba(255,255,255,0.3)", marginLeft: 4 }}>{ev.employee.department}</span></td>
                                <td style={{ padding: "6px", color: "rgba(255,255,255,0.5)" }}>{ev.asset.name}</td>
                                <td style={{ padding: "6px", textAlign: "center" }}><span style={{ padding: "1px 6px", borderRadius: 4, fontSize: 9, fontWeight: 700, color: sevColors[ev.eventType.severity], background: sevColors[ev.eventType.severity] + "15" }}>{ev.riskScore}</span></td>
                              </tr>
                            );
                          })}</tbody>
                        </table>
                      </div>
                    ) : (
                      /* Standard table mode */
                      <div style={{ maxHeight: 260, overflowY: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
                          <thead><tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                            <th style={{ textAlign: "left", padding: "5px 6px", color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>#</th>
                            <th style={{ textAlign: "left", padding: "5px 6px", color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>이름</th>
                            <th style={{ textAlign: "left", padding: "5px 6px", color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>부서</th>
                            <th style={{ textAlign: "left", padding: "5px 6px", color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>행위</th>
                            <th style={{ textAlign: "left", padding: "5px 6px", color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>대상</th>
                            <th style={{ textAlign: "center", padding: "5px 6px", color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>위험도</th>
                            <th style={{ textAlign: "left", padding: "5px 6px", color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>시간</th>
                          </tr></thead>
                          <tbody>{m.data.slice(0, 20).map(function(ev, ei) {
                            var sc = sevColors[ev.eventType.severity] || "#fff";
                            return (
                              <tr key={ev.id} onClick={function() { onSelectEvent(ev.id); }} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", cursor: "pointer", transition: "background 0.2s" }}
                                onMouseEnter={function(e) { e.currentTarget.style.background = "rgba(10,132,255,0.08)"; }}
                                onMouseLeave={function(e) { e.currentTarget.style.background = "transparent"; }}>
                                <td style={{ padding: "6px", color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono',monospace" }}>{ei + 1}</td>
                                <td style={{ padding: "6px", fontWeight: 600 }}>{ev.employee.name}</td>
                                <td style={{ padding: "6px", color: "rgba(255,255,255,0.45)" }}>{ev.employee.department}</td>
                                <td style={{ padding: "6px" }}><span style={{ color: sc }}>{ev.eventType.icon} {ev.eventType.label}</span></td>
                                <td style={{ padding: "6px", color: "rgba(255,255,255,0.45)", maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ev.asset.name}</td>
                                <td style={{ padding: "6px", textAlign: "center" }}><span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700, color: sc, background: sc + "18", border: "1px solid " + sc + "30" }}>{ev.riskScore}</span></td>
                                <td style={{ padding: "6px", color: "rgba(255,255,255,0.35)", fontFamily: "'DM Mono',monospace", fontSize: 9 }}>{ev.timestamp.toLocaleTimeString("ko-KR",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}</td>
                              </tr>
                            );
                          })}</tbody>
                        </table>
                        {m.data.length > 20 && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", textAlign: "center", marginTop: 6 }}>외 {m.data.length - 20}건 더 있음</div>}
                      </div>
                    )}
                    <div style={{ marginTop: 8, fontSize: 10, color: "rgba(10,132,255,0.6)" }}>💡 행을 클릭하면 해당 이벤트의 상세 정보를 확인할 수 있습니다</div>
                  </div>
                ) : (
                  <span>{m.text}</span>
                )}
              </div>
            </div>
          );
        })}
        {typing && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{ padding: "10px 14px", borderRadius: "4px 14px 14px 14px", background: "rgba(10,132,255,0.06)", border: "1px solid rgba(10,132,255,0.15)", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 14, height: 14, border: "2px solid rgba(10,132,255,0.3)", borderTop: "2px solid #0a84ff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
              <span style={{ fontSize: 11, color: "#5ac8fa", fontWeight: 500 }}>{typingMsg}</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick actions */}
      <div style={{ padding: "6px 16px", display: "flex", gap: 5, flexWrap: "wrap", flexShrink: 0 }}>
        {["위험점수 80점 이상 정리", "외부 공유 링크 목록", "USB 복사 이벤트", "심각 등급 이벤트", "기밀 자산 접근"].map(function(q) {
          return <button key={q} onClick={function() { setInput(q); }} style={{ padding: "4px 10px", borderRadius: 8, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)", fontSize: 10, cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={function(e) { e.currentTarget.style.borderColor = "rgba(10,132,255,0.3)"; e.currentTarget.style.color = "#5ac8fa"; }}
            onMouseLeave={function(e) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}>
            {q}
          </button>;
        })}
      </div>

      {/* Input */}
      <div style={{ padding: "10px 16px 14px", borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0, display: "flex", gap: 8, alignItems: "flex-end" }}>
        <textarea value={input} onChange={function(e) { setInput(e.target.value); }} onKeyDown={handleKeyDown} placeholder="이벤트 데이터를 질의하세요..." rows={1} style={{ flex: 1, padding: "10px 14px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", fontSize: 12, lineHeight: 1.5, resize: "none", outline: "none", fontFamily: "'Pretendard',sans-serif", boxSizing: "border-box" }} />
        <button onClick={handleSend} disabled={!input.trim() || typing} style={{ width: 38, height: 38, borderRadius: 10, border: "none", background: input.trim() && !typing ? "linear-gradient(135deg,#0a84ff,#5e5ce6)" : "rgba(255,255,255,0.04)", color: input.trim() && !typing ? "#fff" : "rgba(255,255,255,0.2)", fontSize: 16, cursor: input.trim() && !typing ? "pointer" : "default", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>↑</button>
      </div>
    </div>
  );
}

// Main App

export default function SecurityDashboard(props) {
  var onBack = props && props.onBack;
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
  var stChatOpen = useState(false);
  var chatOpen = stChatOpen[0], setChatOpen = stChatOpen[1];
  var stSearch = useState("");
  var searchText = stSearch[0], setSearchText = stSearch[1];
  var stSeverity = useState("all");
  var filterSeverity = stSeverity[0], setFilterSeverity = stSeverity[1];
  var stEventType = useState("all");
  var filterEventType = stEventType[0], setFilterEventType = stEventType[1];
  var feedRef = useRef(null);
  var stDashTab = useState("monitor");
  var dashTab = stDashTab[0], setDashTab = stDashTab[1];
  var stDataSubTab = useState("employees");
  var dataSubTab = stDataSubTab[0], setDataSubTab = stDataSubTab[1];
  var stDataSearch = useState("");
  var dataSearch = stDataSearch[0], setDataSearch = stDataSearch[1];
  var stDataPage = useState(0);
  var dataPage = stDataPage[0], setDataPage = stDataPage[1];
  var stSearchMode = useState("name");
  var searchMode = stSearchMode[0], setSearchMode = stSearchMode[1];
  var graphCanvasRef = useRef(null);
  var stGraphHover = useState(null);
  var graphHover = stGraphHover[0], setGraphHover = stGraphHover[1];
  var stGraphSelected = useState(null);
  var graphSelected = stGraphSelected[0], setGraphSelected = stGraphSelected[1];
  var stCollapsed = useState({ compliance: true, integration: true, layer7: true });
  var collapsedPanels = stCollapsed[0], setCollapsedPanels = stCollapsed[1];
  var togglePanel = function(key) { setCollapsedPanels(function(p) { var n = Object.assign({}, p); n[key] = !n[key]; return n; }); };

  var addEvent = useCallback(function() {
    setEvents(function(p) { return [generateEvent(employees, p)].concat(p).slice(0, 500); });
    setTotalToday(function(p) { return p + 1; });
  }, [employees]);

  useEffect(function() {
    var init = [];
    for (var i = 0; i < 15; i++) {
      var e = generateEvent(employees, init);
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
      if (searchMode === "name") { if (e.employee.name.toLowerCase().indexOf(q) === -1) return false; }
      else if (searchMode === "dept") { if (e.employee.department.toLowerCase().indexOf(q) === -1) return false; }
      else if (searchMode === "id") { if (e.employee.id.toLowerCase().indexOf(q) === -1) return false; }
      else { if (e.employee.name.toLowerCase().indexOf(q) === -1 && e.employee.department.toLowerCase().indexOf(q) === -1 && e.employee.id.toLowerCase().indexOf(q) === -1) return false; }
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

      {/* AI ChatBot */}
      {chatOpen && <SecurityChatBot events={events} employees={employees} onSelectEvent={function(evId) { setChatOpen(false); setExpandedId(evId); }} onClose={function() { setChatOpen(false); }} />}

      {/* Floating Chat Button */}
      {!chatOpen && (
        <button onClick={function() { setChatOpen(true); }} style={{ position: "fixed", bottom: 24, right: 24, width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg,#0a84ff,#5e5ce6)", border: "none", color: "#fff", fontSize: 24, cursor: "pointer", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 28px rgba(10,132,255,0.4), 0 0 20px rgba(10,132,255,0.15)", transition: "all 0.2s", animation: "fadeIn 0.4s" }}
          onMouseEnter={function(e) { e.currentTarget.style.transform = "scale(1.08)"; }}
          onMouseLeave={function(e) { e.currentTarget.style.transform = "scale(1)"; }}>
          🤖
          <div style={{ position: "absolute", top: -4, right: -4, width: 14, height: 14, borderRadius: "50%", background: "#30d158", border: "2px solid #0e0e18", animation: "pulse 2s infinite" }} />
        </button>
      )}

      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(10,10,15,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "12px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {onBack && <button onClick={onBack} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:"#fff",padding:"5px 12px",borderRadius:7,fontSize:11,fontWeight:500,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              DMP
            </button>}
            <div style={{ width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg,#ff2d55,#ff6b35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, boxShadow: "0 4px 15px rgba(255,45,85,0.3)" }}>S</div>
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

      {/* Tab Bar */}
      <div style={{ position: "sticky", top: 58, zIndex: 99, background: "rgba(10,10,15,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 24px", display: "flex", gap: 0 }}>
        {[["monitor", "🛡️ 실시간 감시"], ["data", "📊 데이터 뷰어"], ["graph", "🧠 지식 그래프"]].map(function(t) {
          var active = dashTab === t[0];
          return <button key={t[0]} onClick={function() { setDashTab(t[0]); }} style={{ padding: "10px 20px", fontSize: 13, fontWeight: active ? 700 : 500, color: active ? "#fff" : "rgba(255,255,255,0.4)", background: "transparent", border: "none", borderBottom: active ? "2px solid #0a84ff" : "2px solid transparent", cursor: "pointer", transition: "all 0.2s", letterSpacing: 0.3 }}>{t[1]}</button>;
        })}
      </div>

      {dashTab === "monitor" && <div style={{ padding: "16px 24px", position: "relative", zIndex: 1 }}>
        {/* Real-time Risk Chart - HERO */}
        <div style={Object.assign({}, panelStyle, { padding: "16px 18px", marginBottom: 16, border: "1px solid rgba(10,132,255,0.15)", background: "rgba(10,132,255,0.04)" })}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#0a84ff", boxShadow: "0 0 10px #0a84ff, 0 0 20px rgba(10,132,255,0.3)", animation: "pulse 1.5s infinite" }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>실시간 위험도 추이</span>
              <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 8, background: "rgba(10,132,255,0.15)", color: "#5ac8fa", fontWeight: 700 }}>AI 분석</span>
            </div>
            {/* Compact stats inline */}
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: 2, background: "#0a84ff" }} />
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>이벤트</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: "#0a84ff", fontFamily: "'DM Mono',monospace" }}>{totalToday}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: 2, background: "#ff2d55" }} />
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>심각</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: "#ff2d55", fontFamily: "'DM Mono',monospace" }}>{crit}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: 2, background: "#ff9500" }} />
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>높음</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: "#ff9500", fontFamily: "'DM Mono',monospace" }}>{high}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: 2, background: "#5e5ce6" }} />
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>활성</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: "#5e5ce6", fontFamily: "'DM Mono',monospace" }}>{active}</span>
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)" }}>/{employees.length.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <LiveRiskChart events={events} />
        </div>

        {/* Search & Filters */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 0, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, overflow: "hidden" }}>
            {[["name", "이름"], ["dept", "부서"], ["id", "사번"]].map(function(m) {
              var active = searchMode === m[0];
              return <button key={m[0]} onClick={function() { setSearchMode(m[0]); }} style={{ padding: "8px 10px", fontSize: 10, fontWeight: active ? 700 : 500, color: active ? "#0a84ff" : "rgba(255,255,255,0.4)", background: active ? "rgba(10,132,255,0.12)" : "transparent", border: "none", cursor: "pointer", borderRight: "1px solid rgba(255,255,255,0.06)" }}>{m[1]}</button>;
            })}
          </div>
          <div style={{ position: "relative", flex: 1 }}>
            <input value={searchText} onChange={function(e) { setSearchText(e.target.value); }} placeholder={searchMode === "name" ? "이름으로 검색..." : searchMode === "dept" ? "부서명으로 검색..." : "사번으로 검색..."} style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 12, outline: "none", fontFamily: "'Pretendard',sans-serif", boxSizing: "border-box" }} />
          </div>
          <button onClick={function() { /* search is live */ }} style={{ padding: "6px 14px", borderRadius: 7, background: "#3b82f6", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer", border: "none" }}>{"🔍"} 검색</button>
          <button onClick={function() { setSearchText(""); setFilterSeverity("all"); setFilterEventType("all"); setSearchMode("name"); }} style={{ padding: "6px 14px", borderRadius: 7, background: "rgba(255,45,85,0.1)", border: "1px solid rgba(255,45,85,0.2)", color: "#ff2d55", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>초기화</button>
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
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", whiteSpace: "nowrap" }}>결과: {filtered.length}건</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}>
          {/* Feed */}
          <div>
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

          {/* Sidebar — 위험도 게이지 + TOP5 사용자만 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={Object.assign({}, panelStyle, { padding: 12 })}><div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>전체 위험도 게이지</div><div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>최근 20건 기준</div><RiskGauge events={events} /></div>
            <div style={Object.assign({}, panelStyle, { padding: 12 })}><div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>🔴 고위험 사용자 TOP 5</div><div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>최고 위험 점수 기준</div><TopRiskUsers events={events} onMsg={function(u, t) { setMessageModal({ user: u, recipientType: t }); }} /></div>
          </div>
        </div>

        {/* ═══ 피드 하단 영역 1: 이벤트 유형 분포 + 고위험 부서 ═══ */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
          <div style={Object.assign({}, panelStyle, { padding: 14 })}>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>📊 이벤트 유형 분포</div>
            {EVENT_TYPES.map(function(et) {
              var cnt = events.filter(function(e) { return e.eventType.type === et.type; }).length;
              var sc = { low: "#30d158", medium: "#ffcc00", high: "#ff9500", critical: "#ff2d55" };
              return (
                <div key={et.type} style={{ marginBottom: 5 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)" }}>{et.icon} {et.label}</span>
                    <span style={{ fontSize: 11, color: sc[et.severity], fontFamily: "monospace", fontWeight: 700 }}>{cnt}</span>
                  </div>
                  <MiniBar value={cnt} max={Math.max(1, Math.max.apply(null, EVENT_TYPES.map(function(t) { return events.filter(function(e) { return e.eventType.type === t.type; }).length; })))} color={sc[et.severity]} />
                </div>
              );
            })}
          </div>
          <div style={Object.assign({}, panelStyle, { padding: 14 })}>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>🏢 고위험 부서 TOP 5</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 8 }}>평균 위험 점수 기준</div>
            <TopRiskDepts events={events} />
          </div>
        </div>

        {/* ═══ 피드 하단 영역 2: 법규 준수 + 시스템 연동 + 7Layer ═══ */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginTop: 14 }}>
          <div style={Object.assign({}, panelStyle, { padding: 14 })}>
            <div onClick={function() { togglePanel("compliance"); }} style={{ fontSize: 12, fontWeight: 700, marginBottom: collapsedPanels.compliance ? 0 : 8, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>{"📋"} 법규 준수 현황</span>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", transform: collapsedPanels.compliance ? "rotate(-90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>{"▼"}</span>
            </div>
            {!collapsedPanels.compliance && [
              {icon:"✅",label:"접근 로그 기록",status:"활성",color:"#30d158"},
              {icon:"✅",label:"이벤트 모니터링",status:"실시간",color:"#30d158"},
              {icon:"⚠️",label:"데이터 보유기한",status:"500건 제한",color:"#ff9f0a"},
              {icon:"⚠️",label:"직원 동의 절차",status:"미구현",color:"#ff9f0a"},
              {icon:"❌",label:"감사 추적 시스템",status:"미연동",color:"#ff2d55"},
              {icon:"❌",label:"개인정보 영향평가",status:"미실시",color:"#ff2d55"},
            ].map(function(item,idx){
              return(<div key={idx} style={{display:"flex",alignItems:"center",gap:6,padding:"4px 0",borderBottom:idx<5?"1px solid rgba(255,255,255,0.04)":"none"}}>
                <span style={{fontSize:11,flexShrink:0}}>{item.icon}</span>
                <span style={{fontSize:10,color:"rgba(255,255,255,0.6)",flex:1}}>{item.label}</span>
                <span style={{fontSize:9,color:item.color,fontWeight:600}}>{item.status}</span>
              </div>);
            })}
          </div>
          <div style={Object.assign({}, panelStyle, { padding: 14 })}>
            <div onClick={function() { togglePanel("integration"); }} style={{ fontSize: 12, fontWeight: 700, marginBottom: collapsedPanels.integration ? 0 : 8, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>{"🔗"} 시스템 연동 현황</span>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", transform: collapsedPanels.integration ? "rotate(-90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>{"▼"}</span>
            </div>
            {!collapsedPanels.integration && [
              {icon:"🟢",label:"이벤트 로그",status:"연동",color:"#30d158"},
              {icon:"🟡",label:"SIEM",status:"준비중",color:"#ff9f0a"},
              {icon:"🟡",label:"IAM",status:"준비중",color:"#ff9f0a"},
              {icon:"🟡",label:"DLP",status:"준비중",color:"#ff9f0a"},
              {icon:"🟡",label:"HR Portal",status:"준비중",color:"#ff9f0a"},
              {icon:"🟡",label:"메일/메신저",status:"준비중",color:"#ff9f0a"},
            ].map(function(item,idx){
              return(<div key={idx} style={{display:"flex",alignItems:"center",gap:6,padding:"4px 0",borderBottom:idx<5?"1px solid rgba(255,255,255,0.04)":"none"}}>
                <span style={{fontSize:10,flexShrink:0}}>{item.icon}</span>
                <span style={{fontSize:10,color:"rgba(255,255,255,0.6)",flex:1}}>{item.label}</span>
                <span style={{fontSize:9,color:item.color,fontWeight:600}}>{item.status}</span>
              </div>);
            })}
          </div>
          <div style={Object.assign({}, panelStyle, { padding: 14 })}>
            <div onClick={function() { togglePanel("layer7"); }} style={{ fontSize: 12, fontWeight: 700, marginBottom: collapsedPanels.layer7 ? 0 : 8, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>📡 7 Layer 데이터 상태</span>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", transform: collapsedPanels.layer7 ? "rotate(-90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>{"▼"}</span>
            </div>
            {!collapsedPanels.layer7 && [{ n: 1, name: "사용자/조직", s: "active" }, { n: 2, name: "권한/IAM", s: "active" }, { n: 3, name: "자산 메타", s: "active" }, { n: 4, name: "행동 로그", s: "streaming" }, { n: 5, name: "기준선", s: "active" }, { n: 6, name: "업무 Context", s: "active" }, { n: 7, name: "대응 Playbook", s: "active" }].map(function(l) {
              return (
                <div key={l.n} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 0", borderBottom: l.n < 7 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                  <div style={{ width: 18, height: 18, borderRadius: 4, background: "rgba(10,132,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#0a84ff", fontWeight: 700 }}>{l.n}</div>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", flex: 1 }}>{l.name}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                    {l.s === "streaming" && <PulsingDot color="#0a84ff" />}
                    <span style={{ fontSize: 8, fontWeight: 700, color: l.s === "streaming" ? "#0a84ff" : "#30d158" }}>{l.s === "streaming" ? "LIVE" : "OK"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>}

      {/* Data Viewer Tab */}
      {dashTab === "data" && (function() {
        var DATA_PAGE_SIZE = 100;
        var subTabs = [
          { key: "employees", label: "직원DB", count: employees.length },
          { key: "assets", label: "자산DB", count: ASSETS.length },
          { key: "events", label: "이벤트 유형DB", count: EVENT_TYPES.length },
          { key: "actions", label: "조치 가이드DB", count: Object.keys(ACTION_GUIDES).length },
          { key: "compliance", label: "법규DB", count: 31 }
        ];

        var headers = {
          employees: ["사번","이름","부서","직급","고용형태","보안등급","상급자","입사일","퇴사예정","부서이동","경고횟수","성과등급"],
          assets: ["자산명","유형","보안등급","민감도","관리시작","최근감사","접근가능부서"],
          events: ["이벤트","코드","심각도","기본점수","가중치(%)","설명"],
          actions: ["조치명","긴급도","예상시간","설명","단계수"],
          compliance: ["법규/기준","조항","요구사항","준수상태","비고"]
        };

        var complianceData = [
          // 개인정보보호법
          ["개인정보보호법","제15조","개인정보 수집·이용 동의","⚠️ 미구현","직원 모니터링 사전 동의 필요"],
          ["개인정보보호법","제17조","개인정보 제3자 제공 동의","⚠️ 미구현","외부 기관 공유 시 동의"],
          ["개인정보보호법","제21조","개인정보 파기","⚠️ 일부 적용","이벤트 500건 제한, 장기보관 미설정"],
          ["개인정보보호법","제24조의2","주민등록번호 처리 제한","✅ 해당없음","주민번호 미수집"],
          ["개인정보보호법","제29조","안전조치 의무","⚠️ 일부 적용","접근통제 구현, 암호화 미적용"],
          ["개인정보보호법","제34조","개인정보 유출 통지","❌ 미구현","유출 시 72시간 내 통지 시스템 없음"],
          ["개인정보보호법","제35조","개인정보 열람 요구권","❌ 미구현","직원의 자기정보 열람 기능 없음"],
          ["개인정보보호법","제36조","개인정보 정정·삭제 요구권","❌ 미구현",""],
          ["개인정보보호법","제37조","개인정보 처리정지 요구권","❌ 미구현",""],
          // 정보통신망법
          ["정보통신망법","제28조","개인정보 보호조치","✅ 적용","접근로그 기록 중"],
          ["정보통신망법","제28조의2","접속기록 보관","⚠️ 일부 적용","6개월 보관 의무, 현재 메모리만"],
          ["정보통신망법","제49조","비밀침해 금지","⚠️ 주의필요","모니터링 범위 법적 검토 필요"],
          // 신용정보법
          ["신용정보법","제19조","신용정보 관리 의무","✅ 적용","고객계좌DB 접근 통제"],
          ["신용정보법","제32조","개인신용정보 제공·이용","⚠️ 일부 적용","내부 이용 기준 명확화 필요"],
          // 전자금융거래법
          ["전자금융거래법","제21조","안전성 확보 의무","✅ 적용","접근통제 + 모니터링"],
          ["전자금융거래법","제21조의3","전자금융사고 보고","❌ 미구현","금융위 보고 자동화 없음"],
          // 산업기술보호법
          ["산업기술보호법","제11조","산업기술 유출 방지","✅ 적용","기술설계도·소스코드 모니터링"],
          ["산업기술보호법","제14조","산업기술 유출 신고","⚠️ 일부 적용","신고 프로세스 수동"],
          ["산업기술보호법","제34조","벌칙 (유출 시)","✅ 참조","벌금/징역 기준 안내 가능"],
          // 근로기준법
          ["근로기준법","제93조","취업규칙 (감시 고지)","⚠️ 미구현","취업규칙에 모니터링 명시 필요"],
          ["근로기준법","제94조","취업규칙 불이익 변경","⚠️ 주의필요","과반수 동의 필요"],
          // ISMS-P
          ["ISMS-P","2.5.1","사용자 인증","✅ 적용","IAM 연계 (준비중)"],
          ["ISMS-P","2.5.4","접근권한 관리","✅ 적용","역할-자산 매트릭스 구현"],
          ["ISMS-P","2.6.1","접근통제 정책","✅ 적용","DEPT_ASSETS 기반"],
          ["ISMS-P","2.9.1","보안사고 대응","⚠️ 일부 적용","조치가이드 11종, 자동화 미완"],
          ["ISMS-P","2.11.1","개인정보 보호대책","⚠️ 일부 적용","영향평가 미실시"],
          // ISO 27001
          ["ISO 27001","A.7.2","고용 중 보안","⚠️ 일부 적용","HR 연계 준비중"],
          ["ISO 27001","A.8.1","자산 관리","✅ 적용","25개 자산 분류·등급 관리"],
          ["ISO 27001","A.9.2","사용자 접근 관리","✅ 적용","보안등급 4단계"],
          ["ISO 27001","A.12.4","로그 및 모니터링","✅ 적용","실시간 이벤트 감시"],
          ["ISO 27001","A.16.1","보안사고 관리","⚠️ 일부 적용","조치가이드 있으나 실행 미연동"],
        ];

        var getRows = function() {
          if (dataSubTab === "employees") {
            var sortedEmployees = [].concat(employees).sort(function(a,b) {
              if (a.department !== b.department) return a.department.localeCompare(b.department);
              if (a.role !== b.role) return a.role.localeCompare(b.role);
              return a.employmentType.localeCompare(b.employmentType);
            });
            return sortedEmployees.map(function(emp) {
              return [emp.id, emp.name, emp.department, emp.role, emp.employmentType, emp.clearanceLevel, emp.managerId, emp.profile.hireDate.toLocaleDateString("ko-KR"), emp.profile.resignPlanned ? "예" : "아니오", emp.profile.recentTransfer ? "있음" : "없음", emp.profile.warningCount, emp.profile.performanceRating];
            });
          } else if (dataSubTab === "assets") {
            return ASSETS.map(function(a) {
              var depts = [];
              Object.keys(DEPT_ASSETS).forEach(function(d) { if (DEPT_ASSETS[d].indexOf(a.name) !== -1) depts.push(d); });
              return [a.name, a.type, a.classification, a.sensitivity, a.since || "-", a.lastAudit || "-", depts.join(", ") || "-"];
            });
          } else if (dataSubTab === "events") {
            return EVENT_TYPES.map(function(et, i) {
              var baseScore = ({low:15,medium:30,high:55,critical:75})[et.severity] || 20;
              return [et.icon + " " + et.label, et.type, et.severity, baseScore, EVENT_WEIGHTS[i] || 0, et.label];
            });
          } else if (dataSubTab === "actions") {
            var urgMap = {"관리자 확인 요청":"low","추가 MFA 인증":"medium","접근 일시 제한":"high","계정 잠금":"critical","감사 로그 자동 생성":"medium","HR 연계 조사 요청":"high","데이터 백업 격리":"high","포렌식 조사 의뢰":"critical","보안교육 지정":"low","CISO 긴급 보고":"critical","외부 신고":"critical"};
            return Object.keys(ACTION_GUIDES).map(function(name) {
              var g = ACTION_GUIDES[name];
              return [name, urgMap[name] || "medium", g.estimatedTime, g.summary.slice(0, 50) + "...", g.steps.length];
            });
          } else {
            return complianceData;
          }
        };

        var allRows = getRows();
        var filteredRows = dataSearch ? allRows.filter(function(r) {
          return r.some(function(c) { return String(c).toLowerCase().indexOf(dataSearch.toLowerCase()) !== -1; });
        }) : allRows;
        var totalPages = Math.ceil(filteredRows.length / DATA_PAGE_SIZE);
        var pagedRows = filteredRows.slice(dataPage * DATA_PAGE_SIZE, (dataPage + 1) * DATA_PAGE_SIZE);

        var downloadData = function() {
          var hdr = headers[dataSubTab];
          var ws = XLSX.utils.aoa_to_sheet([hdr].concat(filteredRows));
          var wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, dataSubTab);
          XLSX.writeFile(wb, dataSubTab + "_" + new Date().toISOString().slice(0, 10) + ".xlsx");
        };

        return (
          <div style={{ padding: "16px 24px", position: "relative", zIndex: 1 }}>
            {/* Sub tabs */}
            <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
              {subTabs.map(function(st) {
                var active = dataSubTab === st.key;
                return <button key={st.key} onClick={function() { setDataSubTab(st.key); setDataPage(0); setDataSearch(""); }} style={{ padding: "8px 16px", borderRadius: 10, fontSize: 12, fontWeight: active ? 700 : 500, color: active ? "#fff" : "rgba(255,255,255,0.5)", background: active ? "rgba(10,132,255,0.2)" : "rgba(255,255,255,0.04)", border: active ? "1px solid rgba(10,132,255,0.4)" : "1px solid rgba(255,255,255,0.06)", cursor: "pointer" }}>
                  {st.label} <span style={{ fontSize: 10, color: active ? "#5ac8fa" : "rgba(255,255,255,0.3)", marginLeft: 4 }}>({st.count})</span>
                </button>;
              })}
            </div>

            {/* Search + Download */}
            <div style={{ display: "flex", gap: 10, marginBottom: 14, alignItems: "center" }}>
              <input value={dataSearch} onChange={function(e) { setDataSearch(e.target.value); setDataPage(0); }} placeholder={"검색..."} style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 12, outline: "none", boxSizing: "border-box" }} />
              <button onClick={downloadData} style={{ padding: "8px 16px", borderRadius: 8, background: "rgba(48,209,88,0.12)", border: "1px solid rgba(48,209,88,0.25)", color: "#30d158", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>XLSX 다운로드 ({filteredRows.length}건)</button>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{filteredRows.length}건 중 {dataPage * DATA_PAGE_SIZE + 1}~{Math.min((dataPage + 1) * DATA_PAGE_SIZE, filteredRows.length)}</div>
            </div>

            {/* Table */}
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                  <thead>
                    <tr style={{ background: "rgba(255,255,255,0.04)" }}>
                      {headers[dataSubTab].map(function(h) {
                        return <th key={h} style={{ textAlign: "left", padding: "10px 12px", color: "rgba(255,255,255,0.5)", fontWeight: 600, fontSize: 10, borderBottom: "1px solid rgba(255,255,255,0.06)", whiteSpace: "nowrap" }}>{h}</th>;
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {pagedRows.map(function(row, ri) {
                      return (
                        <tr key={ri} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                          onMouseEnter={function(e) { e.currentTarget.style.background = "rgba(10,132,255,0.04)"; }}
                          onMouseLeave={function(e) { e.currentTarget.style.background = "transparent"; }}>
                          {row.map(function(cell, ci) {
                            return <td key={ci} style={{ padding: "8px 12px", color: "rgba(255,255,255,0.7)", fontSize: 11, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cell}</td>;
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 14, alignItems: "center" }}>
                <button onClick={function() { setDataPage(Math.max(0, dataPage - 1)); }} disabled={dataPage === 0} style={{ padding: "6px 12px", borderRadius: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: dataPage === 0 ? "rgba(255,255,255,0.2)" : "#fff", fontSize: 11, cursor: dataPage === 0 ? "default" : "pointer" }}>&lt;</button>
                {Array.from({ length: Math.min(totalPages, 10) }, function(_, i) {
                  var page = totalPages <= 10 ? i : Math.max(0, Math.min(dataPage - 4, totalPages - 10)) + i;
                  return <button key={page} onClick={function() { setDataPage(page); }} style={{ padding: "6px 10px", borderRadius: 6, background: page === dataPage ? "rgba(10,132,255,0.2)" : "rgba(255,255,255,0.04)", border: page === dataPage ? "1px solid rgba(10,132,255,0.4)" : "1px solid rgba(255,255,255,0.06)", color: page === dataPage ? "#0a84ff" : "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: page === dataPage ? 700 : 400, cursor: "pointer" }}>{page + 1}</button>;
                })}
                <button onClick={function() { setDataPage(Math.min(totalPages - 1, dataPage + 1)); }} disabled={dataPage >= totalPages - 1} style={{ padding: "6px 12px", borderRadius: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: dataPage >= totalPages - 1 ? "rgba(255,255,255,0.2)" : "#fff", fontSize: 11, cursor: dataPage >= totalPages - 1 ? "default" : "pointer" }}>&gt;</button>
              </div>
            )}
          </div>
        );
      })()}

      {/* Knowledge Graph Tab */}
      {dashTab === "graph" && (function() {
        var canvasW = 1100, canvasH = 700;

        // Build nodes
        var nodes = [];
        var edges = [];

        // Top 10 high-risk employees (based on recent events - weighted sum)
        var empScores = {};
        events.forEach(function(e, idx) {
          var recencyWeight = 1 / (1 + idx * 0.05); // More recent events weighted higher
          if (!empScores[e.employee.id]) {
            empScores[e.employee.id] = { score: 0, maxScore: 0, count: 0, emp: e.employee };
          }
          empScores[e.employee.id].score += e.riskScore * recencyWeight;
          empScores[e.employee.id].count += 1;
          if (e.riskScore > empScores[e.employee.id].maxScore) {
            empScores[e.employee.id].maxScore = e.riskScore;
            empScores[e.employee.id].emp = e.employee; // Update to latest employee data
          }
        });
        var topEmps = Object.values(empScores).sort(function(a, b) { return b.score - a.score; }).slice(0, 10);
        // Use maxScore for display
        topEmps.forEach(function(item) { item.score = item.maxScore; });

        // Departments
        var deptSet = {};
        DEPARTMENTS.forEach(function(d, i) {
          var angle = (i / DEPARTMENTS.length) * Math.PI * 2 - Math.PI / 2;
          var rx = 420, ry = 280;
          nodes.push({ id: "dept-" + d, label: d, type: "dept", x: canvasW / 2 + Math.cos(angle) * rx, y: canvasH / 2 + Math.sin(angle) * ry, w: 70, h: 26 });
          deptSet[d] = true;
        });

        // Assets in inner ring
        ASSETS.forEach(function(a, i) {
          var angle = (i / ASSETS.length) * Math.PI * 2 - Math.PI / 2;
          nodes.push({ id: "asset-" + a.name, label: a.name.slice(0, 10), type: "asset", x: canvasW / 2 + Math.cos(angle) * 200, y: canvasH / 2 + Math.sin(angle) * 150, w: 72, h: 26 });
        });

        // Event types in middle ring
        EVENT_TYPES.forEach(function(et, i) {
          var angle = (i / EVENT_TYPES.length) * Math.PI * 2 - Math.PI / 4;
          nodes.push({ id: "evt-" + et.type, label: et.label.slice(0, 8), type: "eventType", x: canvasW / 2 + Math.cos(angle) * 310, y: canvasH / 2 + Math.sin(angle) * 220, w: 20, h: 20 });
        });

        // Employees near center
        topEmps.forEach(function(item, i) {
          var angle = (i / topEmps.length) * Math.PI * 2;
          nodes.push({ id: "emp-" + item.emp.id, label: item.emp.name, type: "employee", x: canvasW / 2 + Math.cos(angle) * 100, y: canvasH / 2 + Math.sin(angle) * 70, w: 18, h: 18, score: item.score });
        });

        // Action guides
        var actionKeys = Object.keys(ACTION_GUIDES);
        actionKeys.forEach(function(name, i) {
          var angle = (i / actionKeys.length) * Math.PI * 2 + Math.PI / 3;
          nodes.push({ id: "action-" + name, label: name.slice(0, 6), type: "action", x: canvasW / 2 + Math.cos(angle) * 380, y: canvasH / 2 + Math.sin(angle) * 260, w: 60, h: 24 });
        });

        // Edges: employee -> dept (belongs)
        topEmps.forEach(function(item) {
          if (deptSet[item.emp.department]) {
            edges.push({ from: "emp-" + item.emp.id, to: "dept-" + item.emp.department, label: "소속", color: "rgba(94,92,230,0.5)" });
          }
        });

        // Edges: employee -> asset (access from recent events)
        var empAssetEdges = {};
        events.slice(0, 50).forEach(function(e) {
          var key = e.employee.id + "|" + e.asset.name;
          if (!empAssetEdges[key] && topEmps.some(function(t) { return t.emp.id === e.employee.id; })) {
            empAssetEdges[key] = true;
            edges.push({ from: "emp-" + e.employee.id, to: "asset-" + e.asset.name, label: "접근", color: "rgba(10,132,255,0.45)" });
          }
        });

        // Edges: dept -> asset (permission)
        Object.keys(DEPT_ASSETS).forEach(function(d) {
          DEPT_ASSETS[d].forEach(function(a) {
            edges.push({ from: "dept-" + d, to: "asset-" + a, label: "권한", color: "rgba(48,209,88,0.35)" });
          });
        });

        // Edges: eventType -> asset (target) - from events
        var evtAssetEdges = {};
        events.slice(0, 30).forEach(function(e) {
          var key = e.eventType.type + "|" + e.asset.name;
          if (!evtAssetEdges[key]) {
            evtAssetEdges[key] = true;
            edges.push({ from: "evt-" + e.eventType.type, to: "asset-" + e.asset.name, label: "대상", color: "rgba(255,149,0,0.4)" });
          }
        });

        // Edges: eventType -> action (trigger)
        EVENT_TYPES.forEach(function(et) {
          var sev = et.severity;
          if (sev === "critical") {
            edges.push({ from: "evt-" + et.type, to: "action-계정 잠금", label: "트리거", color: "rgba(255,45,85,0.45)" });
          } else if (sev === "high") {
            edges.push({ from: "evt-" + et.type, to: "action-접근 일시 제한", label: "트리거", color: "rgba(255,149,0,0.4)" });
          }
        });

        var nodeMap = {};
        nodes.forEach(function(n) { nodeMap[n.id] = n; });

        var typeColors = {
          employee: "#0a84ff",
          asset: "#30d158",
          eventType: "#ff9500",
          dept: "#5e5ce6",
          action: "#ff2d55"
        };

        var typeLabels = {
          employee: "직원",
          asset: "자산",
          eventType: "이벤트유형",
          dept: "부서",
          action: "조치"
        };

        return (
          <div style={{ padding: "16px 24px", position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{"🧠"} 지식 그래프 — 데이터 관계 시각화</div>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                {Object.keys(typeColors).map(function(t) {
                  return <div key={t} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 10, height: 10, borderRadius: t === "employee" ? "50%" : t === "eventType" ? 0 : 3, background: typeColors[t], transform: t === "eventType" ? "rotate(45deg) scale(0.7)" : "none" }} />
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>{typeLabels[t]}</span>
                  </div>;
                })}
              </div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, overflow: "hidden", position: "relative" }}>
              <svg width="100%" viewBox={"0 0 " + canvasW + " " + canvasH} style={{ display: "block" }}
                onMouseMove={function(evt) {
                  var rect = evt.currentTarget.getBoundingClientRect();
                  var scaleX = canvasW / rect.width;
                  var mx = (evt.clientX - rect.left) * scaleX;
                  var my = (evt.clientY - rect.top) * scaleX;
                  var found = null;
                  nodes.forEach(function(n) {
                    var dx = mx - n.x, dy = my - n.y;
                    if (Math.abs(dx) < (n.w || 20) && Math.abs(dy) < (n.h || 20)) found = n.id;
                  });
                  setGraphHover(found);
                }}
                onClick={function(evt) {
                  var rect = evt.currentTarget.getBoundingClientRect();
                  var scaleX = canvasW / rect.width;
                  var mx = (evt.clientX - rect.left) * scaleX;
                  var my = (evt.clientY - rect.top) * scaleX;
                  var found = null;
                  nodes.forEach(function(n) {
                    var dx = mx - n.x, dy = my - n.y;
                    if (Math.abs(dx) < (n.w || 20) && Math.abs(dy) < (n.h || 20)) found = n.id;
                  });
                  setGraphSelected(graphSelected === found ? null : found);
                }}>

                {/* Edges */}
                {edges.map(function(e, i) {
                  var from = nodeMap[e.from], to = nodeMap[e.to];
                  if (!from || !to) return null;
                  var isHighlighted = graphSelected && (e.from === graphSelected || e.to === graphSelected);
                  var opacity = graphSelected ? (isHighlighted ? 1 : 0.08) : 0.7;
                  var midX = (from.x + to.x) / 2;
                  var midY = (from.y + to.y) / 2;
                  return <g key={i}>
                    <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={isHighlighted ? e.color.replace(/[\d.]+\)/, "0.9)") : e.color} strokeWidth={isHighlighted ? 3 : 1.5} opacity={opacity} />
                    {isHighlighted && <g>
                      <rect x={midX - 16} y={midY - 8} width={32} height={16} rx={4} fill="rgba(0,0,0,0.75)" />
                      <text x={midX} y={midY + 4} textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="9" fontWeight="600">{e.label}</text>
                    </g>}
                  </g>;
                })}

                {/* Nodes */}
                {nodes.map(function(n) {
                  var c = typeColors[n.type];
                  var isHovered = graphHover === n.id;
                  var isSelected = graphSelected === n.id;
                  var isConnected = graphSelected && edges.some(function(e) { return (e.from === graphSelected && e.to === n.id) || (e.to === graphSelected && e.from === n.id); });
                  var dimmed = graphSelected && !isSelected && !isConnected;
                  var nodeOpacity = dimmed ? 0.15 : 1;

                  if (n.type === "employee") {
                    return <g key={n.id} opacity={nodeOpacity}>
                      <circle cx={n.x} cy={n.y} r={isHovered || isSelected ? 18 : 14} fill={c + "30"} stroke={c} strokeWidth={isSelected ? 3 : 2} />
                      <rect x={n.x - 18} y={n.y + 16} width={36} height={16} rx={4} fill="rgba(0,0,0,0.7)" />
                      <text x={n.x} y={n.y + 28} textAnchor="middle" fill={c} fontSize="11" fontWeight="700">{n.label}</text>
                      {isHovered && <g>
                        <rect x={n.x - 50} y={n.y - 34} width={100} height={18} rx={4} fill="rgba(0,0,0,0.85)" />
                        <text x={n.x} y={n.y - 20} textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700">{n.label + " (" + "위험" + ":" + (n.score || "?") + ")"}</text>
                      </g>}
                    </g>;
                  } else if (n.type === "eventType") {
                    return <g key={n.id} opacity={nodeOpacity}>
                      <rect x={n.x - 14} y={n.y - 14} width={28} height={28} rx={3} fill={c + "30"} stroke={c} strokeWidth={isSelected ? 2.5 : 1.5} transform={"rotate(45 " + n.x + " " + n.y + ")"} />
                      <rect x={n.x - 28} y={n.y + 18} width={56} height={16} rx={4} fill="rgba(0,0,0,0.7)" />
                      <text x={n.x} y={n.y + 30} textAnchor="middle" fill={c} fontSize="10" fontWeight="600">{n.label}</text>
                      {isHovered && <g>
                        <rect x={n.x - 36} y={n.y - 32} width={72} height={18} rx={4} fill="rgba(0,0,0,0.85)" />
                        <text x={n.x} y={n.y - 18} textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700">{n.label}</text>
                      </g>}
                    </g>;
                  } else {
                    return <g key={n.id} opacity={nodeOpacity}>
                      <rect x={n.x - n.w / 2} y={n.y - n.h / 2} width={n.w} height={n.h} rx={6} fill={c + "20"} stroke={c} strokeWidth={isSelected ? 3 : 1.5} />
                      <text x={n.x} y={n.y + 5} textAnchor="middle" fill={c} fontSize="11" fontWeight="700">{n.label}</text>
                      {isHovered && <g>
                        <rect x={n.x - 40} y={n.y - n.h / 2 - 20} width={80} height={18} rx={4} fill="rgba(0,0,0,0.85)" />
                        <text x={n.x} y={n.y - n.h / 2 - 6} textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700">{n.label}</text>
                      </g>}
                    </g>;
                  }
                })}
              </svg>

              {/* Node detail tooltip */}
              {graphSelected && nodeMap[graphSelected] && (
                <div style={{ position: "absolute", top: 14, right: 14, background: "rgba(18,18,26,0.95)", border: "1px solid " + typeColors[nodeMap[graphSelected].type] + "40", borderRadius: 12, padding: 16, maxWidth: 240, animation: "fadeIn 0.3s", zIndex: 5 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: typeColors[nodeMap[graphSelected].type], marginBottom: 6 }}>{nodeMap[graphSelected].label}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>유형: {typeLabels[nodeMap[graphSelected].type]}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>
                    연결된 노드: {edges.filter(function(e) { return e.from === graphSelected || e.to === graphSelected; }).length}건
                  </div>
                  {nodeMap[graphSelected].score && <div style={{ fontSize: 10, color: "#ff2d55", marginTop: 4 }}>위험점수: {nodeMap[graphSelected].score}</div>}
                </div>
              )}
            </div>
            <div style={{background:"rgba(255,255,255,0.03)", borderRadius:12, padding:16, border:"1px solid rgba(255,255,255,0.06)", marginTop:12}}>
              <div style={{fontSize:13, fontWeight:700, color:"#e2e8f0", marginBottom:8}}>{"📖"} 지식 그래프 활용 가이드</div>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, fontSize:11.5, color:"#94a3b8", lineHeight:1.7}}>
                <div>
                  <div style={{fontWeight:600, color:"#e2e8f0", marginBottom:4}}>{"🔍"} 위협 경로 분석</div>
                  직원→자산 연결선을 통해 누가 어떤 민감 자산에 접근했는지 한눈에 파악할 수 있습니다. 비정상적인 접근 경로(부서 권한 외 자산 접근)를 시각적으로 탐지합니다.
                </div>
                <div>
                  <div style={{fontWeight:600, color:"#e2e8f0", marginBottom:4}}>{"👥"} 조직 리스크 맵</div>
                  부서→자산 권한 관계와 실제 접근 패턴을 비교하여 권한 외 접근을 식별합니다. 특정 부서에 위험 이벤트가 집중되는지 확인할 수 있습니다.
                </div>
                <div>
                  <div style={{fontWeight:600, color:"#e2e8f0", marginBottom:4}}>{"⚡"} 이벤트-조치 연계</div>
                  이벤트 유형별로 어떤 조치가 트리거되는지 확인하고, 조치 실행의 우선순위를 판단할 수 있습니다.
                </div>
                <div>
                  <div style={{fontWeight:600, color:"#e2e8f0", marginBottom:4}}>{"🎯"} 노드 클릭 활용법</div>
                  노드를 클릭하면 해당 노드와 연결된 관계만 강조됩니다. 특정 직원의 접근 자산, 특정 자산에 접근한 직원, 특정 부서의 권한 범위를 빠르게 파악할 수 있습니다.
                </div>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}
