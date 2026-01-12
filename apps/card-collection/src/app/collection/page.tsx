"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCollection } from "@/context/CollectionContext";
import { CATEGORY_INFO } from "@/constants";
import { CardCategory } from "@/types";
import { allCards } from "@/data";
import { containerVariants, itemVariants, getCategoryColors } from "@/lib";
import { FlipCard } from "@/components/Card";

export default function CollectionPage() {
  const [selectedCategory, setSelectedCategory] = useState<
    CardCategory | "all"
  >("all");
  const { hasCard, getProgress, getCategoryProgress } = useCollection();

  const filteredCards = useMemo(() => {
    if (selectedCategory === "all") return allCards;
    return allCards.filter((card) => card.category === selectedCategory);
  }, [selectedCategory]);

  const progress = getProgress();

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
        <div className="flex items-end justify-between mb-4">
          <h2 className="font-display text-3xl sm:text-4xl text-concrete-900">
            コレクション
          </h2>
          <div className="text-right">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-gold-400 to-harvest-400 rounded-2xl blur-lg opacity-30" />
              <div className="relative bg-gradient-to-r from-gold-500 to-harvest-500 text-white px-5 py-2 rounded-2xl shadow-lg">
                <p className="font-mono text-2xl font-bold">
                  {progress.collected}
                  <span className="text-white/70 mx-1">/</span>
                  {progress.total}
                </p>
                <p className="text-xs opacity-90 uppercase tracking-wider">
                  cards collected
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="h-3 bg-concrete-200 rounded-full overflow-hidden shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-harvest-400 via-gold-500 to-gold-400 progress-bar"
              initial={{ width: 0 }}
              animate={{ width: `${progress.percentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <span className="absolute right-0 top-4 font-mono text-sm font-bold text-gold-600">
            {progress.percentage}%
          </span>
        </div>
      </motion.div>

      {/* フィルター */}
      <motion.div
        variants={itemVariants}
        className="flex gap-3 mb-10 overflow-x-auto pb-2"
      >
        <motion.button
          onClick={() => setSelectedCategory("all")}
          className={`px-6 py-3 rounded-2xl text-sm font-display whitespace-nowrap transition-all shadow-md ${
            selectedCategory === "all"
              ? "bg-gradient-to-r from-gold-500 to-gold-600 text-white"
              : "bg-white text-concrete-600 hover:bg-concrete-50 border-2 border-concrete-200 hover:border-gold-300"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          すべて
          <span className="ml-2 font-mono text-xs opacity-80">
            {progress.collected}/{progress.total}
          </span>
        </motion.button>
        {CATEGORY_INFO.map((category) => {
          const catProgress = getCategoryProgress(category.id);
          const isActive = selectedCategory === category.id;
          const colors = getCategoryColors(category.id);
          return (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-5 py-3 rounded-2xl text-sm font-display whitespace-nowrap transition-all shadow-md flex items-center gap-2 ${
                isActive
                  ? `bg-gradient-to-r ${colors.gradient} text-white`
                  : "bg-white text-concrete-600 hover:bg-concrete-50 border-2 border-concrete-200 hover:border-gold-300"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-lg">{category.icon}</span>
              <span>{category.name}</span>
              <span
                className={`font-mono text-xs px-2 py-0.5 rounded-full ${
                  isActive ? "bg-white/20" : "bg-concrete-100"
                }`}
              >
                {catProgress.collected}/{catProgress.total}
              </span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* カード一覧 */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5"
      >
        {filteredCards.map((card) => {
          const isCollected = hasCard(card.id);

          return (
            <motion.div
              key={card.id}
              variants={itemVariants}
              whileHover={isCollected ? { y: -8, scale: 1.03, rotateY: 3 } : {}}
              style={{ transformStyle: "preserve-3d" }}
            >
              {isCollected ? (
                <FlipCard card={card} isCollected={isCollected} />
              ) : (
                <Link
                  href={`/quiz?cardId=${card.id}`}
                  className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 rounded-xl"
                  aria-label={`${card.name}のクイズに挑戦する`}
                >
                  <div className="relative">
                    <FlipCard card={card} isCollected={isCollected} />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none" />
                    <div className="absolute inset-x-3 bottom-3 text-xs font-display text-white bg-black/50 px-2 py-1 rounded-full opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100 pointer-events-none">
                      クイズに挑戦
                    </div>
                  </div>
                </Link>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* 空状態 */}
      {filteredCards.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <span className="text-6xl block mb-4 opacity-30">📦</span>
          <p className="text-concrete-500 font-display">
            このカテゴリにはカードがありません
          </p>
        </motion.div>
      )}

      {/* コレクション統計 */}
      <motion.div
        variants={itemVariants}
        className="mt-12 vintage-border rounded-2xl p-6 bg-concrete-50"
      >
        <h3 className="font-display text-xl text-concrete-800 mb-4">
          コレクション統計
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {CATEGORY_INFO.map((category) => {
            const catProgress = getCategoryProgress(category.id);
            const colors = getCategoryColors(category.id);
            return (
              <div key={category.id} className="text-center">
                <span className="text-3xl block mb-2">{category.icon}</span>
                <p className="font-mono text-lg text-concrete-700">
                  {catProgress.collected}/{catProgress.total}
                </p>
                <div className="mt-2 h-1 bg-concrete-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${colors.gradient}`}
                    style={{ width: `${catProgress.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-concrete-500 mt-1 uppercase tracking-wider">
                  {category.nameEn}
                </p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
