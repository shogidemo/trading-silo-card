"use client";

import { motion } from "framer-motion";
import { Card } from "@/types";
import { CATEGORY_INFO } from "@/constants";
import { useModalAccessibility, useReducedMotion } from "@/hooks";
import { getCardStyles } from "@/lib";

interface CardDetailProps {
  card: Card;
  onClose: () => void;
}

export default function CardDetail({ card, onClose }: CardDetailProps) {
  const categoryInfo = CATEGORY_INFO.find((c) => c.id === card.category);
  const { modalRef, handleKeyDown } = useModalAccessibility(true, onClose);
  const prefersReducedMotion = useReducedMotion();
  const titleId = `card-detail-title-${card.id}`;
  const cardStyles = getCardStyles(card.category);

  // カテゴリに基づく背景スタイル
  const getCardBg = () => {
    switch (card.category) {
      case "silo":
        return "bg-gradient-to-b from-slate-50 to-concrete-50";
      case "grain":
        return "bg-gradient-to-b from-gold-50 to-concrete-50";
      case "trader":
        return "bg-gradient-to-b from-concrete-100 to-concrete-50";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const renderDetails = () => {
    if (card.category === "grain") {
      return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
          <motion.div variants={itemVariants}>
            <DetailItem label="主要産地" value={card.origins.join("、")} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <DetailItem label="主な用途" value={card.uses.join("、")} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <DetailItem label="栄養素" value={card.nutrients.join("、")} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <DetailItem label="世界年間生産量" value={card.annualProduction} mono />
          </motion.div>
          <motion.div variants={itemVariants}>
            <TriviaBox title="トリビア" content={card.trivia} />
          </motion.div>
        </motion.div>
      );
    }

    if (card.category === "trader") {
      return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
            <DetailItem label="設立年" value={`${card.foundedYear}年`} mono />
            <DetailItem label="本社所在地" value={card.headquarters} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <DetailItem label="主要取扱品目" value={card.mainProducts.join("、")} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <DetailItem label="グローバル展開" value={card.globalPresence.join("、")} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <TriviaBox title="特徴・強み" content={card.specialty} />
          </motion.div>
        </motion.div>
      );
    }

    if (card.category === "silo") {
      return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
          <motion.div variants={itemVariants}>
            <DetailItem label="所在地" value={card.location} />
          </motion.div>
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
            <DetailItem label="貯蔵能力" value={card.capacity} mono />
            <DetailItem label="設立年" value={`${card.establishedYear}年`} mono />
          </motion.div>
          <motion.div variants={itemVariants}>
            <DetailItem label="取扱穀物" value={card.grains.join("、")} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <DetailItem label="運営" value={card.operator} />
          </motion.div>
        </motion.div>
      );
    }

    return null;
  };

  return (
    <motion.div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onKeyDown={handleKeyDown}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={prefersReducedMotion ? { duration: 0.1 } : undefined}
      className="fixed inset-0 z-50 flex items-center justify-center bg-concrete-900/80 backdrop-blur-sm px-4"
      onClick={onClose}
      tabIndex={-1}
    >
      <motion.div
        initial={prefersReducedMotion ? { opacity: 0 } : { scale: 0.9, y: 30, opacity: 0 }}
        animate={prefersReducedMotion ? { opacity: 1 } : { scale: 1, y: 0, opacity: 1 }}
        exit={prefersReducedMotion ? { opacity: 0 } : { scale: 0.9, y: 30, opacity: 0 }}
        transition={prefersReducedMotion ? { duration: 0.1 } : { type: "spring", damping: 20 }}
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-md vintage-border rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto ${getCardBg()} ${cardStyles.glow}`}
      >
        {/* ホログラフィック効果（全カードに適用） */}
        <div className="absolute inset-0 holographic opacity-10 pointer-events-none rounded-2xl" />

        {/* ヘッダー */}
        <div className={`relative bg-gradient-to-br ${cardStyles.gradient} p-6 text-white`}>
          {/* 装飾的なストライプ */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `repeating-linear-gradient(
                -45deg,
                transparent,
                transparent 20px,
                currentColor 20px,
                currentColor 21px
              )`
            }} />
          </div>

          <div className="relative">
            <div className="flex justify-between items-start mb-4">
              <motion.span
                className="text-6xl"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.1, type: "spring" }}
              >
                {categoryInfo?.icon}
              </motion.span>
            </div>
            <motion.h2
              id={titleId}
              initial={prefersReducedMotion ? { opacity: 0 } : { x: -20, opacity: 0 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { x: 0, opacity: 1 }}
              transition={prefersReducedMotion ? { duration: 0.1 } : { delay: 0.15 }}
              className="font-display text-3xl mb-1"
            >
              {card.name}
            </motion.h2>
            <motion.p
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm opacity-80 font-display tracking-wider"
            >
              {categoryInfo?.name}カード
            </motion.p>
          </div>
        </div>

        {/* コンテンツ */}
        <div className="p-6 relative">
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-concrete-700 mb-6 leading-relaxed"
          >
            {card.description}
          </motion.p>
          {renderDetails()}
        </div>

        {/* フッター */}
        <div className="p-4 bg-concrete-100 border-t border-concrete-200">
          <motion.button
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            onClick={onClose}
            className="w-full bg-concrete-900 hover:bg-concrete-800 text-gold-400 font-display py-3.5 rounded-xl transition-all btn-bounce"
          >
            閉じる
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function DetailItem({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="bg-white/60 rounded-lg p-3 border border-concrete-200/50">
      <dt className="text-xs text-concrete-500 uppercase tracking-wider font-mono mb-1">
        {label}
      </dt>
      <dd className={`text-sm text-concrete-800 ${mono ? "font-mono" : ""}`}>
        {value}
      </dd>
    </div>
  );
}

function TriviaBox({ title, content }: { title: string; content: string }) {
  return (
    <div className="bg-gold-50 rounded-lg p-4 border border-gold-200">
      <h4 className="text-xs font-display text-gold-700 uppercase tracking-wider mb-2 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {title}
      </h4>
      <p className="text-sm text-gold-900 leading-relaxed">{content}</p>
    </div>
  );
}
