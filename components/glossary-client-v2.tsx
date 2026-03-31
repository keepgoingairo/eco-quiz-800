"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { buildGlossary } from "@/lib/quiz-utils-fixed";

const glossary = buildGlossary();
const CHOSEONG = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
const INDEX_ORDER = ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ", "A-Z", "0-9", "기타"];

function getKoreanIndexLabel(term: string) {
  const firstChar = term.trim().charAt(0);
  if (!firstChar) return "기타";

  const code = firstChar.charCodeAt(0);
  if (code >= 0xac00 && code <= 0xd7a3) {
    const choseongIndex = Math.floor((code - 0xac00) / 588);
    return CHOSEONG[choseongIndex] ?? "기타";
  }

  if (/[A-Za-z]/.test(firstChar)) return "A-Z";
  if (/[0-9]/.test(firstChar)) return "0-9";
  return "기타";
}

export function GlossaryClientV2() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return glossary;

    return glossary.filter((entry) =>
      [entry.term, entry.category, entry.oneLine, entry.easyDescription, ...(entry.relatedKeywords ?? [])]
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    );
  }, [query]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();

    for (const entry of filtered) {
      const label = getKoreanIndexLabel(entry.term);
      const current = map.get(label) ?? [];
      map.set(label, [...current, entry].sort((a, b) => a.term.localeCompare(b.term, "ko")));
    }

    return INDEX_ORDER.filter((label) => map.has(label)).map((label) => [label, map.get(label)!] as const);
  }, [filtered]);

  const indexLabels = grouped.map(([label]) => label);

  return (
    <div className="grid gap-6">
      <div className="glass-card rounded-[32px] p-5">
        <div className="flex items-center gap-3 rounded-[24px] border border-white/15 bg-white px-4 py-3 text-slate-900 shadow-sm">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="용어를 검색해보세요. 예: 기준금리, 인플레이션, 국채"
            className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="glass-card rounded-[32px] p-5 text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">찾아보기</p>
        <p className="mt-2 text-sm text-white/75">PDF 찾아보기처럼 초성 기준으로 바로 이동할 수 있게 정리했습니다.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {indexLabels.map((label) => (
            <a
              key={label}
              href={`#glossary-${label}`}
              className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      <div className="grid gap-5">
        {grouped.map(([label, entries]) => (
          <section key={label} id={`glossary-${label}`} className="glass-card rounded-[32px] p-6 text-white">
            <div className="mb-5 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-2xl font-black text-white">
                {label}
              </div>
              <div>
                <p className="text-sm font-semibold text-white/70">용어 색인</p>
                <h3 className="text-2xl font-black tracking-[-0.04em] text-white">{label}</h3>
              </div>
            </div>

            <div className="grid gap-3">
              {entries.map((entry) => (
                <article key={entry.term} className="rounded-[24px] bg-white/10 p-4 text-white">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-xl font-black tracking-[-0.03em] text-white">{entry.term}</h4>
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                          {entry.category}
                        </span>
                      </div>
                      <p className="mt-2 text-sm font-semibold text-white/85">{entry.oneLine}</p>
                      <p className="mt-2 text-sm leading-7 text-white/75">{entry.easyDescription}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-100">
                          문제 {entry.quizCount}개
                        </span>
                        {entry.difficulties.map((difficulty) => (
                          <span
                            key={`${entry.term}-${difficulty}`}
                            className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80"
                          >
                            {difficulty === "easy" ? "초급" : difficulty === "medium" ? "중급" : "고급"}
                          </span>
                        ))}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(entry.relatedKeywords ?? []).slice(0, 6).map((keyword) => (
                          <span
                            key={`${entry.term}-${keyword}`}
                            className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-100"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/quiz?term=${encodeURIComponent(entry.term)}`}
                        className="rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white"
                      >
                        이 용어 퀴즈
                      </Link>
                      <Link
                        href={`/glossary/${encodeURIComponent(entry.term)}`}
                        className="rounded-full bg-blue-600 px-4 py-2 text-sm font-bold text-white"
                      >
                        용어 상세 보기
                      </Link>
                      <Link
                        href={`/quiz?mode=all&category=${encodeURIComponent(entry.category)}`}
                        className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white"
                      >
                        카테고리 퀴즈
                      </Link>
                      {entry.relatedNews[0] ? (
                        <a
                          href={entry.relatedNews[0].url}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full border border-white/15 bg-blue-500/20 px-4 py-2 text-sm font-bold text-blue-50"
                        >
                          관련 뉴스 보기
                        </a>
                      ) : null}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
