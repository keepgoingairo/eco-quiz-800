import Link from "next/link";

export function ModeGridV2() {
  const modes = [
    ["/quiz?mode=all", "전체 랜덤 퀴즈", "비중을 맞춘 랜덤 문제로 기본 학습을 시작합니다."],
    ["/quiz?mode=today10", "오늘의 10문제", "가볍게 10문제만 풀며 오늘 학습 흐름을 잡습니다."],
    ["/quiz?mode=multiple_only", "객관식만 풀기", "4지선다 문제 위주로 빠르게 감각을 익힙니다."],
    ["/quiz?mode=short_only", "주관식만 풀기", "용어를 직접 떠올리며 기억을 더 단단하게 만듭니다."],
    ["/quiz?mode=bookmarks", "북마크 문제 풀기", "중요하다고 표시한 문제만 다시 모아서 학습합니다."],
    ["/mistakes", "틀린 문제 다시 잡기", "오답노트에 쌓인 문제를 다시 풀며 이해를 보완합니다."],
    ["/dashboard", "학습 통계 보기", "정답률과 최근 학습 흐름을 한 번에 확인합니다."]
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {modes.map(([href, label, description]) => (
        <Link key={href} href={href} className="glass-card rounded-[32px] p-5 transition hover:-translate-y-1">
          <h3 className="text-xl font-black tracking-[-0.04em] text-slate-950">{label}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        </Link>
      ))}
    </div>
  );
}
