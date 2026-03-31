import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_INPUT = "data/parsed-economic-terms.json";
const DEFAULT_REFINED_OUTPUT = "data/refined-economic-terms.json";
const DEFAULT_REPORT_OUTPUT = "data/refine-report.json";

const REPLACEMENTS = [
  ["수 입", "수입"],
  ["지 출", "지출"],
  ["금 융", "금융"],
  ["기 관", "기관"],
  ["자 금", "자금"],
  ["시 장", "시장"],
  ["물 가", "물가"],
  ["정 책", "정책"],
  ["경 제", "경제"],
  ["통 계", "통계"],
  ["가 계", "가계"],
  ["부 채", "부채"],
  ["자 산", "자산"],
  ["대 출", "대출"],
  ["예 금", "예금"],
  ["통 화", "통화"],
  ["금 리", "금리"],
  ["현 물", "현물"],
  ["국 내", "국내"],
  ["국 외", "국외"],
  ["외 화", "외화"],
  ["원 화", "원화"],
  ["사 회", "사회"],
  ["연 금", "연금"],
  ["신 용", "신용"],
  ["처 분", "처분"],
  ["가 치", "가치"],
  ["거 래", "거래"],
  ["변 동", "변동"],
  ["지 표", "지표"],
  ["성 장", "성장"],
  ["공 급", "공급"],
  ["수 요", "수요"],
  ["중 앙은행", "중앙은행"],
  ["금 융기관", "금융기관"],
  ["시 장금리", "시장금리"],
  ["정 책금리", "정책금리"]
];

function parseArgs(argv) {
  const args = {
    input: DEFAULT_INPUT,
    refinedOut: DEFAULT_REFINED_OUTPUT,
    reportOut: DEFAULT_REPORT_OUTPUT
  };

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    const next = argv[index + 1];

    if (current === "--input" && next) {
      args.input = next;
      index += 1;
      continue;
    }

    if (current === "--refined-out" && next) {
      args.refinedOut = next;
      index += 1;
      continue;
    }

    if (current === "--report-out" && next) {
      args.reportOut = next;
      index += 1;
    }
  }

  return args;
}

function normalizeWhitespace(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.)\]])/g, "$1")
    .replace(/([(\[])\s+/g, "$1")
    .trim();
}

function refineDescription(text) {
  let refined = normalizeWhitespace(text);
  let fixCount = 0;

  for (const [from, to] of REPLACEMENTS) {
    const hits = refined.split(from).length - 1;
    if (hits > 0) {
      refined = refined.replaceAll(from, to);
      fixCount += hits;
    }
  }

  return { refined, fixCount };
}

function analyzeDescription(description, fixCount) {
  const weirdSymbols = description.match(/[�]/g) ?? [];
  const repeatedSpaces = description.match(/\s{2,}/g) ?? [];
  const score = fixCount + weirdSymbols.length * 3 + repeatedSpaces.length;

  return {
    score,
    fixCount,
    weirdSymbols: weirdSymbols.length,
    repeatedSpaces: repeatedSpaces.length
  };
}

async function ensureParentDirectory(filePath) {
  await mkdir(path.dirname(filePath), { recursive: true });
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const inputPath = path.resolve(args.input);
  const refinedOutputPath = path.resolve(args.refinedOut);
  const reportOutputPath = path.resolve(args.reportOut);
  const parsed = JSON.parse(await readFile(inputPath, "utf8"));

  const entries = (parsed.entries ?? []).map((entry) => {
    const { refined, fixCount } = refineDescription(entry.description);
    const quality = analyzeDescription(refined, fixCount);

    return {
      ...entry,
      term: normalizeWhitespace(entry.term),
      description: refined,
      relatedKeywords: (entry.relatedKeywords ?? []).map((keyword) => normalizeWhitespace(keyword)).filter(Boolean),
      quality
    };
  });

  const suspicious = entries
    .filter((entry) => entry.quality.score >= 3)
    .sort((left, right) => right.quality.score - left.quality.score)
    .map((entry) => ({
      term: entry.term,
      score: entry.quality.score,
      fixCount: entry.quality.fixCount,
      weirdSymbols: entry.quality.weirdSymbols,
      repeatedSpaces: entry.quality.repeatedSpaces,
      preview: entry.description.slice(0, 220)
    }));

  await ensureParentDirectory(refinedOutputPath);
  await ensureParentDirectory(reportOutputPath);

  await writeFile(
    refinedOutputPath,
    JSON.stringify(
      {
        ...parsed,
        generatedAt: new Date().toISOString(),
        sourcePath: inputPath,
        totalTerms: entries.length,
        entries
      },
      null,
      2
    ),
    "utf8"
  );

  await writeFile(
    reportOutputPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        sourcePath: inputPath,
        totalTerms: entries.length,
        suspiciousCount: suspicious.length,
        suspicious: suspicious.slice(0, 80)
      },
      null,
      2
    ),
    "utf8"
  );

  console.log(`Input: ${inputPath}`);
  console.log(`Refined output: ${refinedOutputPath}`);
  console.log(`Report output: ${reportOutputPath}`);
  console.log(`Total terms: ${entries.length}`);
  console.log(`Suspicious terms: ${suspicious.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
