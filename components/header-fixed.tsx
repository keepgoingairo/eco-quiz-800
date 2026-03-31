import Link from "next/link";

const links = [
  { href: "/", label: "홈" },
  { href: "/quiz", label: "퀴즈" },
  { href: "/mistakes", label: "오답노트" },
  { href: "/bookmarks", label: "북마크" },
  { href: "/glossary", label: "용어사전" },
  { href: "/dashboard", label: "통계" }
];

export function HeaderFixed() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/50 bg-white/75 backdrop-blur-xl">
      <div className="shell flex items-center justify-between gap-6 px-1 py-4">
        <Link href="/" className="text-lg font-black tracking-[-0.05em] text-slate-950 md:text-2xl">
          <span>경제금융 용어 </span>
          <span className="text-blue-600">그갓이꺼 뭐</span>
        </Link>
        <nav className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
