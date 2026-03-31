import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_INPUT = "data/refined-economic-terms.json";
const DEFAULT_OVERRIDES = "data/manual-term-overrides.json";
const DEFAULT_JSON_OUTPUT = "data/generated-quiz-bank.json";
const DEFAULT_TS_OUTPUT = "data/generated-quiz-bank.ts";

function parseArgs(argv) {
  const args = {
    input: DEFAULT_INPUT,
    overrides: DEFAULT_OVERRIDES,
    jsonOut: DEFAULT_JSON_OUTPUT,
    tsOut: DEFAULT_TS_OUTPUT
  };

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    const next = argv[index + 1];

    if (current === "--input" && next) {
      args.input = next;
      index += 1;
      continue;
    }

    if (current === "--overrides" && next) {
      args.overrides = next;
      index += 1;
      continue;
    }

    if (current === "--json-out" && next) {
      args.jsonOut = next;
      index += 1;
      continue;
    }

    if (current === "--ts-out" && next) {
      args.tsOut = next;
      index += 1;
    }
  }

  return args;
}

function normalizeWhitespace(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function endsWithBatchim(word) {
  const clean = word.trim();
  const lastChar = clean.charAt(clean.length - 1);
  if (!lastChar) return false;
  const code = lastChar.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return false;
  return (code - 0xac00) % 28 !== 0;
}

function particle(word, pair) {
  const [withBatchim, withoutBatchim] = pair;
  return `${word}${endsWithBatchim(word) ? withBatchim : withoutBatchim}`;
}

function applyOverrides(entry, overrides) {
  const override = overrides[entry.term];
  if (!override) return entry;

  return {
    ...entry,
    description: normalizeWhitespace(override.description ?? entry.description),
    relatedKeywords: (override.relatedKeywords ?? entry.relatedKeywords ?? [])
      .map((keyword) => normalizeWhitespace(keyword))
      .filter(Boolean),
    category: override.category ?? entry.category
  };
}

function sanitizeEntries(entries, overrides) {
  return entries
    .map((entry) =>
      applyOverrides(
        {
          ...entry,
          term: normalizeWhitespace(entry.term),
          description: normalizeWhitespace(entry.description),
          relatedKeywords: (entry.relatedKeywords ?? []).map((keyword) => normalizeWhitespace(keyword)).filter(Boolean)
        },
        overrides
      )
    )
    .filter((entry) => entry.term && entry.description && entry.description.length >= 40 && entry.term.length <= 80);
}

function classifyCategory(entry) {
  if (entry.category && entry.category !== "") return entry.category;

  const text = `${entry.term} ${entry.description} ${entry.relatedKeywords.join(" ")}`;

  if (/(기준금리|통화정책|공개시장운영|지급준비|repo|rp|중앙은행)/i.test(text)) return "통화정책";
  if (/(물가|인플레이션|디플레이션|소비자물가|생산자물가|cpi|ppi)/i.test(text)) return "물가";
  if (/(환율|환헤지|외환|환리스크|달러|원화)/i.test(text)) return "환율";
  if (/(채권|국채|회사채|수익률곡선|금리)/i.test(text)) return "채권";
  if (/(주식|코스피|코스닥|per|pbr|roe)/i.test(text)) return "주식";
  if (/(gdp|gni|경기|재정정책|경상수지|실업|잠재성장)/i.test(text)) return "거시경제";
  if (/(가계부채|ltv|dti|dsr|대출|담보)/i.test(text)) return "가계부채";
  if (/(금융시장|유동성|스프레드|자금시장|신용경색)/i.test(text)) return "금융시장";
  if (/(국가신용등급|imf|bis|국제|대외|fsb|cme|euro dollar|herstatt)/i.test(text)) return "국제금융";
  if (/(은행|예금|예대마진|예금보험)/i.test(text)) return "은행";

  return "경제금융 일반";
}

function classifyDifficulty(entry) {
  const length = entry.description.length;
  const keywordCount = entry.relatedKeywords.length;

  if (length > 260 || keywordCount >= 4) return "hard";
  if (length > 150 || keywordCount >= 2) return "medium";
  return "easy";
}

function createHint(entry) {
  const keywords = entry.relatedKeywords;
  if (keywords.length > 0) {
    return `이 용어는 ${particle(keywords[0], ["과", "와"])} 함께 보면 더 쉽게 떠올릴 수 있어요. 정의보다 역할과 연결 관계를 먼저 잡아보세요.`;
  }

  return "설명 속에서 이 개념이 무엇을 조절하거나 설명하는지 먼저 찾아보세요.";
}

function createExplanation(entry) {
  const description = normalizeWhitespace(entry.description);
  const summary = description.split(/(?<=[.!?다])\s+/)[0] || description;
  const keywordText = entry.relatedKeywords.slice(0, 3).join(", ");

  return {
    summary,
    why: `${particle(entry.term, ["은", "는"])} 정의 자체보다 어떤 상황에서 쓰이고 무엇과 비교되는지를 이해해야 문제를 더 안정적으로 풀 수 있습니다.`,
    example: keywordText
      ? `${particle(entry.term, ["을", "를"])} ${keywordText} 같은 연관 개념과 함께 보면 실제 경제 기사와 설명에서 더 자연스럽게 연결됩니다.`
      : `${particle(entry.term, ["이", "가"])} 실제 기사에서 어떤 정책, 지표, 시장 변화와 함께 등장하는지 연결해서 보면 기억에 오래 남습니다.`,
    newsPoint: keywordText
      ? `실제 뉴스에서는 ${keywordText} 같은 키워드와 함께 묶여 등장할 가능성이 큽니다.`
      : `실제 뉴스에서는 정의보다 시장 영향, 정책 맥락, 투자 판단과 함께 자주 등장합니다.`
  };
}

function createRelatedNews(entry) {
  const keywords = entry.relatedKeywords.length ? entry.relatedKeywords : [entry.term];
  const left = keywords[0];
  const right = keywords[1] ?? keywords[0];

  return [
    {
      title: `${left} 관련 흐름 찾아보기`,
      summary: `${particle(left, ["을", "를"])} 기준으로 실제 기사와 설명 자료를 빠르게 이어서 볼 수 있도록 연결한 검색 링크입니다.`,
      source: "Google",
      url: `https://www.google.com/search?q=${encodeURIComponent(left)}`
    },
    {
      title: `${right} 국내 기사 찾아보기`,
      summary: `${particle(right, ["을", "를"])} 중심으로 국내 뉴스와 해설을 빠르게 훑어볼 수 있도록 연결한 검색 링크입니다.`,
      source: "NAVER",
      url: `https://search.naver.com/search.naver?query=${encodeURIComponent(right)}`
    }
  ];
}

function buildWrongChoiceExplanations(answer, choices) {
  return Object.fromEntries(
    choices.filter((choice) => choice !== answer).map((choice) => [
      choice,
      `${particle(choice, ["은", "는"])} 정답 ${particle(answer, ["과", "와"])} 비슷해 보여도 정의의 대상이나 쓰임새가 다릅니다. 핵심 역할과 적용 상황을 다시 비교해보세요.`
    ])
  );
}

function buildMultipleChoiceQuestion(entry, entries, index) {
  const distractorPool = entries.filter((candidate) => candidate.term !== entry.term).map((candidate) => candidate.term);
  const distractors = [];

  for (let offset = 0; offset < distractorPool.length && distractors.length < 3; offset += 1) {
    const candidate = distractorPool[(index + offset) % distractorPool.length];
    if (!distractors.includes(candidate)) {
      distractors.push(candidate);
    }
  }

  const choices = [entry.term, ...distractors].sort((left, right) => left.localeCompare(right, "ko"));

  return {
    id: `auto-mc-${String(index + 1).padStart(4, "0")}`,
    term: entry.term,
    category: classifyCategory(entry),
    type: "multiple_choice",
    difficulty: classifyDifficulty(entry),
    question: `다음 설명에 해당하는 경제금융 용어는 무엇인가요?\n${entry.description}`,
    choices,
    answer: entry.term,
    hint: createHint(entry),
    explanation: createExplanation(entry),
    wrongChoiceExplanations: buildWrongChoiceExplanations(entry.term, choices),
    relatedSearchTerms: entry.relatedKeywords.length ? entry.relatedKeywords : [entry.term],
    relatedNews: createRelatedNews(entry)
  };
}

function buildShortAnswerQuestion(entry, index) {
  const difficulty = classifyDifficulty(entry);

  return {
    id: `auto-sa-${String(index + 1).padStart(4, "0")}`,
    term: entry.term,
    category: classifyCategory(entry),
    type: "short_answer",
    difficulty: difficulty === "easy" ? "medium" : difficulty,
    question: `다음 설명을 읽고 해당 용어를 직접 입력해보세요.\n${entry.description}`,
    answer: entry.term,
    acceptableAnswers: [entry.term.replace(/\s+/g, ""), entry.term.toLowerCase()],
    hint: createHint(entry),
    explanation: createExplanation(entry),
    relatedSearchTerms: entry.relatedKeywords.length ? entry.relatedKeywords : [entry.term],
    relatedNews: createRelatedNews(entry)
  };
}

async function ensureParentDirectory(filePath) {
  await mkdir(path.dirname(filePath), { recursive: true });
}

function buildTsModule(questions) {
  return `import { QuizQuestion } from "@/lib/types";\n\nexport const GENERATED_QUESTIONS: QuizQuestion[] = ${JSON.stringify(questions, null, 2)};\n`;
}

async function readOverrides(overridesPath) {
  try {
    const raw = await readFile(overridesPath, "utf8");
    return JSON.parse(raw.replace(/^\uFEFF/, ""));
  } catch {
    return {};
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const inputPath = path.resolve(args.input);
  const overridesPath = path.resolve(args.overrides);
  const jsonOutputPath = path.resolve(args.jsonOut);
  const tsOutputPath = path.resolve(args.tsOut);
  const parsed = JSON.parse(await readFile(inputPath, "utf8"));
  const overrides = await readOverrides(overridesPath);
  const sourceEntries = sanitizeEntries(parsed.entries ?? [], overrides);

  const multipleCount = Math.floor(sourceEntries.length * 0.8);
  const shortCount = sourceEntries.length - multipleCount;
  const multipleEntries = sourceEntries.slice(0, multipleCount);
  const shortEntries = sourceEntries.slice(multipleCount, multipleCount + shortCount);

  const questions = [
    ...multipleEntries.map((entry, index) => buildMultipleChoiceQuestion(entry, sourceEntries, index)),
    ...shortEntries.map((entry, index) => buildShortAnswerQuestion(entry, index))
  ];

  await ensureParentDirectory(jsonOutputPath);
  await ensureParentDirectory(tsOutputPath);

  await writeFile(
    jsonOutputPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        sourceJson: inputPath,
        overridesPath,
        totalQuestions: questions.length,
        multipleChoiceCount: multipleEntries.length,
        shortAnswerCount: shortEntries.length,
        questions
      },
      null,
      2
    ),
    "utf8"
  );

  await writeFile(tsOutputPath, buildTsModule(questions), "utf8");

  console.log(`Input: ${inputPath}`);
  console.log(`Overrides: ${overridesPath}`);
  console.log(`Questions: ${questions.length}`);
  console.log(`Multiple choice: ${multipleEntries.length}`);
  console.log(`Short answer: ${shortEntries.length}`);
  console.log(`JSON output: ${jsonOutputPath}`);
  console.log(`TS output: ${tsOutputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
