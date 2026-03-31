"use client";

import Link from "next/link";
import { useState } from "react";
import { QUESTIONS } from "@/data/questions";
import { getLearningStore, removeWrongNote } from "@/lib/storage";

export function MistakesClient() {
  const [version, setVersion] = useState(0);
  const store = getLearningStore();
  const items = Object.values(store.wrongNotes)
    .filter((entry) => !entry.cleared)
    .map((entry) => ({ ...entry, question: QUESTIONS.find((question) => question.id === entry.questionId) }))
    .filter((entry) => entry.question);

  if (!items.length) {
    return (
      <div className="glass-card rounded-[32px] p-8 text-center">
        <h2 className="text-2xl font-black tracking-[-0.04em] text-slate-950">오답노트가 비어 있어요.</h2>
        <p className="mt-3 text-slate-600">틀린 문제가 생기면 자동으로 이곳에 쌓입니다.</p>
        <Link href="/quiz?mode=all" className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white">전체 랜덤 퀴즈 시작</Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-3">
        <Link href="/quiz?mode=mistakes" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white">틀린 문제만 다시 풀기</Link>
      </div>
      {items.map((item) => (
        <article key={`${item.questionId}-${version}`} className="glass-card rounded-[28px] p-5">
          <p className="text-sm font-semibold text-blue-700">{item.question?.term}</p>
          <h3 className="mt-2 text-xl font-black tracking-[-0.04em] text-slate-950">{item.question?.question}</h3>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <span className="rounded-full bg-slate-100 px-3 py-2">오답 횟수 {item.wrongCount}</span>
            <span className="rounded-full bg-slate-100 px-3 py-2">재도전 횟수 {item.retryCount}</span>
            <button type="button" onClick={() => { removeWrongNote(item.questionId); setVersion((prev) => prev + 1); }} className="rounded-full bg-white px-3 py-2 font-semibold text-slate-700">
              이해한 문제는 제거
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
