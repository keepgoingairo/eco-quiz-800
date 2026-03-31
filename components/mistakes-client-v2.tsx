"use client";

import Link from "next/link";
import { useState } from "react";
import { GENERATED_QUESTIONS as QUESTIONS } from "@/data/generated-quiz-bank";
import { QuizQuestion } from "@/lib/types";
import { difficultyLabel, typeLabel } from "@/lib/quiz-utils-fixed";
import { getLearningStore, removeWrongNote } from "@/lib/storage";

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function renderQuestionText(question: QuizQuestion) {
  const keywords = [question.term, ...(question.relatedSearchTerms ?? [])]
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item, index, items) => items.indexOf(item) === index)
    .sort((left, right) => right.length - left.length);

  if (!keywords.length) {
    return question.question;
  }

  const pattern = new RegExp(`(${keywords.map(escapeRegExp).join("|")})`, "g");
  const parts = question.question.split(pattern);

  return parts.map((part, index) =>
    keywords.includes(part) ? (
      <strong key={`${question.id}-${part}-${index}`} className="quiz-emphasis">
        {part}
      </strong>
    ) : (
      <span key={`${question.id}-text-${index}`}>{part}</span>
    )
  );
}

export function MistakesClientV2() {
  const [version, setVersion] = useState(0);
  const store = getLearningStore();
  const items = Object.values(store.wrongNotes)
    .filter((entry) => !entry.cleared)
    .map((entry) => ({
      ...entry,
      question: QUESTIONS.find((question) => question.id === entry.questionId)
    }))
    .filter((entry) => entry.question);

  if (!items.length) {
    return (
      <div className="glass-card rounded-[32px] p-8 text-center text-white">
        <h2 className="text-2xl font-black tracking-[-0.04em] text-white">오답노트가 비어 있어요</h2>
        <p className="mt-3 text-white/80">틀린 문제가 생기면 자동으로 저장되고, 여기서 다시 복습할 수 있습니다.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/quiz?mode=all" className="inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white">
            전체 랜덤 퀴즈 시작
          </Link>
          <Link href="/bookmarks" className="inline-flex rounded-full bg-white/10 px-5 py-3 text-sm font-bold text-white">
            북마크 보러 가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="glass-card rounded-[28px] p-4 text-white">
        <div className="flex flex-wrap gap-3">
          <Link href="/quiz?mode=mistakes" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white">
            틀린 문제 다시 잡기
          </Link>
          <Link href="/bookmarks" className="rounded-full bg-white/10 px-5 py-3 text-sm font-bold text-white">
            북마크 문제 함께 보기
          </Link>
        </div>
      </div>

      {items.map((item) => (
        <article key={`${item.questionId}-${version}`} className="glass-card rounded-[28px] p-5 text-white">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-white">{item.question?.term}</p>
            {item.question ? (
              <>
                <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-100">
                  {typeLabel(item.question.type)}
                </span>
                <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-100">
                  {difficultyLabel(item.question.difficulty)}
                </span>
              </>
            ) : null}
          </div>
          <h3 className="quiz-heading mt-2 text-white">
            {item.question ? renderQuestionText(item.question) : null}
          </h3>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/85">
            <span className="rounded-full bg-white/10 px-3 py-2 text-white">오답 횟수 {item.wrongCount}</span>
            <span className="rounded-full bg-white/10 px-3 py-2 text-white">재도전 횟수 {item.retryCount}</span>
            <button
              type="button"
              onClick={() => {
                removeWrongNote(item.questionId);
                setVersion((prev) => prev + 1);
              }}
              className="rounded-full bg-white/10 px-3 py-2 font-semibold text-white"
            >
              이해한 문제로 제거
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
