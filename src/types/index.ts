// カードの種類
export type CardCategory = "silo" | "grain" | "trader";

// 基本カード情報
export interface BaseCard {
  id: string;
  category: CardCategory;
  name: string;
  description: string;
  rarity: "common" | "rare" | "legendary";
  imageUrl?: string;
}

// サイロカード
export interface SiloCard extends BaseCard {
  category: "silo";
  location: string;
  capacity: string;
  grains: string[];
  establishedYear: number;
  operator: string;
}

// 穀物カード
export interface GrainCard extends BaseCard {
  category: "grain";
  origins: string[];
  uses: string[];
  nutrients: string[];
  annualProduction: string;
  trivia: string;
}

// 商社カード
export interface TraderCard extends BaseCard {
  category: "trader";
  foundedYear: number;
  headquarters: string;
  mainProducts: string[];
  globalPresence: string[];
  specialty: string;
}

// すべてのカード型のユニオン
export type Card = SiloCard | GrainCard | TraderCard;

// クイズの選択肢
export interface QuizOption {
  text: string;
  isCorrect: boolean;
}

// クイズ問題
export interface Quiz {
  id: string;
  cardId: string;
  category: CardCategory;
  question: string;
  options: QuizOption[];
  explanation: string;
}

// コレクション状態
export interface CollectionState {
  collectedCardIds: string[];
  totalQuizAttempts: number;
  correctAnswers: number;
}

// カテゴリ表示情報
export interface CategoryInfo {
  id: CardCategory;
  name: string;
  nameEn: string;
  description: string;
  icon: string;
  color: string;
}

export const CATEGORY_INFO: CategoryInfo[] = [
  {
    id: "silo",
    name: "サイロ",
    nameEn: "Silo",
    description: "穀物を貯蔵する巨大な施設",
    icon: "🏭",
    color: "silo",
  },
  {
    id: "grain",
    name: "穀物",
    nameEn: "Grain",
    description: "世界を支える農産物",
    icon: "🌾",
    color: "wheat",
  },
  {
    id: "trader",
    name: "商社",
    nameEn: "Trader",
    description: "穀物を世界中に届ける企業",
    icon: "🏢",
    color: "earth",
  },
];
