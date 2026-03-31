"use client";

import { Bookmark, CheckCircle2, HelpCircle, Pin, Send } from "lucide-react";
import { difficultyLabel, typeLabel } from "@/lib/quiz-utils";
import { QuizQuestion } from "@/lib/types";

type Props = {
  question: QuizQuestion;
  index: number;
  total: number;
  selectedChoice: string;
  shortAnswer: string;
  hintOpen: boolean;
  isBookmarked: boolean;
  onChoiceSelect: (value: string) => void;
  onShortAnswerChange: (value: string) => void;
  onToggleHint: () => void;
  onSubmit: () => void;
  onToggleBookmark: () => void;
  submitted: boolean;
  canSubmit: boolean;
  feedbackMessage?: string;
  feedbackTone?: "success" | "error";
};

export function QuestionCardLayoutFixed({
  question,
  index,
  total,
  selectedChoice,
  shortAnswer,
  hintOpen,
  isBookmarked,
  onChoiceSelect,
  onShortAnswerChange,
  onToggleHint,
  onSubmit,
  onToggleBookmark,
  submitted,
  canSubmit,
  feedbackMessage,
  feedbackTone
}: Props) {
  return (
    <section className="glass-card rounded-[36px] p-5 md:p-8">
      <div className="flex flex-wrap items-center gap-3">
        <span className="soft-pill bg-slate-900 text-white">문제 {index + 1} / {total}</span>
        <span className="soft-pill bg-blue-100 text-blue-700">{typeLabel(question.type)}</span>
        <span className="soft-pill bg-amber-100 text-amber-800">{difficultyLabel(question.difficulty)}</span>
        <span className="soft-pill bg-slate-100 text-slate-700">{question.category}</span>
      </div>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">{question.term}</p>
          <h2 className="mt-3 text-2xl font-black leading-tight tracking-[-0.04em] text-slate-950 md:text-3xl">
            {question.question}
          </h2>
        </div>
        <button
          type="button"
          onClick={onToggleBookmark}
          className={`rounded-full border p-3 transition ${
            isBookmarked
              ? "border-amber-300 bg-amber-50 text-amber-600"
              : "border-slate-200 bg-white text-slate-500"
          }`}
        >
          <Bookmark className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`} />
        </button>
      </div>

      <div className="mt-6">
        {question.type === "multiple_choice" ? (
          <div className="grid gap-3">
            {question.choices?.map((choice) => (
              <button
                key={choice}
                type="button"
                disabled={submitted}
                onClick={() => onChoiceSelect(choice)}
                className={`rounded-3xl border p-4 text-left text-sm font-medium transition md:text-base ${
                  selectedChoice === choice
                    ? "border-blue-500 bg-blue-50 text-blue-900"
                    : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50/50"
                }`}
              >
                {choice}
              </button>
            ))}
          </div>
        ) : (
          <textarea
            value={shortAnswer}
            disabled={submitted}
            onChange={(event) => onShortAnswerChange(event.target.value)}
            placeholder="정답을 직접 입력해 보세요."
            className="min-h-32 w-full rounded-[28px] border border-slate-200 bg-white px-5 py-4 text-base outline-none transition focus:border-blue-400"
          />
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onToggleHint}
          className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-200"
        >
          <HelpCircle className="h-4 w-4" />
          힌트 살짝 보기
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white shadow-lg transition ${
            canSubmit
              ? "bg-[linear-gradient(135deg,#1d4ed8,#2563eb,#60a5fa)] shadow-blue-200 hover:-translate-y-0.5"
              : "cursor-not-allowed bg-slate-500/70 text-white/80 shadow-none"
          }`}
        >
          <Send className="h-4 w-4" />
          정답 제출
        </button>
      </div>

      {feedbackMessage ? (
        <div
          className={`mt-4 rounded-[28px] p-4 text-sm font-bold ${
            feedbackTone === "success"
              ? "bg-emerald-100 text-emerald-800"
              : "bg-rose-100 text-rose-800"
          }`}
        >
          {feedbackMessage}
        </div>
      ) : null}

      {hintOpen ? (
        <div className="mt-4 rounded-[28px] border border-blue-200 bg-blue-50 p-4 text-sm leading-7 text-blue-950">
          <p className="mb-2 flex items-center gap-2 font-bold">
            <Pin className="h-4 w-4" />
            힌트
          </p>
          <p>{question.hint}</p>
        </div>
      ) : null}

      <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
        <CheckCircle2 className="h-4 w-4" />
        <span>{isBookmarked ? "북마크됨" : "오답 여부와 북마크는 자동 저장됩니다."}</span>
      </div>
    </section>
  );
}
