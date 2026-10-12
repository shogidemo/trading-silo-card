import type { Metadata } from "next";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import { CollectionProvider } from "@/context/CollectionContext";
import { Header, Footer } from "@/components/Layout";
import AtlasNavigation from "@/components/Layout/AtlasNavigation";
import { UiNavigationMemory } from "@/hooks/useTransientState";

export const metadata: Metadata = {
  title: "港のアトラス | 穀物サイロカード",
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
        className="font-body antialiased min-h-screen"
      >
        <CollectionProvider>
          <UiNavigationMemory />
          <div className="atlas-shell min-h-screen flex flex-col">
            <Header />
            <main className="relative flex-1">{children}</main>
            <Footer />
            <AtlasNavigation />
          </div>
        </CollectionProvider>
      </body>
    </html>
  );
}
