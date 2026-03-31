import Link from "next/link";

export function ModeGrid() {
  const modes = [
    ["/quiz?mode=all", "전체 랜덤 퀴즈"],
    ["/quiz?mode=today10", "오늘의 10문제"],
    ["/quiz?mode=multiple_only", "객관식만 풀기"],
    ["/quiz?mode=short_only", "주관식만 풀기"],
    ["/mistakes", "틀린 문제 다시 잡기"],
    ["/dashboard", "학습 통계 보기"]
  ];
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {modes.map(([href, label]) => (
        <Link key={href} href={href} className="glass-card rounded-[32px] p-5 transition hover:-translate-y-1">
          <h3 className="text-xl font-black tracking-[-0.04em] text-slate-950">{label}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">바로 시작할 수 있는 학습 모드입니다.</p>
        </Link>
      ))}
    </div>
  );
}
