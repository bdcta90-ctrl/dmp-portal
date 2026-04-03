import { useState, useMemo } from "react";
import { DATA_FR } from "./_data_finance_realestate.js";
import { DATA_LT } from "./_data_legal_tax.js";
import { DATA_IH } from "./_data_insurance_health.js";
import { DATA_BD } from "./_data_business_daily.js";

// ============================================================
// 무엇이든 심사받으세요 - AI 심사 시뮬레이션 플랫폼 MVP
// ============================================================

// ── Domain & Service Data ──────────────────────────────────
const DOMAINS = [
  { id: "finance", icon: "💰", label: "금융 심사" },
  { id: "realestate", icon: "🏠", label: "부동산 심사" },
  { id: "legal", icon: "⚖️", label: "법률 심사" },
  { id: "tax", icon: "📋", label: "세무 심사" },
  { id: "insurance", icon: "🛡️", label: "보험 심사" },
  { id: "health", icon: "🏥", label: "건강/복지 심사" },
  { id: "business", icon: "📊", label: "사업/창업 심사" },
  { id: "daily", icon: "🌍", label: "생활/기타 심사" },
];

const USER_TYPES = [
  { id: "personal", icon: "👤", label: "개인" },
  { id: "sole", icon: "🏪", label: "개인사업자" },
  { id: "corp", icon: "🏢", label: "법인사업자" },
];

// difficulty: 간편/표준/정밀, time in minutes
const SERVICES = {
  finance: {
    personal: [
      { name: "신용대출 심사", desc: "개인 신용등급 기반 대출 한도·금리 시뮬레이션", diff: "표준", time: 5, docs: ["신분증", "소득증빙", "재직증명서"] },
      { name: "마이너스통장 심사", desc: "마이너스통장 한도 및 이자율 시뮬레이션", diff: "간편", time: 3, docs: ["신분증", "소득증빙"] },
      { name: "자동차 할부 심사", desc: "차량 할부금융 승인 가능성 및 조건 시뮬레이션", diff: "표준", time: 5, docs: ["신분증", "소득증빙", "차량 견적서"] },
      { name: "카드 발급 심사", desc: "신용카드 발급 가능성 및 한도 시뮬레이션", diff: "간편", time: 2, docs: ["신분증", "소득증빙"] },
      { name: "학자금 대출 심사", desc: "한국장학재단 학자금 대출 적격 여부", diff: "간편", time: 3, docs: ["신분증", "재학증명서", "소득인정액"] },
      { name: "전세자금 대출 심사", desc: "전세자금 대출 한도 및 금리 시뮬레이션", diff: "표준", time: 5, docs: ["신분증", "전세계약서", "소득증빙"] },
      { name: "P2P 투자 적합성", desc: "P2P 투자자 적합성 및 한도 시뮬레이션", diff: "간편", time: 3, docs: ["신분증", "소득증빙"] },
      { name: "보험 가입 심사", desc: "보험 가입 적격 및 보험료 시뮬레이션", diff: "표준", time: 5, docs: ["신분증", "건강진단서"] },
      { name: "주택연금 가입 심사", desc: "주택연금 가입 적격 및 수령액 시뮬레이션", diff: "표준", time: 5, docs: ["신분증", "등기부등본", "주택 시세"] },
      { name: "비상금 대출 심사", desc: "소액 비상금 대출 승인 가능성 시뮬레이션", diff: "간편", time: 2, docs: ["신분증", "소득증빙"] },
    ],
    sole: [
      { name: "사업자 대출 심사", desc: "사업자 신용대출 한도·금리 시뮬레이션", diff: "표준", time: 7, docs: ["사업자등록증", "재무제표", "소득증빙"] },
      { name: "소상공인 정책자금 심사", desc: "소상공인진흥공단 정책자금 적격 여부", diff: "정밀", time: 10, docs: ["사업자등록증", "재무제표", "사업계획서"] },
      { name: "기계설비 리스 심사", desc: "설비 리스 승인 가능성 시뮬레이션", diff: "표준", time: 7, docs: ["사업자등록증", "설비견적서", "재무제표"] },
      { name: "매출채권 담보대출 심사", desc: "매출채권 기반 담보대출 한도 시뮬레이션", diff: "정밀", time: 10, docs: ["사업자등록증", "매출채권 내역", "거래처 정보"] },
      { name: "카드매출 선정산 심사", desc: "카드매출 선정산 서비스 적격 여부", diff: "간편", time: 3, docs: ["사업자등록증", "카드매출 내역"] },
      { name: "소상공인 긴급경영자금 심사", desc: "긴급경영안정자금 적격 여부 진단", diff: "표준", time: 5, docs: ["사업자등록증", "매출 감소 증빙"] },
    ],
    corp: [
      { name: "기업대출 심사", desc: "기업 신용대출 및 담보대출 시뮬레이션", diff: "정밀", time: 15, docs: ["법인등기부등본", "재무제표 3개년", "사업계획서"] },
      { name: "회사채 발행 적격 심사", desc: "회사채 발행 가능성 및 금리 시뮬레이션", diff: "정밀", time: 15, docs: ["재무제표", "신용등급 평가서", "사업계획서"] },
      { name: "신용등급 평가", desc: "기업 신용등급 사전 시뮬레이션", diff: "정밀", time: 12, docs: ["재무제표 3개년", "사업보고서"] },
      { name: "프로젝트 파이낸싱 심사", desc: "PF 대출 승인 가능성 시뮬레이션", diff: "정밀", time: 15, docs: ["사업계획서", "수익성 분석", "담보 내역"] },
      { name: "수출입 금융 심사", desc: "수출입 금융 이용 적격 여부", diff: "표준", time: 10, docs: ["수출입 실적", "거래처 정보", "L/C 사본"] },
      { name: "M&A 자금조달 심사", desc: "M&A 자금조달 구조 시뮬레이션", diff: "정밀", time: 20, docs: ["재무제표", "기업가치 평가서", "M&A 계획서"] },
    ],
  },
  realestate: {
    personal: [
      { name: "주택담보대출 심사", desc: "주택담보대출 한도·금리·상환 시뮬레이션", diff: "표준", time: 7, docs: ["신분증", "소득증빙", "등기부등본", "KB시세"] },
      { name: "전세대출 심사", desc: "전세자금 대출 적격 및 한도 시뮬레이션", diff: "표준", time: 5, docs: ["신분증", "전세계약서", "소득증빙"] },
      { name: "DSR 시뮬레이션", desc: "총부채원리금상환비율 계산 및 한도 분석", diff: "표준", time: 5, docs: ["소득증빙", "기존 대출 내역"] },
      { name: "LTV 한도 계산", desc: "담보인정비율 기반 대출 한도 계산", diff: "간편", time: 3, docs: ["등기부등본", "KB시세"] },
      { name: "청약 가점 계산", desc: "주택청약 가점 점수 시뮬레이션", diff: "간편", time: 3, docs: ["무주택기간", "부양가족수", "청약통장 가입기간"] },
      { name: "재건축 분담금 시뮬레이션", desc: "재건축 조합원 분담금 예상 계산", diff: "정밀", time: 10, docs: ["조합 정보", "기존 주택 정보", "희망 평형"] },
      { name: "양도소득세 시뮬레이션", desc: "부동산 양도 시 세금 시뮬레이션", diff: "표준", time: 5, docs: ["취득가", "양도가", "보유기간", "주택수"] },
      { name: "분양권 전매 적격", desc: "분양권 전매 가능 여부 및 세금 시뮬레이션", diff: "표준", time: 5, docs: ["분양계약서", "전매 제한 확인"] },
      { name: "주거급여 수급 자격", desc: "주거급여 수급 자격 및 금액 시뮬레이션", diff: "간편", time: 3, docs: ["소득인정액", "임대차계약서"] },
    ],
    sole: [
      { name: "상가 담보대출 심사", desc: "상가 담보대출 한도·금리 시뮬레이션", diff: "표준", time: 7, docs: ["상가 등기부등본", "임대차계약서", "소득증빙"] },
      { name: "임대사업자 등록 적격", desc: "임대사업자 등록 요건 충족 여부 진단", diff: "간편", time: 3, docs: ["부동산 보유 현황", "임대차계약서"] },
      { name: "상가 권리금 산정", desc: "상가 권리금 적정 가격 시뮬레이션", diff: "표준", time: 7, docs: ["상가 위치", "매출 내역", "업종 정보"] },
    ],
    corp: [
      { name: "부동산 PF 심사", desc: "부동산 프로젝트 파이낸싱 적격 시뮬레이션", diff: "정밀", time: 20, docs: ["사업계획서", "토지 정보", "인허가 현황"] },
      { name: "오피스 임차 조건 심사", desc: "오피스 임차 조건 적정성 분석", diff: "표준", time: 7, docs: ["임차 후보지", "재무제표", "임대차조건"] },
      { name: "부동산 감정평가 시뮬레이션", desc: "부동산 감정평가액 사전 시뮬레이션", diff: "정밀", time: 10, docs: ["등기부등본", "토지이용계획", "인근 시세"] },
    ],
  },
  legal: {
    personal: [
      { name: "소액재판 승소 가능성", desc: "소액사건 승소 확률 및 예상 판결 시뮬레이션", diff: "표준", time: 7, docs: ["분쟁 내용", "증거자료", "청구금액"] },
      { name: "이혼 재산분할 시뮬레이션", desc: "이혼 시 재산분할 비율 및 금액 시뮬레이션", diff: "정밀", time: 10, docs: ["혼인기간", "재산목록", "소득 내역"] },
      { name: "교통사고 과실비율", desc: "교통사고 과실비율 판단 시뮬레이션", diff: "표준", time: 5, docs: ["사고 상황", "블랙박스", "경찰 조서"] },
      { name: "임대차 분쟁 판단", desc: "임대차 관련 분쟁 승소 가능성 진단", diff: "표준", time: 7, docs: ["임대차계약서", "분쟁 내용", "증거자료"] },
      { name: "상속세 시뮬레이션", desc: "상속 시 세금 및 분할 시뮬레이션", diff: "정밀", time: 10, docs: ["상속재산 목록", "상속인 정보", "채무 내역"] },
      { name: "소비자 피해 구제 가능성", desc: "소비자 피해 구제 신청 성공 가능성", diff: "간편", time: 5, docs: ["피해 내용", "증빙자료", "판매자 정보"] },
      { name: "개인회생 적격 심사", desc: "개인회생 신청 적격 여부 진단", diff: "정밀", time: 10, docs: ["채무 목록", "소득 증빙", "재산 내역"] },
      { name: "개인파산 면책 가능성", desc: "개인파산 면책 결정 가능성 시뮬레이션", diff: "정밀", time: 10, docs: ["채무 목록", "소득 증빙", "파산 원인"] },
      { name: "명예훼손 소송 가능성", desc: "명예훼손 소송 승소 가능성 시뮬레이션", diff: "표준", time: 7, docs: ["피해 내용", "증거자료", "상대방 정보"] },
      { name: "의료사고 손해배상 가능성", desc: "의료사고 손해배상 청구 가능성 진단", diff: "정밀", time: 10, docs: ["진료기록", "의료 과실 정황", "피해 내역"] },
    ],
    sole: [
      { name: "상가 임대차 분쟁", desc: "상가 임대차 분쟁 판단 시뮬레이션", diff: "표준", time: 7, docs: ["임대차계약서", "분쟁 내용", "증거자료"] },
      { name: "프랜차이즈 분쟁 판단", desc: "프랜차이즈 가맹 분쟁 해결 가능성", diff: "정밀", time: 10, docs: ["가맹계약서", "분쟁 내용", "매출 자료"] },
      { name: "근로기준법 위반 리스크", desc: "근로기준법 위반 가능성 및 과태료 시뮬레이션", diff: "표준", time: 7, docs: ["근로계약서", "급여대장", "근무시간 기록"] },
    ],
    corp: [
      { name: "공정거래 위반 리스크", desc: "공정거래법 위반 가능성 진단", diff: "정밀", time: 12, docs: ["거래 구조", "계약서", "시장 점유율"] },
      { name: "지식재산권 침해 판단", desc: "특허·상표·저작권 침해 가능성 진단", diff: "정밀", time: 10, docs: ["지재권 정보", "침해 의심 내용", "관련 자료"] },
      { name: "계약 리스크 분석", desc: "계약서 리스크 조항 분석 및 진단", diff: "표준", time: 7, docs: ["계약서 사본", "거래 조건"] },
      { name: "노동쟁의 리스크", desc: "노동쟁의 발생 가능성 및 대응 시뮬레이션", diff: "정밀", time: 10, docs: ["노동조합 현황", "근로조건", "분쟁 이력"] },
    ],
  },
  tax: {
    personal: [
      { name: "종합소득세 시뮬레이션", desc: "종합소득세 예상 세액 계산", diff: "표준", time: 5, docs: ["소득 내역", "공제 항목"] },
      { name: "연말정산 최적화", desc: "연말정산 환급액 최적화 시뮬레이션", diff: "표준", time: 7, docs: ["급여명세서", "공제 증빙", "카드 사용 내역"] },
      { name: "증여세 시뮬레이션", desc: "증여 시 세금 계산 시뮬레이션", diff: "표준", time: 5, docs: ["증여 재산", "증여자/수증자 관계", "사전 증여 이력"] },
      { name: "상속세 시뮬레이션", desc: "상속재산 규모별 상속세 계산", diff: "정밀", time: 10, docs: ["상속재산 목록", "상속인 정보", "채무 내역"] },
      { name: "양도소득세 시뮬레이션", desc: "양도소득세 예상 세액 계산", diff: "표준", time: 5, docs: ["취득가", "양도가", "보유기간"] },
      { name: "금융소득 종합과세 시뮬레이션", desc: "금융소득 종합과세 해당 여부 및 세액 계산", diff: "표준", time: 5, docs: ["이자소득", "배당소득", "기타 소득"] },
      { name: "해외주식 양도세 시뮬레이션", desc: "해외주식 양도소득세 예상 세액 계산", diff: "간편", time: 3, docs: ["매수가", "매도가", "거래 내역"] },
    ],
    sole: [
      { name: "부가세 신고 시뮬레이션", desc: "부가가치세 예상 납부액 계산", diff: "표준", time: 5, docs: ["매출/매입 내역", "세금계산서"] },
      { name: "종합소득세 절세", desc: "개인사업자 종합소득세 절세 방안", diff: "표준", time: 7, docs: ["사업소득 내역", "경비 내역", "공제 항목"] },
      { name: "간이과세 전환 적격", desc: "간이과세자 전환 적격 여부 진단", diff: "간편", time: 3, docs: ["매출 내역", "업종 정보"] },
      { name: "세무조사 리스크 진단", desc: "세무조사 대상 선정 가능성 진단", diff: "정밀", time: 10, docs: ["매출 내역", "신고 이력", "업종 정보"] },
    ],
    corp: [
      { name: "법인세 시뮬레이션", desc: "법인세 예상 세액 계산", diff: "표준", time: 7, docs: ["재무제표", "세무 조정 내역"] },
      { name: "이전가격 리스크", desc: "이전가격 세무 리스크 진단", diff: "정밀", time: 15, docs: ["관계사 거래 내역", "이전가격 보고서"] },
      { name: "세무조사 대비 진단", desc: "세무조사 대비 취약점 진단", diff: "정밀", time: 15, docs: ["재무제표 3개년", "세무 조정 내역", "주요 거래 내역"] },
      { name: "R&D 세액공제 적격", desc: "연구개발비 세액공제 적격 여부 진단", diff: "표준", time: 7, docs: ["R&D 과제 내역", "인력 현황", "비용 내역"] },
    ],
  },
  insurance: {
    personal: [
      { name: "생명보험 가입 심사", desc: "생명보험 가입 적격 및 보험료 시뮬레이션", diff: "표준", time: 5, docs: ["건강 정보", "직업 정보", "가족력"] },
      { name: "실손보험 가입 적격", desc: "실손의료보험 가입 적격 여부 진단", diff: "간편", time: 3, docs: ["건강 정보", "기존 보험 가입 현황"] },
      { name: "자동차보험 할인/할증", desc: "자동차보험 할인·할증 시뮬레이션", diff: "간편", time: 3, docs: ["운전 경력", "사고 이력", "차량 정보"] },
      { name: "운전자보험 필요성", desc: "운전자보험 필요성 및 보장 분석", diff: "간편", time: 3, docs: ["운전 빈도", "차량 정보"] },
      { name: "여행자보험 보장 분석", desc: "여행자보험 보장 범위 및 적정성 분석", diff: "간편", time: 2, docs: ["여행 일정", "여행지", "기존 보험"] },
      { name: "암보험 가입 심사", desc: "암보험 가입 적격 및 보험료 시뮬레이션", diff: "표준", time: 5, docs: ["건강 정보", "가족력", "건강검진 결과"] },
      { name: "연금보험 수령액 시뮬레이션", desc: "연금보험 예상 수령액 및 수익률 분석", diff: "표준", time: 5, docs: ["가입 조건", "납입 기간", "납입 금액"] },
    ],
    sole: [
      { name: "영업배상책임보험 심사", desc: "영업배상책임보험 가입 적격 및 보험료", diff: "표준", time: 5, docs: ["업종 정보", "매출 규모", "영업 면적"] },
      { name: "화재보험 적정성", desc: "화재보험 보장 적정성 분석", diff: "간편", time: 3, docs: ["건물 정보", "영업 면적", "시설 정보"] },
      { name: "산재보험 적용 진단", desc: "산재보험 적용 범위 및 부담금 시뮬레이션", diff: "표준", time: 5, docs: ["직원 현황", "업종 정보", "급여 내역"] },
    ],
    corp: [
      { name: "D&O 보험 심사", desc: "임원배상책임보험 필요성 및 조건 분석", diff: "정밀", time: 10, docs: ["회사 규모", "임원 현황", "소송 이력"] },
      { name: "사이버 보험 필요성", desc: "사이버 위험 보장 보험 필요성 진단", diff: "표준", time: 7, docs: ["IT 인프라", "개인정보 처리 현황", "보안 체계"] },
      { name: "기업 종합보험 설계", desc: "기업 종합보험 최적 설계 시뮬레이션", diff: "정밀", time: 12, docs: ["회사 규모", "업종", "자산 목록", "직원 현황"] },
    ],
  },
  health: {
    personal: [
      { name: "건강보험 피부양자 적격", desc: "건강보험 피부양자 자격 유지 여부 진단", diff: "간편", time: 3, docs: ["소득 정보", "재산 정보", "가족관계"] },
      { name: "기초생활수급 자격", desc: "기초생활수급자 선정 가능성 시뮬레이션", diff: "표준", time: 7, docs: ["소득인정액", "재산 정보", "가구원 정보"] },
      { name: "장애등급 판정 시뮬레이션", desc: "장애등급 판정 예상 시뮬레이션", diff: "정밀", time: 10, docs: ["진단서", "의료 기록", "일상생활 능력"] },
      { name: "국민연금 수령액 계산", desc: "국민연금 예상 수령액 시뮬레이션", diff: "간편", time: 3, docs: ["가입기간", "평균 소득월액"] },
      { name: "실업급여 수급 자격", desc: "실업급여 수급 자격 및 예상 금액", diff: "간편", time: 3, docs: ["고용보험 가입기간", "퇴직 사유", "급여 정보"] },
      { name: "육아휴직 급여 계산", desc: "육아휴직 급여 예상액 시뮬레이션", diff: "간편", time: 3, docs: ["급여 정보", "자녀 정보", "고용보험 가입기간"] },
      { name: "아동수당 수급 자격", desc: "아동수당 수급 자격 및 금액 시뮬레이션", diff: "간편", time: 2, docs: ["자녀 연령", "가구 소득"] },
      { name: "노인장기요양 등급 시뮬레이션", desc: "장기요양 등급 판정 예상 시뮬레이션", diff: "정밀", time: 10, docs: ["건강 상태", "일상생활 능력", "인지 기능"] },
    ],
    sole: [
      { name: "고용보험 가입 의무", desc: "고용보험 가입 의무 해당 여부 진단", diff: "간편", time: 3, docs: ["사업 규모", "직원 현황"] },
      { name: "산재보험 적용 범위", desc: "산재보험 적용 범위 및 보험료 시뮬레이션", diff: "표준", time: 5, docs: ["업종 정보", "직원 현황", "급여 내역"] },
      { name: "4대보험 부담금 시뮬레이션", desc: "4대보험 사업주 부담금 시뮬레이션", diff: "표준", time: 5, docs: ["직원 현황", "급여 내역"] },
    ],
    corp: [
      { name: "직장 건강검진 의무 범위", desc: "직장 건강검진 의무 범위 및 비용 시뮬레이션", diff: "간편", time: 3, docs: ["직원 현황", "업종 정보"] },
      { name: "장애인 고용 부담금", desc: "장애인 고용 의무 및 부담금 시뮬레이션", diff: "표준", time: 5, docs: ["상시 근로자 수", "장애인 고용 현황"] },
      { name: "퇴직연금 설계", desc: "퇴직연금 DB/DC/IRP 최적 설계 시뮬레이션", diff: "표준", time: 7, docs: ["직원 현황", "급여 체계", "기존 퇴직금 제도"] },
    ],
  },
  business: {
    personal: [],
    sole: [
      { name: "소상공인 지원금 자격", desc: "소상공인 정부 지원금 수급 자격 진단", diff: "간편", time: 3, docs: ["사업자등록증", "매출 내역"] },
      { name: "창업자금 적격", desc: "정부 창업지원자금 적격 여부 진단", diff: "표준", time: 7, docs: ["사업계획서", "창업자 경력", "업종 정보"] },
      { name: "기술보증 적격", desc: "기술보증기금 보증 적격 여부 진단", diff: "정밀", time: 10, docs: ["기술 내역", "사업계획서", "재무제표"] },
      { name: "벤처기업 인증 가능성", desc: "벤처기업 확인 인증 가능성 진단", diff: "정밀", time: 10, docs: ["기술력 증빙", "재무제표", "사업계획서"] },
      { name: "1인 법인 전환 적격", desc: "1인 법인 전환 적격 및 절세 효과 분석", diff: "표준", time: 7, docs: ["매출 내역", "소득 내역", "사업 구조"] },
    ],
    corp: [
      { name: "정부 R&D 과제 적격", desc: "정부 R&D 지원 과제 참여 적격 진단", diff: "정밀", time: 12, docs: ["R&D 인력", "기술 내역", "재무제표"] },
      { name: "수출 바우처 자격", desc: "수출 바우처 사업 참여 자격 진단", diff: "표준", time: 5, docs: ["수출 실적", "사업자등록증"] },
      { name: "코스닥 상장 요건 진단", desc: "코스닥 상장 요건 충족 여부 진단", diff: "정밀", time: 20, docs: ["재무제표 3개년", "감사보고서", "지배구조 현황"] },
      { name: "벤처투자 유치 가능성", desc: "벤처캐피탈 투자 유치 가능성 진단", diff: "정밀", time: 15, docs: ["사업계획서", "재무제표", "팀 구성", "시장 분석"] },
      { name: "ISO 인증 적합성", desc: "ISO 9001/14001/27001 인증 적합성 진단", diff: "표준", time: 10, docs: ["품질관리 체계", "프로세스 문서", "조직 현황"] },
    ],
  },
  daily: {
    personal: [
      { name: "운전면허 적성검사", desc: "운전면허 적성검사 통과 가능성 진단", diff: "간편", time: 2, docs: ["건강 정보", "시력 정보"] },
      { name: "여권 발급 적격", desc: "여권 발급·갱신 적격 여부 진단", diff: "간편", time: 2, docs: ["신분증", "병역 관련 서류"] },
      { name: "비자 승인 가능성", desc: "각국 비자 승인 가능성 시뮬레이션", diff: "표준", time: 7, docs: ["여권", "재정 증빙", "방문 목적", "초청장"] },
      { name: "아파트 청약 당첨 확률", desc: "아파트 청약 당첨 확률 시뮬레이션", diff: "표준", time: 5, docs: ["청약통장 정보", "가점 항목", "희망 단지"] },
      { name: "군 면제/감면 판정", desc: "병역 면제·감면 가능성 시뮬레이션", diff: "표준", time: 5, docs: ["건강 정보", "가족 상황", "학력 정보"] },
      { name: "귀화 심사 자격", desc: "대한민국 귀화 심사 자격 진단", diff: "정밀", time: 10, docs: ["체류 기간", "소득 증빙", "한국어 능력", "범죄 이력"] },
      { name: "국가장학금 수급 자격", desc: "국가장학금 수급 자격 및 금액 시뮬레이션", diff: "간편", time: 3, docs: ["소득분위", "성적", "재학 정보"] },
      { name: "공무원 시험 가산점 계산", desc: "공무원 시험 가산점 시뮬레이션", diff: "간편", time: 2, docs: ["자격증", "군 경력", "기타 가점 항목"] },
      { name: "주민등록 주소이전 적격", desc: "주민등록 주소이전 가능 여부 진단", diff: "간편", time: 2, docs: ["현 주소", "이전 주소", "거주 사실 확인"] },
    ],
    sole: [
      { name: "영업허가 적격", desc: "업종별 영업허가 적격 여부 진단", diff: "표준", time: 5, docs: ["업종 정보", "시설 정보", "위치 정보"] },
      { name: "식품위생 적합성", desc: "식품위생법 적합 여부 진단", diff: "표준", time: 5, docs: ["시설 현황", "위생관리 체계", "영업 유형"] },
      { name: "주류 면허 자격", desc: "주류 판매/제조 면허 자격 진단", diff: "표준", time: 5, docs: ["사업 계획", "시설 정보", "위치 정보"] },
    ],
    corp: [
      { name: "산업안전 적합성", desc: "산업안전보건법 적합성 진단", diff: "정밀", time: 12, docs: ["안전관리 체계", "시설 현황", "사고 이력"] },
      { name: "환경영향 평가", desc: "환경영향평가 적합성 사전 진단", diff: "정밀", time: 15, docs: ["사업 규모", "오염물질 배출", "입지 정보"] },
      { name: "개인정보 보호 적합성", desc: "개인정보보호법 적합성 진단", diff: "표준", time: 7, docs: ["개인정보 처리 현황", "보안 체계", "위탁 현황"] },
    ],
  },
};

// Merge enhanced data from external files into SERVICES
const ENHANCED = { ...DATA_FR, ...DATA_LT, ...DATA_IH, ...DATA_BD };
Object.keys(ENHANCED).forEach(domain => {
  if (!SERVICES[domain]) return;
  Object.keys(ENHANCED[domain]).forEach(userType => {
    const enhanced = ENHANCED[domain][userType] || [];
    const original = SERVICES[domain][userType] || [];
    SERVICES[domain][userType] = original.map(svc => {
      const match = enhanced.find(e => e.name === svc.name);
      return match ? { ...svc, fields: match.fields, considerations: match.considerations, references: match.references } : svc;
    });
  });
});

// Generic input fields for simulation forms (fallback)
const GENERIC_FIELDS = {
  finance: [
    { key: "income", label: "연소득 (만원)", type: "number", placeholder: "예: 5000" },
    { key: "assets", label: "총 자산 (만원)", type: "number", placeholder: "예: 30000" },
    { key: "debt", label: "기존 부채 (만원)", type: "number", placeholder: "예: 5000" },
    { key: "creditScore", label: "신용점수", type: "number", placeholder: "예: 850" },
    { key: "employment", label: "재직기간 (년)", type: "number", placeholder: "예: 3" },
  ],
  realestate: [
    { key: "propertyValue", label: "부동산 가액 (만원)", type: "number", placeholder: "예: 50000" },
    { key: "income", label: "연소득 (만원)", type: "number", placeholder: "예: 5000" },
    { key: "existingLoan", label: "기존 대출 (만원)", type: "number", placeholder: "예: 10000" },
    { key: "region", label: "지역", type: "select", options: ["서울", "경기", "인천", "부산", "대구", "대전", "광주", "세종", "기타"] },
  ],
  legal: [
    { key: "caseType", label: "분쟁 유형", type: "text", placeholder: "분쟁 상황을 간단히 설명" },
    { key: "amount", label: "분쟁 금액 (만원)", type: "number", placeholder: "예: 5000" },
    { key: "evidence", label: "증거 수준", type: "select", options: ["충분", "보통", "부족", "없음"] },
    { key: "duration", label: "분쟁 기간 (개월)", type: "number", placeholder: "예: 6" },
  ],
  tax: [
    { key: "income", label: "과세 소득 (만원)", type: "number", placeholder: "예: 8000" },
    { key: "deductions", label: "공제액 (만원)", type: "number", placeholder: "예: 1500" },
    { key: "propertyValue", label: "재산 가액 (만원)", type: "number", placeholder: "예: 50000" },
    { key: "taxType", label: "세목", type: "select", options: ["소득세", "부가세", "양도세", "증여세", "상속세", "법인세"] },
  ],
  insurance: [
    { key: "age", label: "나이", type: "number", placeholder: "예: 35" },
    { key: "healthStatus", label: "건강 상태", type: "select", options: ["매우 양호", "양호", "보통", "주의", "위험"] },
    { key: "occupation", label: "직업 위험등급", type: "select", options: ["1급(사무직)", "2급(영업직)", "3급(기술직)", "4급(위험직)"] },
    { key: "coverage", label: "희망 보장금액 (만원)", type: "number", placeholder: "예: 10000" },
  ],
  health: [
    { key: "income", label: "월 소득 (만원)", type: "number", placeholder: "예: 300" },
    { key: "familySize", label: "가구원 수", type: "number", placeholder: "예: 4" },
    { key: "assets", label: "자산 (만원)", type: "number", placeholder: "예: 20000" },
    { key: "employmentPeriod", label: "고용보험 가입기간 (개월)", type: "number", placeholder: "예: 36" },
  ],
  business: [
    { key: "revenue", label: "연 매출 (만원)", type: "number", placeholder: "예: 50000" },
    { key: "employees", label: "직원 수", type: "number", placeholder: "예: 10" },
    { key: "yearsInBusiness", label: "사업 기간 (년)", type: "number", placeholder: "예: 3" },
    { key: "techLevel", label: "기술 수준", type: "select", options: ["최첨단", "우수", "보통", "일반"] },
  ],
  daily: [
    { key: "age", label: "나이", type: "number", placeholder: "예: 30" },
    { key: "residencePeriod", label: "거주 기간 (년)", type: "number", placeholder: "예: 5" },
    { key: "purpose", label: "목적", type: "text", placeholder: "심사 목적을 간단히 설명" },
  ],
};

// Simulation engine (deterministic mock based on inputs)
function runSimulation(domain, serviceName, inputs) {
  // Create a pseudo-hash from inputs for consistent results
  let seed = 0;
  const inputStr = JSON.stringify(inputs) + serviceName;
  for (let i = 0; i < inputStr.length; i++) {
    seed = ((seed << 5) - seed + inputStr.charCodeAt(i)) | 0;
  }
  const rng = (min, max) => {
    seed = (seed * 16807 + 0) % 2147483647;
    return min + (Math.abs(seed) % (max - min + 1));
  };

  const probability = rng(15, 95);
  const resultTypes = ["승인가능", "조건부승인", "보류", "부적격"];
  let resultIdx;
  if (probability >= 75) resultIdx = 0;
  else if (probability >= 50) resultIdx = 1;
  else if (probability >= 30) resultIdx = 2;
  else resultIdx = 3;

  const reasons = {
    finance: [
      "소득 대비 부채비율이 안정적 범위에 있습니다",
      "신용등급이 기준점수를 충족합니다",
      "재직기간이 최소 요건을 초과합니다",
      "담보가치 대비 대출비율이 적정합니다",
      "최근 연체 이력이 없습니다",
      "월 상환 부담률이 적정 수준입니다",
    ],
    realestate: [
      "LTV 비율이 규정 한도 이내입니다",
      "DSR이 기준 이내로 유지됩니다",
      "해당 지역 규제 요건을 충족합니다",
      "소득 대비 대출 상환 능력이 충분합니다",
      "담보물건 감정가가 적정합니다",
      "주택 보유 현황이 기준에 부합합니다",
    ],
    legal: [
      "제출된 증거의 증명력이 인정됩니다",
      "관련 판례가 유리한 방향을 시사합니다",
      "청구 금액이 법적 기준에 부합합니다",
      "소멸시효 기간 내에 해당합니다",
      "상대방 과실이 인정될 가능성이 있습니다",
      "법적 요건이 충족되는 것으로 판단됩니다",
    ],
    tax: [
      "과세표준 구간에 따른 세율이 적용됩니다",
      "공제 항목이 적법하게 적용 가능합니다",
      "신고 기한 내 처리가 가능합니다",
      "특별공제 요건을 충족합니다",
      "세무 리스크가 낮은 수준입니다",
      "절세 방안 적용이 가능합니다",
    ],
    insurance: [
      "건강 상태가 인수 기준을 충족합니다",
      "직업 위험등급이 허용 범위 내입니다",
      "기존 보험 가입 현황이 적정합니다",
      "보장 범위가 적절하게 설정되었습니다",
      "보험료 부담이 적정 수준입니다",
    ],
    health: [
      "소득인정액이 기준을 충족합니다",
      "가구원 구성이 수급 요건에 부합합니다",
      "재산 기준이 선정 기준 이내입니다",
      "고용보험 가입기간이 요건을 충족합니다",
      "관련 법령 요건을 충족합니다",
    ],
    business: [
      "사업 규모가 지원 대상 기준에 부합합니다",
      "기술력 평가에서 일정 점수 이상 예상됩니다",
      "재무 건전성이 기준을 충족합니다",
      "업종이 지원 대상에 해당합니다",
      "사업계획의 실현가능성이 인정됩니다",
    ],
    daily: [
      "기본 자격 요건을 충족합니다",
      "제출 서류가 기준에 부합합니다",
      "관련 법령 요건을 충족합니다",
      "심사 기준 점수를 초과합니다",
      "특별 사유에 해당하지 않습니다",
    ],
  };

  const domainReasons = reasons[domain] || reasons.daily;
  const selectedReasons = [];
  const usedIdx = new Set();
  for (let i = 0; i < Math.min(4, domainReasons.length); i++) {
    let idx = rng(0, domainReasons.length - 1);
    while (usedIdx.has(idx)) idx = (idx + 1) % domainReasons.length;
    usedIdx.add(idx);
    selectedReasons.push(domainReasons[idx]);
  }

  const improvements = [
    "소득 증빙 서류를 추가 제출하면 승인 확률이 높아집니다",
    "부채를 일부 상환하면 조건이 개선됩니다",
    "추가 담보를 제공하면 한도가 증가합니다",
    "공제 항목을 추가 확인하면 절세 효과가 있습니다",
    "전문가 상담을 통해 서류를 보완하면 유리합니다",
    "관련 자격증이나 증빙을 추가하면 가점이 부여됩니다",
  ];

  const selectedImprovements = [];
  const usedImpIdx = new Set();
  for (let i = 0; i < 3; i++) {
    let idx = rng(0, improvements.length - 1);
    while (usedImpIdx.has(idx)) idx = (idx + 1) % improvements.length;
    usedImpIdx.add(idx);
    selectedImprovements.push(improvements[idx]);
  }

  const cases = [
    "2025년 서울중앙지법 유사 사례에서 " + rng(60, 90) + "% 승인",
    "2024년 동일 조건 신청자 중 " + rng(55, 85) + "%가 승인 판정",
    "최근 6개월 유사 심사 " + rng(100, 500) + "건 분석 기반",
  ];

  return {
    result: resultTypes[resultIdx],
    probability,
    reasons: selectedReasons,
    improvements: selectedImprovements,
    cases,
  };
}

// ── Styles ──────────────────────────────────────────────────
const S = {
  root: { background: "#0a0f1a", minHeight: "100vh", color: "#e2e8f0", fontFamily: "'Pretendard','Apple SD Gothic Neo','Malgun Gothic',sans-serif" },
  header: { background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)", borderBottom: "1px solid #1e293b", padding: "20px 24px" },
  backBtn: { background: "none", border: "1px solid #334155", color: "#94a3b8", padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontSize: 13, display: "inline-flex", alignItems: "center", gap: 6 },
  title: { fontSize: 28, fontWeight: 800, margin: "12px 0 6px", background: "linear-gradient(90deg, #60a5fa, #a78bfa, #34d399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  subtitle: { color: "#94a3b8", fontSize: 14, marginBottom: 16 },
  statBar: { display: "flex", gap: 24, flexWrap: "wrap" },
  statItem: { display: "flex", alignItems: "center", gap: 8, background: "#111827", border: "1px solid #1e293b", borderRadius: 10, padding: "8px 16px" },
  statValue: { fontSize: 18, fontWeight: 700, color: "#f1f5f9" },
  statLabel: { fontSize: 11, color: "#64748b" },
  body: { display: "flex", minHeight: "calc(100vh - 200px)" },
  sidebar: { width: 220, minWidth: 220, background: "#0f1629", borderRight: "1px solid #1e293b", padding: "16px 0", overflowY: "auto" },
  sideItem: (active) => ({ display: "flex", alignItems: "center", gap: 10, padding: "10px 18px", cursor: "pointer", background: active ? "#1e293b" : "transparent", borderLeft: active ? "3px solid #3b82f6" : "3px solid transparent", color: active ? "#f1f5f9" : "#94a3b8", fontSize: 14, transition: "all 0.15s" }),
  sideBadge: { marginLeft: "auto", background: "#1e293b", color: "#60a5fa", borderRadius: 10, padding: "2px 8px", fontSize: 11, fontWeight: 600 },
  main: { flex: 1, padding: "20px 24px", overflowY: "auto" },
  userTypeBar: { display: "flex", gap: 8, marginBottom: 20 },
  userTypeBtn: (active) => ({ padding: "8px 20px", borderRadius: 10, border: active ? "1px solid #3b82f6" : "1px solid #1e293b", background: active ? "#1e3a5f" : "#111827", color: active ? "#60a5fa" : "#94a3b8", cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all 0.15s" }),
  searchBox: { display: "flex", alignItems: "center", gap: 8, background: "#111827", border: "1px solid #1e293b", borderRadius: 10, padding: "8px 14px", marginBottom: 20, maxWidth: 400 },
  searchInput: { background: "none", border: "none", outline: "none", color: "#e2e8f0", fontSize: 14, flex: 1 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 },
  card: { background: "#111827", border: "1px solid #1e293b", borderRadius: 12, padding: "18px", cursor: "pointer", transition: "all 0.2s" },
  cardName: { fontSize: 15, fontWeight: 700, color: "#f1f5f9", marginBottom: 6 },
  cardDesc: { fontSize: 12, color: "#94a3b8", marginBottom: 12, lineHeight: 1.5 },
  cardFooter: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  badge: (bg, color) => ({ display: "inline-block", padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: bg, color }),
  startBtn: { marginLeft: "auto", background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8, padding: "6px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer" },
  // Modal
  overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" },
  modal: { background: "#111827", border: "1px solid #1e293b", borderRadius: 16, width: "90%", maxWidth: 680, maxHeight: "90vh", overflowY: "auto", padding: "24px" },
  modalTitle: { fontSize: 20, fontWeight: 700, color: "#f1f5f9", marginBottom: 4 },
  modalSubtitle: { fontSize: 13, color: "#94a3b8", marginBottom: 20 },
  formGroup: { marginBottom: 14 },
  formLabel: { display: "block", fontSize: 12, color: "#94a3b8", marginBottom: 4 },
  formInput: { width: "100%", background: "#0a0f1a", border: "1px solid #1e293b", borderRadius: 8, padding: "8px 12px", color: "#e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box" },
  formSelect: { width: "100%", background: "#0a0f1a", border: "1px solid #1e293b", borderRadius: 8, padding: "8px 12px", color: "#e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box" },
  runBtn: { background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", color: "#fff", border: "none", borderRadius: 10, padding: "12px 28px", fontSize: 15, fontWeight: 700, cursor: "pointer", width: "100%", marginTop: 10 },
  closeBtn: { background: "none", border: "1px solid #334155", color: "#94a3b8", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13 },
  // Result
  resultBox: { marginTop: 20, background: "#0a0f1a", border: "1px solid #1e293b", borderRadius: 12, padding: "20px" },
  resultBadge: (type) => {
    const map = { "승인가능": { bg: "#064e3b", c: "#34d399" }, "조건부승인": { bg: "#713f12", c: "#fbbf24" }, "보류": { bg: "#1e293b", c: "#94a3b8" }, "부적격": { bg: "#450a0a", c: "#f87171" } };
    const s = map[type] || map["보류"];
    return { display: "inline-block", padding: "6px 18px", borderRadius: 8, fontSize: 16, fontWeight: 800, background: s.bg, color: s.c };
  },
  progressBarOuter: { background: "#1e293b", borderRadius: 8, height: 10, marginTop: 8, overflow: "hidden" },
  progressBarInner: (pct) => {
    let color = "#ef4444";
    if (pct >= 75) color = "#10b981";
    else if (pct >= 50) color = "#3b82f6";
    else if (pct >= 30) color = "#f59e0b";
    return { width: `${pct}%`, height: "100%", borderRadius: 8, background: color, transition: "width 1s ease" };
  },
  sectionTitle: { fontSize: 14, fontWeight: 700, color: "#60a5fa", margin: "16px 0 8px", borderBottom: "1px solid #1e293b", paddingBottom: 6 },
  bulletList: { listStyle: "none", padding: 0, margin: 0 },
  bulletItem: { padding: "4px 0", fontSize: 13, color: "#cbd5e1", display: "flex", alignItems: "flex-start", gap: 8 },
  noService: { textAlign: "center", padding: 40, color: "#475569", fontSize: 14 },
  docTag: { display: "inline-block", background: "#1e293b", color: "#94a3b8", borderRadius: 6, padding: "2px 8px", fontSize: 10, marginRight: 4, marginBottom: 4 },
};

const DIFF_BADGE = {
  "간편": { bg: "#064e3b", c: "#34d399" },
  "표준": { bg: "#1e3a5f", c: "#60a5fa" },
  "정밀": { bg: "#4c1d95", c: "#a78bfa" },
};

// ── Component ───────────────────────────────────────────────
export default function SimReviewMVP({ onBack }) {
  const [userType, setUserType] = useState("personal");
  const [activeDomain, setActiveDomain] = useState("finance");
  const [search, setSearch] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({});
  const [result, setResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  // Count services per domain for current user type
  const domainCounts = useMemo(() => {
    const counts = {};
    DOMAINS.forEach(d => {
      const svcs = SERVICES[d.id]?.[userType] || [];
      counts[d.id] = svcs.length;
    });
    return counts;
  }, [userType]);

  // Total service count across all user types
  const totalServiceCount = useMemo(() => {
    const uniqueNames = new Set();
    Object.values(SERVICES).forEach(domain => {
      Object.values(domain).forEach(svcs => {
        svcs.forEach(s => uniqueNames.add(s.name));
      });
    });
    return uniqueNames.size;
  }, []);

  // Filtered services
  const currentServices = useMemo(() => {
    const svcs = SERVICES[activeDomain]?.[userType] || [];
    if (!search.trim()) return svcs;
    const q = search.trim().toLowerCase();
    return svcs.filter(s => s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q));
  }, [activeDomain, userType, search]);

  // Visible domains (hide business for personal)
  const visibleDomains = useMemo(() => {
    if (userType === "personal") return DOMAINS.filter(d => d.id !== "business");
    return DOMAINS;
  }, [userType]);

  const handleOpenService = (svc) => {
    setSelectedService(svc);
    setFormData({});
    setResult(null);
    setIsRunning(false);
  };

  const handleRunSim = () => {
    setIsRunning(true);
    // Simulate processing time
    setTimeout(() => {
      const res = runSimulation(activeDomain, selectedService.name, formData);
      setResult(res);
      setIsRunning(false);
    }, 1500);
  };

  const fields = (selectedService?.fields?.length > 0) ? selectedService.fields : (GENERIC_FIELDS[activeDomain] || GENERIC_FIELDS.daily);

  return (
    <div style={S.root}>
      {/* Header */}
      <div style={S.header}>
        <button style={S.backBtn} onClick={onBack}>← DMP</button>
        <div style={S.title}>무엇이든 심사받으세요</div>
        <div style={S.subtitle}>AI 심사 시뮬레이션 플랫폼 · 법률 · 금융 · 부동산 · 세무 · 보험</div>
        <div style={S.statBar}>
          <div style={S.statItem}>
            <div>
              <div style={S.statValue}>{totalServiceCount}+개</div>
              <div style={S.statLabel}>심사 항목</div>
            </div>
          </div>
          <div style={S.statItem}>
            <div>
              <div style={S.statValue}>94.2%</div>
              <div style={S.statLabel}>시뮬레이션 정확도</div>
            </div>
          </div>
          <div style={S.statItem}>
            <div>
              <div style={S.statValue}>58,000건</div>
              <div style={S.statLabel}>누적 이용</div>
            </div>
          </div>
        </div>
      </div>

      {/* User Type Selector */}
      <div style={{ padding: "16px 24px 0", background: "#0a0f1a" }}>
        <div style={S.userTypeBar}>
          {USER_TYPES.map(ut => (
            <button key={ut.id} style={S.userTypeBtn(userType === ut.id)} onClick={() => { setUserType(ut.id); setSearch(""); }}>
              {ut.icon} {ut.label}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={S.body}>
        {/* Sidebar */}
        <div style={S.sidebar}>
          {visibleDomains.map(d => (
            <div key={d.id} style={S.sideItem(activeDomain === d.id)} onClick={() => { setActiveDomain(d.id); setSearch(""); }}>
              <span style={{ fontSize: 18 }}>{d.icon}</span>
              <span>{d.label}</span>
              <span style={S.sideBadge}>{domainCounts[d.id] || 0}</span>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div style={S.main}>
          {/* Search */}
          <div style={S.searchBox}>
            <span style={{ color: "#64748b" }}>🔍</span>
            <input style={S.searchInput} placeholder="심사 항목 검색..." value={search} onChange={e => setSearch(e.target.value)} />
            {search && <button style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }} onClick={() => setSearch("")}>✕</button>}
          </div>

          {/* Domain Title */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 22 }}>{DOMAINS.find(d => d.id === activeDomain)?.icon}</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9" }}>{DOMAINS.find(d => d.id === activeDomain)?.label}</span>
            <span style={{ ...S.badge("#1e293b", "#60a5fa"), marginLeft: 4 }}>{currentServices.length}개 항목</span>
          </div>

          {/* Service Cards Grid */}
          {currentServices.length === 0 ? (
            <div style={S.noService}>
              {search ? `"${search}"에 대한 검색 결과가 없습니다` : "해당 사용자 유형에 대한 심사 항목이 없습니다"}
            </div>
          ) : (
            <div style={S.grid}>
              {currentServices.map((svc, i) => {
                const db = DIFF_BADGE[svc.diff] || DIFF_BADGE["표준"];
                return (
                  <div key={i} style={S.card} onMouseEnter={e => { e.currentTarget.style.borderColor = "#3b82f6"; e.currentTarget.style.transform = "translateY(-2px)"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e293b"; e.currentTarget.style.transform = "translateY(0)"; }}>
                    <div style={S.cardName}>{svc.name}</div>
                    <div style={S.cardDesc}>{svc.desc}</div>
                    <div style={{ marginBottom: 10 }}>
                      {svc.docs.map((doc, j) => <span key={j} style={S.docTag}>{doc}</span>)}
                    </div>
                    <div style={S.cardFooter}>
                      <span style={S.badge(db.bg, db.c)}>{svc.diff}</span>
                      <span style={{ fontSize: 11, color: "#64748b" }}>⏱ {svc.time}분</span>
                      <button style={S.startBtn} onClick={() => handleOpenService(svc)}>심사 시작 →</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedService && (
        <div style={S.overlay} onClick={() => setSelectedService(null)}>
          <div style={S.modal} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div>
                <div style={S.modalTitle}>{selectedService.name}</div>
                <div style={S.modalSubtitle}>{selectedService.desc}</div>
              </div>
              <button style={S.closeBtn} onClick={() => setSelectedService(null)}>✕ 닫기</button>
            </div>

            {/* Badges */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              {(() => { const db = DIFF_BADGE[selectedService.diff]; return <span style={S.badge(db.bg, db.c)}>난이도: {selectedService.diff}</span>; })()}
              <span style={S.badge("#1e293b", "#94a3b8")}>⏱ 예상 {selectedService.time}분</span>
            </div>

            {/* Required Documents */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 8 }}>📄 필요 서류</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {selectedService.docs.map((doc, i) => (
                  <span key={i} style={{ ...S.badge("#1e293b", "#e2e8f0"), padding: "4px 12px", fontSize: 12 }}>{doc}</span>
                ))}
              </div>
            </div>

            {/* Considerations */}
            {selectedService.considerations?.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#f59e0b", marginBottom: 8 }}>⚠️ 핵심 판단 기준</div>
                <div style={{ background: "#1a1500", border: "1px solid #f59e0b22", borderRadius: 10, padding: 12 }}>
                  {selectedService.considerations.map((c, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "4px 0", fontSize: 12, color: "#e2e8f0" }}>
                      <span style={{ color: "#f59e0b", flexShrink: 0 }}>●</span>
                      {c}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* External References */}
            {selectedService.references?.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#8b5cf6", marginBottom: 8 }}>🔗 외부 참조 데이터</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {selectedService.references.map((ref, i) => {
                    const refName = typeof ref === "string" ? ref : ref.name;
                    return (
                      <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#1e1040", border: "1px solid #8b5cf622", color: "#c4b5fd", borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 500 }}>
                        📊 {refName}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Input Form */}
            <div style={{ borderTop: "1px solid #1e293b", paddingTop: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 12 }}>📝 심사 정보 입력</div>
              {fields.map(f => (
                <div key={f.key} style={S.formGroup}>
                  <label style={S.formLabel}>{f.label}</label>
                  {f.type === "select" ? (
                    <select style={S.formSelect} value={formData[f.key] || ""} onChange={e => setFormData(prev => ({ ...prev, [f.key]: e.target.value }))}>
                      <option value="">선택하세요</option>
                      {f.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input style={S.formInput} type={f.type} placeholder={f.placeholder} value={formData[f.key] || ""} onChange={e => setFormData(prev => ({ ...prev, [f.key]: e.target.value }))} />
                  )}
                </div>
              ))}
            </div>

            {/* Run Button */}
            <button style={{ ...S.runBtn, opacity: isRunning ? 0.6 : 1 }} onClick={handleRunSim} disabled={isRunning}>
              {isRunning ? "🔄 AI 심사 분석 중..." : "🤖 AI 심사 실행"}
            </button>

            {/* Result */}
            {result && (
              <div style={S.resultBox}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>심사 결과</div>
                    <span style={S.resultBadge(result.result)}>{result.result}</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>승인 확률</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: result.probability >= 75 ? "#10b981" : result.probability >= 50 ? "#3b82f6" : result.probability >= 30 ? "#f59e0b" : "#ef4444" }}>{result.probability}%</div>
                  </div>
                </div>
                <div style={S.progressBarOuter}>
                  <div style={S.progressBarInner(result.probability)} />
                </div>

                <div style={S.sectionTitle}>📋 주요 판단 근거</div>
                <ul style={S.bulletList}>
                  {result.reasons.map((r, i) => <li key={i} style={S.bulletItem}><span style={{ color: "#10b981" }}>✓</span> {r}</li>)}
                </ul>

                <div style={S.sectionTitle}>🔧 보완 필요사항</div>
                <ul style={S.bulletList}>
                  {result.improvements.map((imp, i) => <li key={i} style={S.bulletItem}><span style={{ color: "#f59e0b" }}>!</span> {imp}</li>)}
                </ul>

                <div style={S.sectionTitle}>📚 유사 사례 참고</div>
                <ul style={S.bulletList}>
                  {result.cases.map((c, i) => <li key={i} style={S.bulletItem}><span style={{ color: "#8b5cf6" }}>◈</span> {c}</li>)}
                </ul>

                <div style={{ marginTop: 16, padding: "10px 14px", background: "#1e293b", borderRadius: 8, fontSize: 11, color: "#64748b", lineHeight: 1.6 }}>
                  ※ 본 시뮬레이션 결과는 AI 분석 기반의 참고 자료이며, 실제 심사 결과와 다를 수 있습니다. 정확한 심사를 위해서는 해당 기관에 직접 문의하시기 바랍니다.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
