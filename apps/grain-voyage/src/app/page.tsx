"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShipIcon, AnchorIcon, CargoIcon, TargetIcon } from "@/components/Icons";

// 架空商社データ（企画書より）
const companies = [
  {
    id: "momiji",
    name: "紅葉商事",
    description: "穀物集荷に強み、バランス型",
    color: "#d32f2f",
    specialty: "穀物集荷",
  },
  {
    id: "mitsuboshi",
    name: "三星物産",
    description: "ブラジル・豪州ルートにボーナス",
    color: "#1a237e",
    specialty: "遠洋航路",
  },
  {
    id: "isetada",
    name: "伊勢忠商事",
    description: "国内流通に強み",
    color: "#d32f2f",
    specialty: "国内配送",
  },
  {
    id: "global-grain",
    name: "グローバルグレイン",
    description: "大量輸送特化、燃費効率",
    color: "#00897b",
    specialty: "大量輸送",
  },
];

// ゲームモード
const gameModes = [
  {
    id: "free",
    name: "フリーモード",
    description: "自由に航路を選んで配送。サイコロを振って日本を巡ろう",
    Icon: ShipIcon,
    available: true,
  },
  {
    id: "scenario",
    name: "シナリオモード",
    description: "ストーリーを進めながら配船の基本を学ぶ",
    Icon: CargoIcon,
    available: false,
  },
  {
    id: "challenge",
    name: "チャレンジモード",
    description: "特殊条件下での配送ミッションに挑戦",
    Icon: TargetIcon,
    available: false,
  },
];

export default function Home() {
  const router = useRouter();
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [step, setStep] = useState<"title" | "company" | "mode">("title");

  const handleModeSelect = (modeId: string) => {
    if (modeId === "free" && selectedCompany) {
      router.push(`/play?company=${selectedCompany}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-cream">
      {/* タイトル画面 */}
      {step === "title" && (
        <div className="text-center">
          <div className="game-panel-gold p-8 mb-6">
            <ShipIcon size={64} className="mx-auto text-retro-navy mb-4" />
            <h1 className="font-display text-game-title md:text-4xl text-retro-navy mb-2">
              穀物航路
            </h1>
            <p className="text-game-body text-retro-navy mb-1">
              〜サイロへ届けろ！穀物配送〜
            </p>
            <p className="text-game-small text-retro-navy-lighter">
              Grain Voyage - Bulk Ship Delivery Simulation
            </p>
          </div>

          <button
            onClick={() => setStep("company")}
            className="btn-game btn-game-primary px-8 py-4 text-game-heading"
          >
            ゲームスタート
          </button>

          <div className="mt-8 game-panel p-4">
            <p className="text-game-small text-retro-navy mb-3">
              商社の配船担当として、バルク船で穀物を配送しよう
            </p>
            <Link
              href="/map"
              className="text-game-small text-retro-navy-light hover:text-retro-navy underline"
            >
              航路マップを見る →
            </Link>
          </div>
        </div>
      )}

      {/* 商社選択画面 */}
      {step === "company" && (
        <div className="w-full max-w-2xl">
          <button
            onClick={() => setStep("title")}
            className="btn-game btn-game-secondary mb-6 text-game-small"
          >
            ← 戻る
          </button>

          <div className="game-panel-gold p-4 mb-6 text-center">
            <h2 className="font-display text-game-heading text-retro-navy mb-1">
              所属商社を選択
            </h2>
            <p className="text-game-small text-retro-navy">
              あなたが配船担当として働く商社を選んでください
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {companies.map((company) => (
              <button
                key={company.id}
                onClick={() => setSelectedCompany(company.id)}
                className={`game-panel p-4 text-left transition-all ${
                  selectedCompany === company.id
                    ? "ring-4 ring-gold"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-4 h-4 rounded-full border-2 border-retro-navy"
                    style={{ backgroundColor: company.color }}
                  />
                  <h3 className="font-display text-game-body text-retro-navy">
                    {company.name}
                  </h3>
                </div>
                <p className="text-game-small text-retro-navy-lighter mb-2">
                  {company.description}
                </p>
                <span className="badge-game badge-game-seagreen text-game-small py-0.5">
                  特性: {company.specialty}
                </span>
              </button>
            ))}
          </div>

          {selectedCompany && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setStep("mode")}
                className="btn-game btn-game-gold px-8 py-3 text-game-body"
              >
                決定
              </button>
            </div>
          )}

          <p className="mt-6 text-game-small text-retro-navy-lighter text-center">
            ※ 架空の商社名です。実在する企業とは関係ありません。
          </p>
        </div>
      )}

      {/* モード選択画面 */}
      {step === "mode" && (
        <div className="w-full max-w-2xl">
          <button
            onClick={() => setStep("company")}
            className="btn-game btn-game-secondary mb-6 text-game-small"
          >
            ← 戻る
          </button>

          <div className="game-panel-gold p-4 mb-6 text-center">
            <h2 className="font-display text-game-heading text-retro-navy mb-1">
              ゲームモードを選択
            </h2>
            <p className="text-game-small text-retro-navy">
              所属:{" "}
              <span className="font-bold">
                {companies.find((c) => c.id === selectedCompany)?.name}
              </span>
            </p>
          </div>

          <div className="space-y-4">
            {gameModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => mode.available && handleModeSelect(mode.id)}
                disabled={!mode.available}
                className={`w-full game-panel p-4 flex items-center gap-4 text-left ${
                  mode.available
                    ? "hover:translate-x-1 hover:-translate-y-1 transition-transform"
                    : "opacity-50 cursor-not-allowed"
                }`}
              >
                <div className="game-panel-highlight p-3 rounded-lg">
                  <mode.Icon size={32} className="text-retro-navy" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-game-body text-retro-navy">
                    {mode.name}
                  </h3>
                  <p className="text-game-small text-retro-navy-lighter">
                    {mode.description}
                  </p>
                </div>
                {mode.available ? (
                  <span className="badge-game badge-game-seagreen text-game-small py-1">
                    プレイ可能
                  </span>
                ) : (
                  <span className="badge-game text-game-small py-1" style={{ background: "#e0e0e0", borderColor: "#9e9e9e", color: "#616161" }}>
                    Coming Soon
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="mt-6 game-panel-highlight p-4 text-center">
            <p className="text-game-small text-retro-navy">
              フリーモード以外は開発中です
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
