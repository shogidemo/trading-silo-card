"use client";

import { motion } from "framer-motion";
import { Card, CATEGORY_INFO } from "@/types";

interface CardRevealProps {
  card: Card;
  onClose: () => void;
}

export default function CardReveal({ card, onClose }: CardRevealProps) {
  const categoryInfo = CATEGORY_INFO.find((c) => c.id === card.category);

  const getRarityColor = () => {
    switch (card.rarity) {
      case "legendary":
        return "from-yellow-400 via-amber-500 to-yellow-600";
      case "rare":
        return "from-purple-400 via-indigo-500 to-purple-600";
      default:
        return "from-slate-300 via-slate-400 to-slate-500";
    }
  };

  const getRarityLabel = () => {
    switch (card.rarity) {
      case "legendary":
        return "レジェンダリー";
      case "rare":
        return "レア";
      default:
        return "コモン";
    }
  };

  const getCardDetails = () => {
    if (card.category === "grain") {
      return (
        <>
          <div className="mb-3">
            <span className="text-xs text-earth-500">主要産地</span>
            <p className="text-sm text-earth-700">{card.origins.join("、")}</p>
          </div>
          <div className="mb-3">
            <span className="text-xs text-earth-500">主な用途</span>
            <p className="text-sm text-earth-700">{card.uses.slice(0, 3).join("、")}</p>
          </div>
          <div>
            <span className="text-xs text-earth-500">トリビア</span>
            <p className="text-sm text-earth-700">{card.trivia}</p>
          </div>
        </>
      );
    }

    if (card.category === "trader") {
      return (
        <>
          <div className="mb-3">
            <span className="text-xs text-earth-500">設立</span>
            <p className="text-sm text-earth-700">{card.foundedYear}年</p>
          </div>
          <div className="mb-3">
            <span className="text-xs text-earth-500">本社</span>
            <p className="text-sm text-earth-700">{card.headquarters}</p>
          </div>
          <div className="mb-3">
            <span className="text-xs text-earth-500">主要取扱品</span>
            <p className="text-sm text-earth-700">{card.mainProducts.join("、")}</p>
          </div>
          <div>
            <span className="text-xs text-earth-500">特徴</span>
            <p className="text-sm text-earth-700">{card.specialty}</p>
          </div>
        </>
      );
    }

    if (card.category === "silo") {
      return (
        <>
          <div className="mb-3">
            <span className="text-xs text-earth-500">所在地</span>
            <p className="text-sm text-earth-700">{card.location}</p>
          </div>
          <div className="mb-3">
            <span className="text-xs text-earth-500">貯蔵能力</span>
            <p className="text-sm text-earth-700">{card.capacity}</p>
          </div>
          <div className="mb-3">
            <span className="text-xs text-earth-500">取扱穀物</span>
            <p className="text-sm text-earth-700">{card.grains.join("、")}</p>
          </div>
          <div>
            <span className="text-xs text-earth-500">運営</span>
            <p className="text-sm text-earth-700">{card.operator}</p>
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.2,
        }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm"
      >
        {/* カード本体 */}
        <div className="relative">
          {/* レアリティグロー */}
          {card.rarity !== "common" && (
            <motion.div
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${getRarityColor()} blur-xl opacity-60`}
            />
          )}

          {/* カード */}
          <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* ヘッダー */}
            <div
              className={`bg-gradient-to-r ${getRarityColor()} p-4 text-white`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-4xl mb-2 block">{categoryInfo?.icon}</span>
                  <span className="text-xs opacity-80">
                    {categoryInfo?.name}
                  </span>
                </div>
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                  {getRarityLabel()}
                </span>
              </div>
            </div>

            {/* コンテンツ */}
            <div className="p-6">
              <h3 className="text-2xl font-bold text-earth-800 mb-2">
                {card.name}
              </h3>
              <p className="text-sm text-earth-600 mb-4">{card.description}</p>

              <div className="border-t border-earth-100 pt-4">
                {getCardDetails()}
              </div>
            </div>
          </div>
        </div>

        {/* 閉じるボタン */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={onClose}
          className="w-full mt-6 bg-white text-earth-700 font-bold py-4 px-6 rounded-xl shadow-lg hover:bg-earth-50 transition-colors"
        >
          閉じる
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
