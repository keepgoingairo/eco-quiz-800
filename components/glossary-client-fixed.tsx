"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { buildGlossary } from "@/lib/quiz-utils";

const glossary = buildGlossary();

function getIndexLabel(term: string) {
  return term.trim().charAt(0).toUpperCase();
}

export function GlossaryClientFixed() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return glossary;
    return glossary.filter((entry) =>
      [entry.term, entry.category, entry.oneLine, entry.easyDescription]
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    );
  }, [query]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const entry of filtered) {
      const label = getIndexLabel(entry.term);
      const current = map.get(label) ?? [];
      current.push(entry);
      map.set(label, current);
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0], "ko"));
  }, [filtered]);

  const indexLabels = grouped.map(([label]) => label);

  return (
    <div className="grid gap-6">
      <div className="glass-card rounded-[32px] p-5">
        <div className="flex items-center gap-3 rounded-[24px] border border-slate-200 bg-white px-4 py-3">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="예: 기준금리, 환율, 유동성"
            className="w-full bg-transparent outline-none"
          />
        </div>
      </div>

      <div className="glass-card rounded-[32px] p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">찾아보기</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {indexLabels.map((label) => (
            <a
              key={label}
              href={`#glossary-${label}`}
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white"
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      <div className="grid gap-5">
        {grouped.map(([label, entries]) => (
          <section
            key={label}
            id={`glossary-${label}`}
            className="glass-card rounded-[32px] p-6"
          >
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
                <article
                  key={entry.term}
                  className="rounded-[24px] bg-white/10 p-4 text-white"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-xl font-black tracking-[-0.03em] text-white">
                          {entry.term}
                        </h4>
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                          {entry.category}
                        </span>
                      </div>
                      <p className="mt-2 text-sm font-semibold text-white/85">{entry.oneLine}</p>
                      <p className="mt-2 text-sm leading-7 text-white/75">{entry.easyDescription}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/quiz?mode=all&category=${encodeURIComponent(entry.category)}`}
                        className="rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white"
                      >
                        관련 퀴즈 시작
                      </Link>
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
