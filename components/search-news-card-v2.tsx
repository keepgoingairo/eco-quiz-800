import { ExternalLink } from "lucide-react";

export function SearchNewsCardV2({
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
        {isGoogle ? "구글에서 연관 개념 보기" : "네이버에서 연관 개념 보기"}
      </h4>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        첨부 자료의 연관검색어인 <strong className="text-slate-900">{keyword}</strong> 기준으로 실제 기사와 해설을
        더 찾아볼 수 있어요.
      </p>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-700"
      >
        {isGoogle ? "Google 검색" : "NAVER 검색"}
        <ExternalLink className="h-4 w-4" />
      </a>
    </article>
  );
}
