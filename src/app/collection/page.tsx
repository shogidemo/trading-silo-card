"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useCollection } from "@/context/CollectionContext";
import { CardCategory } from "@/types";
import { CATEGORY_INFO } from "@/constants";
import { allCards } from "@/data";
import { containerVariants, itemVariants, getCategoryColors } from "@/lib";
import FlipCard from "@/components/Card/FlipCard";

export default function CollectionPage() {
  const [selectedCategory, setSelectedCategory] = useState<CardCategory | "all">(
    "all"
  );
  const { hasCard, getProgress, getCategoryProgress } = useCollection();

  const filteredCards = useMemo(() => {
    if (selectedCategory === "all") return allCards;
    return allCards.filter((card) => card.category === selectedCategory);
  }, [selectedCategory]);

  const progress = getProgress();

  return (
    <motion.div
      className="max-w-5xl mx-auto px-6 py-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ヘッダー */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-end justify-between mb-2">
          <h2 className="font-display text-3xl sm:text-4xl text-concrete-900">
            コレクション
          </h2>
          <div className="text-right">
            <p className="font-mono text-2xl text-gold-600">
              {progress.collected}
              <span className="text-concrete-400 mx-1">/</span>
              {progress.total}
            </p>
            <p className="text-xs text-concrete-500 uppercase tracking-wider">
              cards collected
            </p>
          </div>
        </div>

        {/* 全体プログレスバー */}
        <div className="relative">
          <div className="h-2 bg-concrete-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-harvest-400 via-gold-500 to-gold-400 progress-bar"
              initial={{ width: 0 }}
              animate={{ width: `${progress.percentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <span className="absolute right-0 top-3 font-mono text-xs text-concrete-500">
            {progress.percentage}%
          </span>
        </div>
      </motion.div>

      {/* フィルター */}
      <motion.div variants={itemVariants} className="flex gap-2 mb-8 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-5 py-2.5 rounded-full text-sm font-display whitespace-nowrap transition-all btn-bounce ${
            selectedCategory === "all"
              ? "bg-concrete-900 text-gold-400 shadow-lg"
              : "bg-white text-concrete-600 hover:bg-concrete-100 vintage-border"
          }`}
        >
          すべて
        </button>
        {CATEGORY_INFO.map((category) => {
          const catProgress = getCategoryProgress(category.id);
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2.5 rounded-full text-sm font-display whitespace-nowrap transition-all btn-bounce flex items-center gap-2 ${
                selectedCategory === category.id
                  ? "bg-concrete-900 text-gold-400 shadow-lg"
                  : "bg-white text-concrete-600 hover:bg-concrete-100 vintage-border"
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
              <span className="font-mono text-xs opacity-70">
                {catProgress.collected}/{catProgress.total}
              </span>
            </button>
          );
        })}
      </motion.div>

      {/* カード一覧 - ダムカード風グリッド */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
      >
        {filteredCards.map((card) => {
          const isCollected = hasCard(card.id);

          return (
            <motion.div
              key={card.id}
              variants={itemVariants}
              whileHover={isCollected ? { y: -4, scale: 1.02 } : {}}
            >
              <FlipCard card={card} isCollected={isCollected} />
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
