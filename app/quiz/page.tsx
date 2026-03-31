import { FilterStripV2 } from "@/components/filter-strip-v2";
import { QuizClientLayoutV3 } from "@/components/quiz-client-layout-v3";
import { Difficulty, QuestionType, StudyMode } from "@/lib/types";

type SearchParams = Promise<{
  mode?: StudyMode;
  type?: QuestionType | "all";
  difficulty?: Difficulty | "all";
  category?: string | "all";
  term?: string;
  wrongOnly?: string;
}>;

export default async function QuizPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  return (
    <div className="shell px-1 pt-8">
      <section className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">Quiz Room</p>
        <h1 className="section-title mt-2 text-slate-950">문제를 풀고, 해설로 이해까지 연결해요</h1>
      </section>
      <div className="mb-6">
        <FilterStripV2 />
      </div>
      <QuizClientLayoutV3
        mode={params.mode}
        type={params.type}
        difficulty={params.difficulty}
        category={params.category}
        term={params.term}
        wrongOnly={params.wrongOnly === "true"}
      />
    </div>
  );
}
