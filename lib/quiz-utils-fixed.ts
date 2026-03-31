import { GENERATED_QUESTIONS as QUESTIONS } from "@/data/generated-quiz-bank";
import { Difficulty, GlossaryEntry, QuestionType, QuizFilter, QuizQuestion } from "@/lib/types";

export function difficultyLabel(difficulty: Difficulty) {
  return difficulty === "easy" ? "초급" : difficulty === "medium" ? "중급" : "고급";
}

export function typeLabel(type: QuestionType) {
  return type === "multiple_choice" ? "객관식" : "주관식";
}

export function normalizeAnswer(value: string) {
  return value.toLowerCase().replace(/\s+/g, "").trim();
}

export function isCorrectShortAnswer(question: QuizQuestion, input: string) {
  const target = normalizeAnswer(input);
  const acceptable = [question.answer, ...(question.acceptableAnswers ?? [])].map(normalizeAnswer);
  return acceptable.includes(target);
}

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function pickBalancedQuestions(source: QuizQuestion[], count: number) {
  const multiple = shuffle(source.filter((q) => q.type === "multiple_choice"));
  const short = shuffle(source.filter((q) => q.type === "short_answer"));
  const multipleTarget = Math.round(count * 0.8);
  const shortTarget = count - multipleTarget;

  return shuffle([...multiple.slice(0, multipleTarget), ...short.slice(0, shortTarget)]);
}

export function getFilteredQuestions(filter: QuizFilter, wrongIds: string[] = [], bookmarkedIds: string[] = []) {
  let filtered = QUESTIONS;

  if (filter.mode === "mistakes") filtered = filtered.filter((q) => wrongIds.includes(q.id));
  if (filter.mode === "bookmarks") filtered = filtered.filter((q) => bookmarkedIds.includes(q.id));
  if (filter.wrongOnly) filtered = filtered.filter((q) => wrongIds.includes(q.id));
  if (filter.mode === "multiple_only") filtered = filtered.filter((q) => q.type === "multiple_choice");
  if (filter.mode === "short_only") filtered = filtered.filter((q) => q.type === "short_answer");
  if (filter.type && filter.type !== "all") filtered = filtered.filter((q) => q.type === filter.type);
  if (filter.difficulty && filter.difficulty !== "all") filtered = filtered.filter((q) => q.difficulty === filter.difficulty);
  if (filter.category && filter.category !== "all") filtered = filtered.filter((q) => q.category === filter.category);
  if (filter.term) filtered = filtered.filter((q) => q.term === filter.term);

  if (filter.mode === "today10") return pickBalancedQuestions(filtered, Math.min(10, filtered.length));
  if (filter.term) return filtered;
  if (!filter.mode || filter.mode === "all") return pickBalancedQuestions(filtered, Math.min(10, filtered.length));

  return shuffle(filtered);
}

export function buildGlossary(): GlossaryEntry[] {
  const seen = new Map<string, GlossaryEntry>();

  for (const q of QUESTIONS) {
    const existing = seen.get(q.term);

    if (!existing) {
      seen.set(q.term, {
        term: q.term,
        category: q.category,
        oneLine: q.explanation.summary,
        easyDescription: q.explanation.example,
        relatedKeywords: q.relatedSearchTerms,
        relatedNews: q.relatedNews,
        quizCount: 1,
        difficulties: [q.difficulty]
      });
      continue;
    }

    existing.quizCount += 1;
    if (!existing.difficulties.includes(q.difficulty)) {
      existing.difficulties.push(q.difficulty);
    }
  }

  return [...seen.values()];
}

export function getGlossaryEntryByTerm(term: string) {
  return buildGlossary().find((entry) => entry.term === term);
}

export function getQuestionsByTerm(term: string) {
  return QUESTIONS.filter((question) => question.term === term);
}

export function getRelatedGlossaryEntries(term: string, limit = 4) {
  const glossary = buildGlossary();
  const current = glossary.find((entry) => entry.term === term);
  if (!current) return [];

  const currentKeywords = new Set(current.relatedKeywords ?? []);

  return glossary
    .filter((entry) => entry.term !== term)
    .map((entry) => {
      const sharedKeywords = (entry.relatedKeywords ?? []).filter((keyword) => currentKeywords.has(keyword)).length;
      const sameCategory = entry.category === current.category ? 1 : 0;
      const score = sharedKeywords * 3 + sameCategory;

      return { entry, score };
    })
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score || left.entry.term.localeCompare(right.entry.term, "ko"))
    .slice(0, limit)
    .map(({ entry }) => entry);
}

export function getCategories() {
  return [...new Set(QUESTIONS.map((q) => q.category))];
}

export function percentage(value: number, total: number) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

