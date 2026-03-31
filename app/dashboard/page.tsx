import { DashboardClientV2 } from "@/components/dashboard-client-v2";

export default function DashboardPage() {
  return (
    <div className="shell px-1 pt-8">
      <section className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">Dashboard</p>
        <h1 className="section-title mt-2 text-slate-950">학습 통계 대시보드</h1>
      </section>
      <DashboardClientV2 />
    </div>
  );
}
