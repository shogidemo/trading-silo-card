"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useCollection } from "@/context/CollectionContext";

export default function Header() {
  const { getProgress } = useCollection();
  const progress = getProgress();

  // 円形プログレスバーの計算
  const circumference = 2 * Math.PI * 18; // r=18
  const strokeDashoffset = circumference - (progress.percentage / 100) * circumference;

  return (
    <header className="relative bg-concrete-900 text-concrete-50 overflow-hidden">
      {/* 装飾的な背景パターン */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 40px,
            currentColor 40px,
            currentColor 41px
          )`
        }} />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-5 relative">
        <div className="flex items-center justify-between">
          {/* ロゴ（モバイルのみ表示、ハンバーガーメニュー用のスペース確保） */}
          <Link href="/" className="group flex items-center gap-4 lg:hidden pl-12">
            <motion.div
              className="relative w-12 h-12 flex items-center justify-center"
              whileHover={{ rotate: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* サイロ形状のアイコン */}
              <svg viewBox="0 0 48 48" className="w-full h-full">
                <defs>
                  <linearGradient id="siloGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#d4a937" />
                    <stop offset="100%" stopColor="#8b6914" />
                  </linearGradient>
                </defs>
                {/* サイロ本体 */}
                <rect x="12" y="16" width="24" height="28" rx="2" fill="url(#siloGradient)" />
                {/* サイロの屋根 */}
                <path d="M10 16 L24 4 L38 16 Z" fill="#b8860b" />
                {/* 窓 */}
                <rect x="20" y="22" width="8" height="6" rx="1" fill="#3d2e06" opacity="0.3" />
                <rect x="20" y="32" width="8" height="6" rx="1" fill="#3d2e06" opacity="0.3" />
              </svg>
            </motion.div>

            <div>
              <h1 className="font-display text-2xl tracking-tight text-gold-400 group-hover:text-gold-300 transition-colors">
                穀物サイロカード
              </h1>
              <p className="text-xs text-concrete-400 tracking-wider uppercase font-english">
                Grain Silo Collection
              </p>
            </div>
          </Link>

          {/* プログレス表示 */}
          <div className="flex items-center gap-6">
            <div className="hidden sm:block text-right">
              <p className="text-xs text-concrete-400 uppercase tracking-wider font-english">
                Collection
              </p>
              <p className="font-mono text-lg text-gold-400">
                {progress.collected}
                <span className="text-concrete-500 mx-1">/</span>
                {progress.total}
              </p>
            </div>

            {/* 円形プログレス */}
            <motion.div
              className="relative w-14 h-14"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <svg className="w-full h-full transform -rotate-90">
                {/* 背景円 */}
                <circle
                  cx="28"
                  cy="28"
                  r="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-concrete-700"
                />
                {/* プログレス円 */}
                <motion.circle
                  cx="28"
                  cy="28"
                  r="18"
                  fill="none"
                  stroke="url(#progressGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6b8e23" />
                    <stop offset="100%" stopColor="#b8860b" />
                  </linearGradient>
                </defs>
              </svg>
              {/* パーセンテージ */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono text-sm font-bold text-gold-400">
                  {progress.percentage}%
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 下部の装飾ライン */}
      <div className="h-1 bg-gradient-to-r from-gold-600 via-gold-400 to-harvest-400" />
    </header>
  );
}
