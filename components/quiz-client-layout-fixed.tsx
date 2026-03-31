"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, RotateCcw } from "lucide-react";
import { ExplanationCardFixed } from "@/components/explanation-card-fixed";
import { NewsCard } from "@/components/news-card";
import { QuestionCardLayoutFixed } from "@/components/question-card-layout-fixed";
import { getFilteredQuestions, isCorrectShortAnswer } from "@/lib/quiz-utils";
import { getLearningStore, recordAttempt, toggleBookmark } from "@/lib/storage";
import { Difficulty, QuestionType, QuizQuestion, StudyMode } from "@/lib/types";

export function QuizClientLayoutFixed({
  mode = "all",
  type = "all",
  difficulty = "all",
  category = "all"
}: {
  mode?: StudyMode;
  type?: QuestionType | "all";
  difficulty?: Difficulty | "all";
  category?: string | "all";
}) {
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState("");
  const [shortAnswer, setShortAnswer] = useState("");
  const [hintOpen, setHintOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{ correct: boolean; userAnswer: string } | null>(null);

  useEffect(() => {
    const store = getLearningStore();
    const wrongIds = Object.values(store.wrongNotes)
      .filter((entry) => !entry.cleared)
      .map((entry) => entry.questionId);

    setBookmarks(store.bookmarks);
    setQuestions(getFilteredQuestions({ mode, type, difficulty, category }, wrongIds));
    setCurrentIndex(0);
    setSelectedChoice("");
    setShortAnswer("");
    setHintOpen(false);
    setSubmitted(false);
    setResult(null);
  }, [mode, type, difficulty, category]);

  const currentQuestion = questions[currentIndex];
  const searchKeyword = encodeURIComponent(currentQuestion?.answer ?? "");
  const hasAnswer =
    currentQuestion?.type === "multiple_choice"
      ? selectedChoice.trim().length > 0
      : shortAnswer.trim().length > 0;

  function resetForNextQuestion() {
    setSelectedChoice("");
    setShortAnswer("");
    setHintOpen(false);
    setSubmitted(false);
    setResult(null);
  }

  function handleSubmit() {
    if (!currentQuestion || submitted || !hasAnswer) return;

    const userAnswer =
      currentQuestion.type === "multiple_choice"
        ? selectedChoice
        : shortAnswer.trim();

    const correct =
      currentQuestion.type === "multiple_choice"
        ? userAnswer === currentQuestion.answer
        : isCorrectShortAnswer(currentQuestion, userAnswer);

    recordAttempt(currentQuestion, correct);
    setSubmitted(true);
    setResult({ correct, userAnswer });
  }

  function handleNext() {
    if (!questions.length) return;
    if (currentIndex >= questions.length - 1) {
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
        <p className="mt-3 text-slate-600">오답노트가 비어 있거나 필터가 너무 좁을 수 있어요.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/quiz?mode=all" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white">전체 랜덤 퀴즈</Link>
          <Link href="/mistakes" className="rounded-full bg-blue-600 px-5 py-3 text-sm font-bold text-white">오답노트 보기</Link>
        </div>
      </section>
    );
  }

  const feedbackMessage = result
    ? result.correct
      ? "오, 이건 제대로 아셨네요."
      : "괜찮아요. 여기서 이해하면 내 것이 됩니다."
    : undefined;

  return (
    <div className="grid gap-6">
      <QuestionCardLayoutFixed
        question={currentQuestion}
        index={currentIndex}
        total={questions.length}
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
          <ExplanationCardFixed
            question={currentQuestion}
            userAnswer={result.userAnswer}
            correct={result.correct}
          />
          <section className="glass-card rounded-[32px] p-5">
            <h3 className="mb-4 text-lg font-black tracking-[-0.03em] text-slate-950">
              이 개념, 실제 뉴스에선 이렇게 나와요
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {currentQuestion.relatedNews.map((item, index) => (
                <NewsCard
                  key={item.title}
                  item={{
                    ...item,
                    url:
                      index === 0
                        ? `https://www.google.com/search?q=${searchKeyword}`
                        : `https://search.naver.com/search.naver?query=${searchKeyword}`
                  }}
                />
              ))}
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
