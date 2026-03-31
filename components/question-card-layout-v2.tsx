"use client";

import { Bookmark, CheckCircle2, HelpCircle, Pin, Send } from "lucide-react";
import { difficultyLabel, typeLabel } from "@/lib/quiz-utils-fixed";
import { QuizQuestion } from "@/lib/types";

type Props = {
  question: QuizQuestion;
  index: number;
  total: number;
  focusTerm?: string;
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

export function QuestionCardLayoutV2({
  question,
  index,
  total,
  focusTerm,
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
        <span className="soft-pill bg-slate-900 text-white">
          문제 {index + 1} / {total}
        </span>
        {focusTerm ? <span className="soft-pill bg-emerald-100 text-emerald-800">지금 푸는 용어: {focusTerm}</span> : null}
        <span className="soft-pill bg-blue-100 text-blue-700">{typeLabel(question.type)}</span>
        <span className="soft-pill bg-amber-100 text-amber-800">{difficultyLabel(question.difficulty)}</span>
        <span className="soft-pill bg-slate-100 text-slate-700">{question.category}</span>
      </div>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">{question.term}</p>
          <h2 className="quiz-heading mt-3 text-slate-950">
            {renderQuestionText(question)}
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
          aria-label="북마크 토글"
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
                className={`quiz-choice rounded-3xl border p-4 text-left transition md:px-5 md:py-4 ${
                  selectedChoice === choice
                    ? "border-blue-400 bg-[linear-gradient(135deg,#1d4ed8,#2563eb,#60a5fa)] text-white shadow-lg shadow-blue-900/20"
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
            className="quiz-body min-h-36 w-full rounded-[28px] border border-slate-200 bg-white px-5 py-4 text-slate-900 outline-none transition focus:border-blue-400 md:px-6 md:py-5"
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
          className={`quiz-support mt-4 rounded-[28px] p-4 font-bold ${
            feedbackTone === "success" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
          }`}
        >
          {feedbackMessage}
        </div>
      ) : null}

      {hintOpen ? (
        <div className="quiz-support mt-4 rounded-[28px] border border-blue-200 bg-blue-50 p-4 text-blue-950 md:p-5">
          <p className="mb-2 flex items-center gap-2 font-bold">
            <Pin className="h-4 w-4" />
            힌트
          </p>
          <p>{question.hint}</p>
        </div>
      ) : null}

      <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
        <CheckCircle2 className="h-4 w-4" />
        <span className="quiz-support">{isBookmarked ? "북마크됨" : "북마크하면 다시 보기할 때 바로 찾을 수 있어요."}</span>
      </div>
    </section>
  );
}
