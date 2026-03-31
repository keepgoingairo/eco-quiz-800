import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { PDFParse } from "pdf-parse";

const DEFAULT_PDF_PATH = "C:/Users/user/Desktop/2026_경제금융용어 800선.pdf";
const DEFAULT_TEXT_INPUT = "pdf-extract.txt";
const DEFAULT_TEXT_OUTPUT = "data/extracted-economic-terms.txt";
const DEFAULT_JSON_OUTPUT = "data/parsed-economic-terms.json";

function parseArgs(argv) {
  const args = {
    pdf: DEFAULT_PDF_PATH,
    textIn: DEFAULT_TEXT_INPUT,
    textOut: DEFAULT_TEXT_OUTPUT,
    jsonOut: DEFAULT_JSON_OUTPUT,
    preferTextDump: true
  };

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    const next = argv[index + 1];

    if (current === "--pdf" && next) {
      args.pdf = next;
      index += 1;
      continue;
    }

    if (current === "--text-in" && next) {
      args.textIn = next;
      index += 1;
      continue;
    }

    if (current === "--text-out" && next) {
      args.textOut = next;
      index += 1;
      continue;
    }

    if (current === "--json-out" && next) {
      args.jsonOut = next;
      index += 1;
      continue;
    }

    if (current === "--from-pdf") {
      args.preferTextDump = false;
    }
  }

  return args;
}

function normalizeLine(line) {
  return line
    .replace(/\u00a0/g, " ")
    .replace(/\t+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isRomanNumeral(line) {
  return /^(?:i|ii|iii|iv|v|vi|vii|viii|ix|x|xi|xii|xiii|xiv|xv|xvi|xvii|xviii|xix|xx)$/i.test(line);
}

function isNoiseLine(line) {
  if (!line) return true;
  if (/^--\s*\d+\s+of\s+\d+\s*--$/i.test(line)) return true;
  if (/^2026$/.test(line)) return true;
  if (/^찾아보기$/.test(line)) return true;
  if (/^I\s*[·•]?경제금융용어 800선\s*$/.test(line)) return true;
  if (/^\*\s*경제금융용어 800선\s*$/.test(line)) return true;
  if (/^머\s+리\s+말$/.test(line)) return true;
  if (isRomanNumeral(line)) return true;
  if (/^Ŧ$/.test(line)) return true;
  if (/^[0-9]+$/.test(line)) return true;
  if (/^[·•\-_=]+$/.test(line)) return true;
  if (/^[가-힣A-Za-z0-9()\/-]+[·•]{3,}\s*\d+$/.test(line)) return true;
  return false;
}

function isLikelyTerm(line) {
  if (!line || isNoiseLine(line)) return false;
  if (line.startsWith("연관검색어")) return false;
  if (line.length > 80) return false;
  if (/[.!?]$/.test(line)) return false;
  if (/다\.$/.test(line)) return false;
  if ((line.match(/\s/g) ?? []).length > 5) return false;
  return true;
}

function splitKeywords(line) {
  return line
    .replace(/^연관검색어\s*/, "")
    .split(",")
    .map((keyword) => normalizeLine(keyword))
    .filter(Boolean);
}

function joinDescription(lines) {
  return lines
    .map((line) => normalizeLine(line))
    .filter((line) => line && !isNoiseLine(line))
    .join(" ")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.)\]])/g, "$1")
    .replace(/([(\[])\s+/g, "$1")
    .trim();
}

function parseSegments(lines) {
  const relatedIndexes = [];

  for (let index = 0; index < lines.length; index += 1) {
    if (lines[index].startsWith("연관검색어")) {
      relatedIndexes.push(index);
    }
  }

  const entries = [];
  let segmentStart = relatedIndexes.length ? relatedIndexes[0] + 1 : 0;

  for (let index = 1; index < relatedIndexes.length; index += 1) {
    const relatedIndex = relatedIndexes[index];
    const rawSegment = lines.slice(segmentStart, relatedIndex).filter((line) => !isNoiseLine(line));
    const relatedKeywords = splitKeywords(lines[relatedIndex]);
    segmentStart = relatedIndex + 1;

    if (rawSegment.length < 2) {
      continue;
    }

    const termIndex = rawSegment.findIndex((line) => isLikelyTerm(line));
    if (termIndex === -1) {
      continue;
    }

    const term = normalizeLine(rawSegment[termIndex]);
    const description = joinDescription(rawSegment.slice(termIndex + 1));

    if (!term || !description || description.length < 40) {
      continue;
    }

    entries.push({
      id: `bok-${String(entries.length + 1).padStart(4, "0")}`,
      term,
      description,
      relatedKeywords,
      source: "2026 경제금융용어 800선"
    });
  }

  const deduped = new Map();
  for (const entry of entries) {
    if (!deduped.has(entry.term)) {
      deduped.set(entry.term, entry);
    }
  }

  return [...deduped.values()];
}

async function ensureParentDirectory(filePath) {
  await mkdir(path.dirname(filePath), { recursive: true });
}

async function extractPdfText(pdfPath) {
  const buffer = await readFile(pdfPath);
  const parser = new PDFParse({ data: buffer });

  try {
    const result = await parser.getText();
    return result.pages.map((page) => page.text.trim()).join("\n\n");
  } finally {
    await parser.destroy();
  }
}

async function loadSourceText(args) {
  const textInputPath = path.resolve(args.textIn);

  if (args.preferTextDump) {
    try {
      const text = await readFile(textInputPath, "utf8");
      return { sourceText: text, sourceLabel: textInputPath, sourceType: "text_dump" };
    } catch {
      // Fall back to direct PDF extraction when the text dump is missing.
    }
  }

  const pdfPath = path.resolve(args.pdf);
  const text = await extractPdfText(pdfPath);
  return { sourceText: text, sourceLabel: pdfPath, sourceType: "pdf_direct" };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const textOutputPath = path.resolve(args.textOut);
  const jsonOutputPath = path.resolve(args.jsonOut);
  const { sourceText, sourceLabel, sourceType } = await loadSourceText(args);
  const normalizedLines = sourceText.split(/\r?\n/).map((line) => normalizeLine(line));
  const entries = parseSegments(normalizedLines);
  const relatedMarkerCount = normalizedLines.filter((line) => line.startsWith("연관검색어")).length;

  await ensureParentDirectory(textOutputPath);
  await ensureParentDirectory(jsonOutputPath);

  await writeFile(textOutputPath, sourceText.replaceAll("\r\n", "\n"), "utf8");
  await writeFile(
    jsonOutputPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        sourceType,
        sourcePath: sourceLabel,
        relatedMarkerCount,
        extractionCoverage: relatedMarkerCount
          ? Number((entries.length / relatedMarkerCount).toFixed(4))
          : 0,
        totalTerms: entries.length,
        entries
      },
      null,
      2
    ),
    "utf8"
  );

  console.log(`Source type: ${sourceType}`);
  console.log(`Source path: ${sourceLabel}`);
  console.log(`Related markers: ${relatedMarkerCount}`);
  console.log(`Terms: ${entries.length}`);
  console.log(`Text output: ${textOutputPath}`);
  console.log(`JSON output: ${jsonOutputPath}`);
  console.log(`Sample terms: ${entries.slice(0, 10).map((entry) => entry.term).join(", ")}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
