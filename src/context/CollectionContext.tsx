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
import { allCards } from "@/data";

const initialCategoryStats: Record<CardCategory, CategoryStats> = {
  silo: { attempts: 0, correct: 0 },
  grain: { attempts: 0, correct: 0 },
  trader: { attempts: 0, correct: 0 },
};

const initialState: CollectionState = {
  collectedCardIds: [],
  totalQuizAttempts: 0,
  correctAnswers: 0,
  wrongAnswerQuizIds: [],
  categoryStats: initialCategoryStats,
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
  getWrongAnswerQuizIds: () => string[];
  getCategoryAccuracy: (category: CardCategory) => number;
}

const CollectionContext = createContext<CollectionContextType | undefined>(
  undefined
);

export function CollectionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CollectionState>(initialState);
  const [isInitialized, setIsInitialized] = useState(false);

  // localStorageから読み込み（マイグレーション対応）
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // 旧フォーマットからのマイグレーション
        setState({
          ...initialState,
          ...parsed,
          wrongAnswerQuizIds: parsed.wrongAnswerQuizIds ?? [],
          categoryStats: parsed.categoryStats ?? initialCategoryStats,
        });
      } catch {
        setState(initialState);
      }
    }
    setIsInitialized(true);
  }, []);

  // localStorageに保存
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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

  const getWrongAnswerQuizIds = () => {
    return state.wrongAnswerQuizIds;
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
        getWrongAnswerQuizIds,
        getCategoryAccuracy,
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
