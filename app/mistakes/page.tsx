import { MistakesClientV2 } from "@/components/mistakes-client-v2";

export default function MistakesPage() {
  return (
    <div className="shell px-1 pt-8">
      <section className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">Wrong Note</p>
        <h1 className="section-title mt-2 text-slate-950">틀린 문제 다시 잡기</h1>
      </section>
      <MistakesClientV2 />
    </div>
  );
}
