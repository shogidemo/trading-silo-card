"use client";

import { useState } from "react";
import CardArtwork from "./CardArtwork";
import { motion } from "framer-motion";
import { Card } from "@/types";
import { CATEGORY_INFO } from "@/constants";
import { getCardStyles } from "@/lib";
import { useReducedMotion } from "@/hooks";

interface FlipCardProps {
  card: Card;
  isCollected: boolean;
}

export default function FlipCard({ card, isCollected }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const categoryInfo = CATEGORY_INFO.find((c) => c.id === card.category);
  const cardStyles = getCardStyles(card.category);
  const prefersReducedMotion = useReducedMotion();

  const handleFlip = () => {
    if (isCollected) {
      setIsFlipped((previous) => !previous);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isCollected && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      setIsFlipped((previous) => !previous);
    }
  };

  const getAriaLabel = () => {
    if (!isCollected) {
      return `${card.name}カード、未獲得`;
    }
    const side = isFlipped ? "裏面を表示中" : "表面を表示中";
    const action = isFlipped ? "表面を見るには" : "裏面を見るには";
    return `${card.name}カード、${side}。${action}Enterキーを押してください`;
  };

  const renderImageAttribution = () => {
    if (isFlipped) {
      return null;
    }

    const label = card.category === "trader" ? "社名テキスト" : "オリジナル図解";
    const url = "/credits";
    const content = url ? (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        referrerPolicy="no-referrer"
        className="underline decoration-white/60 underline-offset-2"
      >
        {label}
      </a>
    ) : (
      <span>{label}</span>
    );

    return (
      <div data-testid="card-image-attribution" className="absolute bottom-1 right-1 z-20 text-[9px] text-white/90 bg-black/60 px-1.5 py-0.5 rounded pointer-events-auto" style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }} onClick={(event) => event.stopPropagation()} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") event.stopPropagation(); }}>
        {content}
      </div>
    );
  };

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
      role={isCollected ? "button" : "img"}
      tabIndex={isCollected ? 0 : -1}
      aria-label={getAriaLabel()}
      aria-pressed={isCollected ? isFlipped : undefined}
      className="perspective-1000 w-full aspect-[3/4] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 rounded-xl"
      onClick={handleFlip}
      onKeyDown={handleKeyDown}
    >
      <motion.div
        className="relative w-full h-full preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { duration: 0.6, ease: "easeInOut" }
        }
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* 表面 (Front) */}
        <div
          className={`absolute inset-0 backface-hidden rounded-xl overflow-hidden vintage-border ${
            isCollected ? cardStyles.glow : ""
          }`}
          data-testid="card-front" aria-hidden={isFlipped}
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", pointerEvents: isFlipped ? "none" : "auto" }}
        >
          {isCollected ? (
            <div className="relative h-full flex flex-col bg-gradient-to-br from-concrete-100 to-white">
              {/* ヘッダー部分 */}
              <div className="px-3 py-2 bg-concrete-900">
                <span className="text-white text-[10px] font-mono uppercase tracking-wider opacity-80">
                  {categoryInfo?.nameEn}
                </span>
              </div>

              {/* メイン画像エリア */}
              <div className={`flex-1 relative overflow-hidden ${card.category === "trader" ? "bg-white flex items-center justify-center p-4" : "bg-concrete-200"}`}>
                <CardArtwork card={card} />
                {/* オーバーレイグラデーション（商社以外） */}
                {card.category !== "trader" && (
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />
                )}
                {renderImageAttribution()}
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
            isCollected ? cardStyles.glow : ""
          }`}
          data-testid="card-back" aria-hidden={!isFlipped}
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)", pointerEvents: isFlipped ? "auto" : "none" }}
        >
          {isCollected && (
            <div className="h-full flex flex-col bg-concrete-900">
              {/* ホログラフィック効果（全カードに適用） */}
              <div className="absolute inset-0 holographic opacity-10 pointer-events-none" />

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
              <div className="px-3 py-2 bg-black/30 flex items-center justify-end">
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
