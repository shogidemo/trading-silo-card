"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCollection } from "@/context/CollectionContext";
import { CATEGORY_INFO, CardCategory, Card } from "@/types";
import { grains } from "@/data/grains";
import { traders } from "@/data/traders";
import { silos } from "@/data/silos";
import CardDetail from "@/components/Card/CardDetail";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 100, damping: 12 },
  },
};

export default function CollectionPage() {
  const [selectedCategory, setSelectedCategory] = useState<CardCategory | "all">(
    "all"
  );
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const { hasCard, getProgress, getCategoryProgress } = useCollection();

  const allCards = useMemo(() => [...grains, ...traders, ...silos], []);

  const filteredCards = useMemo(() => {
    if (selectedCategory === "all") return allCards;
    return allCards.filter((card) => card.category === selectedCategory);
  }, [allCards, selectedCategory]);

  const progress = getProgress();

  const getCategoryColors = (id: CardCategory) => {
    const colors = {
      silo: {
        gradient: "from-slate-600 to-slate-700",
        bg: "bg-slate-500",
      },
      grain: {
        gradient: "from-gold-500 to-gold-600",
        bg: "bg-gold-500",
      },
      trader: {
        gradient: "from-concrete-600 to-concrete-700",
        bg: "bg-concrete-600",
      },
    };
    return colors[id];
  };

  const getRarityStyles = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return {
          badge: "bg-gold-500 text-gold-900",
          stars: "★★★",
          glow: "shadow-[0_0_20px_rgba(212,169,55,0.4)]",
        };
      case "rare":
        return {
          badge: "bg-harvest-500 text-white",
          stars: "★★",
          glow: "shadow-[0_0_15px_rgba(107,142,35,0.3)]",
        };
      default:
        return {
          badge: "bg-concrete-400 text-white",
          stars: "★",
          glow: "",
        };
    }
  };

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

      {/* カード一覧 - Masonry風グリッド */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
      >
        {filteredCards.map((card, index) => {
          const isCollected = hasCard(card.id);
          const categoryInfo = CATEGORY_INFO.find(
            (c) => c.id === card.category
          );
          const categoryColors = getCategoryColors(card.category);
          const rarityStyles = getRarityStyles(card.rarity);

          // ランダムな傾きを追加（収集済みのカードのみ）
          const rotation = isCollected ? (index % 3 - 1) * 1.5 : 0;

          return (
            <motion.button
              key={card.id}
              variants={itemVariants}
              onClick={() => isCollected && setSelectedCard(card)}
              disabled={!isCollected}
              className={`relative vintage-border rounded-xl overflow-hidden transition-all ${
                isCollected
                  ? `hover:shadow-xl cursor-pointer ${rarityStyles.glow}`
                  : "cursor-not-allowed opacity-60"
              }`}
              whileHover={isCollected ? { y: -8, rotate: 0, scale: 1.02 } : {}}
              style={{ rotate: rotation }}
            >
              {/* カードプレビュー */}
              <div
                className={`aspect-[3/4] p-4 flex flex-col ${
                  isCollected
                    ? "bg-gradient-to-br from-concrete-50 to-white"
                    : "bg-concrete-200"
                }`}
              >
                {isCollected ? (
                  <>
                    {/* レアリティバッジ */}
                    {card.rarity !== "common" && (
                      <div className="absolute top-2 right-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-mono ${rarityStyles.badge}`}>
                          {rarityStyles.stars}
                        </span>
                      </div>
                    )}

                    {/* ホログラフィック効果（レジェンダリー） */}
                    {card.rarity === "legendary" && (
                      <div className="absolute inset-0 holographic opacity-10 pointer-events-none" />
                    )}

                    <span className="text-4xl mb-auto">{categoryInfo?.icon}</span>
                    <div>
                      <h3 className="font-display text-concrete-900 text-sm mb-1 line-clamp-1">
                        {card.name}
                      </h3>
                      <p className="text-xs text-concrete-500 line-clamp-2 leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <span className="text-5xl mb-3 opacity-20">?</span>
                    <p className="text-xs text-concrete-400 font-mono uppercase tracking-wider">
                      未獲得
                    </p>
                  </div>
                )}
              </div>

              {/* カテゴリラベル */}
              <div
                className={`text-xs py-1.5 text-center text-white ${
                  isCollected ? categoryColors.bg : "bg-concrete-400"
                }`}
              >
                <span className="font-display tracking-wider">
                  {categoryInfo?.name}
                </span>
              </div>
            </motion.button>
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

      {/* カード詳細モーダル */}
      <AnimatePresence>
        {selectedCard && (
          <CardDetail card={selectedCard} onClose={() => setSelectedCard(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
