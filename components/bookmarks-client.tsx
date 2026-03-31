"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Bookmark, ExternalLink, HelpCircle, ListChecks, Pin } from "lucide-react";
import { GENERATED_QUESTIONS as QUESTIONS } from "@/data/generated-quiz-bank";
import { difficultyLabel, percentage, typeLabel } from "@/lib/quiz-utils-fixed";
import { getBookmarkedQuestionIds, getLearningStore, toggleBookmark } from "@/lib/storage";

function formatLastSolved(submittedAt?: string) {
  if (!submittedAt) return "아직 풀어보지 않음";

  const date = new Date(submittedAt);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const dayMs = 1000 * 60 * 60 * 24;

  if (diff < 1000 * 60 * 60) return "방금 전 복습";
  if (diff < dayMs) return "오늘 복습함";
  if (diff < dayMs * 2) return "어제 복습함";

  return `${date.toLocaleDateString("ko-KR")} 복습`;
}

export function BookmarksClient() {
  const [version, setVersion] = useState(0);
  const [sortKey, setSortKey] = useState<"recent_wrong" | "low_accuracy" | "latest_review" | "term">("recent_wrong");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState<"all" | "easy" | "medium" | "hard">("all");
  const [wrongOnly, setWrongOnly] = useState(false);
  const [openAnswers, setOpenAnswers] = useState<Record<string, boolean>>({});
  const [openChoices, setOpenChoices] = useState<Record<string, boolean>>({});
  const [openExplanations, setOpenExplanations] = useState<Record<string, boolean>>({});
  const [openHints, setOpenHints] = useState<Record<string, boolean>>({});

  const allItems = useMemo(() => {
    const bookmarkedIds = new Set(getBookmarkedQuestionIds());
    const store = getLearningStore();

    return QUESTIONS.filter((question) => bookmarkedIds.has(question.id))
      .map((question) => {
        const attempts = store.attempts.filter((attempt) => attempt.questionId === question.id);
        const correctCount = attempts.filter((attempt) => attempt.correct).length;
        const latestAttempt = attempts[0];
        const isWrongNote = !!store.wrongNotes[question.id] && !store.wrongNotes[question.id].cleared;

        return {
          question,
          solvedCount: attempts.length,
          accuracy: percentage(correctCount, attempts.length),
          latestAttempt,
          isWrongNote
        };
      })
      .sort((left, right) => {
        if (sortKey === "recent_wrong") {
          if (left.isWrongNote !== right.isWrongNote) return left.isWrongNote ? -1 : 1;
          if (!!left.latestAttempt && !!right.latestAttempt && left.latestAttempt.correct !== right.latestAttempt.correct) {
            return left.latestAttempt.correct ? 1 : -1;
          }
          return left.question.term.localeCompare(right.question.term, "ko");
        }

        if (sortKey === "low_accuracy") {
          const leftScore = left.solvedCount ? left.accuracy : -1;
          const rightScore = right.solvedCount ? right.accuracy : -1;
          return leftScore - rightScore || left.question.term.localeCompare(right.question.term, "ko");
        }

        if (sortKey === "latest_review") {
          const leftTime = left.latestAttempt ? new Date(left.latestAttempt.submittedAt).getTime() : 0;
          const rightTime = right.latestAttempt ? new Date(right.latestAttempt.submittedAt).getTime() : 0;
          return rightTime - leftTime || left.question.term.localeCompare(right.question.term, "ko");
        }

        return left.question.term.localeCompare(right.question.term, "ko");
      });
  }, [version]);

  const categories = useMemo(
    () => ["all", ...new Set(allItems.map(({ question }) => question.category))],
    [allItems]
  );

  const recommendedItems = useMemo(() => {
    return [...allItems]
      .map((item) => {
        const latestReviewedAt = item.latestAttempt ? new Date(item.latestAttempt.submittedAt).getTime() : 0;
        const daysSinceReview = latestReviewedAt ? (Date.now() - latestReviewedAt) / (1000 * 60 * 60 * 24) : 30;
        const accuracyPenalty = item.solvedCount ? 100 - item.accuracy : 35;
        const wrongBoost = item.isWrongNote ? 45 : 0;
        const unsolvedBoost = item.solvedCount === 0 ? 20 : 0;
        const staleBoost = Math.min(daysSinceReview, 30);
        const score = wrongBoost + accuracyPenalty + unsolvedBoost + staleBoost;

        return { ...item, recommendationScore: score };
      })
      .sort(
        (left, right) =>
          right.recommendationScore - left.recommendationScore ||
          left.question.term.localeCompare(right.question.term, "ko")
      )
      .slice(0, 3);
  }, [allItems]);

  const items = useMemo(() => {
    return allItems
      .filter((item) => (wrongOnly ? item.isWrongNote : true))
      .filter(({ question }) => (categoryFilter === "all" ? true : question.category === categoryFilter))
      .filter(({ question }) => (difficultyFilter === "all" ? true : question.difficulty === difficultyFilter))
      .sort((left, right) => {
        if (sortKey === "recent_wrong") {
          if (left.isWrongNote !== right.isWrongNote) return left.isWrongNote ? -1 : 1;
          if (!!left.latestAttempt && !!right.latestAttempt && left.latestAttempt.correct !== right.latestAttempt.correct) {
            return left.latestAttempt.correct ? 1 : -1;
          }
          return left.question.term.localeCompare(right.question.term, "ko");
        }

        if (sortKey === "low_accuracy") {
          const leftScore = left.solvedCount ? left.accuracy : -1;
          const rightScore = right.solvedCount ? right.accuracy : -1;
          return leftScore - rightScore || left.question.term.localeCompare(right.question.term, "ko");
        }

        if (sortKey === "latest_review") {
          const leftTime = left.latestAttempt ? new Date(left.latestAttempt.submittedAt).getTime() : 0;
          const rightTime = right.latestAttempt ? new Date(right.latestAttempt.submittedAt).getTime() : 0;
          return rightTime - leftTime || left.question.term.localeCompare(right.question.term, "ko");
        }

        return left.question.term.localeCompare(right.question.term, "ko");
      });
  }, [allItems, categoryFilter, difficultyFilter, sortKey, wrongOnly]);

  const filteredQuizHref = useMemo(() => {
    const params = new URLSearchParams({ mode: "bookmarks" });

    if (categoryFilter !== "all") {
      params.set("category", categoryFilter);
    }

    if (difficultyFilter !== "all") {
      params.set("difficulty", difficultyFilter);
    }

    if (wrongOnly) {
      params.set("wrongOnly", "true");
    }

    return `/quiz?${params.toString()}`;
  }, [categoryFilter, difficultyFilter, wrongOnly]);

  function resetFilters() {
    setCategoryFilter("all");
    setDifficultyFilter("all");
    setSortKey("recent_wrong");
    setWrongOnly(false);
  }

  function toggleAnswer(id: string) {
    setOpenAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function toggleChoices(id: string) {
    setOpenChoices((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function toggleExplanation(id: string) {
    setOpenExplanations((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function toggleHint(id: string) {
    setOpenHints((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  if (!allItems.length) {
    return (
      <div className="glass-card rounded-[32px] p-8 text-center text-white">
        <h2 className="text-2xl font-black tracking-[-0.04em] text-white">북마크한 문제가 아직 없어요</h2>
        <p className="mt-3 text-white/80">
          용어 상세나 퀴즈 화면에서 북마크를 눌러두면 여기서 모아서 다시 볼 수 있어요.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/glossary" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white">
            용어사전 둘러보기
          </Link>
          <Link href="/quiz?mode=all" className="rounded-full bg-white/10 px-5 py-3 text-sm font-bold text-white">
            전체 랜덤 퀴즈 시작
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="glass-card rounded-[28px] p-5 text-white">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-200">Bookmarks</p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-white">복습용으로 모아둔 문제</h2>
            <p className="mt-2 text-sm leading-7 text-white/75">
              지금 저장된 북마크는 총 {allItems.length}문제이고, 현재 조건에 맞는 문제는 {items.length}문제입니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="rounded-full border border-white/15 bg-white/10 px-4 py-3 text-sm font-bold text-white outline-none"
            >
              <option value="all" className="text-slate-900">
                전체 카테고리
              </option>
              {categories
                .filter((category) => category !== "all")
                .map((category) => (
                  <option key={category} value={category} className="text-slate-900">
                    {category}
                  </option>
                ))}
            </select>
            <select
              value={difficultyFilter}
              onChange={(event) => setDifficultyFilter(event.target.value as "all" | "easy" | "medium" | "hard")}
              className="rounded-full border border-white/15 bg-white/10 px-4 py-3 text-sm font-bold text-white outline-none"
            >
              <option value="all" className="text-slate-900">
                전체 난이도
              </option>
              <option value="easy" className="text-slate-900">
                초급
              </option>
              <option value="medium" className="text-slate-900">
                중급
              </option>
              <option value="hard" className="text-slate-900">
                고급
              </option>
            </select>
            <select
              value={sortKey}
              onChange={(event) =>
                setSortKey(event.target.value as "recent_wrong" | "low_accuracy" | "latest_review" | "term")
              }
              className="rounded-full border border-white/15 bg-white/10 px-4 py-3 text-sm font-bold text-white outline-none"
            >
              <option value="recent_wrong" className="text-slate-900">
                최근 오답 우선
              </option>
              <option value="low_accuracy" className="text-slate-900">
                정답률 낮은 순
              </option>
              <option value="latest_review" className="text-slate-900">
                최근 복습 순
              </option>
              <option value="term" className="text-slate-900">
                용어명 순
              </option>
            </select>
            <button
              type="button"
              onClick={() => setWrongOnly((prev) => !prev)}
              className={`rounded-full px-4 py-3 text-sm font-bold transition ${
                wrongOnly ? "bg-rose-500/20 text-rose-100" : "border border-white/15 bg-white/10 text-white"
              }`}
            >
              {wrongOnly ? "오답노트 문제만 보는 중" : "오답노트 문제만 보기"}
            </button>
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-full border border-white/15 bg-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/15"
            >
              조건 초기화
            </button>
            <Link href={filteredQuizHref} className="rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white">
              지금 보이는 조건으로 풀기
            </Link>
            <Link href="/quiz?mode=all" className="rounded-full bg-white/10 px-5 py-3 text-sm font-bold text-white">
              새 퀴즈 시작
            </Link>
          </div>
        </div>
      </div>

      <section className="glass-card rounded-[28px] p-5 text-white">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-200">Today Picks</p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-white">오늘 복습 추천</h2>
            <p className="mt-2 text-sm leading-7 text-white/75">
              오답 여부, 정답률, 최근 복습 시점을 바탕으로 지금 다시 보면 좋은 문제를 골랐어요.
            </p>
          </div>
          <Link href="/quiz?mode=bookmarks" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white">
            북마크 전체 풀기
          </Link>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          {recommendedItems.map(({ question, accuracy, solvedCount, isWrongNote }) => (
            <article key={`recommended-${question.id}`} className="rounded-[22px] bg-white/10 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-black text-white">{question.term}</h3>
                <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-100">
                  {difficultyLabel(question.difficulty)}
                </span>
              </div>
              <p className="mt-3 text-sm font-semibold leading-7 text-white/90">{question.question}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                  {question.category}
                </span>
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-100">
                  {solvedCount ? `정답률 ${accuracy}%` : "첫 복습 추천"}
                </span>
                {isWrongNote ? (
                  <span className="rounded-full bg-rose-500/20 px-3 py-1 text-xs font-semibold text-rose-100">
                    오답노트 우선
                  </span>
                ) : null}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={`/quiz?term=${encodeURIComponent(question.term)}`}
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white"
                >
                  바로 풀기
                </Link>
                <Link
                  href={`/glossary/${encodeURIComponent(question.term)}`}
                  className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white"
                >
                  용어 보기
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {!items.length ? (
        <div className="glass-card rounded-[28px] p-8 text-center text-white">
          <h3 className="text-xl font-black text-white">선택한 조건에 맞는 북마크 문제가 없어요</h3>
          <p className="mt-3 text-sm leading-7 text-white/75">
            필터를 조금 넓히거나 다른 정렬 기준으로 바꾸면 복습할 문제를 더 쉽게 찾을 수 있어요.
            {wrongOnly ? " 오답노트 토글을 끄면 일반 북마크 문제도 함께 볼 수 있습니다." : ""}
          </p>
        </div>
      ) : null}

      {items.map(({ question, solvedCount, accuracy, latestAttempt, isWrongNote }) => {
        const relatedTerms = question.relatedSearchTerms ?? [];
        const googleKeyword = encodeURIComponent(relatedTerms[0] ?? question.answer);
        const naverKeyword = encodeURIComponent(relatedTerms[1] ?? relatedTerms[0] ?? question.answer);

        return (
          <article key={question.id} className="glass-card rounded-[28px] p-5 text-white">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl font-black tracking-[-0.04em] text-white">{question.term}</h3>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                  {question.category}
                </span>
                <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-100">
                  {typeLabel(question.type)}
                </span>
                <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-100">
                  {difficultyLabel(question.difficulty)}
                </span>
                {isWrongNote ? (
                  <span className="rounded-full bg-rose-500/20 px-3 py-1 text-xs font-semibold text-rose-100">
                    오답노트에 있음
                  </span>
                ) : null}
              </div>

              <p className="mt-3 text-base font-semibold leading-8 text-white/92">{question.question}</p>
              <p className="mt-3 text-sm leading-7 text-white/72">{question.explanation.summary}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-100">
                  정답률 {solvedCount ? `${accuracy}%` : "기록 없음"}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                  풀이 {solvedCount}회
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                  {formatLastSolved(latestAttempt?.submittedAt)}
                </span>
                {latestAttempt ? (
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      latestAttempt.correct ? "bg-emerald-500/20 text-emerald-100" : "bg-rose-500/20 text-rose-100"
                    }`}
                  >
                    최근 결과: {latestAttempt.correct ? "정답" : "오답"}
                  </span>
                ) : null}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {(question.relatedSearchTerms ?? [question.term]).slice(0, 4).map((keyword) => (
                  <span
                    key={`${question.id}-${keyword}`}
                    className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {question.type === "multiple_choice" ? (
                <button
                  type="button"
                  onClick={() => toggleChoices(question.id)}
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white"
                >
                  <ListChecks className="h-4 w-4" />
                  {openChoices[question.id] ? "보기 접기" : "보기 미리보기"}
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => toggleHint(question.id)}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white"
              >
                <HelpCircle className="h-4 w-4" />
                {openHints[question.id] ? "힌트 접기" : "힌트 살짝 보기"}
              </button>
              <button
                type="button"
                onClick={() => toggleAnswer(question.id)}
                className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white"
              >
                {openAnswers[question.id] ? "정답 가리기" : "정답 보기"}
              </button>
              <button
                type="button"
                onClick={() => toggleExplanation(question.id)}
                className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white"
              >
                {openExplanations[question.id] ? "해설 접기" : "해설 요약 보기"}
              </button>
              <Link
                href={`/quiz?term=${encodeURIComponent(question.term)}`}
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white"
              >
                이 용어 다시 풀기
              </Link>
              <Link
                href={`/glossary/${encodeURIComponent(question.term)}`}
                className="rounded-full bg-blue-600 px-4 py-2 text-sm font-bold text-white"
              >
                용어 상세 보기
              </Link>
              <a
                href={`https://www.google.com/search?q=${googleKeyword}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white"
              >
                Google 검색
                <ExternalLink className="h-4 w-4" />
              </a>
              <a
                href={`https://search.naver.com/search.naver?query=${naverKeyword}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white"
              >
                NAVER 검색
                <ExternalLink className="h-4 w-4" />
              </a>
              <button
                type="button"
                onClick={() => {
                  toggleBookmark(question.id);
                  setVersion((prev) => prev + 1);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-4 py-2 text-sm font-bold text-amber-100"
              >
                <Bookmark className="h-4 w-4 fill-current" />
                북마크 해제
              </button>
            </div>
            </div>

            {openHints[question.id] ? (
              <div className="mt-4 rounded-[22px] border border-blue-200/30 bg-blue-500/12 p-4">
                <p className="flex items-center gap-2 text-sm font-bold text-blue-100">
                  <Pin className="h-4 w-4" />
                  힌트
                </p>
                <p className="mt-2 text-sm leading-7 text-white/90">{question.hint}</p>
              </div>
            ) : null}

            {question.type === "multiple_choice" && openChoices[question.id] ? (
              <div className="mt-4 grid gap-2">
                {question.choices?.map((choice) => (
                  <div
                    key={`${question.id}-${choice}`}
                    className={`rounded-[18px] px-4 py-3 text-sm font-semibold ${
                      openAnswers[question.id] && choice === question.answer
                        ? "bg-emerald-500/20 text-emerald-100"
                        : "bg-white/10 text-white/85"
                    }`}
                  >
                    {choice}
                  </div>
                ))}
              </div>
            ) : null}

            {openAnswers[question.id] ? (
              <div className="mt-4 rounded-[22px] bg-emerald-500/15 p-4">
                <p className="text-sm font-bold text-emerald-100">정답</p>
                <p className="mt-2 text-sm leading-7 text-white">{question.answer}</p>
                {question.acceptableAnswers?.length ? (
                  <p className="mt-2 text-xs leading-6 text-white/70">허용 답안: {question.acceptableAnswers.join(", ")}</p>
                ) : null}
              </div>
            ) : null}

            {openExplanations[question.id] ? (
              <div className="mt-4 grid gap-3 rounded-[26px] bg-[linear-gradient(180deg,rgba(15,39,75,0.98),rgba(20,54,102,0.95))] p-4 text-white md:grid-cols-[92px_1fr]">
                <div className="flex flex-col items-center justify-center gap-2 rounded-[22px] bg-slate-900/80 px-4 py-5 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,#2563eb,#60a5fa)] text-sm font-black">
                    경제
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-blue-200">Guide</p>
                    <p className="mt-1 text-sm font-black text-white">경제 선생님의 한마디</p>
                  </div>
                </div>

                <div className="rounded-[22px] border border-white/10 bg-white/10 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white">
                      정답: {question.answer}
                    </span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-blue-100">
                      핵심 요약 복습
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <div className="rounded-[18px] bg-white/10 p-3">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-200">쉬운 풀이</p>
                      <p className="mt-2 text-sm leading-7 text-white/90">{question.explanation.summary}</p>
                    </div>
                    <div className="rounded-[18px] bg-white/10 p-3">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-200">핵심 포인트</p>
                      <p className="mt-2 text-sm leading-7 text-white/90">{question.explanation.why}</p>
                    </div>
                    <div className="rounded-[18px] bg-white/10 p-3">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-200">실무 예시</p>
                      <p className="mt-2 text-sm leading-7 text-white/90">{question.explanation.example}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
