import { BookmarksClient } from "@/components/bookmarks-client";

export default function BookmarksPage() {
  return (
    <div className="shell px-1 pt-8">
      <section className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">Bookmarks</p>
        <h1 className="section-title mt-2 text-slate-950">북마크한 문제 모아보기</h1>
      </section>
      <BookmarksClient />
    </div>
  );
}
