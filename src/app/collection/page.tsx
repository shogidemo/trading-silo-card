"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCollection } from "@/context/CollectionContext";
import { CATEGORY_INFO, CardCategory, Card } from "@/types";
import { grains } from "@/data/grains";
import { traders } from "@/data/traders";
import { silos } from "@/data/silos";
import CardDetail from "@/components/Card/CardDetail";

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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-earth-800 mb-2">コレクション</h2>
      <p className="text-earth-600 mb-6">
        {progress.collected}/{progress.total} 枚獲得済み（{progress.percentage}%）
      </p>

      {/* フィルター */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            selectedCategory === "all"
              ? "bg-earth-700 text-white"
              : "bg-white text-earth-600 hover:bg-earth-100"
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
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                selectedCategory === category.id
                  ? "bg-earth-700 text-white"
                  : "bg-white text-earth-600 hover:bg-earth-100"
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
              <span className="text-xs opacity-70">
                ({catProgress.collected}/{catProgress.total})
              </span>
            </button>
          );
        })}
      </div>

      {/* カード一覧 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {filteredCards.map((card) => {
          const isCollected = hasCard(card.id);
          const categoryInfo = CATEGORY_INFO.find(
            (c) => c.id === card.category
          );

          return (
            <motion.button
              key={card.id}
              onClick={() => isCollected && setSelectedCard(card)}
              disabled={!isCollected}
              className={`relative rounded-xl overflow-hidden shadow-md transition-all ${
                isCollected
                  ? "hover:shadow-lg hover:scale-105 cursor-pointer"
                  : "cursor-not-allowed"
              }`}
              whileHover={isCollected ? { y: -4 } : {}}
            >
              {/* カードプレビュー */}
              <div
                className={`aspect-[3/4] p-4 flex flex-col ${
                  isCollected
                    ? "bg-gradient-to-br from-white to-earth-50"
                    : "bg-earth-200"
                }`}
              >
                {isCollected ? (
                  <>
                    {/* レアリティバッジ */}
                    {card.rarity !== "common" && (
                      <div className="absolute top-2 right-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            card.rarity === "legendary"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {card.rarity === "legendary" ? "★★★" : "★★"}
                        </span>
                      </div>
                    )}
                    <span className="text-4xl mb-auto">{categoryInfo?.icon}</span>
                    <div>
                      <h3 className="font-bold text-earth-800 text-sm mb-1 line-clamp-1">
                        {card.name}
                      </h3>
                      <p className="text-xs text-earth-500 line-clamp-2">
                        {card.description}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <span className="text-4xl mb-2 opacity-30">❓</span>
                    <p className="text-xs text-earth-400 text-center">
                      未獲得
                    </p>
                  </div>
                )}
              </div>

              {/* カテゴリラベル */}
              <div
                className={`text-xs py-1 text-center ${
                  isCollected
                    ? `bg-${categoryInfo?.color}-500 text-white`
                    : "bg-earth-300 text-earth-600"
                }`}
              >
                {categoryInfo?.name}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* カード詳細モーダル */}
      <AnimatePresence>
        {selectedCard && (
          <CardDetail card={selectedCard} onClose={() => setSelectedCard(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
