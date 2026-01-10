"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/types";
import { CATEGORY_INFO } from "@/constants";
import { getCategoryColors, getRarityStyles } from "@/lib";

interface FlipCardProps {
  card: Card;
  isCollected: boolean;
}

export default function FlipCard({ card, isCollected }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const categoryInfo = CATEGORY_INFO.find((c) => c.id === card.category);
  const categoryColors = getCategoryColors(card.category);
  const rarityStyles = getRarityStyles(card.rarity);

  const handleClick = () => {
    if (isCollected) {
      setIsFlipped(!isFlipped);
    }
  };

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

  const renderBackContent = () => {
    if (card.category === "grain") {
      return (
        <div className="space-y-2 text-xs">
          <DataRow label="主要産地" value={card.origins.join("、")} />
          <DataRow label="主な用途" value={card.uses.join("、")} />
          <DataRow label="栄養素" value={card.nutrients.join("、")} />
          <DataRow label="世界年間生産量" value={card.annualProduction} highlight />
          <div className="mt-3 p-2 bg-gold-900/30 rounded text-gold-100 text-[10px] leading-relaxed">
            <span className="font-bold">💡 </span>
            {card.trivia}
          </div>
        </div>
      );
    }

    if (card.category === "silo") {
      return (
        <div className="space-y-2 text-xs">
          <DataRow label="所在地" value={card.location} />
          <DataRow label="貯蔵能力" value={card.capacity} highlight />
          <DataRow label="設立年" value={`${card.establishedYear}年`} />
          <DataRow label="取扱穀物" value={card.grains.join("、")} />
          <DataRow label="運営" value={card.operator} />
        </div>
      );
    }

    if (card.category === "trader") {
      return (
        <div className="space-y-2 text-xs">
          <DataRow label="本社所在地" value={card.headquarters} />
          <DataRow label="設立年" value={`${card.foundedYear}年`} />
          <DataRow label="主要取扱品目" value={card.mainProducts.join("、")} />
          <DataRow label="グローバル展開" value={card.globalPresence.join("、")} />
          <div className="mt-3 p-2 bg-gold-900/30 rounded text-gold-100 text-[10px] leading-relaxed">
            <span className="font-bold">🏆 </span>
            {card.specialty}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div
      className="perspective-1000 w-full aspect-[3/4] cursor-pointer"
      onClick={handleClick}
    >
      <motion.div
        className="relative w-full h-full preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* 表面 (Front) */}
        <div
          className={`absolute inset-0 backface-hidden rounded-xl overflow-hidden vintage-border ${
            isCollected ? rarityStyles.glow : ""
          }`}
          style={{ backfaceVisibility: "hidden" }}
        >
          {isCollected ? (
            <div className="relative h-full flex flex-col bg-gradient-to-br from-concrete-100 to-white">
              {/* シマーエフェクト（収集済み） */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent z-10 pointer-events-none"
                animate={{
                  x: ['-200%', '200%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: card.rarity === 'legendary' ? 1 : card.rarity === 'rare' ? 2 : 3,
                  ease: "easeInOut"
                }}
              />
              {/* ホログラフィック効果（レジェンダリー） */}
              {card.rarity === "legendary" && (
                <div className="absolute inset-0 holographic opacity-20 pointer-events-none" />
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
              <div className={`flex-1 relative overflow-hidden ${card.category === "trader" ? "bg-white flex items-center justify-center p-4" : "bg-concrete-200"}`}>
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

              {/* フリップヒント */}
              <div className="absolute bottom-12 right-2 text-[8px] text-white/70 bg-black/30 px-1.5 py-0.5 rounded">
                タップで裏面
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-concrete-300">
              <span className="text-6xl mb-3 opacity-30">?</span>
              <p className="text-xs text-concrete-500 font-mono uppercase tracking-wider">
                未獲得
              </p>
            </div>
          )}
        </div>

        {/* 裏面 (Back) */}
        <div
          className={`absolute inset-0 backface-hidden rounded-xl overflow-hidden vintage-border ${
            isCollected ? rarityStyles.glow : ""
          }`}
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          {isCollected && (
            <div className={`h-full flex flex-col bg-gradient-to-br ${categoryColors.gradient}`}>
              {/* ホログラフィック効果（レジェンダリー） */}
              {card.rarity === "legendary" && (
                <div className="absolute inset-0 holographic opacity-10 pointer-events-none" />
              )}

              {/* ヘッダー */}
              <div className="px-3 py-2 bg-black/20">
                <div className="flex items-center justify-between">
                  <span className="text-white/80 text-[10px] font-mono uppercase tracking-wider">
                    {card.category.toUpperCase()}-DATA
                  </span>
                  <span className="text-2xl">{categoryInfo?.icon}</span>
                </div>
                <h3 className="font-display text-white text-lg mt-1">{card.name}</h3>
              </div>

              {/* データエリア */}
              <div className="flex-1 px-3 py-3 overflow-y-auto text-white">
                {renderBackContent()}
              </div>

              {/* フッター */}
              <div className="px-3 py-2 bg-black/30 flex items-center justify-between">
                <span className={`text-[8px] px-1.5 py-0.5 rounded font-mono ${rarityLabel.bg} ${rarityLabel.text}`}>
                  {rarityLabel.label}
                </span>
                <span className="text-[8px] text-white/50">タップで表面</span>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function DataRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex flex-col ${highlight ? "bg-white/10 rounded p-1.5 -mx-1" : ""}`}>
      <span className="text-[9px] text-white/60 uppercase tracking-wider font-mono">{label}</span>
      <span className={`text-white leading-tight ${highlight ? "font-mono text-sm" : ""}`}>{value}</span>
    </div>
  );
}
