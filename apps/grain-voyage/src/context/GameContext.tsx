"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
} from "react";
import { ports, routes, getConnectedPorts, getRouteBetween } from "@/data";

// ========================================
// 型定義
// ========================================

interface PlayerState {
  companyId: string;
  currentPortId: string;
  fuel: number;
  maxFuel: number;
  money: number;
}

interface GameState {
  phase: "idle" | "rolling" | "selecting_destination" | "moving" | "arrived";
  turn: number;
  maxTurns: number;
  player: PlayerState;
  lastDiceValue: number | null;
  remainingMoves: number;
  moveHistory: string[]; // 訪問した港のID履歴
}

type GameAction =
  | { type: "START_GAME"; companyId: string; startPortId: string }
  | { type: "ROLL_DICE"; value: number }
  | { type: "SELECT_DESTINATION"; portId: string }
  | { type: "COMPLETE_MOVE" }
  | { type: "END_TURN" }
  | { type: "RESET_GAME" };

// ========================================
// 初期状態
// ========================================

const initialState: GameState = {
  phase: "idle",
  turn: 0,
  maxTurns: 30,
  player: {
    companyId: "",
    currentPortId: "",
    fuel: 100,
    maxFuel: 100,
    money: 10000,
  },
  lastDiceValue: null,
  remainingMoves: 0,
  moveHistory: [],
};

// ========================================
// Reducer
// ========================================

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME":
      return {
        ...initialState,
        phase: "idle",
        turn: 1,
        player: {
          ...initialState.player,
          companyId: action.companyId,
          currentPortId: action.startPortId,
        },
        moveHistory: [action.startPortId],
      };

    case "ROLL_DICE":
      return {
        ...state,
        phase: "selecting_destination",
        lastDiceValue: action.value,
        remainingMoves: action.value,
      };

    case "SELECT_DESTINATION": {
      const route = getRouteBetween(state.player.currentPortId, action.portId);
      if (!route) return state;

      const newRemainingMoves = state.remainingMoves - route.distance;
      if (newRemainingMoves < 0) return state;

      // 燃料消費
      const fuelCost = route.distance * 5;
      const newFuel = Math.max(0, state.player.fuel - fuelCost);

      return {
        ...state,
        phase: newRemainingMoves > 0 ? "selecting_destination" : "arrived",
        player: {
          ...state.player,
          currentPortId: action.portId,
          fuel: newFuel,
        },
        remainingMoves: newRemainingMoves,
        moveHistory: [...state.moveHistory, action.portId],
      };
    }

    case "COMPLETE_MOVE":
      return {
        ...state,
        phase: "arrived",
        remainingMoves: 0,
      };

    case "END_TURN":
      return {
        ...state,
        phase: "idle",
        turn: state.turn + 1,
        lastDiceValue: null,
        remainingMoves: 0,
      };

    case "RESET_GAME":
      return initialState;

    default:
      return state;
  }
}

// ========================================
// Context
// ========================================

interface GameContextValue {
  state: GameState;
  // アクション
  startGame: (companyId: string, startPortId: string) => void;
  rollDice: (value: number) => void;
  selectDestination: (portId: string) => void;
  completeMove: () => void;
  endTurn: () => void;
  resetGame: () => void;
  // ヘルパー
  getReachablePorts: () => { portId: string; distance: number }[];
  canMoveTo: (portId: string) => boolean;
  getCurrentPort: () => (typeof ports)[0] | undefined;
}

const GameContext = createContext<GameContextValue | null>(null);

// ========================================
// Provider
// ========================================

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const startGame = useCallback((companyId: string, startPortId: string) => {
    dispatch({ type: "START_GAME", companyId, startPortId });
  }, []);

  const rollDice = useCallback((value: number) => {
    dispatch({ type: "ROLL_DICE", value });
  }, []);

  const selectDestination = useCallback((portId: string) => {
    dispatch({ type: "SELECT_DESTINATION", portId });
  }, []);

  const completeMove = useCallback(() => {
    dispatch({ type: "COMPLETE_MOVE" });
  }, []);

  const endTurn = useCallback(() => {
    dispatch({ type: "END_TURN" });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: "RESET_GAME" });
  }, []);

  // 現在位置から到達可能な港を取得
  const getReachablePorts = useCallback(() => {
    if (!state.player.currentPortId || state.remainingMoves <= 0) {
      return [];
    }

    const connectedPortIds = getConnectedPorts(state.player.currentPortId);
    const reachable: { portId: string; distance: number }[] = [];

    for (const portId of connectedPortIds) {
      const route = getRouteBetween(state.player.currentPortId, portId);
      if (route && route.distance <= state.remainingMoves) {
        reachable.push({ portId, distance: route.distance });
      }
    }

    return reachable;
  }, [state.player.currentPortId, state.remainingMoves]);

  // 指定した港に移動可能かチェック
  const canMoveTo = useCallback(
    (portId: string) => {
      const reachable = getReachablePorts();
      return reachable.some((r) => r.portId === portId);
    },
    [getReachablePorts]
  );

  // 現在の港を取得
  const getCurrentPort = useCallback(() => {
    return ports.find((p) => p.id === state.player.currentPortId);
  }, [state.player.currentPortId]);

  const value: GameContextValue = {
    state,
    startGame,
    rollDice,
    selectDestination,
    completeMove,
    endTurn,
    resetGame,
    getReachablePorts,
    canMoveTo,
    getCurrentPort,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

// ========================================
// Hook
// ========================================

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
