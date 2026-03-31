"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { buildGlossary } from "@/lib/quiz-utils";
import { NewsCard } from "@/components/news-card";

const glossary = buildGlossary();

export function GlossaryClient() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return glossary;
    return glossary.filter((entry) => [entry.term, entry.category, entry.oneLine, entry.easyDescription].join(" ").toLowerCase().includes(normalized));
  }, [query]);

  return (
    <div className="grid gap-6">
      <div className="glass-card rounded-[32px] p-5">
        <div className="flex items-center gap-3 rounded-[24px] border border-slate-200 bg-white px-4 py-3">
          <Search className="h-5 w-5 text-slate-400" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="예: 기준금리, 환율, 유동성" className="w-full bg-transparent outline-none" />
        </div>
      </div>
      {filtered.map((entry) => (
        <article key={entry.term} className="glass-card rounded-[32px] p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-700">{entry.category}</p>
              <h3 className="mt-2 text-2xl font-black tracking-[-0.05em] text-slate-950">{entry.term}</h3>
              <p className="mt-3 text-sm font-semibold text-slate-700">{entry.oneLine}</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">{entry.easyDescription}</p>
            </div>
            <Link href={`/quiz?mode=all&category=${encodeURIComponent(entry.category)}`} className="rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white">관련 퀴즈 시작</Link>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {entry.relatedNews.map((item) => <NewsCard key={`${entry.term}-${item.title}`} item={item} />)}
          </div>
        </article>
      ))}
    </div>
  );
}
