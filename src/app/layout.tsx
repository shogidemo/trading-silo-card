import type { Metadata } from "next";
import { Zen_Maru_Gothic, M_PLUS_Rounded_1c, JetBrains_Mono, Nunito } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import { CollectionProvider } from "@/context/CollectionContext";
import { Header, Sidebar } from "@/components/Layout";

const zenMaru = Zen_Maru_Gothic({
  subsets: ["latin"],
  weight: ["500", "700", "900"],
  variable: "--font-display",
  display: "swap",
});

const mPlusRounded = M_PLUS_Rounded_1c({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-english",
  display: "swap",
});

export const metadata: Metadata = {
  title: "穀物サイロカード | 学んで集めるカードコレクション",
  description:
    "穀物業界について楽しく学べるカードコレクションアプリ。クイズに答えてサイロ、穀物、商社のカードを集めよう！",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${zenMaru.variable} ${mPlusRounded.variable} ${jetbrains.variable} ${nunito.variable} font-body antialiased min-h-screen`}
      >
        {/* 背景グラデーションメッシュ */}
        <div className="fixed inset-0 -z-20 gradient-mesh" />
        {/* ノイズテクスチャオーバーレイ */}
        <div className="fixed inset-0 -z-10 noise-overlay pointer-events-none" />

        <CollectionProvider>
          <Sidebar />
          <div className="lg:ml-64 min-h-screen flex flex-col">
            <Header />
            <main className="relative flex-1">{children}</main>
          </div>
        </CollectionProvider>
      </body>
    </html>
  );
}
