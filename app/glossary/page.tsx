import Link from "next/link";
import { GlossaryClientV2 } from "@/components/glossary-client-v2";

export default function GlossaryPage() {
  return (
    <div className="shell px-1 pt-8">
      <section className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">Glossary</p>
        <h1 className="section-title mt-2 text-slate-950">찾아보기처럼 용어를 훑고, 바로 퀴즈로 이어가세요</h1>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/bookmarks" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-bold !text-white">
            북마크 모아보기
          </Link>
          <Link href="/mistakes" className="rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-900">
            오답노트 보기
          </Link>
        </div>
      </section>
      <GlossaryClientV2 />
    </div>
  );
}
