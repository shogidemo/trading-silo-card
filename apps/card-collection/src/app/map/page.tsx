"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib";
import { SiloMapClient, SiloListSidebar } from "@/components/Map";

export default function MapPage() {
  const [selectedSiloId, setSelectedSiloId] = useState<string | null>(null);

  return (
    <motion.div
      className="max-w-7xl mx-auto px-6 py-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: -20 }}
    >
      {/* 戻るボタン */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-concrete-500 hover:text-concrete-700 transition-colors font-display"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          ホームに戻る
        </Link>
      </motion.div>

      {/* ヘッダー */}
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="font-display text-3xl sm:text-4xl text-concrete-900 mb-2">
          サイロマップ
        </h2>
        <p className="text-concrete-600">
          日本全国のサイロの位置を確認しましょう
        </p>
      </motion.div>

      {/* 地図 + サイドバー */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-4 gap-6"
      >
        {/* サイドバー */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="h-[300px] lg:h-[600px]">
            <SiloListSidebar
              selectedId={selectedSiloId}
              onSelect={setSelectedSiloId}
            />
          </div>
        </div>

        {/* 地図 */}
        <div className="lg:col-span-3 order-1 lg:order-2 h-[400px] lg:h-[600px]">
          <div className="vintage-border rounded-2xl overflow-hidden h-full bg-concrete-100">
            <SiloMapClient
              selectedSiloId={selectedSiloId}
              onSiloSelect={setSelectedSiloId}
            />
          </div>
        </div>
      </motion.div>

      {/* 凡例 */}
      <motion.div
        variants={itemVariants}
        className="mt-6 vintage-border rounded-xl p-4 bg-concrete-50"
      >
        <div className="flex flex-wrap gap-6 justify-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full border-[3px] border-gold-400 overflow-hidden bg-slate-600 flex items-center justify-center">
              <span className="text-white text-xs">📷</span>
            </div>
            <span className="text-concrete-600">獲得済みサイロ</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-concrete-400 border-2 border-concrete-300 flex items-center justify-center opacity-70">
              <span className="text-concrete-600 font-bold text-xs">?</span>
            </div>
            <span className="text-concrete-600">未獲得サイロ</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
