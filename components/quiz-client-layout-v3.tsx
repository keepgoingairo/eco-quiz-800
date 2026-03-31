"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, RotateCcw } from "lucide-react";
import { ExplanationCardV2 } from "@/components/explanation-card-v2";
import { QuestionCardLayoutV2 } from "@/components/question-card-layout-v2";
import { SearchNewsCardV2 } from "@/components/search-news-card-v2";
import { getFilteredQuestions, isCorrectShortAnswer } from "@/lib/quiz-utils-fixed";
import { getBookmarkedQuestionIds, getLearningStore, recordAttempt, toggleBookmark } from "@/lib/storage";
import { Difficulty, QuestionType, QuizQuestion, StudyMode } from "@/lib/types";

type SessionResult = {
  questionId: string;
  correct: boolean;
  type: QuestionType;
  difficulty: Difficulty;
};

export function QuizClientLayoutV3({
  mode = "all",
  type = "all",
  difficulty = "all",
  category = "all",
  term,
  wrongOnly = false
}: {
  mode?: StudyMode;
  type?: QuestionType | "all";
  difficulty?: Difficulty | "all";
  category?: string | "all";
  term?: string;
  wrongOnly?: boolean;
}) {
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState("");
  const [shortAnswer, setShortAnswer] = useState("");
  const [hintOpen, setHintOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{ correct: boolean; userAnswer: string } | null>(null);
  const [sessionResults, setSessionResults] = useState<SessionResult[]>([]);
  const [sessionComplete, setSessionComplete] = useState(false);

  useEffect(() => {
    const store = getLearningStore();
    const wrongIds = Object.values(store.wrongNotes)
      .filter((entry) => !entry.cleared)
      .map((entry) => entry.questionId);
    const bookmarkedIds = getBookmarkedQuestionIds();

    setBookmarks(store.bookmarks);
    setQuestions(getFilteredQuestions({ mode, type, difficulty, category, term, wrongOnly }, wrongIds, bookmarkedIds));
    setCurrentIndex(0);
    setSelectedChoice("");
    setShortAnswer("");
    setHintOpen(false);
    setSubmitted(false);
    setResult(null);
    setSessionResults([]);
    setSessionComplete(false);
  }, [mode, type, difficulty, category, term, wrongOnly]);

  const currentQuestion = questions[currentIndex];
  const relatedTerms = currentQuestion?.relatedSearchTerms ?? [];
  const googleKeyword = encodeURIComponent(relatedTerms[0] ?? currentQuestion?.answer ?? "");
  const naverKeyword = encodeURIComponent(relatedTerms[1] ?? relatedTerms[0] ?? currentQuestion?.answer ?? "");

  const hasAnswer =
    currentQuestion?.type === "multiple_choice" ? selectedChoice.trim().length > 0 : shortAnswer.trim().length > 0;

  function resetForNextQuestion() {
    setSelectedChoice("");
    setShortAnswer("");
    setHintOpen(false);
    setSubmitted(false);
    setResult(null);
  }

  function handleSubmit() {
    if (!currentQuestion || submitted || !hasAnswer) return;

    const userAnswer = currentQuestion.type === "multiple_choice" ? selectedChoice : shortAnswer.trim();
    const correct =
      currentQuestion.type === "multiple_choice"
        ? userAnswer === currentQuestion.answer
        : isCorrectShortAnswer(currentQuestion, userAnswer);

    recordAttempt(currentQuestion, correct);
    setSubmitted(true);
    setResult({ correct, userAnswer });
    setSessionResults((prev) => {
      const rest = prev.filter((entry) => entry.questionId !== currentQuestion.id);
      return [
        ...rest,
        {
          questionId: currentQuestion.id,
          correct,
          type: currentQuestion.type,
          difficulty: currentQuestion.difficulty
        }
      ];
    });
  }

  function handleNext() {
    if (!questions.length) return;

    if (currentIndex >= questions.length - 1) {
      if (mode === "today10") {
        setSessionComplete(true);
        setHintOpen(false);
        setSubmitted(false);
        setResult(null);
        return;
      }

      setCurrentIndex(0);
      resetForNextQuestion();
      return;
    }

    resetForNextQuestion();
    setCurrentIndex((prev) => prev + 1);
  }

  if (!currentQuestion) {
    return (
      <section className="glass-card rounded-[36px] p-8 text-center">
        <h2 className="text-2xl font-black tracking-[-0.04em] text-slate-950">현재 조건에 맞는 문제가 없어요.</h2>
        <p className="mt-3 text-slate-600">
          {mode === "bookmarks"
            ? wrongOnly
              ? "아직 북마크한 문제 중 오답노트에 남아 있는 문제나 선택한 조건과 맞는 문제가 없어요."
              : "아직 북마크한 문제가 없거나, 선택한 조건과 맞는 북마크 문제가 없어요."
            : "오답노트가 비어 있거나 선택한 필터 조합이 너무 좁을 수 있어요."}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/quiz?mode=all" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white">
            전체 랜덤 퀴즈
          </Link>
          <Link
            href={mode === "bookmarks" ? "/bookmarks" : "/mistakes"}
            className="rounded-full bg-blue-600 px-5 py-3 text-sm font-bold text-white"
          >
            {mode === "bookmarks" ? "북마크 보기" : "오답노트 보기"}
          </Link>
        </div>
      </section>
    );
  }

  const feedbackMessage = result
    ? result.correct
      ? "👏 오, 이건 제대로 아셨네요."
      : "🙂 괜찮아요. 여기서 이해하면 내 것이 됩니다."
    : undefined;

  const totalCorrect = sessionResults.filter((entry) => entry.correct).length;
  const objectiveSolved = sessionResults.filter((entry) => entry.type === "multiple_choice");
  const subjectiveSolved = sessionResults.filter((entry) => entry.type === "short_answer");
  const easySolved = sessionResults.filter((entry) => entry.difficulty === "easy");
  const mediumSolved = sessionResults.filter((entry) => entry.difficulty === "medium");
  const hardSolved = sessionResults.filter((entry) => entry.difficulty === "hard");

  if (mode === "today10" && sessionComplete) {
    return (
      <section className="grid gap-6">
        <div className="glass-card rounded-[36px] p-8 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">Today 10 Complete</p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white">오늘의 10문제를 모두 풀었어요</h2>
          <p className="quiz-support mt-3 text-white/80">
            지금까지의 응답 결과를 한눈에 정리했어요. 잘 맞힌 영역과 다시 보면 좋은 영역을 함께 확인해보세요.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[24px] bg-white/10 p-5">
              <p className="text-sm font-semibold text-blue-100">총 정답 수</p>
              <p className="mt-3 text-3xl font-black text-white">
                {totalCorrect}/{questions.length}
              </p>
            </div>
            <div className="rounded-[24px] bg-white/10 p-5">
              <p className="text-sm font-semibold text-blue-100">전체 정답률</p>
              <p className="mt-3 text-3xl font-black text-white">
                {questions.length ? Math.round((totalCorrect / questions.length) * 100) : 0}%
              </p>
            </div>
            <div className="rounded-[24px] bg-white/10 p-5">
              <p className="text-sm font-semibold text-blue-100">객관식 정답률</p>
              <p className="mt-3 text-3xl font-black text-white">
                {objectiveSolved.length
                  ? Math.round((objectiveSolved.filter((entry) => entry.correct).length / objectiveSolved.length) * 100)
                  : 0}
                %
              </p>
            </div>
            <div className="rounded-[24px] bg-white/10 p-5">
              <p className="text-sm font-semibold text-blue-100">주관식 정답률</p>
              <p className="mt-3 text-3xl font-black text-white">
                {subjectiveSolved.length
                  ? Math.round((subjectiveSolved.filter((entry) => entry.correct).length / subjectiveSolved.length) * 100)
                  : 0}
                %
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="glass-card rounded-[32px] p-6 text-white">
            <h3 className="text-2xl font-black tracking-[-0.04em] text-white">난이도별 결과</h3>
            <div className="mt-5 grid gap-3">
              {[
                { label: "초급", items: easySolved },
                { label: "중급", items: mediumSolved },
                { label: "고급", items: hardSolved }
              ].map(({ label, items }) => {
                const correctCount = items.filter((entry) => entry.correct).length;
                const rate = items.length ? Math.round((correctCount / items.length) * 100) : 0;

                return (
                  <div key={label} className="rounded-[22px] bg-white/10 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-base font-bold text-white">{label}</p>
                      <p className="text-sm font-semibold text-blue-100">
                        {correctCount}/{items.length} 정답
                      </p>
                    </div>
                    <p className="mt-2 text-sm text-white/75">정답률 {rate}%</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass-card rounded-[32px] p-6 text-white">
            <h3 className="text-2xl font-black tracking-[-0.04em] text-white">다음 추천</h3>
            <div className="mt-5 grid gap-3">
              <Link href="/mistakes" className="rounded-[22px] bg-white/10 p-4 text-white transition hover:bg-white/15">
                <p className="text-base font-bold">틀린 문제 다시 잡기</p>
                <p className="mt-2 text-sm text-white/75">이번 세트에서 틀린 문제를 오답노트에서 바로 복습할 수 있어요.</p>
              </Link>
              <Link href="/quiz?mode=today10" className="rounded-[22px] bg-white/10 p-4 text-white transition hover:bg-white/15">
                <p className="text-base font-bold">오늘의 10문제 다시 풀기</p>
                <p className="mt-2 text-sm text-white/75">새로운 10문제로 한 번 더 감각을 점검해볼 수 있어요.</p>
              </Link>
              <Link href="/dashboard" className="rounded-[22px] bg-white/10 p-4 text-white transition hover:bg-white/15">
                <p className="text-base font-bold">학습 통계 보러 가기</p>
                <p className="mt-2 text-sm text-white/75">오늘 학습이 전체 통계에 어떻게 반영됐는지 바로 확인할 수 있어요.</p>
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="grid gap-6">
      <QuestionCardLayoutV2
        question={currentQuestion}
        index={currentIndex}
        total={questions.length}
        focusTerm={term}
        selectedChoice={selectedChoice}
        shortAnswer={shortAnswer}
        hintOpen={hintOpen}
        isBookmarked={!!bookmarks[currentQuestion.id]}
        onChoiceSelect={setSelectedChoice}
        onShortAnswerChange={setShortAnswer}
        onToggleHint={() => setHintOpen((prev) => !prev)}
        onSubmit={handleSubmit}
        onToggleBookmark={() => setBookmarks(toggleBookmark(currentQuestion.id))}
        submitted={submitted}
        canSubmit={hasAnswer && !submitted}
        feedbackMessage={feedbackMessage}
        feedbackTone={result?.correct ? "success" : "error"}
      />

      {result ? (
        <>
          <ExplanationCardV2 question={currentQuestion} userAnswer={result.userAnswer} correct={result.correct} />

          <section className="glass-card rounded-[32px] p-5">
            <h3 className="mb-4 text-lg font-black tracking-[-0.03em] text-slate-950">
              이 개념, 실제 뉴스에선 이렇게 나와요
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <SearchNewsCardV2
                provider="google"
                keyword={relatedTerms[0] ?? currentQuestion.answer}
                url={`https://www.google.com/search?q=${googleKeyword}`}
              />
              <SearchNewsCardV2
                provider="naver"
                keyword={relatedTerms[1] ?? relatedTerms[0] ?? currentQuestion.answer}
                url={`https://search.naver.com/search.naver?query=${naverKeyword}`}
              />
            </div>
          </section>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white"
            >
              다음 문제
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={resetForNextQuestion}
              className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-5 py-3 text-sm font-bold text-slate-800"
            >
              <RotateCcw className="h-4 w-4" />
              같은 문제 다시 보기
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
