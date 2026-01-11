// カードの種類
export type CardCategory = "silo" | "grain" | "trader";

// 座標
export interface Coordinates {
  lat: number;
  lng: number;
}

// 基本カード情報
export interface BaseCard {
  id: string;
  category: CardCategory;
  name: string;
  description: string;
  imageUrl?: string;
  imageAttribution?: {
    label: string;
    url?: string;
  };
}

// サイロカード
export interface SiloCard extends BaseCard {
  category: "silo";
  location: string;
  coordinates: Coordinates;
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

// カテゴリ別統計
export interface CategoryStats {
  attempts: number;
  correct: number;
}

// コレクション状態
export interface CollectionState {
  collectedCardIds: string[];
  totalQuizAttempts: number;
  correctAnswers: number;
  // 復習モード用: 誤答クイズIDリスト
  wrongAnswerQuizIds: string[];
  // 回答済みクイズIDリスト
  answeredQuizIds: string[];
  // カテゴリ別統計
  categoryStats: Record<CardCategory, CategoryStats>;
}
