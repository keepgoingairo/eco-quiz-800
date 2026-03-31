"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpenText, CheckCircle2, Eye, Lightbulb, ListChecks } from "lucide-react";
import { difficultyLabel, typeLabel } from "@/lib/quiz-utils-fixed";
import { QuizQuestion } from "@/lib/types";

function extractPrompt(question: string) {
  const [headline, ...rest] = question.split("\n");
  return {
    headline: headline.trim(),
    detail: rest.join(" ").trim()
  };
}

export function GlossaryQuestionPreview({
  questions,
  term
}: {
  questions: QuizQuestion[];
  term: string;
}) {
  const [openAnswers, setOpenAnswers] = useState<Record<string, boolean>>({});
  const [openChoices, setOpenChoices] = useState<Record<string, boolean>>({});
  const [openExplanations, setOpenExplanations] = useState<Record<string, boolean>>({});

  function toggleAnswer(id: string) {
    setOpenAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function toggleChoices(id: string) {
    setOpenChoices((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function toggleExplanation(id: string) {
    setOpenExplanations((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="mt-5 grid gap-4">
      {questions.map((question, index) => {
        const prompt = extractPrompt(question.question);
        const isAnswerOpen = !!openAnswers[question.id];
        const isChoicesOpen = !!openChoices[question.id];
        const isExplanationOpen = !!openExplanations[question.id];

        return (
          <article
            key={question.id}
            className="overflow-hidden rounded-[28px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.08))]"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                  대표 문제 {index + 1}
                </span>
                <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-100">
                  {typeLabel(question.type)}
                </span>
                <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-100">
                  {difficultyLabel(question.difficulty)}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => toggleAnswer(question.id)}
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-white"
                >
                  <Eye className="h-3.5 w-3.5" />
                  {isAnswerOpen ? "정답 가리기" : "정답 보기"}
                </button>
                {question.type === "multiple_choice" ? (
                  <button
                    type="button"
                    onClick={() => toggleChoices(question.id)}
                    className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-white"
                  >
                    <ListChecks className="h-3.5 w-3.5" />
                    {isChoicesOpen ? "보기 접기" : "보기 프리뷰"}
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => toggleExplanation(question.id)}
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-white"
                >
                  <Lightbulb className="h-3.5 w-3.5" />
                  {isExplanationOpen ? "해설 접기" : "해설 요약 보기"}
                </button>
                <Link
                  href={`/quiz?term=${encodeURIComponent(term)}`}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-bold text-white"
                >
                  바로 풀기
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <div className="grid gap-4 px-5 py-5 md:grid-cols-[1.15fr_0.85fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-200">출제 방식</p>
                <h3 className="mt-2 text-lg font-black leading-8 tracking-[-0.03em] text-white">{prompt.headline}</h3>
                <p className="mt-3 text-sm leading-7 text-white/78">{prompt.detail || question.explanation.summary}</p>

                {question.type === "multiple_choice" && isChoicesOpen ? (
                  <div className="mt-4 grid gap-2">
                    {question.choices?.map((choice) => (
                      <div
                        key={`${question.id}-${choice}`}
                        className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
                          isAnswerOpen && choice === question.answer
                            ? "bg-emerald-500/20 text-emerald-100"
                            : "bg-white/10 text-white/85"
                        }`}
                      >
                        {choice}
                      </div>
                    ))}
                  </div>
                ) : null}

                {isAnswerOpen ? (
                  <div className="mt-4 rounded-[22px] bg-emerald-500/15 p-4">
                    <p className="flex items-center gap-2 text-sm font-bold text-emerald-100">
                      <CheckCircle2 className="h-4 w-4" />
                      정답
                    </p>
                    <p className="mt-2 text-sm leading-7 text-white">{question.answer}</p>
                    {question.acceptableAnswers?.length ? (
                      <p className="mt-2 text-xs leading-6 text-white/70">허용 답안: {question.acceptableAnswers.join(", ")}</p>
                    ) : null}
                  </div>
                ) : null}

                {isExplanationOpen ? (
                  <div className="mt-4 rounded-[22px] bg-blue-500/12 p-4">
                    <p className="text-sm font-bold text-blue-100">해설 요약</p>
                    <p className="mt-2 text-sm leading-7 text-white/90">{question.explanation.why}</p>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-white/55">실무 예시</p>
                    <p className="mt-2 text-sm leading-7 text-white/75">{question.explanation.example}</p>
                  </div>
                ) : null}
              </div>

              <div className="rounded-[24px] bg-slate-900/40 p-4">
                <p className="flex items-center gap-2 text-sm font-bold text-white">
                  <BookOpenText className="h-4 w-4 text-blue-200" />
                  빠른 학습 포인트
                </p>
                <p className="mt-3 text-sm leading-7 text-white/75">{question.explanation.summary}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-white/55">핵심 키워드</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(question.relatedSearchTerms ?? [question.term]).slice(0, 3).map((keyword) => (
                    <span
                      key={`${question.id}-${keyword}`}
                      className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/85"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
