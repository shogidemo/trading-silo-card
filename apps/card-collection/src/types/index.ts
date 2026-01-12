// Re-export shared types
export type {
  CardCategory,
  Coordinates,
  BaseCard,
  SiloCard,
  GrainCard,
  TraderCard,
  Card,
} from "@trading-silo/shared";

// App-specific types

// クイズの選択肢
export interface QuizOption {
  text: string;
  isCorrect: boolean;
}

export interface QuizSource {
  title: string;
  url: string;
}

// クイズ問題
export interface Quiz {
  id: string;
  cardId: string;
  category: "silo" | "grain" | "trader";
  question: string;
  options: QuizOption[];
  explanation: string;
  sources: QuizSource[];
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
  categoryStats: Record<"silo" | "grain" | "trader", CategoryStats>;
}
