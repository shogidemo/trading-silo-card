"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { CollectionState, CardCategory, CategoryStats } from "@/types";
import { STORAGE_KEY } from "@/constants";
import { allCards, quizzes } from "@/data";

export const initialCategoryStats: Record<CardCategory, CategoryStats> = {
  silo: { attempts: 0, correct: 0 },
  grain: { attempts: 0, correct: 0 },
  trader: { attempts: 0, correct: 0 },
};

export const initialState: CollectionState = {
  collectedCardIds: [],
  totalQuizAttempts: 0,
  correctAnswers: 0,
  wrongAnswerQuizIds: [],
  answeredQuizIds: [],
  categoryStats: initialCategoryStats,
};

const VALID_CARD_IDS = new Set(allCards.map((card) => card.id));
const VALID_QUIZ_IDS = new Set(quizzes.map((quiz) => quiz.id));

const toNonNegativeInt = (value: unknown, fallback: number) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return fallback;
  }
  return Math.max(0, Math.floor(value));
};

const toUniqueIdArray = (value: unknown, validSet: Set<string>) => {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const filtered: string[] = [];
  for (const item of value) {
    if (typeof item !== "string" || !validSet.has(item) || seen.has(item)) {
      continue;
    }
    seen.add(item);
    filtered.push(item);
  }
  return filtered;
};

const normalizeCategoryStats = (value: unknown) => {
  const record =
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};
  return (Object.keys(initialCategoryStats) as CardCategory[]).reduce(
    (acc, category) => {
      const statsValue = record[category];
      const statsRecord =
        statsValue && typeof statsValue === "object" && !Array.isArray(statsValue)
          ? (statsValue as Record<string, unknown>)
          : {};
      const attempts = toNonNegativeInt(
        statsRecord.attempts,
        initialCategoryStats[category].attempts
      );
      const correct = toNonNegativeInt(
        statsRecord.correct,
        initialCategoryStats[category].correct
      );
      const normalizedAttempts = Math.max(attempts, correct);
      acc[category] = {
        attempts: normalizedAttempts,
        correct: Math.min(correct, normalizedAttempts),
      };
      return acc;
    },
    {} as Record<CardCategory, CategoryStats>
  );
};

export const normalizeCollectionState = (
  value: unknown
): CollectionState => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return initialState;
  }

  const record = value as Record<string, unknown>;
  const collectedCardIds = toUniqueIdArray(
    record.collectedCardIds,
    VALID_CARD_IDS
  );
  const wrongAnswerQuizIds = toUniqueIdArray(
    record.wrongAnswerQuizIds,
    VALID_QUIZ_IDS
  );
  const answeredQuizIds = toUniqueIdArray(
    record.answeredQuizIds,
    VALID_QUIZ_IDS
  );
  const mergedAnswered = Array.from(
    new Set([...answeredQuizIds, ...wrongAnswerQuizIds])
  );
  const totalQuizAttempts = toNonNegativeInt(
    record.totalQuizAttempts,
    initialState.totalQuizAttempts
  );
  const correctAnswers = toNonNegativeInt(
    record.correctAnswers,
    initialState.correctAnswers
  );
  const normalizedTotalAttempts = Math.max(totalQuizAttempts, correctAnswers);

  return {
    ...initialState,
    collectedCardIds,
    totalQuizAttempts: normalizedTotalAttempts,
    correctAnswers: Math.min(correctAnswers, normalizedTotalAttempts),
    wrongAnswerQuizIds,
    answeredQuizIds: mergedAnswered,
    categoryStats: normalizeCategoryStats(record.categoryStats),
  };
};

interface CollectionContextType {
  state: CollectionState;
  addCard: (cardId: string) => void;
  hasCard: (cardId: string) => boolean;
  incrementQuizAttempts: (category: CardCategory) => void;
  incrementCorrectAnswers: (category: CardCategory) => void;
  getProgress: () => {
    total: number;
    collected: number;
    percentage: number;
  };
  getCategoryProgress: (category: CardCategory) => {
    total: number;
    collected: number;
    percentage: number;
  };
  resetCollection: () => void;
  // 復習モード用メソッド
  addWrongAnswer: (quizId: string) => void;
  removeWrongAnswer: (quizId: string) => void;
  clearWrongAnswers: () => void;
  getWrongAnswerQuizIds: () => string[];
  getCategoryAccuracy: (category: CardCategory) => number;
  addAnsweredQuiz: (quizId: string) => void;
  isQuizAnswered: (quizId: string) => boolean;
  getAnsweredQuizIds: () => string[];
}

const CollectionContext = createContext<CollectionContextType | undefined>(
  undefined
);

export function CollectionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CollectionState>(initialState);
  const [isInitialized, setIsInitialized] = useState(false);

  // localStorageから読み込み（マイグレーション対応）
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setState(normalizeCollectionState(parsed));
        } catch {
          localStorage.removeItem(STORAGE_KEY);
          setState(initialState);
        }
      }
    } catch {
      setState(initialState);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // localStorageに保存
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        // ignore storage errors to avoid breaking UI
      }
    }
  }, [state, isInitialized]);

  const addCard = (cardId: string) => {
    setState((prev) => {
      if (prev.collectedCardIds.includes(cardId)) {
        return prev;
      }
      return {
        ...prev,
        collectedCardIds: [...prev.collectedCardIds, cardId],
      };
    });
  };

  const hasCard = (cardId: string): boolean => {
    return state.collectedCardIds.includes(cardId);
  };

  const incrementQuizAttempts = (category: CardCategory) => {
    setState((prev) => ({
      ...prev,
      totalQuizAttempts: prev.totalQuizAttempts + 1,
      categoryStats: {
        ...prev.categoryStats,
        [category]: {
          ...prev.categoryStats[category],
          attempts: prev.categoryStats[category].attempts + 1,
        },
      },
    }));
  };

  const incrementCorrectAnswers = (category: CardCategory) => {
    setState((prev) => ({
      ...prev,
      correctAnswers: prev.correctAnswers + 1,
      categoryStats: {
        ...prev.categoryStats,
        [category]: {
          ...prev.categoryStats[category],
          correct: prev.categoryStats[category].correct + 1,
        },
      },
    }));
  };

  const addWrongAnswer = (quizId: string) => {
    setState((prev) => {
      if (prev.wrongAnswerQuizIds.includes(quizId)) {
        return prev;
      }
      return {
        ...prev,
        wrongAnswerQuizIds: [...prev.wrongAnswerQuizIds, quizId],
      };
    });
  };

  const removeWrongAnswer = (quizId: string) => {
    setState((prev) => ({
      ...prev,
      wrongAnswerQuizIds: prev.wrongAnswerQuizIds.filter((id) => id !== quizId),
    }));
  };

  const clearWrongAnswers = () => {
    setState((prev) => ({
      ...prev,
      wrongAnswerQuizIds: [],
    }));
  };

  const getWrongAnswerQuizIds = () => {
    return state.wrongAnswerQuizIds;
  };

  const addAnsweredQuiz = (quizId: string) => {
    setState((prev) => {
      if (prev.answeredQuizIds.includes(quizId)) {
        return prev;
      }
      return {
        ...prev,
        answeredQuizIds: [...prev.answeredQuizIds, quizId],
      };
    });
  };

  const isQuizAnswered = (quizId: string) => {
    return state.answeredQuizIds.includes(quizId);
  };

  const getAnsweredQuizIds = () => {
    return state.answeredQuizIds;
  };

  const getCategoryAccuracy = (category: CardCategory) => {
    const stats = state.categoryStats[category];
    if (stats.attempts === 0) return 0;
    return Math.round((stats.correct / stats.attempts) * 100);
  };

  const getProgress = () => {
    const total = allCards.length;
    const collected = state.collectedCardIds.length;
    const percentage = total > 0 ? Math.round((collected / total) * 100) : 0;
    return { total, collected, percentage };
  };

  const getCategoryProgress = (category: CardCategory) => {
    const categoryCards = allCards.filter((c) => c.category === category);
    const total = categoryCards.length;
    const collected = categoryCards.filter((c) =>
      state.collectedCardIds.includes(c.id)
    ).length;
    const percentage = total > 0 ? Math.round((collected / total) * 100) : 0;
    return { total, collected, percentage };
  };

  const resetCollection = () => {
    setState(initialState);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <CollectionContext.Provider
      value={{
        state,
        addCard,
        hasCard,
        incrementQuizAttempts,
        incrementCorrectAnswers,
        getProgress,
        getCategoryProgress,
        resetCollection,
        addWrongAnswer,
        removeWrongAnswer,
        clearWrongAnswers,
        getWrongAnswerQuizIds,
        getCategoryAccuracy,
        addAnsweredQuiz,
        isQuizAnswered,
        getAnsweredQuizIds,
      }}
    >
      {children}
    </CollectionContext.Provider>
  );
}

export function useCollection() {
  const context = useContext(CollectionContext);
  if (context === undefined) {
    throw new Error("useCollection must be used within a CollectionProvider");
  }
  return context;
}
