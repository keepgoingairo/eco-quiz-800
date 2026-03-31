import Link from "next/link";
import { ArrowRight, Bookmark } from "lucide-react";
import { FilterStripV2 } from "@/components/filter-strip-v2";
import { ModeGridV2 } from "@/components/mode-grid-v2";
import { StatsOverviewV2 } from "@/components/stats-overview-v2";

export default function HomePage() {
  return (
    <div className="shell px-1 pt-8">
      <section className="grid-bg relative overflow-hidden rounded-[40px] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.88),rgba(223,239,255,0.85))] px-6 py-10 shadow-[0_30px_80px_rgba(15,39,75,0.12)] md:px-10 md:py-14">
        <div className="relative z-10 grid gap-10 xl:grid-cols-[1.2fr_0.8fr]">
          <div>
            <span className="soft-pill bg-blue-100 text-blue-800">경제금융용어 800선 기반 학습형 퀴즈</span>
            <h1 className="hero-title mt-5 text-slate-950">
              경제금융 용어,
              <br />
              <span className="text-blue-700">그갓이꺼 뭐</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
              문제 풀이, 힌트, 해설, 오답노트, 연관검색어 탐색까지 한 번에 이어지는 경제금융 입문 학습 앱입니다.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/quiz?mode=all" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-4 text-sm font-bold !text-white">
                시작하기
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/quiz?mode=today10" className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-4 text-sm font-bold !text-white">
                오늘의 10문제
              </Link>
              <Link href="/bookmarks" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-4 text-sm font-bold text-slate-900">
                <Bookmark className="h-4 w-4" />
                북마크 모아보기
              </Link>
              <Link href="/quiz?mode=bookmarks" className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-6 py-4 text-sm font-bold text-blue-900">
                북마크만 풀기
              </Link>
            </div>
          </div>

          <div className="glass-card flex h-full flex-col rounded-[32px] p-6">
            <h2 className="text-xl font-black tracking-[-0.04em] text-slate-950">풀고, 연결하고, 다시 잡기</h2>
            <div className="mt-6 grid flex-1 gap-4 text-sm text-slate-600">
              <div className="flex min-h-[68px] items-center rounded-2xl bg-white px-4 py-3">1. 문제를 풀고 힌트로 개념 감 잡기</div>
              <div className="flex min-h-[68px] items-center rounded-2xl bg-white px-4 py-3">2. PDF 기반 해설로 핵심 개념 이해하기</div>
              <div className="flex min-h-[68px] items-center rounded-2xl bg-white px-4 py-3">3. 연관검색어로 실제 기사 흐름 연결하기</div>
              <div className="flex min-h-[68px] items-center rounded-2xl bg-white px-4 py-3">4. 오답노트와 북마크에서 다시 풀며 내 것으로 만들기</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">Study Modes</p>
          <h2 className="section-title mt-2 text-slate-950">학습 모드 선택</h2>
        </div>
        <ModeGridV2 />
      </section>

      <section className="mt-10">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">Quick Start</p>
          <h2 className="section-title mt-2 text-slate-950">난이도와 카테고리로 바로 들어가기</h2>
        </div>
        <FilterStripV2 />
      </section>

      <section className="mt-10">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">Progress</p>
          <h2 className="section-title mt-2 text-slate-950">학습 현황 요약</h2>
        </div>
        <StatsOverviewV2 />
      </section>
    </div>
  );
}
