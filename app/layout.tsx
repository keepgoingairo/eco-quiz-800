import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/footer";
import { HeaderFixed } from "@/components/header-fixed";

export const metadata: Metadata = {
  title: "경제금융 용어 그갓이꺼 뭐",
  description: "경제금융용어 800선 기반 학습형 퀴즈 웹앱"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <div className="min-h-screen">
          <HeaderFixed />
          <main className="pb-16">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
