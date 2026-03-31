import { Lightbulb, MessageCircleMore, Sparkles } from "lucide-react";
import { QuizQuestion } from "@/lib/types";

export function ExplanationCardFixed({
  question,
  userAnswer,
  correct
}: {
  question: QuizQuestion;
  userAnswer: string;
  correct: boolean;
}) {
  const wrongReason =
    question.type === "multiple_choice"
      ? question.wrongChoiceExplanations?.[userAnswer]
      : undefined;

  return (
    <section className="grid gap-4 rounded-[32px] bg-[linear-gradient(180deg,rgba(15,39,75,0.98),rgba(20,54,102,0.95))] p-5 text-white shadow-lg shadow-blue-950/30 md:grid-cols-[130px_1fr] md:p-7">
      <div className="flex flex-col items-center justify-center gap-3 rounded-[28px] bg-slate-900 px-6 py-8 text-center text-white">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(135deg,#2563eb,#60a5fa)] text-3xl font-black">
          선생
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-blue-200">Friendly Guide</p>
          <h3 className="mt-2 text-lg font-black">경제 선생님의 한마디</h3>
        </div>
      </div>
      <div className="teacher-bubble rounded-[28px] border border-white/15 bg-[#173766] p-6 text-white">
        <div className="flex flex-wrap items-center gap-3">
          <span className="soft-pill bg-white/15 text-white">
            <MessageCircleMore className="h-4 w-4" />
            {correct ? "오, 이건 제대로 아셨네요." : "괜찮아요. 여기서 이해하면 내 것이 됩니다."}
          </span>
          <span className="soft-pill bg-white/15 text-white">정답: {question.answer}</span>
        </div>
        <div className="mt-5 grid gap-4 text-sm leading-7 text-white md:grid-cols-3">
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="mb-2 flex items-center gap-2 font-bold text-white">
              <Sparkles className="h-4 w-4 text-blue-300" />
              쉬운 풀이
            </p>
            <p>{question.explanation.summary}</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="mb-2 flex items-center gap-2 font-bold text-white">
              <Lightbulb className="h-4 w-4 text-amber-300" />
              왜 맞고 왜 틀릴까
            </p>
            <p>{correct ? question.explanation.why : wrongReason ?? question.explanation.why}</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="mb-2 font-bold text-white">실무·현실 예시</p>
            <p>{question.explanation.example}</p>
          </div>
        </div>
        <div className="mt-4 rounded-2xl bg-white/10 p-4 text-sm leading-7 text-white">
          <p className="font-bold">뉴스 연결 포인트</p>
          <p className="mt-1">{question.explanation.newsPoint}</p>
        </div>
      </div>
    </section>
  );
}
