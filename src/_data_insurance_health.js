// ============================================================
// 무엇이든 심사받으세요 MVP - 보험 & 건강/복지 서비스 데이터
// Generated: 2026-04-01
// ============================================================

export const DATA_IH = {

  // ──────────────────────────────────────────────────────────
  // INSURANCE (보험)
  // ──────────────────────────────────────────────────────────
  insurance: {

    // ── 개인 (personal) ──────────────────────────────────────
    personal: [
      {
        name: "생명보험 가입 심사",
        desc: "건강 상태, 직업, 가족력 등을 종합 분석하여 생명보험 가입 가능 여부와 예상 보험료를 심사합니다.",
        diff: "중",
        time: "3~5분",
        docs: ["건강검진 결과표", "기존 보험 가입 내역"],
        fields: [
          { key: "age", label: "나이", type: "number", placeholder: "예: 35" },
          { key: "gender", label: "성별", type: "select", placeholder: "선택", options: ["남성", "여성"] },
          { key: "smoking", label: "흡연 여부", type: "select", placeholder: "선택", options: ["비흡연", "흡연(1년 미만)", "흡연(1년 이상)"] },
          { key: "disease_history", label: "과거 질병 이력", type: "text", placeholder: "예: 고혈압 2020년 진단" },
          { key: "family_history", label: "가족력", type: "text", placeholder: "예: 부친 당뇨" },
          { key: "occupation", label: "직업", type: "text", placeholder: "예: 사무직, 건설노동자" },
          { key: "desired_coverage", label: "희망 보장금액(만원)", type: "number", placeholder: "예: 10000" },
          { key: "bmi", label: "BMI 또는 키/몸무게", type: "text", placeholder: "예: BMI 24 또는 175cm/78kg" }
        ],
        considerations: [
          "고지의무 위반 시 보험금 지급 거절 가능",
          "흡연/비흡연 여부에 따라 보험료 최대 50% 차이",
          "기왕증(과거 질병)에 따른 부담보 또는 할증 가능성",
          "직업 위험등급에 따른 가입 제한 여부"
        ],
        references: [
          { name: "생명보험협회", url: "https://www.klia.or.kr" },
          { name: "금감원 보험상품 비교공시", url: "https://finlife.fss.or.kr" },
          { name: "보험개발원", url: "https://www.kidi.or.kr" }
        ]
      },
      {
        name: "실손보험 가입 적격",
        desc: "현재 건강 상태와 기존 보험 가입 현황을 바탕으로 실손의료보험 가입 적격 여부를 판단합니다.",
        diff: "중",
        time: "3~5분",
        docs: ["건강검진 결과표", "기존 실손보험 증권"],
        fields: [
          { key: "age", label: "나이", type: "number", placeholder: "예: 40" },
          { key: "existing_silson", label: "기존 실손보험 유무", type: "select", placeholder: "선택", options: ["없음", "구실손(2009년 이전)", "표준화실손(2009~2017)", "신실손(2017~2021)", "4세대실손(2021~)"] },
          { key: "recent_hospital", label: "최근 3개월 통원/입원 이력", type: "text", placeholder: "예: 2026.01 정형외과 통원" },
          { key: "chronic_disease", label: "만성질환 여부", type: "text", placeholder: "예: 고혈압, 당뇨 등" },
          { key: "surgery_history", label: "수술 이력", type: "text", placeholder: "예: 2024년 무릎 관절경 수술" },
          { key: "medication", label: "현재 복용 약물", type: "text", placeholder: "예: 혈압약 매일 복용" }
        ],
        considerations: [
          "4세대 실손보험은 비급여 자기부담률이 높아 기존 실손과 비교 필수",
          "최근 3개월 이내 진료 이력은 고지의무 대상",
          "중복 가입 시 비례보상 원칙 적용",
          "15년 재가입 주기 및 보험료 인상 구조 확인"
        ],
        references: [
          { name: "손해보험협회", url: "https://www.knia.or.kr" },
          { name: "금감원 보험상품 비교공시", url: "https://finlife.fss.or.kr" },
          { name: "보험개발원", url: "https://www.kidi.or.kr" }
        ]
      },
      {
        name: "자동차보험 할인/할증",
        desc: "운전 경력, 사고 이력, 차량 정보를 기반으로 자동차보험 할인/할증 등급을 분석합니다.",
        diff: "하",
        time: "2~3분",
        docs: ["운전면허증", "자동차등록증", "보험가입경력확인서"],
        fields: [
          { key: "driver_age", label: "운전자 나이", type: "number", placeholder: "예: 32" },
          { key: "license_year", label: "면허 취득 연도", type: "number", placeholder: "예: 2015" },
          { key: "accident_3yr", label: "최근 3년 사고 횟수", type: "number", placeholder: "예: 0" },
          { key: "car_model", label: "차량 모델", type: "text", placeholder: "예: 현대 아반떼 CN7" },
          { key: "car_year", label: "차량 연식", type: "number", placeholder: "예: 2024" },
          { key: "mileage", label: "연간 주행거리(km)", type: "number", placeholder: "예: 15000" },
          { key: "current_grade", label: "현재 할인/할증 등급", type: "text", placeholder: "예: 1~23등급 또는 모름" }
        ],
        considerations: [
          "무사고 기간에 따른 할인율 차등 적용(최대 약 70% 할인)",
          "운전자 범위 설정(본인한정, 부부한정 등)에 따른 보험료 차이",
          "차량 모델별 손해율에 따른 보험료 차이",
          "마일리지 특약 활용 시 추가 할인 가능",
          "물적사고 할증 기준금액(현재 200만원) 확인"
        ],
        references: [
          { name: "보험개발원 자동차보험 참조순보험료", url: "https://www.kidi.or.kr" },
          { name: "손해보험협회", url: "https://www.knia.or.kr" },
          { name: "금감원 보험상품 비교공시", url: "https://finlife.fss.or.kr" }
        ]
      },
      {
        name: "운전자보험 필요성",
        desc: "운전 습관, 차량 용도 등을 분석하여 운전자보험 가입 필요성과 적정 보장 범위를 진단합니다.",
        diff: "하",
        time: "2~3분",
        docs: ["운전면허증", "기존 보험 증권"],
        fields: [
          { key: "drive_frequency", label: "주간 운전 빈도", type: "select", placeholder: "선택", options: ["매일", "주 3~4회", "주 1~2회", "거의 안 함"] },
          { key: "drive_purpose", label: "주 운전 목적", type: "select", placeholder: "선택", options: ["출퇴근", "업무용", "레저/여행", "혼합"] },
          { key: "accident_history", label: "과거 교통사고 이력", type: "text", placeholder: "예: 2024년 접촉사고 1회" },
          { key: "existing_coverage", label: "기존 운전자보험 유무", type: "select", placeholder: "선택", options: ["없음", "있음(보장 내용 입력)"] },
          { key: "existing_detail", label: "기존 보장 상세", type: "text", placeholder: "예: 벌금 2000만원, 변호사선임 포함" },
          { key: "family_drivers", label: "가족 운전자 수", type: "number", placeholder: "예: 2" }
        ],
        considerations: [
          "교통사고 형사합의금, 벌금 보장이 핵심",
          "자동차보험과 중복 보장 영역 확인 필수",
          "음주/무면허 사고 시 보장 제외 조항 확인",
          "변호사 선임비용 특약 포함 여부"
        ],
        references: [
          { name: "손해보험협회", url: "https://www.knia.or.kr" },
          { name: "보험연구원", url: "https://www.kiri.or.kr" },
          { name: "금감원 보험상품 비교공시", url: "https://finlife.fss.or.kr" }
        ]
      },
      {
        name: "여행자보험 보장 분석",
        desc: "여행 목적지, 기간, 활동 계획을 바탕으로 최적의 여행자보험 보장 구성을 분석합니다.",
        diff: "하",
        time: "2~3분",
        docs: ["여행 일정표", "항공권/숙소 예약 확인서"],
        fields: [
          { key: "destination", label: "여행 목적지", type: "text", placeholder: "예: 일본 도쿄" },
          { key: "duration", label: "여행 기간(일)", type: "number", placeholder: "예: 7" },
          { key: "travel_purpose", label: "여행 목적", type: "select", placeholder: "선택", options: ["관광", "출장", "유학/연수", "워킹홀리데이"] },
          { key: "activities", label: "특수 활동 계획", type: "text", placeholder: "예: 스키, 스쿠버다이빙 등" },
          { key: "age", label: "나이", type: "number", placeholder: "예: 28" },
          { key: "companion", label: "동반자 수", type: "number", placeholder: "예: 2" },
          { key: "existing_card_insurance", label: "카드사 여행보험 유무", type: "select", placeholder: "선택", options: ["없음", "있음"] }
        ],
        considerations: [
          "여행지 의료비 수준에 따라 보장 한도 결정 필요(미국은 최소 1억 권장)",
          "레저/스포츠 활동 시 별도 특약 필요 여부",
          "휴대품 손해, 항공기 지연 보장 확인",
          "카드사 부가 여행보험과 중복 보장 확인",
          "코로나 등 감염병 관련 보장 포함 여부"
        ],
        references: [
          { name: "손해보험협회", url: "https://www.knia.or.kr" },
          { name: "금감원 보험상품 비교공시", url: "https://finlife.fss.or.kr" },
          { name: "보험개발원", url: "https://www.kidi.or.kr" }
        ]
      },
      {
        name: "암보험 가입 심사",
        desc: "가족력, 건강검진 이력, 생활 습관을 종합하여 암보험 가입 적격과 최적 보장 설계를 심사합니다.",
        diff: "중",
        time: "3~5분",
        docs: ["건강검진 결과표", "가족 병력 정보"],
        fields: [
          { key: "age", label: "나이", type: "number", placeholder: "예: 45" },
          { key: "gender", label: "성별", type: "select", placeholder: "선택", options: ["남성", "여성"] },
          { key: "family_cancer", label: "가족 암 병력", type: "text", placeholder: "예: 모친 유방암, 부친 위암" },
          { key: "checkup_result", label: "최근 검진 이상 소견", type: "text", placeholder: "예: 위내시경 용종 발견" },
          { key: "smoking", label: "흡연 여부", type: "select", placeholder: "선택", options: ["비흡연", "과거흡연(금연 중)", "현재흡연"] },
          { key: "drinking", label: "음주 빈도", type: "select", placeholder: "선택", options: ["비음주", "주 1~2회", "주 3회 이상"] },
          { key: "existing_cancer_ins", label: "기존 암보험 유무", type: "select", placeholder: "선택", options: ["없음", "있음(보장금액 입력)"] },
          { key: "desired_coverage", label: "희망 진단금(만원)", type: "number", placeholder: "예: 5000" }
        ],
        considerations: [
          "소액암(갑상선, 전립선 등)과 일반암 진단금 구분 확인",
          "유사암/경계성종양 보장 범위 차이",
          "가족력에 따른 특정 암 집중 보장 필요성",
          "면책기간(90일) 및 감액기간 확인",
          "진단금 vs 실비치료형 보장 조합 전략"
        ],
        references: [
          { name: "생명보험협회", url: "https://www.klia.or.kr" },
          { name: "보험개발원", url: "https://www.kidi.or.kr" },
          { name: "보험연구원", url: "https://www.kiri.or.kr" },
          { name: "금감원 보험상품 비교공시", url: "https://finlife.fss.or.kr" }
        ]
      },
      {
        name: "연금보험 수령액 시뮬레이션",
        desc: "납입 조건, 연금 개시 시점, 수령 방식에 따른 예상 연금 수령액을 시뮬레이션합니다.",
        diff: "중",
        time: "3~5분",
        docs: ["기존 연금보험 증권", "소득 증빙"],
        fields: [
          { key: "age", label: "현재 나이", type: "number", placeholder: "예: 40" },
          { key: "monthly_premium", label: "월 납입 보험료(만원)", type: "number", placeholder: "예: 30" },
          { key: "payment_period", label: "납입 기간(년)", type: "number", placeholder: "예: 20" },
          { key: "pension_start_age", label: "연금 개시 나이", type: "number", placeholder: "예: 65" },
          { key: "pension_type", label: "수령 방식", type: "select", placeholder: "선택", options: ["종신연금형", "확정기간형(10년)", "확정기간형(20년)", "상속연금형"] },
          { key: "tax_benefit", label: "세제적격 여부", type: "select", placeholder: "선택", options: ["세제적격(연금저축)", "세제비적격(일반연금)"] },
          { key: "existing_pension", label: "기존 연금보험 유무", type: "select", placeholder: "선택", options: ["없음", "있음(월 납입액 입력)"] }
        ],
        considerations: [
          "세제적격(연금저축) vs 세제비적격(일반연금) 세금 차이",
          "연금소득세(3.3~5.5%) 및 종합과세 기준 확인",
          "공시이율형 vs 변액연금형 수익률 차이",
          "중도 해지 시 세액공제 추징 가능성",
          "국민연금과 합산한 노후 소득 설계"
        ],
        references: [
          { name: "생명보험협회", url: "https://www.klia.or.kr" },
          { name: "보험개발원", url: "https://www.kidi.or.kr" },
          { name: "금감원 보험상품 비교공시", url: "https://finlife.fss.or.kr" },
          { name: "보험연구원", url: "https://www.kiri.or.kr" }
        ]
      }
    ],

    // ── 소상공인 (sole) ──────────────────────────────────────
    sole: [
      {
        name: "영업배상책임보험 심사",
        desc: "업종, 매장 규모, 고객 접점 등을 분석하여 영업배상책임보험 가입 필요성과 적정 보장 한도를 심사합니다.",
        diff: "중",
        time: "3~5분",
        docs: ["사업자등록증", "임대차계약서", "기존 보험 증권"],
        fields: [
          { key: "business_type", label: "업종", type: "text", placeholder: "예: 음식점, 카페, 미용실" },
          { key: "revenue_annual", label: "연매출(만원)", type: "number", placeholder: "예: 30000" },
          { key: "store_size", label: "매장 면적(m2)", type: "number", placeholder: "예: 66" },
          { key: "daily_customers", label: "일평균 고객 수", type: "number", placeholder: "예: 80" },
          { key: "employee_count", label: "종업원 수", type: "number", placeholder: "예: 3" },
          { key: "accident_history", label: "과거 사고/클레임 이력", type: "text", placeholder: "예: 없음 또는 2025년 미끄러짐 사고" },
          { key: "desired_limit", label: "희망 보상한도(억원)", type: "number", placeholder: "예: 1" }
        ],
        considerations: [
          "업종별 사고 빈도 및 배상 금액 차이가 큼",
          "음식점은 식중독 배상, 시설업은 시설물 사고 등 업종 특화 보장 확인",
          "대인/대물 보장 한도 분리 설정 필요",
          "가맹본부 필수 가입 조건 확인(프랜차이즈의 경우)"
        ],
        references: [
          { name: "손해보험협회", url: "https://www.knia.or.kr" },
          { name: "보험개발원", url: "https://www.kidi.or.kr" },
          { name: "금감원 보험상품 비교공시", url: "https://finlife.fss.or.kr" }
        ]
      },
      {
        name: "화재보험 적정성",
        desc: "건물 구조, 용도, 소방 설비 등을 고려하여 화재보험 보장의 적정성을 진단합니다.",
        diff: "중",
        time: "3~5분",
        docs: ["건축물대장", "임대차계약서", "소방시설 점검표"],
        fields: [
          { key: "building_type", label: "건물 구조", type: "select", placeholder: "선택", options: ["철근콘크리트", "철골조", "조적조(벽돌)", "목조", "샌드위치패널"] },
          { key: "building_use", label: "건물 용도", type: "text", placeholder: "예: 근린생활시설, 공장" },
          { key: "building_area", label: "연면적(m2)", type: "number", placeholder: "예: 200" },
          { key: "building_age", label: "건축 연도", type: "number", placeholder: "예: 2010" },
          { key: "fire_equipment", label: "소방 설비 현황", type: "text", placeholder: "예: 스프링클러, 소화기, 감지기" },
          { key: "contents_value", label: "시설/집기 가액(만원)", type: "number", placeholder: "예: 5000" },
          { key: "is_owner", label: "소유/임차 여부", type: "select", placeholder: "선택", options: ["건물주(자가)", "임차인"] }
        ],
        considerations: [
          "다중이용업소는 화재배상책임보험 의무가입 대상",
          "건물 구조(내화/비내화)에 따른 보험료 차이",
          "재조달가액 vs 시가 기준 보장 방식 선택",
          "임차인은 임차자배상책임 특약 필수 검토",
          "이익손실(영업중단) 보장 특약 추가 고려"
        ],
        references: [
          { name: "손해보험협회", url: "https://www.knia.or.kr" },
          { name: "보험개발원", url: "https://www.kidi.or.kr" },
          { name: "금감원 보험상품 비교공시", url: "https://finlife.fss.or.kr" }
        ]
      },
      {
        name: "산재보험 적용 진단",
        desc: "소상공인의 업종, 근로자 현황, 특수형태근로 여부를 분석하여 산재보험 적용 범위를 진단합니다.",
        diff: "중",
        time: "3~5분",
        docs: ["사업자등록증", "근로계약서", "4대보험 가입확인서"],
        fields: [
          { key: "business_type", label: "업종", type: "text", placeholder: "예: 음식점, 건설업, 배달대행" },
          { key: "employee_count", label: "상시근로자 수", type: "number", placeholder: "예: 4" },
          { key: "has_parttimer", label: "단시간근로자 유무", type: "select", placeholder: "선택", options: ["없음", "있음"] },
          { key: "has_freelancer", label: "특수형태근로종사자 유무", type: "select", placeholder: "선택", options: ["없음", "있음(배달기사 등)"] },
          { key: "owner_join", label: "사업주 본인 가입 희망", type: "select", placeholder: "선택", options: ["예", "아니오"] },
          { key: "work_risk", label: "업무 위험도", type: "select", placeholder: "선택", options: ["낮음(사무직)", "보통(서비스업)", "높음(제조/건설)"] }
        ],
        considerations: [
          "근로자 1인 이상 사업장은 산재보험 당연적용 대상",
          "사업주 본인은 중소기업 사업주 임의가입 가능",
          "특수형태근로종사자(배달기사 등) 산재보험 적용 확대 추세",
          "업종별 산재보험료율 차이(0.7%~18.6%)"
        ],
        references: [
          { name: "보험개발원", url: "https://www.kidi.or.kr" },
          { name: "손해보험협회", url: "https://www.knia.or.kr" },
          { name: "보험연구원", url: "https://www.kiri.or.kr" }
        ]
      }
    ],

    // ── 기업 (corp) ──────────────────────────────────────────
    corp: [
      {
        name: "D&O 보험 심사",
        desc: "기업 규모, 업종, 이사회 구성 등을 분석하여 임원배상책임보험(D&O) 가입 필요성과 적정 보장을 심사합니다.",
        diff: "상",
        time: "5~10분",
        docs: ["법인등기부등본", "재무제표", "이사회 구성 현황"],
        fields: [
          { key: "company_type", label: "기업 형태", type: "select", placeholder: "선택", options: ["주식회사(비상장)", "주식회사(상장)", "유한회사"] },
          { key: "revenue", label: "연매출(억원)", type: "number", placeholder: "예: 100" },
          { key: "total_assets", label: "총자산(억원)", type: "number", placeholder: "예: 50" },
          { key: "industry", label: "업종", type: "text", placeholder: "예: IT, 제조, 금융" },
          { key: "board_size", label: "이사 수", type: "number", placeholder: "예: 5" },
          { key: "litigation_history", label: "소송/분쟁 이력", type: "text", placeholder: "예: 없음 또는 주주대표소송 1건" },
          { key: "desired_limit", label: "희망 보상한도(억원)", type: "number", placeholder: "예: 10" }
        ],
        considerations: [
          "상장사는 증권집단소송 리스크로 D&O 보험 필수에 가까움",
          "경영판단 원칙(Business Judgment Rule) 적용 범위 확인",
          "Side A/B/C 보장 구조 이해 필요",
          "기업 규모 대비 적정 보상 한도 설정이 핵심",
          "ESG 관련 이사 책임 강화 추세 반영"
        ],
        references: [
          { name: "손해보험협회", url: "https://www.knia.or.kr" },
          { name: "보험연구원", url: "https://www.kiri.or.kr" },
          { name: "보험개발원", url: "https://www.kidi.or.kr" }
        ]
      },
      {
        name: "사이버 보험 필요성",
        desc: "기업의 디지털 자산, 개인정보 처리 규모, IT 인프라를 분석하여 사이버 보험 필요성을 진단합니다.",
        diff: "상",
        time: "5~10분",
        docs: ["개인정보 처리방침", "IT 인프라 현황표"],
        fields: [
          { key: "industry", label: "업종", type: "text", placeholder: "예: 이커머스, 핀테크, 의료" },
          { key: "personal_data_count", label: "보유 개인정보 건수", type: "text", placeholder: "예: 약 10만건" },
          { key: "annual_online_revenue", label: "온라인 매출 비중(%)", type: "number", placeholder: "예: 70" },
          { key: "has_security_team", label: "보안 전담 인력 유무", type: "select", placeholder: "선택", options: ["전담팀 있음", "겸임 담당자", "없음"] },
          { key: "past_incidents", label: "과거 보안 사고 이력", type: "text", placeholder: "예: 없음 또는 2025년 랜섬웨어 피해" },
          { key: "cloud_usage", label: "클라우드 이용 현황", type: "select", placeholder: "선택", options: ["자체 서버", "클라우드(AWS/Azure 등)", "하이브리드"] },
          { key: "isms_cert", label: "ISMS 인증 여부", type: "select", placeholder: "선택", options: ["인증 보유", "인증 준비 중", "미인증"] }
        ],
        considerations: [
          "개인정보 유출 시 법적 배상 + 과징금 + 평판 리스크 복합 발생",
          "랜섬웨어 대응(복구비용, 영업중단 손실) 보장 확인",
          "제3자 배상 + 자사 손해 보장 범위 구분",
          "ISMS 인증 등 보안 수준에 따른 보험료 할인",
          "클라우드 사업자 책임 범위와 보험 보장 갭 확인"
        ],
        references: [
          { name: "보험연구원", url: "https://www.kiri.or.kr" },
          { name: "손해보험협회", url: "https://www.knia.or.kr" },
          { name: "보험개발원", url: "https://www.kidi.or.kr" },
          { name: "금감원 보험상품 비교공시", url: "https://finlife.fss.or.kr" }
        ]
      },
      {
        name: "기업 종합보험 설계",
        desc: "기업의 자산, 책임, 인력 리스크를 종합 분석하여 최적의 기업 종합보험 포트폴리오를 설계합니다.",
        diff: "상",
        time: "5~10분",
        docs: ["재무제표", "사업자등록증", "자산목록표", "근로자 명부"],
        fields: [
          { key: "industry", label: "업종", type: "text", placeholder: "예: 제조업, 물류, 서비스" },
          { key: "employee_count", label: "임직원 수", type: "number", placeholder: "예: 50" },
          { key: "revenue", label: "연매출(억원)", type: "number", placeholder: "예: 30" },
          { key: "property_value", label: "건물/시설 가액(억원)", type: "number", placeholder: "예: 10" },
          { key: "inventory_value", label: "재고자산 가액(억원)", type: "number", placeholder: "예: 3" },
          { key: "existing_insurance", label: "기존 가입 보험", type: "text", placeholder: "예: 화재보험, 배상책임보험" },
          { key: "key_risk", label: "주요 우려 리스크", type: "text", placeholder: "예: 제품하자, 환경오염, 영업중단" }
        ],
        considerations: [
          "재산(화재/도난), 배상책임, 인적(단체상해), 영업중단 4대 영역 통합 설계",
          "업종별 핵심 리스크 우선순위 반영 필수",
          "패키지 보험 vs 개별 보험 조합의 비용 효율 비교",
          "글로벌 영업 시 해외 PL(제조물책임) 보장 확인",
          "보험 포트폴리오 갭(Gap) 분석을 통한 누락 보장 식별"
        ],
        references: [
          { name: "손해보험협회", url: "https://www.knia.or.kr" },
          { name: "보험개발원", url: "https://www.kidi.or.kr" },
          { name: "보험연구원", url: "https://www.kiri.or.kr" },
          { name: "금감원 보험상품 비교공시", url: "https://finlife.fss.or.kr" }
        ]
      }
    ]
  },

  // ──────────────────────────────────────────────────────────
  // HEALTH (건강/복지)
  // ──────────────────────────────────────────────────────────
  health: {

    // ── 개인 (personal) ──────────────────────────────────────
    personal: [
      {
        name: "건강보험 피부양자 적격",
        desc: "소득, 재산, 부양 관계 등을 분석하여 건강보험 피부양자 자격 충족 여부를 판정합니다.",
        diff: "중",
        time: "3~5분",
        docs: ["소득금액증명원", "재산세 과세증명", "가족관계증명서"],
        fields: [
          { key: "relationship", label: "피보험자와의 관계", type: "select", placeholder: "선택", options: ["배우자", "직계존속(부모)", "직계비속(자녀)", "형제자매"] },
          { key: "annual_income", label: "연간 소득(만원)", type: "number", placeholder: "예: 2000" },
          { key: "income_type", label: "소득 유형", type: "select", placeholder: "선택", options: ["근로소득", "사업소득", "금융소득", "연금소득", "기타소득", "소득 없음"] },
          { key: "property_value", label: "재산 과세표준(만원)", type: "number", placeholder: "예: 50000" },
          { key: "property_income", label: "재산소득 연간(만원)", type: "number", placeholder: "예: 500" },
          { key: "cohabitation", label: "동거 여부", type: "select", placeholder: "선택", options: ["동거", "비동거(생계 유지)"] }
        ],
        considerations: [
          "2025년 기준 연소득 2,000만원 초과 시 피부양자 자격 상실",
          "재산 과세표준 5.4억 초과 + 연소득 1,000만원 초과 시 자격 상실",
          "사업자등록이 있으면 원칙적으로 피부양자 불가(일부 예외)",
          "형제자매는 65세 이상 또는 30세 미만만 피부양자 가능"
        ],
        references: [
          { name: "국민건강보험공단", url: "https://www.nhis.or.kr" },
          { name: "복지로", url: "https://www.bokjiro.go.kr" },
          { name: "기준중위소득표", url: "https://www.mohw.go.kr" }
        ]
      },
      {
        name: "기초생활수급 자격",
        desc: "소득인정액, 부양의무자, 가구 구성을 분석하여 기초생활보장 수급 자격을 판단합니다.",
        diff: "상",
        time: "5~10분",
        docs: ["소득금액증명원", "재산세 과세증명", "가족관계증명서", "통장사본"],
        fields: [
          { key: "household_size", label: "가구원 수", type: "number", placeholder: "예: 3" },
          { key: "monthly_income", label: "월 소득(만원)", type: "number", placeholder: "예: 80" },
          { key: "property_value", label: "재산 총액(만원)", type: "number", placeholder: "예: 5000" },
          { key: "property_region", label: "거주 지역", type: "select", placeholder: "선택", options: ["서울", "경기", "광역시", "그 외 지역"] },
          { key: "car_value", label: "자동차 가액(만원)", type: "number", placeholder: "예: 0 (없으면 0)" },
          { key: "support_obligor", label: "부양의무자 유무", type: "select", placeholder: "선택", options: ["없음", "있음(소득 입력)"] },
          { key: "desired_benefit", label: "신청 급여 종류", type: "select", placeholder: "선택", options: ["생계급여", "의료급여", "주거급여", "교육급여"] },
          { key: "special_condition", label: "특수 상황", type: "text", placeholder: "예: 한부모, 장애인, 노인 등" }
        ],
        considerations: [
          "2026년 기준중위소득 기준: 생계 32%, 의료 40%, 주거 48%, 교육 50%",
          "재산의 소득환산율: 주거용 1.04%, 일반 4.17%, 금융 6.26%",
          "부양의무자 기준 폐지 확대 중이나 의료급여는 아직 적용",
          "자동차 재산가액 100% 반영 여부(생업용 차량 예외)",
          "근로능력평가에 따른 조건부 수급 가능성"
        ],
        references: [
          { name: "복지로", url: "https://www.bokjiro.go.kr" },
          { name: "기준중위소득표", url: "https://www.mohw.go.kr" },
          { name: "국민건강보험공단", url: "https://www.nhis.or.kr" }
        ]
      },
      {
        name: "장애등급 판정 시뮬레이션",
        desc: "장애 유형, 정도, 일상생활 능력을 기반으로 장애등급(장애정도) 판정 결과를 시뮬레이션합니다.",
        diff: "상",
        time: "5~10분",
        docs: ["진단서", "의료기록", "장애진단 관련 검사 결과"],
        fields: [
          { key: "disability_type", label: "장애 유형", type: "select", placeholder: "선택", options: ["지체장애", "뇌병변장애", "시각장애", "청각장애", "언어장애", "지적장애", "자폐성장애", "정신장애", "신장장애", "심장장애", "호흡기장애", "간장애", "안면장애", "장루/요루장애", "뇌전증장애"] },
          { key: "disability_detail", label: "장애 상세", type: "text", placeholder: "예: 좌측 하지 절단, 시력 0.02" },
          { key: "onset_date", label: "발병/수상 시기", type: "text", placeholder: "예: 2024년 6월" },
          { key: "daily_living", label: "일상생활 수행 정도", type: "select", placeholder: "선택", options: ["완전 자립", "부분 도움 필요", "상당 부분 도움 필요", "전적 도움 필요"] },
          { key: "medical_treatment", label: "현재 치료 상황", type: "text", placeholder: "예: 재활치료 중, 투석 주 3회" },
          { key: "existing_grade", label: "기존 장애등록 여부", type: "select", placeholder: "선택", options: ["미등록", "기존 등록(장애 정도 입력)"] }
        ],
        considerations: [
          "2019년 7월부터 장애등급제 폐지 -> 장애 정도(심한/심하지 않은)로 구분",
          "장애 진단 후 충분한 치료 기간(6개월~2년) 경과 필요",
          "복합 장애 시 종합판정 기준 적용",
          "장애정도에 따라 활동지원서비스, 연금, 수당 등 연계 급여 상이",
          "재판정 시기 및 장애 상태 변화에 따른 등급 변동 가능"
        ],
        references: [
          { name: "복지로", url: "https://www.bokjiro.go.kr" },
          { name: "국민건강보험공단", url: "https://www.nhis.or.kr" },
          { name: "국민연금공단 장애연금", url: "https://www.nps.or.kr" }
        ]
      },
      {
        name: "국민연금 수령액 계산",
        desc: "가입 이력, 소득 수준, 수령 시점을 기반으로 예상 국민연금 수령액을 계산합니다.",
        diff: "중",
        time: "3~5분",
        docs: ["국민연금 가입내역 확인서", "소득금액증명원"],
        fields: [
          { key: "age", label: "현재 나이", type: "number", placeholder: "예: 45" },
          { key: "join_start_year", label: "가입 시작 연도", type: "number", placeholder: "예: 2005" },
          { key: "avg_monthly_income", label: "평균 월소득(만원)", type: "number", placeholder: "예: 350" },
          { key: "total_months", label: "총 납입 개월 수", type: "number", placeholder: "예: 200 (모르면 빈칸)" },
          { key: "expected_retire_age", label: "예상 은퇴 나이", type: "number", placeholder: "예: 60" },
          { key: "early_pension", label: "조기수령 희망 여부", type: "select", placeholder: "선택", options: ["정상 수령", "조기수령 희망", "연기수령 희망"] },
          { key: "military_credit", label: "군복무 크레딧 해당", type: "select", placeholder: "선택", options: ["해당(6개월 인정)", "비해당"] }
        ],
        considerations: [
          "출생연도별 수급개시 연령이 다름(1969년 이후 출생: 65세)",
          "조기수령 시 연 6%씩 감액(최대 5년, 30% 감액)",
          "연기수령 시 연 7.2%씩 증액(최대 5년, 36% 증액)",
          "국민연금 소득대체율 점진 하락(2028년 40% 목표)",
          "군복무 크레딧(6개월), 출산 크레딧(둘째부터) 반영"
        ],
        references: [
          { name: "국민연금공단", url: "https://www.nps.or.kr" },
          { name: "복지로", url: "https://www.bokjiro.go.kr" },
          { name: "국민건강보험공단", url: "https://www.nhis.or.kr" }
        ]
      },
      {
        name: "실업급여 수급 자격",
        desc: "이직 사유, 고용보험 가입 기간, 근무 이력을 분석하여 실업급여 수급 자격을 판단합니다.",
        diff: "중",
        time: "3~5분",
        docs: ["고용보험 피보험자격 이력 내역서", "이직확인서", "근로계약서"],
        fields: [
          { key: "separation_reason", label: "이직 사유", type: "select", placeholder: "선택", options: ["권고사직/해고", "계약만료", "회사 휴/폐업", "임금체불", "근로조건 변경", "본인 사정(자발적 퇴사)"] },
          { key: "insurance_months", label: "고용보험 가입 기간(개월)", type: "number", placeholder: "예: 24" },
          { key: "age", label: "나이", type: "number", placeholder: "예: 35" },
          { key: "avg_daily_wage", label: "퇴직 전 3개월 일평균 임금(원)", type: "number", placeholder: "예: 80000" },
          { key: "is_disabled", label: "장애인 여부", type: "select", placeholder: "선택", options: ["비해당", "해당"] },
          { key: "reemployment_effort", label: "재취업 활동 가능 여부", type: "select", placeholder: "선택", options: ["가능", "질병/부상으로 어려움"] }
        ],
        considerations: [
          "이직 전 18개월 중 고용보험 가입기간 180일 이상 필요",
          "자발적 퇴사는 원칙적으로 수급 불가(예외사유 존재)",
          "실업급여 지급액 = 퇴직 전 평균임금의 60% x 소정급여일수",
          "상한액(1일 66,000원) 및 하한액(최저임금의 80%) 적용",
          "수급기간 중 재취업 활동 의무(4주 1회 이상)"
        ],
        references: [
          { name: "고용보험 홈페이지", url: "https://www.ei.go.kr" },
          { name: "근로복지공단", url: "https://www.comwel.or.kr" },
          { name: "복지로", url: "https://www.bokjiro.go.kr" }
        ]
      },
      {
        name: "육아휴직 급여 계산",
        desc: "급여 수준, 자녀 나이, 근속 기간을 기반으로 육아휴직 급여 예상 수령액을 계산합니다.",
        diff: "중",
        time: "3~5분",
        docs: ["급여명세서", "고용보험 가입확인서", "출생증명서/가족관계증명서"],
        fields: [
          { key: "monthly_salary", label: "월 통상임금(만원)", type: "number", placeholder: "예: 300" },
          { key: "child_age", label: "자녀 나이(개월)", type: "number", placeholder: "예: 8" },
          { key: "child_order", label: "몇째 자녀", type: "select", placeholder: "선택", options: ["첫째", "둘째", "셋째 이상"] },
          { key: "spouse_leave", label: "배우자 육아휴직 사용 여부", type: "select", placeholder: "선택", options: ["미사용", "사용 예정", "이미 사용"] },
          { key: "leave_duration", label: "희망 휴직 기간(개월)", type: "number", placeholder: "예: 12" },
          { key: "insurance_months", label: "고용보험 가입 기간(개월)", type: "number", placeholder: "예: 36" }
        ],
        considerations: [
          "육아휴직 급여: 통상임금의 80%(상한 150만원, 하한 70만원)",
          "3+3 부모육아휴직제: 부모 모두 사용 시 처음 3개월 급여 상향",
          "사후지급금(25%) 복직 6개월 후 지급",
          "고용보험 가입기간 180일 이상 필요",
          "만 8세 이하 또는 초등학교 2학년 이하 자녀 대상"
        ],
        references: [
          { name: "고용보험 홈페이지", url: "https://www.ei.go.kr" },
          { name: "복지로", url: "https://www.bokjiro.go.kr" },
          { name: "근로복지공단", url: "https://www.comwel.or.kr" }
        ]
      },
      {
        name: "아동수당 수급 자격",
        desc: "자녀 나이와 가구 상황을 기반으로 아동수당 수급 자격 및 예상 수령액을 확인합니다.",
        diff: "하",
        time: "2~3분",
        docs: ["가족관계증명서", "주민등록등본"],
        fields: [
          { key: "child_count", label: "자녀 수", type: "number", placeholder: "예: 2" },
          { key: "child_ages", label: "자녀 나이(각각)", type: "text", placeholder: "예: 3세, 6세" },
          { key: "residence", label: "거주 지역", type: "text", placeholder: "예: 서울시 강남구" },
          { key: "is_multicultural", label: "다문화가정 여부", type: "select", placeholder: "선택", options: ["해당 없음", "해당"] },
          { key: "care_type", label: "양육 형태", type: "select", placeholder: "선택", options: ["친부모", "조부모(위탁)", "한부모", "시설보호"] }
        ],
        considerations: [
          "만 8세 미만(0~95개월) 아동에게 월 10만원 지급",
          "소득/재산 기준 없이 보편 지급(2025년 기준)",
          "국내 거주 요건 충족 필요(90일 이상 해외체류 시 중단)",
          "지자체별 추가 아동수당 확인(서울, 경기 등)"
        ],
        references: [
          { name: "복지로", url: "https://www.bokjiro.go.kr" },
          { name: "기준중위소득표", url: "https://www.mohw.go.kr" },
          { name: "국민건강보험공단", url: "https://www.nhis.or.kr" }
        ]
      },
      {
        name: "노인장기요양 등급 시뮬레이션",
        desc: "신체 기능, 인지 상태, 일상생활 수행 능력을 분석하여 장기요양 등급 판정 결과를 시뮬레이션합니다.",
        diff: "상",
        time: "5~10분",
        docs: ["의사소견서", "건강검진 결과", "기존 장기요양 등급 결과(해당 시)"],
        fields: [
          { key: "age", label: "나이", type: "number", placeholder: "예: 78" },
          { key: "mobility", label: "거동 상태", type: "select", placeholder: "선택", options: ["독립 보행 가능", "보조기구 필요", "부축 필요", "거동 불가(와상)"] },
          { key: "cognitive", label: "인지 상태", type: "select", placeholder: "선택", options: ["정상", "경도인지장애", "치매 초기", "치매 중기 이상"] },
          { key: "daily_activities", label: "일상생활(식사/배변 등)", type: "select", placeholder: "선택", options: ["완전 자립", "부분 도움", "상당 도움", "전적 도움"] },
          { key: "medical_condition", label: "주요 질환", type: "text", placeholder: "예: 뇌졸중 후유증, 파킨슨병" },
          { key: "nursing_needs", label: "간호처치 필요 여부", type: "text", placeholder: "예: 욕창관리, 경관영양" },
          { key: "current_care", label: "현재 돌봄 상태", type: "select", placeholder: "선택", options: ["가족 돌봄", "요양보호사 이용 중", "시설 입소 중", "돌봄 없음"] }
        ],
        considerations: [
          "장기요양 1~5등급 + 인지지원등급(총 6단계) 판정",
          "장기요양 인정점수 51점 이상이면 등급 부여",
          "치매 환자는 인지지원등급(45~51점)으로도 서비스 이용 가능",
          "등급에 따라 재가급여(방문요양 등) 또는 시설급여 이용",
          "등급판정위원회의 종합적 판정으로 점수만으로 확정 불가"
        ],
        references: [
          { name: "국민건강보험공단 장기요양", url: "https://www.longtermcare.or.kr" },
          { name: "복지로", url: "https://www.bokjiro.go.kr" },
          { name: "국민건강보험공단", url: "https://www.nhis.or.kr" }
        ]
      }
    ],

    // ── 소상공인 (sole) ──────────────────────────────────────
    sole: [
      {
        name: "고용보험 가입 의무",
        desc: "업종, 근로자 수, 사업 형태를 분석하여 고용보험 가입 의무 여부와 보험료를 산정합니다.",
        diff: "중",
        time: "3~5분",
        docs: ["사업자등록증", "근로계약서", "4대보험 가입확인서"],
        fields: [
          { key: "business_type", label: "업종", type: "text", placeholder: "예: 음식점, 건설업, 소매업" },
          { key: "employee_count", label: "상시근로자 수", type: "number", placeholder: "예: 3" },
          { key: "has_parttimer", label: "단시간근로자(주 15시간 미만) 유무", type: "select", placeholder: "선택", options: ["없음", "있음"] },
          { key: "monthly_payroll", label: "월 총 급여액(만원)", type: "number", placeholder: "예: 800" },
          { key: "owner_type", label: "사업주 형태", type: "select", placeholder: "선택", options: ["개인사업자", "법인 대표"] },
          { key: "owner_join_wish", label: "사업주 본인 가입 희망", type: "select", placeholder: "선택", options: ["예", "아니오"] }
        ],
        considerations: [
          "근로자 1인 이상 사업장은 고용보험 당연적용",
          "자영업자(사업주)는 임의가입 가능(50인 미만 기업)",
          "주 15시간 미만 근로자(3개월 이상 근무)도 적용 대상",
          "고용보험료율: 실업급여 사업주/근로자 각 0.9%"
        ],
        references: [
          { name: "고용보험 홈페이지", url: "https://www.ei.go.kr" },
          { name: "근로복지공단", url: "https://www.comwel.or.kr" },
          { name: "복지로", url: "https://www.bokjiro.go.kr" }
        ]
      },
      {
        name: "산재보험 적용 범위",
        desc: "업종, 근로 형태, 위험 수준을 분석하여 산재보험 적용 범위와 보험료를 산정합니다.",
        diff: "중",
        time: "3~5분",
        docs: ["사업자등록증", "근로계약서", "급여대장"],
        fields: [
          { key: "business_type", label: "업종", type: "text", placeholder: "예: 음식점, 제조업, 건설업" },
          { key: "employee_count", label: "상시근로자 수", type: "number", placeholder: "예: 5" },
          { key: "annual_payroll", label: "연간 총 급여액(만원)", type: "number", placeholder: "예: 15000" },
          { key: "work_environment", label: "작업 환경", type: "select", placeholder: "선택", options: ["사무실", "매장/서비스", "공장/제조", "건설현장", "배달/운송"] },
          { key: "special_worker", label: "특수형태근로종사자 유무", type: "select", placeholder: "선택", options: ["없음", "배달기사", "학습지교사", "대리운전", "기타"] },
          { key: "owner_join", label: "사업주 산재보험 가입 여부", type: "select", placeholder: "선택", options: ["미가입", "가입 중", "가입 희망"] }
        ],
        considerations: [
          "근로자 1인 이상 모든 사업장 당연적용(일부 예외)",
          "업종별 산재보험료율 큰 차이(광업 18.6% vs 금융업 0.7%)",
          "중소기업 사업주는 근로복지공단에 임의가입 가능",
          "출퇴근 재해도 산재보험 보장 범위에 포함",
          "산재보험료는 전액 사업주 부담"
        ],
        references: [
          { name: "근로복지공단", url: "https://www.comwel.or.kr" },
          { name: "고용보험 홈페이지", url: "https://www.ei.go.kr" },
          { name: "복지로", url: "https://www.bokjiro.go.kr" }
        ]
      },
      {
        name: "4대보험 부담금 시뮬레이션",
        desc: "급여 수준, 근로자 수를 기반으로 사업주/근로자 각각의 4대보험 부담금을 시뮬레이션합니다.",
        diff: "중",
        time: "3~5분",
        docs: ["급여대장", "사업자등록증"],
        fields: [
          { key: "employee_count", label: "근로자 수", type: "number", placeholder: "예: 5" },
          { key: "avg_salary", label: "근로자 평균 월급여(만원)", type: "number", placeholder: "예: 250" },
          { key: "owner_salary", label: "사업주 본인 월소득(만원)", type: "number", placeholder: "예: 400" },
          { key: "business_type", label: "업종", type: "text", placeholder: "예: 음식점(산재보험료율 결정용)" },
          { key: "region", label: "사업장 소재지", type: "text", placeholder: "예: 서울시 강남구" },
          { key: "has_parttimer", label: "단시간근로자 포함 여부", type: "select", placeholder: "선택", options: ["없음", "있음(주당 근무시간 입력)"] }
        ],
        considerations: [
          "국민연금 9%(사업주 4.5% + 근로자 4.5%)",
          "건강보험 7.09%(사업주 3.545% + 근로자 3.545%) + 장기요양 12.95%",
          "고용보험 실업급여 1.8%(각 0.9%) + 고용안정/직능 사업주 부담",
          "산재보험 전액 사업주 부담(업종별 요율 상이)",
          "두루누리 사회보험료 지원(10인 미만, 월 260만원 미만) 활용 가능"
        ],
        references: [
          { name: "국민건강보험공단", url: "https://www.nhis.or.kr" },
          { name: "국민연금공단", url: "https://www.nps.or.kr" },
          { name: "근로복지공단", url: "https://www.comwel.or.kr" },
          { name: "고용보험 홈페이지", url: "https://www.ei.go.kr" }
        ]
      }
    ],

    // ── 기업 (corp) ──────────────────────────────────────────
    corp: [
      {
        name: "직장 건강검진 의무 범위",
        desc: "사업장 규모, 업종, 근로자 구성을 분석하여 직장 건강검진 의무 범위와 비용을 산정합니다.",
        diff: "중",
        time: "3~5분",
        docs: ["사업자등록증", "근로자 명부", "작업환경측정 결과"],
        fields: [
          { key: "employee_count", label: "임직원 수", type: "number", placeholder: "예: 50" },
          { key: "industry", label: "업종", type: "text", placeholder: "예: 제조업, IT, 건설" },
          { key: "hazard_work", label: "유해위험 업무 유무", type: "select", placeholder: "선택", options: ["없음", "있음(유해물질 취급)", "있음(소음/진동 노출)", "있음(야간작업)"] },
          { key: "night_worker_count", label: "야간근무자 수", type: "number", placeholder: "예: 10" },
          { key: "office_ratio", label: "사무직 비율(%)", type: "number", placeholder: "예: 80" },
          { key: "last_checkup", label: "최근 건강검진 실시 시기", type: "text", placeholder: "예: 2025년 10월" }
        ],
        considerations: [
          "일반건강검진: 사무직 2년 1회, 비사무직 1년 1회",
          "특수건강검진: 유해인자 노출 근로자 별도 주기",
          "야간작업 특수건강검진(6개월 1회) 의무화",
          "미실시 시 과태료 1인당 최대 1,000만원",
          "건강검진 비용은 전액 사업주 부담"
        ],
        references: [
          { name: "국민건강보험공단", url: "https://www.nhis.or.kr" },
          { name: "근로복지공단", url: "https://www.comwel.or.kr" },
          { name: "복지로", url: "https://www.bokjiro.go.kr" }
        ]
      },
      {
        name: "장애인 고용 부담금",
        desc: "기업 규모, 현재 장애인 고용 현황을 분석하여 장애인 고용 부담금을 산정합니다.",
        diff: "중",
        time: "3~5분",
        docs: ["근로자 명부", "장애인 고용 현황표"],
        fields: [
          { key: "employee_count", label: "상시근로자 수", type: "number", placeholder: "예: 100" },
          { key: "disabled_count", label: "현재 장애인 고용 수", type: "number", placeholder: "예: 2" },
          { key: "severe_disabled", label: "중증장애인 수(포함)", type: "number", placeholder: "예: 1" },
          { key: "industry", label: "업종", type: "text", placeholder: "예: 제조업, 서비스업" },
          { key: "public_private", label: "공공/민간", type: "select", placeholder: "선택", options: ["민간기업", "공공기관", "공기업"] },
          { key: "avg_salary", label: "근로자 평균 월급여(만원)", type: "number", placeholder: "예: 350" }
        ],
        considerations: [
          "상시근로자 50인 이상 민간기업 의무고용률 3.1%(2026년)",
          "미달 시 부담기초액 x 미고용 인원수 부담금 납부",
          "장애인 1명도 고용하지 않은 경우 부담기초액의 2배 적용",
          "중증장애인은 2배수로 계산(더블카운트)"
        ],
        references: [
          { name: "복지로", url: "https://www.bokjiro.go.kr" },
          { name: "근로복지공단", url: "https://www.comwel.or.kr" },
          { name: "국민건강보험공단", url: "https://www.nhis.or.kr" }
        ]
      },
      {
        name: "퇴직연금 설계",
        desc: "기업 규모, 임직원 구성, 재무 상황을 분석하여 최적의 퇴직연금 제도 유형과 운용 전략을 설계합니다.",
        diff: "상",
        time: "5~10분",
        docs: ["재무제표", "근로자 명부", "기존 퇴직금/퇴직연금 규약"],
        fields: [
          { key: "employee_count", label: "임직원 수", type: "number", placeholder: "예: 30" },
          { key: "avg_tenure", label: "평균 근속 연수", type: "number", placeholder: "예: 5" },
          { key: "avg_salary", label: "평균 월급여(만원)", type: "number", placeholder: "예: 350" },
          { key: "current_system", label: "현재 퇴직급여 제도", type: "select", placeholder: "선택", options: ["퇴직금(일시금)", "DB형(확정급여형)", "DC형(확정기여형)", "미설정"] },
          { key: "company_financial", label: "기업 재무 상태", type: "select", placeholder: "선택", options: ["안정적", "보통", "어려움"] },
          { key: "employee_avg_age", label: "임직원 평균 나이", type: "number", placeholder: "예: 38" },
          { key: "preference", label: "선호 방향", type: "select", placeholder: "선택", options: ["기업 부담 예측 가능(DC형)", "근로자 급여 보장(DB형)", "선택형(DB+DC)", "잘 모름"] }
        ],
        considerations: [
          "상시근로자 1인 이상 사업장 퇴직급여 의무",
          "DB형: 기업이 운용 리스크 부담, 근로자 퇴직금 확정",
          "DC형: 기업은 매년 급여 1/12 납입, 운용 수익은 근로자 몫",
          "IRP(개인형퇴직연금) 활용 시 추가 세액공제 가능",
          "30인 이상 사업장은 퇴직연금 의무 도입(단계적 확대)"
        ],
        references: [
          { name: "근로복지공단", url: "https://www.comwel.or.kr" },
          { name: "국민연금공단", url: "https://www.nps.or.kr" },
          { name: "복지로", url: "https://www.bokjiro.go.kr" },
          { name: "고용보험 홈페이지", url: "https://www.ei.go.kr" }
        ]
      }
    ]
  }

};
