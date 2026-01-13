import type { Metadata } from "next";
import { Zen_Maru_Gothic, M_PLUS_Rounded_1c, JetBrains_Mono } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "穀物航路 | バルク船配送シミュレーション",
  description:
    "穀物商社の配船担当として、バルク船で日本各地のサイロへ穀物を届けよう！サイコロを振って航路を進み、効率的な配送を目指せ。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${zenMaru.variable} ${mPlusRounded.variable} ${jetbrains.variable} font-body antialiased min-h-screen`}
      >
        {/* 背景グラデーション */}
        <div className="fixed inset-0 -z-20 gradient-ocean" />

        <main className="relative min-h-screen">{children}</main>
      </body>
    </html>
  );
}
