import type { Metadata } from "next";
import { Playfair_Display, Source_Serif_4, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CollectionProvider } from "@/context/CollectionContext";
import Header from "@/components/Layout/Header";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
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
        className={`${playfair.variable} ${sourceSerif.variable} ${jetbrains.variable} font-body antialiased min-h-screen`}
      >
        {/* 背景グラデーションメッシュ */}
        <div className="fixed inset-0 -z-20 gradient-mesh" />
        {/* ノイズテクスチャオーバーレイ */}
        <div className="fixed inset-0 -z-10 noise-overlay pointer-events-none" />

        <CollectionProvider>
          <Header />
          <main className="relative">{children}</main>
        </CollectionProvider>
      </body>
    </html>
  );
}
