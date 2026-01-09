"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Card, CATEGORY_INFO } from "@/types";

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
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    // カード出現後にパーティクル表示
    const timer = setTimeout(() => setShowParticles(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const getRarityStyles = () => {
    switch (card.rarity) {
      case "legendary":
        return {
          gradient: "from-gold-400 via-gold-500 to-gold-600",
          glow: "shadow-[0_0_60px_rgba(212,169,55,0.6)]",
          border: "border-2 border-gold-400",
          label: "レジェンダリー",
          labelBg: "bg-gold-900/80 text-gold-300",
          holographic: true,
        };
      case "rare":
        return {
          gradient: "from-harvest-400 via-harvest-500 to-harvest-600",
          glow: "shadow-[0_0_40px_rgba(107,142,35,0.5)]",
          border: "border-2 border-harvest-400",
          label: "レア",
          labelBg: "bg-harvest-800/80 text-harvest-200",
          holographic: false,
        };
      default:
        return {
          gradient: "from-concrete-400 via-concrete-500 to-concrete-600",
          glow: "",
          border: "border border-concrete-300",
          label: "コモン",
          labelBg: "bg-concrete-700/80 text-concrete-200",
          holographic: false,
        };
    }
  };

  const rarityStyles = getRarityStyles();

  const getCardDetails = () => {
    if (card.category === "grain") {
      return (
        <>
          <DetailRow label="主要産地" value={card.origins.join("、")} />
          <DetailRow label="主な用途" value={card.uses.slice(0, 3).join("、")} />
          <DetailRow label="トリビア" value={card.trivia} highlight />
        </>
      );
    }

    if (card.category === "trader") {
      return (
        <>
          <DetailRow label="設立" value={`${card.foundedYear}年`} />
          <DetailRow label="本社" value={card.headquarters} />
          <DetailRow label="主要取扱品" value={card.mainProducts.join("、")} />
          <DetailRow label="特徴" value={card.specialty} highlight />
        </>
      );
    }

    if (card.category === "silo") {
      return (
        <>
          <DetailRow label="所在地" value={card.location} />
          <DetailRow label="貯蔵能力" value={card.capacity} />
          <DetailRow label="取扱穀物" value={card.grains.join("、")} />
          <DetailRow label="運営" value={card.operator} />
        </>
      );
    }

    return null;
  };

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
        className="w-full max-w-sm relative"
      >
        {/* カード本体 */}
        <div className="relative card-3d">
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
              className={`absolute -inset-1 rounded-3xl bg-gradient-to-r ${rarityStyles.gradient} blur-lg`}
            />
          )}

          {/* カード */}
          <div
            className={`relative vintage-border rounded-2xl overflow-hidden bg-concrete-50 ${rarityStyles.glow}`}
          >
            {/* ホログラフィック効果（レジェンダリー） */}
            {rarityStyles.holographic && (
              <div className="absolute inset-0 holographic opacity-20 pointer-events-none" />
            )}

            {/* ヘッダー */}
            <div className={`relative bg-gradient-to-br ${rarityStyles.gradient} p-5`}>
              {/* 装飾パターン */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 10px,
                    currentColor 10px,
                    currentColor 11px
                  )`
                }} />
              </div>

              <div className="relative flex justify-between items-start">
                <div>
                  <motion.span
                    className="text-5xl block mb-2"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.4, type: "spring" }}
                  >
                    {categoryInfo?.icon}
                  </motion.span>
                  <span className="font-display text-xs text-white/80 uppercase tracking-wider">
                    {categoryInfo?.nameEn}
                  </span>
                </div>
                <motion.span
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className={`text-xs px-3 py-1.5 rounded-full font-mono ${rarityStyles.labelBg}`}
                >
                  {rarityStyles.label}
                </motion.span>
              </div>
            </div>

            {/* コンテンツ */}
            <div className="p-6">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="font-display text-3xl text-concrete-900 mb-2">
                  {card.name}
                </h3>
                <p className="text-sm text-concrete-600 mb-5 leading-relaxed">
                  {card.description}
                </p>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="border-t border-concrete-200 pt-4 space-y-3"
              >
                {getCardDetails()}
              </motion.div>
            </div>

            {/* 下部装飾 */}
            <div className="h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
          </div>
        </div>

        {/* 閉じるボタン */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onClick={onClose}
          className="w-full mt-6 bg-concrete-900 hover:bg-concrete-800 text-gold-400 font-display text-lg py-4 px-6 rounded-xl shadow-lg transition-all btn-bounce"
        >
          コレクションに追加
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

function DetailRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={highlight ? "bg-gold-50 -mx-2 px-2 py-2 rounded-lg" : ""}>
      <dt className="text-xs text-concrete-500 uppercase tracking-wider font-mono mb-0.5">
        {label}
      </dt>
      <dd className={`text-sm ${highlight ? "text-gold-800" : "text-concrete-700"}`}>
        {value}
      </dd>
    </div>
  );
}
