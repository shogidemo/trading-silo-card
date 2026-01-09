import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { CollectionProvider } from "@/context/CollectionContext";
import Header from "@/components/Layout/Header";
import Navigation from "@/components/Layout/Navigation";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
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
        className={`${geistSans.variable} font-sans antialiased bg-wheat-50 min-h-screen`}
      >
        <CollectionProvider>
          <Header />
          <main className="pb-20">{children}</main>
          <Navigation />
        </CollectionProvider>
      </body>
    </html>
  );
}
