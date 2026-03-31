import Link from "next/link";
import { getCategories } from "@/lib/quiz-utils-fixed";

export function FilterStripV2() {
  const categories = getCategories();

  return (
    <div className="grid gap-4">
      <div className="glass-card rounded-[28px] p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">난이도별 풀기</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/quiz?mode=all&difficulty=easy" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
            초급
          </Link>
          <Link href="/quiz?mode=all&difficulty=medium" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
            중급
          </Link>
          <Link href="/quiz?mode=all&difficulty=hard" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
            고급
          </Link>
          <Link href="/quiz?mode=bookmarks" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
            북마크만
          </Link>
        </div>
      </div>

      <div className="glass-card rounded-[28px] p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">용어 카테고리별 학습</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/quiz?mode=all&category=${encodeURIComponent(category)}`}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
            >
              {category}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
