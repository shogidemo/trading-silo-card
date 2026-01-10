"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Card } from "@/types";
import { CATEGORY_INFO } from "@/constants";
import { getCategoryColors, getRarityStyles } from "@/lib";

interface CardRevealProps {
  card: Card;
  onClose: () => void;
}

// パーティクルコンポーネント（穀物の粒が舞い散る演出）
function Particle({ delay, x }: { delay: number; x: number }) {
  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full bg-gold-400"
      initial={{
        x: x,
        y: 100,
        opacity: 0,
        scale: 0
      }}
      animate={{
        y: -200,
        opacity: [0, 1, 1, 0],
        scale: [0, 1, 1, 0.5],
        rotate: [0, 180, 360]
      }}
      transition={{
        duration: 2,
        delay: delay,
        ease: "easeOut"
      }}
      style={{
        background: `radial-gradient(circle, #d4a937 0%, #8b6914 100%)`
      }}
    />
  );
}

export default function CardReveal({ card, onClose }: CardRevealProps) {
  const categoryInfo = CATEGORY_INFO.find((c) => c.id === card.category);
  const categoryColors = getCategoryColors(card.category);
  const rarityStyles = getRarityStyles(card.rarity);
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    // カード出現後にパーティクル表示
    const timer = setTimeout(() => setShowParticles(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const getRarityLabel = () => {
    switch (card.rarity) {
      case "legendary":
        return { label: "LEGENDARY", bg: "bg-gold-600", text: "text-white" };
      case "rare":
        return { label: "RARE", bg: "bg-harvest-600", text: "text-white" };
      default:
        return { label: "COMMON", bg: "bg-concrete-500", text: "text-white" };
    }
  };

  const rarityLabel = getRarityLabel();

  // パーティクル配列生成
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    delay: Math.random() * 0.5,
    x: (Math.random() - 0.5) * 200
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-concrete-900/90 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      {/* 背景の放射状グロー */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div
          className={`w-96 h-96 rounded-full blur-3xl ${
            card.rarity === "legendary"
              ? "bg-gold-500/30"
              : card.rarity === "rare"
              ? "bg-harvest-500/20"
              : "bg-concrete-500/10"
          }`}
        />
      </motion.div>

      {/* パーティクル */}
      <AnimatePresence>
        {showParticles && card.rarity !== "common" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            {particles.map((p) => (
              <Particle key={p.id} delay={p.delay} x={p.x} />
            ))}
          </div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ scale: 0, rotate: -180, y: 100 }}
        animate={{ scale: 1, rotate: 0, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 15,
          delay: 0.1,
        }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xs relative"
      >
        {/* カード本体 - FlipCardと同じデザイン */}
        <div className="relative">
          {/* レアリティ外周グロー */}
          {card.rarity !== "common" && (
            <motion.div
              animate={{
                opacity: [0.4, 0.8, 0.4],
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className={`absolute -inset-1 rounded-xl bg-gradient-to-r ${rarityStyles.gradient} blur-lg`}
            />
          )}

          {/* カード */}
          <div
            className={`relative rounded-xl overflow-hidden vintage-border ${rarityStyles.glow}`}
          >
            {/* シマーエフェクト */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent z-20 pointer-events-none"
              animate={{
                x: ['-200%', '200%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
                ease: "easeInOut"
              }}
            />

            {/* ホログラフィック効果（レジェンダリー） */}
            {card.rarity === "legendary" && (
              <div className="absolute inset-0 holographic opacity-20 pointer-events-none z-10" />
            )}

            {/* ヘッダー部分 */}
            <div className={`px-3 py-2 bg-gradient-to-r ${categoryColors.gradient}`}>
              <div className="flex items-center justify-between">
                <span className="text-white text-[10px] font-mono uppercase tracking-wider opacity-80">
                  {categoryInfo?.nameEn}
                </span>
                <span className={`text-[8px] px-1.5 py-0.5 rounded font-mono ${rarityLabel.bg} ${rarityLabel.text}`}>
                  {rarityLabel.label}
                </span>
              </div>
            </div>

            {/* メイン画像エリア */}
            <div className={`aspect-[4/3] relative overflow-hidden ${card.category === "trader" ? "bg-white flex items-center justify-center p-4" : "bg-concrete-200"}`}>
              {card.imageUrl ? (
                <img
                  src={card.imageUrl}
                  alt={card.name}
                  className={`${card.category === "trader" ? "max-w-full max-h-full object-contain" : "w-full h-full object-cover"}`}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-concrete-100 to-concrete-200">
                  <span className="text-6xl">{categoryInfo?.icon}</span>
                </div>
              )}
              {/* オーバーレイグラデーション（商社以外） */}
              {card.category !== "trader" && (
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />
              )}
            </div>

            {/* カード名 */}
            <div className="px-3 py-2 bg-concrete-900 text-white">
              <h3 className="font-display text-sm truncate">{card.name}</h3>
              <p className="text-[9px] text-concrete-400 truncate">{card.description}</p>
            </div>
          </div>
        </div>

        {/* NEW!バッジ */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: -12 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
          className="absolute -top-3 -right-3 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-lg z-30"
        >
          NEW!
        </motion.div>

        {/* 閉じるボタン */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onClick={onClose}
          className="w-full mt-4 bg-concrete-800/80 hover:bg-concrete-700 text-concrete-300 font-mono text-sm py-3 px-6 rounded-xl transition-all"
        >
          タップして閉じる
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
