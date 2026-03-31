import { QuizQuestion } from "@/lib/types";

function makeRelatedNews(terms: string[]) {
  const [left, right] = [terms[0], terms[1] ?? terms[0]];

  return [
    {
      title: `${left} 관련 흐름 찾아보기`,
      summary: `${left}를 기준으로 실제 기사와 해설 콘텐츠를 바로 이어서 볼 수 있도록 연결한 검색 링크입니다.`,
      source: "Google",
      url: `https://www.google.com/search?q=${encodeURIComponent(left)}`
    },
    {
      title: `${right} 국내 기사 찾아보기`,
      summary: `${right}를 중심으로 국내 뉴스와 해설을 빠르게 훑어볼 수 있도록 연결한 검색 링크입니다.`,
      source: "NAVER",
      url: `https://search.naver.com/search.naver?query=${encodeURIComponent(right)}`
    }
  ];
}

function createQuestion(question: Omit<QuizQuestion, "relatedNews">): QuizQuestion {
  return {
    ...question,
    relatedNews: makeRelatedNews(question.relatedSearchTerms ?? [question.answer])
  };
}

export const QUESTIONS: QuizQuestion[] = [
  createQuestion({
    id: "pdf-q1",
    term: "기준금리",
    category: "통화정책",
    type: "multiple_choice",
    difficulty: "easy",
    question: "한국은행 금융통화위원회가 결정하는 정책금리를 무엇이라고 하나요?",
    choices: ["기준금리", "가산금리", "시장평균금리", "예대금리차"],
    answer: "기준금리",
    hint: "한국은행이 시장금리 파급경로의 출발점으로 삼는 정책금리입니다.",
    explanation: {
      summary:
        "기준금리는 한국은행 금융통화위원회가 결정하는 정책금리로, RP와 대기성 여수신 등의 거래 기준이 됩니다.",
      why:
        "첨부 자료에서는 기준금리가 정책금리의 실체이며, 정책금리 변경이 단기 및 장기 시장금리 변동으로 이어진다고 설명합니다.",
      example:
        "기준금리가 오르면 대출금리와 채권금리도 함께 오르는 경우가 많아 가계와 기업의 자금조달 여건이 달라집니다.",
      newsPoint:
        "실제 뉴스에서는 기준금리 결정이 대출이자, 채권금리, 성장 전망과 연결되어 해석됩니다."
    },
    wrongChoiceExplanations: {
      가산금리: "가산금리는 개별 대출에 추가로 붙는 금리이지 중앙은행 정책금리가 아닙니다.",
      시장평균금리: "시장평균금리는 시장에서 형성된 결과값이지 정책 당국이 정하는 기준금리가 아닙니다.",
      예대금리차: "예대금리차는 은행의 예금금리와 대출금리 차이입니다."
    },
    relatedSearchTerms: ["환매조건부매매", "RP", "Repo"]
  }),
  createQuestion({
    id: "pdf-q2",
    term: "공개시장운영",
    category: "통화정책",
    type: "multiple_choice",
    difficulty: "medium",
    question: "중앙은행이 금융기관을 상대로 증권을 사고팔아 시중 유동성과 시장금리에 영향을 주는 수단은 무엇인가요?",
    choices: ["공개시장운영", "예금보험제도", "직접보조금", "외환보유액 평가"],
    answer: "공개시장운영",
    hint: "증권 매매를 통해 유동성을 조절하는 대표적인 통화정책 수단입니다.",
    explanation: {
      summary:
        "공개시장운영은 중앙은행이 증권을 매매해 시중 유동성과 시장금리 수준에 영향을 미치는 통화정책수단입니다.",
      why:
        "첨부 자료는 공개시장운영이 시기와 규모를 신축적으로 정할 수 있어 대부분의 선진국 중앙은행이 주된 수단으로 쓴다고 설명합니다.",
      example:
        "콜금리가 기준금리에서 크게 벗어나려 할 때 한국은행이 RP 매입이나 매각으로 유동성을 조절하는 방식이 여기에 해당합니다.",
      newsPoint:
        "뉴스에서는 유동성 공급, 흡수, 콜금리 안정 같은 표현과 함께 공개시장운영이 자주 등장합니다."
    },
    wrongChoiceExplanations: {
      예금보험제도: "예금보험제도는 예금자 보호 장치이지 통화정책 수단은 아닙니다.",
      직접보조금: "직접보조금은 재정정책에 가까운 수단입니다.",
      "외환보유액 평가": "외환보유액 평가는 자산 상태를 보는 개념이지 유동성 조절 수단이 아닙니다."
    },
    relatedSearchTerms: ["통화정책수단", "지급준비제도"]
  }),
  createQuestion({
    id: "pdf-q3",
    term: "인플레이션",
    category: "물가",
    type: "multiple_choice",
    difficulty: "easy",
    question: "물가수준이 지속적으로 상승하는 현상을 무엇이라고 하나요?",
    choices: ["인플레이션", "디플레이션", "디스인플레이션", "경기침체"],
    answer: "인플레이션",
    hint: "개별 가격이 아니라 전반적인 물가수준의 지속 상승에 주목해 보세요.",
    explanation: {
      summary:
        "인플레이션은 물가수준이 지속적으로 상승하는 현상으로, 첨부 자료는 일반적으로 연 4~5% 정도의 물가상승률이 관측되면 인플레이션이 발생했다고 판단한다고 설명합니다.",
      why:
        "문제의 핵심은 물가가 지속적으로 오르는지 여부입니다. 속도가 둔화되는 것과는 구별해야 합니다.",
      example:
        "식료품, 공공요금, 외식비가 동시에 올라 체감 생계비가 높아지는 상황이 인플레이션의 대표 사례입니다.",
      newsPoint:
        "실제 뉴스에서는 소비자물가, 기대인플레이션, 금리 인상 논의와 함께 인플레이션이 자주 묶여 나옵니다."
    },
    wrongChoiceExplanations: {
      디플레이션: "디플레이션은 물가가 지속적으로 하락하는 현상입니다.",
      디스인플레이션: "디스인플레이션은 물가가 오르긴 하지만 상승률이 둔화되는 상태입니다.",
      경기침체: "경기침체는 성장 둔화나 경기 위축을 뜻하는 개념입니다."
    },
    relatedSearchTerms: ["디스인플레이션", "디플레이션"]
  }),
  createQuestion({
    id: "pdf-q4",
    term: "디스인플레이션",
    category: "물가",
    type: "short_answer",
    difficulty: "medium",
    question: "물가수준은 계속 오르지만 물가상승률은 점차 낮아지는 현상을 무엇이라고 하나요?",
    answer: "디스인플레이션",
    acceptableAnswers: ["disinflation", "디스 인플레이션"],
    hint: "물가가 내려가는 게 아니라 오르는 속도가 느려지는 상황입니다.",
    explanation: {
      summary:
        "디스인플레이션은 물가 수준 자체는 계속 상승하지만 상승률이 둔화되는 현상입니다.",
      why:
        "첨부 자료도 5.0%, 3.5%, 2.0%처럼 물가상승률이 계속 낮아지는 예시를 통해 디스인플레이션을 설명합니다.",
      example:
        "작년엔 물가가 5% 올랐는데 올해는 2%만 오른다면 여전히 물가는 오르는 중이지만 상승 속도는 둔화된 것입니다.",
      newsPoint:
        "물가 정점 통과, 긴축 효과 반영, 수요 둔화 기사에서 디스인플레이션 여부를 자주 따집니다."
    },
    relatedSearchTerms: ["디플레이션", "통화정책"]
  }),
  createQuestion({
    id: "pdf-q5",
    term: "유동성",
    category: "금융시장",
    type: "multiple_choice",
    difficulty: "easy",
    question: "자산을 가치 손실 없이 쉽고 빠르게 현금으로 바꿀 수 있는 정도를 나타내는 개념은 무엇인가요?",
    choices: ["유동성", "수익성", "레버리지", "변동성"],
    answer: "유동성",
    hint: "현금화가 얼마나 잘 되느냐를 떠올리면 됩니다.",
    explanation: {
      summary:
        "유동성은 자산을 가치 손실 없이 얼마나 쉽고 빠르게 현금으로 바꿀 수 있는지를 뜻합니다.",
      why:
        "첨부 자료는 자산의 양과 질, 시장 형성 정도, 재융자 가능성 등에 따라 유동성 정도가 달라진다고 설명합니다.",
      example:
        "현금과 단기예금은 유동성이 높고, 일반적으로 부동산은 바로 현금화하기 어려워 유동성이 낮다고 봅니다.",
      newsPoint:
        "시장 불안 기사에서 유동성 공급, 유동성 경색, 풍부한 유동성 같은 표현이 반복해서 등장합니다."
    },
    wrongChoiceExplanations: {
      수익성: "수익성은 얼마나 이익을 내는지에 관한 개념입니다.",
      레버리지: "레버리지는 빚을 활용해 투자 규모를 키우는 개념입니다.",
      변동성: "변동성은 가격이 얼마나 크게 움직이는지를 뜻합니다."
    },
    relatedSearchTerms: ["통화지표", "M2"]
  }),
  createQuestion({
    id: "pdf-q6",
    term: "국내총생산(GDP)",
    category: "거시경제",
    type: "multiple_choice",
    difficulty: "easy",
    question: "한 나라의 영역 내에서 일정 기간 생산된 최종 생산물과 부가가치의 합계를 뜻하는 지표는 무엇인가요?",
    choices: ["국내총생산(GDP)", "국민총소득(GNI)", "소비자물가지수", "총부채원리금상환비율"],
    answer: "국내총생산(GDP)",
    hint: "생산이 기준이며, 국내에서 벌어진 경제활동을 측정합니다.",
    explanation: {
      summary:
        "GDP는 한 나라의 영역 안에서 가계, 기업, 정부 등이 생산활동을 통해 창출한 부가가치와 최종 생산물의 합계입니다.",
      why:
        "첨부 자료는 명목 GDP는 경제 규모와 구조 파악에, 실질 GDP는 성장과 경기변동 분석에 쓰인다고 설명합니다.",
      example:
        "분기 GDP 성장률이 예상보다 낮으면 경기둔화 우려가 커지고 금리 전망도 바뀔 수 있습니다.",
      newsPoint:
        "성장률 기사에서 GDP는 가장 기본적인 경기 판단 지표로 사용됩니다."
    },
    wrongChoiceExplanations: {
      "국민총소득(GNI)": "GNI는 국민 기준 소득을 측정하는 지표로 GDP와 기준이 다릅니다.",
      소비자물가지수: "소비자물가지수는 물가 흐름을 보는 지표입니다.",
      총부채원리금상환비율: "DSR은 대출 상환부담을 보는 지표입니다."
    },
    relatedSearchTerms: ["국민총소득", "GNI"]
  }),
  createQuestion({
    id: "pdf-q7",
    term: "재정정책",
    category: "거시경제",
    type: "multiple_choice",
    difficulty: "easy",
    question: "정부가 지출과 조세를 정책수단으로 사용해 총수요와 경제 안정을 조절하는 정책은 무엇인가요?",
    choices: ["재정정책", "통화정책", "환율제도", "회계정책"],
    answer: "재정정책",
    hint: "정부지출과 세금이 핵심 도구입니다.",
    explanation: {
      summary:
        "재정정책은 정부의 지출과 조세를 활용해 완전고용, 물가안정, 성장, 소득재분배 등을 도모하는 정책입니다.",
      why:
        "첨부 자료는 불황기에는 정부지출 확대 등으로 총수요를 조절해 경기 안정을 꾀할 수 있다고 설명합니다.",
      example:
        "경기 침체 때 사회간접자본 투자나 보조금, 감세를 늘리는 조치는 확장적 재정정책으로 볼 수 있습니다.",
      newsPoint:
        "추경 편성, 세수 감소, 재정 확대 기사에서는 재정정책 효과와 부작용이 함께 논의됩니다."
    },
    wrongChoiceExplanations: {
      통화정책: "통화정책은 중앙은행이 금리와 통화량을 조절하는 정책입니다.",
      환율제도: "환율제도는 외환시장의 가격 형성과 관련됩니다.",
      회계정책: "회계정책은 기업의 재무처리 기준에 관한 개념입니다."
    },
    relatedSearchTerms: ["재정수지", "정부지출"]
  }),
  createQuestion({
    id: "pdf-q8",
    term: "국채",
    category: "채권",
    type: "multiple_choice",
    difficulty: "easy",
    question: "정부가 재정자금을 조달하기 위해 발행하는 채권을 무엇이라고 하나요?",
    choices: ["국채", "회사채", "전환사채", "주식"],
    answer: "국채",
    hint: "정부가 발행하는 채권입니다.",
    explanation: {
      summary:
        "국채는 정부가 재정자금을 조달하기 위해 발행하는 채권으로, 국고채권이 대부분을 차지합니다.",
      why:
        "첨부 자료는 적자재정 시 재원 조달 등에 국채가 활용되며 만기별로 여러 종류가 있다고 설명합니다.",
      example:
        "10년 만기 국고채 금리가 오르면 시장은 성장, 물가, 정책금리 전망을 다시 해석하는 경우가 많습니다.",
      newsPoint:
        "채권시장 기사에서는 국채 금리가 기준금리 기대와 경기 전망을 비추는 핵심 지표처럼 다뤄집니다."
    },
    wrongChoiceExplanations: {
      회사채: "회사채는 기업이 발행하는 채권입니다.",
      전환사채: "전환사채는 일정 조건에서 주식으로 바꿀 수 있는 회사채입니다.",
      주식: "주식은 지분권을 뜻하며 채권과 구조가 다릅니다."
    },
    relatedSearchTerms: ["국고채권", "채권금리"]
  }),
  createQuestion({
    id: "pdf-q9",
    term: "국가신용등급",
    category: "국제금융",
    type: "multiple_choice",
    difficulty: "medium",
    question: "한 나라가 채무를 이행할 능력과 의사를 평가해 등급으로 표시한 것은 무엇인가요?",
    choices: ["국가신용등급", "소비자동향지수", "환율밴드", "기준환율"],
    answer: "국가신용등급",
    hint: "국제신용평가기관이 나라 단위로 매기는 등급입니다.",
    explanation: {
      summary:
        "국가신용등급은 한 나라의 채무 이행 능력과 의사를 평가해 등급으로 표시한 것입니다.",
      why:
        "첨부 자료는 S&P, 무디스, 피치 등이 정치적 안정성, 성장률, 외채 규모 등을 종합적으로 보고 평가한다고 설명합니다.",
      example:
        "국가신용등급이 낮아지면 정부와 기업이 해외에서 자금을 빌릴 때 금리가 더 높아질 수 있습니다.",
      newsPoint:
        "국가신용등급 변경 뉴스는 차입비용, 외국인 투자심리, 환율에까지 영향을 주는 기사로 확장됩니다."
    },
    wrongChoiceExplanations: {
      소비자동향지수: "소비자동향지수는 소비 심리를 보는 지표입니다.",
      환율밴드: "환율밴드는 환율 제도와 관련된 표현입니다.",
      기준환율: "기준환율은 환율 산정 기준일 뿐 국가의 신용평가와 다릅니다."
    },
    relatedSearchTerms: ["S&P", "무디스"]
  }),
  createQuestion({
    id: "pdf-q10",
    term: "총부채원리금상환비율(DSR)",
    category: "가계부채",
    type: "short_answer",
    difficulty: "medium",
    question: "차주의 연간 소득 대비 연간 금융부채 원리금 상환액 비율을 뜻하는 지표의 영문 약자는 무엇인가요?",
    answer: "DSR",
    acceptableAnswers: ["dsr", "총부채원리금상환비율"],
    hint: "모든 금융기관 가계대출의 원리금 상환 부담을 포괄적으로 보는 지표입니다.",
    explanation: {
      summary:
        "DSR은 차주의 연간 소득 대비 연간 금융부채 원리금 상환액 비율을 뜻합니다.",
      why:
        "첨부 자료는 DSR이 주택담보대출뿐 아니라 신용대출, 비주택담보대출, 한도대출 등까지 포함해 상환능력을 더 정확하게 본다고 설명합니다.",
      example:
        "주택담보대출이 크지 않아도 신용대출과 카드론이 많으면 DSR이 높아져 추가 대출이 어려워질 수 있습니다.",
      newsPoint:
        "가계부채 기사에서는 DSR 규제가 대출 총량과 부동산 시장의 온도를 조절하는 수단으로 자주 언급됩니다."
    },
    relatedSearchTerms: ["DTI", "LTV"]
  })
];
