"use client";

import { motion } from "framer-motion";
import { Card, CATEGORY_INFO } from "@/types";

interface CardDetailProps {
  card: Card;
  onClose: () => void;
}

export default function CardDetail({ card, onClose }: CardDetailProps) {
  const categoryInfo = CATEGORY_INFO.find((c) => c.id === card.category);

  const getRarityStyles = () => {
    switch (card.rarity) {
      case "legendary":
        return {
          gradient: "from-amber-400 to-yellow-500",
          label: "レジェンダリー",
          badge: "bg-amber-100 text-amber-700",
        };
      case "rare":
        return {
          gradient: "from-purple-400 to-indigo-500",
          label: "レア",
          badge: "bg-purple-100 text-purple-700",
        };
      default:
        return {
          gradient: "from-slate-400 to-slate-500",
          label: "コモン",
          badge: "bg-slate-100 text-slate-700",
        };
    }
  };

  const rarityStyles = getRarityStyles();

  const renderDetails = () => {
    if (card.category === "grain") {
      return (
        <div className="space-y-4">
          <DetailItem label="主要産地" value={card.origins.join("、")} />
          <DetailItem label="主な用途" value={card.uses.join("、")} />
          <DetailItem label="栄養素" value={card.nutrients.join("、")} />
          <DetailItem label="世界年間生産量" value={card.annualProduction} />
          <div className="bg-wheat-50 rounded-lg p-4">
            <h4 className="text-sm font-bold text-wheat-700 mb-2">トリビア</h4>
            <p className="text-sm text-earth-700">{card.trivia}</p>
          </div>
        </div>
      );
    }

    if (card.category === "trader") {
      return (
        <div className="space-y-4">
          <DetailItem label="設立年" value={`${card.foundedYear}年`} />
          <DetailItem label="本社所在地" value={card.headquarters} />
          <DetailItem label="主要取扱品目" value={card.mainProducts.join("、")} />
          <DetailItem label="グローバル展開" value={card.globalPresence.join("、")} />
          <div className="bg-earth-50 rounded-lg p-4">
            <h4 className="text-sm font-bold text-earth-700 mb-2">特徴・強み</h4>
            <p className="text-sm text-earth-700">{card.specialty}</p>
          </div>
        </div>
      );
    }

    if (card.category === "silo") {
      return (
        <div className="space-y-4">
          <DetailItem label="所在地" value={card.location} />
          <DetailItem label="貯蔵能力" value={card.capacity} />
          <DetailItem label="取扱穀物" value={card.grains.join("、")} />
          <DetailItem label="設立年" value={`${card.establishedYear}年`} />
          <DetailItem label="運営" value={card.operator} />
        </div>
      );
    }

    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        {/* ヘッダー */}
        <div className={`bg-gradient-to-r ${rarityStyles.gradient} p-6 text-white`}>
          <div className="flex justify-between items-start mb-4">
            <span className="text-5xl">{categoryInfo?.icon}</span>
            <span className={`text-xs px-3 py-1 rounded-full ${rarityStyles.badge}`}>
              {rarityStyles.label}
            </span>
          </div>
          <h2 className="text-2xl font-bold mb-1">{card.name}</h2>
          <p className="text-sm opacity-90">{categoryInfo?.name}カード</p>
        </div>

        {/* コンテンツ */}
        <div className="p-6">
          <p className="text-earth-600 mb-6">{card.description}</p>
          {renderDetails()}
        </div>

        {/* フッター */}
        <div className="p-4 bg-earth-50 border-t border-earth-100">
          <button
            onClick={onClose}
            className="w-full bg-earth-700 hover:bg-earth-800 text-white font-medium py-3 rounded-xl transition-colors"
          >
            閉じる
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-earth-500 mb-1">{label}</dt>
      <dd className="text-sm text-earth-800">{value}</dd>
    </div>
  );
}
