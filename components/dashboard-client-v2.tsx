"use client";

import { GENERATED_QUESTIONS as QUESTIONS } from "@/data/generated-quiz-bank";
import { StatsOverviewV2 } from "@/components/stats-overview-v2";
import { getLearningStore } from "@/lib/storage";
import { QuizQuestion } from "@/lib/types";

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

export function DashboardClientV2() {
  const store = getLearningStore();
  const attempts = store.attempts.slice(0, 8);
  const wrong = Object.values(store.wrongNotes).filter((entry) => !entry.cleared).length;

  return (
    <div className="grid gap-6">
      <StatsOverviewV2 />

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-card rounded-[32px] p-6">
          <h2 className="text-2xl font-black tracking-[-0.04em] text-slate-950">🕘 최근 학습 이력</h2>
          <div className="mt-5 grid gap-3">
            {attempts.length ? (
              attempts.map((attempt) => {
                const question = QUESTIONS.find((item) => item.id === attempt.questionId);

                return (
                  <div key={`${attempt.questionId}-${attempt.submittedAt}`} className="rounded-[22px] bg-white p-4 text-sm">
                    <p className="quiz-heading text-slate-900">{question ? renderQuestionText(question) : null}</p>
                    <p
                      className={`mt-1 inline-flex items-center gap-2 font-semibold ${
                        attempt.correct ? "text-blue-600" : "text-rose-500"
                      }`}
                    >
                      <span className="text-base leading-none">{attempt.correct ? "O" : "X"}</span>
                      <span>{attempt.correct ? "정답" : "오답"}</span>
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="rounded-[22px] bg-white p-4 text-sm text-slate-600">아직 학습 이력이 없습니다.</p>
            )}
          </div>
        </div>

        <div className="glass-card rounded-[32px] p-6">
          <h2 className="text-2xl font-black tracking-[-0.04em] text-slate-950">🚨 최근 틀린 문제 수</h2>
          <p className="mt-3 text-4xl font-black tracking-[-0.06em] text-slate-950">{wrong}개</p>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            오답노트에서 다시 풀거나 이해한 문제는 직접 제거하면서 복습 흐름을 관리할 수 있습니다.
          </p>
        </div>
      </section>
    </div>
  );
}
