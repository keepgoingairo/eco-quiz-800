"use client";

import { QUESTIONS } from "@/data/questions";
import { getLearningStore } from "@/lib/storage";
import { percentage } from "@/lib/quiz-utils";

export function StatsOverview() {
  const store = getLearningStore();
  const attempts = store.attempts;
  const multiple = attempts.filter((a) => a.type === "multiple_choice");
  const short = attempts.filter((a) => a.type === "short_answer");
  const wrong = Object.values(store.wrongNotes).filter((item) => !item.cleared).length;

  const cards = [
    ["전체 풀이 수", `${attempts.length}회`],
    ["전체 정답률", `${percentage(attempts.filter((a) => a.correct).length, attempts.length)}%`],
    ["객관식 정답률", `${percentage(multiple.filter((a) => a.correct).length, multiple.length)}%`],
    ["주관식 정답률", `${percentage(short.filter((a) => a.correct).length, short.length)}%`],
    ["최근 틀린 문제 수", `${wrong}개`],
    ["전체 문제 수", `${QUESTIONS.length}개`]
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {cards.map(([label, value]) => (
        <div key={label} className="glass-card rounded-[28px] p-5">
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="mt-4 text-3xl font-black tracking-[-0.05em] text-slate-950">{value}</p>
        </div>
      ))}
    </div>
  );
}
