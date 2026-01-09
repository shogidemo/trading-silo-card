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

export interface RarityStyles {
  badge: string;
  stars: string;
  glow: string;
  gradient?: string;
  border?: string;
  label?: string;
  labelBg?: string;
  holographic?: boolean;
}

export function getRarityStyles(rarity: string): RarityStyles {
  switch (rarity) {
    case "legendary":
      return {
        badge: "bg-gold-500 text-gold-900",
        stars: "★★★",
        glow: "shadow-[0_0_20px_rgba(212,169,55,0.4)]",
        gradient: "from-gold-400 via-gold-500 to-gold-600",
        border: "border-2 border-gold-400",
        label: "レジェンダリー",
        labelBg: "bg-gold-900/80 text-gold-300",
        holographic: true,
      };
    case "rare":
      return {
        badge: "bg-harvest-500 text-white",
        stars: "★★",
        glow: "shadow-[0_0_15px_rgba(107,142,35,0.3)]",
        gradient: "from-harvest-400 via-harvest-500 to-harvest-600",
        border: "border-2 border-harvest-400",
        label: "レア",
        labelBg: "bg-harvest-800/80 text-harvest-200",
        holographic: false,
      };
    default:
      return {
        badge: "bg-concrete-400 text-white",
        stars: "★",
        glow: "",
        gradient: "from-concrete-400 via-concrete-500 to-concrete-600",
        border: "border border-concrete-300",
        label: "コモン",
        labelBg: "bg-concrete-700/80 text-concrete-200",
        holographic: false,
      };
  }
}
