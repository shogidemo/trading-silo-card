import { CardCategory } from "@/types";

export interface CategoryColors {
  gradient: string;
  bg: string;
  text?: string;
  border?: string;
}

export function getCategoryColors(id: CardCategory): CategoryColors {
  const colors: Record<CardCategory, CategoryColors> = {
    silo: {
      gradient: "from-slate-600 to-slate-700",
      bg: "bg-slate-500",
      text: "text-slate-700",
      border: "border-slate-300",
    },
    grain: {
      gradient: "from-gold-500 to-gold-600",
      bg: "bg-gold-500",
      text: "text-gold-700",
      border: "border-gold-300",
    },
    trader: {
      gradient: "from-concrete-600 to-concrete-700",
      bg: "bg-concrete-600",
      text: "text-concrete-700",
      border: "border-concrete-300",
    },
  };
  return colors[id];
}

export interface CardStyles {
  glow: string;
  gradient: string;
  border: string;
  holographic: boolean;
  badge: string;
}

// カテゴリに基づく統一されたカードスタイル（全カードに豪華なエフェクトを適用）
export function getCardStyles(category: CardCategory): CardStyles {
  switch (category) {
    case "silo":
      return {
        glow: "shadow-[0_0_20px_rgba(100,116,139,0.4)]",
        gradient: "from-slate-400 via-slate-500 to-slate-600",
        border: "border-2 border-slate-400",
        holographic: true,
        badge: "bg-slate-500 text-white",
      };
    case "grain":
      return {
        glow: "shadow-[0_0_20px_rgba(212,169,55,0.4)]",
        gradient: "from-gold-400 via-gold-500 to-gold-600",
        border: "border-2 border-gold-400",
        holographic: true,
        badge: "bg-gold-500 text-gold-900",
      };
    case "trader":
      return {
        glow: "shadow-[0_0_20px_rgba(75,85,99,0.4)]",
        gradient: "from-concrete-400 via-concrete-500 to-concrete-600",
        border: "border-2 border-concrete-400",
        holographic: true,
        badge: "bg-concrete-500 text-white",
      };
  }
}
