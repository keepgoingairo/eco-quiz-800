"use client";

import { QUESTIONS } from "@/data/questions";
import { StatsOverview } from "@/components/stats-overview";
import { getLearningStore } from "@/lib/storage";

export function DashboardClient() {
  const store = getLearningStore();
  const attempts = store.attempts.slice(0, 8);
  const wrong = Object.values(store.wrongNotes).filter((entry) => !entry.cleared).length;

  return (
    <div className="grid gap-6">
      <StatsOverview />
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-card rounded-[32px] p-6">
          <h2 className="text-2xl font-black tracking-[-0.04em] text-slate-950">최근 학습 이력</h2>
          <div className="mt-5 grid gap-3">
            {attempts.length ? attempts.map((attempt) => {
              const question = QUESTIONS.find((item) => item.id === attempt.questionId);
              return (
                <div key={`${attempt.questionId}-${attempt.submittedAt}`} className="rounded-[22px] bg-white p-4 text-sm">
                  <p className="font-bold text-slate-900">{question?.question}</p>
                  <p className="mt-1 text-slate-500">{attempt.correct ? "정답" : "오답"}</p>
                </div>
              );
            }) : <p className="rounded-[22px] bg-white p-4 text-sm text-slate-600">아직 학습 이력이 없습니다.</p>}
          </div>
        </div>
        <div className="glass-card rounded-[32px] p-6">
          <h2 className="text-2xl font-black tracking-[-0.04em] text-slate-950">최근 틀린 문제 수</h2>
          <p className="mt-3 text-4xl font-black tracking-[-0.06em] text-slate-950">{wrong}개</p>
          <p className="mt-2 text-sm leading-7 text-slate-600">오답노트에서 다시 풀고 이해한 문제는 직접 제거할 수 있습니다.</p>
        </div>
      </section>
    </div>
  );
}
