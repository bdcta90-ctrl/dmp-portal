export const DATA_FR = {
  finance: {
    personal: [
      {
        name: "신용대출 심사",
        desc: "개인 신용등급 기반 대출 한도·금리 시뮬레이션",
        diff: "표준",
        time: 5,
        docs: ["신분증", "소득증빙", "재직증명서"],
        fields: [
          { key: "annualIncome", label: "연소득 (만원)", type: "number", placeholder: "예: 5000" },
          { key: "creditScore", label: "신용점수", type: "number", placeholder: "예: 750" },
          { key: "employmentType", label: "고용형태", type: "select", options: ["정규직", "계약직", "프리랜서", "자영업", "공무원"] },
          { key: "employmentYears", label: "근속연수 (년)", type: "number", placeholder: "예: 3" },
          { key: "existingLoanAmount", label: "기존 대출잔액 (만원)", type: "number", placeholder: "예: 2000" },
          { key: "monthlyRepayment", label: "월 기존 상환액 (만원)", type: "number", placeholder: "예: 50" },
          { key: "desiredAmount", label: "희망 대출금액 (만원)", type: "number", placeholder: "예: 3000" },
          { key: "desiredTerm", label: "희망 대출기간 (개월)", type: "select", options: ["12", "24", "36", "48", "60"] }
        ],
        considerations: [
          "DSR 40% 규제 충족 여부",
          "신용점수 구간별 금리 차등 적용",
          "다중채무자 여부 및 과다대출 판단",
          "고용 안정성 및 소득 지속성 평가",
          "기존 연체 이력 확인"
        ],
        references: [
          "한국신용정보원 NICE/KCB 신용평가",
          "금융감독원 DSR 규제 가이드라인",
          "전국은행연합회 금리비교공시"
        ]
      },
      {
        name: "마이너스통장 심사",
        desc: "마이너스통장 한도 및 금리 산출 시뮬레이션",
        diff: "표준",
        time: 4,
        docs: ["신분증", "소득증빙", "재직증명서"],
        fields: [
          { key: "annualIncome", label: "연소득 (만원)", type: "number", placeholder: "예: 5000" },
          { key: "creditScore", label: "신용점수", type: "number", placeholder: "예: 780" },
          { key: "employmentType", label: "고용형태", type: "select", options: ["정규직", "계약직", "프리랜서", "공무원"] },
          { key: "employmentYears", label: "근속연수 (년)", type: "number", placeholder: "예: 5" },
          { key: "existingCreditLoan", label: "기존 신용대출 잔액 (만원)", type: "number", placeholder: "예: 1000" },
          { key: "desiredLimit", label: "희망 한도 (만원)", type: "number", placeholder: "예: 5000" },
          { key: "hasExistingMinus", label: "기존 마이너스통장 보유", type: "select", options: ["없음", "1개", "2개 이상"] }
        ],
        considerations: [
          "연소득 대비 한도 적정성 (통상 연소득 100% 이내)",
          "기존 신용대출과 합산 DSR 규제",
          "마이너스통장 중복 보유 제한 여부",
          "직장 안정성 및 신용등급 변동 추이"
        ],
        references: [
          "한국신용정보원 신용평가 데이터",
          "금융감독원 가계대출 규제 현황",
          "은행연합회 마이너스통장 금리 비교"
        ]
      },
      {
        name: "자동차 할부 심사",
        desc: "차량 구매 시 할부금융 가능 여부 및 조건 심사",
        diff: "표준",
        time: 5,
        docs: ["신분증", "소득증빙", "차량 견적서"],
        fields: [
          { key: "vehiclePrice", label: "차량 가격 (만원)", type: "number", placeholder: "예: 3500" },
          { key: "downPayment", label: "선수금 (만원)", type: "number", placeholder: "예: 700" },
          { key: "annualIncome", label: "연소득 (만원)", type: "number", placeholder: "예: 4500" },
          { key: "creditScore", label: "신용점수", type: "number", placeholder: "예: 720" },
          { key: "vehicleType", label: "차량 유형", type: "select", options: ["신차-국산", "신차-수입", "중고차-국산", "중고차-수입"] },
          { key: "installmentTerm", label: "할부 기간 (개월)", type: "select", options: ["12", "24", "36", "48", "60", "72"] },
          { key: "existingAutoLoan", label: "기존 자동차 할부 유무", type: "select", options: ["없음", "있음"] },
          { key: "monthlyRepayment", label: "월 기존 상환액 (만원)", type: "number", placeholder: "예: 30" }
        ],
        considerations: [
          "LTV (차량가 대비 할부비율) 70~80% 이내",
          "DSR 산입 시 총부채 상환 비율 초과 여부",
          "중고차의 경우 차량 연식 및 감가율 반영",
          "캐피탈사 vs 은행 금리 차이 비교",
          "발루온(잔가) 설정 방식 선택 가능 여부"
        ],
        references: [
          "여신금융협회 할부금융 표준약관",
          "NICE/KCB 개인신용평가",
          "한국자동차산업협회 차량 잔존가치표"
        ]
      },
      {
        name: "카드 발급 심사",
        desc: "신용카드·체크카드 발급 가능 여부 및 한도 산출",
        diff: "간편",
        time: 3,
        docs: ["신분증", "소득증빙"],
        fields: [
          { key: "annualIncome", label: "연소득 (만원)", type: "number", placeholder: "예: 4000" },
          { key: "creditScore", label: "신용점수", type: "number", placeholder: "예: 700" },
          { key: "cardType", label: "카드 유형", type: "select", options: ["신용카드-일반", "신용카드-프리미엄", "체크카드", "법인카드(개인사업자)"] },
          { key: "existingCardCount", label: "보유 카드 수", type: "number", placeholder: "예: 3" },
          { key: "monthlySpending", label: "월 평균 카드 사용액 (만원)", type: "number", placeholder: "예: 150" },
          { key: "hasDelinquency", label: "연체 이력", type: "select", options: ["없음", "30일 미만", "30일~90일", "90일 이상"] }
        ],
        considerations: [
          "총 카드 한도 합산 시 연소득 초과 여부",
          "단기 다수 카드 발급 시 신용점수 하락 가능",
          "연체 이력에 따른 발급 거절 기준",
          "프리미엄 카드 연회비 대비 혜택 적정성"
        ],
        references: [
          "여신금융협회 카드 발급 기준",
          "NICE/KCB 신용평가 점수 체계",
          "금융감독원 카드 한도 관리 가이드"
        ]
      },
      {
        name: "학자금 대출 심사",
        desc: "한국장학재단 학자금 대출 자격 및 조건 시뮬레이션",
        diff: "표준",
        time: 5,
        docs: ["신분증", "등록금 고지서", "가족관계증명서", "소득증빙"],
        fields: [
          { key: "studentType", label: "학생 유형", type: "select", options: ["대학생(학부)", "대학원생", "전문대", "원격대학"] },
          { key: "householdIncome", label: "가구 소득분위 (구간)", type: "select", options: ["1구간", "2구간", "3구간", "4구간", "5구간", "6구간", "7구간", "8구간", "9구간", "10구간"] },
          { key: "tuitionAmount", label: "등록금 (만원)", type: "number", placeholder: "예: 450" },
          { key: "livingExpense", label: "생활비 필요 여부", type: "select", options: ["불필요", "필요"] },
          { key: "gpa", label: "직전 학기 성적 (4.5 만점)", type: "number", placeholder: "예: 3.2" },
          { key: "enrolledSemester", label: "이수 학기", type: "number", placeholder: "예: 4" },
          { key: "existingStudentLoan", label: "기존 학자금 대출 잔액 (만원)", type: "number", placeholder: "예: 800" }
        ],
        considerations: [
          "소득분위에 따른 이자 지원 범위 (1~3구간 무이자 등)",
          "성적 기준 충족 여부 (C학점 이상)",
          "최대 대출 가능 학기 수 초과 여부",
          "취업 후 상환 vs 일반 상환 선택",
          "ICL(취업 후 상환) 의무 상환율 시뮬레이션"
        ],
        references: [
          "한국장학재단 학자금 대출 기준표",
          "교육부 학자금 지원구간 산정 기준",
          "건강보험공단 소득분위 산정 데이터"
        ]
      },
      {
        name: "전세자금 대출 심사",
        desc: "전세보증금 대출 한도·금리·보증 가능 여부 심사",
        diff: "심화",
        time: 7,
        docs: ["신분증", "소득증빙", "전세계약서", "등기부등본", "주민등록등본"],
        fields: [
          { key: "depositAmount", label: "전세보증금 (만원)", type: "number", placeholder: "예: 30000" },
          { key: "annualIncome", label: "연소득 (만원)", type: "number", placeholder: "예: 5000" },
          { key: "creditScore", label: "신용점수", type: "number", placeholder: "예: 740" },
          { key: "housingType", label: "주택 유형", type: "select", options: ["아파트", "빌라/연립", "오피스텔", "단독주택"] },
          { key: "isFirstHome", label: "무주택 여부", type: "select", options: ["무주택", "1주택", "2주택 이상"] },
          { key: "guaranteeType", label: "보증 유형", type: "select", options: ["HUG(주택도시보증공사)", "SGI(서울보증보험)", "HF(한국주택금융공사)"] },
          { key: "existingLoanTotal", label: "기존 총 대출잔액 (만원)", type: "number", placeholder: "예: 5000" },
          { key: "age", label: "만 나이", type: "number", placeholder: "예: 32" }
        ],
        considerations: [
          "전세보증금 대비 대출한도 (수도권 80%, 비수도권 70% 등)",
          "DSR 40% 규제 적용 시 한도 축소 가능성",
          "보증기관별 보증한도·보증료 차이",
          "임대인 동의 필요 여부 및 대항력 확보",
          "전세 사기 위험 체크 (시세 대비 보증금 비율)"
        ],
        references: [
          "HUG 전세보증금반환보증 기준",
          "금융감독원 전세대출 가이드라인",
          "국토교통부 실거래가 공개시스템",
          "대법원 등기정보 열람"
        ]
      },
      {
        name: "P2P 투자 적합성",
        desc: "P2P 투자 시 투자자 적합성 및 한도 판단",
        diff: "표준",
        time: 4,
        docs: ["신분증", "소득증빙"],
        fields: [
          { key: "annualIncome", label: "연소득 (만원)", type: "number", placeholder: "예: 6000" },
          { key: "totalAsset", label: "총 금융자산 (만원)", type: "number", placeholder: "예: 15000" },
          { key: "investmentExperience", label: "투자 경험", type: "select", options: ["1년 미만", "1~3년", "3~5년", "5년 이상"] },
          { key: "riskTolerance", label: "위험 성향", type: "select", options: ["안정형", "안정추구형", "위험중립형", "적극투자형", "공격투자형"] },
          { key: "desiredInvestAmount", label: "투자 희망금액 (만원)", type: "number", placeholder: "예: 1000" },
          { key: "existingP2PInvestment", label: "기존 P2P 투자잔액 (만원)", type: "number", placeholder: "예: 500" }
        ],
        considerations: [
          "개인 투자자 연간 투자한도 (일반 1,000만원, 소득적격 2,000만원, 부동산 1,000만원)",
          "투자 적합성 평가 결과에 따른 투자 제한",
          "플랫폼별 연체율·부실률 비교",
          "원금손실 가능성 인지 여부 확인"
        ],
        references: [
          "금융위원회 온라인투자연계금융업 감독규정",
          "한국P2P금융협회 공시 데이터",
          "금융감독원 P2P 투자자 보호 가이드"
        ]
      },
      {
        name: "보험 가입 심사",
        desc: "생명·손해보험 가입 시 인수 심사 시뮬레이션",
        diff: "심화",
        time: 8,
        docs: ["신분증", "건강검진결과표", "기존 보험증권"],
        fields: [
          { key: "age", label: "만 나이", type: "number", placeholder: "예: 35" },
          { key: "gender", label: "성별", type: "select", options: ["남성", "여성"] },
          { key: "insuranceType", label: "보험 종류", type: "select", options: ["종신보험", "정기보험", "실손보험", "암보험", "연금보험", "운전자보험"] },
          { key: "smokingStatus", label: "흡연 여부", type: "select", options: ["비흡연(2년 이상)", "흡연"] },
          { key: "healthStatus", label: "건강 상태", type: "select", options: ["정상", "고혈압", "당뇨", "고혈압+당뇨", "기타 질환 있음"] },
          { key: "existingInsuranceCount", label: "기존 보험 가입 건수", type: "number", placeholder: "예: 3" },
          { key: "monthlyPremiumBudget", label: "월 보험료 예산 (만원)", type: "number", placeholder: "예: 20" },
          { key: "coverageAmount", label: "희망 보장금액 (만원)", type: "number", placeholder: "예: 10000" }
        ],
        considerations: [
          "고지의무 위반 시 보험금 지급 거절 가능성",
          "기왕증(과거 병력)에 따른 부담보·할증 조건",
          "보험 중복 가입 시 실손보험 비례보상 원칙",
          "갱신형 vs 비갱신형 보험료 장기 비교",
          "납입면제 조건 및 해약환급금 시뮬레이션"
        ],
        references: [
          "보험개발원 참조순보험료 데이터",
          "생명보험협회/손해보험협회 공시실",
          "국민건강보험공단 건강검진 데이터",
          "금융감독원 보험 비교공시"
        ]
      },
      {
        name: "주택연금 가입 심사",
        desc: "주택연금(역모기지) 가입 자격 및 월 수령액 시뮬레이션",
        diff: "심화",
        time: 7,
        docs: ["신분증", "등기부등본", "주민등록등본", "공시가격 확인서"],
        fields: [
          { key: "age", label: "만 나이 (본인/배우자 중 연장자)", type: "number", placeholder: "예: 62" },
          { key: "housingPrice", label: "주택 공시가격 (만원)", type: "number", placeholder: "예: 60000" },
          { key: "housingType", label: "주택 유형", type: "select", options: ["아파트", "다세대/연립", "단독주택", "노인복지주택"] },
          { key: "existingMortgage", label: "기존 주택담보대출 잔액 (만원)", type: "number", placeholder: "예: 5000" },
          { key: "paymentType", label: "수령 방식", type: "select", options: ["종신지급(정액)", "종신지급(증가)", "종신지급(감소)", "확정기간", "종신혼합"] },
          { key: "householdMember", label: "세대 구성", type: "select", options: ["단독", "부부", "기타 동거인 있음"] }
        ],
        considerations: [
          "공시가격 12억 이하 주택만 가입 가능 (2026년 기준)",
          "부부 중 연소자 기준 월 지급액 산정 (장수 리스크 반영)",
          "기존 담보대출 상환 조건 (주택연금으로 우선 상환)",
          "중도 해지 시 이자·보증료 일시 상환 부담",
          "주택가격 하락 시 수령액 보장 여부"
        ],
        references: [
          "한국주택금융공사(HF) 주택연금 예상 수령액표",
          "국토교통부 공시가격 알리미",
          "금융감독원 주택연금 비교공시"
        ]
      },
      {
        name: "비상금 대출 심사",
        desc: "소액 비상금 대출 (100~300만원) 자격 및 한도 심사",
        diff: "간편",
        time: 3,
        docs: ["신분증"],
        fields: [
          { key: "annualIncome", label: "연소득 (만원)", type: "number", placeholder: "예: 3500" },
          { key: "creditScore", label: "신용점수", type: "number", placeholder: "예: 650" },
          { key: "employmentType", label: "고용형태", type: "select", options: ["정규직", "계약직", "프리랜서", "아르바이트", "무직"] },
          { key: "desiredAmount", label: "희망 금액 (만원)", type: "number", placeholder: "예: 200" },
          { key: "existingMicroLoan", label: "기존 소액대출 유무", type: "select", options: ["없음", "있음"] },
          { key: "repaymentPeriod", label: "상환 기간", type: "select", options: ["1개월", "3개월", "6개월", "12개월"] }
        ],
        considerations: [
          "소액이라도 DSR 산입 대상 여부 확인",
          "중저신용자(하위 20%) 대상 상품 별도 존재",
          "1금융권 vs 2금융권 금리 차이 (최대 20%p)",
          "다중채무 누적 방지를 위한 기존 대출 확인"
        ],
        references: [
          "서민금융진흥원 소액대출 상품 현황",
          "NICE/KCB 간편 신용조회",
          "금융감독원 법정 최고금리 기준"
        ]
      }
    ],
    sole: [
      {
        name: "사업자 대출 심사",
        desc: "개인사업자 신용·담보 대출 가능 여부 및 조건 심사",
        diff: "심화",
        time: 8,
        docs: ["사업자등록증", "소득금액증명원", "부가세 과세표준증명", "재무제표"],
        fields: [
          { key: "businessAge", label: "업력 (년)", type: "number", placeholder: "예: 3" },
          { key: "annualRevenue", label: "연 매출액 (만원)", type: "number", placeholder: "예: 20000" },
          { key: "annualProfit", label: "연 순이익 (만원)", type: "number", placeholder: "예: 5000" },
          { key: "businessType", label: "업종", type: "text", placeholder: "예: 음식점업" },
          { key: "creditScore", label: "대표자 신용점수", type: "number", placeholder: "예: 720" },
          { key: "collateralType", label: "담보 유형", type: "select", options: ["무담보(신용)", "부동산", "보증서(신보/기보)", "매출채권", "동산"] },
          { key: "desiredAmount", label: "희망 대출금액 (만원)", type: "number", placeholder: "예: 10000" },
          { key: "existingBizLoan", label: "기존 사업자대출 잔액 (만원)", type: "number", placeholder: "예: 5000" }
        ],
        considerations: [
          "업력 1년 미만 시 대출 제한 또는 고금리 적용",
          "매출 대비 대출 비율 (통상 연매출 50% 이내)",
          "업종별 리스크 등급 (고위험 업종 제한)",
          "대표자 개인 DSR과 사업자 대출 합산 관리",
          "신용보증기관 보증 가능 여부 및 보증비율"
        ],
        references: [
          "신용보증기금/기술보증기금 보증 심사 기준",
          "국세청 사업자 소득 확인 시스템",
          "금융감독원 사업자대출 가이드라인",
          "한국은행 업종별 부도율 통계"
        ]
      },
      {
        name: "소상공인 정책자금 심사",
        desc: "중소벤처기업부·소진공 정책자금 수혜 자격 심사",
        diff: "심화",
        time: 10,
        docs: ["사업자등록증", "소득금액증명원", "부가세 과세표준증명", "4대보험 가입확인서"],
        fields: [
          { key: "employeeCount", label: "상시근로자 수 (명)", type: "number", placeholder: "예: 4" },
          { key: "annualRevenue", label: "연 매출액 (만원)", type: "number", placeholder: "예: 15000" },
          { key: "businessAge", label: "업력 (년)", type: "number", placeholder: "예: 2" },
          { key: "businessSector", label: "업종 분류", type: "select", options: ["제조업", "건설업", "운수업", "도소매업", "숙박음식점업", "서비스업", "기타"] },
          { key: "policyFundType", label: "신청 자금 유형", type: "select", options: ["일반경영안정자금", "성장촉진자금", "특별경영안정자금", "긴급경영안정자금", "청년고용특별자금"] },
          { key: "previousPolicyFund", label: "기존 정책자금 수혜 이력", type: "select", options: ["없음", "있음-상환중", "있음-상환완료"] },
          { key: "desiredAmount", label: "신청 금액 (만원)", type: "number", placeholder: "예: 7000" }
        ],
        considerations: [
          "소상공인 기준 충족 여부 (업종별 상시근로자 수 5~10인 미만)",
          "정책자금 중복 수혜 제한 규정",
          "직접대출 vs 대리대출 방식 차이",
          "휴·폐업 이력 및 국세·지방세 체납 여부",
          "업종 제한 (유흥·사행·부동산 임대업 등 제외)"
        ],
        references: [
          "소상공인시장진흥공단(소진공) 정책자금 공고",
          "중소벤처기업부 소상공인 지원 정책",
          "소상공인 확인서 발급 시스템",
          "국세청 체납 조회 시스템"
        ]
      },
      {
        name: "기계설비 리스 심사",
        desc: "사업용 기계설비 리스(금융/운용) 가능 여부 및 조건 심사",
        diff: "표준",
        time: 6,
        docs: ["사업자등록증", "재무제표", "설비 견적서"],
        fields: [
          { key: "equipmentType", label: "설비 종류", type: "text", placeholder: "예: CNC 선반" },
          { key: "equipmentCost", label: "설비 가격 (만원)", type: "number", placeholder: "예: 8000" },
          { key: "leaseType", label: "리스 유형", type: "select", options: ["금융리스", "운용리스"] },
          { key: "leaseTerm", label: "리스 기간 (개월)", type: "select", options: ["24", "36", "48", "60"] },
          { key: "annualRevenue", label: "연 매출액 (만원)", type: "number", placeholder: "예: 30000" },
          { key: "businessAge", label: "업력 (년)", type: "number", placeholder: "예: 5" },
          { key: "existingLeaseAmount", label: "기존 리스 잔액 (만원)", type: "number", placeholder: "예: 3000" }
        ],
        considerations: [
          "설비 잔존가치 및 감가상각 반영률",
          "금융리스 vs 운용리스 세무·회계 처리 차이",
          "리스 기간 종료 후 소유권 이전 조건",
          "월 리스료가 매출 대비 적정 비율 이내인지"
        ],
        references: [
          "여신금융협회 리스 표준약관",
          "국세청 감가상각 내용연수표",
          "기계산업진흥회 설비 시세 데이터"
        ]
      },
      {
        name: "매출채권 담보대출 심사",
        desc: "매출채권(외상매출금)을 담보로 한 대출 가능 여부 심사",
        diff: "심화",
        time: 7,
        docs: ["사업자등록증", "세금계산서", "매출채권 명세", "거래처 계약서"],
        fields: [
          { key: "receivableAmount", label: "매출채권 총액 (만원)", type: "number", placeholder: "예: 10000" },
          { key: "debtorCompany", label: "매출처(채무자) 업체명", type: "text", placeholder: "예: OO전자" },
          { key: "debtorCreditRating", label: "매출처 신용등급", type: "select", options: ["AAA~AA", "A", "BBB", "BB", "B 이하", "모름"] },
          { key: "receivableDueDate", label: "채권 만기 (일)", type: "select", options: ["30일 이내", "31~60일", "61~90일", "91~120일", "120일 초과"] },
          { key: "annualRevenue", label: "연 매출액 (만원)", type: "number", placeholder: "예: 50000" },
          { key: "desiredLoanRatio", label: "희망 대출비율 (%)", type: "number", placeholder: "예: 70" }
        ],
        considerations: [
          "매출처(채무자) 신용도가 대출 승인의 핵심",
          "매출채권 대비 대출비율 (통상 70~80%)",
          "이중 양도·압류 위험 확인 (채권양도등록 필수)",
          "부실채권(90일 초과 연체) 담보 제외",
          "팩토링 vs 매출채권담보대출 구조 차이"
        ],
        references: [
          "전자채권(B2B) 등록시스템",
          "한국무역보험공사 매출채권보험",
          "신용보증기금 매출채권 팩토링 보증"
        ]
      },
      {
        name: "카드매출 선정산 심사",
        desc: "카드매출 선정산(선지급) 서비스 이용 자격 및 한도 심사",
        diff: "표준",
        time: 4,
        docs: ["사업자등록증", "카드매출 내역서"],
        fields: [
          { key: "monthlyCardSales", label: "월 평균 카드매출 (만원)", type: "number", placeholder: "예: 3000" },
          { key: "businessAge", label: "업력 (년)", type: "number", placeholder: "예: 2" },
          { key: "businessType", label: "업종", type: "text", placeholder: "예: 카페" },
          { key: "desiredAdvanceRatio", label: "선정산 희망 비율 (%)", type: "number", placeholder: "예: 80" },
          { key: "existingAdvanceService", label: "기존 선정산 이용 여부", type: "select", options: ["없음", "있음"] },
          { key: "cardCompanyCount", label: "거래 카드사 수", type: "number", placeholder: "예: 5" }
        ],
        considerations: [
          "카드매출 안정성 (최근 3개월 변동폭)",
          "선정산 수수료율 vs 일반 정산 대기 비용 비교",
          "중복 선정산 이용 시 과다 차입 위험",
          "계절성 업종의 비수기 매출 급감 대비"
        ],
        references: [
          "여신금융협회 가맹점 매출 데이터",
          "카드사별 선정산 서비스 약관",
          "소상공인시장진흥공단 카드매출 분석 서비스"
        ]
      },
      {
        name: "소상공인 긴급경영자금 심사",
        desc: "재난·경기침체 시 긴급경영안정자금 수혜 자격 심사",
        diff: "표준",
        time: 6,
        docs: ["사업자등록증", "매출 감소 증빙", "피해사실확인서"],
        fields: [
          { key: "disasterType", label: "피해 유형", type: "select", options: ["자연재해(풍수해)", "감염병(팬데믹)", "경기침체", "지역 재개발", "기타"] },
          { key: "revenueDrop", label: "매출 감소율 (%)", type: "number", placeholder: "예: 30" },
          { key: "annualRevenue", label: "연 매출액 (만원)", type: "number", placeholder: "예: 12000" },
          { key: "employeeCount", label: "상시근로자 수 (명)", type: "number", placeholder: "예: 3" },
          { key: "desiredAmount", label: "신청 금액 (만원)", type: "number", placeholder: "예: 5000" },
          { key: "existingPolicyLoan", label: "기존 정책자금 대출 잔액 (만원)", type: "number", placeholder: "예: 3000" },
          { key: "businessAge", label: "업력 (년)", type: "number", placeholder: "예: 4" }
        ],
        considerations: [
          "피해 사실 입증 가능 여부 (공공기관 확인서 등)",
          "매출 감소 20% 이상 등 지원 기준 충족",
          "기존 정책자금과의 중복 수혜 한도",
          "긴급자금 특성상 심사 간소화 절차 적용 가능",
          "상환유예·이자감면 등 특례 조건 확인"
        ],
        references: [
          "소상공인시장진흥공단 긴급경영안정자금 공고",
          "중소벤처기업부 재난 지원 정책",
          "지방자치단체별 추가 긴급지원 현황"
        ]
      }
    ],
    corp: [
      {
        name: "기업대출 심사",
        desc: "중소·중견기업 운전자금·시설자금 대출 심사",
        diff: "심화",
        time: 10,
        docs: ["사업자등록증", "재무제표(3개년)", "법인등기부등본", "주주명부"],
        fields: [
          { key: "annualRevenue", label: "연 매출액 (억원)", type: "number", placeholder: "예: 50" },
          { key: "operatingProfit", label: "영업이익 (억원)", type: "number", placeholder: "예: 5" },
          { key: "totalDebt", label: "총 차입금 (억원)", type: "number", placeholder: "예: 20" },
          { key: "corpCreditRating", label: "기업 신용등급", type: "select", options: ["AAA", "AA", "A", "BBB", "BB", "B", "CCC 이하", "미평가"] },
          { key: "loanPurpose", label: "자금 용도", type: "select", options: ["운전자금", "시설자금", "무역금융", "기타"] },
          { key: "desiredAmount", label: "희망 대출금액 (억원)", type: "number", placeholder: "예: 10" },
          { key: "collateralAvailable", label: "담보 제공 가능", type: "select", options: ["부동산", "기계장비", "유가증권", "보증서", "무담보"] },
          { key: "debtToEquityRatio", label: "부채비율 (%)", type: "number", placeholder: "예: 150" }
        ],
        considerations: [
          "부채비율 200% 이하 기준 충족 여부",
          "이자보상배율(ICR) 1배 이상 유지 가능성",
          "매출 성장성 및 업종 전망",
          "대표이사 연대보증 면제 가능 여부 (기술보증 등)",
          "금융권 여신 집중도 및 차환 리스크"
        ],
        references: [
          "한국기업데이터(KED) 기업신용평가",
          "한국은행 기업경영분석 통계",
          "신용보증기금/기술보증기금 보증 기준",
          "금융감독원 기업여신 심사 가이드라인"
        ]
      },
      {
        name: "회사채 발행 적격 심사",
        desc: "회사채(사채) 발행 가능 여부 및 발행 조건 시뮬레이션",
        diff: "전문가",
        time: 15,
        docs: ["재무제표(3개년)", "감사보고서", "신용평가서", "사업계획서"],
        fields: [
          { key: "corpCreditRating", label: "신용평가 등급", type: "select", options: ["AAA", "AA+", "AA", "AA-", "A+", "A", "A-", "BBB+", "BBB", "BBB-", "BB+ 이하"] },
          { key: "issuanceAmount", label: "발행 예정 금액 (억원)", type: "number", placeholder: "예: 100" },
          { key: "maturity", label: "만기 (년)", type: "select", options: ["1", "2", "3", "5", "7", "10"] },
          { key: "annualRevenue", label: "연 매출액 (억원)", type: "number", placeholder: "예: 500" },
          { key: "operatingProfit", label: "영업이익 (억원)", type: "number", placeholder: "예: 50" },
          { key: "existingBondBalance", label: "기발행 회사채 잔액 (억원)", type: "number", placeholder: "예: 200" },
          { key: "bondType", label: "채권 유형", type: "select", options: ["무보증 공모사채", "보증사채", "전환사채(CB)", "신주인수권부사채(BW)", "사모사채"] }
        ],
        considerations: [
          "투자적격등급(BBB- 이상) 충족 여부가 공모 발행 핵심",
          "발행 시장 금리 및 크레딧 스프레드 수준",
          "기존 차입금 대비 회사채 발행 후 부채비율 변화",
          "만기 집중 위험 (차환 부담) 분석",
          "코벤넌트(재무제한조건) 설정 수준"
        ],
        references: [
          "한국신용평가/NICE신용평가/한국기업평가 등급",
          "한국거래소 채권시장 발행 통계",
          "금융투자협회 채권정보센터",
          "한국은행 기준금리 및 크레딧 스프레드"
        ]
      },
      {
        name: "신용등급 평가",
        desc: "기업 신용등급 사전 시뮬레이션 및 등급 변동 예측",
        diff: "전문가",
        time: 12,
        docs: ["재무제표(3개년)", "감사보고서", "사업계획서"],
        fields: [
          { key: "annualRevenue", label: "연 매출액 (억원)", type: "number", placeholder: "예: 200" },
          { key: "operatingProfitMargin", label: "영업이익률 (%)", type: "number", placeholder: "예: 8" },
          { key: "debtToEquityRatio", label: "부채비율 (%)", type: "number", placeholder: "예: 120" },
          { key: "interestCoverageRatio", label: "이자보상배율 (배)", type: "number", placeholder: "예: 3.5" },
          { key: "currentRatio", label: "유동비율 (%)", type: "number", placeholder: "예: 150" },
          { key: "industrySector", label: "업종", type: "text", placeholder: "예: 전자부품 제조" },
          { key: "companyAge", label: "설립 연수 (년)", type: "number", placeholder: "예: 15" },
          { key: "cashFlowFromOps", label: "영업활동현금흐름 (억원)", type: "number", placeholder: "예: 30" }
        ],
        considerations: [
          "재무지표(정량)와 비재무지표(정성) 종합 평가",
          "업종 평균 대비 상대적 위치",
          "최근 3개년 재무 추세 (개선/악화)",
          "대주주 지배구조 및 경영 안정성",
          "ESG(환경·사회·지배구조) 요소 반영 추세"
        ],
        references: [
          "한국신용평가(KIS) 등급 산정 방법론",
          "NICE신용평가 업종별 평가 모형",
          "한국기업평가(KR) 신용평가 기준",
          "한국은행 기업경영분석 업종 평균"
        ]
      },
      {
        name: "프로젝트 파이낸싱 심사",
        desc: "대규모 프로젝트(인프라/개발) PF 대출 가능성 심사",
        diff: "전문가",
        time: 15,
        docs: ["사업계획서", "수익성 분석(Feasibility Study)", "인허가 서류", "시공사 신용평가서"],
        fields: [
          { key: "projectType", label: "프로젝트 유형", type: "select", options: ["부동산개발", "SOC(인프라)", "발전/에너지", "플랜트", "기타"] },
          { key: "totalProjectCost", label: "총 사업비 (억원)", type: "number", placeholder: "예: 500" },
          { key: "equityRatio", label: "자기자본 비율 (%)", type: "number", placeholder: "예: 30" },
          { key: "expectedIRR", label: "예상 IRR (%)", type: "number", placeholder: "예: 12" },
          { key: "constructionPeriod", label: "공사 기간 (개월)", type: "number", placeholder: "예: 24" },
          { key: "mainContractor", label: "시공사 신용등급", type: "select", options: ["AAA~AA", "A", "BBB", "BB 이하"] },
          { key: "permitStatus", label: "인허가 상태", type: "select", options: ["완료", "진행중", "미착수"] }
        ],
        considerations: [
          "사업 수익성(IRR, NPV) 충족 여부",
          "시공사 신용보강(책임준공) 가능 여부",
          "인허가 리스크 및 민원 가능성",
          "분양률/입주율 시나리오별 현금흐름 분석",
          "금리 상승 시 이자비용 증가 민감도 분석"
        ],
        references: [
          "한국건설산업연구원 건설경기 전망",
          "국토교통부 사업 인허가 현황",
          "한국주택금융공사 PF 보증 기준",
          "금융감독원 부동산PF 리스크 관리 가이드"
        ]
      },
      {
        name: "수출입 금융 심사",
        desc: "수출입 기업 무역금융 한도 및 보험 자격 심사",
        diff: "심화",
        time: 8,
        docs: ["사업자등록증", "수출실적증명서", "L/C(신용장)", "무역계약서"],
        fields: [
          { key: "exportAmount", label: "연간 수출액 (만불)", type: "number", placeholder: "예: 500" },
          { key: "importAmount", label: "연간 수입액 (만불)", type: "number", placeholder: "예: 300" },
          { key: "tradeFinanceType", label: "금융 유형", type: "select", options: ["수출신용장(L/C) 매입", "수출팩토링", "포페이팅", "수입신용장 개설", "DA/DP 금융", "무역보험"] },
          { key: "buyerCountry", label: "거래국가", type: "text", placeholder: "예: 미국" },
          { key: "buyerCreditRating", label: "바이어 신용등급", type: "select", options: ["우수", "양호", "보통", "주의", "모름"] },
          { key: "desiredAmount", label: "희망 금융한도 (만불)", type: "number", placeholder: "예: 200" },
          { key: "paymentTerms", label: "결제조건", type: "select", options: ["L/C at sight", "Usance L/C", "D/A", "D/P", "T/T 선지급", "T/T 후지급"] }
        ],
        considerations: [
          "바이어 소재국 국가 리스크(Country Risk) 등급",
          "결제조건별 대금 미회수 위험 수준",
          "환율 변동 리스크 및 환헤지 필요성",
          "한국무역보험공사 보험 부보 가능 여부",
          "수출실적 기반 무역금융 한도 산정 기준"
        ],
        references: [
          "한국무역보험공사(K-SURE) 국가·바이어 신용평가",
          "한국수출입은행 무역금융 지원 기준",
          "KOTRA 해외바이어 신용조사 서비스",
          "한국은행 외환시장 동향"
        ]
      },
      {
        name: "M&A 자금조달 심사",
        desc: "기업 인수·합병 자금조달 구조 및 재무적 타당성 심사",
        diff: "전문가",
        time: 15,
        docs: ["인수대상 재무제표", "기업가치 평가서(Valuation)", "인수계약서(LOI/SPA)", "사업시너지 분석서"],
        fields: [
          { key: "targetCompanyValue", label: "인수대상 기업가치 (억원)", type: "number", placeholder: "예: 300" },
          { key: "acquisitionPrice", label: "인수 예정가액 (억원)", type: "number", placeholder: "예: 350" },
          { key: "equityFinancing", label: "자기자금 조달 (억원)", type: "number", placeholder: "예: 150" },
          { key: "debtFinancing", label: "차입 조달 (억원)", type: "number", placeholder: "예: 200" },
          { key: "targetEBITDA", label: "대상회사 EBITDA (억원)", type: "number", placeholder: "예: 40" },
          { key: "synergyCost", label: "예상 시너지 효과 (억원/년)", type: "number", placeholder: "예: 15" },
          { key: "financingStructure", label: "자금조달 구조", type: "select", options: ["선순위 대출", "메자닌(CB/BW)", "LBO(차입매수)", "유상증자", "복합구조"] },
          { key: "acquirerDebtRatio", label: "인수회사 부채비율 (%)", type: "number", placeholder: "예: 100" }
        ],
        considerations: [
          "인수가 대비 EBITDA 배수(EV/EBITDA) 적정성",
          "인수 후 합산 부채비율 및 신용등급 변동 예상",
          "시너지 실현 가능성 및 통합(PMI) 리스크",
          "LBO 구조 시 차입 상환 가능 현금흐름 충분성",
          "규제 리스크 (공정위 기업결합 심사 등)"
        ],
        references: [
          "공정거래위원회 기업결합 심사 기준",
          "한국M&A거래소 거래 사례 데이터",
          "금융감독원 대규모 기업금융 심사 기준",
          "삼일PwC/딜로이트/KPMG Valuation 가이드라인"
        ]
      }
    ]
  },
  realestate: {
    personal: [
      {
        name: "주택담보대출 심사",
        desc: "주택 매매·보유 시 담보대출 한도·금리 시뮬레이션",
        diff: "심화",
        time: 8,
        docs: ["신분증", "소득증빙", "등기부등본", "매매계약서", "주민등록등본"],
        fields: [
          { key: "propertyPrice", label: "주택 매매가 (만원)", type: "number", placeholder: "예: 80000" },
          { key: "appraisedValue", label: "감정평가액 (만원)", type: "number", placeholder: "예: 78000" },
          { key: "annualIncome", label: "연소득 (만원)", type: "number", placeholder: "예: 6000" },
          { key: "region", label: "소재지", type: "select", options: ["투기과열지구", "조정대상지역", "비규제지역"] },
          { key: "housingCount", label: "보유 주택 수", type: "select", options: ["무주택", "1주택", "2주택", "3주택 이상"] },
          { key: "existingMortgage", label: "기존 주담대 잔액 (만원)", type: "number", placeholder: "예: 10000" },
          { key: "loanPurpose", label: "대출 목적", type: "select", options: ["매매자금", "생활자금", "전세반환", "사업자금"] },
          { key: "desiredTerm", label: "대출 기간 (년)", type: "select", options: ["10", "15", "20", "25", "30", "35", "40"] }
        ],
        considerations: [
          "LTV 규제 (투기과열지구 40%, 조정대상 50%, 비규제 70%)",
          "DSR 40% 규제 (총부채 원리금상환액/연소득)",
          "다주택자 대출 제한 규정",
          "9억 초과분 LTV 차등 적용",
          "생애최초 주택구입 시 LTV 우대 여부"
        ],
        references: [
          "금융감독원 주택담보대출 규제 현황",
          "국토교통부 투기지역/조정대상지역 고시",
          "한국부동산원 주택 시세 데이터",
          "대법원 등기정보 광장"
        ]
      },
      {
        name: "전세대출 심사",
        desc: "전세보증금 대출 한도·보증·금리 종합 심사",
        diff: "심화",
        time: 7,
        docs: ["신분증", "소득증빙", "전세계약서", "등기부등본", "주민등록등본"],
        fields: [
          { key: "depositAmount", label: "전세보증금 (만원)", type: "number", placeholder: "예: 35000" },
          { key: "annualIncome", label: "연소득 (만원)", type: "number", placeholder: "예: 5000" },
          { key: "creditScore", label: "신용점수", type: "number", placeholder: "예: 750" },
          { key: "housingType", label: "주택 유형", type: "select", options: ["아파트", "빌라/연립", "오피스텔", "단독주택"] },
          { key: "isFirstHome", label: "무주택 여부", type: "select", options: ["무주택", "1주택 이상"] },
          { key: "guaranteeType", label: "보증기관", type: "select", options: ["HUG", "SGI", "HF"] },
          { key: "age", label: "만 나이", type: "number", placeholder: "예: 30" },
          { key: "isSingleHousehold", label: "1인 가구 여부", type: "select", options: ["예", "아니오"] }
        ],
        considerations: [
          "보증한도: HUG 수도권 5억, 비수도권 3억 (2026년 기준)",
          "전세가율(전세가/매매가) 80% 초과 시 깡통전세 위험",
          "임대인 세금 체납 여부 및 근저당 설정 확인",
          "청년 전세대출 우대 조건 (만 34세 이하, 연소득 5천만원 이하)",
          "갭투자 방지를 위한 실거주 요건"
        ],
        references: [
          "HUG 전세보증금반환보증 심사 기준",
          "국토교통부 전월세신고 시스템",
          "한국부동산원 전세가격지수",
          "법원 등기정보 열람 서비스"
        ]
      },
      {
        name: "DSR 시뮬레이션",
        desc: "총부채원리금상환비율(DSR) 계산 및 한도 역산",
        diff: "표준",
        time: 4,
        docs: ["소득증빙", "기존 대출 내역서"],
        fields: [
          { key: "annualIncome", label: "연소득 (만원)", type: "number", placeholder: "예: 6000" },
          { key: "mortgageBalance", label: "주담대 잔액 (만원)", type: "number", placeholder: "예: 30000" },
          { key: "mortgageRate", label: "주담대 금리 (%)", type: "number", placeholder: "예: 4.5" },
          { key: "mortgageTerm", label: "주담대 잔여기간 (년)", type: "number", placeholder: "예: 25" },
          { key: "creditLoanBalance", label: "신용대출 잔액 (만원)", type: "number", placeholder: "예: 3000" },
          { key: "otherLoanRepayment", label: "기타 대출 연간 상환액 (만원)", type: "number", placeholder: "예: 600" },
          { key: "newLoanAmount", label: "신규 대출 희망액 (만원)", type: "number", placeholder: "예: 20000" },
          { key: "newLoanRate", label: "신규 대출 예상 금리 (%)", type: "number", placeholder: "예: 5.0" }
        ],
        considerations: [
          "DSR 40% 기준 (전 금융권 합산)",
          "주담대 원리금균등상환 vs 만기일시상환 DSR 산정 차이",
          "신용대출 만기 7년 간주 규정 (DSR 산정 시)",
          "스트레스 DSR 도입에 따른 가산금리 적용"
        ],
        references: [
          "금융감독원 DSR 산정 가이드라인",
          "은행연합회 DSR 계산기",
          "한국은행 기준금리 및 시장금리 동향"
        ]
      },
      {
        name: "LTV 한도 계산",
        desc: "주택담보인정비율(LTV) 기반 최대 대출한도 계산",
        diff: "표준",
        time: 3,
        docs: ["등기부등본", "매매계약서"],
        fields: [
          { key: "propertyPrice", label: "주택가격/감정가 (만원)", type: "number", placeholder: "예: 80000" },
          { key: "region", label: "규제지역", type: "select", options: ["투기과열지구", "조정대상지역", "비규제지역"] },
          { key: "housingCount", label: "보유 주택 수", type: "select", options: ["무주택", "1주택(처분조건)", "2주택 이상"] },
          { key: "existingMortgage", label: "기존 선순위 근저당 설정액 (만원)", type: "number", placeholder: "예: 10000" },
          { key: "isFirstTimeBuyer", label: "생애최초 주택구입", type: "select", options: ["해당", "비해당"] },
          { key: "propertyValue9억구간", label: "9억원 초과 여부", type: "select", options: ["9억 이하", "9억 초과"] }
        ],
        considerations: [
          "규제지역별 LTV 한도 차등 (40%/50%/70%)",
          "9억 초과분에 대한 LTV 20%p 차감 적용",
          "생애최초 구입 시 LTV 최대 80% 우대",
          "선순위 채권 차감 후 실질 가용 한도 산정",
          "중도금 대출에서 잔금 대출 전환 시 LTV 재산정"
        ],
        references: [
          "금융위원회 LTV 규제 고시",
          "국토교통부 규제지역 현황",
          "한국부동산원 시세/감정평가 기준"
        ]
      },
      {
        name: "청약 가점 계산",
        desc: "주택 청약 시 가점제 점수 계산 및 당첨 확률 시뮬레이션",
        diff: "표준",
        time: 5,
        docs: ["주민등록등본", "청약통장 가입확인서"],
        fields: [
          { key: "noHousingPeriod", label: "무주택 기간 (년)", type: "number", placeholder: "예: 10" },
          { key: "dependents", label: "부양가족 수 (본인 제외)", type: "number", placeholder: "예: 3" },
          { key: "subscriptionPeriod", label: "청약통장 가입기간 (년)", type: "number", placeholder: "예: 8" },
          { key: "age", label: "만 나이", type: "number", placeholder: "예: 38" },
          { key: "targetArea", label: "청약 지역", type: "select", options: ["서울", "경기/인천", "광역시", "기타 지역"] },
          { key: "housingSize", label: "신청 면적", type: "select", options: ["전용 60㎡ 이하", "전용 60~85㎡", "전용 85㎡ 초과"] }
        ],
        considerations: [
          "무주택 기간 최대 32점 (만30세부터 산정, 15년 이상 만점)",
          "부양가족 최대 35점 (6인 이상 만점)",
          "청약통장 가입기간 최대 17점 (15년 이상 만점)",
          "가점제 vs 추첨제 비율 (85㎡ 이하: 가점 75%/추첨 25% 등)",
          "특별공급(신혼, 다자녀, 노부모 등) 해당 여부 별도 확인"
        ],
        references: [
          "한국부동산원 청약홈(applyhome.co.kr)",
          "국토교통부 주택공급 규칙",
          "LH/SH 등 공공분양 공고"
        ]
      },
      {
        name: "재건축 분담금 시뮬레이션",
        desc: "재건축 사업 시 예상 분담금(추가부담금) 산출",
        diff: "심화",
        time: 8,
        docs: ["등기부등본", "조합원 분양신청서", "감정평가서"],
        fields: [
          { key: "existingAppraisalValue", label: "기존 주택 감정가 (만원)", type: "number", placeholder: "예: 50000" },
          { key: "existingArea", label: "기존 전용면적 (㎡)", type: "number", placeholder: "예: 59" },
          { key: "newArea", label: "신규 배정 전용면적 (㎡)", type: "number", placeholder: "예: 84" },
          { key: "estimatedNewPrice", label: "새 아파트 예상 분양가 (만원/㎡)", type: "number", placeholder: "예: 800" },
          { key: "constructionCostPerUnit", label: "공사비 분담 (만원)", type: "number", placeholder: "예: 25000" },
          { key: "excessProfitTax", label: "재건축 초과이익환수 예상 (만원)", type: "number", placeholder: "예: 5000" }
        ],
        considerations: [
          "종전 감정가 vs 분양가 차액이 분담금의 핵심",
          "재건축 초과이익환수제 적용 여부 (면제 기준: 인당 3,000만원 이하)",
          "조합원 분양가와 일반분양가 차이 분석",
          "공사비 증가 리스크 (원자재 가격 변동)",
          "이주비 대출 및 중도금 대출 한도"
        ],
        references: [
          "국토교통부 재건축 초과이익환수 기준",
          "한국부동산원 공동주택 공시가격",
          "서울시 정비사업 정보몽땅",
          "대한건설협회 건설공사비 지수"
        ]
      },
      {
        name: "양도소득세 시뮬레이션",
        desc: "부동산 매도 시 양도소득세 예상 세액 계산",
        diff: "심화",
        time: 7,
        docs: ["등기부등본", "매매계약서(취득/양도)", "필요경비 증빙"],
        fields: [
          { key: "acquisitionPrice", label: "취득가액 (만원)", type: "number", placeholder: "예: 50000" },
          { key: "sellingPrice", label: "양도가액 (만원)", type: "number", placeholder: "예: 80000" },
          { key: "acquisitionDate", label: "취득일", type: "text", placeholder: "예: 2020-03-15" },
          { key: "sellingDate", label: "양도 예정일", type: "text", placeholder: "예: 2026-06-01" },
          { key: "necessaryExpenses", label: "필요경비 (만원)", type: "number", placeholder: "예: 1500" },
          { key: "housingCount", label: "보유 주택 수", type: "select", options: ["1주택", "2주택", "3주택 이상"] },
          { key: "isRegulatedArea", label: "규제지역 여부", type: "select", options: ["규제지역", "비규제지역"] },
          { key: "hasLivedIn", label: "실거주 기간 (년)", type: "number", placeholder: "예: 3" }
        ],
        considerations: [
          "1세대 1주택 비과세 요건 (2년 보유 + 규제지역 2년 거주)",
          "다주택자 중과세율 (기본세율 + 20~30%p)",
          "장기보유특별공제 (최대 80%: 보유 10년+거주 10년)",
          "12억 초과분에 대한 과세 (1주택 비과세 한도)",
          "취득세·양도세 동시 고려한 순이익 계산"
        ],
        references: [
          "국세청 양도소득세 자동계산 서비스",
          "국세법령정보시스템 소득세법",
          "한국부동산원 실거래가 공개시스템",
          "기획재정부 세법 개정안"
        ]
      },
      {
        name: "분양권 전매 적격",
        desc: "분양권 전매 가능 여부 및 제한 조건 확인",
        diff: "표준",
        time: 4,
        docs: ["분양계약서", "주민등록등본", "당첨자 발표문"],
        fields: [
          { key: "region", label: "분양 소재지", type: "select", options: ["투기과열지구", "조정대상지역", "비규제지역", "수도권(비규제)", "비수도권"] },
          { key: "supplyType", label: "공급 유형", type: "select", options: ["민영주택-일반공급", "민영주택-특별공급", "공공분양", "공공택지 민영"] },
          { key: "winningDate", label: "당첨일", type: "text", placeholder: "예: 2025-06-01" },
          { key: "contractDate", label: "계약일", type: "text", placeholder: "예: 2025-07-01" },
          { key: "expectedCompletionDate", label: "입주 예정일", type: "text", placeholder: "예: 2028-03-01" },
          { key: "housingSize", label: "전용면적", type: "select", options: ["60㎡ 이하", "60~85㎡", "85㎡ 초과"] }
        ],
        considerations: [
          "투기과열지구: 소유권이전등기 시까지 전매 금지 원칙",
          "조정대상지역: 소유권이전등기 또는 3년 중 짧은 기간",
          "비규제지역: 6개월~1년 전매제한 후 가능",
          "특별공급 당첨자 5년 전매 제한",
          "위반 시 3년 이하 징역 또는 3,000만원 이하 벌금"
        ],
        references: [
          "국토교통부 분양권 전매제한 기간 고시",
          "한국부동산원 청약홈 전매제한 안내",
          "주택법 시행령 전매행위 제한 규정"
        ]
      },
      {
        name: "주거급여 수급 자격",
        desc: "주거급여(임차/자가) 수급 자격 및 예상 지급액 심사",
        diff: "표준",
        time: 5,
        docs: ["주민등록등본", "소득·재산 증빙", "임대차계약서"],
        fields: [
          { key: "householdSize", label: "가구원 수 (명)", type: "number", placeholder: "예: 3" },
          { key: "monthlyIncome", label: "가구 월 소득 (만원)", type: "number", placeholder: "예: 200" },
          { key: "totalAsset", label: "가구 총 재산 (만원)", type: "number", placeholder: "예: 10000" },
          { key: "residenceType", label: "거주 형태", type: "select", options: ["임차(전세)", "임차(월세)", "자가"] },
          { key: "monthlyRent", label: "월 임차료 (만원)", type: "number", placeholder: "예: 40" },
          { key: "region", label: "거주 지역", type: "select", options: ["1급지(서울)", "2급지(경기/인천)", "3급지(광역시/세종)", "4급지(그 외)"] }
        ],
        considerations: [
          "기준 중위소득 48% 이하 가구 수급 자격 (2026년 기준)",
          "소득인정액 = 소득평가액 + 재산의 소득환산액",
          "급지별·가구원수별 기준임대료 상한 적용",
          "자가 가구는 수선유지급여 (경보수~대보수 차등)",
          "부양의무자 기준 폐지로 수급 범위 확대"
        ],
        references: [
          "국토교통부 주거급여 사업안내",
          "마이홈 포털(myhome.go.kr) 주거급여 계산기",
          "보건복지부 기준 중위소득 고시",
          "LH 주거급여 신청·관리 시스템"
        ]
      }
    ],
    sole: [
      {
        name: "상가 담보대출 심사",
        desc: "상가·근린생활시설 담보대출 한도·금리 심사",
        diff: "심화",
        time: 8,
        docs: ["사업자등록증", "등기부등본", "임대차계약서", "감정평가서"],
        fields: [
          { key: "propertyValue", label: "상가 감정가 (만원)", type: "number", placeholder: "예: 50000" },
          { key: "purchasePrice", label: "매매가 (만원)", type: "number", placeholder: "예: 48000" },
          { key: "annualRentalIncome", label: "연 임대수입 (만원)", type: "number", placeholder: "예: 3600" },
          { key: "annualRevenue", label: "사업 연매출 (만원)", type: "number", placeholder: "예: 15000" },
          { key: "existingMortgage", label: "기존 근저당 설정액 (만원)", type: "number", placeholder: "예: 10000" },
          { key: "ltvDesired", label: "희망 대출비율 (%)", type: "number", placeholder: "예: 60" },
          { key: "propertyType", label: "상가 유형", type: "select", options: ["1층 로드숍", "상가건물 내 호실", "지식산업센터", "근린생활시설"] },
          { key: "location", label: "소재지 (구/시)", type: "text", placeholder: "예: 서울 강남구" }
        ],
        considerations: [
          "상가 LTV 한도 (통상 60~70%, 비규제)",
          "임대수익 대비 이자상환능력(DSCR) 1.2배 이상",
          "공실 리스크 및 상권 분석",
          "주택규제와 별도로 사업자 대출 DSR 적용 차이",
          "경매 낙찰가율 기반 담보 안전성 평가"
        ],
        references: [
          "한국부동산원 상업용 부동산 임대동향",
          "대법원 경매정보 낙찰가율 통계",
          "한국감정원 감정평가 기준",
          "소상공인시장진흥공단 상권정보시스템"
        ]
      },
      {
        name: "임대사업자 등록 적격",
        desc: "민간임대사업자 등록 자격 요건 및 세제 혜택 시뮬레이션",
        diff: "표준",
        time: 6,
        docs: ["등기부등본", "주민등록등본", "재산세 납부 내역"],
        fields: [
          { key: "propertyCount", label: "임대 예정 주택/상가 수", type: "number", placeholder: "예: 2" },
          { key: "propertyType", label: "임대 물건 유형", type: "select", options: ["주택(아파트)", "주택(다세대/연립)", "오피스텔", "상가"] },
          { key: "rentalType", label: "임대 유형", type: "select", options: ["장기일반(10년)", "공공지원(10년)"] },
          { key: "acquisitionValue", label: "물건 공시가격 (만원)", type: "number", placeholder: "예: 60000" },
          { key: "monthlyRent", label: "월 임대료 (만원)", type: "number", placeholder: "예: 80" },
          { key: "registrationPurpose", label: "등록 목적", type: "select", options: ["세제혜택", "대출규제 우회", "임대수익 안정화", "종합"] }
        ],
        considerations: [
          "공시가격 6억 이하(비수도권 3억 이하) 등록 가능 기준",
          "의무임대기간(10년) 미이행 시 과태료 및 혜택 환수",
          "임대료 증액 제한 (연 5% 이내)",
          "종합부동산세·양도소득세 혜택 축소 추세 반영",
          "2020년 이후 등록제도 변경사항 확인 필수"
        ],
        references: [
          "국토교통부 렌트홈(임대등록시스템)",
          "민간임대주택에 관한 특별법",
          "국세청 임대소득 신고 안내",
          "지방자치단체 임대사업자 등록 기준"
        ]
      },
      {
        name: "상가 권리금 산정",
        desc: "상가 임차 시 권리금 적정가 산출 및 보호 여부 판단",
        diff: "표준",
        time: 6,
        docs: ["임대차계약서", "매출 증빙", "인테리어 투자 내역"],
        fields: [
          { key: "monthlyRevenue", label: "월 평균 매출 (만원)", type: "number", placeholder: "예: 2500" },
          { key: "monthlyProfit", label: "월 평균 순이익 (만원)", type: "number", placeholder: "예: 500" },
          { key: "interiorInvestment", label: "인테리어 투자비 (만원)", type: "number", placeholder: "예: 3000" },
          { key: "businessAge", label: "영업 기간 (년)", type: "number", placeholder: "예: 5" },
          { key: "remainingLeaseTerm", label: "잔여 임대차 기간 (개월)", type: "number", placeholder: "예: 18" },
          { key: "location", label: "상가 소재지 (구/동)", type: "text", placeholder: "예: 마포구 합정동" },
          { key: "premiumType", label: "권리금 유형", type: "select", options: ["영업권리금", "시설권리금", "바닥권리금(지역)", "복합"] }
        ],
        considerations: [
          "상가임대차보호법상 권리금 보호 대상 여부 (환산보증금 기준)",
          "영업권리금: 월 순이익 x 영업승계 배수 (통상 12~36개월)",
          "시설권리금: 인테리어 잔존가치 (감가상각 적용)",
          "바닥권리금: 해당 상권 입지 프리미엄 시세 반영",
          "임대인의 권리금 회수 방해 시 손해배상 청구 가능"
        ],
        references: [
          "소상공인시장진흥공단 상가 권리금 산정 가이드",
          "대한법률구조공단 상가임대차 분쟁 사례",
          "국토교통부 상가건물임대차보호법 해설",
          "소진공 상권정보시스템 권리금 시세"
        ]
      }
    ],
    corp: [
      {
        name: "부동산 PF 심사",
        desc: "부동산 개발 프로젝트파이낸싱(PF) 대출 타당성 심사",
        diff: "전문가",
        time: 15,
        docs: ["사업계획서", "인허가 서류", "시공사 보증서", "분양성 분석서", "감정평가서"],
        fields: [
          { key: "projectType", label: "개발 유형", type: "select", options: ["아파트", "오피스텔/주상복합", "상업시설", "지식산업센터", "물류센터", "복합개발"] },
          { key: "totalProjectCost", label: "총 사업비 (억원)", type: "number", placeholder: "예: 800" },
          { key: "landCost", label: "토지 매입비 (억원)", type: "number", placeholder: "예: 300" },
          { key: "constructionCost", label: "공사비 (억원)", type: "number", placeholder: "예: 400" },
          { key: "expectedSalesRevenue", label: "예상 분양수입 (억원)", type: "number", placeholder: "예: 1200" },
          { key: "preSalesRate", label: "사전 분양률 (%)", type: "number", placeholder: "예: 30" },
          { key: "mainContractorRating", label: "시공사 신용등급", type: "select", options: ["AAA~AA", "A", "BBB", "BB 이하"] },
          { key: "permitStatus", label: "인허가 진행단계", type: "select", options: ["완료(착공 가능)", "건축허가 완료", "사업승인 진행중", "미착수"] }
        ],
        considerations: [
          "시공사 신용보강(책임준공확약) 필수 여부",
          "분양률 시나리오별 현금흐름 분석 (30%/50%/70%/100%)",
          "PF 대출 금리 상승 시 사업수지 민감도",
          "브릿지론 → 본PF 전환 조건 충족 여부",
          "금융감독원 부동산PF 건전성 분류 기준 (양호/보통/유의/부실우려)"
        ],
        references: [
          "금융감독원 부동산PF 리스크 관리 강화 방안",
          "한국건설산업연구원 건설경기 전망",
          "국토교통부 인허가 현황 및 분양 통계",
          "한국부동산원 분양시장 동향"
        ]
      },
      {
        name: "오피스 임차 조건 심사",
        desc: "기업 오피스 임차 시 재무적 적정성 및 조건 심사",
        diff: "심화",
        time: 7,
        docs: ["재무제표", "임대차계약서(안)", "사업계획서"],
        fields: [
          { key: "officeArea", label: "임차 면적 (㎡)", type: "number", placeholder: "예: 330" },
          { key: "monthlyRent", label: "월 임대료 (만원)", type: "number", placeholder: "예: 1500" },
          { key: "deposit", label: "보증금 (만원)", type: "number", placeholder: "예: 18000" },
          { key: "leaseTerm", label: "임대차 기간 (년)", type: "select", options: ["2", "3", "5", "10"] },
          { key: "annualRevenue", label: "회사 연 매출 (억원)", type: "number", placeholder: "예: 100" },
          { key: "employeeCount", label: "입주 인원 (명)", type: "number", placeholder: "예: 50" },
          { key: "officeGrade", label: "오피스 등급", type: "select", options: ["프라임(A+)", "A급", "B급", "C급"] },
          { key: "location", label: "소재지 (권역)", type: "select", options: ["CBD(광화문/을지로)", "GBD(강남)", "YBD(여의도)", "기타 서울", "수도권", "지방"] }
        ],
        considerations: [
          "매출 대비 임차료 비율 (통상 5~10% 이내 적정)",
          "1인당 면적 적정성 (10~15㎡/인)",
          "보증금 vs 월차임 전환율 비교 (기회비용 분석)",
          "렌트프리(무상임대) 협상 가능 여부",
          "원상복구 의무 비용 사전 산정"
        ],
        references: [
          "한국부동산원 상업용 부동산 임대동향 조사",
          "JLL/CBRE/쿠시먼 오피스 시장 리포트",
          "서울시 오피스 공실률 통계",
          "국토교통부 상업용 부동산 실거래가"
        ]
      },
      {
        name: "부동산 감정평가 시뮬레이션",
        desc: "부동산 감정평가 사전 시뮬레이션 및 평가액 예측",
        diff: "심화",
        time: 8,
        docs: ["등기부등본", "건축물대장", "토지이용계획확인서", "임대차 현황"],
        fields: [
          { key: "propertyType", label: "물건 유형", type: "select", options: ["토지", "아파트", "상가건물", "오피스빌딩", "공장/창고", "복합부동산"] },
          { key: "landArea", label: "토지 면적 (㎡)", type: "number", placeholder: "예: 500" },
          { key: "buildingArea", label: "건물 연면적 (㎡)", type: "number", placeholder: "예: 2000" },
          { key: "buildingAge", label: "건물 경과연수 (년)", type: "number", placeholder: "예: 10" },
          { key: "zoning", label: "용도지역", type: "select", options: ["일반상업", "근린상업", "준주거", "일반주거(2종)", "일반주거(3종)", "준공업", "기타"] },
          { key: "annualNOI", label: "연간 순영업소득 (만원)", type: "number", placeholder: "예: 12000" },
          { key: "capRateEstimate", label: "예상 환원이율 (%)", type: "number", placeholder: "예: 5" },
          { key: "location", label: "소재지 (구/시)", type: "text", placeholder: "예: 서울 영등포구" }
        ],
        considerations: [
          "3가지 평가방식 비교 (원가법, 거래사례비교법, 수익환원법)",
          "수익용 부동산은 수익환원법(NOI/Cap Rate) 중심 평가",
          "공시지가 vs 실거래가 vs 감정가 괴리율 분석",
          "건물 잔존가치 산정 시 내용연수 및 감가상각 방법",
          "개발이익(최유효이용) 반영 가능 여부"
        ],
        references: [
          "한국감정평가사협회 감정평가 실무기준",
          "국토교통부 표준지 공시지가",
          "한국부동산원 실거래가·시세 데이터",
          "감정평가법 및 감정평가에 관한 규칙"
        ]
      }
    ]
  }
};
