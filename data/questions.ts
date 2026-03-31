import { QuizQuestion } from "@/lib/types";

const commonNews = (source: string) => [
  {
    title: `${source} 관련 국내 흐름 점검`,
    summary: "해당 개념이 최근 금융시장과 정책 기사에서 어떻게 연결되는지 가볍게 읽을 수 있도록 구성한 샘플 뉴스입니다.",
    source,
    url: "https://www.mk.co.kr/economy/"
  },
  {
    title: "실제 경제 기사에서 보는 핵심 포인트",
    summary: "초보자도 개념을 현실 뉴스와 연결해 이해할 수 있도록 짧은 요약으로 제공합니다.",
    source: "연합뉴스",
    url: "https://www.yna.co.kr/economy/all"
  }
];

export const QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    term: "기준금리",
    category: "통화정책",
    type: "multiple_choice",
    difficulty: "easy",
    question: "중앙은행이 시장 금리의 기준점으로 삼는 대표 정책금리는 무엇일까요?",
    choices: ["기준금리", "우대금리", "연체금리", "예금금리"],
    answer: "기준금리",
    hint: "시중은행 금리 방향에 큰 영향을 주는 금리입니다.",
    explanation: {
      summary: "중앙은행이 정하는 대표 정책금리입니다.",
      why: "시장 금리의 기준점 역할을 하기 때문에 정답입니다.",
      example: "기준금리가 오르면 대출금리가 따라 오르는 경우가 많습니다.",
      newsPoint: "금리 동결·인상 뉴스는 대부분 기준금리 결정과 연결됩니다."
    },
    wrongChoiceExplanations: {
      우대금리: "우대금리는 특정 상품이나 고객에게 주는 혜택 금리입니다.",
      연체금리: "연체금리는 상환을 늦췄을 때 붙는 금리입니다.",
      예금금리: "예금금리는 은행이 예금에 지급하는 금리입니다."
    },
    relatedNews: commonNews("Reuters")
  },
  {
    id: "q2",
    term: "인플레이션",
    category: "물가",
    type: "multiple_choice",
    difficulty: "easy",
    question: "전반적인 물가 수준이 지속적으로 오르는 현상은?",
    choices: ["디플레이션", "인플레이션", "환헤지", "리세션"],
    answer: "인플레이션",
    hint: "한두 품목이 아니라 전반적인 가격 수준을 떠올려 보세요.",
    explanation: {
      summary: "경제 전반에서 물가가 계속 오르는 현상입니다.",
      why: "물가 상승 자체를 가리키는 용어라서 정답입니다.",
      example: "식비, 교통비, 서비스 가격이 함께 오를 때 체감하기 쉽습니다.",
      newsPoint: "생활물가 부담 기사와 자연스럽게 연결됩니다."
    },
    wrongChoiceExplanations: {
      디플레이션: "디플레이션은 전반적인 물가 하락입니다.",
      환헤지: "환헤지는 환율 위험을 줄이는 전략입니다.",
      리세션: "리세션은 경기침체를 뜻합니다."
    },
    relatedNews: commonNews("매일경제")
  },
  {
    id: "q3",
    term: "환율",
    category: "환율",
    type: "multiple_choice",
    difficulty: "easy",
    question: "원화와 달러처럼 두 나라 통화의 교환 비율을 무엇이라고 하나요?",
    choices: ["환율", "세율", "배당률", "할인율"],
    answer: "환율",
    hint: "한 통화를 다른 통화로 바꿀 때 쓰는 비율입니다.",
    explanation: {
      summary: "서로 다른 통화를 교환할 때 적용되는 가격입니다.",
      why: "통화 간 교환 비율이기 때문에 정답입니다.",
      example: "원/달러 환율이 오르면 같은 달러를 사는 데 더 많은 원화가 필요합니다.",
      newsPoint: "수입물가와 외국인 자금 흐름 뉴스와 자주 연결됩니다."
    },
    wrongChoiceExplanations: {
      세율: "세율은 세금 비율입니다.",
      배당률: "배당률은 주주에게 지급하는 배당과 관련된 비율입니다.",
      할인율: "할인율은 현재가치 계산 등에 쓰이는 비율입니다."
    },
    relatedNews: commonNews("서울경제")
  },
  {
    id: "q4",
    term: "유동성",
    category: "금융시장",
    type: "multiple_choice",
    difficulty: "easy",
    question: "자산을 큰 손실 없이 빠르게 현금화할 수 있는 정도를 뜻하는 개념은?",
    choices: ["유동성", "수익성", "변동성", "레버리지"],
    answer: "유동성",
    hint: "현금처럼 쉽게 쓸 수 있는 정도를 떠올려 보세요.",
    explanation: {
      summary: "필요할 때 자산을 쉽게 현금으로 바꿀 수 있는 성질입니다.",
      why: "현금화의 쉬움과 속도를 나타내는 개념입니다.",
      example: "국채는 보통 부동산보다 유동성이 높다고 표현합니다.",
      newsPoint: "유동성 경색 뉴스는 시장에 돈이 잘 돌지 않는다는 뜻으로 읽을 수 있습니다."
    },
    wrongChoiceExplanations: {
      수익성: "수익성은 얼마나 이익을 내는가에 대한 개념입니다.",
      변동성: "변동성은 가격이 얼마나 크게 움직이는지를 뜻합니다.",
      레버리지: "레버리지는 빚을 활용해 투자 규모를 키우는 것입니다."
    },
    relatedNews: commonNews("Bloomberg")
  },
  {
    id: "q5",
    term: "양적완화",
    category: "통화정책",
    type: "multiple_choice",
    difficulty: "medium",
    question: "중앙은행이 국채 등을 대규모로 매입해 시중 자금을 늘리는 정책은?",
    choices: ["양적완화", "양적긴축", "재정긴축", "증세"],
    answer: "양적완화",
    hint: "금리만으로 부족할 때 자산 매입으로 유동성을 늘리는 정책입니다.",
    explanation: {
      summary: "중앙은행의 대규모 자산 매입을 통한 통화 공급 확대 정책입니다.",
      why: "자산을 사들이며 유동성을 공급하는 방식이라 정답입니다.",
      example: "경기 부양을 위해 장기금리 하락을 유도할 때 활용되곤 합니다.",
      newsPoint: "중앙은행 대차대조표 확대 뉴스와 연결됩니다."
    },
    wrongChoiceExplanations: {
      양적긴축: "양적긴축은 반대로 유동성을 흡수하는 정책입니다.",
      재정긴축: "재정긴축은 정부 지출 축소와 관련됩니다.",
      증세: "증세는 세금 정책입니다."
    },
    relatedNews: commonNews("Reuters")
  },
  {
    id: "q6",
    term: "GDP",
    category: "거시경제",
    type: "multiple_choice",
    difficulty: "easy",
    question: "한 나라에서 일정 기간 생산된 최종 재화와 서비스의 가치를 합친 지표는?",
    choices: ["GDP", "CPI", "PER", "ROE"],
    answer: "GDP",
    hint: "국가 경제의 생산 규모를 보여주는 대표 지표입니다.",
    explanation: {
      summary: "국내에서 생산된 최종 재화와 서비스의 부가가치 합계입니다.",
      why: "한 나라 경제 규모를 대표적으로 보여주는 지표입니다.",
      example: "분기 GDP 성장률이 낮아지면 경기 둔화 우려가 커질 수 있습니다.",
      newsPoint: "성장률 뉴스의 핵심 기준 지표입니다."
    },
    wrongChoiceExplanations: {
      CPI: "CPI는 소비자물가지수입니다.",
      PER: "PER은 주가수익비율입니다.",
      ROE: "ROE는 자기자본이익률입니다."
    },
    relatedNews: commonNews("한국경제")
  },
  {
    id: "q7",
    term: "채권",
    category: "채권",
    type: "multiple_choice",
    difficulty: "easy",
    question: "정부나 기업이 돈을 빌리기 위해 발행하는 증서 형태의 금융상품은?",
    choices: ["주식", "채권", "예금", "보험"],
    answer: "채권",
    hint: "빌려준 돈을 나중에 돌려받는 구조입니다.",
    explanation: {
      summary: "원금 상환과 이자 지급을 약속하는 차입 증서입니다.",
      why: "돈을 빌리기 위해 발행하는 증권이므로 정답입니다.",
      example: "정부가 발행하면 국채, 기업이 발행하면 회사채입니다.",
      newsPoint: "금리 변화 뉴스와 함께 읽으면 이해가 쉬워집니다."
    },
    wrongChoiceExplanations: {
      주식: "주식은 기업의 소유권 일부입니다.",
      예금: "예금은 금융기관에 돈을 맡기는 상품입니다.",
      보험: "보험은 위험 보장을 위한 계약입니다."
    },
    relatedNews: commonNews("한국경제")
  },
  {
    id: "q8",
    term: "주식",
    category: "주식",
    type: "multiple_choice",
    difficulty: "easy",
    question: "기업의 소유권 일부를 나타내는 자산은?",
    choices: ["채권", "주식", "예금", "수표"],
    answer: "주식",
    hint: "그 기업의 주인이 된다고 생각해 보세요.",
    explanation: {
      summary: "기업의 소유 지분을 나타내는 증권입니다.",
      why: "소유권 지분이라는 점이 핵심입니다.",
      example: "주주가 되면 배당을 받을 수 있고 주가 상승에 따른 차익도 기대할 수 있습니다.",
      newsPoint: "실적과 금리 뉴스가 주가에 반영되는 이유와 연결됩니다."
    },
    wrongChoiceExplanations: {
      채권: "채권은 빌려준 돈에 대한 권리입니다.",
      예금: "예금은 은행에 맡긴 돈입니다.",
      수표: "수표는 지급 수단입니다."
    },
    relatedNews: commonNews("CNBC")
  },
  {
    id: "q9",
    term: "신용등급",
    category: "채권",
    type: "multiple_choice",
    difficulty: "easy",
    question: "채무를 제때 갚을 능력을 등급으로 평가한 것은?",
    choices: ["신용등급", "환율등급", "소비등급", "고용등급"],
    answer: "신용등급",
    hint: "돈을 빌린 주체가 얼마나 믿을 만한지 보는 평가입니다.",
    explanation: {
      summary: "상환 능력과 신뢰도를 등급으로 표시한 것입니다.",
      why: "채무 상환 가능성을 평가하는 대표 지표입니다.",
      example: "신용등급이 낮아지면 회사채 발행 금리가 올라갈 수 있습니다.",
      newsPoint: "국가 신용등급 뉴스는 자금조달 비용과 연결됩니다."
    },
    wrongChoiceExplanations: {
      환율등급: "대표적인 금융 평가 용어가 아닙니다.",
      소비등급: "소비 성향과 관련된 표현이지 채무 평가는 아닙니다.",
      고용등급: "고용 관련 표현이지 상환능력 등급은 아닙니다."
    },
    relatedNews: commonNews("연합인포맥스")
  },
  {
    id: "q10",
    term: "환헤지",
    category: "환율",
    type: "multiple_choice",
    difficulty: "medium",
    question: "환율 변동으로 생길 손실 위험을 줄이는 전략은?",
    choices: ["환헤지", "차익실현", "레버리지", "리밸런싱"],
    answer: "환헤지",
    hint: "환율이 불리하게 움직여도 충격을 줄이려는 전략입니다.",
    explanation: {
      summary: "선물환 등으로 환율 위험을 줄이는 전략입니다.",
      why: "환위험 축소가 목적이므로 정답입니다.",
      example: "수출기업이 달러 수익을 미리 고정해 두는 방식이 여기에 해당합니다.",
      newsPoint: "달러 강세 기사에서 기업 대응 전략으로 자주 등장합니다."
    },
    wrongChoiceExplanations: {
      차익실현: "차익실현은 이익을 확정하는 행위입니다.",
      레버리지: "레버리지는 빚을 활용하는 투자입니다.",
      리밸런싱: "리밸런싱은 자산 비중을 조정하는 것입니다."
    },
    relatedNews: commonNews("서울경제")
  },
  {
    id: "q11",
    term: "디스인플레이션",
    category: "물가",
    type: "short_answer",
    difficulty: "medium",
    question: "물가가 오르긴 하지만 상승 속도가 둔화되는 현상을 무엇이라고 하나요?",
    answer: "디스인플레이션",
    acceptableAnswers: ["disinflation", "디스 인플레이션"],
    hint: "물가가 내려가는 건 아니고, 오르는 속도만 느려지는 상황입니다.",
    explanation: {
      summary: "물가는 상승하지만 상승률이 둔화되는 현상입니다.",
      why: "디플레이션과 달리 물가 수준은 여전히 오르고 있습니다.",
      example: "작년 5% 상승하던 물가가 올해 3% 상승하면 여기에 가깝습니다.",
      newsPoint: "중앙은행의 물가 안정 평가에서 자주 쓰이는 표현입니다."
    },
    relatedNews: commonNews("매일경제")
  },
  {
    id: "q12",
    term: "DSR",
    category: "은행",
    type: "short_answer",
    difficulty: "medium",
    question: "차주의 연 소득 대비 전체 금융부채 원리금 상환액 비율을 뜻하는 규제 지표의 약어는?",
    answer: "DSR",
    acceptableAnswers: ["dsr", "총부채원리금상환비율"],
    hint: "담보가치보다 상환 능력에 초점을 둔 지표입니다.",
    explanation: {
      summary: "모든 금융부채의 원리금 상환 부담을 소득과 비교한 지표입니다.",
      why: "대출자의 실제 상환 능력을 보는 규제 지표입니다.",
      example: "가계부채 관리가 강화될 때 대출 한도와 직접 연결됩니다.",
      newsPoint: "부동산 대출 규제 기사에서 빠지지 않는 용어입니다."
    },
    relatedNews: commonNews("연합뉴스")
  }
];
