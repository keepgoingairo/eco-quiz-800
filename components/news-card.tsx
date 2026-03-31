import { ExternalLink, Newspaper } from "lucide-react";
import { RelatedNewsItem } from "@/lib/types";

export function NewsCard({ item }: { item: RelatedNewsItem }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-blue-700">
        <Newspaper className="h-4 w-4" />
        <span>{item.source}</span>
      </div>
      <h4 className="text-base font-bold text-slate-900">{item.title}</h4>
      <p className="mt-2 text-sm leading-6 text-slate-600">{item.summary}</p>
      <a href={item.url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
        기사 열기
        <ExternalLink className="h-4 w-4" />
      </a>
    </article>
  );
}
