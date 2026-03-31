import Link from "next/link";
import { notFound } from "next/navigation";
import { GlossaryQuestionPreview } from "@/components/glossary-question-preview";
import { GlossaryTermBookmark } from "@/components/glossary-term-bookmark";
import { difficultyLabel, getGlossaryEntryByTerm, getQuestionsByTerm, getRelatedGlossaryEntries } from "@/lib/quiz-utils-fixed";

type PageProps = {
  params: Promise<{
    term: string;
  }>;
};

export default async function GlossaryTermPage({ params }: PageProps) {
  const { term: rawTerm } = await params;
  const term = decodeURIComponent(rawTerm);
  const entry = getGlossaryEntryByTerm(term);

  if (!entry) {
    notFound();
  }

  const questions = getQuestionsByTerm(entry.term);
  const relatedEntries = getRelatedGlossaryEntries(entry.term, 4);

  return (
    <div className="shell px-1 pt-8">
      <section className="glass-card rounded-[36px] p-6 text-white md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">Term Detail</p>
        <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white md:text-4xl">{entry.term}</h1>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white">{entry.category}</span>
          <span className="rounded-full bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-100">
            문제 {entry.quizCount}개
          </span>
          {entry.difficulties.map((difficulty) => (
            <span key={difficulty} className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/85">
              {difficultyLabel(difficulty)}
            </span>
          ))}
        </div>
        <p className="mt-6 text-lg font-semibold leading-8 text-white/90">{entry.oneLine}</p>
        <p className="mt-4 text-base leading-8 text-white/75">{entry.easyDescription}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {(entry.relatedKeywords ?? []).map((keyword) => (
            <span key={keyword} className="rounded-full bg-blue-500/20 px-3 py-1 text-sm font-semibold text-blue-100">
              {keyword}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/quiz?term=${encodeURIComponent(entry.term)}`}
            className="rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white"
          >
            이 용어 퀴즈 시작
          </Link>
          <GlossaryTermBookmark questionIds={questions.map((question) => question.id)} />
          <Link
            href={`/quiz?mode=all&category=${encodeURIComponent(entry.category)}`}
            className="rounded-full bg-white/10 px-5 py-3 text-sm font-bold text-white"
          >
            같은 카테고리 더 풀기
          </Link>
          <Link href="/glossary" className="rounded-full bg-white/10 px-5 py-3 text-sm font-bold text-white">
            용어사전 돌아가기
          </Link>
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="glass-card rounded-[32px] p-6 text-white">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black tracking-[-0.03em] text-white">대표 문제 미리보기</h2>
              <p className="mt-2 text-sm leading-7 text-white/70">이 용어가 실제 퀴즈에서 어떤 식으로 출제되는지 카드 형태로 먼저 훑어볼 수 있어요.</p>
            </div>
            <div className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/80">
              총 {questions.length}문제
            </div>
          </div>

          <GlossaryQuestionPreview questions={questions} term={entry.term} />
        </div>

        <div className="grid gap-6">
          <div className="glass-card rounded-[32px] p-6 text-white">
            <h2 className="text-xl font-black tracking-[-0.03em] text-white">관련 뉴스 보기</h2>
            <div className="mt-4 grid gap-3">
              {entry.relatedNews.map((news) => (
                <a
                  key={`${entry.term}-${news.source}-${news.title}`}
                  href={news.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-[24px] bg-white/10 p-4 transition hover:bg-white/15"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-200">{news.source}</p>
                  <h3 className="mt-2 text-base font-black text-white">{news.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/75">{news.summary}</p>
                </a>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-[32px] p-6 text-white">
            <h2 className="text-xl font-black tracking-[-0.03em] text-white">함께 보면 좋은 용어</h2>
            <p className="mt-2 text-sm leading-7 text-white/70">같은 흐름에서 자주 묶이는 용어를 이어서 보면 개념 연결이 더 쉬워집니다.</p>
            <div className="mt-4 grid gap-3">
              {relatedEntries.map((related) => (
                <Link
                  key={related.term}
                  href={`/glossary/${encodeURIComponent(related.term)}`}
                  className="rounded-[24px] bg-white/10 p-4 transition hover:bg-white/15"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-black text-white">{related.term}</h3>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                      {related.category}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-white/75">{related.oneLine}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(related.relatedKeywords ?? []).slice(0, 3).map((keyword) => (
                      <span key={`${related.term}-${keyword}`} className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-100">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
