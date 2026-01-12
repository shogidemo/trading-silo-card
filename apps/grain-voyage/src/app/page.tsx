"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

// 架空商社データ（企画書より）
const companies = [
  {
    id: "momiji",
    name: "紅葉商事",
    description: "穀物集荷に強み、バランス型",
    color: "#dc2626",
    specialty: "穀物集荷",
  },
  {
    id: "mitsuboshi",
    name: "三星物産",
    description: "ブラジル・豪州ルートにボーナス",
    color: "#2563eb",
    specialty: "遠洋航路",
  },
  {
    id: "isetada",
    name: "伊勢忠商事",
    description: "国内流通に強み",
    color: "#dc2626",
    specialty: "国内配送",
  },
  {
    id: "global-grain",
    name: "グローバルグレイン",
    description: "大量輸送特化、燃費効率",
    color: "#059669",
    specialty: "大量輸送",
  },
];

// ゲームモード
const gameModes = [
  {
    id: "scenario",
    name: "シナリオモード",
    description: "ストーリーを進めながら配船の基本を学ぶ",
    icon: "📖",
    available: false,
  },
  {
    id: "free",
    name: "フリーモード",
    description: "自由に航路を選んで配送、ハイスコアを目指す",
    icon: "🚢",
    available: false,
  },
  {
    id: "challenge",
    name: "チャレンジモード",
    description: "特殊条件下での配送ミッションに挑戦",
    icon: "🏆",
    available: false,
  },
];

export default function Home() {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [step, setStep] = useState<"title" | "company" | "mode">("title");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      {/* タイトル画面 */}
      {step === "title" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="text-6xl mb-6"
          >
            🚢
          </motion.div>

          <h1 className="font-display text-4xl md:text-5xl text-navy-900 mb-4">
            穀物航路
          </h1>
          <p className="text-lg text-navy-600 mb-2">
            〜サイロへ届けろ！穀物配送〜
          </p>
          <p className="text-sm text-navy-500 mb-8">
            Grain Voyage - Bulk Ship Delivery Simulation
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setStep("company")}
            className="px-8 py-4 bg-ocean-600 text-white rounded-xl font-display text-lg shadow-lg hover:bg-ocean-700 transition-colors"
          >
            ゲームスタート
          </motion.button>

          <div className="mt-12 text-sm text-navy-400">
            <p>商社の配船担当として、バルク船で穀物を配送しよう</p>
          </div>
        </motion.div>
      )}

      {/* 商社選択画面 */}
      {step === "company" && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-2xl"
        >
          <button
            onClick={() => setStep("title")}
            className="mb-6 text-navy-500 hover:text-navy-700 flex items-center gap-2"
          >
            ← 戻る
          </button>

          <h2 className="font-display text-2xl text-navy-900 mb-2 text-center">
            所属商社を選択
          </h2>
          <p className="text-navy-600 mb-8 text-center">
            あなたが配船担当として働く商社を選んでください
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {companies.map((company) => (
              <motion.button
                key={company.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCompany(company.id)}
                className={`p-6 rounded-xl text-left transition-all ${
                  selectedCompany === company.id
                    ? "bg-ocean-100 border-2 border-ocean-500 shadow-lg"
                    : "bg-white border-2 border-transparent shadow hover:shadow-md"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: company.color }}
                  />
                  <h3 className="font-display text-lg text-navy-900">
                    {company.name}
                  </h3>
                </div>
                <p className="text-sm text-navy-600 mb-2">{company.description}</p>
                <span className="inline-block px-2 py-1 bg-navy-100 text-navy-700 text-xs rounded">
                  特性: {company.specialty}
                </span>
              </motion.button>
            ))}
          </div>

          {selectedCompany && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 text-center"
            >
              <button
                onClick={() => setStep("mode")}
                className="px-8 py-3 bg-ocean-600 text-white rounded-xl font-display shadow-lg hover:bg-ocean-700 transition-colors"
              >
                決定
              </button>
            </motion.div>
          )}

          <p className="mt-6 text-xs text-navy-400 text-center">
            ※ 架空の商社名です。実在する企業とは関係ありません。
          </p>
        </motion.div>
      )}

      {/* モード選択画面 */}
      {step === "mode" && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-2xl"
        >
          <button
            onClick={() => setStep("company")}
            className="mb-6 text-navy-500 hover:text-navy-700 flex items-center gap-2"
          >
            ← 戻る
          </button>

          <h2 className="font-display text-2xl text-navy-900 mb-2 text-center">
            ゲームモードを選択
          </h2>
          <p className="text-navy-600 mb-8 text-center">
            所属:{" "}
            <span className="font-bold">
              {companies.find((c) => c.id === selectedCompany)?.name}
            </span>
          </p>

          <div className="space-y-4">
            {gameModes.map((mode) => (
              <motion.div
                key={mode.id}
                whileHover={mode.available ? { scale: 1.01 } : {}}
                className={`p-6 rounded-xl flex items-center gap-4 ${
                  mode.available
                    ? "bg-white shadow hover:shadow-md cursor-pointer"
                    : "bg-navy-50 opacity-60 cursor-not-allowed"
                }`}
              >
                <div className="text-4xl">{mode.icon}</div>
                <div className="flex-1">
                  <h3 className="font-display text-lg text-navy-900">
                    {mode.name}
                  </h3>
                  <p className="text-sm text-navy-600">{mode.description}</p>
                </div>
                {!mode.available && (
                  <span className="px-3 py-1 bg-navy-200 text-navy-600 text-sm rounded-full">
                    Coming Soon
                  </span>
                )}
              </motion.div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-ocean-50 rounded-xl border border-ocean-200">
            <h3 className="font-display text-lg text-navy-900 mb-2">
              🚧 開発中
            </h3>
            <p className="text-sm text-navy-600">
              このゲームは現在開発中です。
              シナリオモードから順次実装予定です。
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
