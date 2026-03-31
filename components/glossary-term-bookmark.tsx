"use client";

import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import { areBookmarksActive, toggleBookmarksForQuestions } from "@/lib/storage";

export function GlossaryTermBookmark({
  questionIds
}: {
  questionIds: string[];
}) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(areBookmarksActive(questionIds));
  }, [questionIds]);

  function handleToggle() {
    const next = toggleBookmarksForQuestions(questionIds);
    setActive(questionIds.every((questionId) => !!next[questionId]));
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition ${
        active ? "bg-amber-500/20 text-amber-100" : "bg-white/10 text-white"
      }`}
    >
      <Bookmark className={`h-4 w-4 ${active ? "fill-current" : ""}`} />
      {active ? "이 용어 북마크됨" : "이 용어 북마크"}
    </button>
  );
}
