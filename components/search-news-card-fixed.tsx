import { ExternalLink } from "lucide-react";

export function SearchNewsCardFixed({
  provider,
  keyword,
  url
}: {
  provider: "google" | "naver";
  keyword: string;
  url: string;
}) {
  const isGoogle = provider === "google";

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-blue-700">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-black ${
            isGoogle ? "bg-white text-[#4285F4]" : "bg-[#03C75A] text-white"
          }`}
        >
          {isGoogle ? "G" : "N"}
        </span>
        <span>{isGoogle ? "Google" : "NAVER"}</span>
      </div>
      <h4 className="text-base font-bold text-slate-900">
        {isGoogle ? "구글에서 더 찾아보기" : "네이버에서 더 찾아보기"}
      </h4>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        {isGoogle
          ? `${keyword} 키워드로 구글 검색 결과를 열어 실제 맥락을 더 확인해 보세요.`
          : `${keyword} 키워드로 네이버 검색 결과를 열어 국내 맥락을 더 확인해 보세요.`}
      </p>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-700"
      >
        {isGoogle ? "Google 검색" : "네이버 검색"}
        <ExternalLink className="h-4 w-4" />
      </a>
    </article>
  );
}
