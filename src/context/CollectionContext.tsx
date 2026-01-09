"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { CollectionState, CardCategory } from "@/types";
import { grains } from "@/data/grains";
import { traders } from "@/data/traders";
import { silos } from "@/data/silos";

const STORAGE_KEY = "silo-card-collection";

const initialState: CollectionState = {
  collectedCardIds: [],
  totalQuizAttempts: 0,
  correctAnswers: 0,
};

interface CollectionContextType {
  state: CollectionState;
  addCard: (cardId: string) => void;
  hasCard: (cardId: string) => boolean;
  incrementQuizAttempts: () => void;
  incrementCorrectAnswers: () => void;
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
}

const CollectionContext = createContext<CollectionContextType | undefined>(
  undefined
);

export function CollectionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CollectionState>(initialState);
  const [isInitialized, setIsInitialized] = useState(false);

  // localStorageから読み込み
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setState(JSON.parse(stored));
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

  const incrementQuizAttempts = () => {
    setState((prev) => ({
      ...prev,
      totalQuizAttempts: prev.totalQuizAttempts + 1,
    }));
  };

  const incrementCorrectAnswers = () => {
    setState((prev) => ({
      ...prev,
      correctAnswers: prev.correctAnswers + 1,
    }));
  };

  const getAllCards = () => [...grains, ...traders, ...silos];

  const getProgress = () => {
    const allCards = getAllCards();
    const total = allCards.length;
    const collected = state.collectedCardIds.length;
    const percentage = total > 0 ? Math.round((collected / total) * 100) : 0;
    return { total, collected, percentage };
  };

  const getCategoryProgress = (category: CardCategory) => {
    const categoryCards = getAllCards().filter((c) => c.category === category);
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
